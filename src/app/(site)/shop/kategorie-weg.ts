import type { ShopKategorie } from '@/lib/types';
import { LEISTUNGS_ANFRAGE_PFAD, artikelAnfragePfad } from '@/lib/artikel';
import { HINWEIS_PRODUKTE_FOLGEN } from '@/lib/data/defaults/kategorien';
import { istBestellbar, kategorieKette } from '@/lib/data/shop';
import type { Verfuegbarkeit } from '@/lib/types';
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

/** Liste der Gehäuse und Ersatzteile (FA-SHOP-02B): Ziel einer Anfrage-Kategorie, das Produkte zeigen kann. */
export const TEILELISTE_PFAD = '/autoschluessel/gehaeuse/teile';

/** Führt die Adresse auf die Liste der Gehäuse und Ersatzteile (mit oder ohne Filter dahinter)? */
export function istTeileliste(ziel: string): boolean {
  return ziel.split(/[?#]/)[0] === TEILELISTE_PFAD;
}

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
        // Der Hinweis („Bitte fragen Sie bei uns an.“) gilt nur, solange das Ziel keine bestellbaren Produkte
        // zeigt (Liste der Gehäuse und Ersatzteile); danach heißt der Knopf „Ansehen“.
        const mitHinweis = Boolean(kategorie.hinweis) && anzahl === 0;
        const label = mitHinweis || kategorie.ziel.endsWith('/anfrage') ? 'Anfragen' : 'Ansehen';
        return { href: kategorie.ziel, label, ...(mitHinweis ? { hinweis: kategorie.hinweis } : {}) };
      }
      return { href: artikelAnfragePfad(kategorie.name, kategorie.ziel), label: 'Anfragen', ...(kategorie.hinweis ? { hinweis: kategorie.hinweis } : {}) };
    }
  }
}

/**
 * Zahl der Produkte je Hauptkategorie: Produkte dieser Kategorie und ihrer Unterkategorien. Ein Produkt
 * ohne Kategorie zählt zur ersten Hauptkategorie seiner Art (Codeprodukte oder Artikel), so wie die
 * Listen es zeigen. Eine Anfrage-Kategorie mit der Liste der Gehäuse und Ersatzteile als Ziel zählt die
 * bestellbaren Fahrzeugteile (ohne Beispiele), so wie die Liste sie zeigt. Andere Arten haben keine Produkte.
 */
export function anzahlJeKategorie(
  kategorien: ShopKategorie[],
  haupt: Array<Pick<ShopKategorie, 'id' | 'art'> & Partial<Pick<ShopKategorie, 'ziel'>>>,
  produkte: {
    codeprodukte: Array<{ categoryId?: string }>;
    artikel: Array<{ categoryId?: string; fahrzeugteil?: unknown; example?: boolean; availability?: Verfuegbarkeit | null }>;
  },
): Map<string, number> {
  const ergebnis = new Map<string, number>();
  for (const kategorie of haupt) {
    if (kategorie.art === 'anfrage' && kategorie.ziel && istTeileliste(kategorie.ziel)) {
      ergebnis.set(kategorie.id, produkte.artikel.filter((a) => Boolean(a.fahrzeugteil) && istBestellbar(a)).length);
      continue;
    }
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
