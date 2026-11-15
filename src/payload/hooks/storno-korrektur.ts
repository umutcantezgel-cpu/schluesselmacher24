import { APIError, type CollectionBeforeChangeHook } from 'payload';

import { formatCents } from '../../lib/format';
import { STORNO_ENTSCHEIDUNGEN, stornoPruefen } from '../../lib/zahlung/erstattung';
import type { Vorgaenge } from '../../payload-types';

import { SYSTEM_AENDERUNG, benutzerName } from './vorgang-benachrichtigen';

/* ==========================================================================
   Storno mit Entscheidung zur Erstattung und Korrekturpositionen (FA-KERN-05).

   - Storno einer Zahlung, die eingegangen ist: Das Team wählt ausdrücklich
     „ganz“, „teilweise“ oder „keine“ Erstattung (bei „keine“ mit Grund). Bei
     „ganz“ und „teilweise“ muss die Erstattung im selben Speichern in der
     Gruppe Erstattung stehen (oder schon erfasst sein). Die Entscheidung
     steht mit Zeit und Bearbeiter am Vorgang und in den Notizen.
   - Korrekturpositionen bei Bestellungen: Positionen und Summen bleiben
     festgeschrieben (Beleg). Eine Korrektur ist ein eigener Eintrag mit
     Betrag (plus oder minus), Grund, Datum und Bearbeiter. Einträge lassen
     sich nicht ändern oder löschen; berichtigt wird mit einer weiteren
     Korrektur. Die Summe nach Korrektur zeigt das Backend daneben.

   Läuft nach `vermittlungVorAenderung`: Eine Erstattung im selben Speichern
   hat den Zahlungsstand dann schon gesetzt. Nur für Änderungen des Teams.
   Bewusst nur relative Importe (payload migrate, payload run).
   ========================================================================== */

export const KORREKTUR_MELDUNG = {
  nurBestellung: 'Korrekturpositionen gibt es nur bei Bestellungen.',
  fest: 'Eine Korrekturposition ist ein Beleg und lässt sich nicht ändern oder löschen. Bitte eine weitere Korrektur mit Gegenbetrag anlegen.',
  betrag: 'Bitte bei jeder Korrektur einen Betrag in Cent eintragen (plus oder minus, nicht 0).',
  grund: 'Bitte bei jeder Korrektur einen Grund eintragen.',
  negativ: 'Nach der Korrektur wäre die Summe kleiner als 0. Bitte den Betrag prüfen.',
} as const;

type Korrektur = NonNullable<Vorgaenge['korrekturen']>[number];
/** Nur der Betrag; im Formular kann er noch fehlen. */
type KorrekturBetrag = { betragCent?: number | null };

const ganzeZahl = (wert: unknown): number | undefined =>
  wert === null || wert === undefined || wert === '' || !Number.isFinite(Number(wert)) ? undefined : Math.round(Number(wert));

/** Summe nach Korrektur: festgeschriebene Gesamtsumme plus alle Korrekturen. `null` ohne Summe. */
export function summeNachKorrektur(gesamtCent: number | null | undefined, korrekturen: ReadonlyArray<KorrekturBetrag> | null | undefined): number | null {
  if (typeof gesamtCent !== 'number' || !Number.isFinite(gesamtCent)) return null;
  return (korrekturen ?? []).reduce((summe, k) => summe + (ganzeZahl(k.betragCent) ?? 0), gesamtCent);
}

/** Anzeige neben den Summen: ursprüngliche Summe, Korrekturen, Summe nach Korrektur. `null` ohne Korrektur. */
export function korrekturText(gesamtCent: number | null | undefined, korrekturen: ReadonlyArray<KorrekturBetrag> | null | undefined): string | null {
  if (!korrekturen?.length) return null;
  const nach = summeNachKorrektur(gesamtCent, korrekturen);
  if (nach === null) return null;
  const summe = korrekturen.reduce((s, k) => s + (ganzeZahl(k.betragCent) ?? 0), 0);
  return `Ursprünglich ${formatCents(gesamtCent!)}, Korrekturen ${summe >= 0 ? '+' : ''}${formatCents(summe)}, nach Korrektur ${formatCents(nach)}.`;
}

