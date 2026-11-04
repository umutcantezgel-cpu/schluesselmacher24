/*
 * Vorgangsblatt als PDF-Inhalt (G-37): dieselben Angaben wie das Druckblatt
 * (`src/lib/druckansichten.ts`), dazu Status mit nächstem Schritt, Zahlungsbeleg (E-08,
 * L-093, E-117) und Fotos als Vorschau (E-110). Datenminimierung (A-015): Fahrzeugscheine und
 * Dokumente stehen nur als Eintrag in der Liste, nie als Bild. Reine Funktion, nur relative Importe.
 */

import { istEinsendung } from '../einsenden/vorgang';
import { KATEGORIE_LABEL, POSITION_LABEL } from '../druckansichten';
import { formatCents, formatDate, formatDateTime, formatDuration } from '../format';
import { ART_LABEL, BEREICH_LABEL, UMFANG_LABEL, ZAHLUNG_LABEL } from '../mail/vorlagen/gemeinsam';
import { vorgangOrtText } from '../terminort';
import type { BusinessRecord, CompanyProfile, RecordStatus, UploadRef } from '../types';
import { STATUS_LABEL } from '../vorgang-status';

import { schnappschussAusVorgang } from '../konfigurator/vorgang';
import type { Blatt, BlattAbschnitt, BlattBild, BlattZeile } from './blatt';
import { schliessplanAbschnitte } from './schliessplan';

/** Arten, die als Vorschaubild ins Blatt dürfen (A-015); Fahrzeugschein und Dokument nie. */
export const VORSCHAU_ARTEN: ReadonlyArray<UploadRef['category']> = ['schluesselfoto', 'objektfoto', 'grundriss'];

/** Nächster Schritt fürs Team je Status (Arbeitsablauf, keine Zusage an den Kunden). */
export const NAECHSTER_SCHRITT: Record<RecordStatus, string> = {
  neu: 'Angaben, Unterlagen und Berechtigungsnachweis prüfen, dann den Status setzen.',
  'in-pruefung': 'Prüfung abschließen: machbar oder nicht, Preis und Lieferzeit festlegen.',
  geprueft: 'Freigabe mit Preis an den Kunden senden.',
  freigegeben: 'Zahlung abwarten, danach Fertigung oder Termin einplanen.',
  'wartet-auf-kunde': 'Auf die Rückmeldung des Kunden warten.',
  'nicht-moeglich': 'Kunden informieren; eine bereits geleistete Zahlung erstatten.',
  'in-fertigung': 'Fertigen und prüfen, dann Versand oder Termin vorbereiten.',
  terminiert: 'Termin vorbereiten, Unterlagen und Material bereitlegen.',
  versendet: 'Zustellung verfolgen.',
  abgeschlossen: 'Keiner. Unterlagen werden nach Ablauf der Frist gelöscht.',
  storniert: 'Keiner. Eine offene Erstattung prüfen.',
};

export const FUSS = 'Interne Unterlage mit personenbezogenen Daten. Nur für die Bearbeitung des Auftrags, nicht weitergeben.';

function name(vorgang: BusinessRecord): string {
  const k = vorgang.contact;
  return [k.salutation, k.firstName, k.lastName].filter(Boolean).join(' ');
}

function anschrift(vorgang: BusinessRecord): string {
  const k = vorgang.contact;
  return [k.street, [k.postalCode, k.city].filter(Boolean).join(' '), k.country].filter(Boolean).join(', ');
}

const uhr = (iso: string) => `${formatDateTime(iso)} Uhr`;

export interface VorgangsblattEingabe {
  vorgang: BusinessRecord;
  firma?: CompanyProfile;
  /** Vorschaubilder (nur Arten aus VORSCHAU_ARTEN), bereits verkleinert. */
  bilder?: BlattBild[];
  jetzt?: Date;
}

