import { getPayload, type Payload } from 'payload';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import config from '@payload-config';
import { feldNurTeam } from '@/payload/collections/Partnerbetriebe';
import { vorgangAendern, vorgangAnlegen, type NeuerVorgang } from '@/lib/data';
import type { BusinessRecord } from '@/lib/types';

import { MELDUNG_OHNE_SPERRGRUND } from './bewerbung';
import { MELDUNG } from './vermittlung';

/* Gegen die Testdatenbank (FA-PLATTFORM-01B): Migration `partner_pruefung`, Prüfliste vor der Freischaltung,
 * „Besuch nicht möglich“ nur mit Grund, Pausieren und Sperren mit Grund und Wirkung, Lead-Verlauf je Wechsel,
 * Gegenansicht am Partnerbetrieb, Zugriffsrechte der neuen Felder, Auftragsart aus der gebuchten Leistung.
 * Erfundene Betriebe und Daten (G4, G13), kein Zahlungsdienst, keine Mail (G3, G5). */

let payload: Payload;
let team: Record<string, unknown> & { collection: 'benutzer' };
const STAND = '2026-11-15T10:00:00.000Z';

const PRUEFLISTE = {
  identitaet: { erledigt: true },
  leistungsumfang: { erledigt: true },
  ausstattung: { erledigt: true },
  region: { erledigt: true },
  besuch: { am: '2026-11-11T00:00:00.000Z', pruefer: 'Prüferin Test', ergebnis: 'geeignet' as const },
  standard: { erledigt: true, vertragsverweis: 'Partnervertrag, Anlage Qualität' },
};

beforeAll(async () => {
  vi.stubEnv('PARTNERMODELL_B', 'aktiv');
  payload = await getPayload({ config });
  team = {
    ...(await payload.create({
      collection: 'benutzer',
      data: { email: `pruefung-${Date.now()}@example.org`, password: 'nur-fuer-tests-123456', rollen: ['mitarbeiter'], name: 'Mina Saad' },
      overrideAccess: true,
    })),
    collection: 'benutzer' as const,
  };
});

afterAll(() => {
  vi.unstubAllEnvs();
});

const alsTeamPartner = (id: number, data: Record<string, unknown>) =>
  payload.update({ collection: 'partnerbetriebe', id, data, overrideAccess: false, user: team });

/** Legt einen Betrieb an und schaltet ihn über alle Schritte frei (mit Prüfliste). */
async function freigeschaltet(firma: string, auftragsarten: string[], plz = '603*'): Promise<number> {
  const neu = await payload.create({
    collection: 'partnerbetriebe',
    data: {
      firma,
      ort: 'Frankfurt',
      status: 'eingegangen',
      abrechnungsmodell: 'B',
      auftragsarten: auftragsarten as never,
      einsatzgebiet: { postleitzahlen: plz },
      provisionen: [{ auftragsart: 'autoschluessel-vor-ort', prozent: 10 }],
    },
    overrideAccess: true,
  });
  for (const status of ['in-pruefung', 'vertrag-versendet', 'vertrag-unterschrieben'] as const) {
    await alsTeamPartner(neu.id, { status });
  }
  await alsTeamPartner(neu.id, {
    pruefung: { gewerbeGeprueft: true, identitaetGeprueft: true, eignungGeprueft: true },
    vertrag: { unterschriebenAm: '2026-11-03T00:00:00.000Z' },
    pruefliste: PRUEFLISTE,
    status: 'freigeschaltet',
  });
  return neu.id;
}

async function partnerauftrag(daten: Record<string, unknown> = {}): Promise<BusinessRecord> {
  return vorgangAnlegen({
    art: 'termin',
    jahr: 2084,
    aufbauen: (): NeuerVorgang => ({
      area: 'autoschluessel',
      process: 'termin-mit-anzahlung',
      status: 'neu',
      createdAt: STAND,
      updatedAt: STAND,
      contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', postalCode: '60311', country: 'Deutschland' },
      payload: { auftragsweg: 'partner', ...daten },
      summary: [],
      uploads: [],
      auftragsweg: 'partner',
      payment: { scope: 'gesamt', amountCents: 30_000, status: 'bezahlt', paidAt: STAND },
      internalNotes: [],
      timeline: [],
    }),
  });
}

