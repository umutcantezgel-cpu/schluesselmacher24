import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { createLocalReq, type Payload, type PayloadRequest } from 'payload';
import sharp from 'sharp';

import type { UploadRef } from '../types';

import type { BlattBild } from './blatt';
import { VORSCHAU_ARTEN } from './vorgangsblatt';

/*
 * Vorschaubilder fürs Vorgangsblatt (E-110, A-015): nur Arten aus VORSCHAU_ARTEN, höchstens sechs,
 * auf 900 px verkleinert, als JPEG ohne Metadaten (sharp entfernt EXIF und Ortsangaben), Ausrichtung
 * aus EXIF übernommen. Gelesen wird über den Speicher der Sammlung `kundendateien`: mit Bucket über
 * den Abruf-Handler des Speicher-Plugins, sonst aus dem privaten Ordner. Fehler lassen ein Bild aus,
 * nie das Blatt.
 */

export const VORSCHAU_HOECHSTENS = 6;
export const VORSCHAU_KANTE = 900;

export async function verkleinere(daten: Uint8Array): Promise<Buffer> {
  return sharp(daten, { failOn: 'error' })
    .rotate()
    .resize({ width: VORSCHAU_KANTE, height: VORSCHAU_KANTE, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 72, mozjpeg: true })
    .toBuffer();
}

/** Welche Unterlagen eine Vorschau bekommen (reine Auswahl, ohne Zugriff). */
export function vorschauKandidaten(uploads: UploadRef[]): UploadRef[] {
  return uploads
    .filter((u) => Boolean(u.storageKey) && VORSCHAU_ARTEN.includes(u.category) && /^image\/(jpeg|png|webp|heic|heif)$/.test(u.mimeType))
    .slice(0, VORSCHAU_HOECHSTENS);
}

interface Kundendatei {
  id: number | string;
  filename?: string | null;
  prefix?: string | null;
}

async function dateiLesen(payload: Payload, doc: Kundendatei, req?: PayloadRequest): Promise<Buffer | null> {
  if (!doc.filename) return null;
  const sammlung = payload.collections.kundendateien?.config;
  const upload = sammlung && typeof sammlung.upload === 'object' ? sammlung.upload : undefined;
  const handlers = upload?.handlers ?? [];
  if (handlers.length) {
    const anfrage = req ?? (await createLocalReq({}, payload));
    for (const handler of handlers) {
      const antwort = await handler(anfrage, {
        doc: doc as never,
        params: { collection: 'kundendateien', filename: doc.filename, prefix: doc.prefix ?? undefined },
      });
      if (antwort instanceof Response) return antwort.ok ? Buffer.from(await antwort.arrayBuffer()) : null;
    }
  }
  // Kundendateien liegen außerhalb des Builds (privater Ordner); nicht in die Funktion verfolgen.
  const ordner = upload?.staticDir ?? path.resolve(/* turbopackIgnore: true */ process.cwd(), 'private-uploads');
  return readFile(path.join(/* turbopackIgnore: true */ ordner, path.basename(doc.filename)));
}

export async function ladeVorschaubilder(payload: Payload, uploads: UploadRef[], req?: PayloadRequest): Promise<BlattBild[]> {
  const bilder: BlattBild[] = [];
  for (const upload of vorschauKandidaten(uploads)) {
    try {
      const doc = (await payload.findByID({
        collection: 'kundendateien',
        id: String(upload.storageKey),
        depth: 0,
        overrideAccess: true,
        disableErrors: true,
      })) as Kundendatei | null;
      const roh = doc ? await dateiLesen(payload, doc, req) : null;
      if (roh) bilder.push({ name: upload.fileName, daten: await verkleinere(roh) });
    } catch (error) {
      console.warn('[vorgangsblatt] Vorschau ausgelassen:', upload.fileName, error instanceof Error ? error.message : error);
    }
  }
  return bilder;
}
