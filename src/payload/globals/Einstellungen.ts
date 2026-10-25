import { ValidationError, type Endpoint, type GlobalBeforeValidateHook, type GlobalConfig } from 'payload';

import { einstellungenZuSeite } from '../../lib/data/payload-mapping';
import { antwortAdresse, idempotenzSchluessel, sendeVorlage, vorlagenKontext } from '../../lib/mail/versand';
import { testmail } from '../../lib/mail/vorlagen/testmail';
import { enthaeltPlatzhalter, istPlatzhalter } from '../../lib/platzhalter';
import { mailKonfiguration } from '../../lib/umgebung';
import type { Einstellungen as EinstellungenDoc } from '../../payload-types';
import { hatRolle, istInhaber, istTeam } from '../access/rollen';
import { VERSANDKLASSEN, euroFeld, zeitfensterFeld } from '../fields/gemeinsam';
import { nachGlobalAenderung } from '../hooks/revalidate';

const WOCHENTAGE = [
  { label: 'Montag', value: '1' },
  { label: 'Dienstag', value: '2' },
  { label: 'Mittwoch', value: '3' },
  { label: 'Donnerstag', value: '4' },
  { label: 'Freitag', value: '5' },
  { label: 'Samstag', value: '6' },
  { label: 'Sonntag', value: '7' },
];

export const RECHTSFORMEN = [
  { label: 'Einzelunternehmen', value: 'einzelunternehmen' },
  { label: 'Eingetragener Kaufmann (e. K.)', value: 'eingetragener-kaufmann' },
  { label: 'GmbH', value: 'gmbh' },
  { label: 'UG (haftungsbeschränkt)', value: 'ug' },
];

export const BUNDESLAENDER = [
  { label: 'Baden-Württemberg', value: 'BW' },
  { label: 'Bayern', value: 'BY' },
  { label: 'Berlin', value: 'BE' },
  { label: 'Brandenburg', value: 'BB' },
  { label: 'Bremen', value: 'HB' },
  { label: 'Hamburg', value: 'HH' },
  { label: 'Hessen', value: 'HE' },
  { label: 'Mecklenburg-Vorpommern', value: 'MV' },
  { label: 'Niedersachsen', value: 'NI' },
  { label: 'Nordrhein-Westfalen', value: 'NW' },
  { label: 'Rheinland-Pfalz', value: 'RP' },
  { label: 'Saarland', value: 'SL' },
  { label: 'Sachsen', value: 'SN' },
  { label: 'Sachsen-Anhalt', value: 'ST' },
  { label: 'Schleswig-Holstein', value: 'SH' },
  { label: 'Thüringen', value: 'TH' },
];

/** Ohne Angabe gilt die Vorgabe Einzelunternehmen — dort gibt es kein Register. */
const mitRegister = (rechtsform: unknown) => Boolean(rechtsform) && rechtsform !== 'einzelunternehmen';

/** Firmenfelder, die öffentlich erscheinen können, mit ihrer Beschriftung. */
const FIRMENFELDER: [string, string][] = [
  ['rechtlicherName', 'Rechtlicher Name'],
  ['marke', 'Markenname'],
  ['inhaber', 'Inhaber'],
  ['strasse', 'Straße'],
  ['plz', 'PLZ'],
  ['ort', 'Ort'],
  ['land', 'Land'],
  ['telefon', 'Telefon'],
  ['email', 'E-Mail'],
  ['ustId', 'USt-IdNr.'],
  ['steuernummer', 'Steuernummer'],
  ['geschaeftsfuehrung', 'Vertretungsberechtigt'],
  ['berufsbezeichnung', 'Berufsbezeichnung'],
  ['kammer', 'Kammer'],
  ['inhaltlichVerantwortlich', 'Inhaltlich verantwortlich'],
];

const STANDORTFELDER: [string, string][] = [
  ['bezeichnung', 'Standort: Bezeichnung'],
  ['strasse', 'Standort: Straße'],
  ['plz', 'Standort: PLZ'],
  ['ort', 'Standort: Ort'],
];

/** Eingetragen, aber noch Redaktions-Platzhalter („[Platzhalter: …]“, „[PLZ]“). */
const traegtPlatzhalter = (wert: unknown) =>
  typeof wert === 'string' && wert.trim() !== '' && (istPlatzhalter(wert) || enthaeltPlatzhalter(wert));

/**
 * Der Haken „Noch Platzhalter hinterlegt“ steuert, ob Impressum, Fußzeile und
 * strukturierte Daten die Firmendaten zeigen. Er lässt sich erst entfernen,
 * wenn keine Angabe mehr einen Platzhalter enthält — auch nicht beim Seed.
 */
