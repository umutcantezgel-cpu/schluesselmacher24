import { APIError, type CollectionBeforeChangeHook, type FieldHook } from 'payload';

import {
  AUFTRAGSWEG_LABEL,
  istAuftragsweg,
  partnerFuerWegAusBetrieb,
  passendePartner,
  restbetragCents,
  type PartnerFuerWeg,
} from '../../lib/auftragsweg';
import { abdeckungsAuskunft } from '../../lib/orte/abdeckung';
import { ortsstammIndexLesen } from '../../lib/orte/dateien';
import { auftragsartFuerVorgang } from '../../lib/partner/leistungen';
import {
  abdeckungsGrundText,
  abdeckungsGruende,
  brauchtOrtsstamm,
  deckendePartnerMitGrund,
  type AbdeckungsAuskunft,
  type AbdeckungsGrund,
} from '../../lib/partner/region';
import type { PaymentInfo } from '../../lib/types';
import type { Partnerbetriebe, Vorgaenge } from '../../payload-types';

import { SYSTEM_AENDERUNG, benutzerName } from './vorgang-benachrichtigen';

/* ==========================================================================
   Auftragsweg und Restbetrag am Vorgang (FA-KERN-03, A-049).

   - Der Rest (Gesamtpreis minus Online-Zahlung) wird bei jedem Speichern neu
     berechnet, auch bei Änderungen des Servers (Zahlungseingang, Erstattung).
   - Ändert das Team den Auftragsweg, ist eine Begründung Pflicht; sie steht
     danach mit altem und neuem Weg, Zeit und Bearbeiter in den Notizen.
   - „Rest bezahlt am“ wird mit Betrag und Zahlart in den Notizen vermerkt.

   Bewusst nur relative Importe: Die Sammlung wird auch von `payload migrate`
   und `payload run` geladen.
   ========================================================================== */

export const BEGRUENDUNG_FEHLT = 'Bitte tragen Sie eine Begründung für den geänderten Auftragsweg ein.';

const ZAHLART: Record<string, string> = { bar: 'bar', karte: 'mit Karte', ueberweisung: 'per Überweisung' };

const cent = (wert: number) => `${(wert / 100).toFixed(2).replace('.', ',')} €`;

type Zahlung = Vorgaenge['zahlung'];

function zahlungFuerRest(zahlung: Zahlung | undefined): Pick<PaymentInfo, 'amountCents' | 'status'> | undefined {
  if (!zahlung?.umfang) return undefined;
  return { amountCents: Number(zahlung.betragCent ?? 0), status: zahlung.status ?? 'offen' };
}

export const auftragswegVorAenderung: CollectionBeforeChangeHook<Vorgaenge> = ({ data, originalDoc, operation, req }) => {
  // Restbetrag: immer, sobald ein Gesamtpreis oder ein Rest gespeichert ist oder kommt.
  const rest = { ...(originalDoc?.restzahlung ?? {}), ...(data.restzahlung ?? {}) };
  if (data.restzahlung || (rest.gesamtpreisCent !== null && rest.gesamtpreisCent !== undefined)) {
    const gesamt = rest.gesamtpreisCent === null || rest.gesamtpreisCent === undefined ? undefined : Number(rest.gesamtpreisCent);
    const berechnet = restbetragCents(gesamt, zahlungFuerRest(data.zahlung ?? originalDoc?.zahlung));
    data.restzahlung = { ...rest, restCent: berechnet ?? null };
  }

  if (operation !== 'update' || !req.user || req.context?.[SYSTEM_AENDERUNG] || !originalDoc) return data;

  const bearbeiter = benutzerName(req.user);
  const jetzt = new Date().toISOString();
  const notiz = (text: string) => {
    data.notizen = [...(data.notizen ?? originalDoc.notizen ?? []), { am: jetzt, von: 'team', text }];
  };

  const alt = originalDoc.auftragsweg ?? null;
  const neu = data.auftragsweg === undefined ? alt : data.auftragsweg ?? null;
  const grund = typeof data.auftragswegGrund === 'string' ? data.auftragswegGrund.trim() : '';
  if (neu !== alt) {
    if (!grund) throw new APIError(BEGRUENDUNG_FEHLT, 400);
    const von = istAuftragsweg(alt) ? AUFTRAGSWEG_LABEL[alt] : '–';
    const nach = istAuftragsweg(neu) ? AUFTRAGSWEG_LABEL[neu] : '–';
    notiz(`Auftragsweg von „${von}“ auf „${nach}“ geändert: ${grund.slice(0, 500)} (${bearbeiter}).`);
  }
  // Die Begründung gilt nur für diesen einen Wechsel.
  data.auftragswegGrund = '';

  const bezahltAm = data.restzahlung?.restBezahltAm;
  if (bezahltAm && !originalDoc.restzahlung?.restBezahltAm) {
    const betrag = typeof data.restzahlung?.restCent === 'number' ? ` über ${cent(data.restzahlung.restCent)}` : '';
    const art = data.restzahlung?.restZahlart ? ` ${ZAHLART[data.restzahlung.restZahlart] ?? ''}` : '';
    notiz(`Rest${betrag} beim Termin${art} bezahlt vermerkt (${bearbeiter}).`);
  }
  return data;
};

