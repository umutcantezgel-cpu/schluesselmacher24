import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { ablaufSchritte } from '@/components/visual/generators/ablauf';

import {
  GEWINNUNG_SEITEN,
  HAUPTSEITE_ZAHLWEG,
  NUR_FAHRZEUGSCHLUESSEL,
  PARTNER_LEISTUNGEN,
  PARTNER_QUALITAET,
  PARTNER_REGIONEN,
  PARTNER_SEKTION,
  ZAHLWEG,
  aktiverZahlweg,
  gewinnungSeite,
  gewinnungSeitenFuer,
  partnerSektionFuer,
  weitereGewinnungSeiten,
} from './gewinnung';

/* Regeln der Partnerseiten (FA-PLATTFORM-02): eigene Seiten statt Brückenseiten (R2, R3),
 * nichts erfunden (R4), nur Fahrzeugschlüssel (FA-07-02), Sprache nach Abschnitt 02. */

const MARKENZUSATZ = ' | SCHLÜSSELMACHER24';
const SITE = path.resolve(__dirname, '../../app/(site)');

/** Alle Zeichenketten eines Werts, rekursiv. */
function texte(wert: unknown): string[] {
  if (typeof wert === 'string') return [wert];
  if (Array.isArray(wert)) return wert.flatMap(texte);
  if (wert && typeof wert === 'object') return Object.values(wert).flatMap(texte);
  return [];
}

/** Texte, die Leser sehen (ohne Pfade, Kennungen und Icon-Namen). */
function sichtbareTexte(wert: unknown): string[] {
  return texte(wert).filter((t) => !t.startsWith('/') && !/^[a-z0-9-]+$/.test(t));
}

const MODELLE = ['A', 'B'] as const;
const ALLE = [
  ...MODELLE.flatMap((m) => [gewinnungSeitenFuer(m), partnerSektionFuer(m)]),
  ZAHLWEG,
  PARTNER_LEISTUNGEN,
  PARTNER_QUALITAET,
  NUR_FAHRZEUGSCHLUESSEL,
];

