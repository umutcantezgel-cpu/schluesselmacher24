import type { ShopKategorie } from '@/lib/types';
import { LEISTUNGS_ANFRAGE_PFAD, artikelAnfragePfad } from '@/lib/artikel';
import { HINWEIS_PRODUKTE_FOLGEN } from '@/lib/data/defaults/kategorien';
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

/** Anfrage zu einer Leistung, Thema Autoschlüssel, Anliegen „Frage“. */
export const AUTOSCHLUESSEL_FRAGE_PFAD = `${LEISTUNGS_ANFRAGE_PFAD}?thema=autoschluessel&anliegen=frage`;

/**
 * Kategorien, deren gepflegtes Ziel die allgemeine Anfrage ohne Thema ist, die aber zum Anliegen
 * Autoschlüssel gehören (Vorgabe des Orchestrators zu FA-SHOP-01B, Punkt 4). Steht im Backend ein
 * Ziel mit Thema, gilt dieses.
 */
const AUTOSCHLUESSEL_KATEGORIEN = new Set(['autoschluessel-produkte', 'customizing-und-modifikation']);

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
 *   Kategorienamen, und ohne Thema gilt bei Autoschlüssel-Kategorien das Thema Autoschlüssel.
 */
export function kategorieWeg(kategorie: Pick<ShopKategorie, 'id' | 'name' | 'art' | 'ziel' | 'hinweis'>, anzahl: number): KategorieWeg {
  const hinweis = anzahl > 0 ? undefined : kategorie.hinweis?.trim() || HINWEIS_PRODUKTE_FOLGEN;
  switch (kategorie.art) {
    case 'codeprodukte':
      return anzahl > 0
        ? { href: kategorie.ziel, label: 'Zu den Codeprodukten' }
        : { href: CODE_ANFRAGE_PFAD, label: 'Code anfragen', hinweis };
    case 'artikel':
      return anzahl > 0
        ? { href: kategorie.ziel, label: 'Zu den Artikeln' }
        : { href: artikelAnfragePfad(kategorie.name), label: 'Artikel anfragen', hinweis };
    case 'konfigurator':
      return { href: kategorie.ziel, label: 'Zum Konfigurator' };
    default: {
      if (!istLeistungsAnfrage(kategorie.ziel)) {
        return { href: kategorie.ziel, label: kategorie.ziel.endsWith('/anfrage') ? 'Anfragen' : 'Ansehen', ...(kategorie.hinweis ? { hinweis: kategorie.hinweis } : {}) };
      }
      const basis = kategorie.ziel === LEISTUNGS_ANFRAGE_PFAD && AUTOSCHLUESSEL_KATEGORIEN.has(kategorie.id) ? AUTOSCHLUESSEL_FRAGE_PFAD : kategorie.ziel;
      return { href: artikelAnfragePfad(kategorie.name, basis), label: 'Anfragen', ...(kategorie.hinweis ? { hinweis: kategorie.hinweis } : {}) };
    }
  }
}
