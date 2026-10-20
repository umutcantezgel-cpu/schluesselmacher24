import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SummaryList, ZAHLENTEIL_DICHT, betragAmEnde, monoTeile } from './summary-list';

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

// Vorher-Nachher-Abgleich (E6-BEFUND2-H11, Muster D-045): gerendert mit dem Stand vor dem Paket.
const GOLDEN_KARTE = "<div class=\"space-y-5\"><div class=\"overflow-hidden rounded-lg border border-border bg-surface\"><p class=\"border-b border-border bg-surface-muted px-4 py-2.5 text-caption font-mono uppercase tracking-label text-foreground-muted\">Artikel</p><dl class=\"divide-y divide-border\"><div class=\"grid gap-1 px-4 py-3 sm:grid-cols-12 sm:gap-4\"><dt class=\"text-small font-semibold text-foreground-muted sm:col-span-4\">Schlüssel nach Code</dt><dd class=\"text-body text-foreground sm:col-span-8\">Code 1234 · 2 Stück · 16,00 €</dd></div><div class=\"grid gap-1 px-4 py-3 sm:grid-cols-12 sm:gap-4\"><dt class=\"text-small font-semibold text-foreground-muted sm:col-span-4\">Zylinder</dt><dd class=\"text-body text-foreground sm:col-span-8\">Doppelzylinder 30 mm / 35 mm</dd></div><div class=\"grid gap-1 px-4 py-3 sm:grid-cols-12 sm:gap-4\"><dt class=\"text-small font-semibold text-foreground-muted sm:col-span-4\">Büroschrank — Serie MS-01</dt><dd class=\"text-body text-foreground sm:col-span-8\">Code 0812 · 2 Stück · 16,00 €</dd></div><div class=\"grid gap-1 px-4 py-3 sm:grid-cols-12 sm:gap-4\"><dt class=\"text-small font-semibold text-foreground-muted sm:col-span-4\">Gesamtbetrag</dt><dd class=\"text-body text-foreground sm:col-span-8\">1.234,50 €</dd></div></dl></div><div class=\"overflow-hidden rounded-lg border border-border bg-surface\"><p class=\"border-b border-border bg-surface-muted px-4 py-2.5 text-caption font-mono uppercase tracking-label text-foreground-muted\">Summe</p><dl class=\"divide-y divide-border\"><div class=\"grid gap-1 px-4 py-3 sm:grid-cols-12 sm:gap-4\"><dt class=\"text-small font-semibold text-foreground-muted sm:col-span-4\">Versand</dt><dd class=\"text-body text-foreground sm:col-span-8\">DHL · 4,95 €</dd></div><div class=\"grid gap-1 px-4 py-3 sm:grid-cols-12 sm:gap-4\"><dt class=\"text-small font-semibold text-foreground-muted sm:col-span-4\">Gesamtbetrag</dt><dd class=\"text-body text-foreground sm:col-span-8\">1.234,50 €</dd></div><div class=\"grid gap-1 px-4 py-3 sm:grid-cols-12 sm:gap-4\"><dt class=\"text-small font-semibold text-foreground-muted sm:col-span-4\">darin enthaltene Umsatzsteuer</dt><dd class=\"text-body text-foreground sm:col-span-8\">197,18 € (19 %)</dd></div></dl></div><div class=\"overflow-hidden rounded-lg border border-border bg-surface\"><p class=\"border-b border-border bg-surface-muted px-4 py-2.5 text-caption font-mono uppercase tracking-label text-foreground-muted\">Kontakt und Lieferanschrift</p><dl class=\"divide-y divide-border\"><div class=\"grid gap-1 px-4 py-3 sm:grid-cols-12 sm:gap-4\"><dt class=\"text-small font-semibold text-foreground-muted sm:col-span-4\">E-Mail</dt><dd class=\"text-body text-foreground sm:col-span-8\">Noch nicht ausgefüllt</dd></div><div class=\"grid gap-1 px-4 py-3 sm:grid-cols-12 sm:gap-4\"><dt class=\"text-small font-semibold text-foreground-muted sm:col-span-4\">Land</dt><dd class=\"text-body text-foreground sm:col-span-8\">Deutschland</dd></div><div class=\"grid gap-1 px-4 py-3 sm:grid-cols-12 sm:gap-4\"><dt class=\"text-small font-semibold text-foreground-muted sm:col-span-4\">Hinweis zur Lieferung</dt><dd class=\"text-body text-foreground sm:col-span-8\">Bitte klingeln, Hof</dd></div></dl></div></div>";

