/*
 * Zwischenstand per Link (Kern laut Plan, G-27): der Schließplan als kurzer Text in der Adresse
 * (Base64url aus JSON, Version vorn). Gelesen wird nur, was dem Schema entspricht; sonst null.
 * Keine Kontaktdaten im Link, nur Türen, Schlüssel und Matrix mit ihren Bezeichnungen.
 *
 * Beim Lesen (E5-OPUS-01): Verweise der Matrix auf unbekannte Türen oder Schlüssel fallen weg, jeder
 * Schlüssel hat eine Zeile, und „Maße geprüft“ wird nie übernommen: Die Bestätigung gibt, wer den
 * Plan jetzt vor sich hat (G-29).
 */

import type { PlanSchluessel, PlanTuer, Schliessplan } from './schliessplan';

/** Obergrenze, damit der Link in Mail und Messenger heil bleibt. */
export const ZWISCHENSTAND_HOECHSTENS = 6000;

/*
 * Schema als kleine Prüffunktionen statt zod (E5-OPUS-04): Das Modul läuft im Browser beider
 * Konfiguratoren, zod brachte dort rund 34 KiB, die zu fast vier Fünfteln ungenutzt blieben, und
 * probierte `new Function`, was die CSP als Verstoß meldete. Gleiche Regeln wie vorher: nur bekannte
 * Felder, Texte mit Höchstlänge, ganze Zahlen im Bereich, höchstens 100 Türen und 100 Schlüssel.
 */
type Roh = Record<string, unknown>;
const FORMEN: ReadonlySet<string> = new Set(['doppelzylinder', 'knaufzylinder', 'halbzylinder']);
const istObjekt = (x: unknown): x is Roh => typeof x === 'object' && x !== null && !Array.isArray(x);
const istText = (x: unknown, hoechstens: number): x is string => typeof x === 'string' && x.length <= hoechstens;
const istGanz = (x: unknown, von: number, bis: number): x is number => typeof x === 'number' && Number.isInteger(x) && x >= von && x <= bis;
const istTextListe = (x: unknown, hoechstens: number, laenge: number): x is string[] =>
  Array.isArray(x) && x.length <= hoechstens && x.every((t) => istText(t, laenge));

function tuerAus(x: unknown): PlanTuer | null {
  if (!istObjekt(x)) return null;
  const { id, bezeichnung, form, a, b, funktionId, optionen } = x;
  if (!istText(id, 12) || !istText(bezeichnung, 60) || typeof form !== 'string' || !FORMEN.has(form) || !istGanz(a, 0, 300)) return null;
  if (b !== undefined && !istGanz(b, 0, 300)) return null;
  if (funktionId !== undefined && !istText(funktionId, 40)) return null;
  if (optionen !== undefined && !istTextListe(optionen, 10, 40)) return null;
  return {
    id,
    bezeichnung,
    form: form as PlanTuer['form'],
    a,
    ...(b !== undefined ? { b } : {}),
    ...(funktionId !== undefined ? { funktionId } : {}),
    ...(optionen !== undefined ? { optionen: [...optionen] } : {}),
  };
}

function schluesselAus(x: unknown): PlanSchluessel | null {
  if (!istObjekt(x)) return null;
  const { id, bezeichnung, anzahl, reserve, kennzeichnung } = x;
  if (!istText(id, 12) || !istText(bezeichnung, 60) || !istGanz(anzahl, 0, 500)) return null;
  if (reserve !== undefined && !istGanz(reserve, 0, 500)) return null;
  if (kennzeichnung !== undefined && !istText(kennzeichnung, 40)) return null;
  return { id, bezeichnung, anzahl, ...(reserve !== undefined ? { reserve } : {}), ...(kennzeichnung !== undefined ? { kennzeichnung } : {}) };
}

