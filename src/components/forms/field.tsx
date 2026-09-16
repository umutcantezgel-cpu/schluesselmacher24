'use client';

import { useId, type ReactNode } from 'react';
import type { InfoHint } from '@/lib/types';
import { cn } from '@/lib/cn';
import { InfoTip } from '@/components/ui/info-tip';

export interface FieldProps {
  label: string;
  /** Kurzer Hinweis unter dem Feld. */
  hint?: string;
  /** Erklärung hinter einem Info-Symbol neben dem Label. */
  info?: InfoHint;
  error?: string;
  required?: boolean;
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
  className?: string;
}

/** Einheitlicher Rahmen für jedes Eingabefeld — Label, Hinweis, Fehler. */
export function Field({ label, hint, info, error, required, children, className }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-foreground">
          {label}
          {required && (
            <span className="ml-1 text-danger" aria-hidden>
              *
            </span>
          )}
          {required && <span className="sr-only"> (Pflichtangabe)</span>}
        </label>
        {info && <InfoTip hint={info} />}
      </div>

      {children({ id, describedBy, invalid: Boolean(error) })}

      {hint && (
        <p id={hintId} className="text-[13px] leading-snug text-foreground-subtle">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-[13px] font-semibold text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
