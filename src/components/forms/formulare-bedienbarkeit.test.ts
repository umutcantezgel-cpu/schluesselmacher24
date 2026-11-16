import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { gesperrtHinweis } from '@/app/(site)/schliessanlagen/konfigurator/projekt-konfigurator';

/*
 * Sammeltest FA-QA-02 (Arbeitsanweisung Abschnitt 26, Bedienbarkeit auch für ältere Kunden): Jedes
 * mehrstufige Formular der Liste trägt die Fortschrittsanzeige (FlowShell), einen Hilfeblock mit
 * Telefon und Rückruf und einen Fehlertext am gesperrten Knopf. Formulare mit Absenden an den Server
 * melden Fehler mit dem gemeinsamen Baustein (Angaben bleiben, noch einmal versuchen oder anrufen),
 * Formulare mit Dateien warnen vor dem Verlassen. Die Seiten geben Telefon und Erreichbarkeit aus den
 * Einstellungen mit. Die gemeinsame Fahrzeugschlüssel-Anfrage ist das Muster und hat eigene Bausteine.
 */

const wurzel = path.resolve(__dirname, '../../..');
const lies = (datei: string) => readFileSync(path.join(wurzel, datei), 'utf8');

interface Formular {
  name: string;
  datei: string;
  seite: string;
  /** Sendet an den Server (sonst: Warenkorb). */
  absenden: boolean;
  /** Nimmt Dateien an. */
  dateien: boolean;
}

const FORMULARE: Formular[] = [
  { name: 'Termin-Assistent', datei: 'src/app/(site)/autoschluessel/anfrage/assistent.tsx', seite: 'src/app/(site)/autoschluessel/anfrage/page.tsx', absenden: true, dateien: true },
  { name: 'Gehäuse-Anfrage', datei: 'src/app/(site)/autoschluessel/gehaeuse/anfrage/anfrage-formular.tsx', seite: 'src/app/(site)/autoschluessel/gehaeuse/anfrage/page.tsx', absenden: true, dateien: true },
  { name: 'Schlüssel nach Vorlage', datei: 'src/app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx', seite: 'src/app/(site)/schluessel-nach-vorlage/anfrage/page.tsx', absenden: true, dateien: true },
  { name: 'Einsendung', datei: 'src/app/(site)/schluessel-einschicken/anmelden/einsende-formular.tsx', seite: 'src/app/(site)/schluessel-einschicken/anmelden/page.tsx', absenden: true, dateien: true },
  { name: 'Zylinder-Konfigurator', datei: 'src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx', seite: 'src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx', absenden: false, dateien: false },
  { name: 'Schließanlagen', datei: 'src/app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx', seite: 'src/app/(site)/schliessanlagen/konfigurator/page.tsx', absenden: true, dateien: true },
  { name: 'Schließplan', datei: 'src/components/konfigurator/schliessplan-planer.tsx', seite: 'src/app/(site)/schliessanlagen/konfigurator/schliessplan/page.tsx', absenden: true, dateien: false },
  { name: 'Zutritt', datei: 'src/app/(site)/elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx', seite: 'src/app/(site)/elektronische-zutrittsloesungen/konfigurator/page.tsx', absenden: true, dateien: false },
  { name: 'Sicherheitscheck', datei: 'src/app/(site)/sicherheitstechnik/sicherheitscheck/sicherheitscheck.tsx', seite: 'src/app/(site)/sicherheitstechnik/sicherheitscheck/page.tsx', absenden: true, dateien: true },
  { name: 'Rückruf', datei: 'src/app/(site)/beratung/beratung-formular.tsx', seite: 'src/app/(site)/beratung/page.tsx', absenden: true, dateien: true },
  { name: 'Anfrage zu einer Leistung', datei: 'src/app/(site)/service-und-termin/anfrage/anfrage-formular.tsx', seite: 'src/app/(site)/service-und-termin/anfrage/page.tsx', absenden: true, dateien: true },
  { name: 'Kontakt', datei: 'src/app/(site)/service-und-termin/kontakt/kontakt-formular.tsx', seite: 'src/app/(site)/service-und-termin/kontakt/page.tsx', absenden: true, dateien: true },
  { name: 'Einsatz vor Ort', datei: 'src/app/(site)/service-und-termin/vor-ort/einsatz-formular.tsx', seite: 'src/app/(site)/service-und-termin/vor-ort/page.tsx', absenden: true, dateien: true },
  { name: 'Partnerbewerbung', datei: 'src/app/(site)/partner-werden/partner-formular.tsx', seite: 'src/app/(site)/partner-werden/page.tsx', absenden: true, dateien: true },
];