const GOLDEN_SCHRIFTFELD = "<div class=\"space-y-6\"><div><p class=\"font-mono text-caption uppercase tracking-label text-foreground-muted\">Artikel</p><dl class=\"mt-2 border-t border-border\"><div class=\"grid gap-1 border-b border-border py-3 sm:grid-cols-12 sm:gap-4\"><dt class=\"text-small font-semibold text-foreground-muted sm:col-span-5\">Schlüssel nach Code</dt><dd class=\"sm:col-span-7 sm:text-right text-body text-foreground\"><span class=\"block text-small text-foreground-muted\">Code 1234 · <span class=\"whitespace-nowrap font-mono tabular-nums\">2 Stück</span></span><span class=\"block whitespace-nowrap font-mono tabular-nums\">16,00 €</span></dd></div><div class=\"grid gap-1 border-b border-border py-3 sm:grid-cols-12 sm:gap-4\"><dt class=\"text-small font-semibold text-foreground-muted sm:col-span-5\">Zylinder</dt><dd class=\"sm:col-span-7 sm:text-right text-body text-foreground\">Doppelzylinder <span class=\"whitespace-nowrap font-mono tabular-nums\">30 mm</span> / <span class=\"whitespace-nowrap font-mono tabular-nums\">35 mm</span></dd></div><div class=\"grid gap-1 border-b border-border py-3 sm:grid-cols-12 sm:gap-4\"><dt class=\"text-small font-semibold text-foreground-muted sm:col-span-5\">Büroschrank — Serie <span class=\"whitespace-nowrap font-mono tabular-nums\">MS-01</span></dt><dd class=\"sm:col-span-7 sm:text-right text-body text-foreground\"><span class=\"block text-small text-foreground-muted\">Code 0812 · <span class=\"whitespace-nowrap font-mono tabular-nums\">2 Stück</span></span><span class=\"block whitespace-nowrap font-mono tabular-nums\">16,00 €</span></dd></div><div class=\"grid gap-1 border-b border-border py-3 sm:grid-cols-12 sm:gap-4\"><dt class=\"text-small font-semibold text-foreground-muted sm:col-span-5\">Gesamtbetrag</dt><dd class=\"sm:col-span-7 sm:text-right font-mono text-title font-semibold tabular-nums text-foreground\">1.234,50 €</dd></div></dl></div><div><p class=\"font-mono text-caption uppercase tracking-label text-foreground-muted\">Summe</p><dl class=\"mt-2 border-t border-border\"><div class=\"grid gap-1 border-b border-border py-3 sm:grid-cols-12 sm:gap-4\"><dt class=\"text-small font-semibold text-foreground-muted sm:col-span-5\">Versand</dt><dd class=\"sm:col-span-7 sm:text-right text-body text-foreground\"><span class=\"block text-small text-foreground-muted\">DHL</span><span class=\"block whitespace-nowrap font-mono tabular-nums\">4,95 €</span></dd></div><div class=\"grid gap-1 border-b border-border py-3 sm:grid-cols-12 sm:gap-4\"><dt class=\"text-small font-semibold text-foreground-muted sm:col-span-5\">Gesamtbetrag</dt><dd class=\"sm:col-span-7 sm:text-right font-mono text-title font-semibold tabular-nums text-foreground\">1.234,50 €</dd></div><div class=\"grid gap-1 border-b border-border py-3 sm:grid-cols-12 sm:gap-4\"><dt class=\"text-small font-semibold text-foreground-muted sm:col-span-5\">darin enthaltene Umsatzsteuer</dt><dd class=\"sm:col-span-7 sm:text-right text-body text-foreground\"><span class=\"whitespace-nowrap font-mono tabular-nums\">197,18 €</span> (19 %)</dd></div></dl></div><div><p class=\"font-mono text-caption uppercase tracking-label text-foreground-muted\">Kontakt und Lieferanschrift</p><dl class=\"mt-2 border-t border-border\"><div class=\"grid gap-1 border-b border-border py-3 sm:grid-cols-12 sm:gap-4\"><dt class=\"text-small font-semibold text-foreground-muted sm:col-span-5\">E-Mail</dt><dd class=\"sm:col-span-7 sm:text-right text-small text-foreground-muted\">Noch nicht ausgefüllt</dd></div><div class=\"grid gap-1 border-b border-border py-3 sm:grid-cols-12 sm:gap-4\"><dt class=\"text-small font-semibold text-foreground-muted sm:col-span-5\">Land</dt><dd class=\"sm:col-span-7 sm:text-right text-body text-foreground\">Deutschland</dd></div><div class=\"grid gap-1 border-b border-border py-3 sm:grid-cols-12 sm:gap-4\"><dt class=\"text-small font-semibold text-foreground-muted sm:col-span-5\">Hinweis zur Lieferung</dt><dd class=\"sm:col-span-7 sm:text-right text-body text-foreground\">Bitte klingeln, Hof</dd></div></dl></div></div>";

