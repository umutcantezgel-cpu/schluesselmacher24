import type { CodeLine } from '@/lib/types';
import { codePasst } from '@/lib/code-pattern';
import { istPlatzhalter } from '@/lib/platzhalter';
import { slugify } from '@/lib/slug';

/* ==========================================================================
   Codelinien — Einordnung, Adressen und Codesuche. Reine Funktionen ohne
   Server-Abhängigkeiten: Sie laufen auf den Seiten wie in der Shop-Liste im
   Browser.
   ========================================================================== */

export const SHOP_PFAD = '/schluessel-nach-code';
export const KATEGORIE_PFAD = `${SHOP_PFAD}/kategorie`;
export const HERSTELLER_PFAD = `${SHOP_PFAD}/hersteller`;

/** Kennung einer Codelinie aus dem Namen („… — Serie MS-01“ → „MS-01“), sonst aus dem Slug. Nur Anzeige. */
export function codelinienKennung(line: Pick<CodeLine, 'name' | 'slug'>): string {
  const treffer = /Serie\s+([A-Za-z0-9-]+)\s*$/.exec(line.name);
  return (treffer ? treffer[1] : line.slug).toUpperCase();
}

/** Titel ohne die angehängte Serienkennung („— Serie MS-01“). Nur Anzeige. */
export function codelinienTitel(line: Pick<CodeLine, 'name'>): string {
  return line.name.replace(/\s*[—–-]\s*Serie\s+[A-Za-z0-9-]+\s*$/, '');
}

/**
 * Anwendungsfamilie. Konvention der Datenschicht: Sie steht als letzter
 * Eintrag in `tags`. Fehlt sie, wird auf die Anwendung zurückgefallen.
 */
export function codelinienFamilie(line: Pick<CodeLine, 'tags' | 'application'>): string {
  const letzte = line.tags[line.tags.length - 1]?.trim();
  return letzte || line.application;
}

/** Anwendung ohne Vorsatz: „Möbel- und Büroschloss: Büroschrank“ → „Büroschrank“. */
export function anwendungKurz(line: Pick<CodeLine, 'application'>): string {
  const teile = line.application.split(':');
  return (teile.length > 1 ? teile.slice(1).join(':') : teile[0]).trim();
}

/** Vorsatz der Anwendung: „Möbel- und Büroschloss: Büroschrank“ → „Möbel- und Büroschloss“. */
export function anwendungBasis(line: Pick<CodeLine, 'application'>): string {
  return line.application.split(':')[0].trim();
}

/** Ein gepflegter Wert — Platzhalter wie „[Hersteller eintragen]“ und Leeres zählen nicht. */
export function gepflegt(wert: string | null | undefined): string | undefined {
  return istPlatzhalter(wert) ? undefined : wert!.trim();
}

export function codelinienPfad(line: Pick<CodeLine, 'slug'>): string {
  return `${SHOP_PFAD}/${line.slug}`;
}

export function kategoriePfad(familie: string): string {
  return `${KATEGORIE_PFAD}/${slugify(familie)}`;
}

export function herstellerPfad(hersteller: string): string {
  return `${HERSTELLER_PFAD}/${slugify(hersteller)}`;
}

/** Darf die Produktseite in Suchmaschinen und in die Sitemap? */
export function codelinieIndexierbar(line: Pick<CodeLine, 'example' | 'seo'>): boolean {
  return !line.example && !line.seo.noindex;
}

/* ---------- Kategorien und Hersteller ------------------------------------ */

export interface CodeFamilie {
  name: string;
  /** Adressteil, z. B. „moebel-und-bueroschloesser“. */
  adresse: string;
  /** Präfix der Kennungen, z. B. „MS“ (nur wenn alle Linien dasselbe haben). */
  kuerzel?: string;
  lines: CodeLine[];
}

