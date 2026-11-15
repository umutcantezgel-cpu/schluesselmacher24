/*
 * Fahrzeugklassen der Unterlagen-Pflicht (FA-KERN-02, A-048): Kennungen, Bezeichnungen und je Klasse,
 * ob eine Zulassungsbescheinigung Teil I verlangt wird oder ein Ersatznachweis erlaubt ist. Reine Daten
 * und Typen ohne React, im Browser und auf dem Server nutzbar. Die Regel selbst steht in
 * src/lib/server/unterlagen-pflicht.ts.
 *
 * Seit FA-KERN-02B steht hier auch, was die gemeinsame Fahrzeugschlüssel-Anfrage je Klasse braucht
 * (ANFRAGE_FORMULAR: Adressen, Felder, Chip-Frage, Hilfetexte, Schalter für die Indexierung) und die
 * Kopftexte der neuen Seiten (KLASSEN_SEITEN). Welche Unterlagen Pflicht sind, steht nicht hier, sondern
 * allein in der Pflichtregel.
 *
 * Der Ersatzweg steht nur Klassen ohne Zulassungsbescheinigung offen, nie Auto oder Motorrad (R13: kein
 * Weg schwächt den Nachweis). Welche Ersatznachweise der Betrieb anerkennt, entscheidet der Inhaber;
 * die Liste ERSATZNACHWEISE ist die eine Stelle dafür.
 */

/** Kennungen der Klassen, genau so in der Pflichtregel und in der gemeinsamen Anfrage. */
export const ANFRAGE_KLASSEN = ['auto', 'motorrad', 'roller', 'e-scooter', 'seniorenmobil', 'fahrrad', 'nicht-gefunden'] as const;

export type AnfrageKlasse = (typeof ANFRAGE_KLASSEN)[number];

/**
 * Nachweis der Klasse:
 * - `zulassung`: Zulassungsbescheinigung Teil I ist Pflicht.
 * - `ersatz`: Ersatznachweis statt Zulassungsbescheinigung.
 * - `wahl`: Der Kunde wählt (Roller: zugelassen oder mit Versicherungskennzeichen), die Regel folgt der Wahl.
 */
export type KlassenNachweis = 'zulassung' | 'ersatz' | 'wahl';

/** Ersatznachweise für Kleinstfahrzeuge ohne Zulassungsbescheinigung (Vorschlag, Freigabe durch den Inhaber). */
export const ERSATZNACHWEIS_ARTEN = ['betriebserlaubnis', 'versicherungsbescheinigung', 'kaufbeleg', 'codekarte'] as const;

export type ErsatznachweisArt = (typeof ERSATZNACHWEIS_ARTEN)[number];

export const ERSATZNACHWEISE: Readonly<Record<ErsatznachweisArt, { titel: string; satz: string }>> = {
  betriebserlaubnis: {
    titel: 'Betriebserlaubnis oder Datenbestätigung',
    satz: 'Das Blatt zum Fahrzeug mit Hersteller, Typ und Fahrzeug-Identifizierungsnummer.',
  },
  versicherungsbescheinigung: {
    titel: 'Versicherungsbescheinigung',
    satz: 'Die Bescheinigung zum Versicherungskennzeichen, mit Ihrem Namen.',
  },
  kaufbeleg: {
    titel: 'Kaufbeleg',
    satz: 'Rechnung oder Kaufvertrag, auf dem Sie als Käufer stehen.',
  },
  codekarte: {
    titel: 'Codekarte des Schlosses',
    satz: 'Die Karte mit der Schlüsselnummer, die beim Kauf des Schlosses dabei war.',
  },
};

/** Wahl beim Roller: zugelassen (Fahrzeugschein) oder mit Versicherungskennzeichen (Ersatznachweis). */
export type RollerNachweis = 'zulassung' | 'versicherungskennzeichen';

export interface AnfrageKlasseDaten {
  kennung: AnfrageKlasse;
  bezeichnung: string;
  nachweis: KlassenNachweis;
  /** Anerkannte Ersatznachweise, wenn der Ersatzweg offen ist; sonst leer. */
  ersatznachweise: readonly ErsatznachweisArt[];
  /** Foto des Typenschilds oder Angabe der Fahrzeug-Identifizierungsnummer, wo es eines gibt. */
  typenschild: boolean;
  /** Fahrrad: Schlüssel eines Schlosses, dazu Hersteller und Schlüsselnummer des Schlosses. */
  schloss: boolean;
}

