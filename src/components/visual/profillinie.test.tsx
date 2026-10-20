import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { Profillinie, profillinienPunkte } from './profillinie';

describe('profillinienPunkte', () => {
  it('ist deterministisch: gleicher Text ergibt dieselbe Linie', () => {
    expect(profillinienPunkte('Schließanlagen')).toEqual(profillinienPunkte('Schließanlagen'));
    expect(profillinienPunkte('  Schließanlagen ')).toEqual(profillinienPunkte('schließanlagen'));
  });

  it('unterscheidet verschiedene Texte', () => {
    expect(profillinienPunkte('Autoschlüssel').punkte).not.toEqual(profillinienPunkte('Ratgeber').punkte);
  });

  it('beginnt am Rücken, endet an der Spitze und bleibt in der Höhe', () => {
    for (const groesse of ['klein', 'gross'] as const) {
      const { punkte, breite, hoehe } = profillinienPunkte('Zylinder', 6, groesse);
      expect(punkte[0][0]).toBe(0);
      expect(punkte.at(-1)?.[0]).toBe(breite);
      for (const [x, y] of punkte) {
        expect(Number.isFinite(x) && Number.isFinite(y)).toBe(true);
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(breite);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(hoehe);
      }
      /* x wächst monoton von links nach rechts */
      for (let i = 1; i < punkte.length; i += 1) expect(punkte[i][0]).toBeGreaterThanOrEqual(punkte[i - 1][0]);
    }
  });

  it('begrenzt die Zahl der Einschnitte auf 3 bis 8', () => {
    const breite = (n: number) => profillinienPunkte('x', n).breite;
    expect(breite(1)).toBe(breite(3));
    expect(breite(20)).toBe(breite(8));
    expect(breite(Number.NaN)).toBe(breite(5));
    expect(breite(6)).toBeGreaterThan(breite(5));
  });

  it('fällt bei leerem Text auf ein Standardprofil zurück', () => {
    expect(profillinienPunkte('').punkte).toEqual(profillinienPunkte('   ').punkte);
  });
});

describe('Profillinie', () => {
  it('ist dekorativ, ohne Kennungen und zeichnet sich standardmäßig', () => {
    const html = renderToStaticMarkup(<Profillinie text="Ratgeber" />);
    expect(html).toMatch(/^<span aria-hidden="true"/);
    expect(html).not.toMatch(/\bid=/);
    expect(html).toContain('class="stroke-current sm24-draw"');
    expect(html).toContain('pathLength="1"');
    expect(html.match(/<svg/g)).toHaveLength(1);
  });

  it('schließt mit `voll` eine Haarlinie bis zum Rand an', () => {
    const html = renderToStaticMarkup(<Profillinie text="Ratgeber" voll />);
    expect(html.match(/<svg/g)).toHaveLength(2);
    expect(html).toContain('preserveAspectRatio="none"');
    expect(html).toContain('vector-effect="non-scaling-stroke"');
  });

  it('bleibt mit `ruhig` ohne Einstiegsbewegung', () => {
    const html = renderToStaticMarkup(<Profillinie text="Kasse" voll ruhig />);
    expect(html).not.toContain('sm24-draw');
    expect(html).not.toContain('pathLength');
  });
});
