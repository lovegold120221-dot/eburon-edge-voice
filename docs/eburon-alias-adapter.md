# Eburon Edge Voice Alias Adapter

## Intent

Eburon Edge Voice exposes a strict allowlist of product-facing model aliases while preserving Voicebox's canonical engine and model identifiers internally.

Adapter boundary:

`Eburon alias -> allowlist policy -> alias translation -> Voicebox engine/model`

## Canonical Inventory

| Alias | Upstream engine | Upstream model | Status |
| --- | --- | --- | --- |
| `eburon-athena` | `qwen` | `qwen-tts-1.7B` | enabled |
| `eburon-iris` | `qwen` | `qwen-tts-0.6B` | beta |
| `eburon-hestia` | `luxtts` | `luxtts` | enabled |
| `eburon-hera` | `chatterbox` | `chatterbox-tts` | enabled |
| `eburon-nike` | `chatterbox_turbo` | `chatterbox-turbo` | enabled |
| `eburon-artemis` | `tada` | `tada-1b` | beta |
| `eburon-gaia` | `tada` | `tada-3b-ml` | beta |

## Translation Rules

- Frontend selectors and model-management screens use alias IDs only.
- Backend generation, download, and load paths resolve aliases to upstream engine/model pairs.
- Generation history persists canonical upstream engine/model fields in the database.
- Profile defaults are stored as public alias IDs so operator intent survives export/import without guessing.

## Blocked Surfaces

- Raw upstream engine names are not listed in `/models/status`, task payloads, generation responses, or profile responses.
- Non-allowlisted upstream models such as Kokoro and Whisper are hidden from the Eburon model-management surface.
- Beta aliases remain visible but are blocked for activation unless `EBURON_ENABLE_BETA_MODELS=1`.

## Rollout Stages

1. Stage A: alias-only read path for model inventory and UI labels.
2. Stage B: generation path resolves aliases end-to-end.
3. Stage C: model download, unload, delete, and task views enforce the same allowlist.

## Test Plan

- Alias IDs resolve to the expected upstream model config.
- Non-allowlisted or disabled aliases return a policy error.
- `/models/status` returns aliases only.
- Generation responses and profile responses do not leak raw model names.

## Rollback

- Revert the alias registry and translation helpers.
- Re-enable direct registry enumeration in backend model routes.
- Restore frontend engine constants and raw model status filtering.
