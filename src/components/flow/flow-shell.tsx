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
  /** Überschrift des gesamten Ablaufs. Sichtbar steht sie in der h1 der Seite, hier benennt sie den Fortschritt. */
  title: string;
  /** Beschriftung der Schaltfläche im letzten Schritt. */
  submitLabel?: string;
  onSubmit?: () => void;
  submitting?: boolean;
  /** Hinweis, warum es gerade nicht weitergeht. */
  blockedHint?: string;
  /**
   * Aufteilung ab 1024 px: `voll` (Standard) nutzt alle zwölf Spalten. `seite` setzt den Schritt
   * in acht Spalten und die Schrittliste senkrecht in eine klebende Seite aus vier Spalten.
   */
  raster?: 'voll' | 'seite';
  /** Zusatz unter der Schrittliste in der klebenden Seite (nur `raster="seite"`, ab 1024 px). */
  seite?: ReactNode;
  /** Laufende Summe: mobil links in der Leiste, ab 768 px rechts im klebenden Band (B-20). */
  summe?: { label: string; wert: string };
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
  raster = 'voll',
  seite,
  summe,
  children,
}: FlowShellProps<T>) {
  const percent = Math.round(flow.progress * 100);
  const mitSeite = raster === 'seite';

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

  const schrittliste = (
    <ol className={mitSeite ? 'flex flex-col gap-1' : 'mt-3 hidden flex-wrap gap-x-4 gap-y-1 md:flex'}>
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
              'inline-flex min-h-6 items-center gap-1.5 text-caption font-semibold transition-colors duration-quick ease-standard',
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
  );

  return (
    <div data-ablauf className="sm24-ablauf pb-40 md:pb-8">
      {/* Fortschritt: klebendes Band über die ganze Breite der Shell, auf allen Breiten gleich
          (eine Zeile „Schritt n von m · Name“, der Ablauftitel steht schon in der h1). */}
      <div className="sticky top-header z-sticky -mx-5 border-b border-border bg-background px-5 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex items-baseline justify-between gap-3">
          <p className="min-w-0 truncate whitespace-nowrap text-caption font-mono tabular-nums text-foreground-muted">
            Schritt {flow.stepIndex + 1} von {flow.stepCount}
            {flow.step?.short && <span> · {flow.step.short}</span>}
          </p>
          {summe && (
            <p className="hidden shrink-0 items-baseline gap-2 md:flex">
              <span className="font-mono text-caption uppercase tracking-label text-foreground-muted">{summe.label}</span>
              <span
                key={summe.wert}
                className="animate-schleier-ein font-mono text-small font-semibold tabular-nums text-foreground"
              >
                {summe.wert}
              </span>
            </p>
          )}
        </div>

        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Fortschritt ${title}: ${percent} Prozent`}
        >
          <div
            className="h-full origin-left rounded-full bg-primary transition-transform duration-slow ease-standard"
            style={{ transform: `scaleX(${Math.max(flow.progress, 0.04)})` }}
          />
        </div>
      </div>

      <div className={mitSeite ? 'lg:mt-6 lg:grid lg:grid-cols-12 lg:gap-gutter' : undefined}>
        <div className={mitSeite ? 'lg:col-span-8 lg:row-start-1' : undefined}>
          {/* Schrittliste ab Tablet unter dem Band; im Raster `seite` steht sie in der Seite. */}
          {!mitSeite && schrittliste}

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

          {/* Schritt: Überschrift, Hinweis und Inhalt wechseln gemeinsam (B-11). Mobil schneidet die
              Hülle das Einschieben um 8 px ab, damit randlose Leisten nicht seitlich scrollen
              (`clip` ist kein Scrollcontainer, `sticky` darin bleibt intakt). */}
          <div className="-mx-5 overflow-x-clip px-5 sm:-mx-6 sm:px-6 md:mx-0 md:overflow-x-visible md:px-0">
            <div
              key={flow.step?.id}
              className={cn(
                'mt-6',
                mitSeite && 'lg:mt-0',
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
          </div>

          {/* Navigation — am Smartphone fest am unteren Rand, ab Tablet eine Zeile: Zurück links,
              Weiter rechtsbündig in Inhaltsbreite. */}
          <div
            className={cn(
              'sm24-ablauf-leiste fixed inset-x-0 bottom-0 z-sticky border-t border-border bg-surface p-4',
              'md:static md:mt-8 md:border-0 md:bg-transparent md:p-0 md:pb-4',
            )}
          >
            {blockedHint && !flow.canContinue && (
              <p className="mb-2 text-center text-small text-foreground-subtle md:text-right">{blockedHint}</p>
            )}
            <div className="mx-auto flex max-w-shell items-center gap-3 md:mx-0">
              {/* Mobil steht die laufende Summe links, wie in der Leiste des Warenkorbs. */}
              {summe && (
                <p className="mr-auto flex min-w-0 flex-col md:hidden">
                  <span className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                    {summe.label}
                  </span>
                  <span
                    key={summe.wert}
                    className="animate-schleier-ein font-mono text-body font-semibold tabular-nums text-foreground"
                  >
                    {summe.wert}
                  </span>
                </p>
              )}

              {/* Auf Schritt 1 gibt es kein Zurück; mobil bleibt der Name für Hilfsmittel lesbar. */}
              {!flow.isFirst && (
                <Button variant="outline" size="lg" onClick={zurueck}>
                  <GlyphPfeilLinks size={18} />
                  <span className="sr-only sm:not-sr-only">Zurück</span>
                </Button>
              )}

              {flow.isLast ? (
                <Button
                  size="lg"
                  fullWidth={!summe}
                  className="md:ml-auto md:w-auto"
                  onClick={onSubmit}
                  disabled={!flow.canContinue}
                  loading={submitting}
                >
                  {submitLabel}
                </Button>
              ) : (
                <Button
                  size="lg"
                  fullWidth={!summe}
                  className="md:ml-auto md:w-auto"
                  onClick={weiter}
                  disabled={!flow.canContinue}
                >
                  Weiter
                  <GlyphPfeilRechts size={18} />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Klebende Seite (Raster `seite`, ab 1024 px): Schrittliste senkrecht, darunter der Zusatz.
            Darunter blendet sie aus, das Band nennt den Schritt. */}
        {mitSeite && (
          <div className="hidden lg:sticky lg:top-36 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:block lg:self-start">
            {schrittliste}
            {seite && <div className="mt-6">{seite}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
