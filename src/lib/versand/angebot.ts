/*
 * Was die Seiten zum Einschicken über Versand und Kosten sagen (G-24, R9, MA-08, MA-18, A-050).
 * Je Variante: Haftung als Zahl, Porto laut Post mit Stand, ein etwaiger Aufpreis des Betriebs und die
 * Summe, bevor der Kunde absendet. Ohne Label kauft der Kunde das Porto selbst; mit aktivem und
 * eingerichtetem Label (Geschäftskundenvertrag) bekommt er für DHL Paket das Label von uns, und Porto
 * und Aufpreis werden mit dem Auftrag berechnet. „kostenlos“ steht nirgends, solange der Kunde etwas zahlt.
 * Reine Funktion.
 */

import { formatCents } from '../format';
import type { EinsendeEinstellungen, EinsendeEmpfehlung, EinsendeVarianteKennung } from '../types';

import {
  HAFTUNG_HINWEIS,
  PORTO_UNBELEGT,
  VERPACKUNG_HINWEIS,
  einlieferungSatz,
  haftungSatz,
  haftungWarnung,
  variantenAus,
} from './varianten';

/** Für welche Variante ein Label über die Schnittstelle entstehen kann (DHL, MA-08). */
const LABEL_VARIANTE: EinsendeVarianteKennung = 'dhl-paket';

export interface EinsendeOption {
  art: EinsendeVarianteKennung;
  titel: string;
  /** Wofür die Variante gedacht ist. */
  einsatz: string;
  /** „Haftung bis 20 € je Sendung“. */
  haftung: string;
  /** Warnung bei geringer Haftung. */
  warnung?: string;
  /** „Abgabe: Filiale oder Paketshop“. */
  einlieferung: string;
  sendungsverfolgung: boolean;
  /** Für diesen Fall empfohlen (und dann vorausgewählt). */
  empfohlen: boolean;
  nurSonderfall: boolean;
  /** Aufpreis des Betriebs (Cent), 0 = keiner. */
  aufpreisCents: number;
  /** Porto (Cent); fehlt, wenn nicht belegt. Mit Label wird es mit dem Auftrag berechnet. */
  portoCents?: number;
  /** Porto in Worten: Betrag, „Porto laut Post, bitte dort prüfen“ oder Label. */
  portoText: string;
  /** Porto und Aufpreis zusammen; fehlt, wenn das Porto nicht belegt ist. */
  summeCents?: number;
  /** Stand und Quelle des Portos. */
  stand?: string;
  /** Label kommt von uns (nur mit Vertrag). */
  label: boolean;
  /** Ein Satz für Karten und Mails: Haftung, Porto, Aufpreis. */
  hinweis: string;
}

export interface EinsendeAngebot {
  /** Label aktiv und eingerichtet (nur dann gibt es überhaupt ein Label). */
  kostenlos: boolean;
  /** Ein Satz für die Seite. */
  satz: string;
  /** Wählbare Varianten (Sonderfälle nur nach Freigabe durch das Team). */
  optionen: EinsendeOption[];
  /** Sonderfälle, die der Kunde ausdrücklich wählen und bestätigen kann. */
  sonderfaelle: EinsendeOption[];
  /** Vorausgewählte Variante (Empfehlung), sonst leer. */
  vorauswahl: EinsendeVarianteKennung | '';
  verpackung: string;
  haftungHinweis: string;
}

export interface AngebotFall {
  /** Wofür die Empfehlung gilt (empfehlungFuer); `null` = keine Empfehlung. */
  empfehlung?: EinsendeEmpfehlung | null;
  /** Das Team hat den Sonderfall am Vorgang freigegeben. */
  sonderfallFrei?: boolean;
}

export function einsendeAngebot(e: EinsendeEinstellungen, labelEingerichtet: boolean, fall: AngebotFall = {}): EinsendeAngebot {
  const mitLabel = e.labelAktiv && labelEingerichtet;
  const empfehlung = fall.empfehlung ?? null;
  const alle = variantenAus(e)
    .filter((v) => v.aktiv)
    .map((v): EinsendeOption => {
      const label = mitLabel && v.kennung === LABEL_VARIANTE;
      const porto = v.portoCents === null ? undefined : v.portoCents;
      const summeCents = porto === undefined ? undefined : porto + v.aufpreisCents;
      // Mit Label trägt der Kunde die Versandkosten weiter, sie werden mit dem Auftrag berechnet (FA Anhang B,
      // A-050 Punkt 4). Eine Übernahme des Portos durch den Betrieb hat der Inhaber nicht freigegeben (G9, R9).
      const portoText = label
        ? summeCents === undefined
          ? 'Versandlabel von uns, die Versandkosten werden mit dem Auftrag berechnet'
          : `Versandlabel von uns, ${formatCents(summeCents)} werden mit dem Auftrag berechnet`
        : porto === undefined
          ? PORTO_UNBELEGT
          : `${formatCents(porto)} Porto laut Post`;
      const haftung = haftungSatz(v);
      const warnung = haftungWarnung(v);
      const aufpreis = v.aufpreisCents > 0 && !label ? ` Aufpreis ${formatCents(v.aufpreisCents)}.` : '';
      return {
        art: v.kennung,
        titel: v.bezeichnung,
        einsatz: v.einsatz,
        haftung,
        ...(warnung ? { warnung } : {}),
        einlieferung: einlieferungSatz(v),
        sendungsverfolgung: v.sendungsverfolgung,
        empfohlen: empfehlung !== null && v.empfohlenFuer.includes(empfehlung),
        nurSonderfall: v.nurSonderfall,
        aufpreisCents: v.aufpreisCents,
        ...(porto !== undefined ? { portoCents: porto } : {}),
        portoText,
        ...(summeCents !== undefined ? { summeCents } : {}),
        ...(v.portoStand ? { stand: v.portoStand } : {}),
        label,
        hinweis: `${haftung}. ${portoText}.${aufpreis}${warnung ? ` ${warnung}` : ''}`,
      };
    });
  const optionen = alle.filter((o) => !o.nurSonderfall || fall.sonderfallFrei === true);
  const sonderfaelle = alle.filter((o) => o.nurSonderfall && fall.sonderfallFrei !== true);
  return {
    kostenlos: mitLabel,
    satz: mitLabel
      ? 'Für DHL Paket bekommen Sie das Versandlabel von uns; die Versandkosten werden mit dem Auftrag berechnet. Einen Brief frankieren Sie selbst.'
      : 'Sie drucken den Begleitschein aus und frankieren selbst; das Porto zahlen Sie bei der Post.',
    optionen,
    sonderfaelle,
    vorauswahl: optionen.find((o) => o.empfohlen)?.art ?? '',
    verpackung: VERPACKUNG_HINWEIS,
    haftungHinweis: HAFTUNG_HINWEIS,
  };
}

/** Darf der Kunde diese Variante wählen? Sonderfall nur mit Freigabe oder ausdrücklicher Bestätigung. */
export function varianteWaehlbar(angebot: EinsendeAngebot, art: unknown, sonderfallBestaetigt: boolean): boolean {
  if (angebot.optionen.some((o) => o.art === art)) return true;
  return sonderfallBestaetigt && angebot.sonderfaelle.some((o) => o.art === art);
}
