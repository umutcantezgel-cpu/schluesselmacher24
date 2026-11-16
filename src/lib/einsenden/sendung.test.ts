import { describe, expect, it } from 'vitest';

import type { Field } from 'payload';

import { Vorgaenge } from '../../payload/collections/Vorgaenge';
import { defaults } from '../data/defaults';
import { vorgangAenderungZuPayload, vorgangZuPayload, vorgangZuSeite } from '../data/payload-mapping';
import { statusMail } from '../mail/vorlagen';
import { vorgangsblattInhalt } from '../pdf/vorgangsblatt';
import { echteEinstellungen } from '../rechtliches/test-hilfen';
import type { BusinessRecord, ContactDetails } from '../types';

import { begleitscheinAnzeigen, einsendeAngebotFuerVorgang } from './schein';
import {
  EINSENDE_UNTERWEGS,
  SENDUNGSNUMMER_MELDUNG,
  bereinigeSendungsnummer,
  dienstleisterFuerVariante,
  einsendeKundenStatus,
  einsendeStand,
  kundenEinsendeSendung,
  nummerEintragWeg,
  sendungErwartet,
  sendungsnummerAnwenden,
  teamSendungAenderung,
} from './sendung';
import { EINSENDE_QUELLE, einsendeVorgang } from './vorgang';

/* FA-SHOP-03B: Sendungsnummer des Kunden, Stand der Einsendung. Erfundene Testdaten (G4). */

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
const ROH = { quelle: EINSENDE_QUELLE, originale: 1, stueckzahl: 2, schluesselart: 'haus', sicherungskarte: 'unklar', versand: 'dhl-paket' };
const JETZT = '2026-11-16T09:00:00.000Z';
const EINSTELLUNGEN = defaults.settings().sendIn!;

