import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { FlowState, FlowStep } from '@/lib/flow/use-flow';
import { FlowShell, type FlowShellProps } from './flow-shell';

/* Schrittlinks auf allen Breiten so groß wie die Tippfläche des Systems (FA-26-01, FA-QA-04A). */

function ablauf(steps: FlowStep[], stepIndex: number): FlowState<object> {
  const nichts = () => {};
  return {
    data: {},
    update: nichts,
    set: nichts,
    steps,
    step: steps[stepIndex],
    stepIndex,
    stepCount: steps.length,
    progress: (stepIndex + 1) / steps.length,
    next: nichts,
    back: nichts,
    goTo: nichts,
    updateAndGoTo: nichts,
    isFirst: stepIndex === 0,
    isLast: stepIndex === steps.length - 1,
    canContinue: true,
    reset: nichts,
    restored: false,
    dismissRestored: nichts,
    saved: true,
  };
}

function rahmen(steps: FlowStep[], stepIndex: number, props: Partial<FlowShellProps<object>> = {}): string {
  return renderToStaticMarkup(
    <FlowShell flow={ablauf(steps, stepIndex)} title="Anfrage" {...props}>
      <p>Inhalt</p>
    </FlowShell>,
  );
}

/** Klassen aller Knöpfe der Schrittliste (jeder steht in einer `<li>`). */
function schrittKnoepfe(html: string): string[] {
  return [...html.matchAll(/<li><button[^>]*class="([^"]*)"/g)].map((m) => m[1]);
}

const EINFACH: FlowStep[] = [
  { id: 'a', title: 'Erster Schritt', short: 'Marke' },
  { id: 'b', title: 'Zweiter Schritt', short: 'Modell' },
  { id: 'c', title: 'Dritter Schritt', short: 'Termin' },
];

const MIT_ETAPPEN: FlowStep[] = [
  { id: 'a', title: 'A', short: 'Marke', etappe: 'Fahrzeug' },
  { id: 'b', title: 'B', short: 'Modell', etappe: 'Fahrzeug' },
  { id: 'c', title: 'C', short: 'Fotos', etappe: 'Fotos' },
];

describe('FlowShell: Schrittlinks mit Tippfläche 44 px (FA-QA-04A)', () => {
  // Name, Markup, Zahl der Schrittknöpfe
  const faelle: Array<[string, string, number]> = [
    ['einfache Liste', rahmen(EINFACH, 1), 3],
    ['Etappen', rahmen(MIT_ETAPPEN, 2), 2],
    ['Etappen mit Teilschritten in der Seite', rahmen(MIT_ETAPPEN, 1, { raster: 'seite' }), 4],
  ];

  for (const [name, html, anzahl] of faelle) {
    it(`${name}: jeder Schrittknopf hat min-h-touch und wird ab Tablet nicht kleiner`, () => {
      const knoepfe = schrittKnoepfe(html);
      expect(knoepfe).toHaveLength(anzahl);
      for (const klasse of knoepfe) {
        expect(klasse.split(' ')).toContain('min-h-touch');
        expect(klasse).not.toMatch(/(^|\s)(md:|lg:|sm:)?min-h-(8|6|7|touch-sm)(\s|$)/);
      }
    });
  }

  it('die Teilschritte der aktuellen Etappe sind ebenfalls 44 px hoch', () => {
    const html = rahmen(MIT_ETAPPEN, 1, { raster: 'seite' });
    // Etappen „Fahrzeug“, „Fotos“ und die zwei Teilschritte „Marke“, „Modell“.
    expect(schrittKnoepfe(html)).toHaveLength(4);
  });
});
