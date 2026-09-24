import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === 'development';

/**
 * Content-Security-Policy.
 * - `blob:` in img-src: Fotovorschau beim Hochladen (URL.createObjectURL).
 * - `form-action` erlaubt die Weiterleitung zum Stripe-Checkout.
 * - `frame-ancestors 'self'`: die eigene Seite darf sich für die Live-Vorschau
 *   im Backend einbetten, fremde Seiten nicht.
 * - `'unsafe-eval'` nur in der Entwicklung (React-Fehlerüberlagerung).
 */
function csp(): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
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
