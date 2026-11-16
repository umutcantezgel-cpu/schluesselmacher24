import type {
  CollectionBeforeChangeHook,
  CollectionConfig,
  Condition,
  Field,
  FieldHook,
  PayloadRequest,
  TextField,
  TextFieldSingleValidation,
} from 'payload';

import { pruefeCodeMuster, codePasst } from '../../lib/code-pattern';
import {
  BAUJAHR_MAX,
  BAUJAHR_MIN,
  ELEKTRONIK_LABEL,
  ELEKTRONIK_UEBERNAHMEN,
  TASTEN_MAX,
  TEILEARTEN,
  TEILEART_LABEL,
  baujahrePruefen,
  fahrzeugteilLuecken,
  type TeilFeld,
} from '../../lib/data/fahrzeugteile';
import { VERFUEGBARKEITEN, VERFUEGBARKEIT_LABEL } from '../../lib/data/shop';
import { istTeam, papierkorbTeamLoeschenInhaber } from '../access/rollen';
import {
  SCHLUESSELARTEN,
  VERSANDKLASSEN,
  bildFeld,
  euroFeld,
  gpsrFeld,
  kennungFeld,
  seoFeld,
  slugFeld,
} from '../fields/gemeinsam';
import { loeschsperre } from '../hooks/loeschsperre';
import { erneuernHooks } from '../hooks/revalidate';

const istCodeSchluessel = (data: Record<string, unknown> | undefined) => data?.typ !== 'standard';

/** Auswahl der Verfügbarkeit (FA-22-10); Texte wie auf der Seite (`VERFUEGBARKEIT_LABEL`). */
export const VERFUEGBARKEIT_OPTIONEN = VERFUEGBARKEITEN.map((value) => ({ label: VERFUEGBARKEIT_LABEL[value], value }));

/**
 * System ist bei echten Codeprodukten Pflicht (FA-11-08). Geprüft wird beim Veröffentlichen
 * (Entwürfe speichert Payload ohne Prüfung). Beispiel-Einträge aus der Zeit vor A-046 sind ausgenommen.
 */
export const systemPruefen = (wert: unknown, { data }: { data?: Record<string, unknown> }) => {
  if (!istCodeSchluessel(data) || data?.beispiel) return true;
  return typeof wert === 'string' && wert.trim() ? true : 'Bitte das System eintragen, so wie der Hersteller es nennt.';
};

/** Vorschau: die öffentliche Seite des Artikels (zeigt die veröffentlichte Fassung). */
export function vorschauPfad(doc: Record<string, unknown> | null | undefined): string | null {
  const slug = typeof doc?.slug === 'string' ? doc.slug : '';
  if (!slug) return null;
  // Gleich `artikelPfad` und `codelinienPfad`; hier ohne deren Abhängigkeiten, weil die Sammlung auch im Werkzeug läuft.
  return doc?.typ === 'standard' ? `/artikel/${slug}` : `/schluessel-nach-code/${slug}`;
}

/** Adressen der Übersichtsseiten unter /schluessel-nach-code/ — kein Artikel darf sie belegen. */
const RESERVIERTE_ADRESSEN = new Set(['kategorie', 'hersteller']);
const slugPruefung = slugFeld().validate as (wert: unknown, optionen: unknown) => true | string;
const istStandardartikel = (data: Record<string, unknown> | undefined) => data?.typ === 'standard';

/*
 * Duplizieren (FA-KERN-05, FA-22-02). Payload hängt an eindeutige Textfelder sonst „ - Copy“ an: Die Adresse
 * wäre ungültig und die Kennung (Bezug von Warenkörben und Bestellungen) eine Abwandlung des Originals.
 * - Adresse: Original mit „-kopie-“ und einem kurzen Zeitstempel, damit sie eindeutig und gültig bleibt.
 * - Kennung: leer (`null`); beim Speichern übernimmt sie die neue Adresse (kennungFeld). Bestellungen des Originals
 *   verweisen weiter nur auf dessen Kennung.
 * - Stand: Die Kopie startet immer als Entwurf.
 * - Bilder: Die Kopie verweist auf dieselben Bilder der Medienablage; es entstehen keine neuen Dateien.
 */
