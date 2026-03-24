import {
  ArrowUpRight,
  Download,
  Github,
  Laptop,
  Monitor,
  Terminal,
} from 'lucide-react';
import { GITHUB_RELEASES_PAGE, GITHUB_REPO, LATEST_VERSION } from '@/lib/constants';
import { getLatestRelease, getStarCount } from '@/lib/releases';

export const dynamic = 'force-dynamic';

const footerLinks = [
  { href: '#download', label: 'Download' },
  { href: '#features', label: 'Features' },
  { href: '#tech', label: 'Technology' },
  { href: GITHUB_RELEASES_PAGE, label: 'Releases', external: true },
];

function formatCompactNumber(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`;
  }

  return value.toString();
}

export default async function Home() {
  const [releaseResult, starResult] = await Promise.allSettled([getLatestRelease(), getStarCount()]);
  const releaseInfo = releaseResult.status === 'fulfilled' ? releaseResult.value : null;
  const starCount = starResult.status === 'fulfilled' ? starResult.value : null;
  const version = releaseInfo?.version ?? LATEST_VERSION;
  const totalDownloads = releaseInfo?.totalDownloads ?? null;

  const downloadCards = [
    {
      name: 'macOS',
      detail: 'Apple Silicon',
      description: 'Primary desktop build for local acceleration on modern Macs.',
      href: '/download/mac-arm',
      secondaryHref: '/download/mac-intel',
      secondaryLabel: 'Need Intel?',
      icon: Laptop,
    },
    {
      name: 'Windows',
      detail: 'x64 Installer',
      description: 'Installer package for guarded enterprise rollouts and workstation setups.',
      href: '/download/windows',
      secondaryHref: GITHUB_RELEASES_PAGE,
      secondaryLabel: 'All release assets',
      icon: Monitor,
    },
    {
      name: 'Linux',
      detail: 'AppImage',
      description: 'Direct binary when available, plus a source-build path for controlled deploys.',
      href: '/download/linux',
      secondaryHref: '/linux-install',
      secondaryLabel: 'Build from source',
      icon: Terminal,
    },
  ];

  return (
    <main className="relative overflow-hidden bg-[#030303] text-[#E5D9C5]">
      <div className="noise-overlay" aria-hidden="true" />
      <div className="tech-grid fixed inset-0 z-[-1]" aria-hidden="true" />

      <div
        className="ambient-glow left-[-100px] top-[-200px] h-[600px] w-[600px] bg-[#BFA181]"
        aria-hidden="true"
      />
      <div
        className="ambient-glow bottom-[10%] right-[-100px] h-[500px] w-[500px] bg-white"
        style={{ opacity: 0.05 }}
        aria-hidden="true"
      />

      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-8 mix-blend-difference lg:px-10">
        <a
          href="#"
          className="landing-display text-2xl font-bold uppercase tracking-[-0.04em] text-white"
        >
          Eburon <span className="ml-1 font-normal text-white/40">Voice</span>
        </a>

        <div className="hidden items-center gap-12 md:flex">
          <a
            href="#features"
            className="landing-mono text-[10px] uppercase tracking-[0.28em] text-white/60 transition hover:text-[#E5D9C5]"
          >
            Features
          </a>
          <a
            href="#tech"
            className="landing-mono text-[10px] uppercase tracking-[0.28em] text-white/60 transition hover:text-[#E5D9C5]"
          >
            Technology
          </a>
          <a
            href="#download"
            className="landing-mono text-[10px] uppercase tracking-[0.28em] text-white/60 transition hover:text-[#E5D9C5]"
          >
            Download
          </a>
        </div>

        <a href={GITHUB_REPO} className="group flex items-center gap-3" target="_blank" rel="noopener noreferrer">
          <span className="text-xs uppercase tracking-[0.28em] text-white">GitHub</span>
          <ArrowUpRight className="h-4 w-4 text-white/60 group-hover:text-white" />
        </a>
      </nav>

      <section className="relative flex min-h-screen flex-col justify-center px-6 pb-24 pt-28 lg:px-12">
        <div
          className="absolute bottom-0 left-12 top-0 hidden w-px bg-white/5 lg:block"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-12 top-0 hidden w-px bg-white/5 lg:block"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-12">
          <div className="reveal-rise lg:col-span-7">
            <p className="landing-mono mb-8 flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-[#BFA181]">
              <span className="h-px w-8 bg-[#BFA181]" />
              Local Voice Cloning Studio
            </p>

            <h1 className="landing-display mb-8 text-6xl font-bold leading-[0.9] tracking-[-0.05em] md:text-8xl lg:text-[7rem]">
              <span className="block text-white">Your Voice,</span>
              <span className="gold-gradient block pr-0 italic md:pr-8">Anywhere.</span>
            </h1>

            <p className="mb-12 max-w-xl text-lg font-light leading-relaxed text-white/50 md:text-xl">
              Open-source voice cloning and synthesis that runs entirely on your machine. 
              Clone any voice with a 10-second audio sample. No cloud, no compromises on privacy.
            </p>

            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
              <a
                href="#download"
                className="group relative overflow-hidden border border-white/20 px-8 py-4"
              >
                <span className="absolute inset-0 translate-y-full bg-[#E5D9C5] transition duration-500 ease-in-out group-hover:translate-y-0" />
                <span className="landing-mono relative z-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white transition duration-500 group-hover:text-[#030303]">
                  <Download className="h-4 w-4" />
                  Download
                </span>
              </a>

              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="landing-mono inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/50 transition hover:text-white"
              >
                View on GitHub
                <ArrowUpRight className="h-4 w-4 text-[#BFA181]" />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-[10px] uppercase tracking-[0.22em] text-white/45">
              <div className="landing-mono">v{version}</div>
              {totalDownloads !== null && (
                <div className="landing-mono">{formatCompactNumber(totalDownloads)} downloads</div>
              )}
              {starCount !== null && (
                <div className="landing-mono">{formatCompactNumber(starCount)} stars</div>
              )}
            </div>
          </div>

          <div
            id="demo"
            className="reveal-rise relative flex h-[500px] w-full items-center justify-center lg:col-span-5 lg:h-[700px]"
            style={{ animationDelay: '0.18s' }}
          >
            <div className="absolute inset-0 border border-white/10 p-2">
              <span className="absolute -left-px -top-px h-2 w-2 border-l border-t border-white/50" />
              <span className="absolute -right-px -top-px h-2 w-2 border-r border-t border-white/50" />
              <span className="absolute -bottom-px -left-px h-2 w-2 border-b border-l border-white/50" />
              <span className="absolute -bottom-px -right-px h-2 w-2 border-b border-r border-white/50" />

              <div className="group relative h-full w-full overflow-hidden border border-white/5 bg-[#121212]/55 backdrop-blur-md">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,_#1a1a1a,_#000000)]" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mb-6 flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 animate-ping rounded-full bg-[#BFA181]/20" />
                        <div className="h-20 w-20 rounded-full border border-[#BFA181]/40 bg-[#BFA181]/10 flex items-center justify-center">
                          <svg className="h-10 w-10 text-[#BFA181]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" y1="19" x2="12" y2="23" />
                            <line x1="8" y1="23" x2="16" y2="23" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="landing-mono text-xs uppercase tracking-[0.2em] text-white/60">
                      Voice Cloning Studio
                    </div>
                  </div>
                </div>

                <div className="absolute left-6 top-6 space-y-1 text-[9px] uppercase tracking-[0.28em] text-white/40">
                  <div>Local TTS</div>
                  <div>Privacy First</div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between border-t border-white/10 pt-4">
                  <div className="landing-mono text-[10px] text-[#BFA181]">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-green-500" />
                      Running Locally
                    </div>
                    <div className="text-white/80">
                      6 TTS Engines
                    </div>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20">
                    <span className="h-2 w-2 rounded-full bg-white/50" />
                  </div>
                </div>

                <div className="absolute right-6 top-6 border border-white/10 bg-black/25 px-3 py-2 backdrop-blur-sm">
                  <div className="landing-mono text-[9px] uppercase tracking-[0.24em] text-white/35">
                    Version
                  </div>
                  <div className="landing-mono mt-1 text-[11px] uppercase tracking-[0.2em] text-[#E5D9C5]">
                    {version}
                  </div>
                </div>

                <div className="scan-sweep absolute inset-0" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4 opacity-50">
          <span className="landing-mono origin-left rotate-90 translate-x-1 text-[9px] uppercase tracking-[0.2em]">
            Scroll
          </span>
          <span className="h-12 w-px bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      <section id="features" className="border-t border-white/5 bg-[#050505] py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-14 text-center">
            <div className="landing-mono mb-4 text-[10px] uppercase tracking-[0.24em] text-[#BFA181]">
              Capabilities
            </div>
            <h2 className="landing-display text-4xl tracking-[-0.04em] text-white md:text-5xl">
              Professional voice synthesis.
            </h2>
            <p className="mt-5 max-w-2xl mx-auto text-sm font-light leading-relaxed text-white/55 md:text-base">
              Clone any voice with just 10 seconds of audio. Generate unlimited speech with full control over tone, pacing, and emotion.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="border border-white/10 bg-white/[0.02] p-5">
              <div className="landing-mono text-[9px] uppercase tracking-[0.22em] text-white/35">
                Current
              </div>
              <div className="mt-3 text-2xl font-semibold text-white">{version}</div>
            </div>
            <div className="border border-white/10 bg-white/[0.02] p-5">
              <div className="landing-mono text-[9px] uppercase tracking-[0.22em] text-white/35">
                Downloads
              </div>
              <div className="mt-3 text-2xl font-semibold text-white">
                {totalDownloads !== null ? formatCompactNumber(totalDownloads) : 'Live'}
              </div>
            </div>
            <div className="border border-white/[0.02] bg-[#BFA181]/5 p-5">
              <div className="landing-mono text-[9px] uppercase tracking-[0.22em] text-[#D4AF37]">
                Source
              </div>
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-white transition hover:text-[#E5D9C5]"
              >
                GitHub
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="download" className="border-t border-white/5 bg-[#0A0A0A] py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-14 grid gap-8 lg:grid-cols-[1.2fr,0.8fr] lg:items-end">
            <div>
              <div className="landing-mono mb-4 text-[10px] uppercase tracking-[0.24em] text-[#BFA181]">
                Get Started
              </div>
              <h2 className="landing-display text-4xl tracking-[-0.04em] text-white md:text-5xl">
                Download for your platform.
              </h2>
              <p className="mt-5 max-w-2xl text-sm font-light leading-relaxed text-white/55 md:text-base">
                Platform links resolve through the latest approved release, so the landing page can
                stay branded while the delivery pipeline keeps shipping new artifacts underneath.
              </p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {downloadCards.map(
              ({ name, detail, description, href, secondaryHref, secondaryLabel, icon: Icon }) => (
                <article
                  key={name}
                  className="group flex h-full flex-col justify-between border border-white/10 bg-white/[0.02] p-8 transition duration-300 hover:-translate-y-1 hover:border-[#BFA181]/40 hover:bg-white/[0.04]"
                >
                  <div>
                    <div className="mb-10 flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#BFA181]/25 bg-[#BFA181]/10 text-[#E5D9C5]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="landing-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
                        {detail}
                      </div>
                    </div>

                    <h3 className="landing-display text-3xl tracking-[-0.04em] text-white">
                      {name}
                    </h3>
                    <p className="mt-4 text-sm font-light leading-relaxed text-white/55">
                      {description}
                    </p>
                  </div>

                  <div className="mt-10 space-y-4">
                    <a
                      href={href}
                      className="landing-mono inline-flex w-full items-center justify-between border border-white/15 px-5 py-4 text-xs uppercase tracking-[0.22em] text-white transition hover:border-[#E5D9C5] hover:bg-[#E5D9C5] hover:text-[#030303]"
                    >
                      <span>Download</span>
                      <Download className="h-4 w-4" />
                    </a>

                    <a
                      href={secondaryHref}
                      target={secondaryHref.startsWith('http') ? '_blank' : undefined}
                      rel={secondaryHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="landing-mono inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/45 transition hover:text-white"
                    >
                      {secondaryLabel}
                      <ArrowUpRight className="h-3.5 w-3.5 text-[#BFA181]" />
                    </a>
                  </div>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      <section id="tech" className="relative py-32">
        <div className="tech-grid absolute inset-0 z-[-1] opacity-50" aria-hidden="true" />

        <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2 lg:px-12">
          <div>
            <div className="landing-mono mb-6 text-[10px] uppercase tracking-[0.24em] text-[#BFA181]">
              Technology
            </div>
            <h2 className="landing-display mb-8 text-4xl font-normal tracking-[-0.04em] text-white lg:text-5xl">
              Multiple TTS engines.
              <br />
              <span className="gold-gradient italic">One interface.</span>
            </h2>

            <div className="space-y-8 text-xs text-white/50">
              <div className="flex items-start gap-6">
                <span className="landing-mono mt-1 text-[#BFA181]">01.</span>
                <p className="landing-mono leading-relaxed">
                  Choose from Qwen3-TTS, LuxTTS, Chatterbox, HumeAI TADA, and Kokoro. 
                  Each engine offers different strengths in voice quality, speed, and language support.
                </p>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />

              <div className="flex items-start gap-6">
                <span className="landing-mono mt-1 text-[#BFA181]">02.</span>
                <p className="landing-mono leading-relaxed">
                  Clone any voice with just 10 seconds of audio. The system extracts vocal characteristics 
                  and synthesizes new speech in the cloned voice.
                </p>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />

              <div className="flex items-start gap-6">
                <span className="landing-mono mt-1 text-[#BFA181]">03.</span>
                <p className="landing-mono leading-relaxed">
                  Apply professional audio effects including reverb, delay, chorus, compression, and more. 
                  Fine-tune your audio with a comprehensive effects chain.
                </p>
              </div>
            </div>
          </div>

          <div id="engine" className="relative p-1 shadow-2xl backdrop-blur-xl">
            <div className="absolute -left-1 -top-1 h-2 w-2 bg-[#BFA181]" />
            <div className="absolute -bottom-1 -right-1 h-2 w-2 bg-[#BFA181]" />

            <div className="border border-white/5 bg-[#050505] p-8">
              <div className="mb-8 flex items-center justify-between border-b border-white/5 pb-4">
                <div className="landing-mono text-[9px] uppercase tracking-[0.24em] text-white/30">
                  Supported Engines
                </div>
                <div className="flex gap-1.5">
                  <span className="h-1.5 w-1.5 bg-white/20" />
                  <span className="h-1.5 w-1.5 bg-white/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-white/10 bg-white/[0.02] p-4">
                  <div className="landing-mono text-[10px] uppercase tracking-[0.15em] text-[#BFA181] mb-2">Qwen3-TTS</div>
                  <div className="text-[10px] text-white/40">0.6B / 1.7B params</div>
                </div>
                <div className="border border-white/10 bg-white/[0.02] p-4">
                  <div className="landing-mono text-[10px] uppercase tracking-[0.15em] text-[#BFA181] mb-2">LuxTTS</div>
                  <div className="text-[10px] text-white/40">48kHz lightweight</div>
                </div>
                <div className="border border-white/10 bg-white/[0.02] p-4">
                  <div className="landing-mono text-[10px] uppercase tracking-[0.15em] text-[#BFA181] mb-2">Chatterbox</div>
                  <div className="text-[10px] text-white/40">23 languages</div>
                </div>
                <div className="border border-white/10 bg-white/[0.02] p-4">
                  <div className="landing-mono text-[10px] uppercase tracking-[0.15em] text-[#BFA181] mb-2">Kokoro</div>
                  <div className="text-[10px] text-white/40">82M params</div>
                </div>
                <div className="border border-white/10 bg-white/[0.02] p-4 col-span-2">
                  <div className="landing-mono text-[10px] uppercase tracking-[0.15em] text-[#BFA181] mb-2">HumeAI TADA</div>
                  <div className="text-[10px] text-white/40">1B / 3B params with emotion control</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="privacy" className="border-t border-white/5 bg-[#050505] py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[0.9fr,1.1fr] lg:px-12">
          <div>
            <div className="landing-mono mb-4 text-[10px] uppercase tracking-[0.24em] text-[#BFA181]">
              Privacy
            </div>
            <h2 className="landing-display text-3xl tracking-[-0.04em] text-white md:text-4xl">
              100% local. Zero cloud.
            </h2>
            <p className="mt-4 text-sm font-light leading-relaxed text-white/55">
              All voice cloning and speech synthesis happens entirely on your machine. 
              Your voice data never leaves your computer.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="border border-white/10 bg-white/[0.02] p-8">
              <div className="landing-mono mb-8 text-[10px] uppercase tracking-[0.24em] text-white/35">
                Open Source
              </div>
              <p className="text-sm font-light leading-relaxed text-white/55">
                Full source code available on GitHub. Audit, modify, and contribute to the project.
              </p>
            </article>

            <article className="border border-white/10 bg-[#BFA181]/5 p-8">
              <div className="landing-mono mb-8 text-[10px] uppercase tracking-[0.24em] text-[#D4AF37]">
                Offline Capable
              </div>
              <p className="text-sm font-light leading-relaxed text-white/65">
                Works without internet connection. Generate speech anywhere, anytime.
              </p>
            </article>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-[#030303] px-6 pb-8 pt-16 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
          <div className="landing-display text-xl font-bold uppercase tracking-[-0.04em] text-white">
            Eburon <span className="font-normal text-white/30">Voice</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="landing-mono text-[9px] uppercase tracking-[0.24em] text-white/40 transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="landing-mono text-[9px] tracking-[0.24em] text-white/30">
            &copy; {new Date().getFullYear()} Eburon. Open source under MIT license.
          </div>
        </div>
      </footer>
    </main>
  );
}
