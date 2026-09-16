'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, ImageUp, Trash2 } from 'lucide-react';
import type { ImageSlot } from '@/lib/types';
import { cn } from '@/lib/cn';
import { formatFileSize } from '@/lib/format';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';

export interface PickedFile {
  id: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
  /** Vorschau nur im Browser, wird beim Verlassen wieder freigegeben. */
  previewUrl: string;
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
  error,
}: PhotoUploadProps) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

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

    const incoming: PickedFile[] = [];
    for (const file of Array.from(list)) {
      if (file.size > MAX_BYTES) {
        setLocalError(`„${file.name}“ ist größer als ${formatFileSize(MAX_BYTES)}.`);
        continue;
      }
      incoming.push({
        id: `${file.name}-${file.size}-${incoming.length}-${files.length}`,
        name: file.name,
        sizeBytes: file.size,
        mimeType: file.type,
        previewUrl: URL.createObjectURL(file),
      });
    }

    const next = multiple ? [...files, ...incoming].slice(0, maxFiles) : incoming.slice(0, 1);
    for (const old of files) {
      if (!next.includes(old)) URL.revokeObjectURL(old.previewUrl);
    }
    onChange(next);
  }

  function remove(fileId: string) {
    const target = files.find((f) => f.id === fileId);
    if (target) URL.revokeObjectURL(target.previewUrl);
    onChange(files.filter((f) => f.id !== fileId));
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
                // Vorschau aus dem Browser-Speicher; bewusst kein next/image.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={file.previewUrl} alt="" className="aspect-square w-full object-cover" />
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
                  className="shrink-0 rounded p-1 text-foreground-subtle hover:text-danger"
                >
                  <Trash2 size={14} aria-hidden />
                  <span className="sr-only">{file.name} entfernen</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {shownError && (
        <p className="text-[13px] font-semibold text-danger" role="alert">
          {shownError}
        </p>
      )}
    </div>
  );
}