export function kopieAdresse(slug: unknown, jetzt = Date.now()): string | undefined {
  if (typeof slug !== 'string' || !slug) return undefined;
  const zusatz = `-kopie-${jetzt.toString(36)}`;
  return `${slug.slice(0, 80 - zusatz.length).replace(/-+$/, '')}${zusatz}`;
}
const adresseBeimDuplizieren: FieldHook = ({ value }) => kopieAdresse(value);
// `null`, nicht `undefined`: Bei `undefined` behält Payload den Wert des Originals.
const kennungBeimDuplizieren: FieldHook = () => null;

/** Beim Anlegen aus einer Kopie: immer als Entwurf (Payload reicht das Original als `originalDoc` durch). */
export const kopieAlsEntwurf: CollectionBeforeChangeHook = ({ data, operation, originalDoc }) => {
  // Bei einem neuen Artikel ist `originalDoc` leer; beim Duplizieren trägt es Name und Adresse des Originals.
  if (operation === 'create' && typeof (originalDoc as { name?: unknown } | undefined)?.name === 'string') {
    data._status = 'draft';
  }
  return data;
};

function mitDuplizierHaken(feld: TextField, haken: FieldHook): TextField {
  return { ...feld, hooks: { ...feld.hooks, beforeDuplicate: [haken] } } as TextField;
}

/**
 * Beim Duplizieren reicht Payload das Original auch beim Anlegen als `originalDoc` an die Feld-Hooks. Die
 * Kennung hielte dann die des Originals fest; beim Anlegen zählt darum nur die neue Adresse.
 */
function kennungOhneOriginalBeimAnlegen(feld: TextField): TextField {
  const haken = (feld.hooks?.beforeChange ?? []).map(
    (h): FieldHook =>
      (args) => (args.operation === 'create' ? h({ ...args, originalDoc: undefined }) : h(args)),
  );
  return { ...feld, hooks: { ...feld.hooks, beforeChange: haken } } as TextField;
}

/* ---------- Gehäuse und Ersatzteile mit Fahrzeugbezug (FA-SHOP-02) ------ */

type Geschwister = Record<string, unknown> | undefined;
type PruefOptionen = { siblingData?: Geschwister; req: PayloadRequest };

const verweisId = (wert: unknown): number | string | undefined => {
  if (wert && typeof wert === 'object' && 'id' in wert) return (wert as { id: number | string }).id;
  return typeof wert === 'number' || typeof wert === 'string' ? wert : undefined;
};

/** Höchstlängen der Textfelder; eigene Prüfungen ersetzen in Payload die Längenprüfung des Feldtyps. */
export const MARKE_MAX = 60;
export const KOMPATIBILITAET_MAX = 600;

const zuLang = (wert: unknown, max: number): string | undefined =>
  typeof wert === 'string' && wert.length > max ? `Höchstens ${max} Zeichen.` : undefined;

/**
 * Marke wie im Fahrzeugkatalog (Autoschlüssel › Fahrzeugkatalog), keine zweite
 * Fahrzeugliste. Leer ist hier erlaubt (Pflicht je nach Art des Teils prüft
 * `fahrzeugteilLuecken`). Ist der Katalog noch leer (frische Datenbank), wird
 * keine Marke abgelehnt; die Länge gilt immer.
 */
export async function markeImKatalog(wert: unknown, { req }: { req: PayloadRequest }): Promise<true | string> {
  if (wert === undefined || wert === null || wert === '') return true;
  if (typeof wert !== 'string' || !wert.trim()) return 'Bitte die Marke eintragen oder das Feld leer lassen.';
  const laenge = zuLang(wert, MARKE_MAX);
  if (laenge) return laenge;
  const treffer = await req.payload.count({
    collection: 'fahrzeugreihen',
    where: { marke: { equals: wert.trim() } },
    overrideAccess: true,
    req,
  });
  if (treffer.totalDocs > 0) return true;
  const alle = await req.payload.count({ collection: 'fahrzeugreihen', overrideAccess: true, req });
  if (alle.totalDocs === 0) return true;
  return 'Diese Marke steht nicht im Fahrzeugkatalog. Bitte genau so schreiben wie dort, etwa „Volkswagen“.';
}

