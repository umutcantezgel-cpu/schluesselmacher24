import { APIError, type CollectionAfterChangeHook, type CollectionBeforeChangeHook, type PayloadRequest } from 'payload';

import { AUFTRAGSART_AUTOSCHLUESSEL } from '../../lib/auftragsweg';
import { vorgangZuSeite } from '../../lib/data/payload-mapping';
import { formatCents, formatDateTime } from '../../lib/format';
import { antwortAdresse, idempotenzSchluessel, sendeVorlage, vorlagenKontext } from '../../lib/mail/versand';
import { ohneSchraegstrich } from '../../lib/mail/vorlagen/gemeinsam';
import type { Provision } from '../../lib/partner/abrechnung';
import type { BewerbungStatus } from '../../lib/partner/bewerbung';
import { KUNDE_VERLAUF, bestaetigungsPfad } from '../../lib/partner/kundenbestaetigung';
import { AUFTRAGSART_SAMMELWERT_NAME, provisionsEintragWaehlen } from '../../lib/partner/leistungen';
import {
  AUSZAHLUNG_LABEL,
  MELDUNG,
  VERMITTLUNG_LABEL,
  VOR_DER_FREIGABE,
  auszahlungsStand,
  erstattungsStand,
  istVermittlungsStand,
  partnerbetragCents,
  plattformanteilVorschlag,
  vermittlungsWechselPruefen,
  zahlungEingegangen,
} from '../../lib/partner/vermittlung';
import { kontakt } from '../../lib/rechtliches/firma';
import type { ReferralStatus } from '../../lib/types';
import { mailKonfiguration } from '../../lib/umgebung';
import { auszahlungswegFuer, type Ueberweisen } from '../../lib/zahlung/auszahlung';
import { ERSTATTUNG_MELDUNG_WEG, ERSTATTUNGS_WEGE, belegPflicht } from '../../lib/zahlung/erstattung';
import type { Partnerbetriebe, Vorgaenge } from '../../payload-types';
import { hatRolle } from '../access/rollen';

import { auftragsartAmVorgangPruefen } from './partner-bewerbung';
import { SYSTEM_AENDERUNG, benutzerName, einstellungenLaden, vorgangVermerken } from './vorgang-benachrichtigen';

/* ==========================================================================
   Vermittlung, Partnerauszahlung und Erstattung am Vorgang (FA-KERN-04, A-049).

   - Jeder Wechsel der Vermittlung folgt `VERMITTLUNG_UEBERGAENGE` und wird von
     `vermittlungsWechselPruefen` geprüft: „an Partner vermittelt“ nur nach
     Zahlung des Gesamtbetrags und nur an freigeschaltete, nicht pausierte
     Partner mit passender Auftragsart; Freigabe der Auszahlung nur nach
     „Kunde bestätigt“ oder mit Grund des Teams; „ausgezahlt“ nur nach Freigabe.
   - Plattformanteil: Vorschlag aus der Provision des Partnerbetriebs (nur in
     der Datenbank, G13), von Hand änderbar, mit „ausgeführt“ festgeschrieben.
   - Erstattung: Das Team dokumentiert sie; der Code bewegt kein Geld. Der
     Zahlungsstand wird „erstattet“ oder „teilweise erstattet“, die Auszahlung
     an den Partner ist danach gesperrt. Diese Stände setzt das Team nur über
     die Gruppe Erstattung und nimmt sie nicht von Hand zurück.
   - Partnerbetrieb und Auftragsart wechseln nur zusammen mit dem Schritt
     zurück auf „geprüft“, seit „ausgeführt“ gar nicht mehr.
   - Jede Änderung steht mit Zeit und Bearbeiter in den Notizen, was den
     Kunden betrifft auch in seinem Verlauf.
   - Partnerbetrag und Auszahlungsstand werden bei jedem Speichern abgeleitet,
     auch bei Änderungen des Servers (Zahlungseingang, Erstattung per Webhook).

   Bewusst nur relative Importe: Die Sammlung wird auch von `payload migrate`
   und `payload run` geladen.
   ========================================================================== */

const vorhabenSchluessel = (id: number | string) => `sm24Vermittlung:${id}`;

const relationsId = (wert: unknown): number | string | null => {
  if (wert === null || wert === undefined || wert === '') return null;
  if (typeof wert === 'object') return ((wert as { id?: number | string }).id ?? null) as number | string | null;
  return wert as number | string;
};

const zahl = (wert: unknown): number | undefined =>
  wert === null || wert === undefined || wert === '' || !Number.isFinite(Number(wert)) ? undefined : Math.round(Number(wert));

const label = (stand: ReferralStatus | undefined) => (stand ? VERMITTLUNG_LABEL[stand] : 'leer');

