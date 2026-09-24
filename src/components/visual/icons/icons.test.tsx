import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { IconProps } from './icon-base';
// Bereiche
import { IconAutoschluessel } from './autoschluessel';
import { IconSchluesselNachVorlage } from './schluessel-nach-vorlage';
import { IconSchluesselNachCode } from './schluessel-nach-code';
import { IconGleichschliessendeZylinder } from './gleichschliessende-zylinder';
import { IconSchliessanlagen } from './schliessanlagen';
import { IconElektronischeZutrittsloesungen } from './elektronische-zutrittsloesungen';
import { IconTuerUndSchliesstechnik } from './tuer-und-schliesstechnik';
import { IconSicherheitstechnik } from './sicherheitstechnik';
import { IconServiceUndTermin } from './service-und-termin';
// Autoschlüssel
import { IconKlappschluessel } from './klappschluessel';
import { IconFunkschluessel } from './funkschluessel';
import { IconSmartKey } from './smart-key';
import { IconTransponder } from './transponder';
import { IconSchluesselProgrammieren } from './schluessel-programmieren';
import { IconSchluesselbartFraesen } from './schluesselbart-fraesen';
import { IconFahrzeugoeffnung } from './fahrzeugoeffnung';
import { IconSchluesselKopieren } from './schluessel-kopieren';
import { IconFahrzeugmarke } from './fahrzeugmarke';
// Zylinder & Tür
import { IconProfilzylinder } from './profilzylinder';
import { IconHalbzylinder } from './halbzylinder';
import { IconKnaufzylinder } from './knaufzylinder';
import { IconZylinderMass } from './zylinder-mass';
import { IconSicherungskarte } from './sicherungskarte';
import { IconEinsteckschloss } from './einsteckschloss';
import { IconMehrfachverriegelung } from './mehrfachverriegelung';
import { IconSchutzbeschlag } from './schutzbeschlag';
import { IconTuerzusatzschloss } from './tuerzusatzschloss';
import { IconTuerschliesser } from './tuerschliesser';
import { IconPanikFluchttuer } from './panik-fluchttuer';
import { IconReparaturAustausch } from './reparatur-austausch';
import { IconTechnischeBeratung } from './technische-beratung';
import { IconMontage } from './montage';
// Sicherheit
import { IconVideoueberwachung } from './videoueberwachung';
import { IconAlarmtechnik } from './alarmtechnik';
import { IconAussenhautsicherung } from './aussenhautsicherung';
import { IconMechanischerSchutz } from './mechanischer-schutz';
import { IconSmarteFunktionen } from './smarte-funktionen';
import { IconPanikAlarmtaster } from './panik-alarmtaster';
import { IconKombinierteKonzepte } from './kombinierte-konzepte';
import { IconSicherheitscheck } from './sicherheitscheck';
// Shop & Ablauf
import { IconWarenkorb } from './warenkorb';
import { IconVersandPaket } from './versand-paket';
import { IconLieferung } from './lieferung';
import { IconZahlung } from './zahlung';
import { IconAnzahlung } from './anzahlung';
import { IconTermin } from './termin';
import { IconFotoHochladen } from './foto-hochladen';
import { IconPruefung } from './pruefung';
import { IconBeratungTelefon } from './beratung-telefon';
import { IconWerkstatt } from './werkstatt';
import { IconStandort } from './standort';
import { IconNachweis } from './nachweis';
import { IconRueckgabe } from './rueckgabe';
import { IconDatenschutz } from './datenschutz';

/** Dateiname (ohne Endung) → Komponente. Jede Icon-Datei im Ordner muss hier stehen. */
const ICONS: Record<string, ComponentType<IconProps>> = {
  // Bereiche
  autoschluessel: IconAutoschluessel,
  'schluessel-nach-vorlage': IconSchluesselNachVorlage,
  'schluessel-nach-code': IconSchluesselNachCode,
  'gleichschliessende-zylinder': IconGleichschliessendeZylinder,
  schliessanlagen: IconSchliessanlagen,
  'elektronische-zutrittsloesungen': IconElektronischeZutrittsloesungen,
  'tuer-und-schliesstechnik': IconTuerUndSchliesstechnik,
  sicherheitstechnik: IconSicherheitstechnik,
  'service-und-termin': IconServiceUndTermin,
  // Autoschlüssel
  klappschluessel: IconKlappschluessel,
  funkschluessel: IconFunkschluessel,
  'smart-key': IconSmartKey,
  transponder: IconTransponder,
  'schluessel-programmieren': IconSchluesselProgrammieren,
  'schluesselbart-fraesen': IconSchluesselbartFraesen,
  fahrzeugoeffnung: IconFahrzeugoeffnung,
  'schluessel-kopieren': IconSchluesselKopieren,
  fahrzeugmarke: IconFahrzeugmarke,
  // Zylinder & Tür
  profilzylinder: IconProfilzylinder,
  halbzylinder: IconHalbzylinder,
  knaufzylinder: IconKnaufzylinder,
  'zylinder-mass': IconZylinderMass,
  sicherungskarte: IconSicherungskarte,
  einsteckschloss: IconEinsteckschloss,
  mehrfachverriegelung: IconMehrfachverriegelung,
  schutzbeschlag: IconSchutzbeschlag,
  tuerzusatzschloss: IconTuerzusatzschloss,
  tuerschliesser: IconTuerschliesser,
  'panik-fluchttuer': IconPanikFluchttuer,
  'reparatur-austausch': IconReparaturAustausch,
  'technische-beratung': IconTechnischeBeratung,
  montage: IconMontage,
  // Sicherheit
  videoueberwachung: IconVideoueberwachung,
  alarmtechnik: IconAlarmtechnik,
  aussenhautsicherung: IconAussenhautsicherung,
  'mechanischer-schutz': IconMechanischerSchutz,
  'smarte-funktionen': IconSmarteFunktionen,
  'panik-alarmtaster': IconPanikAlarmtaster,
  'kombinierte-konzepte': IconKombinierteKonzepte,
  sicherheitscheck: IconSicherheitscheck,
  // Shop & Ablauf
  warenkorb: IconWarenkorb,
  'versand-paket': IconVersandPaket,
  lieferung: IconLieferung,
  zahlung: IconZahlung,
  anzahlung: IconAnzahlung,
  termin: IconTermin,
  'foto-hochladen': IconFotoHochladen,
  pruefung: IconPruefung,
  'beratung-telefon': IconBeratungTelefon,
  werkstatt: IconWerkstatt,
  standort: IconStandort,
  nachweis: IconNachweis,
  rueckgabe: IconRueckgabe,
  datenschutz: IconDatenschutz,
};