/** Gewählte Reihen müssen zur eingetragenen Marke gehören; ohne Marke keine Reihen. */
export async function reihenZurMarke(
  wert: unknown,
  { siblingData, req }: PruefOptionen,
): Promise<true | string> {
  const ids = (Array.isArray(wert) ? wert : wert ? [wert] : []).map(verweisId).filter((id) => id !== undefined);
  if (ids.length === 0) return true;
  const marke = typeof siblingData?.marke === 'string' ? siblingData.marke.trim() : '';
  if (!marke) return 'Bitte zuerst die Marke eintragen. Ohne Marke gilt das Teil für alle Fahrzeuge.';
  const fremde = await req.payload.count({
    collection: 'fahrzeugreihen',
    where: { and: [{ id: { in: ids } }, { marke: { not_equals: marke } }] },
    overrideAccess: true,
    trash: true,
    req,
  });
  return fremde.totalDocs === 0 ? true : `Mindestens eine Reihe gehört nicht zur Marke „${marke}“.`;
}

/** Im Backend nur Reihen der eingetragenen Marke anbieten. */
export const reihenDerMarke = ({ siblingData }: { siblingData?: unknown }) => {
  const marke = (siblingData as Geschwister)?.marke;
  return typeof marke === 'string' && marke.trim() ? { marke: { equals: marke.trim() } } : true;
};

const teilAktiv: Condition = (_daten, geschwister) => Boolean((geschwister as Geschwister)?.aktiv);

/**
 * Pflichtangaben eines Teils, nur wenn der Haken „Gehäuse oder Ersatzteil“ gesetzt ist.
 * Mit `max` prüft sie vorher die Länge, die sonst wegfiele.
 */
function teilPflicht(feld: TeilFeld, max?: number) {
  return (wert: unknown, { siblingData }: { siblingData?: Geschwister }) => {
    const laenge = max === undefined ? undefined : zuLang(wert, max);
    if (laenge) return laenge;
    if (!siblingData?.aktiv) return true;
    return fahrzeugteilLuecken(siblingData)[feld] ?? true;
  };
}

/** Marke am Teil: Pflicht bei Teilen mit Passform, dann wie im Fahrzeugkatalog. */
async function teilMarke(wert: unknown, optionen: PruefOptionen): Promise<true | string> {
  const pflicht = teilPflicht('marke', MARKE_MAX)(wert, optionen);
  if (pflicht !== true) return pflicht;
  return markeImKatalog(wert, optionen);
}

const baujahrFeld = (name: 'baujahrVon' | 'baujahrBis', label: string): Field => ({
  name,
  type: 'number',
  label,
  min: BAUJAHR_MIN,
  max: BAUJAHR_MAX,
  admin: { width: '33%', step: 1 },
  validate: ((wert: unknown, { siblingData }: { siblingData?: Geschwister }) => {
    if (wert !== undefined && wert !== null && (!Number.isInteger(wert) || (wert as number) < BAUJAHR_MIN || (wert as number) > BAUJAHR_MAX)) {
      return `Bitte ein Jahr zwischen ${BAUJAHR_MIN} und ${BAUJAHR_MAX} eintragen.`;
    }
    return baujahrePruefen(siblingData?.baujahrVon, siblingData?.baujahrBis);
  }) as never,
});

/**
 * Merkmale für Gehäuse und Ersatzteile (Abschnitt 14 des Inhabers): Fahrzeug aus dem
 * Fahrzeugkatalog, Bauform, Tastenzahl, Schlüsseltyp, Art des Teils, Kompatibilitätshinweis
 * und ob Elektronik und Transponder übernommen werden. Nur bei Standardartikeln.
 */
