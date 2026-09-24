import { randomBytes } from 'node:crypto';

import { sql, type PostgresAdapter } from '@payloadcms/db-postgres';
import type { Payload, PayloadRequest } from 'payload';

import type { Settings } from '@/lib/types';

import { KUNDENDATEI_ID_MUSTER, type Dateityp, type UploadKategorie } from './datei-pruefung';

/*
 * Kundendateien: Fotos und Unterlagen aus den Formularen, abgelegt in der
 * privaten Payload-Sammlung `kundendateien`.
 *
 * Ablauf: Der Browser lädt jede Datei einzeln hoch (/api/kunden-upload) und
 * erhält dafür einen zufälligen Schlüssel. Gespeichert wird nur dessen Hash.
 * Beim Absenden des Formulars ordnet der Server die Dateien mit diesem
 * Schlüssel dem neuen Vorgang zu und löscht den Hash — so kann niemand fremde
 * Dateien an seinen Vorgang hängen. Nie zugeordnete Dateien und Dateien mit
 * abgelaufener Frist entfernt src/scripts/aufbewahrung-bereinigen.ts.
 *
 * Bewusst ohne 'server-only': Das Bereinigungsskript läuft mit
 * `npx payload run` außerhalb von Next, wo es dieses Paket nicht gibt.
 * Module mit 'server-only' werden deshalb erst bei Bedarf geladen.
 */

const TAG_MS = 24 * 60 * 60 * 1000;

/** Nie einem Vorgang zugeordnete Uploads werden nach dieser Zeit gelöscht. */
export const UNVERKNUEPFT_LOESCHEN_NACH_MS = TAG_MS;

type Fristen = Settings['retentionDays'];

/** Welche Aufbewahrungsfrist aus den Einstellungen für welche Unterlage gilt. */
const FRIST_JE_KATEGORIE: Record<UploadKategorie, keyof Fristen> = {
  schluesselfoto: 'keyPhotos',
  fahrzeugschein: 'vehicleRegistration',
  grundriss: 'floorPlans',
  dokument: 'projectDocuments',
  // Objektfotos gehören zu den Projektunterlagen (so auch im Sicherheitscheck angekündigt).
  objektfoto: 'projectDocuments',
};

export function aufbewahrenBis(kategorie: UploadKategorie, fristen: Fristen, jetzt = new Date()): Date {
  const tage = Math.trunc(Number(fristen[FRIST_JE_KATEGORIE[kategorie]]));
  // Mindestens ein Tag: sonst verschwände die Datei, bevor das Formular abgeschickt ist.
  const sicher = Number.isFinite(tage) ? Math.min(Math.max(tage, 1), 3650) : 1;
  return new Date(jetzt.getTime() + sicher * TAG_MS);
}

async function payloadAus(payload?: Payload, req?: Partial<PayloadRequest>): Promise<Payload> {
  if (payload) return payload;
  if (req?.payload) return req.payload;
  const { payloadInstanz } = await import('@/lib/data/payload-adapter');
  return payloadInstanz();
}

type Abfrage = ReturnType<typeof sql>;
interface SqlAusfuehrer {
  execute(abfrage: Abfrage): Promise<{ rows: Record<string, unknown>[] }>;
}

/** Die Datenbankverbindung der laufenden Transaktion, sonst die normale. */
async function datenbank(payload: Payload, req?: Partial<PayloadRequest>): Promise<SqlAusfuehrer> {
  const adapter = payload.db as unknown as PostgresAdapter;
  const transaktion = req?.transactionID ? await req.transactionID : undefined;
  const sitzung = transaktion !== undefined ? adapter.sessions?.[transaktion]?.db : undefined;
  return (sitzung ?? adapter.drizzle) as unknown as SqlAusfuehrer;
}

function alsId(wert: unknown): number | null {
  const text = typeof wert === 'number' ? String(wert) : wert;
  if (typeof text !== 'string' || !KUNDENDATEI_ID_MUSTER.test(text)) return null;
  const id = Number(text);
  return Number.isSafeInteger(id) ? id : null;
}

