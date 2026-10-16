import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SCHLUESSELARTEN_REIHE, SchluesselartenReihe } from './schluesselarten-reihe';

describe('SchluesselartenReihe', () => {
  const html = renderToStaticMarkup(<SchluesselartenReihe />);

  it('zeigt jede Bauform genau einmal, Keyless nur als Zusatz', () => {
    expect(SCHLUESSELARTEN_REIHE.map((e) => e.art)).toEqual(['mechanisch', 'funk', 'klappschluessel', 'smart-key']);
    expect(new Set(SCHLUESSELARTEN_REIHE.map((e) => e.typ)).size).toBe(4);
    expect(html.match(/<svg/g)).toHaveLength(4);
    expect(html.match(/<h3/g)).toHaveLength(4);
    expect(html).toContain('Keyless:');
  });

  it('beschriftet jede Zeichnung und staffelt höchstens vier Auftritte zu je 120 ms', () => {
    for (const titel of ['Mechanischer Schlüssel', 'Funkschlüssel', 'Klappschlüssel', 'Smart Key']) {
      expect(html).toContain(`<title>Zeichnung: ${titel}`);
    }
    expect(html.match(/<div class="sm24-reveal"/g)).toHaveLength(4);
    expect(html).toContain('--sm24-delay:0.36s');
    expect(html).not.toContain('--sm24-delay:0.48s');
  });

  it('kennzeichnet die Zeichnungen als schematisch', () => {
    expect(html).toContain('Schematische Darstellung, nicht maßstäblich.');
  });
});

describe('SchluesselartenReihe in der Kopf-Variante', () => {
  const html = renderToStaticMarkup(<SchluesselartenReihe variante="kopf" />);

  it('zeigt vier Zeichnungen mit Name, ohne Erklärungstexte und ohne Keyless-Zusatz', () => {
    expect(html.match(/<svg/g)).toHaveLength(4);
    expect(html.match(/<h3/g)).toHaveLength(4);
    expect(html).toContain('Smart Key');
    expect(html).not.toContain('Keyless:');
    expect(html).not.toContain('Schlüssel mit Bart und ohne Tasten am Griff');
    expect(html).not.toContain('border-border');
  });

  it('behält Kennung je Zeichnung und staffelt höchstens vier Auftritte zu je 120 ms', () => {
    expect(html.match(/<div class="sm24-reveal"/g)).toHaveLength(4);
    expect(html).toContain('--sm24-delay:0.36s');
    expect(html).not.toContain('--sm24-delay:0.48s');
    expect(html).toContain('Ansicht');
  });

  it('beschriftet die Zeichnungen und kennzeichnet sie als schematisch', () => {
    for (const titel of ['Mechanischer Schlüssel', 'Funkschlüssel', 'Klappschlüssel', 'Smart Key']) {
      expect(html).toContain(`<title>Zeichnung: ${titel}`);
    }
    expect(html).toContain('Schematische Darstellung, nicht maßstäblich.');
  });
});
