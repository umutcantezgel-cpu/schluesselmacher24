import { describe, expect, it } from 'vitest';

import { defaults } from '../data/defaults';
import { vorgangZuPayload, vorgangZuSeite } from '../data/payload-mapping';
import { fotoanfrageVerlauf } from '../foto-freigabe';
import { erzeugePdf } from '../pdf/erzeuge-pdf';
import { kundeEingang, statusMail } from '../mail/vorlagen';
import { echteEinstellungen } from '../rechtliches/test-hilfen';
import type { BusinessRecord, CompanyProfile, ContactDetails } from '../types';
import { SCHRITTE_EINSENDUNG, naechsteSchritte } from '../wege/naechste-schritte';
import { STANDARD_VARIANTEN } from '../versand/varianten';
import {
  begleitscheinAnzeigen,
  begleitscheinZumVorgang,
  versandWahl,
  brauchtBegleitschein,
  einsendeAngebotFuerVorgang,
  einsendeAngebotFuerWeg,
  versandDesVorgangs,
  werkstattAnschrift,
} from './schein';
import {
  EINSENDE_QUELLE,
  EINSENDE_STATUS,
  EINSENDUNG_FAHRZEUGSCHEIN_FEHLT,
  einsendeNachweisPruefen,
  einsendeVorgang,
  inhaltText,
  istEinsendung,
} from './vorgang';

/* Erfundene Testdaten (G4). */
const KONTAKT: ContactDetails = {
  firstName: 'Erika',
  lastName: 'Muster',
  email: 'erika@example.org',
  phone: '0301234567',
  street: 'Prüfweg 1',
  postalCode: '35576',
  city: 'Wetzlar',
  country: 'Deutschland',
};
const FIRMA: CompanyProfile = {
  ...defaults.settings().company,
  isPlaceholder: false,
  legalName: 'Testwerkstatt Lahn',
  street: 'Werkstattgasse 7',
  postalCode: '35578',
  city: 'Wetzlar',
  country: 'Deutschland',
  location: undefined,
};
const EINSTELLUNGEN = defaults.settings().sendIn!;
const ROH = {
  quelle: EINSENDE_QUELLE, originale: 1, stueckzahl: 2, beschriftung: '', hinweis: ' Bitte beide gleich ', schluesselart: 'haus', sicherungskarte: 'unklar', versand: 'einschreiben-einwurf',
};

function vorgang(teil: Partial<BusinessRecord> = {}): BusinessRecord {
  const geprueft = einsendeVorgang(ROH, KONTAKT);
  if (!geprueft.ok) throw new Error('Testdaten ungültig');
  return {
    id: '7',
    reference: 'SM24-A-2026-0007',
    kind: 'anfrage',
    area: 'schluessel-nach-vorlage',
    process: 'gefuehrte-anfrage',
    status: 'neu',
    createdAt: '2026-11-04T04:00:00.000Z',
    updatedAt: '2026-11-04T04:00:00.000Z',
    contact: KONTAKT,
    payload: { ...geprueft.payload },
    summary: geprueft.summary,
    uploads: [],
    internalNotes: [],
    timeline: [],
    ...teil,
  };
}

