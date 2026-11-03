'use client';

import { useSyncExternalStore } from 'react';

import { aktuelleBewegung, beobachteBewegung, type Bewegung } from '@/lib/bewegung';

/**
 * Aktuelle Wahl „an“ oder „ruhig“ für Client-Komponenten, folgt dem Schalter und der
 * Systemeinstellung. Auf dem Server und beim Hydrieren gilt „ruhig“ (nichts startet zu früh).
 */
export function useBewegung(): Bewegung {
  return useSyncExternalStore(beobachteBewegung, aktuelleBewegung, () => 'ruhig');
}
