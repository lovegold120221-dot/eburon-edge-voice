from datetime import datetime
from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from backend.eburon_aliases import (
    get_alias_for_generation,
    get_transcription_alias,
    normalize_stored_profile_alias,
    resolve_public_alias_or_raise,
    resolve_requested_alias_or_raise,
)
from backend.services.history import _serialize_generation_response


def test_qwen_generation_maps_to_athena():
    alias = get_alias_for_generation("qwen", "1.7B")
    assert alias is not None
    assert alias.alias_id == "eburon-athena"


def test_legacy_profile_engine_normalizes_to_alias():
    assert normalize_stored_profile_alias("qwen") == "eburon-athena"
    assert normalize_stored_profile_alias("luxtts") == "eburon-hestia"


def test_transcription_aliases_cover_whisper_sizes():
    assert get_transcription_alias("medium").alias_id == "eburon-orbit-medium"
    assert get_transcription_alias("whisper-turbo").alias_id == "eburon-orbit-turbo"


def test_beta_alias_is_blocked_without_flag(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.delenv("EBURON_ENABLE_BETA_MODELS", raising=False)

    with pytest.raises(HTTPException) as exc_info:
        resolve_public_alias_or_raise("eburon-iris", action="generate")

    assert exc_info.value.status_code == 403


def test_beta_alias_can_be_enabled(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("EBURON_ENABLE_BETA_MODELS", "1")

    alias = resolve_requested_alias_or_raise(
        requested_alias="eburon-iris",
        action="generate",
    )

    assert alias.alias_id == "eburon-iris"


def test_generation_serializer_returns_public_alias_only():
    generation = SimpleNamespace(
        id="gen-1",
        profile_id="profile-1",
        text="hello world",
        language="en",
        audio_path="/tmp/test.wav",
        duration=1.25,
        seed=123,
        instruct=None,
        engine="chatterbox_turbo",
        model_size=None,
        status="completed",
        error=None,
        is_favorited=False,
        created_at=datetime.utcnow(),
    )

    response = _serialize_generation_response(generation)

    assert response.engine == "eburon-nike"
    assert response.provider == "eburon-edge-voice"
    assert "expressive" in response.capabilities
    assert response.model_size is None
