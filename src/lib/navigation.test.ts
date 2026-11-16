import { describe, expect, it } from 'vitest';

import { defaults } from '@/lib/data/defaults';

import { readFileSync } from 'node:fs';
import path from 'node:path';

import {
  aktiverEintrag,
  FOOTER_CONTENT,
  gruppeAktiv,
  istAktiv,
  MEHR_LINKS,
  MENUE_GRENZE,
  NAV_AREAS,
  navigationsGruppen,
  rubrikAbschnitte,
  WEITERE_FAHRZEUGE,
} from './navigation';

describe('istAktiv', () => {
  it('erkennt den gleichen Pfad und Unterpfade', () => {
    expect(istAktiv('/autoschluessel', '/autoschluessel')).toBe(true);
    expect(istAktiv('/autoschluessel/marken/volkswagen/golf', '/autoschluessel')).toBe(true);
    expect(istAktiv('/autoschluessel/', '/autoschluessel')).toBe(true);
  });

  it('verwechselt keine Pfade mit gleichem Anfang', () => {
    expect(istAktiv('/autoschluesselx', '/autoschluessel')).toBe(false);
    expect(istAktiv('/schluessel-nach-code', '/schluessel-nach-vorlage')).toBe(false);
  });

  it('behandelt die Startseite nur bei genauem Treffer als aktiv', () => {
    expect(istAktiv('/', '/')).toBe(true);
    expect(istAktiv('/ratgeber', '/')).toBe(false);
  });

  it('ignoriert Abfrage und Anker', () => {
    expect(istAktiv('/service-und-termin?x=1', '/service-und-termin')).toBe(true);
    expect(istAktiv('/service-und-termin/kontakt#karte', '/service-und-termin')).toBe(true);
  });
});

describe('aktiverEintrag', () => {
  const eintraege = ['/autoschluessel', '/schluessel-nach-code', '/autoschluessel/anfrage', '/service-und-termin'];

  it('wählt den genauesten Treffer', () => {
    expect(aktiverEintrag('/autoschluessel/anfrage', eintraege)).toBe('/autoschluessel/anfrage');
    expect(aktiverEintrag('/autoschluessel/marken', eintraege)).toBe('/autoschluessel');
    expect(aktiverEintrag('/schluessel-nach-code/ms-01', eintraege)).toBe('/schluessel-nach-code');
  });

  it('liefert nichts, wenn kein Eintrag passt', () => {
    expect(aktiverEintrag('/ratgeber', eintraege)).toBeUndefined();
  });
});

