'use client';

import { type ReactNode } from 'react';
import type { InfoHint } from '@/lib/types';
import { cn } from '@/lib/cn';
import { InfoTip } from '@/components/ui/info-tip';
import { GlyphHaken } from '@/components/visual/glyphen/haken';

export interface OptionCardProps {
  name: string;
  value: string;
  checked: boolean;
  onSelect: (value: string) => void;
  /** Titel; Zahlen darin dürfen als Mono-Span kommen (etwa Uhrzeiten im Terminschritt). */
  title: ReactNode;
  description?: ReactNode;
  info?: InfoHint;
  /** Mehrfachauswahl statt Einfachauswahl. */
  multiple?: boolean;
  disabled?: boolean;
  /** Zusatz rechts, z. B. ein Preis. */
  meta?: ReactNode;
  /** Kleine Zeichnung rechts in der Karte (dekorativ, etwa die Bauform eines Schlüssels). */
  bild?: ReactNode;
  children?: ReactNode;
}

/**
 * Große, antippbare Auswahlfläche.
 * Wird in allen Konfiguratoren und Formularen gleich verwendet, damit die
 * Bedienung überall identisch ist.
 *
 * Der Tastaturfokus liegt auf dem verborgenen Eingabefeld; der Rahmen zeigt
 * ihn über `fokus-innen:` (KERN K-009).
 */
export function OptionCard({
  name,
  value,
  checked,
  onSelect,
  title,
  description,
  info,
  multiple = false,
  disabled = false,
  meta,
  bild,
  children,
}: OptionCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-lg border transition-colors duration-quick',
        'fokus-innen:ring-2 fokus-innen:ring-ring fokus-innen:ring-offset-2 fokus-innen:ring-offset-background',
        checked ? 'border-primary bg-primary-soft' : 'border-border bg-surface hover:border-border-strong',
        disabled && 'opacity-50',
      )}
    >
      <label
        className={cn(
          'flex min-h-touch cursor-pointer items-start gap-3 p-4',
          // Das Info-Symbol steht oben rechts über der Karte; Titel und Preis halten Abstand (Befund E4-B-13)
          info && 'pr-12',
          disabled && 'cursor-not-allowed',
        )}
      >
        <input
          type={multiple ? 'checkbox' : 'radio'}
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={() => onSelect(value)}
          className="sr-only"
        />
        <span
          aria-hidden
          className={cn(
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-colors duration-quick',
            multiple ? 'rounded' : 'rounded-full',
            checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border-strong bg-surface',
          )}
        >
          {checked && <GlyphHaken size={14} />}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-body font-semibold text-foreground">{title}</span>
            {meta && <span className="font-mono text-small font-semibold tabular-nums text-foreground-muted">{meta}</span>}
          </span>
          {description && (
            <span className="mt-1 block text-small leading-relaxed text-foreground-muted">
              {description}
            </span>
          )}
        </span>

        {bild && <span className="w-24 shrink-0 self-center sm:w-28">{bild}</span>}
      </label>

      {info && (
        <span className="absolute right-3 top-3">
          <InfoTip hint={info} />
        </span>
      )}

      {checked && children && <div className="border-t border-primary/20 p-4">{children}</div>}
    </div>
  );
}
