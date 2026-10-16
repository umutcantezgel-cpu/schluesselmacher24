'use client';

import { useState, type ReactNode } from 'react';
import type { FlowState } from '@/lib/flow/use-flow';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { GlyphHaken } from '@/components/visual/glyphen/haken';
import { GlyphPfeilLinks } from '@/components/visual/glyphen/pfeil-links';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { GlyphSpeichern } from '@/components/visual/glyphen/speichern';
import { GlyphZuruecksetzen } from '@/components/visual/glyphen/zuruecksetzen';

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

  // Schrittwechsel (B-11): Nur ein Wechsel über die eigenen Knöpfe bewegt sich, in seiner
  // Richtung. Das Wiederherstellen eines Zwischenstands und der erste Render stehen still.
  // Muster „Information aus vorigem Render“, ohne Ref und ohne Effekt.
  const [absicht, setAbsicht] = useState<'vor' | 'zurueck' | null>(null);
  const [wechsel, setWechsel] = useState<{ vorher: number; richtung: 'vor' | 'zurueck' | null }>({
    vorher: flow.stepIndex,
    richtung: null,
  });
  if (wechsel.vorher !== flow.stepIndex) {
    setWechsel({ vorher: flow.stepIndex, richtung: absicht });
    setAbsicht(null);
  }
  const weiter = () => {
    setAbsicht('vor');
    flow.next();
  };
  const zurueck = () => {
    setAbsicht('zurueck');
    flow.back();
  };

  return (
    <div className="pb-40 md:pb-8">
      {/* Fortschritt */}
      <div className="sticky top-header z-sticky -mx-5 border-b border-border bg-background px-5 py-3 sm:-mx-6 sm:px-6 md:mx-0 md:rounded-lg md:border md:px-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-caption font-mono uppercase tracking-label text-foreground-subtle">
            {title}
          </p>
          <p className="text-caption font-mono tabular-nums text-foreground-muted">
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
            className="h-full origin-left rounded-full bg-primary transition-transform duration-slow ease-standard"
            style={{ transform: `scaleX(${Math.max(flow.progress, 0.04)})` }}
          />
        </div>

        {/* Schrittliste ab Tablet */}
        <ol className="mt-3 hidden flex-wrap gap-x-4 gap-y-1 md:flex">
          {flow.steps.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => {
                  if (i > flow.stepIndex) return;
                  if (i < flow.stepIndex) setAbsicht('zurueck');
                  flow.goTo(s.id);
                }}
                disabled={i > flow.stepIndex}
                aria-current={i === flow.stepIndex ? 'step' : undefined}
                className={cn(
                  'inline-flex min-h-6 items-center gap-1.5 text-caption font-semibold transition-colors',
                  i === flow.stepIndex && 'text-primary',
                  i < flow.stepIndex && 'text-foreground-muted hover:text-primary',
                  i > flow.stepIndex && 'cursor-default text-foreground-subtle',
                )}
              >
                {i < flow.stepIndex ? (
                  <GlyphHaken size={14} />
                ) : (
                  <span aria-hidden className="font-mono tabular-nums">
                    {i + 1}.
                  </span>
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
          <p className="flex items-center gap-2 text-small text-foreground-muted">
            <GlyphSpeichern size={16} />
            Ihr Zwischenstand von zuletzt wurde geladen.
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={flow.dismissRestored}>
              Weitermachen
            </Button>
            <Button variant="outline" size="sm" onClick={flow.reset}>
              <GlyphZuruecksetzen size={14} />
              Neu beginnen
            </Button>
          </div>
        </div>
      )}

      {/* Schritt: Überschrift, Hinweis und Inhalt wechseln gemeinsam (B-11) */}
      <div
        key={flow.step?.id}
        className={cn(
          'mt-6',
          wechsel.richtung === 'vor' && 'sm24-schritt-vor',
          wechsel.richtung === 'zurueck' && 'sm24-schritt-zurueck',
        )}
      >
        <h2 className="text-title font-bold text-foreground">{flow.step?.title}</h2>
        {flow.step?.hint && (
          <p className="mt-2 max-w-measure text-body text-foreground-muted">{flow.step.hint}</p>
        )}
        <div className="mt-6">{children}</div>
      </div>

      {/* Navigation — am Smartphone fest am unteren Rand */}
      <div
        className={cn(
          'sm24-ablauf-leiste fixed inset-x-0 bottom-0 z-sticky border-t border-border bg-surface p-4',
          'md:static md:mt-8 md:border-0 md:bg-transparent md:p-0 md:pb-4',
        )}
      >
        {blockedHint && !flow.canContinue && (
          <p className="mb-2 text-center text-small text-foreground-subtle md:text-left">
            {blockedHint}
          </p>
        )}
        <div className="mx-auto flex max-w-shell gap-3 md:mx-0">
          <Button variant="outline" size="lg" onClick={zurueck} disabled={flow.isFirst}>
            <GlyphPfeilLinks size={18} />
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
            <Button size="lg" fullWidth onClick={weiter} disabled={!flow.canContinue}>
              Weiter
              <GlyphPfeilRechts size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
