import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { OptionCard } from './option-card';

const keinHandler = () => {};

function karte(props: Partial<Parameters<typeof OptionCard>[0]> = {}): string {
  return renderToStaticMarkup(
    <OptionCard name="art" value="a" checked={false} onSelect={keinHandler} title="Titel" {...props} />,
  );
}

describe('OptionCard', () => {
  it('ist ohne Angabe eine einzeln gerahmte Karte mit Fokusring außen', () => {
    const html = karte();
    expect(html).toMatch(/^<div class="relative rounded-lg border /);
    expect(html).toContain('fokus-innen:ring-offset-2');
    expect(html).toContain('flex min-h-touch cursor-pointer items-start gap-3 p-4');
  });

  it('zeigt als Listenzeile Wahl und Fokus innen, ohne eigenen Rahmen', () => {
    const gewaehlt = karte({ zeile: true, checked: true });
    expect(gewaehlt).not.toContain('rounded-lg');
    expect(gewaehlt).toContain('ring-inset ring-primary');
    expect(gewaehlt).toContain('fokus-innen:ring-inset');
    expect(gewaehlt).toContain('px-4 py-3');
    expect(karte({ zeile: true })).toContain('hover:bg-surface-muted');
  });

  it('setzt die Zeichnung rechts oder als eigene Reihe über den Titel', () => {
    const rechts = karte({ bild: <svg data-test="bild" /> });
    expect(rechts).toContain('w-24 shrink-0 self-center');
    expect(rechts).not.toContain('order-first');

    const oben = karte({ bild: <svg data-test="bild" />, bildLage: 'oben' });
    expect(oben).toContain('order-first block basis-full pl-8');
    expect(oben).toContain('flex-wrap');
    expect(oben).not.toContain('self-center');
    expect(oben.match(/data-test="bild"/g)).toHaveLength(1);
  });

  it('hält den Zusatz als rechte Spalte ohne Umbruch zusammen', () => {
    const spalte = karte({ meta: '0,00 €', metaSpalte: true });
    expect(spalte).toContain('flex items-baseline justify-between');
    expect(spalte).toContain('shrink-0 whitespace-nowrap');
    expect(karte({ meta: '0,00 €' })).toContain('flex flex-wrap items-center gap-x-2 gap-y-1');
  });
});
