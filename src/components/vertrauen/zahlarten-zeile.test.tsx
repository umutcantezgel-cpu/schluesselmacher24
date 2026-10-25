import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { ZAHLART_TEXTE, zahlartenAnzeige } from '@/lib/rechtliches/zahlarten';
import { ZahlartenZeile } from './zahlarten-zeile';

describe('Zahlarten-Zeile', () => {
  it('nennt die Zahlarten des Checkouts', () => {
    const html = renderToStaticMarkup(<ZahlartenZeile zahlarten={zahlartenAnzeige(['card', 'paypal'])} />);
    expect(html).toContain('Online bezahlen mit:');
    expect(html).toContain(ZAHLART_TEXTE.card);
    expect(html).toContain('PayPal');
  });

  it('zeigt ohne Online-Zahlung nichts', () => {
    expect(renderToStaticMarkup(<ZahlartenZeile zahlarten={null} />)).toBe('');
    expect(renderToStaticMarkup(<ZahlartenZeile zahlarten={[]} />)).toBe('');
  });
});
