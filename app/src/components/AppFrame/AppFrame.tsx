import { useRouterState } from '@tanstack/react-router';
import { TitleBarDragRegion } from '@/components/TitleBarDragRegion';
import { AudioPlayer } from '@/components/AudioPlayer/AudioPlayer';
import { StoryTrackEditor } from '@/components/StoriesTab/StoryTrackEditor';
import { TOP_SAFE_AREA_PADDING } from '@/lib/constants/ui';
import { cn } from '@/lib/utils/cn';
import { useStoryStore } from '@/stores/storyStore';
import { useStory } from '@/lib/hooks/useStories';
import { version } from '../../../package.json';

interface AppFrameProps {
  children: React.ReactNode;
}

const routeToTabName: Record<string, string> = {
  '/': 'studio',
  '/csr': 'csr',
  '/stories': 'editor',
  '/voices': 'gallery',
  '/audio': 'studio',
  '/effects': 'studio',
  '/models': 'system',
  '/settings': 'system',
};

export function AppFrame({ children }: AppFrameProps) {
  const routerState = useRouterState();
  const isStoriesRoute = routerState.location.pathname === '/stories';

  const selectedStoryId = useStoryStore((state) => state.selectedStoryId);
  const { data: story } = useStory(selectedStoryId);

  const showTrackEditor = isStoriesRoute && selectedStoryId && story && story.items.length > 0;

  const currentTab = routeToTabName[routerState.location.pathname] || 'studio';

  return (
    <div className={cn('h-screen bg-obsidian flex flex-col overflow-hidden', TOP_SAFE_AREA_PADDING)}>
      <div className="noise" />

      <TitleBarDragRegion />

      <header className="h-12 border-b border-white/5 flex items-center px-6 justify-between bg-carbon/40 backdrop-blur-xl shrink-0">
        <div className="font-mono text-[9px] text-white/30 uppercase tracking-[0.3em] flex items-center gap-4">
          Eburon Edge Voice <span className="text-white font-bold">{' // '}</span> <span className="text-white">{currentTab}</span>
          <span className="text-white/5">|</span>
          <span className="text-[8px] bg-white/5 px-2 py-0.5 rounded border border-white/5">v{version} stable</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[9px] uppercase tracking-widest">
          <div className="flex items-center gap-2 text-bronze">
            <div className="w-1.5 h-1.5 bg-bronze rounded-full animate-pulse shadow-[0_0_8px_#BFA181]" />
            CUDA: LOADED
          </div>
          <div className="text-white/20">|</div>
          <div className="text-white/40">VRAM: 6.4GB / 16GB</div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>

      {showTrackEditor ? (
        <StoryTrackEditor storyId={story.id} items={story.items} />
      ) : (
        <AudioPlayer />
      )}
    </div>
  );
}