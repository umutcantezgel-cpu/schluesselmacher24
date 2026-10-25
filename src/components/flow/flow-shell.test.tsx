import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { FlowState, FlowStep } from '@/lib/flow/use-flow';
import { FlowShell, type FlowShellProps } from './flow-shell';

const SCHRITTE: FlowStep[] = [
  { id: 'a', title: 'Erster Schritt', short: 'Marke' },
  { id: 'b', title: 'Zweiter Schritt', short: 'Modell' },
  { id: 'c', title: 'Dritter Schritt', short: 'Termin' },
];

function ablauf(stepIndex = 1): FlowState<object> {
  const nichts = () => {};
  return {
    data: {},
    update: nichts,
    set: nichts,
    steps: SCHRITTE,
    step: SCHRITTE[stepIndex],
    stepIndex,
    stepCount: SCHRITTE.length,
    progress: (stepIndex + 1) / SCHRITTE.length,
    next: nichts,
    back: nichts,
    goTo: nichts,
    isFirst: stepIndex === 0,
    isLast: stepIndex === SCHRITTE.length - 1,
    canContinue: true,
    reset: nichts,
    restored: false,
    dismissRestored: nichts,
    saved: true,
  };
}

function rahmen(props: Partial<FlowShellProps<object>> = {}, stepIndex = 1): string {
  return renderToStaticMarkup(
    <FlowShell flow={ablauf(stepIndex)} title="Anfrage" {...props}>
      <p data-test="inhalt">Inhalt</p>
    </FlowShell>,
  );
}

describe('FlowShell', () => {
  it('nennt im Band Schritt und Namen auf allen Breiten; der Titel benennt nur den Fortschritt', () => {
    const html = rahmen();
    expect(html).toContain('Schritt 2 von 3<span> · Modell</span>');
    expect(html).not.toContain('class=""');
    expect(html).not.toContain('md:hidden"> · ');
    expect(html).toContain('aria-label="Fortschritt Anfrage: 67 Prozent"');
    expect(html).not.toMatch(/>Anfrage</);
  });

  it('setzt im Standard die Schrittliste unter das Band und Weiter rechtsbündig ab Tablet', () => {
    const html = rahmen();
    expect(html).toContain('mt-3 hidden flex-wrap gap-x-4 gap-y-1 md:flex');
    expect(html).not.toContain('lg:col-span-8');
    expect(html).toContain('md:ml-auto md:w-auto');
    expect(html).toContain('w-full');
  });

  it('teilt mit raster="seite" ab 1024 px in Schritt und klebende Seite mit Liste und Zusatz', () => {
    const html = rahmen({ raster: 'seite', seite: <dl data-test="seite" /> });
    expect(html).toContain('lg:grid lg:grid-cols-12');
    expect(html).toContain('lg:col-span-8');
    expect(html).toContain('lg:sticky lg:top-36 lg:col-span-4');
    expect(html).toContain('flex flex-col gap-1');
    expect(html).not.toContain('mt-3 hidden flex-wrap');
    expect(html.indexOf('data-test="seite"')).toBeGreaterThan(html.indexOf('aria-current="step"'));
    expect(html.indexOf('data-test="inhalt"')).toBeLessThan(html.indexOf('data-test="seite"'));
  });

  it('zeigt die laufende Summe mobil in der Leiste und ab Tablet im Band; Weiter dann nicht in voller Breite', () => {
    const html = rahmen({ summe: { label: 'Laufende Summe', wert: '39,00 €' } });
    expect(html.match(/39,00 €/g)).toHaveLength(2);
    expect(html).toContain('hidden shrink-0 items-baseline gap-2 md:flex');
    expect(html).toContain('mr-auto flex min-w-0 flex-col md:hidden');
    expect(html).not.toMatch(/<button[^>]*class="[^"]*\bw-full\b/);
    expect(rahmen()).not.toContain('39,00 €');
  });

  it('kennzeichnet die Schrittüberschrift als Ziel des Scrollens nach „Weiter“ (I-08)', () => {
    const html = rahmen();
    expect(html.match(/data-schritt-titel/g)).toHaveLength(1);
    expect(html).toMatch(/<h2 data-schritt-titel="true"[^>]*>Zweiter Schritt<\/h2>/);
  });
});
