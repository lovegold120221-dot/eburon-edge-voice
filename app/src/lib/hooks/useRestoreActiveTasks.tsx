import { useCallback, useEffect, useRef, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import type { ActiveDownloadTask } from '@/lib/api/types';
import { getModelLabel } from '@/lib/constants/modelAliases';
import { useGenerationStore } from '@/stores/generationStore';

// Polling interval in milliseconds
const POLL_INTERVAL = 30000;

/**
 * Hook to monitor active tasks (downloads and generations).
 * Polls the server periodically to catch downloads triggered from anywhere
 * (transcription, generation, explicit download, etc.).
 *
 * Returns the active downloads so components can render download toasts.
 */
export function useRestoreActiveTasks() {
  const [activeDownloads, setActiveDownloads] = useState<ActiveDownloadTask[]>([]);
  const setActiveGenerationId = useGenerationStore((state) => state.setActiveGenerationId);
  const addPendingGeneration = useGenerationStore((state) => state.addPendingGeneration);

  // Track which downloads we've seen to detect new ones
  const seenDownloadsRef = useRef<Set<string>>(new Set());

  const fetchActiveTasks = useCallback(async () => {
    try {
      const tasks = await apiClient.getActiveTasks();

      // Restore pending generations (e.g., after page refresh)
      if (tasks.generations.length > 0) {
        setActiveGenerationId(tasks.generations[0].task_id);
        for (const gen of tasks.generations) {
          addPendingGeneration(gen.task_id);
        }
      } else {
        const currentId = useGenerationStore.getState().activeGenerationId;
        if (currentId) {
          setActiveGenerationId(null);
        }
      }

      // Update active downloads
      // Keep track of all active downloads (including new ones)
      const currentDownloadNames = new Set(tasks.downloads.map((d) => d.model_name));

      // Remove completed downloads from our seen set
      for (const name of seenDownloadsRef.current) {
        if (!currentDownloadNames.has(name)) {
          seenDownloadsRef.current.delete(name);
        }
      }

      // Add new downloads to seen set
      for (const download of tasks.downloads) {
        seenDownloadsRef.current.add(download.model_name);
      }

      setActiveDownloads(tasks.downloads);
    } catch (error) {
      // Silently fail - server might be temporarily unavailable
      console.debug('Failed to fetch active tasks:', error);
    }
  }, [setActiveGenerationId, addPendingGeneration]);

  useEffect(() => {
    // Fetch immediately on mount
    fetchActiveTasks();

    // Poll for active tasks
    const interval = setInterval(fetchActiveTasks, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchActiveTasks]);

  return activeDownloads;
}

/**
 * Map model names to display names for download toasts.
 */
export const MODEL_DISPLAY_NAMES: Record<string, string> = {
  'eburon-athena': getModelLabel('eburon-athena'),
  'eburon-iris': getModelLabel('eburon-iris'),
  'eburon-hestia': getModelLabel('eburon-hestia'),
  'eburon-hera': getModelLabel('eburon-hera'),
  'eburon-nike': getModelLabel('eburon-nike'),
  'eburon-artemis': getModelLabel('eburon-artemis'),
  'eburon-gaia': getModelLabel('eburon-gaia'),
  'eburon-orbit-base': getModelLabel('eburon-orbit-base'),
  'eburon-orbit-small': getModelLabel('eburon-orbit-small'),
  'eburon-orbit-medium': getModelLabel('eburon-orbit-medium'),
  'eburon-orbit-large': getModelLabel('eburon-orbit-large'),
  'eburon-orbit-turbo': getModelLabel('eburon-orbit-turbo'),
  'whisper-base': getModelLabel('whisper-base'),
  'whisper-small': getModelLabel('whisper-small'),
  'whisper-medium': getModelLabel('whisper-medium'),
  'whisper-large': getModelLabel('whisper-large'),
  'whisper-turbo': getModelLabel('whisper-turbo'),
};