export function vorgangsblattInhalt({ vorgang, firma, bilder = [], jetzt = new Date() }: VorgangsblattEingabe): Blatt {
  const abschnitte: BlattAbschnitt[] = [];

  const kopf: BlattZeile[] = [
    { name: 'Status', wert: STATUS_LABEL[vorgang.status] ?? vorgang.status, betont: true },
    { name: 'Nächster Schritt', wert: NAECHSTER_SCHRITT[vorgang.status] ?? '' },
    { name: 'Art', wert: ART_LABEL[vorgang.kind] ?? vorgang.kind },
    { name: 'Bereich', wert: BEREICH_LABEL[vorgang.area] ?? vorgang.area },
    { name: 'Eingegangen', wert: uhr(vorgang.createdAt) },
  ];

  abschnitte.push({
    titel: 'Kunde',
    zeilen: [
      { name: 'Name', wert: [name(vorgang), vorgang.contact.company].filter(Boolean).join(' · ') },
      { name: 'E-Mail', wert: vorgang.contact.email ?? '' },
      { name: 'Telefon', wert: vorgang.contact.phone ?? '' },
      { name: 'Anschrift', wert: anschrift(vorgang) },
    ],
  });

  if (vorgang.appointment) {
    const termin = vorgang.appointment;
    abschnitte.push({
      titel: 'Termin',
      zeilen: [
        { name: 'Datum', wert: `${formatDate(termin.date)}, ${termin.time} Uhr`, betont: true },
        { name: 'Dauer', wert: formatDuration(termin.durationMinutes) },
        { name: 'Ort', wert: vorgangOrtText(vorgang, firma) ?? '' },
      ],
    });
  }

  if (vorgang.lines?.length) {
    abschnitte.push({
      titel: 'Positionen',
      tabelle: {
        kopf: ['Menge', 'Artikel', 'Angaben', 'Einzelpreis', 'Summe'],
        breiten: [0.1, 0.34, 0.26, 0.15, 0.15],
        rechts: [0, 3, 4],
        zeilen: vorgang.lines.map((line) => [
          String(line.qty),
          `${line.label}\n${POSITION_LABEL[line.kind] ?? ''}`.trim(),
          line.details ?? '',
          formatCents(line.unitPriceCents),
          formatCents(line.totalCents),
        ]),
        summen: vorgang.totals
          ? [
              { name: `Versand${vorgang.totals.shippingLabel ? ` (${vorgang.totals.shippingLabel})` : ''}`, wert: formatCents(vorgang.totals.shippingCents) },
              { name: `Gesamt (enthaltene USt. ${formatCents(vorgang.totals.vatCents)})`, wert: formatCents(vorgang.totals.totalCents), betont: true },
            ]
          : undefined,
      },
    });
  }

  // Wie im Druckblatt: Bei Bestellungen ersetzen die Positionen die Zusammenfassung.
  const zusammenfassung = vorgang.kind === 'bestellung' && vorgang.lines?.length ? [] : vorgang.summary;
  zusammenfassung.forEach((teil, i) => {
    abschnitte.push({
      titel: teil.title ? `Angaben des Kunden: ${teil.title}` : i === 0 ? 'Angaben des Kunden' : 'Weitere Angaben',
      zeilen: teil.rows.map((zeile) => ({ name: zeile.label, wert: zeile.value })),
    });
  });

  // Schließplan aus dem Planer (E5-OPUS-03): der Schnappschuss, den der Server beim Eingang gebildet hat.
  const schliessplan = schnappschussAusVorgang(vorgang);
  if (schliessplan) abschnitte.push(...schliessplanAbschnitte(schliessplan));

  if (vorgang.payment) {
    const zahlung = vorgang.payment;
    const zeilen: BlattZeile[] = [
      { name: UMFANG_LABEL[zahlung.scope], wert: formatCents(zahlung.amountCents), betont: true },
      { name: 'Zahlungsstand', wert: ZAHLUNG_LABEL[zahlung.status] },
      { name: 'Bezahlt am', wert: zahlung.paidAt ? uhr(zahlung.paidAt) : '' },
      { name: 'Erstattet', wert: zahlung.refundedCents ? formatCents(zahlung.refundedCents) : '' },
      { name: 'Zahlungsbeleg', wert: zahlung.providerRef ? `Stripe ${zahlung.providerRef}` : '', mono: true },
      { name: 'Endbetrag', wert: vorgang.totals ? formatCents(vorgang.totals.totalCents) : '' },
    ];
    abschnitte.push({ titel: 'Zahlung', zeilen });
  }

  if (vorgang.approval && Object.keys(vorgang.approval).length) {
    const freigabe = vorgang.approval;
    abschnitte.push({
      titel: 'Freigabe',
      zeilen: [
        { name: 'Preis', wert: freigabe.priceCents !== undefined ? formatCents(freigabe.priceCents) : '' },
        {
          name: 'Originalschlüssel einsenden',
          wert: istEinsendung(vorgang) ? 'liegt vor (Einsendung)' : freigabe.sendInRequired === undefined ? '' : freigabe.sendInRequired ? 'ja' : 'nein',
        },
        { name: 'Hinweis an den Kunden', wert: freigabe.note ?? '' },
        { name: 'Freigegeben am', wert: freigabe.approvedAt ? uhr(freigabe.approvedAt) : '' },
      ],
    });
  }

  if (vorgang.uploads.length) {
    abschnitte.push({
      titel: 'Unterlagen',
      tabelle: {
        kopf: ['Art', 'Datei', 'Ablage'],
        breiten: [0.26, 0.5, 0.24],
        zeilen: vorgang.uploads.map((datei) => [
          KATEGORIE_LABEL[datei.category] ?? datei.category,
          datei.fileName,
          datei.storageKey ? (VORSCHAU_ARTEN.includes(datei.category) ? 'im Backend, Vorschau unten' : 'im Backend') : 'nicht gespeichert',
        ]),
      },
      bilder: bilder.length ? bilder : undefined,
    });
  }

  if (vorgang.timeline?.length) {
    const WER = { kunde: 'Kunde', team: 'Team', system: 'System' } as const;
    abschnitte.push({
      titel: 'Verlauf',
      zeilen: vorgang.timeline.map((eintrag) => ({ name: `${uhr(eintrag.at)} · ${WER[eintrag.actor] ?? eintrag.actor}`, wert: eintrag.message })),
    });
  }

  abschnitte.push(
    vorgang.internalNotes.length
      ? { titel: 'Interne Notizen', zeilen: vorgang.internalNotes.map((notiz) => ({ name: uhr(notiz.at), wert: notiz.message })) }
      : { titel: 'Interne Notizen', text: 'Keine Notizen.' },
  );

  return {
    titel: `Vorgangsblatt ${vorgang.reference}`,
    nummer: vorgang.reference,
    stand: jetzt,
    kopf,
    abschnitte,
    fuss: FUSS,
  };
}

/** Dateiname für Anhang und Abruf, nur sichere Zeichen. */
export function vorgangsblattDateiname(referenz: string): string {
  return `Vorgangsblatt-${referenz.replace(/[^A-Za-z0-9-]/g, '')}.pdf`;
}
