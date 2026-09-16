import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'default' | 'muted' | 'ink' | 'outline';

const variants: Record<Variant, string> = {
  default: 'bg-surface border border-border',
  muted: 'bg-surface-muted border border-border',
  ink: 'bg-surface-ink border border-surface-ink text-foreground-inverse',
  outline: 'bg-transparent border border-border',
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  return (
    <div className={cn('rounded-lg', variants[variant], className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-5 py-4 md:px-6 md:py-5 border-b border-border', className)} {...props}>
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
      className={cn('px-5 py-4 md:px-6 md:py-5 border-t border-border bg-surface-muted', className)}
      {...props}
    >
      {children}
    </div>
  );
}
