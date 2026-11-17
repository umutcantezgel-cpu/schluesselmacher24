import type { ReactNode } from 'react';
import { InView } from '@/components/visual/motion/in-view';
import { Profillinie } from '@/components/visual/profillinie';
import { cn } from '@/lib/cn';

export interface SectionProps {
  children: ReactNode;
  className?: string;
  /**
   * Hintergrundvariante. Getönte Flächen (`muted`, `sunken`) setzen sich mit
   * Haarlinien ab: Tiefe durch Flächenstufen, nicht durch Schatten (KERN K-003.5).
   */
  tone?: 'default' | 'muted' | 'sunken' | 'ink';
  /** Weniger vertikaler Abstand. */
  tight?: boolean;
  id?: string;
  /** Beschriftung des Abschnitts für Screenreader (verweist auf die Überschrift). */
  labelledBy?: string;
}

/**
 * Abschnitt mit fließendem Rhythmus (`py-section`). Der Inhalt liegt in einem
 * `InView`: Einstiegsbewegungen darin (`sm24-*`) starten erst, wenn der Abschnitt
 * ins Bild kommt (KERN K-007).
 */
export function Section({ children, className, tone = 'default', tight, id, labelledBy }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        tight ? 'section-tight' : 'section',
        /* `-mt-px`: Trifft die Haarlinie auf eine Kante davor, liegt sie darauf statt daneben. */
        (tone === 'muted' || tone === 'sunken') && '-mt-px border-y border-border',
        tone === 'muted' && 'bg-surface-muted',
        tone === 'sunken' && 'bg-surface-sunken',
        /* Dunkles Band: die Bühne (A-074), Inhalte folgen den neu belegten Tokens */
        tone === 'ink' && 'buehne',
        className,
      )}
    >
      <InView className="shell">{children}</InView>
    </section>
  );
}

export interface SectionHeadingProps {
  eyebrow?: string;
  /** Laufende Nummer vor der Augenbrauen-Zeile, etwa „01“ (Bemaßung, KERN K-006). */
  nummer?: string;
  title: string;
  lead?: string;
  align?: 'left' | 'center';
  className?: string;
  /**
   * Veraltet: Auf dunklem Grund (Bühne, `Section tone="ink"`) folgen Augenbraue, Titel und
   * Einleitung den neu belegten Tokens von selbst; die Angabe ändert nichts mehr.
   */
  inverse?: boolean;
  /** Profillinie unter der Augenbrauen-Zeile (Leitelement, sparsam einsetzen). */
  profillinie?: boolean;
  /** Kennung der Überschrift, etwa für `aria-labelledby` des Abschnitts. */
  id?: string;
}

export function SectionHeading({
  eyebrow,
  nummer,
  title,
  lead,
  align = 'left',
  className,
  profillinie,
  id,
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p className="eyebrow">
          {nummer && <span className="text-foreground-muted tabular-nums">{nummer}</span>}
          {eyebrow}
        </p>
      )}
      {profillinie && (
        <Profillinie
          text={title}
          className={cn('mt-3 text-area', align === 'center' && 'mx-auto')}
        />
      )}
      <h2
        id={id}
        className="mt-3 text-headline font-bold text-foreground"
      >
        {title}
      </h2>
      {lead && (
        <p
          className={cn('mt-4 max-w-measure text-lead text-foreground-muted', align === 'center' && 'mx-auto')}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
