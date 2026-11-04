import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { SCHRITTE_FOTOANFRAGE } from '@/lib/wege/naechste-schritte';

import { STATUS_HREF, WegBestaetigung, type WegBestaetigungProps } from './bestaetigung';

/* Erfundene Testdaten (G4). */
const BEISPIEL: WegBestaetigungProps = {
  marke: 'Anfrage eingegangen',
  titel: 'Ihre Anfrage liegt uns vor',
  text: 'Wir prüfen Ihre Fotos.',
  reference: 'SM24-A-2026-0042',
  notices: ['Die Bestätigung per E-Mail konnte gerade nicht versendet werden.'],
  schritte: SCHRITTE_FOTOANFRAGE,
  summary: [{ title: 'Schlüssel', rows: [{ label: 'Art', value: 'Hausschlüssel' }] }],
  zurueck: { href: '/schluessel-nach-vorlage', label: 'Zurück zur Übersicht' },
  weitere: [{ href: '/schluessel-nach-code', label: 'Schlüssel nach Code' }],
};

const html = (props: Partial<WegBestaetigungProps> = {}) => renderToStaticMarkup(<WegBestaetigung {...BEISPIEL} {...props} />);

describe('WegBestaetigung (G-38, E6-OPUS-01)', () => {
  it('zeigt Haken, Überschrift als Fokusziel und die Vorgangsnummer', () => {
    const seite = html();
    expect(seite).toContain('Anfrage eingegangen');
    expect(seite).toMatch(/<h2 tabindex="-1"[^>]*>Ihre Anfrage liegt uns vor<\/h2>/);
    expect(seite).toContain('Ihre Vorgangsnummer');
    expect(seite).toContain('SM24-A-2026-0042');
  });

  it('nennt die Schritte in Reihenfolge als Liste, dazu Hinweise und Angaben', () => {
    const seite = html();
    expect(seite).toContain('So geht es weiter');
    const positionen = SCHRITTE_FOTOANFRAGE.map((s) => seite.indexOf(`>${s.titel}</p>`));
    expect(positionen.every((p) => p > 0)).toBe(true);
    expect([...positionen].sort((a, b) => a - b)).toEqual(positionen);
    expect(seite).toContain('Bitte beachten');
    expect(seite).toContain('Ihre Angaben');
    expect(seite).toContain('Hausschlüssel');
    expect(seite).toContain('Ebenfalls passend');
  });

  it('führt zum Statusabruf und zurück in den Bereich, ohne Statusabruf nur zurück', () => {
    const mit = html();
    expect(mit).toContain(`href="${STATUS_HREF}"`);
    expect(mit).toContain('href="/schluessel-nach-vorlage"');
    const ohne = html({ statusAbrufbar: false });
    expect(ohne).not.toContain(`href="${STATUS_HREF}"`);
    expect(ohne).toContain('nennen Sie sie, wenn Sie sich bei uns melden');
  });

  it('lässt leere Teile weg und nimmt Ergänzungen auf', () => {
    const knapp = html({ notices: [], schritte: [], summary: [], weitere: [], children: <p>Rechtshinweis</p> });
    expect(knapp).not.toContain('So geht es weiter');
    expect(knapp).not.toContain('Bitte beachten');
    expect(knapp).not.toContain('Ihre Angaben');
    expect(knapp).not.toContain('Ebenfalls passend');
    expect(knapp).toContain('<p>Rechtshinweis</p>');
    expect(knapp).toContain('Melden Sie sich bei uns');
  });
});
