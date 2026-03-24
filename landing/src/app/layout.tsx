import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Syne } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://eburon.ai'),
  title: 'Eburon Voice | Local Voice Cloning Studio',
  description:
    'Open-source voice cloning and synthesis that runs entirely on your machine. Clone any voice with a 10-second audio sample.',
  keywords: [
    'Eburon',
    'voice cloning',
    'TTS',
    'text to speech',
    'local voice synthesis',
    'Qwen3-TTS',
    'open source',
  ],
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'Eburon Voice | Local Voice Cloning Studio',
    description:
      'Open-source voice cloning and synthesis that runs entirely on your machine. Clone any voice with a 10-second audio sample.',
    type: 'website',
    url: 'https://eburon.ai',
    images: [{ url: '/og.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eburon Voice | Local Voice Cloning Studio',
    description:
      'Open-source voice cloning and synthesis that runs entirely on your machine. Clone any voice with a 10-second audio sample.',
    images: ['/og.webp'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark scroll-smooth bg-[#030303]">
      <body className={`${inter.variable} ${syne.variable} ${jetBrainsMono.variable}`}>
        <div className="relative min-h-screen bg-background font-sans">{children}</div>
      </body>
    </html>
  );
}
