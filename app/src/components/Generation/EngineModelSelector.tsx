import { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { FormControl } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { VoiceProfileResponse } from '@/lib/api/types';
import { getLanguageOptionsForEngine } from '@/lib/constants/languages';
import {
  DEFAULT_MODEL_ALIAS,
  getModelAlias,
  getModelDescription,
  getSelectableModelAliases,
  supportsVoiceCloning,
} from '@/lib/constants/modelAliases';
import type { GenerationFormValues } from '@/lib/hooks/useGenerationForm';

function getAvailableOptions(selectedProfile?: VoiceProfileResponse | null) {
  const options = getSelectableModelAliases().map((entry) => ({
    value: entry.alias_id,
    label: entry.public_name,
  }));
  if (!selectedProfile) return options;
  return options.filter((opt) => isProfileCompatibleWithEngine(selectedProfile, opt.value));
}

function handleEngineChange(form: UseFormReturn<GenerationFormValues>, value: string) {
  form.setValue('engine', value as GenerationFormValues['engine']);
  const selectedSize = getModelAlias(value)?.model_size ?? undefined;
  form.setValue('modelSize', selectedSize as GenerationFormValues['modelSize']);

  const currentLang = form.getValues('language');
  const available = getLanguageOptionsForEngine(value);
  if (!available.some((l) => l.value === currentLang)) {
    form.setValue('language', available[0]?.value ?? 'en');
  }
}

interface EngineModelSelectorProps {
  form: UseFormReturn<GenerationFormValues>;
  compact?: boolean;
  selectedProfile?: VoiceProfileResponse | null;
}

export function EngineModelSelector({ form, compact, selectedProfile }: EngineModelSelectorProps) {
  const engine = form.watch('engine') || DEFAULT_MODEL_ALIAS;
  const selectValue = engine;
  const availableOptions = getAvailableOptions(selectedProfile);

  const currentEngineAvailable = availableOptions.some((opt) => opt.value === selectValue);

  useEffect(() => {
    if (!currentEngineAvailable && availableOptions.length > 0) {
      handleEngineChange(form, availableOptions[0].value);
    }
  }, [availableOptions, currentEngineAvailable, form]);

  const itemClass = compact ? 'text-xs text-muted-foreground' : undefined;
  const triggerClass = compact
    ? 'h-8 text-xs bg-card border-border rounded-full hover:bg-background/50 transition-all'
    : undefined;

  return (
    <Select value={selectValue} onValueChange={(v) => handleEngineChange(form, v)}>
      <FormControl>
        <SelectTrigger className={triggerClass}>
          <SelectValue />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {availableOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className={itemClass}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Returns a human-readable description for the currently selected engine. */
export function getEngineDescription(engine: string): string {
  return getModelDescription(engine) ?? '';
}

/**
 * Check if a profile is compatible with the currently selected engine.
 * Useful for UI hints.
 */
export function isProfileCompatibleWithEngine(
  profile: VoiceProfileResponse,
  engine: string,
): boolean {
  const voiceType = profile.voice_type || 'cloned';
  if (voiceType === 'preset') return profile.preset_engine === engine;
  if (voiceType === 'cloned') return supportsVoiceCloning(engine);
  return true; // designed — future
}