describe('Einsendung prüfen (G-24, E6-OPUS-02)', () => {
  it('baut Payload und Zusammenfassung aus geprüften Angaben', () => {
    const geprueft = einsendeVorgang(ROH, KONTAKT);
    expect(geprueft.ok).toBe(true);
    if (!geprueft.ok) return;
    expect(geprueft.payload).toEqual({
      quelle: 'einsenden', originale: 1, stueckzahl: 2, beschriftung: null, hinweis: 'Bitte beide gleich', schluesselart: 'haus', wertvoll: false, sicherungskarte: 'unklar',
      versand: 'einschreiben-einwurf', originalEingesendet: true,
    });
    const zeilen = Object.fromEntries(geprueft.summary[0].rows.map((z) => [z.label, z.value]));
    expect(zeilen).toMatchObject({ 'In der Sendung': '1 Schlüssel zum Nachmachen', 'Gewünschte Kopien': '2', Versand: 'Einschreiben Einwurf', Sicherungskarte: 'unklar, bitte prüfen' });
    expect(geprueft.summary[1].rows.at(-1)).toEqual({ label: 'Rücksendung an', value: 'Prüfweg 1, 35576 Wetzlar' });
  });

  it('lehnt fremde Quellen, Grenzwerte und unvollständige Rücksendeanschriften ab', () => {
    expect(einsendeVorgang({ ...ROH, quelle: 'planer' }, KONTAKT).ok).toBe(false);
    expect(einsendeVorgang({ ...ROH, originale: 11 }, KONTAKT).ok).toBe(false);
    expect(einsendeVorgang({ ...ROH, stueckzahl: 1.5 }, KONTAKT).ok).toBe(false);
    expect(einsendeVorgang({ ...ROH, hinweis: 42 }, KONTAKT).ok).toBe(false);
    expect(einsendeVorgang({ ...ROH, sicherungskarte: 'vielleicht' }, KONTAKT).ok).toBe(false);
    expect(einsendeVorgang(ROH, { ...KONTAKT, postalCode: '3557' }).ok).toBe(false);
    expect(einsendeVorgang(ROH, { ...KONTAKT, city: ' ' }).ok).toBe(false);
  });

  it('nimmt nur die Varianten des Inhabers; „versichert“ und „unversichert“ wählt niemand mehr (A-050)', () => {
    expect(einsendeVorgang({ ...ROH, versand: 'versichert' }, KONTAKT).ok).toBe(false);
    expect(einsendeVorgang({ ...ROH, versand: 'unversichert' }, KONTAKT).ok).toBe(false);
    expect(einsendeVorgang({ ...ROH, versand: 'dhl-paket' }, KONTAKT).ok).toBe(true);
    expect(einsendeVorgang({ ...ROH, schluesselart: undefined }, KONTAKT).ok).toBe(false);
    expect(einsendeVorgang({ ...ROH, wertvoll: 'ja' }, KONTAKT).ok).toBe(false);
    // Abgeschaltete Variante: nicht wählbar.
    const aus = STANDARD_VARIANTEN.map((v) => ({ ...v, aktiv: v.kennung !== 'einschreiben-einwurf' }));
    expect(einsendeVorgang(ROH, KONTAKT, aus).ok).toBe(false);
  });

  it('nimmt den Sonderfall nur mit bestätigtem Hinweis und speichert die Bestätigung', () => {
    expect(einsendeVorgang({ ...ROH, versand: 'einschreiben-wert' }, KONTAKT).ok).toBe(false);
    const mit = einsendeVorgang({ ...ROH, versand: 'einschreiben-wert', sonderfallBestaetigt: true }, KONTAKT);
    expect(mit.ok && mit.payload.sonderfallBestaetigt).toBe(true);
    // Ohne Sonderfall wird keine Bestätigung gespeichert.
    const ohne = einsendeVorgang({ ...ROH, sonderfallBestaetigt: true }, KONTAKT);
    expect(ohne.ok && 'sonderfallBestaetigt' in ohne.payload).toBe(false);
  });

  it('einsendeNachweisPruefen verlangt bei mechanischen Autoschlüsseln den Fahrzeugschein (R13)', () => {
    const auto = { schluesselart: 'auto-mechanisch' as const };
    expect(einsendeNachweisPruefen(auto, [], true)).toBe(EINSENDUNG_FAHRZEUGSCHEIN_FEHLT);
    expect(einsendeNachweisPruefen(auto, [{ category: 'fahrzeugschein' }], true)).toBe(EINSENDUNG_FAHRZEUGSCHEIN_FEHLT);
    expect(einsendeNachweisPruefen(auto, [{ category: 'fahrzeugschein', storageKey: 'k', uploadToken: 't' }], true)).toBeNull();
    expect(einsendeNachweisPruefen(auto, [{ category: 'fahrzeugschein' }], false)).toBeNull();
    expect(einsendeNachweisPruefen({ schluesselart: 'haus' }, [], true)).toBeNull();
  });

  it('einsendeVorgang nimmt einen mechanischen Autoschlüssel nur mit geprüftem Fahrzeugschein, ohne Nachweis nie (R13)', () => {
    const auto = { ...ROH, schluesselart: 'auto-mechanisch', sicherungskarte: 'nein', versand: 'dhl-paket' };
    // Ohne übergebenen Nachweis: sicher abgelehnt.
    expect(einsendeVorgang(auto, KONTAKT)).toEqual({ ok: false, fehler: EINSENDUNG_FAHRZEUGSCHEIN_FEHLT });
    expect(einsendeVorgang(auto, KONTAKT, STANDARD_VARIANTEN, { uploads: [], ablageEingerichtet: true })).toEqual({ ok: false, fehler: EINSENDUNG_FAHRZEUGSCHEIN_FEHLT });
    expect(einsendeVorgang(auto, KONTAKT, STANDARD_VARIANTEN, { uploads: [{ category: 'sicherungskarte', storageKey: 'k', uploadToken: 't' }], ablageEingerichtet: true }).ok).toBe(false);
    const mit = einsendeVorgang(auto, KONTAKT, STANDARD_VARIANTEN, { uploads: [{ category: 'fahrzeugschein', storageKey: 'k', uploadToken: 't' }], ablageEingerichtet: true });
    expect(mit.ok && mit.payload.schluesselart).toBe('auto-mechanisch');
    // Haus- und Elektronikschlüssel brauchen keinen Fahrzeugschein.
    expect(einsendeVorgang(ROH, KONTAKT, STANDARD_VARIANTEN, { uploads: [], ablageEingerichtet: true }).ok).toBe(true);
  });

  it('nennt in der Zusammenfassung den Variantennamen aus den Einstellungen', () => {
    const umbenannt = STANDARD_VARIANTEN.map((v) => (v.kennung === 'einschreiben-einwurf' ? { ...v, bezeichnung: 'Einwurf-Einschreiben' } : v));
    const geprueft = einsendeVorgang(ROH, KONTAKT, umbenannt);
    expect(geprueft.ok && JSON.stringify(geprueft.summary)).toContain('Einwurf-Einschreiben');
  });

  it('erkennt Einsendungen nur als Foto-Anfrage mit Quelle und nennt ihre eigenen Status und Schritte', () => {
    expect(istEinsendung(vorgang())).toBe(true);
    expect(istEinsendung(vorgang({ area: 'schliessanlagen' }))).toBe(false);
    expect(istEinsendung(vorgang({ payload: { sicherungskarte: 'nein' } }))).toBe(false);
    expect(EINSENDE_STATUS.neu?.label).toBe('Angemeldet');
    expect(EINSENDE_STATUS['in-pruefung']?.label).toBe('Schlüssel eingegangen');
    expect(naechsteSchritte(vorgang())).toBe(SCHRITTE_EINSENDUNG);
    expect(inhaltText({ originale: 3 })).toBe('3 Schlüssel zum Nachmachen');
  });
});