const alsTeam = (id: string, data: Record<string, unknown>) =>
  payload.update({ collection: 'vorgaenge', id: Number(id), data, overrideAccess: false, user: team });
const roh = (id: string) => payload.findByID({ collection: 'vorgaenge', id: Number(id), depth: 0, overrideAccess: true });
const verlaufVon = async (id: string) =>
  ((await roh(id)).leadVerlauf ?? []).map((e) => `${typeof e.partnerbetrieb === 'object' ? e.partnerbetrieb?.id : e.partnerbetrieb}:${e.ergebnis}`);

describe('Prüfliste vor der Freischaltung', () => {
  it('lehnt die Freischaltung ohne Prüfliste ab, setzt Datum und Prüfer beim Abhaken', async () => {
    const neu = await payload.create({ collection: 'partnerbetriebe', data: { firma: 'Testbetrieb Liste', ort: 'Wetzlar', status: 'eingegangen', abrechnungsmodell: 'A' }, overrideAccess: false, user: team });
    for (const status of ['in-pruefung', 'vertrag-versendet', 'vertrag-unterschrieben'] as const) await alsTeamPartner(neu.id, { status });
    await alsTeamPartner(neu.id, { pruefung: { gewerbeGeprueft: true, identitaetGeprueft: true, eignungGeprueft: true }, vertrag: { unterschriebenAm: '2026-11-03T00:00:00.000Z' } });
    await expect(alsTeamPartner(neu.id, { status: 'freigeschaltet' })).rejects.toThrow(/Prüfliste: Identität und Betrieb/);
    // Teilweise: der Besuch fehlt noch.
    const teil = await alsTeamPartner(neu.id, { pruefliste: { ...PRUEFLISTE, besuch: {} } });
    expect(teil.pruefliste?.identitaet).toMatchObject({ erledigt: true, pruefer: 'Mina Saad' });
    expect(teil.pruefliste?.identitaet?.am).toBeTruthy();
    expect(teil.pruefliste?.stand).toContain('Besuch vor Ort');
    await expect(alsTeamPartner(neu.id, { status: 'freigeschaltet' })).rejects.toThrow(/Besuch vor Ort/);
    await alsTeamPartner(neu.id, { pruefliste: { besuch: PRUEFLISTE.besuch } });
    const frei = await alsTeamPartner(neu.id, { status: 'freigeschaltet' });
    expect(frei.status).toBe('freigeschaltet');
    expect(frei.pruefliste?.stand).toBe('Prüfliste vollständig.');
  });

  it('nimmt „Besuch nicht möglich“ nur mit Grund an', async () => {
    const neu = await payload.create({ collection: 'partnerbetriebe', data: { firma: 'Testbetrieb Fern', ort: 'Kiel', status: 'eingegangen', abrechnungsmodell: 'A' }, overrideAccess: false, user: team });
    await expect(alsTeamPartner(neu.id, { pruefliste: { besuch: { nichtMoeglich: true, nichtMoeglichGrund: '' } } })).rejects.toThrow();
    const mitGrund = await alsTeamPartner(neu.id, { pruefliste: { besuch: { nichtMoeglich: true, nichtMoeglichGrund: 'Betrieb 600 km entfernt, Videobesichtigung' } } });
    expect(mitGrund.pruefliste?.besuch).toMatchObject({ nichtMoeglich: true, nichtMoeglichGrund: 'Betrieb 600 km entfernt, Videobesichtigung' });
  });

  it('lässt Betriebe aus der Zeit vor der Prüfliste freigeschaltet und speicherbar (G6)', async () => {
    const alt = await payload.create({ collection: 'partnerbetriebe', data: { firma: 'Testbetrieb Bestand', ort: 'Fulda', status: 'eingegangen', abrechnungsmodell: 'A' }, overrideAccess: true });
    // Wie nach der Migration: freigeschaltet mit Prüfung und Vertrag, Vermerk gesetzt, Prüfliste leer.
    await payload.db.updateOne({
      collection: 'partnerbetriebe',
      id: alt.id,
      data: { status: 'freigeschaltet', pruefung: { gewerbeGeprueft: true, identitaetGeprueft: true, eignungGeprueft: true }, vertrag: { unterschriebenAm: '2026-11-03T00:00:00.000Z' }, pruefliste: { vorEinfuehrung: true } },
    });
    const gespeichert = await alsTeamPartner(alt.id, { notiz: 'Telefonnummer geändert' });
    expect(gespeichert.status).toBe('freigeschaltet');
    expect(gespeichert.pruefliste?.vorEinfuehrung).toBe(true);
    expect(gespeichert.pruefliste?.stand).toMatch(/^Vor Einführung der Prüfliste freigeschaltet/);
    // Den Vermerk setzt nur die Migration, nie das Team.
    const neu = await payload.create({ collection: 'partnerbetriebe', data: { firma: 'Testbetrieb Vermerk', ort: 'Fulda', status: 'eingegangen', abrechnungsmodell: 'A', pruefliste: { vorEinfuehrung: true } }, overrideAccess: false, user: team });
    expect(neu.pruefliste?.vorEinfuehrung ?? false).toBe(false);
  });
});

