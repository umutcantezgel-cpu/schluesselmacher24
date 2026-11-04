import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { istFotoanfrage } from '../foto-freigabe';
import { PLANER_QUELLE } from '../konfigurator/vorgang';
import type { RecordKind } from '../types';
import {
  SCHRITTE_FOTOANFRAGE,
  SCHRITTE_NACH_ART,
  SCHRITTE_PLANER,
  SCHRITTE_SCHLIESSANLAGE,
  SCHRITTE_SICHERHEITSTECHNIK,
  SCHRITTE_ZUTRITT,
  naechsteSchritte,
} from './naechste-schritte';

const ALLE = [
  ...Object.values(SCHRITTE_NACH_ART),
  SCHRITTE_FOTOANFRAGE,
  SCHRITTE_SCHLIESSANLAGE,
  SCHRITTE_PLANER,
  SCHRITTE_ZUTRITT,
  SCHRITTE_SICHERHEITSTECHNIK,
];

describe('So geht es weiter (G-38, E6-OPUS-01)', () => {
  it('hat für jede Liste mindestens zwei Schritte mit eigenen Titeln und ganzen Sätzen', () => {
    for (const liste of ALLE) {
      expect(liste.length).toBeGreaterThanOrEqual(2);
      expect(new Set(liste.map((s) => s.titel)).size).toBe(liste.length);
      for (const s of liste) {
        expect(s.titel.trim()).toBe(s.titel);
        expect(s.text).toMatch(/[.!?]$/);
        expect(s.text).not.toContain('—');
      }
    }
  });

  it('wählt die Schritte nach Art, Bereich und Quelle des Vorgangs', () => {
    const fall = (kind: RecordKind, area: string, process: string, payload: Record<string, unknown> = {}) =>
      naechsteSchritte({ kind, area: area as never, process: process as never, payload });
    expect(fall('anfrage', 'schluessel-nach-vorlage', 'gefuehrte-anfrage')).toBe(SCHRITTE_FOTOANFRAGE);
    expect(fall('anfrage', 'sicherheitstechnik', 'gefuehrte-anfrage', { legalNoticeShown: false })).toBe(SCHRITTE_SICHERHEITSTECHNIK);
    expect(fall('projekt', 'schliessanlagen', 'projektkonfigurator')).toBe(SCHRITTE_SCHLIESSANLAGE);
    expect(fall('projekt', 'schliessanlagen', 'projektkonfigurator', { quelle: PLANER_QUELLE })).toBe(SCHRITTE_PLANER);
    expect(fall('projekt', 'elektronische-zutrittsloesungen', 'projektkonfigurator')).toBe(SCHRITTE_ZUTRITT);
    expect(fall('termin', 'autoschluessel', 'termin-mit-anzahlung')).toBe(SCHRITTE_NACH_ART.termin);
    expect(fall('partner', 'service-und-termin', 'gefuehrte-anfrage')).toBe(SCHRITTE_NACH_ART.partner);
    expect(fall('bestellung', 'schluessel-nach-code', 'kasse')).toBe(SCHRITTE_NACH_ART.bestellung);
  });

  it('folgt bei Foto-Anfragen derselben Regel wie die Foto-Freigabe, auch für die allgemeine Anfrage zum Thema', () => {
    for (const thema of ['schluessel-nach-vorlage', 'sicherheitstechnik', 'schliessanlagen', 'service-und-termin']) {
      const vorgang = { kind: 'anfrage' as const, area: thema as never, process: 'gefuehrte-anfrage' as never, payload: { thema } };
      expect(naechsteSchritte(vorgang) === SCHRITTE_FOTOANFRAGE).toBe(istFotoanfrage(vorgang));
    }
    const allgemein = (thema: string) => naechsteSchritte({ kind: 'anfrage', area: thema as never, process: 'gefuehrte-anfrage', payload: { thema } });
    expect(allgemein('sicherheitstechnik')).toBe(SCHRITTE_SICHERHEITSTECHNIK);
    expect(allgemein('service-und-termin')).toBe(SCHRITTE_NACH_ART.anfrage);
  });

  it('sagt bei der Foto-Anfrage weder Fertigung noch Einsendung vorab zu (R4, R13)', () => {
    const text = SCHRITTE_FOTOANFRAGE.map((s) => s.text).join(' ');
    expect(text).toContain('keine Fertigungszusage');
    expect(text).toContain('Sicherungskarte');
    expect(text).toContain('nichts unaufgefordert');
  });
});

describe('Gemeinsame Bestätigung in allen Anfrage-Wegen (G-38)', () => {
  const WEGE = [
    'src/app/(site)/service-und-termin/anfrage/anfrage-formular.tsx',
    'src/app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx',
    'src/app/(site)/sicherheitstechnik/sicherheitscheck/sicherheitscheck.tsx',
    'src/app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx',
    'src/app/(site)/elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx',
    'src/app/(site)/partner-werden/partner-formular.tsx',
    'src/components/konfigurator/schliessplan-planer.tsx',
  ];

  it('endet in jedem Weg mit WegBestaetigung und Schritten aus lib/wege/naechste-schritte', () => {
    for (const datei of WEGE) {
      const quelltext = readFileSync(datei, 'utf8');
      expect(quelltext, datei).toContain('<WegBestaetigung');
      expect(quelltext, datei).toContain("from '@/lib/wege/naechste-schritte'");
      // Keine eigene Erfolgsansicht mehr neben der gemeinsamen.
      expect(quelltext, datei).not.toContain('Ihre Vorgangsnummer');
    }
  });

  it('zeigt auf der Statusseite dieselben Schritte', () => {
    const seite = readFileSync('src/app/(site)/bestellung/[id]/page.tsx', 'utf8');
    expect(seite).toContain('naechsteSchritte(record)');
    expect(seite).not.toMatch(/const SCHRITTE\b/);
  });
});
