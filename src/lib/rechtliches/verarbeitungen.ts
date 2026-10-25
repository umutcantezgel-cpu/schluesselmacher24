import type { Settings } from '@/lib/types';

/* ==========================================================================
   Verarbeitungen personenbezogener Daten
   Einzige Quelle für die Datenschutzerklärung: Was die Seite verarbeitet,
   wozu, auf welcher Grundlage, an wen es geht und wie lange es bleibt.
   Bewusst eine feste Liste und keine, die sich nach Umgebungsvariablen
   richtet — der Text soll genau der sein, den der Inhaber freigegeben hat.
   Einzige Ausnahme: Google Analytics erscheint genau dann, wenn eine
   Mess-ID gesetzt ist (`statistik`), denn nur dann wird es geladen.

   Kommt ein Dienst hinzu oder fällt einer weg: Liste ändern, Fassung
   hochzählen, Text freigeben lassen.
   ========================================================================== */

/** Fassung der Liste. Bei jeder inhaltlichen Änderung hochzählen. */
export const VERARBEITUNGEN_FASSUNG = { nummer: 2, stand: '2026-10-25' } as const;

export interface Dienstleister {
  id: 'vercel' | 'supabase' | 'stripe' | 'resend' | 'google';
  name: string;
  sitz: string;
  aufgabe: string;
  /** Auftragsverarbeiter nach Art. 28 DSGVO oder eigener Verantwortlicher. */
  rolle: string;
  /** Nur für die Redaktion: was der Inhaber vor der Freigabe bestätigen muss. */
  pruefhinweis?: string;
}

/** Eingesetzte Dienstleister (Stack: Vercel, Supabase, Stripe, Resend). */
export const DIENSTLEISTER: readonly Dienstleister[] = [
  {
    id: 'vercel',
    name: 'Vercel Inc.',
    sitz: 'USA',
    aufgabe: 'Hosting und Auslieferung der Website (Serverregion Frankfurt am Main)',
    rolle: 'Auftragsverarbeiter',
    pruefhinweis: 'Anschrift, DPF-Zertifizierung und Auftragsverarbeitungsvertrag (DPA) von Vercel prüfen.',
  },
  {
    id: 'supabase',
    name: 'Supabase Inc.',
    sitz: 'Singapur; Speicherort der Daten: Frankfurt am Main',
    aufgabe: 'Datenbank und Dateiablage',
    rolle: 'Auftragsverarbeiter',
    pruefhinweis:
      'Vertragspartner und Anschrift von Supabase, Region des Projekts (Frankfurt) und '
      + 'Übermittlungsgrundlage (Standardvertragsklauseln) prüfen; DPA abschließen.',
  },
  {
    id: 'stripe',
    name: 'Stripe Payments Europe, Limited',
    sitz: '1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Irland',
    aufgabe: 'Abwicklung von Online-Zahlungen',
    rolle: 'Auftragsverarbeiter und für eigene Zwecke (Betrugsvorbeugung, gesetzliche Pflichten) eigener Verantwortlicher',
    pruefhinweis: 'Rollenbeschreibung mit der Datenschutzerklärung von Stripe abgleichen.',
  },
  {
    id: 'resend',
    name: 'Resend Inc.',
    sitz: 'USA',
    aufgabe: 'Versand von E-Mails (Bestätigungen und Nachrichten zum Vorgang)',
    rolle: 'Auftragsverarbeiter',
    pruefhinweis:
      'Anschrift, Serverstandort und Übermittlungsgrundlage (DPF-Zertifizierung oder '
      + 'Standardvertragsklauseln) von Resend prüfen; DPA abschließen.',
  },
];

/** Google Analytics 4 — nur aufgeführt, wenn eine Mess-ID gesetzt ist. */
export const GOOGLE_ANALYTICS: Dienstleister = {
  id: 'google',
  name: 'Google Ireland Limited',
  sitz: 'Gordon House, Barrow Street, Dublin 4, Irland',
  aufgabe: 'Reichweitenmessung mit Google Analytics 4, nur nach Ihrer Einwilligung',
  rolle: 'Auftragsverarbeiter',
  pruefhinweis:
    'Auftragsverarbeitungsbedingungen von Google in der Analytics-Verwaltung akzeptieren; '
    + 'Google-Signale und Werbefunktionen ausgeschaltet lassen.',
};

/** Optionen, die die Liste ändern. */
export interface VerarbeitungsOptionen {
  /** Google Analytics ist eingebunden (Mess-ID gesetzt). */
  statistik?: boolean;
}