/** Zufallsanhang: Viele Telefone nennen jedes Foto „image.jpg“. */
function mitZufallsanhang(dateiname: string): string {
  const punkt = dateiname.lastIndexOf('.');
  const anhang = randomBytes(4).toString('hex');
  return punkt > 0
    ? `${dateiname.slice(0, punkt)}-${anhang}${dateiname.slice(punkt)}`
    : `${dateiname}-${anhang}`;
}

/* ---------- Speichern --------------------------------------------------- */

export interface NeueKundendatei {
  daten: Uint8Array;
  /** Aus den Magic Bytes erkannt (datei-pruefung.ts). */
  typ: Dateityp;
  /** Bereits gesäubert, mit Endung. */
  dateiname: string;
  kategorie: UploadKategorie;
  aufbewahrenBis: Date;
  /** Hash des Upload-Schlüssels (access-token.ts). */
  uploadSchluesselHash: string;
  payload?: Payload;
}

export interface GespeicherteKundendatei {
  /** Kennung der Kundendatei; im Browser als `storageKey` geführt. */
  id: string;
  fileName: string;
  sizeBytes: number;
  mimeType: string;
  category: UploadKategorie;
}

export async function speichereKundendatei(neu: NeueKundendatei): Promise<GespeicherteKundendatei> {
  const payload = await payloadAus(neu.payload);
  const name = mitZufallsanhang(neu.dateiname);
  const daten = Buffer.from(neu.daten.buffer, neu.daten.byteOffset, neu.daten.byteLength);

  // Die Sammlung erlaubt kein Anlegen über Backend oder API — nur auf diesem Weg.
  const doc = await payload.create({
    collection: 'kundendateien',
    data: {
      kategorie: neu.kategorie,
      aufbewahrenBis: neu.aufbewahrenBis.toISOString(),
      uploadSchluesselHash: neu.uploadSchluesselHash,
    },
    file: { data: daten, mimetype: neu.typ.mimeType, name, size: daten.byteLength },
    overrideAccess: true,
  });

  return {
    id: String(doc.id),
    fileName: doc.filename ?? name,
    sizeBytes: doc.filesize ?? daten.byteLength,
    mimeType: doc.mimeType ?? neu.typ.mimeType,
    category: doc.kategorie,
  };
}

/* ---------- Zuordnen zum Vorgang ---------------------------------------- */

export interface UploadVerweis {
  /** Kennung der Kundendatei (`storageKey`). */
  id: string | number;
  uploadToken: string;
}

export interface VerknuepfenEingabe {
  vorgangId: string | number;
  uploads: UploadVerweis[];
  /** Mit `req` läuft die Zuordnung in dessen Transaktion. */
  req?: Partial<PayloadRequest>;
  payload?: Payload;
}

/**
 * Ordnet hochgeladene Dateien einem Vorgang zu.
 *
 * Je Datei muss der Schlüssel aus dem Upload passen (zeitkonstanter
 * Vergleich) und die Datei darf noch keinem Vorgang gehören. Danach wird der
 * Hash gelöscht; ein zweiter Versuch mit demselben Schlüssel geht ins Leere.
 * Nicht passende Dateien werden still übergangen.
 *
 * @returns die Kennungen der zugeordneten Dateien
 */
