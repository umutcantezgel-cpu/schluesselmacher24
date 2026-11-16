import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { VorgangsAnlage } from '@/lib/data';
import { defaults } from '@/lib/data/defaults';
import { auftragsartFuerVorgang } from '@/lib/partner/leistungen';
import { zylinderDetails } from '@/lib/cylinder-summary';
import { priceCylinderOrder } from '@/lib/pricing';
import { buildReference } from '@/lib/reference';
import type { BusinessRecord, CylinderOrderDraft, UploadRef } from '@/lib/types';

/* Eingaben aus dem Browser dürfen keine Beträge, Termine oder Bestellungen
 * setzen. Diese Tests rufen die öffentlichen Aktionen so auf, wie es ein
 * manipulierter Browser per direktem POST täte. */

const stored: BusinessRecord[] = [];
/** Simuliert eine veraltete Vorabprüfung: Termine sind zwischenzeitlich vergeben worden. */
const vorab = { veraltet: false };
/** Im Backend abgeschaltete Rubriken (Status „aus“): getRubrik liefert sie nicht. */
const abgeschaltet = new Set<string>();
/**
 * Varianten der Einsendung, wie der Betrieb sie im Admin ändert (FA-SHOP-03): je Kennung die Felder, die
 * vom Startwert abweichen. Leer heißt Startwerte.
 */
const einsendeImAdmin = new Map<string, { aktiv?: boolean; nurSonderfall?: boolean }>();
/** Rubriken mit Status „später“: getRubrik liefert sie, aber nicht live. */
const spaeterGeschaltet = new Set<string>();
/** Bauformen des Zylinderkatalogs mit dem Haken „Preis nicht bestätigt“ (FA-SHOP-04). */
const unbestaetigteBauformen = new Set<string>();

/** Zylinderkatalog für die Kassentests: der Bestand, Haken „Preis nicht bestätigt“ nach Wahl. */
function testKatalog() {
  const katalog = defaults.cylinderCatalog();
  return { ...katalog, forms: katalog.forms.map((f) => (unbestaetigteBauformen.has(f.id) ? { ...f, priceUnconfirmed: true } : f)) };
}

/**
 * Codelinien für die Kassentests: die Musterdaten als echte Linien, dazu eine Beispiel-Linie und je eine
 * Linie „auf Anfrage“ und „nicht lieferbar“ (FA-SHOP-01).
 */
function testLinien() {
  const linien = defaults.codeLines().map((l) => ({ ...l, example: false }));
  return [
    ...linien,
    { ...linien[0], id: 'test-beispiel-linie', slug: 'test-beispiel-linie', example: true },
    { ...linien[0], id: 'test-auf-anfrage', slug: 'test-auf-anfrage', name: 'Linie auf Anfrage', availability: 'auf-anfrage' as const },
    { ...linien[0], id: 'test-nicht-lieferbar', slug: 'test-nicht-lieferbar', name: 'Linie nicht lieferbar', availability: 'nicht-lieferbar' as const },
  ];
}

/** Standardartikel für die Kassentests: die Beispielartikel, dazu zwei echte, die nicht bestellbar sind. */
function testArtikel() {
  const artikel = defaults.standardArticles();
  return [
    ...artikel,
    { ...artikel[0], id: 'test-artikel-auf-anfrage', slug: 'test-artikel-auf-anfrage', name: 'Artikel auf Anfrage', example: false, availability: 'auf-anfrage' as const },
    { ...artikel[0], id: 'test-artikel-nicht-lieferbar', slug: 'test-artikel-nicht-lieferbar', name: 'Artikel nicht lieferbar', example: false, availability: 'nicht-lieferbar' as const },
  ];
}

vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-forwarded-for': '203.0.113.7' }),
}));

vi.mock('@/lib/data', () => {
  class TerminVergebenFehler extends Error {}
  class ZuVieleOffeneTermineFehler extends Error {}
  // Wie die Abfrage in vorgangAnlegen: offene, unbezahlte Termine je E-Mail-Adresse.
  const offene = (email: string, ab: string) =>
    stored.filter(
      (r) =>
        r.kind === 'termin'
        && r.contact.email.toLowerCase() === email.toLowerCase()
        && !['storniert', 'abgeschlossen'].includes(r.status)
        && (r.payment?.status === 'offen' || r.payment?.status === 'fehlgeschlagen')
        && (r.appointment?.date ?? '') >= ab,
    ).length;
  const termine = (von: string, bis: string) =>
    stored.filter(
      (r) => r.appointment && r.appointment.date >= von && r.appointment.date <= bis && r.status !== 'storniert',
    );
  return {
    TerminVergebenFehler,
    ZuVieleOffeneTermineFehler,
    getSettings: async () => {
      const settings = defaults.settings();
      if (einsendeImAdmin.size === 0) return settings;
      const sendIn = settings.sendIn;
      if (!sendIn) return settings;
      const varianten = (sendIn.varianten ?? []).map((v) => ({ ...v, ...(einsendeImAdmin.get(v.kennung) ?? {}) }));
      return { ...settings, sendIn: { ...sendIn, varianten } };
    },
    // Die Muster-Codelinien sind Beispiele (A-046); für die Bestelllogik gelten sie hier als echte Linien,
    // dazu eine Beispiel-Linie, die die Kasse ablehnen muss.
    getCollection: async (name: keyof typeof defaults) =>
      name === 'codeLines'
        ? testLinien()
        : name === 'standardArticles'
          ? testArtikel()
          : name === 'cylinderCatalog'
            ? testKatalog()
            : defaults[name](),
    getRubrik: async (id: string) => {
      if (abgeschaltet.has(id)) return null;
      const r = defaults.rubriken().find((x) => x.id === id) ?? null;
      return r && spaeterGeschaltet.has(id) ? { ...r, status: 'spaeter' as const } : r;
    },
    getAppointments: async (von: string, bis: string) => (vorab.veraltet ? [] : termine(von, bis)),
    getRecordByReference: async (nummer: string) => stored.find((r) => r.reference === nummer) ?? null,
    // Wie die Datenschicht: Termin unter Sperre frisch prüfen, dann Nummer vergeben.
    vorgangAnlegen: async ({ art, jahr, aufbauen, termin }: VorgangsAnlage) => {
      if (termin?.kunde && offene(termin.kunde.email, termin.kunde.abDatum) >= termin.kunde.hoechstensOffen) {
        throw new ZuVieleOffeneTermineFehler();
      }
      if (termin && !termin.istFrei(termine(termin.datum, termin.datum))) {
        throw new TerminVergebenFehler(termin.datum);
      }
      const nummer = buildReference(art, jahr, stored.length + 1);
      const record: BusinessRecord = { ...aufbauen(nummer), id: String(stored.length + 1), reference: nummer, kind: art };
      stored.unshift(record);
      return record;
    },
    updateRecord: async (id: string, patch: Partial<BusinessRecord>) => {
      const index = stored.findIndex((r) => r.id === id);
      if (index < 0) return null;
      stored[index] = { ...stored[index], ...patch };
      return stored[index];
    },
    vorgangAendern: async (id: string, aendern: (r: BusinessRecord) => Partial<BusinessRecord> | null) => {
      const index = stored.findIndex((r) => r.id === id);
      if (index < 0) return null;
      const aenderung = aendern(stored[index]);
      if (aenderung) stored[index] = { ...stored[index], ...aenderung };
      return stored[index];
    },
  };
});

/*
 * Dateiablage (FA-KERN-02): standardmäßig aus wie bisher. Mit `ablage.an` gilt die Ablage als
 * eingerichtet; die gespeicherten Kundendateien liefert `ablage.dateien` je Kennung (Steckplatz und
 * Kategorie so, wie sie der Upload-Weg gespeichert hätte).
 */
const ablage = {
  an: false,
  dateien: new Map<string, { kategorie: string; steckplatz: string | null }>(),
};

vi.mock('@/lib/integrations', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/integrations')>();
  return { ...original, storageStatus: () => ({ ...original.storageStatus(), configured: ablage.an }) };
});

vi.mock('@/lib/server/kundendateien', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/server/kundendateien')>()),
  kundendateienPruefen: async ({ uploads }: { uploads: Array<{ id: string | number; uploadToken: string }> }) =>
    uploads.map((u) => ablage.dateien.get(String(u.id)) ?? null),
  verknuepfeKundendateien: async ({ uploads }: { uploads: Array<{ id: string | number }> }) =>
    uploads.filter((u) => ablage.dateien.has(String(u.id))).map((u) => Number(u.id)),
}));

const aktionen = { ...(await import('./records')), ...(await import('./orders')) };
const { resetRateLimits, RATE_LIMIT_MESSAGE } = await import('@/lib/server/rate-limit');
const { createAccessToken, verifyAccessToken } = await import('@/lib/server/access-token');
const { startSignieren } = await import('@/lib/server/formular-schutz');
const { SCHUTZ_ERNEUERT } = await import('@/lib/formular-schutz');

/** Wie aus dem Browser: Formular vor 10 Sekunden geöffnet, Honigtopf leer. */
const schutz = () => ({ start: startSignieren(Date.now() - 10_000), website: '' });

type RecordEingabe = Parameters<typeof aktionen.submitRecord>[0];
type OrderEingabe = Parameters<typeof aktionen.submitOrder>[0];
const submitRecord = (input: RecordEingabe) => aktionen.submitRecord({ schutz: schutz(), ...input });
const submitOrder = (input: OrderEingabe) => aktionen.submitOrder({ schutz: schutz(), ...input });

const contact = {
  firstName: 'Erika',
  lastName: 'Muster',
  email: 'erika@example.org',
  phone: '0301234567',
  street: 'Musterweg 1',
  postalCode: '35576',
  city: 'Wetzlar',
  country: 'Deutschland',
};

/** Vollständige Partner-Bewerbung eines erfundenen Betriebs (FA-PLATTFORM-01). */
const PARTNER_BEWERBUNG = {
  firma: 'Testbetrieb Fahrzeugschlüssel GmbH',
  plz: '35576',
  ort: 'Wetzlar',
  einsatzPostleitzahlen: '',
  einsatzradiusKm: 40,
  mobileEinsaetze: true,
  werkstatt: { vorhanden: true, anschrift: 'Teststraße 1' },
  leistungen: ['transponder', 'schluessel-nachmachen'],
  geraete: [{ art: 'programmiergeraet', hersteller: 'Testhersteller', typ: 'T1' }],
  erfahrung: { jahre: 5, schwerpunkte: '', fahrzeugabdeckung: '' },
  qualifikationen: '',
  nachweisAnzahl: 0,
  datenschutz: true,
  datenschutzAm: '2026-11-16T10:00:00.000Z',
};

/** Pflicht-Zustimmungen des Termin-Assistenten. */
const zustimmungen = { terms: true, deposit: true, authorization: true, earlyStart: true };

/** Ohne Dateiablage (Tests) genügt die Angabe der ausgewählten Datei. */
const fahrzeugschein = { fileName: 'fahrzeugschein.jpg', sizeBytes: 120_000, mimeType: 'image/jpeg', category: 'fahrzeugschein' as const, steckplatz: 'fahrzeugschein' as const };

/** Die drei Schlüsselfotos mit Steckplatz (FA-KERN-02): Vorderseite, Rückseite, Spitze beziehungsweise Profil von vorne. */
const schluesselfoto = (steckplatz: 'schluessel-vorderseite' | 'schluessel-rueckseite' | 'schluessel-spitze' | 'sonstiges') => ({
  fileName: `${steckplatz}.jpg`, sizeBytes: 120_000, mimeType: 'image/jpeg', category: 'schluesselfoto' as const, steckplatz,
});
const dreiFotos = [schluesselfoto('schluessel-vorderseite'), schluesselfoto('schluessel-rueckseite'), schluesselfoto('schluessel-spitze')];
const zweiFotos = dreiFotos.slice(0, 2);
/** Ersatznachweis für Kleinstfahrzeuge: kommt als Dokument mit eigenem Steckplatz. */
const ersatznachweis = { fileName: 'kaufbeleg.pdf', sizeBytes: 90_000, mimeType: 'application/pdf', category: 'dokument' as const, steckplatz: 'ersatznachweis' as const };
const typenschild = { fileName: 'typenschild.jpg', sizeBytes: 90_000, mimeType: 'image/jpeg', category: 'dokument' as const, steckplatz: 'typenschild' as const };
/** Kurze Beschreibung des Anliegens (mindestens 20 Zeichen). */
const BESCHREIBUNG = 'Zweitschlüssel gewünscht, bitte Rückmeldung.';

beforeEach(() => {
  stored.length = 0;
  vorab.veraltet = false;
  abgeschaltet.clear();
  einsendeImAdmin.clear();
  spaeterGeschaltet.clear();
  unbestaetigteBauformen.clear();
  ablage.an = false;
  ablage.dateien.clear();
  resetRateLimits();
});

