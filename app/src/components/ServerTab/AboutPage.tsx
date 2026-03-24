import { ArrowUpRight } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import appLogo from '@/assets/eburon-edge-voice-logo.svg';
import { APP_NAME } from '@/lib/constants/branding';
import { usePlatform } from '@/platform/PlatformContext';

function FadeIn({ delay = 0, children }: { delay?: number; children: ReactNode }) {
  return (
    <div
      className="animate-[fadeInUp_0.5s_ease_both]"
      style={{ animationDelay: `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function AboutPage() {
  const platform = usePlatform();
  const [version, setVersion] = useState('');

  useEffect(() => {
    platform.metadata
      .getVersion()
      .then(setVersion)
      .catch(() => setVersion(''));
  }, [platform]);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="max-w-md mx-auto h-full flex items-center">
        <div className="flex flex-col items-center text-center space-y-5">
          <FadeIn delay={0}>
            <img
              src={appLogo}
              alt={APP_NAME}
              className="w-64 max-w-[80vw] h-auto object-contain"
            />
          </FadeIn>

          <FadeIn delay={80}>
            <div className="space-y-1.5">
              <h1 className="text-lg font-semibold">{APP_NAME}</h1>
              <p className="text-xs text-muted-foreground/60 h-4">
                {version ? `v${version}` : '\u00A0'}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={160}>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              A local-first voice synthesis studio. Clone voices, generate speech, apply effects,
              and build voice-powered workflows that stay on your machine.
            </p>
          </FadeIn>

          <FadeIn delay={240}>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span>Created by</span>
              <span className="text-accent">Eburon AI Development</span>
            </div>
          </FadeIn>

          <FadeIn delay={320}>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <a
                href="https://github.com/lovegold120221-dot/eburon-edge-voice"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-lg border border-border/60 px-4 py-2 text-sm transition-colors hover:bg-muted/50"
              >
                <svg
                  className="h-4 w-4 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={400}>
            <p className="text-xs text-muted-foreground/40 pt-4">
              Licensed under{' '}
              <a
                href="https://github.com/lovegold120221-dot/eburon-edge-voice/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-muted-foreground/60 transition-colors"
              >
                MIT
              </a>
            </p>
          </FadeIn>
        </div>
      </div>
    </>
  );
}
