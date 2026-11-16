import { fahrzeugText, preisAbText, reiheName } from '@/lib/artikel';
import {
  SCHLUESSELTYP_LABEL,
  TEILEART_LABEL,
  FILTER_PARAMETER,
  bauformNamen,
  fahrzeugPassung,
  fahrzeugteileFiltern,
  filterAusSuchparametern,
  filterZuSuchparametern,
  type Fahrzeugartikel,
  type FahrzeugteilFilter,
  type FilterAuswahl,
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
/** Adresse der Gehäuse-Anfrage: an einer Stelle in `anfrage/leistung.ts` (FA-SHOP-02C). */
export { ANFRAGE_PFAD as GEHAEUSE_ANFRAGE_PFAD } from '../anfrage/leistung';

/** Anker der Liste: Filterverweise springen zurück zur Liste. */
export const LISTE_ANKER = 'teile-liste';

type Suchparameter = Record<string, string | string[] | undefined>;

const erster = (wert: string | string[] | undefined) => (Array.isArray(wert) ? wert[0] : wert)?.trim() || undefined;

/**
 * Verborgenes Feld im Filterformular: das Modell, das beim Absenden gewählt war. So erkennt `teileFilter`,
 * ob der Kunde „Alle Marken“ gewählt hat (Fahrzeugwahl aufheben) oder nur ein neues Modell (Marke folgt).
 */
export const MODELL_VORHER = 'modell-vorher';

/**
 * Filter aus der Adresse. Eine Reihe aus dem Fahrzeugkatalog bringt ihre Marke mit: So genügt in der
 * Auswahl ohne JavaScript ein Feld „Modell“, und eine Marke, die nicht zur Reihe passt, gilt nicht.
 * Ist die Marke leer übergeben („Alle Marken“) und das Modell unverändert, entfällt die Fahrzeugwahl ganz.
 */
export function teileFilter(params: Suchparameter, katalog: ReadonlyArray<Pick<FahrzeugReihe, 'id' | 'marke'>>): FahrzeugteilFilter {
  const reihe = erster(params.reihe);
  const marke = erster(params.marke);
  const vorher = params[MODELL_VORHER] === undefined ? undefined : erster(params[MODELL_VORHER]) ?? '';
  const markeAufgehoben = params.marke !== undefined && !marke && (vorher === undefined || vorher === reihe);
  const treffer = reihe && !markeAufgehoben ? katalog.find((r) => r.id === reihe) : undefined;
  const roh: Suchparameter = { ...params };
  delete roh[MODELL_VORHER];
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

/* ---------- Filterformular ohne JavaScript -------------------------------- */

export interface FilterFeld {
  /** Name des Suchparameters. */
  name: string;
  id: string;
  label: string;
  /** Text der leeren Wahl, etwa „Alle Marken“. */
  leer: string;
  optionen: Array<{ wert: string; text: string }>;
  /** Gewählter Wert; leer heißt „alle“. Steht immer unter den Optionen. */
  wert: string;
}

export interface FilterFormular {
  felder: FilterFeld[];
  /** Feld Baujahr zeigen. */
  baujahr: boolean;
  /** Gibt es das Feld „Modell“? Sonst sagt der Hinweis bei „Mein Fahrzeug“ „Marke“. */
  modellFeld: boolean;
  /** Verborgene Felder, die beim Absenden mitgehen. */
  verborgen: Array<{ name: string; wert: string }>;
}

const gleichOhneFall = (a: string, b: string) => a.localeCompare(b, 'de', { sensitivity: 'base' }) === 0;

/**
 * Felder des Filterformulars. Die Auswahl zeigt nur Werte, die es bei den Teilen gibt. Ein gesetzter Wert
 * ohne eigene Option (etwa ein Fahrzeug aus „Mein Fahrzeug“, für das es kein Teil gibt) erscheint als
 * zusätzliche Option „(gewählt)“: So geht er beim erneuten Absenden nicht still verloren.
 */
export function filterFormular(
  filter: FahrzeugteilFilter,
  auswahl: FilterAuswahl,
  quellen: { bauformen: GehaeuseBauform[]; katalog: ReadonlyArray<Pick<FahrzeugReihe, 'id' | 'reihe'>> },
): FilterFormular {
  const felder: FilterFeld[] = [];
  const feld = (
    merkmal: keyof FahrzeugteilFilter,
    id: string,
    label: string,
    leer: string,
    optionen: Array<{ wert: string; text: string }>,
    gewaehltText: (wert: string) => string,
    vergleich: (a: string, b: string) => boolean = (a, b) => a === b,
  ) => {
    const gesetzt = filter[merkmal] === undefined ? '' : String(filter[merkmal]);
    if (!optionen.length && !gesetzt) return;
    const vorhanden = gesetzt ? optionen.find((o) => vergleich(o.wert, gesetzt)) : undefined;
    const liste = gesetzt && !vorhanden ? [...optionen, { wert: gesetzt, text: `${gewaehltText(gesetzt)} (gewählt)` }] : optionen;
    felder.push({ name: FILTER_PARAMETER[merkmal], id, label, leer, optionen: liste, wert: vorhanden?.wert ?? gesetzt });
  };

  feld('marke', 'filter-marke', 'Marke', 'Alle Marken', auswahl.marken.map((m) => ({ wert: m, text: m })), (m) => m, gleichOhneFall);
  const reihen = auswahl.marken.flatMap((marke) =>
    (auswahl.reihen[marke] ?? []).flatMap((id) => {
      const name = reiheName(id, quellen.katalog);
      return name ? [{ wert: id, text: `${marke} ${name}` }] : [];
    }),
  );
  feld('reihe', 'filter-reihe', 'Modell', 'Alle Modelle', reihen, (id) => [filter.marke, reiheName(id, quellen.katalog) ?? id].filter(Boolean).join(' '));
  const modellFeld = felder.some((f) => f.name === FILTER_PARAMETER.reihe);
  const bauformen = auswahl.bauformen.map((b) => ({ wert: b, text: bauformNamen([b], quellen.bauformen)[0] ?? b }));
  feld('bauform', 'filter-bauform', 'Bauform', 'Alle Bauformen', bauformen, (b) => bauformNamen([b], quellen.bauformen)[0] ?? b);
  feld('tastenzahl', 'filter-tasten', 'Tasten', 'Jede Tastenzahl', auswahl.tastenzahlen.map((t) => ({ wert: String(t), text: String(t) })), (t) => t);
  // Eine einzige Teileart braucht keine Auswahl, außer sie ist gesetzt (etwa vom Customizing).
  const arten = auswahl.teilearten.length > 1 || filter.teileart ? auswahl.teilearten.map((t) => ({ wert: t, text: TEILEART_LABEL[t] })) : [];
  feld('teileart', 'filter-teil', 'Teil', 'Alle Teile', arten, (t) => TEILEART_LABEL[t as keyof typeof TEILEART_LABEL] ?? t);
  feld(
    'schluesselart',
    'filter-typ',
    'Schlüsseltyp',
    'Alle Schlüsseltypen',
    auswahl.schluesselarten.map((s) => ({ wert: s, text: SCHLUESSELTYP_LABEL[s] })),
    (s) => SCHLUESSELTYP_LABEL[s as keyof typeof SCHLUESSELTYP_LABEL] ?? s,
  );

  return {
    felder,
    baujahr: auswahl.marken.length > 0 || typeof filter.baujahr === 'number',
    modellFeld,
    verborgen: modellFeld ? [{ name: MODELL_VORHER, wert: filter.reihe ?? '' }] : [],
  };
}
