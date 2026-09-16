import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Mono, Inter } from 'next/font/google';
import type { ReactNode } from 'react';

import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { MobileActionBar } from '@/components/layout/mobile-action-bar';
import { getSiteUrl } from '@/lib/site-url';

import './globals.css';

/* Schriften: ruhig und technisch, gut lesbar auf kleinen Bildschirmen. */

const display = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700'],
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SCHLÜSSELMACHER24 — Autoschlüssel, Schließtechnik und Sicherheitstechnik',
    template: '%s | SCHLÜSSELMACHER24',
  },
  description:
    'Autoschlüssel nachmachen und programmieren, Schlüssel nach Code und Vorlage, '
    + 'gleichschließende Zylinder, Schließanlagen, elektronische Zutrittslösungen und '
    + 'Sicherheitstechnik.',
  applicationName: 'SCHLÜSSELMACHER24',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'SCHLÜSSELMACHER24',
    url: siteUrl,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f7f9fb',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="de"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-primary-foreground"
        >
          Zum Inhalt springen
        </a>

        <SiteHeader />

        <main id="inhalt" className="flex-1 pt-16 pb-safe-nav md:pt-20">
          {children}
        </main>

        <SiteFooter />
        <MobileActionBar />
      </body>
    </html>
  );
}
