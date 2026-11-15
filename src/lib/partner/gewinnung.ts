/*
 * Partnergewinnung (FA-08-01 bis FA-08-08, FA-07-01, FA-07-02): Texte der Startseiten-Sektion und
 * der vier Seiten unter /partner-werden als Daten. Jede Seite hat ein eigenes Anliegen (R2, R3):
 * Aufträge erhalten, Netzwerk Deutschland, Kfz-Betriebe, Kooperation. Die Bewerbung bleibt auf
 * /partner-werden. Grundlage ist die Arbeitsanweisung des Inhabers vom 11.11.2026 (Abschnitte 05,
 * 07 und 08). Nichts erfunden (R4): keine Provisionssätze, keine Partnerzahlen, keine Fristen,
 * keine Siegel. Was noch nicht feststeht, regelt der Partnervertrag (Entwurf bis MA-29).
 */

import type { RubrikSchritt } from '../types';

import type { Abrechnungsmodell } from './abrechnung';

export interface GewinnungVerweis {
  href: string;
  label: string;
}

export interface GewinnungPunkt {
  titel: string;
  text: string;
}

/** Gemeinsame Bausteine: in voller Länge höchstens auf zwei Seiten (R2), sonst als Verweis. */
export type GewinnungBaustein = 'leistungen' | 'qualitaet';

export interface GewinnungAbschnitt {
  /** Kennung des Abschnitts, eindeutig über alle Seiten (Anker und `aria-labelledby`). */
  id: string;
  augenbraue: string;
  ueberschrift: string;
  einleitung?: string;
  absaetze?: string[];
  punkte?: GewinnungPunkt[];
  liste?: string[];
  baustein?: GewinnungBaustein;
  verweis?: GewinnungVerweis;
}

export type GewinnungSlug = 'auftraege-erhalten' | 'netzwerk-deutschland' | 'kfz-betriebe' | 'kooperation';

export interface GewinnungSeite {
  slug: GewinnungSlug;
  /** Pfad ab Wurzel, zugleich Canonical. */
  pfad: string;
  /** Kurzname für Brotkrumen und Verweislisten. */
  kurzname: string;
  /** Ein Satz für Verweislisten auf anderen Partnerseiten. */
  kurztext: string;
  /** Seitentitel für Suchmaschinen (höchstens 60 Zeichen, ohne Markenzusatz). */
  titel: string;
  /** Beschreibung für Suchmaschinen (120 bis 160 Zeichen). */
  beschreibung: string;
  augenbraue: string;
  ueberschrift: string;
  einleitung: string;
  /** Ablauf mit Stationen (nur „Aufträge erhalten“): Liste und Grafik. */
  ablauf?: {
    augenbraue: string;
    ueberschrift: string;
    einleitung: string;
    /** Beschriftungen der Grafik, je höchstens 14 Zeichen (Generator `ablauf`). */
    stationen: string[];
    schritte: RubrikSchritt[];
  };
  abschnitte: GewinnungAbschnitt[];
  naechsterSchritt: {
    ueberschrift: string;
    text: string;
    primaer: GewinnungVerweis;
    sekundaer?: GewinnungVerweis;
  };
}

export const PARTNER_HAUPTSEITE = '/partner-werden';
export const PARTNER_BEWERBUNG = '/partner-werden#bewerbung';

/** Klarstellung auf jeder Partnerseite (FA-07-02). */
export const NUR_FAHRZEUGSCHLUESSEL = {
  titel: 'Nur Autoschlüssel und Fahrzeugschlüssel',
  text:
    'Das Partnernetz betrifft ausschließlich Autoschlüssel und Fahrzeugschlüssel. Türöffnungen eines '
    + 'Schlüsseldienstes an Wohnungen, Häusern oder Geschäftsräumen gehören nicht dazu.',
};

/** Partnerleistungen nach der Liste des Inhabers (Abschnitt 07, FA-07-04 bis FA-07-12). */
export const PARTNER_LEISTUNGEN: GewinnungPunkt[] = [
  { titel: 'Autoschlüssel nachmachen', text: 'Zweitschlüssel und Ersatzschlüssel nach Fahrzeug oder Vorlage.' },
  { titel: 'Programmierung und Anlernen', text: 'Schlüssel am Fahrzeug anlernen, auch nach einem Steuergerätetausch.' },
  { titel: 'Schlüsselverlust', text: 'Neuer Schlüssel, wenn keiner mehr da ist.' },
  { titel: 'Keyless und Smart Key', text: 'Schlüssellose Zugangs- und Startsysteme.' },
  { titel: 'Transponder', text: 'Der Chip für die Wegfahrsperre.' },
  { titel: 'Funk', text: 'Fernbedienung zum Ver- und Entriegeln.' },
  { titel: 'Fahrzeugöffnung', text: 'Nur im Zusammenhang mit Autoschlüsseln, etwa wenn der Schlüssel im Fahrzeug liegt.' },
  { titel: 'Reparaturen und Gehäuse', text: 'Defekte Tasten, gebrochene Gehäuse, Gehäusetausch.' },
  { titel: 'Motorrad und weitere Fahrzeugschlüssel', text: 'Sofern der Partner dies anbietet.' },
];

