'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { bewegungReduziert } from '@/lib/bewegung';

/** Punkte aus `data-fraesbahn` („x,y x,y …“) lesen; Unsinn ergibt eine leere Liste. */
export function bahnPunkte(wert: string | null | undefined): [number, number][] {
  if (!wert) return [];
  const punkte: [number, number][] = [];
  for (const paar of wert.trim().split(/\s+/)) {
    const [x, y] = paar.split(',').map(Number);
    if (Number.isFinite(x) && Number.isFinite(y)) punkte.push([x, y]);
  }
  return punkte;
}

/**
 * Schlüsselbilder für den Fräser: Verschiebung relativ zur Ruhelage am Ende der
 * Bahn, mit Versatz nach zurückgelegter Strecke – so läuft er im gleichen Takt
 * wie die Linie, die sich über `pathLength` zeichnet.
 */
export function bahnSchluesselbilder(punkte: [number, number][]): Keyframe[] {
  if (punkte.length < 2) return [];
  const [endeX, endeY] = punkte[punkte.length - 1];
  const strecken = punkte.map((p, i) => (i === 0 ? 0 : Math.hypot(p[0] - punkte[i - 1][0], p[1] - punkte[i - 1][1])));
  const gesamt = strecken.reduce((a, b) => a + b, 0) || 1;
  let bisher = 0;
  return punkte.map(([x, y], i) => {
    bisher += strecken[i];
    return {
      transform: `translate(${Math.round((x - endeX) * 100) / 100}px, ${Math.round((y - endeY) * 100) / 100}px)`,
      offset: Math.min(1, bisher / gesamt),
    };
  });
}

/**
 * Großer Moment B-01: führt den Fräser der Grafik `profilschnitt` die Bahn
 * entlang, exakt im Takt der CSS-Zeichnung des Profils (gleiche Startzeit, Dauer
 * und Kurve). Läuft nur mit Bewegung; bei „Bewegung reduzieren“ oder ohne
 * JavaScript ruht der Fräser am Ende, die Grafik ist vollständig.
 */
export function FraesbahnBewegung({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const huelle = ref.current;
    if (!huelle || bewegungReduziert()) return;
    const laufend: Animation[] = [];
    for (const fraeser of huelle.querySelectorAll<SVGGElement>('[data-fraesbahn]')) {
      const profil = fraeser.ownerSVGElement?.querySelector<SVGPathElement>('[data-fraesprofil]');
      const zeichnung = profil?.getAnimations()[0];
      const timing = zeichnung?.effect?.getComputedTiming();
      const bilder = bahnSchluesselbilder(bahnPunkte(fraeser.getAttribute('data-fraesbahn')));
      if (!zeichnung || !timing || bilder.length === 0) continue;
      const optionen: KeyframeAnimationOptions = {
        duration: Number(timing.duration) || 0,
        delay: timing.delay ?? 0,
        easing: timing.easing ?? 'linear',
        fill: 'backwards',
      };
      const fahrt = fraeser.animate(bilder, optionen);
      /* Das Rad dreht sich gegenläufig, solange der Fräser fährt. */
      const rad = fraeser.querySelector<SVGGElement>('[data-fraesrad] > path');
      const drehung = rad?.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-540deg)' }], {
        ...optionen,
        easing: 'linear',
      });
      /* Gleiche Startzeit wie die CSS-Zeichnung: auch nach spätem Hydrieren synchron. */
      if (zeichnung.startTime !== null) {
        fahrt.startTime = zeichnung.startTime;
        if (drehung) drehung.startTime = zeichnung.startTime;
      }
      laufend.push(fahrt);
      if (drehung) laufend.push(drehung);
    }
    return () => laufend.forEach((a) => a.cancel());
  }, []);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
