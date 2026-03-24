export const APP_NAME = 'Eburon Voice';
export const APP_DESCRIPTION =
  'Local-first voice synthesis studio for cloning voices, generating speech, and managing voice workflows.';

export const ARCHIVE_EXTENSION = '.eburon-voice.zip';
export const LEGACY_ARCHIVE_EXTENSION = '.voicebox.zip';

export function isSupportedArchiveFilename(filename: string) {
  return (
    filename.endsWith(ARCHIVE_EXTENSION) || filename.endsWith(LEGACY_ARCHIVE_EXTENSION)
  );
}