/** Qualitätsstandard vor der Freischaltung (Abschnitt 07, FA-07-13 bis FA-07-19). */
export const PARTNER_QUALITAET: GewinnungPunkt[] = [
  { titel: 'Betrieb und Identität', text: 'Wir prüfen, wer hinter dem Betrieb steht und ob er angemeldet ist.' },
  { titel: 'Leistungen und Fahrzeuge', text: 'Wir halten fest, welche Leistungen Sie anbieten und welche Fahrzeuge Sie abdecken.' },
  { titel: 'Ausstattung', text: 'Wir erfassen Maschinen, Programmiergeräte und Werkstattausstattung.' },
  { titel: 'Region und Radius', text: 'Wir erfassen Ihren Standort und den Radius, in dem Sie mobil arbeiten.' },
  { titel: 'Besuch vor Ort', text: 'Vor der endgültigen Freischaltung besuchen wir den Betrieb nach Möglichkeit persönlich.' },
  { titel: 'Schriftlicher Standard', text: 'Der Qualitätsstandard wird schriftlich festgehalten. Nur geeignete Betriebe werden aktive Partner.' },
  { titel: 'Pausieren und Sperren', text: 'Bei Qualitätsproblemen kann ein Partner pausiert oder gesperrt werden.' },
];

/**
 * Bundesländer, in denen Partner gesucht werden (Anhang A der Arbeitsanweisung nennt alle 16).
 * Nur die Übersicht, keine Reihenfolge, keine Zahlen (G13) und keine Aussage über bestehende Partner.
 */
export const PARTNER_REGIONEN = [
  'Baden-Württemberg',
  'Bayern',
  'Berlin',
  'Brandenburg',
  'Bremen',
  'Hamburg',
  'Hessen',
  'Mecklenburg-Vorpommern',
  'Niedersachsen',
  'Nordrhein-Westfalen',
  'Rheinland-Pfalz',
  'Saarland',
  'Sachsen',
  'Sachsen-Anhalt',
  'Schleswig-Holstein',
  'Thüringen',
] as const;

/*
 * Zahlweg der Partneraufträge (G9, MA-09). Öffentliche Texte folgen dem Modell, das im Code gilt
 * (`src/lib/partner/abrechnung.ts`): Modell A ist aktiv, der Partner rechnet selbst mit dem Kunden
 * ab und SCHLÜSSELMACHER24 stellt ihm die Vermittlungsprovision in Rechnung. Modell B (zentrale
 * Vereinnahmung, Freigabe nach Zahlung, Auszahlung nach Bestätigung, Abschnitt 05 des Inhabers)
 * erscheint erst mit demselben Schalter, der Modell B in der Verwaltung freigibt
 * (`PARTNERMODELL_B=aktiv`, siehe `src/payload/collections/Partnerbetriebe.ts`). Hauptseite,
 * Partnerseiten und Startseiten-Sektion lesen alle hier, damit nie zwei Zahlwege zugleich stehen.
 */

/** Das Modell, nach dem Partneraufträge heute abgerechnet werden. Ohne Schalter gilt Modell A. */
export function aktiverZahlweg(env: Record<string, string | undefined> = process.env): Abrechnungsmodell {
  return env.PARTNERMODELL_B === 'aktiv' ? 'B' : 'A';
}

export interface ZahlwegTexte {
  /** Kurzpunkt der Startseiten-Sektion. */
  sektionPunkt: string;
  /** Schritte 03 und 04 im Ablauf der Hauptseite /partner-werden. */
  hauptseite: [GewinnungPunkt, GewinnungPunkt];
  /** Teile der Seite „Aufträge erhalten“, die vom Zahlweg abhängen. */
  kurztext: string;
  beschreibung: string;
  ablaufUeberschrift: string;
  stationen: string[];
  /** Schritte drei bis fünf des Ablaufs (eins und zwei sind in beiden Modellen gleich). */
  schritte: [RubrikSchritt, RubrikSchritt, RubrikSchritt];
  aufgabenPlattform: string;
  aufgabenBetrieb: string;
  aufgabenVertrag: string;
  kfzVerweis: string;
  /** Kennzeichnender Satzteil, der auf Hauptseite und Partnerseite gleich stehen muss (Test). */
  kennzeichen: string;
}

