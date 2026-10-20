import { describe, expect, it } from 'vitest';

import { aktiverEintrag, istAktiv } from './navigation';

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
