import type { UploadRef } from '@/lib/types';

/*
 * Prüfung hochgeladener Kundendateien.
 *
 * Maßgeblich ist allein der Inhalt (die ersten Bytes der Datei). Dateiendung
 * und der vom Browser gemeldete Typ lassen sich beliebig setzen und zählen
 * deshalb nicht. Bewusst ohne 'server-only' und ohne Node-Abhängigkeiten:
 * reine Logik, die auch das Bereinigungsskript laden kann.
 */

export type UploadKategorie = UploadRef['category'];

export const UPLOAD_KATEGORIEN = [
  'schluesselfoto',
  'fahrzeugschein',
  'grundriss',
  'dokument',
  'objektfoto',
] as const satisfies readonly UploadKategorie[];

/** Kennung einer Kundendatei, wie sie der Browser als `storageKey` zurückschickt. */
export const KUNDENDATEI_ID_MUSTER = /^[1-9][0-9]{0,11}$/;

/** Upload-Schlüssel: 32 zufällige Bytes in base64url (siehe access-token.ts). */
export const UPLOAD_TOKEN_MUSTER = /^[A-Za-z0-9_-]{43}$/;

/** Nur bei diesen Unterlagen ist ein PDF sinnvoll; Fotos müssen Bilder sein. */
const KATEGORIEN_MIT_PDF: readonly UploadKategorie[] = ['fahrzeugschein', 'grundriss', 'dokument'];

export const MAX_BILD_BYTES = 12 * 1024 * 1024;
export const MAX_PDF_BYTES = 15 * 1024 * 1024;

export interface Dateityp {
  art: 'bild' | 'pdf';
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/heic' | 'image/heif' | 'application/pdf';
  endung: 'jpg' | 'png' | 'webp' | 'heic' | 'heif' | 'pdf';
}

const JPEG: Dateityp = { art: 'bild', mimeType: 'image/jpeg', endung: 'jpg' };
const PNG: Dateityp = { art: 'bild', mimeType: 'image/png', endung: 'png' };
const WEBP: Dateityp = { art: 'bild', mimeType: 'image/webp', endung: 'webp' };
const HEIC: Dateityp = { art: 'bild', mimeType: 'image/heic', endung: 'heic' };
const HEIF: Dateityp = { art: 'bild', mimeType: 'image/heif', endung: 'heif' };
const PDF: Dateityp = { art: 'pdf', mimeType: 'application/pdf', endung: 'pdf' };

/** Hauptmarke der ISO-Mediendatei (Bytes 8–11 nach „ftyp“). */
const HEIF_MARKEN: Record<string, Dateityp> = {
  heic: HEIC,
  heix: HEIC,
  hevc: HEIC,
  mif1: HEIF,
};

const PNG_SIGNATUR = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function beginntMit(bytes: Uint8Array, signatur: number[], ab = 0): boolean {
  if (bytes.length < ab + signatur.length) return false;
  return signatur.every((wert, i) => bytes[ab + i] === wert);
}

function ascii(bytes: Uint8Array, von: number, bis: number): string {
  if (bytes.length < bis) return '';
  return String.fromCharCode(...bytes.subarray(von, bis));
}

/** Erkennt den Dateityp an den Magic Bytes. Unbekanntes ergibt `null`. */
export function erkenneDateityp(bytes: Uint8Array): Dateityp | null {
  if (beginntMit(bytes, [0xff, 0xd8, 0xff])) return JPEG;
  if (beginntMit(bytes, PNG_SIGNATUR)) return PNG;
  if (ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 12) === 'WEBP') return WEBP;
  if (ascii(bytes, 4, 8) === 'ftyp') return HEIF_MARKEN[ascii(bytes, 8, 12)] ?? null;
  if (ascii(bytes, 0, 5) === '%PDF-') return PDF;
  return null;
}

export function maxBytesFuer(typ: Dateityp): number {
  return typ.art === 'pdf' ? MAX_PDF_BYTES : MAX_BILD_BYTES;
}

export const MELDUNG_ZU_GROSS =
  'Die Datei ist zu groß. Fotos dürfen höchstens 12 MB, PDF-Dokumente höchstens 15 MB groß sein.';

export const MELDUNG_FORMAT =
  'Dieses Dateiformat können wir nicht annehmen. Möglich sind Fotos als JPEG, PNG, WEBP oder HEIC '
  + 'sowie – bei Unterlagen – PDF-Dokumente.';

export type Pruefergebnis =
  | { ok: true; typ: Dateityp }
  | { ok: false; status: 400 | 413 | 415; fehler: string };

/** Prüft Inhalt, Größe und ob der Typ zur Art der Unterlage passt. */
export function pruefeDatei(bytes: Uint8Array, kategorie: UploadKategorie): Pruefergebnis {
  if (bytes.byteLength === 0) {
    return { ok: false, status: 400, fehler: 'Die Datei ist leer. Bitte wählen Sie sie erneut aus.' };
  }

  const typ = erkenneDateityp(bytes);
  if (!typ) return { ok: false, status: 415, fehler: MELDUNG_FORMAT };

  if (typ.art === 'pdf' && !KATEGORIEN_MIT_PDF.includes(kategorie)) {
    return {
      ok: false,
      status: 415,
      fehler: 'Hier sind nur Fotos möglich (JPEG, PNG, WEBP oder HEIC), keine PDF-Dokumente.',
    };
  }

  if (bytes.byteLength > maxBytesFuer(typ)) {
    return {
      ok: false,
      status: 413,
      fehler:
        typ.art === 'pdf'
          ? 'Das PDF ist größer als 15 MB. Bitte verkleinern Sie es oder senden Sie nur die nötigen Seiten.'
          : 'Das Foto ist größer als 12 MB. Bitte wählen Sie eine kleinere Aufnahme.',
    };
  }

  return { ok: true, typ };
}

const UMLAUTE: Record<string, string> = { ä: 'ae', ö: 'oe', ü: 'ue', Ä: 'Ae', Ö: 'Oe', Ü: 'Ue', ß: 'ss' };

/**
 * Macht aus dem Dateinamen des Browsers einen unbedenklichen Namen:
 * kein Pfad, keine Steuer- oder Sonderzeichen, höchstens 80 Zeichen und immer
 * die Endung des tatsächlich erkannten Typs.
 */
export function saeubereDateiname(original: string, endung: Dateityp['endung']): string {
  const letzterTeil = original.split(/[\\/]/).pop() ?? '';
  const ohneEndung = letzterTeil.replace(/\.[^.]*$/, '');
  const basis = ohneEndung
    .replace(/[äöüÄÖÜß]/g, (zeichen) => UMLAUTE[zeichen] ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9_-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')
    .toLowerCase()
    .slice(0, 80)
    .replace(/[-_]+$/g, '');
  return `${basis || 'datei'}.${endung}`;
}
