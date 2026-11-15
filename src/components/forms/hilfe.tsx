import Link from 'next/link';
import type { ReactNode } from 'react';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Erreichbarkeit as ErreichbarkeitAnzeige } from '@/components/vertrauen/erreichbarkeit';
import { cn } from '@/lib/cn';
import { telefonLink } from '@/lib/telefon';

import type { HilfeKontakt } from './hilfe-daten';

/* ==========================================================================
   Hilfe in mehrstufigen Formularen (FA Abschnitt 26, FA-QA-02)
   Ein Baustein für alle Formulare statt eigener Kästen je Formular: Telefon aus den Einstellungen mit
   der Erreichbarkeit im Wortlaut des Inhabers, Rückruf und „Später weitermachen“, dazu die Meldung
   nach einem Fehler beim Absenden und der Weg zum unvollständigen Schritt. Kein eigener Satz zu Zeiten.
   ========================================================================== */

/** Kennung des Hilfeblocks, für Tests und die Sichtprobe. */
export const HILFE_BLOCK = 'hilfe';

/** Telefonnummer als Verweis, darunter die Erreichbarkeit; ohne Nummer nichts. */
export function TelefonHilfe({ telefon, erreichbarkeit, className }: HilfeKontakt & { className?: string }) {
  if (!telefon) return null;
  const href = telefonLink(telefon);
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-8', className)}>
      <p className="text-small text-foreground-muted">
        Rufen Sie uns an:{' '}
        {href ? (
          <a href={href} className="inline-flex min-h-touch items-center whitespace-nowrap font-mono font-semibold tabular-nums text-primary underline">
            {telefon}
          </a>
        ) : (
          <span className="whitespace-nowrap font-mono tabular-nums">{telefon}</span>
        )}
      </p>
      {erreichbarkeit && <ErreichbarkeitAnzeige angabe={erreichbarkeit} />}
    </div>
  );
}

export interface HilfeBlockProps {
  hilfe?: HilfeKontakt;
  /** Überschrift; Standard „Unsicher bei einer Angabe?“. */
  titel?: string;
  /** Ein Satz unter der Überschrift, etwa was zu tun ist, wenn ein Maß fehlt. */
  satz?: ReactNode;
  /** „Rückruf erbitten“ zeigen (nicht im Rückrufformular selbst). */
  rueckruf?: boolean;
  /** „Später weitermachen“ zeigen: Angaben bleiben auf dem Gerät, Dateien nicht. */
  spaeter?: boolean;
  /** Das Formular hat Dateien: Der Satz zu „Später weitermachen“ nennt, dass sie neu zu wählen sind. */
  mitDateien?: boolean;
  /** Ort im Formular, etwa „unterlagen“ oder „masse“ (für Tests und die Sichtprobe). */
  stelle?: string;
  className?: string;
}

/**
 * Hilfeblock „Unsicher bei einer Angabe?“ nach dem Muster der gemeinsamen Fahrzeugschlüssel-Anfrage:
 * Telefon mit Erreichbarkeit, Rückruf und, wo es passt, „Später weitermachen“.
 */
export function HilfeBlock({
  hilfe,
  titel = 'Unsicher bei einer Angabe?',
  satz = 'Wir helfen Ihnen beim Ausfüllen.',
  rueckruf = true,
  spaeter = false,
  mitDateien = false,
  stelle,
  className,
}: HilfeBlockProps) {
  return (
    <div data-block={HILFE_BLOCK} data-stelle={stelle} className={cn('rounded-lg border border-border bg-surface-muted p-4', className)}>
      <p className="text-body font-semibold text-foreground">{titel}</p>
      {satz && <p className="mt-1 max-w-measure text-small text-foreground-muted">{satz}</p>}
      <TelefonHilfe telefon={hilfe?.telefon} erreichbarkeit={hilfe?.erreichbarkeit} className="mt-2" />
      {(rueckruf || spaeter) && (
        <ul className="mt-3 max-w-measure space-y-2 text-small text-foreground-muted">
          {spaeter && (
            <li>
              Später weitermachen: Ihre Angaben bleiben auf diesem Gerät gespeichert.
              {mitDateien && ' Die Dateien wählen Sie dann bitte erneut aus.'}
            </li>
          )}
          {rueckruf && (
            <li>
              <Link href="/beratung#rueckruf" className="inline-flex min-h-touch items-center font-semibold text-primary underline">
                Rückruf erbitten
              </Link>
              : Wir rufen Sie an und klären Ihre Fragen.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

/**
 * Meldung nach einem Fehler beim Absenden: der Grund, dass die Angaben erhalten bleiben, und was der
 * Kunde tun kann (noch einmal versuchen oder anrufen). Wird sofort angesagt (`role="alert"`).
 */
export function AbsendeFehler({
  fehler,
  hilfe,
  titel = 'Absenden nicht möglich',
  className = 'mb-6',
}: {
  fehler: string;
  hilfe?: HilfeKontakt;
  titel?: string;
  className?: string;
}) {
  const href = telefonLink(hilfe?.telefon);
  return (
    <Alert tone="warning" title={titel} className={className} role="alert">
      <p>{fehler}</p>
      <p className="mt-2" data-absende-hilfe>
        Ihre Angaben bleiben erhalten. Versuchen Sie es noch einmal
        {hilfe?.telefon ? (
          <>
            {' '}oder rufen Sie uns an:{' '}
            {href ? (
              <a href={href} className="whitespace-nowrap font-mono font-semibold tabular-nums text-primary underline">
                {hilfe.telefon}
              </a>
            ) : (
              <span className="whitespace-nowrap font-mono tabular-nums">{hilfe.telefon}</span>
            )}
            .
          </>
        ) : (
          <>
            {' '}oder{' '}
            <Link href="/beratung#rueckruf" className="font-semibold text-primary underline">
              erbitten Sie einen Rückruf
            </Link>
            .
          </>
        )}
      </p>
    </Alert>
  );
}

/**
 * Im letzten Schritt: Es fehlt noch etwas, meist Dateien nach einem Neuladen der Seite. Sagt es und
 * führt mit einem Knopf zum unvollständigen Schritt.
 */
export function OffenerSchritt({ text, schritt, onGehe }: { text: string; schritt: string; onGehe: () => void }) {
  return (
    <Alert tone="warning" title="Es fehlt noch etwas" className="mb-6" role="status">
      <p>{text}</p>
      <Button type="button" variant="outline" className="mt-3" onClick={onGehe}>
        Zum Schritt „{schritt}“
      </Button>
    </Alert>
  );
}
