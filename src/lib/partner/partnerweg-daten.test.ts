import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Vorgaenge } from '@/payload-types';

/*
 * Partnerweg für Kunden und Vorschlagsliste am Vorgang entscheiden gleich (FA-PLATTFORM-01C, A-070): dieselbe
 * Definition (src/lib/partner/region.ts), dieselbe Abbildung (`partnerFuerWegAusBetrieb`), dieselbe Auskunft aus
 * dem echten Ortsstamm. Im Partnerweg zählen zusätzlich nur Betriebe mit Abrechnung B. Erfundene Betriebe (G13).
 * Abstände laut Stamm: 35576 Wetzlar → 35390 Gießen 10,8 km, → 35683 Dillenburg 25,3 km (Lahn-Dill-Kreis 06532).
 * 45117 steht nicht im Stamm (Großempfänger, A-068).
 */

const daten = vi.hoisted(() => ({
  betriebe: [] as Record<string, unknown>[],
  stammWirft: false,
  /** Spione: Wer liest Partnerbetriebe, wer den Ortsstamm (Nachbesserung 3, Punkt 6). */
  find: undefined as unknown as import('vitest').Mock,
  ortsstamm: undefined as unknown as import('vitest').Mock,
}));

type Auswahl = { [feld: string]: true | Auswahl };

/**
 * Wie Payload mit `select`: nur die ausgewählten Felder (auch geschachtelt, etwa `pruefliste: { region: true }`),
 * dazu immer `id`. So wird der Gleichstandstest rot, wenn partnerweg-daten.ts ein Feld nicht mehr ausliest.
 */
function zuschneiden(doc: Record<string, unknown>, auswahl?: Auswahl): Record<string, unknown> {
  if (!auswahl) return doc;
  const aus: Record<string, unknown> = { id: doc.id };
  for (const [feld, teil] of Object.entries(auswahl)) {
    if (!(feld in doc)) continue;
    const wert = doc[feld];
    aus[feld] = teil === true || wert === null || typeof wert !== 'object' || Array.isArray(wert) ? wert : zuschneiden(wert as Record<string, unknown>, teil);
  }
  return aus;
}

vi.mock('@/lib/umgebung', async (original) => ({ ...(await original<typeof import('@/lib/umgebung')>()), mitDatenbank: () => true }));
vi.mock('@/lib/data/payload-adapter', async () => {
  const { vi: v } = await import('vitest');
  daten.find = v.fn(async ({ select }: { select?: Auswahl }) => ({ docs: daten.betriebe.map((b) => zuschneiden(b, select)) }));
  return { payloadInstanz: async () => ({ find: daten.find }) };
});
// Echter Ortsstamm; auf Wunsch nicht lesbar (Fehlerfall, Nachbesserung 3, Punkt 3).
vi.mock('@/lib/orte/stamm', async (original) => {
  const echt = await original<typeof import('@/lib/orte/stamm')>();
  const { vi: v } = await import('vitest');
  daten.ortsstamm = v.fn(async () => {
    if (daten.stammWirft) throw new Error('Ortsstamm im Test nicht lesbar');
    return echt.ortsstamm();
  });
  return { ...echt, ortsstamm: daten.ortsstamm };
});
// Eigenbereich weit weg von den Testpostleitzahlen, damit der Partnerweg überhaupt rechnet.
vi.mock('@/lib/data', () => ({ getSettings: async () => ({ booking: { ownArea: { label: 'Test', postalPatterns: ['999*'] } } }) }));

const { standorteErmitteln } = await import('./partnerweg-daten');
const { partnerVorschlaege } = await import('@/payload/hooks/auftragsweg');

const ERLEDIGT = { erledigt: true, am: '2026-11-16', pruefer: 'Testprüferin' };

const betrieb = (id: number, teil: Record<string, unknown>) => ({
  id,
  firma: `Betrieb ${id}`,
  ort: 'Testort',
  status: 'freigeschaltet',
  abrechnungsmodell: 'B',
  auftragsarten: ['funk'],
  einsatzgebiet: {},
  ...teil,
});