describe('submitRecord', () => {
  it('übernimmt bei Anfragen keinen Betrag aus dem Browser', async () => {
    const result = await submitRecord({
      kind: 'anfrage',
      area: 'service-und-termin',
      process: 'gefuehrte-anfrage',
      contact,
      payload: {},
      summary: [],
      uploads: [],
      payment: { scope: 'gesamt', amountCents: 1, description: 'gefälscht' },
    });
    expect(result.ok).toBe(true);
    expect(stored[0].payment).toBeUndefined();
    expect(stored[0].quote).toBeUndefined();
  });

  it('nimmt Partner-Bewerbungen nur mit Datenschutz-Einwilligung und festem Bereich an', async () => {
    const bewerbung = (area: 'service-und-termin' | 'autoschluessel', payload: Record<string, unknown>) =>
      submitRecord({ kind: 'partner', area, process: 'gefuehrte-anfrage', contact, payload, summary: [], uploads: [] });
    expect((await bewerbung('service-und-termin', {})).ok).toBe(false);
    expect((await bewerbung('autoschluessel', { ...PARTNER_BEWERBUNG, datenschutz: true })).ok).toBe(false);
    expect((await bewerbung('service-und-termin', { ...PARTNER_BEWERBUNG, datenschutz: false })).ok).toBe(false);
    expect(stored).toHaveLength(0);
    expect((await bewerbung('service-und-termin', PARTNER_BEWERBUNG)).ok).toBe(true);
    expect(stored[0]).toMatchObject({ kind: 'partner', area: 'service-und-termin' });
  });

  it('lehnt eine Partner-Bewerbung mit Türöffnung als Leistung ab (FA-PLATTFORM-01, FA-07-02)', async () => {
    const ergebnis = await submitRecord({
      kind: 'partner',
      area: 'service-und-termin',
      process: 'gefuehrte-anfrage',
      contact: { ...contact, company: 'Testbetrieb Tür GmbH' },
      payload: { ...PARTNER_BEWERBUNG, leistungen: ['schluessel-nachmachen', 'tueroeffnung'] },
      summary: [],
      uploads: [],
    });
    expect(ergebnis.ok).toBe(false);
    expect(ergebnis.error).toContain('nur Autoschlüssel und Fahrzeugschlüssel');
    expect(stored).toHaveLength(0);
  });

  it('prüft die Pflichtfelder der Partner-Bewerbung auf dem Server und baut die Daten neu', async () => {
    const ohneRegion = await submitRecord({
      kind: 'partner', area: 'service-und-termin', process: 'gefuehrte-anfrage', contact,
      payload: { ...PARTNER_BEWERBUNG, plz: '355', ort: '' }, summary: [], uploads: [],
    });
    expect(ohneRegion.ok).toBe(false);
    expect(ohneRegion.error).toContain('Postleitzahl des Betriebs');
    const ok = await submitRecord({
      kind: 'partner', area: 'service-und-termin', process: 'gefuehrte-anfrage', contact,
      payload: { ...PARTNER_BEWERBUNG, fremd: 'wird verworfen' },
      summary: [{ title: 'Gefälscht', rows: [{ label: 'Leistungen', value: 'Türöffnung' }] }],
      uploads: [],
    });
    expect(ok.ok).toBe(true);
    expect(stored[0].payload).not.toHaveProperty('fremd');
    expect(stored[0].payload).toMatchObject({ leistungen: ['schluessel-nachmachen', 'transponder'], einsatzradiusKm: 40 });
    expect(JSON.stringify(stored[0].summary)).not.toContain('Türöffnung');
  });

  it('baut Anfragen aus dem Schließplan-Planer auf dem Server neu (E5-OPUS-03)', async () => {
    const form = defaults.cylinderCatalog().forms[0].id;
    const plan = {
      version: 1,
      tueren: [
        { id: 't1', bezeichnung: 'Haustür', form, a: 30, b: 35 },
        { id: 't2', bezeichnung: 'Keller', form, a: 30, b: 30 },
      ],
      schluessel: [
        { id: 's1', bezeichnung: 'Hausverwaltung', anzahl: 2, reserve: 1 },
        { id: 's2', bezeichnung: 'Mieter', anzahl: 3 },
      ],
      berechtigungen: { s1: ['t1', 't2', 'tX'], s2: ['t1'] },
      masseGeprueft: true,
    };
    const basis = { kind: 'projekt' as const, area: 'schliessanlagen' as const, process: 'projektkonfigurator' as const, contact, summary: [], uploads: [] };
    const ok = await submitRecord({
      ...basis,
      payload: { quelle: 'schliessplan-planer', schliessplan: plan, extraIds: ['erfunden'], notiz: '  Bitte vorher anrufen  ', consent: true, schnappschuss: { gefaelscht: true }, betragCents: 1 },
    });
    expect(ok.ok).toBe(true);
    const payload = stored[0].payload;
    expect(Object.keys(payload).sort()).toEqual(['consent', 'extraIds', 'notiz', 'quelle', 'schliessplan', 'schnappschuss']);
    expect(payload).toMatchObject({ extraIds: [], notiz: 'Bitte vorher anrufen', consent: true });
    expect(payload.schnappschuss).toMatchObject({
      masseGeprueft: true,
      schluessel: [{ bezeichnung: 'Hausverwaltung', tueren: [1, 2], reserve: 1 }, { bezeichnung: 'Mieter', tueren: [1] }],
    });

    const leer = await submitRecord({ ...basis, payload: { quelle: 'schliessplan-planer', schliessplan: { version: 1, tueren: [], schluessel: [], berechtigungen: {} } } });
    expect(leer.ok).toBe(false);
    expect(stored).toHaveLength(1);
  });

  it('nimmt bei Planer-Anfragen keine Zusammenfassung und bei anderen Anfragen keinen Schnappschuss aus dem Browser', async () => {
    const form = defaults.cylinderCatalog().forms[0].id;
    const plan = { version: 1, tueren: [{ id: 't1', bezeichnung: 'Haustür', form, a: 30, b: 35 }], schluessel: [{ id: 's1', bezeichnung: 'Familie', anzahl: 3 }], berechtigungen: { s1: ['t1'] } };
    const gefaelscht = [{ title: 'Preis', rows: [{ label: 'Preis', value: 'Gesamt 1,00 € laut Katalog' }] }];
    await submitRecord({ kind: 'projekt', area: 'schliessanlagen', process: 'projektkonfigurator', contact, summary: gefaelscht, uploads: [], payload: { quelle: 'schliessplan-planer', schliessplan: plan, notiz: 'Bitte vorher anrufen' } });
    const planer = stored[0];
    expect(JSON.stringify(planer.summary)).not.toContain('1,00 €');
    expect(planer.summary.map((teil) => teil.title)).toEqual(['Türen', 'Schlüssel', 'Preis', 'Nachricht']);

    const schnappschuss = (planer.payload as Record<string, unknown>).schnappschuss;
    await submitRecord({ kind: 'anfrage', area: 'schliessanlagen', process: 'gefuehrte-anfrage', contact, summary: [], uploads: [], payload: { schnappschuss } });
    expect(stored[0].kind).toBe('anfrage');
    expect(stored[0].payload).not.toHaveProperty('schnappschuss');
  });

  it('verlangt bei der Foto-Anfrage mit Sicherungskarte ein Foto der Karte (R13, E6-OPUS-01)', async () => {
    const basis = { kind: 'anfrage' as const, area: 'schluessel-nach-vorlage' as const, process: 'gefuehrte-anfrage' as const, contact, summary: [] };
    // Die drei Fotos, Stückzahl und Beschreibung verlangt die Pflichtregel (FA-KERN-02); hier geht es um die Karte.
    const angaben = { quelle: 'foto-anfrage', stueckzahl: 1, beschreibung: BESCHREIBUNG };
    const karte = { ...schluesselfoto('sonstiges'), fileName: 'karte.jpg', category: 'sicherungskarte' as const, steckplatz: 'sicherungskarte' as const };
    const ohneKarte = await submitRecord({ ...basis, payload: { ...angaben, sicherungskarte: 'ja' }, uploads: dreiFotos });
    expect(ohneKarte.ok).toBe(false);
    expect(ohneKarte.error).toContain('Sicherungskarte');
    expect((await submitRecord({ ...basis, payload: { ...angaben, sicherungskarte: 'ja' }, uploads: [...dreiFotos, karte] })).ok).toBe(true);
    expect((await submitRecord({ ...basis, payload: { ...angaben, sicherungskarte: 'nein' }, uploads: dreiFotos })).ok).toBe(true);
    expect((await submitRecord({ ...basis, payload: { ...angaben, sicherungskarte: 'unklar' }, uploads: dreiFotos })).ok).toBe(true);
  });

  it('lehnt einen Vorgang ohne Telefonnummer ab, wie das Backend (E6-BAUMEISTER-03)', async () => {
    const ohne = await submitRecord({ kind: 'anfrage', area: 'service-und-termin', process: 'gefuehrte-anfrage', contact: { ...contact, phone: '  ' }, payload: { quelle: 'kontakt' }, summary: [], uploads: [] });
    expect(ohne.ok).toBe(false);
  });

  it('nimmt eine Einsatz-Anfrage vor Ort nur mit bestätigter Berechtigung an (R13, E6-BAUMEISTER-05)', async () => {
    const basis = { kind: 'anfrage' as const, area: 'service-und-termin' as const, process: 'gefuehrte-anfrage' as const, contact, summary: [], uploads: [] };
    const angaben = { quelle: 'vor-ort', anliegen: 'Etwas anderes', beschreibung: 'Testanfrage ohne echten Einsatz', zeitraum: 'flexibel' };
    expect((await submitRecord({ ...basis, payload: angaben })).ok).toBe(false);
    expect((await submitRecord({ ...basis, payload: { ...angaben, berechtigt: 'true' } })).ok).toBe(false);
    expect((await submitRecord({ ...basis, payload: { ...angaben, berechtigt: false } })).ok).toBe(false);
    expect((await submitRecord({ ...basis, payload: { ...angaben, berechtigt: true } })).ok).toBe(true);
    // Andere Anfragen kennen die Frage nicht.
    expect((await submitRecord({ ...basis, payload: { quelle: 'kontakt' } })).ok).toBe(true);
  });

  it('verlangt bei Motorrad und Gehäuse die Unterlagen der Rubrik (R13, E6)', async () => {
    const basis = { kind: 'anfrage' as const, area: 'autoschluessel' as const, process: 'gefuehrte-anfrage' as const, contact, summary: [] };
    for (const quelle of ['motorrad', 'gehaeuse']) {
      const payload = { quelle, tasten: '3-4', beschreibung: BESCHREIBUNG };
      const ohne = await submitRecord({ ...basis, payload, uploads: dreiFotos });
      expect(ohne.ok, quelle).toBe(false);
      expect(ohne.error, quelle).toContain('Fahrzeugschein');
      const ohneFoto = await submitRecord({ ...basis, payload, uploads: [fahrzeugschein] });
      expect(ohneFoto.ok, quelle).toBe(false);
      expect((await submitRecord({ ...basis, payload, uploads: [fahrzeugschein, ...dreiFotos] })).ok, quelle).toBe(true);
      expect((await submitRecord({ ...basis, area: 'schluessel-nach-vorlage', payload, uploads: [fahrzeugschein, ...dreiFotos] })).ok, quelle).toBe(false);
    }
  });

  it('legt eine Einsendung nur mit geprüften Angaben an, ohne Begleitschein bei Platzhalter-Firmendaten (G-24, E6-OPUS-02)', async () => {
    const basis = { kind: 'anfrage' as const, area: 'schluessel-nach-vorlage' as const, process: 'gefuehrte-anfrage' as const, contact, uploads: [] };
    // Varianten des Inhabers (FA-SHOP-03, A-050): „versichert“ und „unversichert“ wählt niemand mehr.
    const gueltig = { quelle: 'einsenden', originale: 2, stueckzahl: 3, beschriftung: ' AB 123 ', hinweis: '', schluesselart: 'haus', sicherungskarte: 'nein', versand: 'einschreiben-einwurf' };
    const gefaelscht = [{ title: 'Preis', rows: [{ label: 'Preis', value: 'Gesamt 1,00 €' }] }];
    const ok = await submitRecord({ ...basis, summary: gefaelscht, payload: { ...gueltig, betragCents: 1 } });
    expect(ok.ok).toBe(true);
    // Die Standard-Einstellungen tragen Platzhalter-Firmendaten: Dann entsteht kein Begleitschein mit
    // erfundener Anschrift, sondern ein Hinweis auf die Vorgangsseite (Erzeugung: einsenden/schein.test.ts).
    expect(ok.begleitschein).toBeUndefined();
    expect(ok.notices.join(' ')).toContain('Begleitschein');
    const vorgang = stored[0];
    expect(vorgang.payload).toEqual({
      quelle: 'einsenden', originale: 2, stueckzahl: 3, beschriftung: 'AB 123', hinweis: null, sicherungskarte: 'nein', schluesselart: 'haus', wertvoll: false, versand: 'einschreiben-einwurf', originalEingesendet: true,
    });
    expect(JSON.stringify(vorgang.summary)).not.toContain('1,00 €');
    expect(vorgang.summary.map((teil) => teil.title)).toEqual(['Einsendung', 'Kontakt und Rücksendung']);

    const anzahl = stored.length;
    for (const falsch of [
      { stueckzahl: 99 }, { originale: 0 }, { versand: 'express' }, { versand: 'versichert' }, { versand: 'unversichert' }, { versand: 'einschreiben-wert' },
      { sicherungskarte: '' }, { beschriftung: 'x'.repeat(81) }, { schluesselart: 'transponder' }, { schluesselart: undefined },
    ]) {
      // Mehr Prüffälle als das Anfragelimit erlaubt: Zähler je Fall zurücksetzen, damit die Prüfung ablehnt und nicht das Limit.
      resetRateLimits();
      const abgelehnt = await submitRecord({ ...basis, summary: [], payload: { ...gueltig, ...falsch } });
      expect(abgelehnt.ok, JSON.stringify(falsch)).toBe(false);
      expect(abgelehnt.error, JSON.stringify(falsch)).not.toBe(RATE_LIMIT_MESSAGE);
    }
    resetRateLimits();
    expect((await submitRecord({ ...basis, contact: { ...contact, postalCode: '' }, summary: [], payload: gueltig })).ok).toBe(false);
    expect((await submitRecord({ ...basis, area: 'schliessanlagen', summary: [], payload: gueltig })).ok).toBe(false);
    // Sicherungskarte „ja“ verlangt das Foto der Karte wie die Foto-Anfrage (R13).
    const ohneKarte = await submitRecord({ ...basis, summary: [], payload: { ...gueltig, sicherungskarte: 'ja' } });
    expect(ohneKarte.ok).toBe(false);
    expect(ohneKarte.error).toContain('Sicherungskarte');
    // Mechanischer Autoschlüssel ohne Fahrzeugschein: auch bei einem direkten Aufruf abgelehnt (R13, FA-SHOP-03).
    const auto = { ...gueltig, schluesselart: 'auto-mechanisch', versand: 'dhl-paket' };
    const ohneSchein = await submitRecord({ ...basis, summary: [], payload: auto });
    expect(ohneSchein.ok).toBe(false);
    expect(ohneSchein.error).toContain('Fahrzeugschein');
    expect(stored).toHaveLength(anzahl);
    // Mit Fahrzeugschein nimmt der Server ihn an und speichert die Schlüsselart.
    const mitSchein = await submitRecord({ ...basis, summary: [], payload: auto, uploads: [fahrzeugschein] });
    expect(mitSchein.ok).toBe(true);
    expect(stored).toHaveLength(anzahl + 1);
    expect(stored.some((r) => r.payload?.schluesselart === 'auto-mechanisch' && r.payload?.versand === 'dhl-paket')).toBe(true);
  });

  it('glaubt bei eingerichteter Dateiablage keinem erfundenen Nachweis einer Einsendung (R13, FA-SHOP-03)', async () => {
    const basis = { kind: 'anfrage' as const, area: 'schluessel-nach-vorlage' as const, process: 'gefuehrte-anfrage' as const, contact, summary: [] };
    const angaben = { quelle: 'einsenden', originale: 1, stueckzahl: 1, beschriftung: '', hinweis: '', sicherungskarte: 'nein', versand: 'dhl-paket' };
    const auto = { ...angaben, schluesselart: 'auto-mechanisch' };
    const token = 'a'.repeat(43);
    const mitKennung = <T extends object>(upload: T, id: string) => ({ ...upload, storageKey: id, uploadToken: token });
    ablage.an = true;

    // Kennung und Schlüssel erfunden: Es gibt keine gespeicherte Datei, also keinen Fahrzeugschein.
    const erfunden = await submitRecord({ ...basis, payload: auto, uploads: [mitKennung(fahrzeugschein, '999')] });
    expect(erfunden.ok).toBe(false);
    expect(erfunden.error).toContain('Fahrzeugschein');
    // Nur die Angabe des Browsers, ohne Kennung: zählt mit Ablage ebenfalls nicht.
    expect((await submitRecord({ ...basis, payload: auto, uploads: [fahrzeugschein] })).ok).toBe(false);
    // Eine echte Datei anderer Art als Fahrzeugschein ausgegeben: gefälschte Zuordnung.
    ablage.dateien.set('31', { kategorie: 'schluesselfoto', steckplatz: 'schluessel-vorderseite' });
    const falscheArt = await submitRecord({ ...basis, payload: auto, uploads: [mitKennung(fahrzeugschein, '31')] });
    expect(falscheArt.ok).toBe(false);
    expect(falscheArt.error).toContain('Zuordnung');
    expect(stored).toHaveLength(0);
    // Der gespeicherte Fahrzeugschein: angenommen.
    ablage.dateien.set('32', { kategorie: 'fahrzeugschein', steckplatz: 'fahrzeugschein' });
    const echt = await submitRecord({ ...basis, payload: auto, uploads: [mitKennung(fahrzeugschein, '32')] });
    expect(echt.ok, echt.error).toBe(true);
    expect(stored).toHaveLength(1);

    // Dasselbe für die Sicherungskarte einer Einsendung: erfundene Kennung abgelehnt, gespeicherte Karte angenommen.
    resetRateLimits();
    const karte = { fileName: 'karte.jpg', sizeBytes: 90_000, mimeType: 'image/jpeg', category: 'sicherungskarte' as const };
    const mitKarte = { ...angaben, schluesselart: 'haus', sicherungskarte: 'ja' };
    const karteErfunden = await submitRecord({ ...basis, payload: mitKarte, uploads: [mitKennung(karte, '998')] });
    expect(karteErfunden.ok).toBe(false);
    expect(karteErfunden.error).toContain('Sicherungskarte');
    expect(stored).toHaveLength(1);
    ablage.dateien.set('33', { kategorie: 'sicherungskarte', steckplatz: null });
    const karteEcht = await submitRecord({ ...basis, payload: mitKarte, uploads: [mitKennung(karte, '33')] });
    expect(karteEcht.ok, karteEcht.error).toBe(true);
    expect(stored).toHaveLength(2);
  });

  it('setzt die Einstellungen der Einsende-Varianten aus dem Admin auch auf dem Server durch (FA-SHOP-03, A-050)', async () => {
    const basis = { kind: 'anfrage' as const, area: 'schluessel-nach-vorlage' as const, process: 'gefuehrte-anfrage' as const, contact, uploads: [], summary: [] };
    const angaben = { quelle: 'einsenden', originale: 1, stueckzahl: 1, beschriftung: '', hinweis: '', schluesselart: 'haus', sicherungskarte: 'nein' };
    // Startwerte: Einwurf und DHL Paket sind wählbar, Einschreiben Wert nur mit bestätigtem Hinweis.
    expect((await submitRecord({ ...basis, payload: { ...angaben, versand: 'einschreiben-einwurf' } })).ok).toBe(true);
    expect((await submitRecord({ ...basis, payload: { ...angaben, versand: 'einschreiben-wert' } })).ok).toBe(false);
    expect((await submitRecord({ ...basis, payload: { ...angaben, versand: 'einschreiben-wert', sonderfallBestaetigt: true } })).ok).toBe(true);
    const anzahl = stored.length;

    // Der Betrieb schaltet Einschreiben Wert ab: auch mit Bestätigung nicht mehr wählbar.
    einsendeImAdmin.set('einschreiben-wert', { aktiv: false });
    expect((await submitRecord({ ...basis, payload: { ...angaben, versand: 'einschreiben-wert', sonderfallBestaetigt: true } })).ok).toBe(false);
    // Der Betrieb erklärt den Einwurf zum Sonderfall: ohne Bestätigung abgelehnt, mit Bestätigung angenommen.
    einsendeImAdmin.set('einschreiben-einwurf', { nurSonderfall: true });
    expect((await submitRecord({ ...basis, payload: { ...angaben, versand: 'einschreiben-einwurf' } })).ok).toBe(false);
    expect(stored).toHaveLength(anzahl);
    expect((await submitRecord({ ...basis, payload: { ...angaben, versand: 'einschreiben-einwurf', sonderfallBestaetigt: true } })).ok).toBe(true);
    // DHL Paket bleibt unberührt.
    expect((await submitRecord({ ...basis, payload: { ...angaben, versand: 'dhl-paket' } })).ok).toBe(true);
    expect(stored).toHaveLength(anzahl + 2);
  });

  it('lehnt Bestellungen außerhalb der Kasse ab', async () => {
    const result = await submitRecord({
      kind: 'bestellung',
      area: 'schluessel-nach-code',
      process: 'direktkauf',
      contact,
      payload: {},
      summary: [],
      uploads: [],
      payment: { scope: 'gesamt', amountCents: 1, description: 'gefälscht' },
    });
    expect(result.ok).toBe(false);
    expect(stored).toHaveLength(0);
  });

  it('verlangt für Termine die Prüfangaben', async () => {
    const result = await submitRecord({
      kind: 'termin',
      area: 'autoschluessel',
      process: 'termin-mit-anzahlung',
      contact,
      payload: {},
      summary: [],
      uploads: [],
      payment: { scope: 'anzahlung', amountCents: 1, description: 'gefälscht' },
    });
    expect(result.ok).toBe(false);
    expect(stored).toHaveLength(0);
  });

  it('setzt die Anzahlung für Termine selbst, egal was der Browser schickt', async () => {
    const settings = defaults.settings();
    const result = await submitRecord({
      kind: 'termin',
      area: 'autoschluessel',
      process: 'termin-mit-anzahlung',
      contact,
      payload: { note: BESCHREIBUNG },
      summary: [],
      uploads: [fahrzeugschein, ...dreiFotos],
      payment: { scope: 'anzahlung', amountCents: 1, description: 'Anzahlung' },
      verify: {
        kind: 'autoschluessel',
        makeSlug: 'volkswagen',
        modelSlug: 'golf',
        serviceId: 'zweitschluessel',
        keyKind: 'klappschluessel',
        workingKeys: 1,
      },
      consents: zustimmungen,
    });
    expect(result.ok).toBe(true);
    const amount = stored[0].payment?.amountCents ?? 0;
    expect(amount).toBeGreaterThanOrEqual(settings.booking.depositMinCents);
    expect(amount).not.toBe(1);
  });

  it('speichert die geprüfte Leistung, nicht die aus dem Browser (FA-PLATTFORM-01B, Auftragsart und Partnervorschlag)', async () => {
    const result = await submitRecord({
      kind: 'termin',
      area: 'autoschluessel',
      process: 'termin-mit-anzahlung',
      contact,
      // Gefälscht: Die Daten nennen eine andere Leistung als die geprüfte Buchung.
      payload: { note: BESCHREIBUNG, serviceId: 'fahrzeugoeffnung' },
      summary: [],
      uploads: [fahrzeugschein, ...dreiFotos],
      payment: { scope: 'anzahlung', amountCents: 1, description: 'Anzahlung' },
      verify: {
        kind: 'autoschluessel',
        makeSlug: 'volkswagen',
        modelSlug: 'golf',
        serviceId: 'zweitschluessel',
        keyKind: 'klappschluessel',
        workingKeys: 1,
      },
      consents: zustimmungen,
    });
    expect(result.ok).toBe(true);
    expect(stored[0].payload.serviceId).toBe('zweitschluessel');
    expect(auftragsartFuerVorgang(stored[0].payload)).toBe('schluessel-nachmachen');
  });

  it('lehnt einen Termin außerhalb des Autoschlüssel-Bereichs ab, auch ohne Unterlagen (R13, FA-KERN-02)', async () => {
    const result = await submitRecord({
      kind: 'termin',
      area: 'service-und-termin',
      process: 'termin-mit-anzahlung',
      contact,
      payload: {},
      summary: [],
      uploads: [],
      verify: {
        kind: 'autoschluessel',
        makeSlug: 'volkswagen',
        modelSlug: 'golf',
        serviceId: 'zweitschluessel',
        keyKind: 'klappschluessel',
        workingKeys: 1,
      },
      consents: zustimmungen,
    });
    expect(result.ok).toBe(false);
    // Auch mit allen Unterlagen bleibt ein Termin an den Autoschlüssel-Bereich gebunden.
    const mitUnterlagen = await submitRecord({
      kind: 'termin',
      area: 'service-und-termin',
      process: 'termin-mit-anzahlung',
      contact,
      payload: { note: BESCHREIBUNG },
      summary: [],
      uploads: [fahrzeugschein, ...dreiFotos],
      verify: {
        kind: 'autoschluessel',
        makeSlug: 'volkswagen',
        modelSlug: 'golf',
        serviceId: 'zweitschluessel',
        keyKind: 'klappschluessel',
        workingKeys: 1,
      },
      consents: zustimmungen,
    });
    expect(mitUnterlagen.ok).toBe(false);
    expect(stored).toHaveLength(0);
  });

  describe('Terminvergabe', () => {
    const verify = {
      kind: 'autoschluessel' as const,
      makeSlug: 'volkswagen',
      modelSlug: 'golf',
      serviceId: 'zweitschluessel',
      keyKind: 'klappschluessel' as const,
      workingKeys: 1,
    };

    async function freiesFenster() {
      const { fetchQuote, fetchSlots } = await import('./booking');
      const quote = await fetchQuote(verify);
      const slots = await fetchSlots(quote.quote!.slotMinutes, quote.quote!.leadTimeDays);
      const slot = slots.days[0].slots.find((s) => s.available)!;
      return { date: slot.date, time: slot.time };
    }

    function buchen(appointment: { date: string; time: string }, anpassen: Partial<RecordEingabe> = {}) {
      // Pflichtunterlagen (FA-KERN-02): Fahrzeugschein, drei Schlüsselfotos, kurze Beschreibung.
      const { payload, ...rest } = anpassen;
      return submitRecord({
        kind: 'termin',
        area: 'autoschluessel',
        process: 'termin-mit-anzahlung',
        contact,
        payload: { note: BESCHREIBUNG, ...payload },
        summary: [],
        uploads: [fahrzeugschein, ...dreiFotos],
        appointment: { ...appointment, durationMinutes: 1, location: 'werkstatt' },
        verify,
        consents: zustimmungen,
        ...rest,
      });
    }

    async function freieFenster(anzahl: number) {
      const { fetchQuote, fetchSlots } = await import('./booking');
      const quote = await fetchQuote(verify);
      const slots = await fetchSlots(quote.quote!.slotMinutes, quote.quote!.leadTimeDays);
      // Je Tag ein Fenster — so überschneiden sich die Termine nicht.
      return slots.days.slice(0, anzahl).map((tag) => {
        const slot = tag.slots.find((s) => s.available)!;
        return { date: slot.date, time: slot.time };
      });
    }

    it('verknüpft einen Folgetermin nur mit einem stornierten Termin derselben E-Mail-Adresse (E-120)', async () => {
      const [erstes, zweites, drittes] = await freieFenster(3);
      expect((await buchen(erstes)).ok).toBe(true);
      const alt = stored[0];
      // Ohne Storno kein Verweis: Der alte Termin läuft noch.
      expect((await buchen(zweites, { payload: { vorherigerVorgang: alt.reference } })).ok).toBe(true);
      expect(stored[0].payload).not.toHaveProperty('vorherigerVorgang');
      expect(alt.timeline.some((e) => e.message.startsWith('Neuer Termin gebucht'))).toBe(false);

      // Anzahlung nicht eingegangen: Der alte Termin ist storniert.
      const index = stored.findIndex((r) => r.id === alt.id);
      stored[index] = { ...stored[index], status: 'storniert', payment: { ...stored[index].payment!, status: 'fehlgeschlagen' } };
      const result = await buchen(drittes, { payload: { vorherigerVorgang: alt.reference.toLowerCase() } });
      expect(result.ok).toBe(true);
      const neu = stored.find((r) => r.reference === result.reference)!;
      expect(neu.payload.vorherigerVorgang).toBe(alt.reference);
      expect(neu.internalNotes.at(-1)?.message).toBe(`Folgetermin zu ${alt.reference}: Die Anzahlung dort ist nicht eingegangen.`);
      const altNachher = stored.find((r) => r.id === alt.id)!;
      expect(altNachher.timeline.at(-1)?.message).toBe(`Neuer Termin gebucht: ${neu.reference}.`);
    });

    it('übernimmt keinen Verweis auf den Termin einer anderen E-Mail-Adresse (E-120)', async () => {
      const [erstes, zweites] = await freieFenster(2);
      expect((await buchen(erstes, { contact: { ...contact, email: 'andere.person@example.invalid' } })).ok).toBe(true);
      const fremd = stored[0];
      const index = stored.findIndex((r) => r.id === fremd.id);
      stored[index] = { ...stored[index], status: 'storniert' };
      const result = await buchen(zweites, { payload: { vorherigerVorgang: fremd.reference } });
      expect(result.ok).toBe(true);
      expect(stored.find((r) => r.reference === result.reference)!.payload).not.toHaveProperty('vorherigerVorgang');
      expect(stored.find((r) => r.id === fremd.id)!.timeline.some((e) => e.message.startsWith('Neuer Termin gebucht'))).toBe(false);
    });

    it('speichert die Zustimmungen mit Zeitpunkt und Fassung der Rechtstexte', async () => {
      const result = await buchen(await freiesFenster());
      expect(result.ok).toBe(true);
      expect(stored[0].consents).toMatchObject({ terms: true, withdrawalNotice: true, deposit: true, authorization: true, earlyStart: true });
      expect(stored[0].consents?.version).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Date.parse(stored[0].consents?.at ?? '')).not.toBeNaN();
    });

    it.each([
      ['ohne Zustimmungen', undefined],
      ['ohne vorzeitigen Beginn', { ...zustimmungen, earlyStart: false }],
      ['ohne AGB', { ...zustimmungen, terms: false }],
      ['ohne Berechtigung', { ...zustimmungen, authorization: false }],
    ])('lehnt Termine %s ab', async (_name, consents) => {
      const result = await buchen(await freiesFenster(), { consents });
      expect(result.ok).toBe(false);
      expect(result.error).toContain('Anzahlung');
      expect(stored).toHaveLength(0);
    });

    it('lässt höchstens zwei offene, unbezahlte Termine je E-Mail-Adresse zu', async () => {
      const [a, b, c] = await freieFenster(3);
      expect((await buchen(a)).ok).toBe(true);
      expect((await buchen(b, { contact: { ...contact, email: 'ERIKA@example.org' } })).ok).toBe(true);
      const dritte = await buchen(c);
      expect(dritte.ok).toBe(false);
      expect(dritte.error).toContain('Anzahlung noch aussteht');
      // Eine andere Adresse darf weiter buchen.
      expect((await buchen(c, { contact: { ...contact, email: 'max@example.org' } })).ok).toBe(true);
    });

    it('setzt Leistung, Marke und Modell aus den Stammdaten, nicht aus der Zusammenfassung des Browsers', async () => {
      const make = defaults.vehicleMakes().find((m) => m.slug === 'volkswagen')!;
      const model = make.models.find((m) => m.slug === 'golf')!;
      const result = await buchen(await freiesFenster(), {
        summary: [
          {
            title: 'Fahrzeug',
            rows: [
              { label: 'Marke', value: 'Ferrari' },
              { label: 'Modell', value: 'Enzo' },
              { label: 'Baujahr / Erstzulassung', value: '2015' },
            ],
          },
          {
            title: 'Schlüssel und Leistung',
            rows: [
              { label: 'Schlüsselart', value: 'Klappschlüssel' },
              { label: 'Gewünschte Leistung', value: '2 Funkschlüssel inkl. Anlernen' },
            ],
          },
        ],
      });
      expect(result.ok).toBe(true);
      const summary = stored[0].summary;
      expect(summary[0].rows).toEqual([
        { label: 'Gewünschte Leistung', value: 'Zweitschlüssel anfertigen' },
        { label: 'Marke', value: make.name },
        { label: 'Modell', value: model.name },
      ]);
      const zeilen = summary.flatMap((abschnitt) => abschnitt.rows);
      expect(zeilen.map((z) => z.value)).not.toContain('2 Funkschlüssel inkl. Anlernen');
      expect(zeilen.map((z) => z.value)).not.toContain('Ferrari');
      expect(zeilen).toContainEqual({ label: 'Baujahr / Erstzulassung', value: '2015' });

      // Die Vertragsbestätigung liest dieselben Zeilen.
      const { vertragsbestaetigung } = await import('@/lib/mail/vorlagen/vertragsbestaetigung');
      const mail = vertragsbestaetigung({
        vorgang: stored[0],
        kontext: { site: 'https://schluesselmacher24.de' },
        settings: defaults.settings(),
        zahlarten: null,
      });
      expect(mail.text).toContain('Leistung: Zweitschlüssel anfertigen');
      expect(mail.text).toContain(`Fahrzeug: ${make.name} ${model.name}`);
      expect(mail.text).not.toContain('Funkschlüssel inkl. Anlernen');
    });

    it('behält ein Modell außerhalb der Liste nur als Angabe des Kunden', async () => {
      const result = await buchen(await freiesFenster(), {
        verify: { ...verify, modelSlug: null },
        summary: [{ title: 'Fahrzeug', rows: [{ label: 'Modell', value: 'Golf Country (nicht in der Liste aufgeführt)' }] }],
      });
      expect(result.ok).toBe(true);
      const zeilen = stored[0].summary.flatMap((abschnitt) => abschnitt.rows);
      expect(zeilen.filter((z) => z.label === 'Modell')).toEqual([]);
      expect(zeilen).toContainEqual({ label: 'Modell (Angabe des Kunden)', value: 'Golf Country (nicht in der Liste aufgeführt)' });
    });

    it('lehnt Termine ohne Fahrzeugschein ab — auch mit Schlüsselfotos', async () => {
      const ohne = await buchen(await freiesFenster(), { uploads: dreiFotos });
      expect(ohne.ok).toBe(false);
      expect(ohne.error).toContain('Zulassungsbescheinigung Teil I');
      expect(stored).toHaveLength(0);
    });

    it('bucht bei bestätigtem Totalverlust ohne Schlüsselfotos, nur mit Fahrzeugschein (FA-KERN-02)', async () => {
      const result = await buchen(await freiesFenster(), {
        verify: { ...verify, workingKeys: 0 },
        payload: { keinSchluesselMehr: true },
        uploads: [fahrzeugschein],
      });
      expect(result.ok, result.error).toBe(true);
      expect(stored[0].uploads.map((u) => u.category)).toEqual(['fahrzeugschein']);
    });

    it('verlangt bei 0 funktionierenden Schlüsseln ohne Bestätigung die drei Fotos (defekter Schlüssel, FA-KERN-02)', async () => {
      const ohne = await buchen(await freiesFenster(), { verify: { ...verify, workingKeys: 0 }, uploads: [fahrzeugschein] });
      expect(ohne.ok).toBe(false);
      expect(ohne.error).toContain('Vorderseite');
      // Die Bestätigung zählt nur bei 0 funktionierenden Schlüsseln.
      const widerspruch = await buchen(await freiesFenster(), { payload: { keinSchluesselMehr: true }, uploads: [fahrzeugschein] });
      expect(widerspruch.ok).toBe(false);
      expect(stored).toHaveLength(0);
    });

    it('lehnt Termine mit zwei statt drei Schlüsselfotos ab (FA-KERN-02)', async () => {
      const result = await buchen(await freiesFenster(), { uploads: [fahrzeugschein, ...zweiFotos] });
      expect(result.ok).toBe(false);
      expect(result.error).toContain('Spitze beziehungsweise des Profils von vorne');
      expect(result.error).not.toContain('Vorderseite');
      // Eine Nahaufnahme unter „Sonstiges“ ersetzt keine Pflichtansicht.
      expect((await buchen(await freiesFenster(), { uploads: [fahrzeugschein, ...zweiFotos, schluesselfoto('sonstiges')] })).ok).toBe(false);
      expect(stored).toHaveLength(0);
    });

    it('lehnt Termine mit Ersatznachweis statt Fahrzeugschein ab, der Ersatzweg gilt nie für Autos (R13)', async () => {
      const result = await buchen(await freiesFenster(), {
        uploads: [ersatznachweis, typenschild, ...dreiFotos],
        payload: { klasse: 'e-scooter', ersatznachweis: 'kaufbeleg', roller: 'versicherungskennzeichen' },
      });
      expect(result.ok).toBe(false);
      expect(result.error).toContain('Fahrzeugschein');
      expect(stored).toHaveLength(0);
    });

    it('verlangt im Termin eine kurze Beschreibung des Anliegens (FA-KERN-02)', async () => {
      const ohne = await buchen(await freiesFenster(), { payload: { note: 'kurz' } });
      expect(ohne.ok).toBe(false);
      expect(ohne.error).toContain('Beschreibung');
    });

    it('lehnt einen vom Browser gefälschten Steckplatz ab (FA-KERN-02)', async () => {
      // Ohne Ablage: Steckplatz und Kategorie müssen zusammenpassen.
      const falsch = { ...schluesselfoto('schluessel-vorderseite'), steckplatz: 'fahrzeugschein' as const };
      expect((await buchen(await freiesFenster(), { uploads: [falsch, ...dreiFotos] })).ok).toBe(false);
      // Mit Ablage: Es zählt nur der gespeicherte Steckplatz der Kundendatei.
      ablage.an = true;
      const token = 'a'.repeat(43);
      ablage.dateien.set('11', { kategorie: 'fahrzeugschein', steckplatz: 'fahrzeugschein' });
      ablage.dateien.set('12', { kategorie: 'schluesselfoto', steckplatz: 'schluessel-vorderseite' });
      ablage.dateien.set('13', { kategorie: 'schluesselfoto', steckplatz: 'schluessel-rueckseite' });
      ablage.dateien.set('14', { kategorie: 'schluesselfoto', steckplatz: 'schluessel-vorderseite' });
      const mitKennung = <T extends object>(upload: T, id: string) => ({ ...upload, storageKey: id, uploadToken: token });
      const echt = [mitKennung(fahrzeugschein, '11'), mitKennung(dreiFotos[0], '12'), mitKennung(dreiFotos[1], '13')];
      // Datei 14 ist als Vorderseite gespeichert, der Browser gibt sie als Spitze aus.
      const gefaelscht = await buchen(await freiesFenster(), { uploads: [...echt, mitKennung(dreiFotos[2], '14')] });
      expect(gefaelscht.ok).toBe(false);
      expect(gefaelscht.error).toContain('Zuordnung');
      // Dieselbe Datei zweimal nennen gilt ebenso als gefälscht.
      expect((await buchen(await freiesFenster(), { uploads: [...echt, mitKennung(dreiFotos[2], '12')] })).ok).toBe(false);
      // Eine Kennung ohne gespeicherte Datei zählt nicht als hochgeladen.
      const unbekannt = await buchen(await freiesFenster(), { uploads: [...echt, mitKennung(dreiFotos[2], '99')] });
      expect(unbekannt.ok).toBe(false);
      expect(unbekannt.error).toContain('Spitze');
      expect(stored).toHaveLength(0);
      // Richtig gespeichert: angenommen, der Steckplatz steht im Vorgang.
      ablage.dateien.set('15', { kategorie: 'schluesselfoto', steckplatz: 'schluessel-spitze' });
      const richtig = await buchen(await freiesFenster(), { uploads: [...echt, mitKennung(dreiFotos[2], '15')] });
      expect(richtig.ok, richtig.error).toBe(true);
      expect(stored[0].uploads.map((u) => u.steckplatz)).toEqual(['fahrzeugschein', 'schluessel-vorderseite', 'schluessel-rueckseite', 'schluessel-spitze']);
    });

    it('legt online gebuchte Termine in der Werkstatt an — auch mit Fahrzeug', async () => {
      const result = await buchen(await freiesFenster(), { appointment: { ...(await freiesFenster()), durationMinutes: 1, location: 'vor-ort' } });
      expect(result.ok).toBe(true);
      expect(stored[0].quote?.requiresVehicleOnSite).toBe(true);
      expect(stored[0].appointment?.location).toBe('werkstatt');
    });

    it('übernimmt den geprüften Termin, nicht die Angaben des Browsers', async () => {
      const wunsch = await freiesFenster();
      const result = await buchen(wunsch);
      expect(result.ok).toBe(true);
      expect(stored[0].appointment?.date).toBe(wunsch.date);
      expect(stored[0].appointment?.durationMinutes).not.toBe(1);
    });

    it('vergibt ein Zeitfenster nicht zweimal', async () => {
      const wunsch = await freiesFenster();
      expect((await buchen(wunsch)).ok).toBe(true);
      const zweite = await buchen(wunsch);
      expect(zweite.ok).toBe(false);
      expect(zweite.error).toContain('nicht mehr frei');
      expect(stored).toHaveLength(1);
    });

    it('prüft beim Anlegen erneut, auch wenn die Vorabprüfung veraltet ist', async () => {
      const wunsch = await freiesFenster();
      expect((await buchen(wunsch)).ok).toBe(true);
      vorab.veraltet = true;
      const zweite = await buchen(wunsch);
      expect(zweite.ok).toBe(false);
      expect(zweite.error).toContain('nicht mehr frei');
      expect(stored).toHaveLength(1);
    });
  });

  it('begrenzt Preis- und Terminabfragen je Adresse', async () => {
    const { fetchQuote, fetchSlots } = await import('./booking');
    const anfrage = { makeSlug: 'volkswagen', modelSlug: 'golf', serviceId: 'zweitschluessel', keyKind: 'klappschluessel' as const, workingKeys: 1 };
    for (let i = 0; i < 60; i += 1) expect((await fetchQuote(anfrage)).ok).toBe(true);
    expect(await fetchQuote(anfrage)).toMatchObject({ ok: false, error: expect.stringContaining('Zu viele Anfragen') });
    for (let i = 0; i < 60; i += 1) expect((await fetchSlots(60, 7, 1)).error).toBeUndefined();
    expect((await fetchSlots(60, 7, 1)).error).toContain('Zu viele Anfragen');
  });

  it('lehnt ungültige Kontaktdaten ab', async () => {
    const result = await submitRecord({
      kind: 'anfrage',
      area: 'service-und-termin',
      process: 'gefuehrte-anfrage',
      contact: { ...contact, email: 'keine-adresse' },
      payload: {},
      summary: [],
      uploads: [],
    });
    expect(result.ok).toBe(false);
  });

  it('begrenzt die Anzahl der Anfragen je Adresse', async () => {
    const input = {
      kind: 'anfrage' as const,
      area: 'service-und-termin' as const,
      process: 'gefuehrte-anfrage' as const,
      contact,
      payload: {},
      summary: [],
      uploads: [],
    };
    for (let i = 0; i < 10; i += 1) {
      expect((await submitRecord(input)).ok).toBe(true);
    }
    expect((await submitRecord(input)).ok).toBe(false);
  });
});

