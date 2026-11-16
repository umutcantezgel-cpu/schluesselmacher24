import { fahrzeugText, preisAbText, reiheName } from '@/lib/artikel';
import {
  SCHLUESSELTYP_LABEL,
  TEILEART_LABEL,
  bauformNamen,
  fahrzeugPassung,
  fahrzeugteileFiltern,
  filterAusSuchparametern,
  filterZuSuchparametern,
  type Fahrzeugartikel,
  type FahrzeugteilFilter,
  type Passung,
} from '@/lib/data/fahrzeugteile';
import { VERFUEGBARKEIT_LABEL, istBestellbar, verfuegbarkeitVon } from '@/lib/data/shop';
import type { FahrzeugReihe, GehaeuseBauform } from '@/lib/types';

/* ==========================================================================
   Liste der Gehäuse und Ersatzteile (FA-SHOP-02B, Punkt 1): reine Funktionen
   für Filter, Etiketten und Texte der Seite. Ohne Server-Abhängigkeiten.

   Keine falschen Versprechen:
   - „Passt zu Ihrem Modell“ nur, wenn der Kunde ein Modell gewählt hat und
     das Teil diese Reihe ausdrücklich nennt.
   - Ein Teil ohne Reihen passt laut Pflege zu allen Reihen der Marke; das
     Etikett sagt „passt zu Ihrer Marke, bitte Modell prüfen“.
   - Markenübergreifende Teile (etwa Batterien) stehen bei gewähltem Fahrzeug
     in einer eigenen, benannten Gruppe, nicht zwischen den passenden Gehäusen.
   ========================================================================== */

export { reiheName };

export const TEILE_PFAD = '/autoschluessel/gehaeuse/teile';
export const GEHAEUSE_PFAD = '/autoschluessel/gehaeuse';
export const GEHAEUSE_ANFRAGE_PFAD = '/autoschluessel/gehaeuse/anfrage';

/** Anker der Liste: Filterverweise springen zurück zur Liste. */
export const LISTE_ANKER = 'teile-liste';

type Suchparameter = Record<string, string | string[] | undefined>;

const erster = (wert: string | string[] | undefined) => (Array.isArray(wert) ? wert[0] : wert)?.trim() || undefined;

/**
 * Filter aus der Adresse. Eine Reihe aus dem Fahrzeugkatalog bringt ihre Marke mit: So genügt in der
 * Auswahl ohne JavaScript ein Feld „Modell“, und eine Marke, die nicht zur Reihe passt, gilt nicht.
 */
export function teileFilter(params: Suchparameter, katalog: ReadonlyArray<Pick<FahrzeugReihe, 'id' | 'marke'>>): FahrzeugteilFilter {
  const reihe = erster(params.reihe);
  const marke = erster(params.marke);
  const treffer = reihe ? katalog.find((r) => r.id === reihe) : undefined;
  const roh: Suchparameter = { ...params };
  // Eine andere Marke als die der Reihe hat der Kunde zuletzt gewählt: Sie gilt, die Reihe entfällt.
  if (treffer && (!marke || marke.localeCompare(treffer.marke, 'de', { sensitivity: 'base' }) === 0)) roh.marke = treffer.marke;
  else delete roh.reihe;
  return filterAusSuchparametern(roh);
}

/** Adresse der Liste mit Filter, mit Sprung zur Liste; ohne Filter die Liste selbst. */
export function teileAdresse(filter: FahrzeugteilFilter): string {
  const such = filterZuSuchparametern(filter);
  return such ? `${TEILE_PFAD}?${such}#${LISTE_ANKER}` : TEILE_PFAD;
}

/** Filter ohne das genannte Merkmal (Verweis „entfernen“); ohne Marke entfällt auch die Reihe. */
export function ohneMerkmal(filter: FahrzeugteilFilter, merkmal: keyof FahrzeugteilFilter): FahrzeugteilFilter {
  const rest = { ...filter };
  delete rest[merkmal];
  if (merkmal === 'marke') delete rest.reihe;
  return rest;
}

/** Etikett eines Teils zum gewählten Fahrzeug; ohne Fahrzeug im Filter keins. */
export function passungEtikett(passung: Passung, filter: Pick<FahrzeugteilFilter, 'marke' | 'reihe'>): string | null {
  if (!filter.marke && !filter.reihe) return null;
  switch (passung) {
    case 'reihe':
      return filter.reihe ? 'Passt zu Ihrem Modell' : 'Für einzelne Modelle dieser Marke, bitte Modell prüfen';
    case 'marke':
      return 'Passt zu Ihrer Marke, bitte Modell prüfen';
    case 'allgemein':
      return 'Passt zu jedem Fahrzeug';
    default:
      return null;
  }
}

