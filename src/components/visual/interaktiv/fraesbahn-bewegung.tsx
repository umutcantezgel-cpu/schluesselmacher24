'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

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

/** Erste Zeitangabe einer CSS-Liste („1.1s“, „300ms“, „0.3s, 0s“) in Millisekunden; Unsinn ergibt 0. */
export function zeitAusCss(wert: string | null | undefined): number {
  const erste = (wert ?? '').split(',')[0].trim();
  const treffer = /^(-?[\d.]+)(ms|s)$/.exec(erste);
  if (!treffer) return 0;
  const zahl = Number(treffer[1]);
  if (!Number.isFinite(zahl)) return 0;
  return Math.max(0, treffer[2] === 's' ? zahl * 1000 : zahl);
}

/** Erste Kurve einer CSS-Liste; `cubic-bezier(…)` und `steps(…)` enthalten selbst Kommas. */
function ersteKurve(wert: string): string {
  return /^\s*(cubic-bezier\([^)]*\)|steps\([^)]*\)|[a-z-]+)/.exec(wert)?.[1] ?? 'linear';
}

/** Die Teile des berechneten Stils der Profilkante, die den Takt der Zeichnung bestimmen. */
export interface ZeichnungsStil {
  animationDuration: string;
  animationDelay: string;
  animationTimingFunction: string;
}

/**
 * Takt der Fahrt aus der CSS-Zeichnung der Profilkante. Die Kurve stammt aus
 * `animation-timing-function` (bei CSS-Animationen meldet `getComputedTiming()`
 * nur „linear“, weil die Kurve je Schlüsselbild gilt); so laufen Linie und
 * Fräser im selben Takt. `fill: 'both'` hält Start- und Endlage fest.
 */
export function fahrtOptionen(stil: ZeichnungsStil): KeyframeEffectOptions {
  return {
    duration: zeitAusCss(stil.animationDuration),
    delay: zeitAusCss(stil.animationDelay),
    easing: ersteKurve(stil.animationTimingFunction),
    fill: 'both',
  };
}

/**
 * Abheben nach dem letzten Einschnitt: von der Bahn-Endlage (ohne Versatz) in die
 * gehobene Ruhelage aus `data-fraesabheben` („x,y“). Ohne gültigen Versatz keine Bewegung.
 */
export function abhebenSchluesselbilder(wert: string | null | undefined): Keyframe[] {
  const [versatz] = bahnPunkte(wert);
  if (!versatz) return [];
  return [{ transform: 'translate(0px, 0px)' }, { transform: `translate(${versatz[0]}px, ${versatz[1]}px)` }];
}

/**
 * Großer Moment B-01: Der Fräser der Grafik `profilschnitt` fährt die Bahn ab,
 * exakt im Takt der CSS-Zeichnung des Profils, und hebt danach ab.
 *
 * Start bei Sichtbarkeit: Die Hülle trägt `data-motion` („wait“ auf dem Server);
 * die CSS-Regel aus `globals.css` hält bis dahin alle `.sm24-*`-Animationen der
 * Grafik am Anfang. Sobald die Hälfte der Grafik sichtbar ist, spielt alles von
 * vorn. Ohne JavaScript spielt die Zeichnung beim Laden, bei „Bewegung
 * reduzieren“ steht sofort der Endzustand mit gehobenem Fräser.
 */
export function FraesbahnBewegung({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [zustand, setZustand] = useState<'wait' | 'play'>('wait');

  useEffect(() => {
    const huelle = ref.current;
    if (!huelle || typeof IntersectionObserver === 'undefined') {
      setZustand('play');
      return;
    }
    const beobachter = new IntersectionObserver(
      (eintraege) => {
        if (eintraege.some((e) => e.isIntersecting)) {
          setZustand('play');
          beobachter.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    beobachter.observe(huelle);
    return () => beobachter.disconnect();
  }, []);

  useEffect(() => {
    const huelle = ref.current;
    if (zustand !== 'play' || !huelle || bewegungReduziert()) return;
    let aktiv = true;
    const laufend: Animation[] = [];
    const wurzel = getComputedStyle(document.documentElement);

    for (const fraeser of huelle.querySelectorAll<SVGGElement>('[data-fraesbahn]')) {
      const profil = fraeser.ownerSVGElement?.querySelector<SVGPathElement>('[data-fraesprofil]');
      const bilder = bahnSchluesselbilder(bahnPunkte(fraeser.getAttribute('data-fraesbahn')));
      if (!profil || bilder.length === 0) continue;

      const optionen = fahrtOptionen(getComputedStyle(profil));
      if (!optionen.duration) continue;
      const animationen = [fraeser.animate(bilder, optionen)];

      /* Das Rad dreht sich gegenläufig, solange der Fräser fährt. */
      const rad = fraeser.querySelector<SVGGElement>('[data-fraesrad] > path');
      if (rad) {
        animationen.push(
          rad.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-540deg)' }], { ...optionen, easing: 'linear' }),
        );
      }

      /* Danach hebt er ab (äußere Gruppe), kurz und beschleunigend. */
      const heber = fraeser.closest<SVGGElement>('[data-fraesabheben]');
      const abheben = abhebenSchluesselbilder(heber?.getAttribute('data-fraesabheben'));
      if (heber && abheben.length > 0) {
        animationen.push(
          heber.animate(abheben, {
            delay: Number(optionen.delay) + Number(optionen.duration),
            duration: zeitAusCss(wurzel.getPropertyValue('--dauer-quick')) || 180,
            easing: wurzel.getPropertyValue('--kurve-exit').trim() || 'ease-in',
            fill: 'both',
          }),
        );
      }

      /* Gleiche Startzeit wie die CSS-Zeichnung, die mit dem Umschalten startet. */
      const zeichnung = profil.getAnimations()[0];
      zeichnung?.ready.then(() => {
        if (!aktiv || zeichnung.startTime === null) return;
        animationen.forEach((a) => {
          a.startTime = zeichnung.startTime;
        });
      });
      laufend.push(...animationen);
    }

    return () => {
      aktiv = false;
      laufend.forEach((a) => a.cancel());
    };
  }, [zustand]);

  return (
    <div ref={ref} data-motion={zustand} className={cn(className)}>
      {children}
    </div>
  );
}