export const fahrzeugteilFeld: Field = {
  name: 'fahrzeugteil',
  type: 'group',
  label: 'Gehäuse oder Ersatzteil für Autoschlüssel',
  admin: {
    description:
      'Nur für Gehäuse und Ersatzteile. Nach diesen Angaben filtern Kunden später nach Fahrzeug, Bauform und Tastenzahl. '
      + 'Bitte nur eintragen, was Sie geprüft haben.',
  },
  fields: [
    {
      name: 'aktiv',
      type: 'checkbox',
      label: 'Dieser Artikel ist ein Gehäuse oder Ersatzteil für Autoschlüssel',
      defaultValue: false,
    },
    {
      type: 'row',
      admin: { condition: teilAktiv },
      fields: [
        {
          name: 'teileart',
          type: 'select',
          label: 'Art des Teils',
          options: TEILEARTEN.map((value) => ({ label: TEILEART_LABEL[value], value })),
          admin: { width: '50%' },
          validate: teilPflicht('teileart') as never,
        },
        {
          name: 'elektronik',
          type: 'select',
          label: 'Elektronik und Transponder werden übernommen',
          options: ELEKTRONIK_UEBERNAHMEN.map((value) => ({ label: ELEKTRONIK_LABEL[value], value })),
          admin: {
            width: '50%',
            description: '„Nur nach Prüfung“, wenn es vom einzelnen Schlüssel abhängt.',
          },
          validate: teilPflicht('elektronik') as never,
        },
      ],
    },
    {
      name: 'kompatibilitaet',
      type: 'textarea',
      label: 'Kompatibilitätshinweis',
      maxLength: KOMPATIBILITAET_MAX,
      admin: {
        condition: teilAktiv,
        description:
          'Pflicht. Was vom alten Schlüssel übernommen wird (Elektronik, Transponder, Tasten, Bart) und was nicht passt. '
          + 'Erscheint später auf der Seite des Artikels.',
      },
      validate: teilPflicht('kompatibilitaet', KOMPATIBILITAET_MAX) as never,
    },
    {
      name: 'bauformen',
      type: 'relationship',
      relationTo: 'bauformen',
      hasMany: true,
      label: 'Bauform',
      admin: {
        condition: teilAktiv,
        description: 'Aus der Liste unter Shop › Bauformen. Bei Gehäusen Pflicht. Fehlt eine Bauform, dort zuerst anlegen.',
      },
      validate: teilPflicht('bauformen') as never,
    },
    {
      type: 'row',
      admin: { condition: teilAktiv },
      fields: [
        {
          name: 'marke',
          type: 'text',
          label: 'Fahrzeugmarke',
          maxLength: MARKE_MAX,
          admin: {
            width: '40%',
            description:
              'Genau wie im Fahrzeugkatalog (Autoschlüssel › Fahrzeugkatalog). Bei Gehäuse, Tasten, Gummimatte, Klappmechanismus und Schlüsselbart Pflicht. '
              + 'Leer nur bei Teilen, die zu jeder Marke passen, etwa Batterien.',
          },
          validate: teilMarke as never,
        },
        {
          name: 'reihen',
          type: 'relationship',
          relationTo: 'fahrzeugreihen',
          hasMany: true,
          label: 'Modelle oder Reihen',
          filterOptions: reihenDerMarke,
          admin: { width: '60%', description: 'Leer: passt zu allen Reihen der Marke.' },
          validate: reihenZurMarke as never,
        },
      ],
    },
    {
      type: 'row',
      admin: { condition: teilAktiv },
      fields: [
        baujahrFeld('baujahrVon', 'Baujahr von'),
        baujahrFeld('baujahrBis', 'Baujahr bis'),
        {
          name: 'tastenzahl',
          type: 'number',
          label: 'Tastenzahl',
          min: 0,
          max: TASTEN_MAX,
          admin: { width: '34%', step: 1, description: 'Bei Gehäuse, Tasten und Gummimatte Pflicht.' },
          validate: ((wert: unknown, optionen: { siblingData?: Geschwister }) => {
            if (wert !== undefined && wert !== null && (!Number.isInteger(wert) || (wert as number) < 0 || (wert as number) > TASTEN_MAX)) {
              return `Bitte eine ganze Zahl von 0 bis ${TASTEN_MAX} eintragen.`;
            }
            return teilPflicht('tastenzahl')(wert, optionen);
          }) as never,
        },
      ],
    },
    {
      name: 'schluesselarten',
      type: 'select',
      label: 'Schlüsseltyp',
      hasMany: true,
      options: SCHLUESSELARTEN,
      admin: { condition: teilAktiv, description: 'Zu welchen Schlüsseltypen das Teil passt.' },
    },
  ],
};

