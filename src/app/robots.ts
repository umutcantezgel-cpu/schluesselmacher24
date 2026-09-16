import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://schluesselmacher24.de';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Vorgangsdaten, Warenkorb und Backend gehören nicht in den Index.
        disallow: ['/admin', '/kasse', '/warenkorb', '/bestellung'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
