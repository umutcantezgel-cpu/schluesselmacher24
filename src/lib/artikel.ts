import type { Graph, Product } from 'schema-dts';

import { formatCents, formatNumber } from '@/lib/format';
import { unitPriceForCodeLine } from '@/lib/pricing';
import { getSiteUrl } from '@/lib/site-url';
import type { ShippingOption, StandardArticle } from '@/lib/types';

/* ==========================================================================
   Standardartikel — reine Hilfsfunktionen für Übersicht, Detailseite,
   strukturierte Daten und Sitemap. Laufen im Browser wie auf dem Server.
   Preise kommen ausschließlich aus dem Artikel; es gilt dieselbe
   Staffelregel wie beim Absenden der Bestellung (`unitPriceForCodeLine`).
   ========================================================================== */

type Preisdaten = Pick<StandardArticle, 'priceCents' | 'bulkPrices' | 'maxQty'>;

export interface Preisstufe {
  minQty: number;
  priceCents: number;
}

export function artikelPfad(slug: string): string {
  return `/artikel/${slug}`;
}

/**
 * Stückpreise nach Menge, aufsteigend ab 1 Stück.
 *
 * Jede Stufe wird mit derselben Regel berechnet wie im Warenkorb und beim
 * Absenden — so kann die Tabelle nie einen anderen Preis nennen als die
 * Kasse. Staffeln oberhalb der Höchstmenge sind nicht bestellbar und
 * entfallen; Stufen ohne Preisänderung ebenso.
 */
export function preisstufen(article: Preisdaten): Preisstufe[] {
  const schwellen = [
    ...new Set([1, ...(article.bulkPrices ?? []).map((s) => s.minQty)]),
  ]
    .filter((menge) => Number.isInteger(menge) && menge >= 1 && menge <= Math.max(1, article.maxQty))
    .sort((a, b) => a - b);

  const stufen: Preisstufe[] = [];
  for (const minQty of schwellen) {
    const priceCents = unitPriceForCodeLine(article, minQty);
    if (stufen[stufen.length - 1]?.priceCents === priceCents) continue;
    stufen.push({ minQty, priceCents });
  }
  return stufen;
}

/** Index der Stufe, die für die gewählte Menge gilt. */
export function aktiveStufe(stufen: Preisstufe[], menge: number): number {
  return stufen.reduce((treffer, stufe, index) => (menge >= stufe.minQty ? index : treffer), 0);
}

export interface PreisAb {
  /** Niedrigster bestellbarer Stückpreis. */
  cents: number;
  /** Preis für ein Stück. */
  einzelCents: number;
  /** Nur gesetzt, wenn eine Staffel tatsächlich günstiger ist als ein Stück. */
  ab: boolean;
  /** Ab welcher Stückzahl der niedrigste Preis gilt. */
  abMenge: number;
}

/** Niedrigster bestellbarer Stückpreis und ab welcher Menge er gilt. */
export function preisAb(article: Preisdaten): PreisAb {
  const stufen = preisstufen(article);
  const einzel = stufen[0] ?? { minQty: 1, priceCents: article.priceCents };
  const guenstigste = stufen.reduce((best, s) => (s.priceCents < best.priceCents ? s : best), einzel);
  return {
    cents: guenstigste.priceCents,
    einzelCents: einzel.priceCents,
    ab: guenstigste.priceCents < einzel.priceCents,
    abMenge: guenstigste.minQty,
  };
}

/** Preis für die Artikelkarte, z. B. „ab 36,00 €“. */
export function preisAbText(article: Preisdaten): string {
  const { cents, ab } = preisAb(article);
  return ab ? `ab ${formatCents(cents)}` : formatCents(cents);
}

/**
 * Staffelpreise als Satz, z. B. „Einzelpreis 40,00 € je Stück, ab 5 Stück
 * 36,00 € je Stück.“ — `null`, wenn es keine Staffel gibt.
 */
export function staffelText(article: Preisdaten, beispiel = false): string | null {
  const stufen = preisstufen(article);
  if (stufen.length < 2) return null;
  const [einzel, ...staffeln] = stufen;
  const teile = staffeln.map(
    (s) => `ab ${formatNumber(s.minQty)} Stück ${formatCents(s.priceCents)} je Stück`,
  );
  const anfang = beispiel ? 'Beispielpreise: Einzelpreis' : 'Einzelpreis';
  return `${anfang} ${formatCents(einzel.priceCents)} je Stück, ${teile.join(', ')}.`;
}

/**
 * Text gekürzt an einer Wortgrenze, z. B. für die Meta-Beschreibung, wenn
 * im Backend keine eigene gepflegt ist.
 */