export const ANFRAGE_KLASSEN_DATEN: Readonly<Record<AnfrageKlasse, AnfrageKlasseDaten>> = {
  auto: { kennung: 'auto', bezeichnung: 'Auto', nachweis: 'zulassung', ersatznachweise: [], typenschild: false, schloss: false },
  motorrad: { kennung: 'motorrad', bezeichnung: 'Motorrad', nachweis: 'zulassung', ersatznachweise: [], typenschild: false, schloss: false },
  roller: {
    kennung: 'roller',
    bezeichnung: 'Roller, Mofa oder Moped',
    nachweis: 'wahl',
    ersatznachweise: ['betriebserlaubnis', 'versicherungsbescheinigung', 'kaufbeleg'],
    typenschild: true,
    schloss: false,
  },
  'e-scooter': {
    kennung: 'e-scooter',
    bezeichnung: 'E-Scooter und ähnliche Elektrofahrzeuge',
    nachweis: 'ersatz',
    ersatznachweise: ['betriebserlaubnis', 'versicherungsbescheinigung', 'kaufbeleg'],
    typenschild: true,
    schloss: false,
  },
  seniorenmobil: {
    kennung: 'seniorenmobil',
    bezeichnung: 'Seniorenmobil und vergleichbare Fahrzeuge',
    nachweis: 'ersatz',
    ersatznachweise: ['betriebserlaubnis', 'versicherungsbescheinigung', 'kaufbeleg'],
    typenschild: true,
    schloss: false,
  },
  fahrrad: {
    kennung: 'fahrrad',
    bezeichnung: 'Fahrradschloss',
    nachweis: 'ersatz',
    ersatznachweise: ['kaufbeleg', 'codekarte'],
    typenschild: false,
    schloss: true,
  },
  // Fahrzeug nicht gefunden: verlangt, was ein Auto verlangt.
  'nicht-gefunden': { kennung: 'nicht-gefunden', bezeichnung: 'Fahrzeug nicht gefunden', nachweis: 'zulassung', ersatznachweise: [], typenschild: false, schloss: false },
};

/** Ist der Wert eine bekannte Klasse? */
export function istAnfrageKlasse(wert: unknown): wert is AnfrageKlasse {
  return typeof wert === 'string' && (ANFRAGE_KLASSEN as readonly string[]).includes(wert);
}

/** Verlangt die Klasse in diesem Fall den Fahrzeugschein? Beim Roller folgt die Antwort der Wahl des Kunden. */
export function verlangtZulassung(klasse: AnfrageKlasse, roller?: RollerNachweis | null): boolean {
  const daten = ANFRAGE_KLASSEN_DATEN[klasse];
  if (daten.nachweis === 'zulassung') return true;
  if (daten.nachweis === 'ersatz') return false;
  // Roller ohne Angabe: wie zugelassen, also mit Fahrzeugschein. Der Ersatzweg braucht die ausdrückliche Wahl.
  return roller !== 'versicherungskennzeichen';
}

/** Quelle der gemeinsamen Fahrzeug-Anfrage (FA-KERN-02B); der Server prüft sie mit derselben Pflichtregel. */
export const FAHRZEUG_ANFRAGE_QUELLE = 'fahrzeug-anfrage';

/** Klasse eines Vorgangs der gemeinsamen Anfrage als Text für Admin und Vorgangsblatt; sonst `null`. */
export function fahrzeugklasseText(payload: Record<string, unknown> | null | undefined): string | null {
  if (!payload || payload.quelle !== FAHRZEUG_ANFRAGE_QUELLE || !istAnfrageKlasse(payload.klasse)) return null;
  const klasse = ANFRAGE_KLASSEN_DATEN[payload.klasse];
  if (payload.klasse !== 'roller') return klasse.bezeichnung;
  return `${klasse.bezeichnung}, ${payload.roller === 'versicherungskennzeichen' ? 'mit Versicherungskennzeichen' : 'mit Fahrzeugschein'}`;
}

/* ==========================================================================
   Gemeinsame Fahrzeugschlüssel-Anfrage (FA-KERN-02B, A-048)
   Ein Formular für alle Klassen außer dem Auto-Termin. Hier steht je Klasse nur, was das Formular
   und die Seiten brauchen; die Pflichtunterlagen bestimmt die Pflichtregel (unterlagen-pflicht.ts).
   ========================================================================== */