const GESCHLOSSEN_LEERBAR: readonly ReferralStatus[] = ['neu', 'geprueft'];
/** Seit „ausgeführt“: Partner und Beträge stehen fest. */
const AB_AUSGEFUEHRT: readonly ReferralStatus[] = ['erledigt', 'kunde-bestaetigt', 'auszahlung-freigegeben', 'ausgezahlt', 'provision-abgerechnet'];

export const MELDUNG_NICHT_LEEREN = 'Eine laufende Vermittlung lässt sich nicht leeren. Bitte zurück auf „geprüft“ setzen.';
export const MELDUNG_WEG_FEHLT = 'Bitte den Weg der Auszahlung wählen (Überweisung oder Zahlungsdienst).';
export const MELDUNG_BELEG_FEHLT = 'Bitte Beleg oder Referenz der Überweisung eintragen.';
export const MELDUNG_DATUM_OHNE_STAND = 'Das Auszahlungsdatum gehört zum Stand „ausgezahlt“. Bitte den Stand mit setzen.';
export const MELDUNG_PARTNER_WECHSEL =
  'Partnerbetrieb oder Auftragsart wechseln Sie nur zusammen mit dem Schritt zurück auf „geprüft“.';
export const MELDUNG_PARTNER_FEST = 'Seit „ausgeführt“ lassen sich Partnerbetrieb und Auftragsart nicht mehr wechseln.';

export const ERSTATTUNG_MELDUNG = {
  nichtBezahlt: 'Eine Erstattung lässt sich nur für bezahlte Vorgänge erfassen.',
  art: 'Bitte die Art der Erstattung wählen (ganz oder teilweise).',
  betrag: 'Bitte den erstatteten Betrag in Cent eintragen.',
  zuHoch: (gezahlt: number) => `Der erstattete Betrag ist höher als die Zahlung (${formatCents(gezahlt)}).`,
  ganz: (gezahlt: number) => `Bei „ganz“ ist der Betrag die ganze Zahlung (${formatCents(gezahlt)}). Sonst bitte „teilweise“ wählen.`,
  teilweise: 'Bei „teilweise“ ist der Betrag kleiner als die Zahlung. Sonst bitte „ganz“ wählen.',
  weniger: (bisher: number) =>
    `Bereits ${formatCents(bisher)} erstattet. Der Betrag ist die Summe aller Erstattungen und kann nicht kleiner werden.`,
  grund: 'Bitte einen Grund für die Erstattung eintragen.',
  zurueck:
    'Zu diesem Vorgang ist eine Erstattung erfasst. Der Zahlungsstand lässt sich nicht von Hand zurücksetzen. '
    + 'War die Erstattung ein Irrtum, tragen Sie in der Gruppe „Erstattung“ unter „Berichtigung: Grund“ den Grund ein und setzen den Betrag kleiner.',
  nurGruppe: '„Erstattet“ und „Teilweise erstattet“ setzen Sie über die Gruppe „Erstattung“ mit Betrag, Datum und Grund.',
} as const;

/** Gesamtbetrag zentral über Schlüsselmacher24: Partnerweg, Modell B oder Zahlung des Gesamtbetrags. */
export function zentraleZahlung(
  auftragsweg: string | null | undefined,
  umfang: string | null | undefined,
  modell?: string | null,
): boolean {
  return auftragsweg === 'partner' || modell === 'B' || umfang === 'gesamt';
}

async function partnerLaden(req: PayloadRequest, id: number | string | null): Promise<Partnerbetriebe | null> {
  if (id === null) return null;
  try {
    return (await req.payload.findByID({
      collection: 'partnerbetriebe',
      id,
      depth: 0,
      overrideAccess: true,
      disableErrors: true,
      req,
    })) as Partnerbetriebe | null;
  } catch {
    return null;
  }
}

export const HINWEIS_PROVISION_MEHRDEUTIG =
  `Für „${AUFTRAGSART_SAMMELWERT_NAME}“ ist keine Provision eingetragen, und die Provisionen der einzelnen Leistungen weichen voneinander ab.`;

/**
 * Provision des Partnerbetriebs für eine Auftragsart; der feste Betrag steht dort in Euro. Regel für den
 * Sammelwert in `provisionsEintragWaehlen`: eigener Eintrag zuerst, sonst die Einträge der neun Leistungen,
 * wenn sie alle gleich sind.
 */
export function provisionFuer(partner: Pick<Partnerbetriebe, 'provisionen'>, auftragsart: string | null | undefined): Provision | undefined {
  const { eintrag } = provisionsEintragWaehlen(partner.provisionen, auftragsart);
  if (!eintrag) return undefined;
  const provision: Provision = {};
  if (typeof eintrag.prozent === 'number') provision.prozent = eintrag.prozent;
  if (typeof eintrag.festbetrag === 'number') provision.festCents = Math.round(eintrag.festbetrag * 100);
  return provision;
}

