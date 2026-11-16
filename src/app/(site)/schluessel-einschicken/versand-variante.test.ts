import { describe, expect, it } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import { einsendeAngebotFuerWeg } from '@/lib/einsenden/schein';
import { STANDARD_VARIANTEN } from '@/lib/versand/varianten';

import { kostenAntwort, kostenSatz } from './versand-variante';

/* Kostenantwort der Seite „Schlüssel einschicken“ (FA-SHOP-03, A-050 Punkt 4): Namen, Porto, Aufpreis
 * und Haftung kommen aus den Einstellungen, nicht aus festem Text. */

const START = defaults.settings().sendIn!;
const mit = (aendern: (kennung: string) => Partial<(typeof STANDARD_VARIANTEN)[number]>) => ({
  ...START,
  varianten: STANDARD_VARIANTEN.map((v) => ({ ...v, einlieferung: [...v.einlieferung], empfohlenFuer: [...v.empfohlenFuer], ...aendern(v.kennung) })),
});
const antwort = (e: typeof START) => kostenAntwort(einsendeAngebotFuerWeg(e, { empfehlung: 'originalschluessel' }).optionen);

describe('kostenAntwort', () => {
  it('nennt je wählbarer Variante Namen, Kosten und Haftung, die empfohlene als Empfehlung', () => {
    const text = antwort(START);
    expect(text).toContain('Für wertvolle Originalschlüssel empfehlen wir DHL Paket');
    expect(text).toContain('Einschreiben Einwurf');
    expect(text).toContain('Haftung bis 500');
    expect(text).toContain('Haftung bis 20');
    expect(text).toContain('kein Aufpreis');
    // Der Sonderfall steht nicht in der Kostenantwort, „versichert“ und „kostenlos“ nirgends (R9).
    expect(text).not.toContain('Einschreiben Wert');
    expect(text).not.toMatch(/versichert|kostenlos/i);
    expect(text).not.toMatch(/[–—]/);
  });

  it('rechnet einen gepflegten Aufpreis des Betriebs mit ein', () => {
    const e = mit((kennung) => (kennung === 'dhl-paket' ? { aufpreisCents: 250 } : {}));
    const paket = einsendeAngebotFuerWeg(e, { empfehlung: 'originalschluessel' }).optionen.find((o) => o.art === 'dhl-paket')!;
    expect(paket.summeCents).toBe((paket.portoCents ?? 0) + 250);
    expect(kostenSatz(paket)).toContain('Aufpreis 2,50');
    expect(antwort(e)).toContain('Aufpreis 2,50');
  });

  it('nennt eine im Admin abgeschaltete oder umbenannte Variante so, wie sie gepflegt ist', () => {
    const ohneEinwurf = antwort(mit((kennung) => (kennung === 'einschreiben-einwurf' ? { aktiv: false } : {})));
    expect(ohneEinwurf).not.toContain('Einschreiben Einwurf');
    expect(ohneEinwurf).toContain('DHL Paket');
    const umbenannt = antwort(mit((kennung) => (kennung === 'dhl-paket' ? { bezeichnung: 'DHL Paket mit Sendungsnummer' } : {})));
    expect(umbenannt).toContain('empfehlen wir DHL Paket mit Sendungsnummer');
    // Keine wählbare Variante: kein Satz, die Antwort der Seite bleibt beim allgemeinen Teil.
    expect(antwort(mit(() => ({ aktiv: false })))).toBe('');
  });
});
