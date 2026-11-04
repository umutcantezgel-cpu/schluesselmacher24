import { describe, expect, it } from 'vitest';

import { defaults } from '../data/defaults';
import { vorgangZuPayload, vorgangZuSeite } from '../data/payload-mapping';
import { fotoanfrageVerlauf } from '../foto-freigabe';
import { kundeEingang, statusMail } from '../mail/vorlagen';
import { echteEinstellungen } from '../rechtliches/test-hilfen';
import type { BusinessRecord, CompanyProfile, ContactDetails } from '../types';
import { SCHRITTE_EINSENDUNG, naechsteSchritte } from '../wege/naechste-schritte';
import { begleitscheinAnzeigen, begleitscheinZumVorgang, brauchtBegleitschein, einsendeAngebotFuerWeg, werkstattAnschrift } from './schein';
import { EINSENDE_QUELLE, EINSENDE_STATUS, einsendeVorgang, inhaltText, istEinsendung } from './vorgang';

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
const ROH = { quelle: EINSENDE_QUELLE, originale: 1, stueckzahl: 2, beschriftung: '', hinweis: ' Bitte beide gleich ', sicherungskarte: 'unklar', versand: 'unversichert' };

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
      quelle: 'einsenden', originale: 1, stueckzahl: 2, beschriftung: null, hinweis: 'Bitte beide gleich', sicherungskarte: 'unklar', versand: 'unversichert', originalEingesendet: true,
    });
    const zeilen = Object.fromEntries(geprueft.summary[0].rows.map((z) => [z.label, z.value]));
    expect(zeilen).toMatchObject({ 'Im Umschlag': '1 Schlüssel zum Nachmachen', 'Gewünschte Kopien': '2', Versand: 'unversichert', Sicherungskarte: 'unklar, bitte prüfen' });
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
    expect(angebot.satz).toContain('frankieren den Umschlag selbst');
    expect(angebot.optionen.map((o) => [o.art, o.empfohlen])).toEqual([['versichert', true], ['unversichert', false]]);
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
  });
});