/** Überweisung über Stripe Connect; erst geladen, wenn der Schalter an ist. */
async function stripeUeberweisungLaden(): Promise<Ueberweisen> {
  const { stripeClient } = await import('../../lib/integrations/stripe');
  const stripe = stripeClient();
  return async ({ betragCents, ziel, gruppe, idempotenz }) => {
    const transfer = await stripe.transfers.create(
      { amount: betragCents, currency: 'eur', destination: ziel, transfer_group: gruppe },
      { idempotencyKey: idempotenz },
    );
    return { id: transfer.id };
  };
}

type Vermittlung = NonNullable<Vorgaenge['vermittlung']>;
type Auszahlung = NonNullable<Vorgaenge['auszahlung']>;

export const vermittlungVorAenderung: CollectionBeforeChangeHook<Vorgaenge> = async ({ data, originalDoc, operation, req }) => {
  // Nur Autoschlüssel und Fahrzeugschlüssel (FA-PLATTFORM-01): frühere Auftragsarten nicht neu setzen.
  const artFehler = auftragsartAmVorgangPruefen(data.vermittlung?.auftragsart, originalDoc?.vermittlung?.auftragsart);
  if (artFehler) throw new APIError(artFehler, 400);
  const team = operation === 'update' && Boolean(req.user) && !req.context?.[SYSTEM_AENDERUNG] && Boolean(originalDoc);
  const ergebnis = team && originalDoc ? await teamAenderung(data, originalDoc, req) : undefined;

  // Ableitungen bei jedem Speichern: Partnerbetrag und Auszahlungsstand.
  const v: Vermittlung = { ...(originalDoc?.vermittlung ?? {}), ...(data.vermittlung ?? {}) };
  const status = istVermittlungsStand(v.status) ? v.status : undefined;
  if (!status && !originalDoc?.auszahlung?.stand) return data;
  const partnerbetrag = partnerbetragCents(zahl(v.gesamtCent), zahl(v.plattformanteilCent)) ?? null;
  if (partnerbetrag !== (originalDoc?.vermittlung?.partnerbetragCent ?? null) || data.vermittlung) {
    data.vermittlung = { ...v, partnerbetragCent: partnerbetrag };
  }
  const zahlung = { ...(originalDoc?.zahlung ?? {}), ...(data.zahlung ?? {}) };
  const weg = data.auftragsweg === undefined ? originalDoc?.auftragsweg : data.auftragsweg;
  // Dieselbe Grundlage wie die Prüfung: mit dem Abrechnungsmodell des Partners.
  let zentral = ergebnis ? ergebnis.zentral : zentraleZahlung(weg, zahlung.umfang);
  if (!ergebnis && !zentral && status) {
    zentral = zentraleZahlung(weg, zahlung.umfang, (await partnerLaden(req, relationsId(v.partnerbetrieb)))?.abrechnungsmodell);
  }
  const stand = auszahlungsStand(status, zahlung.status, zentral, erstattetCents(data, originalDoc)) ?? null;
  // Immer setzen: Den Auszahlungsstand bestimmt allein der Server, nie ein gesendeter Wert.
  data.auszahlung = { ...(originalDoc?.auszahlung ?? {}), ...(data.auszahlung ?? {}), stand };
  return data;
};

/** Summe der erfassten Erstattungen: Zahlung (Systemfeld) oder Gruppe Erstattung, der größere Wert. */
function erstattetCents(data: Partial<Vorgaenge>, originalDoc: Vorgaenge | undefined): number {
  const zahlung = { ...(originalDoc?.zahlung ?? {}), ...(data.zahlung ?? {}) };
  const erstattung = { ...(originalDoc?.erstattung ?? {}), ...(data.erstattung ?? {}) };
  return Math.max(zahl(zahlung.erstattetCent) ?? 0, zahl(erstattung.betragCent) ?? 0);
}