export async function verknuepfeKundendateien({
  vorgangId,
  uploads,
  req,
  payload: payloadArg,
}: VerknuepfenEingabe): Promise<number[]> {
  const vorgang = alsId(vorgangId);
  if (vorgang === null || uploads.length === 0) return [];

  const payload = await payloadAus(payloadArg, req);
  // Erst hier laden: access-token.ts ist 'server-only' (siehe Kopfkommentar).
  const { verifyAccessToken } = await import('./access-token');
  const db = await datenbank(payload, req);

  const verknuepft: number[] = [];
  const gesehen = new Set<number>();

  for (const upload of uploads.slice(0, 50)) {
    const id = alsId(upload.id);
    if (id === null || gesehen.has(id)) continue;
    gesehen.add(id);

    const doc = await payload.findByID({
      collection: 'kundendateien',
      id,
      depth: 0,
      overrideAccess: true,
      disableErrors: true,
      req,
    });
    const hash = doc?.uploadSchluesselHash;
    if (!doc || doc.vorgang != null || !hash) continue;
    if (!verifyAccessToken(upload.uploadToken, hash)) continue;

    // Bedingt und in einem Schritt: Laufen zwei Zuordnungen gleichzeitig,
    // gewinnt genau eine.
    const result = await db.execute(sql`
      UPDATE "kundendateien"
      SET "vorgang_id" = ${vorgang}, "upload_schluessel_hash" = NULL, "updated_at" = now()
      WHERE "id" = ${id} AND "vorgang_id" IS NULL AND "upload_schluessel_hash" = ${hash}
      RETURNING "id"
    `);
    if (result.rows.length > 0) verknuepft.push(id);
  }

  return verknuepft;
}

/* ---------- Aufbewahrung ------------------------------------------------ */

export interface ZuLoeschendeKundendatei {
  id: number;
  dateiname: string | null;
  grund: 'frist-abgelaufen' | 'nie-zugeordnet';
}

/**
 * Wählt Dateien mit abgelaufener Aufbewahrungsfrist und Uploads, die nie
 * einem Vorgang zugeordnet wurden und älter als 24 Stunden sind.
 */
export async function waehleZuLoeschendeKundendateien({
  payload: payloadArg,
  jetzt = new Date(),
}: { payload?: Payload; jetzt?: Date } = {}): Promise<ZuLoeschendeKundendatei[]> {
  const payload = await payloadAus(payloadArg);
  const grenzeUnverknuepft = new Date(jetzt.getTime() - UNVERKNUEPFT_LOESCHEN_NACH_MS);

  const result = await payload.find({
    collection: 'kundendateien',
    where: {
      or: [
        { aufbewahrenBis: { less_than_equal: jetzt.toISOString() } },
        {
          and: [
            { vorgang: { exists: false } },
            { createdAt: { less_than: grenzeUnverknuepft.toISOString() } },
          ],
        },
      ],
    },
    depth: 0,
    pagination: false,
    limit: 0,
    sort: 'id',
    overrideAccess: true,
  });

  return result.docs.map((doc) => ({
    id: doc.id,
    dateiname: doc.filename ?? null,
    grund:
      doc.aufbewahrenBis && new Date(doc.aufbewahrenBis).getTime() <= jetzt.getTime()
        ? 'frist-abgelaufen'
        : 'nie-zugeordnet',
  }));
}

export interface Bereinigung {
  geloescht: ZuLoeschendeKundendatei[];
  fehlgeschlagen: Array<ZuLoeschendeKundendatei & { fehler: string }>;
}

/** Löscht die ausgewählten Dateien samt Datei im Ablageordner. */
export async function bereinigeKundendateien({
  payload: payloadArg,
  jetzt = new Date(),
  probelauf = false,
}: { payload?: Payload; jetzt?: Date; probelauf?: boolean } = {}): Promise<Bereinigung> {
  const payload = await payloadAus(payloadArg);
  const auswahl = await waehleZuLoeschendeKundendateien({ payload, jetzt });
  if (probelauf) return { geloescht: auswahl, fehlgeschlagen: [] };

  const ergebnis: Bereinigung = { geloescht: [], fehlgeschlagen: [] };
  for (const datei of auswahl) {
    try {
      await payload.delete({ collection: 'kundendateien', id: datei.id, overrideAccess: true });
      ergebnis.geloescht.push(datei);
    } catch (error) {
      ergebnis.fehlgeschlagen.push({ ...datei, fehler: error instanceof Error ? error.message : String(error) });
    }
  }
  return ergebnis;
}
