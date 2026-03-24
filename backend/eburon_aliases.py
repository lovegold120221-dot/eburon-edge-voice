"""Shared Eburon alias registry and backend translation helpers."""

from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Iterable

from fastapi import HTTPException, Request

logger = logging.getLogger(__name__)

MODEL_PROVIDER = "eburon-edge-voice"
DEFAULT_ALIAS_ID = "eburon-athena"
VISIBLE_STATUSES = {"enabled", "beta"}
TRANSCRIPTION_MODEL_SIZES = {"base", "small", "medium", "large", "turbo"}


@dataclass(frozen=True)
class AliasEntry:
    alias_id: str
    public_name: str
    description: str
    upstream_engine: str
    upstream_model_name: str
    model_size: str | None
    languages: tuple[str, ...]
    voice_cloning_supported: bool
    status: str
    capabilities: tuple[str, ...]
    rollout_wave: int


def _registry_path() -> Path:
    return Path(__file__).resolve().parent.parent / "app" / "src" / "lib" / "constants" / "modelAliases.json"


@lru_cache(maxsize=1)
def _registry_entries() -> tuple[AliasEntry, ...]:
    with _registry_path().open("r", encoding="utf-8") as handle:
        raw_entries = json.load(handle)

    return tuple(
        AliasEntry(
            alias_id=entry["alias_id"],
            public_name=entry["public_name"],
            description=entry["description"],
            upstream_engine=entry["upstream_engine"],
            upstream_model_name=entry["upstream_model_name"],
            model_size=entry.get("model_size"),
            languages=tuple(entry.get("languages", [])),
            voice_cloning_supported=bool(entry.get("voice_cloning_supported", False)),
            status=entry["status"],
            capabilities=tuple(entry.get("capabilities", [])),
            rollout_wave=int(entry.get("rollout_wave", 0)),
        )
        for entry in raw_entries
    )


@lru_cache(maxsize=1)
def _registry_map() -> dict[str, AliasEntry]:
    return {entry.alias_id: entry for entry in _registry_entries()}


@lru_cache(maxsize=1)
def _registry_by_upstream_model() -> dict[str, AliasEntry]:
    return {entry.upstream_model_name: entry for entry in _registry_entries()}


def get_registry_entries(include_disabled: bool = False) -> list[AliasEntry]:
    entries = list(_registry_entries())
    if include_disabled:
        return entries
    return [entry for entry in entries if entry.status in VISIBLE_STATUSES]


def get_alias_entry(alias_id: str | None) -> AliasEntry | None:
    if not alias_id:
        return None
    return _registry_map().get(alias_id)


def get_alias_entry_by_upstream_model(model_name: str | None) -> AliasEntry | None:
    if not model_name:
        return None
    return _registry_by_upstream_model().get(model_name)


def _beta_models_enabled() -> bool:
    return os.environ.get("EBURON_ENABLE_BETA_MODELS", "").strip().lower() in {"1", "true", "yes", "on"}


def is_visible_alias(entry: AliasEntry) -> bool:
    return entry.status in VISIBLE_STATUSES


def alias_supports_capability(entry: AliasEntry, capability: str) -> bool:
    return capability in entry.capabilities


def is_active_alias(entry: AliasEntry) -> bool:
    if entry.status == "enabled":
        return True
    if entry.status == "beta":
        return _beta_models_enabled()
    return False


def get_default_alias_id() -> str:
    return DEFAULT_ALIAS_ID


def _first_entry_for_engine(engine: str, *, require_active: bool = False) -> AliasEntry | None:
    candidates = [entry for entry in _registry_entries() if entry.upstream_engine == engine and is_visible_alias(entry)]
    if require_active:
        candidates = [entry for entry in candidates if is_active_alias(entry)]
    if not candidates:
        return None
    candidates.sort(key=lambda entry: (0 if entry.status == "enabled" else 1, entry.rollout_wave, entry.alias_id))
    return candidates[0]


def get_alias_for_legacy_engine(engine: str | None, model_size: str | None = None) -> AliasEntry | None:
    if not engine:
        return None

    entry = get_alias_entry(engine)
    if entry:
        return entry

    if engine == "qwen":
        return get_alias_entry_by_upstream_model(f"qwen-tts-{model_size or '1.7B'}")
    if engine == "luxtts":
        return get_alias_entry_by_upstream_model("luxtts")
    if engine == "chatterbox":
        return get_alias_entry_by_upstream_model("chatterbox-tts")
    if engine == "chatterbox_turbo":
        return get_alias_entry_by_upstream_model("chatterbox-turbo")
    if engine == "tada":
        model_name = "tada-3b-ml" if model_size == "3B" else "tada-1b"
        return get_alias_entry_by_upstream_model(model_name)
    if engine == "whisper":
        return get_alias_entry_by_upstream_model(f"whisper-{model_size or 'turbo'}")
    return None


