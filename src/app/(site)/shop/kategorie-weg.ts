import type { ShopKategorie } from '@/lib/types';
import { LEISTUNGS_ANFRAGE_PFAD, artikelAnfragePfad } from '@/lib/artikel';
import { HINWEIS_PRODUKTE_FOLGEN } from '@/lib/data/defaults/kategorien';
import { kategorieKette } from '@/lib/data/shop';
import { CODE_ANFRAGE_PFAD } from '@/lib/wege/code-anfrage';

/* ==========================================================================
   Weg einer Shop-Kategorie (FA-SHOP-01B, Punkt 1 und 4): wohin der Verweis
   führt und was die Kategorie sagt, solange sie keine Produkte hat. Reine
   Funktion, ohne Server-Abhängigkeiten.
   ========================================================================== */

/** Titel und Beschreibung der Übersicht `/shop`; Längen geprüft in `kategorie-weg.test.ts`. */
export const SHOP_SEO = {
  title: 'Shop: alle Kategorien im Überblick',
  description:
    'Schlüssel nach Code, Schlüssel nach Vorlage, Zylinder und Zubehör: Hier sehen Sie, was Sie direkt bestellen und was Sie bei uns anfragen können.',
} as const;

/**
 * Anfrage zu einer Leistung, Thema Autoschlüssel, Anliegen „Frage“. Steht als Ziel in den Daten
 * („Autoschlüssel als Produkte“); die frühere Sonderregel für Autoschlüssel-Kategorien ohne Thema
 * entfällt, seit Gehäuse, Reparatur und Customizing eigene Seiten haben (FA-SHOP-02B, Punkt 5).
 */
export const AUTOSCHLUESSEL_FRAGE_PFAD = `${LEISTUNGS_ANFRAGE_PFAD}?thema=autoschluessel&anliegen=frage`;

export interface KategorieWeg {
  href: string;
  label: string;
  /** Satz über den Zustand, nur ohne Produkte (und nicht beim Konfigurator). */
  hinweis?: string;
}

/** Ist die Adresse die Anfrage zu einer Leistung (mit oder ohne Angaben dahinter)? */
function istLeistungsAnfrage(ziel: string): boolean {
  return ziel === LEISTUNGS_ANFRAGE_PFAD || ziel.startsWith(`${LEISTUNGS_ANFRAGE_PFAD}?`);
}

/**
 * Weg einer Kategorie mit `anzahl` sichtbaren Produkten:
 * - Codeprodukte: mit Produkten die Produktliste, sonst „Code anfragen“.
 * - Artikel: mit Produkten die Artikelliste, sonst „Artikel anfragen“ mit dem Kategorienamen.
 * - Konfigurator: immer der Konfigurator.
 * - Anfrage: das gepflegte Ziel; führt es in die Anfrage zu einer Leistung, übernimmt sie den
 *   Kategorienamen.
 */
export function kategorieWeg(kategorie: Pick<ShopKategorie, 'id' | 'name' | 'art' | 'ziel' | 'hinweis'>, anzahl: number): KategorieWeg {
  const hinweis = anzahl > 0 ? undefined : kategorie.hinweis?.trim() || HINWEIS_PRODUKTE_FOLGEN;
  switch (kategorie.art) {
    case 'codeprodukte':
      return anzahl > 0
        ? { href: kategorie.ziel, label: 'Zu den Produkten' }
        : { href: CODE_ANFRAGE_PFAD, label: 'Code anfragen', hinweis };
    case 'artikel':
      return anzahl > 0
        ? { href: kategorie.ziel, label: 'Zu den Artikeln' }
        : { href: artikelAnfragePfad(kategorie.name), label: 'Artikel anfragen', hinweis };
    case 'konfigurator':
      return { href: kategorie.ziel, label: 'Zum Konfigurator' };
    default: {
      if (!istLeistungsAnfrage(kategorie.ziel)) {
        // Mit Hinweis („Bitte fragen Sie bei uns an.“) heißt der Knopf wie der Weg, den der Satz nennt.
        const label = kategorie.hinweis || kategorie.ziel.endsWith('/anfrage') ? 'Anfragen' : 'Ansehen';
        return { href: kategorie.ziel, label, ...(kategorie.hinweis ? { hinweis: kategorie.hinweis } : {}) };
      }
      return { href: artikelAnfragePfad(kategorie.name, kategorie.ziel), label: 'Anfragen', ...(kategorie.hinweis ? { hinweis: kategorie.hinweis } : {}) };
    }
  }
}

/**
 * Zahl der Produkte je Hauptkategorie: Produkte dieser Kategorie und ihrer Unterkategorien. Ein Produkt
 * ohne Kategorie zählt zur ersten Hauptkategorie seiner Art (Codeprodukte oder Artikel), so wie die
 * Listen es zeigen. Andere Arten haben keine Produkte.
 */
export function anzahlJeKategorie(
  kategorien: ShopKategorie[],
  haupt: Array<Pick<ShopKategorie, 'id' | 'art'>>,
  produkte: { codeprodukte: Array<{ categoryId?: string }>; artikel: Array<{ categoryId?: string }> },
): Map<string, number> {
  const ergebnis = new Map<string, number>();
  for (const kategorie of haupt) {
    if (kategorie.art !== 'codeprodukte' && kategorie.art !== 'artikel') {
      ergebnis.set(kategorie.id, 0);
      continue;
    }
    const erste = haupt.find((k) => k.art === kategorie.art)?.id === kategorie.id;
    const zahl = produkte[kategorie.art].filter((p) =>
      p.categoryId ? kategorieKette(kategorien, p.categoryId).some((glied) => glied.id === kategorie.id) : erste,
    ).length;
    ergebnis.set(kategorie.id, zahl);
  }
  return ergebnis;
}
