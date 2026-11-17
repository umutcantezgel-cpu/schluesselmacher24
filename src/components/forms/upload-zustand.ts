/*
 * Zustand und Hilfen des Foto-Uploads ohne die Oberfläche (FA-SEO-03C).
 *
 * Formulare, die den Upload erst in einem späteren Schritt zeigen (Autoschlüssel-Assistent, Schritt 8
 * und 9), brauchen beim ersten Laden nur `alsUpload`, `uploadsAbwarten` und die Hilfen zum Beispiel am
 * Feld. Stünden sie in `photo-upload.tsx`, hinge über `ImagePlaceholder` die Grafik-Registry mit allen
 * Zeichnungs-Generatoren am ersten Laden. `photo-upload.tsx` liest den Zustand von hier und gibt alles
 * unverändert weiter; die übrigen Formulare importieren wie bisher aus `photo-upload`.
 *
 * Keine Oberfläche, kein Client-Baustein: nur Typen, Werte und reine Funktionen.
 */

import type { ImageSlot, UploadRef, UploadSteckplatz } from '@/lib/types';
import { visualFuerMotiv, visualFuerSteckplatz } from '@/lib/visual/motiv';

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

export type UploadKategorie = UploadRef['category'];
type UploadMeta = Omit<UploadRef, 'id' | 'uploadedAt'>;

/* ---------- Hochladen (auch über Formulare hinweg) ----------------------- */

/**
 * Ergebnisse und laufende Uploads je Datei. Liegen außerhalb der Komponente,
 * damit ein Formular beim Absenden auf laufende Uploads warten und danach
 * die Ergebnisse lesen kann — auch wenn sein eigener Zustand älter ist.
 */
export const ergebnisse = new Map<string, { storageKey: string; uploadToken: string }>();
export const laufend = new Map<string, Promise<void>>();
/** Originaldateien für „Erneut versuchen“. */
export const originale = new Map<string, File>();

let dateiZaehler = 0;
export function neueDateiId(): string {
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
export function alsUpload(file: PickedFile, category: UploadKategorie, steckplatz?: UploadSteckplatz): UploadMeta {
  const ergebnis = ergebnisse.get(file.id)
    ?? (file.storageKey && file.uploadToken ? { storageKey: file.storageKey, uploadToken: file.uploadToken } : undefined);
  return {
    fileName: file.name,
    sizeBytes: file.sizeBytes,
    mimeType: file.mimeType,
    category,
    // Steckplatz (FA-KERN-02): Der Server übernimmt ihn nur aus der gespeicherten Kundendatei.
    ...(steckplatz ? { steckplatz } : {}),
    ...(ergebnis ?? {}),
  };
}

/**
 * Größte Datei, die der Server annimmt — wie MAX_BILD_BYTES und MAX_PDF_BYTES
 * in src/lib/server/datei-pruefung.ts. Vercel nimmt je Anfrage höchstens
 * 4,5 MB an.
 */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
/** Fotos dürfen größer ausgewählt werden; der Browser verkleinert sie vorher. */
export const MAX_AUSWAHL_FOTO_BYTES = 12 * 1024 * 1024;

/**
 * Zeigt das Beispiel ein echtes Bild oder eine Zeichnung? Sonst steht dort nur ein Fach-Symbol, und die
 * Zeile darüber sagt, was auf dem Foto zu sehen sein muss, statt „So sollte das Foto aussehen“ (FA-QA-02).
 */
export function beispielZeigtBild(slot: ImageSlot): boolean {
  return Boolean(slot.bild?.url || slot.visual || visualFuerMotiv(slot.motif));
}

/**
 * Beispiel am Feld (FA-26-06): Ein echtes Foto bleibt; sonst zeigt der Steckplatz seine Beispielzeichnung
 * (Fahrzeugschein, Typenschild, Ersatznachweis, Profil von vorne), vor einer allgemeinen Zeichnung am Beispiel.
 */
export function beispielFuerFeld(example: ImageSlot, steckplatz?: UploadSteckplatz): ImageSlot {
  if (example.bild?.url) return example;
  const zeichnung = visualFuerSteckplatz(steckplatz);
  return zeichnung ? { ...example, visual: zeichnung } : example;
}

/**
 * Bleibt der Satz der Seite unter dem Beispiel stehen? Ohne Bild immer. Bei einer Beispielzeichnung
 * `foto-beispiel` ebenfalls: Die Zeichnung zeigt nur Form und markierte Stellen, der Wortlaut der Seite
 * (etwa „Halter und Fahrzeugdaten lesbar“, „scharf und ohne Spiegelung“, „oder Zertifikat“) bleibt lesbar.
 */
export function beispielSatzSichtbar(slot: ImageSlot): boolean {
  if (!beispielZeigtBild(slot)) return true;
  if (slot.bild?.url) return false;
  return (slot.visual ?? visualFuerMotiv(slot.motif))?.generator === 'foto-beispiel';
}

/** Satz zum Beispiel ohne Bild: das Motiv ohne Vorsilbe „Beispielfoto:“, sonst der Hinweis. */
export function beispielSatz(slot: ImageSlot): string {
  const motiv = slot.motif.replace(/^\s*Beispiel(?:foto|bild)?\s*:\s*/i, '').trim();
  const satz = motiv || slot.note || '';
  if (!satz) return '';
  const gross = satz.charAt(0).toUpperCase() + satz.slice(1);
  return /[.!?]$/.test(gross) ? gross : `${gross}.`;
}
