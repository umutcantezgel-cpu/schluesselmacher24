import type { CollectionBeforeChangeHook, CollectionBeforeValidateHook, CollectionConfig, TextField, TextFieldSingleValidation, Validate } from 'payload';

import { fruehereAdressenNachAenderung } from '../../lib/data/shop';
import { slugify } from '../../lib/slug';
import { istTeam, papierkorbTeamLoeschenInhaber } from '../access/rollen';
import { bildFeld, kennungFeld, seoFeld, slugFeld } from '../fields/gemeinsam';
import { erneuernHooks } from '../hooks/revalidate';

/** Wie die Kategorie heute endet; die Liste ist im Typ `KategorieArt` beschrieben. */
export const KATEGORIE_ARTEN = [
  { label: 'Schlüssel nach Code (Produktliste)', value: 'codeprodukte' },
  { label: 'Artikel (Produktliste)', value: 'artikel' },
  { label: 'Konfigurator', value: 'konfigurator' },
  { label: 'Anfrage (noch keine Produkte)', value: 'anfrage' },
] as const;

/** Ziel: eine Adresse dieser Seite, auf Wunsch mit Angaben nach „?“ (etwa ?thema=autoschluessel). */
export const ZIEL_MUSTER = /^\/[a-z0-9\-/]*(\?[a-z0-9=&\-]+)?$/;

const slugPruefung = slugFeld().validate as (wert: unknown, optionen: unknown) => true | string;

/**
 * Adresse, die leer bleiben darf: Der Hook `adresseAusName` bildet sie dann vor
 * der Prüfung aus dem Namen. Gespeichert wird nie eine leere Adresse.
 */
export function freiwilligeAdresse(beschreibung: string): TextField {
  return slugFeld({
    required: false,
    validate: ((wert: unknown, optionen: unknown) =>
      wert === undefined || wert === null || wert === '' ? true : slugPruefung(wert, optionen)) as TextFieldSingleValidation,
    admin: { position: 'sidebar', description: beschreibung },
  });
}

/**
 * Leere Adresse aus dem Namen bilden: Der Betreiber muss sie nicht selbst schreiben.
 * Beim Anlegen, wenn sie fehlt; beim Ändern nur, wenn sie ausdrücklich geleert wird.
 * Ein Teil-Update ohne `slug` (etwa der Startwert-Abgleich des Namens) lässt die
 * Adresse stehen, damit sie stabil bleibt.
 */
export const adresseAusName: CollectionBeforeValidateHook = ({ data, operation, originalDoc }) => {
  if (!data) return data;
  const leer = operation === 'update' ? data.slug === '' || data.slug === null : !data.slug;
  const name = typeof data.name === 'string' ? data.name : typeof originalDoc?.name === 'string' ? originalDoc.name : undefined;
  if (leer && name) data.slug = slugify(name);
  return data;
};

type AdressZeile = { adresse?: string | null };

/** Ändert der Betreiber die Adresse, bleibt die alte als Weiterleitung erreichbar (FA-22-04). */
export const alteAdresseMerken: CollectionBeforeChangeHook = ({ data, operation, originalDoc }) => {
  if (operation !== 'update' || !originalDoc) return data;
  const alt = typeof originalDoc.slug === 'string' ? originalDoc.slug : undefined;
  const neu = typeof data.slug === 'string' ? data.slug : alt;
  const zeilen = (Array.isArray(data.fruehereAdressen) ? data.fruehereAdressen : originalDoc.fruehereAdressen ?? []) as AdressZeile[];
  const liste = zeilen.map((z) => z?.adresse ?? '').filter(Boolean);
  const neueListe = fruehereAdressenNachAenderung(alt, neu, liste);
  if (neueListe.join('|') !== liste.join('|') || Array.isArray(data.fruehereAdressen)) {
    data.fruehereAdressen = neueListe.map((adresse) => ({ adresse }));
  }
  return data;
};

const verweisId = (wert: unknown): number | string | undefined => {
  if (wert && typeof wert === 'object' && 'id' in wert) return (wert as { id: number | string }).id;
  return typeof wert === 'number' || typeof wert === 'string' ? wert : undefined;
};

/** Keine Kategorie unter sich selbst, kein Kreis über mehrere Ebenen. */
const elternPruefen: Validate = async (wert, { id, req }) => {
  const start = verweisId(wert);
  if (start === undefined || start === null || start === '') return true;
  if (id !== undefined && String(start) === String(id)) return 'Eine Kategorie kann nicht unter sich selbst stehen.';
  if (id === undefined || !req?.payload) return true;
  let aktuell: number | string | undefined = start;
  for (let schritt = 0; schritt < 25 && aktuell !== undefined; schritt += 1) {
    const doc = await req.payload
      .findByID({ collection: 'kategorien', id: aktuell, depth: 0, req, overrideAccess: true, trash: true })
      .catch(() => null);
    if (!doc) return true;
    const naechste = verweisId((doc as { eltern?: unknown }).eltern);
    if (naechste !== undefined && String(naechste) === String(id)) {
      return 'So entstünde ein Kreis: Die gewählte Kategorie liegt schon unter dieser. Bitte eine andere wählen.';
    }
    aktuell = naechste;
  }
  return true;
};

