import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { echteEinstellungen, platzhalterEinstellungen } from '@/lib/rechtliches/test-hilfen';

import { ImpressumInhalt } from './impressum-inhalt';

describe('Impressum', () => {
  const firma = echteEinstellungen().company;

  it('enthält die Pflichtangaben des Einzelunternehmens', () => {
    const html = renderToStaticMarkup(<ImpressumInhalt company={firma} />);
    expect(html).toContain('Angaben gemäß § 5 DDG');
    expect(html).toContain('SCHLÜSSELMACHER24 – Inhaber Mina Saad');
    expect(html).toContain('Inhaber: Mina Saad');
    expect(html).toContain('Gloelstraße 11');
    expect(html).toContain('href="tel:+4964418056279"');
    expect(html).toContain('mailto:info@schluesselmacher24.de');
    expect(html).toContain('Werkstatt und Abholung');
    expect(html).toContain('Langgasse 70');
    expect(html).toContain('§ 27a Umsatzsteuergesetz');
    expect(html).toContain('DE 282140471');
    expect(html).toContain('Handwerkskammer Wiesbaden');
    expect(html).toContain('www.gesetze-im-internet.de/hwo');
    expect(html).toContain('§ 18 Abs. 2 MStV');
    expect(html).toContain('weder bereit noch verpflichtet');
  });

  it('veröffentlicht weder Steuernummer noch Registerangaben ohne Eintrag noch einen OS-Link', () => {
    const html = renderToStaticMarkup(<ImpressumInhalt company={firma} />);
    expect(html).not.toContain(firma.taxNumber!);
    expect(html).not.toContain('Steuernummer');
    expect(html).not.toContain('Registergericht');
    expect(html).not.toContain('ec.europa.eu');
    expect(html).not.toContain('Vertreten durch');
  });

  it('zeigt Registereintrag und Vertretung nur, wenn sie gepflegt sind', () => {
    const html = renderToStaticMarkup(
      <ImpressumInhalt
        company={{ ...firma, legalForm: 'gmbh', registerCourt: 'Amtsgericht Wetzlar', registerNumber: 'HRB 1234', managingDirector: 'Erika Muster' }}
      />,
    );
    expect(html).toContain('Registergericht: Amtsgericht Wetzlar');
    expect(html).toContain('Vertreten durch: Erika Muster');
  });

  it('zeigt ohne USt-IdNr. keinen Steuerabschnitt', () => {
    const html = renderToStaticMarkup(<ImpressumInhalt company={{ ...firma, vatId: '' }} />);
    expect(html).not.toContain('Umsatzsteuer-Identifikationsnummer');
  });

  it('gibt bei Platzhalter-Firmendaten keinen Platzhalter aus', () => {
    const html = renderToStaticMarkup(<ImpressumInhalt company={platzhalterEinstellungen().company} />);
    expect(html).not.toContain('[');
    expect(html).not.toContain('tel:');
  });
});