describe('Partnergewinnung: Seitendaten', () => {
  it('führt genau die vier Seiten unter /partner-werden', () => {
    expect(GEWINNUNG_SEITEN.map((s) => s.pfad)).toEqual([
      '/partner-werden/auftraege-erhalten',
      '/partner-werden/netzwerk-deutschland',
      '/partner-werden/kfz-betriebe',
      '/partner-werden/kooperation',
    ]);
    for (const seite of GEWINNUNG_SEITEN) {
      expect(seite.pfad).toBe(`/partner-werden/${seite.slug}`);
      expect(gewinnungSeite(seite.slug)).toBe(seite);
      expect(existsSync(path.join(SITE, 'partner-werden', seite.slug, 'page.tsx'))).toBe(true);
    }
  });

  it('gibt jeder Seite eigenen Titel, eigene Beschreibung und eigene Überschrift', () => {
    for (const feld of ['titel', 'beschreibung', 'ueberschrift', 'einleitung', 'kurzname'] as const) {
      const werte = GEWINNUNG_SEITEN.map((s) => s[feld]);
      expect(new Set(werte).size, feld).toBe(werte.length);
    }
  });

  it('hält Titel bis 60 Zeichen (auch mit Markenzusatz) und Beschreibung bei 120 bis 160 Zeichen', () => {
    for (const seite of MODELLE.flatMap((m) => gewinnungSeitenFuer(m))) {
      expect([...seite.titel].length, seite.slug).toBeLessThanOrEqual(60);
      expect([...`${seite.titel}${MARKENZUSATZ}`].length, seite.slug).toBeLessThanOrEqual(60);
      const laenge = [...seite.beschreibung].length;
      expect(laenge, `${seite.slug}: ${laenge}`).toBeGreaterThanOrEqual(120);
      expect(laenge, `${seite.slug}: ${laenge}`).toBeLessThanOrEqual(160);
    }
  });

  it('hat je Seite mindestens drei eigene Abschnitte, die auf keiner anderen Seite stehen', () => {
    const ids = GEWINNUNG_SEITEN.flatMap((s) => s.abschnitte.map((a) => a.id));
    expect(new Set(ids).size).toBe(ids.length);
    const ueberschriften = GEWINNUNG_SEITEN.flatMap((s) => [
      s.ueberschrift,
      ...(s.ablauf ? [s.ablauf.ueberschrift] : []),
      ...s.abschnitte.map((a) => a.ueberschrift),
    ]);
    expect(new Set(ueberschriften).size).toBe(ueberschriften.length);

    for (const seite of GEWINNUNG_SEITEN) {
      const eigene = seite.abschnitte.filter((a) => !a.baustein);
      expect(eigene.length, seite.slug).toBeGreaterThanOrEqual(3);
    }
  });

  it('wiederholt keinen Absatz und keinen Punkt auf einer zweiten Seite', () => {
    const inhalte = GEWINNUNG_SEITEN.flatMap((s) =>
      s.abschnitte.flatMap((a) => [...(a.absaetze ?? []), ...(a.punkte ?? []).map((p) => p.text), ...(a.liste ?? [])]),
    );
    expect(new Set(inhalte).size).toBe(inhalte.length);
  });

  it('zeigt Leistungsliste und Qualitätsstandard höchstens auf zwei Seiten in voller Länge', () => {
    // Die Hauptseite /partner-werden zeigt die Leistungsliste ebenfalls.
    const leistungen = 1 + GEWINNUNG_SEITEN.filter((s) => s.abschnitte.some((a) => a.baustein === 'leistungen')).length;
    const qualitaet = GEWINNUNG_SEITEN.filter((s) => s.abschnitte.some((a) => a.baustein === 'qualitaet')).length;
    expect(leistungen).toBeLessThanOrEqual(2);
    expect(qualitaet).toBeLessThanOrEqual(2);
  });

  it('endet auf jeder Seite mit einem nächsten Schritt zu einer bestehenden Route', () => {
    const ziele = GEWINNUNG_SEITEN.flatMap((s) => [
      s.naechsterSchritt.primaer.href,
      ...(s.naechsterSchritt.sekundaer ? [s.naechsterSchritt.sekundaer.href] : []),
      ...s.abschnitte.flatMap((a) => (a.verweis ? [a.verweis.href] : [])),
    ]);
    for (const ziel of [...ziele, PARTNER_SEKTION.knopf.href, PARTNER_SEKTION.verweis.href]) {
      const route = ziel.split(/[#?]/)[0];
      expect(existsSync(path.join(SITE, route, 'page.tsx')), ziel).toBe(true);
    }
    for (const seite of GEWINNUNG_SEITEN) {
      expect(weitereGewinnungSeiten(seite.slug)).toHaveLength(GEWINNUNG_SEITEN.length - 1);
      expect(weitereGewinnungSeiten(seite.slug)).not.toContain(seite);
    }
  });

  it('beschreibt den Weg eines Auftrags in Stationen, die der Ablauf-Generator zeichnen kann', () => {
    const begriffe = {
      A: ['Anfrage', 'Region', 'freigeschalteten', 'Abstimmung', 'direkt mit dem Kunden', 'Vermittlungsprovision'],
      B: ['Anfrage', 'Region', 'Zahlung', 'freigeschalteten', 'Bestätigung', 'Auszahlung'],
    };
    for (const modell of MODELLE) {
      const { ablauf } = gewinnungSeitenFuer(modell).find((s) => s.slug === 'auftraege-erhalten')!;
      expect(ablauf).toBeDefined();
      expect(ablaufSchritte({ schritte: ablauf!.stationen.join('|') })).toEqual(ablauf!.stationen);
      expect(ablauf!.schritte).toHaveLength(ablauf!.stationen.length);
      const text = texte(ablauf).join(' ');
      for (const begriff of begriffe[modell]) expect(text, `${modell}: ${begriff}`).toContain(begriff);
    }
  });

  it('übernimmt das Canonical jeder Route aus dem Pfad der Seitendaten', () => {
    for (const seite of GEWINNUNG_SEITEN) {
      const quelle = readFileSync(path.join(SITE, 'partner-werden', seite.slug, 'page.tsx'), 'utf8');
      expect(quelle, seite.slug).toContain(`gewinnungSeite('${seite.slug}')`);
      expect(quelle, seite.slug).toContain('canonical: SEITE.pfad');
    }
  });
});

describe('Partnergewinnung: ein Zahlweg auf allen Seiten (G9)', () => {
  it('nimmt ohne Schalter Modell A, wie src/lib/partner/abrechnung.ts', () => {
    expect(aktiverZahlweg({})).toBe('A');
    expect(aktiverZahlweg({ PARTNERMODELL_B: 'nein' })).toBe('A');
    expect(aktiverZahlweg({ PARTNERMODELL_B: 'aktiv' })).toBe('B');
    // Im Test ist der Schalter nicht gesetzt: live steht Modell A.
    expect(aktiverZahlweg()).toBe('A');
    expect(HAUPTSEITE_ZAHLWEG).toBe(ZAHLWEG.A.hauptseite);
    expect(PARTNER_SEKTION.punkte).toContain(ZAHLWEG.A.sektionPunkt);
  });

  it('nennt auf Hauptseite, Partnerseiten und Startseiten-Sektion denselben Zahlweg', () => {
    for (const modell of MODELLE) {
      const anderes = modell === 'A' ? 'B' : 'A';
      const eigen = ZAHLWEG[modell].kennzeichen;
      const fremd = ZAHLWEG[anderes].kennzeichen;
      const hauptseite = texte(ZAHLWEG[modell].hauptseite).join(' ');
      const partnerseiten = texte(gewinnungSeitenFuer(modell)).join(' ');
      const sektion = texte(partnerSektionFuer(modell)).join(' ');
      expect(hauptseite, modell).toContain(eigen);
      expect(partnerseiten, modell).toContain(eigen);
      for (const text of [hauptseite, partnerseiten, sektion]) expect(text, modell).not.toContain(fremd);
    }
    // Modell A kennt keine zentrale Zahlung, Freigabe nach Zahlung oder Auszahlung.
    const textA = texte([gewinnungSeitenFuer('A'), partnerSektionFuer('A'), ZAHLWEG.A]).join(' ');
    expect(textA).not.toMatch(/Auszahlung|zahlen wir|über die Plattform|nach der Zahlung/i);
  });

  it('schreibt den Zahlweg auf der Hauptseite nicht fest, sondern liest ihn aus den Daten', () => {
    const quelle = readFileSync(path.join(SITE, 'partner-werden', 'page.tsx'), 'utf8');
    expect(quelle).toContain('HAUPTSEITE_ZAHLWEG');
    expect(quelle).not.toMatch(/rechnet direkt|Vermittlungsprovision in Rechnung|zentral an/);
  });
});

describe('Partnergewinnung: Inhalt nach den Vorgaben des Inhabers', () => {
  it('führt die neun Partnerleistungen, keine Türöffnung als Leistung', () => {
    expect(PARTNER_LEISTUNGEN).toHaveLength(9);
    for (const leistung of PARTNER_LEISTUNGEN) {
      expect(`${leistung.titel} ${leistung.text}`).not.toMatch(/türöffnung|schließanlage|zutritt|montage/i);
    }
    expect(PARTNER_LEISTUNGEN.find((l) => l.titel.startsWith('Fahrzeugöffnung'))?.titel).toMatch(/im Zusammenhang mit Autoschlüsseln/);
  });

  it('nennt die Qualitätskontrolle mit Besuch vor Ort und Pausieren oder Sperren', () => {
    expect(PARTNER_QUALITAET.find((p) => p.titel === 'Besuch vor Ort')?.text).toMatch(/nach Möglichkeit/);
    const text = texte(PARTNER_QUALITAET).join(' ');
    for (const begriff of ['Identität', 'Fahrzeuge', 'Programmiergeräte', 'Radius', 'besuchen', 'schriftlich', 'gesperrt']) {
      expect(text).toContain(begriff);
    }
  });

  it('nennt die Bundesländer nur als Übersicht', () => {
    expect(PARTNER_REGIONEN).toHaveLength(16);
    const regionen = gewinnungSeite('netzwerk-deutschland').abschnitte.find((a) => a.id === 'netzwerk-regionen');
    expect(regionen?.liste).toEqual([...PARTNER_REGIONEN]);
    expect(regionen?.einleitung).toMatch(/nicht, dass es dort schon Partner gibt/);
  });

  it('stellt klar, dass das Netz nur Autoschlüssel und Fahrzeugschlüssel betrifft', () => {
    expect(NUR_FAHRZEUGSCHLUESSEL.text).toMatch(/ausschließlich Autoschlüssel und Fahrzeugschlüssel/);
    expect(NUR_FAHRZEUGSCHLUESSEL.text).toMatch(/Türöffnungen/);
  });

  it('nennt den Berechtigungsnachweis im Wortlaut des Bestands (RUBRIK_NACHWEISE, R13)', () => {
    const berechtigung = gewinnungSeite('kfz-betriebe').abschnitte.find((a) => a.id === 'kfz-berechtigung');
    expect(berechtigung?.absaetze?.join(' ')).toContain('Fahrzeugschein auf den Besteller oder Vollmacht');
  });

  it('verspricht keine Bewerbungsfelder, die das Formular heute nicht hat (FA-PLATTFORM-01)', () => {
    const text = texte([GEWINNUNG_SEITEN, PARTNER_SEKTION]).join(' ');
    expect(text).not.toMatch(/welche dieser Leistungen|fragen in der Bewerbung danach|melden den Auftrag als erledigt/);
  });

  it('erfindet nichts: keine Zahlen, Prozente, Beträge, Fristen oder Siegel', () => {
    for (const text of sichtbareTexte(ALLE).map((t) => t.replaceAll('SCHLÜSSELMACHER24', 'MARKE'))) {
      expect(text, text).not.toMatch(/\d|%|€|Siegel|zertifiziert|garantiert|innerhalb von|Stunden|Tagen/);
    }
  });

  it('schreibt ohne Gedankenstriche', () => {
    for (const text of texte(ALLE)) {
      expect(text, text).not.toMatch(/[–—]|\s-\s/);
    }
  });

  it('baut die Startseiten-Sektion aus Überschrift, zwei bis drei Sätzen und drei Kurzpunkten', () => {
    expect(PARTNER_SEKTION.ueberschrift).toBe('Autoschlüssel-Profi? Partner werden');
    expect(PARTNER_SEKTION.saetze.length).toBeGreaterThanOrEqual(2);
    expect(PARTNER_SEKTION.saetze.join(' ').split(/(?<=[.!?])\s+/).length).toBeLessThanOrEqual(3);
    expect(PARTNER_SEKTION.punkte).toEqual([
      'Anfragen aus Ihrer Region',
      ZAHLWEG[aktiverZahlweg()].sektionPunkt,
      'Geprüfte Betriebe, nach Möglichkeit mit Besuch vor Ort',
    ]);
    expect(partnerSektionFuer('B').punkte[1]).toBe('Zahlung läuft über die Plattform');
    // Kein Kurzpunkt verspricht den Besuch vor Ort ohne „nach Möglichkeit“ (Abschnitt 07).
    for (const punkt of PARTNER_SEKTION.punkte) {
      if (/Besuch/.test(punkt)) expect(punkt).toMatch(/nach Möglichkeit/);
    }
    expect(PARTNER_SEKTION.knopf).toEqual({ href: '/partner-werden', label: 'Partner werden' });
    expect(PARTNER_SEKTION.verweis).toEqual({ href: '/partner-werden/auftraege-erhalten', label: 'So erhalten Sie Aufträge' });
  });
});
