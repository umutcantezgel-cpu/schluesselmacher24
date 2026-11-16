import type { CollectionConfig, Field } from 'payload';

import { istInhaber, istTeam } from '../access/rollen';
import { BEREICHE, PROZESSE } from '../fields/gemeinsam';
import { VORGANG_STATUS } from '../fields/vorgang-status';
import { auftragswegVorAenderung, partnerVorschlaege } from '../hooks/auftragsweg';
import { vermittlungNachAenderung, vermittlungVorAenderung } from '../hooks/vermittlung';
import { betriebHinweisFeld, leadVerlaufVorAenderung, partnerWarnungFeld, partnerbetriebAuswahl } from '../hooks/lead-verlauf';
import { bestaetigungSenden } from '../hooks/bestaetigung-senden';
import { kundenNachrichtSenden } from '../hooks/kunden-nachricht';
import { korrekturText, stornoKorrekturVorAenderung } from '../hooks/storno-korrektur';
import { druckansichten } from '../hooks/druckansichten';
import { terminAktionen } from '../hooks/termin-aktionen';
import { vorgangNachAenderung, vorgangVorAenderung } from '../hooks/vorgang-benachrichtigen';
import { AUFTRAGSWEGE, AUFTRAGSWEG_LABEL } from '../../lib/auftragsweg';
import { KATEGORIE_LABEL } from '../../lib/druckansichten';
import { AUSZAHLUNG_LABEL, VERMITTLUNG_LABEL, VERMITTLUNG_STAENDE } from '../../lib/partner/vermittlung';
import { LEAD_ERGEBNISSE, LEAD_RUECKGABEN } from '../../lib/partner/lead-verlauf';
import { aktiverAuszahlungswegText } from '../../lib/zahlung/auszahlung';
import { ERSTATTUNGS_WEGE, STORNO_ENTSCHEIDUNGEN, zahlungsstandText } from '../../lib/zahlung/erstattung';
import { AUFTRAGSARTEN, feldNurTeam } from './Partnerbetriebe';
import { fahrzeugklasseText } from '../../lib/fahrzeuge/anfrage-klassen';
import { unterlagenHinweis } from '../../lib/server/unterlagen-pflicht';
import type { UploadRef } from '../../lib/types';
import { dateiBezeichnung } from '../../lib/wege/nachweis';
import { SENDUNGSNUMMER_MAX, bereinigeSendungsnummer, teamSendungAenderung } from '../../lib/einsenden/sendung';

/**
 * Übersicht der Unterlagen im Vorgang (FA-KERN-02): je Datei der Steckplatz, dazu der Hinweis, wenn ein
 * Pflicht-Steckplatz fehlt (etwa bei älteren Vorgängen). `null`, wenn es nichts zu zeigen gibt.
 */
export function steckplatzUebersicht(daten: Record<string, unknown> | null | undefined): string | null {
  if (!daten) return null;
  const uploads = Array.isArray(daten.uploads) ? (daten.uploads as UploadRef[]) : [];
  const zeilen = uploads.map(
    (datei) => `${dateiBezeichnung(datei, KATEGORIE_LABEL)}: ${datei.fileName}${datei.storageKey ? '' : ' (nicht gespeichert)'}`,
  );
  const hinweis = unterlagenHinweis({
    kind: String(daten.art ?? ''),
    area: String(daten.bereich ?? ''),
    payload: (daten.daten as Record<string, unknown> | null | undefined) ?? {},
    uploads,
  });
  if (hinweis) zeilen.push(`Hinweis: ${hinweis}`);
  return zeilen.length ? zeilen.join('\n') : null;
}

export { VORGANG_STATUS };

const AKTEURE = [
  { label: 'Kunde', value: 'kunde' },
  { label: 'Team', value: 'team' },
  { label: 'System', value: 'system' },
];

const nurLesen = { readOnly: true };

/**
 * Felder, die nur der Server schreibt (Zahlungsdienst, Mailversand,
 * Zustimmungen aus dem Formular, Termin). Beim Speichern im Backend übernimmt
 * Payload für diese Felder den gespeicherten Wert statt des Formularstands
 * (`payload/dist/fields/hooks/beforeValidate/promise.js`, getFallbackValue) —
 * so überschreibt ein offenes Formular keine Zahlung, die inzwischen
 * eingegangen ist, und keinen verschobenen Termin. Zahlungsstand, Status und
 * Notizen pflegt das Team; sie schützt `vorgangVorAenderung`. Die Local API
 * mit `overrideAccess` schreibt weiterhin.
 */
const systemFeld = { access: { update: () => false } };

export const MAIL_ARTEN = [
  { label: 'Eingangsbestätigung', value: 'eingang-kunde' },
  { label: 'Benachrichtigung an den Betrieb', value: 'eingang-team' },
  { label: 'Vertragsbestätigung', value: 'vertrag' },
  { label: 'Zahlung erhalten', value: 'zahlung-erhalten' },
  { label: 'Zahlung nicht abgeschlossen', value: 'zahlung-nicht-abgeschlossen' },
  { label: 'Erstattung', value: 'erstattung' },
  { label: 'Statusänderung', value: 'status' },
  { label: 'Widerruf erhalten', value: 'widerruf' },
  { label: 'Termin-Erinnerung', value: 'erinnerung' },
  { label: 'Ergebnis der Foto-Prüfung', value: 'freigabe' },
  { label: 'Hinweis an das Team', value: 'team-hinweis' },
  { label: 'Bitte um Bestätigung der Ausführung', value: 'ausfuehrung' },
  { label: 'Nachricht des Teams', value: 'nachricht' },
  { label: 'Sonstige', value: 'sonstige' },
];

/**
 * Stand einer Auftragsvermittlung an einen Partnerbetrieb (Erg. Leitfaden §7, FA-KERN-04): Reihenfolge
 * und Anzeige nach der Arbeitsanweisung des Inhabers. Leer = der Vorgang wird nicht vermittelt.
 */
export const VERMITTLUNG_STATUS = VERMITTLUNG_STAENDE.map((value) => ({ label: VERMITTLUNG_LABEL[value], value }));

/** Auszahlungsstand (FA-KERN-04), vom Server aus Vermittlung und Zahlungsstand abgeleitet. */
export const AUSZAHLUNG_STAND = (Object.keys(AUSZAHLUNG_LABEL) as Array<keyof typeof AUSZAHLUNG_LABEL>).map((value) => ({
  label: AUSZAHLUNG_LABEL[value],
  value,
}));

export const VERSANDDIENSTLEISTER = [
  { label: 'DHL', value: 'dhl' },
  { label: 'DPD', value: 'dpd' },
  { label: 'Deutsche Post', value: 'deutsche-post' },
  { label: 'Hermes', value: 'hermes' },
  { label: 'GLS', value: 'gls' },
  { label: 'UPS', value: 'ups' },
  { label: 'Sonstige', value: 'sonstige' },
];

/** Versandvarianten der Einsendung (A-050), wie in den Einstellungen. */
const EINSENDE_VARIANTEN_OPTIONEN = [
  { label: 'DHL Paket', value: 'dhl-paket' },
  { label: 'Einschreiben Einwurf', value: 'einschreiben-einwurf' },
  { label: 'Einschreiben Wert', value: 'einschreiben-wert' },
];

