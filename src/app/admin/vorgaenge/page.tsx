import type { Metadata } from 'next';

import { getCollection } from '@/lib/data';
import { formatCents, formatDateShort, formatDateTime } from '@/lib/format';
import { areaByKey } from '@/lib/navigation';
import type { BusinessRecord } from '@/lib/types';
import { VorgangsListe, type VorgangsZeile } from './vorgangs-liste';

export const metadata: Metadata = {
  title: 'Vorgänge',
  robots: { index: false, follow: false },
};

/** Betrag eines Vorgangs als Text — Preise kommen ausschließlich aus den Daten. */
function betragAls(record: BusinessRecord): string {
  const quote = record.quote;

  if (quote) {
    if (quote.mode === 'fest' && typeof quote.priceCents === 'number') {
      return formatCents(quote.priceCents);
    }
    if (
      quote.mode === 'rahmen'
      && typeof quote.priceFromCents === 'number'
      && typeof quote.priceToCents === 'number'
    ) {
      return `${formatCents(quote.priceFromCents)} bis ${formatCents(quote.priceToCents)}`;
    }
    if (quote.mode === 'pruefung') {
      return 'Preis nach Prüfung';
    }
  }

  if (record.payment) return formatCents(record.payment.amountCents);
  return 'Ohne Betrag';
}

function terminAls(record: BusinessRecord): string {
  if (!record.appointment) return 'Ohne Termin';
  return `${formatDateShort(record.appointment.date)}, ${record.appointment.time} Uhr`;
}

export default async function VorgaengeSeite() {
  const records = await getCollection('records');

  const zeilen: VorgangsZeile[] = records.map((record) => ({
    id: record.id,
    reference: record.reference,
    kind: record.kind,
    area: record.area,
    bereich: areaByKey(record.area)?.label ?? record.area,
    status: record.status,
    createdAt: record.createdAt,
    datum: formatDateTime(record.createdAt),
    name: [record.contact.firstName, record.contact.lastName].filter(Boolean).join(' ').trim(),
    email: record.contact.email,
    betrag: betragAls(record),
    termin: terminAls(record),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Vorgänge</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-foreground-muted">
          Alle Bestellungen, Anfragen, Termine und Projekte an einer Stelle. Über die
          Vorgangsnummer gelangen Sie in die vollständige Einzelansicht mit Zusammenfassung,
          Unterlagen und Bearbeitungsschritten.
        </p>
      </div>

      {zeilen.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-bold text-foreground">
            Es liegen noch keine Vorgänge vor
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-foreground-muted">
            Vorgänge entstehen ausschließlich über die Website: durch eine Bestellung im Shop,
            eine geführte Anfrage, eine Terminbuchung mit Anzahlung oder ein erfasstes Projekt
            aus einem Konfigurator. Sobald der erste Vorgang eingeht, erscheint er hier
            zusammen mit Filtern und Suche.
          </p>
        </div>
      ) : (
        <VorgangsListe zeilen={zeilen} />
      )}
    </div>
  );
}
