import type { KeyKind, VehicleMake, VehicleModel } from '@/lib/types';

/**
 * Fahrzeugdaten für den Autoschlüssel-Assistenten und die SEO-Seiten.
 *
 * Wichtig für den Betrieb: Diese Liste ist als vollständig pflegbare
 * Struktur angelegt. Welche Schlüsselart ein konkretes Modell tatsächlich
 * hat und ob das Fahrzeug zum Anlernen vor Ort sein muss, gehört fachlich
 * geprüft und im Backend unter „Fahrzeugdaten“ nachgezogen.
 */

type ModelSpec = [
  name: string,
  yearFrom: number,
  yearTo: number | null,
  keyKinds: KeyKind[],
  onSite: boolean,
  group?: string,
];

function toModels(specs: ModelSpec[]): VehicleModel[] {
  return specs.map(([name, yearFrom, yearTo, keyKinds, onSite, group]) => ({
    id: slugify(name),
    slug: slugify(name),
    name,
    yearFrom,
    yearTo: yearTo ?? undefined,
    keyKinds,
    requiresVehicleOnSite: onSite,
    pricingGroupId: group,
  }));
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function vehicleMakes(): VehicleMake[] {
  const raw: Array<{
    name: string;
    group: string;
    intro: string;
    models: ModelSpec[];
  }> = [
    {
      name: 'Volkswagen',
      group: 'gruppe-b',
      intro:
        'Für Volkswagen decken wir mechanische Schlüssel, Klappschlüssel mit Funk und schlüssellose Systeme ab. Welche Variante Ihr Fahrzeug hat, erkennen wir an Ihren Schlüsselfotos und den Fahrzeugdaten.',
      models: [
        ['Golf', 2003, null, ['mechanisch', 'klappschluessel', 'funk', 'keyless'], true],
        ['Polo', 2002, null, ['mechanisch', 'klappschluessel', 'funk'], true],
        ['Passat', 2005, null, ['klappschluessel', 'funk', 'keyless'], true, 'gruppe-c'],
        ['Tiguan', 2007, null, ['klappschluessel', 'funk', 'keyless'], true, 'gruppe-c'],
        ['T-Roc', 2017, null, ['klappschluessel', 'funk', 'keyless'], true, 'gruppe-c'],
        ['Transporter', 2003, null, ['mechanisch', 'klappschluessel', 'funk'], true],
      ],
    },
    {
      name: 'BMW',
      group: 'gruppe-c',
      intro:
        'BMW setzt je nach Baureihe auf Funkschlüssel oder schlüssellose Systeme. Bei neueren Fahrzeugen ist der Zugriff auf das Fahrzeug zum Anlernen zwingend erforderlich.',
      models: [
        ['1er', 2004, null, ['funk', 'smart-key', 'keyless'], true],
        ['3er', 1998, null, ['funk', 'smart-key', 'keyless'], true],
        ['5er', 1996, null, ['funk', 'smart-key', 'keyless'], true],
        ['X1', 2009, null, ['funk', 'smart-key', 'keyless'], true],
        ['X3', 2003, null, ['funk', 'smart-key', 'keyless'], true],
      ],
    },
    {
      name: 'Mercedes-Benz',
      group: 'gruppe-d',
      intro:
        'Mercedes-Benz arbeitet bei vielen Baureihen mit geschützten Zugängen. Wir prüfen Unterlagen, Fahrzeugdaten und Machbarkeit grundsätzlich vor der verbindlichen Terminbestätigung.',
      models: [
        ['A-Klasse', 2004, null, ['funk', 'smart-key', 'keyless'], true],
        ['C-Klasse', 2000, null, ['funk', 'smart-key', 'keyless'], true],
        ['E-Klasse', 2002, null, ['funk', 'smart-key', 'keyless'], true],
        ['Sprinter', 2006, null, ['mechanisch', 'funk', 'keyless'], true],
        ['Vito', 2003, null, ['mechanisch', 'funk', 'keyless'], true],
      ],
    },
    {
      name: 'Audi',
      group: 'gruppe-c',
      intro:
        'Bei Audi reichen die Systeme vom mechanischen Schlüssel bis zu schlüssellosem Zugang und Start. Die Schlüsselfotos zeigen uns, welche Variante vorliegt.',
      models: [
        ['A1', 2010, null, ['klappschluessel', 'funk', 'keyless'], true],
        ['A3', 1996, null, ['mechanisch', 'klappschluessel', 'funk', 'keyless'], true],
        ['A4', 1994, null, ['klappschluessel', 'funk', 'keyless'], true],
        ['A6', 1997, null, ['klappschluessel', 'funk', 'smart-key', 'keyless'], true],
        ['Q3', 2011, null, ['klappschluessel', 'funk', 'keyless'], true],
      ],
    },
    {
      name: 'Opel',
      group: 'gruppe-b',
      intro:
        'Opel-Fahrzeuge lassen sich in vielen Fällen zügig bearbeiten. Mechanischer Bart und Funkteil werden getrennt betrachtet.',
      models: [
        ['Corsa', 2000, null, ['mechanisch', 'klappschluessel', 'funk'], true],
        ['Astra', 1998, null, ['mechanisch', 'klappschluessel', 'funk'], true],
        ['Insignia', 2008, null, ['klappschluessel', 'funk', 'keyless'], true, 'gruppe-c'],
        ['Mokka', 2012, null, ['klappschluessel', 'funk', 'keyless'], true, 'gruppe-c'],
      ],
    },
    {
      name: 'Ford',
      group: 'gruppe-b',
      intro:
        'Für Ford bearbeiten wir mechanische Schlüssel, Klappschlüssel und Systeme mit schlüssellosem Start.',
      models: [
        ['Fiesta', 2002, null, ['mechanisch', 'klappschluessel', 'funk'], true],
        ['Focus', 1998, null, ['mechanisch', 'klappschluessel', 'funk', 'keyless'], true],
        ['Kuga', 2008, null, ['klappschluessel', 'funk', 'keyless'], true, 'gruppe-c'],
        ['Transit', 2000, null, ['mechanisch', 'klappschluessel', 'funk'], true],
      ],
    },
    {
      name: 'Škoda',
      group: 'gruppe-b',
      intro:
        'Škoda teilt sich viele Schlüsselsysteme mit anderen Marken des Konzerns. Das erleichtert die Beschaffung passender Rohlinge.',
      models: [
        ['Fabia', 1999, null, ['mechanisch', 'klappschluessel', 'funk'], true],
        ['Octavia', 1996, null, ['mechanisch', 'klappschluessel', 'funk', 'keyless'], true],
        ['Kodiaq', 2016, null, ['klappschluessel', 'funk', 'keyless'], true, 'gruppe-c'],
        ['Superb', 2001, null, ['klappschluessel', 'funk', 'keyless'], true, 'gruppe-c'],
      ],
    },
    {
      name: 'SEAT',
      group: 'gruppe-b',
      intro:
        'Für SEAT gelten in vielen Fällen dieselben Schlüsselsysteme wie bei den Schwestermarken. Die Fahrzeugdaten klären den Einzelfall.',
      models: [
        ['Ibiza', 2002, null, ['mechanisch', 'klappschluessel', 'funk'], true],
        ['Leon', 1999, null, ['mechanisch', 'klappschluessel', 'funk', 'keyless'], true],
        ['Ateca', 2016, null, ['klappschluessel', 'funk', 'keyless'], true, 'gruppe-c'],
      ],
    },
    {
      name: 'Renault',
      group: 'gruppe-c',
      intro:
        'Renault nutzt bei vielen Modellen Kartenschlüssel und schlüssellose Systeme. Diese erfordern besondere Beschaffung und Zeit am Fahrzeug.',
      models: [
        ['Clio', 1998, null, ['mechanisch', 'funk', 'smart-key', 'keyless'], true],
        ['Captur', 2013, null, ['funk', 'smart-key', 'keyless'], true],
        ['Mégane', 1995, null, ['funk', 'smart-key', 'keyless'], true],
        ['Kangoo', 1997, null, ['mechanisch', 'funk'], true, 'gruppe-b'],
      ],
    },
    {
      name: 'Toyota',
      group: 'gruppe-c',
      intro:
        'Toyota setzt je nach Baujahr auf Klappschlüssel oder Smart-Key-Systeme. Die Schlüsselfotos zeigen die Bauform eindeutig.',
      models: [
        ['Yaris', 1999, null, ['mechanisch', 'klappschluessel', 'funk', 'smart-key'], true],
        ['Corolla', 1997, null, ['klappschluessel', 'funk', 'smart-key'], true],
        ['RAV4', 2000, null, ['klappschluessel', 'funk', 'smart-key', 'keyless'], true],
      ],
    },
    {
      name: 'Fiat',
      group: 'gruppe-b',
      intro:
        'Fiat-Fahrzeuge lassen sich häufig über den mechanischen Bart und das Funkteil getrennt bearbeiten.',
      models: [
        ['500', 2007, null, ['mechanisch', 'klappschluessel', 'funk'], true],
        ['Panda', 2003, null, ['mechanisch', 'klappschluessel', 'funk'], true],
        ['Ducato', 2006, null, ['mechanisch', 'klappschluessel', 'funk'], true],
      ],
    },
    {
      name: 'Hyundai',
      group: 'gruppe-c',
      intro:
        'Hyundai verwendet bei neueren Modellen überwiegend Funk- und Smart-Key-Systeme mit Zugriff auf das Fahrzeug.',
      models: [
        ['i20', 2008, null, ['klappschluessel', 'funk', 'smart-key'], true],
        ['i30', 2007, null, ['klappschluessel', 'funk', 'smart-key', 'keyless'], true],
        ['Tucson', 2004, null, ['funk', 'smart-key', 'keyless'], true],
      ],
    },
  ];

  return raw.map((make) => ({
    id: slugify(make.name),
    slug: slugify(make.name),
    name: make.name,
    pricingGroupId: make.group,
    intro: make.intro,
    image: {
      motif: `Werkstattfoto: Schlüsselbearbeitung ${make.name}`,
      ratio: '16/9',
      note: 'Echtes Werkstatt- oder Produktfoto, kein Stockfoto.',
    },
    models: toModels(make.models),
  }));
}
