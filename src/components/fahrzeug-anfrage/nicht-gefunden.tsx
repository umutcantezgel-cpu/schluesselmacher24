import Link from 'next/link';

import { cn } from '@/lib/cn';
import { erreichbarkeitSatz } from '@/lib/erreichbarkeit';
import { NICHT_GEFUNDEN_ADRESSE } from '@/lib/fahrzeuge/anfrage-klassen';
import { telefonLink } from '@/lib/telefon';
import type { Erreichbarkeit } from '@/lib/types';

/** Kennung des Blocks im HTML, für Tests und die Sichtprobe. */
export const NICHT_GEFUNDEN_KENNUNG = 'fahrzeug-nicht-gefunden';

/** Der Satz des Blocks, im Wortlaut der Vorgabe (FA Abschnitt 06, Fallback). */
export const NICHT_GEFUNDEN_SATZ =
  'Senden Sie uns trotzdem Ihre Anfrage: Fahrzeugdaten, Fahrzeugschein, drei Fotos Ihres Schlüssels und eine kurze Beschreibung. Wir prüfen Ihr Fahrzeug einzeln.';

export interface FahrzeugNichtGefundenProps {
  /** Telefonnummer aus den Einstellungen (`kontakt(company).telefon`); ohne Nummer entfällt die Zeile. */
  telefon?: string;
  /**
   * Ziel des Knopfs, etwa mit Vorbelegung aus der Suche; sonst die Anfrage „nicht gefunden“. `null` lässt den
   * Knopf weg, wo die Anfrage „nicht gefunden“ nicht passt (Roller mit Versicherungskennzeichen: Dort ist die
   * freie Eingabe im selben Formular der Ausweg).
   */
  href?: string | null;
  erreichbarkeit?: Erreichbarkeit;
  /** Eigener Satz, etwa in der Motorradsuche, wo die freie Eingabe der erste Ausweg ist. */
  satz?: string;
  className?: string;
}

/**
 * „Fahrzeug nicht gefunden?“ (FA-KERN-02B, FA Abschnitte 06 und 26): fester Block unter jeder Fahrzeugsuche,
 * auf der Markenübersicht und jeder Markenseite. Führt in die Anfrage mit Fahrzeugschein, drei
 * Schlüsselfotos und Beschreibung und bietet die Telefonnummer an. Ohne Browser-Logik, nutzbar in Server-
 * und Client-Komponenten.
 */
export function FahrzeugNichtGefunden({ telefon, href = NICHT_GEFUNDEN_ADRESSE, erreichbarkeit, satz = NICHT_GEFUNDEN_SATZ, className }: FahrzeugNichtGefundenProps) {
  const telefonHref = telefonLink(telefon);
  return (
    <div data-block={NICHT_GEFUNDEN_KENNUNG} className={cn('rounded-lg border border-border bg-surface p-4 sm:p-5', className)}>
      <p className="text-body font-semibold text-foreground">Fahrzeug nicht gefunden?</p>
      <p className="mt-1 max-w-measure text-small leading-relaxed text-foreground-muted">{satz}</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
        {href && (
          <Link
            href={href}
            className="inline-flex min-h-touch items-center font-semibold text-primary underline-offset-2 hover:underline"
          >
            Fahrzeug anfragen
          </Link>
        )}
        {telefon && (
          <p className="text-small text-foreground-muted">
            {href ? 'Oder rufen Sie uns an:' : 'Rufen Sie uns an:'}{' '}
            {telefonHref ? (
              <a href={telefonHref} className="whitespace-nowrap font-mono font-semibold tabular-nums text-primary">
                {telefon}
              </a>
            ) : (
              <span className="whitespace-nowrap font-mono tabular-nums">{telefon}</span>
            )}
          </p>
        )}
      </div>
      {telefon && erreichbarkeit && <p className="mt-1 text-caption text-foreground-muted">{erreichbarkeitSatz(erreichbarkeit)}</p>}
    </div>
  );
}