/** Anwendungsfamilien in der Reihenfolge der Daten. */
export function codeFamilien(lines: CodeLine[]): CodeFamilie[] {
  const familien = new Map<string, CodeFamilie>();
  for (const line of lines) {
    const name = codelinienFamilie(line);
    const adresse = slugify(name);
    if (!adresse) continue;
    const familie = familien.get(adresse) ?? { name, adresse, lines: [] };
    familie.lines.push(line);
    familien.set(adresse, familie);
  }
  return [...familien.values()].map((familie) => {
    const praefixe = new Set(familie.lines.map((line) => codelinienKennung(line).split('-')[0]));
    return praefixe.size === 1 ? { ...familie, kuerzel: [...praefixe][0] } : familie;
  });
}

export interface CodeHersteller {
  name: string;
  adresse: string;
  lines: CodeLine[];
}

/**
 * Hersteller mit mindestens einer Linie, bei der er gepflegt ist. Solange
 * überall der Platzhalter steht, ist die Liste leer — dann gibt es keine
 * Herstellerseiten, keine Links und keine Sitemap-Einträge.
 */
export function codeHersteller(lines: CodeLine[]): CodeHersteller[] {
  const hersteller = new Map<string, CodeHersteller>();
  for (const line of lines) {
    const name = gepflegt(line.manufacturer);
    if (!name) continue;
    const adresse = slugify(name);
    if (!adresse) continue;
    const eintrag = hersteller.get(adresse) ?? { name, adresse, lines: [] };
    eintrag.lines.push(line);
    hersteller.set(adresse, eintrag);
  }
  return [...hersteller.values()].sort((a, b) => a.name.localeCompare(b.name, 'de'));
}

/* ---------- Adresse auflösen --------------------------------------------- */

export type CodelinienTreffer =
  | { line: CodeLine; weiterleitung?: undefined }
  | { line?: undefined; weiterleitung: string };

/**
 * Codelinie zu einem Adressteil. Passt kein Slug, aber die feste Kennung
 * einer Linie (etwa „ms-01“, nachdem der Slug in „abus-ms-01“ geändert
 * wurde), kommt die neue Adresse zurück — die Seite leitet dauerhaft weiter.
 */
export function codelinieAufloesen(lines: CodeLine[], slug: string): CodelinienTreffer | null {
  const aktiv = lines.filter((line) => line.active);
  const line = aktiv.find((l) => l.slug === slug);
  if (line) return { line };
  const umgezogen = aktiv.find((l) => l.id === slug && l.slug !== slug);
  return umgezogen ? { weiterleitung: codelinienPfad(umgezogen) } : null;
}

/* ---------- Codesuche ---------------------------------------------------- */

/**
 * Passt eine Eingabe zum Codeformat der Linie? Wie im Bestellformular wird
 * die Eingabe ohne Leerraum am Rand geprüft und Kleinbuchstaben gelten, wenn
 * die Großschreibung passt.
 */
export function codePasstZuLinie(line: Pick<CodeLine, 'codePattern'>, eingabe: string): boolean {
  const code = eingabe.trim();
  if (!code) return false;
  return codePasst(line.codePattern, code) || codePasst(line.codePattern, code.toUpperCase());
}

/**
 * Sieht die Sucheingabe wie ein Schlüsselcode aus? Ein Wort mit mindestens
 * einer Ziffer, höchstens 20 Zeichen — „Briefkasten“ ist keiner, „C214“ schon.
 */
export function siehtNachCodeAus(eingabe: string): boolean {
  const code = eingabe.trim();
  return code.length > 0 && code.length <= 20 && !/\s/.test(code) && /\d/.test(code);
}

/** Linien, zu deren Codeformat die Eingabe passt (leer, wenn sie nicht wie ein Code aussieht). */
export function linienZumCode<T extends Pick<CodeLine, 'codePattern'>>(lines: T[], eingabe: string): T[] {
  if (!siehtNachCodeAus(eingabe)) return [];
  return lines.filter((line) => codePasstZuLinie(line, eingabe));
}