describe('submitRecord: Pflichtunterlagen je Weg (FA-KERN-02, A-048)', () => {
  const anfrage = { kind: 'anfrage' as const, process: 'gefuehrte-anfrage' as const, contact, summary: [] };
  const motorrad = { ...anfrage, area: 'autoschluessel' as const, payload: { quelle: 'motorrad', beschreibung: BESCHREIBUNG } };
  const gehaeuse = { ...anfrage, area: 'autoschluessel' as const, payload: { quelle: 'gehaeuse', tasten: '1-2', beschreibung: BESCHREIBUNG } };
  const vorlage = { ...anfrage, area: 'schluessel-nach-vorlage' as const, payload: { quelle: 'foto-anfrage', stueckzahl: 2, sicherungskarte: 'nein', beschreibung: BESCHREIBUNG } };
  const fahrzeug = (klasse: string, mehr: Record<string, unknown> = {}) => ({
    ...anfrage,
    area: 'autoschluessel' as const,
    payload: { quelle: 'fahrzeug-anfrage', klasse, beschreibung: BESCHREIBUNG, ...mehr },
  });

  it('nimmt jeden Weg mit vollständigen Unterlagen an', async () => {
    expect((await submitRecord({ ...motorrad, uploads: [fahrzeugschein, ...dreiFotos] })).ok).toBe(true);
    expect((await submitRecord({ ...gehaeuse, uploads: [fahrzeugschein, ...dreiFotos] })).ok).toBe(true);
    expect((await submitRecord({ ...vorlage, uploads: dreiFotos })).ok).toBe(true);
    for (const klasse of ['auto', 'motorrad', 'nicht-gefunden', 'roller']) {
      expect((await submitRecord({ ...fahrzeug(klasse), uploads: [fahrzeugschein, ...dreiFotos] })).ok, klasse).toBe(true);
    }
  });

  it('lehnt ohne Fahrzeugschein ab (Motorrad, Gehäuse, Auto, Motorrad, zugelassener Roller, Fahrzeug nicht gefunden)', async () => {
    for (const [name, weg] of [['motorrad', motorrad], ['gehaeuse', gehaeuse], ['auto', fahrzeug('auto')], ['motorrad-klasse', fahrzeug('motorrad')], ['roller', fahrzeug('roller', { roller: 'zulassung' })], ['nicht-gefunden', fahrzeug('nicht-gefunden')]] as const) {
      const result = await submitRecord({ ...weg, uploads: dreiFotos });
      expect(result.ok, name).toBe(false);
      expect(result.error, name).toContain('Fahrzeugschein');
    }
    expect(stored).toHaveLength(0);
  });

  it('lehnt mit zwei statt drei Schlüsselfotos ab, in jedem Weg', async () => {
    for (const [name, weg, nachweis] of [
      ['motorrad', motorrad, [fahrzeugschein]],
      ['gehaeuse', gehaeuse, [fahrzeugschein]],
      ['vorlage', vorlage, []],
      ['auto', fahrzeug('auto'), [fahrzeugschein]],
      ['e-scooter', fahrzeug('e-scooter', { ersatznachweis: 'kaufbeleg', fin: 'WVWZZZ1JZXW000001' }), [ersatznachweis]],
    ] as const) {
      const result = await submitRecord({ ...weg, uploads: [...nachweis, ...zweiFotos] });
      expect(result.ok, name).toBe(false);
      expect(result.error, name).toContain('Profils von vorne');
    }
    expect(stored).toHaveLength(0);
  });

  it('nimmt bestätigten Totalverlust ohne Fotos an (Motorrad, Fahrzeug-Anfrage), nicht beim Gehäuse und nicht nach Vorlage', async () => {
    expect((await submitRecord({ ...motorrad, payload: { ...motorrad.payload, keinSchluesselMehr: true }, uploads: [fahrzeugschein] })).ok).toBe(true);
    expect((await submitRecord({ ...fahrzeug('auto', { keinSchluesselMehr: true }), uploads: [fahrzeugschein] })).ok).toBe(true);
    expect((await submitRecord({ ...fahrzeug('seniorenmobil', { keinSchluesselMehr: true, ersatznachweis: 'versicherungsbescheinigung', keinTypenschild: true }), uploads: [ersatznachweis] })).ok).toBe(true);
    const anzahl = stored.length;
    // Ohne ausdrückliche Bestätigung (nur „true“ zählt) bleiben die Fotos Pflicht.
    expect((await submitRecord({ ...motorrad, payload: { ...motorrad.payload, keinSchluesselMehr: 'ja' }, uploads: [fahrzeugschein] })).ok).toBe(false);
    // Gehäuse und Vorlage brauchen den Schlüssel immer.
    expect((await submitRecord({ ...gehaeuse, payload: { ...gehaeuse.payload, keinSchluesselMehr: true }, uploads: [fahrzeugschein] })).ok).toBe(false);
    expect((await submitRecord({ ...vorlage, payload: { ...vorlage.payload, keinSchluesselMehr: true }, uploads: [] })).ok).toBe(false);
    expect(stored).toHaveLength(anzahl);
  });

  it('nimmt Kleinstfahrzeuge mit Ersatznachweis an', async () => {
    const faelle: Array<[string, ReturnType<typeof fahrzeug>, object[]]> = [
      ['e-scooter mit FIN', fahrzeug('e-scooter', { ersatznachweis: 'betriebserlaubnis', fin: 'WVWZZZ1JZXW000001' }), [ersatznachweis]],
      ['seniorenmobil mit Typenschild', fahrzeug('seniorenmobil', { ersatznachweis: 'kaufbeleg' }), [ersatznachweis, typenschild]],
      ['roller mit Versicherungskennzeichen', fahrzeug('roller', { roller: 'versicherungskennzeichen', ersatznachweis: 'versicherungsbescheinigung', keinTypenschild: true }), [ersatznachweis]],
      ['fahrrad mit Codekarte', fahrzeug('fahrrad', { ersatznachweis: 'codekarte', schlossHersteller: 'Testschloss', schluesselnummer: 'K 123' }), [ersatznachweis]],
    ];
    for (const [name, weg, nachweis] of faelle) {
      const result = await submitRecord({ ...weg, uploads: [...nachweis, ...dreiFotos] } as RecordEingabe);
      expect(result.ok, `${name}: ${result.error}`).toBe(true);
    }
    expect(stored[0].uploads.map((u) => u.steckplatz)).toContain('ersatznachweis');
  });

  it('verlangt beim Ersatzweg Art, Typenschild oder FIN und beim Fahrrad die Angaben zum Schloss', async () => {
    const ohneArt = await submitRecord({ ...fahrzeug('e-scooter', { fin: 'WVWZZZ1JZXW000001' }), uploads: [ersatznachweis, ...dreiFotos] });
    expect(ohneArt.error).toContain('welchen Nachweis');
    // Eine Codekarte gilt nur beim Fahrrad.
    expect((await submitRecord({ ...fahrzeug('e-scooter', { ersatznachweis: 'codekarte', fin: 'WVWZZZ1JZXW000001' }), uploads: [ersatznachweis, ...dreiFotos] })).ok).toBe(false);
    const ohneTypenschild = await submitRecord({ ...fahrzeug('e-scooter', { ersatznachweis: 'kaufbeleg' }), uploads: [ersatznachweis, ...dreiFotos] });
    expect(ohneTypenschild.error).toContain('Typenschilds');
    const ohneSchloss = await submitRecord({ ...fahrzeug('fahrrad', { ersatznachweis: 'kaufbeleg' }), uploads: [ersatznachweis, ...dreiFotos] });
    expect(ohneSchloss.error).toContain('Schlüsselnummer');
    const ohneNachweis = await submitRecord({ ...fahrzeug('e-scooter', { ersatznachweis: 'kaufbeleg', fin: 'WVWZZZ1JZXW000001' }), uploads: dreiFotos });
    expect(ohneNachweis.error).toContain('Nachweises');
    expect(stored).toHaveLength(0);
  });

  it('lehnt Auto und Motorrad mit Ersatznachweis statt Fahrzeugschein ab (R13)', async () => {
    const ersatz = { ersatznachweis: 'kaufbeleg', fin: 'WVWZZZ1JZXW000001', roller: 'versicherungskennzeichen' };
    for (const [name, weg] of [['auto', fahrzeug('auto', ersatz)], ['motorrad', fahrzeug('motorrad', ersatz)], ['nicht-gefunden', fahrzeug('nicht-gefunden', ersatz)], ['motorrad-weg', { ...motorrad, payload: { ...motorrad.payload, ...ersatz } }], ['gehaeuse', { ...gehaeuse, payload: { ...gehaeuse.payload, ...ersatz } }]] as const) {
      const result = await submitRecord({ ...weg, uploads: [ersatznachweis, typenschild, ...dreiFotos] });
      expect(result.ok, name).toBe(false);
      expect(result.error, name).toContain('Fahrzeugschein');
    }
    // Roller ohne Wahl gilt als zugelassen.
    expect((await submitRecord({ ...fahrzeug('roller', { ersatznachweis: 'kaufbeleg', fin: 'WVWZZZ1JZXW000001' }), uploads: [ersatznachweis, ...dreiFotos] })).ok).toBe(false);
    expect(stored).toHaveLength(0);
  });

  it('lehnt einen vom Browser gefälschten Steckplatz ab, in jedem Weg', async () => {
    // Ersatznachweis als „Fahrzeugschein“ ausgegeben, Foto als Fahrzeugschein: passt nicht zur Kategorie.
    const scheinGefaelscht = { ...ersatznachweis, steckplatz: 'fahrzeugschein' as const };
    const fotoAlsSchein = { ...schluesselfoto('schluessel-vorderseite'), steckplatz: 'fahrzeugschein' as const };
    const scheinAlsFoto = { ...fahrzeugschein, steckplatz: 'schluessel-spitze' as const };
    for (const [name, weg] of [['motorrad', motorrad], ['gehaeuse', gehaeuse], ['vorlage', vorlage], ['auto', fahrzeug('auto')]] as const) {
      expect((await submitRecord({ ...weg, uploads: [scheinGefaelscht, ...dreiFotos] })).ok, name).toBe(false);
      expect((await submitRecord({ ...weg, uploads: [fotoAlsSchein, ...dreiFotos] })).ok, name).toBe(false);
      expect((await submitRecord({ ...weg, uploads: [fahrzeugschein, ...zweiFotos, scheinAlsFoto] })).ok, name).toBe(false);
    }
    // Mit Ablage: gespeichert als Rückseite, ausgegeben als Spitze. (Zählung zurücksetzen: viele Versuche oben.)
    resetRateLimits();
    ablage.an = true;
    const token = 'b'.repeat(43);
    ablage.dateien.set('21', { kategorie: 'schluesselfoto', steckplatz: 'schluessel-vorderseite' });
    ablage.dateien.set('22', { kategorie: 'schluesselfoto', steckplatz: 'schluessel-rueckseite' });
    ablage.dateien.set('23', { kategorie: 'schluesselfoto', steckplatz: 'schluessel-rueckseite' });
    const fotos = dreiFotos.map((foto, i) => ({ ...foto, storageKey: String(21 + i), uploadToken: token }));
    const result = await submitRecord({ ...vorlage, uploads: fotos });
    expect(result.ok).toBe(false);
    expect(result.error).toContain('Zuordnung');
    // Ohne gespeicherte Datei zählt eine Angabe mit Ablage nicht.
    expect((await submitRecord({ ...vorlage, uploads: dreiFotos })).ok).toBe(false);
    expect(stored).toHaveLength(0);
  });

  it('prüft beim Gehäuse die Tastenzahl und nach Vorlage die Stückzahl auf dem Server', async () => {
    for (const tasten of [undefined, '', '5-6', 3]) {
      const result = await submitRecord({ ...gehaeuse, payload: { ...gehaeuse.payload, tasten }, uploads: [fahrzeugschein, ...dreiFotos] });
      expect(result.ok, String(tasten)).toBe(false);
      expect(result.error).toContain('Tasten');
    }
    for (const stueckzahl of [0, 21, 2.5, '3', undefined]) {
      const result = await submitRecord({ ...vorlage, payload: { ...vorlage.payload, stueckzahl }, uploads: dreiFotos });
      expect(result.ok, String(stueckzahl)).toBe(false);
      expect(result.error).toContain('Stückzahl');
    }
    expect((await submitRecord({ ...gehaeuse, uploads: [fahrzeugschein, ...dreiFotos] })).ok).toBe(true);
    expect(stored[0].payload.tasten).toBe('1-2');
  });

  it('nimmt beim Gehäuse nur die vier Leistungen an; ein erfundener Wert wird „unklar“, auch in der Zusammenfassung (FA-SHOP-02C)', async () => {
    const summary = [
      {
        title: 'Fahrzeug und Schlüssel',
        rows: [
          { label: 'Marke', value: 'Testmarke' },
          { label: 'Gewünschte Leistung', value: 'Testwunsch aus dem Browser' },
          { label: 'Ihr Anliegen', value: BESCHREIBUNG },
        ],
      },
    ];
    const faelle: Array<[unknown, string, string]> = [
      ['gehaeusetausch', 'gehaeusetausch', 'Gehäusetausch im Einsendeservice'],
      ['reparatur', 'reparatur', 'Reparatur (Tasten, Mechanik)'],
      ['umbau', 'umbau', 'Umbau auf anderes Gehäuse (Customizing)'],
      ['unklar', 'unklar', 'Noch offen, bitte beraten'],
      ['testwert-erfunden', 'unklar', 'Noch offen, bitte beraten'],
      [undefined, 'unklar', 'Noch offen, bitte beraten'],
      [3, 'unklar', 'Noch offen, bitte beraten'],
    ];
    for (const [leistung, gespeichert, text] of faelle) {
      stored.length = 0;
      const result = await submitRecord({ ...gehaeuse, summary, payload: { ...gehaeuse.payload, leistung }, uploads: [fahrzeugschein, ...dreiFotos] });
      expect(result.ok, String(leistung)).toBe(true);
      expect(stored[0].payload.leistung, String(leistung)).toBe(gespeichert);
      const zeilen = stored[0].summary[0].rows;
      expect(zeilen.filter((z) => z.label === 'Gewünschte Leistung'), String(leistung)).toEqual([{ label: 'Gewünschte Leistung', value: text }]);
      // Die Zeile steht vor „Ihr Anliegen“.
      expect(zeilen.map((z) => z.label)).toEqual(['Marke', 'Gewünschte Leistung', 'Ihr Anliegen']);
    }
  });

  it('die Pflichtregel für Unterlagen gilt beim Gehäuse für jede Leistung gleich (R13, FA-SHOP-02C)', async () => {
    // Die Pflichtregel für Unterlagen gilt für jede Leistung gleich (R13): ohne Fahrzeugschein kein Vorgang.
    for (const leistung of ['gehaeusetausch', 'reparatur', 'umbau', 'unklar']) {
      expect((await submitRecord({ ...gehaeuse, payload: { ...gehaeuse.payload, leistung }, uploads: [...dreiFotos] })).ok, leistung).toBe(false);
    }
  });

  it('verlangt in jedem Weg eine kurze Beschreibung des Anliegens', async () => {
    for (const [name, weg, unterlagen] of [['motorrad', motorrad, [fahrzeugschein, ...dreiFotos]], ['gehaeuse', gehaeuse, [fahrzeugschein, ...dreiFotos]], ['vorlage', vorlage, dreiFotos], ['auto', fahrzeug('auto'), [fahrzeugschein, ...dreiFotos]]] as const) {
      const result = await submitRecord({ ...weg, payload: { ...weg.payload, beschreibung: 'zu kurz' }, uploads: [...unterlagen] });
      expect(result.ok, name).toBe(false);
      expect(result.error, name).toContain('kurze Beschreibung');
    }
    expect(stored).toHaveLength(0);
  });

  it('nennt in der Meldung alles, was fehlt, und warum', async () => {
    const result = await submitRecord({ ...motorrad, payload: { quelle: 'motorrad' }, uploads: [] });
    expect(result.error).toBe(
      'Bitte ergänzen Sie noch den Fahrzeugschein (Zulassungsbescheinigung Teil I), das Foto der Vorderseite Ihres Schlüssels, '
      + 'das Foto der Rückseite Ihres Schlüssels, das Foto der Spitze beziehungsweise des Profils von vorne und eine kurze '
      + 'Beschreibung Ihres Anliegens (mindestens 20 Zeichen). Die Unterlagen schützen Sie vor Missbrauch: Wir fertigen '
      + 'Schlüssel nur für Berechtigte.',
    );
  });

  it('lässt die allgemeine Anfrage, unbekannte Quellen und unbekannte Klassen nicht durch die Regel fallen', async () => {
    // Die allgemeine Anfrage mit Thema „Schlüssel nach Vorlage“ trägt keine Steckplätze. Der Server legt sie unter
    // „Service und Termin“ ab: keine Foto-Anfrage, also nie Freigabe mit Zahlung ohne die drei Fotos.
    expect((await submitRecord({ ...anfrage, area: 'schluessel-nach-vorlage', payload: { thema: 'schluessel-nach-vorlage', beschreibung: BESCHREIBUNG }, uploads: [] })).ok).toBe(true);
    expect(stored[0]).toMatchObject({ area: 'service-und-termin', payload: { thema: 'schluessel-nach-vorlage' } });
    // Erfundene Quelle: Nach Vorlage und bei Autoschlüsseln abgelehnt, auch mit allen Unterlagen.
    for (const [area, unterlagen] of [['schluessel-nach-vorlage', dreiFotos], ['autoschluessel', [fahrzeugschein, ...dreiFotos]]] as const) {
      const ohne = await submitRecord({ ...anfrage, area, payload: { quelle: 'x', stueckzahl: 2, beschreibung: BESCHREIBUNG }, uploads: [] });
      expect(ohne.ok, area).toBe(false);
      const mit = await submitRecord({ ...anfrage, area, payload: { quelle: 'x', stueckzahl: 2, beschreibung: BESCHREIBUNG }, uploads: [...unterlagen] });
      expect(mit.ok, area).toBe(false);
    }
    // Foto-Anfrage mit zusätzlichem Feld `thema`: Die Pflichtregel greift trotzdem.
    const mitThema = await submitRecord({ ...vorlage, payload: { ...vorlage.payload, thema: 'schluessel-nach-vorlage' }, uploads: [] });
    expect(mitThema.ok).toBe(false);
    expect(mitThema.error).toContain('Vorderseite');
    // Ohne Quelle und ohne Thema: Foto-Anfrage, ohne Fotos abgelehnt.
    expect((await submitRecord({ ...anfrage, area: 'schluessel-nach-vorlage', payload: { stueckzahl: 2, beschreibung: BESCHREIBUNG }, uploads: [] })).ok).toBe(false);
    expect(stored).toHaveLength(1);
    // Unbekannte Klasse in der Fahrzeug-Anfrage: abgelehnt.
    expect((await submitRecord({ ...fahrzeug('lkw'), uploads: [fahrzeugschein, ...dreiFotos] })).ok).toBe(false);
  });

  it('nimmt eine allgemeine Anfrage im Bereich Autoschlüssel nur als Frage an (FA-06-U2, R13)', async () => {
    const allgemein = { ...anfrage, area: 'autoschluessel' as const, uploads: [] };
    // Die ehrliche Frage aus dem Formular (Thema Autoschlüssel, „Ich habe eine Frage“) geht weiter durch.
    const frage = await submitRecord({ ...allgemein, payload: { thema: 'autoschluessel', anliegenArt: 'frage', beschreibung: BESCHREIBUNG } });
    expect(frage.ok).toBe(true);
    expect(stored[0]).toMatchObject({ area: 'autoschluessel', payload: { anliegenArt: 'frage' } });
    // Gefälscht: ohne Quelle als Schlüsselwunsch, ohne Angabe oder mit erfundener Art. Abgelehnt, auch mit Unterlagen.
    for (const [name, payload] of [
      ['schluessel', { thema: 'autoschluessel', anliegenArt: 'schluessel', beschreibung: BESCHREIBUNG }],
      ['ohne Angabe', { thema: 'autoschluessel', beschreibung: BESCHREIBUNG }],
      ['ohne Thema', { beschreibung: BESCHREIBUNG }],
      ['erfunden', { thema: 'autoschluessel', anliegenArt: 'Frage', beschreibung: BESCHREIBUNG }],
    ] as const) {
      expect((await submitRecord({ ...allgemein, payload })).ok, name).toBe(false);
      expect((await submitRecord({ ...allgemein, payload, uploads: [fahrzeugschein, ...dreiFotos] })).ok, `${name} mit Unterlagen`).toBe(false);
    }
    expect(stored).toHaveLength(1);
    // Die geführten Wege mit Quelle bleiben unberührt: Ohne Fahrzeugschein kommt kein Schlüsselauftrag durch.
    const ohneSchein = await submitRecord({ ...fahrzeug('auto', { anliegenArt: 'frage' }), uploads: dreiFotos });
    expect(ohneSchein.ok).toBe(false);
    expect(ohneSchein.error).toContain('Fahrzeugschein');
  });
});

