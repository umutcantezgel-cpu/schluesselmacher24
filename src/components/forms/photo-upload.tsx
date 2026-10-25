'use client';

import { useEffect, useRef, useState } from 'react';
import { GlyphBildHochladen } from '@/components/visual/glyphen/bild-hochladen';
import { GlyphHaken } from '@/components/visual/glyphen/haken';
import { GlyphKamera } from '@/components/visual/glyphen/kamera';
import { GlyphLaden } from '@/components/visual/glyphen/laden';
import { GlyphPapierkorb } from '@/components/visual/glyphen/papierkorb';
import { GlyphWarnung } from '@/components/visual/glyphen/warnung';
import { GlyphZuruecksetzen } from '@/components/visual/glyphen/zuruecksetzen';
import type { ImageSlot, UploadRef } from '@/lib/types';
import { cn } from '@/lib/cn';
import Image from 'next/image';
import { formatFileSize } from '@/lib/format';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';

export interface PickedFile {
  id: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
  /** Vorschau nur im Browser, wird beim Verlassen wieder freigegeben. */
  previewUrl: string;
  /** Stand des Uploads; ohne `category` am Feld wird nicht hochgeladen. */
  status?: 'laedt' | 'fertig' | 'fehler';
  /** Kennung der gespeicherten Kundendatei. */
  storageKey?: string;
  /** Einmal-Schlüssel, mit dem der Server die Datei dem Vorgang zuordnet. */
  uploadToken?: string;
  fehler?: string;
}

type UploadKategorie = UploadRef['category'];
type UploadMeta = Omit<UploadRef, 'id' | 'uploadedAt'>;

/* ---------- Hochladen (auch über Formulare hinweg) ----------------------- */

/**
 * Ergebnisse und laufende Uploads je Datei. Liegen außerhalb der Komponente,
 * damit ein Formular beim Absenden auf laufende Uploads warten und danach
 * die Ergebnisse lesen kann — auch wenn sein eigener Zustand älter ist.
 */
const ergebnisse = new Map<string, { storageKey: string; uploadToken: string }>();
const laufend = new Map<string, Promise<void>>();
/** Originaldateien für „Erneut versuchen“. */
const originale = new Map<string, File>();

let dateiZaehler = 0;
function neueDateiId(): string {
  dateiZaehler += 1;
  return `datei-${dateiZaehler}`;
}

/** Wartet, bis alle gerade laufenden Uploads fertig oder gescheitert sind. */
export async function uploadsAbwarten(): Promise<void> {
  await Promise.allSettled([...laufend.values()]);
}

/**
 * Angaben einer ausgewählten Datei für das Absenden. Hochgeladene Dateien
 * tragen Kennung und Einmal-Schlüssel; andere sind nur als Absicht vermerkt.
 */
export function alsUpload(file: PickedFile, category: UploadKategorie): UploadMeta {
  const ergebnis = ergebnisse.get(file.id)
    ?? (file.storageKey && file.uploadToken ? { storageKey: file.storageKey, uploadToken: file.uploadToken } : undefined);
  return {
    fileName: file.name,
    sizeBytes: file.sizeBytes,
    mimeType: file.mimeType,
    category,
    ...(ergebnis ?? {}),
  };
}

const MAX_KANTE = 2560;
const VERKLEINERN_AB_BYTES = 3 * 1024 * 1024;

/**
 * Größte Datei, die der Server annimmt — wie MAX_BILD_BYTES und MAX_PDF_BYTES
 * in src/lib/server/datei-pruefung.ts. Vercel nimmt je Anfrage höchstens
 * 4,5 MB an.
 */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
/** Fotos dürfen größer ausgewählt werden; der Browser verkleinert sie vorher. */
export const MAX_AUSWAHL_FOTO_BYTES = 12 * 1024 * 1024;
/** Stufenweise geringere JPEG-Qualität, bis das Foto unter die Grenze passt. */
export const QUALITAETSSTUFEN = [0.85, 0.7, 0.6] as const;

