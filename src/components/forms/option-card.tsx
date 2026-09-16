'use client';

import { type ReactNode } from 'react';
import { Check } from 'lucide-react';
import type { InfoHint } from '@/lib/types';
import { cn } from '@/lib/cn';
import { InfoTip } from '@/components/ui/info-tip';

export interface OptionCardProps {
  name: string;
  value: string;
  checked: boolean;
  onSelect: (value: string) => void;
  title: string;
  description?: string;
  info?: InfoHint;
  /** Mehrfachauswahl statt Einfachauswahl. */
  multiple?: boolean;
  disabled?: boolean;
  /** Zusatz rechts, z. B. ein Preis. */
  meta?: ReactNode;
  children?: ReactNode;
}

/**
 * Große, antippbare Auswahlfläche.
 * Wird in allen Konfiguratoren und Formularen gleich verwendet, damit die
 * Bedienung überall identisch ist.
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
  children,
}: OptionCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-lg border transition-colors',
        checked ? 'border-primary bg-primary-soft' : 'border-border bg-surface hover:border-border-strong',
        disabled && 'opacity-50',
      )}
    >
      <label
        className={cn(
          'flex cursor-pointer items-start gap-3 p-4',
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
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-colors',
            multiple ? 'rounded' : 'rounded-full',
            checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border-strong bg-surface',
          )}
        >
          {checked && <Check size={13} strokeWidth={3} />}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[15px] font-semibold text-foreground">{title}</span>
            {meta && <span className="text-sm font-semibold text-foreground-muted">{meta}</span>}
          </span>
          {description && (
            <span className="mt-1 block text-[13px] leading-relaxed text-foreground-muted">
              {description}
            </span>
          )}
        </span>
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