async function teamAenderung(data: Partial<Vorgaenge>, originalDoc: Vorgaenge, req: PayloadRequest): Promise<{ zentral: boolean } | undefined> {
  const bearbeiter = benutzerName(req.user);
  const jetzt = new Date().toISOString();
  const notiz = (text: string) => {
    data.notizen = [...(data.notizen ?? originalDoc.notizen ?? []), { am: jetzt, von: 'team', text }];
  };
  const verlauf = (text: string) => {
    data.verlauf = [...(data.verlauf ?? originalDoc.verlauf ?? []), { am: jetzt, von: 'team', text }];
  };

  /* ---- Erstattung (vor der Vermittlung: sie sperrt die Auszahlung) ---- */
  const zahlungVorher = originalDoc.zahlung?.status ?? null;
  const zahlungFormular = data.zahlung?.status ?? zahlungVorher;
  const inhaber = hatRolle(req.user, 'inhaber');
  const erstattungErfasst = erstattungPruefen(data, originalDoc, { jetzt, bearbeiter, inhaber, notiz, verlauf });
  // Den Zahlungsstand einer Erstattung setzt nur die Gruppe Erstattung; zurück geht er nicht.
  if (!erstattungErfasst && zahlungFormular !== zahlungVorher) {
    const erstattet = erstattungsStand(zahlungVorher) || (zahl(originalDoc.zahlung?.erstattetCent) ?? 0) > 0;
    if (erstattet && !erstattungsStand(zahlungFormular)) throw new APIError(ERSTATTUNG_MELDUNG.zurueck, 409);
    if (erstattungsStand(zahlungFormular)) throw new APIError(ERSTATTUNG_MELDUNG.nurGruppe, 400);
  }

  const altV: Vermittlung = originalDoc.vermittlung ?? {};
  const v: Vermittlung = { ...altV, ...(data.vermittlung ?? {}) };
  const von = istVermittlungsStand(altV.status) ? altV.status : undefined;
  const nach = istVermittlungsStand(v.status) ? v.status : undefined;
  const altA: Auszahlung = originalDoc.auszahlung ?? {};
  const a: Auszahlung = { ...altA, ...(data.auszahlung ?? {}) };
  const zahlung = { ...(originalDoc.zahlung ?? {}), ...(data.zahlung ?? {}) };
  const ohneVermittlung = !von && !nach;
  if (ohneVermittlung) return undefined;

  const partner = await partnerLaden(req, relationsId(v.partnerbetrieb));
  const weg = data.auftragsweg === undefined ? originalDoc.auftragsweg : data.auftragsweg;
  const zentral = zentraleZahlung(weg, zahlung.umfang, partner?.abrechnungsmodell);

  if (!v.auftragsart && originalDoc.bereich === 'autoschluessel' && nach) v.auftragsart = AUFTRAGSART_AUTOSCHLUESSEL as Vermittlung['auftragsart'];

  /* ---- Wechsel des Partnerbetriebs oder der Auftragsart (bei jedem Stand) ---- */
  const partnerAlt = relationsId(altV.partnerbetrieb);
  const partnerNeu = relationsId(v.partnerbetrieb);
  const partnerWechsel = String(partnerAlt ?? '') !== String(partnerNeu ?? '');
  const artWechsel = Boolean(altV.auftragsart) && (v.auftragsart ?? null) !== altV.auftragsart;
  if (partnerWechsel || artWechsel) {
    const frei = (stand: ReferralStatus | undefined) => !stand || GESCHLOSSEN_LEERBAR.includes(stand);
    if ((von && AB_AUSGEFUEHRT.includes(von)) || (nach && AB_AUSGEFUEHRT.includes(nach))) throw new APIError(MELDUNG_PARTNER_FEST, 400);
    // Laufend nur mit dem Schritt zurück auf „geprüft“; der neue Betrieb wird beim nächsten Vermitteln mit
    // `darfVermitteln` geprüft (auch pausiert oder beendet: abgelehnt).
    if (!frei(von) && !frei(nach)) throw new APIError(MELDUNG_PARTNER_WECHSEL, 400);
    if (partnerWechsel) {
      const altName = partnerAlt === null ? 'leer' : ((await partnerLaden(req, partnerAlt))?.firma ?? `Nr. ${partnerAlt}`);
      const neuName = partnerNeu === null ? 'leer' : (partner?.firma ?? `Nr. ${partnerNeu}`);
      notiz(`Partnerbetrieb von „${altName}“ auf „${neuName}“ gewechselt (${bearbeiter}).`);
    }
    if (artWechsel) notiz(`Auftragsart von „${altV.auftragsart}“ auf „${v.auftragsart ?? 'leer'}“ gewechselt (${bearbeiter}).`);
  }

  /* ---- Beträge ---- */
  const fest = Boolean(altV.festgeschriebenAm);
  if (fest && (zahl(v.gesamtCent) !== zahl(altV.gesamtCent) || zahl(v.plattformanteilCent) !== zahl(altV.plattformanteilCent))) {
    throw new APIError(MELDUNG.festgeschrieben, 400);
  }
  if (!fest && nach) {
    if (zahl(v.gesamtCent) === undefined) {
      const rest = { ...(originalDoc.restzahlung ?? {}), ...(data.restzahlung ?? {}) };
      const vorschlag = zahl(rest.gesamtpreisCent) ?? (zahlung.umfang === 'gesamt' ? zahl(zahlung.betragCent) : undefined);
      if (vorschlag !== undefined) v.gesamtCent = vorschlag;
    }
    const gesamt = zahl(v.gesamtCent);
    if (zahl(v.plattformanteilCent) === undefined && gesamt !== undefined && partner) {
      const vorschlag = plattformanteilVorschlag({
        modell: partner.abrechnungsmodell === 'B' ? 'B' : 'A',
        gesamtCents: gesamt,
        provision: provisionFuer(partner, v.auftragsart),
        modellBFreigegeben: process.env.PARTNERMODELL_B === 'aktiv',
      });
      if ('cents' in vorschlag) {
        v.plattformanteilCent = vorschlag.cents;
        v.anteilHinweis = null;
        notiz(`Plattformanteil ${formatCents(vorschlag.cents)} aus der Provision des Partnerbetriebs vorgeschlagen (${bearbeiter}).`);
      } else {
        const mehrdeutig = provisionsEintragWaehlen(partner.provisionen, v.auftragsart).mehrdeutig;
        v.anteilHinweis = `${mehrdeutig ? HINWEIS_PROVISION_MEHRDEUTIG : vorschlag.hinweis} Bitte den Plattformanteil von Hand eintragen.`;
      }
    } else if (zahl(v.plattformanteilCent) !== undefined) {
      v.anteilHinweis = null;
    }
    const anteil = zahl(v.plattformanteilCent);
    if (gesamt !== undefined && anteil !== undefined && anteil > gesamt) throw new APIError(MELDUNG.anteilZuHoch, 400);
    if (anteil !== zahl(altV.plattformanteilCent) && zahl(altV.plattformanteilCent) !== undefined && anteil !== undefined) {
      notiz(`Plattformanteil von ${formatCents(zahl(altV.plattformanteilCent)!)} auf ${formatCents(anteil)} geändert (${bearbeiter}).`);
    }
  }

  /* ---- Wechsel der Vermittlung ---- */
  if (nach !== von) {
    if (!nach) {
      if (von && !GESCHLOSSEN_LEERBAR.includes(von)) throw new APIError(MELDUNG_NICHT_LEEREN, 400);
    } else {
      const fehler = vermittlungsWechselPruefen({
        von,
        nach,
        zentraleZahlung: zentral,
        zahlung: zahlung.status ? { status: zahlung.status, scope: zahlung.umfang ?? 'anzahlung' } : null,
        erstattetCents: erstattetCents(data, originalDoc),
        partner: partner ? { status: partner.status as BewerbungStatus, auftragsarten: [...(partner.auftragsarten ?? [])] } : null,
        auftragsart: v.auftragsart,
        gesamtCents: zahl(v.gesamtCent),
        plattformanteilCents: zahl(v.plattformanteilCent),
        teamGrund: v.teamBestaetigungGrund,
      });
      if (fehler) throw new APIError(fehler, 400);
    }
    notiz(`Vermittlung von „${label(von)}“ auf „${label(nach)}“ gesetzt (${bearbeiter}).`);

    if (nach === 'partner-angefragt' && zentral) verlauf(KUNDE_VERLAUF.vermittelt);
    if (nach === 'erledigt') {
      v.festgeschriebenAm = jetzt;
      const gesamt = zahl(v.gesamtCent);
      const anteil = zahl(v.plattformanteilCent);
      if (gesamt !== undefined && anteil !== undefined) {
        notiz(
          `Beträge festgeschrieben: Gesamtbetrag ${formatCents(gesamt)}, Plattformanteil ${formatCents(anteil)}, `
            + `Partnerbetrag ${formatCents(partnerbetragCents(gesamt, anteil)!)}.`,
        );
      }
      if (zentral) {
        // Der Satz zur Mail folgt erst, wenn sie hinausging (`vermittlungNachAenderung`).
        verlauf(KUNDE_VERLAUF.ausgefuehrt);
        req.context[vorhabenSchluessel(originalDoc.id)] = { bitteUmBestaetigung: true };
      }
    }
    if (nach === 'auszahlung-freigegeben') {
      a.freigegebenAm = jetzt;
      a.freigegebenVon = bearbeiter;
      // Nach der Freigabe gilt der Link des Kunden nicht mehr.
      v.bestaetigungHash = null;
      if (von === 'erledigt') notiz(`Ausführung durch das Team bestätigt: ${(v.teamBestaetigungGrund ?? '').trim().slice(0, 500)} (${bearbeiter}).`);
      notiz(`Partnerauszahlung freigegeben (${bearbeiter}).`);
    }
    if (nach === 'ausgezahlt') await auszahlen({ a, v, partner, originalDoc, jetzt, bearbeiter, notiz });
  }

  /* ---- Änderungen an der Auszahlung ---- */
  if (a.ausgezahltAm && !altA.ausgezahltAm && nach !== 'ausgezahlt') throw new APIError(MELDUNG_DATUM_OHNE_STAND, 400);
  const geaendert: string[] = [];
  if ((a.weg ?? null) !== (altA.weg ?? null)) geaendert.push(`Weg ${a.weg === 'zahlungsdienst' ? 'Zahlungsdienst' : a.weg === 'ueberweisung' ? 'Überweisung' : 'leer'}`);
  if ((a.referenz ?? '') !== (altA.referenz ?? '')) geaendert.push(`Beleg „${(a.referenz ?? '').slice(0, 200)}“`);
  if ((a.notiz ?? '') !== (altA.notiz ?? '')) geaendert.push('Notiz');
  if (a.ausgezahltAm && altA.ausgezahltAm && Date.parse(a.ausgezahltAm) !== Date.parse(altA.ausgezahltAm)) {
    geaendert.push(`ausgezahlt am ${formatDateTime(a.ausgezahltAm)}`);
  }
  if (geaendert.length && nach !== 'ausgezahlt') notiz(`Auszahlung geändert: ${geaendert.join(', ')} (${bearbeiter}).`);

  /* ---- Erstattung bei laufender Vermittlung ---- */
  if (erstattungErfasst && zentral && nach) {
    if (nach === 'ausgezahlt') notiz('Die Auszahlung an den Partner ist bereits erfolgt. Bitte die Rückforderung mit dem Partner klären.');
    else if (nach === 'auszahlung-freigegeben' || VOR_DER_FREIGABE.includes(nach)) notiz('Auszahlung an den Partner gesperrt (Erstattung).');
  }

  data.vermittlung = v;
  data.auszahlung = a;
  return { zentral };
}