/** Klassen mit eigener Anfrage; das Auto hat den Termin-Assistenten. */
export type FormularKlasse = Exclude<AnfrageKlasse, 'auto'>;

export const FORMULAR_KLASSEN: readonly FormularKlasse[] = ['motorrad', 'roller', 'e-scooter', 'seniorenmobil', 'fahrrad', 'nicht-gefunden'];

/** Adresse von „Fahrzeug nicht gefunden?“ an jeder Fahrzeugsuche. */
export const NICHT_GEFUNDEN_ADRESSE = '/autoschluessel/fahrzeug-nicht-gefunden';

export interface FahrzeugFeld {
  label: string;
  hinweis: string;
  pflicht: boolean;
  max: number;
}

export interface AnfrageFormularDaten {
  klasse: FormularKlasse;
  /** Adresse der Anfrage. */
  anfrage: string;
  /** Adresse der Einstiegsseite; „nicht gefunden“ hat keine. */
  einstieg: string | null;
  /**
   * Schalter je Klasse: Einstiegsseite und Anfrage stehen auf noindex und fehlen in der Sitemap, solange
   * er aus ist. Der Orchestrator schaltet ihn ein, wenn er die Seiten freigibt.
   */
  indexierbar: boolean;
  /** Überschrift des Ablaufs für die Fortschrittsanzeige. */
  titel: string;
  /** Erster Schritt: Frage, Hinweis und Kurzform. */
  fahrzeugFrage: string;
  fahrzeugHinweis: string;
  fahrzeugKurz: string;
  hersteller: FahrzeugFeld | null;
  modell: FahrzeugFeld | null;
  baujahr: 'pflicht' | 'freiwillig' | null;
  /** Katalogsuche der Krafträder aus FZ 2 (A-047) als Erleichterung; die freie Eingabe bleibt. */
  katalog: 'kraftrad' | null;
  /** Wird die Frage nach dem Chip im Schlüssel gestellt? */
  chip: boolean;
  /** Beispiel im Feld Beschreibung. */
  beschreibungBeispiel: string;
  /** Titel der Bestätigung und Weg zurück. */
  bestaetigung: string;
  zurueck: { href: string; label: string };
}

const HERSTELLER: FahrzeugFeld = { label: 'Hersteller', hinweis: 'So, wie er im Fahrzeugschein oder auf dem Typenschild steht.', pflicht: true, max: 60 };
const TYP: FahrzeugFeld = { label: 'Modell oder Typ', hinweis: 'So genau wie möglich, zum Beispiel mit Zusatz.', pflicht: true, max: 80 };

