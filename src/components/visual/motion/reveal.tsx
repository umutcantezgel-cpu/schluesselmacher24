import type { CSSProperties, ElementType, ReactNode } from 'react';

import { cn } from '@/lib/cn';

import { motionStyle } from './motion-style';

export interface RevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Umgebendes Element, Standard `div`; in SVG `g`. */
  as?: ElementType;
  /** Verzögerung in Sekunden. */
  delay?: number;
  /** Dauer in Sekunden; ohne Angabe gilt der Wert aus `globals.css`. */
  duration?: number;
}

/**
 * Blendet den Inhalt von unten ein (`.sm24-reveal`). Server-Komponente: die
 * Bewegung ist reines CSS und wartet, solange ein Vorfahr `InView` den
 * Bereich noch nicht sichtbar meldet. Ohne JavaScript und bei „Bewegung
 * reduzieren“ ist der Inhalt sofort da.
 */
export function Reveal({
  children,
  className,
  style,
  as: Tag = 'div',
  delay = 0,
  duration,
}: RevealProps) {
  return (
    <Tag className={cn('sm24-reveal', className)} style={motionStyle(delay, duration, style)}>
      {children}
    </Tag>
  );
}
