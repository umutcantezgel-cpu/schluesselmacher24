import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'default' | 'muted' | 'ink' | 'outline';

/* Werkstückkanten (KERN K-003, Prinzip 5): Haarlinie, kleiner Radius, Tiefe über Flächenstufen. */
const variants: Record<Variant, string> = {
  default: 'bg-surface border border-border',
  muted: 'bg-surface-muted border border-border',
  ink: 'bg-surface-ink border border-surface-ink text-foreground-inverse',
  outline: 'bg-transparent border border-border',
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  /**
   * Die ganze Karte ist bedienbar (enthält einen Link oder Knopf): Rahmen und
   * Schatten antworten auf Hover (nur feiner Zeiger, B-06) und auf Fokus darin.
   */
  interaktiv?: boolean;
}

export function Card({ variant = 'default', interaktiv, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg',
        variants[variant],
        interaktiv &&
          'group relative transition duration-quick ease-standard focus-within:border-primary zeiger:hover:border-border-strong zeiger:hover:shadow-raised',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('border-b border-border px-5 py-4 md:px-6 md:py-5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-5 py-4 md:px-6 md:py-5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border-t border-border bg-surface-muted px-5 py-4 md:px-6 md:py-5', className)}
      {...props}
    >
      {children}
    </div>
  );
}
