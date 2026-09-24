import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type SVGProps,
} from 'react';

import { cn } from '@/lib/cn';

import { DRAW_DASHARRAY, motionStyle } from './motion-style';

/** SVG-Grundformen, deren Kontur sich über `pathLength` nachzeichnen lässt. */
const LINIENFORMEN = new Set(['path', 'line', 'polyline', 'polygon', 'circle', 'ellipse', 'rect']);

export interface DrawOnProps extends Omit<SVGProps<SVGGElement>, 'children'> {
  children: ReactNode;
  /** Verzögerung des ersten Kindes in Sekunden. */
  delay?: number;
  /** Zeitabstand zwischen zwei Kindern in Sekunden. */
  stagger?: number;
  /** Dauer je Kind in Sekunden; ohne Angabe gilt der Wert aus `globals.css`. */
  duration?: number;
}

interface KindProps {
  className?: string;
  style?: CSSProperties;
  pathLength?: number | string;
}

/** Direkte Kinder in Reihenfolge — Fragmente werden aufgelöst, Text entfällt (in SVG ohne `<text>` unsichtbar). */
function elemente(children: ReactNode): ReactElement<KindProps>[] {
  return Children.toArray(children).flatMap((kind) => {
    if (!isValidElement<KindProps & { children?: ReactNode }>(kind)) return [];
    return kind.type === Fragment ? elemente(kind.props.children) : [kind];
  });
}

/**
 * SVG-Gruppe, deren Kinder nacheinander erscheinen: Linienformen (`path`,
 * `line`, `circle` …) zeichnen sich (`.sm24-draw`, `pathLength` 1 wird
 * ergänzt), alles andere (`g`, `text`, Komponenten) blendet ein
 * (`.sm24-reveal`). Server-Komponente; eigene `className`/`style` der Kinder
 * bleiben erhalten.
 *
 * ```tsx
 * <DrawOn delay={0.2} stagger={0.15}>
 *   <path d="…" />
 *   <path d="…" />
 * </DrawOn>
 * ```
 */
export function DrawOn({ children, delay = 0, stagger = 0.12, duration, ...rest }: DrawOnProps) {
  const abstand = Number.isFinite(stagger) ? Math.max(0, stagger) : 0;
  return (
    <g {...rest}>
      {elemente(children).map((kind, i) => {
        const linie = typeof kind.type === 'string' && LINIENFORMEN.has(kind.type);
        const start = delay + i * abstand;
        if (!linie) {
          return cloneElement(kind, {
            key: i,
            className: cn('sm24-reveal', kind.props.className),
            style: motionStyle(start, duration, kind.props.style),
          });
        }
        return cloneElement(kind, {
          key: i,
          className: cn('sm24-draw', kind.props.className),
          /* `.sm24-draw` rechnet mit der Pfadlänge 1 — ein anderer Wert zerstückelt die Linie. */
          pathLength: 1,
          style: motionStyle(start, duration, { strokeDasharray: DRAW_DASHARRAY, ...kind.props.style }),
        });
      })}
    </g>
  );
}