describe('submitRecord: gemeinsame Fahrzeugschlüssel-Anfrage aus dem Formular (FA-KERN-02B, FA-27)', async () => {
  const { INITIAL, kontaktAus, leereUnterlagen, payloadAus, pflichtFuer, uploadsAus, zusammenfassung } = await import('@/components/fahrzeug-anfrage/kern');
  const { pflichtTabelle } = await import('@/components/fahrzeug-anfrage/pflicht');
  type Daten = typeof INITIAL;
  type Klasse = Parameters<typeof payloadAus>[0];

  /** Erfundene Testdateien (G5): nur Name und Kennung, wie sie das Upload-Feld meldet. */
  const datei = (name: string) => ({ id: name, name });
  const alleDateien = () => ({
    ...leereUnterlagen<{ id: string; name: string }>(),
    fahrzeugschein: [datei('fahrzeugschein.jpg')],
    ersatznachweis: [datei('nachweis.pdf')],
    typenschild: [datei('typenschild.jpg')],
    fotos: {
      'schluessel-vorderseite': [datei('vorne.jpg')],
      'schluessel-rueckseite': [datei('hinten.jpg')],
      'schluessel-spitze': [datei('spitze.jpg')],
    },
  });
  const alsTestUpload = (d: { name: string }, category: UploadRef['category'], steckplatz: UploadRef['steckplatz']) => ({
    fileName: d.name,
    sizeBytes: 50_000,
    mimeType: d.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
    category,
    ...(steckplatz ? { steckplatz } : {}),
  });
  const kontaktDaten = { vorname: 'Erika', nachname: 'Muster', email: 'erika@example.org', telefon: '0301234567' };

  /** Vollständige Angaben je Klasse, so wie das Formular sie sammelt (erfundene Testdaten). */
  const FAELLE: Record<string, { klasse: Klasse; daten: Partial<Daten> }> = {
    motorrad: { klasse: 'motorrad', daten: { hersteller: 'Testwerk', modell: 'TX 700', baujahr: '2019', transponder: 'ja' } },
    'roller mit Fahrzeugschein': { klasse: 'roller', daten: { hersteller: 'Testwerk', modell: 'R 125', roller: 'zulassung', transponder: 'nein' } },
    'roller mit Versicherungskennzeichen': {
      klasse: 'roller',
      daten: { hersteller: 'Testwerk', modell: 'R 50', roller: 'versicherungskennzeichen', transponder: 'unklar', ersatznachweis: 'versicherungsbescheinigung', fin: 'WVWZZZ1JZXW000001' },
    },
    'e-scooter': { klasse: 'e-scooter', daten: { hersteller: 'Testwerk', modell: 'E 20', ersatznachweis: 'kaufbeleg' } },
    seniorenmobil: { klasse: 'seniorenmobil', daten: { hersteller: 'Testwerk', modell: 'S 6', ersatznachweis: 'betriebserlaubnis', keinTypenschild: true } },
    fahrrad: { klasse: 'fahrrad', daten: { schlossHersteller: 'Testschloss', schluesselnummer: 'K 4711', ersatznachweis: 'codekarte' } },
    'nicht-gefunden': { klasse: 'nicht-gefunden', daten: { hersteller: 'Testmarke', modell: 'Testmodell', baujahr: '2012', transponder: 'ja' } },
  };

  function ausFormular(name: string, aendern: (dateien: ReturnType<typeof alleDateien>) => void = () => {}) {
    const { klasse, daten: teil } = FAELLE[name];
    const daten: Daten = { ...INITIAL, ...kontaktDaten, schluessel: 'vorhanden', beschreibung: BESCHREIBUNG, ...teil };
    const pflicht = pflichtFuer(pflichtTabelle(klasse), daten);
    const dateien = alleDateien();
    aendern(dateien);
    return {
      pflicht,
      eingabe: {
        kind: 'anfrage' as const,
        area: 'autoschluessel' as const,
        process: 'gefuehrte-anfrage' as const,
        contact: kontaktAus(daten),
        payload: payloadAus(klasse, daten),
        summary: zusammenfassung(klasse, daten),
        uploads: uploadsAus(pflicht, dateien, alsTestUpload),
      },
    };
  }

  it.each(Object.keys(FAELLE))('%s: vollständig angenommen, mit Klasse und Steckplätzen im Vorgang', async (name) => {
    const { eingabe } = ausFormular(name);
    const result = await submitRecord(eingabe);
    expect(result.ok, result.error).toBe(true);
    expect(stored[0].area).toBe('autoschluessel');
    expect(stored[0].payload).toMatchObject({ quelle: 'fahrzeug-anfrage', klasse: FAELLE[name].klasse });
    expect(stored[0].summary[0].rows[0].label).toBe('Fahrzeugklasse');
    expect(stored[0].uploads.every((u) => u.steckplatz)).toBe(true);
  });

  it.each(Object.keys(FAELLE))('%s: ohne Pflichtunterlage abgelehnt, je Unterlage', async (name) => {
    const { pflicht } = ausFormular(name);
    const dateiPlaetze = pflicht.filter((p) => p === 'fahrzeugschein' || p === 'ersatznachweis' || p.startsWith('schluessel-'));
    expect(dateiPlaetze.length).toBeGreaterThanOrEqual(4);
    for (const platz of dateiPlaetze) {
      const { eingabe } = ausFormular(name, (d) => {
        if (platz === 'fahrzeugschein' || platz === 'ersatznachweis') d[platz] = [];
        else d.fotos[platz as keyof typeof d.fotos] = [];
      });
      resetRateLimits();
      const result = await submitRecord(eingabe);
      expect(result.ok, `${name} ohne ${platz}`).toBe(false);
      expect(result.error).toContain('Bitte ergänzen Sie');
    }
    expect(stored).toHaveLength(0);
  });

  /** Rubrik je Klasse (FA-SOFORT-05): Eine im Backend abgeschaltete Rubrik sperrt auch ihren Weg. */
  const RUBRIK_DER_KLASSE: Record<string, string> = {
    motorrad: 'motorradschluessel',
    'roller mit Fahrzeugschein': 'roller-und-kleinstfahrzeuge',
    'roller mit Versicherungskennzeichen': 'roller-und-kleinstfahrzeuge',
    'e-scooter': 'e-scooter',
    seniorenmobil: 'seniorenmobile',
    fahrrad: 'fahrradschluessel',
    'nicht-gefunden': 'autoschluessel',
  };

  it.each(Object.keys(FAELLE))('%s: abgeschaltete Rubrik sperrt den Weg, die anderen Rubriken nicht', async (name) => {
    const rubrik = RUBRIK_DER_KLASSE[name];
    expect(defaults.rubriken().some((r) => r.id === rubrik && r.status === 'live')).toBe(true);
    abgeschaltet.add(rubrik);
    const gesperrt = await submitRecord(ausFormular(name).eingabe);
    expect(gesperrt.ok, name).toBe(false);
    // Kein Formularfehler, den der Kunde nicht beheben kann, sondern der Weg zum Telefon.
    // Die Nummer im Startinhalt ist ein Platzhalter und erscheint deshalb nicht in der Meldung.
    expect(gesperrt.error).toBe('Diese Anfrage ist gerade nicht möglich. Bitte rufen Sie uns an.');
    expect(stored).toHaveLength(0);
    // Status „später“ sperrt den Weg ebenso.
    abgeschaltet.clear();
    spaeterGeschaltet.add(rubrik);
    resetRateLimits();
    const spaeter = await submitRecord(ausFormular(name).eingabe);
    expect(spaeter.ok, name).toBe(false);
    expect(spaeter.error).toContain('Diese Anfrage ist gerade nicht möglich');
    expect(stored).toHaveLength(0);
    spaeterGeschaltet.clear();
    // Eine fremde Rubrik abzuschalten, ändert an diesem Weg nichts.
    abgeschaltet.clear();
    abgeschaltet.add(rubrik === 'sicherheitstechnik' ? 'beratung' : 'sicherheitstechnik');
    resetRateLimits();
    expect((await submitRecord(ausFormular(name).eingabe)).ok, name).toBe(true);
  });

  it('die Rubrikprüfung lockert die Pflichtregel nicht: mit eingeschalteter Rubrik fehlt der Fahrzeugschein weiter', async () => {
    const ohneSchein = await submitRecord(ausFormular('motorrad', (d) => (d.fahrzeugschein = [])).eingabe);
    expect(ohneSchein.ok).toBe(false);
    expect(ohneSchein.error).toContain('Fahrzeugschein');
  });

  it('lehnt eine unbekannte Klasse ab', async () => {
    const { eingabe } = ausFormular('motorrad');
    for (const klasse of ['constructor', 'toString', 'lkw']) {
      resetRateLimits();
      expect((await submitRecord({ ...eingabe, payload: { ...eingabe.payload, klasse } })).ok, klasse).toBe(false);
    }
    expect(stored).toHaveLength(0);
  });

  it('Roller mit Versicherungskennzeichen nimmt den Ersatznachweis, ein zugelassener Roller nicht', async () => {
    const mitVk = ausFormular('roller mit Versicherungskennzeichen');
    expect(mitVk.pflicht).toContain('ersatznachweis');
    expect(mitVk.pflicht).not.toContain('fahrzeugschein');
    expect((await submitRecord(mitVk.eingabe)).ok).toBe(true);

    // Zugelassener Roller mit Ersatznachweis statt Fahrzeugschein, wie ein manipulierter Browser ihn schickt.
    const zugelassen = ausFormular('roller mit Fahrzeugschein');
    expect(zugelassen.pflicht).toContain('fahrzeugschein');
    const ohneSchein = {
      ...zugelassen.eingabe,
      payload: { ...zugelassen.eingabe.payload, ersatznachweis: 'versicherungsbescheinigung', fin: 'WVWZZZ1JZXW000001' },
      uploads: [ersatznachweis, typenschild, ...dreiFotos],
    };
    const result = await submitRecord(ohneSchein);
    expect(result.ok).toBe(false);
    expect(result.error).toContain('Fahrzeugschein');
    expect(stored).toHaveLength(1);
  });

  it('„Fahrzeug nicht gefunden“ verlangt Fahrzeugschein und drei Fotos', async () => {
    const { pflicht } = ausFormular('nicht-gefunden');
    expect(pflicht).toEqual(['fahrzeugschein', 'schluessel-vorderseite', 'schluessel-rueckseite', 'schluessel-spitze', 'beschreibung']);
    const ohneSchein = await submitRecord(ausFormular('nicht-gefunden', (d) => (d.fahrzeugschein = [])).eingabe);
    expect(ohneSchein.error).toContain('Fahrzeugschein');
    const zweiFotos = await submitRecord(ausFormular('nicht-gefunden', (d) => (d.fotos['schluessel-spitze'] = [])).eingabe);
    expect(zweiFotos.error).toContain('Profils von vorne');
    // Ein Ersatznachweis ersetzt den Fahrzeugschein auch hier nicht (R13).
    const mitErsatz = ausFormular('nicht-gefunden', (d) => (d.fahrzeugschein = []));
    const ersatz = await submitRecord({ ...mitErsatz.eingabe, uploads: [...mitErsatz.eingabe.uploads, ersatznachweis] });
    expect(ersatz.ok).toBe(false);
    expect(stored).toHaveLength(0);
    expect((await submitRecord(ausFormular('nicht-gefunden').eingabe)).ok).toBe(true);
  });
});

