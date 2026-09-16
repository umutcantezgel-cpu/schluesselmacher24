import type { CodeLine } from '@/lib/types';

/**
 * Schlüssel nach Code — 52 Codelinien als vollständig pflegbare Produkte.
 *
 * Bei diesen Artikeln muss der Originalschlüssel nicht eingesendet werden.
 * Der Kunde gibt den auf Schloss oder Schlüssel aufgedruckten Code ein.
 *
 * Betriebshinweis: Hersteller, Preis, Codeformat und Lieferumfang sind je
 * Linie über das Backend pflegbar. Die mit „[…]“ gekennzeichneten Felder
 * sind Platzhalter und vor Livegang fachlich zu befüllen.
 */

interface LineSpec {
  /** Kurzkennung der Linie, z. B. "MS-01". */
  code: string;
  name: string;
  application: string;
  keyType: string;
  /** Muster für die Plausibilitätsprüfung (regulärer Ausdruck). */
  pattern: string;
  formatLabel: string;
  example: string;
  hint: string;
  where: string;
  priceCents: number;
  photo: 'nein' | 'optional' | 'pflicht';
  tags: string[];
}

const FAMILIES: Array<{ family: string; prefix: string; lines: LineSpec[] }> = [
  {
    family: 'Möbel- und Büroschlösser',
    prefix: 'MS',
    lines: buildFamily('MS', 'Möbel- und Büroschloss', 'Möbelschlüssel', [
      ['Büroschrank und Rollcontainer', '^[0-9]{3,4}$', '3 bis 4 Ziffern', '0812', 8],
      ['Schreibtisch und Sideboard', '^[A-Z]{1,2}[0-9]{3}$', '1 bis 2 Buchstaben, dann 3 Ziffern', 'C214', 8],
      ['Aktenschrank und Registratur', '^[0-9]{4}$', '4 Ziffern', '4471', 8],
      ['Vitrine und Glasschrank', '^[A-Z][0-9]{2,3}$', '1 Buchstabe, dann 2 bis 3 Ziffern', 'K118', 8],
      ['Küchenmöbel und Einbauschrank', '^[0-9]{3}$', '3 Ziffern', '226', 8],
      ['Werkstattschrank und Werkbank', '^[A-Z]{2}[0-9]{3}$', '2 Buchstaben, dann 3 Ziffern', 'WB104', 9],
    ]),
  },
  {
    family: 'Spind- und Garderobenschlösser',
    prefix: 'SP',
    lines: buildFamily('SP', 'Spind- und Garderobenschloss', 'Spindschlüssel', [
      ['Umkleidespind Sport und Verein', '^[0-9]{3,4}$', '3 bis 4 Ziffern', '0347', 8],
      ['Betriebsspind und Sozialraum', '^[A-Z][0-9]{3}$', '1 Buchstabe, dann 3 Ziffern', 'S482', 8],
      ['Schulspind und Schließfach', '^[0-9]{2}-[0-9]{3}$', '2 Ziffern, Bindestrich, 3 Ziffern', '21-508', 9],
      ['Garderobenschrank Hotel und Gastronomie', '^[A-Z]{2}[0-9]{2,3}$', '2 Buchstaben, dann 2 bis 3 Ziffern', 'GH215', 9],
      ['Wertfach und Schließfachanlage', '^[0-9]{3}-[0-9]{2}$', '3 Ziffern, Bindestrich, 2 Ziffern', '204-11', 10],
    ]),
  },
  {
    family: 'Briefkasten- und Postanlagen',
    prefix: 'BK',
    lines: buildFamily('BK', 'Briefkasten- und Postanlage', 'Briefkastenschlüssel', [
      ['Einzelbriefkasten Hauswand', '^[0-9]{3,5}$', '3 bis 5 Ziffern', '10428', 7],
      ['Briefkastenanlage Mehrfamilienhaus', '^[A-Z][0-9]{4}$', '1 Buchstabe, dann 4 Ziffern', 'B1042', 8],
      ['Paketkasten und Zustellfach', '^[0-9]{4}[A-Z]?$', '4 Ziffern, optional 1 Buchstabe', '2280A', 8],
      ['Zeitungsrohr und Nebenfach', '^[0-9]{3}$', '3 Ziffern', '417', 7],
      ['Briefkastenanlage Gewerbeobjekt', '^[A-Z]{2}[0-9]{3,4}$', '2 Buchstaben, dann 3 bis 4 Ziffern', 'GB2104', 9],
    ]),
  },
  {
    family: 'Zylinder- und Türschlösser',
    prefix: 'ZY',
    lines: buildFamily('ZY', 'Zylinder- und Türschloss', 'Profilschlüssel', [
      ['Profilzylinder Wohnungstür', '^[A-Z]{2}[0-9]{5}$', '2 Buchstaben, dann 5 Ziffern', 'PZ10488', 22],
      ['Profilzylinder Haustür mit Sicherungskarte', '^[A-Z]{2}[0-9]{6}$', '2 Buchstaben, dann 6 Ziffern', 'PZ104882', 29],
      ['Nebentür, Keller und Garage', '^[0-9]{5,6}$', '5 bis 6 Ziffern', '204881', 19],
      ['Rundzylinder und Ovalzylinder', '^[A-Z][0-9]{4,5}$', '1 Buchstabe, dann 4 bis 5 Ziffern', 'R20488', 21],
      ['Buntbartschloss Zimmertür', '^[0-9]{1,3}$', '1 bis 3 Ziffern', '24', 6],
      ['Zimmertür mit Chubb-Bart', '^[A-Z]?[0-9]{3,4}$', 'optional 1 Buchstabe, dann 3 bis 4 Ziffern', 'C482', 12],
    ]),
  },
  {
    family: 'Vorhänge- und Hebelschlösser',
    prefix: 'VH',
    lines: buildFamily('VH', 'Vorhänge- und Hebelschloss', 'Vorhängeschlossschlüssel', [
      ['Vorhängeschloss Tor und Zaun', '^[0-9]{3,4}$', '3 bis 4 Ziffern', '1120', 9],
      ['Vorhängeschloss Kette und Transport', '^[A-Z][0-9]{3}$', '1 Buchstabe, dann 3 Ziffern', 'T318', 9],
      ['Hebelschloss Automat und Kasse', '^[0-9]{4}$', '4 Ziffern', '7734', 9],
      ['Hebelschloss Schaltschrank', '^[A-Z]{2}[0-9]{2}$', '2 Buchstaben, dann 2 Ziffern', 'SS14', 9],
      ['Vorhängeschloss wetterfest Außenbereich', '^[0-9]{4}[A-Z]$', '4 Ziffern, dann 1 Buchstabe', '3140W', 10],
    ]),
  },
  {
    family: 'Technik-, Zähler- und Versorgungsschränke',
    prefix: 'TS',
    lines: buildFamily('TS', 'Technik- und Zählerschrank', 'Technikschlüssel', [
      ['Zählerschrank und Hausanschluss', '^[0-9]{3,4}$', '3 bis 4 Ziffern', '1242', 9],
      ['Schaltschrank Industrie', '^[A-Z]{1,2}[0-9]{2,4}$', '1 bis 2 Buchstaben, dann 2 bis 4 Ziffern', 'IND204', 10],
      ['Heizungs- und Technikraum', '^[0-9]{4}$', '4 Ziffern', '3188', 9],
      ['Aufzug- und Wartungsschrank', '^[A-Z][0-9]{3,4}$', '1 Buchstabe, dann 3 bis 4 Ziffern', 'A2140', 11],
      ['Verteilerkasten Außenbereich', '^[0-9]{3}[A-Z]?$', '3 Ziffern, optional 1 Buchstabe', '618B', 10],
    ]),
  },
  {
    family: 'Fenster- und Balkontechnik',
    prefix: 'FE',
    lines: buildFamily('FE', 'Fenster- und Balkontechnik', 'Fenstergriffschlüssel', [
      ['Abschließbarer Fenstergriff', '^[0-9]{3,4}$', '3 bis 4 Ziffern', '0421', 7],
      ['Balkon- und Terrassentür', '^[A-Z][0-9]{3}$', '1 Buchstabe, dann 3 Ziffern', 'B214', 8],
      ['Fensterzusatzschloss', '^[0-9]{4}$', '4 Ziffern', '5510', 9],
      ['Rollladen- und Gittersicherung', '^[A-Z]{2}[0-9]{3}$', '2 Buchstaben, dann 3 Ziffern', 'RG118', 9],
      ['Dachfenster und Lichtkuppel', '^[0-9]{3,4}$', '3 bis 4 Ziffern', '0742', 9],
    ]),
  },
  {
    family: 'Fahrzeugaufbauten und Anhänger',
    prefix: 'FA',
    lines: buildFamily('FA', 'Fahrzeugaufbau und Anhänger', 'Aufbauschlüssel', [
      ['Anhänger und Deichselschloss', '^[0-9]{3,4}$', '3 bis 4 Ziffern', '0918', 10],
      ['Wohnwagen und Wohnmobil Aufbautür', '^[A-Z]{1,2}[0-9]{3,4}$', '1 bis 2 Buchstaben, dann 3 bis 4 Ziffern', 'WM2104', 12],
      ['Serviceklappe und Gaskasten', '^[0-9]{3,5}$', '3 bis 5 Ziffern', '21104', 10],
      ['Koffer- und Pritschenaufbau', '^[A-Z][0-9]{4}$', '1 Buchstabe, dann 4 Ziffern', 'K2088', 11],
      ['Dachbox und Trägersystem', '^[A-Z]?[0-9]{3,4}$', 'optional 1 Buchstabe, dann 3 bis 4 Ziffern', 'N142', 10],
    ]),
  },
  {
    family: 'Maschinen und Sonderanwendungen',
    prefix: 'MA',
    lines: buildFamily('MA', 'Maschine und Sonderanwendung', 'Maschinenschlüssel', [
      ['Bau- und Landmaschine', '^[0-9]{3,5}$', '3 bis 5 Ziffern', '14401', 12],
      ['Flurförderzeug und Stapler', '^[A-Z]{1,2}[0-9]{3}$', '1 bis 2 Buchstaben, dann 3 Ziffern', 'ST104', 12],
      ['Automat und Warenausgabe', '^[0-9]{4}$', '4 Ziffern', '8820', 11],
      ['Aufzug-Notentriegelung', '^[A-Z][0-9]{2,3}$', '1 Buchstabe, dann 2 bis 3 Ziffern', 'N42', 14],
      ['Kompressor und Anlagenabdeckung', '^[A-Z]{2}[0-9]{3,4}$', '2 Buchstaben, dann 3 bis 4 Ziffern', 'KA1140', 12],
    ]),
  },
  {
    family: 'Gewerbe, Objekt und Außenanlagen',
    prefix: 'GO',
    lines: buildFamily('GO', 'Gewerbe und Außenanlage', 'Objektschlüssel', [
      ['Müll- und Containerstandplatz', '^[0-9]{3,4}$', '3 bis 4 Ziffern', '2204', 9],
      ['Schranke und Poller', '^[A-Z]{2}[0-9]{2,4}$', '2 Buchstaben, dann 2 bis 4 Ziffern', 'SR2140', 12],
      ['Tiefgaragentor und Zufahrt', '^[A-Z][0-9]{4}$', '1 Buchstabe, dann 4 Ziffern', 'G1180', 12],
      ['Gartenhaus und Nebengebäude', '^[0-9]{3}$', '3 Ziffern', '304', 8],
      ['Sport- und Vereinsanlage', '^[A-Z][0-9]{3,4}$', '1 Buchstabe, dann 3 bis 4 Ziffern', 'V1204', 9],
    ]),
  },
];

