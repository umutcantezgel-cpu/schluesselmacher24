'use client';

import { useId, useState } from 'react';
import { Info, X } from 'lucide-react';
import type { InfoHint } from '@/lib/types';
import { cn } from '@/lib/cn';
import { ImagePlaceholder } from './image-placeholder';

export interface InfoTipProps {
  hint: InfoHint;
  className?: string;
  /** Beschriftung für Bildschirmleser, falls abweichend. */
  label?: string;
}

/**
 * Info-Symbol mit kurzer Erklärung.
 *
 * Bewusst als Aufklappen statt als Mouseover umgesetzt, damit die
 * Erklärung auch am Smartphone durch Antippen erreichbar ist.
 */
export function InfoTip({ hint, className, label }: InfoTipProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <span className={cn('relative inline-flex', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          'inline-flex h-7 w-7 items-center justify-center rounded-full border border-border',
          'bg-surface text-foreground-muted transition-colors hover:bg-surface-muted hover:text-primary',
        )}
      >
        <Info size={15} aria-hidden />
        <span className="sr-only">{label ?? `Erklärung zu ${hint.title}`}</span>
      </button>

      {open && (
        <span
          id={panelId}
          role="note"
          className={cn(
            'absolute left-0 top-9 z-40 block w-[min(20rem,calc(100vw-3rem))]',
            'rounded-lg border border-border bg-surface p-4 shadow-lg',
          )}
        >
          <span className="mb-2 flex items-start justify-between gap-3">
            <strong className="text-sm font-bold text-foreground">{hint.title}</strong>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="-mr-1 -mt-1 rounded p-1 text-foreground-subtle hover:text-foreground"
            >
              <X size={15} aria-hidden />
              <span className="sr-only">Erklärung schließen</span>
            </button>
          </span>

          <span className="block text-[13px] leading-relaxed text-foreground-muted">
            {hint.body}
          </span>

          {hint.figure && (
            <span className="mt-3 block">
              <ImagePlaceholder slot={hint.figure} compact />
            </span>
          )}
        </span>
      )}
    </span>
  );
}
