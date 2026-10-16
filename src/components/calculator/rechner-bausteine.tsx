import type { ReactNode } from 'react';

import { orientierungsHinweis, spanneText } from '@/lib/richtwerte/rechnen';
import type { AuswahlZeile, RichtwertErgebnis as Ergebnis } from '@/lib/richtwerte/typen';
import { ButtonLink } from '@/components/ui/button';
import { GlyphRechner } from '@/components/visual/glyphen/rechner';

/* Gemeinsame Bausteine der Orientierungsrechner — beide Rechner sehen gleich
 * aus und sagen dasselbe, nur die Auswahl unterscheidet sich. */

export function RechnerRahmen({
  titel,
  einleitung,
  children,
}: {
  titel: string;
  einleitung: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5 md:p-6">
      <div className="flex gap-3 border-b border-border pb-5">
        <GlyphRechner size={20} className="mt-1 text-primary" />
        <div className="min-w-0">
          <h3 className="text-title font-semibold text-foreground">{titel}</h3>
          <p className="mt-1 text-small leading-relaxed text-foreground-muted">{einleitung}</p>
        </div>
      </div>
      <div className="mt-5 space-y-6">{children}</div>
    </div>
  );
}

export function Auswahlgruppe({
  legende,
  hinweis,
  children,
}: {
  legende: string;
  hinweis?: string;
  children: ReactNode;
}) {
  return (
    <fieldset>
      <legend className="text-title-sm font-semibold text-foreground">{legende}</legend>
      {hinweis && <p className="mt-1 text-small text-foreground-subtle">{hinweis}</p>}
      <div className="mt-3 grid grid-cols-kacheln gap-3">{children}</div>
    </fieldset>
  );
}

/**
 * Die Auswahlkarten verstecken ihr Eingabefeld; der Tastaturfokus wird
 * deshalb am Rahmen der Karte sichtbar gemacht (Variante `fokus-innen`).
 */
export function Fokusrahmen({ children }: { children: ReactNode }) {
  return (
    // self-start: Der Rahmen folgt der Karte und wird nicht auf die Zeilenhöhe der Nachbarkarte gestreckt.
    <div className="self-start rounded-lg fokus-innen:ring-2 fokus-innen:ring-ring fokus-innen:ring-offset-2 fokus-innen:ring-offset-background">
      {children}
    </div>
  );
}

export const KEIN_RICHTWERT_TEXT = 'Für diese Auswahl nennen wir Ihnen den Rahmen nach einer kurzen Anfrage.';

export interface RichtwertErgebnisProps {
  ergebnis: Ergebnis;
  zusammenfassung: AuswahlZeile[];
  hinweis: string | null;
  /** Was noch fehlt, solange die Auswahl unvollständig ist. */
  aufforderung: string;
  /** Ergänzung unter dem Betrag, z. B. „einschließlich Anfahrt“. */
  zusatz?: string;
  anfrageHref: string;
}

/**
 * Ergebnisbereich: eine Spanne nur, wenn alle Beträge gepflegt sind — sonst
 * die Auswahl und die Bitte um eine Anfrage. Nie ein erfundener Betrag.
 */
export function RichtwertErgebnis({
  ergebnis,
  zusammenfassung,
  hinweis,
  aufforderung,
  zusatz,
  anfrageHref,
}: RichtwertErgebnisProps) {
  return (
    <div className="space-y-4">
      <div aria-live="polite" className="rounded-lg border border-border bg-surface-muted p-4 md:p-5">
        {ergebnis.art === 'unvollstaendig' ? (
          <p className="text-body leading-relaxed text-foreground-muted">{aufforderung}</p>
        ) : (
          <>
            {ergebnis.art === 'spanne' ? (
              <>
                <p className="font-mono text-caption font-bold uppercase tracking-label text-foreground-muted">
                  Richtwert für Ihre Auswahl
                </p>
                <p className="mt-1 font-mono text-headline font-bold tabular-nums text-foreground">
                  {spanneText(ergebnis.spanne)}
                </p>
                <p className="mt-1 text-small text-foreground-muted">
                  {['inklusive Umsatzsteuer', zusatz].filter(Boolean).join(', ')}
                </p>
              </>
            ) : (
              <p className="text-body font-semibold leading-relaxed text-foreground">{KEIN_RICHTWERT_TEXT}</p>
            )}

            <dl className="mt-4 divide-y divide-border border-t border-border">
              {zusammenfassung.map((zeile) => (
                <div key={zeile.label} className="grid gap-0.5 py-2.5 sm:grid-cols-12 sm:gap-3">
                  <dt className="text-small font-semibold text-foreground-muted sm:col-span-4">{zeile.label}</dt>
                  {/* Wie ein Schriftfeld: alle Angaben in Mono, Zahlen mit fester Ziffernbreite (K-005a) */}
                  <dd className="font-mono text-small tabular-nums text-foreground sm:col-span-8">{zeile.wert}</dd>
                </div>
              ))}
            </dl>

            {ergebnis.art === 'spanne' && (
              <p className="mt-3 text-small leading-relaxed text-foreground-muted">{orientierungsHinweis(hinweis)}</p>
            )}
          </>
        )}
      </div>

      <ButtonLink href={anfrageHref} fullWidth pfeil>
        Anfrage stellen
      </ButtonLink>
    </div>
  );
}
