import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface SectionProps {
  children: ReactNode;
  className?: string;
  /** Hintergrundvariante. */
  tone?: 'default' | 'muted' | 'ink';
  /** Weniger vertikaler Abstand. */
  tight?: boolean;
  id?: string;
}

export function Section({ children, className, tone = 'default', tight, id }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        tight ? 'section-tight' : 'section',
        tone === 'muted' && 'bg-surface-muted',
        tone === 'ink' && 'bg-surface-ink text-foreground-inverse',
        className,
      )}
    >
      <div className="shell">{children}</div>
    </section>
  );
}

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: 'left' | 'center';
  className?: string;
  /** Auf dunklem Grund. */
  inverse?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  className,
  inverse,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <p className={cn('eyebrow', inverse && 'text-primary-soft')}>
          <span className="h-px w-6 bg-current" aria-hidden />
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          'mt-3 text-2xl font-bold leading-tight md:text-3xl',
          inverse && 'text-foreground-inverse',
        )}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            'mt-3 text-[15px] leading-relaxed text-foreground-muted md:text-base',
            inverse && 'text-foreground-inverse/70',
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
