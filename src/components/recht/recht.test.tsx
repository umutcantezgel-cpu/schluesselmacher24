import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { GpsrAngaben, gpsrZeilen } from './gpsr-angaben';
import { PreisHinweis } from './preis-hinweis';
import { Rechtstext } from './rechtstext';

describe('PreisHinweis', () => {
  it('nennt USt. und Versandkosten mit Link auf Zahlung und Versand', () => {
    const html = renderToStaticMarkup(<PreisHinweis />);
    expect(html).toContain('inkl. 19 % USt., zzgl.');
    expect(html).toContain('href="/rechtliches/versand-und-zahlung"');
    expect(renderToStaticMarkup(<PreisHinweis alle />)).toContain('Alle Preise inkl. 19 % USt.');
    expect(renderToStaticMarkup(<PreisHinweis variante="mit-versand" />)).toContain('Versandarten und Lieferzeiten');
  });
});

describe('GpsrAngaben', () => {
  it('erscheint nur mit gepflegten Angaben', () => {
    expect(renderToStaticMarkup(<GpsrAngaben info={undefined} />)).toBe('');
    expect(renderToStaticMarkup(<GpsrAngaben info={{ manufacturerName: '[Hersteller eintragen]' }} />)).toBe('');
  });

  it('zeigt Hersteller, Kontakt und Hinweise', () => {
    const info = {
      manufacturerName: 'Muster Schließtechnik GmbH',
      manufacturerAddress: 'Musterweg 1\n12345 Musterstadt',
      manufacturerEmail: 'info@muster.example',
      manufacturerWebsite: 'muster.example',
      productId: 'MS-01',
      safetyNotes: 'Nicht für Kinder.',
    };
    expect(gpsrZeilen(info).map((z) => z.label)).toEqual([
      'Hersteller',
      'Anschrift',
      'E-Mail',
      'Website',
      'Produktkennung',
      'Sicherheitshinweise',
    ]);
    const html = renderToStaticMarkup(<GpsrAngaben info={info} />);
    expect(html).toContain('Produktsicherheit');
    expect(html).toContain('href="mailto:info@muster.example"');
    expect(html).toContain('href="https://muster.example"');
  });
});

describe('Rechtstext', () => {
  it('setzt Abschnitte als Überschriften, Absätze und Listen', () => {
    const html = renderToStaticMarkup(
      <Rechtstext
        abschnitte={[
          { id: 'eins', ueberschrift: '§ 1 Test', ebene: 2, absaetze: ['Satz.', { liste: ['a', 'b'] }] },
          { id: 'zwei', ueberschrift: 'Unterpunkt', ebene: 3, absaetze: ['Mehr.'] },
        ]}
      />,
    );
    expect(html).toContain('<h2 id="eins-titel">§ 1 Test</h2>');
    expect(html).toContain('<ul><li>a</li><li>b</li></ul>');
    expect(html).toContain('<h3 id="zwei-titel">Unterpunkt</h3>');
  });
});
