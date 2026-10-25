import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';
import { indexierungErlaubt } from '@/lib/umgebung';

const siteUrl = getSiteUrl();

export default function robots(): MetadataRoute.Robots {
  // Vorschau-Deployments und lokale Umgebungen sperren alles (Erg. Leitfaden §4);
  // die Seiten selbst stehen dort zusätzlich auf noindex (Root-Layout).
  if (!indexierungErlaubt()) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Vorgangsdaten, Warenkorb, Backend und Schnittstellen gehören nicht in den Index.
        disallow: ['/admin', '/api/', '/kasse', '/warenkorb', '/bestellung'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
