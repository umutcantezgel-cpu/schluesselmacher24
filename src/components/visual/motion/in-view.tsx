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
        if (entries.some((entry) => entry.isIntersecting)) {
          setState('play');
          observer.disconnect();
        }
      },
      { threshold },
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
