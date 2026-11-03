'use client';

import { useEffect, useState, type RefObject } from 'react';

import { GlyphAbspielen } from '@/components/visual/glyphen/abspielen';
import { GlyphPause } from '@/components/visual/glyphen/pause';
import type { Bewegung } from '@/lib/bewegung';
import { cn } from '@/lib/cn';

import { useBewegung } from './use-bewegung';

export interface SchleifenZustand {
  bewegung: Bewegung;
  /** Mit dem Pause-Knopf angehalten. */
  pausiert: boolean;
  /** Im Bild (IntersectionObserver). */
  sichtbar: boolean;
  /** Tab im Vordergrund (`visibilitychange`). */
  tabSichtbar: boolean;
}

/** Eine Dauerschleife läuft nur mit Bewegung, ohne Pause, im Bild und im sichtbaren Tab (Auftrag 12, G-06). */
export function schleifeLaeuft(z: SchleifenZustand): boolean {
  return z.bewegung === 'an' && !z.pausiert && z.sichtbar && z.tabSichtbar;
}

/**
 * Steuerung einer Dauerschleife (Register B-32, B-33): hält außerhalb des Bildes, im verborgenen
 * Tab, bei „ruhig“ und nach dem Pause-Knopf. `laeuft` setzt die Hülle etwa als
 * `data-schleife="an"`, das CSS der Schleife hängt daran.
 */
export function useDauerschleife(ref: RefObject<Element | null>) {
  const bewegung = useBewegung();
  const [pausiert, setPausiert] = useState(false);
  const [sichtbar, setSichtbar] = useState(false);
  const [tabSichtbar, setTabSichtbar] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setSichtbar(true);
      return;
    }
    const beobachter = new IntersectionObserver((eintraege) => {
      setSichtbar(eintraege.some((e) => e.isIntersecting));
    });
    beobachter.observe(element);
    return () => beobachter.disconnect();
  }, [ref]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const melden = () => setTabSichtbar(document.visibilityState !== 'hidden');
    melden();
    document.addEventListener('visibilitychange', melden);
    return () => document.removeEventListener('visibilitychange', melden);
  }, []);

  const laeuft = schleifeLaeuft({ bewegung, pausiert, sichtbar, tabSichtbar });
  return { laeuft, pausiert, bewegung, umschalten: () => setPausiert((p) => !p) };
}

/**
 * Sichtbarer Pause-Knopf jeder Dauerschleife über fünf Sekunden (WCAG 2.2.2, B-36). Bei „ruhig“
 * steht die Schleife ohnehin; dann zeigt der Knopf nichts an und ist nicht bedienbar.
 */
export function PauseKnopf({
  pausiert,
  onUmschalten,
  bewegung,
  className,
  was = 'Bewegung',
}: {
  pausiert: boolean;
  onUmschalten: () => void;
  bewegung: Bewegung;
  className?: string;
  /** Wofür der Knopf steht, etwa „Animation des Schließplans“. */
  was?: string;
}) {
  if (bewegung === 'ruhig') return null;
  const beschriftung = pausiert ? `${was} fortsetzen` : `${was} anhalten`;
  return (
    <button
      type="button"
      onClick={onUmschalten}
      aria-label={beschriftung}
      title={beschriftung}
      className={cn(
        'inline-flex min-h-touch min-w-touch items-center justify-center rounded-md border border-border bg-surface text-foreground-muted transition-colors duration-quick hover:border-border-strong hover:text-foreground',
        className,
      )}
    >
      {pausiert ? <GlyphAbspielen size={20} aria-hidden /> : <GlyphPause size={20} aria-hidden />}
    </button>
  );
}
