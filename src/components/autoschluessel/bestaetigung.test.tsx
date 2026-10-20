import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { BestaetigungProps } from './bestaetigung';
import { Bestaetigung } from './bestaetigung';

const beispiel: BestaetigungProps = {
  reference: 'SM24-2026-000123',
  appointment: { date: '2026-10-02', time: '09:00', durationMinutes: 60, location: 'werkstatt' },
  quote: {
    mode: 'fest',
    priceCents: 24900,
    depositCents: 5000,
    remainderCents: 19900,
    slotMinutes: 60,
    leadTimeDays: 7,
    requiresVehicleOnSite: false,
  },
  summary: [{ title: 'Fahrzeug', rows: [{ label: 'Marke', value: 'Volkswagen' }] }],
  notices: ['Bitte bringen Sie alle vorhandenen Schlüssel mit.'],
};

const html = renderToStaticMarkup(<Bestaetigung {...beispiel} />);

describe('Bestaetigung', () => {
  it('rendert ohne Fehler und zeigt die Vorgangsnummer als bemaßtes Feld in Mono', () => {
    expect(html).toContain('SM24-2026-000123');
    expect(html).toMatch(/<p class="mt-1 break-words font-mono text-headline tabular-nums[^"]*">SM24-2026-000123<\/p>/);
    expect(html).toContain('Ihre Vorgangsnummer');
  });

  it('zeigt den Bestätigungshaken CheckDraw mit Titel „Vorgang angelegt“ in 56 px', () => {
    expect(html).toMatch(/^<div class="space-y-6"><div class="rounded-lg border border-border bg-surface p-6"><svg[^>]*\brole="img"/);
    expect(html).toContain('<title>Vorgang angelegt</title>');
    expect(html).toContain('aria-label="Vorgang angelegt"');
    expect(html).toMatch(/<svg[^>]*width="56"[^>]*height="56"/);
    expect(html).toContain('>Vorgang angelegt</p>');
  });

  it('nennen Termin und Anzahlung mit ihren Werten', () => {
    expect(html).toContain('Ihr Termin');
    expect(html).toContain('2. Oktober 2026, 09:00 Uhr');
    expect(html).toContain('Anzahlung');
    expect(html).toContain('50,00');
    expect(html).toMatch(/Eingeplant sind <span class="font-mono tabular-nums text-foreground">1 Std\.<\/span>\./);
  });

  it('ergänzt bei Prüfung den Hinweis zur Verbindlichkeit', () => {
    const pruefung = renderToStaticMarkup(
      <Bestaetigung {...beispiel} quote={{ ...beispiel.quote, mode: 'pruefung', priceCents: undefined }} />,
    );
    expect(pruefung).toContain('Verbindlich wird der Termin');
    expect(html).not.toContain('Verbindlich wird der Termin');
  });

  it('zeigt die Hinweise und den Link zur Kontaktseite', () => {
    expect(html).toContain('Bitte bringen Sie alle vorhandenen Schlüssel mit.');
    expect(html).toContain('href="/service-und-termin/kontakt"');
    expect(html).toContain('hover:underline');
  });

  it('nutzt keine lucide-Icons mehr', () => {
    const quelltext = readFileSync(new URL('./bestaetigung.tsx', import.meta.url), 'utf8');
    expect(quelltext).not.toContain('lucide');
    expect(html).not.toMatch(/lucide/i);
  });
});