describe('Begleitschein (G-24, R9, A-035)', () => {
  it('nimmt die Werkstatt aus echten Firmendaten, nie aus Platzhaltern', () => {
    expect(werkstattAnschrift(FIRMA)).toEqual({ name: 'Testwerkstatt Lahn', strasse: 'Werkstattgasse 7', plz: '35578', ort: 'Wetzlar', land: 'Deutschland' });
    expect(werkstattAnschrift({ ...FIRMA, isPlaceholder: true })).toBeNull();
    expect(werkstattAnschrift({ ...FIRMA, street: '[Straße eintragen]' })).toBeNull();
  });

  it('erzeugt das PDF für Einsendungen und Freigaben mit Einsendung, sonst nichts', async () => {
    const schein = await begleitscheinZumVorgang(vorgang(), { company: FIRMA, einstellungen: EINSTELLUNGEN, env: {} });
    expect(schein?.anbieter).toBe('begleitschein');
    expect(schein?.kostenlos).toBe(false);
    expect(schein?.pdf.subarray(0, 5).toString('latin1')).toBe('%PDF-');
    expect(schein?.dateiname).toBe('Begleitschein-SM24-A-2026-0007.pdf');

    const foto = vorgang({ payload: { sicherungskarte: 'nein' } });
    expect(brauchtBegleitschein(foto)).toBe(false);
    expect(await begleitscheinZumVorgang(foto, { company: FIRMA, einstellungen: EINSTELLUNGEN, env: {} })).toBeNull();
    const mitFreigabe = { ...foto, approval: { sendInRequired: true } };
    expect((await begleitscheinZumVorgang(mitFreigabe, { company: FIRMA, einstellungen: EINSTELLUNGEN, env: {} }))?.anbieter).toBe('begleitschein');
    expect(await begleitscheinZumVorgang(vorgang(), { company: { ...FIRMA, isPlaceholder: true }, einstellungen: EINSTELLUNGEN, env: {} })).toBeNull();
  });

  it('erzeugt in Probeläufen die Attrappe und nie ein echtes Label', async () => {
    const attrappe = await begleitscheinZumVorgang(vorgang(), { company: FIRMA, einstellungen: EINSTELLUNGEN, env: { VERSAND_PROVIDER: 'attrappe' } });
    expect(attrappe?.anbieter).toBe('attrappe');
    const dhl = await begleitscheinZumVorgang(vorgang(), {
      company: FIRMA,
      einstellungen: { ...EINSTELLUNGEN, labelAktiv: true },
      env: { VERSAND_PROVIDER: 'dhl-retoure', DHL_API_KEY: 'test', DHL_USER: 'test', DHL_PASSWORD: 'test', DHL_RETOURE_EMPFAENGER: 'test' },
    });
    expect(dhl?.anbieter).toBe('begleitschein');
    expect(dhl?.kostenlos).toBe(false);
  });

  it('sagt nie „kostenlos“, solange der Weg kein echtes Label erzeugt', () => {
    const angebot = einsendeAngebotFuerWeg({ ...EINSTELLUNGEN, labelAktiv: true });
    expect(angebot.kostenlos).toBe(false);
    expect(angebot.satz).toContain('frankieren selbst');
    expect(angebot.optionen.map((o) => [o.art, o.empfohlen])).toEqual([['dhl-paket', false], ['einschreiben-einwurf', false]]);
    expect(angebot.optionen.every((o) => !o.label)).toBe(true);
  });

  it('bietet bei der Freigabe mit Einsendung die Varianten mit Empfehlung DHL Paket, den Sonderfall nur mit Freigabe (A-050)', async () => {
    const foto = vorgang({ payload: { sicherungskarte: 'nein' }, status: 'freigegeben', approval: { sendInRequired: true } });
    const angebot = einsendeAngebotFuerVorgang(foto, EINSTELLUNGEN);
    expect(angebot.vorauswahl).toBe('dhl-paket');
    expect(angebot.optionen.map((o) => o.art)).toEqual(['dhl-paket', 'einschreiben-einwurf']);
    expect(einsendeAngebotFuerVorgang({ ...foto, approval: { sendInRequired: true, sendInSpecialAllowed: true } }, EINSTELLUNGEN).optionen.map((o) => o.art))
      .toContain('einschreiben-wert');

    const text = async (v: BusinessRecord, versand?: string) => {
      const schein = await begleitscheinZumVorgang(v, { company: FIRMA, einstellungen: EINSTELLUNGEN, env: {}, versand });
      return schein ? Buffer.from(schein.pdf).length : 0;
    };
    expect(await text(foto, 'einschreiben-einwurf')).toBeGreaterThan(0);
    // Ohne oder mit unzulässiger Wahl gilt die Empfehlung; ein Sonderfall ohne Freigabe zählt nicht.
    expect(versandDesVorgangs(foto)).toBe('dhl-paket');
    expect(versandDesVorgangs(foto, 'einschreiben-einwurf')).toBe('einschreiben-einwurf');
    // Bei der Einsendung zählt die Wahl aus dem Formular; ältere Vorgänge behalten ihre Angabe (G6).
    expect(versandDesVorgangs(vorgang())).toBe('einschreiben-einwurf');
    expect(versandDesVorgangs(vorgang({ payload: { ...vorgang().payload, versand: 'unversichert' } }))).toBe('unversichert');
  });

  it('nimmt für den Begleitschein ohne gültige Wahl die Empfehlung des Angebots, nie eine abgeschaltete Variante (FA-SHOP-03)', async () => {
    const foto = vorgang({ payload: { sicherungskarte: 'nein' }, status: 'freigegeben', approval: { sendInRequired: true } });
    const ohne = (...kennungen: string[]) => ({
      ...EINSTELLUNGEN,
      varianten: STANDARD_VARIANTEN.map((v) => ({ ...v, einlieferung: [...v.einlieferung], empfohlenFuer: [...v.empfohlenFuer], aktiv: !kennungen.includes(v.kennung) })),
    });
    // Startwerte: gültige Wahl zählt; ohne Wahl oder mit einem Sonderfall ohne Freigabe gilt die Empfehlung.
    const start = einsendeAngebotFuerVorgang(foto, EINSTELLUNGEN);
    expect(versandWahl(start, 'einschreiben-einwurf')).toBe('einschreiben-einwurf');
    expect(versandWahl(start, undefined)).toBe('dhl-paket');
    expect(versandWahl(start, 'einschreiben-wert')).toBe('dhl-paket');
    expect(versandWahl(start, 'versichert')).toBe('dhl-paket');
    // Der Betrieb schaltet DHL Paket ab: Der Begleitschein nennt es nie, auch nicht auf ausdrücklichen Wunsch.
    const ohneDhl = einsendeAngebotFuerVorgang(foto, ohne('dhl-paket'));
    expect(ohneDhl.optionen.map((o) => o.art)).toEqual(['einschreiben-einwurf']);
    expect(versandWahl(ohneDhl, undefined)).toBe('einschreiben-einwurf');
    expect(versandWahl(ohneDhl, 'dhl-paket')).toBe('einschreiben-einwurf');
    // Keine Variante angeboten: keine Wahl und kein Begleitschein.
    const nichts = ohne('dhl-paket', 'einschreiben-einwurf', 'einschreiben-wert');
    expect(versandWahl(einsendeAngebotFuerVorgang(foto, nichts), 'dhl-paket')).toBeUndefined();
    expect(await begleitscheinZumVorgang(foto, { company: FIRMA, einstellungen: nichts, env: {}, versand: 'dhl-paket' })).toBeNull();
    expect(await begleitscheinZumVorgang(foto, { company: FIRMA, einstellungen: ohne('dhl-paket'), env: {} })).not.toBeNull();
  });

  it('zeigt den Begleitschein bis zum Eingang, bei Freigaben nur mit verlangter Einsendung', () => {
    expect(begleitscheinAnzeigen(vorgang())).toBe(true);
    expect(begleitscheinAnzeigen(vorgang({ status: 'in-pruefung' }))).toBe(false);
    const foto = vorgang({ payload: { sicherungskarte: 'nein' }, status: 'freigegeben' });
    expect(begleitscheinAnzeigen(foto)).toBe(false);
    expect(begleitscheinAnzeigen({ ...foto, approval: { sendInRequired: true } })).toBe(true);
  });
});

