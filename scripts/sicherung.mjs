#!/usr/bin/env node
/**
 * Sicherung der Dateiablage und der Datenbank (Leitfaden Kap. 18).
 *
 * Lädt alle Objekte des Buckets (Kundendateien, interne Dateien, Medien)
 * über die S3-Schnittstelle in einen Zielordner und legt — wenn `pg_dump`
 * installiert ist — einen Abzug der Datenbank daneben. Läuft auf einem
 * Rechner des Betriebs, nicht auf Vercel; keine weiteren Dienste.
 *
 *   node --env-file=.env.sicherung scripts/sicherung.mjs
 *   SICHERUNG_ZIEL=./sicherung/2026-10-25 node --env-file=.env.sicherung scripts/sicherung.mjs
 *
 * Variablen wie im Betrieb (src/lib/umgebung.ts):
 *   STORAGE_BUCKET, STORAGE_ACCESS_KEY, STORAGE_SECRET_KEY,
 *   STORAGE_ENDPOINT (Supabase: …/storage/v1/s3), STORAGE_REGION (Standard „auto“)
 *   DATABASE_URL_UNPOOLED (Session-Pooler, Port 5432; sonst POSTGRES_URL_NON_POOLING
 *   oder DATABASE_URL), DATABASE_CA_CERT (Zertifikat für die TLS-Prüfung)
 *   SICHERUNG_ZIEL (Standard ./sicherung/<heutiges Datum>)
 *
 * Der Ordner enthält Fahrzeugscheine, Schlüsselfotos und Kundendaten:
 * verschlüsselt ablegen (z. B. verschlüsseltes Laufwerk), nie ins Repo
 * (`/sicherung/` steht in .gitignore). Schon vorhandene Dateien gleicher
 * Größe werden übersprungen — ein abgebrochener Lauf lässt sich fortsetzen.
 */
