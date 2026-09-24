import type { StandardArticle } from '@/lib/types';

/**
 * Beispielartikel für den Shop-Aufbau.
 *
 * Bewusst als Beispiel gekennzeichnet: runde Platzhalterpreise, keine
 * Herstellernamen, nicht bestellbar und nicht in Suchmaschinen. Im Backend
 * lassen sie sich gesammelt in den Papierkorb legen, sobald echte Artikel
 * gepflegt sind.
 */
type Vorlage = {
  slug: string;
  name: string;
  description: string;
  scope: string;
  properties: [string, string][];
  priceCents: number;
  shippingClass: StandardArticle['shippingClass'];
  motif: string;
  tags: string[];
};

const VORLAGEN: Vorlage[] = [
  {
    slug: 'beispiel-schluesselkasten',
    name: 'Schlüsselkasten für 20 Schlüssel',
    description:
      'Wandkasten aus Stahlblech mit nummerierten Haken. Hält Schlüssel geordnet und verschlossen — '
      + 'etwa im Büro, in der Hausverwaltung oder in der Werkstatt.',
    scope: '1 Schlüsselkasten, Befestigungsmaterial, 2 Schlüssel',
    properties: [['Hakenplätze', '20'], ['Material', 'Stahlblech, pulverbeschichtet'], ['Verschluss', 'Zylinderschloss']],
    priceCents: 4000,
    shippingClass: 'zubehoer',
    motif: 'Produktfoto Schlüsselkasten, geöffnet, mit Haken',
    tags: ['Aufbewahrung', 'Büro', 'Hausverwaltung'],
  },
  {
    slug: 'beispiel-schluesselsafe-zahlencode',
    name: 'Schlüsselsafe mit Zahlencode',
    description:
      'Kleiner Wandtresor für die Schlüsselübergabe ohne persönliches Treffen, zum Beispiel für '
      + 'Handwerker oder Pflegedienste. Der Code lässt sich jederzeit ändern.',
    scope: '1 Schlüsselsafe, Befestigungsmaterial',
    properties: [['Öffnung', '4-stelliger Zahlencode'], ['Montage', 'Wand'], ['Innenraum', 'für bis zu 5 Schlüssel']],
    priceCents: 3000,
    shippingClass: 'zubehoer',
    motif: 'Produktfoto Schlüsselsafe mit Zahlenrädern',
    tags: ['Aufbewahrung', 'Übergabe'],
  },
  {
    slug: 'beispiel-schluesselkappen-set',
    name: 'Schlüsselkappen, farbig sortiert (10 Stück)',
    description:
      'Farbige Kappen für den Schlüsselkopf. Damit unterscheiden Sie Haustür-, Keller- und '
      + 'Garagenschlüssel auf einen Blick.',
    scope: '10 Kappen in 5 Farben',
    properties: [['Farben', '5'], ['Passend für', 'gängige Profilzylinderschlüssel']],
    priceCents: 500,
    shippingClass: 'code-schluessel',
    motif: 'Produktfoto farbige Schlüsselkappen',
    tags: ['Zubehör', 'Ordnung'],
  },
  {
    slug: 'beispiel-schluesselanhaenger-adressfeld',
    name: 'Schlüsselanhänger mit Beschriftungsfeld (5 Stück)',
    description:
      'Anhänger mit Sichtfenster und Einlegeschild. Beschriften Sie Räume oder Wohnungen — ohne '
      + 'die Anschrift preiszugeben.',
    scope: '5 Anhänger, 5 Einlegeschilder',
    properties: [['Material', 'Kunststoff'], ['Beschriftung', 'Einlegeschild']],
    priceCents: 500,
    shippingClass: 'code-schluessel',
    motif: 'Produktfoto Schlüsselanhänger mit Beschriftungsfeld',
    tags: ['Zubehör', 'Ordnung'],
  },
  {
    slug: 'beispiel-zylinder-pflegespray',
    name: 'Pflegespray für Schließzylinder',
    description:
      'Pflegemittel für Schließzylinder und Schlösser. Nicht verharzend und für Präzisionszylinder '
      + 'geeignet — anders als Öl oder Kriechöl.',
    scope: '1 Sprühdose mit Röhrchen',
    properties: [['Inhalt', '50 ml'], ['Anwendung', 'ein- bis zweimal im Jahr']],
    priceCents: 1000,
    shippingClass: 'zubehoer',
    motif: 'Produktfoto Pflegespray mit Sprühröhrchen',
    tags: ['Pflege', 'Zylinder'],
  },
  {
    slug: 'beispiel-briefkastenschloss',
    name: 'Briefkastenschloss mit Nocke',
    description:
      'Ersatzschloss für Briefkästen mit zwei Schlüsseln. Bitte Länge und Nockenform vor der '
      + 'Bestellung mit dem vorhandenen Schloss vergleichen.',
    scope: '1 Schloss, 2 Schlüssel, 2 Nocken',
    properties: [['Schlüssel', '2'], ['Nocken', 'gerade und gekröpft']],
    priceCents: 1500,
    shippingClass: 'zubehoer',
    motif: 'Produktfoto Briefkastenschloss mit Nocken und Schlüsseln',
    tags: ['Briefkasten', 'Ersatzteil'],
  },
  {
    slug: 'beispiel-fenstergriff-abschliessbar',
    name: 'Fenstergriff, abschließbar',
    description:
      'Griff mit Zylinder für Fenster und Balkontüren. Erschwert das Öffnen von außen nach einem '
      + 'Glasdurchbruch.',
    scope: '1 Fenstergriff, 2 Schlüssel, Schrauben',
    properties: [['Stiftlänge', 'bitte vor der Bestellung messen'], ['Schlüssel', '2']],
    priceCents: 2500,
    shippingClass: 'zubehoer',
    motif: 'Produktfoto abschließbarer Fenstergriff',
    tags: ['Fenster', 'Einbruchschutz'],
  },
  {
    slug: 'beispiel-moebelschloss',
    name: 'Möbelschloss für Schubladen und Türen',
    description:
      'Aufschraubschloss für Holzmöbel. Mit zwei Schlüsseln; weitere Schlüssel können Sie später '
      + 'nach Code bestellen.',
    scope: '1 Schloss, 2 Schlüssel, Schrauben',
    properties: [['Einsatz', 'Schublade oder Tür'], ['Dornmaß', 'bitte vor der Bestellung messen']],
    priceCents: 1500,
    shippingClass: 'zubehoer',
    motif: 'Produktfoto Möbelschloss mit zwei Schlüsseln',
    tags: ['Möbel', 'Ersatzteil'],
  },
];

export function standardArticles(): StandardArticle[] {
  return VORLAGEN.map((v) => ({
    id: v.slug,
    slug: v.slug,
    name: v.name,
    description: v.description,
    manufacturer: '',
    scope: v.scope,
    properties: v.properties.map(([name, value]) => ({ name, value })),
    deliveryTime: '',
    priceCents: v.priceCents,
    maxQty: 20,
    shippingClass: v.shippingClass,
    image: { motif: v.motif, ratio: '1/1' },
    gallery: [],
    tags: v.tags,
    seo: {
      title: `${v.name} (Beispiel)`,
      description: v.description,
      internalLinks: [{ href: '/artikel', label: 'Alle Artikel' }],
      noindex: true,
    },
    example: true,
  }));
}