describe('Bedienbarkeit aller mehrstufigen Formulare (FA-QA-02, FA Abschnitt 26)', () => {
  it.each(FORMULARE)('$name: Fortschritt, Hilfeblock und Fehlertext am gesperrten Knopf', ({ datei }) => {
    const quelle = lies(datei);
    expect(quelle).toContain('<FlowShell');
    expect(quelle).toMatch(/<HilfeBlock\b[^>]*hilfe=\{hilfe\}/);
    expect(quelle).toMatch(/blockedHint=\{/);
    // Kein bloßer Verweis auf die Sterne statt des Fehlenden.
    expect(quelle).not.toMatch(/blockedHint="Bitte füllen Sie die (?:mit Stern gekennzeichneten Angaben|Pflichtangaben dieses Schrittes) aus\."/);
  });

  it.each(FORMULARE.filter((f) => f.absenden))('$name: Fehler beim Absenden mit dem gemeinsamen Baustein', ({ datei }) => {
    const quelle = lies(datei);
    expect(quelle).toMatch(/<AbsendeFehler fehler=\{\w+\} hilfe=\{hilfe\}/);
    // Ein Verbindungsfehler bleibt nicht beim drehenden Knopf hängen.
    expect(quelle).toMatch(/catch\s*\{/);
  });

  it.each(FORMULARE.filter((f) => f.dateien))('$name: Warnung vor dem Verlassen, solange Dateien gewählt sind', ({ datei }) => {
    const quelle = lies(datei);
    expect(quelle).toMatch(/ungesichert=\{/);
    expect(quelle).toMatch(/\bmitDateien\b/);
  });

  it.each(FORMULARE)('$name: die Seite gibt Telefon und Erreichbarkeit aus den Einstellungen mit', ({ seite }) => {
    expect(lies(seite)).toMatch(/hilfe=\{hilfeAus\(|erreichbarkeit=\{erreichbarkeit\(settings\)\}/);
  });

  it.each(FORMULARE.filter((f) => /beratung-formular|kontakt-formular/.test(f.datei)))(
    '$name: „Lieber gleich anrufen?“ nur mit veröffentlichter Nummer',
    ({ datei }) => {
      expect(lies(datei)).toMatch(/\{hilfe\?\.telefon && \(\s*<HilfeBlock\b[^>]*titel="Lieber gleich anrufen\?"/);
    },
  );

  /* FA-QA-04B: Schritte in der Browser-Historie. Der gemeinsame Ablauf (useFlow und FlowShell) legt je Schritt
     nach vorn einen Eintrag an; kein Formular darf daran vorbei eigene Schritte in die Historie schreiben oder
     sie zurücksetzen. Die Konfiguratoren bereinigen nur ihre Adresse (Link mit Zwischenstand, KE5); den
     Schritteintrag stellt der Abgleich danach wieder her. */
  const MIT_MUSTER = [...FORMULARE, { name: 'Muster Fahrzeugschlüssel', datei: 'src/components/fahrzeug-anfrage/formular.tsx' }];

  it.each(MIT_MUSTER)('$name: Schritte über den gemeinsamen Ablauf, keine eigenen Historieneinträge', ({ datei }) => {
    const quelle = lies(datei);
    expect(quelle).toMatch(/<FlowShell\b[\s\S]{0,200}flow=\{\w+\}/);
    expect(quelle).toMatch(/\buseFlow\b|\buseFahrzeugAnfrage\(/);
    expect(quelle).not.toMatch(/history\.(?:pushState|go|back|forward)\(/);
    // Nur die Bereinigung der Adresse ersetzt einen Eintrag (Konfiguratoren).
    for (const treffer of quelle.match(/history\.replaceState\([^)]*\)/g) ?? []) {
      expect(treffer).toBe("history.replaceState(null, '', window.location.pathname)");
    }
  });

  it('der gemeinsame Ablauf legt Schritte in die Historie und die FlowShell stimmt die Rückfrage darauf ab', () => {
    const flow = lies('src/lib/flow/use-flow.ts');
    expect(flow).toMatch(/historie\.vor\(von, target\)/);
    expect(flow).toMatch(/historie\.zurueck\(target\)/);
    expect(flow).toMatch(/addEventListener\('popstate'/);
    const shell = lies('src/components/flow/flow-shell.tsx');
    expect(shell).toMatch(/wache: !historie \|\| amAnfang/);
    expect(shell).toMatch(/historie\?\.setzeFreigabe\(/);
  });

  it('das Muster Fahrzeugschlüssel fragt vor dem Verlassen wie die anderen (ungesichert, mitDateien)', () => {
    const quelle = lies('src/components/fahrzeug-anfrage/formular.tsx');
    expect(quelle).toMatch(/ungesichert=\{/);
    expect(quelle).toMatch(/\bmitDateien\b/);
  });

  it('Zylinder: „Maß unbekannt“ führt direkt zur Anleitung', () => {
    expect(lies('src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx')).toContain('href="/gleichschliessende-zylinder#messen"');
  });

  it('Gehäuse: der Hilfesatz nennt die Erstzulassung statt eines Baujahrs im Fahrzeugschein', () => {
    const quelle = lies('src/app/(site)/autoschluessel/gehaeuse/anfrage/anfrage-formular.tsx');
    expect(quelle).toContain('Jahr der Erstzulassung (Feld B)');
    expect(quelle).not.toContain('Baujahr stehen im Fahrzeugschein');
  });

  it('das Muster (gemeinsame Fahrzeugschlüssel-Anfrage) trägt Fortschritt, Hilfe und Hinweis am Knopf', () => {
    const quelle = lies('src/components/fahrzeug-anfrage/formular.tsx');
    expect(quelle).toContain('<FlowShell');
    expect(quelle).toContain('<HilfeBeiUnterlagen');
    expect(quelle).toContain('<HilfeAmFahrzeug');
    expect(quelle).toMatch(/blockedHint=\{blockedHints\[/);
  });

  it('Gehäuse, Vorlage und Einsendung führen nach einem Neuladen zum Schritt mit den fehlenden Dateien', () => {
    expect(lies('src/app/(site)/autoschluessel/gehaeuse/anfrage/anfrage-formular.tsx')).toMatch(/<OffenerSchritt[\s\S]{0,160}flow\.goTo\('unterlagen'\)/);
    const vorlage = lies('src/app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx');
    expect(vorlage).toMatch(/<OffenerSchritt[\s\S]{0,160}flow\.goTo\('nummern'\)/);
    expect(vorlage).toContain("flow.goTo('foto-vorderseite')");
    const einsendung = lies('src/app/(site)/schluessel-einschicken/anmelden/einsende-formular.tsx');
    // Das Absenden ist ohne das Foto der Karte gesperrt, wie der Schritt Nachweis (R13 unverändert).
    expect(einsendung).toMatch(/\(flow\.step\?\.id === 'nachweis' \|\| flow\.step\?\.id === 'absenden'\) && karteFehlt/);
    expect(einsendung).toContain("flow.goTo('nachweis')");
  });

  it('Maß unbekannt ist in den Zylinderwegen kein Ende des Wegs', () => {
    for (const datei of [
      'src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx',
      'src/components/konfigurator/schliessplan-planer.tsx',
      'src/app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx',
    ]) {
      expect(lies(datei)).toMatch(/<HilfeBlock[\s\S]{0,80}stelle="masse"[\s\S]{0,80}titel="Maß (?:unbekannt|oder Zylindertyp unbekannt)/);
    }
  });

  it('Preis- und Zahlungsschritte tragen Telefon und Rückruf', () => {
    expect(lies('src/app/(site)/autoschluessel/anfrage/assistent.tsx')).toMatch(/flow\.step\.id === 'preis' \|\| flow\.step\.id === 'anzahlung'\) && \(\s*<HilfeBlock/);
    expect(lies('src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx')).toContain('stelle="preis"');
    expect(lies('src/components/konfigurator/schliessplan-planer.tsx')).toContain('stelle="preis"');
  });

  it('der Schließanlagen-Konfigurator nennt je Schritt, was fehlt', () => {
    for (const schritt of ['kundentyp', 'objekt', 'nutzer', 'bestand', 'erweiterung', 'tueren', 'berechtigungen', 'schluessel', 'service', 'abschluss']) {
      const satz = gesperrtHinweis({ customerType: '', hasExisting: '' } as Parameters<typeof gesperrtHinweis>[0], schritt);
      expect(satz, schritt).toMatch(/^Bitte .+\.$/);
      expect(satz, schritt).not.toMatch(/[–—]/);
    }
    const mehrere = gesperrtHinweis({ customerType: 'mehrere-liegenschaften' } as Parameters<typeof gesperrtHinweis>[0], 'objekt');
    expect(mehrere).toContain('mindestens zwei Liegenschaften');
  });
});
