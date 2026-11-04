'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, type ReactNode } from 'react';

import { SummaryList } from '@/components/layout/summary-list';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { CheckDraw } from '@/components/visual/motion/check-draw';
import { scrollVerhalten } from '@/lib/bewegung';
import type { SummarySection } from '@/lib/types';
import type { NaechsterSchritt } from '@/lib/wege/naechste-schritte';

/** Statusabruf mit Vorgangsnummer und E-Mail-Adresse. */
export const STATUS_HREF = '/service-und-termin/terminstatus';
const KONTAKT_HREF = '/service-und-termin/kontakt';

export interface WegBestaetigungProps {
  /** Was eingegangen ist, als Kennzeile und Titel des Hakens: „Anfrage eingegangen“. */
  marke: string;
  /** Überschrift der Ansicht: „Ihre Anfrage ist bei uns“. */
  titel: string;
  /** Ein, zwei Sätze, was jetzt mit den Angaben geschieht. */
  text: ReactNode;
  reference: string;
  /** Wozu die Nummer dient; ohne Angabe: Stand abrufen und Rückfragen. */
  nummerHinweis?: ReactNode;
  /** Hinweise des Servers (E-Mail nicht versendet, Datei nicht zugeordnet). */
  notices?: string[];
  /** „So geht es weiter“ aus lib/wege/naechste-schritte, dieselben Schritte wie auf der Statusseite. */
  schritte?: NaechsterSchritt[];
  /** „Ihre Angaben“: die Zusammenfassung, die der Weg mitgesendet hat. */
  summary?: SummarySection[];
  /** Weg zurück in den Bereich. */
  zurueck: { href: string; label: string };
  /** Stand über Vorgangsnummer und E-Mail abrufbar (Standard); Partnerbewerbungen haben keinen Statusabruf. */
  statusAbrufbar?: boolean;
  /** Passende Wege zum Weitermachen. */
  weitere?: Array<{ href: string; label: string }>;
  /** Ergänzungen unter den Hinweisen, etwa ein Rechtshinweis oder ein Link zum Nachbestellen. */
  children?: ReactNode;
}

/**
 * Gemeinsame Bestätigung am Ende jedes Anfrage-Weges (G-38, E6-OPUS-01): Haken, Vorgangsnummer,
 * Hinweise, „So geht es weiter“, die übermittelten Angaben und der Weg zum Statusabruf. Nach dem
 * Absenden ersetzt sie das Formular; Blick und Fokus gehen auf ihren Anfang, damit niemand am Ende
 * einer leeren Seite steht und Hilfsmittel die Überschrift ansagen.
 */
export function WegBestaetigung({
  marke,
  titel,
  text,
  reference,
  nummerHinweis,
  notices = [],
  schritte = [],
  summary = [],
  zurueck,
  statusAbrufbar = true,
  weitere = [],
  children,
}: WegBestaetigungProps) {
  const rahmen = useRef<HTMLDivElement>(null);
  const ueberschrift = useRef<HTMLHeadingElement>(null);
  const schritteId = useId();
  const nummerId = useId();

  useEffect(() => {
    rahmen.current?.scrollIntoView?.({ block: 'start', behavior: scrollVerhalten() });
    ueberschrift.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div ref={rahmen} className="max-w-3xl" data-bestaetigung>
      <div className="flex items-center gap-4">
        <CheckDraw title={marke} size={56} />
        {/* Hilfsmittel hören die Marke schon am Haken (role="img") */}
        <p aria-hidden className="font-mono text-caption uppercase tracking-label text-success">
          {marke}
        </p>
      </div>

      {/* Beim Fokus sagen Hilfsmittel mit der Überschrift auch die Vorgangsnummer an */}
      <h2 ref={ueberschrift} tabIndex={-1} aria-describedby={nummerId} className="mt-5 text-headline text-foreground focus:outline-none">
        {titel}
      </h2>
      <div className="mt-3 max-w-measure text-body leading-relaxed text-foreground-muted">{text}</div>

      <div className="mt-6 rounded-lg border border-border bg-surface-muted p-5">
        <div id={nummerId}>
          <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">Ihre Vorgangsnummer</p>
          <p className="mt-1 break-words font-mono text-headline tabular-nums text-foreground">{reference}</p>
        </div>
        <p className="mt-2 text-small leading-relaxed text-foreground-muted">
          {nummerHinweis ??
            (statusAbrufbar
              ? 'Bitte bewahren Sie diese Nummer auf. Mit ihr und Ihrer E-Mail-Adresse rufen Sie jederzeit den Stand Ihres Vorgangs ab.'
              : 'Bitte bewahren Sie diese Nummer auf und nennen Sie sie, wenn Sie sich bei uns melden.')}
        </p>
      </div>

      {notices.length > 0 && (
        <Alert tone="warning" title="Bitte beachten" className="mt-5">
          <ul className="space-y-1.5">
            {notices.map((notice) => (
              <li key={notice}>{notice}</li>
            ))}
          </ul>
        </Alert>
      )}

      {children}

      {schritte.length > 0 && (
        <section aria-labelledby={schritteId} className="mt-8">
          <h3 id={schritteId} className="text-title-sm font-semibold text-foreground">
            So geht es weiter
          </h3>
          <ol className="mt-4 border-t border-border">
            {schritte.map((schritt, index) => (
              <li key={schritt.titel} className="flex items-baseline gap-4 border-b border-border py-4">
                <span aria-hidden className="w-6 shrink-0 font-mono text-small font-semibold tabular-nums text-primary">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-body font-semibold text-foreground">{schritt.titel}</p>
                  <p className="mt-1 text-small leading-relaxed text-foreground-muted">{schritt.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {summary.length > 0 && (
        <section className="mt-8">
          <h3 className="text-title-sm font-semibold text-foreground">Ihre Angaben</h3>
          <SummaryList sections={summary} variante="schriftfeld" className="mt-4" />
        </section>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {statusAbrufbar && (
          <ButtonLink href={STATUS_HREF} pfeil className="w-full justify-between sm:w-auto">
            Stand des Vorgangs abrufen
          </ButtonLink>
        )}
        <ButtonLink href={zurueck.href} variant={statusAbrufbar ? 'outline' : 'primary'}>
          {zurueck.label}
        </ButtonLink>
      </div>

      {weitere.length > 0 && (
        <p className="mt-8 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-6 text-small">
          <span className="font-semibold text-foreground-muted">Ebenfalls passend:</span>
          {weitere.map((weg) => (
            <Link key={weg.href} href={weg.href} className="flex min-h-touch items-center font-semibold text-primary hover:underline">
              {weg.label}
            </Link>
          ))}
        </p>
      )}

      <p className="mt-6 text-small leading-relaxed text-foreground-muted">
        Stimmt etwas nicht?{' '}
        <Link href={KONTAKT_HREF} className="rounded-sm font-semibold text-primary hover:underline">
          Melden Sie sich bei uns
        </Link>{' '}
        und nennen Sie Ihre Vorgangsnummer.
      </p>
    </div>
  );
}