/** Rohform nach Schema, `masseGeprueft` noch dabei; sonst null. */
function nachSchema(roh: unknown): (Schliessplan & { masseGeprueft?: boolean }) | null {
  if (!istObjekt(roh) || roh.version !== 1) return null;
  const { system, tueren, schluessel, berechtigungen, masseGeprueft } = roh;
  if (system !== undefined && !istText(system, 40)) return null;
  if (!Array.isArray(tueren) || tueren.length > 100 || !Array.isArray(schluessel) || schluessel.length > 100) return null;
  if (!istObjekt(berechtigungen) || (masseGeprueft !== undefined && typeof masseGeprueft !== 'boolean')) return null;
  const t = tueren.map(tuerAus);
  const s = schluessel.map(schluesselAus);
  if (t.some((x) => x === null) || s.some((x) => x === null)) return null;
  const rechte: Record<string, string[]> = {};
  for (const [schluesselId, ids] of Object.entries(berechtigungen)) {
    if (!istText(schluesselId, 12) || !istTextListe(ids, 100, 12)) return null;
    rechte[schluesselId] = [...ids];
  }
  return {
    version: 1,
    ...(system !== undefined ? { system } : {}),
    tueren: t as PlanTuer[],
    schluessel: s as PlanSchluessel[],
    berechtigungen: rechte,
    ...(masseGeprueft !== undefined ? { masseGeprueft } : {}),
  };
}

/* Base64url ohne Buffer, damit der Kern auch im Browser läuft. */
function zuBase64url(text: string): string {
  let binaer = '';
  for (const byte of new TextEncoder().encode(text)) binaer += String.fromCharCode(byte);
  return btoa(binaer).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function ausBase64url(kodiert: string): string {
  const b64 = kodiert.replace(/-/g, '+').replace(/_/g, '/');
  const binaer = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  return new TextDecoder().decode(Uint8Array.from(binaer, (zeichen) => zeichen.charCodeAt(0)));
}

export function kodiere(plan: Schliessplan): string {
  return `1.${zuBase64url(JSON.stringify(plan))}`;
}

/** Passt der Plan in einen Link, der sich auch wieder öffnen lässt? Große Pläne bleiben im Browser. */
export function passtInLink(plan: Schliessplan): boolean {
  return kodiere(plan).length <= ZWISCHENSTAND_HOECHSTENS;
}

const eindeutig = (ids: string[]) => new Set(ids).size === ids.length;

/**
 * Prüft einen Schließplan aus fremder Quelle (Link, Datensatz aus dem Browser) gegen das Schema:
 * doppelte Kennungen verwerfen den Plan, Verweise der Matrix auf unbekannte Türen fallen weg, jeder
 * Schlüssel hat eine Zeile. „Maße geprüft“ übernimmt nur, wer es ausdrücklich verlangt: der Vorgang
 * aus dem Planer (E5-OPUS-03), nie der Link (G-29).
 */
export function planAusDaten(roh: unknown, { masseGeprueft = false }: { masseGeprueft?: boolean } = {}): Schliessplan | null {
  const daten = nachSchema(roh);
  if (!daten) return null;
  if (!eindeutig(daten.tueren.map((t) => t.id)) || !eindeutig(daten.schluessel.map((s) => s.id))) return null;
  const { masseGeprueft: geprueft, ...plan } = daten;
  const tuerIds = new Set(plan.tueren.map((t) => t.id));
  const berechtigungen: Record<string, string[]> = {};
  for (const s of plan.schluessel) {
    berechtigungen[s.id] = [...new Set(plan.berechtigungen[s.id] ?? [])].filter((id) => tuerIds.has(id));
  }
  return { ...plan, berechtigungen, ...(masseGeprueft && geprueft === true ? { masseGeprueft: true } : {}) } as Schliessplan;
}

export function dekodiere(eingabe: string | null | undefined): Schliessplan | null {
  if (!eingabe || eingabe.length > ZWISCHENSTAND_HOECHSTENS || !eingabe.startsWith('1.')) return null;
  try {
    return planAusDaten(JSON.parse(ausBase64url(eingabe.slice(2))));
  } catch {
    return null;
  }
}
