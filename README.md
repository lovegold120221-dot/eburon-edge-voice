<h1 align="center">Eburon Edge Voice</h1>

<p align="center">
  <strong>Sovereign Vocal Synthesis. Unleashed locally.</strong><br/>
  Clone identities. Orchestrate narratives. Apply studio-grade DSP.<br/>
  All executing entirely on your own hardware.
</p>

<p align="center">
  <a href="https://github.com/lovegold120221-dot/eburon-edge-voice/releases">
    <img src="https://img.shields.io/github/downloads/lovegold120221-dot/eburon-edge-voice/total?style=flat&color=BFA181" alt="Downloads" />
  </a>
  <a href="https://github.com/lovegold120221-dot/eburon-edge-voice/releases/latest">
    <img src="https://img.shields.io/github/v/release/lovegold120221-dot/eburon-edge-voice?style=flat&color=BFA181" alt="Release" />
  </a>
  <a href="https://github.com/lovegold120221-dot/eburon-edge-voice/stargazers">
    <img src="https://img.shields.io/github/stars/lovegold120221-dot/eburon-edge-voice?style=flat&color=BFA181" alt="Stars" />
  </a>
  <a href="https://github.com/lovegold120221-dot/eburon-edge-voice/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/lovegold120221-dot/eburon-edge-voice?style=flat&color=BFA181" alt="License" />
  </a>
</p>

<p align="center">
  <a href="https://eburon.ai">eburon.ai</a> •
  <a href="https://docs.eburon.ai">Documentation</a> •
  <a href="#download">Runtime</a> •
  <a href="#the-pantheon">Engines</a> •
  <a href="#api">API</a>
</p>

<br/>

## What is Eburon Edge Voice?

Eburon Edge is a **local-first voice cloning studio** — a premium, open-source alternative to ElevenLabs. It enables the replication of vocal identities from mere seconds of audio, generating high-fidelity speech across 23 languages using our unique **Goddess-tier Pantheon engines**. 

Designed for creative professionals, researchers, and developers, it features a nonlinear DAW-style timeline for complex narrative production and an autonomous CSR Agent for real-time conversational AI.

### Core Philosophy
- **Total Sovereignty** — Biometric voice data and neural weights stay on your machine.
- **The Pantheon** — 7 specialized engines optimized for distinct vocal tasks.
- **Expressive Synthesis** — Native paralinguistic tag support (`[laugh]`, `[sigh]`, `[gasp]`).
- **Pedalboard DSP** — Studio-grade effects (Pitch, Reverb, Compression) via Spotify’s Pedalboard.
- **Hardware Agnostic** — Native performance on Apple Metal, NVIDIA CUDA, and AMD ROCm.

---

## The Pantheon: Engine Registry

Choose the optimal neural architecture for your sequence. All models execute locally via VRAM.

| Engine | Architecture | Strengths |
| :--- | :--- | :--- |
| **Eburon Athena** | 1.7B Params | High-fidelity cloning with delivery instructions ("whisper", "shout"). |
| **Eburon Iris** | 0.6B Params | Efficient, low-VRAM footprint for rapid iteration on consumer GPUs. |
| **Eburon Hestia** | English | Optimized for speed; reaching 150x realtime performance on CPU. |
| **Eburon Hera** | 23 Langs | Broadest linguistic coverage including Arabic, Hindi, Swahili, and Hebrew. |
| **Eburon Nike** | Expressive | Native support for paralinguistic markers and emotional inflection. |
| **Eburon Artemis** | 1B Params | High-precision text-acoustic alignment for cinematic storytelling. |
| **Eburon Gaia** | 3B Params | Extended coherence for long-form synthesis (Audiobooks/Manuscripts). |

### Paralinguistic Markers
When using **Eburon Nike**, insert expressive tags directly into the manuscript:
`[laugh]` `[chuckle]` `[gasp]` `[cough]` `[sigh]` `[groan]` `[sniff]` `[shush]` `[clear throat]`

---

## Workspace Modules

### 1. Synthesis Studio
A pro-grade editor featuring a "Smart Manuscript" interface. Type your text, inject Goddess-tier emotion tags, and render versions with millisecond latency.

### 2. Stories Editor (Nonlinear DAW)
Orchestrate multi-voice projects. Drag-and-drop synthesized clips onto a multi-track timeline, apply crossfades, and trim audio segments with architectural precision.

### 3. Autonomous CSR Agent
A real-time conversational console. Deploy Sarah or Narrator Alpha as an autonomous agent with sub-100ms latency, adjustable empathy coefficients, and live sentiment mapping.

### 4. Pedalboard DSP
Apply 8 studio-grade effects powered by Spotify's `pedalboard` library. Build reusable signal chain presets for consistent vocal branding.

---

## Technical Stack

- **Studio App:** Tauri (Rust)
- **Interface:** React, TypeScript, Tailwind CSS (Obsidian/Bronze Theme)
- **API Backend:** FastAPI (Python)
- **Transcription:** Eburon Orbit (Whisper-based)
- **Inference:** MLX (Apple Silicon) / PyTorch (CUDA/ROCm/DirectML)

---

## API & Integration

Eburon Edge Voice exposes a local REST API for studio automation and third-party integration.

```bash
# Initialize Synthesis
curl -X POST http://localhost:17493/generate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The future of vocal synthesis is sovereign. [sigh]",
    "engine": "nike",
    "profile_id": "ep_001",
    "params": {
      "reverb": 0.15,
      "pitch_shift": -2
    }
  }'
Download
Platform	Runtime	Backend
macOS	Download DMG	Apple Silicon (MLX)
Windows	Download MSI	NVIDIA CUDA / DirectML
Linux	docker compose up	ROCm / CPU
Development
Quick Start
code
Bash
download
content_copy
expand_less
git clone https://github.com/lovegold120221-dot/eburon-edge-voice.git
cd eburon-edge-voice

just setup   # Initializes Python venv and dependencies
just dev     # Starts the Backend Daemon and the Studio UI
License

MIT License — see LICENSE for details.
