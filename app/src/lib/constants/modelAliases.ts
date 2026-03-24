import registry from './modelAliases.json';

export type AliasStatus = 'enabled' | 'beta' | 'disabled';

export interface ModelAliasEntry {
  alias_id: string;
  public_name: string;
  description: string;
  upstream_engine: string;
  upstream_model_name: string;
  model_size: string | null;
  languages: string[];
  voice_cloning_supported: boolean;
  status: AliasStatus;
  capabilities: string[];
  rollout_wave: number;
}

export const MODEL_PROVIDER = 'eburon-edge-voice';
export const DEFAULT_MODEL_ALIAS = 'eburon-athena';

export const MODEL_ALIASES = registry as ModelAliasEntry[];

const MODEL_ALIAS_MAP = new Map(MODEL_ALIASES.map((entry) => [entry.alias_id, entry]));
const MODEL_ALIAS_BY_UPSTREAM = new Map(
  MODEL_ALIASES.map((entry) => [entry.upstream_model_name, entry]),
);
const WHISPER_SIZE_TO_ALIAS = new Map<string, string>([
  ['base', 'eburon-orbit-base'],
  ['small', 'eburon-orbit-small'],
  ['medium', 'eburon-orbit-medium'],
  ['large', 'eburon-orbit-large'],
  ['turbo', 'eburon-orbit-turbo'],
]);

const LEGACY_SELECTION_TO_ALIAS = new Map<string, string>([
  ['qwen:1.7B', 'eburon-athena'],
  ['qwen:0.6B', 'eburon-iris'],
  ['luxtts', 'eburon-hestia'],
  ['chatterbox', 'eburon-hera'],
  ['chatterbox_turbo', 'eburon-nike'],
  ['tada:1B', 'eburon-artemis'],
  ['tada:3B', 'eburon-gaia'],
  ['whisper:base', 'eburon-orbit-base'],
  ['whisper:small', 'eburon-orbit-small'],
  ['whisper:medium', 'eburon-orbit-medium'],
  ['whisper:large', 'eburon-orbit-large'],
  ['whisper:turbo', 'eburon-orbit-turbo'],
]);

