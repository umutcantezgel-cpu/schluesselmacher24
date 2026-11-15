import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { ValidationError, type PayloadRequest } from 'payload';

import { firmendatenPruefen } from '../payload/globals/Einstellungen';
import { beispieleSichtbar } from './beispiele';
import { defaults } from './data/defaults';
import { enthaeltPlatzhalter } from './platzhalter';

/*
 * Prüfungen vor dem Livegang (src/scripts/livegang-pruefen.ts, im
 * Produktions-Build Pflicht): Firmendaten und Rechtsseiten dürfen keine
 * Redaktions-Platzhalter mehr enthalten, und kein Beispiel-Eintrag darf
 * veröffentlicht sein (A-046). Ausgegeben werden nur Feldnamen und
 * Fundstellen, nie Werte (die Steuernummer bleibt intern).
 */

export interface Fund {
  ort: string;
  hinweis: string;
}

/* ---------- Firmendaten -------------------------------------------------- */

type Firma = Record<string, unknown> & { platzhalter?: boolean | null };

/**
 * Prüft die Firmendaten (Global `einstellungen`, Tab „Firma“) mit derselben
 * Regel wie das Backend beim Entfernen des Hakens „Noch Platzhalter
 * hinterlegt“ (firmendatenPruefen).
 */
export async function firmendatenFunde(firma: Firma | null | undefined, req?: Partial<PayloadRequest>): Promise<Fund[]> {
  if (!firma) return [{ ort: 'Einstellungen › Firma', hinweis: 'Keine Firmendaten gespeichert.' }];
  const funde: Fund[] = [];
  if (firma.platzhalter !== false) {
    funde.push({
      ort: 'Einstellungen › Firma',
      hinweis: 'Der Haken „Noch Platzhalter hinterlegt“ ist gesetzt — Impressum und Fußzeile zeigen dann keine Firmendaten.',
    });
  }
  try {
    await firmendatenPruefen({
      data: { firma: { ...firma, platzhalter: false } },
      req: req as PayloadRequest,
    } as Parameters<typeof firmendatenPruefen>[0]);
  } catch (error) {
    if (!(error instanceof ValidationError)) throw error;
    for (const fehler of error.data.errors) {
      funde.push({ ort: 'Einstellungen › Firma', hinweis: fehler.message });
    }
  }
  funde.push(...mailadresseFunde(firma.email));
  return funde;
}

/** Die Domain, auf der Kundenanfragen und Betriebsmails liegen (FA-24, Vorgabe des Inhabers). */
export const EIGENE_MAILDOMAIN = 'schluesselmacher24.de';

const EIGENE_MUSTER = new RegExp(`^[^\\s@]+@${EIGENE_MAILDOMAIN.replace(/\./g, '\\.')}$`, 'i');

/** Liegt die Adresse auf der eigenen Domain? Leerzeichen am Rand zählen nicht. */
export function liegtAufEigenerDomain(wert: string): boolean {
  return EIGENE_MUSTER.test(wert.trim());
}

/**
 * Die Firmen-E-Mail ist die Kundenadresse der Seite: Sie muss echt sein und
 * auf der eigenen Domain liegen. Ein Platzhalter meldet firmendatenPruefen schon
 * unter „Noch offen“, deshalb steht er hier nicht noch einmal. Gemeldet werden
 * nur Feld und Grund, nie der Wert.
 */
export function mailadresseFunde(email: unknown): Fund[] {
  const ort = 'Einstellungen › Firma › E-Mail';
  const wert = typeof email === 'string' ? email.trim() : '';
  if (!wert) return [{ ort, hinweis: 'Keine Firmen-E-Mail hinterlegt.' }];
  if (enthaeltPlatzhalter(wert)) return [];
  if (!liegtAufEigenerDomain(wert)) {
    return [{ ort, hinweis: `Die Firmen-E-Mail liegt nicht auf der eigenen Domain ${EIGENE_MAILDOMAIN}.` }];
  }
  return [];
}

/**
 * Mailadressen aus der Umgebung (Vercel): Absender (`MAIL_FROM_ADDRESS`),
 * Antwortadresse (`MAIL_REPLY_TO`) und Betriebsempfänger (`MAIL_TEAM_ADDRESS`,
 * kommagetrennt). Sie gelten für Kundenmails und Systemmails wie die Firmen-E-Mail,
 * deshalb gilt für sie dieselbe Domainregel. Gemeldet wird nur der Variablenname, nie der Wert.
 */
