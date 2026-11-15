/*
 * Fahrzeugklassen der Unterlagen-Pflicht (FA-KERN-02, A-048): Kennungen, Bezeichnungen und je Klasse,
 * ob eine Zulassungsbescheinigung Teil I verlangt wird oder ein Ersatznachweis erlaubt ist. Reine Daten
 * und Typen ohne React, im Browser und auf dem Server nutzbar. Die Regel selbst steht in
 * src/lib/server/unterlagen-pflicht.ts; die gemeinsame Anfrage für alle Klassen baut FA-KERN-02B.
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