export interface TeileGruppen<T> {
  /** Teile für das Fahrzeug (genaue Treffer vorn); ohne Fahrzeug im Filter alle Treffer. */
  passend: T[];
  /** Markenübergreifende Teile, nur bei gewähltem Fahrzeug, getrennt benannt. */
  allgemein: T[];
}

/** Treffer zum Filter, bei gewähltem Fahrzeug in zwei Gruppen getrennt. */
export function teileGruppieren<T extends Fahrzeugartikel>(artikel: T[], filter: FahrzeugteilFilter): TeileGruppen<T> {
  const treffer = fahrzeugteileFiltern(artikel, filter);
  if (!filter.marke) return { passend: treffer, allgemein: [] };
  const allgemein = treffer.filter((a) => fahrzeugPassung(a.fahrzeugteil, filter) === 'allgemein');
  return { passend: treffer.filter((a) => !allgemein.includes(a)), allgemein };
}

/** Was die Karte eines Teils zeigt; der Preis nur, wenn der Artikel bestellbar ist (R9). */
export interface TeilKarte {
  id: string;
  slug: string;
  name: string;
  teileart: string;
  bauformen: string[];
  fahrzeug: string;
  tasten?: string;
  etikett: string | null;
  /** Preis wie auf der Artikelseite, oder der Stand der Verfügbarkeit. */
  preis: string;
  beispiel: boolean;
}

export function teilKarte(
  artikel: Fahrzeugartikel,
  filter: FahrzeugteilFilter,
  quellen: { bauformen: GehaeuseBauform[]; katalog: ReadonlyArray<Pick<FahrzeugReihe, 'id' | 'reihe'>> },
): TeilKarte {
  const teil = artikel.fahrzeugteil;
  return {
    id: artikel.id,
    slug: artikel.slug,
    name: artikel.name,
    teileart: TEILEART_LABEL[teil.teileart],
    bauformen: bauformNamen(teil.bauformen, quellen.bauformen),
    fahrzeug: fahrzeugText(teil, quellen.katalog),
    ...(typeof teil.tastenzahl === 'number' ? { tasten: teil.tastenzahl === 1 ? '1 Taste' : `${teil.tastenzahl} Tasten` } : {}),
    etikett: passungEtikett(fahrzeugPassung(teil, filter), filter),
    preis: istBestellbar(artikel) ? preisAbText(artikel) : artikel.example ? 'Beispiel, nicht bestellbar' : VERFUEGBARKEIT_LABEL[verfuegbarkeitVon(artikel)],
    beispiel: artikel.example,
  };
}

/** Gesetzte Merkmale als lesbare Zeilen mit Verweis zum Entfernen. */
export function filterZeilen(
  filter: FahrzeugteilFilter,
  quellen: { bauformen: GehaeuseBauform[]; katalog: ReadonlyArray<Pick<FahrzeugReihe, 'id' | 'reihe'>> },
): Array<{ text: string; ohne: string }> {
  const zeilen: Array<{ text: string; ohne: string }> = [];
  const ohne = (m: keyof FahrzeugteilFilter) => teileAdresse(ohneMerkmal(filter, m));
  if (filter.marke) {
    const reihe = filter.reihe ? reiheName(filter.reihe, quellen.katalog) : undefined;
    zeilen.push({ text: `Fahrzeug: ${reihe ? `${filter.marke} ${reihe}` : filter.marke}`, ohne: ohne('marke') });
  }
  if (typeof filter.baujahr === 'number') zeilen.push({ text: `Baujahr: ${filter.baujahr}`, ohne: ohne('baujahr') });
  if (filter.bauform) {
    const name = bauformNamen([filter.bauform], quellen.bauformen)[0] ?? filter.bauform;
    zeilen.push({ text: `Bauform: ${name}`, ohne: ohne('bauform') });
  }
  if (typeof filter.tastenzahl === 'number') zeilen.push({ text: `Tasten: ${filter.tastenzahl}`, ohne: ohne('tastenzahl') });
  if (filter.teileart) zeilen.push({ text: `Teil: ${TEILEART_LABEL[filter.teileart]}`, ohne: ohne('teileart') });
  if (filter.schluesselart) zeilen.push({ text: `Schlüsseltyp: ${SCHLUESSELTYP_LABEL[filter.schluesselart]}`, ohne: ohne('schluesselart') });
  return zeilen;
}