describe('Hauptnavigation nach G-08', () => {
  const rubriken = defaults.rubriken();
  const gruppen = navigationsGruppen(rubriken);

  it('hat genau die fünf Gruppen in der Reihenfolge von G-08', () => {
    expect(gruppen.map((g) => g.label)).toEqual(['Autoschlüssel', 'Schlüssel nach Code', 'Sperrschließungen', 'Schließanlagen', 'Mehr']);
  });

  it('nimmt nur Rubriken mit Status live und keine doppelt', () => {
    const ids = gruppen.flatMap((g) => g.rubriken.map((r) => r.id));
    expect(new Set(ids).size).toBe(ids.length);
    const live = rubriken.filter((r) => r.status === 'live').map((r) => r.id).sort();
    expect([...ids].sort()).toEqual(live);
  });

  it('ordnet Autoschlüssel, Code und Mehr wie in G-08 (soweit live)', () => {
    const von = (key: string) => gruppen.find((g) => g.key === key)!.rubriken.map((r) => r.id);
    expect(von('autoschluessel')).toEqual(expect.arrayContaining(['autoschluessel', 'schluesselfinder']));
    // Reihenfolge des Inhabers (FA-03): „nach Vorlage“ vor „nach Code“; „einschicken“ ohne Kachel danach.
    expect(von('code')).toEqual(['schluessel-nach-vorlage', 'schluessel-nach-code', 'schluessel-einschicken']);
    expect(von('mehr')).toEqual(expect.arrayContaining(['elektronische-schliesssysteme', 'sicherheitstechnik', 'tuer-und-schliesstechnik']));
  });

  it('nimmt eine Rubrik auf, sobald sie live geht (G-11: ohne Umbau)', () => {
    const mitMotorrad = navigationsGruppen(rubriken.map((r) => (r.id === 'motorradschluessel' ? { ...r, status: 'live' as const } : r)));
    expect(mitMotorrad.find((g) => g.key === 'autoschluessel')!.rubriken.map((r) => r.id)).toContain('motorradschluessel');
  });

  it('führt die vier neuen Fahrzeugklassen unter „Weitere Fahrzeuge“ in der Gruppe Autoschlüssel (FA-03)', () => {
    const auto = gruppen.find((g) => g.key === 'autoschluessel')!;
    const abschnitte = rubrikAbschnitte(auto.rubriken);
    expect(abschnitte.map((a) => a.titel)).toEqual([undefined, WEITERE_FAHRZEUGE]);
    expect(abschnitte[0].rubriken.map((r) => r.id)).toEqual(expect.arrayContaining(['autoschluessel', 'motorradschluessel', 'autoschluessel-gehaeuse']));
    expect(abschnitte[1].rubriken.map((r) => r.label)).toEqual([
      'Roller und Kleinstfahrzeuge',
      'E-Scooter und ähnliche Elektrofahrzeuge',
      'Seniorenmobile und vergleichbare Fahrzeuge',
      'Fahrradschlüssel',
    ]);
    expect(abschnitte[1].rubriken.map((r) => r.href)).toEqual(['/roller-und-kleinstfahrzeuge', '/e-scooter', '/seniorenmobile', '/fahrradschluessel']);
  });

  it('führt „Fahrzeug nicht gefunden?“ unter Autoschlüssel', () => {
    const links = NAV_AREAS.find((a) => a.key === 'autoschluessel')!.columns.flatMap((c) => c.links);
    expect(links).toContainEqual(expect.objectContaining({ href: '/autoschluessel/fahrzeug-nicht-gefunden', label: 'Fahrzeug nicht gefunden?' }));
  });

  it('nennt Zutritt, Vor Ort und die allgemeine Anfrage mit den Namen des Inhabers; die Beratung bleibt unter Mehr', () => {
    const labels = gruppen.flatMap((g) => g.rubriken.map((r) => r.label));
    expect(labels).toEqual(expect.arrayContaining(['Elektronische Zutrittslösungen', 'Service vor Ort nach Termin', 'Allgemeine Anfrage']));
    expect(labels).not.toEqual(expect.arrayContaining(['Elektronische Schließsysteme']));
    expect(labels.some((l) => /Schlüsseldienst vor Ort/.test(l))).toBe(false);
    const mehr = gruppen.find((g) => g.key === 'mehr')!;
    expect(mehr.rubriken.find((r) => r.id === 'beratung')?.href).toBe('/beratung');
  });

  it('gibt keinem Rubriknamen ein zweites Ziel (ein Name je Ziel, FA-SOFORT-05)', () => {
    // Ein Link, der wie eine Rubrik heißt, führt auf deren Seite (etwa „Allgemeine Anfrage“ nur nach /beratung).
    const rubrikZiel = new Map(gruppen.flatMap((g) => g.rubriken.map((r) => [r.label, r.href] as const)));
    const links = [...NAV_AREAS.flatMap((a) => a.columns.flatMap((c) => c.links)), ...MEHR_LINKS];
    const abweichend = links.filter((l) => rubrikZiel.has(l.label) && rubrikZiel.get(l.label) !== l.href).map((l) => `${l.label}: ${l.href}`);
    expect(abweichend).toEqual([]);
    // Die Spalte Service nennt die Vor-Ort-Seite wie die Rubrik.
    const service = NAV_AREAS.find((a) => a.key === 'service-und-termin')!.columns.flatMap((c) => c.links);
    expect(service).toContainEqual(expect.objectContaining({ href: '/service-und-termin/vor-ort', label: 'Service vor Ort nach Termin' }));
    expect(service.some((l) => l.label === 'Allgemeine Anfrage')).toBe(false);
  });

  it('rubrikAbschnitte lässt Gruppen ohne Zwischenzeile unverändert', () => {
    const code = gruppen.find((g) => g.key === 'code')!;
    expect(rubrikAbschnitte(code.rubriken)).toEqual([{ rubriken: code.rubriken }]);
    expect(rubrikAbschnitte([])).toEqual([]);
  });

  it('trägt die Laienerklärung der Sperrschließung an der Gruppe (G-09)', () => {
    expect(gruppen.find((g) => g.key === 'sperrschliessung')!.zusatz).toBe('ein Schlüssel für alle Türen');
  });

  it('führt unter Mehr Partner werden, Ratgeber und Kontakt (G-08)', () => {
    const mehr = gruppen.find((g) => g.key === 'mehr')!;
    expect(mehr.href).toBeUndefined();
    expect(mehr.weitere).toBe(MEHR_LINKS);
    expect(MEHR_LINKS.map((l) => l.href)).toEqual(expect.arrayContaining(['/partner-werden', '/ratgeber', '/service-und-termin/kontakt']));
  });

  it('behält die Spalten des Bestands an den Gruppen mit eigenem Bereich (nichts geht verloren)', () => {
    const auto = gruppen.find((g) => g.key === 'autoschluessel')!;
    expect(auto.spalten).toBe(NAV_AREAS.find((a) => a.key === 'autoschluessel')!.columns);
  });

  it('schreibt die Texte ohne Gedankenstriche (G-48)', () => {
    const texte = NAV_AREAS.flatMap((a) => [a.label, a.summary, a.highlight?.description ?? '', ...a.columns.flatMap((c) => c.links.map((l) => `${l.label} ${l.description ?? ''}`))]);
    expect(texte.filter((t) => /[–—]/.test(t))).toEqual([]);
  });
});