/**
 * Partnerbetrieb für die Vorschlagsliste: nur Stand, Postleitzahl des Betriebs, Einsatzgebiet (Muster, Umkreis,
 * Orte und Landkreise), Punkt „Region und Radius“ der Prüfliste, Auftragsarten und Abrechnungsmodell zählen. Ohne Angabe gilt Modell A wie im Standard der
 * Sammlung; im Partnerweg zählt nur Modell B (A-049 Nr. 8).
 */
export function partnerFuerWeg(
  doc: Pick<Partnerbetriebe, 'id' | 'status' | 'einsatzgebiet' | 'auftragsarten'> & {
    plz?: Partnerbetriebe['plz'];
    abrechnungsmodell?: Partnerbetriebe['abrechnungsmodell'] | null;
    pruefliste?: Partnerbetriebe['pruefliste'];
  },
): PartnerFuerWeg {
  return partnerFuerWegAusBetrieb(doc);
}

/**
 * Auskunft aus dem Ortsstamm für Umkreis und Region, nur wenn ein Betrieb sie braucht. Ist der Stamm nicht lesbar,
 * zählen nur die Postleitzahlen (wie vor FA-PLATTFORM-01C), und das Log nennt den Grund.
 */
async function auskunftFuer(kandidaten: readonly PartnerFuerWeg[], warnen: (fehler: unknown) => void): Promise<AbdeckungsAuskunft | undefined> {
  if (!brauchtOrtsstamm(kandidaten)) return undefined;
  try {
    return abdeckungsAuskunft(await ortsstammIndexLesen());
  } catch (fehler) {
    warnen(fehler);
    return undefined;
  }
}

/** Zeile der Vorschlagsliste: „Firma (Ort): Grund; Grund“. */
function vorschlagsZeile(betrieb: Pick<Partnerbetriebe, 'firma' | 'ort'>, gruende: readonly AbdeckungsGrund[]): string {
  const name = `${betrieb.firma} (${betrieb.ort})`;
  return gruende.length ? `${name}: ${gruende.map(abdeckungsGrundText).join('; ')}` : name;
}

/**
 * Vorschlagsliste am Vorgang (FA-KERN-03, FA-22-40, FA-PLATTFORM-01C): freigeschaltete (nicht pausierte, nicht
 * gesperrte) Partnerbetriebe mit passender Auftragsart, die die Postleitzahl des Kunden abdecken: über ihre
 * Postleitzahlen, ihren Umkreis oder einen eingetragenen Ort oder Landkreis (eine Definition,
 * src/lib/partner/region.ts; Umkreis und Region nur mit erledigtem Punkt „Region und Radius“). Jede Zeile nennt den Grund. Im Partnerweg zählen nur Betriebe mit Modell B
 * (`passendePartner`, A-049 Nr. 8); bei jedem anderen Vorgang mit Vermittlung zählt das Modell nicht
 * (`deckendePartnerMitGrund`). Die Zuordnung trifft das Team (A-049), eine Rangfolge gibt es nicht. Ohne
 * Partnerweg und ohne Vermittlung keine Liste.
 */
export const partnerVorschlaege: FieldHook<Vorgaenge> = async ({ data, req }) => {
  const doc = data as Partial<Vorgaenge> | undefined;
  const partnerweg = doc?.auftragsweg === 'partner';
  if (!doc || (!partnerweg && !doc.vermittlung?.status)) return null;
  const plz = doc.kontakt?.plz?.trim() ?? '';
  if (!/^\d{5}$/.test(plz)) return 'Ohne vollständige Postleitzahl gibt es keinen Vorschlag.';
  try {
    const gefunden = await req.payload.find({
      collection: 'partnerbetriebe',
      where: { status: { equals: 'freigeschaltet' } },
      depth: 0,
      limit: 500,
      overrideAccess: true,
      req,
    });
    const betriebe = gefunden.docs as Partnerbetriebe[];
    // Auftragsart der Vermittlung, sonst aus der gebuchten Leistung (FA-PLATTFORM-01B, Zusatz 7).
    const art = doc.vermittlung?.auftragsart || auftragsartFuerVorgang(doc.daten);
    const kandidaten = betriebe.map(partnerFuerWeg);
    const auskunft = await auskunftFuer(kandidaten, (err) => req.payload.logger.warn({ msg: 'Ortsstamm für die Partnervorschläge nicht lesbar', err }));
    const treffer = partnerweg
      ? passendePartner(plz, kandidaten, art, auskunft).map((p) => ({ partner: p, gruende: abdeckungsGruende(plz, art, p, auskunft) }))
      : deckendePartnerMitGrund(plz, art, kandidaten, auskunft);
    const gruende = new Map(treffer.map((t) => [t.partner.id, t.gruende]));
    const zeilen = betriebe.filter((b) => gruende.has(String(b.id))).map((b) => vorschlagsZeile(b, gruende.get(String(b.id)) ?? []));
    return zeilen.length ? zeilen.join('\n') : `Kein freigeschalteter Partnerbetrieb deckt ${plz} ab.`;
  } catch (error) {
    req.payload.logger.warn({ msg: 'Partnervorschläge nicht geladen', err: error });
    return null;
  }
};
