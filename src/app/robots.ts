import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';

const siteUrl = getSiteUrl();

export default function robots(): MetadataRoute.Robots {
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