const ICON_DIR = path.dirname(fileURLToPath(import.meta.url));

/** Alle Icon-Dateien im Ordner (ohne `icon-base*` und Tests), als Namen ohne Endung. */
function iconFiles(): string[] {
  return fs
    .readdirSync(ICON_DIR)
    .filter((file) => file.endsWith('.tsx') && !file.startsWith('icon-base') && !file.includes('.test.'))
    .map((file) => file.replace(/\.tsx$/, ''))
    .sort();
}

/** `schluessel-nach-code` → `IconSchluesselNachCode`. */
function componentName(file: string): string {
  return `Icon${file
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')}`;
}

/** Feste Farben, ids, Texte und Effekte, die in Fach-Icons nichts verloren haben. */
const FORBIDDEN: RegExp[] = [
  /#[0-9a-f]{3,8}\b/i,
  /rgba?\(/i,
  /hsla?\(/i,
  /oklch\(/i,
  /\sid="/,
  /<text/,
  /gradient/i,
  /<mask/,
  /<filter/,
  /<pattern/,
  /url\(/,
];

const entries = Object.entries(ICONS);

describe('Fach-Icons: Vollständigkeit', () => {
  it('jede Icon-Datei ist importiert und eingetragen', () => {
    const files = iconFiles();
    expect(entries.length).toBe(files.length);
    expect(Object.keys(ICONS).sort()).toEqual(files);
  });

  it('Komponentennamen folgen dem Dateinamen', () => {
    for (const [file, Icon] of entries) {
      expect(Icon.name, file).toBe(componentName(file));
    }
  });

  it('Quelltexte sind Server-Komponenten ohne Zufall', () => {
    for (const file of iconFiles()) {
      const source = fs.readFileSync(path.join(ICON_DIR, `${file}.tsx`), 'utf8');
      expect(source, file).not.toMatch(/['"]use client['"]/);
      expect(source, file).not.toContain('Math.random');
      expect(source, file).toContain("from './icon-base'");
    }
  });
});

describe.each(entries)('Fach-Icon %s', (_file, Icon) => {
  const plain = renderToStaticMarkup(<Icon />);

  it('nutzt das 48er-Raster mit Kontur in currentColor', () => {
    expect(plain).toContain('viewBox="0 0 48 48"');
    expect(plain).toContain('stroke="currentColor"');
    expect(plain).toContain('stroke-width="2"');
    const strokes = [...plain.matchAll(/\sstroke="([^"]*)"/g)].map((match) => match[1]);
    expect(strokes.every((value) => value === 'currentColor' || value === 'none')).toBe(true);
    expect(plain.match(/stroke-width=/g)).toHaveLength(1);
  });

  it('ist ohne Titel dekorativ', () => {
    expect(plain).toContain('aria-hidden="true"');
    expect(plain).not.toContain('role="img"');
    expect(plain).not.toContain('<title>');
  });

  it('wird mit Titel als Bild angesagt', () => {
    const html = renderToStaticMarkup(<Icon title="Testtitel" />);
    expect(html).toContain('role="img"');
    expect(html).toContain('<title>Testtitel</title>');
    expect(html).not.toContain('aria-hidden');
  });

  it('enthält keine festen Farben, ids, Texte oder Effekte', () => {
    for (const pattern of FORBIDDEN) {
      expect(plain).not.toMatch(pattern);
    }
  });

  it('hat eine Zweitonfläche ohne eigene Kontur', () => {
    const areas = plain.match(/<[a-z]+ [^>]*class="fill-area(?:-muted)?"[^>]*>/g) ?? [];
    expect(areas.length).toBeGreaterThan(0);
    for (const element of areas) {
      expect(element).toContain('stroke="none"');
    }
  });

  it('übernimmt die Größe', () => {
    const html = renderToStaticMarkup(<Icon size={24} />);
    expect(html).toContain('width="24"');
    expect(html).toContain('height="24"');
  });
});
