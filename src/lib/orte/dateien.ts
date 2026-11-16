/*
 * Liest die vier Dateien des Ortsstamms aus content/orte/ (FA-PLATTFORM-03). Mit node:fs, nicht per Import: So
 * gelangt kein Stamm in ein Bündel. In der Anwendung nur über stamm.ts (server-only); der Seed und die
 * Datenbankübernahme lesen direkt hier, weil `payload run` die Bedingung „react-server“ nicht kennt.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { GemeindenDatei, KreiseDatei, OrtsstammDaten, PostleitzahlenDatei, PrioritaetDatei } from './typen';

export const ORTSSTAMM_ORDNER = path.join(process.cwd(), 'content', 'orte');

export const ORTSSTAMM_DATEIEN = {
  gemeinden: 'gemeinden.json',
  kreise: 'kreise.json',
  postleitzahlen: 'postleitzahlen.json',
  prioritaet: 'prioritaet.json',
} as const;

async function lies<T>(ordner: string, datei: string): Promise<T> {
  return JSON.parse(await fs.readFile(path.join(ordner, datei), 'utf8')) as T;
}

/** Alle vier Dateien. Fehlt eine, bricht das ab: Der Stamm gehört zum Repository. */
export async function ortsstammLesen(ordner = ORTSSTAMM_ORDNER): Promise<OrtsstammDaten> {
  const [gemeinden, kreise, postleitzahlen, prioritaet] = await Promise.all([
    lies<GemeindenDatei>(ordner, ORTSSTAMM_DATEIEN.gemeinden),
    lies<KreiseDatei>(ordner, ORTSSTAMM_DATEIEN.kreise),
    lies<PostleitzahlenDatei>(ordner, ORTSSTAMM_DATEIEN.postleitzahlen),
    lies<PrioritaetDatei>(ordner, ORTSSTAMM_DATEIEN.prioritaet),
  ]);
  return { gemeinden, kreise, postleitzahlen, prioritaet };
}

let prioritaetZwischenspeicher: Promise<PrioritaetDatei> | null = null;

/**
 * Nur die Prioritätsliste (Anhang A), einmal je Prozess. Für den Hook der Ortsseiten (Stufe aus Anhang A), der auch
 * unter `payload run` läuft und deshalb nicht über stamm.ts liest.
 */
export function prioritaetLesen(ordner = ORTSSTAMM_ORDNER): Promise<PrioritaetDatei> {
  if (ordner !== ORTSSTAMM_ORDNER) return lies<PrioritaetDatei>(ordner, ORTSSTAMM_DATEIEN.prioritaet);
  prioritaetZwischenspeicher ??= lies<PrioritaetDatei>(ordner, ORTSSTAMM_DATEIEN.prioritaet).catch((fehler) => {
    prioritaetZwischenspeicher = null;
    throw fehler;
  });
  return prioritaetZwischenspeicher;
}
