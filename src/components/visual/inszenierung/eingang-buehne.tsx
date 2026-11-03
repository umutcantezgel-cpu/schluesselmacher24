'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

import { PauseKnopf, useDauerschleife } from '@/components/visual/motion/dauerschleife';
import { cn } from '@/lib/cn';

/** Takt der Dauerschleife (Register B-32): alle 6 s ein Wechsel. */
export const SCHLEIFE_TAKT_MS = 6000;

/**
 * Hülle der Eingangsinszenierung: steuert nur die ruhige Dauerschleife (B-32) mit sichtbarem
 * Pause-Knopf. Der Einstieg (B-31) ist reines CSS und wartet nicht auf diese Hülle. Die Schleife
 * läuft nur bei „Bewegung an“, im Bild und im sichtbaren Tab (`useDauerschleife`) und wechselt
 * `data-phase` zwischen „a“ (Schlüssel steckt, Kern quer) und „b“ (Schlüssel zieht zurück, Kern
 * dreht zurück).
 */
export function EingangBuehne({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { laeuft, pausiert, bewegung, umschalten } = useDauerschleife(ref);
  const [phase, setPhase] = useState<'a' | 'b'>('a');

  useEffect(() => {
    if (!laeuft) return;
    const takt = window.setInterval(() => setPhase((p) => (p === 'a' ? 'b' : 'a')), SCHLEIFE_TAKT_MS);
    return () => window.clearInterval(takt);
  }, [laeuft]);

  return (
    <div
      ref={ref}
      data-motion="B-32"
      data-schleife={laeuft ? 'an' : 'aus'}
      data-phase={laeuft ? phase : 'a'}
      className={cn('relative', className)}
    >
      {children}
      <PauseKnopf
        pausiert={pausiert}
        onUmschalten={umschalten}
        bewegung={bewegung}
        was="Animation"
        className="absolute bottom-0 right-0 xl:bottom-auto xl:right-3 xl:top-3"
      />
    </div>
  );
}
