import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { RichtwertErgebnis as Ergebnis } from '@/lib/richtwerte/typen';
import { PLATZHALTER_RICHTWERTE } from '@/lib/richtwerte/uebersetzung';
import { KEIN_RICHTWERT_TEXT, RichtwertErgebnis } from './rechner-bausteine';
import { ServiceEinsatzRechner } from './service-einsatz-rechner';
import { TuerAbsicherungRechner } from './tuer-absicherung-rechner';

const ANFRAGE = '/service-und-termin/anfrage?thema=tuer-und-schliesstechnik';
const zeilen = [
  { label: 'Türart', wert: 'Hauseingangstür' },
  { label: 'Maßnahme', wert: 'Schutzbeschlag' },
];

function ergebnis(e: Ergebnis, hinweis: string | null = null) {
  return renderToStaticMarkup(
    <RichtwertErgebnis
      ergebnis={e}
      zusammenfassung={zeilen}
      hinweis={hinweis}
      aufforderung="Bitte wählen."
      zusatz="einschließlich Anfahrt"
      anfrageHref={ANFRAGE}
    />,
  );
}

/** Nur Tokens des Projekts — keine festen Farbwerte, keine Platzhalterwerte. */
function pruefeVertrag(html: string) {
  expect(html).toContain('aria-live="polite"');
  expect(html).not.toMatch(/#[0-9a-f]{3,6}\b|rgb\(|oklch\(/i);
  expect(html).not.toMatch(/NaN|Infinity|undefined|null/);
}

describe('Ergebnisbereich', () => {
  it('zeigt die Spanne mit Umsatzsteuer, Zusatz, Auswahl und Hinweis', () => {
    const html = ergebnis({ art: 'spanne', spanne: { vonCent: 12000, bisCent: 18050 } }, 'Preis nach Prüfung.');
    pruefeVertrag(html);
    expect(html).toContain('ca. 120 – 181 €');
    expect(html).toContain('inklusive Umsatzsteuer, einschließlich Anfahrt');
    expect(html).toContain('Unverbindliche Orientierung. Preis nach Prüfung.');
    expect(html).toContain('<dd class="text-[14px] text-foreground">Schutzbeschlag</dd>');
    expect(html).not.toContain(KEIN_RICHTWERT_TEXT);
    expect(html).toContain(`href="${ANFRAGE.replace('&', '&amp;')}"`);
  });

  it('nennt ohne Richtwert keinen Betrag, fasst aber die Auswahl zusammen', () => {
    for (const grund of ['platzhalter', 'betrag-fehlt', 'umfang'] as const) {
      const html = ergebnis({ art: 'kein-richtwert', grund }, 'Preis nach Prüfung.');
      pruefeVertrag(html);
      expect(html).toContain(KEIN_RICHTWERT_TEXT);
      expect(html).toContain('Hauseingangstür');
      expect(html).not.toContain('€');
      expect(html).not.toContain('Preis nach Prüfung.');
    }
  });

  it('bittet bei unvollständiger Auswahl um die fehlende Angabe', () => {
    const html = ergebnis({ art: 'unvollstaendig' });
    pruefeVertrag(html);
    expect(html).toContain('Bitte wählen.');
    expect(html).not.toContain('<dl');
    expect(html).not.toContain('€');
    expect(html).toContain('Anfrage stellen');
  });
});

describe('Rechner auf Platzhalter-Richtwerten', () => {
  it('Türabsicherung: Türarten als Einfach-, Maßnahmen als Mehrfachauswahl, kein Betrag', () => {
    const html = renderToStaticMarkup(
      <TuerAbsicherungRechner werte={PLATZHALTER_RICHTWERTE.tuerAbsicherung} anfrageHref={ANFRAGE} />,
    );
    pruefeVertrag(html);
    expect(html.match(/<fieldset/g)).toHaveLength(2);
    expect(html).toContain('<legend class="text-sm font-semibold text-foreground">1. Um welche Tür geht es?</legend>');
    expect(html.match(/type="radio"/g)).toHaveLength(4);
    expect(html.match(/type="checkbox"/g)).toHaveLength(5);
    expect(html).toContain('Wählen Sie eine Tür und mindestens eine Maßnahme.');
    expect(html).not.toContain('€');
  });

  it('Serviceeinsatz: Leistungen mit Einheit und Türanzahl, kein Betrag', () => {
    const html = renderToStaticMarkup(
      <ServiceEinsatzRechner
        werte={PLATZHALTER_RICHTWERTE.serviceEinsatz}
        anfrageHref="/service-und-termin/anfrage?thema=service-und-termin"
      />,
    );
    pruefeVertrag(html);
    expect(html.match(/type="checkbox"/g)).toHaveLength(4);
    expect(html).toContain('je Tür');
    expect(html).toContain('pauschal');
    expect(html).toContain('aria-label="Anzahl Türen"');
    expect(html).toContain('Wählen Sie mindestens eine Leistung.');
    expect(html).not.toContain('€');
  });

  it('ohne gepflegte Auswahl bleibt nur der Weg über die Anfrage', () => {
    const html = renderToStaticMarkup(
      <TuerAbsicherungRechner
        werte={{ ...PLATZHALTER_RICHTWERTE.tuerAbsicherung, tuerarten: [] }}
        anfrageHref={ANFRAGE}
      />,
    );
    pruefeVertrag(html);
    expect(html).not.toContain('<fieldset');
    expect(html).toContain('Den Rahmen für Ihre Tür nennen wir Ihnen nach einer kurzen Anfrage.');
    expect(html).toContain('Anfrage stellen');
  });
});
