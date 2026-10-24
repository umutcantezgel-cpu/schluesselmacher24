import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { ZAHLART_TEXTE, ZAHLUNG_OHNE_ONLINE } from '@/lib/rechtliches/zahlarten';
import { echteEinstellungen, platzhalterEinstellungen } from '@/lib/rechtliches/test-hilfen';

import { VersandInhalt } from './versand-inhalt';

describe('Zahlung und Versand', () => {
  const settings = echteEinstellungen();

  it('listet die Online-Zahlarten aus derselben Quelle wie der Checkout', () => {
    const html = renderToStaticMarkup(<VersandInhalt settings={settings} zahlarten={[ZAHLART_TEXTE.card, 'PayPal']} />);
    expect(html).toContain('Kredit- und Debitkarte, Apple Pay und Google Pay je nach Gerät');
    expect(html).toContain('<li>PayPal</li>');
    expect(html).not.toContain(ZAHLUNG_OHNE_ONLINE);
  });

  it('nennt ohne Online-Zahlung Überweisung oder Zahlung vor Ort', () => {
    const html = renderToStaticMarkup(<VersandInhalt settings={settings} zahlarten={null} />);
    expect(html).toContain(ZAHLUNG_OHNE_ONLINE);
    expect(html).not.toContain('Stripe');
  });

  it('liefert nur nach Deutschland, ohne Platzhalter und mit 19 % USt.', () => {
    const html = renderToStaticMarkup(<VersandInhalt settings={settings} zahlarten={null} />);
    expect(html).toContain('ausschließlich an Lieferanschriften in Deutschland');
    expect(html).toContain('19 %');
    expect(html).not.toContain('[Platzhalter');
    expect(html).not.toContain('Kleinunternehmer');
    expect(html).toContain('vollständig mit dem Endpreis verrechnet');
    expect(html).toContain('Langgasse 70');
  });

  it('zeigt Lieferzeiten nur, wenn sie gepflegt sind', () => {
    expect(renderToStaticMarkup(<VersandInhalt settings={settings} zahlarten={null} />)).not.toContain('Lieferzeiten</h2>');
    const mit = {
      ...settings,
      shipping: settings.shipping.map((option, index) => (index === 1 ? { ...option, deliveryTime: '3–5 Werktage nach Fertigung' } : option)),
    };
    const html = renderToStaticMarkup(<VersandInhalt settings={mit} zahlarten={null} />);
    expect(html).toContain('Lieferzeiten</h2>');
    expect(html).toContain('3–5 Werktage nach Fertigung');
  });

  it('kommt auch mit Platzhalter-Firmendaten ohne Platzhalter aus', () => {
    expect(renderToStaticMarkup(<VersandInhalt settings={platzhalterEinstellungen()} zahlarten={null} />)).not.toContain('[');
  });
});
