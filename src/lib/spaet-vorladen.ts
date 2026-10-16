'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/** Wartezeit nach dem Laden, bevor feste Ziele vorgeladen werden: länger als der größte Auftritt (B-01, ≤ 1,6 s). */
export const VORLADEN_NACH_MS = 2500;

/** Ziele, die vorgeladen werden: ohne Dubletten und ohne die aktuelle Seite. */
export function zuVorladen(hrefs: readonly string[], pathname: string): string[] {
  return [...new Set(hrefs)].filter((href) => href !== pathname);
}

/**
 * Lädt die Ziele der festen Navigation (Kopf, Aktionsleiste) erst nach dem großen Moment vor,
 * wenn der Hauptthread frei ist. Das sofortige Vorladen aller sichtbaren Links verarbeitete auf
 * gedrosselten Telefonen mehrere RSC-Antworten gleichzeitig mit der Fräsbahn (B-01) und kostete
 * dort ein Viertel der Bilder (Prüfstufe B E5, D-044). Mit „Daten sparen“ wird nicht vorgeladen.
 */
export function useSpaetVorladen(hrefs: readonly string[], pathname: string) {
  const router = useRouter();
  const schluessel = zuVorladen(hrefs, pathname).join('|');

  useEffect(() => {
    const verbindung = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (verbindung?.saveData || !schluessel) return;
    const ziele = schluessel.split('|');
    let leerlauf: number | undefined;
    const zeit = window.setTimeout(() => {
      const laden = () => ziele.forEach((href) => router.prefetch(href));
      if (typeof window.requestIdleCallback === 'function') {
        leerlauf = window.requestIdleCallback(laden, { timeout: 2000 });
      } else {
        laden();
      }
    }, VORLADEN_NACH_MS);
    return () => {
      window.clearTimeout(zeit);
      if (leerlauf !== undefined) window.cancelIdleCallback(leerlauf);
    };
  }, [router, schluessel]);
}

/** Für Serverseiten: lädt die angegebenen Ziele des ersten Bildschirms spät vor (Links dort mit `prefetch={false}`). */
export function SpaetVorladen({ ziele }: { ziele: readonly string[] }) {
  useSpaetVorladen(ziele, usePathname());
  return null;
}
