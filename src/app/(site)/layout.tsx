import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Mono, Inter } from 'next/font/google';
import type { ReactNode } from 'react';

import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { MobileActionBar } from '@/components/layout/mobile-action-bar';
import { EinwilligungHinweis } from '@/components/statistik/einwilligung-hinweis';
import { GoogleAnalytics } from '@/components/statistik/google-analytics';
import { getSiteUrl } from '@/lib/site-url';
import { gaMessId } from '@/lib/statistik';

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
/** Google Analytics 4 nur mit Mess-ID — ohne sie wird nichts davon geladen. */
const gaId = gaMessId();

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
  // Keine canonical-Vorgabe hier: Sie würde an jede Seite ohne eigene Angabe
  // vererbt und erklärte sie zur Kopie der Startseite. Jede indexierbare Seite
  // setzt ihre eigene (geprüft in src/app/(site)/canonical.test.ts).
  // Aus demselben Grund keine og:url: Seiten ohne eigenes openGraph erben das
  // Objekt vollständig, und Facebook/LinkedIn zeigten sonst die Startseite.
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'SCHLÜSSELMACHER24',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  // Viewport-Metadaten verlangen einen Farbwert; er entspricht `--background` (globals.css).
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
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-skip focus:rounded-md focus:bg-primary focus:px-4 focus:py-3 focus:text-small focus:font-semibold focus:text-primary-foreground"
        >
          Zum Inhalt springen
        </a>

        <SiteHeader />

        <main id="inhalt" className="flex-1 pt-header">
          {children}
        </main>

        <SiteFooter />
        <MobileActionBar />
        {gaId && (
          <>
            <GoogleAnalytics messId={gaId} />
            <EinwilligungHinweis />
          </>
        )}
      </body>
    </html>
  );
}
