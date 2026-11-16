import type { CollectionBeforeChangeHook, FieldHook, FilterOptions } from 'payload';

import { AUFTRAGSWEG_DATEN, auftragswegVon } from '../../lib/auftragsweg';
import { vorgangZuSeite } from '../../lib/data/payload-mapping';
import { betriebMitgeteilt } from '../../lib/mail/nachricht-vorlagen';
import { betriebHinweis, leadEintraege, zuordnungWarnung, type LeadEintrag, type LeadRueckgabe } from '../../lib/partner/lead-verlauf';
import { istVermittlungsStand } from '../../lib/partner/vermittlung';
import type { Partnerbetriebe, Vorgaenge } from '../../payload-types';

import { SYSTEM_AENDERUNG, benutzerName } from './vorgang-benachrichtigen';

/* ==========================================================================
   Lead-Verlauf und Zuordnung am Vorgang (FA-PLATTFORM-01B, FA-22-41, FA-07-19,
   FA-07-03).

   - Jede Änderung der Zuordnung (Partnerbetrieb, „an Partner vermittelt“,
     „angenommen“, Schritt zurück) schreibt einen Eintrag in `leadVerlauf`.
     Von Hand lässt sich der Verlauf nicht ändern (Feld nur lesbar, Server
     schreibt). Angaben des Teams zum Schritt zurück kommen aus der Gruppe
     `zuordnung` und gelten nur für dieses eine Speichern.
   - Auswahl des Partnerbetriebs: nur freigeschaltete, dazu der schon
     gespeicherte (damit laufende Aufträge speicherbar bleiben).
   - Warnung, wenn der zugeordnete Betrieb pausiert, gesperrt oder beendet ist;
     Hinweis, solange die Nachricht „Ihr ausführender Betrieb“ fehlt.

   Bewusst nur relative Importe: Die Sammlung wird auch von `payload migrate`
   und `payload run` geladen.
   ========================================================================== */

const relationsId = (wert: unknown): string | null => {
  if (wert === null || wert === undefined || wert === '') return null;
  if (typeof wert === 'object') {
    const id = (wert as { id?: unknown }).id;
    return id === null || id === undefined ? null : String(id);
  }
  return String(wert);
};

type Verlauf = NonNullable<Vorgaenge['leadVerlauf']>;

function verlaufLesen(verlauf: Vorgaenge['leadVerlauf']): LeadEintrag[] {
  return (verlauf ?? []).map((e) => ({
    partnerbetrieb: relationsId(e.partnerbetrieb) ?? '',
    am: e.am,
    von: e.von ?? '',
    ergebnis: e.ergebnis,
    notiz: e.notiz ?? null,
  }));
}

export const leadVerlaufVorAenderung: CollectionBeforeChangeHook<Vorgaenge> = ({ data, originalDoc, operation, req }) => {
  if (operation !== 'update' || !originalDoc || req.context?.[SYSTEM_AENDERUNG]) return data;
  const angabe = { ...(originalDoc.zuordnung ?? {}), ...(data.zuordnung ?? {}) };
  const altV = originalDoc.vermittlung ?? {};
  const neuV = { ...altV, ...(data.vermittlung ?? {}) };
  const alt = { status: istVermittlungsStand(altV.status) ? altV.status : null, partner: relationsId(altV.partnerbetrieb) };
  const neu = { status: istVermittlungsStand(neuV.status) ? neuV.status : null, partner: relationsId(neuV.partnerbetrieb) };
  const eintraege = leadEintraege(alt, neu, verlaufLesen(originalDoc.leadVerlauf), {
    am: new Date().toISOString(),
    von: req.user ? benutzerName(req.user) : 'System',
    rueckgabe: (angabe.rueckgabe ?? null) as LeadRueckgabe | null,
    notiz: angabe.notiz ?? null,
  });
  // Die Angaben gelten nur für dieses eine Speichern.
  if (data.zuordnung || originalDoc.zuordnung?.rueckgabe || originalDoc.zuordnung?.notiz) data.zuordnung = { rueckgabe: null, notiz: null };
  if (!eintraege.length) return data;
  // Leere Verweise bleiben leer (Betrieb endgültig gelöscht, ON DELETE SET NULL); `Number(null)` wäre 0 und
  // verletzte den Fremdschlüssel, dann ließe sich der Vorgang nicht mehr umordnen.
  const verweis = (wert: unknown): number | null => {
    const id = relationsId(wert);
    return id === null ? null : Number(id);
  };
  const bisher: Verlauf = (originalDoc.leadVerlauf ?? []).map((e) => ({ ...e, partnerbetrieb: verweis(e.partnerbetrieb) }));
  data.leadVerlauf = [
    ...bisher,
    ...eintraege.map((e) => ({ partnerbetrieb: verweis(e.partnerbetrieb), am: e.am, von: e.von, ergebnis: e.ergebnis, notiz: e.notiz ?? null })),
  ];
  return data;
};