export function umgebungsMailFunde(env: Record<string, string | undefined> = process.env): Fund[] {
  const funde: Fund[] = [];
  for (const name of ['MAIL_FROM_ADDRESS', 'MAIL_REPLY_TO']) {
    const wert = env[name]?.trim();
    if (wert && !liegtAufEigenerDomain(wert)) {
      funde.push({ ort: `Umgebung › ${name}`, hinweis: `${name} liegt nicht auf der eigenen Domain ${EIGENE_MAILDOMAIN}.` });
    }
  }
  const team = (env.MAIL_TEAM_ADDRESS ?? '').split(',').map((eintrag) => eintrag.trim()).filter(Boolean);
  if (team.some((adresse) => !liegtAufEigenerDomain(adresse))) {
    funde.push({
      ort: 'Umgebung › MAIL_TEAM_ADDRESS',
      hinweis: `MAIL_TEAM_ADDRESS enthält mindestens eine Adresse außerhalb der eigenen Domain ${EIGENE_MAILDOMAIN}.`,
    });
  }
  return funde;
}

/* ---------- Rechtsseiten ------------------------------------------------- */

/** Text in eckigen Klammern, auch über Zeilen hinweg (JSX-Absätze). */
const KLAMMER = /\[[^[\]]*\]/g;
/** Bloße Erwähnung des Musters, etwa im Hinweiskasten: „[Platzhalter: …]“. */
const ERWAEHNUNG = /^\[\s*Platzhalter\s*:?\s*(?:…|\.\.\.)?\s*\]$/;

/** Platzhalter in einem Quelltext mit Zeilennummer und kurzem Auszug. */
export function platzhalterImText(text: string): Array<{ zeile: number; auszug: string }> {
  const funde: Array<{ zeile: number; auszug: string }> = [];
  for (const treffer of text.matchAll(KLAMMER)) {
    const klammer = treffer[0];
    if (!enthaeltPlatzhalter(klammer) || ERWAEHNUNG.test(klammer)) continue;
    const zeile = text.slice(0, treffer.index).split('\n').length;
    const auszug = klammer.replace(/\s+/g, ' ');
    funde.push({ zeile, auszug: auszug.length > 90 ? `${auszug.slice(0, 87)}…]` : auszug });
  }
  return funde;
}

function quelldateien(ordner: string): string[] {
  const dateien: string[] = [];
  for (const eintrag of readdirSync(ordner, { withFileTypes: true })) {
    const pfad = path.join(ordner, eintrag.name);
    if (eintrag.isDirectory()) dateien.push(...quelldateien(pfad));
    else if (/\.(tsx?|mdx?)$/.test(eintrag.name) && !/\.test\.tsx?$/.test(eintrag.name)) dateien.push(pfad);
  }
  return dateien.sort();
}

/** Durchsucht die Rechtsseiten (Quelltext) nach Redaktions-Platzhaltern. */
export function rechtsseitenFunde(ordner: string, basis = process.cwd()): Fund[] {
  return quelldateien(ordner).flatMap((datei) =>
    platzhalterImText(readFileSync(datei, 'utf8')).map(({ zeile, auszug }) => ({
      ort: `${path.relative(basis, datei)}:${zeile}`,
      hinweis: auszug,
    })),
  );
}

/* ---------- Beispiel-Einträge (A-046) ------------------------------------ */

/** Ein Produkt (Codelinie oder Standardartikel), wie die Prüfung es braucht. */
export interface ProduktEintrag {
  kennung: string;
  name: string;
  beispiel: boolean;
}

/** Kennungen der Musterdaten: die 52 Muster-Codelinien und die Beispielartikel aus den Standardwerten. */
export function musterKennungen(): Set<string> {
  return new Set([...defaults.codeLines(), ...defaults.standardArticles()].map((eintrag) => eintrag.id));
}

/**
 * Meldet, wenn ein Beispiel-Eintrag auf der Seite erschiene:
 * - `SM24_BEISPIELE=1` ist gesetzt (macht alle Beispiele sichtbar, nur für Tests gedacht),
 * - ein veröffentlichtes Produkt stammt aus den Musterdaten, ist aber nicht als Beispiel markiert
 *   (etwa aus einer Datenbank aus der Zeit vor A-046 oder mit entferntem Haken).
 * `eintraege` sind die veröffentlichten Produkte (ohne Entwürfe und Papierkorb).
 */
export function beispielFunde(
  eintraege: readonly ProduktEintrag[],
  env: Record<string, string | undefined> = process.env,
  muster: ReadonlySet<string> = musterKennungen(),
): Fund[] {
  const funde: Fund[] = [];
  if (beispieleSichtbar(env)) {
    funde.push({
      ort: 'Umgebung › SM24_BEISPIELE',
      hinweis: 'SM24_BEISPIELE=1 ist gesetzt. Dann wären alle Beispiel-Codelinien und -Artikel auf der Seite sichtbar und bestellbar.',
    });
  }
  for (const eintrag of eintraege) {
    if (eintrag.beispiel || !muster.has(eintrag.kennung)) continue;
    funde.push({
      ort: `Produkte › ${eintrag.kennung}`,
      hinweis: `„${eintrag.name}“ stammt aus den Musterdaten, ist aber nicht als Beispiel markiert und wäre veröffentlicht.`,
    });
  }
  return funde;
}
