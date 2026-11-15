import type { MetadataRoute } from 'next';

import { eigeneSeiteAdresse } from '@/payload/hooks/seiten-adresse-pruefung';

import { artikelPfad, istIndexierbar } from '@/lib/artikel';
import {
  getCities,
  getCodeLines,
  getCollection,
  getGuides,
  getHersteller,
  getKategorien,
  getRubriken,
  getServicePages,
  getVehicleMakes,
} from '@/lib/data';
import {
  codeKategorien,
  codelinieIndexierbar,
  codelinienPfad,
  herstellerMitSeite,
  herstellerPfad,
  kategoriePfad,
} from '@/lib/codelinie';
import { markeIndexierbar, modellIndexierbar } from '@/lib/fahrzeug-texte';
import { KLASSE_RUBRIK } from '@/components/fahrzeug-anfrage/seiten';
import { ANFRAGE_FORMULAR, FORMULAR_KLASSEN, type FormularKlasse } from '@/lib/fahrzeuge/anfrage-klassen';
import { GEWINNUNG_SEITEN } from '@/lib/partner/gewinnung';
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
  { path: '/schluessel-einschicken/anmelden', priority: 0.7 },
  { path: '/motorradschluessel', priority: 0.7 },
  { path: '/motorradschluessel/anfrage', priority: 0.6 },
  { path: '/autoschluessel/gehaeuse', priority: 0.7 },
  { path: '/autoschluessel/gehaeuse/anfrage', priority: 0.6 },
  { path: '/beratung', priority: 0.6 },
  { path: '/schluessel-einschicken', priority: 0.7 },
  { path: '/schluessel-nach-code', priority: 0.8 },
  { path: '/gleichschliessende-zylinder', priority: 0.8 },
  { path: '/gleichschliessende-zylinder/konfigurator', priority: 0.7 },
  { path: '/schliessanlagen', priority: 0.8 },
  { path: '/schliessanlagen/konfigurator', priority: 0.7 },
  { path: '/schliessanlagen/konfigurator/schliessplan', priority: 0.7 },
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
  // Partnergewinnung (FA-08-05 bis FA-08-08): Pfade aus den Seitendaten.
  ...GEWINNUNG_SEITEN.map((seite) => ({ path: seite.pfad, priority: 0.4 })),
  { path: '/ratgeber', priority: 0.6 },
  { path: '/rechtliches/versand-und-zahlung', priority: 0.3 },
  // Übersicht der Shop-Kategorien (FA-SHOP-01B).
  { path: '/shop', priority: 0.7 },
];

/**
 * Seiten einer Klasse mit ausgeschaltetem Schalter `indexierbar` oder mit einer Rubrik, die nicht live ist
 * (noindex, FA-KERN-05): Sie fehlen in der Sitemap, auch wenn sie unter den festen Seiten stehen (Motorrad).
 */
function gesperrteKlassenSeiten(nichtLive: ReadonlySet<FormularKlasse>): Set<string> {
  return new Set(
    FORMULAR_KLASSEN.filter((klasse) => !ANFRAGE_FORMULAR[klasse].indexierbar || nichtLive.has(klasse)).flatMap((klasse) => {
      const { einstieg, anfrage } = ANFRAGE_FORMULAR[klasse];
      return [...(einstieg ? [einstieg] : []), anfrage];
    }),
  );
}

/**
 * Seiten der gemeinsamen Fahrzeugschlüssel-Anfrage (FA-KERN-02B): Einstiegsseite und Anfrage je Klasse, nur
 * wenn ihr Schalter `indexierbar` an ist (sonst noindex). Was schon unter den festen Seiten steht (Motorrad),
 * kommt nicht doppelt.
 */
function klassenSeiten(nichtLive: ReadonlySet<FormularKlasse>): Array<{ path: string; priority: number }> {
  const fest = new Set(STATIC_ROUTES.map((route) => route.path));
  return FORMULAR_KLASSEN.filter((klasse) => ANFRAGE_FORMULAR[klasse].indexierbar && !nichtLive.has(klasse))
    .flatMap((klasse) => {
      const { einstieg, anfrage } = ANFRAGE_FORMULAR[klasse];
      return [...(einstieg ? [{ path: einstieg, priority: 0.7 }] : []), { path: anfrage, priority: 0.6 }];
    })
    .filter((route) => !fest.has(route.path));
}

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
  const [makes, codeLines, articles, servicePages, guides, cities, pages, rubriken, kategorien, stamm] = await Promise.all([
    getVehicleMakes(),
    getCodeLines(),
    getCollection('standardArticles'),
    getServicePages(),
    getGuides(),
    getCities(),
    getCollection('pages'),
    getRubriken(),
    getKategorien(),
    getHersteller(),
  ]);

  // Klassen, deren Rubrik nicht live ist (FA-KERN-05). „Nicht gefunden“ gehört zu den Autoschlüsseln.
  const live = new Set(rubriken.filter((r) => r.status === 'live').map((r) => r.id));
  const nichtLive = new Set(FORMULAR_KLASSEN.filter((klasse) => !live.has(KLASSE_RUBRIK[klasse])));

  const seitenStand = new Map(pages.map((page) => [page.route, page.updatedAt]));

  const gesperrt = gesperrteKlassenSeiten(nichtLive);
  const entries: MetadataRoute.Sitemap = [...STATIC_ROUTES.filter((route) => !gesperrt.has(route.path)), ...klassenSeiten(nichtLive)].map((route) => ({
    url: `${siteUrl}${route.path}`,
    ...geaendert(seitenStand.get(route.path.replace(/^\//, ''))),
    changeFrequency: 'weekly',
    priority: route.priority,
  }));

  // Eigene Inhaltsseiten des Betreibers (FA-KERN-05): nur, wenn „Nicht in Suchmaschinen aufnehmen“ aus ist.
  for (const page of pages) {
    if (eigeneSeiteAdresse([page.route]) && !page.seo?.noindex) {
      entries.push({ url: `${siteUrl}/${page.route}`, ...geaendert(page.updatedAt), changeFrequency: 'monthly', priority: 0.4 });
    }
  }

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

  // Unterkategorien aus den Daten und Hersteller: nur sichtbare mit mindestens einer indexierbaren Linie
  // (keine leeren Seiten, keine Beispiele); eigenes noindex der Kategorie gilt auch hier.
  for (const { kategorie, lines } of codeKategorien(kategorien, indexierbareLinien)) {
    if (lines.length === 0 || kategorie.seo?.noindex) continue;
    entries.push({
      url: `${siteUrl}${kategoriePfad(kategorie.slug)}`,
      ...zuletzt(lines),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }
  for (const hersteller of herstellerMitSeite(indexierbareLinien, stamm)) {
    entries.push({
      url: `${siteUrl}${herstellerPfad(hersteller.adresse)}`,
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
