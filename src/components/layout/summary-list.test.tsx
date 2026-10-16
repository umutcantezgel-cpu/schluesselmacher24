import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SummaryList, monoTeile } from './summary-list';

const abschnitte = [
  {
    title: 'Artikel',
    rows: [
      { label: 'Schlüssel nach Code', value: 'Code 1234 · 2 Stück · 16,00 €' },
      { label: 'Zylinder', value: 'Doppelzylinder 30 mm / 35 mm' },
      { label: 'Gesamtbetrag', value: '1.234,50 €' },
    ],
  },
];

describe('monoTeile', () => {
  it('markiert Beträge, Stückzahlen und Maße, nicht den Text daneben', () => {
    expect(monoTeile('Code 1234 · 2 Stück · 16,00 €')).toEqual([
      { text: 'Code 1234 · ', mono: false },
      { text: '2 Stück', mono: true },
      { text: ' · ', mono: false },
      { text: '16,00 €', mono: true },
    ]);
    expect(monoTeile('1.234,50 €')).toEqual([{ text: '1.234,50 €', mono: true }]);
    expect(monoTeile('Versand mit DHL')).toEqual([{ text: 'Versand mit DHL', mono: false }]);
    expect(monoTeile('Büroschrank — Serie MS-01')).toEqual([
      { text: 'Büroschrank — Serie ', mono: false },
      { text: 'MS-01', mono: true },
    ]);
  });
});

describe('SummaryList', () => {
  it('zeigt als Karte die Werte unverändert (Bestand)', () => {
    const html = renderToStaticMarkup(<SummaryList sections={abschnitte} />);
    expect(html).toContain('rounded-lg border');
    expect(html).toContain('Code 1234 · 2 Stück · 16,00 €');
    expect(html).not.toContain('font-mono tabular-nums');
  });

  it('setzt im Schriftfeld Zahlen in Mono und hebt die gewählte Zeile hervor', () => {
    const html = renderToStaticMarkup(
      <SummaryList sections={abschnitte} variante="schriftfeld" hervorheben="Gesamtbetrag" />,
    );
    // Alt: class="font-mono tabular-nums". Neu: zusätzlich whitespace-nowrap (Kennungen brechen nicht).
    expect(html).toContain('<span class="whitespace-nowrap font-mono tabular-nums">2 Stück</span>');
    expect(html).toContain('<span class="whitespace-nowrap font-mono tabular-nums">30 mm</span>');
    expect(html).toContain('sm:text-right');
    expect(html).toMatch(/font-mono text-title font-semibold tabular-nums text-foreground">1\.234,50 €</);
    expect(html).not.toContain('rounded-lg border');
  });

  it('setzt leere Angaben klein und gedämpft', () => {
    const html = renderToStaticMarkup(
      <SummaryList
        sections={[{ title: 'Kontakt', rows: [{ label: 'E-Mail', value: 'Noch nicht ausgefüllt' }] }]}
        variante="schriftfeld"
        leer="Noch nicht ausgefüllt"
      />,
    );
    expect(html).toMatch(/text-small text-foreground-muted">Noch nicht ausgefüllt</);
  });
});