export const ZAHLWEG: Readonly<Record<Abrechnungsmodell, ZahlwegTexte>> = {
  A: {
    sektionPunkt: 'Abrechnung direkt mit dem Kunden',
    hauptseite: [
      {
        titel: 'Sie führen aus und rechnen ab',
        text:
          'Ihr Betrieb führt die Leistung aus und rechnet direkt mit dem Kunden ab. Der Kunde erfährt vorher, '
          + 'welcher Betrieb ausführt und sein Vertragspartner ist.',
      },
      {
        titel: 'Vermittlungsprovision',
        text:
          'Für vermittelte Aufträge stellen wir Ihrem Betrieb eine Vermittlungsprovision in Rechnung. Höhe, '
          + 'Abrechnung und Reklamationen regelt der Partnervertrag.',
      },
    ],
    kurztext: 'Von der geprüften Anfrage bis zur Abrechnung: der Weg eines Auftrags.',
    beschreibung:
      'So kommen Autoschlüssel-Aufträge zu Ihrem Betrieb: geprüfte Anfrage, Zuordnung nach Region und '
      + 'Leistung, Annahme, Einsatz und Abrechnung mit dem Kunden.',
    ablaufUeberschrift: 'Von der Anfrage bis zur Abrechnung',
    stationen: ['Anfrage', 'Zuordnung', 'Annahme', 'Einsatz', 'Provision'],
    schritte: [
      {
        titel: 'Annahme nach Abstimmung',
        text:
          'Sie übernehmen den Auftrag erst nach Abstimmung mit uns. Der Kunde erfährt vorher, welcher Betrieb '
          + 'ausführt und sein Vertragspartner ist.',
        icon: 'nachweis',
      },
      {
        titel: 'Einsatz und Abrechnung',
        text: 'Sie erbringen die Leistung vor Ort und rechnen direkt mit dem Kunden ab.',
        icon: 'vor-ort',
      },
      {
        titel: 'Vermittlungsprovision',
        text:
          'Sie geben uns Bescheid, wenn der Auftrag erledigt ist. Für vermittelte Aufträge stellen wir Ihnen '
          + 'eine Vermittlungsprovision in Rechnung.',
        icon: 'zahlung',
      },
    ],
    aufgabenPlattform: 'Reichweite, Annahme der Anfrage, Prüfung, Zuordnung und Qualitätsstandard.',
    aufgabenBetrieb: 'Die Leistung vor Ort und die Abrechnung mit dem Kunden, fachlich sauber und zum vereinbarten Termin.',
    aufgabenVertrag: 'Höhe der Provision, Abrechnung und Reklamationen regeln wir im Partnervertrag.',
    kfzVerweis: 'Annahme, Einsatz und Abrechnung',
    kennzeichen: 'direkt mit dem Kunden ab',
  },
  B: {
    sektionPunkt: 'Zahlung läuft über die Plattform',
    hauptseite: [
      {
        titel: 'Der Kunde zahlt über die Plattform',
        text:
          'Den Gesamtbetrag zahlt der Kunde zentral an SCHLÜSSELMACHER24. Erst nach der Zahlung geben wir den '
          + 'Auftrag an Ihren Betrieb frei.',
      },
      {
        titel: 'Auszahlung nach Bestätigung',
        text:
          'Nach der vereinbarten Bestätigung des erledigten Auftrags zahlen wir Ihren Anteil aus. Provision, '
          + 'Abrechnung und Reklamationen regelt der Partnervertrag.',
      },
    ],
    kurztext: 'Von der geprüften Anfrage bis zur Auszahlung: der Weg eines Auftrags.',
    beschreibung:
      'So kommen Autoschlüssel-Aufträge zu Ihrem Betrieb: geprüfte Anfrage, Zuordnung nach Region und '
      + 'Leistung, Zahlung über die Plattform, Freigabe, Auszahlung.',
    ablaufUeberschrift: 'Von der Anfrage bis zur Auszahlung',
    stationen: ['Anfrage', 'Zuordnung', 'Zahlung', 'Freigabe', 'Auszahlung'],
    schritte: [
      {
        titel: 'Der Kunde zahlt über die Plattform',
        text: 'Den Gesamtbetrag zahlt der Kunde zentral an SCHLÜSSELMACHER24.',
        icon: 'zahlung',
      },
      {
        titel: 'Freigabe und Einsatz',
        text: 'Erst nach der Zahlung geben wir den Auftrag an Sie frei. Sie erbringen die Leistung vor Ort.',
        icon: 'vor-ort',
      },
      {
        titel: 'Bestätigung und Auszahlung',
        text:
          'Sie geben uns Bescheid, wenn der Auftrag erledigt ist. Nach der vereinbarten Bestätigung zahlen wir '
          + 'Ihren Anteil aus.',
        icon: 'nachweis',
      },
    ],
    aufgabenPlattform: 'Reichweite, Annahme der Anfrage, Prüfung, Zuordnung, Zahlung und Qualitätsstandard.',
    aufgabenBetrieb: 'Die Leistung vor Ort beim Kunden, fachlich sauber und zum vereinbarten Termin.',
    aufgabenVertrag: 'Provision, Abrechnung, Auszahlung und Reklamationen regeln wir im Partnervertrag.',
    kfzVerweis: 'Zahlung, Freigabe und Auszahlung',
    kennzeichen: 'zentral an SCHLÜSSELMACHER24',
  },
};

