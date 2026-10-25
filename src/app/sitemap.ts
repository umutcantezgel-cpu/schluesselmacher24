import type { MetadataRoute } from 'next';

import { artikelPfad, istIndexierbar } from '@/lib/artikel';
import {
  getCities,
  getCodeLines,
  getCollection,
  getGuides,
  getServicePages,
  getVehicleMakes,
} from '@/lib/data';
import {
  codeFamilien,
  codeHersteller,
  codelinieIndexierbar,
  codelinienPfad,
  herstellerPfad,
  kategoriePfad,
} from '@/lib/codelinie';
import { markeIndexierbar, modellIndexierbar } from '@/lib/fahrzeug-texte';
import { stadtIndexierbar } from '@/lib/rechtliches/indexierung';
import { getSiteUrl } from '@/lib/site-url';
import type { CodeLine } from '@/lib/types';

const siteUrl = getSiteUrl();

/**
 * Feste Seiten. Neue Routen hier ergänzen. Seiten mit noindex (Impressum,
 * Datenschutz, AGB, Widerruf, Cookie-Einstellungen, Terminstatus, Kasse)
 * gehören nicht hierher — sonst widersprechen sich Sitemap und Seite.
 * `/artikel` kommt nur hinzu, wenn es echte (indexierbare) Artikel gibt.
 */
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
  { path: '/schluessel-einschicken', priority: 0.7 },
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
  { path: '/service-und-termin/vor-ort', priority: 0.6 },
  { path: '/partner-werden', priority: 0.4 },
  { path: '/ratgeber', priority: 0.6 },
  { path: '/rechtliches/versand-und-zahlung', priority: 0.3 },
];

/**
 * Letzte Änderung aus `updatedAt`, wo die Daten sie kennen; sonst keine
 * Angabe (ein erfundenes „heute“ hilft Suchmaschinen nicht).
 */
function geaendert(...werte: Array<string | undefined>): { lastModified: Date } | Record<string, never> {
  const zeiten = werte
    .map((wert) => (wert ? Date.parse(wert) : Number.NaN))
    .filter((zeit) => Number.isFinite(zeit));
  return zeiten.length ? { lastModified: new Date(Math.max(...zeiten)) } : {};
}

const zuletzt = (lines: CodeLine[]) => geaendert(...lines.map((line) => line.updatedAt));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [makes, codeLines, articles, servicePages, guides, cities, pages] = await Promise.all([
    getVehicleMakes(),
    getCodeLines(),
    getCollection('standardArticles'),
    getServicePages(),
    getGuides(),
    getCities(),
    getCollection('pages'),
  ]);

  const seitenStand = new Map(pages.map((page) => [page.route, page.updatedAt]));

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route.path}`,
    ...geaendert(seitenStand.get(route.path.replace(/^\//, ''))),
    changeFrequency: 'weekly',
    priority: route.priority,
  }));

  for (const make of makes) {
    if (markeIndexierbar(make)) {
      entries.push({
        url: `${siteUrl}/autoschluessel/marken/${make.slug}`,
        ...geaendert(make.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
    // `noindex` je Modell aus dem Backend: Seite und Sitemap.
    for (const model of make.models.filter(modellIndexierbar)) {
      entries.push({
        url: `${siteUrl}/autoschluessel/marken/${make.slug}/${model.slug}`,
        ...geaendert(make.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
  }

  // Seiten mit noindex gehören nicht in die Sitemap — Beispiele nie.
  const indexierbareLinien = codeLines.filter(codelinieIndexierbar);
  for (const line of indexierbareLinien) {
    entries.push({
      url: `${siteUrl}${codelinienPfad(line)}`,
      ...geaendert(line.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  // Kategorien (Anwendungsfamilien) und Hersteller — Hersteller erst, wenn einer gepflegt ist.
  for (const familie of codeFamilien(indexierbareLinien)) {
    entries.push({
      url: `${siteUrl}${kategoriePfad(familie.name)}`,
      ...zuletzt(familie.lines),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }
  for (const hersteller of codeHersteller(indexierbareLinien)) {
    entries.push({
      url: `${siteUrl}${herstellerPfad(hersteller.name)}`,
      ...zuletzt(hersteller.lines),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  const echteArtikel = articles.filter(istIndexierbar);
  const artikelSeite = pages.find((page) => page.route === 'artikel');
  if (echteArtikel.length > 0 && !artikelSeite?.seo.noindex) {
    entries.push({ url: `${siteUrl}/artikel`, changeFrequency: 'weekly', priority: 0.7 });
  }
  for (const article of echteArtikel) {
    entries.push({
      url: `${siteUrl}${artikelPfad(article.slug)}`,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  for (const page of servicePages.filter((p) => !p.seo.noindex)) {
    entries.push({
      url: `${siteUrl}/${page.area}/${page.slug}`,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  for (const guide of guides) {
    entries.push({
      url: `${siteUrl}/ratgeber/${guide.slug}`,
      ...geaendert(guide.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  }

  // Einsatzgebiete nur ohne Platzhalter; die Übersicht nur, wenn es mindestens eins gibt.
  const gebiete = cities.filter(stadtIndexierbar);
  if (gebiete.length > 0) {
    entries.push({
      url: `${siteUrl}/standorte`,
      ...geaendert(...gebiete.map((city) => city.updatedAt)),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }
  for (const city of gebiete) {
    entries.push({
      url: `${siteUrl}/standorte/${city.slug}`,
      ...geaendert(city.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  }

  return entries;
}