export const ANFRAGE_FORMULAR: Readonly<Record<FormularKlasse, AnfrageFormularDaten>> = {
  motorrad: {
    klasse: 'motorrad',
    anfrage: '/motorradschluessel/anfrage',
    einstieg: '/motorradschluessel',
    indexierbar: true,
    titel: 'Motorradschlüssel: Anfrage',
    fahrzeugFrage: 'Welches Motorrad ist es?',
    fahrzeugHinweis: 'Suchen Sie Ihr Motorrad oder tragen Sie Hersteller und Typ so ein, wie sie im Fahrzeugschein stehen.',
    fahrzeugKurz: 'Motorrad',
    hersteller: HERSTELLER,
    modell: TYP,
    baujahr: 'pflicht',
    katalog: 'kraftrad',
    chip: true,
    beschreibungBeispiel: 'Zweitschlüssel gewünscht, der einzige Schlüssel ist abgebrochen.',
    bestaetigung: 'Ihre Motorrad-Anfrage ist bei uns',
    zurueck: { href: '/motorradschluessel', label: 'Zurück zum Motorradschlüssel' },
  },
  roller: {
    klasse: 'roller',
    anfrage: '/roller-und-kleinstfahrzeuge/anfrage',
    einstieg: '/roller-und-kleinstfahrzeuge',
    indexierbar: false,
    titel: 'Roller, Mofa oder Moped: Anfrage',
    fahrzeugFrage: 'Welcher Roller ist es?',
    fahrzeugHinweis: 'Suchen Sie Ihr Fahrzeug oder tragen Sie Hersteller und Typ selbst ein. Sagen Sie uns dann, ob es einen Fahrzeugschein hat.',
    fahrzeugKurz: 'Fahrzeug',
    hersteller: HERSTELLER,
    modell: TYP,
    baujahr: 'freiwillig',
    katalog: 'kraftrad',
    chip: true,
    beschreibungBeispiel: 'Zweitschlüssel gewünscht, der Schlüssel klemmt im Zündschloss.',
    bestaetigung: 'Ihre Anfrage zum Roller ist bei uns',
    zurueck: { href: '/roller-und-kleinstfahrzeuge', label: 'Zurück zu Roller und Kleinstfahrzeugen' },
  },
  'e-scooter': {
    klasse: 'e-scooter',
    anfrage: '/e-scooter/anfrage',
    einstieg: '/e-scooter',
    indexierbar: false,
    titel: 'E-Scooter: Anfrage',
    fahrzeugFrage: 'Welches Fahrzeug ist es?',
    fahrzeugHinweis: 'Hersteller und Typ stehen auf dem Typenschild, in der Bedienungsanleitung oder auf dem Kaufbeleg.',
    fahrzeugKurz: 'Fahrzeug',
    hersteller: HERSTELLER,
    modell: TYP,
    baujahr: 'freiwillig',
    katalog: null,
    chip: false,
    beschreibungBeispiel: 'Zweitschlüssel für das Schloss am Akku gewünscht.',
    bestaetigung: 'Ihre Anfrage zum E-Scooter ist bei uns',
    zurueck: { href: '/e-scooter', label: 'Zurück zu E-Scootern' },
  },
  seniorenmobil: {
    klasse: 'seniorenmobil',
    anfrage: '/seniorenmobile/anfrage',
    einstieg: '/seniorenmobile',
    indexierbar: false,
    titel: 'Seniorenmobil: Anfrage',
    fahrzeugFrage: 'Welches Fahrzeug ist es?',
    fahrzeugHinweis: 'Hersteller und Typ stehen auf dem Typenschild, in der Bedienungsanleitung oder auf dem Kaufbeleg.',
    fahrzeugKurz: 'Fahrzeug',
    hersteller: HERSTELLER,
    modell: TYP,
    baujahr: 'freiwillig',
    katalog: null,
    chip: false,
    beschreibungBeispiel: 'Der einzige Schlüssel ist verloren, wir brauchen einen neuen.',
    bestaetigung: 'Ihre Anfrage zum Seniorenmobil ist bei uns',
    zurueck: { href: '/seniorenmobile', label: 'Zurück zu Seniorenmobilen' },
  },
  fahrrad: {
    klasse: 'fahrrad',
    anfrage: '/fahrradschluessel/anfrage',
    einstieg: '/fahrradschluessel',
    indexierbar: false,
    titel: 'Fahrradschlüssel: Anfrage',
    fahrzeugFrage: 'Um welches Schloss geht es?',
    fahrzeugHinweis: 'Hersteller und Schlüsselnummer stehen oft auf dem Schlüssel, auf dem Schloss oder auf der Codekarte.',
    fahrzeugKurz: 'Schloss',
    hersteller: null,
    modell: { label: 'Schlossart oder Modell (freiwillig)', hinweis: 'Zum Beispiel Rahmenschloss, Bügelschloss oder Schloss am Akku.', pflicht: false, max: 80 },
    baujahr: null,
    katalog: null,
    chip: false,
    beschreibungBeispiel: 'Zweitschlüssel für das Rahmenschloss gewünscht.',
    bestaetigung: 'Ihre Anfrage zum Fahrradschloss ist bei uns',
    zurueck: { href: '/fahrradschluessel', label: 'Zurück zum Fahrradschlüssel' },
  },
  'nicht-gefunden': {
    klasse: 'nicht-gefunden',
    anfrage: NICHT_GEFUNDEN_ADRESSE,
    einstieg: null,
    indexierbar: false,
    titel: 'Fahrzeug nicht gefunden: Anfrage',
    fahrzeugFrage: 'Um welches Fahrzeug geht es?',
    fahrzeugHinweis: 'Tragen Sie Marke, Modell und Baujahr so ein, wie sie im Fahrzeugschein stehen.',
    fahrzeugKurz: 'Fahrzeug',
    hersteller: { label: 'Marke', hinweis: 'So, wie sie im Fahrzeugschein steht.', pflicht: true, max: 60 },
    modell: { label: 'Modell', hinweis: 'So genau wie möglich, zum Beispiel mit Ausstattung.', pflicht: true, max: 80 },
    baujahr: 'pflicht',
    katalog: null,
    chip: true,
    beschreibungBeispiel: 'Zweitschlüssel gewünscht, das Fahrzeug war in der Suche nicht dabei.',
    bestaetigung: 'Ihre Fahrzeug-Anfrage ist bei uns',
    zurueck: { href: '/autoschluessel', label: 'Zurück zu Autoschlüsseln' },
  },
};

