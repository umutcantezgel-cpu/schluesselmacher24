import { describe, expect, it } from 'vitest';

import { betriebWarnung } from './index';

const KONTEXT = { site: 'https://schluesselmacher24.de' };

describe('betriebWarnung', () => {
  it('nennt die Befunde mit Stufe und markiert Dringendes im Betreff', () => {
    const mail = betriebWarnung({
      befunde: [
        { art: 'sicherung-db', stufe: 'kritisch', text: 'Sicherung der Datenbank: letzter Erfolg vor 40 Stunden.' },
        { art: 'datenbank-groesse', stufe: 'warnung', text: 'Datenbank: 310 MB von 500 MB belegt (62 %).' },
      ],
      stand: '2026-10-30',
      kontext: KONTEXT,
    });
    expect(mail.betreff).toBe('Dringend: Betrieb der Website prüfen (2026-10-30)');
    expect(mail.text).toContain('2 Befunde');
    expect(mail.text).toContain('Dringend: Sicherung der Datenbank: letzter Erfolg vor 40 Stunden.');
    expect(mail.text).toContain('Hinweis: Datenbank: 310 MB von 500 MB belegt (62 %).');
    expect(mail.html).toContain('docs/SUPABASE.md');
  });

  it('bleibt bei reinen Warnungen ein Hinweis', () => {
    const mail = betriebWarnung({
      befunde: [{ art: 'ablage-groesse', stufe: 'warnung', text: 'Dateiablage (Schätzung): 500 MB von 800 MB belegt (63 %).' }],
      stand: '2026-10-30',
      kontext: KONTEXT,
    });
    expect(mail.betreff).toBe('Hinweis: Betrieb der Website prüfen (2026-10-30)');
    expect(mail.text).toContain('einen Befund');
  });
});