export const MELDUNG_UPLOAD_ZU_GROSS =
  'Die Datei ist größer als 4 MB – bitte senden Sie sie uns per E-Mail.';

/** Fotos, die der Browser neu kodieren kann; HEIC/HEIF nur, wo er es dekodiert (Safari). */
const VERKLEINERBAR = /^image\/(jpeg|png|webp|heic|heif)$/;

/** Typ der Datei; manche Browser melden HEIC ohne Typ, dann zählt die Endung. */
export function dateityp(file: { type: string; name: string }): string {
  if (file.type) return file.type;
  return /\.hei[cf]$/i.test(file.name) ? 'image/heic' : '';
}

/** Grenze bei der Auswahl: Fotos bis 12 MB (sie werden verkleinert), PDF und Unbekanntes bis 4 MB. */
export function auswahlGrenze(file: { type: string; name: string }): number {
  return VERKLEINERBAR.test(dateityp(file)) ? MAX_AUSWAHL_FOTO_BYTES : MAX_UPLOAD_BYTES;
}

/**
 * Kodiert mit sinkender Qualität, bis das Ergebnis unter `grenze` liegt.
 * Liefert sonst das kleinste Ergebnis (oder `null`, wenn nichts entstand).
 */
export async function kodiereUnterGrenze(
  kodieren: (qualitaet: number) => Promise<Blob | null>,
  grenze: number,
): Promise<Blob | null> {
  let kleinstes: Blob | null = null;
  for (const qualitaet of QUALITAETSSTUFEN) {
    const blob = await kodieren(qualitaet);
    if (blob && (!kleinstes || blob.size < kleinstes.size)) kleinstes = blob;
    if (blob && blob.size <= grenze) return blob;
  }
  return kleinstes;
}

/**
 * Fotos im Browser verkleinern: spart Datenvolumen am Smartphone, Speicher
 * und hält die Grenze von 4 MB ein. HEIC/HEIF wird versucht (Safari kann es
 * dekodieren); scheitert das, bleibt die Datei unverändert. PDF bleibt immer
 * unverändert.
 */
async function verkleinern(file: File): Promise<{ blob: Blob; name: string }> {
  const original = { blob: file as Blob, name: file.name };
  const typ = dateityp(file);
  if (!VERKLEINERBAR.test(typ) || typeof createImageBitmap !== 'function') return original;
  // HEIC immer als JPEG senden: Das Team kann es dann in jedem Browser ansehen.
  const heic = /^image\/hei[cf]$/.test(typ);
  try {
    const bitmap = await createImageBitmap(file);
    const faktor = Math.min(1, MAX_KANTE / Math.max(bitmap.width, bitmap.height));
    if (!heic && faktor === 1 && file.size <= VERKLEINERN_AB_BYTES) {
      bitmap.close();
      return original;
    }
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * faktor);
    canvas.height = Math.round(bitmap.height * faktor);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return original;
    }
    // Weißer Grund, damit transparente Bereiche nicht schwarz werden.
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await kodiereUnterGrenze(
      (qualitaet) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', qualitaet)),
      MAX_UPLOAD_BYTES,
    );
    // Das Original behalten, wenn die Neukodierung nichts spart und es ohnehin passt.
    const originalBehalten = !heic && file.size <= MAX_UPLOAD_BYTES && (!blob || blob.size >= file.size);
    if (!blob || originalBehalten) return original;
    return { blob, name: file.name.replace(/\.[^.]+$/, '') + '.jpg' };
  } catch {
    return original;
  }
}

/** Fehlermeldung für eine gescheiterte Antwort des Servers. */
export function uploadFehler(status: number, daten: { error?: unknown }): string {
  if (typeof daten.error === 'string') return daten.error;
  // Die Plattform weist zu große Anfragen ab, bevor unser Server sie sieht —
  // dann kommt kein JSON zurück.
  if (status === 413) return MELDUNG_UPLOAD_ZU_GROSS;
  return 'Die Datei konnte nicht hochgeladen werden.';
}