function supportsCapability(entry: ModelAliasEntry, capability?: string) {
  return !capability || entry.capabilities.includes(capability);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const CHANGELOG_MODEL_TEXT_REPLACEMENTS = new Map<string, string>([
  ['Whisper model selection (`base`, `small`, `medium`, `large`, `turbo`)', 'Eburon Orbit model selection (`Eburon Orbit Base`, `Eburon Orbit Small`, `Eburon Orbit Medium`, `Eburon Orbit Large`, `Eburon Orbit Turbo`)'],
  ['HumeAI TADA 3B Multilingual', 'Eburon Gaia'],
  ['TADA 3B Multilingual', 'Eburon Gaia'],
  ['HumeAI TADA 1B', 'Eburon Artemis'],
  ['Whisper Large v3 Turbo', 'Eburon Orbit Turbo'],
  ['Qwen3-TTS 1.7B', 'Eburon Athena'],
  ['Qwen3-TTS 0.6B', 'Eburon Iris'],
  ['Qwen TTS 1.7B', 'Eburon Athena'],
  ['Qwen TTS 0.6B', 'Eburon Iris'],
  ['Chatterbox Multilingual', 'Eburon Hera'],
  ['Chatterbox Turbo', 'Eburon Nike'],
  ['Whisper Turbo', 'Eburon Orbit Turbo'],
  ['Whisper Large', 'Eburon Orbit Large'],
  ['Whisper Medium', 'Eburon Orbit Medium'],
  ['Whisper Small', 'Eburon Orbit Small'],
  ['Whisper Base', 'Eburon Orbit Base'],
  ['openai/whisper-large-v3-turbo', 'Eburon Orbit Turbo'],
  ['openai/whisper-large-v3', 'Eburon Orbit Large'],
  ['openai/whisper-medium', 'Eburon Orbit Medium'],
  ['openai/whisper-small', 'Eburon Orbit Small'],
  ['openai/whisper-base', 'Eburon Orbit Base'],
  ['TADA 3B', 'Eburon Gaia'],
  ['TADA 1B', 'Eburon Artemis'],
  ['Qwen3-TTS', 'Eburon Athena / Eburon Iris'],
  ['LuxTTS', 'Eburon Hestia'],
  ['Chatterbox', 'Eburon Hera'],
  ['TADA', 'Eburon Artemis / Eburon Gaia'],
  ['Whisper', 'Eburon Orbit'],
]);

for (const entry of MODEL_ALIASES) {
  CHANGELOG_MODEL_TEXT_REPLACEMENTS.set(entry.upstream_model_name, entry.public_name);
}

const CHANGELOG_MODEL_REPLACERS = Array.from(CHANGELOG_MODEL_TEXT_REPLACEMENTS.entries())
  .sort((a, b) => b[0].length - a[0].length)
  .map(([from, to]) => ({
    pattern: new RegExp(escapeRegExp(from), 'g'),
    to,
  }));

export function getModelAlias(
  modelOrEngine?: string | null,
  modelSize?: string | null,
): ModelAliasEntry | undefined {
  if (!modelOrEngine) return MODEL_ALIAS_MAP.get(DEFAULT_MODEL_ALIAS);

  if (MODEL_ALIAS_MAP.has(modelOrEngine)) {
    return MODEL_ALIAS_MAP.get(modelOrEngine);
  }

  if (MODEL_ALIAS_BY_UPSTREAM.has(modelOrEngine)) {
    return MODEL_ALIAS_BY_UPSTREAM.get(modelOrEngine);
  }

  const whisperAliasId = WHISPER_SIZE_TO_ALIAS.get(modelOrEngine);
  if (whisperAliasId) {
    return MODEL_ALIAS_MAP.get(whisperAliasId);
  }

  const legacyKey =
    modelSize && (modelOrEngine === 'qwen' || modelOrEngine === 'tada' || modelOrEngine === 'whisper')
      ? `${modelOrEngine}:${modelSize}`
      : modelOrEngine;

  const aliasId = LEGACY_SELECTION_TO_ALIAS.get(legacyKey);
  if (!aliasId) return undefined;
  return MODEL_ALIAS_MAP.get(aliasId);
}

export function getModelAliasByUpstreamModel(modelName?: string | null): ModelAliasEntry | undefined {
  if (!modelName) return undefined;
  return MODEL_ALIAS_BY_UPSTREAM.get(modelName);
}

export function getModelLabel(modelOrEngine?: string | null, modelSize?: string | null): string {
  return getModelAlias(modelOrEngine, modelSize)?.public_name ?? 'Unknown model';
}

export function getModelDescription(modelOrEngine?: string | null, modelSize?: string | null): string {
  return getModelAlias(modelOrEngine, modelSize)?.description ?? '';
}

export function getVisibleModelAliases() {
  return MODEL_ALIASES.filter((entry) => entry.status !== 'disabled' && supportsCapability(entry, 'tts'));
}

export function getSelectableModelAliases() {
  return MODEL_ALIASES.filter((entry) => entry.status === 'enabled' && supportsCapability(entry, 'tts'));
}

export function getModelLanguages(modelOrEngine?: string | null, modelSize?: string | null) {
  return getModelAlias(modelOrEngine, modelSize)?.languages ?? ['en'];
}

export function getDefaultAliasForLegacyEngine(engine?: string | null) {
  switch (engine) {
    case 'qwen':
      return 'eburon-athena';
    case 'luxtts':
      return 'eburon-hestia';
    case 'chatterbox':
      return 'eburon-hera';
    case 'chatterbox_turbo':
      return 'eburon-nike';
    case 'tada':
      return 'eburon-artemis';
    default:
      return undefined;
  }
}

export function isExpressiveAlias(modelOrEngine?: string | null, modelSize?: string | null) {
  return getModelAlias(modelOrEngine, modelSize)?.alias_id === 'eburon-nike';
}

export function isQwenFamilyAlias(modelOrEngine?: string | null, modelSize?: string | null) {
  return getModelAlias(modelOrEngine, modelSize)?.upstream_engine === 'qwen';
}

export function supportsVoiceCloning(modelOrEngine?: string | null, modelSize?: string | null) {
  return getModelAlias(modelOrEngine, modelSize)?.voice_cloning_supported ?? false;
}

export function normalizeUserFacingModelText(text: string): string {
  return CHANGELOG_MODEL_REPLACERS.reduce(
    (normalized, replacer) => normalized.replace(replacer.pattern, replacer.to),
    text,
  );
}