function buildFamily(
  prefix: string,
  applicationBase: string,
  keyType: string,
  rows: Array<[application: string, pattern: string, formatLabel: string, example: string, priceEuro: number]>,
): LineSpec[] {
  return rows.map(([application, pattern, formatLabel, example, priceEuro], index) => ({
    code: `${prefix}-${String(index + 1).padStart(2, '0')}`,
    name: `${application} — Serie ${prefix}-${String(index + 1).padStart(2, '0')}`,
    application: `${applicationBase}: ${application}`,
    keyType,
    pattern,
    formatLabel,
    example,
    hint: `Der Code steht meist direkt auf dem Schloss oder auf dem Schlüsselkopf. Erwartetes Format: ${formatLabel}.`,
    where:
      'Beispielbild: Fundstelle des Codes auf Schloss und Schlüssel, Nahaufnahme mit lesbarer Prägung.',
    priceCents: priceEuro * 100,
    photo: 'optional',
    tags: [applicationBase, keyType, prefix],
  }));
}

export function codeLines(): CodeLine[] {
  const out: CodeLine[] = [];

  for (const family of FAMILIES) {
    for (const line of family.lines) {
      const slug = line.code.toLowerCase();
      out.push({
        id: slug,
        slug,
        name: line.name,
        manufacturer: '[Hersteller eintragen]',
        application: line.application,
        keyType: line.keyType,
        description:
          `Nachschlüssel für ${line.application.toLowerCase()}. Die Fertigung erfolgt anhand des ` +
          'aufgedruckten Codes — Sie müssen Ihren Originalschlüssel nicht einsenden. ' +
          'Bitte prüfen Sie den Code vor dem Absenden sorgfältig, da die Anfertigung ' +
          'nach Ihrer Angabe erfolgt.',
        codeFormatLabel: line.formatLabel,
        codePattern: line.pattern,
        codeExample: line.example,
        codeHint: line.hint,
        codeLocationImage: {
          motif: `Beispielbild Codefundstelle ${line.code}`,
          ratio: '4/3',
          note: line.where,
        },
        productImage: {
          motif: `Produktfoto Schlüssel Serie ${line.code}`,
          ratio: '1/1',
          note: 'Echtes Produktfoto vor neutralem Hintergrund.',
        },
        priceCents: line.priceCents,
        bulkPrices: [
          { minQty: 3, priceCents: Math.round(line.priceCents * 0.9) },
          { minQty: 5, priceCents: Math.round(line.priceCents * 0.82) },
        ],
        scope: '1 Schlüssel je Stück, gefertigt nach angegebenem Code.',
        maxQty: 20,
        photoUpload: line.photo,
        photoUploadHint:
          'Ein Foto ist freiwillig. Es hilft uns, Profil und Beschriftung vor der Fertigung abzugleichen.',
        shippingClass: 'code-schluessel',
        active: true,
        tags: [...line.tags, family.family],
        seo: {
          title: `${line.name} nach Code bestellen`,
          description:
            `Nachschlüssel für ${line.application.toLowerCase()} nach Code bestellen. ` +
            'Ohne Einsendung des Originalschlüssels. Codeformat: ' +
            `${line.formatLabel}.`,
          internalLinks: [
            { href: '/schluessel-nach-code', label: 'Alle Codelinien ansehen' },
            { href: '/schluessel-nach-vorlage', label: 'Kein Code vorhanden? Schlüssel nach Vorlage' },
          ],
        },
      });
    }
  }

  return out;
}

/** Codelinien nach Anwendungsfamilie gruppiert — für Filter und Navigation. */
export function codeLineFamilies(): string[] {
  return FAMILIES.map((f) => f.family);
}
