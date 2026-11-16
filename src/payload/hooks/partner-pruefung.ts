import {
  isolateObjectProperty,
  type CollectionAfterChangeHook,
  type CollectionBeforeChangeHook,
  type FieldHook,
  type PayloadRequest,
} from 'payload';

import { statuswechselPruefen, sperreBeimWechsel, type BewerbungStatus, type Sperre } from '../../lib/partner/bewerbung';
import { LEAD_ERGEBNISSE, type LeadErgebnis } from '../../lib/partner/lead-verlauf';
import { prueflisteSpeichernPruefen, prueflisteStandText, prueflisteZusammenfuehren, type Pruefliste } from '../../lib/partner/pruefliste';
import { VERMITTLUNG_LABEL, istVermittlungsStand } from '../../lib/partner/vermittlung';
import type { Partnerbetriebe, Vorgaenge } from '../../payload-types';

import { auftragsartenPruefen, provisionenPruefen } from './partner-bewerbung';
import { SYSTEM_AENDERUNG, benutzerName } from './vorgang-benachrichtigen';

/* ==========================================================================
   Partnerbetrieb prüfen, pausieren, sperren (FA-PLATTFORM-01B, FA-07-13 bis
   FA-07-19, FA-22-38 bis FA-22-41).

   - Vor jedem Speichern: frühere Auftragsarten nicht neu setzen (Teil A),
     Prüfliste zusammenführen (Datum und Prüfer beim Abhaken), „Besuch nicht
     möglich“ nur mit Grund, Statusautomat mit Prüfliste und Sperrgrund,
     Modell B hinter dem Schalter.
   - Nach dem Speichern: Wird ein Betrieb pausiert, gesperrt oder beendet,
     bekommen seine laufenden Leads einen Eintrag „zur Klärung“ im
     Lead-Verlauf und eine Notiz. Die Aufträge bleiben sichtbar.
   - Gegenansicht: alle Leads des Betriebs mit Stand (Feld `leadUebersicht`).

   Bewusst nur relative Importe: Die Sammlung wird auch von `payload migrate`
   und `payload run` geladen.
   ========================================================================== */

type Daten = Record<string, unknown>;

const MODELL_B_AUS = 'Modell B ist ausgeschaltet, bis Anwalt und Steuerberatung es freigeben (PARTNERMODELL: B).';

