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
    // Alt: Suche nach „--sm24-delay:0.36s“ und Fehlen von „0.48s“ im ganzen HTML. Neu: dieselben Werte nur an
    // den Kartenhüllen gelesen – die Zeichnung selbst nutzt seit KERN 1.13 eigene Verzögerungen (B-21).
    const staffel = [...html.matchAll(/<div class="sm24-reveal" style="--sm24-delay:([\d.]+)s"/g)].map((m) => Number(m[1]));
    expect(staffel).toContain(0.36);
    expect(staffel).not.toContain(0.48);
    expect(Math.max(...staffel)).toBeLessThanOrEqual(0.36);
  });

  it('kennzeichnet die Zeichnungen als schematisch', () => {
    expect(html).toContain('Schematische Darstellung, nicht maßstäblich.');
  });

  it('hat in der Standard-Variante keinen Scrollbereich und keinen Tab-Stopp', () => {
    expect(html).not.toContain('tabindex');
    expect(html).not.toContain('aria-label="Schlüsselarten"');
  });
});

describe('SchluesselartenReihe in der Kopf-Variante', () => {
  const html = renderToStaticMarkup(<SchluesselartenReihe variante="kopf" />);

  it('zeigt vier Zeichnungen mit Name, ohne Erklärungstexte und ohne Keyless-Zusatz', () => {
    expect(html.match(/<svg/g)).toHaveLength(4);
    expect(html.match(/<p class="mt-3 text-body font-semibold/g)).toHaveLength(4);
    expect(html).toContain('Smart Key');
    expect(html).not.toContain('Keyless:');
    expect(html).not.toContain('Schlüssel mit Bart und ohne Tasten am Griff');
    expect(html).not.toContain('bg-area-soft');
    expect(html).not.toContain('rounded-lg');
    expect(html).toContain('border-y border-border');
  });

  it('macht die mobile Leiste per Tastatur erreichbar und benennt sie', () => {
    expect(html).toContain('tabindex="0"');
    expect(html).toContain('aria-label="Schlüsselarten"');
  });

  it('setzt die Namen als Absatz, nicht als Überschrift, und bricht die Gliederung nicht', () => {
    expect(html).not.toContain('<h3');
    expect(html).not.toContain('<h2');
    expect(html).toContain('snap-x snap-mandatory');
    expect(html).toContain('md:grid-cols-2');
  });

  it('behält Kennung je Zeichnung und staffelt höchstens vier Auftritte zu je 120 ms', () => {
    expect(html.match(/<div class="sm24-reveal"/g)).toHaveLength(4);
    // Alt: Suche nach „--sm24-delay:0.36s“ und Fehlen von „0.48s“ im ganzen HTML. Neu: dieselben Werte nur an
    // den Kartenhüllen gelesen – die Zeichnung selbst nutzt seit KERN 1.13 eigene Verzögerungen (B-21).
    const staffel = [...html.matchAll(/<div class="sm24-reveal" style="--sm24-delay:([\d.]+)s"/g)].map((m) => Number(m[1]));
    expect(staffel).toContain(0.36);
    expect(staffel).not.toContain(0.48);
    expect(Math.max(...staffel)).toBeLessThanOrEqual(0.36);
    expect(html).not.toContain('Ansicht');
    expect(html.match(/>0[1-4]<\/p>/g)).toHaveLength(4);
  });

  it('setzt die Kennung vor die Bewegung, damit sie sofort steht', () => {
    expect(html).toMatch(/>01<\/p><div class="sm24-reveal"/);
  });

  it('beschriftet die Zeichnungen und kennzeichnet sie als schematisch', () => {
    for (const titel of ['Mechanischer Schlüssel', 'Funkschlüssel', 'Klappschlüssel', 'Smart Key']) {
      expect(html).toContain(`<title>Zeichnung: ${titel}`);
    }
    expect(html).toContain('Schematische Darstellung, nicht maßstäblich.');
  });
});