describe('Einsendung in Mails, Verlauf und Datenabbildung (Gegenprüfung E6-OPUS-02)', () => {
  const kontext = { site: 'https://schluesselmacher24.de', firma: echteEinstellungen().company };
  const einsendung = (teil: Partial<BusinessRecord> = {}) => vorgang({ approval: { sendInRequired: true, priceCents: 2490 }, ...teil });

  it('spricht in Freigabe, Absage und Rückfrage vom eingeschickten Schlüssel, nicht von Fotos', () => {
    const frei = statusMail({ vorgang: einsendung({ status: 'freigegeben' }), status: 'freigegeben', kontext, einsendeAnschrift: ['Werkstatt'] });
    expect(frei.betreff).toContain('Ihre Einsendung ist freigegeben');
    expect(frei.text).toContain('liegt bei uns und kommt mit den Kopien zurück');
    expect(frei.text).not.toMatch(/nach Ihren Fotos|Fotos geprüft|Anleitung unten|Zettel mit Ihrer Vorgangsnummer/);

    const nein = statusMail({ vorgang: einsendung({ status: 'nicht-moeglich' }), status: 'nicht-moeglich', kontext });
    expect(nein.text).toContain('Ihr Original schicken wir Ihnen zurück');
    expect(nein.text).not.toContain('Originalschlüssel nicht zu');
    expect(nein.text).not.toContain('Ihre Fotos');

    const frage = statusMail({ vorgang: einsendung({ status: 'wartet-auf-kunde' }), status: 'wartet-auf-kunde', kontext });
    expect(frage.text).not.toMatch(/weiteres Foto|senden Sie bitte erst ein/);
    expect(frage.text).toContain('Ihr Schlüssel bleibt so lange bei uns');
  });

  it('kündigt in der Eingangsmail den Begleitschein an', () => {
    const mail = kundeEingang({ vorgang: vorgang(), token: 'link-schluessel', onlineZahlung: false, kontext });
    expect(mail.betreff).toBe('Ihre Einsendung SM24-A-2026-0007 ist angemeldet');
    expect(mail.text).toContain('Begleitschein');
    expect(mail.text).toContain('Ihr Versand: Einschreiben Einwurf.');
    expect(mail.text).toContain('nicht lose in einen einfachen Papierumschlag');
  });

  it('schreibt in den Verlauf „Schlüssel eingegangen“ statt „Fotos“', () => {
    expect(fotoanfrageVerlauf('in-pruefung', false, true)).toBe('Ihr Schlüssel ist bei uns eingegangen und wird geprüft.');
    expect(fotoanfrageVerlauf('in-pruefung', false)).toBe('Wir prüfen Ihre Fotos.');
    expect(fotoanfrageVerlauf('nicht-moeglich', false, true)).toContain('Ihr Original schicken wir Ihnen zurück');
  });

  it('liest „Original einsenden“ bei Einsendungen aus der Datenbank immer als nein', () => {
    const gespeichert = (record: BusinessRecord) => ({ ...vorgangZuPayload(record), id: 7, createdAt: record.createdAt, updatedAt: record.updatedAt });
    const zurueck = vorgangZuSeite(gespeichert(einsendung()) as never);
    expect(zurueck.approval?.sendInRequired).toBe(false);
    const foto = vorgang({ payload: { sicherungskarte: 'nein' }, approval: { sendInRequired: true } });
    expect(vorgangZuSeite(gespeichert(foto) as never).approval?.sendInRequired).toBe(true);
    // Sonderfall-Freigabe des Teams (A-050) bleibt erhalten.
    const sonderfall = vorgang({ payload: { sicherungskarte: 'nein' }, approval: { sendInRequired: true, sendInSpecialAllowed: true } });
    expect(vorgangZuSeite(gespeichert(sonderfall) as never).approval?.sendInSpecialAllowed).toBe(true);
    expect(vorgangZuSeite(gespeichert(foto) as never).approval?.sendInSpecialAllowed).toBeUndefined();
  });
});