/** Startseiten-Sektion „Autoschlüssel-Profi? Partner werden“ (FA-08-02) für einen Zahlweg. */
export function partnerSektionFuer(modell: Abrechnungsmodell) {
  return {
    augenbraue: 'Für Fachbetriebe',
    ueberschrift: 'Autoschlüssel-Profi? Partner werden',
    saetze: [
      'Sie fertigen und programmieren Autoschlüssel? Dann werden Sie Partner im Netzwerk von SCHLÜSSELMACHER24.',
      'Wir geben geprüfte Anfragen zu Autoschlüsseln und Fahrzeugschlüsseln an Betriebe in Ihrer Region weiter.',
    ],
    // Der Inhaber sagt „nach Möglichkeit“ zum Besuch (Abschnitt 07); der Kurzpunkt verspricht nicht mehr.
    punkte: ['Anfragen aus Ihrer Region', ZAHLWEG[modell].sektionPunkt, 'Geprüfte Betriebe, nach Möglichkeit mit Besuch vor Ort'],
    knopf: { href: PARTNER_HAUPTSEITE, label: 'Partner werden' },
    verweis: { href: '/partner-werden/auftraege-erhalten', label: 'So erhalten Sie Aufträge' },
  } as const;
}

/** Startseiten-Sektion für den Zahlweg, der heute gilt. */
export const PARTNER_SEKTION = partnerSektionFuer(aktiverZahlweg());

/** Schritte 03 und 04 der Hauptseite für den Zahlweg, der heute gilt. */
export const HAUPTSEITE_ZAHLWEG = ZAHLWEG[aktiverZahlweg()].hauptseite;

/* -------------------------------------------------------------------------- */

