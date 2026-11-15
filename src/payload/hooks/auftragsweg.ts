import { APIError, type CollectionBeforeChangeHook, type FieldHook } from 'payload';

import { AUFTRAGSWEG_LABEL, istAuftragsweg, passendePartner, plzMusterAusText, restbetragCents, type PartnerFuerWeg } from '../../lib/auftragsweg';
import type { BewerbungStatus } from '../../lib/partner/bewerbung';
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

/** Partnerbetrieb für die Vorschlagsliste: nur Stand, Einsatzgebiet und Auftragsarten zählen. */
export function partnerFuerWeg(doc: Pick<Partnerbetriebe, 'id' | 'status' | 'einsatzgebiet' | 'auftragsarten'>): PartnerFuerWeg {
  return {
    id: String(doc.id),
    status: doc.status as BewerbungStatus,
    postleitzahlen: plzMusterAusText(doc.einsatzgebiet?.postleitzahlen),
    auftragsarten: [...(doc.auftragsarten ?? [])],
  };
}

/**
 * Vorschlagsliste am Vorgang (FA-KERN-03): freigeschaltete Partnerbetriebe mit passender Auftragsart, deren
 * Einsatzgebiet die Postleitzahl des Kunden abdeckt. Nur bei Vorgängen im Partnerweg; die Zuordnung trifft
 * das Team (A-049), eine Rangfolge gibt es nicht.
 */
export const partnerVorschlaege: FieldHook<Vorgaenge> = async ({ data, req }) => {
  const doc = data as Partial<Vorgaenge> | undefined;
  if (doc?.auftragsweg !== 'partner') return null;
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
    const passend = new Set(passendePartner(plz, betriebe.map(partnerFuerWeg)).map((p) => p.id));
    const zeilen = betriebe.filter((b) => passend.has(String(b.id))).map((b) => `${b.firma} (${b.ort})`);
    return zeilen.length ? zeilen.join('\n') : `Kein freigeschalteter Partnerbetrieb deckt ${plz} ab.`;
  } catch (error) {
    req.payload.logger.warn({ msg: 'Partnervorschläge nicht geladen', err: error });
    return null;
  }
};
