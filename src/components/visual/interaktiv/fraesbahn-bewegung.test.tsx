import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import {
  FraesbahnBewegung,
  abhebenSchluesselbilder,
  bahnPunkte,
  bahnSchluesselbilder,
  fahrtOptionen,
  zeitAusCss,
} from './fraesbahn-bewegung';

describe('bahnPunkte', () => {
  it('liest Punktpaare und überspringt Unsinn', () => {
    expect(bahnPunkte('140,153 178.5,160 x,1 200,153')).toEqual([
      [140, 153],
      [178.5, 160],
      [200, 153],
    ]);
    expect(bahnPunkte('')).toEqual([]);
    expect(bahnPunkte(null)).toEqual([]);
  });
});

describe('bahnSchluesselbilder', () => {
  it('endet in der Ruhelage und beginnt am ersten Punkt', () => {
    const bilder = bahnSchluesselbilder([
      [0, 0],
      [30, 40],
      [60, 0],
    ]);
    expect(bilder[0]).toEqual({ transform: 'translate(-60px, 0px)', offset: 0 });
    expect(bilder.at(-1)).toEqual({ transform: 'translate(0px, 0px)', offset: 1 });
  });

  it('verteilt die Versätze nach zurückgelegter Strecke', () => {
    const bilder = bahnSchluesselbilder([
      [0, 0],
      [10, 0],
      [40, 0],
    ]);
    expect(bilder.map((b) => b.offset)).toEqual([0, 0.25, 1]);
  });

  it('liefert für weniger als zwei Punkte keine Bewegung', () => {
    expect(bahnSchluesselbilder([[1, 2]])).toEqual([]);
    expect(bahnSchluesselbilder([])).toEqual([]);
  });
});

describe('zeitAusCss', () => {
  it('liest Sekunden und Millisekunden, nimmt den ersten Listenwert', () => {
    expect(zeitAusCss('1.1s')).toBe(1100);
    expect(zeitAusCss('300ms')).toBe(300);
    expect(zeitAusCss('0.3s, 0s')).toBe(300);
  });

  it('liefert 0 für Unsinn und negative Werte', () => {
    expect(zeitAusCss('')).toBe(0);
    expect(zeitAusCss(undefined)).toBe(0);
    expect(zeitAusCss('schnell')).toBe(0);
    expect(zeitAusCss('-1s')).toBe(0);
  });
});

describe('fahrtOptionen', () => {
  it('übernimmt Dauer, Verzögerung und die Kurve der CSS-Zeichnung', () => {
    expect(
      fahrtOptionen({
        animationDuration: '1.1s',
        animationDelay: '0.3s',
        animationTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)',
      }),
    ).toEqual({ duration: 1100, delay: 300, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'both' });
  });

  it('läuft nie linear, wenn die Zeichnung eine Kurve hat (Regression)', () => {
    const optionen = fahrtOptionen({
      animationDuration: '1.1s, 0.4s',
      animationDelay: '0.3s, 0s',
      animationTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1), ease',
    });
    expect(optionen.easing).toBe('cubic-bezier(0.65, 0, 0.35, 1)');
    expect(fahrtOptionen({ animationDuration: '1s', animationDelay: '0s', animationTimingFunction: 'ease-in-out' }).easing).toBe(
      'ease-in-out',
    );
  });
});

describe('abhebenSchluesselbilder', () => {
  it('hebt aus der Bahn-Endlage in die gehobene Ruhelage', () => {
    expect(abhebenSchluesselbilder('12,-16')).toEqual([
      { transform: 'translate(0px, 0px)' },
      { transform: 'translate(12px, -16px)' },
    ]);
  });

  it('bewegt nichts ohne gültigen Versatz', () => {
    expect(abhebenSchluesselbilder(null)).toEqual([]);
    expect(abhebenSchluesselbilder('hoch')).toEqual([]);
  });
});

describe('FraesbahnBewegung', () => {
  it('wartet auf dem Server, bis die Grafik sichtbar ist', () => {
    const html = renderToStaticMarkup(<FraesbahnBewegung className="grafik">Inhalt</FraesbahnBewegung>);
    expect(html).toBe('<div data-motion="wait" class="grafik">Inhalt</div>');
  });
});