const BETRIEBE = [
  betrieb(1, { einsatzgebiet: { postleitzahlen: '35390, 45117' } }), // nur Muster
  betrieb(2, { plz: '35576', einsatzgebiet: { radiusKm: 20 }, pruefliste: { region: ERLEDIGT } }), // nur Umkreis
  betrieb(3, { einsatzgebiet: { regionen: [{ art: 'landkreis', name: 'Lahn-Dill-Kreis', schluessel: '06532' }] }, pruefliste: { region: ERLEDIGT } }), // nur Region
  betrieb(4, { plz: '35576', einsatzgebiet: { radiusKm: 300, regionen: [{ art: 'landkreis', name: 'Lahn-Dill-Kreis', schluessel: '06532' }] }, pruefliste: { region: { ...ERLEDIGT, am: null } } }), // Punkt nicht erledigt
  betrieb(5, { plz: '35576', einsatzgebiet: { radiusKm: 300 }, pruefliste: { vorEinfuehrung: true } }), // vor Einführung der Prüfliste
  betrieb(6, { status: 'pausiert', plz: '35576', einsatzgebiet: { postleitzahlen: '35*', radiusKm: 300 }, pruefliste: { region: ERLEDIGT } }), // pausiert
  betrieb(7, { abrechnungsmodell: 'A', plz: '35576', einsatzgebiet: { radiusKm: 20 }, pruefliste: { region: ERLEDIGT } }), // Modell A
  // Grenzfälle, alle mit erledigtem Punkt „Region und Radius“; keiner deckt irgendetwas ab (Nachbesserung 3, Punkt 5):
  betrieb(8, { einsatzgebiet: { regionen: [{ art: 'landkreis', name: 'Dillenburg', schluessel: '06532006' }] }, pruefliste: { region: ERLEDIGT } }), // Landkreis mit Gemeindeschlüssel
  betrieb(9, { plz: '35576', einsatzgebiet: { radiusKm: 0 }, pruefliste: { region: ERLEDIGT } }), // Umkreis 0 km heißt kein Umkreis
  betrieb(10, { plz: null, einsatzgebiet: { radiusKm: 300 }, pruefliste: { region: ERLEDIGT } }), // Umkreis ohne Postleitzahl des Betriebs
];

function vorgang(plz: string, partnerweg: boolean): Partial<Vorgaenge> {
  return {
    id: 1,
    kontakt: { vorname: 'Erika', nachname: 'Muster', email: 'erika@example.org', telefon: '0301234567', plz, land: 'Deutschland' },
    auftragsweg: partnerweg ? 'partner' : 'hauptzentrale',
    vermittlung: partnerweg ? undefined : ({ status: 'neu' } as Vorgaenge['vermittlung']),
    daten: {},
  } as Partial<Vorgaenge>;
}

/** Kennungen der Betriebe in der Vorschlagsliste (Zeilen „Betrieb N (Ort): Grund“). */
async function vorschlagsIds(plz: string, partnerweg: boolean): Promise<string[]> {
  const req = { payload: { find: async () => ({ docs: daten.betriebe }), logger: { warn: vi.fn(), error: vi.fn() } } };
  return idsAus((await partnerVorschlaege({ data: vorgang(plz, partnerweg), req } as never)) as string);
}

function idsAus(text: string): string[] {
  return text
    .split('\n')
    .map((zeile) => /^Betrieb (\d+) /.exec(zeile)?.[1])
    .filter((id): id is string => Boolean(id));
}

