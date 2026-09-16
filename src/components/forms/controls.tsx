'use client';

import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const control =
  'w-full rounded-lg border bg-surface px-3.5 py-3 text-[15px] text-foreground ' +
  'placeholder:text-foreground-subtle transition-colors ' +
  'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60';

const ok = 'border-input hover:border-border-strong';
const bad = 'border-danger';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { invalid, className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(control, invalid ? bad : ok, 'min-h-[46px]', className)}
      {...props}
    />
  );
});

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { invalid, className, rows = 4, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(control, invalid ? bad : ok, 'resize-y', className)}
      {...props}
    />
  );
});

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid, className, children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(control, invalid ? bad : ok, 'min-h-[46px] appearance-none bg-no-repeat pr-10', className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        backgroundPosition: 'right 0.75rem center',
      }}
      {...props}
    >
      {children}
    </select>
  );
});

export interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
  id?: string;
}

/** Stückzahl mit großen Schaltflächen — am Smartphone gut bedienbar. */
export function QuantityInput({ value, onChange, min = 1, max = 99, label, id }: QuantityInputProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  return (
    <div className="inline-flex items-stretch overflow-hidden rounded-lg border border-input">
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        className="min-h-[46px] w-12 bg-surface-muted text-lg font-bold text-foreground-muted disabled:opacity-40"
      >
        −<span className="sr-only">{label} verringern</span>
      </button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        aria-label={label}
        onChange={(e) => onChange(clamp(Number(e.target.value) || min))}
        className="w-16 border-x border-input bg-surface text-center text-[15px] font-semibold text-foreground [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        className="min-h-[46px] w-12 bg-surface-muted text-lg font-bold text-foreground-muted disabled:opacity-40"
      >
        +<span className="sr-only">{label} erhöhen</span>
      </button>
    </div>
  );
}