/** Zahlart des Restbetrags beim Termin (FA-KERN-03). */
export const REST_ZAHLARTEN = [
  { label: 'Bar', value: 'bar' },
  { label: 'Karte', value: 'karte' },
  { label: 'Überweisung', value: 'ueberweisung' },
];

/** Auftragsweg (FA-KERN-03, A-049): Hauptzentrale, regionaler Eigenbereich oder Partnernetzwerk. */
export const AUFTRAGSWEG_OPTIONEN = AUFTRAGSWEGE.map((value) => ({ label: AUFTRAGSWEG_LABEL[value], value }));

const zeitpunkt = { date: { pickerAppearance: 'dayAndTime' as const, displayFormat: 'dd.MM.yyyy HH:mm' } };

function eintragFelder(): Field[] {
  return [
    {
      type: 'row',
      fields: [
        { name: 'am', type: 'date', label: 'Zeitpunkt', required: true, admin: { width: '30%', date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd.MM.yyyy HH:mm' } } },
        { name: 'von', type: 'select', label: 'Von', required: true, defaultValue: 'team', options: AKTEURE, admin: { width: '20%' } },
        { name: 'text', type: 'textarea', label: 'Eintrag', required: true, admin: { width: '50%' } },
      ],
    },
  ];
}

/**
 * Bestellungen, Anfragen, Termine und Projekte.
 *
 * Vorgänge entstehen nur auf dem Server (Kasse, Formulare, Buchung) — über
 * das Backend und die Programmierschnittstelle kann niemand einen anlegen.
 * Beträge und Positionen sind festgeschrieben; das Team pflegt Status,
 * Zahlungsstand und interne Notizen. Änderungen nach der Bestellung stehen als
 * Korrekturposition daneben (FA-KERN-05).
 */
export const Vorgaenge: CollectionConfig = {
  slug: 'vorgaenge',
  labels: { singular: 'Vorgang', plural: 'Vorgänge' },
  admin: {
    group: 'Aufträge',
    useAsTitle: 'nummer',
    // Stand der Vermittlung als Spalte (Erg. Leitfaden §7); filterbar über „Filter“ → „Vermittlung“.
    // Auftragsweg, Zahlungsstand und Rest offen als Spalten und Filter (FA-KERN-03).
    // Stand der Vermittlung und Auszahlungsstand als Spalten und Filter (FA-KERN-04).
    defaultColumns: [
      'nummer',
      'art',
      'bereich',
      'status',
      'auftragsweg',
      'zahlung.status',
      'restzahlung.restCent',
      'vermittlung.status',
      'auszahlung.stand',
      'createdAt',
    ],
    listSearchableFields: ['nummer', 'kontakt.email', 'kontakt.nachname', 'kontakt.firma', 'vermittlung.notiz'],
    pagination: { defaultLimit: 50 },
    description:
      'Alle Bestellungen, Anfragen, Termine, Projekte und Partner-Bewerbungen. Neueste oben. '
      + 'Partner-Bewerbungen haben die Art „Partner-Bewerbung“ und Nummern mit „N“ (z. B. SM24-N-2026-0001); '
      + 'die Firma steht unter „Kontakt“. Vermittelte Aufträge: Spalte „Stand der Vermittlung“ oder Filter. '
      + 'Fahrzeugschlüssel-Anfragen einer Klasse: oben „Anfragen nach Fahrzeugklasse“.',
    components: {
      // Telefontermin eintragen (Team) und CSV-Export für die Buchhaltung (Inhaber).
      // Filter „wartet auf Zuordnung“ für Leads ohne angebotenen Partner (FA-PLATTFORM-01B, FA-22-41).
      beforeListTable: ['/payload/components/VorgaengeWerkzeuge#VorgaengeWerkzeuge', '/payload/components/ZuordnungFilter#ZuordnungFilter'],
    },
  },
  defaultSort: '-createdAt',
  access: {
    read: istTeam,
    create: () => false,
    update: istTeam,
    delete: istInhaber,
  },
  hooks: {
    // Statusmails, Zahlung von Hand, offene Zahlungsseite beim Stornieren beenden; danach Auftragsweg
    // (Begründung Pflicht) und Restbetrag (FA-KERN-03).
    // Vermittlung, Auszahlung und Erstattung (FA-KERN-04) vor dem Restbetrag, weil eine Erstattung den
    // Zahlungsstand ändert.
    // Storno mit Entscheidung zur Erstattung und Korrekturpositionen (FA-KERN-05) nach der Erstattung.
    // Lead-Verlauf (FA-PLATTFORM-01B) nach der Prüfung der Vermittlung: nur Wechsel, die gelten, kommen hinein.
    beforeChange: [vorgangVorAenderung, vermittlungVorAenderung, leadVerlaufVorAenderung, stornoKorrekturVorAenderung, auftragswegVorAenderung],
    afterChange: [vorgangNachAenderung, vermittlungNachAenderung],
  },
  endpoints: [bestaetigungSenden, kundenNachrichtSenden, ...terminAktionen, ...druckansichten],
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'nummer', type: 'text', label: 'Vorgangsnummer', required: true, unique: true, index: true, admin: { width: '25%', ...nurLesen } },
        {
          name: 'art',
          type: 'select',
          label: 'Art',
          required: true,
          options: [
            { label: 'Bestellung', value: 'bestellung' },
            { label: 'Anfrage', value: 'anfrage' },
            { label: 'Termin', value: 'termin' },
            { label: 'Projekt', value: 'projekt' },
            { label: 'Partner-Bewerbung', value: 'partner' },
          ],
          admin: { width: '25%', ...nurLesen },
        },
        { name: 'bereich', type: 'select', label: 'Bereich', required: true, options: BEREICHE, admin: { width: '25%', ...nurLesen } },
        { name: 'prozess', type: 'select', label: 'Ablauf', required: true, options: PROZESSE, admin: { width: '25%', ...nurLesen } },
      ],
    },
    {
      // Telefontermin (E-57): technisch der Ablauf „Termin mit Anzahlung“, aber ohne Online-Anzahlung.
      // Nur Anzeige, nicht gespeichert (virtuell, keine Migration).
      name: 'telefonterminHinweis',
      type: 'text',
      label: 'Telefontermin',
      virtual: true,
      admin: {
        readOnly: true,
        condition: (data) => (data?.daten as Record<string, unknown> | null | undefined)?.telefonisch === true,
      },
      hooks: {
        afterRead: [
          ({ siblingData }) =>
            (siblingData?.daten as Record<string, unknown> | null | undefined)?.telefonisch === true
              ? 'Telefonisch vereinbart: ohne Online-Anzahlung und ohne Zustimmungen aus dem Assistenten.'
              : null,
        ],
      },
    },
    {
      // Fahrzeugklasse der gemeinsamen Fahrzeugschlüssel-Anfrage (FA-KERN-02B), aus daten.klasse. Nur Anzeige,
      // nicht gespeichert (virtuell, keine Migration). Gespeichert und filterbar ist daten.klasse: Über der Liste
      // stehen fertige Filter je Klasse (VorgaengeWerkzeuge, „Anfragen nach Fahrzeugklasse“, klassenFilter).
      name: 'fahrzeugklasse',
      type: 'text',
      label: 'Fahrzeugklasse',
      virtual: true,
      admin: {
        readOnly: true,
        condition: (data) => fahrzeugklasseText(data?.daten as Record<string, unknown> | null | undefined) !== null,
      },
      hooks: {
        afterRead: [({ siblingData }) => fahrzeugklasseText(siblingData?.daten as Record<string, unknown> | null | undefined)],
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      required: true,
      defaultValue: 'neu',
      index: true,
      options: VORGANG_STATUS,
      admin: { position: 'sidebar' },
    },
    {
      // Auftragsweg (FA-KERN-03, A-049): vom Server bei der Buchung gesetzt; Änderung nur mit Begründung.
      name: 'auftragsweg',
      type: 'select',
      label: 'Auftragsweg',
      index: true,
      options: AUFTRAGSWEG_OPTIONEN,
      admin: {
        position: 'sidebar',
        description:
          'Hauptzentrale und Eigenbereich: Anzahlung, Rest beim Termin. Partnernetzwerk: Gesamtbetrag vor der Vermittlung. '
          + 'Ändern nur mit Begründung (steht danach in den Notizen).',
      },
    },
    {
      name: 'auftragswegGrund',
      type: 'text',
      label: 'Begründung für den geänderten Auftragsweg',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.bereich === 'autoschluessel' || Boolean(data?.auftragsweg),
        description: 'Pflicht, wenn Sie den Auftragsweg ändern. Wird in die Notizen übernommen und danach geleert.',
      },
    },
    {
      name: 'kundeInformieren',
      type: 'checkbox',
      label: 'Bei Statuswechsel Kunden per E-Mail informieren',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description:
          'Mail geht bei „Freigegeben“, „Nicht möglich“, „Wartet auf Kunde“, „Terminiert“, „Versendet“ '
          + 'und „Storniert“. Bei Schlüsseln nach Vorlage enthält die Freigabe Preis, Zahlungslink und '
          + 'ggf. die Einsendeanweisung. '
          + 'Haken entfernen, um diesen einen Wechsel still zu speichern.',
      },
    },
    {
      name: 'nachrichtAnKunde',
      type: 'textarea',
      // Eigener Name, damit er nicht mit dem Knopf „Nachricht an den Kunden“ (FA-KERN-05) verwechselt wird.
      label: 'Zusatz zur Statusmail',
      admin: {
        position: 'sidebar',
        description:
          'Optional. Wird in die E-Mail zur nächsten Statusänderung übernommen und danach geleert. '
          + 'Der Text steht danach mit der ganzen Mail im Reiter „E-Mails“.',
      },
    },
    {
      // Freie Nachricht mit Betreff und Text, auf Wunsch aus einer Vorlage (FA-KERN-05).
      name: 'kundenNachricht',
      type: 'ui',
      admin: { position: 'sidebar', components: { Field: '/payload/components/KundenNachricht#KundenNachricht' } },
    },
    {
      name: 'bestaetigungSenden',
      type: 'ui',
      admin: { position: 'sidebar', components: { Field: '/payload/components/BestaetigungSenden#BestaetigungSenden' } },
    },
    {
      // Storno einer Zahlung, die eingegangen ist: Entscheidung zur Erstattung ist Pflicht (FA-KERN-05).
      name: 'storno',
      type: 'group',
      label: 'Storno: Erstattung',
      admin: {
        position: 'sidebar',
        condition: (data) => {
          const zahlung = (data?.zahlung as { status?: string } | undefined)?.status;
          return zahlung === 'bezahlt' || zahlung === 'teilweise-erstattet' || Boolean((data?.storno as { entscheidung?: string } | undefined)?.entscheidung);
        },
        description:
          'Vor dem Stornieren einer bezahlten Zahlung wählen. Bei „ganz“ oder „teilweise“ die Erstattung im Reiter „Zahlung“ '
          + 'eintragen, bei „keine“ den Grund. Nach dem Storno sind Entscheidung und Grund fest.',
      },
      fields: [
        { name: 'entscheidung', type: 'select', label: 'Erstattung beim Storno', options: [...STORNO_ENTSCHEIDUNGEN] },
        {
          name: 'grund',
          type: 'text',
          label: 'Grund ohne Erstattung',
          admin: { condition: (_data, sib) => sib?.entscheidung === 'keine' },
        },
        { name: 'entschiedenAm', type: 'date', label: 'Entschieden am', admin: { ...nurLesen, ...zeitpunkt }, ...systemFeld },
        { name: 'entschiedenVon', type: 'text', label: 'Entschieden von', admin: nurLesen, ...systemFeld },
      ],
    },
    {
      // Vorgangsblatt zum Drucken / als PDF speichern (Leitfaden Kap. 11 und 17).
      name: 'vorgangsblatt',
      type: 'ui',
      admin: { position: 'sidebar', components: { Field: '/payload/components/VorgangsblattKnopf#VorgangsblattKnopf' } },
    },
    {
      name: 'terminVerschieben',
      type: 'ui',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.art === 'termin',
        components: { Field: '/payload/components/TerminVerschieben#TerminVerschieben' },
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Übersicht',
          fields: [
            {
              name: 'zusammenfassung',
              type: 'array',
              label: 'Angaben des Kunden',
              admin: nurLesen,
              fields: [
                { name: 'titel', type: 'text', label: 'Abschnitt' },
                {
                  name: 'zeilen',
                  type: 'array',
                  label: 'Zeilen',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'label', type: 'text', label: 'Angabe', admin: { width: '40%' } },
                        { name: 'wert', type: 'text', label: 'Wert', admin: { width: '60%' } },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'dateien',
              type: 'relationship',
              relationTo: 'kundendateien',
              hasMany: true,
              label: 'Hochgeladene Dateien',
              admin: nurLesen,
              ...systemFeld,
            },
            {
              // Dateien mit ihrem Steckplatz und Hinweis auf fehlende Pflicht-Steckplätze (FA-KERN-02).
              // Nur Anzeige, nicht gespeichert (virtuell, keine Migration).
              name: 'unterlagenSteckplaetze',
              type: 'textarea',
              label: 'Unterlagen nach Steckplatz',
              virtual: true,
              admin: {
                readOnly: true,
                condition: (data) => steckplatzUebersicht(data) !== null,
              },
              hooks: { afterRead: [({ siblingData }) => steckplatzUebersicht(siblingData)] },
            },
            {
              name: 'termin',
              type: 'group',
              label: 'Termin',
              admin: { condition: (data) => data?.art === 'termin' },
              // Nur über „Termin verschieben“ (mit Belegungsprüfung) änderbar.
              ...systemFeld,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'datum', type: 'text', label: 'Datum', admin: { width: '25%', ...nurLesen } },
                    { name: 'uhrzeit', type: 'text', label: 'Uhrzeit', admin: { width: '25%', ...nurLesen } },
                    { name: 'dauerMinuten', type: 'number', label: 'Dauer (Minuten)', admin: { width: '25%', ...nurLesen } },
                    {
                      name: 'ort',
                      type: 'select',
                      label: 'Ort',
                      options: [
                        // Erg. Leitfaden §1: online immer Werkstatt; beim Kunden nur nach Prüfung (Telefontermin).
                        { label: 'Werkstatt', value: 'werkstatt' },
                        { label: 'Beim Kunden (nach Prüfung)', value: 'vor-ort' },
                      ],
                      admin: { width: '25%', ...nurLesen },
                    },
                  ],
                },
              ],
            },
            {
              name: 'zustimmungen',
              type: 'group',
              label: 'Zustimmungen des Kunden',
              admin: { ...nurLesen, description: 'So beim Absenden bestätigt. Nicht änderbar.' },
              ...systemFeld,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'agb', type: 'checkbox', label: 'AGB', admin: { width: '33%' } },
                    { name: 'widerrufsbelehrung', type: 'checkbox', label: 'Widerrufsbelehrung', admin: { width: '33%' } },
                    { name: 'vorzeitigerBeginn', type: 'checkbox', label: 'Beginn vor Ende der Widerrufsfrist', admin: { width: '34%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'sonderanfertigung', type: 'checkbox', label: 'Sonderanfertigung (kein Widerruf)', admin: { width: '33%' } },
                    { name: 'anzahlung', type: 'checkbox', label: 'Anzahlung', admin: { width: '33%' } },
                    { name: 'berechtigung', type: 'checkbox', label: 'Berechtigung', admin: { width: '34%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'am', type: 'date', label: 'Bestätigt am', admin: { width: '50%', ...zeitpunkt } },
                    { name: 'fassung', type: 'text', label: 'Stand der Rechtstexte', admin: { width: '50%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Freigabe',
          // Foto-Freigabe (Erg. Leitfaden §2): nur bei Schlüsseln nach Vorlage.
          admin: { condition: (data) => data?.bereich === 'schluessel-nach-vorlage' },
          description:
            'Ergebnis der Foto-Prüfung: Ablauf eingegangen → geprüft → freigegeben / Rückfrage („Wartet auf Kunde“) '
            + '/ nicht möglich → Bestellung. Eine Freigabe ist noch keine Fertigungszusage. '
            + 'Preis eintragen und Status „Freigegeben“ setzen: Die Zahlung wird angelegt, der Kunde erhält per Mail '
            + 'Preis und persönlichen Zahlungslink (und, wenn angehakt, die Einsendeanweisung an die Werkstatt). '
            + 'Mit der Zahlung erteilt er den Auftrag; der Status springt dann auf „In Fertigung“. '
            + 'Ohne Preis geht die Freigabe ohne Zahlungslink hinaus — wird der Preis später eingetragen, folgt die Mail mit Link.',
          fields: [
            {
              name: 'freigabe',
              type: 'group',
              label: 'Freigabe',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'preisCent', type: 'number', label: 'Preis (Cent)', min: 0, admin: { width: '34%', step: 1, description: 'Betrag, den der Kunde über den Zahlungslink zahlt — inklusive Umsatzsteuer und, falls angefallen, Versand. In Cent (24,90 € = 2490).' } },
                    {
                      name: 'einsendenNoetig',
                      type: 'checkbox',
                      label: 'Originalschlüssel einsenden',
                      // Bei einer Einsendung (E6-OPUS-02) liegt das Original schon vor.
                      admin: { width: '33%', condition: (daten) => (daten?.daten as Record<string, unknown> | undefined)?.quelle !== 'einsenden' },
                    },
                    { name: 'freigegebenAm', type: 'date', label: 'Freigegeben am', admin: { width: '33%', ...nurLesen, ...zeitpunkt }, ...systemFeld },
                  ],
                },
                {
                  // Einsende-Varianten (A-050): Der Sonderfall (Einschreiben Wert) erscheint dem Kunden nur mit dieser Freigabe.
                  name: 'sonderfallVersand',
                  type: 'checkbox',
                  label: 'Sonderfall-Versand freigeben (Einschreiben Wert)',
                  admin: { description: 'Nur für geeignete Sonderfälle. Einlieferung nur in der Filiale; ob ein Schlüssel als Wertgegenstand gilt, ist mit der Post zu klären.' },
                },
                {
                  name: 'hinweis',
                  type: 'textarea',
                  label: 'Hinweis an den Kunden',
                  admin: { description: 'Erscheint in der Mail zur Freigabe bzw. als Begründung bei „Nicht möglich“.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Vermittlung',
          admin: { condition: (data) => data?.art !== 'partner' },
          description: 'Nur ausfüllen, wenn der Auftrag an einen Partnerbetrieb vermittelt wird.',
          fields: [
            {
              // Warnung, wenn der zugeordnete Partnerbetrieb pausiert, gesperrt oder beendet ist (FA-07-19).
              // Nur Anzeige, nicht gespeichert (virtuell, keine Migration).
              name: 'partnerWarnung',
              type: 'textarea',
              label: 'Partnerbetrieb nicht verfügbar',
              virtual: true,
              access: { read: feldNurTeam, create: () => false, update: () => false },
              admin: { readOnly: true, condition: (data) => Boolean(data?.partnerWarnung) },
              hooks: { afterRead: [partnerWarnungFeld] },
            },
            {
              // Hinweis bis zur Nachricht „Ihr ausführender Betrieb“ (FA-07-03, Zusatz 8). Kein automatischer Versand.
              // Nur Anzeige, nicht gespeichert (virtuell, keine Migration).
              name: 'betriebHinweis',
              type: 'textarea',
              label: 'Ausführenden Betrieb mitteilen',
              virtual: true,
              access: { read: feldNurTeam, create: () => false, update: () => false },
              admin: { readOnly: true, condition: (data) => Boolean(data?.betriebHinweis) },
              hooks: { afterRead: [betriebHinweisFeld] },
            },
            {
              name: 'vermittlung',
              type: 'group',
              label: 'Vermittlung',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'status',
                      type: 'select',
                      label: 'Stand der Vermittlung',
                      options: VERMITTLUNG_STATUS,
                      index: true,
                      admin: { width: '40%', description: 'Leer = keine Vermittlung.' },
                    },
                    {
                      // Altfeld (FA-07-01, Zusatz 9): Verweis auf den Bewerbungs-Vorgang aus der Zeit vor der Sammlung
                      // Partnerbetriebe. Nur lesbar, ausgeblendet, sobald ein Partnerbetrieb gesetzt ist; Daten bleiben.
                      // Auch über REST und Local API nicht beschreibbar (Feldrecht); Server-Code mit overrideAccess
                      // behält den gespeicherten Wert.
                      name: 'partner',
                      type: 'relationship',
                      relationTo: 'vorgaenge',
                      label: 'Bewerbung (alt)',
                      filterOptions: { art: { equals: 'partner' } },
                      access: { create: () => false, update: () => false },
                      admin: {
                        width: '40%',
                        readOnly: true,
                        condition: (_data, siblingData) => !siblingData?.partnerbetrieb,
                        description: 'Früherer Verweis auf die Bewerbung des Partners. Bitte den Partnerbetrieb darunter wählen.',
                      },
                    },
                    { name: 'provisionCent', type: 'number', label: 'Provision (Cent)', min: 0, admin: { width: '20%', step: 1 } },
                  ],
                },
                {
                  // Verweis auf den Partnerbetrieb (FA-KERN-03), zusätzlich zur Bewerbung. Nur freigeschaltete
                  // Betriebe sind wählbar; welcher passt, zeigt die Vorschlagsliste darunter. Das Team entscheidet.
                  name: 'partnerbetrieb',
                  type: 'relationship',
                  relationTo: 'partnerbetriebe',
                  label: 'Partnerbetrieb (Sammlung Partnerbetriebe)',
                  // Wählbar sind nur freigeschaltete Betriebe (FA-07-19). Der gespeicherte bleibt gültig, auch wenn er
                  // inzwischen pausiert, gesperrt oder beendet ist, damit ein laufender Auftrag gespeichert und
                  // ausgezahlt werden kann. Vermitteln geht nur an freigeschaltete (Hook `vermittlungVorAenderung`).
                  filterOptions: partnerbetriebAuswahl,
                  admin: {
                    description:
                      'Wählbar sind nur freigeschaltete Partnerbetriebe. Bei mehreren passenden entscheidet das Team. '
                      + 'Ein inzwischen pausierter oder gesperrter Betrieb bleibt nur stehen, damit der laufende Auftrag geklärt und abgerechnet werden kann.',
                  },
                },
                {
                  // Nur Anzeige, nicht gespeichert (virtuell, keine Migration).
                  name: 'partnerVorschlaege',
                  type: 'textarea',
                  label: 'Passende Partnerbetriebe (Vorschlag)',
                  virtual: true,
                  admin: { readOnly: true, condition: (_data, siblingData) => Boolean(siblingData?.partnerVorschlaege) },
                  hooks: { afterRead: [partnerVorschlaege] },
                },
                {
                  // Auftragsart der Vermittlung (FA-KERN-04): Der Partner muss sie übernehmen. Bei Autoschlüsseln
                  // setzt der Server die Auftragsart aus der gebuchten Leistung, sonst „Autoschlüssel allgemein“,
                  // wenn nichts gewählt ist (FA-PLATTFORM-01B, Zusatz 7).
                  name: 'auftragsart',
                  type: 'select',
                  label: 'Auftragsart',
                  options: AUFTRAGSARTEN,
                  admin: { description: 'Nur Partnerbetriebe mit dieser Auftragsart können den Auftrag bekommen.' },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'gesamtCent',
                      type: 'number',
                      label: 'Gesamtbetrag (Cent)',
                      min: 0,
                      admin: { width: '34%', step: 1, description: 'Vorschlag aus der Zahlung. Mit „ausgeführt“ festgeschrieben.' },
                    },
                    {
                      name: 'plattformanteilCent',
                      type: 'number',
                      label: 'Plattformanteil (Cent)',
                      min: 0,
                      admin: {
                        width: '33%',
                        step: 1,
                        description: 'Vorschlag aus der Provision des Partnerbetriebs, von Hand änderbar. Mit „ausgeführt“ festgeschrieben.',
                      },
                    },
                    { name: 'partnerbetragCent', type: 'number', label: 'Partnerbetrag (Cent, berechnet)', admin: { width: '33%', ...nurLesen } },
                  ],
                },
                { name: 'anteilHinweis', type: 'text', label: 'Hinweis zum Plattformanteil', admin: { ...nurLesen, condition: (_d, sib) => Boolean(sib?.anteilHinweis) } },
                {
                  type: 'row',
                  fields: [
                    { name: 'festgeschriebenAm', type: 'date', label: 'Beträge festgeschrieben am', admin: { width: '34%', ...nurLesen, ...zeitpunkt }, ...systemFeld },
                    { name: 'bestaetigungGesendetAm', type: 'date', label: 'Bitte um Bestätigung gesendet am', admin: { width: '33%', ...nurLesen, ...zeitpunkt }, ...systemFeld },
                    { name: 'kundeBestaetigtAm', type: 'date', label: 'Kunde bestätigt am', admin: { width: '33%', ...nurLesen, ...zeitpunkt }, ...systemFeld },
                  ],
                },
                {
                  name: 'teamBestaetigungGrund',
                  type: 'textarea',
                  label: 'Bestätigung durch das Team',
                  admin: {
                    description:
                      'Nur ausfüllen, wenn der Kunde nicht bestätigt und das Team die Ausführung anders belegt hat (etwa Anruf, Foto). '
                      + 'Pflicht, um ohne Kundenbestätigung zur Auszahlung freizugeben.',
                  },
                },
                { name: 'notiz', type: 'textarea', label: 'Notiz zur Vermittlung', admin: { description: 'Nur für das Team sichtbar.' } },
                // Einmal-Schlüssel der Kundenbestätigung: nur der Hash, nie lesbar oder im Backend änderbar.
                { name: 'bestaetigungHash', type: 'text', admin: { hidden: true }, access: { read: () => false, update: () => false } },
              ],
            },
            {
              // Angaben des Teams zum nächsten Wechsel der Zuordnung (FA-PLATTFORM-01B). Gelten nur für dieses eine
              // Speichern und kommen in den Lead-Verlauf; danach leert der Server die Gruppe.
              name: 'zuordnung',
              type: 'group',
              label: 'Angaben zum Wechsel der Zuordnung',
              access: { read: feldNurTeam, create: feldNurTeam, update: feldNurTeam },
              admin: {
                condition: (data) => Boolean((data?.vermittlung as { partnerbetrieb?: unknown } | undefined)?.partnerbetrieb),
                description: 'Nur beim Schritt zurück oder beim Wechsel des Partnerbetriebs ausfüllen. Ohne Angabe gilt „zurückgezogen“.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'rueckgabe', type: 'select', label: 'Warum', options: [...LEAD_RUECKGABEN], admin: { width: '40%' } },
                    { name: 'notiz', type: 'text', label: 'Notiz für den Lead-Verlauf', admin: { width: '60%' } },
                  ],
                },
              ],
            },
            {
              // Lead-Verlauf (FA-22-41): welcher Lead welchem Partner angeboten oder zugeteilt wurde. Schreibt nur der
              // Server bei jedem Wechsel der Zuordnung; von Hand nicht änderbar.
              name: 'leadVerlauf',
              type: 'array',
              label: 'Lead-Verlauf (angeboten an)',
              labels: { singular: 'Eintrag', plural: 'Einträge' },
              access: { read: feldNurTeam, create: () => false, update: () => false },
              admin: { ...nurLesen, description: 'Jeder Wechsel der Zuordnung mit Partner, Zeitpunkt, wer, Ergebnis und Notiz.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    // Nicht Pflicht in der Datenbank: Löscht der Inhaber einen Betrieb endgültig, bleibt der Eintrag ohne Verweis stehen.
                    { name: 'partnerbetrieb', type: 'relationship', relationTo: 'partnerbetriebe', label: 'Partnerbetrieb', admin: { width: '30%' } },
                    { name: 'am', type: 'date', label: 'Zeitpunkt', required: true, admin: { width: '25%', ...zeitpunkt } },
                    { name: 'von', type: 'text', label: 'Wer', admin: { width: '20%' } },
                    { name: 'ergebnis', type: 'select', label: 'Ergebnis', required: true, options: [...LEAD_ERGEBNISSE], admin: { width: '25%' } },
                  ],
                },
                { name: 'notiz', type: 'text', label: 'Notiz' },
              ],
            },
            {
              // Partnerauszahlung (FA-KERN-04). Der Stand folgt der Vermittlung; eine Erstattung sperrt ihn.
              name: 'auszahlung',
              type: 'group',
              label: 'Auszahlung an den Partner',
              admin: { condition: (data) => Boolean((data?.vermittlung as { status?: string } | undefined)?.status) },
              fields: [
                {
                  // Nur Anzeige, nicht gespeichert (virtuell, keine Migration).
                  name: 'aktiverWeg',
                  type: 'text',
                  label: 'Weg der Auszahlung',
                  virtual: true,
                  admin: { readOnly: true },
                  hooks: { afterRead: [() => aktiverAuszahlungswegText()] },
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'stand', type: 'select', label: 'Auszahlungsstand', index: true, options: AUSZAHLUNG_STAND, admin: { width: '25%', ...nurLesen } },
                    { name: 'freigegebenAm', type: 'date', label: 'Freigegeben am', admin: { width: '25%', ...nurLesen, ...zeitpunkt }, ...systemFeld },
                    { name: 'freigegebenVon', type: 'text', label: 'Freigegeben von', admin: { width: '25%', ...nurLesen }, ...systemFeld },
                    { name: 'ausgezahltAm', type: 'date', label: 'Ausgezahlt am', admin: { width: '25%', ...zeitpunkt } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'weg',
                      type: 'select',
                      label: 'Weg',
                      options: [
                        { label: 'Überweisung', value: 'ueberweisung' },
                        { label: 'Zahlungsdienst', value: 'zahlungsdienst' },
                      ],
                      admin: { width: '34%' },
                    },
                    {
                      name: 'referenz',
                      type: 'text',
                      label: 'Beleg oder Referenz',
                      admin: { width: '66%', description: 'Bei Überweisung Pflicht für „ausgezahlt“ (etwa Buchungstext oder Belegnummer).' },
                    },
                  ],
                },
                { name: 'notiz', type: 'textarea', label: 'Notiz zur Auszahlung' },
              ],
            },
          ],
        },
        {
          label: 'Positionen',
          admin: { condition: (data) => data?.art === 'bestellung' },
          description: 'Beim Bestellen festgeschrieben — spätere Preisänderungen ändern diese Angaben nicht.',
          fields: [
            {
              name: 'positionen',
              type: 'array',
              label: 'Positionen',
              labels: { singular: 'Position', plural: 'Positionen' },
              admin: nurLesen,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'bezeichnung', type: 'text', label: 'Artikel', required: true, admin: { width: '40%' } },
                    { name: 'kennung', type: 'text', label: 'Kennung', required: true, index: true, admin: { width: '20%' } },
                    {
                      name: 'art',
                      type: 'select',
                      label: 'Art',
                      required: true,
                      options: [
                        { label: 'Schlüssel nach Code', value: 'code-schluessel' },
                        { label: 'Gleichschließende Zylinder', value: 'zylinder-schliessung' },
                        { label: 'Standardartikel', value: 'standard' },
                      ],
                      admin: { width: '40%' },
                    },
                  ],
                },
                { name: 'details', type: 'textarea', label: 'Angaben' },
                {
                  type: 'row',
                  fields: [
                    { name: 'menge', type: 'number', label: 'Menge', required: true, admin: { width: '20%' } },
                    { name: 'einzelpreisCent', type: 'number', label: 'Einzelpreis (Cent)', required: true, admin: { width: '30%' } },
                    { name: 'summeCent', type: 'number', label: 'Summe (Cent)', required: true, admin: { width: '30%' } },
                    { name: 'steuersatz', type: 'number', label: 'USt. %', required: true, admin: { width: '20%' } },
                  ],
                },
              ],
            },
            {
              name: 'summen',
              type: 'group',
              label: 'Summen',
              admin: nurLesen,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'artikelCent', type: 'number', label: 'Artikel (Cent)', admin: { width: '25%' } },
                    { name: 'versandCent', type: 'number', label: 'Versand (Cent)', admin: { width: '25%' } },
                    { name: 'gesamtCent', type: 'number', label: 'Gesamt (Cent)', admin: { width: '25%' } },
                    { name: 'steuerCent', type: 'number', label: 'Enthaltene USt. (Cent)', admin: { width: '25%' } },
                  ],
                },
                { name: 'versandart', type: 'text', label: 'Versandart' },
              ],
            },
            {
              // Korrekturpositionen (FA-KERN-05): Positionen und Summen bleiben festgeschrieben, eine Korrektur ist
              // ein eigener Beleg mit Betrag, Grund, Datum und Bearbeiter. Nicht änderbar, nicht löschbar.
              name: 'korrekturen',
              type: 'array',
              label: 'Korrekturpositionen',
              labels: { singular: 'Korrektur', plural: 'Korrekturen' },
              admin: {
                description:
                  'Für eine Änderung nach der Bestellung, etwa Nachlass oder Zusatzleistung. Betrag in Cent, plus oder minus '
                  + '(5,00 € Nachlass = -500). Eine gespeicherte Korrektur bleibt stehen; berichtigt wird mit einer weiteren Korrektur.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'betragCent', type: 'number', label: 'Betrag (Cent, plus oder minus)', required: true, admin: { width: '25%', step: 1 } },
                    { name: 'grund', type: 'text', label: 'Grund', required: true, admin: { width: '35%' } },
                    { name: 'am', type: 'date', label: 'Datum', admin: { width: '20%', ...nurLesen, ...zeitpunkt }, ...systemFeld },
                    { name: 'von', type: 'text', label: 'Wer', admin: { width: '20%', ...nurLesen }, ...systemFeld },
                  ],
                },
              ],
            },
            {
              // Nur Anzeige, nicht gespeichert (virtuell, keine Migration).
              name: 'summeNachKorrektur',
              type: 'text',
              label: 'Summe nach Korrektur',
              virtual: true,
              admin: { readOnly: true, condition: (data) => Array.isArray(data?.korrekturen) && data.korrekturen.length > 0 },
              hooks: {
                afterRead: [
                  ({ data }) =>
                    korrekturText(
                      (data?.summen as { gesamtCent?: number | null } | undefined)?.gesamtCent,
                      data?.korrekturen as Array<{ betragCent?: number | null }> | undefined,
                    ),
                ],
              },
            },
          ],
        },
        {
          label: 'Versand',
          // Auch bei „Schlüssel nach Vorlage“ (Foto-Anfrage, Einsendung): Die Schlüssel gehen per Post zurück (G-25).
          admin: { condition: (data) => data?.art === 'bestellung' || (data?.art === 'anfrage' && data?.bereich === 'schluessel-nach-vorlage') },
          fields: [
            {
              name: 'versand',
              type: 'group',
              label: 'Sendung',
              admin: { description: 'Nach dem Versand eintragen — die Sendungsnummer erscheint in der Mail an den Kunden.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'dienstleister', type: 'select', label: 'Versanddienstleister', options: VERSANDDIENSTLEISTER, admin: { width: '40%' } },
                    { name: 'sendungsnummer', type: 'text', label: 'Sendungsnummer', admin: { width: '60%' } },
                  ],
                },
              ],
            },
            {
              // Sendung des Kunden zur Werkstatt (FA-SHOP-03B), getrennt von der Rücksendung oben.
              name: 'einsendeSendung',
              type: 'group',
              label: 'Sendung des Kunden zur Werkstatt',
              admin: {
                condition: (data) => data?.art === 'anfrage' && data?.bereich === 'schluessel-nach-vorlage',
                description:
                  'Die Nummer trägt der Kunde auf seiner Vorgangsseite ein; das Team kann sie hier nachtragen oder berichtigen. '
                  + 'Sie erscheint auf der Vorgangsseite, im Vorgangsblatt und in den Statusmails zu Termin, Versand und Storno. '
                  + 'Die Rücksendung an den Kunden steht oben unter „Sendung“.',
              },
              hooks: {
                // Nachtragen oder Berichtigen im Backend (`req.user`): Zeitpunkt und „Team“ setzen, Eintrag im Verlauf.
                // Die Kundenaktion schreibt über die Local API ohne Benutzer und setzt beides selbst.
                beforeChange: [
                  ({ value, previousValue, req, data, originalDoc, operation }) => {
                    if (operation !== 'update' || !req.user || req.context?.sm24System) return value;
                    // Nur an Vorgängen, die eine Einsendung haben können (dieselbe Bedingung wie die Anzeige der Gruppe):
                    // Anderswo läuft die Feldprüfung nicht, dort bleibt der gespeicherte Stand.
                    const art = data?.art ?? originalDoc?.art;
                    const bereich = data?.bereich ?? originalDoc?.bereich;
                    if (art !== 'anfrage' || bereich !== 'schluessel-nach-vorlage') return previousValue ?? {};
                    const daten = (data?.daten ?? originalDoc?.daten) as Record<string, unknown> | null | undefined;
                    const jetzt = new Date().toISOString();
                    const aenderung = teamSendungAenderung(value, previousValue, jetzt, daten?.versand);
                    if (!aenderung) return value;
                    if (aenderung.verlauf && data) {
                      data.verlauf = [...(data.verlauf ?? originalDoc?.verlauf ?? []), { am: jetzt, von: 'team', text: aenderung.verlauf }];
                    }
                    return aenderung.gruppe;
                  },
                ],
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'sendungsnummer',
                      type: 'text',
                      label: 'Sendungsnummer zur Werkstatt',
                      maxLength: SENDUNGSNUMMER_MAX * 2,
                      admin: { width: '40%' },
                      validate: (wert: string | null | undefined) =>
                        !wert || bereinigeSendungsnummer(wert) !== null || 'Nur Buchstaben und Ziffern, 8 bis 40 Zeichen.',
                      // Gespeichert wie vom Kunden: ohne Leerzeichen und Bindestriche, Buchstaben groß.
                      // Ein ungültiger Wert bleibt stehen, damit die Prüfung oben ihn mit Meldung ablehnt.
                      hooks: { beforeChange: [({ value }) => (typeof value === 'string' && value ? (bereinigeSendungsnummer(value) ?? value) : value)] },
                    },
                    { name: 'dienstleister', type: 'select', label: 'Versanddienstleister', options: VERSANDDIENSTLEISTER, admin: { width: '30%' } },
                    { name: 'variante', type: 'select', label: 'Versandvariante', options: EINSENDE_VARIANTEN_OPTIONEN, admin: { width: '30%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'eingetragenAm', type: 'date', label: 'Eingetragen am', admin: { width: '30%', ...nurLesen, ...zeitpunkt } },
                    { name: 'eingetragenVon', type: 'select', label: 'Eingetragen von', options: AKTEURE.filter((a) => a.value !== 'system'), admin: { width: '20%', ...nurLesen } },
                    {
                      name: 'labelDatei',
                      type: 'relationship',
                      relationTo: 'interne-dateien',
                      label: 'Labeldatei',
                      admin: { width: '50%', description: 'Versandlabel oder Einlieferungsbeleg als Datei (nur für das Team).' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Kontakt',
          fields: [
            {
              // mailto: und tel: (FA-KERN-05). Nachrichten mit Verlauf: „Nachricht an den Kunden“ in der Seitenleiste.
              name: 'kontaktVerweise',
              type: 'ui',
              admin: { components: { Field: '/payload/components/KontaktVerweise#KontaktVerweise' } },
            },
            {
              name: 'kontakt',
              type: 'group',
              label: 'Kontakt',
              admin: nurLesen,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'anrede', type: 'text', label: 'Anrede', admin: { width: '20%' } },
                    { name: 'vorname', type: 'text', label: 'Vorname', required: true, admin: { width: '40%' } },
                    { name: 'nachname', type: 'text', label: 'Nachname', required: true, admin: { width: '40%' } },
                  ],
                },
                { name: 'firma', type: 'text', label: 'Firma' },
                {
                  type: 'row',
                  fields: [
                    { name: 'email', type: 'email', label: 'E-Mail', required: true, admin: { width: '50%' } },
                    { name: 'telefon', type: 'text', label: 'Telefon', required: true, admin: { width: '50%' } },
                  ],
                },
                { name: 'strasse', type: 'text', label: 'Straße und Hausnummer' },
                {
                  type: 'row',
                  fields: [
                    { name: 'plz', type: 'text', label: 'PLZ', admin: { width: '25%' } },
                    { name: 'ort', type: 'text', label: 'Ort', admin: { width: '45%' } },
                    { name: 'land', type: 'text', label: 'Land', required: true, admin: { width: '30%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Zahlung',
          fields: [
            {
              name: 'zahlung',
              type: 'group',
              label: 'Zahlung',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'umfang',
                      type: 'select',
                      label: 'Umfang',
                      options: [
                        { label: 'Anzahlung', value: 'anzahlung' },
                        { label: 'Gesamtbetrag', value: 'gesamt' },
                      ],
                      admin: { width: '25%', ...nurLesen },
                    },
                    { name: 'betragCent', type: 'number', label: 'Betrag (Cent)', admin: { width: '25%', ...nurLesen } },
                    {
                      name: 'status',
                      type: 'select',
                      label: 'Zahlungsstand',
                      options: [
                        { label: 'Offen', value: 'offen' },
                        { label: 'Bezahlt', value: 'bezahlt' },
                        { label: 'Fehlgeschlagen', value: 'fehlgeschlagen' },
                        { label: 'Erstattet', value: 'erstattet' },
                        { label: 'Teilweise erstattet', value: 'teilweise-erstattet' },
                      ],
                      admin: {
                        width: '25%',
                        description: 'Von Hand auf „Bezahlt“: Datum und Notiz setzen sich, der Kunde erhält eine Mail.',
                      },
                    },
                    { name: 'bezahltAm', type: 'date', label: 'Bezahlt am', admin: { width: '25%', ...nurLesen }, ...systemFeld },
                  ],
                },
                {
                  // Eindeutiger Stand in einem Satz, mit Betrag bei Teilerstattung (FA-KERN-05). Nur Anzeige (virtuell).
                  name: 'standText',
                  type: 'text',
                  label: 'Stand der Zahlung',
                  virtual: true,
                  admin: { readOnly: true, condition: (_data, sib) => Boolean(sib?.status) },
                  hooks: {
                    afterRead: [
                      ({ siblingData }) =>
                        zahlungsstandText({
                          status: siblingData?.status,
                          betragCent: siblingData?.betragCent,
                          erstattetCent: siblingData?.erstattetCent,
                        }),
                    ],
                  },
                },
                {
                  name: 'anbieterRef',
                  type: 'text',
                  label: 'Zahlungskennung (Stripe)',
                  index: true,
                  admin: { ...nurLesen, description: 'Kennung der Zahlung (pi_…), gesetzt beim Zahlungseingang.' },
                  ...systemFeld,
                },
                { name: 'stripeLink', type: 'ui', admin: { components: { Field: '/payload/components/StripeLink#StripeLink' } } },
                { name: 'checkoutSitzung', type: 'text', label: 'Stripe-Checkout-Sitzung', index: true, admin: nurLesen, ...systemFeld },
                {
                  type: 'row',
                  fields: [
                    { name: 'erstattetCent', type: 'number', label: 'Erstattet (Cent)', admin: { width: '50%', ...nurLesen }, ...systemFeld },
                    { name: 'ablaufAm', type: 'date', label: 'Zahlung möglich bis', admin: { width: '50%', ...nurLesen, ...zeitpunkt }, ...systemFeld },
                  ],
                },
              ],
            },
            {
              // Storno und Rückzahlung (FA-KERN-04): Das Team dokumentiert die Erstattung; der Code bewegt kein Geld.
              name: 'erstattung',
              type: 'group',
              label: 'Erstattung',
              admin: {
                description:
                  'Für bezahlte Vorgänge: Art, Betrag (Summe aller Erstattungen), Datum, Grund, Weg und Beleg eintragen. Der Zahlungsstand '
                  + 'wird „erstattet“ oder „teilweise erstattet“, bei Partneraufträgen ist die Auszahlung danach gesperrt. '
                  + 'Das Geld selbst erstatten Sie im Stripe-Dashboard, per Überweisung oder bar.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'art',
                      type: 'select',
                      label: 'Art',
                      options: [
                        { label: 'Ganz', value: 'ganz' },
                        { label: 'Teilweise', value: 'teilweise' },
                      ],
                      admin: { width: '25%' },
                    },
                    { name: 'betragCent', type: 'number', label: 'Betrag (Cent)', min: 0, admin: { width: '25%', step: 1 } },
                    { name: 'am', type: 'date', label: 'Erstattet am', admin: { width: '25%', ...zeitpunkt } },
                    { name: 'grund', type: 'text', label: 'Grund', admin: { width: '25%' } },
                  ],
                },
                {
                  // Weg und Beleg (FA-KERN-05): außerhalb des Zahlungsdienstes mit Beleg.
                  type: 'row',
                  fields: [
                    { name: 'weg', type: 'select', label: 'Weg', options: [...ERSTATTUNGS_WEGE], admin: { width: '34%' } },
                    {
                      name: 'beleg',
                      type: 'text',
                      label: 'Beleg oder Referenz',
                      admin: { width: '66%', description: 'Bei Überweisung, bar oder sonstigem Weg Pflicht (Buchungstext, Quittungsnummer).' },
                    },
                  ],
                },
                {
                  name: 'berichtigungGrund',
                  type: 'text',
                  label: 'Berichtigung: Grund',
                  admin: {
                    condition: (_data, sib) => Boolean(sib?.art),
                    description:
                      'Nur bei einem Irrtum: Grund eintragen und Betrag kleiner setzen (oder Art leeren). Geht nur bei Erstattungen '
                      + 'außerhalb des Zahlungsdienstes und ohne Vermittlung. Steht danach in den Notizen und wird geleert.',
                  },
                },
                {
                  name: 'zahlungsdienstKnopf',
                  type: 'ui',
                  admin: { components: { Field: '/payload/components/ErstattungZahlungsdienst#ErstattungZahlungsdienst' } },
                },
              ],
            },
            {
              // Gesamtpreis und Rest beim Termin (FA-KERN-03). Der Rest wird beim Speichern berechnet.
              name: 'restzahlung',
              type: 'group',
              label: 'Gesamtpreis und Rest',
              admin: {
                description:
                  'Gesamtpreis eintragen, sobald er feststeht; der Rest ist Gesamtpreis minus Online-Zahlung. '
                  + 'Bei einer Partner-Anfrage ohne Festpreis: Gesamtpreis eintragen und Status „Freigegeben“ setzen, '
                  + 'dann erhält der Kunde den persönlichen Zahlungslink über den Gesamtbetrag.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'gesamtpreisCent', type: 'number', label: 'Gesamtpreis (Cent)', min: 0, admin: { width: '25%', step: 1 } },
                    { name: 'restCent', type: 'number', label: 'Rest (Cent, berechnet)', index: true, admin: { width: '25%', ...nurLesen } },
                    { name: 'restBezahltAm', type: 'date', label: 'Rest bezahlt am', admin: { width: '25%', ...zeitpunkt } },
                    { name: 'restZahlart', type: 'select', label: 'Zahlart beim Termin', options: REST_ZAHLARTEN, admin: { width: '25%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'E-Mails',
          fields: [
            {
              name: 'mails',
              type: 'array',
              label: 'E-Mails',
              labels: { singular: 'E-Mail', plural: 'E-Mails' },
              admin: {
                ...nurLesen,
                description:
                  'Alle E-Mails zu diesem Vorgang, automatisch oder von Hand, mit Betreff und vollständigem Text. '
                  + 'Antworten des Kunden kommen in Ihr Postfach, nicht hierher.',
              },
              ...systemFeld,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'art', type: 'select', label: 'Art', required: true, options: MAIL_ARTEN, admin: { width: '30%' } },
                    { name: 'an', type: 'text', label: 'An', required: true, admin: { width: '40%' } },
                    { name: 'am', type: 'date', label: 'Zeitpunkt', required: true, admin: { width: '30%', ...zeitpunkt } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'ergebnis',
                      type: 'select',
                      label: 'Ergebnis',
                      required: true,
                      options: [
                        { label: 'Gesendet', value: 'gesendet' },
                        { label: 'Fehlgeschlagen', value: 'fehlgeschlagen' },
                        { label: 'Nicht eingerichtet', value: 'nicht-eingerichtet' },
                      ],
                      admin: { width: '30%' },
                    },
                    { name: 'anbieterId', type: 'text', label: 'Kennung beim Mailanbieter', admin: { width: '30%' } },
                    { name: 'fehler', type: 'text', label: 'Fehler', admin: { width: '40%' } },
                  ],
                },
                // Betreff und vollständiger Text (FA-KERN-05). Aufbewahrung wie der Vorgang.
                { name: 'betreff', type: 'text', label: 'Betreff' },
                { name: 'text', type: 'textarea', label: 'Text' },
              ],
            },
          ],
        },
        {
          label: 'Notizen und Verlauf',
          fields: [
            {
              name: 'notizen',
              type: 'array',
              label: 'Interne Notizen',
              labels: { singular: 'Notiz', plural: 'Notizen' },
              admin: { description: 'Nur für das Team sichtbar.' },
              fields: eintragFelder(),
            },
            {
              name: 'verlauf',
              type: 'array',
              label: 'Verlauf',
              admin: { ...nurLesen, description: 'Für den Kunden in der Statusabfrage sichtbar.' },
              ...systemFeld,
              fields: eintragFelder(),
            },
          ],
        },
      ],
    },
    // Technische Rohdaten — für die Seite nötig, im Backend ausgeblendet.
    { name: 'daten', type: 'json', admin: { hidden: true } },
    { name: 'angebot', type: 'json', admin: { hidden: true } },
    { name: 'uploads', type: 'json', admin: { hidden: true }, ...systemFeld },
    { name: 'zugriffsHash', type: 'text', admin: { hidden: true }, access: { read: () => false, update: () => false } },
  ],
};
