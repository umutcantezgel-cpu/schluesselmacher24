import { describe, expect, it } from 'vitest';
import { partnerbetriebNachAenderung } from '../hooks/partner-pruefung';
import { nachAenderung, nachLoeschen } from '../hooks/revalidate';
import { Partnerbetriebe } from './Partnerbetriebe';

/* Ortsseiten und Sitemap rechnen beim Rendern, ob ein freigeschalteter Partner den Ort abdeckt
   (Partnerbezug, Leistungsweg, Indexierbarkeit). Die Seiten sind statisch: Ändert sich ein
   Partnerbetrieb, müssen sie neu gebaut werden, sonst bleibt eine falsche Aussage stehen
   (Gegenprüfung FA-PLATTFORM-03B, roter Befund). */
describe('Partnerbetriebe erneuern die Seiten (FA-PLATTFORM-03B)', () => {
  it('erneuert nach jeder Änderung, auch nach Pausieren, Sperren und dem Papierkorb', () => {
    expect(Partnerbetriebe.hooks?.afterChange).toContain(nachAenderung);
  });

  it('erneuert nach dem endgültigen Löschen', () => {
    expect(Partnerbetriebe.hooks?.afterDelete).toContain(nachLoeschen);
  });

  it('markiert zuerst die laufenden Leads und erneuert danach', () => {
    const nach = Partnerbetriebe.hooks?.afterChange ?? [];
    expect(nach.indexOf(partnerbetriebNachAenderung)).toBeGreaterThanOrEqual(0);
    expect(nach.indexOf(nachAenderung)).toBeGreaterThan(nach.indexOf(partnerbetriebNachAenderung));
  });
});
