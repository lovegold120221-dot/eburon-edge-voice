import { Link, useMatchRoute } from '@tanstack/react-router';
import { AudioLines, Mic, Settings, Box, Waves, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SidebarProps {
  isMacOS?: boolean;
}

const tabs = [
  { id: 'studio', path: '/', icon: Waves, label: 'Synthesis Studio' },
  { id: 'csr', path: '/csr', icon: Headphones, label: 'Autonomous Agent' },
  { id: 'gallery', path: '/voices', icon: Mic, label: 'Voice Gallery' },
  { id: 'models', path: '/models', icon: Box, label: 'Model Registry' },
  { id: 'editor', path: '/stories', icon: AudioLines, label: 'Stories Editor' },
  { id: 'system', path: '/settings', icon: Settings, label: 'System Console' },
];

export function Sidebar({ isMacOS }: SidebarProps) {
  const matchRoute = useMatchRoute();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full w-16 bg-carbon border-r border-white/5 flex flex-col items-center py-6 z-50',
        isMacOS && 'pt-14',
      )}
    >
      <div className="w-10 h-10 border border-bronze flex items-center justify-center font-display font-bold text-bronze mb-12 text-lg">
        E
      </div>

      <nav className="flex flex-col gap-10 text-white/20 text-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.path === '/'
              ? matchRoute({ to: '/', fuzzy: false })
              : matchRoute({ to: tab.path, fuzzy: true });

          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={cn(
                'transition-colors',
                isActive ? 'text-bronze' : 'hover:text-white',
              )}
              title={tab.label}
              aria-label={tab.label}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto text-white/20 hover:text-white transition cursor-pointer">
        <Link to="/settings" title="Settings">
          <Settings className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}