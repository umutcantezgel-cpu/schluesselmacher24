import type { CollectionConfig, Field, FieldAccess } from 'payload';

import { BEWERBUNG_STATUS } from '../../lib/partner/bewerbung';
import { GERAETE_ARTEN, MAX_ERFAHRUNG_JAHRE, MAX_GERAETE, MAX_RADIUS_KM } from '../../lib/partner/bewerbungsformular';
import { AUFTRAGSART_OPTIONEN } from '../../lib/partner/leistungen';
import { BESUCH_ERGEBNISSE, PRUEFLISTE_MELDUNG, PRUEFLISTE_PUNKTE, VOR_EINFUEHRUNG_TEXT } from '../../lib/partner/pruefliste';
import { feldNurInhaber, hatRolle, istTeam, papierkorbTeamLoeschenInhaber } from '../access/rollen';
import { euroFeld, kennungFeld } from '../fields/gemeinsam';
import { bewerbungUebernehmen } from '../hooks/partner-bewerbung';
import { leadUebersichtFeld, partnerbetriebNachAenderung, partnerbetriebVorAenderung, prueflisteStandFeld } from '../hooks/partner-pruefung';
import { partnervertragEndpunkte } from '../hooks/partnervertrag-pdf';

/**
 * Auftragsarten der Vermittlung (Bogen PARTNER, G-40; FA-PLATTFORM-01): die neun Leistungen des Inhabers,
 * dazu der Sammelwert für Autoschlüssel-Aufträge und die früheren Werte, damit alte Daten lesbar bleiben
 * (G6). Neu wählen lassen sich am Partnerbetrieb nur die neun (`auftragsartenPruefen`), bei Provisionen und
 * am Vorgang dazu der Sammelwert (`provisionenPruefen`, `auftragsartAmVorgangPruefen`).
 */
export const AUFTRAGSARTEN = AUFTRAGSART_OPTIONEN;

/** Neue Felder der Prüfung (FA-PLATTFORM-01B): lesen und ändern nur das Team. */
export const feldNurTeam: FieldAccess = ({ req: { user } }) => hatRolle(user, 'inhaber', 'mitarbeiter');
const nurTeam = { read: feldNurTeam, create: feldNurTeam, update: feldNurTeam };
/** Schreibt nur der Server (Hook); das Team liest. */
const nurServer = { read: feldNurTeam, create: () => false, update: () => false };
const datumTag = { date: { pickerAppearance: 'dayOnly' as const, displayFormat: 'dd.MM.yyyy' } };

/** Ein Punkt der Prüfliste: erledigt, Datum, Prüfer, Notiz (FA-07-13 bis FA-07-16). */
function prueflistePunkt(name: string, label: string, zusatz: Field[] = []): Field {
  return {
    name,
    type: 'group',
    label,
    fields: [
      {
        type: 'row',
        fields: [
          { name: 'erledigt', type: 'checkbox', label: 'Erledigt', admin: { width: '20%' } },
          { name: 'am', type: 'date', label: 'Datum', admin: { width: '30%', ...datumTag, description: 'Beim Abhaken heute, wenn leer.' } },
          { name: 'pruefer', type: 'text', label: 'Prüfer', admin: { width: '50%', description: 'Beim Abhaken Ihr Name, wenn leer.' } },
        ],
      },
      { name: 'notiz', type: 'textarea', label: 'Notiz' },
      ...zusatz,
    ],
  };
}

/**
 * Partnerbetriebe (G-39, G-40, MA-16, FA-PLATTFORM-01B): Bewerbungsstand mit Prüfpflichten und Prüfliste vor
 * der Freischaltung, Pausieren und Sperren mit Grund, Einsatzgebiet und Auftragsarten, Vertrag,
 * Abrechnungsmodell (A aktiv, B erst nach PARTNERMODELL: B), Leads des Betriebs. Provisionen sieht und ändert
 * nur der Inhaber (G13).
 */
