import Link from 'next/link';

import type { ShopKategorie, StandardArticle } from '@/lib/types';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

import type { ListenArtikel } from './artikel-liste';

/* Gemeinsame Teile der Artikellisten `/artikel` und `/artikel/kategorie/…` (FA-10-10): dieselben Karten,
   derselbe Beispielhinweis, dieselben Verweise auf Unterkategorien. */

/** Nur die Felder, die die Karten brauchen, gehen an den Browser. */
export function zuListenArtikel(a: StandardArticle): ListenArtikel {
  return {
    id: a.id,
    slug: a.slug,
    name: a.name,
    description: a.description,
    manufacturer: a.manufacturer,
    priceCents: a.priceCents,
    bulkPrices: a.bulkPrices,
    maxQty: a.maxQty,
    image: a.image,
    tags: a.tags,
    example: a.example,
    ...(a.availability ? { availability: a.availability } : {}),
    deliveryTime: a.deliveryTime,
  };
}

/** Beispielhinweis als Zeile mit Glyphe direkt über der Liste (K-006 „Flächen sparsam“), kein Kasten im Kopf. */
export function BeispielHinweis({ beispiele, gesamt }: { beispiele: number; gesamt: number }) {
  if (beispiele === 0) return null;
  const nurBeispiele = gesamt > 0 && beispiele === gesamt;
  return (
    <div role="note" className="flex max-w-measure gap-3 text-small leading-relaxed">
      <GlyphInfo size={18} className="mt-0.5 shrink-0 text-info" />
      <div className="min-w-0">
        <p className="font-semibold text-foreground">
          {nurBeispiele ? 'Derzeit nur Beispielartikel' : 'Beispielartikel sind gekennzeichnet'}
        </p>
        <p className="text-foreground-muted">
          Artikel mit dem Hinweis „Beispiel“ zeigen nur, wie Artikel hier dargestellt werden.
          Preise und Angaben sind Beispielwerte. Diese Artikel können Sie nicht bestellen.
        </p>
      </div>
    </div>
  );
}

/** Verweise auf die Unterkategorien mit Artikeln; ohne solche erscheint nichts. */
export function UnterkategorienListe({ eintraege }: { eintraege: Array<{ kategorie: ShopKategorie; href: string; anzahl: number }> }) {
  if (eintraege.length === 0) return null;
  return (
    <nav aria-label="Unterkategorien" className="mt-6">
      <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">Unterkategorien</p>
      <ul className="mt-3 border-t border-border">
        {eintraege.map(({ kategorie, href, anzahl }) => (
          <li key={kategorie.id} className="border-b border-border">
            <Link
              href={href}
              prefetch={false}
              className="group flex min-h-touch items-center justify-between gap-4 py-3 text-body font-semibold text-foreground transition-colors duration-quick hover:text-primary"
            >
              <span>
                {kategorie.name}
                <span className="ml-2 font-mono text-caption font-normal tabular-nums text-foreground-muted">
                  {anzahl} Artikel
                </span>
              </span>
              <GlyphPfeilRechts
                size={16}
                className="shrink-0 text-foreground-muted transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1 group-hover:text-primary"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
