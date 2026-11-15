import type { HerstellerBereichArt, ImageSlot, MediaImage, ShopHersteller } from '@/lib/types';

/*
 * Hersteller nach Bereich (FA-INHALT-02, Abschnitte 15, 17 und 19 der
 * Arbeitsanweisung): Welcher Hersteller in welchem Bereich erscheint und wofür
 * seine Systeme dort eingesetzt werden. Seit FA-SHOP-04 kommt beides aus den
 * Daten (Sammlung „Hersteller“, Feld „Bereiche“); der Betrieb pflegt es im
 * Admin. Startwerte in `content/hersteller.json` und
 * `src/lib/data/defaults/hersteller.ts`.
 *
 * Einsatztexte nur aus Herstellerquellen (Recherche FA-RECHERCHE-06, R4),
 * sachlich, ohne Leistungsversprechen und ohne Preise (R12). Keine Namen von
 * Produktreihen, solange der Inhaber nicht bestätigt hat, welche die Werkstatt
 * verbaut (R4); vor dem Livegang gibt der Inhaber die Texte frei.
 */

export type { HerstellerBereichArt };

export interface BereichInfo {
  titel: string;
  href: string;
  verweis: string;
}

export const BEREICHE: Record<HerstellerBereichArt, BereichInfo> = {
  sperrschliessung: { titel: 'Sperrschließungen', href: '/gleichschliessende-zylinder', verweis: 'Zu den Sperrschließungen' },
  zutritt: { titel: 'Elektronischer Zutritt', href: '/elektronische-zutrittsloesungen', verweis: 'Zum elektronischen Zutritt' },
};

/** Reihenfolge der Bereiche auf einer Karte. */
export const BEREICH_REIHENFOLGE: HerstellerBereichArt[] = ['sperrschliessung', 'zutritt'];

/** Einsatztext je Bereich aus den Daten; leere Texte und unbekannte Bereiche zählen nicht. */
export function bereicheDesHerstellers(h: Pick<ShopHersteller, 'bereiche'>): Partial<Record<HerstellerBereichArt, string>> {
  const zuordnung: Partial<Record<HerstellerBereichArt, string>> = {};
  for (const b of h.bereiche ?? []) {
    const text = b.einsatz?.trim();
    if (text && b.art in BEREICHE && !zuordnung[b.art]) zuordnung[b.art] = text;
  }
  return zuordnung;
}

export interface HerstellerEintrag {
  id: string;
  name: string;
  /** Einsatzzweck je Bereich, in der Reihenfolge der Bereiche. */
  bereiche: Array<{ art: HerstellerBereichArt; einsatz: string }>;
  /** Allgemeiner Einsatztext aus der Stammliste, wenn kein Bereich zugeordnet ist. */
  einsatz: string;
  /** Nur mit Freigabe und Datei (R12). */
  logo?: MediaImage;
}

/**
 * Logo zur Anzeige: nur, wenn die Datenschicht es herausgibt (das tut sie nur
 * mit dem Haken „Freigabe liegt vor“) und eine Datei dahinter liegt.
 */
export function freigegebenesLogo(logo: ImageSlot | undefined): MediaImage | undefined {
  return logo?.bild?.url ? logo.bild : undefined;
}

/**
 * Angebotene Hersteller für die Anzeige. Mit `bereich` nur die Hersteller,
 * die diesem Bereich zugeordnet sind, und nur dessen Einsatztext; ohne
 * `bereich` (Startseite) alle angebotenen mit allen ihren Bereichen.
 */
export function herstellerFuerAnzeige(hersteller: ShopHersteller[], bereich?: HerstellerBereichArt): HerstellerEintrag[] {
  return [...hersteller]
    .filter((h) => h.angeboten)
    .sort((a, b) => a.reihenfolge - b.reihenfolge || a.name.localeCompare(b.name, 'de'))
    .map((h) => {
      const zuordnung = bereicheDesHerstellers(h);
      const arten = bereich ? [bereich] : BEREICH_REIHENFOLGE;
      const eintrag: HerstellerEintrag = {
        id: h.id,
        name: h.name,
        einsatz: h.einsatz,
        bereiche: arten.flatMap((art) => (zuordnung[art] ? [{ art, einsatz: zuordnung[art] }] : [])),
      };
      const logo = freigegebenesLogo(h.logo);
      if (logo) eintrag.logo = logo;
      return eintrag;
    })
    .filter((e) => !bereich || e.bereiche.length > 0);
}
