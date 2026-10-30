#!/usr/bin/env node
/**
 * Sicherung der Dateiablage und der Datenbank auf einem Rechner des Betriebs
 * (Leitfaden Kap. 18). Die tägliche, verschlüsselte Sicherung nach R2 macht
 * .github/workflows/sicherung.yml (docs/SUPABASE.md); dieses Skript ist die
 * zusätzliche Kopie fürs Büro. Supabase Free hat keine Backups.
 *
 * Lädt alle Objekte des Buckets (Kundendateien, interne Dateien, Medien)
 * über die S3-Schnittstelle in einen Zielordner und legt einen Abzug der
 * Datenbank daneben – mit denselben pg_dump-Schaltern wie die nächtliche
 * Sicherung (nur `public`, ohne die Daten der Ratenbegrenzung). Zurückspielen:
 * scripts/sicherung/wiederherstellen.sh.
 *
 *   node --env-file=.env.sicherung scripts/sicherung.mjs
 *   SICHERUNG_ZIEL=./sicherung/2026-10-25 node --env-file=.env.sicherung scripts/sicherung.mjs
 *
 * Variablen:
 *   STORAGE_BUCKET, STORAGE_ACCESS_KEY, STORAGE_SECRET_KEY (S3-Schlüssel „sicherung“),
 *   STORAGE_ENDPOINT (Supabase: …/storage/v1/s3), STORAGE_REGION (Standard „auto“)
 *   SICHERUNG_DATABASE_URL  Rolle sm24_sicherung (nur lesen) über den Session-Pooler,
 *                           Port 5432: postgresql://sm24_sicherung.<ref>:<passwort>@<pooler>:5432/postgres
 *   DATABASE_CA_CERT        Zertifikat für die TLS-Prüfung (verify-full)
 *   SICHERUNG_ZIEL          Standard ./sicherung/<heutiges Datum>
 *
 * Der Ordner enthält Fahrzeugscheine, Schlüsselfotos und Kundendaten:
 * verschlüsselt ablegen (z. B. verschlüsseltes Laufwerk), nie ins Repo
 * (`/sicherung/` steht in .gitignore). Schon vorhandene Dateien gleicher
 * Größe werden übersprungen — ein abgebrochener Lauf lässt sich fortsetzen.
 * Die Konsole nennt keine Objektschlüssel (sie tragen Dateinamen von Kunden),
 * sondern eine Kennung, die auch in dateien.json steht.
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
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

/** Dieselben Schalter wie scripts/sicherung/abzug.sh (nächtliche Sicherung). */
const PG_DUMP_SCHALTER = [
  '--format=custom',
  '--schema=public',
  '--no-owner',
  '--no-privileges',
  '--no-comments',
  '--no-publications',
  '--no-subscriptions',
  '--no-security-labels',
  '--no-tablespaces',
  '--exclude-table-data=public.sm24_ratenbegrenzung',
  '--lock-wait-timeout=120s',
];

/** Kurze Kennung eines Objektschlüssels für die Konsole; der Schlüssel selbst steht nur in dateien.json. */
function kennung(schluessel) {
  return createHash('sha256').update(schluessel).digest('hex').slice(0, 12);
}

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
      const eintrag = {
        schluessel: objekt.Key,
        kennung: kennung(objekt.Key),
        bytes: objekt.Size ?? 0,
        geaendert: objekt.LastModified?.toISOString(),
        etag: objekt.ETag,
      };
      verzeichnis.push(eintrag);
      const pfad = zielPfad(basis, objekt.Key);
      if (!pfad) {
        console.warn(`Dateiablage: Objekt ${eintrag.kennung} übersprungen (Schlüssel ist kein sicherer Pfad, siehe dateien.json)`);
        eintrag.fehler = 'kein sicherer Pfad';
        fehler += 1;
        continue;
      }
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
        eintrag.fehler = error instanceof Error ? error.name : 'Fehler';
        console.error(`Dateiablage: Objekt ${eintrag.kennung} nicht geladen (${eintrag.fehler}, siehe dateien.json)`);
      }
    }
    token = seite.IsTruncated ? seite.NextContinuationToken : undefined;
  } while (token);

  writeFileSync(path.join(ZIEL, 'dateien.json'), `${JSON.stringify({ bucket, stand: new Date().toISOString(), objekte: verzeichnis }, null, 2)}\n`, { mode: 0o600 });
  console.log(`Dateiablage: ${verzeichnis.length} Objekte (${geladen} geladen, ${vorhanden} schon vorhanden, ${fehler} Fehler) → ${basis}`);
  return { ok: fehler === 0 };
}

function datenbankSichern() {
  // Nur die Leserolle sm24_sicherung – nie die Rollen der Website oder der Migrationen.
  const url = wert('SICHERUNG_DATABASE_URL');
  if (!url) {
    const alt = ['DATABASE_URL_UNPOOLED', 'POSTGRES_URL_NON_POOLING', 'DATABASE_URL'].find((name) => wert(name));
    console.error(
      `Datenbank: SICHERUNG_DATABASE_URL fehlt — Datenbank NICHT gesichert.${
        alt ? ` (${alt} wird bewusst nicht mehr verwendet: Die Sicherung liest als sm24_sicherung, siehe docs/SUPABASE.md.)` : ''
      }`,
    );
    return { ok: false };
  }
  const version = spawnSync('pg_dump', ['--version'], { encoding: 'utf8' });
  if (version.status !== 0) {
    console.error('Datenbank: pg_dump nicht installiert — Datenbank NICHT gesichert. Supabase Free hat keine Backups; PostgreSQL-Client 17 installieren (pg_dump --version).');
    return { ok: false };
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
    PGAPPNAME: 'sm24-sicherung-buero',
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
  const lauf = spawnSync('pg_dump', [...PG_DUMP_SCHALTER, '--no-password', '--file', datei], {
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