async function auszahlen(k: {
  a: Auszahlung;
  v: Vermittlung;
  partner: Partnerbetriebe | null;
  originalDoc: Vorgaenge;
  jetzt: string;
  bearbeiter: string;
  notiz: (text: string) => void;
}): Promise<void> {
  const { a, v, partner, originalDoc } = k;
  if (!a.weg) throw new APIError(MELDUNG_WEG_FEHLT, 400);
  if (a.weg === 'ueberweisung' && !(a.referenz ?? '').trim()) throw new APIError(MELDUNG_BELEG_FEHLT, 400);
  const betrag = partnerbetragCents(zahl(v.gesamtCent), zahl(v.plattformanteilCent)) ?? 0;
  const weg = await auszahlungswegFuer(a.weg, stripeUeberweisungLaden);
  if ('meldung' in weg) throw new APIError(weg.meldung, 400);
  const ergebnis = await weg.auszahlen({ nummer: originalDoc.nummer, partnerbetragCents: betrag, kontoKennung: partner?.kontoKennung });
  if (!ergebnis.ok) throw new APIError(ergebnis.meldung, 400);
  a.ausgezahltAm = a.ausgezahltAm || k.jetzt;
  if (ergebnis.referenz) a.referenz = ergebnis.referenz;
  k.notiz(
    `Partnerbetrag ${formatCents(betrag)} ausgezahlt am ${formatDateTime(a.ausgezahltAm)}, `
      + `${ergebnis.weg === 'zahlungsdienst' ? 'über den Zahlungsdienst' : 'per Überweisung'}, Beleg „${(a.referenz ?? '').slice(0, 200)}“ `
      + `(${k.bearbeiter}). Auszahlungsstand: ${AUSZAHLUNG_LABEL.ausgezahlt}.`,
  );
}