const auftraegeErhalten = (z: ZahlwegTexte): GewinnungSeite => ({
  slug: 'auftraege-erhalten',
  pfad: '/partner-werden/auftraege-erhalten',
  kurzname: 'Aufträge erhalten',
  kurztext: z.kurztext,
  titel: 'Autoschlüssel-Aufträge erhalten',
  beschreibung: z.beschreibung,
  augenbraue: 'Für Partnerbetriebe',
  ueberschrift: 'So erhalten Sie Autoschlüssel-Aufträge',
  einleitung:
    'Kundinnen und Kunden kommen über SCHLÜSSELMACHER24. Wir prüfen jede Anfrage und geben passende '
    + 'Aufträge an Partnerbetriebe in der Region weiter.',
  ablauf: {
    augenbraue: 'Weg eines Auftrags',
    ueberschrift: z.ablaufUeberschrift,
    einleitung: 'Fünf Stationen. Jede hat eine klare Zuständigkeit.',
    stationen: z.stationen,
    schritte: [
      {
        titel: 'Wir prüfen die Anfrage',
        text:
          'Der Kunde stellt seine Anfrage bei SCHLÜSSELMACHER24. Wir klären Fahrzeug, Schlüsselart und '
          + 'Leistung. Wir klären auch, ob er über das Fahrzeug verfügen darf.',
        icon: 'pruefung',
      },
      {
        titel: 'Zuordnung nach Region und Leistung',
        text:
          'Wir fragen einen freigeschalteten Partner an, dessen Gebiet und Leistungen zur Anfrage passen. '
          + 'Sie entscheiden, ob Sie den Auftrag annehmen.',
        icon: 'standort',
      },
      ...z.schritte,
    ],
  },
  abschnitte: [
    {
      id: 'auftraege-weitergabe',
      augenbraue: 'Weitergabe',
      ueberschrift: 'Welche Anfragen an Partner gehen',
      absaetze: [
        'Wir geben eine Anfrage bei Bedarf an einen geeigneten Partner in der Region weiter. Nicht jede '
        + 'Anfrage geht an einen Partner.',
        'Es geht immer um Autoschlüssel oder Fahrzeugschlüssel. Türöffnungen an Wohnungen und Häusern '
        + 'vermitteln wir nicht.',
      ],
    },
    {
      id: 'auftraege-einblick',
      augenbraue: 'Vor der Annahme',
      ueberschrift: 'Was Sie vor der Annahme sehen',
      einleitung: 'Sie sehen nur, was Sie für die Entscheidung und die Ausführung brauchen.',
      punkte: [
        { titel: 'Ort und Leistung', text: 'Postleitzahl, Ort und die Angaben aus der Anfrage, etwa Fahrzeug und Schlüsselart.' },
        { titel: 'Kontaktdaten nach der Annahme', text: 'Name, Telefon und Anschrift des Kunden sehen Sie erst, wenn Sie den Auftrag angenommen haben.' },
        { titel: 'Keine fremden Daten', text: 'Zahlungsdaten, interne Notizen und Aufträge anderer Partner sehen Sie nie.' },
      ],
    },
    {
      id: 'auftraege-aufgaben',
      augenbraue: 'Aufgabenteilung',
      ueberschrift: 'Was die Plattform übernimmt und was Sie übernehmen',
      punkte: [
        { titel: 'Plattform', text: z.aufgabenPlattform },
        { titel: 'Ihr Betrieb', text: z.aufgabenBetrieb },
        { titel: 'Partnervertrag', text: z.aufgabenVertrag },
      ],
    },
    {
      id: 'auftraege-voraussetzung',
      augenbraue: 'Voraussetzung',
      ueberschrift: 'Aufträge gibt es erst nach der Freischaltung',
      absaetze: [
        'Aufträge erhalten nur freigeschaltete Partner. Vorher prüfen wir Ihren Betrieb, Ihre Leistungen '
        + 'und Ihre Ausstattung. Nach Möglichkeit besuchen wir Sie vor Ort.',
        'Ob und wie oft Anfragen kommen, hängt von Ihrer Region und der Nachfrage dort ab.',
      ],
      verweis: { href: '/partner-werden/netzwerk-deutschland', label: 'Qualitätsstandard im Netzwerk' },
    },
  ],
  naechsterSchritt: {
    ueberschrift: 'Bereit für Aufträge aus Ihrer Region?',
    text: 'Bewerben Sie sich mit wenigen Angaben. Wir prüfen Ihre Bewerbung und melden uns bei Ihnen.',
    primaer: { href: PARTNER_BEWERBUNG, label: 'Jetzt als Partner bewerben' },
  },
});

