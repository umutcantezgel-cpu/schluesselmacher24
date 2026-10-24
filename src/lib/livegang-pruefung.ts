import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { ValidationError, type PayloadRequest } from 'payload';

import { firmendatenPruefen } from '../payload/globals/Einstellungen';
import { enthaeltPlatzhalter } from './platzhalter';

/*
 * Prüfungen vor dem Livegang (src/scripts/livegang-pruefen.ts, im
 * Produktions-Build Pflicht): Firmendaten und Rechtsseiten dürfen keine
 * Redaktions-Platzhalter mehr enthalten. Ausgegeben werden nur Feldnamen und
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