/**
 * Artikel im Shop: Schlüssel nach Code und Standardartikel.
 *
 * Sicher pflegbar: Entwürfe mit Versionsverlauf, Papierkorb statt endgültigem
 * Löschen, feste Kennung für Warenkörbe und Bestellungen, geprüfte Codemuster.
 */
export const Produkte: CollectionConfig = {
  slug: 'produkte',
  labels: { singular: 'Artikel', plural: 'Artikel' },
  admin: {
    group: 'Shop',
    useAsTitle: 'name',
    defaultColumns: ['name', 'herstellerAuswahl', 'system', 'preis', 'verfuegbarkeit', 'kategorie', '_status'],
    listSearchableFields: ['name', 'kennung', 'hersteller', 'system', 'einsatz'],
    // Öffnet die Seite des Artikels. Sie zeigt die veröffentlichte Fassung; Entwürfe sind dort noch nicht zu sehen.
    preview: (doc) => vorschauPfad(doc),
    description:
      'Neue Artikel als Entwurf anlegen und erst veröffentlichen, wenn alles stimmt. '
      + 'Nicht mehr angebotene Artikel in den Papierkorb legen — sie lassen sich wiederherstellen.',
    pagination: { defaultLimit: 50 },
  },
  access: {
    read: istTeam,
    create: istTeam,
    update: istTeam,
    delete: papierkorbTeamLoeschenInhaber,
    readVersions: istTeam,
  },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 50 },
  trash: true,
  hooks: { ...erneuernHooks, beforeChange: [kopieAlsEntwurf], beforeDelete: [loeschsperre] },
  fields: [
    {
      name: 'typ',
      type: 'select',
      label: 'Art des Artikels',
      required: true,
      defaultValue: 'code_key',
      options: [
        { label: 'Schlüssel nach Code', value: 'code_key' },
        { label: 'Standardartikel', value: 'standard' },
      ],
      admin: { position: 'sidebar' },
    },
    mitDuplizierHaken(
      slugFeld({
        validate: ((wert: unknown, optionen: unknown) =>
          typeof wert === 'string' && RESERVIERTE_ADRESSEN.has(wert)
            ? 'Diese Adresse ist für eine Übersichtsseite reserviert. Bitte eine andere wählen.'
            : slugPruefung(wert, optionen)) as TextFieldSingleValidation,
      }),
      adresseBeimDuplizieren,
    ),
    mitDuplizierHaken(kennungOhneOriginalBeimAnlegen(kennungFeld()), kennungBeimDuplizieren),
    {
      name: 'beispiel',
      type: 'checkbox',
      label: 'Beispielartikel',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Beispiel: erscheint nicht auf der Seite. Nicht in Listen, Suche und Sitemap, nicht bestellbar. '
          + 'Für echte Artikel den Haken entfernen.',
      },
    },
    {
      name: 'verfuegbarkeit',
      type: 'select',
      label: 'Verfügbarkeit',
      // Nicht Pflicht, damit ältere Einträge und Werkzeuge ohne Angabe gültig bleiben: leer gilt als lieferbar.
      defaultValue: 'lieferbar',
      options: VERFUEGBARKEIT_OPTIONEN,
      admin: {
        isClearable: false,
        position: 'sidebar',
        description:
          'Lieferbar: in den Warenkorb. Auf Anfrage: Kunden fragen an, kein Warenkorb. '
          + 'Derzeit nicht lieferbar: kein Warenkorb, keine Bestellung, die Seite sagt es.',
      },
    },
    {
      name: 'kategorie',
      type: 'relationship',
      relationTo: 'kategorien',
      label: 'Kategorie',
      admin: { position: 'sidebar', description: 'In welcher Shop-Kategorie der Artikel steht.' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Artikel',
          fields: [
            { name: 'name', type: 'text', label: 'Name', required: true },
            { name: 'beschreibung', type: 'textarea', label: 'Beschreibung', required: true },
            {
              type: 'row',
              fields: [
                {
                  name: 'herstellerAuswahl',
                  type: 'relationship',
                  relationTo: 'hersteller',
                  label: 'Hersteller',
                  admin: { width: '50%', description: 'Aus der Liste wählen. Fehlt er, zuerst unter Shop › Hersteller anlegen.' },
                },
                { name: 'schluesseltyp', type: 'text', label: 'Schlüsseltyp', admin: { width: '50%' } },
              ],
            },
            {
              name: 'hersteller',
              type: 'text',
              label: 'Hersteller (alter Freitext)',
              admin: {
                readOnly: true,
                // Nur sichtbar, wenn ein alter Eintrag ihn noch trägt.
                condition: (data) => typeof data?.hersteller === 'string' && data.hersteller.trim() !== '',
                description: 'Nur noch zum Lesen. Gilt, solange oben kein Hersteller gewählt ist.',
              },
            },
            {
              type: 'row',
              admin: { condition: istCodeSchluessel },
              fields: [
                {
                  name: 'system',
                  type: 'text',
                  label: 'System',
                  admin: {
                    width: '50%',
                    description: 'So, wie der Hersteller das Schließsystem nennt. Pflicht bei neuen Codeprodukten. Erscheint in der Liste und auf der Seite des Produkts.',
                  },
                  validate: systemPruefen as TextFieldSingleValidation,
                },
                {
                  name: 'codebereich',
                  type: 'text',
                  label: 'Codebereich',
                  admin: {
                    width: '50%',
                    description: 'Von bis oder Muster, wie der Hersteller es angibt, etwa „1 bis 999“. Erscheint in der Liste und auf der Seite des Produkts.',
                  },
                },
              ],
            },
            {
              type: 'row',
              admin: { condition: istCodeSchluessel },
              fields: [
                { name: 'profil', type: 'text', label: 'Profil', admin: { width: '50%', description: 'Schlüsselprofil laut Hersteller.' } },
                { name: 'codeserie', type: 'text', label: 'Codeserie', admin: { width: '50%', description: 'Codeserie bzw. Schließungsserie.' } },
              ],
            },
            { name: 'einsatz', type: 'text', label: 'Einsatzbereich', admin: { description: 'z. B. „Briefkasten“ oder „Büroschrank“.' } },
            { name: 'umfang', type: 'text', label: 'Lieferumfang' },
            {
              name: 'eigenschaften',
              type: 'array',
              label: 'Eigenschaften',
              labels: { singular: 'Eigenschaft', plural: 'Eigenschaften' },
              admin: { condition: istStandardartikel },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', label: 'Merkmal', required: true, admin: { width: '40%' } },
                    { name: 'wert', type: 'text', label: 'Wert', required: true, admin: { width: '60%' } },
                  ],
                },
              ],
            },
            {
              name: 'lieferzeit',
              type: 'text',
              label: 'Lieferzeit',
              admin: {
                description:
                  'Etwa „2 bis 4 Werktage“. Leer lassen, wenn die Lieferzeit der Versandart gilt. '
                  + 'Erscheint in der Liste und auf der Seite des Produkts.',
              },
            },
            {
              name: 'schlagworte',
              type: 'text',
              label: 'Schlagworte für Filter und Suche',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Preis und Versand',
          fields: [
            euroFeld('preis', 'Preis je Stück', { required: true }),
            {
              name: 'staffeln',
              type: 'array',
              label: 'Mengenrabatte',
              labels: { singular: 'Staffel', plural: 'Staffeln' },
              admin: {
                description:
                  'Rabatt in Prozent ab einer Stückzahl. Ändert sich der Preis, passen sich die Staffeln an.',
              },
              validate: (value: unknown) => {
                const staffeln = (value ?? []) as { abMenge?: number }[];
                const mengen = staffeln.map((s) => s.abMenge);
                return new Set(mengen).size === mengen.length
                  ? true
                  : 'Jede Stückzahl darf nur einmal vorkommen.';
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'abMenge', type: 'number', label: 'Ab Stück', required: true, min: 2, max: 999, admin: { width: '50%', step: 1 } },
                    { name: 'rabattProzent', type: 'number', label: 'Rabatt in %', required: true, min: 0.01, max: 90, admin: { width: '50%', step: 0.5 } },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'maxMenge', type: 'number', label: 'Höchstmenge je Bestellung', required: true, defaultValue: 20, min: 1, max: 999, admin: { width: '50%', step: 1 } },
                { name: 'versandklasse', type: 'select', label: 'Versandklasse', required: true, defaultValue: 'code-schluessel', options: VERSANDKLASSEN, admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Code',
          admin: { condition: istCodeSchluessel },
          description: 'Wie der Kunde seinen Schlüsselcode findet und eingibt.',
          fields: [
            { name: 'codeFormat', type: 'text', label: 'Aufbau des Codes (für Kunden)', admin: { description: 'z. B. „3 bis 4 Ziffern“.' } },
            {
              type: 'row',
              fields: [
                {
                  name: 'codeMuster',
                  type: 'text',
                  label: 'Prüfmuster',
                  admin: { width: '60%', description: 'Regulärer Ausdruck, z. B. ^[0-9]{3,4}$ — wird beim Speichern geprüft.' },
                  validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) =>
                    istCodeSchluessel(siblingData) ? pruefeCodeMuster(value) : true,
                },
                {
                  name: 'codeBeispiel',
                  type: 'text',
                  label: 'Beispielcode',
                  admin: { width: '40%' },
                  validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
                    if (!istCodeSchluessel(siblingData)) return true;
                    if (typeof value !== 'string' || !value) return 'Bitte einen Beispielcode eintragen.';
                    const muster = siblingData.codeMuster;
                    if (typeof muster !== 'string' || pruefeCodeMuster(muster) !== true) return true;
                    return codePasst(muster, value) ? true : 'Der Beispielcode passt nicht zum Prüfmuster.';
                  },
                },
              ],
            },
            { name: 'codeHinweis', type: 'textarea', label: 'Wo steht der Code?' },
            bildFeld('codeFundstelle', 'Bild: Fundstelle des Codes', '4/3'),
            {
              type: 'row',
              fields: [
                {
                  name: 'fotoUpload',
                  type: 'select',
                  label: 'Foto vom Schlüssel',
                  defaultValue: 'optional',
                  options: [
                    { label: 'Nicht nötig', value: 'nein' },
                    { label: 'Freiwillig', value: 'optional' },
                    { label: 'Pflicht', value: 'pflicht' },
                  ],
                  admin: { width: '40%' },
                },
                { name: 'fotoHinweis', type: 'text', label: 'Hinweis zum Foto', admin: { width: '60%' } },
              ],
            },
          ],
        },
        {
          label: 'Bilder',
          fields: [
            bildFeld('produktbild', 'Produktbild', '1/1'),
            {
              name: 'weitereBilder',
              type: 'upload',
              relationTo: 'medien',
              hasMany: true,
              label: 'Weitere Fotos',
            },
          ],
        },
        {
          label: 'Gehäuse und Ersatzteile',
          admin: { condition: istStandardartikel },
          description: 'Nur für Gehäuse und Ersatzteile für Autoschlüssel.',
          fields: [fahrzeugteilFeld],
        },
        { label: 'Produktsicherheit', fields: [gpsrFeld()] },
        { label: 'Suchmaschinen', fields: [seoFeld()] },
      ],
    },
  ],
};
