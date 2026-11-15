import { readFileSync } from 'node:fs';
import path from 'node:path';

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { SCHRITTE_FOTOANFRAGE, naechsteSchritte } from '@/lib/wege/naechste-schritte';

/* Allgemeine Anfrage (FA-KERN-02B): Wer zu Autoschlüssel oder Schlüssel nach Vorlage einen Schlüssel möchte,
 * kommt in den geführten Weg mit Unterlagen; eine reine Frage bleibt möglich. */

vi.mock('next/navigation', () => ({
  useRouter: () => ({ prefetch: () => {}, push: () => {}, replace: () => {} }),
  usePathname: () => '/service-und-termin/anfrage',
  useSearchParams: () => new URLSearchParams(),
}));

const { AllgemeineAnfrage } = await import('./anfrage-formular');

const THEMEN = [
  { key: 'autoschluessel' as const, label: 'Autoschlüssel', summary: 'Fahrzeugschlüssel' },
  { key: 'schluessel-nach-vorlage' as const, label: 'Schlüssel nach Vorlage', summary: 'Kopie nach Foto' },
  { key: 'service-und-termin' as const, label: 'Service und Termin', summary: 'Alles andere' },
];

const quelle = readFileSync(path.join(process.cwd(), 'src', 'app', '(site)', 'service-und-termin', 'anfrage', 'anfrage-formular.tsx'), 'utf8');

describe('Allgemeine Anfrage: Verweis in die geführten Wege', () => {
  it.each(['autoschluessel', 'schluessel-nach-vorlage'])('fragt bei „%s“, ob es um einen Schlüssel oder eine Frage geht', (thema) => {
    const html = renderToStaticMarkup(<AllgemeineAnfrage themen={THEMEN} vorauswahl={thema} />);
    expect(html).toContain('Ich möchte einen Schlüssel anfertigen lassen');
    expect(html).toContain('Ich habe eine Frage');
  });

  it('fragt bei anderen Themen nicht danach', () => {
    const html = renderToStaticMarkup(<AllgemeineAnfrage themen={THEMEN} vorauswahl="service-und-termin" />);
    expect(html).not.toContain('Ich möchte einen Schlüssel anfertigen lassen');
  });

  it('nennt die geführten Wege mit Unterlagen und lässt „Weiter“ nur mit einer Frage zu', () => {
    for (const ziel of [
      '/autoschluessel/anfrage',
      '/autoschluessel/fahrzeug-nicht-gefunden',
      '/motorradschluessel/anfrage',
      '/roller-und-kleinstfahrzeuge/anfrage',
      '/e-scooter/anfrage',
      '/seniorenmobile/anfrage',
      '/fahrradschluessel/anfrage',
      '/schluessel-nach-vorlage/anfrage',
    ]) {
      expect(quelle, ziel).toContain(`href: '${ziel}'`);
    }
    expect(quelle).toContain("data.thema !== '' && (!SCHLUESSEL_THEMEN.has(data.thema) || data.anliegenArt === 'frage')");
  });

  it('sagt nicht mehr, Fotos seien „freiwillig … von beiden Seiten“', () => {
    expect(quelle).not.toContain('von beiden Seiten');
  });

  it('zeigt nach einer Frage zu „Schlüssel nach Vorlage“ die Schritte einer allgemeinen Anfrage, nicht die einer Foto-Anfrage', () => {
    expect(quelle).toContain("const ablage = area === 'schluessel-nach-vorlage' ? 'service-und-termin' : area;");
    const schritte = naechsteSchritte({ kind: 'anfrage', area: 'service-und-termin', process: 'gefuehrte-anfrage', payload: { thema: 'schluessel-nach-vorlage' } });
    expect(schritte).not.toBe(SCHRITTE_FOTOANFRAGE);
    expect(naechsteSchritte({ kind: 'anfrage', area: 'schluessel-nach-vorlage', process: 'gefuehrte-anfrage' })).toBe(SCHRITTE_FOTOANFRAGE);
  });
});
