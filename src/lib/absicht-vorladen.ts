'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

/** Schon vorgeladene Ziele: gilt für die ganze Sitzung, jedes Ziel wird höchstens einmal angefragt. */
const GELADEN = new Set<string>();

/** „Daten sparen“ des Browsers: dann wird gar nicht vorgeladen. */
function datenSparen(): boolean {
  const verbindung = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(verbindung?.saveData);
}

/**
 * Baut die Vorlade-Funktion: lädt ein Ziel beim ersten Aufruf vor, danach nicht mehr;
 * mit `sparen()` gar nicht. Rein, damit sie ohne Router testbar ist.
 */
export function vorladerFuer(
  vorladen: (href: string) => void,
  sparen: () => boolean,
  geladen: Set<string> = GELADEN,
): (href: string) => void {
  return (href) => {
    if (geladen.has(href) || sparen()) return;
    geladen.add(href);
    vorladen(href);
  };
}

/**
 * Vorladen erst bei erkennbarer Absicht – Zeiger darüber, Fokus, Berührung – für lange Listen
 * mit `prefetch={false}`. Sonst lädt jede sichtbare Zeile sofort vor, und die Antworten belasten
 * das Laden und den großen Moment der Seite (D-044, E7-L-36).
 */
export function useAbsichtVorladen(): (href: string) => void {
  const router = useRouter();
  return useMemo(() => vorladerFuer((href) => router.prefetch(href), datenSparen), [router]);
}