import { spawnSync } from 'node:child_process';
import { createWriteStream, existsSync, mkdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const wert = (name) => process.env[name]?.trim() || undefined;

function heute() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

const ZIEL = path.resolve(wert('SICHERUNG_ZIEL') ?? path.join('sicherung', heute()));

/** Objektschlüssel als sicherer Pfad unterhalb von `basis` — nie außerhalb. */
function zielPfad(basis, schluessel) {
  const teile = schluessel.split('/').filter((teil) => teil && teil !== '.' && teil !== '..');
  if (teile.length === 0) return null;
  const pfad = path.join(basis, ...teile);
  return pfad.startsWith(basis + path.sep) ? pfad : null;
}

async function bucketSichern() {
  const bucket = wert('STORAGE_BUCKET');
  const accessKeyId = wert('STORAGE_ACCESS_KEY');
  const secretAccessKey = wert('STORAGE_SECRET_KEY');
  if (!bucket || !accessKeyId || !secretAccessKey) {
    console.error('Dateiablage: STORAGE_BUCKET, STORAGE_ACCESS_KEY oder STORAGE_SECRET_KEY fehlt.');
    return { ok: false };
  }

  // Das S3-Paket kommt mit @payloadcms/storage-s3 — keine eigene Abhängigkeit.
  let s3;
  try {
    s3 = await import('@aws-sdk/client-s3');
  } catch {
    console.error('Dateiablage: @aws-sdk/client-s3 nicht gefunden. Bitte zuerst „npm install“ ausführen.');
    return { ok: false };
  }
  const { GetObjectCommand, ListObjectsV2Command, S3Client } = s3;
  const endpoint = wert('STORAGE_ENDPOINT');
  const client = new S3Client({
    region: wert('STORAGE_REGION') ?? 'auto',
    ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
    credentials: { accessKeyId, secretAccessKey },
    // Wie in payload.config.ts: S3-kompatible Anbieter mögen keine Prüfsummen-Trailer.
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  });

  const basis = path.join(ZIEL, 'dateien');
  mkdirSync(basis, { recursive: true });
  const verzeichnis = [];
  let geladen = 0;
  let vorhanden = 0;
  let fehler = 0;
  let token;

  do {
    const seite = await client.send(new ListObjectsV2Command({ Bucket: bucket, ContinuationToken: token }));
    for (const objekt of seite.Contents ?? []) {
      if (!objekt.Key || objekt.Key.endsWith('/')) continue;
      const pfad = zielPfad(basis, objekt.Key);
      if (!pfad) {
        console.warn(`Dateiablage: Schlüssel übersprungen (kein sicherer Pfad): ${JSON.stringify(objekt.Key)}`);
        fehler += 1;
        continue;
      }
      verzeichnis.push({ schluessel: objekt.Key, bytes: objekt.Size ?? 0, geaendert: objekt.LastModified?.toISOString(), etag: objekt.ETag });
      if (existsSync(pfad) && statSync(pfad).size === objekt.Size) {
        vorhanden += 1;
        continue;
      }
      try {
        mkdirSync(path.dirname(pfad), { recursive: true });
        const antwort = await client.send(new GetObjectCommand({ Bucket: bucket, Key: objekt.Key }));
        const koerper = antwort.Body instanceof Readable ? antwort.Body : Readable.fromWeb(antwort.Body.transformToWebStream());
        await pipeline(koerper, createWriteStream(pfad, { mode: 0o600 }));
        geladen += 1;
      } catch (error) {
        fehler += 1;
        rmSync(pfad, { force: true });
        console.error(`Dateiablage: ${objekt.Key} nicht geladen (${error instanceof Error ? error.name : 'Fehler'})`);
      }
    }
    token = seite.IsTruncated ? seite.NextContinuationToken : undefined;
  } while (token);

  writeFileSync(path.join(ZIEL, 'dateien.json'), `${JSON.stringify({ bucket, stand: new Date().toISOString(), objekte: verzeichnis }, null, 2)}\n`, { mode: 0o600 });
  console.log(`Dateiablage: ${verzeichnis.length} Objekte (${geladen} geladen, ${vorhanden} schon vorhanden, ${fehler} Fehler) → ${basis}`);
  return { ok: fehler === 0 };
}

function datenbankSichern() {
  const url = wert('DATABASE_URL_UNPOOLED') ?? wert('POSTGRES_URL_NON_POOLING') ?? wert('DATABASE_URL');
  if (!url) {
    console.warn('Datenbank: DATABASE_URL_UNPOOLED fehlt — übersprungen.');
    return { ok: true, uebersprungen: true };
  }
  const version = spawnSync('pg_dump', ['--version'], { encoding: 'utf8' });
  if (version.status !== 0) {
    console.warn('Datenbank: pg_dump nicht installiert — übersprungen. Supabase sichert die Datenbank täglich (siehe docs/LIVEGANG.md).');
    return { ok: true, uebersprungen: true };
  }

  // Zugangsdaten über Umgebungsvariablen statt in der Befehlszeile (sonst in `ps` sichtbar).
  const verbindung = new URL(url);
  const env = {
    ...process.env,
    PGHOST: verbindung.hostname,
    PGPORT: verbindung.port || '5432',
    PGUSER: decodeURIComponent(verbindung.username),
    PGPASSWORD: decodeURIComponent(verbindung.password),
    PGDATABASE: decodeURIComponent(verbindung.pathname.replace(/^\//, '')) || 'postgres',
  };
  let zertifikat;
  const ca = wert('DATABASE_CA_CERT');
  if (ca) {
    zertifikat = path.join(os.tmpdir(), `sm24-sicherung-${process.pid}.crt`);
    writeFileSync(zertifikat, ca.replace(/\\n/g, '\n'), { mode: 0o600 });
    env.PGSSLROOTCERT = zertifikat;
    env.PGSSLMODE = 'verify-full';
  } else if (verbindung.searchParams.get('sslmode')) {
    env.PGSSLMODE = verbindung.searchParams.get('sslmode');
  }

  mkdirSync(ZIEL, { recursive: true });
  const datei = path.join(ZIEL, 'datenbank.dump');
  const lauf = spawnSync('pg_dump', ['--format=custom', '--no-owner', '--no-privileges', '--file', datei], {
    env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (zertifikat) rmSync(zertifikat, { force: true });
  if (lauf.status !== 0) {
    rmSync(datei, { force: true });
    console.error(`Datenbank: pg_dump fehlgeschlagen (${version.stdout.trim()}).\n${lauf.stderr.replace(/password=\S+/gi, 'password=***').trim()}`);
    return { ok: false };
  }
  console.log(`Datenbank: ${(statSync(datei).size / 1024 / 1024).toFixed(1)} MB → ${datei} (${version.stdout.trim()})`);
  return { ok: true };
}

console.log(`Sicherung nach ${ZIEL}`);
mkdirSync(ZIEL, { recursive: true, mode: 0o700 });
const dateien = await bucketSichern().catch((error) => {
  console.error(`Dateiablage: Sicherung abgebrochen (${error instanceof Error ? `${error.name}: ${error.message}` : 'Fehler'})`);
  return { ok: false };
});
const datenbank = datenbankSichern();
const ok = dateien.ok && datenbank.ok;
console.log(ok ? 'Sicherung abgeschlossen.' : 'Sicherung mit Fehlern beendet — Ausgabe oben prüfen.');
process.exit(ok ? 0 : 1);