function einsendung(teil: Partial<BusinessRecord> = {}): BusinessRecord {
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

/** Foto-Anfrage, deren Freigabe das Original verlangt. */
function freigabe(teil: Partial<BusinessRecord> = {}): BusinessRecord {
  return einsendung({ payload: { quelle: 'fotos' }, status: 'freigegeben', approval: { sendInRequired: true, priceCents: 2490 }, ...teil });
}

const angeboten = (v: BusinessRecord) => einsendeAngebotFuerVorgang(v, EINSTELLUNGEN).optionen.map((o) => o.art);

describe('Sendungsnummer prüfen und bereinigen', () => {
  it('nimmt Buchstaben und Ziffern, entfernt Leerzeichen und Bindestriche, Großbuchstaben', () => {
    expect(bereinigeSendungsnummer(' 0034 0434-1234 5678 90 ')).toBe('003404341234567890');
    expect(bereinigeSendungsnummer('rr 123 456 789 de')).toBe('RR123456789DE');
  });

  it('lehnt Kurzes, Überlanges, Sonderzeichen und Nicht-Text ab', () => {
    expect(bereinigeSendungsnummer('1234567')).toBeNull();
    expect(bereinigeSendungsnummer('A'.repeat(41))).toBeNull();
    expect(bereinigeSendungsnummer('<script>1234</script>')).toBeNull();
    expect(bereinigeSendungsnummer('12345678;DROP')).toBeNull();
    expect(bereinigeSendungsnummer(12345678)).toBeNull();
    expect(bereinigeSendungsnummer(undefined)).toBeNull();
  });

  it('ordnet den Dienstleister der Variante zu', () => {
    expect(dienstleisterFuerVariante('dhl-paket')).toBe('dhl');
    expect(dienstleisterFuerVariante('einschreiben-einwurf')).toBe('deutsche-post');
    expect(dienstleisterFuerVariante('versichert')).toBe('deutsche-post');
    expect(dienstleisterFuerVariante('sonstwas')).toBeUndefined();
  });
});

describe('Sendungsnummer eintragen (Zugang, Zeitpunkt, Wahl)', () => {
  it('speichert die bereinigte Nummer mit Dienstleister, Variante, Zeitpunkt und Verlauf', () => {
    const ergebnis = sendungsnummerAnwenden(einsendung(), { zugangGueltig: true, nummer: '0034 0434 1234 5678 90', jetzt: JETZT });
    expect(ergebnis).toMatchObject({ ok: true, nummer: '003404341234567890' });
    if (!ergebnis.ok || !ergebnis.aenderung) throw new Error('erwartet');
    expect(ergebnis.aenderung.einsendeSendung).toEqual({
      trackingNumber: '003404341234567890',
      carrier: 'dhl',
      variant: 'dhl-paket',
      enteredAt: JETZT,
      enteredBy: 'kunde',
    });
    expect(ergebnis.aenderung.timeline.at(-1)).toEqual({ at: JETZT, actor: 'kunde', message: 'Sendungsnummer Ihrer Sendung an uns eingetragen: 003404341234567890.' });
  });

  it('fremder oder falscher Zugang setzt keine Nummer', () => {
    expect(sendungsnummerAnwenden(einsendung(), { zugangGueltig: false, nummer: '003404341234567890', jetzt: JETZT })).toEqual({ ok: false, grund: 'zugang' });
  });

  it('abgelaufener Zugang setzt keine Nummer: nach dem Eingang, bei Storno oder ohne Einsendung', () => {
    for (const status of ['in-pruefung', 'freigegeben', 'versendet', 'storniert', 'nicht-moeglich'] as const) {
      expect(sendungsnummerAnwenden(einsendung({ status }), { zugangGueltig: true, nummer: '003404341234567890', jetzt: JETZT })).toEqual({ ok: false, grund: 'nicht-erwartet' });
    }
    // Foto-Anfrage ohne Einsendung des Originals: keine Sendung erwartet.
    const ohne = freigabe({ approval: { sendInRequired: false } });
    expect(sendungsnummerAnwenden(ohne, { zugangGueltig: true, nummer: '003404341234567890', variante: 'dhl-paket', angeboten: angeboten(ohne), jetzt: JETZT })).toEqual({ ok: false, grund: 'nicht-erwartet' });
    // Der Begleitschein folgt derselben Regel.
    expect(begleitscheinAnzeigen(einsendung({ status: 'in-pruefung' }))).toBe(sendungErwartet(einsendung({ status: 'in-pruefung' })));
  });

  it('ungültige Nummer ändert nichts', () => {
    expect(sendungsnummerAnwenden(einsendung(), { zugangGueltig: true, nummer: 'abc', jetzt: JETZT })).toEqual({ ok: false, grund: 'nummer' });
  });

  it('dieselbe Nummer noch einmal ändert nichts; eine neue wird als Änderung vermerkt', () => {
    const da = einsendung({ einsendeSendung: { trackingNumber: '003404341234567890', carrier: 'dhl', variant: 'dhl-paket' } });
    expect(sendungsnummerAnwenden(da, { zugangGueltig: true, nummer: '00340434 1234567890', jetzt: JETZT })).toEqual({ ok: true, aenderung: null, nummer: '003404341234567890' });
    const neu = sendungsnummerAnwenden(da, { zugangGueltig: true, nummer: '003404341234567891', jetzt: JETZT });
    expect(neu.ok && neu.aenderung?.timeline.at(-1)?.message).toBe('Sendungsnummer Ihrer Sendung an uns geändert: 003404341234567891.');
  });

  it('berichtigt der Kunde nur seine Nummer, bleibt der Dienstleister stehen, den das Team gesetzt hat', () => {
    // Der Kunde wählte DHL Paket, schickte aber mit DPD; das Team hat das eingetragen.
    const vomTeam = { trackingNumber: '01234567890123', carrier: 'dpd' as const, variant: 'dhl-paket' as const, enteredAt: JETZT, enteredBy: 'team' as const };
    const v = einsendung({ einsendeSendung: vomTeam });
    const ergebnis = sendungsnummerAnwenden(v, { zugangGueltig: true, nummer: '01234567890124', jetzt: '2026-11-16T11:00:00.000Z' });
    expect(ergebnis.ok && ergebnis.aenderung?.einsendeSendung).toMatchObject({ trackingNumber: '01234567890124', carrier: 'dpd', variant: 'dhl-paket', enteredBy: 'kunde' });
    // Bei der Freigabe mit Einsendung: wählt der Kunde eine andere Variante, folgt der Dienstleister der neuen Wahl.
    const f = freigabe({ einsendeSendung: { ...vomTeam, variant: 'dhl-paket' } });
    const andere = sendungsnummerAnwenden(f, { zugangGueltig: true, nummer: 'RR123456789DE', variante: 'einschreiben-einwurf', angeboten: angeboten(f), jetzt: '2026-11-16T11:00:00.000Z' });
    expect(andere.ok && andere.aenderung?.einsendeSendung).toMatchObject({ carrier: 'deutsche-post', variant: 'einschreiben-einwurf' });
    // Ältere Einsendung ohne Variante im Formular: Die Variante, die das Team eingetragen hat, bleibt.
    const alt = einsendung({ payload: { ...einsendung().payload, versand: 'versichert' }, einsendeSendung: { ...vomTeam, carrier: 'deutsche-post', variant: 'einschreiben-einwurf' } });
    const altErgebnis = sendungsnummerAnwenden(alt, { zugangGueltig: true, nummer: 'RR123456780DE', jetzt: '2026-11-16T11:00:00.000Z' });
    expect(altErgebnis.ok && altErgebnis.aenderung?.einsendeSendung).toMatchObject({ carrier: 'deutsche-post', variant: 'einschreiben-einwurf' });
  });

  it('bei der Freigabe mit Einsendung nur eine angebotene Variante; Sonderfall nur mit Freigabe des Teams', () => {
    const v = freigabe();
    expect(angeboten(v)).not.toContain('einschreiben-wert');
    expect(sendungsnummerAnwenden(v, { zugangGueltig: true, nummer: 'RR123456789DE', variante: 'einschreiben-wert', angeboten: angeboten(v), jetzt: JETZT })).toEqual({ ok: false, grund: 'variante' });
    expect(sendungsnummerAnwenden(v, { zugangGueltig: true, nummer: 'RR123456789DE', angeboten: angeboten(v), jetzt: JETZT })).toEqual({ ok: false, grund: 'variante' });
    const ok = sendungsnummerAnwenden(v, { zugangGueltig: true, nummer: 'RR123456789DE', variante: 'einschreiben-einwurf', angeboten: angeboten(v), jetzt: JETZT });
    expect(ok.ok && ok.aenderung?.einsendeSendung).toMatchObject({ variant: 'einschreiben-einwurf', carrier: 'deutsche-post' });
    const frei = freigabe({ approval: { sendInRequired: true, sendInSpecialAllowed: true } });
    expect(sendungsnummerAnwenden(frei, { zugangGueltig: true, nummer: 'RR123456789DE', variante: 'einschreiben-wert', angeboten: angeboten(frei), jetzt: JETZT }).ok).toBe(true);
  });

  it('Freigabe mit Einsendung ohne angebotene Variante: kein Formular, sondern der Weg zur Kontaktseite', () => {
    const v = freigabe();
    expect(nummerEintragWeg(v, angeboten(v))).toBe('formular');
    expect(nummerEintragWeg(v, [])).toBe('kontakt');
    // Die Einsendung braucht keine Wahl; nach dem Eingang ist nichts eintragbar.
    expect(nummerEintragWeg(einsendung(), [])).toBe('formular');
    expect(nummerEintragWeg(einsendung({ status: 'in-pruefung' }), [])).toBeNull();
    expect(nummerEintragWeg(freigabe({ status: 'geprueft' }), angeboten(v))).toBeNull();
  });

  it('Meldungen verraten nicht, ob es den Vorgang gibt, und sind ohne Gedankenstriche', () => {
    for (const text of Object.values(SENDUNGSNUMMER_MELDUNG)) expect(text).not.toMatch(/ – | — /);
  });
});

describe('Sendungsnummer durch das Team im Admin', () => {
  const SPAETER = '2026-11-17T10:30:00.000Z';
  const vomKunden = { sendungsnummer: '003404341234567890', dienstleister: 'dhl' as const, variante: 'dhl-paket' as const, eingetragenAm: JETZT, eingetragenVon: 'kunde' as const };

  it('eine Berichtigung durch das Team speichert „Team“ und den neuen Zeitpunkt, mit Verlauf', () => {
    const ergebnis = teamSendungAenderung({ ...vomKunden, sendungsnummer: '0034 0434 9999 8888 77' }, vomKunden, SPAETER);
    expect(ergebnis?.gruppe).toMatchObject({ sendungsnummer: '0034 0434 9999 8888 77', eingetragenAm: SPAETER, eingetragenVon: 'team', dienstleister: 'dhl' });
    expect(ergebnis?.verlauf).toBe('Sendungsnummer Ihrer Sendung an uns geändert: 003404349999888877.');
  });

  it('neue Nummer vom Team: Dienstleister folgt aus der Variante, sonst aus der Wahl im Formular', () => {
    const leer = { sendungsnummer: null, dienstleister: null, variante: null, eingetragenAm: null, eingetragenVon: null };
    expect(teamSendungAenderung({ ...leer, sendungsnummer: 'RR123456789DE', variante: 'einschreiben-einwurf' }, leer, SPAETER)?.gruppe).toMatchObject({
      dienstleister: 'deutsche-post', eingetragenVon: 'team', eingetragenAm: SPAETER,
    });
    const ausFormular = teamSendungAenderung({ ...leer, sendungsnummer: '003404341234567890' }, leer, SPAETER, 'dhl-paket');
    expect(ausFormular?.gruppe.dienstleister).toBe('dhl');
    expect(ausFormular?.verlauf).toBe('Sendungsnummer Ihrer Sendung an uns eingetragen: 003404341234567890.');
    // Ein gewählter Dienstleister bleibt.
    expect(teamSendungAenderung({ ...leer, sendungsnummer: 'RR123456789DE', dienstleister: 'hermes', variante: 'dhl-paket' }, leer, SPAETER)?.gruppe.dienstleister).toBe('hermes');
  });

  it('unveränderte Nummer ändert nichts; gelöschte Nummer leert Zeitpunkt und Herkunft', () => {
    expect(teamSendungAenderung({ ...vomKunden, sendungsnummer: '0034 0434 1234 5678 90' }, vomKunden, SPAETER)).toBeNull();
    expect(teamSendungAenderung({ ...vomKunden, labelDatei: 3 }, vomKunden, SPAETER)).toBeNull();
    const geloescht = teamSendungAenderung({ ...vomKunden, sendungsnummer: '' }, vomKunden, SPAETER);
    expect(geloescht?.gruppe).toMatchObject({ eingetragenAm: null, eingetragenVon: null });
    // Die Löschung steht im Verlauf, damit sie nicht spurlos bleibt.
    expect(geloescht?.verlauf).toBe('Sendungsnummer Ihrer Sendung an uns entfernt.');
  });

  it('ein Formular, das vor dem Eintrag des Kunden offen war, löscht seine Nummer nicht', () => {
    // Das Formular kennt den Eintrag nicht: alle Felder leer, dazu eine Labeldatei, die das Team gerade ablegt.
    const veraltet = { sendungsnummer: null, dienstleister: null, variante: null, eingetragenAm: null, eingetragenVon: null, labelDatei: 5 };
    const ergebnis = teamSendungAenderung(veraltet, vomKunden, SPAETER);
    expect(ergebnis?.gruppe).toMatchObject({ ...vomKunden, labelDatei: 5 });
    expect(ergebnis?.verlauf).toBeUndefined();
    // Derselbe Zeitpunkt in anderer Schreibweise gilt als bekannt: dann ist es eine Löschung.
    const bekannt = teamSendungAenderung({ ...vomKunden, sendungsnummer: '', eingetragenAm: '2026-11-16T10:00:00.000+01:00' }, vomKunden, SPAETER);
    expect(bekannt?.gruppe).toMatchObject({ eingetragenAm: null, eingetragenVon: null });
  });

  it('ein ungültiger Wert ändert nichts: kein Zeitpunkt, kein Verlauf (die Feldprüfung lehnt ihn ab)', () => {
    for (const falsch of ['<b>x</b>', 'A1', 'Zeile1;Zeile2 12345678', 'x'.repeat(120)]) {
      expect(teamSendungAenderung({ ...vomKunden, sendungsnummer: falsch }, vomKunden, SPAETER), falsch).toBeNull();
    }
    // Leerzeichen, Bindestriche und Zeilenumbrüche entfernt die Bereinigung; übrig bleiben nur Buchstaben und Ziffern.
    expect(teamSendungAenderung({ ...vomKunden, sendungsnummer: 'ab 12\n34-5678' }, vomKunden, SPAETER)?.verlauf).toBe('Sendungsnummer Ihrer Sendung an uns geändert: AB12345678.');
    const leer = { sendungsnummer: null, dienstleister: null, variante: null, eingetragenAm: null, eingetragenVon: null };
    expect(teamSendungAenderung({ ...leer, sendungsnummer: '<script>' }, leer, SPAETER)).toBeNull();
  });
});

describe('Stand der Einsendung für den Kunden (A-050, Punkt 8)', () => {
  const titel = (v: BusinessRecord) => einsendeStand(v)?.map((s) => s.titel);

  it('der Stand „unterwegs zu uns“ erscheint nur mit Sendungsnummer', () => {
    expect(titel(einsendung())).toEqual(['Angemeldet', 'Eingegangen', 'Geprüft, Angebot', 'In Fertigung', 'Rückversand']);
    expect(einsendeKundenStatus(einsendung()).label).toBe('Angemeldet');
    const unterwegs = einsendung({ einsendeSendung: { trackingNumber: '003404341234567890' } });
    expect(titel(unterwegs)).toEqual(['Angemeldet', 'Unterwegs zu uns', 'Eingegangen', 'Geprüft, Angebot', 'In Fertigung', 'Rückversand']);
    expect(einsendeStand(unterwegs)?.find((s) => s.stand === 'aktuell')).toEqual({ kennung: 'unterwegs', titel: 'Unterwegs zu uns', zusatz: 'Sendungsnummer 003404341234567890', stand: 'aktuell' });
    expect(einsendeKundenStatus(unterwegs)).toMatchObject({ label: EINSENDE_UNTERWEGS.label, titel: 'Unterwegs zu uns', erledigt: false });
    // Nach dem Eingang zählt wieder der Status, auch mit Nummer.
    expect(einsendeKundenStatus({ ...unterwegs, status: 'in-pruefung' }).label).toBe('Schlüssel eingegangen');
    // Ohne Einsendung kein „unterwegs“, auch mit Nummer.
    expect(einsendeKundenStatus(freigabe({ einsendeSendung: { trackingNumber: '003404341234567890' } })).label).not.toBe(EINSENDE_UNTERWEGS.label);
  });

  it('folgt den vorhandenen Ständen; Rückversand mit Sendungsnummer', () => {
    const aktuell = (v: BusinessRecord) => einsendeStand(v)?.find((s) => s.stand === 'aktuell')?.kennung;
    expect(aktuell(einsendung({ status: 'in-pruefung' }))).toBe('eingegangen');
    expect(aktuell(einsendung({ status: 'freigegeben' }))).toBe('angebot');
    expect(aktuell(einsendung({ status: 'in-fertigung' }))).toBe('fertigung');
    const zurueck = einsendeStand(einsendung({ status: 'versendet', shipment: { carrier: 'dhl', trackingNumber: '00340434999' } }));
    expect(zurueck?.at(-1)).toEqual({ kennung: 'rueckversand', titel: 'Rückversand', zusatz: 'Sendungsnummer 00340434999', stand: 'aktuell' });
    expect(einsendeStand(einsendung({ status: 'abgeschlossen' }))?.every((s) => s.stand === 'erledigt')).toBe(true);
    expect(einsendeStand(einsendung({ status: 'storniert' }))).toBeNull();
    expect(einsendeStand(freigabe())).toBeNull();
  });
});

describe('Sendungsnummer in Kundenansicht, Admin, Vorgangsblatt und Statusmail', () => {
  const mitNummer = einsendung({
    status: 'versendet',
    shipment: { carrier: 'dhl', trackingNumber: '00340434999888' },
    einsendeSendung: { trackingNumber: '003404341234567890', carrier: 'dhl', variant: 'dhl-paket', enteredAt: JETZT, enteredBy: 'kunde' },
  });

  it('erscheint in der Kundenansicht mit Dienstleister, Variante und Verfolgungslink', () => {
    expect(kundenEinsendeSendung(mitNummer, EINSTELLUNGEN)).toEqual({
      nummer: '003404341234567890',
      dienstleister: 'DHL',
      variante: 'DHL Paket',
      link: 'https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=003404341234567890',
    });
    expect(kundenEinsendeSendung(einsendung())).toBeUndefined();
  });

  it('steht im Admin als eigene Gruppe neben der Rücksendung, mit Labeldatei', () => {
    type MitName = Field & { name?: string; fields?: Field[]; tabs?: Array<{ label?: string; fields: Field[] }>; relationTo?: string; admin?: { condition?: (d: Record<string, unknown>) => boolean } };
    const tab = (Vorgaenge.fields as MitName[]).flatMap((f) => f.tabs ?? []).find((t) => t.label === 'Versand');
    const gruppe = (tab?.fields as MitName[]).find((f) => f.name === 'einsendeSendung');
    expect((tab?.fields as MitName[]).map((f) => f.name)).toEqual(['versand', 'einsendeSendung']);
    const namen = (gruppe?.fields as MitName[]).flatMap((f) => (f.fields as MitName[] | undefined)?.map((g) => g.name) ?? [f.name]);
    expect(namen).toEqual(['sendungsnummer', 'dienstleister', 'variante', 'eingetragenAm', 'eingetragenVon', 'labelDatei']);
    const label = (gruppe?.fields as MitName[]).flatMap((f) => (f.fields as MitName[] | undefined) ?? []).find((f) => f.name === 'labelDatei');
    expect(label?.relationTo).toBe('interne-dateien');
    expect(gruppe?.admin?.condition?.({ art: 'anfrage', bereich: 'schluessel-nach-vorlage' })).toBe(true);
    expect(gruppe?.admin?.condition?.({ art: 'bestellung', bereich: 'schluessel-nach-code' })).toBe(false);
  });

  it('kommt im Admin an und zurück (Datenabbildung, auch als Teiländerung)', () => {
    const gespeichert = { ...vorgangZuPayload(mitNummer), id: 7, createdAt: mitNummer.createdAt, updatedAt: mitNummer.updatedAt };
    expect(gespeichert.einsendeSendung).toEqual({
      sendungsnummer: '003404341234567890', dienstleister: 'dhl', variante: 'dhl-paket', eingetragenAm: JETZT, eingetragenVon: 'kunde',
    });
    const zurueck = vorgangZuSeite(gespeichert as never);
    expect(zurueck.einsendeSendung).toEqual(mitNummer.einsendeSendung);
    expect(zurueck.shipment).toEqual(mitNummer.shipment);
    // Teiländerung: nur diese Gruppe, ohne Labeldatei (die bleibt in der Datenbank).
    const teil = vorgangAenderungZuPayload({ einsendeSendung: { trackingNumber: 'RR123456789DE' } });
    expect(teil).toEqual({ einsendeSendung: { sendungsnummer: 'RR123456789DE', dienstleister: null, variante: null, eingetragenAm: null, eingetragenVon: null } });
    expect(vorgangZuSeite({ ...gespeichert, einsendeSendung: { sendungsnummer: null } } as never).einsendeSendung).toBeUndefined();
  });

  it('steht im Vorgangsblatt getrennt von der Rücksendung', () => {
    const blatt = vorgangsblattInhalt({ vorgang: mitNummer, firma: echteEinstellungen().company, jetzt: new Date(JETZT) });
    const lieferung = blatt.abschnitte.find((a) => a.titel === 'Lieferung und Versand');
    expect(lieferung?.zeilen).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'Sendungsnummer Rücksendung', wert: '00340434999888' }),
      expect.objectContaining({ name: 'Sendung zur Werkstatt (DHL)', wert: '003404341234567890' }),
    ]));
  });

  it('steht in der Statusmail neben der Rücksendung', () => {
    const kontext = { site: 'https://schluesselmacher24.de', firma: echteEinstellungen().company };
    const mail = statusMail({ vorgang: mitNummer, status: 'versendet', kontext });
    expect(mail.text).toContain('Ihre Sendung an uns');
    expect(mail.text).toContain('003404341234567890');
    expect(mail.text).toContain('00340434999888');
    // Ohne Nummer keine leere Zeile.
    expect(statusMail({ vorgang: einsendung({ status: 'versendet' }), status: 'versendet', kontext }).text).not.toContain('Ihre Sendung an uns');
  });
});
