'use client';

import { useCallback, useSyncExternalStore } from 'react';

/** Wird nie ausgelöst — der Wert wechselt nur einmal beim Hydrieren. */
function neverChanges() {
  return () => {};
}

/**
 * Ist die Ausgabe bereits im Browser angekommen?
 *
 * Auf dem Server `false`, im Browser nach dem Hydrieren `true`. Wird für
 * Inhalte gebraucht, die es nur im Browser gibt — etwa den Warenkorb —,
 * damit Server- und Browserausgabe beim ersten Rendern übereinstimmen.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  );
}

/**
 * Liest einen Wert aus dem Browserspeicher und hält ihn aktuell — auch
 * wenn ihn ein anderer Tab ändert. Auf dem Server immer `null`.
 */
export function useStoredValue(key: string): string | null {
  const subscribe = useCallback(
    (onChange: () => void) => {
      function handle(event: StorageEvent) {
        if (event.key === key || event.key === null) onChange();
      }
      window.addEventListener('storage', handle);
      return () => window.removeEventListener('storage', handle);
    },
    [key],
  );

  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      // Speicher nicht verfügbar (privates Fenster, blockierte Website-Daten).
      return null;
    }
  }, [key]);

  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

/** Schreibt einen Wert in den Browserspeicher. Gibt zurück, ob es geklappt hat. */
export function writeStoredValue(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/** Entfernt einen Wert aus dem Browserspeicher. */
export function removeStoredValue(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* Ohne Folgen. */
  }
}