function erstattungPruefen(
  data: Partial<Vorgaenge>,
  originalDoc: Vorgaenge,
  k: { jetzt: string; bearbeiter: string; inhaber: boolean; notiz: (t: string) => void; verlauf: (t: string) => void },
): boolean {
  if (!data.erstattung) return false;
  const alt = originalDoc.erstattung ?? {};
  const neu = { ...alt, ...data.erstattung };
  // Berichtigung eines Irrtums (FA-KERN-05): nur mit Grund, nur kleiner, nur außerhalb des Zahlungsdienstes.
  if ((neu.berichtigungGrund ?? '').trim()) return erstattungBerichtigen(data, originalDoc, k);
  const gleich =
    (neu.art ?? null) === (alt.art ?? null)
    && zahl(neu.betragCent) === zahl(alt.betragCent)
    && (neu.grund ?? '') === (alt.grund ?? '')
    && (neu.weg ?? null) === (alt.weg ?? null)
    && (neu.beleg ?? '') === (alt.beleg ?? '')
    && (neu.am ? Date.parse(neu.am) : null) === (alt.am ? Date.parse(alt.am) : null);
  if (gleich || (!neu.art && zahl(neu.betragCent) === undefined && !(neu.grund ?? '').trim())) return false;

  const stand = originalDoc.zahlung?.status;
  if (!(zahlungEingegangen(stand) || stand === 'erstattet')) throw new APIError(ERSTATTUNG_MELDUNG.nichtBezahlt, 400);
  if (!neu.art) throw new APIError(ERSTATTUNG_MELDUNG.art, 400);
  const gezahlt = zahl(originalDoc.zahlung?.betragCent) ?? 0;
  const betrag = zahl(neu.betragCent) ?? (neu.art === 'ganz' ? gezahlt : undefined);
  if (betrag === undefined || betrag <= 0) throw new APIError(ERSTATTUNG_MELDUNG.betrag, 400);
  if (betrag > gezahlt) throw new APIError(ERSTATTUNG_MELDUNG.zuHoch(gezahlt), 400);
  if (neu.art === 'ganz' && betrag !== gezahlt) throw new APIError(ERSTATTUNG_MELDUNG.ganz(gezahlt), 400);
  if (neu.art === 'teilweise' && betrag >= gezahlt) throw new APIError(ERSTATTUNG_MELDUNG.teilweise, 400);
  const bisher = zahl(originalDoc.zahlung?.erstattetCent) ?? 0;
  if (betrag < bisher) throw new APIError(ERSTATTUNG_MELDUNG.weniger(bisher), 400);
  const grund = (neu.grund ?? '').trim();
  if (!grund) throw new APIError(ERSTATTUNG_MELDUNG.grund, 400);
  // Weg und Beleg (FA-KERN-05): Außerhalb des Zahlungsdienstes ist ein Beleg Pflicht.
  if (!neu.weg) throw new APIError(ERSTATTUNG_MELDUNG_WEG.weg, 400);
  const beleg = (neu.beleg ?? '').trim();
  if (belegPflicht(neu.weg) && !beleg) throw new APIError(ERSTATTUNG_MELDUNG_WEG.beleg, 400);
  const am = neu.am || k.jetzt;
  const wegText = ERSTATTUNGS_WEGE.find((w) => w.value === neu.weg)?.label ?? neu.weg;

  data.erstattung = { ...neu, betragCent: betrag, am, grund, beleg: beleg || null, berichtigungGrund: null };
  data.zahlung = {
    ...(originalDoc.zahlung ?? {}),
    ...(data.zahlung ?? {}),
    status: neu.art === 'ganz' ? 'erstattet' : 'teilweise-erstattet',
    erstattetCent: betrag,
  };
  k.notiz(
    `Erstattung erfasst: ${neu.art === 'ganz' ? 'ganz' : 'teilweise'}, ${formatCents(betrag)} am ${formatDateTime(am)}, `
      + `Weg: ${wegText}${beleg ? `, Beleg: ${beleg.slice(0, 200)}` : ''}, `
      + `Grund: ${grund.slice(0, 300)} (${k.bearbeiter}). Das Geld erstatten Sie im Stripe-Dashboard oder per Überweisung.`,
  );
  if (betrag > bisher) k.verlauf(`Wir haben eine Erstattung über ${formatCents(betrag - bisher)} veranlasst.`);
  return true;
}

