import Link from 'next/link';

import { formatCents } from '@/lib/format';
import { WIDERRUF_ERKLAEREN_HREF } from '@/lib/navigation';
import { angabe, standort } from '@/lib/rechtliches/firma';
import { ZAHLUNG_OHNE_ONLINE } from '@/lib/rechtliches/zahlarten';
import type { Settings } from '@/lib/types';

interface VersandInhaltProps {
  settings: Pick<Settings, 'company' | 'shipping' | 'booking'>;
  /** Anzeigetexte der Online-Zahlarten; `null` ohne Online-Zahlung. */
  zahlarten: string[] | null;
}

function kosten(cents: number): string {
  return cents === 0 ? 'kostenfrei' : formatCents(cents);
}

/** Zahlung und Versand: Versandarten, Lieferzeiten, Zahlarten, Anzahlung und Preise. */
export function VersandInhalt({ settings, zahlarten }: VersandInhaltProps) {
  const { shipping, booking, company } = settings;
  const mitLieferzeit = shipping.filter((option) => angabe(option.deliveryTime));
  const werkstatt = standort(company);
  const online = zahlarten && zahlarten.length > 0 ? zahlarten : null;

  return (
    <>
      <h1 className="text-headline font-bold text-balance">Zahlung und Versand</h1>
      <p className="mt-3">
        Hier finden Sie die Versandarten mit Kosten, die Zahlungsarten und die Regeln zur
        Anzahlung bei Terminaufträgen.
      </p>

      <h2>Liefergebiet</h2>
      <p>Wir liefern ausschließlich an Lieferanschriften in Deutschland.</p>

      <h2>Versandarten</h2>
      {/* Mobil gestapelte Zeilen mit denselben Angaben (KERN 1.6); die Tabelle erscheint ab md */}
      <dl className="mt-4 border-t border-border md:hidden">
        {shipping.map((option) => (
          <div key={option.id} className="border-b border-border py-3">
            <dt className="flex items-baseline justify-between gap-4 font-semibold text-foreground">
              <span>{option.label}</span>
              <span className="whitespace-nowrap font-mono tabular-nums">{kosten(option.priceCents)}</span>
            </dt>
            <dd className="mt-1 text-small text-foreground-muted">{option.description}</dd>
            <dd className="mt-1 text-small text-foreground-muted">
              Sendungsverfolgung: {option.tracked ? 'ja' : 'nein'}
              {option.insured ? ', versichert' : ''}
            </dd>
            {angabe(option.deliveryTime) && (
              <dd className="mt-1 text-small text-foreground-muted">Lieferzeit: {option.deliveryTime}</dd>
            )}
          </div>
        ))}
      </dl>
      <div className="table-scroll mt-4 hidden md:block">
        <table className="w-full border-collapse text-small">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold text-foreground">Versandart</th>
              <th className="py-2 pr-4 font-semibold text-foreground">Beschreibung</th>
              <th className="py-2 pr-4 font-semibold text-foreground">Sendungsverfolgung</th>
              {mitLieferzeit.length > 0 && <th className="py-2 pr-4 font-semibold text-foreground">Lieferzeit</th>}
              <th className="py-2 text-right font-semibold text-foreground">Kosten</th>
            </tr>
          </thead>
          <tbody>
            {shipping.map((option) => (
              <tr key={option.id} className="border-b border-border align-top">
                <td className="py-3 pr-4 font-semibold text-foreground">{option.label}</td>
                <td className="py-3 pr-4 text-foreground-muted">{option.description}</td>
                <td className="py-3 pr-4 text-foreground-muted">
                  {option.tracked ? 'ja' : 'nein'}
                  {option.insured ? ', versichert' : ''}
                </td>
                {mitLieferzeit.length > 0 && (
                  <td className="py-3 pr-4 text-foreground-muted">{angabe(option.deliveryTime) ?? '–'}</td>
                )}
                <td className="py-3 text-right font-mono font-semibold tabular-nums text-foreground">
                  {kosten(option.priceCents)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4">
        Welche Versandart zur Verfügung steht, hängt von den bestellten Artikeln ab. Die Auswahl
        erfolgt im Warenkorb.
      </p>
      {werkstatt && (
        <p>
          Bei Abholung holen Sie Ihre Bestellung nach unserer Benachrichtigung in unserer Werkstatt
          ab: {werkstatt.street}, {werkstatt.postalCode} {werkstatt.city}.
        </p>
      )}

      {mitLieferzeit.length > 0 && (
        <>
          <h2>Lieferzeiten</h2>
          <ul>
            {mitLieferzeit.map((option) => (
              <li key={option.id}>
                {option.label}: {option.deliveryTime!.trim()}
              </li>
            ))}
          </ul>
          <p>
            Die Lieferzeit beginnt mit dem Vertragsschluss, bei Online-Zahlung mit dem Eingang der
            Zahlung. Abweichende Angaben bei einzelnen Artikeln gehen vor.
          </p>
        </>
      )}

      <h2>Zahlungsarten</h2>
      {online ? (
        <>
          <p>
            Die Zahlung erfolgt online über den Zahlungsdienstleister Stripe. Nach dem Absenden
            werden Sie auf eine Bezahlseite von Stripe weitergeleitet. Zur Verfügung stehen:
          </p>
          <ul>
            {online.map((zahlart) => (
              <li key={zahlart}>{zahlart}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>
          {ZAHLUNG_OHNE_ONLINE}. Bestellungen und Terminbuchungen werden vollständig aufgenommen;
          die Zahlungsinformationen erhalten Sie mit unserer Bestätigung.
        </p>
      )}

      <h2>Anzahlung bei Terminaufträgen</h2>
      <p>
        Für Autoschlüssel-Termine erheben wir eine Anzahlung. Sie beträgt standardmäßig{' '}
        <strong className="font-mono tabular-nums">{formatCents(booking.depositCents)}</strong> und
        liegt je nach Fahrzeug und Leistung zwischen{' '}
        <span className="font-mono tabular-nums">{formatCents(booking.depositMinCents)}</span> und{' '}
        <span className="font-mono tabular-nums">{formatCents(booking.depositMaxCents)}</span>. Die
        Anzahlung wird <strong>vollständig mit dem Endpreis verrechnet</strong>.
      </p>
      <p>
        Grund für die Anzahlung: Für viele Fahrzeuge muss fahrzeugspezifisches Material im Voraus
        beschafft werden. Die Anzahlung sichert diese Beschaffung und den reservierten Termin ab.
      </p>
      <p>
        Der früheste Termin liegt in der Regel etwa{' '}
        <span className="font-mono tabular-nums">{booking.leadTimeDays} Tage</span> in der Zukunft,
        damit Beschaffung und Vorbereitung sicher abgeschlossen sind.
      </p>
      <p>
        Was bei Absage, Verschiebung oder Nichterscheinen mit der Anzahlung geschieht, richtet sich
        nach der individuellen Vereinbarung mit Ihnen. Ihr gesetzliches Widerrufsrecht bleibt
        unberührt – Einzelheiten unter <Link href="/rechtliches/widerruf">Widerruf und Rückgabe</Link>;
        widerrufen können Sie auch <Link href={WIDERRUF_ERKLAEREN_HREF}>online</Link>.
      </p>

      <h2>Preise</h2>
      <p>
        Alle Preise sind Endpreise einschließlich der gesetzlichen Umsatzsteuer von derzeit 19 %.
        Versandkosten kommen hinzu und werden im Warenkorb gesondert ausgewiesen.
      </p>
    </>
  );
}