describe('Menü ohne Überladung (FA-26-02, FA-QA-04A)', () => {
  const gruppen = navigationsGruppen(defaults.rubriken());
  const wurzel = path.resolve(__dirname, '../..');
  const quelle = (datei: string) => readFileSync(path.join(wurzel, datei), 'utf8');

  it('die Obergrenze ist zwei Spalten mit je vier Verweisen', () => {
    expect(MENUE_GRENZE).toEqual({ spalten: 2, verweiseJeSpalte: 4 });
  });

  it('keine Gruppe der Kopfzeile hat mehr als zwei Spalten mit je vier Verweisen', () => {
    expect(gruppen).toHaveLength(5);
    for (const gruppe of gruppen) {
      // „Außerdem“ unter „Mehr“ zählt als eigene Spalte.
      const spalten = [...gruppe.spalten.map((s) => s.links), ...(gruppe.weitere.length > 0 ? [gruppe.weitere] : [])];
      expect(spalten.length, gruppe.label).toBeLessThanOrEqual(MENUE_GRENZE.spalten);
      for (const links of spalten) expect(links.length, gruppe.label).toBeLessThanOrEqual(MENUE_GRENZE.verweiseJeSpalte);
    }
  });

  it('auch die Spalten aller Bereiche in NAV_AREAS halten die Grenze, gerendert oder nicht (FA-26-02)', () => {
    // Nicht gerenderte Spalten zählt waisen.test.ts als eingehende Verweise; sie dürfen das Menü
    // nicht still wieder überladen, sobald ein Bereich in den Kopf kommt.
    for (const area of NAV_AREAS) {
      expect(area.columns.length, area.key).toBeLessThanOrEqual(MENUE_GRENZE.spalten);
      for (const spalte of area.columns) expect(spalte.links.length, `${area.key}: ${spalte.title}`).toBeLessThanOrEqual(MENUE_GRENZE.verweiseJeSpalte);
    }
  });

  it('die Spaltentitel passen zu ihren Verweisen: Schlüsselarten und Fragen unter „Schlüsselarten und Hilfe“', () => {
    const auto = NAV_AREAS.find((a) => a.key === 'autoschluessel')!;
    expect(auto.columns.map((c) => c.title)).toEqual(['Leistungen', 'Schlüsselarten und Hilfe']);
    expect(auto.columns.map((c) => c.title)).not.toContain('Häufige Fälle');
  });

  it('kein Verweis steht in einer Gruppe doppelt (Spalten untereinander, Spalte und gleichnamige Rubrik)', () => {
    for (const gruppe of gruppen) {
      const links = gruppe.spalten.flatMap((s) => s.links);
      expect(new Set(links.map((l) => l.href)).size, gruppe.label).toBe(links.length);
      const doppelt = links.filter((l) => gruppe.rubriken.some((r) => r.href === l.href && r.label === l.label));
      expect(doppelt, gruppe.label).toEqual([]);
    }
  });

  it('die Wege in eine Bestellung oder Anfrage bleiben im Menü', () => {
    const alle = (key: string) => {
      const g = gruppen.find((x) => x.key === key)!;
      return [g.hinweis?.href, ...g.rubriken.map((r) => r.href), ...g.spalten.flatMap((s) => s.links.map((l) => l.href)), ...g.weitere.map((l) => l.href)];
    };
    expect(alle('autoschluessel')).toEqual(
      expect.arrayContaining(['/autoschluessel/anfrage', '/autoschluessel/marken', '/autoschluessel/fahrzeug-nicht-gefunden', '/autoschluessel/nachmachen']),
    );
    expect(alle('code')).toEqual(expect.arrayContaining(['/schluessel-nach-code#codelinien', '/shop', '/schluessel-nach-vorlage', '/schluessel-einschicken']));
    expect(alle('mehr')).toEqual(expect.arrayContaining(['/shop', '/beratung', '/service-und-termin/vor-ort', '/service-und-termin/kontakt']));
  });

  it('jeder gestrichene Menüverweis ist an anderer Stelle erreichbar', () => {
    // Schlüsselbart fräsen: Leistungsliste der Bereichsseite und Verweisliste der Funkschlüssel-Seite.
    expect(quelle('src/app/(site)/autoschluessel/page.tsx')).toContain("href: '/autoschluessel/schluesselbart-fraesen'");
    expect(quelle('src/app/(site)/autoschluessel/funkschluessel/page.tsx')).toContain("href: '/autoschluessel/schluesselbart-fraesen'");
    // Marken und Modelle: als Rubrik „Autoschlüssel-Finder“ in derselben Gruppe.
    expect(gruppen.find((g) => g.key === 'autoschluessel')!.rubriken.map((r) => r.href)).toContain('/autoschluessel/marken');
    // Schlüssel nach Code: als gleichnamige Rubrik in derselben Gruppe.
    expect(gruppen.find((g) => g.key === 'code')!.rubriken).toContainEqual(expect.objectContaining({ href: '/schluessel-nach-code', label: 'Schlüssel nach Code' }));
    // Service und Termin: im Fuß (Leistungen aus den Bereichen) und mit Terminstatus im Fuß; „Mehr“ bleibt dort markiert.
    // Den gerenderten Fuß prüft site-footer.test.tsx („trägt Service und Termin …“); hier zusätzlich die Bereichsschleife im Quelltext.
    expect(NAV_AREAS.map((a) => a.href)).toContain('/service-und-termin');
    expect(quelle('src/components/layout/site-footer.tsx')).toMatch(/for \(const area of NAV_AREAS\)[\s\S]{0,200}leistungen\.push\(\{ href: area\.href/);
    expect(FOOTER_CONTENT.map((l) => l.href)).toContain('/service-und-termin/terminstatus');
    expect(MEHR_LINKS.map((l) => l.href)).not.toContain('/service-und-termin');
    // Tür- und Schließtechnik: die zwei aus NAV_AREAS genommenen Spaltenverweise stehen in der Leistungsliste der Bereichsseite.
    const tuer = quelle('src/app/(site)/tuer-und-schliesstechnik/page.tsx');
    expect(tuer).toContain('href={`/tuer-und-schliesstechnik/${service.slug}`}');
    const leistungen = JSON.parse(quelle('content/service-pages.json')) as { slug: string; area: string; active?: boolean }[];
    for (const slug of ['tuerzusatzschloesser', 'montage-und-anpassung']) {
      expect(leistungen.find((s) => s.slug === slug && s.area === 'tuer-und-schliesstechnik')?.active, slug).not.toBe(false);
    }
  });

  it('„Mehr“ gilt auf Service und Termin weiter als aktiv, obwohl die Seite nicht mehr unter „Außerdem“ steht', () => {
    const mehr = gruppen.find((g) => g.key === 'mehr')!;
    expect(mehr.bereichHref).toBe('/service-und-termin');
    for (const pfad of ['/service-und-termin', '/service-und-termin/terminstatus', '/service-und-termin/anfrage']) {
      expect(gruppeAktiv(pfad, mehr), pfad).toBe(true);
    }
    expect(gruppeAktiv('/autoschluessel', mehr)).toBe(false);
    const auto = gruppen.find((g) => g.key === 'autoschluessel')!;
    expect(gruppeAktiv('/autoschluessel/nachmachen', auto)).toBe(true);
    expect(gruppeAktiv('/service-und-termin', auto)).toBe(false);
  });
});
