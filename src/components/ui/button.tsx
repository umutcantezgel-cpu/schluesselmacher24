'use client';

import Link from 'next/link';
import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { GlyphLaden } from '@/components/visual/glyphen/laden';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

/*
 * Zustände (KERN K-009): Ruhe, Hover, Fokus (global über `:focus-visible`),
 * gedrückt (B-05: leichtes Einsinken), deaktiviert, lädt.
 */
const base =
  'group inline-flex items-center justify-center gap-2 rounded-md font-semibold select-none text-center ' +
  'transition duration-quick ease-standard active:scale-druck motion-reduce:transform-none ' +
  'disabled:cursor-not-allowed disabled:opacity-55 disabled:active:scale-100 ' +
  'aria-disabled:cursor-not-allowed aria-disabled:opacity-55';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-surface-sunken',
  outline: 'border border-border-strong bg-surface text-foreground hover:border-foreground-subtle hover:bg-surface-muted',
  ghost: 'text-foreground-muted hover:bg-surface-muted hover:text-foreground',
  danger: 'bg-danger text-destructive-foreground hover:brightness-110',
};

// Mindesthöhe 44 px (`min-h-touch`), damit die Bedienung am Smartphone zuverlässig ist.
// `sm` (40 px) nur am Desktop neben anderen Bedienelementen.
const sizes: Record<Size, string> = {
  sm: 'min-h-touch-sm px-3.5 text-small',
  md: 'min-h-touch px-5 text-body',
  lg: 'min-h-touch-lg px-6 text-body',
};

/** Pfeil, der bei feinem Zeiger auf Hover ein Stück nach rechts rückt (B-06). */
function Pfeil() {
  return (
    <GlyphPfeilRechts
      size={18}
      className="transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1"
    />
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  /** Pfeil nach rechts hinter dem Text: „weiter zu …“. */
  pfeil?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, fullWidth, pfeil, className, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...props}
    >
      {loading && <GlyphLaden size={18} className="animate-spin motion-reduce:animate-none" />}
      {children}
      {pfeil && !loading && <Pfeil />}
    </button>
  );
});

export interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  /** Pfeil nach rechts hinter dem Text: „weiter zu …“. */
  pfeil?: boolean;
  children?: ReactNode;
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  fullWidth,
  pfeil,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
  const classes = cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className);

  if (isExternal) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
        {pfeil && <Pfeil />}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
      {pfeil && <Pfeil />}
    </Link>
  );
}