/**
 * Auswahl des Partnerbetriebs am Vorgang (FA-07-19): Neu wählbar sind nur freigeschaltete Betriebe. Der schon
 * gespeicherte bleibt gültig, auch wenn er inzwischen pausiert, gesperrt oder beendet ist, damit ein laufender
 * Auftrag gespeichert, geklärt und abgerechnet werden kann. Vermitteln an ihn lehnt `vermittlungVorAenderung` ab.
 */
export const partnerbetriebAuswahl: FilterOptions = async ({ id, req }) => {
  const frei = { status: { equals: 'freigeschaltet' } };
  if (id === undefined || id === null || id === '') return frei;
  try {
    const gespeichert = (await req.payload.findByID({
      collection: 'vorgaenge',
      id,
      depth: 0,
      overrideAccess: true,
      disableErrors: true,
      select: { vermittlung: true },
      req,
    })) as Pick<Vorgaenge, 'vermittlung'> | null;
    const bisher = relationsId(gespeichert?.vermittlung?.partnerbetrieb);
    return bisher ? { or: [frei, { id: { equals: Number(bisher) } }] } : frei;
  } catch {
    return frei;
  }
};

/** Warnung am Vorgang, wenn der zugeordnete Partnerbetrieb pausiert, gesperrt oder beendet ist. Nur Anzeige. */
export const partnerWarnungFeld: FieldHook<Vorgaenge> = async ({ data, req }) => {
  const doc = data as Partial<Vorgaenge> | undefined;
  const id = relationsId(doc?.vermittlung?.partnerbetrieb);
  if (!id) return null;
  try {
    const partner = (await req.payload.findByID({
      collection: 'partnerbetriebe',
      id,
      depth: 0,
      overrideAccess: true,
      disableErrors: true,
      select: { firma: true, status: true, sperre: true },
      req,
    })) as Pick<Partnerbetriebe, 'firma' | 'status' | 'sperre'> | null;
    const status = doc?.vermittlung?.status;
    return zuordnungWarnung(partner, istVermittlungsStand(status) ? status : null);
  } catch {
    return null;
  }
};

/**
 * Liegt der Vorgang im Partnerweg (zentrale Zahlung)? Dieselbe Regel wie am Endpunkt der Nachricht
 * (`auftragswegVon`); ein unvollständiges Dokument darf die Anzeige nicht brechen.
 */
function imPartnerweg(doc: Partial<Vorgaenge>): boolean {
  const daten = doc.daten && typeof doc.daten === 'object' && !Array.isArray(doc.daten) ? (doc.daten as Record<string, unknown>) : {};
  if (daten[AUFTRAGSWEG_DATEN] === 'partner') return true;
  try {
    return auftragswegVon(vorgangZuSeite(doc as Vorgaenge)) === 'partner';
  } catch {
    return false;
  }
}

/** Hinweis, solange die Nachricht „Ihr ausführender Betrieb“ beim Stand „angenommen“ fehlt (FA-07-03). Nur Anzeige. */
export const betriebHinweisFeld: FieldHook<Vorgaenge> = ({ data }) => {
  const doc = data as Partial<Vorgaenge> | undefined;
  const status = doc?.vermittlung?.status;
  // Im Partnerweg (zentrale Zahlung) lehnt der Server die Nachricht ab, bis der Text rechtlich geprüft ist
  // (R10, MA-29): dort kein Hinweis, der in eine Sackgasse führt.
  if (doc && imPartnerweg(doc)) return null;
  return betriebHinweis(
    istVermittlungsStand(status) ? status : null,
    Boolean(relationsId(doc?.vermittlung?.partnerbetrieb)),
    betriebMitgeteilt(doc?.mails),
  );
};
