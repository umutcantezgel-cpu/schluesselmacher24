'use client';

import { useCallback, useSyncExternalStore } from 'react';

import { removeStoredValue, writeStoredValue } from '@/lib/client-state';

/* ==========================================================================
   Einwilligung im Browser (Seite „Cookie-Einstellungen“ und Hinweis)
   Gespeichert im lokalen Speicher. Änderungen melden sich im selben Tab
   über ein eigenes Ereignis, aus anderen Tabs über `storage`.
   ========================================================================== */

export const EINWILLIGUNG_SCHLUESSEL = 'sm24-cookie-einwilligung';
const GEAENDERT = 'sm24:einwilligung';

export interface Einwilligung {
  notwendig: true;
  statistik: boolean;
  komfort: boolean;
  updatedAt: string;
}

/** Gespeicherte Auswahl aus dem Rohwert; `null`, solange nichts entschieden ist. */
export function einwilligungLesen(raw: string | null): Einwilligung | null {
  if (!raw) return null;
  try {
    const wert = JSON.parse(raw) as Partial<Einwilligung>;
    return {
      notwendig: true,
      statistik: wert.statistik === true,
      komfort: wert.komfort === true,
      updatedAt: typeof wert.updatedAt === 'string' ? wert.updatedAt : '',
    };
  } catch {
    return null;
  }
}

function melden() {
  window.dispatchEvent(new Event(GEAENDERT));
}

/** Speichert die Auswahl und meldet sie im selben Tab. Gibt zurück, ob es geklappt hat. */
export function einwilligungSpeichern(auswahl: Omit<Einwilligung, 'notwendig' | 'updatedAt'>): Einwilligung | null {
  const wert: Einwilligung = { notwendig: true, ...auswahl, updatedAt: new Date().toISOString() };
  if (!writeStoredValue(EINWILLIGUNG_SCHLUESSEL, JSON.stringify(wert))) return null;
  melden();
  return wert;
}

/** Entfernt die Auswahl (etwa beim Löschen aller gespeicherten Daten) — gilt als Widerruf. */
export function einwilligungEntfernen(): void {
  removeStoredValue(EINWILLIGUNG_SCHLUESSEL);
  melden();
}

/** Rohwert der Einwilligung, aktuell auch nach Änderungen im selben Tab. Auf dem Server `null`. */
export function useEinwilligungRoh(): string | null {
  const subscribe = useCallback((onChange: () => void) => {
    function beiSpeicher(event: StorageEvent) {
      if (event.key === EINWILLIGUNG_SCHLUESSEL || event.key === null) onChange();
    }
    window.addEventListener('storage', beiSpeicher);
    window.addEventListener(GEAENDERT, onChange);
    return () => {
      window.removeEventListener('storage', beiSpeicher);
      window.removeEventListener(GEAENDERT, onChange);
    };
  }, []);
  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(EINWILLIGUNG_SCHLUESSEL);
    } catch {
      return null;
    }
  }, []);
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