async function hochladen(
  file: File,
  category: UploadKategorie,
): Promise<{ ok: true; storageKey: string; uploadToken: string } | { ok: false; fehler: string }> {
  const { blob, name } = await verkleinern(file);
  // Prüfung nach dem Verkleinern: maßgeblich ist, was tatsächlich gesendet wird.
  if (blob.size > MAX_UPLOAD_BYTES) return { ok: false, fehler: MELDUNG_UPLOAD_ZU_GROSS };
  const body = new FormData();
  body.append('kategorie', category);
  body.append('datei', blob, name);
  try {
    const response = await fetch('/api/kunden-upload', { method: 'POST', body });
    const daten = (await response.json().catch(() => ({}))) as { id?: unknown; uploadToken?: unknown; error?: unknown };
    if (!response.ok || typeof daten.uploadToken !== 'string' || daten.id === undefined) {
      return { ok: false, fehler: uploadFehler(response.status, daten) };
    }
    return { ok: true, storageKey: String(daten.id), uploadToken: daten.uploadToken };
  } catch {
    return { ok: false, fehler: 'Keine Verbindung. Bitte prüfen Sie Ihre Internetverbindung.' };
  }
}

export interface PhotoUploadProps {
  id: string;
  label: string;
  description: string;
  /** Beispielbild, das zeigt, worauf es bei der Aufnahme ankommt. */
  example: ImageSlot;
  files: PickedFile[];
  onChange: (files: PickedFile[]) => void;
  required?: boolean;
  multiple?: boolean;
  maxFiles?: number;
  /** Auch PDF erlauben, z. B. für den Fahrzeugschein. */
  allowDocuments?: boolean;
  /**
   * Art der Unterlage. Mit Angabe wird jede Datei direkt nach der Auswahl
   * sicher hochgeladen (Aufbewahrungsfrist je Art).
   */
  category?: UploadKategorie;
  error?: string;
  /**
   * Gewicht des Knopfs „Foto aufnehmen“: `betont` (Standard) gefüllt; `ruhig` als Rahmenknopf, wenn eine andere Handlung die Hauptaktion ist.
   */
  kamera?: 'betont' | 'ruhig';
}

/**
 * Foto-Upload mit direkter Kameraaufnahme am Smartphone und
 * Auswahl aus der Galerie als Alternative.
 */
