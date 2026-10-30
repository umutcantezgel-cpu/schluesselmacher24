#!/usr/bin/env node
/**
 * SCRAM-SHA-256-Verifier für ein Datenbankpasswort (docs/SUPABASE.md).
 *
 * Postgres speichert Passwörter ohnehin nur als Verifier. Wer den Verifier
 * statt des Klartexts setzt, hinterlässt das Passwort weder in der Historie
 * des SQL-Editors noch in Protokollen. Den Verifier zusätzlich im
 * Passwortmanager aufbewahren: Nach einer Wiederherstellung oder einem Upgrade
 * fehlen die Passwörter eigener Rollen und werden damit neu gesetzt.
 *
 *   node scripts/scram-verifier.mjs sm24_app
 *     → Passwort eingeben (keine Anzeige) oder per Pipe übergeben,
 *       Ausgabe: alter role sm24_app password 'SCRAM-SHA-256$4096:…';
 *   node scripts/scram-verifier.mjs
 *     → nur der Verifier
 *
 * Erlaubt sind nur druckbare ASCII-Zeichen (mindestens 24): Postgres
 * normalisiert andere Zeichen per SASLprep, was hier nicht nachgebildet wird.
 * Nur Node-Bordmittel.
 */
import { createHash, createHmac, pbkdf2Sync, randomBytes } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const ITERATIONEN = 4096;
export const MINDESTLAENGE = 24;

/** @param {string} passwort */
export function passwortPruefen(passwort) {
  if (!/^[\x21-\x7e]+$/.test(passwort)) {
    return 'Nur druckbare ASCII-Zeichen ohne Leerzeichen erlaubt (Passwortmanager: Sonderzeichen aus dem ASCII-Bereich).';
  }
  if (passwort.length < MINDESTLAENGE) return `Mindestens ${MINDESTLAENGE} Zeichen.`;
  return null;
}

/**
 * Verifier im Format von Postgres: SCRAM-SHA-256$<runden>:<salz>$<StoredKey>:<ServerKey>.
 * @param {string} passwort
 * @param {{ salz?: Buffer, iterationen?: number }} [optionen]
 */
export function scramVerifier(passwort, { salz = randomBytes(16), iterationen = ITERATIONEN } = {}) {
  const gesalzen = pbkdf2Sync(Buffer.from(passwort, 'utf8'), salz, iterationen, 32, 'sha256');
  const clientKey = createHmac('sha256', gesalzen).update('Client Key').digest();
  const storedKey = createHash('sha256').update(clientKey).digest();
  const serverKey = createHmac('sha256', gesalzen).update('Server Key').digest();
  return `SCRAM-SHA-256$${iterationen}:${salz.toString('base64')}$${storedKey.toString('base64')}:${serverKey.toString('base64')}`;
}

/**
 * @param {string} rolle
 * @param {string} verifier
 */
export function alterRole(rolle, verifier) {
  if (!/^[a-z_][a-z0-9_]{0,62}$/.test(rolle)) throw new Error(`Ungültiger Rollenname: ${rolle}`);
  return `alter role ${rolle} password '${verifier}';`;
}

/** Liest das Passwort ohne Anzeige (Terminal) oder aus einer Pipe. */
async function passwortLesen() {
  const { stdin, stderr } = process;
  if (!stdin.isTTY) {
    let text = '';
    for await (const teil of stdin) text += teil;
    return text.replace(/\r?\n$/, '');
  }
  stderr.write('Passwort (wird nicht angezeigt): ');
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding('utf8');
  return new Promise((resolve, reject) => {
    let text = '';
    const ende = () => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener('data', lesen);
      stderr.write('\n');
    };
    /** @param {string} zeichen */
    const lesen = (zeichen) => {
      for (const z of zeichen) {
        if (z === '\r' || z === '\n') {
          ende();
          resolve(text);
          return;
        }
        if (z === '\u0003') {
          ende();
          reject(new Error('Abgebrochen.'));
          return;
        }
        if (z === '\u007f' || z === '\b') text = text.slice(0, -1);
        else text += z;
      }
    };
    stdin.on('data', lesen);
  });
}

async function main() {
  const rolle = process.argv[2];
  const passwort = await passwortLesen();
  const fehler = passwortPruefen(passwort);
  if (fehler) {
    console.error(fehler);
    process.exit(1);
  }
  const verifier = scramVerifier(passwort);
  console.log(rolle ? alterRole(rolle, verifier) : verifier);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