export const firmendatenPruefen: GlobalBeforeValidateHook = ({ data, req }) => {
  const firma = (data?.firma ?? {}) as Record<string, unknown>;
  if (firma.platzhalter !== false) return data;

  const offen: string[] = [];
  for (const [feld, label] of FIRMENFELDER) {
    if (traegtPlatzhalter(firma[feld])) offen.push(label);
  }
  const standort = (firma.standort ?? {}) as Record<string, unknown>;
  for (const [feld, label] of STANDORTFELDER) {
    if (traegtPlatzhalter(standort[feld])) offen.push(label);
  }
  // Registerangaben sind beim Einzelunternehmen ausgeblendet und erscheinen nicht.
  if (mitRegister(firma.rechtsform)) {
    if (traegtPlatzhalter(firma.registergericht) || !String(firma.registergericht ?? '').trim()) offen.push('Registergericht');
    if (traegtPlatzhalter(firma.registernummer) || !String(firma.registernummer ?? '').trim()) offen.push('Registernummer');
  }

  if (offen.length > 0) {
    throw new ValidationError({
      global: 'einstellungen',
      req,
      errors: [
        {
          path: 'firma.platzhalter',
          message:
            'Der Haken „Noch Platzhalter hinterlegt“ lässt sich erst entfernen, wenn alle Angaben echt sind. '
            + `Noch offen: ${offen.join(', ')}.`,
        },
      ],
    });
  }
  return data;
};

const EIGENTEXT =
  'Wenn gefüllt, ersetzt dieser Text den eingebauten Entwurf '
  + '(z. B. Text vom Anwalt oder Rechtstexte-Dienst einfügen).';

/**
 * POST /api/globals/einstellungen/testmail — „Testmail an mich“ (nur Inhaber).
 * Empfänger ist immer die Adresse des angemeldeten Benutzers.
 */
const testmailSenden: Endpoint = {
  path: '/testmail',
  method: 'post',
  handler: async (req) => {
    const antwort = (status: number, body: Record<string, unknown>) =>
      Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
    if (!req.user) return antwort(401, { error: 'Bitte melden Sie sich an.' });
    if (!hatRolle(req.user, 'inhaber')) return antwort(403, { error: 'Nur für Inhaber.' });
    const an = (req.user as { email?: string }).email;
    if (!an) return antwort(400, { error: 'Ihr Konto hat keine E-Mail-Adresse.' });
    if (!mailKonfiguration()) return antwort(409, { error: 'Der Mailversand ist nicht eingerichtet.' });

    const doc = (await req.payload.findGlobal({ slug: 'einstellungen', depth: 0, overrideAccess: true, req })) as EinstellungenDoc;
    const settings = einstellungenZuSeite(doc);
    const jetzt = new Date().toISOString();
    const eintrag = await sendeVorlage({
      art: 'sonstige',
      an,
      inhalt: testmail({ kontext: vorlagenKontext(settings), jetzt }),
      antwortAn: antwortAdresse(settings.company),
      idempotenzSchluessel: idempotenzSchluessel('testmail', 'sonstige', String(Date.parse(jetzt))),
    });
    return eintrag.result === 'gesendet'
      ? antwort(200, { ok: true, meldung: `Testmail an ${an} gesendet.` })
      : antwort(502, { ok: false, error: `Testmail nicht gesendet (${eintrag.error ?? eintrag.result}).` });
  },
};

