'use client';

import { useId, useLayoutEffect, useRef, useState } from 'react';
import type { InfoHint } from '@/lib/types';
import { cn } from '@/lib/cn';
import { KompaktBild } from './bild-flaeche';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphKreuz } from '@/components/visual/glyphen/kreuz';

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
  const panel = useRef<HTMLSpanElement>(null);

  // Am Bildschirmrand rückt die Erklärung nach innen, statt über den Rand zu laufen
  // (16 px Abstand; Befund Runde 2, H03 mobil). Nur Lage, kein Zustand.
  useLayoutEffect(() => {
    const el = panel.current;
    if (!open || !el) return;
    el.style.translate = '';
    const r = el.getBoundingClientRect();
    const rand = 16;
    const ueber = r.right - (document.documentElement.clientWidth - rand);
    if (ueber > 0) el.style.translate = `${-Math.min(ueber, Math.max(0, r.left - rand))}px 0`;
  }, [open]);

  return (
    <span className={cn('relative inline-flex', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          'inline-flex min-h-6 min-w-6 items-center justify-center rounded-full border border-border',
          'bg-surface text-foreground-muted transition-colors duration-quick hover:bg-surface-muted hover:text-primary',
        )}
      >
        <GlyphInfo size={15} />
        <span className="sr-only">{label ?? `Erklärung zu ${hint.title}`}</span>
      </button>

      {open && (
        <span
          ref={panel}
          id={panelId}
          role="note"
          className={cn(
            'absolute left-0 top-9 z-header block w-tipp',
            'rounded-lg border border-border bg-surface p-4 shadow-overlay',
          )}
        >
          <span className="mb-2 flex items-start justify-between gap-3">
            <strong className="text-small font-bold text-foreground">{hint.title}</strong>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="-mr-1 -mt-1 inline-flex min-h-6 min-w-6 items-center justify-center rounded text-foreground-subtle transition-colors duration-quick hover:text-foreground"
            >
              <GlyphKreuz size={15} />
              <span className="sr-only">Erklärung schließen</span>
            </button>
          </span>

          <span className="block text-small leading-relaxed text-foreground-muted">
            {hint.body}
          </span>

          {hint.figure && (
            <span className="mt-3 block">
              <KompaktBild slot={hint.figure} />
            </span>
          )}
        </span>
      )}
    </span>
  );
}