const NETZWERK_DEUTSCHLAND: GewinnungSeite = {
  slug: 'netzwerk-deutschland',
  pfad: '/partner-werden/netzwerk-deutschland',
  kurzname: 'Netzwerk Deutschland',
  kurztext: 'Leistungen, Qualitätsstandard und die Länder, in denen wir Partner suchen.',
  titel: 'Fahrzeugschlüssel-Netzwerk Deutschland',
  beschreibung:
    'Das Partnernetz von SCHLÜSSELMACHER24 für Autoschlüssel und Fahrzeugschlüssel: Leistungen, '
    + 'Qualitätsstandard und die Bundesländer, in denen wir Partner suchen.',
  augenbraue: 'Das Netzwerk',
  ueberschrift: 'Ein Netzwerk für Fahrzeugschlüssel in ganz Deutschland',
  einleitung:
    'Das Netzwerk verbindet Kundenanfragen mit geprüften Fachbetrieben vor Ort. Es betrifft ausschließlich '
    + 'Autoschlüssel und Fahrzeugschlüssel.',
  abschnitte: [
    {
      id: 'netzwerk-gedanke',
      augenbraue: 'Plattformgedanke',
      ueberschrift: 'Wie das Netzwerk arbeitet',
      absaetze: [
        'Kundinnen und Kunden kommen über SCHLÜSSELMACHER24. Wir qualifizieren die Anfrage und geben sie bei '
        + 'Bedarf an einen geeigneten Partner in der Region weiter.',
        'Der Partner erbringt die Leistung vor Ort. Die Plattform organisiert Reichweite, Anfrage, Zuordnung '
        + 'und Qualitätsstandard.',
        'Das Netzwerk ist nicht neu. Es baut auf dem bestehenden Partnerbereich von SCHLÜSSELMACHER24 auf.',
      ],
    },
    {
      id: 'netzwerk-leistungen',
      augenbraue: 'Leistungen',
      ueberschrift: 'Welche Leistungen das Netzwerk abdeckt',
      einleitung: 'Niemand muss alle anbieten. Vor der Freischaltung halten wir fest, welche Leistungen Ihr Betrieb abdeckt.',
      baustein: 'leistungen',
    },
    {
      id: 'netzwerk-qualitaet',
      augenbraue: 'Qualitätsstandard',
      ueberschrift: 'Was wir vor der Freischaltung prüfen',
      einleitung: 'Kundinnen und Kunden sollen sich auf jeden Partner verlassen können. Deshalb gilt für alle derselbe Standard.',
      baustein: 'qualitaet',
    },
    {
      id: 'netzwerk-regionen',
      augenbraue: 'Regionen',
      ueberschrift: 'Wo wir Partner suchen',
      einleitung:
        'Wir suchen Partner in allen Bundesländern. Die Liste zeigt, wo wir suchen. Sie sagt nicht, dass es '
        + 'dort schon Partner gibt.',
      liste: [...PARTNER_REGIONEN],
    },
    {
      id: 'netzwerk-zuordnung',
      augenbraue: 'Zuordnung',
      ueberschrift: 'Wie eine Anfrage zu einem Partner kommt',
      punkte: [
        { titel: 'Ihr Gebiet', text: 'Sie nennen Postleitzahl, Ort und den Radius, in dem Sie Aufträge übernehmen.' },
        { titel: 'Ihre Leistungen', text: 'Sie nennen Leistungen und Fahrzeuge, die Sie abdecken.' },
        { titel: 'Die Anfrage', text: 'Wir ordnen jede Anfrage nach Region und Leistung zu und fragen Sie an.' },
      ],
      verweis: { href: '/partner-werden/auftraege-erhalten', label: 'Der ganze Weg eines Auftrags' },
    },
  ],
  naechsterSchritt: {
    ueberschrift: 'Teil des Netzwerks werden',
    text: 'Bewerben Sie sich mit Ihrem Betrieb, Ihren Leistungen und Ihrem Einsatzgebiet.',
    primaer: { href: PARTNER_BEWERBUNG, label: 'Jetzt als Partner bewerben' },
  },
};