const abschnitteGolden = [
  {
    title: 'Artikel',
    rows: [
      { label: 'Schlüssel nach Code', value: 'Code 1234 · 2 Stück · 16,00 €' },
      { label: 'Zylinder', value: 'Doppelzylinder 30 mm / 35 mm' },
      { label: 'Büroschrank — Serie MS-01', value: 'Code 0812 · 2 Stück · 16,00 €' },
      { label: 'Gesamtbetrag', value: '1.234,50 €' },
    ],
  },
  {
    title: 'Summe',
    rows: [
      { label: 'Versand', value: 'DHL · 4,95 €' },
      { label: 'Gesamtbetrag', value: '1.234,50 €' },
      { label: 'darin enthaltene Umsatzsteuer', value: '197,18 € (19 %)' },
    ],
  },
  {
    title: 'Kontakt und Lieferanschrift',
    rows: [
      { label: 'E-Mail', value: 'Noch nicht ausgefüllt' },
      { label: 'Land', value: 'Deutschland' },
      { label: 'Hinweis zur Lieferung', value: 'Bitte klingeln, Hof' },
    ],
  },
];

describe('SummaryList · dicht', () => {
  it('setzt dichte Zeilen als Flex mit Beschriftung links und ohne sm:col-span-5', () => {
    const html = renderToStaticMarkup(
      <SummaryList sections={abschnitte} variante="schriftfeld" dicht hervorheben="Gesamtbetrag" />,
    );
    expect(html).toContain('flex flex-wrap items-baseline justify-between');
    expect(html).not.toContain('sm:col-span-5');
    expect(html).not.toContain('sm:grid-cols-12');
  });

  it('setzt gefüllte Werte in Text und offene gedämpft, beide gleich groß', () => {
    const html = renderToStaticMarkup(
      <SummaryList
        sections={[
          {
            title: 'Kontakt',
            rows: [
              { label: 'Land', value: 'Deutschland' },
              { label: 'E-Mail', value: 'Noch nicht ausgefüllt' },
            ],
          },
        ]}
        variante="schriftfeld"
        dicht
        leer="Noch nicht ausgefüllt"
      />,
    );
    expect(html).toMatch(/text-small text-foreground">Deutschland</);
    expect(html).toMatch(/text-small text-foreground-muted">Noch nicht ausgefüllt</);
  });

  it('setzt „19 %“ und „Code 0812 · 2 Stück“ dicht in Mono, jeweils ohne Umbruch', () => {
    const html = renderToStaticMarkup(
      <SummaryList
        sections={[
          {
            title: 'Summe',
            rows: [
              { label: 'darin enthaltene Umsatzsteuer', value: '3,34 € (19 %)' },
              { label: 'Schlüssel nach Code', value: 'Code 0812 · 2 Stück · 16,00 €' },
            ],
          },
        ]}
        variante="schriftfeld"
        dicht
      />,
    );
    expect(html).toContain('<span class="whitespace-nowrap font-mono tabular-nums">19 %</span>');
    expect(html).toContain('<span class="whitespace-nowrap font-mono tabular-nums">Code 0812 · 2 Stück</span>');
  });
});

describe('monoTeile mit Muster', () => {
  it('lässt ohne Muster alles wie bisher und markiert mit ZAHLENTEIL_DICHT den Code-Teil als eine Spanne', () => {
    expect(monoTeile('19 %')).toEqual([{ text: '19 %', mono: false }]);
    expect(monoTeile('Code 0812 · 2 Stück')).toEqual([
      { text: 'Code 0812 · ', mono: false },
      { text: '2 Stück', mono: true },
    ]);
    expect(monoTeile('Code 0812 · 2 Stück', ZAHLENTEIL_DICHT)).toEqual([{ text: 'Code 0812 · 2 Stück', mono: true }]);
  });
});

describe('SummaryList · Vorher-Nachher ohne dicht', () => {
  it('ist byte-gleich zum Stand vor E6-BEFUND2-H11 (Karte und Schriftfeld mit hervorheben und leer)', () => {
    expect(renderToStaticMarkup(<SummaryList sections={abschnitteGolden} />)).toBe(GOLDEN_KARTE);
    expect(
      renderToStaticMarkup(
        <SummaryList
          sections={abschnitteGolden}
          variante="schriftfeld"
          hervorheben="Gesamtbetrag"
          leer="Noch nicht ausgefüllt"
        />,
      ),
    ).toBe(GOLDEN_SCHRIFTFELD);
  });
});
