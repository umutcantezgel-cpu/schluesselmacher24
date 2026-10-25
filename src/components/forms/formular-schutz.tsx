'use client';

import { useCallback, useEffect, useId, useRef, type RefObject } from 'react';

import { formularStarten } from '@/lib/actions/formular';
import { HONIGTOPF_FELD, MINDESTDAUER_MS, START_FELD, type FormularSchutz } from '@/lib/formular-schutz';

/* Bot-Schutz im Browser: Startzeitpunkt beim Öffnen holen, Honigtopf-Feld
   verstecken, beides beim Absenden mitschicken. Prüfung auf dem Server
   (src/lib/server/formular-schutz.ts). */

/** Etwas Abstand zur Mindestdauer des Servers. */
const WARTEN_MS = MINDESTDAUER_MS + 500;
/** Danach wird der Startzeitpunkt vor dem Absenden erneuert (Server: höchstens 24 h). */
const ERNEUERN_NACH_MS = 20 * 60 * 60 * 1000;

const warten = (ms: number) => new Promise<void>((fertig) => setTimeout(fertig, ms));

type Start = RefObject<{ wert: string; geholt: number } | null>;

/** Wie alt der Startzeitpunkt ist; unendlich, wenn es keinen gibt. */
const alterVon = (start: Start) => (start.current ? Date.now() - start.current.geholt : Number.POSITIVE_INFINITY);

export interface FormularSchutzHandle {
  /** Kennungen der beiden Felder in `SchutzFelder`. */
  ids: { start: string; honigtopf: string };
  /** Startzeitpunkt vorhanden und weder zu jung noch zu alt? */
  bereit: () => boolean;
  /** Holt bei Bedarf einen neuen Startzeitpunkt und wartet die Mindestdauer ab. */
  vorbereiten: () => Promise<void>;
  /**
   * Schreibt den Startzeitpunkt in das versteckte Feld — direkt vor dem
   * Absenden, denn React setzt Formulare nach einer Aktion zurück.
   */
  felderFuellen: () => void;
  /** Angaben für die Server-Aktion, nach `vorbereiten`. */
  daten: () => Promise<FormularSchutz>;
}

export function useFormularSchutz(): FormularSchutzHandle {
  const start = useRef<{ wert: string; geholt: number } | null>(null);
  const kennung = useId();
  const startId = `${kennung}-start`;
  const honigtopfId = `${kennung}-honig`;

  const holen = useCallback(async () => {
    try {
      const { start: wert } = await formularStarten();
      start.current = { wert, geholt: Date.now() };
    } catch {
      // Ohne Startzeitpunkt versucht es `vorbereiten` beim Absenden erneut.
    }
  }, []);

  const felderFuellen = useCallback(() => {
    const feld = document.getElementById(startId);
    if (feld instanceof HTMLInputElement) feld.value = start.current?.wert ?? '';
  }, [startId]);

  useEffect(() => {
    void holen();
  }, [holen]);

  const bereit = useCallback(() => {
    const ms = alterVon(start);
    return ms >= WARTEN_MS && ms <= ERNEUERN_NACH_MS;
  }, []);

  const vorbereiten = useCallback(async () => {
    // Fehlt der Zeitpunkt oder ist er sehr alt (etwa nach einer Nacht im Ruhezustand), neu holen.
    if (alterVon(start) > ERNEUERN_NACH_MS) await holen();
    const ms = alterVon(start);
    if (Number.isFinite(ms) && ms < WARTEN_MS) await warten(WARTEN_MS - ms);
  }, [holen]);

  const daten = useCallback(async (): Promise<FormularSchutz> => {
    await vorbereiten();
    const honig = document.getElementById(honigtopfId);
    return { start: start.current?.wert ?? '', [HONIGTOPF_FELD]: honig instanceof HTMLInputElement ? honig.value : '' };
  }, [vorbereiten, honigtopfId]);

  return { ids: { start: startId, honigtopf: honigtopfId }, bereit, vorbereiten, felderFuellen, daten };
}

/**
 * Verstecktes Honigtopf-Feld und Startzeitpunkt (für Formulare mit FormData).
 * Für Menschen unsichtbar und nicht per Tabulator erreichbar.
 */
export function SchutzFelder({ schutz }: { schutz: FormularSchutzHandle }) {
  return (
    <>
      <input id={schutz.ids.start} type="hidden" name={START_FELD} defaultValue="" />
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
        <label>
          Bitte dieses Feld leer lassen
          <input id={schutz.ids.honigtopf} type="text" name={HONIGTOPF_FELD} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
    </>
  );
}