export function PhotoUpload({
  id,
  label,
  description,
  example,
  files,
  onChange,
  required = false,
  multiple = false,
  maxFiles = 4,
  allowDocuments = false,
  category,
  error,
  kamera = 'betont',
}: PhotoUploadProps) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [meldung, setMeldung] = useState('');

  // Aktueller Stand der Liste: Uploads melden sich zeitversetzt zurück und
  // dürfen sich dabei nicht gegenseitig überschreiben.
  const stand = useRef(files);
  useEffect(() => {
    stand.current = files;
  }, [files]);

  function setzen(next: PickedFile[]) {
    stand.current = next;
    onChange(next);
  }

  function aktualisieren(fileId: string, patch: Partial<PickedFile>) {
    if (!stand.current.some((f) => f.id === fileId)) return;
    setzen(stand.current.map((f) => (f.id === fileId ? { ...f, ...patch } : f)));
  }

  function starten(fileId: string, file: File, name: string) {
    if (!category) return;
    const auftrag = hochladen(file, category).then((ergebnis) => {
      laufend.delete(fileId);
      if (ergebnis.ok) {
        ergebnisse.set(fileId, { storageKey: ergebnis.storageKey, uploadToken: ergebnis.uploadToken });
        aktualisieren(fileId, {
          status: 'fertig',
          storageKey: ergebnis.storageKey,
          uploadToken: ergebnis.uploadToken,
          fehler: undefined,
        });
        setMeldung(`${name} ist hochgeladen.`);
      } else {
        aktualisieren(fileId, { status: 'fehler', fehler: ergebnis.fehler });
        setMeldung(`${name}: ${ergebnis.fehler}`);
      }
    });
    laufend.set(fileId, auftrag);
  }

  useEffect(() => {
    return () => {
      for (const file of files) URL.revokeObjectURL(file.previewUrl);
    };
    // Aufräumen nur beim Verlassen der Komponente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accept = allowDocuments ? 'image/*,application/pdf' : 'image/*';

  function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    setLocalError(null);

    const aktuell = stand.current;
    const incoming: PickedFile[] = [];
    const neueDateien = new Map<string, File>();
    for (const file of Array.from(list)) {
      // Fotos dürfen größer sein (sie werden verkleinert), PDF nicht.
      const grenze = auswahlGrenze(file);
      if (file.size > grenze) {
        setLocalError(
          grenze === MAX_UPLOAD_BYTES
            ? `„${file.name}“ ist größer als ${formatFileSize(grenze)} – bitte senden Sie die Datei per E-Mail.`
            : `„${file.name}“ ist größer als ${formatFileSize(grenze)}.`,
        );
        continue;
      }
      const fileId = neueDateiId();
      neueDateien.set(fileId, file);
      incoming.push({
        id: fileId,
        name: file.name,
        sizeBytes: file.size,
        mimeType: file.type,
        previewUrl: URL.createObjectURL(file),
        status: category ? 'laedt' : undefined,
      });
    }

    const next = multiple ? [...aktuell, ...incoming].slice(0, maxFiles) : incoming.slice(0, 1);
    for (const old of aktuell) {
      if (!next.includes(old)) URL.revokeObjectURL(old.previewUrl);
    }
    setzen(next);
    for (const eintrag of next) {
      const file = neueDateien.get(eintrag.id);
      if (!file) continue;
      originale.set(eintrag.id, file);
      starten(eintrag.id, file, eintrag.name);
    }
  }

  function remove(fileId: string) {
    const target = stand.current.find((f) => f.id === fileId);
    if (target) URL.revokeObjectURL(target.previewUrl);
    originale.delete(fileId);
    ergebnisse.delete(fileId);
    setzen(stand.current.filter((f) => f.id !== fileId));
  }

  function erneut(fileId: string) {
    const file = originale.get(fileId);
    const eintrag = stand.current.find((f) => f.id === fileId);
    if (!file || !eintrag) return;
    aktualisieren(fileId, { status: 'laedt', fehler: undefined });
    starten(fileId, file, eintrag.name);
  }

  const shownError = error ?? localError;

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-small font-semibold text-foreground">
          {label}
          {required && (
            <span className="ml-1 text-danger" aria-hidden>
              *
            </span>
          )}
        </p>
        <p className="mt-1 text-small leading-relaxed text-foreground-muted">{description}</p>
      </div>

      {/* Spalten nach verfügbarer Breite: in schmalen Formularspalten untereinander (Befund E4-B-09) */}
      <div className="grid grid-cols-kacheln gap-3">
        {/* Beispielbild direkt am Uploadfeld */}
        <div>
          <p className="mb-1.5 font-mono text-caption font-semibold uppercase tracking-label text-foreground-muted">
            So sollte das Foto aussehen
          </p>
          {/* Fachgrafik zum Beispiel statt eines kleinen Symbols in leerer Fläche (Sichtabnahme E4-L-23) */}
          <ImagePlaceholder slot={example} />
        </div>

        <div
          className={cn(
            'flex flex-col justify-center gap-2 rounded-lg border border-dashed p-4',
            shownError ? 'border-danger bg-danger-soft' : 'border-border-strong bg-surface-muted',
          )}
        >
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            className={kamera === 'ruhig' ? 'inline-flex min-h-touch items-center justify-center gap-2 rounded-lg border border-border-strong bg-surface px-4 text-body font-semibold text-foreground hover:bg-surface-muted' : 'inline-flex min-h-touch items-center justify-center gap-2 rounded-lg bg-primary px-4 text-body font-semibold text-primary-foreground hover:bg-primary-hover'}
          >
            <GlyphKamera size={18} aria-hidden />
            Foto aufnehmen
          </button>
          <button
            type="button"
            onClick={() => galleryRef.current?.click()}
            className="inline-flex min-h-touch items-center justify-center gap-2 rounded-lg border border-border-strong bg-surface px-4 text-body font-semibold text-foreground hover:bg-surface-muted"
          >
            <GlyphBildHochladen size={18} aria-hidden />
            {allowDocuments ? 'Datei auswählen' : 'Aus Galerie wählen'}
          </button>
          <p className="text-center font-mono tabular-nums text-caption text-foreground-muted">
            Fotos bis {formatFileSize(MAX_AUSWAHL_FOTO_BYTES)}
            {allowDocuments ? ` · PDF bis ${formatFileSize(MAX_UPLOAD_BYTES)}` : ''}
            {multiple ? ` · bis zu ${maxFiles} Dateien` : ''}
          </p>
        </div>
      </div>

      {/* Kamera direkt öffnen (Smartphone), sonst Dateiauswahl */}
      <input
        ref={cameraRef}
        id={`${id}-camera`}
        type="file"
        aria-label="Foto aufnehmen"
        tabIndex={-1}
        accept="image/*"
        capture="environment"
        multiple={multiple}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        ref={galleryRef}
        id={`${id}-gallery`}
        type="file"
        aria-label={allowDocuments ? 'Datei auswählen' : 'Aus Galerie wählen'}
        tabIndex={-1}
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {files.length > 0 && (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {files.map((file) => (
            <li key={file.id} className="relative overflow-hidden rounded-lg border border-border bg-surface">
              {file.mimeType.startsWith('image/') ? (
                <div className="relative aspect-square w-full">
                  <Image src={file.previewUrl} alt="" fill className="object-cover" unoptimized />
                </div>
              ) : (
                <div className="flex aspect-square w-full items-center justify-center bg-surface-muted font-mono text-caption font-semibold uppercase tracking-label text-foreground-muted">
                  PDF
                </div>
              )}
              <div className="flex items-center justify-between gap-1 p-2">
                <span className="truncate text-caption text-foreground-muted">{file.name}</span>
                <button
                  type="button"
                  onClick={() => remove(file.id)}
                  className="inline-flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded text-foreground-subtle hover:text-danger"
                >
                  <GlyphPapierkorb size={14} aria-hidden />
                  <span className="sr-only">{file.name} entfernen</span>
                </button>
              </div>
              {file.status && (
                <div
                  className={cn(
                    'flex items-center gap-1.5 border-t border-border px-2 py-1.5 text-caption font-semibold',
                    file.status === 'fertig' && 'text-success',
                    file.status === 'laedt' && 'text-foreground-muted',
                    file.status === 'fehler' && 'text-danger',
                  )}
                >
                  {file.status === 'laedt' && (
                    <>
                      <GlyphLaden size={14} className="animate-spin motion-reduce:animate-none" aria-hidden />
                      Wird hochgeladen …
                    </>
                  )}
                  {file.status === 'fertig' && (
                    <>
                      <GlyphHaken size={14} aria-hidden />
                      Gespeichert
                    </>
                  )}
                  {file.status === 'fehler' && (
                    <span className="flex w-full flex-col gap-1">
                      <span className="flex items-start gap-1.5">
                        <GlyphWarnung size={14} aria-hidden className="mt-px shrink-0" />
                        <span>{file.fehler ?? 'Nicht hochgeladen.'}</span>
                      </span>
                      {originale.has(file.id) && (
                        <button
                          type="button"
                          onClick={() => erneut(file.id)}
                          className="inline-flex min-h-touch items-center gap-1 text-primary hover:underline"
                        >
                          <GlyphZuruecksetzen size={14} aria-hidden />
                          Erneut versuchen
                        </button>
                      )}
                    </span>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {shownError && (
        <p className="flex items-start gap-1.5 text-small font-semibold text-danger" role="alert">
          <GlyphWarnung size={16} aria-hidden className="mt-px shrink-0" />
          <span>{shownError}</span>
        </p>
      )}

      <p className="sr-only" aria-live="polite">
        {meldung}
      </p>
    </div>
  );
}