describe('submitRecord: Code anfragen (FA-11-17, A-046)', () => {
  const basis: RecordEingabe = {
    kind: 'anfrage',
    area: 'schluessel-nach-code',
    process: 'gefuehrte-anfrage',
    contact,
    summary: [],
    uploads: [],
    payload: {},
  };
  const gueltig = { thema: 'schluessel-nach-code', schloss: 'Briefkastenanlage', code: ' B1042 ', stueckzahl: 2, berechtigt: true };

  it('nimmt eine vollständige Code-Anfrage an und speichert die geprüften Angaben', async () => {
    const ergebnis = await submitRecord({ ...basis, payload: gueltig });
    expect(ergebnis.ok).toBe(true);
    expect(stored[0].payload).toMatchObject({ quelle: 'code-anfrage', schloss: 'Briefkastenanlage', code: 'B1042', stueckzahl: 2, berechtigt: true });
  });

  it('baut den Abschnitt „Code“ der Zusammenfassung aus den geprüften Angaben', async () => {
    const summary = [
      {
        title: 'Code',
        rows: [
          { label: 'Hersteller oder Schloss', value: 'Tresor' },
          { label: 'Code wie aufgedruckt', value: 'ANDERS' },
          { label: 'Stückzahl', value: '50' },
          { label: 'Berechtigung', value: 'bestätigt' },
          { label: 'Hinweis', value: 'aus dem Browser' },
        ],
      },
      { title: 'Kontakt', rows: [{ label: 'Name', value: 'Erika Muster' }] },
    ];
    expect((await submitRecord({ ...basis, payload: gueltig, summary })).ok).toBe(true);
    const code = stored[0].summary.filter((abschnitt) => abschnitt.title === 'Code');
    expect(code).toEqual([
      {
        title: 'Code',
        rows: [
          { label: 'Hersteller oder Schloss', value: 'Briefkastenanlage' },
          { label: 'Code wie aufgedruckt', value: 'B1042' },
          { label: 'Stückzahl', value: '2' },
          { label: 'Berechtigung', value: 'bestätigt' },
        ],
      },
    ]);
    // Die übrigen Abschnitte bleiben.
    expect(stored[0].summary.find((abschnitt) => abschnitt.title === 'Kontakt')).toEqual(summary[1]);
  });

  it('lehnt ab ohne Schloss, Code, Stückzahl oder Berechtigung (R13)', async () => {
    for (const falsch of [{ schloss: '' }, { code: '' }, { stueckzahl: 0 }, { berechtigt: false }, { berechtigt: undefined }]) {
      expect((await submitRecord({ ...basis, payload: { ...gueltig, ...falsch } })).ok, JSON.stringify(falsch)).toBe(false);
    }
    // Auch eine allgemeine Anfrage zum Thema Code braucht die Angaben.
    expect((await submitRecord({ ...basis, payload: { thema: 'schluessel-nach-code', beschreibung: 'Ich brauche einen Schlüssel für meinen Briefkasten.' } })).ok).toBe(false);
    expect(stored).toHaveLength(0);
  });
});