def get_transcription_alias(value: str | None) -> AliasEntry | None:
    if not value:
        return None

    entry = get_alias_entry(value)
    if entry and alias_supports_capability(entry, "transcription"):
        return entry

    entry = get_alias_entry_by_upstream_model(value)
    if entry and alias_supports_capability(entry, "transcription"):
        return entry

    if value in TRANSCRIPTION_MODEL_SIZES:
        entry = get_alias_entry_by_upstream_model(f"whisper-{value}")
        if entry and alias_supports_capability(entry, "transcription"):
            return entry

    return None


def resolve_transcription_alias_or_raise(value: str | None) -> AliasEntry:
    entry = get_transcription_alias(value)
    if not entry:
        valid_aliases = ", ".join(
            alias.alias_id
            for alias in _registry_entries()
            if alias_supports_capability(alias, "transcription") and is_visible_alias(alias)
        )
        raise HTTPException(
            status_code=400,
            detail=(
                f"Unknown transcription model '{value}'. "
                f"Use one of the allowlisted aliases: {valid_aliases}"
            ),
        )
    return resolve_public_alias_or_raise(entry.alias_id, action="transcription")


def get_alias_for_generation(engine: str | None, model_size: str | None = None) -> AliasEntry | None:
    if not engine:
        return None
    entry = get_alias_for_legacy_engine(engine, model_size)
    if entry:
        return entry
    return _first_entry_for_engine(engine)


def normalize_stored_profile_alias(value: str | None) -> str | None:
    if not value:
        return None
    entry = get_alias_entry(value)
    if entry and is_visible_alias(entry):
        return entry.alias_id

    legacy_entry = get_alias_for_legacy_engine(value)
    if legacy_entry and is_visible_alias(legacy_entry):
        return legacy_entry.alias_id
    return None


def resolve_upstream_engine(value: str | None) -> str | None:
    if not value:
        return None
    entry = get_alias_entry(value)
    if entry:
        return entry.upstream_engine

    legacy_entry = get_alias_for_legacy_engine(value)
    if legacy_entry:
        return legacy_entry.upstream_engine
    return value


def resolve_public_alias_or_raise(alias_id: str | None, *, action: str) -> AliasEntry:
    entry = get_alias_entry(alias_id or DEFAULT_ALIAS_ID)
    if not entry or not is_visible_alias(entry):
        raise HTTPException(status_code=403, detail=f"Model '{alias_id}' is not allowlisted for Eburon Edge Voice")
    if not is_active_alias(entry):
        raise HTTPException(status_code=403, detail=f"Model '{entry.alias_id}' is not enabled in this deployment")
    return entry


def resolve_requested_alias_or_raise(
    *,
    requested_alias: str | None,
    legacy_engine: str | None = None,
    legacy_model_size: str | None = None,
    fallback_alias: str | None = None,
    action: str,
) -> AliasEntry:
    entry = get_alias_entry(requested_alias)
    if not entry and requested_alias:
        entry = get_alias_for_legacy_engine(requested_alias, legacy_model_size)
    if not entry and legacy_engine:
        entry = get_alias_for_legacy_engine(legacy_engine, legacy_model_size)
    if not entry and fallback_alias:
        entry = get_alias_entry(fallback_alias) or get_alias_for_legacy_engine(fallback_alias)
    if not entry:
        entry = get_alias_entry(DEFAULT_ALIAS_ID)
    return resolve_public_alias_or_raise(entry.alias_id if entry else None, action=action)


def alias_public_payload(entry: AliasEntry) -> dict:
    return {
        "model_name": entry.alias_id,
        "display_name": entry.public_name,
        "description": entry.description,
        "languages": list(entry.languages),
        "voice_cloning_supported": entry.voice_cloning_supported,
        "status": entry.status,
        "provider": MODEL_PROVIDER,
        "capabilities": list(entry.capabilities),
    }


def log_policy_decision(
    *,
    requested_alias: str | None,
    entry: AliasEntry | None,
    decision: str,
    request: Request | None = None,
    reason: str | None = None,
) -> None:
    caller = "unknown"
    if request and request.client:
        caller = request.client.host or "unknown"

    logger.info(
        "eburon_model_policy requested_alias=%s resolved_upstream_engine=%s resolved_upstream_model=%s tenant=%s caller=%s decision=%s reason=%s",
        requested_alias or DEFAULT_ALIAS_ID,
        entry.upstream_engine if entry else None,
        entry.upstream_model_name if entry else None,
        "local",
        caller,
        decision,
        reason,
    )


def translate_active_download_keys(model_names: Iterable[str]) -> dict[str, AliasEntry]:
    translated: dict[str, AliasEntry] = {}
    for raw_name in model_names:
        entry = get_alias_entry_by_upstream_model(raw_name)
        if entry and is_visible_alias(entry):
            translated[raw_name] = entry
    return translated
