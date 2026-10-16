'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

export interface InViewProps {
  children: ReactNode;
  className?: string;
  /** Umgebendes Element, Standard `div`. */
  as?: ElementType;
  /** Anteil, der sichtbar sein muss, bevor die Animation startet. */
  threshold?: number;
}

/** Meldestufen in 2-%-Schritten, damit auch sehr hohe Bereiche fortlaufend gemeldet werden. */
const STUFEN = Array.from({ length: 51 }, (_, i) => i / 50);

/**
 * Sichtbar genug: Der Anteil des Bereichs erreicht die Schwelle – oder, bei
 * Bereichen, die höher sind als der Bildschirm, der sichtbare Teil füllt
 * mindestens diesen Anteil der Bildschirmhöhe. Ohne die zweite Regel startet ein
 * Bereich mit mehr als vier Bildschirmhöhen nie (Befund E4-BAUMEISTER-10).
 */
export function istSichtbarGenug(
  entry: Pick<IntersectionObserverEntry, 'isIntersecting' | 'intersectionRatio' | 'intersectionRect' | 'rootBounds'>,
  threshold: number,
): boolean {
  if (!entry.isIntersecting) return false;
  if (entry.intersectionRatio >= threshold) return true;
  const hoehe = entry.rootBounds?.height ?? 0;
  return hoehe > 0 && entry.intersectionRect.height >= hoehe * threshold;
}

/**
 * Startet die CSS-Einstiegsanimationen (`.sm24-draw`, `.sm24-reveal`,
 * `.sm24-pop`) erst, wenn der Bereich ins Bild kommt.
 *
 * Auf dem Server steht `data-motion="wait"`; die Pause greift per CSS nur mit
 * JavaScript und ohne „Bewegung reduzieren“. Falls der Beobachter nicht
 * verfügbar ist, spielt die Animation sofort.
 */
export function InView({ children, className, as: Tag = 'div', threshold = 0.25 }: InViewProps) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<'wait' | 'play'>('wait');

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setState('play');
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => istSichtbarGenug(entry, threshold))) {
          setState('play');
          observer.disconnect();
        }
      },
      { threshold: STUFEN },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag ref={ref} data-motion={state} className={cn(className)}>
      {children}
    </Tag>
  );
}