/**
 * Berichtigung einer irrtümlich erfassten Erstattung (FA-KERN-05). Der Zahlungsstand nach einer Erstattung
 * lässt sich nicht von Hand zurücksetzen (FA-KERN-04); dieser Weg ist die dokumentierte Ausnahme:
 * - nur mit Grund (Feld „Berichtigung: Grund“), der in die Notizen kommt und danach geleert wird,
 * - nur kleiner (Betrag oder ganz leeren), nie größer,
 * - außerhalb des Zahlungsdienstes durch das Team,
 * - über den Zahlungsdienst oder bei einem vermittelten Auftrag nur durch den Inhaber: Ob beim Zahlungsdienst
 *   wirklich erstattet wurde, sieht nur das Stripe-Dashboard; der Code kann das nicht unterscheiden, weil eine
 *   von Hand erfasste Erstattung denselben Stand setzt wie der Webhook. Bei einem vermittelten Auftrag sperrt
 *   die Erstattung die Partnerauszahlung; die Berichtigung entscheidet deshalb der Inhaber.
 *   Erstattet der Zahlungsdienst später doch mehr, hebt der Webhook den Stand wieder an.
 */
function erstattungBerichtigen(
  data: Partial<Vorgaenge>,
  originalDoc: Vorgaenge,
  k: { jetzt: string; bearbeiter: string; inhaber: boolean; notiz: (t: string) => void; verlauf: (t: string) => void },
): boolean {
  const alt = originalDoc.erstattung ?? {};
  const neu = { ...alt, ...data.erstattung };
  const grund = (neu.berichtigungGrund ?? '').trim();
  const bisher = zahl(alt.betragCent) ?? 0;
  if (!alt.art || bisher <= 0) throw new APIError(ERSTATTUNG_MELDUNG_WEG.berichtigungOhne, 400);
  const ausserhalb = belegPflicht(alt.weg) || (!alt.weg && !originalDoc.zahlung?.anbieterRef);
  if (!ausserhalb && !k.inhaber) throw new APIError(ERSTATTUNG_MELDUNG_WEG.berichtigungZahlungsdienst, 403);
  if (istVermittlungsStand(originalDoc.vermittlung?.status) && !k.inhaber) {
    throw new APIError(ERSTATTUNG_MELDUNG_WEG.berichtigungVermittlung, 403);
  }
  const betrag = neu.art ? (zahl(neu.betragCent) ?? 0) : 0;
  if (betrag < 0 || betrag > bisher) throw new APIError(ERSTATTUNG_MELDUNG_WEG.berichtigungHoeher, 400);
  const gezahlt = zahl(originalDoc.zahlung?.betragCent) ?? 0;

  if (betrag === 0) {
    data.erstattung = { art: null, betragCent: null, am: null, grund: null, weg: null, beleg: null, berichtigungGrund: null };
    data.zahlung = { ...(originalDoc.zahlung ?? {}), ...(data.zahlung ?? {}), status: 'bezahlt', erstattetCent: null };
  } else {
    const ganz = gezahlt > 0 && betrag >= gezahlt;
    data.erstattung = { ...neu, art: ganz ? 'ganz' : 'teilweise', betragCent: betrag, berichtigungGrund: null };
    data.zahlung = {
      ...(originalDoc.zahlung ?? {}),
      ...(data.zahlung ?? {}),
      status: ganz ? 'erstattet' : 'teilweise-erstattet',
      erstattetCent: betrag,
    };
  }
  k.notiz(
    `Erstattung berichtigt: von ${formatCents(bisher)} auf ${formatCents(betrag)}`
      + `${ausserhalb ? '' : ' (Weg Zahlungsdienst, vom Inhaber nach Abgleich mit dem Stripe-Dashboard)'}. Grund: ${grund.slice(0, 300)} (${k.bearbeiter}). `
      + `Zahlungsstand jetzt „${betrag === 0 ? 'Bezahlt' : data.zahlung.status === 'erstattet' ? 'Erstattet' : 'Teilweise erstattet'}“.`,
  );
  k.verlauf(betrag === 0 ? 'Berichtigung: Es wurde nichts erstattet.' : `Berichtigung: Erstattet sind insgesamt ${formatCents(betrag)}.`);
  return true;
}