/**
 * Shop-Kategorien (FA-10, FA-22-04, FA-22-05): Hauptkategorien und
 * Unterkategorien als Datensätze. Artikel verweisen über das Feld „Kategorie“
 * hierher. Eine geänderte Adresse wird unter „Frühere Adressen“ gemerkt; die
 * Seiten mit Weiterleitung baut FA-SHOP-01B.
 */
export const Kategorien: CollectionConfig = {
  slug: 'kategorien',
  labels: { singular: 'Shop-Kategorie', plural: 'Shop-Kategorien' },
  admin: {
    group: 'Shop',
    useAsTitle: 'name',
    defaultColumns: ['name', 'eltern', 'art', 'reihenfolge', 'imShop'],
    listSearchableFields: ['name', 'slug'],
    description:
      'Kategorien und Unterkategorien des Shops. Reihenfolge: kleinere Zahl zuerst. '
      + 'Eine Unterkategorie entsteht, wenn Sie oben eine übergeordnete Kategorie wählen. '
      + 'Hauptkategorien mit Haken „Im Shop zeigen“ stehen in dieser Reihenfolge auf der Seite /shop. '
      + 'Jede sichtbare Unterkategorie von „Schlüssel nach Code“ hat eine eigene Seite. Ohne Artikel zeigt sie den Hinweis und „Code anfragen“ und erscheint nicht in Suchmaschinen.',
    pagination: { defaultLimit: 50 },
  },
  access: { read: istTeam, create: istTeam, update: istTeam, delete: papierkorbTeamLoeschenInhaber, readVersions: istTeam },
  versions: { maxPerDoc: 20 },
  trash: true,
  defaultSort: 'reihenfolge',
  disableDuplicate: true,
  hooks: { ...erneuernHooks, beforeValidate: [adresseAusName], beforeChange: [alteAdresseMerken] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', label: 'Name', required: true, admin: { width: '50%', description: 'So steht die Kategorie im Shop.' } },
        {
          name: 'eltern',
          type: 'relationship',
          relationTo: 'kategorien',
          label: 'Übergeordnete Kategorie',
          admin: {
            width: '50%',
            description: 'Leer lassen für eine Hauptkategorie. Für eine Unterkategorie hier die Hauptkategorie wählen.',
          },
          filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
          validate: elternPruefen,
        },
      ],
    },
    { name: 'beschreibung', type: 'textarea', label: 'Beschreibung', required: true, maxLength: 400, admin: { description: 'Ein bis zwei kurze Sätze für Kunden.' } },
    {
      type: 'row',
      fields: [
        {
          name: 'art',
          type: 'select',
          label: 'Wohin führt die Kategorie?',
          required: true,
          defaultValue: 'anfrage',
          options: [...KATEGORIE_ARTEN],
          admin: { width: '34%' },
        },
        {
          name: 'ziel',
          type: 'text',
          label: 'Ziel (Adresse)',
          required: true,
          admin: { width: '33%', description: 'Beginnt mit „/“, etwa /schluessel-nach-code.' },
          validate: (wert: string | null | undefined) =>
            typeof wert === 'string' && ZIEL_MUSTER.test(wert) ? true : 'Bitte eine Adresse dieser Seite angeben, etwa /schluessel-nach-code.',
        },
        {
          name: 'hinweis',
          type: 'text',
          label: 'Hinweis, solange Produkte fehlen',
          maxLength: 80,
          admin: { width: '33%', description: 'Etwa „Direkt bestellen können Sie hier derzeit nicht. Bitte fragen Sie bei uns an.“ Leer lassen, wenn es Produkte gibt.' },
        },
      ],
    },
    bildFeld('bild', 'Bild der Kategorie', '4/3'),
    {
      name: 'fruehereAdressen',
      type: 'array',
      label: 'Frühere Adressen',
      labels: { singular: 'Frühere Adresse', plural: 'Frühere Adressen' },
      admin: {
        description:
          'Wird automatisch ergänzt, wenn Sie die Adresse ändern. Bei Unterkategorien von „Schlüssel nach Code“ leiten frühere Adressen dauerhaft auf die aktuelle weiter.',
        initCollapsed: true,
      },
      fields: [{ name: 'adresse', type: 'text', label: 'Adresse', required: true }],
    },
    {
      type: 'collapsible',
      label: 'Suchmaschinen',
      admin: { initCollapsed: true },
      fields: [seoFeld()],
    },
    freiwilligeAdresse(
      'Nur Kleinbuchstaben, Ziffern und Bindestriche. Leer lassen: wird aus dem Namen gebildet. Ändern Sie sie, merkt sich die Kategorie die alte.',
    ),
    kennungFeld(),
    {
      name: 'reihenfolge',
      type: 'number',
      label: 'Reihenfolge',
      required: true,
      defaultValue: 100,
      admin: { position: 'sidebar', description: 'Kleinere Zahl steht weiter vorn.' },
    },
    {
      name: 'imShop',
      type: 'checkbox',
      label: 'Im Shop zeigen',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Ohne Haken bleibt die Kategorie samt Unterkategorien verborgen.' },
    },
  ],
};