const kfzBetriebe = (z: ZahlwegTexte): GewinnungSeite => ({
  slug: 'kfz-betriebe',
  pfad: '/partner-werden/kfz-betriebe',
  kurzname: 'Kfz-Betriebe',
  kurztext: 'Für Werkstätten und Autohäuser, die Schlüsselarbeiten anbieten oder ausbauen.',
  titel: 'Kfz-Schlüssel-Partner für Werkstätten',
  beschreibung:
    'Für Kfz-Werkstätten und Autohäuser mit Schlüsselarbeiten: welche Ausstattung zählt, welche Fälle Sie '
    + 'lösen und wie Anfragen aus Ihrer Region kommen.',
  augenbraue: 'Für Kfz-Betriebe',
  ueberschrift: 'Kfz-Schlüssel-Partner werden: für Werkstätten und Autohäuser',
  einleitung:
    'Sie bieten Schlüsselarbeiten schon an oder wollen sie ausbauen? Als Partner erhalten Sie geprüfte '
    + 'Anfragen zu Autoschlüsseln aus Ihrer Region.',
  abschnitte: [
    {
      id: 'kfz-zielgruppe',
      augenbraue: 'Für wen',
      ueberschrift: 'Für welche Betriebe die Partnerschaft passt',
      punkte: [
        { titel: 'Kfz-Werkstätten', text: 'Sie haben Diagnosetechnik und lernen Schlüssel heute schon an.' },
        { titel: 'Autohäuser mit Werkstatt', text: 'Sie fertigen oder programmieren Schlüssel für Ihre Kundschaft.' },
        { titel: 'Betriebe im Ausbau', text: 'Sie wollen Schlüsselarbeiten neu aufnehmen. Dann zählt, was bei der Freischaltung vorhanden ist.' },
      ],
    },
    {
      id: 'kfz-ausstattung',
      augenbraue: 'Ausstattung',
      ueberschrift: 'Welche Ausstattung zählt',
      einleitung: 'Wir erfassen Ihre Ausstattung vor der Freischaltung.',
      punkte: [
        { titel: 'Schlüsselfräsmaschine', text: 'Für Bärte und Wendeschlüssel nach Fahrzeug oder Vorlage.' },
        { titel: 'Programmiergerät', text: 'Für Transponder, Funk und schlüssellose Systeme über die Diagnoseschnittstelle.' },
        { titel: 'Werkstatt oder mobiler Einsatz', text: 'Eine Werkstatt, ein ausgestattetes Einsatzfahrzeug oder beides.' },
        { titel: 'Fahrzeugabdeckung', text: 'Für welche Marken und Baujahre Sie Schlüssel anfertigen und anlernen können.' },
      ],
    },
    {
      id: 'kfz-faelle',
      augenbraue: 'Fälle',
      ueberschrift: 'Welche Fälle Sie als Partner lösen',
      punkte: [
        { titel: 'Zweitschlüssel', text: 'Ein Schlüssel ist noch da, ein weiterer soll dazukommen.' },
        { titel: 'Alle Schlüssel verloren', text: 'Ein neuer Schlüssel wird am Fahrzeug angefertigt und angelernt.' },
        { titel: 'Fernbedienung ohne Funktion', text: 'Die Tasten reagieren nicht mehr, der Funk muss neu angelernt werden.' },
        { titel: 'Gehäuse defekt', text: 'Die Elektronik ist in Ordnung, das Gehäuse oder die Tasten nicht.' },
        { titel: 'Motorrad und weitere Fahrzeuge', text: 'Wenn Sie diese Schlüssel anbieten, nennen Sie es in der Bewerbung.' },
      ],
      verweis: { href: PARTNER_HAUPTSEITE, label: 'Alle Partnerleistungen' },
    },
    {
      id: 'kfz-berechtigung',
      augenbraue: 'Berechtigung',
      ueberschrift: 'Schlüssel nur für Berechtigte',
      absaetze: [
        'Vor jeder Arbeit am Schlüssel steht der Nachweis, dass der Kunde über das Fahrzeug verfügen darf: '
        + 'Fahrzeugschein auf den Besteller oder Vollmacht.',
        'Wir fragen den Nachweis schon in der Anfrage ab. Was Sie vor Ort zusätzlich prüfen, regeln wir im '
        + 'Partnervertrag.',
      ],
    },
    {
      id: 'kfz-anfragen',
      augenbraue: 'Anfragen',
      ueberschrift: 'Wie die Plattform Anfragen zu Ihnen bringt',
      punkte: [
        { titel: 'Reichweite', text: 'Kundinnen und Kunden suchen online und kommen über SCHLÜSSELMACHER24.' },
        { titel: 'Vollständige Angaben', text: 'Die Anfrage enthält Fahrzeug, Schlüsselart und gewünschte Leistung.' },
        { titel: 'Passende Zuordnung', text: 'Wir fragen Sie an, wenn Region, Leistung und Fahrzeug passen.' },
      ],
      verweis: { href: '/partner-werden/auftraege-erhalten', label: z.kfzVerweis },
    },
  ],
  naechsterSchritt: {
    ueberschrift: 'Ihre Werkstatt als Partner',
    text: 'Nennen Sie in der Bewerbung Ihre Leistungen, Ihre Geräte und Ihr Einsatzgebiet.',
    primaer: { href: PARTNER_BEWERBUNG, label: 'Jetzt als Partner bewerben' },
  },
});