export const Einstellungen: GlobalConfig = {
  slug: 'einstellungen',
  label: 'Einstellungen',
  admin: { group: 'Verwaltung' },
  access: { read: istTeam, update: istInhaber },
  hooks: { beforeValidate: [firmendatenPruefen], afterChange: [nachGlobalAenderung] },
  endpoints: [testmailSenden],
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Firma',
          name: 'firma',
          description: 'Erscheint im Impressum, in der Fußzeile und in strukturierten Daten.',
          fields: [
            { name: 'platzhalter', type: 'checkbox', label: 'Noch Platzhalter hinterlegt', defaultValue: true, admin: { description: 'Haken entfernen, sobald alle Angaben echt sind.' } },
            { type: 'row', fields: [
              { name: 'rechtlicherName', type: 'text', label: 'Rechtlicher Name', required: true, admin: { width: '50%' } },
              { name: 'marke', type: 'text', label: 'Markenname', required: true, admin: { width: '50%' } },
            ] },
            { type: 'row', fields: [
              {
                name: 'rechtsform',
                type: 'select',
                label: 'Rechtsform',
                defaultValue: 'einzelunternehmen',
                options: RECHTSFORMEN,
                admin: { width: '50%' },
              },
              { name: 'inhaber', type: 'text', label: 'Inhaber', admin: { width: '50%', description: 'Vor- und Nachname, z. B. für das Impressum.' } },
            ] },
            { name: 'strasse', type: 'text', label: 'Straße und Hausnummer', required: true },
            { type: 'row', fields: [
              { name: 'plz', type: 'text', label: 'PLZ', required: true, admin: { width: '25%' } },
              { name: 'ort', type: 'text', label: 'Ort', required: true, admin: { width: '45%' } },
              { name: 'land', type: 'text', label: 'Land', required: true, defaultValue: 'Deutschland', admin: { width: '30%' } },
            ] },
            { type: 'row', fields: [
              { name: 'telefon', type: 'text', label: 'Telefon', required: true, admin: { width: '50%' } },
              {
                name: 'email',
                type: 'text',
                label: 'E-Mail',
                required: true,
                admin: { width: '50%' },
                // Solange Platzhalter hinterlegt sind, darf hier noch Platzhaltertext stehen.
                validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) =>
                  siblingData?.platzhalter || (typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                    ? true
                    : 'Bitte eine gültige E-Mail-Adresse eintragen.',
              },
            ] },
            { type: 'row', fields: [
              { name: 'ustId', type: 'text', label: 'USt-IdNr.', admin: { width: '50%' } },
              {
                name: 'steuernummer',
                type: 'text',
                label: 'Steuernummer',
                admin: { width: '50%', description: 'intern, wird nicht veröffentlicht' },
              },
            ] },
            { type: 'row', fields: [
              { name: 'registergericht', type: 'text', label: 'Registergericht', admin: { width: '50%', condition: (_, siblingData) => mitRegister(siblingData?.rechtsform) } },
              { name: 'registernummer', type: 'text', label: 'Registernummer', admin: { width: '50%', condition: (_, siblingData) => mitRegister(siblingData?.rechtsform) } },
            ] },
            { name: 'geschaeftsfuehrung', type: 'text', label: 'Vertretungsberechtigt (Geschäftsführung / Inhaber)' },
            { type: 'row', fields: [
              { name: 'berufsbezeichnung', type: 'text', label: 'Berufsbezeichnung', admin: { width: '50%', description: 'z. B. „Schlüsseldienst und Sicherheitstechnik“.' } },
              { name: 'kammer', type: 'textarea', label: 'Zuständige Kammer', admin: { width: '50%', description: 'Name und Anschrift, z. B. der Handwerkskammer.' } },
            ] },
            {
              name: 'inhaltlichVerantwortlich',
              type: 'textarea',
              label: 'Inhaltlich verantwortlich (§ 18 MStV)',
              admin: { description: 'Optional. Name und Anschrift.' },
            },
            {
              name: 'standort',
              type: 'group',
              label: 'Werkstatt / Abholung',
              admin: { description: 'Nur ausfüllen, wenn Werkstatt oder Abholung nicht am Firmensitz liegen.' },
              fields: [
                { name: 'bezeichnung', type: 'text', label: 'Bezeichnung', admin: { placeholder: 'Werkstatt und Abholung' } },
                { name: 'strasse', type: 'text', label: 'Straße und Hausnummer' },
                { type: 'row', fields: [
                  { name: 'plz', type: 'text', label: 'PLZ', admin: { width: '30%' } },
                  { name: 'ort', type: 'text', label: 'Ort', admin: { width: '70%' } },
                ] },
              ],
            },
          ],
        },
        {
          label: 'Öffnungszeiten',
          fields: [
            {
              name: 'oeffnungszeiten',
              type: 'array',
              label: 'Öffnungszeiten',
              labels: { singular: 'Tag', plural: 'Tage' },
              fields: [
                { name: 'tag', type: 'select', label: 'Wochentag', required: true, options: WOCHENTAGE },
                { ...zeitfensterFeld('zeiten', 'Geöffnet'), admin: { description: 'Leer lassen = geschlossen.' } },
              ],
            },
          ],
        },
        {
          label: 'Termine',
          name: 'buchung',
          description: 'Standardwerte für Autoschlüssel-Termine. Preisregeln können abweichen.',
          fields: [
            { type: 'row', fields: [
              { name: 'vorlaufTage', type: 'number', label: 'Vorlauf (Tage)', required: true, min: 0, max: 90, admin: { width: '33%', step: 1 } },
              { name: 'horizontTage', type: 'number', label: 'Buchbar für (Tage)', required: true, min: 7, max: 365, admin: { width: '33%', step: 1 } },
              { name: 'terminMinuten', type: 'number', label: 'Terminlänge (Minuten)', required: true, min: 15, max: 480, admin: { width: '34%', step: 15 } },
            ] },
            { type: 'row', fields: [
              euroFeld('anzahlung', 'Anzahlung', { required: true, admin: { width: '34%', step: 0.01 } }),
              euroFeld('anzahlungMin', 'Anzahlung mindestens', { required: true, admin: { width: '33%', step: 0.01 } }),
              euroFeld('anzahlungMax', 'Anzahlung höchstens', { required: true, admin: { width: '33%', step: 0.01 } }),
            ] },
            { type: 'row', fields: [
              { name: 'termineJeFenster', type: 'number', label: 'Termine je Zeitfenster', required: true, min: 1, max: 20, defaultValue: 1, admin: { width: '50%', step: 1 } },
              {
                name: 'bundesland',
                type: 'select',
                label: 'Bundesland (Feiertage)',
                defaultValue: 'HE',
                options: BUNDESLAENDER,
                admin: { width: '50%', description: 'An gesetzlichen Feiertagen dieses Landes gibt es keine Termine.' },
              },
            ] },
            zeitfensterFeld('fenster', 'Buchbare Zeitfenster'),
          ],
        },
        {
          label: 'Versand',
          fields: [
            {
              name: 'versand',
              type: 'array',
              label: 'Versandarten',
              labels: { singular: 'Versandart', plural: 'Versandarten' },
              fields: [
                { type: 'row', fields: [
                  { name: 'kennung', type: 'text', label: 'Kennung', required: true, admin: { width: '30%' } },
                  { name: 'label', type: 'text', label: 'Bezeichnung', required: true, admin: { width: '70%' } },
                ] },
                { name: 'beschreibung', type: 'textarea', label: 'Beschreibung', required: true },
                { type: 'row', fields: [
                  euroFeld('preis', 'Preis', { required: true, admin: { width: '34%', step: 0.01 } }),
                  { name: 'verfolgt', type: 'checkbox', label: 'Sendungsverfolgung', admin: { width: '33%' } },
                  { name: 'versichert', type: 'checkbox', label: 'Versichert', admin: { width: '33%' } },
                ] },
                { name: 'lieferzeit', type: 'text', label: 'Lieferzeit', admin: { description: 'z. B. „2–4 Werktage nach Fertigung“.' } },
                { name: 'produktklassen', type: 'select', label: 'Passend für', hasMany: true, required: true, options: VERSANDKLASSEN },
              ],
            },
          ],
        },
        {
          label: 'Aufbewahrung',
          name: 'aufbewahrung',
          description: 'Wie lange hochgeladene Unterlagen aufbewahrt werden (Tage).',
          fields: [
            { type: 'row', fields: [
              { name: 'fahrzeugschein', type: 'number', label: 'Fahrzeugschein', required: true, min: 1, admin: { width: '25%' } },
              { name: 'schluesselfotos', type: 'number', label: 'Schlüsselfotos', required: true, min: 1, admin: { width: '25%' } },
              { name: 'grundrisse', type: 'number', label: 'Grundrisse', required: true, min: 1, admin: { width: '25%' } },
              { name: 'projektunterlagen', type: 'number', label: 'Projektunterlagen', required: true, min: 1, admin: { width: '25%' } },
            ] },
          ],
        },
        {
          label: 'Rechtstexte',
          name: 'rechtstexte',
          description: `Eigene Fassungen der Rechtsseiten. ${EIGENTEXT}`,
          fields: [
            { name: 'agb', type: 'richText', label: 'AGB', admin: { description: EIGENTEXT } },
            { name: 'widerruf', type: 'richText', label: 'Widerrufsbelehrung', admin: { description: EIGENTEXT } },
            { name: 'datenschutz', type: 'richText', label: 'Datenschutzerklärung', admin: { description: EIGENTEXT } },
            { name: 'versandUndZahlung', type: 'richText', label: 'Versand und Zahlung', admin: { description: EIGENTEXT } },
          ],
        },
        {
          label: 'Anbindungen',
          description: 'Stand von Online-Zahlung, Mailversand und Dateiablage. Nur Anzeige — nichts zu speichern.',
          fields: [
            { name: 'anbindungen', type: 'ui', admin: { components: { Field: '/payload/components/Anbindungen#Anbindungen' } } },
          ],
        },
      ],
    },
  ],
};