export const partnerbetriebVorAenderung: CollectionBeforeChangeHook = ({ data, originalDoc, req }) => {
  if (!data) return data;
  // Nur Autoschlüssel und Fahrzeugschlüssel (FA-07-02): frühere Auftragsarten nicht neu setzen.
  const artFehler = auftragsartenPruefen(data.auftragsarten, originalDoc?.auftragsarten);
  if (artFehler) throw new Error(artFehler);
  const provisionFehler = provisionenPruefen(data.provisionen, originalDoc?.provisionen);
  if (provisionFehler) throw new Error(provisionFehler);

  const jetzt = new Date().toISOString();
  const bearbeiter = req.user ? benutzerName(req.user) : 'System';

  // Prüfliste: Feld für Feld zusammenführen, Datum und Prüfer beim Abhaken; „Besuch nicht möglich“ nur mit Grund.
  const pruefliste: Pruefliste = prueflisteZusammenfuehren(data.pruefliste, originalDoc?.pruefliste, { jetzt, bearbeiter });
  const listeFehler = prueflisteSpeichernPruefen(pruefliste);
  if (listeFehler) throw new Error(listeFehler);
  data.pruefliste = pruefliste;

  const von = (originalDoc?.status ?? 'eingegangen') as BewerbungStatus;
  const nach = (data.status ?? von) as BewerbungStatus;
  const p = { ...((originalDoc?.pruefung as Daten | undefined) ?? {}), ...((data.pruefung as Daten | undefined) ?? {}) };
  const vertrag = { ...((originalDoc?.vertrag as Daten | undefined) ?? {}), ...((data.vertrag as Daten | undefined) ?? {}) };
  const sperre = { ...((originalDoc?.sperre as Sperre | undefined) ?? {}), ...((data.sperre as Sperre | undefined) ?? {}) };
  const fehler = statuswechselPruefen(von, nach, {
    ...p,
    vertragUnterschrieben: Boolean(vertrag.unterschriebenAm),
    pruefliste,
    sperrGrund: sperre.grund,
    sperrGrundVorher: (originalDoc?.sperre as Sperre | undefined)?.grund ?? null,
  });
  if (fehler) throw new Error(fehler);

  // Pausieren und Sperren mit Grund, Datum und Bearbeiter; beim Aufheben in die interne Notiz.
  const wechsel = sperreBeimWechsel(von, nach, sperre, { jetzt, bearbeiter });
  // Datum und Bearbeiter schreibt nur der Server: ohne Wechsel bleiben die gespeicherten Werte.
  const gespeichert = (originalDoc?.sperre as Sperre | undefined) ?? {};
  data.sperre = von === nach ? { ...wechsel.sperre, seit: gespeichert.seit ?? null, von: gespeichert.von ?? null } : wechsel.sperre;
  if (wechsel.notizZeile) {
    const notiz = typeof data.notiz === 'string' ? data.notiz : typeof originalDoc?.notiz === 'string' ? originalDoc.notiz : '';
    data.notiz = notiz ? `${notiz}\n${wechsel.notizZeile}` : wechsel.notizZeile;
  }

  if (data.abrechnungsmodell === 'B' && process.env.PARTNERMODELL_B !== 'aktiv') throw new Error(MODELL_B_AUS);
  return data;
};

/** Stände des Partners, die laufende Leads zur Klärung markieren. */
const KLAERUNG_BEI: readonly BewerbungStatus[] = ['pausiert', 'gesperrt', 'beendet'];
/** Stände der Vermittlung, die als laufender Lead gelten (vor „ausgeführt“). */
const LAUFEND = ['neu', 'geprueft', 'partner-angefragt', 'angenommen', 'termin-bestaetigt'];

function eintragsDaten(eintrag: NonNullable<Vorgaenge['leadVerlauf']>[number]) {
  const p = eintrag.partnerbetrieb;
  return { ...eintrag, partnerbetrieb: typeof p === 'object' && p ? p.id : p };
}

/**
 * Nach dem Speichern: Ist ein Betrieb neu pausiert, gesperrt oder beendet, bekommt jeder laufende Lead
 * dieses Betriebs einen Eintrag „zur Klärung“ im Lead-Verlauf und eine Notiz. Fehler werden protokolliert,
 * der Partnerbetrieb bleibt gespeichert.
 */
export const partnerbetriebNachAenderung: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  if (operation !== 'update' || !doc || previousDoc?.status === doc.status) return doc;
  if (!KLAERUNG_BEI.includes(doc.status as BewerbungStatus)) return doc;
  try {
    const leads = await req.payload.find({
      collection: 'vorgaenge',
      where: { and: [{ 'vermittlung.partnerbetrieb': { equals: doc.id } }, { 'vermittlung.status': { in: LAUFEND } }] },
      depth: 0,
      // Alle laufenden Leads, ohne Seitengrenze: Keiner darf ohne Eintrag „zur Klärung“ bleiben.
      pagination: false,
      overrideAccess: true,
      req,
    });
    const jetzt = new Date().toISOString();
    const bearbeiter = req.user ? benutzerName(req.user) : 'System';
    const stand = doc.status === 'gesperrt' ? 'gesperrt' : doc.status === 'pausiert' ? 'pausiert' : 'beendet';
    const grund = ((doc.sperre as Sperre | undefined)?.grund ?? '').trim();
    const notiz = `Partnerbetrieb „${doc.firma}“ ${stand}${grund ? `: ${grund.slice(0, 300)}` : ''}. Bitte klären (${bearbeiter}).`;
    const eigenerReq = isolateObjectProperty(req, 'context') as PayloadRequest;
    eigenerReq.context = { ...req.context, [SYSTEM_AENDERUNG]: true };
    for (const lead of leads.docs as Vorgaenge[]) {
      await req.payload.update({
        collection: 'vorgaenge',
        id: lead.id,
        data: {
          leadVerlauf: [
            ...(lead.leadVerlauf ?? []).map(eintragsDaten),
            { partnerbetrieb: doc.id, am: jetzt, von: bearbeiter, ergebnis: 'zur-klaerung', notiz },
          ],
          notizen: [...(lead.notizen ?? []), { am: jetzt, von: 'system', text: notiz }],
        },
        overrideAccess: true,
        depth: 0,
        req: eigenerReq,
      });
    }
  } catch (error) {
    req.payload.logger.error({ msg: `Leads von Partnerbetrieb ${doc.id} nicht zur Klärung markiert`, err: error });
  }
  return doc;
};

