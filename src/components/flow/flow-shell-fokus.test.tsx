// @vitest-environment happy-dom
import { act, useEffect } from 'react';
import { createRoot, hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { useFlow, type FlowStep } from '@/lib/flow/use-flow';
import { FlowShell } from './flow-shell';

/*
 * FA-QA-04E: Nach einem Schrittwechsel aus einer Bedienung steht der Fokus auf der Überschrift des neuen
 * Schritts. Kein Fokus beim ersten Render, beim Wiederherstellen eines Zwischenstands und bei einem
 * Sprung ohne Bedienung; bleibt der Schritt stehen, bleibt der Fokus, wo er ist.
 * Die Tests führen das Verhalten in einem DOM aus (happy-dom), sie lesen nicht den Quelltext.
 */

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const SCHRITTE: FlowStep[] = [
  { id: 'a', title: 'Erster Schritt', short: 'A' },
  { id: 'b', title: 'Zweiter Schritt', short: 'B' },
  { id: 'c', title: 'Dritter Schritt', short: 'C' },
];
const KENNUNG = 'test-fokus';
const SPEICHER = `sm24:flow:${KENNUNG}`;

interface Daten {
  name: string;
}

function Formular({ sprungOhneBedienung }: { sprungOhneBedienung?: string }) {
  const flow = useFlow<Daten>({ id: KENNUNG, steps: SCHRITTE, initial: { name: '' } });
  const { goTo, step } = flow;
  // Wie ein Plan aus einem Link beim Laden: Das Formular springt selbst, ohne Bedienung (einmal, solange
  // es noch nicht dort steht).
  useEffect(() => {
    if (sprungOhneBedienung && step.id !== sprungOhneBedienung) goTo(sprungOhneBedienung);
  }, [sprungOhneBedienung, step.id, goTo]);
  return (
    <>
      <FlowShell flow={flow} title="Test">
        <input aria-label="Name" data-test="feld" />
        <button type="button" data-test="bleiben" onClick={() => flow.goTo(flow.step.id)}>
          Prüfen
        </button>
        <button type="button" data-test="ende" onClick={() => flow.goTo('c')}>
          Zum Ende
        </button>
      </FlowShell>
      {/* Löst einen Sprung aus, ohne dass im Ablauf etwas bedient wird (wie ein Effekt oder eine Antwort). */}
      <button type="button" data-test="aussen" onClick={() => flow.goTo('c')}>
        Fremder Sprung
      </button>
    </>
  );
}

let behaelter: HTMLDivElement;
let wurzel: Root | null = null;

beforeEach(() => {
  // Neutrale Historie: Fälle mit popstate hängen nicht vom Stand der vorigen Fälle ab.
  window.history.replaceState(null, '');
  window.localStorage.clear();
  window.localStorage.setItem('sm24-bewegung', 'ruhig');
  behaelter = document.createElement('div');
  document.body.appendChild(behaelter);
});

afterEach(() => {
  act(() => wurzel?.unmount());
  wurzel = null;
  behaelter.remove();
  window.localStorage.clear();
});

function rendern(element: React.ReactElement) {
  act(() => {
    wurzel = createRoot(behaelter);
    wurzel.render(element);
  });
}

function knopf(name: string): HTMLButtonElement {
  const k = [...behaelter.querySelectorAll('button')].find((b) => b.textContent?.trim().startsWith(name));
  if (!k) throw new Error(`Knopf „${name}“ fehlt`);
  return k;
}

function titel(): HTMLElement {
  const t = behaelter.querySelector<HTMLElement>('[data-schritt-titel]');
  if (!t) throw new Error('Schrittüberschrift fehlt');
  return t;
}

function ansage(): HTMLElement {
  const a = behaelter.querySelector<HTMLElement>('[data-schritt-ansage]');
  if (!a) throw new Error('Ansage fehlt');
  return a;
}

function klicken(el: HTMLElement) {
  act(() => {
    el.focus();
    el.click();
  });
}

describe('FlowShell: Fokus nach dem Schrittwechsel (FA-QA-04E)', () => {
  it('setzt beim ersten Render keinen Fokus', () => {
    rendern(<Formular />);
    expect(titel().textContent).toBe('Erster Schritt');
    expect(document.activeElement).toBe(document.body);
  });

  it('„Weiter“ setzt den Fokus auf die Überschrift des neuen Schritts; sie ist nicht in der Tab-Folge', () => {
    rendern(<Formular />);
    klicken(knopf('Weiter'));
    expect(titel().textContent).toBe('Zweiter Schritt');
    expect(document.activeElement).toBe(titel());
    expect(titel().tabIndex).toBe(-1);
    // Rolle und Name für Vorlesegeräte, verknüpft mit der Zeile „Schritt x von y“.
    expect(titel().tagName).toBe('H2');
    const band = document.getElementById(titel().getAttribute('aria-describedby') ?? '');
    expect(band?.textContent).toContain('Schritt 2 von 3');
    expect(band?.getAttribute('aria-live')).toBeNull();
    // Mit Fokus spricht nur die Überschrift; die Ansage für Wechsel ohne Fokus bleibt leer.
    expect(ansage().textContent).toBe('');
  });

  it('„Zurück“ und ein Sprung aus dem Schritt heraus setzen den Fokus ebenso', () => {
    rendern(<Formular />);
    klicken(knopf('Zum Ende'));
    expect(titel().textContent).toBe('Dritter Schritt');
    expect(document.activeElement).toBe(titel());
    klicken(knopf('Zurück'));
    // Zurück geht über die Browser-Historie (FA-QA-04B) oder direkt; in beiden Fällen zählt der Wechsel.
    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }));
    });
    expect(titel().textContent).toBe('Zweiter Schritt');
    expect(document.activeElement).toBe(titel());
  });

  it('ein Schrittknopf in der Leiste setzt den Fokus auf die Überschrift', () => {
    rendern(<Formular />);
    klicken(knopf('Weiter'));
    klicken(knopf('Weiter'));
    expect(titel().textContent).toBe('Dritter Schritt');
    const schrittknopf = [...behaelter.querySelectorAll('ol button')].find((b) => b.textContent?.includes('A'));
    klicken(schrittknopf as HTMLButtonElement);
    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }));
    });
    expect(titel().textContent).toBe('Erster Schritt');
    expect(document.activeElement).toBe(titel());
  });

  it('bleibt der Schritt stehen, bleibt der Fokus, wo er ist', () => {
    rendern(<Formular />);
    const bleiben = behaelter.querySelector<HTMLButtonElement>('[data-test="bleiben"]')!;
    klicken(bleiben);
    expect(titel().textContent).toBe('Erster Schritt');
    expect(document.activeElement).toBe(bleiben);
  });

  it('ein Sprung, den das Formular ohne Bedienung auslöst, nimmt niemandem den Fokus', () => {
    const fremd = document.createElement('input');
    document.body.appendChild(fremd);
    fremd.focus();
    rendern(<Formular sprungOhneBedienung="c" />);
    expect(titel().textContent).toBe('Dritter Schritt');
    expect(document.activeElement).toBe(fremd);
    // Vorlesegeräte erfahren den neuen Schritt trotzdem.
    expect(ansage().textContent).toBe('Schritt 3 von 3: C. Dritter Schritt');
    fremd.remove();
  });

  it('Tippen im Feld gilt nicht als Bedienung: ein späterer Sprung ohne Auslösen zieht den Fokus nicht auf die Überschrift', () => {
    rendern(<Formular />);
    const feld = behaelter.querySelector<HTMLInputElement>('[data-test="feld"]')!;
    act(() => {
      feld.focus();
      feld.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    });
    act(() => {
      behaelter.querySelector<HTMLButtonElement>('[data-test="aussen"]')!.click();
    });
    expect(titel().textContent).toBe('Dritter Schritt');
    // Das Feld gehört zum alten Schritt und ist mit ihm verschwunden; die Überschrift zieht den Fokus nicht an sich.
    expect(document.activeElement).not.toBe(titel());
    expect(ansage().textContent).toBe('Schritt 3 von 3: C. Dritter Schritt');
  });

  it('Enter auf einem Knopf im Ablauf gilt als Bedienung', () => {
    rendern(<Formular />);
    const ende = behaelter.querySelector<HTMLButtonElement>('[data-test="ende"]')!;
    act(() => {
      ende.focus();
      ende.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    });
    // Der Sprung folgt später (etwa nach einem abgewarteten Absenden).
    act(() => {
      behaelter.querySelector<HTMLButtonElement>('[data-test="aussen"]')!.click();
    });
    expect(titel().textContent).toBe('Dritter Schritt');
    expect(document.activeElement).toBe(titel());
  });

  it('beim Wiederherstellen eines Zwischenstands (Hydrieren) springt der Schritt, der Fokus nicht', () => {
    // Der Server kennt keinen Zwischenstand und liefert Schritt 1.
    const html = renderToString(<Formular />);
    expect(html).toContain('Erster Schritt');
    window.localStorage.setItem(SPEICHER, JSON.stringify({ version: 1, data: { name: 'Erika' }, stepId: 'c' }));
    behaelter.innerHTML = html;
    act(() => {
      wurzel = hydrateRoot(behaelter, <Formular />);
    });
    expect(titel().textContent).toBe('Dritter Schritt');
    expect(behaelter.textContent).toContain('Ihr Zwischenstand von zuletzt wurde geladen.');
    expect(document.activeElement).toBe(document.body);
    // Ohne Fokus sagt die Live-Region den Schritt an, auf dem der Kunde nach dem Fortsetzen steht.
    expect(ansage().textContent).toBe('Schritt 3 von 3: C. Dritter Schritt');
  });

  it('beim ersten Render ohne Zwischenstand sagt die Live-Region nichts', () => {
    rendern(<Formular />);
    expect(ansage().getAttribute('aria-live')).toBe('polite');
    expect(ansage().textContent).toBe('');
  });

  it('„Neu beginnen“ nach dem Wiederherstellen setzt den Fokus auf die Überschrift von Schritt 1', () => {
    window.localStorage.setItem(SPEICHER, JSON.stringify({ version: 1, data: { name: 'Erika' }, stepId: 'b' }));
    rendern(<Formular />);
    expect(titel().textContent).toBe('Zweiter Schritt');
    expect(document.activeElement).toBe(document.body);
    klicken(knopf('Neu beginnen'));
    expect(titel().textContent).toBe('Erster Schritt');
    expect(document.activeElement).toBe(titel());
  });
});
