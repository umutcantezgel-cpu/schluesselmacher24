import { describe, expect, it } from 'vitest';

import { BETRIEB_BETREFF_ANFANG, BETRIEB_PLATZHALTER, betriebEinsetzen, betriebMitgeteilt, vorlageFuer } from '../mail/nachricht-vorlagen';

import {
  BETRIEB_HINWEIS,
  betriebHinweis,
  leadEintraege,
  wartetAufZuordnungFilter,
  zuordnungWarnung,
  type LeadEintrag,
  type ZuordnungsStand,
} from './lead-verlauf';

/* FA-PLATTFORM-01B: Lead-Verlauf je Wechsel der Zuordnung, Warnung bei pausiertem oder gesperrtem Partner,
 * Hinweis auf die Nachricht „Ihr ausführender Betrieb“, Filter „wartet auf Zuordnung“. Erfundene Daten (G4). */

const K = { am: '2026-11-16T09:00:00.000Z', von: 'Mina Saad' };

/** Spielt eine Folge von Ständen durch und sammelt den Verlauf wie der Hook. */
function durchspielen(staende: Array<ZuordnungsStand & { rueckgabe?: 'abgelehnt' | 'zurueckgezogen' }>): LeadEintrag[][] {
  const verlauf: LeadEintrag[] = [];
  const je: LeadEintrag[][] = [];
  let alt: ZuordnungsStand = {};
  for (const { rueckgabe, ...neu } of staende) {
    const eintraege = leadEintraege(alt, neu, verlauf, { ...K, rueckgabe });
    verlauf.push(...eintraege);
    je.push(eintraege);
    alt = neu;
  }
  return je;
}

describe('Lead-Verlauf', () => {
  it('schreibt je Wechsel der Zuordnung einen Eintrag', () => {
    const je = durchspielen([
      { status: 'neu', partner: '7' },
      { status: 'geprueft', partner: '7' },
      { status: 'partner-angefragt', partner: '7' },
      { status: 'geprueft', partner: '7', rueckgabe: 'abgelehnt' },
      { status: 'geprueft', partner: '8' },
      { status: 'partner-angefragt', partner: '8' },
      { status: 'angenommen', partner: '8' },
      { status: 'termin-bestaetigt', partner: '8' },
    ]);
    expect(je.map((e) => e.map((x) => `${x.partnerbetrieb}:${x.ergebnis}`))).toEqual([
      ['7:zugeteilt'],
      [],
      ['7:angeboten'],
      ['7:abgelehnt'],
      // Partner 7 hat schon abgelehnt: kein zweites „zurückgezogen“.
      ['8:zugeteilt'],
      ['8:angeboten'],
      ['8:angenommen'],
      [],
    ]);
    expect(je[0][0]).toMatchObject({ am: K.am, von: 'Mina Saad' });
  });

  it('zieht ohne Angabe zurück und schreibt den alten Partner beim Wechsel als zurückgezogen', () => {
    const je = durchspielen([
      { status: 'geprueft', partner: '7' },
      { status: 'geprueft', partner: '9' },
      { status: 'partner-angefragt', partner: '9' },
      { status: 'geprueft', partner: '9' },
      { status: null, partner: null },
    ]);
    expect(je.map((e) => e.map((x) => `${x.partnerbetrieb}:${x.ergebnis}`))).toEqual([
      ['7:zugeteilt'],
      ['7:zurueckgezogen', '9:zugeteilt'],
      ['9:angeboten'],
      ['9:zurueckgezogen'],
      [],
    ]);
  });

  it('übernimmt die Notiz des Teams und lässt Wechsel ohne Partner aus', () => {
    const eintraege = leadEintraege({ status: 'geprueft', partner: '7' }, { status: 'partner-angefragt', partner: '7' }, [], { ...K, notiz: ' per Telefon ' });
    expect(eintraege).toEqual([{ partnerbetrieb: '7', am: K.am, von: 'Mina Saad', ergebnis: 'angeboten', notiz: 'per Telefon' }]);
    expect(leadEintraege({ status: null }, { status: 'neu' }, [], K)).toEqual([]);
  });
});

