'use client';

import { type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check, RotateCcw, Save } from 'lucide-react';
import type { FlowState } from '@/lib/flow/use-flow';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';

export interface FlowShellProps<T extends object> {
  flow: FlowState<T>;
  /** Überschrift des gesamten Ablaufs. */
  title: string;
  /** Beschriftung der Schaltfläche im letzten Schritt. */
  submitLabel?: string;
  onSubmit?: () => void;
  submitting?: boolean;
  /** Hinweis, warum es gerade nicht weitergeht. */
  blockedHint?: string;
  children: ReactNode;
}

/**
 * Gemeinsamer Rahmen für alle mehrstufigen Abläufe:
 * Fortschrittsanzeige, Schrittüberschrift, Navigation und der Hinweis
 * auf den gespeicherten Zwischenstand.
 */
export function FlowShell<T extends object>({
  flow,
  title,
  submitLabel = 'Absenden',
  onSubmit,
  submitting = false,
  blockedHint,
  children,
}: FlowShellProps<T>) {
  const percent = Math.round(flow.progress * 100);

  return (
    <div className="pb-40 md:pb-8">
      {/* Fortschritt */}
      <div className="sticky top-16 z-30 -mx-5 border-b border-border bg-background/95 px-5 py-3 backdrop-blur sm:-mx-6 sm:px-6 md:top-20 md:mx-0 md:rounded-lg md:border md:px-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
            {title}
          </p>
          <p className="text-xs font-semibold text-foreground-muted">
            Schritt {flow.stepIndex + 1} von {flow.stepCount}
          </p>
        </div>

        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Fortschritt: ${percent} Prozent`}
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${Math.max(percent, 4)}%` }}
          />
        </div>

        {/* Schrittliste ab Tablet */}
        <ol className="mt-3 hidden flex-wrap gap-x-4 gap-y-1 md:flex">
          {flow.steps.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => i <= flow.stepIndex && flow.goTo(s.id)}
                disabled={i > flow.stepIndex}
                className={cn(
                  'inline-flex items-center gap-1.5 text-xs font-semibold transition-colors',
                  i === flow.stepIndex && 'text-primary',
                  i < flow.stepIndex && 'text-foreground-muted hover:text-primary',
                  i > flow.stepIndex && 'cursor-default text-foreground-subtle',
                )}
              >
                {i < flow.stepIndex ? (
                  <Check size={12} aria-hidden />
                ) : (
                  <span aria-hidden>{i + 1}.</span>
                )}
                {s.short}
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* Hinweis auf wiederhergestellten Stand */}
      {flow.restored && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface-muted px-4 py-3">
          <p className="text-[13px] text-foreground-muted">
            <Save size={14} className="mr-1.5 inline align-[-2px]" aria-hidden />
            Ihr Zwischenstand von zuletzt wurde geladen.
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={flow.dismissRestored}>
              Weitermachen
            </Button>
            <Button variant="outline" size="sm" onClick={flow.reset}>
              <RotateCcw size={14} aria-hidden />
              Neu beginnen
            </Button>
          </div>
        </div>
      )}

      {/* Schritt */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-foreground md:text-2xl">{flow.step?.title}</h2>
        {flow.step?.hint && (
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-foreground-muted">
            {flow.step.hint}
          </p>
        )}
        <div className="mt-6">{children}</div>
      </div>

      {/* Navigation — am Smartphone fest am unteren Rand */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 p-4 backdrop-blur',
          'md:static md:mt-8 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none',
        )}
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        {blockedHint && !flow.canContinue && (
          <p className="mb-2 text-center text-[13px] text-foreground-subtle md:text-left">
            {blockedHint}
          </p>
        )}
        <div className="mx-auto flex max-w-shell gap-3 md:mx-0">
          <Button variant="outline" size="lg" onClick={flow.back} disabled={flow.isFirst}>
            <ArrowLeft size={17} aria-hidden />
            <span className="hidden sm:inline">Zurück</span>
          </Button>

          {flow.isLast ? (
            <Button
              size="lg"
              fullWidth
              onClick={onSubmit}
              disabled={!flow.canContinue}
              loading={submitting}
            >
              {submitLabel}
            </Button>
          ) : (
            <Button size="lg" fullWidth onClick={flow.next} disabled={!flow.canContinue}>
              Weiter
              <ArrowRight size={17} aria-hidden />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