/**
 * Nach dem Speichern: Mit „ausgeführt“ erhält der Kunde die Bitte um Bestätigung mit einem persönlichen
 * Einmal-Link. Gespeichert wird nur der Hash, und nur wenn die Mail hinausging. Ohne Mailanbindung geht
 * nichts hinaus; das Team kann dann mit Grund freigeben.
 */
export const vermittlungNachAenderung: CollectionAfterChangeHook<Vorgaenge> = async ({ doc, operation, req }) => {
  if (operation !== 'update' || req.context?.[SYSTEM_AENDERUNG]) return doc;
  const schluessel = vorhabenSchluessel(doc.id);
  const vorhaben = req.context?.[schluessel] as { bitteUmBestaetigung?: boolean } | undefined;
  if (!vorhaben?.bitteUmBestaetigung) return doc;
  delete req.context[schluessel];
  if (!mailKonfiguration()) return doc;

  const vorgang = vorgangZuSeite(doc);
  const settings = await einstellungenLaden(req);
  const kontext = vorlagenKontext(settings);
  // Erst hier laden: Der Link-Schlüssel gehört zum Server der Seite.
  const { createAccessToken } = await import('../../lib/server/access-token');
  const neu = createAccessToken();
  const { ausfuehrungBestaetigenMail } = await import('../../lib/mail/vorlagen/ausfuehrung');
  const eintrag = await sendeVorlage({
    art: 'ausfuehrung',
    an: vorgang.contact.email,
    inhalt: ausfuehrungBestaetigenMail({
      vorgang,
      kontext,
      link: `${ohneSchraegstrich(kontext.site)}${bestaetigungsPfad(String(doc.id), neu.token)}`,
      telefon: settings?.company ? kontakt(settings.company).telefon : undefined,
    }),
    antwortAn: antwortAdresse(settings?.company),
    idempotenzSchluessel: idempotenzSchluessel(vorgang.reference, 'ausfuehrung', doc.updatedAt),
  });
  const vielleichtZugestellt = eintrag.result === 'fehlgeschlagen' && /Zeitlimit/.test(eintrag.error ?? '');
  const zugestellt = eintrag.result === 'gesendet' || vielleichtZugestellt;
  try {
    const jetzt = new Date().toISOString();
    const gespeichert = await vorgangVermerken(req, doc.id, {
      mailLog: [...(vorgang.mailLog ?? []), eintrag],
      ...(zugestellt
        ? {
            referral: { ...vorgang.referral, confirmTokenHash: neu.hash, confirmSentAt: jetzt },
            // Erst jetzt steht fest, dass die Mail hinausging.
            timeline: [...vorgang.timeline, { at: jetzt, actor: 'team', message: KUNDE_VERLAUF.bitteGesendet }],
          }
        : {}),
    });
    return {
      ...doc,
      mails: gespeichert.mails,
      verlauf: gespeichert.verlauf ?? doc.verlauf,
      vermittlung: { ...doc.vermittlung, ...gespeichert.vermittlung },
    };
  } catch (error) {
    req.payload.logger.error({ msg: `Bitte um Bestätigung zu Vorgang ${doc.id} nicht vermerkt`, err: error });
    return doc;
  }
}