function korrekturenPruefen(data: Partial<Vorgaenge>, originalDoc: Vorgaenge, jetzt: string, bearbeiter: string, notiz: (t: string) => void): void {
  if (!Array.isArray(data.korrekturen)) return;
  const alt = originalDoc.korrekturen ?? [];
  const formular = data.korrekturen;
  const nachId = new Map(formular.filter((k) => k.id).map((k) => [String(k.id), k]));
  // Bestehende Einträge: unverändert vorhanden.
  for (const eintrag of alt) {
    const gesendet = nachId.get(String(eintrag.id));
    if (!gesendet || ganzeZahl(gesendet.betragCent) !== ganzeZahl(eintrag.betragCent) || (gesendet.grund ?? '').trim() !== (eintrag.grund ?? '').trim()) {
      throw new APIError(KORREKTUR_MELDUNG.fest, 400);
    }
  }
  const altIds = new Set(alt.map((k) => String(k.id)));
  const neue = formular.filter((k) => !k.id || !altIds.has(String(k.id)));
  if (neue.length === 0) {
    data.korrekturen = alt;
    return;
  }
  if (originalDoc.art !== 'bestellung') throw new APIError(KORREKTUR_MELDUNG.nurBestellung, 400);
  const geprueft: Korrektur[] = neue.map((k) => {
    const betrag = ganzeZahl(k.betragCent);
    if (betrag === undefined || betrag === 0) throw new APIError(KORREKTUR_MELDUNG.betrag, 400);
    const grund = (k.grund ?? '').trim();
    if (!grund) throw new APIError(KORREKTUR_MELDUNG.grund, 400);
    return { ...(k.id ? { id: k.id } : {}), betragCent: betrag, grund, am: jetzt, von: bearbeiter };
  });
  const alle = [...alt, ...geprueft];
  const gesamt = originalDoc.summen?.gesamtCent;
  const nach = summeNachKorrektur(gesamt, alle);
  if (nach !== null && nach < 0) throw new APIError(KORREKTUR_MELDUNG.negativ, 400);
  data.korrekturen = alle;
  for (const k of geprueft) {
    notiz(
      `Korrekturposition ${k.betragCent! > 0 ? '+' : ''}${formatCents(k.betragCent!)} erfasst. Grund: ${k.grund!.slice(0, 300)} (${bearbeiter}).`
        + (nach !== null ? ` Summe nach Korrektur: ${formatCents(nach)}.` : ''),
    );
  }
}

function stornoFestschreiben(data: Partial<Vorgaenge>, originalDoc: Vorgaenge, jetzt: string, bearbeiter: string, notiz: (t: string) => void): void {
  if (!data.status || data.status === originalDoc.status || data.status !== 'storniert') return;
  const storno = { ...(originalDoc.storno ?? {}), ...(data.storno ?? {}) };
  const zahlungVorher = originalDoc.zahlung?.status ?? null;
  const zahlungNachher = data.zahlung?.status ?? zahlungVorher;
  const fehler = stornoPruefen({ zahlungVorher, zahlungNachher, entscheidung: storno.entscheidung, grund: storno.grund });
  if (fehler) throw new APIError(fehler, 400);
  if (!storno.entscheidung) return;
  const label = STORNO_ENTSCHEIDUNGEN.find((e) => e.value === storno.entscheidung)?.label ?? storno.entscheidung;
  const grund = (storno.grund ?? '').trim();
  data.storno = { ...storno, grund: grund || null, entschiedenAm: jetzt, entschiedenVon: bearbeiter };
  const erstattet = data.zahlung?.erstattetCent ?? originalDoc.zahlung?.erstattetCent;
  notiz(
    `Storno mit Entscheidung zur Erstattung: ${label}`
      + (storno.entscheidung !== 'keine' && typeof erstattet === 'number' ? ` (erstattet insgesamt ${formatCents(erstattet)})` : '')
      + (grund ? `. Grund: ${grund.slice(0, 300)}` : '')
      + ` (${bearbeiter}).`,
  );
}

export const stornoKorrekturVorAenderung: CollectionBeforeChangeHook<Vorgaenge> = ({ data, originalDoc, operation, req }) => {
  if (operation !== 'update' || !req.user || req.context?.[SYSTEM_AENDERUNG] || !originalDoc) return data;
  const jetzt = new Date().toISOString();
  const bearbeiter = benutzerName(req.user);
  const notiz = (text: string) => {
    data.notizen = [...(data.notizen ?? originalDoc.notizen ?? []), { am: jetzt, von: 'team', text }];
  };
  korrekturenPruefen(data, originalDoc, jetzt, bearbeiter, notiz);
  stornoFestschreiben(data, originalDoc, jetzt, bearbeiter, notiz);
  return data;
};