export function kurztext(text: string, max = 160): string {
  const sauber = text.replace(/\s+/g, ' ').trim();
  if (sauber.length <= max) return sauber;
  const schnitt = sauber.slice(0, max - 1);
  const grenze = schnitt.lastIndexOf(' ');
  const basis = grenze > max * 0.6 ? schnitt.slice(0, grenze) : schnitt;
  return `${basis.replace(/[\s,;:.–—-]+$/, '')}…`;
}

/** Versandarten, die für diesen Artikel allein in Frage kommen. */
export function versandartenFuer(
  article: Pick<StandardArticle, 'shippingClass'>,
  shipping: ShippingOption[],
): ShippingOption[] {
  return shipping.filter((option) => option.productClasses.includes(article.shippingClass));
}

/* ---------- Übersicht: Reihenfolge und Filter --------------------------- */

/**
 * Echte Artikel vor Beispielartikeln, sonst in der gepflegten Reihenfolge.
 * So verdrängen die Beispiele keine bestellbaren Artikel.
 */
export function sortiereArtikel<T extends Pick<StandardArticle, 'example'>>(articles: T[]): T[] {
  return [
    ...articles.filter((a) => !a.example),
    ...articles.filter((a) => a.example),
  ];
}

/** Alle Schlagworte, alphabetisch und ohne Doppelungen. */
export function schlagworte(articles: Pick<StandardArticle, 'tags'>[]): string[] {
  const alle = articles.flatMap((a) => a.tags.map((tag) => tag.trim()).filter(Boolean));
  return [...new Set(alle)].sort((a, b) => a.localeCompare(b, 'de'));
}

export interface ArtikelFilter {
  suche?: string;
  /** Ausgewählte Schlagworte — ein Treffer genügt. */
  schlagworte?: string[];
}

type FilterDaten = Pick<StandardArticle, 'name' | 'description' | 'manufacturer' | 'tags'>;

/**
 * Freitext und Schlagworte. Mehrere Suchwörter müssen alle passen, von den
 * gewählten Schlagworten genügt eines — so grenzt die Suche ein, während die
 * Schlagworte das Angebot thematisch öffnen.
 */
export function filterArtikel<T extends FilterDaten>(articles: T[], filter: ArtikelFilter): T[] {
  const woerter = (filter.suche ?? '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  const gewaehlt = new Set(filter.schlagworte ?? []);

  return articles.filter((article) => {
    if (gewaehlt.size > 0 && !article.tags.some((tag) => gewaehlt.has(tag.trim()))) return false;
    if (woerter.length === 0) return true;
    const heuhaufen = [article.name, article.description, article.manufacturer, ...article.tags]
      .join(' ')
      .toLowerCase();
    return woerter.every((wort) => heuhaufen.includes(wort));
  });
}

/* ---------- Suchmaschinen ----------------------------------------------- */

/** Darf der Artikel in Suchmaschinen und in die Sitemap? */
export function istIndexierbar(article: Pick<StandardArticle, 'example' | 'seo'>): boolean {
  return !article.example && !article.seo.noindex;
}

function absoluteUrl(url: string, siteUrl: string): string {
  if (/^https?:\/\//.test(url)) return url;
  return `${siteUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

/**
 * Produkt mit Angebot für die strukturierten Daten — nur für echte Artikel.
 * Beispielartikel sind nicht bestellbar; ein Angebot wäre eine falsche
 * Aussage. Bewertungen und Marken werden nicht ergänzt: Eine Marke erscheint
 * nur, wenn ein Hersteller gepflegt ist.
 */
export function produktJsonLd(
  article: StandardArticle,
  siteUrl: string = getSiteUrl(),
): Graph | null {
  if (article.example) return null;

  const pageUrl = `${siteUrl}${artikelPfad(article.slug)}`;
  const bilder = [
    article.image.bild?.url,
    ...article.gallery.map((bild) => bild.url),
  ]
    .filter((url): url is string => Boolean(url))
    .map((url) => absoluteUrl(url, siteUrl));
  const hersteller = article.manufacturer.trim();

  const produkt: Product = {
    '@type': 'Product',
    '@id': `${pageUrl}#product`,
    name: article.name,
    description: article.description,
    url: pageUrl,
    mainEntityOfPage: { '@id': `${pageUrl}#webpage` },
    ...(bilder.length ? { image: bilder } : {}),
    // Platzhalter stehen in eckigen Klammern und sind keine Marke.
    ...(hersteller && !hersteller.startsWith('[')
      ? { brand: { '@type': 'Brand', name: hersteller } }
      : {}),
    offers: {
      '@type': 'Offer',
      // Preis für ein Stück, so wie ihn die Kasse berechnet.
      price: (unitPriceForCodeLine(article, 1) / 100).toFixed(2),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
      seller: { '@id': `${siteUrl}/#organization` },
    },
  };

  return { '@context': 'https://schema.org', '@graph': [produkt] };
}