/**
 * Filter der Vorgangsliste im Admin je Klasse (FA-KERN-02B: „im Admin nach Klasse finden“). Die Klasse steht
 * gespeichert in `daten.klasse`; die Liste filtert danach über die Adresse. Die Werkzeuge über der Liste
 * zeigen diese Verweise, damit niemand die Adresse von Hand bauen muss.
 */
export function klassenFilter(klasse: FormularKlasse): { where: { 'daten.klasse': { equals: FormularKlasse } }; suche: string } {
  return { where: { 'daten.klasse': { equals: klasse } }, suche: `?where[daten.klasse][equals]=${encodeURIComponent(klasse)}` };
}

/** Ist die Klasse eine mit eigener Anfrage? */
export function istFormularKlasse(wert: unknown): wert is FormularKlasse {
  return typeof wert === 'string' && (FORMULAR_KLASSEN as readonly string[]).includes(wert);
}

/* ---------- Kopftexte der neuen Seiten ------------------------------------
   Gleichlautend in content/seo.json und im Rückfall pages() (src/lib/data/defaults/content.ts),
   den die Seiten nutzen, wenn die Datenschicht nichts liefert. Titel samt Marke höchstens 60 Zeichen,
   Beschreibung 120 bis 160 Zeichen, ohne Gedankenstriche (FA-SEO-01A). Das Motorrad behält seine Texte. */

export interface SeitenKopf {
  route: string;
  headline: string;
  subline: string;
  intro: string;
  title: string;
  description: string;
}