describe('Pausieren und Sperren', () => {
  it('verlangt einen Grund, hält Datum fest, schließt von neuer Zuordnung aus und markiert laufende Leads', async () => {
    const id = await freigeschaltet('Testbetrieb Sperre', ['schluessel-nachmachen']);
    const laufend = await partnerauftrag();
    await alsTeam(laufend.id, { vermittlung: { status: 'neu', partnerbetrieb: id } });
    await alsTeam(laufend.id, { vermittlung: { status: 'geprueft', partnerbetrieb: id } });
    await alsTeam(laufend.id, { vermittlung: { status: 'partner-angefragt', partnerbetrieb: id } });
    const wartend = await partnerauftrag();
    await alsTeam(wartend.id, { vermittlung: { status: 'neu', partnerbetrieb: id } });
    await alsTeam(wartend.id, { vermittlung: { status: 'geprueft', partnerbetrieb: id } });

    await expect(alsTeamPartner(id, { status: 'gesperrt' })).rejects.toThrow(MELDUNG_OHNE_SPERRGRUND);
    const gesperrt = await alsTeamPartner(id, { status: 'gesperrt', sperre: { grund: 'Beschwerde: Schlüssel falsch angelernt' } });
    expect(gesperrt.sperre).toMatchObject({ grund: 'Beschwerde: Schlüssel falsch angelernt', von: 'Mina Saad' });
    expect(gesperrt.sperre?.seit).toBeTruthy();

    // Laufender Lead: bleibt sichtbar, Eintrag „zur Klärung“, Notiz, Warnung am Vorgang.
    expect(await verlaufVon(laufend.id)).toEqual([`${id}:zugeteilt`, `${id}:angeboten`, `${id}:zur-klaerung`]);
    const gelesen = await payload.findByID({ collection: 'vorgaenge', id: Number(laufend.id), overrideAccess: false, user: team });
    expect(gelesen.vermittlung?.status).toBe('partner-angefragt');
    expect(gelesen.partnerWarnung).toContain('ist gesperrt');
    expect((gelesen.notizen ?? []).some((n) => n.text.includes('Testbetrieb Sperre“ gesperrt'))).toBe(true);

    // Keine neue Zuordnung: Vermitteln an den gesperrten Betrieb geht nicht.
    await expect(alsTeam(wartend.id, { vermittlung: { status: 'partner-angefragt', partnerbetrieb: id } })).rejects.toThrow(MELDUNG.partnerGesperrt);
    // Der gespeicherte Betrieb bleibt am Vorgang gültig (der Vorgang lässt sich weiter speichern).
    const notiert = await alsTeam(wartend.id, { vermittlung: { status: 'geprueft', partnerbetrieb: id, notiz: 'Wird geklärt' } });
    expect(notiert.vermittlung?.notiz).toBe('Wird geklärt');
    // Neu wählen lässt sich ein gesperrter Betrieb an einem anderen Vorgang nicht.
    const anderer = await partnerauftrag();
    await expect(alsTeam(anderer.id, { vermittlung: { status: 'neu', partnerbetrieb: id } })).rejects.toThrow();

    // Pausieren ohne Grund ebenso abgelehnt; Rückkehr aus der Sperre nur mit vollständiger Prüfliste.
    const zweiter = await freigeschaltet('Testbetrieb Pause', ['funk']);
    await expect(alsTeamPartner(zweiter, { status: 'pausiert' })).rejects.toThrow(MELDUNG_OHNE_SPERRGRUND);
    const zurueck = await alsTeamPartner(id, { status: 'freigeschaltet' });
    expect(zurueck.sperre?.grund ?? null).toBeNull();
    expect(zurueck.notiz).toContain('Gesperrt seit');
  });

  it('löst durch die Sperre keine Freigabe einer Auszahlung aus', async () => {
    const id = await freigeschaltet('Testbetrieb Auszahlung', ['schluessel-nachmachen']);
    const auftrag = await partnerauftrag();
    for (const status of ['neu', 'geprueft', 'partner-angefragt', 'angenommen', 'termin-bestaetigt', 'erledigt'] as const) {
      await alsTeam(auftrag.id, { vermittlung: { status, partnerbetrieb: id } });
    }
    expect((await roh(auftrag.id)).auszahlung?.stand).toBe('offen');
    await alsTeamPartner(id, { status: 'gesperrt', sperre: { grund: 'Qualitätsproblem' } });
    const danach = await roh(auftrag.id);
    expect(danach.vermittlung?.status).toBe('erledigt');
    expect(danach.auszahlung?.stand).toBe('offen');
    expect(danach.auszahlung?.freigegebenAm ?? null).toBeNull();
    // Ein ausgeführter Auftrag ist kein laufender Lead: kein Eintrag „zur Klärung“.
    expect(await verlaufVon(auftrag.id)).not.toContain(`${id}:zur-klaerung`);
  });
});