export const Partnerbetriebe: CollectionConfig = {
  slug: 'partnerbetriebe',
  labels: { singular: 'Partnerbetrieb', plural: 'Partnerbetriebe' },
  admin: {
    group: 'Aufträge',
    useAsTitle: 'firma',
    defaultColumns: ['firma', 'ort', 'status', 'abrechnungsmodell'],
    description:
      'Freischalten erst nach Prüfung von Gewerbe, Identität und Eignung, mit unterschriebenem Vertrag und vollständiger Prüfliste '
      + 'samt Besuch vor Ort. Pausieren und Sperren nur mit Grund. Anleitung: docs/betrieb/partner-pruefen.md.',
  },
  access: { read: istTeam, create: istTeam, update: istTeam, delete: papierkorbTeamLoeschenInhaber },
  trash: true,
  endpoints: partnervertragEndpunkte,
  hooks: {
    // Bewerbung verknüpft: leere Felder aus dem Formular übernehmen (FA-PLATTFORM-01).
    beforeValidate: [bewerbungUebernehmen],
    // Auftragsarten, Prüfliste, Statusautomat mit Sperrgrund, Modell B (FA-PLATTFORM-01B).
    beforeChange: [partnerbetriebVorAenderung],
    // Pausiert, gesperrt oder beendet: laufende Leads zur Klärung markieren.
    afterChange: [partnerbetriebNachAenderung],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'firma', type: 'text', label: 'Firma', required: true, admin: { width: '50%' } },
        { name: 'ansprechpartner', type: 'text', label: 'Ansprechperson', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', label: 'E-Mail', admin: { width: '50%' } },
        { name: 'telefon', type: 'text', label: 'Telefon', admin: { width: '50%' } },
      ],
    },
    {
      // Region des Betriebs (FA-08-09): Postleitzahl und Ort des Betriebssitzes.
      type: 'row',
      fields: [
        {
          name: 'plz',
          type: 'text',
          label: 'Postleitzahl',
          admin: { width: '30%' },
          validate: (wert: unknown) => (wert === null || wert === undefined || wert === '' || /^\d{5}$/.test(String(wert)) ? true : 'Bitte fünf Ziffern.'),
        },
        { name: 'ort', type: 'text', label: 'Ort', required: true, admin: { width: '70%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          label: 'Stand',
          required: true,
          defaultValue: 'eingegangen',
          options: [...BEWERBUNG_STATUS],
          index: true,
          admin: {
            width: '50%',
            description: 'Pausiert und gesperrt: keine neue Zuordnung, laufende Leads werden zur Klärung markiert. Grund unten eintragen.',
          },
        },
        {
          name: 'abrechnungsmodell',
          type: 'select',
          label: 'Abrechnung',
          required: true,
          defaultValue: 'A',
          options: [
            { label: 'A: Partner rechnet ab, Provision per Rechnung', value: 'A' },
            // Modell des Inhabers für Plattformaufträge (FA-KERN-03, A-049); wählbar mit PARTNERMODELL_B=aktiv.
            { label: 'B: Kunde zahlt an Schlüsselmacher24, Auszahlung an den Partner', value: 'B' },
          ],
          admin: {
            width: '50%',
            description: 'B ist erst wählbar, wenn der Schalter PARTNERMODELL_B nach rechtlicher Klärung eingeschaltet ist.',
          },
        },
      ],
    },
    {
      name: 'einsatzgebiet',
      type: 'group',
      label: 'Einsatzgebiet',
      fields: [
        {
          name: 'postleitzahlen',
          type: 'text',
          label: 'Postleitzahlen',
          admin: {
            description:
              'Kommagetrennt, auch Bereiche wie 355*. Ohne Postleitzahlen keine Zuordnung: Der Umkreis wird noch nicht ausgewertet. Bitte Postleitzahlen eintragen.',
          },
        },
        { name: 'radiusKm', type: 'number', label: 'Umkreis (km)', min: 0, max: MAX_RADIUS_KM },
        {
          // Zuordnung zu Orten und Landkreisen (FA-22-40). Darf leer sein, bis die Ortsdatenbasis steht
          // (FA-PLATTFORM-03); bis dahin nur Dokumentation, die Zuordnung rechnet mit den Postleitzahlen.
          name: 'regionen',
          type: 'array',
          label: 'Orte und Landkreise',
          labels: { singular: 'Ort oder Landkreis', plural: 'Orte und Landkreise' },
          access: nurTeam,
          admin: {
            description: 'Freiwillig. Wird noch nicht ausgewertet; die Zuordnung rechnet mit den Postleitzahlen oben.',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'art',
                  type: 'select',
                  label: 'Art',
                  required: true,
                  options: [
                    { label: 'Ort', value: 'ort' },
                    { label: 'Landkreis', value: 'landkreis' },
                  ],
                  admin: { width: '25%' },
                },
                { name: 'name', type: 'text', label: 'Name', required: true, admin: { width: '45%' } },
                {
                  name: 'schluessel',
                  type: 'text',
                  label: 'Amtlicher Schlüssel',
                  admin: { width: '30%', description: 'Freiwillig: Gemeindeschlüssel (8 Ziffern) oder Kreisschlüssel (5 Ziffern).' },
                  validate: (wert: unknown) =>
                    wert === null || wert === undefined || wert === '' || /^(\d{5}|\d{8})$/.test(String(wert)) ? true : 'Bitte 5 oder 8 Ziffern.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'auftragsarten',
      type: 'select',
      label: 'Leistungen und Auftragsarten',
      hasMany: true,
      options: AUFTRAGSARTEN,
      admin: {
        description:
          'Nur Autoschlüssel und Fahrzeugschlüssel. Wählbar sind die neun Leistungen; Werte mit „früher“ bleiben lesbar, lassen sich aber nicht neu setzen.',
      },
    },
    {
      // Werkstatt und mobiler Einsatz (FA-08-12, FA-07-15); füllt die Bewerbung.
      name: 'werkstatt',
      type: 'group',
      label: 'Werkstatt und mobiler Einsatz',
      fields: [
        { type: 'row', fields: [
          {
            name: 'vorhanden',
            type: 'select',
            label: 'Feste Werkstatt',
            options: [
              { label: 'ja', value: 'ja' },
              { label: 'nein', value: 'nein' },
            ],
            admin: { width: '30%' },
          },
          { name: 'mobil', type: 'checkbox', label: 'Mobiler Einsatz beim Kunden', admin: { width: '70%' } },
        ] },
        { name: 'anschrift', type: 'text', label: 'Anschrift der Werkstatt' },
      ],
    },
    {
      // Geräte (FA-08-11, FA-07-15): Hersteller und Typ als freie Angabe (R12: nur sachlich).
      name: 'geraete',
      type: 'array',
      label: 'Geräte',
      maxRows: MAX_GERAETE,
      labels: { singular: 'Gerät', plural: 'Geräte' },
      fields: [
        { type: 'row', fields: [
          { name: 'art', type: 'select', label: 'Art', required: true, options: [...GERAETE_ARTEN], admin: { width: '34%' } },
          { name: 'hersteller', type: 'text', label: 'Hersteller', admin: { width: '33%' } },
          { name: 'typ', type: 'text', label: 'Typ', admin: { width: '33%' } },
        ] },
      ],
    },
    {
      // Erfahrung (FA-08-14, FA-07-14); füllt die Bewerbung.
      name: 'erfahrung',
      type: 'group',
      label: 'Erfahrung',
      fields: [
        { name: 'jahre', type: 'number', label: 'Jahre mit Autoschlüsseln', min: 0, max: MAX_ERFAHRUNG_JAHRE },
        { name: 'schwerpunkte', type: 'textarea', label: 'Schwerpunkte' },
        { name: 'fahrzeugabdeckung', type: 'textarea', label: 'Fahrzeugabdeckung', admin: { description: 'Marken und Baujahre laut Betrieb, freie Angabe.' } },
      ],
    },
    {
      name: 'pruefung',
      type: 'group',
      label: 'Prüfung vor der Freischaltung (MA-16)',
      fields: [
        { type: 'row', fields: [
          { name: 'gewerbeGeprueft', type: 'checkbox', label: 'Gewerbe geprüft', admin: { width: '33%' } },
          { name: 'identitaetGeprueft', type: 'checkbox', label: 'Identität geprüft', admin: { width: '33%' } },
          { name: 'eignungGeprueft', type: 'checkbox', label: 'Fachliche Eignung geprüft', admin: { width: '34%' } },
        ] },
        { name: 'notiz', type: 'textarea', label: 'Notiz zur Prüfung' },
      ],
    },
    {
      // Prüfliste vor der Freischaltung (FA-PLATTFORM-01B, FA-07-13 bis FA-07-18): je Punkt Datum, Prüfer, Notiz.
      name: 'pruefliste',
      type: 'group',
      label: 'Prüfliste vor der Freischaltung',
      access: nurTeam,
      admin: {
        description:
          'Freischalten geht erst, wenn alle Punkte erledigt sind. Der Besuch vor Ort ist Pflicht, außer „Besuch nicht möglich“ mit Grund.',
      },
      fields: [
        {
          // Nur Anzeige, nicht gespeichert (virtuell, keine Migration).
          name: 'stand',
          type: 'text',
          label: 'Stand der Prüfliste',
          virtual: true,
          admin: { readOnly: true },
          hooks: { afterRead: [prueflisteStandFeld] },
        },
        {
          name: 'vorEinfuehrung',
          type: 'checkbox',
          label: VOR_EINFUEHRUNG_TEXT[0].toUpperCase() + VOR_EINFUEHRUNG_TEXT.slice(1),
          access: nurServer,
          admin: {
            readOnly: true,
            condition: (_data, sib) => Boolean(sib?.vorEinfuehrung),
            description: 'Setzt nur die Migration. Der Betrieb bleibt freigeschaltet; nach einer Sperre gilt die volle Prüfliste.',
          },
        },
        ...PRUEFLISTE_PUNKTE.map((punkt) => prueflistePunkt(punkt.name, punkt.label)),
        {
          name: 'besuch',
          type: 'group',
          label: 'Besuch vor Ort',
          admin: { description: 'Vor der endgültigen Freischaltung nach Möglichkeit persönlich besuchen und vor Ort ansehen.' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'am', type: 'date', label: 'Besucht am', admin: { width: '30%', ...datumTag } },
                { name: 'pruefer', type: 'text', label: 'Besucht von', admin: { width: '40%' } },
                { name: 'ergebnis', type: 'select', label: 'Ergebnis', options: [...BESUCH_ERGEBNISSE], admin: { width: '30%' } },
              ],
            },
            { name: 'notiz', type: 'textarea', label: 'Notiz zum Besuch' },
            {
              name: 'fotos',
              type: 'relationship',
              relationTo: 'interne-dateien',
              hasMany: true,
              label: 'Fotos vom Besuch',
              admin: { description: 'Als interne Dateien, nur für das Team sichtbar.' },
            },
            {
              type: 'row',
              fields: [
                { name: 'nichtMoeglich', type: 'checkbox', label: 'Besuch nicht möglich', admin: { width: '30%' } },
                {
                  name: 'nichtMoeglichGrund',
                  type: 'textarea',
                  label: 'Grund',
                  admin: { width: '70%', condition: (_data, sib) => Boolean(sib?.nichtMoeglich) },
                  validate: (wert: unknown, { siblingData }: { siblingData: Record<string, unknown> }) =>
                    siblingData?.nichtMoeglich && !(typeof wert === 'string' && wert.trim()) ? PRUEFLISTE_MELDUNG.besuchOhneGrund : true,
                },
              ],
            },
          ],
        },
        prueflistePunkt('standard', 'Qualitätsstandard schriftlich', [
          {
            type: 'row',
            fields: [
              { name: 'datei', type: 'relationship', relationTo: 'interne-dateien', label: 'Datei', admin: { width: '50%' } },
              {
                name: 'vertragsverweis',
                type: 'text',
                label: 'oder Verweis auf den Vertrag',
                admin: { width: '50%', description: 'Etwa „Partnervertrag, Anlage Qualität“.' },
              },
            ],
          },
        ]),
      ],
    },
    {
      // Pausieren und Sperren (FA-07-19): Grund Pflicht, Datum und Bearbeiter setzt der Server.
      name: 'sperre',
      type: 'group',
      label: 'Pausieren oder sperren',
      access: nurTeam,
      admin: {
        description:
          'Grund eintragen und zugleich den Stand auf „Pausiert“ oder „Gesperrt“ setzen. Beim Aufheben kommt der Eintrag in die interne Notiz.',
      },
      fields: [
        { name: 'grund', type: 'textarea', label: 'Grund' },
        {
          type: 'row',
          fields: [
            { name: 'seit', type: 'date', label: 'Seit', access: nurServer, admin: { width: '50%', readOnly: true, ...datumTag } },
            { name: 'von', type: 'text', label: 'Von', access: nurServer, admin: { width: '50%', readOnly: true } },
          ],
        },
      ],
    },
    {
      name: 'vertrag',
      type: 'group',
      label: 'Vertrag',
      fields: [
        { type: 'row', fields: [
          { name: 'versendetAm', type: 'date', label: 'Versendet am', admin: { width: '50%' } },
          { name: 'unterschriebenAm', type: 'date', label: 'Unterschrieben am', admin: { width: '50%' } },
        ] },
        { name: 'datei', type: 'relationship', relationTo: 'interne-dateien', label: 'Unterschriebener Vertrag' },
      ],
    },
    {
      // Partnervertrag als PDF aus der Vorlage (E7-OPUS-01, G-39); ohne Vorlage des Anwalts ein Entwurf.
      name: 'partnervertragPdf',
      type: 'ui',
      admin: { position: 'sidebar', components: { Field: '/payload/components/PartnervertragKnopf#PartnervertragKnopf' } },
    },
    {
      name: 'provisionen',
      type: 'array',
      label: 'Provision je Auftragsart',
      access: { read: feldNurInhaber, update: feldNurInhaber, create: feldNurInhaber },
      admin: { description: 'Nur für den Inhaber sichtbar.' },
      fields: [
        { type: 'row', fields: [
          { name: 'auftragsart', type: 'select', label: 'Auftragsart', required: true, options: AUFTRAGSARTEN, admin: { width: '40%' } },
          { name: 'prozent', type: 'number', label: 'Prozent', min: 0, max: 100, admin: { width: '30%', step: 0.5 } },
          euroFeld('festbetrag', 'Fester Betrag', { admin: { width: '30%', step: 0.01 } }),
        ] },
      ],
    },
    {
      // Konto beim Zahlungsdienst (FA-KERN-04): nur für die vorbereitete Auszahlung über Stripe Connect.
      name: 'kontoKennung',
      type: 'text',
      label: 'Konto-Kennung beim Zahlungsdienst',
      admin: {
        description: 'Freiwillig. Kennung des verbundenen Kontos bei Stripe Connect (acct_…). Ohne sie zahlt das Team von Hand aus.',
      },
      validate: (wert: unknown) =>
        wert === null || wert === undefined || wert === '' || /^acct_[A-Za-z0-9]{6,64}$/.test(String(wert))
          ? true
          : 'Bitte eine Kennung im Format acct_… eintragen.',
    },
    {
      // Vorgänge dieses Partners mit offener, freigegebener oder gesperrter Auszahlung (FA-KERN-04). Nur Anzeige.
      name: 'offeneAuszahlungen',
      type: 'join',
      collection: 'vorgaenge',
      on: 'vermittlung.partnerbetrieb',
      label: 'Vorgänge mit offener Auszahlung',
      where: { 'auszahlung.stand': { in: ['offen', 'freigegeben', 'gesperrt'] } },
      defaultLimit: 50,
      admin: { allowCreate: false, defaultColumns: ['nummer', 'vermittlung.status', 'auszahlung.stand', 'vermittlung.partnerbetragCent'] },
    },
    {
      // Gegenansicht zum Lead-Verlauf (FA-22-41): alle Leads, die diesem Betrieb angeboten oder zugeteilt wurden.
      // Nur Anzeige, nicht gespeichert (virtuell, keine Migration).
      name: 'leadUebersicht',
      type: 'textarea',
      label: 'Leads dieses Betriebs (Verlauf)',
      virtual: true,
      access: { read: feldNurTeam, create: () => false, update: () => false },
      admin: { readOnly: true, description: 'Vorgangsnummer, Stand der Vermittlung und letzter Eintrag im Lead-Verlauf.' },
      hooks: { afterRead: [leadUebersichtFeld] },
    },
    {
      // Aktuell zugeordnete Leads mit Stand (Tabelle mit Verweis auf den Vorgang). Nur Anzeige.
      name: 'leads',
      type: 'join',
      collection: 'vorgaenge',
      on: 'vermittlung.partnerbetrieb',
      label: 'Aktuell zugeordnete Leads',
      defaultLimit: 50,
      admin: { allowCreate: false, defaultColumns: ['nummer', 'status', 'vermittlung.status', 'auftragsweg'] },
    },
    {
      name: 'bewerbung',
      type: 'relationship',
      relationTo: 'vorgaenge',
      label: 'Bewerbung (Vorgang)',
      filterOptions: { art: { equals: 'partner' } },
      admin: { description: 'Beim Verknüpfen füllt der Server leere Felder aus der Bewerbung.' },
    },
    { name: 'notiz', type: 'textarea', label: 'Interne Notiz' },
    kennungFeld(),
  ],
};