export const KLASSEN_SEITEN: Readonly<Record<Exclude<FormularKlasse, 'motorrad'>, { einstieg: SeitenKopf | null; anfrage: SeitenKopf }>> = {
  roller: {
    einstieg: {
      route: 'roller-und-kleinstfahrzeuge',
      headline: 'Schlüssel für Roller, Mofa und Moped',
      subline: 'Anfrage mit Fahrzeugschein oder einem anderen Nachweis und drei Fotos Ihres Schlüssels. Wir prüfen Ihre Angaben und melden uns.',
      intro: 'Ob mit Fahrzeugschein oder mit Versicherungskennzeichen: Sie senden uns Ihre Angaben, Fotos und einen Nachweis. Wir prüfen, was möglich ist.',
      title: 'Rollerschlüssel und Mopedschlüssel',
      description: 'Schlüssel für Roller, Mofa oder Moped anfragen: mit Fahrzeugschein oder Versicherungskennzeichen, drei Fotos des Schlüssels und kurzer Beschreibung.',
    },
    anfrage: {
      route: 'roller-und-kleinstfahrzeuge/anfrage',
      headline: 'Schlüssel für Roller, Mofa oder Moped anfragen',
      subline: 'Sechs Schritte: Fahrzeug, Schlüssel, Unterlagen, Beschreibung, Kontakt und Absenden. Mit der Anfrage entsteht noch kein Vertrag.',
      intro: '',
      title: 'Roller, Mofa oder Moped: Anfrage',
      description: 'Anfrage für einen Rollerschlüssel: Hersteller und Typ, Fahrzeugschein oder Nachweis zum Versicherungskennzeichen, drei Fotos des Schlüssels.',
    },
  },
  'e-scooter': {
    einstieg: {
      route: 'e-scooter',
      headline: 'Schlüssel für E-Scooter und ähnliche Elektrofahrzeuge',
      subline: 'Anfrage mit einem Nachweis zum Fahrzeug und drei Fotos Ihres Schlüssels. Wir prüfen Ihre Angaben und melden uns.',
      intro: 'E-Scooter haben keinen Fahrzeugschein. Sie senden uns deshalb einen anderen Nachweis, dazu Typenschild oder Fahrzeug-Identifizierungsnummer.',
      title: 'Schlüssel für E-Scooter anfragen',
      description: 'Schlüssel für E-Scooter und ähnliche Elektrofahrzeuge anfragen: Nachweis statt Fahrzeugschein, Typenschild, drei Fotos des Schlüssels.',
    },
    anfrage: {
      route: 'e-scooter/anfrage',
      headline: 'Schlüssel für E-Scooter anfragen',
      subline: 'Sechs Schritte: Fahrzeug, Schlüssel, Unterlagen, Beschreibung, Kontakt und Absenden. Mit der Anfrage entsteht noch kein Vertrag.',
      intro: '',
      title: 'E-Scooter: Anfrage mit Nachweis',
      description: 'Anfrage für den Schlüssel eines E-Scooters: Hersteller und Typ, ein Nachweis wie Kaufbeleg oder Datenbestätigung, Typenschild und drei Fotos.',
    },
  },
  seniorenmobil: {
    einstieg: {
      route: 'seniorenmobile',
      headline: 'Schlüssel für Seniorenmobile und vergleichbare Fahrzeuge',
      subline: 'Anfrage mit einem Nachweis zum Fahrzeug und drei Fotos Ihres Schlüssels. Wir prüfen Ihre Angaben und melden uns.',
      intro: 'Seniorenmobile haben meist keinen Fahrzeugschein. Sie senden uns deshalb einen anderen Nachweis, dazu Typenschild oder Fahrzeug-Identifizierungsnummer.',
      title: 'Schlüssel für Seniorenmobile',
      description: 'Schlüssel für Seniorenmobil, Elektromobil oder Krankenfahrstuhl anfragen: Nachweis zum Fahrzeug, Typenschild und drei Fotos des Schlüssels.',
    },
    anfrage: {
      route: 'seniorenmobile/anfrage',
      headline: 'Schlüssel für ein Seniorenmobil anfragen',
      subline: 'Sechs Schritte: Fahrzeug, Schlüssel, Unterlagen, Beschreibung, Kontakt und Absenden. Mit der Anfrage entsteht noch kein Vertrag.',
      intro: '',
      title: 'Seniorenmobil: Anfrage mit Nachweis',
      description: 'Anfrage für den Schlüssel eines Seniorenmobils: Hersteller und Typ, Betriebserlaubnis, Versicherungsbescheinigung oder Kaufbeleg und drei Fotos.',
    },
  },
  fahrrad: {
    einstieg: {
      route: 'fahrradschluessel',
      headline: 'Schlüssel für Fahrradschlösser',
      subline: 'Anfrage mit Hersteller und Schlüsselnummer des Schlosses, einem Nachweis und drei Fotos Ihres Schlüssels.',
      intro: 'Beim Fahrradschlüssel zählt das Schloss, nicht das Fahrrad. Hersteller und Schlüsselnummer helfen uns, den passenden Schlüssel zu finden.',
      title: 'Fahrradschlüssel nachmachen lassen',
      description: 'Schlüssel für Ihr Fahrradschloss anfragen: Hersteller und Schlüsselnummer, Kaufbeleg oder Codekarte und drei Fotos des Schlüssels genügen uns.',
    },
    anfrage: {
      route: 'fahrradschluessel/anfrage',
      headline: 'Fahrradschlüssel anfragen',
      subline: 'Sechs Schritte: Schloss, Schlüssel, Unterlagen, Beschreibung, Kontakt und Absenden. Mit der Anfrage entsteht noch kein Vertrag.',
      intro: '',
      title: 'Fahrradschlüssel: Anfrage',
      description: 'Anfrage für einen Fahrradschlüssel: Hersteller und Schlüsselnummer des Schlosses, Kaufbeleg oder Codekarte und drei Fotos Ihres Schlüssels.',
    },
  },
  'nicht-gefunden': {
    einstieg: null,
    anfrage: {
      route: 'autoschluessel/fahrzeug-nicht-gefunden',
      headline: 'Fahrzeug nicht gefunden? Anfrage stellen',
      subline: 'Ihr Fahrzeug ist in unserer Suche nicht dabei? Senden Sie uns Fahrzeugdaten, Fahrzeugschein, drei Fotos des Schlüssels und eine kurze Beschreibung.',
      intro: '',
      title: 'Fahrzeug nicht gefunden: Anfrage',
      description: 'Ihr Fahrzeug ist nicht in unserer Suche? Senden Sie Marke, Modell, Baujahr, Fahrzeugschein, drei Fotos des Schlüssels und eine kurze Beschreibung.',
    },
  },
};

/** Kopftext einer Seite der gemeinsamen Anfrage nach Route; `null` für das Motorrad und Unbekanntes. */
export function klassenSeite(route: string): SeitenKopf | null {
  for (const seiten of Object.values(KLASSEN_SEITEN)) {
    if (seiten.einstieg?.route === route) return seiten.einstieg;
    if (seiten.anfrage.route === route) return seiten.anfrage;
  }
  return null;
}
