import type { MetadataRoute } from 'next';

import { getCities, getCodeLines, getGuides, getServicePages, getVehicleMakes } from '@/lib/data';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://schluesselmacher24.de';

/** Feste Seiten. Neue Routen hier ergänzen. */
const STATIC_ROUTES: Array<{ path: string; priority: number }> = [
  { path: '', priority: 1 },
  { path: '/autoschluessel', priority: 0.9 },
  { path: '/autoschluessel/nachmachen', priority: 0.8 },
  { path: '/autoschluessel/programmieren', priority: 0.8 },
  { path: '/autoschluessel/kopieren', priority: 0.7 },
  { path: '/autoschluessel/funkschluessel', priority: 0.7 },
  { path: '/autoschluessel/smart-key', priority: 0.7 },
  { path: '/autoschluessel/schluesselbart-fraesen', priority: 0.7 },
  { path: '/autoschluessel/fahrzeugoeffnung', priority: 0.7 },
  { path: '/autoschluessel/marken', priority: 0.7 },
  { path: '/autoschluessel/anfrage', priority: 0.9 },
  { path: '/schluessel-nach-vorlage', priority: 0.8 },
  { path: '/schluessel-nach-vorlage/anfrage', priority: 0.7 },
  { path: '/schluessel-nach-code', priority: 0.8 },
  { path: '/gleichschliessende-zylinder', priority: 0.8 },
  { path: '/gleichschliessende-zylinder/konfigurator', priority: 0.7 },
  { path: '/schliessanlagen', priority: 0.8 },
  { path: '/schliessanlagen/konfigurator', priority: 0.7 },
  { path: '/elektronische-zutrittsloesungen', priority: 0.8 },
  { path: '/elektronische-zutrittsloesungen/konfigurator', priority: 0.7 },
  { path: '/tuer-und-schliesstechnik', priority: 0.8 },
  { path: '/sicherheitstechnik', priority: 0.8 },
  { path: '/sicherheitstechnik/sicherheitscheck', priority: 0.7 },
  { path: '/service-und-termin', priority: 0.6 },
  { path: '/service-und-termin/anfrage', priority: 0.6 },
  { path: '/service-und-termin/kontakt', priority: 0.6 },
  { path: '/service-und-termin/terminstatus', priority: 0.4 },
  { path: '/service-und-termin/vor-ort', priority: 0.6 },
  { path: '/ratgeber', priority: 0.6 },
  { path: '/standorte', priority: 0.6 },
  { path: '/rechtliches/impressum', priority: 0.2 },
  { path: '/rechtliches/datenschutz', priority: 0.2 },
  { path: '/rechtliches/widerruf', priority: 0.2 },
  { path: '/rechtliches/agb', priority: 0.2 },
  { path: '/rechtliches/versand-und-zahlung', priority: 0.3 },
  { path: '/rechtliches/cookie-einstellungen', priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [makes, codeLines, servicePages, guides, cities] = await Promise.all([
    getVehicleMakes(),
    getCodeLines(),
    getServicePages(),
    getGuides(),
    getCities(),
  ]);

  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: route.priority,
  }));

  for (const make of makes) {
    entries.push({
      url: `${siteUrl}/autoschluessel/marken/${make.slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
    for (const model of make.models) {
      entries.push({
        url: `${siteUrl}/autoschluessel/marken/${make.slug}/${model.slug}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
  }

  for (const line of codeLines) {
    entries.push({
      url: `${siteUrl}/schluessel-nach-code/${line.slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  for (const page of servicePages) {
    entries.push({
      url: `${siteUrl}/${page.area}/${page.slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  for (const guide of guides) {
    entries.push({
      url: `${siteUrl}/ratgeber/${guide.slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  }

  for (const city of cities) {
    entries.push({
      url: `${siteUrl}/standorte/${city.slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  }

  return entries;
}