const KOOPERATION: GewinnungSeite = {
  slug: 'kooperation',
  pfad: '/partner-werden/kooperation',
  kurzname: 'Kooperation',
  kurztext: 'Für Betriebe, die selbst keine Schlüssel fertigen und Fälle weitergeben wollen.',
  titel: 'Autoschlüssel-Kooperation für Betriebe',
  beschreibung:
    'Für Autohäuser, Fuhrparks, Pannenhilfe und Verwaltungen mit Fahrzeugen: Autoschlüssel-Fälle an '
    + 'SCHLÜSSELMACHER24 weitergeben, ohne selbst zu fertigen.',
  augenbraue: 'Kooperation',
  ueberschrift: 'Kooperation: Autoschlüssel-Fälle weitergeben',
  einleitung:
    'Sie fertigen selbst keine Schlüssel, haben aber Kunden oder Fahrzeuge mit Schlüsselproblemen? Dann '
    + 'passt eine Kooperation besser als eine Partnerschaft.',
  abschnitte: [
    {
      id: 'kooperation-unterschied',
      augenbraue: 'Unterschied',
      ueberschrift: 'Kooperation oder Partnerbetrieb?',
      punkte: [
        {
          titel: 'Partnerbetrieb',
          text: 'Fertigt und programmiert Schlüssel selbst, wird vor der Freischaltung geprüft und erhält Aufträge.',
        },
        {
          titel: 'Kooperation',
          text: 'Gibt Fälle an uns weiter. Wir übernehmen selbst oder geben den Fall an einen Partner in der Region.',
        },
      ],
      verweis: { href: PARTNER_HAUPTSEITE, label: 'Doch selbst Partner werden' },
    },
    {
      id: 'kooperation-zielgruppe',
      augenbraue: 'Für wen',
      ueberschrift: 'Für wen eine Kooperation passt',
      liste: [
        'Autohäuser ohne eigene Schlüsseltechnik',
        'Fuhrparks und Flottenbetreiber',
        'Pannenhilfe und Abschleppdienste',
        'Hausverwaltungen mit eigenen Fahrzeugen',
      ],
    },
    {
      id: 'kooperation-faelle',
      augenbraue: 'Fälle',
      ueberschrift: 'Typische Fälle für eine Weitergabe',
      punkte: [
        { titel: 'Ersatzschlüssel im Fuhrpark', text: 'Ein Fahrzeug hat nur noch einen Schlüssel.' },
        { titel: 'Schlüssel verloren', text: 'Ein Fahrer oder Kunde hat keinen Schlüssel mehr.' },
        { titel: 'Zweitschlüssel beim Fahrzeugverkauf', text: 'Zum Fahrzeug fehlt ein zweiter Schlüssel.' },
        { titel: 'Defektes Gehäuse oder Funk', text: 'Der Schlüssel ist beschädigt oder die Tasten reagieren nicht.' },
      ],
    },
    {
      id: 'kooperation-angaben',
      augenbraue: 'Angaben',
      ueberschrift: 'Was wir für einen Fall brauchen',
      liste: [
        'Marke, Modell und Baujahr des Fahrzeugs',
        'Fotos des vorhandenen Schlüssels, falls einer da ist',
        'Ort des Fahrzeugs',
        'Fahrzeugschein auf den Besteller oder eine Vollmacht des Halters',
      ],
    },
    {
      id: 'kooperation-kontakt',
      augenbraue: 'Kontakt',
      ueberschrift: 'So nehmen Sie Kontakt auf',
      absaetze: [
        'Schreiben Sie uns über die Anfrage. Nennen Sie Ihren Betrieb und die Art der Fälle, die Sie '
        + 'weitergeben möchten.',
        'Wie wir zusammenarbeiten, besprechen wir dann mit Ihnen.',
      ],
    },
  ],
  naechsterSchritt: {
    ueberschrift: 'Kooperation anfragen',
    text: 'Beschreiben Sie kurz Ihren Betrieb und Ihre Fälle. Wir melden uns bei Ihnen.',
    // Vorbelegt mit dem Bereich Autoschlüssel (`?thema=` der Anfrage), damit der Fall richtig ankommt.
    primaer: { href: '/service-und-termin/anfrage?thema=autoschluessel', label: 'Kooperation anfragen' },
    sekundaer: { href: PARTNER_HAUPTSEITE, label: 'Partnerbetrieb werden' },
  },
};

/** Die vier Partnerseiten mit den Texten eines Zahlwegs. */
export function gewinnungSeitenFuer(modell: Abrechnungsmodell): readonly GewinnungSeite[] {
  const z = ZAHLWEG[modell];
  return [auftraegeErhalten(z), NETZWERK_DEUTSCHLAND, kfzBetriebe(z), KOOPERATION];
}

/** Die vier Partnerseiten für den Zahlweg, der heute gilt. */
export const GEWINNUNG_SEITEN: readonly GewinnungSeite[] = gewinnungSeitenFuer(aktiverZahlweg());

export function gewinnungSeite(slug: GewinnungSlug): GewinnungSeite {
  const seite = GEWINNUNG_SEITEN.find((s) => s.slug === slug);
  if (!seite) throw new Error(`Unbekannte Partnerseite: ${slug}`);
  return seite;
}

/** Die übrigen Partnerseiten als Verweise (gegenseitige Verlinkung, keine Sackgasse). */
export function weitereGewinnungSeiten(slug?: GewinnungSlug): GewinnungSeite[] {
  return GEWINNUNG_SEITEN.filter((s) => s.slug !== slug);
}