describe('Lead-Verlauf und Gegenansicht', () => {
  it('schreibt je Wechsel einen Eintrag, lässt sich nicht von Hand ändern und erscheint am Partnerbetrieb', async () => {
    const erster = await freigeschaltet('Testbetrieb Lead Eins', ['schluessel-nachmachen']);
    const zweiter = await freigeschaltet('Testbetrieb Lead Zwei', ['schluessel-nachmachen']);
    const auftrag = await partnerauftrag();
    await alsTeam(auftrag.id, { vermittlung: { status: 'neu', partnerbetrieb: erster } });
    await alsTeam(auftrag.id, { vermittlung: { status: 'geprueft', partnerbetrieb: erster } });
    await alsTeam(auftrag.id, { vermittlung: { status: 'partner-angefragt', partnerbetrieb: erster } });
    const zurueck = await alsTeam(auftrag.id, {
      vermittlung: { status: 'geprueft', partnerbetrieb: erster },
      zuordnung: { rueckgabe: 'abgelehnt', notiz: 'Keine Kapazität' },
    });
    expect(zurueck.zuordnung).toMatchObject({ rueckgabe: null, notiz: null });
    await alsTeam(auftrag.id, { vermittlung: { status: 'geprueft', partnerbetrieb: zweiter } });
    await alsTeam(auftrag.id, { vermittlung: { status: 'partner-angefragt', partnerbetrieb: zweiter } });
    await alsTeam(auftrag.id, { vermittlung: { status: 'angenommen', partnerbetrieb: zweiter } });
    expect(await verlaufVon(auftrag.id)).toEqual([
      `${erster}:zugeteilt`,
      `${erster}:angeboten`,
      `${erster}:abgelehnt`,
      `${zweiter}:zugeteilt`,
      `${zweiter}:angeboten`,
      `${zweiter}:angenommen`,
    ]);
    const eintraege = (await roh(auftrag.id)).leadVerlauf ?? [];
    expect(eintraege[2]).toMatchObject({ von: 'Mina Saad', notiz: 'Keine Kapazität' });

    // Von Hand: ein gesendeter Verlauf wird nicht übernommen.
    await alsTeam(auftrag.id, { leadVerlauf: [] });
    expect(await verlaufVon(auftrag.id)).toHaveLength(6);
    // Änderungen über die Datenschicht (etwa die Kundenbestätigung) lassen den Verlauf stehen.
    await vorgangAendern(auftrag.id, (v) => ({ referral: { ...v.referral, note: 'über die Datenschicht' } }));
    expect(await verlaufVon(auftrag.id)).toHaveLength(6);

    // Dieser Auftrag liegt im Partnerweg (zentrale Zahlung): Dort lehnt der Server die Nachricht „Ihr ausführender
    // Betrieb“ ab, bis der Text rechtlich geprüft ist (R10). Der Hinweis darauf erscheint deshalb nicht (Abnahme);
    // den Hinweis außerhalb des Partnerwegs prüft `src/payload/hooks/lead-verlauf.test.ts`.
    const gelesen = await payload.findByID({ collection: 'vorgaenge', id: Number(auftrag.id), overrideAccess: false, user: team });
    expect(gelesen.betriebHinweis ?? null).toBeNull();

    // Gegenansicht: beide Betriebe sehen den Lead mit Stand.
    const eins = await payload.findByID({ collection: 'partnerbetriebe', id: erster, overrideAccess: false, user: team });
    expect(eins.leadUebersicht).toContain(`${gelesen.nummer}: anderem Betrieb zugeordnet oder offen, zuletzt abgelehnt`);
    const zwei = await payload.findByID({ collection: 'partnerbetriebe', id: zweiter, overrideAccess: false, user: team });
    expect(zwei.leadUebersicht).toContain(`${gelesen.nummer}: vom Partner angenommen, zuletzt angenommen`);
    expect((zwei.leads?.docs ?? []).map((d) => (typeof d === 'object' ? d.id : d))).toContain(Number(auftrag.id));
  });

  it('setzt die Auftragsart aus der gebuchten Leistung und vermittelt nur an Partner mit dieser Leistung', async () => {
    const nurFunk = await freigeschaltet('Testbetrieb Nur Funk', ['funk']);
    const programmierer = await freigeschaltet('Testbetrieb Programmierung', ['programmierung-anlernen']);
    const auftrag = await partnerauftrag({ serviceId: 'programmierung' });
    const neu = await alsTeam(auftrag.id, { vermittlung: { status: 'neu', partnerbetrieb: nurFunk } });
    expect(neu.vermittlung?.auftragsart).toBe('programmierung-anlernen');
    await alsTeam(auftrag.id, { vermittlung: { status: 'geprueft', partnerbetrieb: nurFunk } });
    await expect(alsTeam(auftrag.id, { vermittlung: { status: 'partner-angefragt', partnerbetrieb: nurFunk } })).rejects.toThrow(MELDUNG.partnerGesperrt);
    await alsTeam(auftrag.id, { vermittlung: { status: 'geprueft', partnerbetrieb: programmierer } });
    const vermittelt = await alsTeam(auftrag.id, { vermittlung: { status: 'partner-angefragt', partnerbetrieb: programmierer } });
    expect(vermittelt.vermittlung?.status).toBe('partner-angefragt');
    // Ohne gebuchte Leistung bleibt der Sammelwert (Regel aus Teil A).
    const ohne = await partnerauftrag();
    expect((await alsTeam(ohne.id, { vermittlung: { status: 'neu', partnerbetrieb: nurFunk } })).vermittlung?.auftragsart).toBe('autoschluessel-vor-ort');
  });
});

