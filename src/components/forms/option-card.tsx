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
  /** Zusatz (`meta`) als eigene rechte Spalte ohne Umbruch, etwa Preise in einer Optionsliste. */
  metaSpalte?: boolean;
  /** Kleine Zeichnung in der Karte (dekorativ, etwa die Bauform eines Schlüssels). */
  bild?: ReactNode;
  /** Lage der Zeichnung: rechts neben dem Text (Standard) oder über dem Titel, etwa im Zweierraster. */
  bildLage?: 'rechts' | 'oben';
  /** Zeile einer gerahmten Liste (`Auswahlgruppe liste`): ohne eigenen Rahmen und Radius. */
  zeile?: boolean;
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
  metaSpalte = false,
  bild,
  bildLage = 'rechts',
  zeile = false,
  children,
}: OptionCardProps) {
  // Als Listenzeile trägt die Liste Rahmen und Trennlinien; die Zeile zeigt Wahl und Fokus innen.
  const huelle = zeile
    ? [
        'relative transition-colors duration-quick',
        'fokus-innen:ring-2 fokus-innen:ring-inset fokus-innen:ring-ring',
        checked ? 'bg-primary-soft ring-1 ring-inset ring-primary' : 'bg-surface hover:bg-surface-muted',
      ]
    : [
        'relative rounded-lg border transition-colors duration-quick',
        'fokus-innen:ring-2 fokus-innen:ring-ring fokus-innen:ring-offset-2 fokus-innen:ring-offset-background',
        checked ? 'border-primary bg-primary-soft' : 'border-border bg-surface hover:border-border-strong',
      ];
  const bildOben = bild && bildLage === 'oben';

  return (
    <div className={cn(...huelle, disabled && 'opacity-50')}>
      <label
        className={cn(
          'flex min-h-touch cursor-pointer items-start gap-3',
          zeile ? 'px-4 py-3' : 'p-4',
          // Zeichnung oben: eigene Reihe über Auswahlpunkt und Titel
          bildOben && 'flex-wrap',
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
        {bildOben && (
          <span className="order-first block basis-full pl-8">
            <span className="block w-24">{bild}</span>
          </span>
        )}
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
          <span
            className={
              metaSpalte
                ? 'flex items-baseline justify-between gap-x-3 gap-y-1'
                : 'flex flex-wrap items-center gap-x-2 gap-y-1'
            }
          >
            <span className={cn('text-body font-semibold text-foreground', metaSpalte && 'min-w-0')}>{title}</span>
            {meta && (
              <span
                className={cn(
                  'font-mono text-small font-semibold tabular-nums text-foreground-muted',
                  metaSpalte && 'shrink-0 whitespace-nowrap',
                )}
              >
                {meta}
              </span>
            )}
          </span>
          {description && (
            <span className="mt-1 block text-small leading-relaxed text-foreground-muted">
              {description}
            </span>
          )}
        </span>

        {bild && !bildOben && <span className="w-24 shrink-0 self-center sm:w-28">{bild}</span>}
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