/** Dienstleister in der Reihenfolge der Datenschutzerklärung. */
export function dienstleister(optionen: VerarbeitungsOptionen = {}): Dienstleister[] {
  return optionen.statistik ? [...DIENSTLEISTER, GOOGLE_ANALYTICS] : [...DIENSTLEISTER];
}

export interface Verarbeitung {
  id: string;
  /** Kurzbezeichnung, z. B. „Online-Zahlung“. */
  titel: string;
  zweck: string;
  daten: string[];
  rechtsgrundlage: string;
  empfaenger: string;
  /** Übermittlung außerhalb des EWR und ihre Grundlage; `null`, wenn keine. */
  drittland: string | null;
  speicherdauer: string;
  /** Nur für die Redaktion: was der Inhaber vor der Freigabe bestätigen muss. */
  pruefhinweis?: string;
}

const TAGE = (tage: number) => (tage === 1 ? '1 Tag' : `${tage} Tage`);

/**
 * Alle Verarbeitungen in der Reihenfolge der Datenschutzerklärung. Die
 * Fristen für hochgeladene Unterlagen kommen aus den Einstellungen.
 */
export function verarbeitungen(
  settings: Pick<Settings, 'retentionDays'>,
  optionen: VerarbeitungsOptionen = {},
): Verarbeitung[] {
  const fristen = settings.retentionDays;
  const statistik: Verarbeitung[] = optionen.statistik
    ? [
        {
          id: 'statistik',
          titel: 'Reichweitenmessung mit Google Analytics (nur mit Einwilligung)',
          zweck:
            'Auswertung, wie die Website genutzt wird – aufgerufene Seiten, Herkunft der Besuche und abgeschlossene '
            + 'Abläufe wie Bestellungen, Foto-, Termin- und Projektanfragen –, um Angebot und Bedienung zu verbessern.',
          daten: [
            'IP-Adresse – Google Analytics 4 nutzt sie nur zur Bestimmung des ungefähren Standorts und speichert sie nicht',
            'Geräte- und Browserangaben, ungefährer Standort (Land, Region)',
            'aufgerufene Seiten, verweisende Seite und Zeitpunkt',
            'Ereignisse: Bestellung, Fotoanfrage, Terminanfrage, Partneranmeldung, Projektanfrage',
            'zufällige Kennung in Cookies (_ga, _ga_…)',
          ],
          rechtsgrundlage:
            'Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG. Sie können sie jederzeit mit '
            + 'Wirkung für die Zukunft auf der Seite Cookie-Einstellungen widerrufen; dann endet die Messung und die '
            + 'Analytics-Cookies werden gelöscht.',
          empfaenger: 'Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland (Auftragsverarbeiter)',
          drittland:
            'USA (Google LLC): EU-US Data Privacy Framework (Art. 45 DSGVO).',
          speicherdauer:
            'Die Cookies bis zu 2 Jahre oder bis zu Ihrem Widerruf. Die Auswertungsdaten löscht Google nach der in '
            + 'Google Analytics eingestellten Aufbewahrungsdauer.',
          pruefhinweis:
            'Aufbewahrungsdauer in Google Analytics (2 oder 14 Monate) einstellen und hier konkret nennen; '
            + 'Übermittlungsgrundlage (DPF-Zertifizierung von Google LLC) prüfen.',
        },
      ]
    : [];
  return [
    {
      id: 'hosting',
      titel: 'Bereitstellung der Website und Server-Protokolle',
      zweck: 'Auslieferung der Seiten, Abwehr von Angriffen und Fehlersuche.',
      daten: [
        'IP-Adresse',
        'Datum und Uhrzeit des Abrufs',
        'aufgerufene Adresse und verweisende Seite',
        'Browser und Betriebssystem',
        'übertragene Datenmenge und Statuscode',
      ],
      rechtsgrundlage:
        'Art. 6 Abs. 1 lit. f DSGVO – berechtigtes Interesse an einem sicheren und stabilen Betrieb der Website.',
      empfaenger: 'Vercel Inc. (Hosting, Auftragsverarbeiter)',
      drittland:
        'USA (Vercel Inc.): EU-US Data Privacy Framework (Art. 45 DSGVO) und Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).',
      speicherdauer:
        'Die Protokolle werden beim Hoster nach kurzer Zeit automatisch gelöscht. Wir werten sie nur bei Störungen oder Angriffen aus.',
      pruefhinweis: 'Aufbewahrungsdauer der Vercel-Protokolle im gewählten Tarif prüfen und hier ggf. konkret nennen.',
    },
    {
      id: 'datenbank',
      titel: 'Datenbank, Backend und Dateiablage',
      zweck: 'Speicherung der Vorgänge, der Inhalte dieser Website und hochgeladener Dateien.',
      daten: ['alle in den Formularen angegebenen Daten', 'hochgeladene Dateien'],
      rechtsgrundlage:
        'Art. 6 Abs. 1 lit. b DSGVO (Vertrag und vorvertragliche Maßnahmen) und Art. 6 Abs. 1 lit. f DSGVO (sichere, zuverlässige Datenhaltung).',
      empfaenger: 'Supabase Inc. (Datenbank und Dateiablage, Auftragsverarbeiter); Speicherort Frankfurt am Main',
      drittland:
        'Die Daten liegen in der EU. Zugriffe von Supabase aus Drittländern zu Wartungszwecken sind möglich und durch Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO) abgesichert.',
      speicherdauer: 'Wie bei den einzelnen Verarbeitungen angegeben.',
      pruefhinweis: 'Übermittlungsgrundlage und Unterauftragsverarbeiter von Supabase prüfen.',
    },
    {
      id: 'vorgaenge',
      titel: 'Bestellungen, Terminbuchungen und Anfragen',
      zweck:
        'Bearbeitung und Abwicklung Ihrer Bestellung, Ihres Termins oder Ihrer Anfrage einschließlich der Kommunikation dazu.',
      daten: [
        'Anrede, Name und Firma',
        'E-Mail-Adresse und Telefonnummer',
        'Liefer- und Rechnungsanschrift',
        'Angaben zum Auftrag: Fahrzeugdaten, Schlüsselart, Schlüsselcode, gewünschte Leistung',
        'Angaben zum Objekt: Türen, Nutzer, Berechtigungen, bestehende Anlagen',
        'Termin, Zahlungsstatus und Vorgangsnummer',
        'Ihre Zustimmungen im Bestellablauf mit Zeitpunkt',
      ],
      rechtsgrundlage:
        'Art. 6 Abs. 1 lit. b DSGVO (Vertrag und vorvertragliche Maßnahmen); für die Aufbewahrung Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit § 257 HGB und § 147 AO.',
      empfaenger:
        'Hosting- und Datenbankdienstleister (siehe oben); bei Versand das Versandunternehmen (Name und Lieferanschrift).',
      drittland: null,
      speicherdauer:
        'Für die Dauer der Bearbeitung. Danach bewahren wir Geschäftsunterlagen nach den gesetzlichen Fristen auf – je nach Art bis zu zehn Jahre (§ 257 HGB, § 147 AO). Anfragen, aus denen kein Auftrag entsteht, löschen wir, sobald sie nicht mehr benötigt werden und keine Aufbewahrungspflicht besteht.',
    },
    {
      id: 'dateien',
      titel: 'Hochgeladene Fotos und Unterlagen',
      zweck:
        'Prüfung und Ausführung Ihres Auftrags; beim Fahrzeugschein und bei Sicherungskarten der Nachweis, dass Sie berechtigt sind.',
      daten: [
        'Fotos von Schlüsseln',
        'Zulassungsbescheinigung Teil I (Fahrzeugschein)',
        'Grundrisse, Türlisten und Objektfotos',
        'weitere Projektunterlagen',
      ],
      rechtsgrundlage:
        'Art. 6 Abs. 1 lit. b DSGVO; für den Berechtigungsnachweis zusätzlich Art. 6 Abs. 1 lit. f DSGVO – Schutz vor der Anfertigung von Schlüsseln für Unberechtigte.',
      empfaenger: 'Supabase Inc. (Dateiablage, Auftragsverarbeiter). Intern sehen die Dateien nur die dafür berechtigten Personen.',
      drittland: null,
      speicherdauer:
        'Dateien werden schon beim Auswählen im Formular an uns übertragen. Senden Sie den Vorgang nicht ab, löschen wir sie automatisch nach 24 Stunden. '
        + `Sonst gelten ab dem Hochladen folgende Fristen: Fahrzeugschein ${TAGE(fristen.vehicleRegistration)}, `
        + `Schlüsselfotos ${TAGE(fristen.keyPhotos)}, Grundrisse und Objektpläne ${TAGE(fristen.floorPlans)}, `
        + `Projektunterlagen und Objektfotos ${TAGE(fristen.projectDocuments)}. Danach werden die Dateien automatisch gelöscht.`,
    },
    {
      id: 'partner',
      titel: 'Bewerbung als Partnerbetrieb',
      zweck:
        'Prüfung Ihrer Bewerbung über „Partner werden“, Abstimmung einer Zusammenarbeit und – nach einer Freischaltung – die Vermittlung von Kundenaufträgen an Ihren Betrieb.',
      daten: [
        'Firmenname, Ansprechpartner, E-Mail-Adresse und Telefonnummer',
        'Postleitzahl, Ort und Einsatzradius',
        'Leistungen, Fahrzeughersteller und Systeme, mobile Einsätze',
        'Angaben zu Qualifikationen',
        'freiwillig hochgeladene Nachweise (z. B. Gewerbeanmeldung, Zertifikate)',
      ],
      rechtsgrundlage:
        'Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen auf Ihre Anfrage) und Art. 6 Abs. 1 lit. a DSGVO (Ihre Einwilligung beim Absenden); für die Prüfung von Gewerbe, Eignung und Zuverlässigkeit zusätzlich Art. 6 Abs. 1 lit. f DSGVO – berechtigtes Interesse, Aufträge nur an geeignete Betriebe zu vermitteln.',
      empfaenger:
        'Hosting- und Datenbankdienstleister (siehe oben). Kommt eine Zusammenarbeit zustande, nennen wir Kundinnen und Kunden, deren Auftrag Ihr Betrieb übernimmt, Namen und Kontaktdaten Ihres Betriebs.',
      drittland: null,
      speicherdauer:
        'Kommt keine Zusammenarbeit zustande, löschen wir Ihre Bewerbung, sobald sie für die Prüfung und mögliche Rückfragen nicht mehr benötigt wird und keine Aufbewahrungspflicht besteht. Bei einer Zusammenarbeit für deren Dauer, danach nach den gesetzlichen Fristen (§ 257 HGB, § 147 AO). Hochgeladene Nachweise löschen wir nach der Frist für Projektunterlagen (siehe „Hochgeladene Fotos und Unterlagen“).',
      pruefhinweis:
        'Konkrete Löschfrist für abgelehnte Bewerbungen festlegen und Partnervertrag (Weitergabe der Kontaktdaten an Kunden) juristisch prüfen lassen (Erg. Leitfaden §8).',
    },
    {
      id: 'zahlung',
      titel: 'Online-Zahlung',
      zweck: 'Abwicklung von Zahlungen und Anzahlungen.',
      daten: [
        'Name und E-Mail-Adresse',
        'Betrag, Vorgangsnummer und Zahlungsstatus',
        'Zahlungsdaten (Karten-, Konto- oder Wallet-Daten) – diese geben Sie direkt bei Stripe ein; wir erhalten sie nicht',
      ],
      rechtsgrundlage:
        'Art. 6 Abs. 1 lit. b DSGVO; soweit Stripe gesetzliche Pflichten erfüllt (etwa nach dem Geldwäschegesetz), Art. 6 Abs. 1 lit. c DSGVO.',
      empfaenger: 'Stripe Payments Europe, Limited, Dublin, Irland',
      drittland:
        'Stripe kann Daten an die Stripe, Inc. in den USA übermitteln. Grundlage: EU-US Data Privacy Framework (Art. 45 DSGVO) und Standardvertragsklauseln.',
      speicherdauer:
        'Zahlungsbelege bewahren wir nach den gesetzlichen Fristen auf (bis zu zehn Jahre, § 147 AO). Stripe speichert Daten nach den eigenen gesetzlichen Pflichten.',
      pruefhinweis: 'Angaben mit der Datenschutzerklärung von Stripe abgleichen.',
    },
    {
      id: 'email',
      titel: 'Versand von E-Mails',
      zweck: 'Eingangs- und Vertragsbestätigungen, Mitteilungen zum Stand Ihres Vorgangs und Antworten auf Ihre Nachrichten.',
      daten: ['E-Mail-Adresse und Name', 'Vorgangsnummer und Inhalt der Nachricht', 'Zustellstatus'],
      rechtsgrundlage: 'Art. 6 Abs. 1 lit. b DSGVO; bei Bestätigungen, die wir gesetzlich schulden, Art. 6 Abs. 1 lit. c DSGVO.',
      empfaenger: 'Resend Inc. (E-Mail-Versand, Auftragsverarbeiter)',
      drittland: 'USA (Resend Inc.): EU-US Data Privacy Framework bzw. Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).',
      speicherdauer:
        'Der Versanddienst löscht seine Versandprotokolle nach kurzer Zeit. Am Vorgang vermerken wir Art, Zeitpunkt und Ergebnis jeder Mail so lange wie den Vorgang selbst.',
      pruefhinweis: 'Löschfrist der Versandprotokolle und Übermittlungsgrundlage bei Resend prüfen.',
    },
    {
      id: 'kontakt',
      titel: 'Kontakt per E-Mail oder Telefon',
      zweck: 'Beantwortung Ihres Anliegens.',
      daten: ['Name und Kontaktdaten', 'Inhalt Ihrer Nachricht'],
      rechtsgrundlage:
        'Art. 6 Abs. 1 lit. b DSGVO, soweit es um einen Vertrag oder dessen Anbahnung geht; sonst Art. 6 Abs. 1 lit. f DSGVO.',
      empfaenger: 'Anbieter unseres E-Mail-Postfachs (Auftragsverarbeiter)',
      drittland: null,
      speicherdauer:
        'Bis Ihr Anliegen erledigt ist. Geschäftliche Korrespondenz bewahren wir nach den gesetzlichen Fristen auf (sechs Jahre, § 257 HGB).',
      pruefhinweis: 'Anbieter des Postfachs info@ benennen und auf Drittlandbezug prüfen.',
    },
    {
      id: 'browser',
      titel: 'Notwendige Speicherung in Ihrem Browser',
      zweck:
        'Warenkorb, Zwischenstand in Formularen und Konfiguratoren sowie Ihre Auswahl auf der Seite Cookie-Einstellungen – damit nichts verloren geht, wenn Sie die Seite wechseln.',
      daten: ['Inhalt des Warenkorbs', 'Eingaben in Formularen und Konfiguratoren', 'Ihre Auswahl zur Speicherung'],
      rechtsgrundlage:
        '§ 25 Abs. 2 Nr. 2 TDDDG (unbedingt erforderlich für den von Ihnen gewünschten Dienst); Art. 6 Abs. 1 lit. b DSGVO.',
      empfaenger: 'Keine – die Daten bleiben im lokalen Speicher Ihres Browsers (localStorage) und werden erst übertragen, wenn Sie einen Vorgang absenden.',
      drittland: null,
      speicherdauer: 'Bis Sie die Daten über die Seite Cookie-Einstellungen oder in Ihrem Browser löschen.',
    },
    ...statistik,
    {
      id: 'ratenbegrenzung',
      titel: 'Schutz vor Missbrauch (Ratenbegrenzung)',
      zweck: 'Abwehr massenhafter, automatisierter Anfragen an Formulare und Uploads.',
      daten: [
        'ein aus der IP-Adresse gebildeter, verschlüsselter Prüfwert (HMAC) – nicht die IP-Adresse selbst',
        'Zeitpunkt und Anzahl der Anfragen',
      ],
      rechtsgrundlage: 'Art. 6 Abs. 1 lit. f DSGVO – berechtigtes Interesse an einem missbrauchsfreien Betrieb.',
      empfaenger: 'Supabase Inc. (Datenbank, Auftragsverarbeiter)',
      drittland: null,
      speicherdauer: 'Der Zähler gilt für ein Zeitfenster von wenigen Minuten; die Einträge werden in der Regel nach 24 Stunden gelöscht.',
    },
    {
      id: 'widerruf',
      titel: 'Widerrufserklärungen',
      zweck: 'Entgegennahme, Bestätigung und Bearbeitung Ihres Widerrufs.',
      daten: ['Name und E-Mail-Adresse', 'Vorgangsnummer', 'Ihre Erklärung', 'Zeitpunkt des Eingangs'],
      rechtsgrundlage: 'Art. 6 Abs. 1 lit. c DSGVO (gesetzliche Pflicht zur Entgegennahme und Bestätigung) und Art. 6 Abs. 1 lit. b DSGVO.',
      empfaenger: 'Supabase Inc. (Speicherung) und Resend Inc. (Eingangsbestätigung per E-Mail, siehe „Versand von E-Mails“)',
      drittland: null,
      speicherdauer: 'Für die Abwicklung und als Nachweis bis zum Ablauf der gesetzlichen Verjährungs- und Aufbewahrungsfristen.',
    },
  ];
}