describe('submitOrder', () => {
  const line = testLinien()[0];
  const shipping = defaults.settings().shipping.find((s) => s.productClasses.includes('code-schluessel'))!;

  function order(expectedTotalCents: number, shippingOptionId = shipping.id) {
    return submitOrder({
      items: [
        {
          kind: 'code-schluessel',
          uid: 'a',
          codeLineId: line.id,
          code: line.codeExample,
          qty: 1,
          unitPriceCents: 1,
          photoRefs: [],
        },
      ],
      shippingOptionId,
      contact,
      acceptedTerms: true,
      acceptedCustomMade: true,
      expectedTotalCents,
    });
  }

  it('verlangt bei geschützten Codelinien die Sicherungskarte auch auf dem Server (R13, E6-OPUS-01)', async () => {
    const geschuetzt = testLinien().find((l) => l.photoUpload === 'pflicht' && l.active && !l.example)!;
    const foto = (category: 'schluesselfoto' | 'sicherungskarte') => ({
      id: `datei-${category}`,
      fileName: `${category}.jpg`,
      sizeBytes: 120_000,
      mimeType: 'image/jpeg',
      category,
      uploadedAt: '2026-11-04T02:00:00.000Z',
    });
    const bestellung = (photoRefs: ReturnType<typeof foto>[]) =>
      submitOrder({
        items: [{ kind: 'code-schluessel', uid: 'k', codeLineId: geschuetzt.id, code: geschuetzt.codeExample, qty: 1, unitPriceCents: 1, photoRefs }],
        shippingOptionId: shipping.id,
        contact,
        acceptedTerms: true,
        acceptedCustomMade: true,
        expectedTotalCents: geschuetzt.priceCents + shipping.priceCents,
      });
    const ohne = await bestellung([]);
    expect(ohne.ok).toBe(false);
    expect(ohne.error).toContain('Sicherungskarte');
    expect((await bestellung([foto('schluesselfoto')])).ok).toBe(false);
    expect((await bestellung([foto('sicherungskarte')])).ok).toBe(true);
    expect(stored[0].uploads.map((u) => u.category)).toEqual(['sicherungskarte']);
  });

  it('bestellt nur zum angezeigten Betrag und meldet eine Abweichung', async () => {
    const result = await order(1);
    expect(result.ok).toBe(false);
    expect(result.priceChanged?.expectedCents).toBe(1);
    expect(stored).toHaveLength(0);
  });

  it('lehnt Beispiel-Codelinien ab, auch wenn der Browser sie in den Warenkorb legt (A-046)', async () => {
    const beispiel = testLinien().find((l) => l.example)!;
    const result = await submitOrder({
      items: [{ kind: 'code-schluessel', uid: 'b', codeLineId: beispiel.id, code: beispiel.codeExample, qty: 1, unitPriceCents: 1, photoRefs: [] }],
      shippingOptionId: shipping.id,
      contact,
      acceptedTerms: true,
      acceptedCustomMade: true,
      expectedTotalCents: beispiel.priceCents + shipping.priceCents,
    });
    expect(result.ok).toBe(false);
    expect(result.error).toContain('nicht mehr verfügbar');
    expect(stored).toHaveLength(0);
  });

  it.each([
    ['test-auf-anfrage', 'nur auf Anfrage'],
    ['test-nicht-lieferbar', 'derzeit nicht lieferbar'],
  ])('sperrt die Codelinie %s auf dem Server (FA-22-10)', async (id, meldung) => {
    const linie = testLinien().find((l) => l.id === id)!;
    const result = await submitOrder({
      items: [{ kind: 'code-schluessel', uid: 'v', codeLineId: linie.id, code: linie.codeExample, qty: 1, unitPriceCents: linie.priceCents, photoRefs: [] }],
      shippingOptionId: shipping.id,
      contact,
      acceptedTerms: true,
      acceptedCustomMade: true,
      expectedTotalCents: linie.priceCents + shipping.priceCents,
    });
    expect(result.ok).toBe(false);
    expect(result.error).toContain(meldung);
    expect(stored).toHaveLength(0);
  });

  it.each([
    ['test-artikel-auf-anfrage', 'nur auf Anfrage'],
    ['test-artikel-nicht-lieferbar', 'derzeit nicht lieferbar'],
  ])('sperrt den Artikel %s auf dem Server (FA-22-10)', async (id, meldung) => {
    const artikel = testArtikel().find((a) => a.id === id)!;
    const result = await submitOrder({
      items: [{ kind: 'standard', uid: 'n', productId: artikel.id, label: artikel.name, shippingClass: artikel.shippingClass, qty: 1, unitPriceCents: artikel.priceCents }],
      shippingOptionId: shipping.id,
      contact,
      acceptedTerms: true,
      acceptedCustomMade: true,
      expectedTotalCents: artikel.priceCents,
    });
    expect(result.ok).toBe(false);
    expect(result.error).toContain(meldung);
    expect(stored).toHaveLength(0);
  });

  it('lehnt Beispielartikel ab, auch wenn der Browser sie in den Warenkorb legt', async () => {
    const beispiel = defaults.standardArticles()[0];
    const result = await submitOrder({
      items: [
        {
          kind: 'standard',
          uid: 's',
          productId: beispiel.id,
          label: 'gefälscht',
          shippingClass: 'zubehoer',
          qty: 1,
          unitPriceCents: 1,
        },
      ],
      shippingOptionId: shipping.id,
      contact,
      acceptedTerms: true,
      acceptedCustomMade: true,
      expectedTotalCents: 1,
    });
    expect(result.ok).toBe(false);
    expect(result.error).toContain('Beispielartikel');
    expect(stored).toHaveLength(0);
  });

  it('rechnet mit dem Serverpreis und gibt einen Link-Schlüssel zurück', async () => {
    const total = line.priceCents + shipping.priceCents;
    const result = await order(total);
    expect(result.ok).toBe(true);
    expect(stored[0].payment?.amountCents).toBe(total);
    expect(result.accessToken).toBeTruthy();
    expect(verifyAccessToken(result.accessToken, stored[0].accessTokenHash)).toBe(true);
  });

  it('schreibt Positionen und Summen mit den Serverpreisen fest', async () => {
    const total = line.priceCents + shipping.priceCents;
    const result = await order(total);
    expect(result.ok).toBe(true);
    expect(stored[0].lines).toEqual([
      {
        kind: 'code-schluessel',
        productId: line.id,
        label: line.name,
        details: `Code ${line.codeExample}`,
        qty: 1,
        unitPriceCents: line.priceCents,
        totalCents: line.priceCents,
        vatPercent: 19,
      },
    ]);
    expect(stored[0].totals).toEqual({
      itemsCents: line.priceCents,
      shippingCents: shipping.priceCents,
      totalCents: total,
      vatCents: Math.round(total - total / 1.19),
      shippingLabel: shipping.label,
    });
  });

  it('schreibt Zylinder-Zusammenstellungen mit Maßen, Funktion und Schlüsseln fest', async () => {
    const catalog = defaults.cylinderCatalog();
    const draft: CylinderOrderDraft = {
      items: [
        { uid: 'a', form: 'doppelzylinder', measureAMm: 30, measureBMm: 35, functionId: 'not-gefahr', qty: 2 },
        { uid: 'b', form: 'halbzylinder', measureAMm: 30, qty: 1 },
      ],
      keyCount: 5,
      extraIds: [],
      expandable: true,
    };
    const versand = defaults.settings().shipping.find((s) => s.id === 'paket-versichert')!;
    const preis = priceCylinderOrder(draft, catalog).totalCents;
    const result = await submitOrder({
      items: [{ kind: 'zylinder-schliessung', uid: 'z', qty: 1, unitPriceCents: 1, draft }],
      shippingOptionId: versand.id,
      contact,
      acceptedTerms: true,
      acceptedCustomMade: true,
      expectedTotalCents: preis + versand.priceCents,
    });
    expect(result.ok).toBe(true);
    const [position] = stored[0].lines ?? [];
    expect(position).toMatchObject({
      kind: 'zylinder-schliessung',
      productId: 'zylinder-schliessung',
      qty: 1,
      unitPriceCents: preis,
      totalCents: preis,
    });
    expect(position.details).toBe(zylinderDetails(draft, catalog));
    expect(position.details).toContain('Gemeinsame Schlüssel: 5 Stück');
    expect(stored[0].totals?.shippingLabel).toBe(versand.label);
  });

  it('speichert die Zustimmungen und verlangt die Anfertigungs-Bestätigung nur bei Sonderanfertigungen', async () => {
    const total = line.priceCents + shipping.priceCents;
    const ohne = await submitOrder({
      items: [{ kind: 'code-schluessel', uid: 'a', codeLineId: line.id, code: line.codeExample, qty: 1, unitPriceCents: 1, photoRefs: [] }],
      shippingOptionId: shipping.id,
      contact,
      acceptedTerms: true,
      acceptedCustomMade: false,
      expectedTotalCents: total,
    });
    expect(ohne.ok).toBe(false);
    expect(ohne.error).toContain('Anfertigung');
    expect(stored).toHaveLength(0);

    expect((await order(total)).ok).toBe(true);
    expect(stored[0].consents).toMatchObject({ terms: true, withdrawalNotice: true, customMade: true });
  });

  it('liefert nur nach Deutschland und prüft die Postleitzahl', async () => {
    const total = line.priceCents + shipping.priceCents;
    const mit = (kontakt: typeof contact) =>
      submitOrder({
        items: [{ kind: 'code-schluessel', uid: 'a', codeLineId: line.id, code: line.codeExample, qty: 1, unitPriceCents: 1, photoRefs: [] }],
        shippingOptionId: shipping.id,
        contact: kontakt,
        acceptedTerms: true,
        acceptedCustomMade: true,
        expectedTotalCents: total,
      });
    const ausland = await mit({ ...contact, country: 'Österreich', postalCode: '1010' });
    expect(ausland.ok).toBe(false);
    expect(ausland.error).toContain('nur nach Deutschland');
    expect((await mit({ ...contact, postalCode: '3557' })).ok).toBe(false);
    expect((await mit({ ...contact, street: '' })).ok).toBe(false);
    expect(stored).toHaveLength(0);
  });

  it('lehnt unbekannte Versandarten ab statt kostenlos zu versenden', async () => {
    const result = await order(line.priceCents, 'gibt-es-nicht');
    expect(result.ok).toBe(false);
  });

  it('lehnt eine Zusammenstellung mit unbestätigtem Preis ab, bestätigte bleiben bestellbar (FA-SHOP-04)', async () => {
    const versand = defaults.settings().shipping.find((s) => s.id === 'paket-versichert')!;
    // Drei verschiedene Maße in einem gleichschließenden Satz, wie im Konfigurator.
    const mitHalb: CylinderOrderDraft = {
      items: [
        { uid: 'a', form: 'doppelzylinder', measureAMm: 30, measureBMm: 30, qty: 2 },
        { uid: 'b', form: 'doppelzylinder', measureAMm: 35, measureBMm: 45, qty: 1 },
        { uid: 'c', form: 'halbzylinder', measureAMm: 40, qty: 1 },
      ],
      keyCount: 3,
      extraIds: [],
      expandable: false,
    };
    const bestellen = (draft: CylinderOrderDraft) =>
      submitOrder({
        items: [{ kind: 'zylinder-schliessung', uid: 'z', qty: 1, unitPriceCents: 1, draft }],
        shippingOptionId: versand.id,
        contact,
        acceptedTerms: true,
        acceptedCustomMade: true,
        expectedTotalCents: priceCylinderOrder(draft, testKatalog()).totalCents + versand.priceCents,
      });

    unbestaetigteBauformen.add('halbzylinder');
    const gesperrt = await bestellen(mitHalb);
    expect(gesperrt.ok).toBe(false);
    expect(gesperrt.error).toContain('Der Preis für „Halbzylinder“ ist noch nicht bestätigt.');
    // Kein Ende ohne Ausweg: Die Meldung nennt den Weg in die Anfrage.
    expect(gesperrt.error).toContain('im Konfigurator für gleichschließende Zylinder');
    expect(stored).toHaveLength(0);

    // Ohne Halbzylinder: bestellbar, zum unveränderten Preis aus dem Katalog.
    const ohneHalb = { ...mitHalb, items: mitHalb.items.slice(0, 2) };
    const ok = await bestellen(ohneHalb);
    expect(ok.ok).toBe(true);
    expect(stored[0].lines?.[0].totalCents).toBe(priceCylinderOrder(ohneHalb, defaults.cylinderCatalog()).totalCents);
  });

  it('drei Maße in einem Satz: vom Konfigurator-Zustand über den Warenkorb bis zur Serverprüfung, mit Herstellerwahl (FA-SHOP-04B)', async () => {
    const { zuEntwurf } = await import('@/app/(site)/gleichschliessende-zylinder/konfigurator/kern');
    const { systemeFuerSperrschliessung } = await import('@/lib/konfigurator/hersteller-angabe');
    const { useCartStore } = await import('@/lib/store/cart');
    const versand = defaults.settings().shipping.find((s) => s.id === 'paket-versichert')!;
    const katalog = testKatalog();
    const systeme = systemeFuerSperrschliessung(defaults.hersteller());
    // Zustand des Konfigurators: drei verschiedene Maße, Sicherungskarte, Erweiterung, BKS als Wahl.
    const zustand = {
      items: [
        { uid: 'position-1', form: 'doppelzylinder' as const, measureAMm: 30, measureBMm: 35, qty: 2 },
        { uid: 'position-2', form: 'doppelzylinder' as const, measureAMm: 40, measureBMm: 45, qty: 1 },
        { uid: 'position-3', form: 'halbzylinder' as const, measureAMm: 40, qty: 1 },
      ],
      keyCount: 5,
      extraIds: ['sicherungskarte'],
      expandable: true,
      manufacturerId: '',
      components: [],
      herstellerAngabe: 'bks',
    };
    const entwurf = zuEntwurf(zustand, katalog, systeme);
    const preis = priceCylinderOrder(entwurf, katalog);
    useCartStore.getState().clear();
    useCartStore.getState().addCylinderOrder(entwurf, preis.totalCents);
    const position = useCartStore.getState().items[0];
    expect(position.kind).toBe('zylinder-schliessung');
    const bestellen = (item: typeof position) =>
      submitOrder({
        items: [item],
        shippingOptionId: versand.id,
        contact,
        acceptedTerms: true,
        acceptedCustomMade: true,
        expectedTotalCents: preis.totalCents + versand.priceCents,
      });

    const ok = await bestellen(position);
    expect(ok.ok).toBe(true);
    const zeile = stored[0].lines?.[0];
    expect(zeile?.totalCents).toBe(preis.totalCents);
    expect(zeile?.details).toContain('Hersteller (Ihre Wahl): BKS');
    expect(zeile?.details).toContain('30 mm / 35 mm');
    expect(zeile?.details).toContain('40 mm / 45 mm');
    expect(zeile?.details).toContain('Halbzylinder: 40 mm');
    expect(zeile?.details).toContain('Gemeinsame Schlüssel: 5 Stück');
    expect(zeile?.details).toContain('Sicherungskarte und geschütztes System');
    expect(zeile?.details).toContain('Spätere Erweiterung: Vorgesehen');

    // Ein Hersteller, den der Stamm für Sperrschließungen nicht führt, kommt nicht durch.
    if (position.kind !== 'zylinder-schliessung') return;
    const fremd = await bestellen({ ...position, draft: { ...position.draft, herstellerAngabe: 'Erfunden' } });
    expect(fremd.ok).toBe(false);
    expect(fremd.error).toContain('im Konfigurator neu');
    expect(stored).toHaveLength(1);
    useCartStore.getState().clear();
  });

  it('lehnt nicht wählbare Zylindermaße ab', async () => {
    const result = await submitOrder({
      items: [
        {
          kind: 'zylinder-schliessung',
          uid: 'z',
          qty: 1,
          unitPriceCents: 1,
          draft: {
            items: [{ uid: 'p', form: 'doppelzylinder', measureAMm: 31, measureBMm: 35, qty: 1 }],
            keyCount: 3,
            extraIds: [],
            expandable: false,
          },
        },
      ],
      shippingOptionId: 'paket-versichert',
      contact,
      acceptedTerms: true,
      acceptedCustomMade: true,
      expectedTotalCents: 0,
    });
    expect(result.ok).toBe(false);
    expect(result.error).toContain('Maß A');
  });
});