describe('Zugriffsrechte der neuen Felder', () => {
  it('lässt nur das Team Partnerbetriebe und Lead-Verlauf lesen, Systemfelder schreibt nur der Server', async () => {
    const id = await freigeschaltet('Testbetrieb Rechte', ['funk']);
    await expect(payload.findByID({ collection: 'partnerbetriebe', id, overrideAccess: false })).rejects.toThrow();
    await expect(payload.find({ collection: 'vorgaenge', overrideAccess: false, limit: 1 })).rejects.toThrow();
    const anfrage = { req: { user: null } } as never;
    expect(feldNurTeam(anfrage)).toBe(false);
    expect(feldNurTeam({ req: { user: { rollen: [] } } } as never)).toBe(false);
    expect(feldNurTeam({ req: { user: { rollen: ['mitarbeiter'] } } } as never)).toBe(true);
    // Sperrdatum und Bearbeiter setzt nur der Server.
    const versuch = await alsTeamPartner(id, { sperre: { grund: 'nur Notiz', seit: '2020-01-01T00:00:00.000Z', von: 'Jemand' } });
    expect(versuch.sperre?.seit ?? null).toBeNull();
    expect(versuch.sperre?.von ?? null).toBeNull();
    const alsTeamGelesen = await payload.findByID({ collection: 'partnerbetriebe', id, overrideAccess: false, user: team });
    expect(alsTeamGelesen.pruefliste?.besuch?.ergebnis).toBe('geeignet');
  });
});
