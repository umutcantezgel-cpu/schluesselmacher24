import type { CollectionConfig, Field } from 'payload';

import { istInhaber, istTeam } from '../access/rollen';
import { BEREICHE, PROZESSE } from '../fields/gemeinsam';
import { bestaetigungSenden } from '../hooks/bestaetigung-senden';
import { vorgangNachAenderung, vorgangVorAenderung } from '../hooks/vorgang-benachrichtigen';

export const VORGANG_STATUS = [
  { label: 'Neu', value: 'neu' },
  { label: 'In Prüfung', value: 'in-pruefung' },
  { label: 'Geprüft', value: 'geprueft' },
  { label: 'Wartet auf Kunde', value: 'wartet-auf-kunde' },
  { label: 'In Fertigung', value: 'in-fertigung' },
  { label: 'Terminiert', value: 'terminiert' },
  { label: 'Versendet', value: 'versendet' },
  { label: 'Abgeschlossen', value: 'abgeschlossen' },
  { label: 'Storniert', value: 'storniert' },
];

const AKTEURE = [
  { label: 'Kunde', value: 'kunde' },
  { label: 'Team', value: 'team' },
  { label: 'System', value: 'system' },
];

const nurLesen = { readOnly: true };

/**
 * Felder, die nur der Server schreibt (Zahlungsdienst, Mailversand,
 * Zustimmungen aus dem Formular). Beim Speichern im Backend übernimmt Payload
 * für diese Felder den gespeicherten Wert statt des Formularstands
 * (`payload/dist/fields/hooks/beforeValidate/promise.js`, getFallbackValue) —
 * so überschreibt ein offenes Formular keine Zahlung, die inzwischen
 * eingegangen ist. Die Local API mit `overrideAccess` schreibt weiterhin.
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
  { label: 'Sonstige', value: 'sonstige' },
];

export const VERSANDDIENSTLEISTER = [
  { label: 'DHL', value: 'dhl' },
  { label: 'DPD', value: 'dpd' },
  { label: 'Deutsche Post', value: 'deutsche-post' },
  { label: 'Hermes', value: 'hermes' },
  { label: 'GLS', value: 'gls' },
  { label: 'UPS', value: 'ups' },
  { label: 'Sonstige', value: 'sonstige' },
];

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
 * Zahlungsstand und interne Notizen.
 */
export const Vorgaenge: CollectionConfig = {
  slug: 'vorgaenge',
  labels: { singular: 'Vorgang', plural: 'Vorgänge' },
  admin: {
    group: 'Aufträge',
    useAsTitle: 'nummer',
    defaultColumns: ['nummer', 'art', 'bereich', 'status', 'createdAt'],
    listSearchableFields: ['nummer', 'kontakt.email', 'kontakt.nachname', 'kontakt.firma'],
    pagination: { defaultLimit: 50 },
    description: 'Alle Bestellungen, Anfragen, Termine und Projekte. Neueste oben.',
  },
  defaultSort: '-createdAt',
  access: {
    read: istTeam,
    create: () => false,
    update: istTeam,
    delete: istInhaber,
  },
  hooks: {
    // Statusmails, Zahlung von Hand, offene Zahlungsseite beim Stornieren beenden.
    beforeChange: [vorgangVorAenderung],
    afterChange: [vorgangNachAenderung],
  },
  endpoints: [bestaetigungSenden],
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
          ],
          admin: { width: '25%', ...nurLesen },
        },
        { name: 'bereich', type: 'select', label: 'Bereich', required: true, options: BEREICHE, admin: { width: '25%', ...nurLesen } },
        { name: 'prozess', type: 'select', label: 'Ablauf', required: true, options: PROZESSE, admin: { width: '25%', ...nurLesen } },
      ],
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
      name: 'kundeInformieren',
      type: 'checkbox',
      label: 'Bei Statuswechsel Kunden per E-Mail informieren',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description:
          'Mail geht bei „Wartet auf Kunde“, „Terminiert“, „Versendet“ und „Storniert“. '
          + 'Haken entfernen, um diesen einen Wechsel still zu speichern.',
      },
    },
    {
      name: 'nachrichtAnKunde',
      type: 'textarea',
      label: 'Nachricht an den Kunden',
      admin: {
        position: 'sidebar',
        description: 'Optional. Wird in die E-Mail zur nächsten Statusänderung übernommen und danach geleert.',
      },
    },
    {
      name: 'bestaetigungSenden',
      type: 'ui',
      admin: { position: 'sidebar', components: { Field: '/payload/components/BestaetigungSenden#BestaetigungSenden' } },
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
              name: 'termin',
              type: 'group',
              label: 'Termin',
              admin: { condition: (data) => data?.art === 'termin' },
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
                        { label: 'Werkstatt', value: 'werkstatt' },
                        { label: 'Vor Ort', value: 'vor-ort' },
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
          ],
        },
        {
          label: 'Versand',
          admin: { condition: (data) => data?.art === 'bestellung' },
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
          ],
        },
        {
          label: 'Kontakt',
          fields: [
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
              admin: { ...nurLesen, description: 'Automatisch versendete E-Mails zu diesem Vorgang.' },
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