describe('Bot-Schutz', () => {
  const anfrage = {
    kind: 'anfrage' as const,
    area: 'service-und-termin' as const,
    process: 'gefuehrte-anfrage' as const,
    contact,
    payload: {},
    summary: [],
    uploads: [],
  };

  const bestellung = (schutz: Record<string, string>) =>
    aktionen.submitOrder({
      items: [],
      shippingOptionId: 'x',
      contact,
      acceptedTerms: true,
      acceptedCustomMade: true,
      expectedTotalCents: 0,
      schutz,
    });

  it('antwortet beim ausgefüllten Honigtopf still wie bei Erfolg, speichert aber nichts', async () => {
    const warnung = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const honig = { start: startSignieren(Date.now() - 10_000), website: 'https://spam.example' };
    const result = await aktionen.submitRecord({ ...anfrage, schutz: honig });
    expect(result.ok).toBe(true);
    expect(result.reference).toMatch(/^SM24-A-\d{4}-\d{4}$/);
    expect(result.schutzNeu).toBeUndefined();
    expect((await bestellung(honig)).ok).toBe(true);
    expect(stored).toHaveLength(0);
    expect(warnung).toHaveBeenCalledWith(expect.stringContaining('honigtopf'));
    warnung.mockRestore();
  });

  it.each([
    ['zu schnell (1 s)', () => ({ start: startSignieren(Date.now() - 1_000), website: '' })],
    ['älter als 24 Stunden', () => ({ start: startSignieren(Date.now() - 25 * 60 * 60 * 1000), website: '' })],
    ['ohne Startzeitpunkt', () => ({})],
    ['mit gefälschter Signatur', () => ({ start: `${Date.now() - 10_000}.${'A'.repeat(43)}` })],
  ])('meldet bei „%s“ einen wiederholbaren Fehler statt einer Schein-Nummer', async (_name, falsch) => {
    const warnung = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await aktionen.submitRecord({ ...anfrage, schutz: falsch() });
    expect(result).toMatchObject({ ok: false, schutzNeu: true, error: SCHUTZ_ERNEUERT });
    expect(result.reference).toBeUndefined();

    const order = await bestellung(falsch());
    expect(order).toMatchObject({ ok: false, schutzNeu: true, error: SCHUTZ_ERNEUERT });
    expect(order.reference).toBeUndefined();
    expect(stored).toHaveLength(0);
    expect(warnung).toHaveBeenCalledWith(expect.stringContaining('[bot-schutz]'));
    warnung.mockRestore();

    // Zweiter Versuch mit frischem Startzeitpunkt geht durch.
    expect((await aktionen.submitRecord({ ...anfrage, schutz: schutz() })).ok).toBe(true);
    expect(stored).toHaveLength(1);
  });

  it('nimmt gültige Formulare an', async () => {
    expect((await aktionen.submitRecord({ ...anfrage, schutz: schutz() })).ok).toBe(true);
    expect(stored).toHaveLength(1);
  });
});

describe('Link-Schlüssel', () => {
  it('passt nur zum eigenen Hash', () => {
    const a = createAccessToken();
    const b = createAccessToken();
    expect(verifyAccessToken(a.token, a.hash)).toBe(true);
    expect(verifyAccessToken(b.token, a.hash)).toBe(false);
    expect(verifyAccessToken(undefined, a.hash)).toBe(false);
    expect(verifyAccessToken('', a.hash)).toBe(false);
  });
});