/** Stand der Prüfliste als Text über der Gruppe (nur Anzeige, nicht gespeichert). */
export const prueflisteStandFeld: FieldHook = ({ data }) => {
  const d = (data ?? {}) as Partial<Partnerbetriebe>;
  return prueflisteStandText(d.pruefliste as Pruefliste | undefined, d.status);
};

const ERGEBNIS_LABEL = Object.fromEntries(LEAD_ERGEBNISSE.map((e) => [e.value, e.label])) as Record<LeadErgebnis, string>;

/**
 * Gegenansicht am Partnerbetrieb (FA-22-41): alle Leads, die diesem Betrieb je angeboten oder zugeteilt
 * wurden, mit Stand der Vermittlung und letztem Eintrag des Verlaufs. Nur Anzeige.
 */
export const leadUebersichtFeld: FieldHook = async ({ data, req }) => {
  const id = (data as { id?: number | string } | undefined)?.id;
  if (id === undefined || id === null) return null;
  try {
    const gefunden = await req.payload.find({
      collection: 'vorgaenge',
      where: { or: [{ 'leadVerlauf.partnerbetrieb': { equals: id } }, { 'vermittlung.partnerbetrieb': { equals: id } }] },
      depth: 0,
      limit: 200,
      sort: '-updatedAt',
      overrideAccess: true,
      select: { nummer: true, vermittlung: true, leadVerlauf: true },
      req,
    });
    const zeilen = (gefunden.docs as Vorgaenge[]).map((v) => {
      const eigene = (v.leadVerlauf ?? []).filter((e) => String(typeof e.partnerbetrieb === 'object' && e.partnerbetrieb ? e.partnerbetrieb.id : e.partnerbetrieb) === String(id));
      const letzter = eigene.at(-1);
      const aktuell = String(typeof v.vermittlung?.partnerbetrieb === 'object' && v.vermittlung?.partnerbetrieb ? v.vermittlung.partnerbetrieb.id : v.vermittlung?.partnerbetrieb) === String(id);
      const stand = istVermittlungsStand(v.vermittlung?.status) ? VERMITTLUNG_LABEL[v.vermittlung.status] : 'ohne Vermittlung';
      const verlauf = letzter ? `, zuletzt ${ERGEBNIS_LABEL[letzter.ergebnis as LeadErgebnis] ?? letzter.ergebnis} am ${String(letzter.am).slice(0, 10)}` : '';
      return `${v.nummer}: ${aktuell ? stand : 'anderem Betrieb zugeordnet oder offen'}${verlauf}`;
    });
    return zeilen.length ? zeilen.join('\n') : 'Diesem Betrieb wurde noch kein Lead angeboten oder zugeteilt.';
  } catch (error) {
    req.payload.logger.warn({ msg: 'Leads des Partnerbetriebs nicht geladen', err: error });
    return null;
  }
};
