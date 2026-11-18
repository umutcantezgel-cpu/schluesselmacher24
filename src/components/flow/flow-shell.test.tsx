import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { FlowState, FlowStep } from '@/lib/flow/use-flow';
import { SchrittHistorie } from '@/lib/flow/schritt-historie';
import { FlowShell, GESPERRT_STANDARD, fortschrittText, verlassenGrundAus, type FlowShellProps } from './flow-shell';

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
    updateAndGoTo: nichts,
    isFirst: stepIndex === 0,
    isLast: stepIndex === SCHRITTE.length - 1,
    canContinue: true,
    reset: nichts,
    restored: false,
    dismissRestored: nichts,
    saved: true,
  };
}

function rahmen(props: Partial<FlowShellProps<object>> = {}, stepIndex = 1, aenderung: Partial<FlowState<object>> = {}): string {
  return renderToStaticMarkup(
    <FlowShell flow={{ ...ablauf(stepIndex), ...aenderung }} title="Anfrage" {...props}>
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

  /* FA-QA-02: Bedienbarkeit auch für ältere Kunden (Abschnitt 26) */

  it('sagt Schritt und Namen lesbar groß und für Vorleseprogramme', () => {
    const html = rahmen();
    // Eine Ansage (FA-QA-04E): Die Überschrift verweist auf die Zeile, die Zeile ist keine Live-Region mehr.
    const id = html.match(/<p id="([^"]+)" class="[^"]*\btext-small\b[^"]*">Schritt 2 von 3/)?.[1];
    expect(id).toBeTruthy();
    expect(html).toMatch(new RegExp(`<h2 data-schritt-titel="true" tabindex="-1" aria-describedby="${id}"[^>]*>Zweiter Schritt</h2>`));
    // Die Zeile spricht nicht selbst; nur die leere Ansage für Wechsel ohne Fokus ist eine Live-Region.
    expect(html.match(/aria-live/g)).toHaveLength(1);
    expect(html).toMatch(/<p class="sr-only" aria-live="polite" data-schritt-ansage="true"><\/p>/);
    expect(html).toContain('aria-valuetext="Schritt 2 von 3: Modell, 67 Prozent"');
    expect(fortschrittText(ablauf(0))).toBe('Schritt 1 von 3: Marke');
  });

  it('zählt mit Etappen die Etappen, auch für Vorleseprogramme', () => {
    const steps: FlowStep[] = [
      { id: 'a', title: 'A', short: 'A', etappe: 'Fahrzeug' },
      { id: 'b', title: 'B', short: 'B', etappe: 'Fahrzeug' },
      { id: 'c', title: 'C', short: 'C', etappe: 'Fotos' },
    ];
    expect(fortschrittText({ steps, stepIndex: 2, stepCount: 3, step: steps[2] })).toBe('Schritt 2 von 2: Fotos');
  });

  it('der gesperrte Knopf nennt den Hinweis des Formulars und ist mit ihm verknüpft', () => {
    const html = rahmen({ blockedHint: 'Bitte tragen Sie die Marke ein.' }, 1, { canContinue: false });
    const id = html.match(/<p id="([^"]+)" data-gesperrt-hinweis="true"[^>]*>Bitte tragen Sie die Marke ein\.<\/p>/)?.[1];
    expect(id).toBeTruthy();
    expect(html).toMatch(new RegExp(`<button[^>]*disabled=""[^>]*aria-describedby="${id}"`));
  });

  it('ohne Hinweis des Formulars steht ein allgemeiner am gesperrten Knopf; frei steht keiner', () => {
    expect(rahmen({}, 1, { canContinue: false })).toContain(GESPERRT_STANDARD);
    expect(rahmen({}, 1)).not.toContain('data-gesperrt-hinweis');
    // Nur der Knopf zählt; die Schrittüberschrift verweist immer auf die Zeile „Schritt x von y“ (FA-QA-04E).
    expect(rahmen({ blockedHint: 'X' }, 1)).not.toMatch(/<button[^>]*aria-describedby=/);
  });

  it('sagt nach dem Laden eines Zwischenstands, dass Dateien neu zu wählen sind; Knöpfe 44 px hoch', () => {
    const mit = rahmen({ mitDateien: true }, 1, { restored: true });
    expect(mit).toContain('Ausgewählte Dateien und Fotos sind dabei nicht gespeichert');
    expect(mit).not.toContain('min-h-touch-sm');
    const ohne = rahmen({}, 1, { restored: true });
    expect(ohne).toContain('Ihr Zwischenstand von zuletzt wurde geladen.');
    expect(ohne).not.toContain('Ausgewählte Dateien');
  });

  it('die Schrittliste ab Tablet ist nicht kleiner als 15 px', () => {
    const html = rahmen();
    expect(html).not.toMatch(/<button[^>]*class="[^"]*text-caption[^"]*"[^>]*>(?:<span|<svg)/);
  });
});

describe('FlowShell: Grund der Warnung vor dem Verlassen (FA-QA-02)', () => {
  it('Zwischenstand nicht gespeichert, keine Dateien: Grund „nicht gespeichert“, nicht „Dateien“', () => {
    expect(verlassenGrundAus({ submitting: false, ungesichert: false, saved: false })).toEqual({ dateien: false, ungespeichert: true });
  });

  it('Dateien gewählt, Stand gespeichert: Grund „Dateien“', () => {
    expect(verlassenGrundAus({ submitting: false, ungesichert: true, saved: true })).toEqual({ dateien: true, ungespeichert: false });
  });

  it('beim Absenden und ohne Grund keine Warnung', () => {
    expect(verlassenGrundAus({ submitting: true, ungesichert: true, saved: false })).toEqual({ dateien: false, ungespeichert: false });
    expect(verlassenGrundAus({ submitting: false, ungesichert: false, saved: true })).toEqual({ dateien: false, ungespeichert: false });
  });
});

describe('FlowShell: Schritte in der Browser-Historie (FA-QA-04B)', () => {
  it('rendert mit Schritt-Historie ohne Fenster (Vorabrendern) wie ohne', () => {
    const historie = new SchrittHistorie('test', () => null);
    const mit = rahmen({ ungesichert: true }, 1, { historie });
    expect(mit).toContain('Schritt 2 von 3');
    expect(mit).toBe(rahmen({ ungesichert: true }, 1));
  });
});
