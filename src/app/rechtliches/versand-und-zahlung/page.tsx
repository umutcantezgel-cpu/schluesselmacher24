import type { Metadata } from 'next';

import { getSettings } from '@/lib/data';
import { formatCents } from '@/lib/format';
import { integrationStatuses } from '@/lib/integrations';

export const metadata: Metadata = {
  title: 'Zahlung und Versand',
  description: 'Zahlungsarten, Versandarten, Kosten und Lieferzeiten bei SCHLÜSSELMACHER24.',
};

export default async function VersandUndZahlungPage() {
  const settings = await getSettings();
  const payment = integrationStatuses().find((i) => i.id === 'zahlung');

  return (
    <>
      <h1 className="text-[1.75rem] font-bold leading-tight md:text-3xl">Zahlung und Versand</h1>
      <p className="mt-3">
        Hier finden Sie die Versandarten mit Kosten, die Zahlungsarten und die Regeln zur
        Anzahlung bei Terminaufträgen.
      </p>

      <h2>Versandarten</h2>
      <div className="table-scroll mt-4">
        <table className="w-full min-w-[34rem] border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold text-foreground">Versandart</th>
              <th className="py-2 pr-4 font-semibold text-foreground">Beschreibung</th>
              <th className="py-2 pr-4 font-semibold text-foreground">Sendungsverfolgung</th>
              <th className="py-2 font-semibold text-foreground">Kosten</th>
            </tr>
          </thead>
          <tbody>
            {settings.shipping.map((option) => (
              <tr key={option.id} className="border-b border-border align-top">
                <td className="py-3 pr-4 font-semibold text-foreground">{option.label}</td>
                <td className="py-3 pr-4 text-foreground-muted">{option.description}</td>
                <td className="py-3 pr-4 text-foreground-muted">
                  {option.tracked ? 'ja' : 'nein'}
                  {option.insured ? ', versichert' : ''}
                </td>
                <td className="py-3 font-semibold text-foreground">
                  {option.priceCents === 0 ? 'kostenfrei' : formatCents(option.priceCents)}
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

      <h2>Lieferzeiten</h2>
      <p>
        [Platzhalter: Verbindliche Lieferzeiten je Produktklasse eintragen — Schlüssel nach Code,
        gleichschließende Zylinder, Sonderanfertigungen. Die Angabe muss der tatsächlichen
        Bearbeitungs- und Versandzeit entsprechen.]
      </p>

      <h2>Zahlungsarten</h2>
      {payment?.configured ? (
        <p>[Platzhalter: Die angebundenen Zahlungsarten hier einzeln auflisten.]</p>
      ) : (
        <p>
          Die Online-Zahlung ist vorbereitet, aber noch nicht freigeschaltet. Bestellungen und
          Terminanfragen werden bereits vollständig aufgenommen; wir melden uns anschließend mit
          den Zahlungsinformationen. Sobald die Online-Zahlung freigeschaltet ist, stehen die
          Zahlungsarten an dieser Stelle.
        </p>
      )}

      <h2>Anzahlung bei Terminaufträgen</h2>
      <p>
        Für Autoschlüssel-Termine erheben wir eine Anzahlung. Sie beträgt standardmäßig{' '}
        <strong>{formatCents(settings.booking.depositCents)}</strong> und liegt je nach Fahrzeug
        und Leistung zwischen {formatCents(settings.booking.depositMinCents)} und{' '}
        {formatCents(settings.booking.depositMaxCents)}. Die Anzahlung wird{' '}
        <strong>vollständig auf den Gesamtpreis angerechnet</strong>.
      </p>
      <p>
        Grund für die Anzahlung: Für viele Fahrzeuge muss fahrzeugspezifisches Material im Voraus
        beschafft werden. Die Anzahlung sichert diese Beschaffung und den reservierten Termin ab.
      </p>
      <p>
        Der früheste Termin liegt in der Regel etwa {settings.booking.leadTimeDays} Tage in der
        Zukunft, damit Beschaffung und Vorbereitung sicher abgeschlossen sind.
      </p>
      <p>
        [Platzhalter: Regelungen zur Erstattung der Anzahlung bei Absage, Verschiebung oder
        Nichterscheinen juristisch festlegen und hier ergänzen.]
      </p>

      <h2>Preise</h2>
      <p>
        Alle angegebenen Preise verstehen sich inklusive der gesetzlichen Umsatzsteuer. Versandkosten
        werden im Warenkorb gesondert ausgewiesen.
      </p>
      <p>
        [Platzhalter: Angaben zur Umsatzsteuer prüfen — insbesondere, ob eine Kleinunternehmerregelung
        anzuwenden ist. In diesem Fall ist der Hinweis auf die Umsatzsteuer anzupassen und der
        Ausweis im Warenkorb zu entfernen.]
      </p>
    </>
  );
}
