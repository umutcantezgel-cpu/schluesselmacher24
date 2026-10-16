import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SummaryList, betragAmEnde, monoTeile } from './summary-list';

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

describe('betragAmEnde', () => {
  it('trennt die Angaben vom Betrag am Ende', () => {
    expect(betragAmEnde('Code 0812 · 2 Stück · 16,00 €')).toEqual({ angaben: 'Code 0812 · 2 Stück', betrag: '16,00 €' });
    expect(betragAmEnde('Versand verfolgbar · 4,95\u00a0€')).toEqual({ angaben: 'Versand verfolgbar', betrag: '4,95\u00a0€' });
    expect(betragAmEnde('Mehrere Posten · 1.234,50 €')).toEqual({ angaben: 'Mehrere Posten', betrag: '1.234,50 €' });
  });

  it('lässt Werte ohne Betrag am Ende oder ohne Angaben davor stehen', () => {
    expect(betragAmEnde('16,00 €')).toBeNull();
    expect(betragAmEnde('Doppelzylinder 30 mm / 35 mm')).toBeNull();
    expect(betragAmEnde('16,00 € · Code 0812')).toBeNull();
    expect(betragAmEnde('Objekt · Privates Wohnobjekt')).toBeNull();
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

  it('setzt im Schriftfeld Angaben und Betrag in zwei Zeilen und Kennungen der Beschriftung ohne Umbruch', () => {
    const html = renderToStaticMarkup(
      <SummaryList
        sections={[{ title: 'Artikel', rows: [{ label: 'Büroschrank und Rollcontainer — Serie MS-01', value: 'Code 0812 · 2 Stück · 16,00 €' }] }]}
        variante="schriftfeld"
      />,
    );
    expect(html).toContain('<span class="whitespace-nowrap font-mono tabular-nums">MS-01</span>');
    expect(html).toMatch(/<span class="block text-small text-foreground-muted">Code 0812 · <span class="whitespace-nowrap font-mono tabular-nums">2 Stück<\/span><\/span>/);
    expect(html).toContain('<span class="block whitespace-nowrap font-mono tabular-nums">16,00 €</span>');
  });
});
