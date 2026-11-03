/*
 * Zwischenstand per Link (Kern laut Plan, G-27): der Schließplan als kurzer Text in der Adresse
 * (Base64url aus JSON, Version vorn). Gelesen wird nur, was dem Schema entspricht; sonst null.
 * Keine Kontaktdaten im Link, nur Türen, Schlüssel und Matrix mit ihren Bezeichnungen.
 *
 * Beim Lesen (E5-OPUS-01): Verweise der Matrix auf unbekannte Türen oder Schlüssel fallen weg, jeder
 * Schlüssel hat eine Zeile, und „Maße geprüft“ wird nie übernommen: Die Bestätigung gibt, wer den
 * Plan jetzt vor sich hat (G-29).
 */

import { z } from 'zod';

import type { Schliessplan } from './schliessplan';

/** Obergrenze, damit der Link in Mail und Messenger heil bleibt. */
export const ZWISCHENSTAND_HOECHSTENS = 6000;

const text = z.string().max(60);
const schema = z.object({
  version: z.literal(1),
  system: z.string().max(40).optional(),
  tueren: z.array(z.object({
    id: z.string().max(12),
    bezeichnung: text,
    form: z.enum(['doppelzylinder', 'knaufzylinder', 'halbzylinder']),
    a: z.number().int().min(0).max(300),
    b: z.number().int().min(0).max(300).optional(),
    funktionId: z.string().max(40).optional(),
    optionen: z.array(z.string().max(40)).max(10).optional(),
  })).max(100),
  schluessel: z.array(z.object({
    id: z.string().max(12),
    bezeichnung: text,
    anzahl: z.number().int().min(0).max(500),
    reserve: z.number().int().min(0).max(500).optional(),
    kennzeichnung: z.string().max(40).optional(),
  })).max(100),
  berechtigungen: z.record(z.string().max(12), z.array(z.string().max(12)).max(100)),
  masseGeprueft: z.boolean().optional(),
});

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

export function dekodiere(eingabe: string | null | undefined): Schliessplan | null {
  if (!eingabe || eingabe.length > ZWISCHENSTAND_HOECHSTENS || !eingabe.startsWith('1.')) return null;
  try {
    const roh = JSON.parse(ausBase64url(eingabe.slice(2)));
    const ergebnis = schema.safeParse(roh);
    if (!ergebnis.success) return null;
    if (!eindeutig(ergebnis.data.tueren.map((t) => t.id)) || !eindeutig(ergebnis.data.schluessel.map((s) => s.id))) return null;
    const { masseGeprueft: _nieUebernehmen, ...plan } = ergebnis.data;
    void _nieUebernehmen;
    const tuerIds = new Set(plan.tueren.map((t) => t.id));
    const berechtigungen: Record<string, string[]> = {};
    for (const s of plan.schluessel) {
      berechtigungen[s.id] = (plan.berechtigungen[s.id] ?? []).filter((id) => tuerIds.has(id));
    }
    return { ...plan, berechtigungen } as Schliessplan;
  } catch {
    return null;
  }
}
