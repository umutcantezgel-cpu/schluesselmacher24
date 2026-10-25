import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === 'development';
/** Google Analytics 4 (nur nach Einwilligung geladen): Freigaben in der CSP nur mit gültiger Mess-ID. */
const mitStatistik = /^G-[A-Z0-9]{4,20}$/.test(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim().toUpperCase() ?? '');
const GA_SKRIPT = ' https://www.googletagmanager.com';
const GA_VERBINDUNG = ' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com';

/**
 * Content-Security-Policy.
 * - `blob:` in img-src: Fotovorschau beim Hochladen (URL.createObjectURL).
 * - `form-action` erlaubt die Weiterleitung zum Stripe-Checkout. Der Checkout
 *   ist gehostet (Weiterleitung zu checkout.stripe.com), deshalb braucht es
 *   weder Stripe-Skripte noch -Frames: script-src, frame-src und connect-src
 *   bleiben unverändert.
 * - `connect-src 'self'`: Uploads laufen über die eigene Route, nie direkt
 *   in den Bucket. Fotos liefert Payload über /api/medien/file/… aus; next/image
 *   lädt sie als lokale Pfade, `images` braucht deshalb keine Freigaben.
 * - `frame-ancestors 'self'`: die eigene Seite darf sich für die Live-Vorschau
 *   im Backend einbetten, fremde Seiten nicht.
 * - `'unsafe-eval'` nur in der Entwicklung (React-Fehlerüberlagerung).
 * - Google Analytics: script-src und connect-src für Google nur, wenn eine
 *   Mess-ID gesetzt ist (Bilder sind über `https:` ohnehin erlaubt).
 */
function csp(): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}${mitStatistik ? GA_SKRIPT : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src 'self'${mitStatistik ? GA_VERBINDUNG : ''}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://checkout.stripe.com",
    "frame-ancestors 'self'",
  ].join('; ');
}

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp() },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // camera=() blockiert nur getUserMedia; die Kameraaufnahme über
  // <input capture> bleibt davon unberührt.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    /*
     * CSS als <style> im Kopf statt als eigene Datei: Auf langsamen Leitungen entfällt die
     * Anfrage samt Latenz vor dem ersten Zeichnen (Tailwind hält das CSS klein). Gemessen am
     * Produktionsbuild, mobil gedrosselt: Startseite LCP 1,09 → 0,62 s (E7-L-43, D-050).
     */
    inlineCss: true,
  },
  outputFileTracingIncludes: {
    '/*': ['./content/**/*'],
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  // Nur relevant, falls mit `next build --webpack` gebaut wird.
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    };
    return webpackConfig;
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  // Frühere Adressen mit verlorenem Akzent (Datenmigration 20261025 „leitfaden_daten“).
  async redirects() {
    return [
      { source: '/autoschluessel/marken/koda', destination: '/autoschluessel/marken/skoda', permanent: true },
      { source: '/autoschluessel/marken/koda/:model', destination: '/autoschluessel/marken/skoda/:model', permanent: true },
      { source: '/autoschluessel/marken/renault/m-gane', destination: '/autoschluessel/marken/renault/megane', permanent: true },
    ];
  },
};

const withCms = withPayload(nextConfig, { devBundleServerPackages: false });

// Payload hängt eine Header-Regel für alle Pfade an (Farbschema-Hinweise für
// das Backend). Auf der öffentlichen Seite ist sie überflüssig und stört das
// Caching — deshalb auf /admin begrenzen.
const payloadHeaders = withCms.headers;
withCms.headers = async () => {
  const rules = (await payloadHeaders?.()) ?? [];
  return rules.map((rule) =>
    rule.source === '/:path*' && rule.headers.some((h) => h.key === 'Critical-CH')
      ? { ...rule, source: '/admin/:path*' }
      : rule,
  );
};

export default withCms;