describe('Warnung und Hinweis am Vorgang', () => {
  it('warnt bei pausiertem, gesperrtem oder beendetem Partner, solange der Auftrag nicht ausgezahlt ist', () => {
    const gesperrt = { firma: 'Testbetrieb Nord', status: 'gesperrt', sperre: { grund: 'Beschwerde', seit: '2026-11-16T08:00:00.000Z' } };
    expect(zuordnungWarnung(gesperrt, 'angenommen')).toBe(
      'Achtung: Der Partnerbetrieb „Testbetrieb Nord“ ist gesperrt seit 2026-11-16 (Beschwerde). Er bekommt keine neue Zuordnung. '
        + 'Bitte diesen Vorgang klären und bei Bedarf über „geprüft“ einem anderen Betrieb zuordnen.',
    );
    expect(zuordnungWarnung({ ...gesperrt, status: 'pausiert' }, 'geprueft')).toContain('ist pausiert');
    expect(zuordnungWarnung({ ...gesperrt, status: 'freigeschaltet' }, 'angenommen')).toBeNull();
    expect(zuordnungWarnung(gesperrt, 'ausgezahlt')).toBeNull();
    expect(zuordnungWarnung(null, 'angenommen')).toBeNull();
  });

  it('erinnert nach der Annahme an die Nachricht „Ihr ausführender Betrieb“, bis sie gesendet ist', () => {
    expect(betriebHinweis('angenommen', true, false)).toBe(BETRIEB_HINWEIS);
    expect(betriebHinweis('termin-bestaetigt', true, false)).toBe(BETRIEB_HINWEIS);
    expect(betriebHinweis('partner-angefragt', true, false)).toBeNull();
    expect(betriebHinweis('angenommen', false, false)).toBeNull();
    expect(betriebHinweis('angenommen', true, true)).toBeNull();
  });
});

describe('Vorlage „Ihr ausführender Betrieb“ (FA-07-03)', () => {
  it('nennt Firma und Ort, ohne Zusagen zu Preis oder Frist', () => {
    const vorlage = vorlageFuer('ausfuehrender-betrieb', 'SM24-T-2026-0042')!;
    expect(vorlage.betreff).toBe('Ihr ausführender Betrieb (SM24-T-2026-0042)');
    expect(vorlage.betreff.startsWith(BETRIEB_BETREFF_ANFANG)).toBe(true);
    expect(BETRIEB_PLATZHALTER.test(vorlage.text)).toBe(true);
    const text = betriebEinsetzen(vorlage.text, { firma: 'Testbetrieb $& Söhne', ort: ' Gießen ' });
    expect(text).toContain('Testbetrieb $& Söhne, Gießen');
    expect(text).toContain('Vertragspartner');
    expect(BETRIEB_PLATZHALTER.test(text)).toBe(false);
    expect(text).not.toMatch(/€|Euro|Preis|Kosten|Stunden|heute|morgen|sofort|innerhalb/i);
    expect(text).not.toMatch(/[–—]| - /);
  });

  it('erkennt den Versand nur an einer gesendeten Nachricht mit dem Betreff der Vorlage', () => {
    const mail = { art: 'nachricht', ergebnis: 'gesendet', betreff: 'Ihr ausführender Betrieb (SM24-T-2026-0042)' };
    expect(betriebMitgeteilt([mail])).toBe(true);
    expect(betriebMitgeteilt([{ ...mail, ergebnis: 'fehlgeschlagen' }])).toBe(false);
    expect(betriebMitgeteilt([{ ...mail, art: 'status' }])).toBe(false);
    expect(betriebMitgeteilt([{ ...mail, betreff: 'Rückfrage' }])).toBe(false);
    expect(betriebMitgeteilt(undefined)).toBe(false);
  });
});

describe('Filter „wartet auf Zuordnung“', () => {
  it('fragt Vermittlungen bei „neu“ oder „geprüft“ und den Partnerweg ohne Vermittlung ab', () => {
    const { where, suche } = wartetAufZuordnungFilter();
    expect(JSON.stringify(where)).toContain('"vermittlung.status":{"in":["neu","geprueft"]}');
    expect(JSON.stringify(where)).toContain('"auftragsweg":{"equals":"partner"}');
    expect(suche).toContain('where[or][0][and][2][vermittlung.status][in][0]=neu');
    expect(suche).toContain('where[or][1][and][3][vermittlung.status][exists]=false');
    expect(suche).toContain('where[or][0][and][0][art][not_equals]=partner');
    expect(suche.startsWith('?')).toBe(true);
  });
});
