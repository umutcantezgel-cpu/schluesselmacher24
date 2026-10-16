import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SchliessplanInteraktiv, type SchliessDetail } from './schliessplan-interaktiv';

const HAUPT: SchliessDetail = {
  name: 'Hauptschlüsselanlage (HS)',
  beschreibung: 'Jede Person öffnet mit ihrem Schlüssel genau die Türen, für die sie zuständig ist.',
  haken: ['Ein Hauptschlüssel für alle Türen', 'Schließplan legt die Rechte fest'],
  geeignetFuer: 'Betrieb, Praxis, Kanzlei oder Verwaltungsgebäude.',
};

describe('SchliessplanInteraktiv: Reiterinhalt', () => {
  it('zeigt Name, Beschreibung, Merkpunkte und Eignung des gewählten Systems unter dem Plan', () => {
    const html = renderToStaticMarkup(
      <SchliessplanInteraktiv anfang="haupt" tueren={4} gruppen={2} details={{ haupt: HAUPT }} />,
    );
    expect(html).toContain('Hauptschlüsselanlage (HS)');
    expect(html).toContain('Jede Person öffnet');
    expect(html).toContain('Ein Hauptschlüssel für alle Türen');
    expect(html).toContain('Schließplan legt die Rechte fest');
    expect(html).toContain('Geeignet für');
    expect(html).toContain('Betrieb, Praxis, Kanzlei oder Verwaltungsgebäude.');
    /* Der Reiterinhalt steht im Reiterfeld, nicht außerhalb. */
    const feld = html.indexOf('role="tabpanel"');
    expect(feld).toBeGreaterThan(-1);
    expect(html.indexOf('Geeignet für')).toBeGreaterThan(feld);
  });

  it('zeigt keinen Reiterinhalt für ein System ohne Eintrag', () => {
    const html = renderToStaticMarkup(
      <SchliessplanInteraktiv anfang="zentral" tueren={4} gruppen={2} details={{ haupt: HAUPT }} />,
    );
    expect(html).not.toContain('Geeignet für');
    expect(html).not.toContain('Jede Person öffnet');
  });

  it('bleibt ohne details unverändert', () => {
    const html = renderToStaticMarkup(<SchliessplanInteraktiv />);
    expect(html).not.toContain('Geeignet für');
    expect(html).toContain('role="tablist"');
    expect(html).toContain('Schlüssel wählen');
    expect(html).toContain('Tür wählen');
  });
});

describe('SchliessplanInteraktiv: Raster der Wählchips', () => {
  it('stellt die Schlüsselreihe bei fünf Schlüsseln in eine Reihe von fünf Spalten', () => {
    const html = renderToStaticMarkup(<SchliessplanInteraktiv anfang="haupt" tueren={4} gruppen={2} />);
    expect(html).toContain('grid-template-columns:repeat(5, minmax(0, 1fr))');
    expect(html).toContain('>HS<');
    expect(html).toContain('>ES 4<');
  });

  it('setzt jede Tür unter ihren Schlüssel, leer unter der Hauptschlüsselzeile', () => {
    const html = renderToStaticMarkup(<SchliessplanInteraktiv anfang="haupt" tueren={4} gruppen={2} />);
    const kopf = html.indexOf('Tür wählen');
    const tuerReihe = html.slice(kopf);
    expect(tuerReihe.indexOf('aria-hidden="true"')).toBeGreaterThan(-1);
    expect(tuerReihe.indexOf('>Tür 1<')).toBeGreaterThan(tuerReihe.indexOf('aria-hidden="true"'));
  });

  it('verteilt viele Schlüssel auf gleich lange Reihen, ohne einen Chip allein zu lassen', () => {
    const html = renderToStaticMarkup(
      <SchliessplanInteraktiv anfang="generalhaupt" tueren={4} gruppen={2} />,
    );
    /* Elf Schlüssel: drei Reihen zu vier Spalten. */
    expect(html).toContain('grid-template-columns:repeat(4, minmax(0, 1fr))');
  });
});

describe('SchliessplanInteraktiv: Fassungen des Plans', () => {
  it('zeichnet unter 640 px die schmale Fassung, darüber die breite', () => {
    const html = renderToStaticMarkup(<SchliessplanInteraktiv anfang="haupt" tueren={4} gruppen={2} />);
    const schmal = html.indexOf('<div class="sm:hidden">');
    const breit = html.indexOf('<div class="hidden sm:block">');
    expect(schmal).toBeGreaterThan(-1);
    expect(breit).toBeGreaterThan(schmal);
    expect(html.slice(schmal, breit)).toMatch(/viewBox="0 0 360 /);
    expect(html.slice(breit)).toMatch(/viewBox="0 0 480 /);
  });
});
