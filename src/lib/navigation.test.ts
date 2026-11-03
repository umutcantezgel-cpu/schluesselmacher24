import { describe, expect, it } from 'vitest';

import { defaults } from '@/lib/data/defaults';

import { aktiverEintrag, istAktiv, MEHR_LINKS, NAV_AREAS, navigationsGruppen } from './navigation';

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
    expect(von('code')).toEqual(['schluessel-nach-code', 'schluessel-nach-foto', 'schluessel-einschicken']);
    expect(von('mehr')).toEqual(expect.arrayContaining(['elektronische-schliesssysteme', 'sicherheitstechnik', 'tuer-und-schliesstechnik']));
  });

  it('nimmt eine Rubrik auf, sobald sie live geht (G-11: ohne Umbau)', () => {
    const mitMotorrad = navigationsGruppen(rubriken.map((r) => (r.id === 'motorradschluessel' ? { ...r, status: 'live' as const } : r)));
    expect(mitMotorrad.find((g) => g.key === 'autoschluessel')!.rubriken.map((r) => r.id)).toContain('motorradschluessel');
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