beforeEach(() => {
  daten.betriebe = BETRIEBE;
  daten.stammWirft = false;
  daten.find.mockClear();
  daten.ortsstamm.mockClear();
  vi.stubEnv('PARTNERMODELL_B', 'aktiv');
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe('Partnerweg und Vorschlagsliste entscheiden gleich (FA-PLATTFORM-01C, A-070)', () => {
  const FAELLE: Array<{ plz: string; partnerweg: string[]; vorschlag: string[]; warum: string }> = [
    { plz: '35390', partnerweg: ['1', '2'], vorschlag: ['1', '2', '7'], warum: 'Gießen: Muster und geprüfter Umkreis; 4 und 5 ungeprüft, 6 pausiert, 7 Modell A' },
    { plz: '35683', partnerweg: ['3'], vorschlag: ['3'], warum: 'Dillenburg: nur über den geprüften Landkreis; Umkreis 20 km reicht nicht; 8 (Landkreis mit Gemeindeschlüssel) nicht' },
    { plz: '35576', partnerweg: ['2', '3'], vorschlag: ['2', '3', '7'], warum: 'Wetzlar: Sitz im Umkreis und im Landkreis; 9 (0 km am eigenen Sitz) und 10 (300 km ohne Sitz) nicht' },
    { plz: '45117', partnerweg: ['1'], vorschlag: ['1'], warum: 'unbekannte Postleitzahl: nur das Muster' },
    { plz: '01067', partnerweg: [], vorschlag: [], warum: 'Dresden: niemand' },
  ];

  for (const fall of FAELLE) {
    it(`${fall.plz}: ${fall.warum}`, async () => {
      const weg = await standorteErmitteln({ postleitzahl: fall.plz });
      expect(weg.passendePartnerIds).toEqual(fall.partnerweg);
      // Vorschlagsliste bei einem Vorgang im Partnerweg: genau dieselben Betriebe.
      expect(await vorschlagsIds(fall.plz, true)).toEqual(fall.partnerweg);
      // Vorschlagsliste bei einer Vermittlung: dieselbe Abdeckung, das Abrechnungsmodell zählt dort nicht.
      const vorschlag = await vorschlagsIds(fall.plz, false);
      expect(vorschlag).toEqual(fall.vorschlag);
      const modellB = new Set(BETRIEBE.filter((b) => b.abrechnungsmodell === 'B').map((b) => String(b.id)));
      expect(vorschlag.filter((id) => modellB.has(id))).toEqual(weg.passendePartnerIds);
    });
  }

  it('Punkt „Region und Radius“ nachträglich erledigt: Umkreis wirkt in beiden', async () => {
    daten.betriebe = [betrieb(5, { plz: '35576', einsatzgebiet: { radiusKm: 30 }, pruefliste: { vorEinfuehrung: true, region: ERLEDIGT } })];
    expect((await standorteErmitteln({ postleitzahl: '35683' })).passendePartnerIds).toEqual(['5']);
    expect(await vorschlagsIds('35683', true)).toEqual(['5']);
  });

  it('ohne Schalter bleibt es für Kunden beim Werkstatttermin und liest weder Partnerbetriebe noch den Ortsstamm', async () => {
    vi.stubEnv('PARTNERMODELL_B', '');
    const weg = await standorteErmitteln({ postleitzahl: '35390' });
    expect(weg).toMatchObject({ passendePartnerIds: [], ohnePartner: false });
    expect(weg.standorte.map((s) => s.standort)).toEqual(['werkstatt']);
    expect(daten.find).not.toHaveBeenCalled();
    expect(daten.ortsstamm).not.toHaveBeenCalled();
  });

  it('mit Schalter liest der Partnerweg genau die Felder der Abdeckung, nie Name oder Kontakt', async () => {
    await standorteErmitteln({ postleitzahl: '35390' });
    expect(daten.find).toHaveBeenCalledTimes(1);
    const { select } = daten.find.mock.calls[0][0] as { select: Auswahl };
    expect(select).toMatchObject({ plz: true, einsatzgebiet: true, pruefliste: { region: true } });
    for (const feld of ['firma', 'ansprechpartner', 'email', 'telefon']) expect(select).not.toHaveProperty(feld);
    expect(daten.ortsstamm).toHaveBeenCalled();
  });
});

describe('Ortsstamm nicht lesbar (Nachbesserung 3, Punkt 3)', () => {
  it('Partnerweg: Muster deckt weiter ab, geprüfter Umkreis nicht; kein Fehler, Meldung im Log', async () => {
    daten.stammWirft = true;
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    const weg = await standorteErmitteln({ postleitzahl: '35390' });
    // 1 hat das Muster 35390, 2 nur den geprüften Umkreis (10,8 km): ohne Stamm nur 1.
    expect(weg.passendePartnerIds).toEqual(['1']);
    expect(daten.ortsstamm).toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith('[auftragsweg] Ortsstamm für den Partnerweg nicht lesbar', expect.any(Error));
    log.mockRestore();
  });
});
