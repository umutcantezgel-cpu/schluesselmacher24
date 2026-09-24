'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, Check, ImageUp, Loader2, RotateCcw, Trash2 } from 'lucide-react';
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
 * Fotos im Browser verkleinern: spart Datenvolumen am Smartphone und
 * Speicherplatz. HEIC und PDF bleiben unverändert.
 */
async function verkleinern(file: File): Promise<{ blob: Blob; name: string }> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || typeof createImageBitmap !== 'function') {
    return { blob: file, name: file.name };
  }
  try {
    const bitmap = await createImageBitmap(file);
    const faktor = Math.min(1, MAX_KANTE / Math.max(bitmap.width, bitmap.height));
    if (faktor === 1 && file.size <= VERKLEINERN_AB_BYTES) {
      bitmap.close();
      return { blob: file, name: file.name };
    }
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * faktor);
    canvas.height = Math.round(bitmap.height * faktor);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return { blob: file, name: file.name };
    }
    // Weißer Grund, damit transparente Bereiche nicht schwarz werden.
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
    if (!blob || blob.size >= file.size) return { blob: file, name: file.name };
    return { blob, name: file.name.replace(/\.[^.]+$/, '') + '.jpg' };
  } catch {
    return { blob: file, name: file.name };
  }
}

async function hochladen(
  file: File,
  category: UploadKategorie,
): Promise<{ ok: true; storageKey: string; uploadToken: string } | { ok: false; fehler: string }> {
  const { blob, name } = await verkleinern(file);
  const body = new FormData();
  body.append('kategorie', category);
  body.append('datei', blob, name);
  try {
    const response = await fetch('/api/kunden-upload', { method: 'POST', body });
    const daten = (await response.json().catch(() => ({}))) as { id?: unknown; uploadToken?: unknown; error?: unknown };
    if (!response.ok || typeof daten.uploadToken !== 'string' || daten.id === undefined) {
      return {
        ok: false,
        fehler: typeof daten.error === 'string' ? daten.error : 'Die Datei konnte nicht hochgeladen werden.',
      };
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
}

const MAX_BYTES = 12 * 1024 * 1024;

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
      if (file.size > MAX_BYTES) {
        setLocalError(`„${file.name}“ ist größer als ${formatFileSize(MAX_BYTES)}.`);
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
        <p className="text-sm font-semibold text-foreground">
          {label}
          {required && (
            <span className="ml-1 text-danger" aria-hidden>
              *
            </span>
          )}
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">{description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Beispielbild direkt am Uploadfeld */}
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle">
            So sollte das Foto aussehen
          </p>
          <ImagePlaceholder slot={example} compact />
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
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-primary px-4 text-[15px] font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            <Camera size={17} aria-hidden />
            Foto aufnehmen
          </button>
          <button
            type="button"
            onClick={() => galleryRef.current?.click()}
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg border border-border-strong bg-surface px-4 text-[15px] font-semibold text-foreground hover:bg-surface-muted"
          >
            <ImageUp size={17} aria-hidden />
            {allowDocuments ? 'Datei auswählen' : 'Aus Galerie wählen'}
          </button>
          <p className="text-center text-[11px] text-foreground-subtle">
            Max. {formatFileSize(MAX_BYTES)} je Datei
            {multiple ? ` · bis zu ${maxFiles} Dateien` : ''}
          </p>
        </div>
      </div>

      {/* Kamera direkt öffnen (Smartphone), sonst Dateiauswahl */}
      <input
        ref={cameraRef}
        id={`${id}-camera`}
        type="file"
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
                <div className="flex aspect-square w-full items-center justify-center bg-surface-muted text-xs font-semibold text-foreground-muted">
                  PDF
                </div>
              )}
              <div className="flex items-center justify-between gap-1 p-2">
                <span className="truncate text-[11px] text-foreground-muted">{file.name}</span>
                <button
                  type="button"
                  onClick={() => remove(file.id)}
                  className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded text-foreground-subtle hover:text-danger"
                >
                  <Trash2 size={14} aria-hidden />
                  <span className="sr-only">{file.name} entfernen</span>
                </button>
              </div>
              {file.status && (
                <div
                  className={cn(
                    'flex items-center gap-1.5 border-t border-border px-2 py-1.5 text-[11px] font-semibold',
                    file.status === 'fertig' && 'text-success',
                    file.status === 'laedt' && 'text-foreground-muted',
                    file.status === 'fehler' && 'text-danger',
                  )}
                >
                  {file.status === 'laedt' && (
                    <>
                      <Loader2 size={13} className="animate-spin motion-reduce:animate-none" aria-hidden />
                      Wird hochgeladen …
                    </>
                  )}
                  {file.status === 'fertig' && (
                    <>
                      <Check size={13} aria-hidden />
                      Gespeichert
                    </>
                  )}
                  {file.status === 'fehler' && (
                    <span className="flex w-full flex-col gap-1">
                      <span>{file.fehler ?? 'Nicht hochgeladen.'}</span>
                      {originale.has(file.id) && (
                        <button
                          type="button"
                          onClick={() => erneut(file.id)}
                          className="inline-flex min-h-[44px] items-center gap-1 text-primary hover:underline"
                        >
                          <RotateCcw size={13} aria-hidden />
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
        <p className="text-[13px] font-semibold text-danger" role="alert">
          {shownError}
        </p>
      )}

      <p className="sr-only" aria-live="polite">
        {meldung}
      </p>
    </div>
  );
}
