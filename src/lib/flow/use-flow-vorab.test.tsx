import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { FlowShell } from '@/components/flow/flow-shell';
import { SchrittHistorie } from './schritt-historie';
import { useFlow, type FlowStep } from './use-flow';

/* FA-QA-04B: Ohne Fenster (Vorabrendern) darf die Schritt-Historie nichts brechen. */

const SCHRITTE: FlowStep[] = [
  { id: 'a', title: 'Erster Schritt', short: 'A' },
  { id: 'b', title: 'Zweiter Schritt', short: 'B' },
];

describe('useFlow ohne Fenster (Vorabrendern, FA-QA-04B)', () => {
  it('rendert auf dem Server ohne Zugriff auf die Historie, mit Rückfrage und Schritt-Historie', () => {
    function Formular() {
      const flow = useFlow<{ name: string }>({ id: 'test-vorab', steps: SCHRITTE, initial: { name: '' } });
      return (
        <FlowShell flow={flow} title="Test" ungesichert>
          <p>{flow.step.title}</p>
        </FlowShell>
      );
    }
    expect(typeof window).toBe('undefined');
    const html = renderToStaticMarkup(<Formular />);
    expect(html).toContain('Erster Schritt');
    expect(html).toContain('Schritt 1 von 2');
  });

  it('jeder Ablauf trägt eine Schritt-Historie mit seiner Kennung', () => {
    let historie: SchrittHistorie | undefined;
    function Pruefen() {
      historie = useFlow<{ name: string }>({ id: 'test-kennung', steps: SCHRITTE, initial: { name: '' } }).historie;
      return null;
    }
    renderToStaticMarkup(<Pruefen />);
    expect(historie).toBeInstanceOf(SchrittHistorie);
    expect(historie?.id).toBe('test-kennung');
  });
});
