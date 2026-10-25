/* ==========================================================================
   Kennzahlen im Backend (Erg. Leitfaden §4: „Wichtige Aktionen messen“)
   Gezählt wird aus den Vorgängen selbst — ohne Cookies, ohne Fremddienst.
   Monate nach deutscher Zeit (Eingang `createdAt`, Zahlung `bezahltAm`).
   Reine Funktionen, nur relative Importe.
   ========================================================================== */

import { heuteInBerlin } from './berliner-zeit';
import type { AreaKey, PaymentInfo, RecordKind, RecordStatus } from './types';
import { ERLEDIGTE_STATUS, STATUS_LABEL, STATUS_REIHENFOLGE } from './vorgang-status';

/** Die Felder eines Vorgangs (Sammlung `vorgaenge`), die die Kennzahlen brauchen. */
export interface KennzahlVorgang {
  art: RecordKind;
  bereich: AreaKey;
  status: RecordStatus;
  createdAt: string;
  zahlung?: {
    status?: PaymentInfo['status'] | null;
    betragCent?: number | null;
    erstattetCent?: number | null;
    bezahltAm?: string | null;
  } | null;
}

export interface Kennzahl {
  id: 'bestellungen' | 'fotoanfragen' | 'terminanfragen' | 'projektanfragen' | 'partneranmeldungen';
  label: string;
  passt: (vorgang: KennzahlVorgang) => boolean;
}

export const KENNZAHLEN: Kennzahl[] = [
  { id: 'bestellungen', label: 'Bestellungen', passt: (v) => v.art === 'bestellung' },
  { id: 'fotoanfragen', label: 'Fotoanfragen (Schlüssel nach Vorlage)', passt: (v) => v.bereich === 'schluessel-nach-vorlage' },
  { id: 'terminanfragen', label: 'Terminanfragen', passt: (v) => v.art === 'termin' },
  { id: 'projektanfragen', label: 'Projektanfragen', passt: (v) => v.art === 'projekt' },
  { id: 'partneranmeldungen', label: 'Partneranmeldungen', passt: (v) => v.art === 'partner' },
];

const MONATSNAMEN = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

export interface Monat {
  /** „2026-10“. */
  schluessel: string;
  /** „Oktober 2026“. */
  label: string;
}

/** Monat eines Zeitpunkts in deutscher Zeit, z. B. „2026-11“ für 31.10. 23:30 UTC. */
export function monatInBerlin(iso: string): string {
  return heuteInBerlin(new Date(iso)).slice(0, 7);
}

/** Der aktuelle Monat und die Vormonate, ältester zuerst. */
export function monate(jetzt: Date, anzahl = 3): Monat[] {
  const [jahr, monat] = heuteInBerlin(jetzt).split('-').map(Number);
  const liste: Monat[] = [];
  for (let zurueck = anzahl - 1; zurueck >= 0; zurueck -= 1) {
    const index = jahr * 12 + (monat - 1) - zurueck;
    const j = Math.floor(index / 12);
    const m = index % 12;
    liste.push({ schluessel: `${j}-${String(m + 1).padStart(2, '0')}`, label: `${MONATSNAMEN[m]} ${j}` });
  }
  return liste;
}

/**
 * Ab wann gelesen werden muss (ISO, UTC): ein Tag vor dem ersten Monat —
 * ausgewählt wird danach nach deutscher Zeit.
 */
export function kennzahlenAb(jetzt: Date, anzahl = 3): string {
  const [erster] = monate(jetzt, anzahl);
  const beginn = new Date(`${erster.schluessel}-01T00:00:00.000Z`);
  beginn.setUTCDate(beginn.getUTCDate() - 1);
  return beginn.toISOString();
}

export interface Kennzahlen {
  monate: Monat[];
  zeilen: Array<{ id: Kennzahl['id']; label: string; werte: number[] }>;
  /** Bezahlte Beträge je Monat (Zahlungseingang), abzüglich Teilerstattungen, in Cent. */
  umsatzCent: number[];
  /** Nicht erledigte Vorgänge je Status (nur Status mit Vorgängen). */
  offen: Array<{ status: RecordStatus; label: string; anzahl: number }>;
  offenGesamt: number;
}

export function kennzahlenBerechnen(vorgaenge: KennzahlVorgang[], jetzt: Date, anzahl = 3): Kennzahlen {
  const liste = monate(jetzt, anzahl);
  const spalte = new Map(liste.map((monat, index) => [monat.schluessel, index]));

  const zeilen = KENNZAHLEN.map((kennzahl) => ({ id: kennzahl.id, label: kennzahl.label, werte: liste.map(() => 0) }));
  const umsatzCent = liste.map(() => 0);
  const offenJeStatus = new Map<RecordStatus, number>();

  for (const vorgang of vorgaenge) {
    const eingang = spalte.get(monatInBerlin(vorgang.createdAt));
    if (eingang !== undefined) {
      KENNZAHLEN.forEach((kennzahl, index) => {
        if (kennzahl.passt(vorgang)) zeilen[index].werte[eingang] += 1;
      });
    }

    const zahlung = vorgang.zahlung;
    if (zahlung?.status === 'bezahlt' && typeof zahlung.betragCent === 'number') {
      const bezahlt = spalte.get(monatInBerlin(zahlung.bezahltAm || vorgang.createdAt));
      if (bezahlt !== undefined) umsatzCent[bezahlt] += zahlung.betragCent - (zahlung.erstattetCent ?? 0);
    }

    if (!ERLEDIGTE_STATUS.includes(vorgang.status)) {
      offenJeStatus.set(vorgang.status, (offenJeStatus.get(vorgang.status) ?? 0) + 1);
    }
  }

  const offen = STATUS_REIHENFOLGE.filter((status) => offenJeStatus.has(status)).map((status) => ({
    status,
    label: STATUS_LABEL[status],
    anzahl: offenJeStatus.get(status)!,
  }));
  return { monate: liste, zeilen, umsatzCent, offen, offenGesamt: offen.reduce((summe, z) => summe + z.anzahl, 0) };
}