describe('Adressfeld des Begleitscheins (Sichtprüfung E6-OPUS-02)', () => {
  /** Höhe des gestrichelten Rahmens (Breite 260) im unkomprimierten PDF. */
  async function rahmenhoehe(name: string): Promise<number> {
    const pdf = await erzeugePdf(
      { titel: 'Begleitschein', nummer: 'SM24-A-2026-0007', stand: new Date('2026-11-04T05:00:00.000Z'), kopf: [], abschnitte: [{ titel: 'Anschrift für die Sendung', adressfeld: [name, 'Werkstattgasse 7', '35578 Wetzlar'] }], fuss: 'Probe' },
      { komprimieren: false },
    );
    const treffer = pdf.toString('latin1').match(/[\d.]+ [\d.]+ 260 ([\d.]+) re/);
    return Number(treffer?.[1] ?? 0);
  }

  it('wächst mit einem umbrechenden Firmennamen, statt die Straße zu überdecken', async () => {
    const kurz = await rahmenhoehe('Testwerkstatt Lahn');
    const lang = await rahmenhoehe('SCHLÜSSELMACHER24 – Inhaberin Erika Mustermann-Beispiel');
    expect(kurz).toBeGreaterThan(0);
    expect(lang).toBeGreaterThan(kurz + 10);
  });
});
