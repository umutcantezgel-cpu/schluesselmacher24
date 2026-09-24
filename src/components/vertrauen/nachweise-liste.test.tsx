import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { Nachweis } from '@/lib/data/nachweise';
import { NachweiseListe } from './nachweise-liste';

const NACHWEISE: Nachweis[] = [
  {
    id: '1',
    titel: 'Fachkunde Flucht- und Rettungswegtechnik',
    art: 'norm',
    artLabel: 'Fachkunde nach Norm',
    aussteller: 'Prüfstelle Nord',
    gueltigBis: '2027-03-31',
  },
  { id: '2', titel: 'Betriebshaftpflicht', art: 'versicherung', artLabel: 'Versicherung' },
];

describe('Nachweis-Liste', () => {
  it('zeigt ohne Nachweise nichts — auch keine Überschrift', () => {
    expect(renderToStaticMarkup(<NachweiseListe nachweise={[]} />)).toBe('');
  });

  it('nennt Titel, Art, Aussteller und Gültigkeit', () => {
    const html = renderToStaticMarkup(<NachweiseListe nachweise={NACHWEISE} />);
    expect(html).toContain('<h2');
    expect(html).toContain('Fachkunde Flucht- und Rettungswegtechnik');
    expect(html).toContain('Fachkunde nach Norm');
    expect(html).toContain('Prüfstelle Nord');
    expect(html).toContain('<time dateTime="2027-03-31">31.03.2027</time>');
    expect(html.match(/<li/g)).toHaveLength(2);
  });

  it('lässt fehlende Angaben weg, statt sie zu ergänzen', () => {
    const html = renderToStaticMarkup(<NachweiseListe nachweise={[NACHWEISE[1]]} />);
    expect(html).not.toContain('Ausgestellt von');
    expect(html).not.toContain('Gültig bis');
  });

  it('passt Überschrift und Ebene an die Seite an', () => {
    const html = renderToStaticMarkup(
      <NachweiseListe nachweise={NACHWEISE} titel="Qualifikation" ebene="h3" />,
    );
    expect(html).toContain('<h3');
    expect(html).toContain('Qualifikation');
  });
});
