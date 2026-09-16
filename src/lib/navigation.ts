import type { AreaKey, ProcessKind } from '@/lib/types';

/* ==========================================================================
   Navigation
   Die neun Hauptbereiche aus dem Leitfaden. Autoschlüssel steht bewusst
   an erster Stelle und ist der einzige Bereich mit eigener Themenwelt.
   ========================================================================== */

export interface NavLink {
  href: string;
  label: string;
  description?: string;
}

export interface NavColumn {
  title: string;
  links: NavLink[];
}

export interface NavArea {
  key: AreaKey;
  label: string;
  href: string;
  /** Kurzbeschreibung für Einstiegskacheln. */
  summary: string;
  /** Welcher Kundenprozess in diesem Bereich führt. */
  process: ProcessKind;
  columns: NavColumn[];
  /** Hervorgehobener nächster Schritt im Menü. */
  highlight?: NavLink;
}

export const NAV_AREAS: NavArea[] = [
  {
    key: 'autoschluessel',
    label: 'Autoschlüssel',
    href: '/autoschluessel',
    summary: 'Nachmachen, programmieren, reparieren — mit festem Termin.',
    process: 'termin-mit-anzahlung',
    highlight: {
      href: '/autoschluessel/anfrage',
      label: 'Fahrzeug auswählen und Termin starten',
      description: 'Geführter Ablauf mit Preisangabe, Anzahlung und Termin',
    },
    columns: [
      {
        title: 'Leistungen',
        links: [
          { href: '/autoschluessel/nachmachen', label: 'Autoschlüssel nachmachen', description: 'Zweit- und Ersatzschlüssel' },
          { href: '/autoschluessel/programmieren', label: 'Programmieren und anlernen', description: 'Transponder, Funk, Smart Key' },
          { href: '/autoschluessel/kopieren', label: 'Autoschlüssel kopieren', description: 'Mechanische Kopie nach Vorlage' },
          { href: '/autoschluessel/schluesselbart-fraesen', label: 'Schlüsselbart fräsen', description: 'Mechanische Fertigung' },
        ],
      },
      {
        title: 'Schlüsselarten',
        links: [
          { href: '/autoschluessel/funkschluessel', label: 'Funkschlüssel', description: 'Fernbedienung, Tasten, Ersatz' },
          { href: '/autoschluessel/smart-key', label: 'Smart Key und Keyless', description: 'Schlüsselloser Zugang und Start' },
          { href: '/autoschluessel/fahrzeugoeffnung', label: 'Fahrzeugöffnung', description: 'Zerstörungsfrei öffnen' },
        ],
      },
      {
        title: 'Fahrzeuge',
        links: [
          { href: '/autoschluessel/marken', label: 'Marken und Modelle', description: 'Was für Ihr Fahrzeug gilt' },
          { href: '/ratgeber/autoschluessel-verloren-was-tun', label: 'Schlüssel verloren?', description: 'Die richtige Reihenfolge' },
        ],
      },
    ],
  },
  {
    key: 'schluessel-nach-vorlage',
    label: 'Schlüssel nach Vorlage',
    href: '/schluessel-nach-vorlage',
    summary: 'Drei Fotos hochladen — wir prüfen Machbarkeit und Preis.',
    process: 'gefuehrte-anfrage',
    highlight: {
      href: '/schluessel-nach-vorlage/anfrage',
      label: 'Anfrage mit Fotos starten',
      description: 'Ohne Einsendung des Originals',
    },
    columns: [
      {
        title: 'Ablauf',
        links: [
          { href: '/schluessel-nach-vorlage', label: 'So funktioniert es', description: 'Von der Anfrage bis zum Schlüssel' },
          { href: '/schluessel-nach-vorlage/anfrage', label: 'Anfrage starten', description: 'Acht Schritte, mobil bedienbar' },
          { href: '/ratgeber/schluesselcode-finden', label: 'Code statt Foto?', description: 'Wann der Code schneller ist' },
        ],
      },
    ],
  },
  {
    key: 'schluessel-nach-code',
    label: 'Schlüssel nach Code',
    href: '/schluessel-nach-code',
    summary: 'Code eingeben und direkt bestellen. Ohne Einsendung.',
    process: 'direktkauf',
    highlight: {
      href: '/schluessel-nach-code',
      label: 'Alle Codelinien ansehen',
      description: 'Suchen, filtern, Code eingeben, bestellen',
    },
    columns: [
      {
        title: 'Shop',
        links: [
          { href: '/schluessel-nach-code', label: 'Codelinien durchsuchen', description: 'Nach Anwendung und Schlüsseltyp' },
          { href: '/ratgeber/schluesselcode-finden', label: 'Wo finde ich den Code?', description: 'Typische Fundstellen' },
          { href: '/rechtliches/versand-und-zahlung', label: 'Versand und Zahlung', description: 'Versandarten und Fristen' },
        ],
      },
    ],
  },
  {
    key: 'gleichschliessende-zylinder',
    label: 'Gleichschließende Zylinder',
    href: '/gleichschliessende-zylinder',
    summary: 'Mehrere Türen, ein Schlüssel — direkt konfigurierbar.',
    process: 'direktkauf',
    highlight: {
      href: '/gleichschliessende-zylinder/konfigurator',
      label: 'Zylinder zusammenstellen',
      description: 'Bauform, Maße, Funktion, Schlüsselanzahl',
    },
    columns: [
      {
        title: 'Konfiguration',
        links: [
          { href: '/gleichschliessende-zylinder', label: 'Was ist eine Gleichschließung?', description: 'Einfach erklärt' },
          { href: '/gleichschliessende-zylinder/konfigurator', label: 'Zum Konfigurator', description: 'Direkt bestellbar' },
          { href: '/ratgeber/zylinder-richtig-ausmessen', label: 'Zylinder richtig messen', description: 'Maß A und Maß B' },
        ],
      },
    ],
  },
  {
    key: 'schliessanlagen',
    label: 'Schließanlagen',
    href: '/schliessanlagen',
    summary: 'Von der Gleichschließung bis zur Generalhauptschlüsselanlage.',
    process: 'projektkonfigurator',
    highlight: {
      href: '/schliessanlagen/konfigurator',
      label: 'Projekt erfassen',
      description: 'Strukturierte Planung in zehn Blöcken',
    },
    columns: [
      {
        title: 'Systeme',
        links: [
          { href: '/schliessanlagen#systeme', label: 'Systeme im Vergleich', description: 'Gleichschließung, Z, HS, GHS' },
          { href: '/schliessanlagen/konfigurator', label: 'Projektkonfigurator', description: 'Für Haus, Betrieb und Verwaltung' },
          { href: '/ratgeber/welche-schliessanlage-passt', label: 'Welche Anlage passt?', description: 'Entscheidungshilfe' },
        ],
      },
    ],
  },
  {
    key: 'elektronische-zutrittsloesungen',
    label: 'Elektronische Zutrittslösungen',
    href: '/elektronische-zutrittsloesungen',
    summary: 'Karte, Transponder, PIN, App und digitale Zylinder.',
    process: 'projektkonfigurator',
    highlight: {
      href: '/elektronische-zutrittsloesungen/konfigurator',
      label: 'Bedarf erfassen',
      description: 'Türen, Nutzer, Medien, Berechtigungen',
    },
    columns: [
      {
        title: 'Lösungen',
        links: [
          { href: '/elektronische-zutrittsloesungen', label: 'Überblick', description: 'Was elektronisch möglich ist' },
          { href: '/elektronische-zutrittsloesungen/konfigurator', label: 'Zutrittskonfigurator', description: 'Acht Fragen zu Ihrem Objekt' },
          { href: '/ratgeber/mechanisch-oder-elektronisch', label: 'Mechanisch oder elektronisch?', description: 'Entscheidungshilfe' },
        ],
      },
    ],
  },
  {
    key: 'tuer-und-schliesstechnik',
    label: 'Tür- und Schließtechnik',
    href: '/tuer-und-schliesstechnik',
    summary: 'Zylinder, Schlösser, Beschläge und Türtechnik.',
    process: 'gefuehrte-anfrage',
    columns: [
      {
        title: 'Schließtechnik',
        links: [
          { href: '/tuer-und-schliesstechnik/profilzylinder-und-spezialzylinder', label: 'Profil- und Spezialzylinder' },
          { href: '/tuer-und-schliesstechnik/einsteckschloesser', label: 'Einsteckschlösser' },
          { href: '/tuer-und-schliesstechnik/mehrfachverriegelungen', label: 'Mehrfachverriegelungen' },
          { href: '/tuer-und-schliesstechnik/schutzbeschlaege', label: 'Schutzbeschläge' },
          { href: '/tuer-und-schliesstechnik/tuerzusatzschloesser', label: 'Türzusatzschlösser' },
        ],
      },
      {
        title: 'Türtechnik und Service',
        links: [
          { href: '/tuer-und-schliesstechnik/tuerschliesser', label: 'Türschließer' },
          { href: '/tuer-und-schliesstechnik/panik-und-fluchttuertechnik', label: 'Panik- und Fluchttürtechnik' },
          { href: '/tuer-und-schliesstechnik/reparatur-und-austausch', label: 'Reparatur und Austausch' },
          { href: '/tuer-und-schliesstechnik/technische-beratung', label: 'Technische Beratung' },
          { href: '/tuer-und-schliesstechnik/montage-und-anpassung', label: 'Montage und Anpassung' },
        ],
      },
    ],
  },
  {
    key: 'sicherheitstechnik',
    label: 'Sicherheitstechnik',
    href: '/sicherheitstechnik',
    summary: 'Einbruchschutz, Überwachung und Alarmierung.',
    process: 'gefuehrte-anfrage',
    highlight: {
      href: '/sicherheitstechnik/sicherheitscheck',
      label: 'Sicherheitscheck starten',
      description: 'Geführte Bestandsaufnahme Ihres Objekts',
    },
    columns: [
      {
        title: 'Bereiche',
        links: [
          { href: '/sicherheitstechnik/videoueberwachung', label: 'Videoüberwachung' },
          { href: '/sicherheitstechnik/alarmtechnik', label: 'Alarmtechnik' },
          { href: '/sicherheitstechnik/aussenhautsicherung', label: 'Sicherung der Außenhaut' },
          { href: '/sicherheitstechnik/mechanischer-schutz', label: 'Mechanischer Schutz' },
        ],
      },
      {
        title: 'Weiteres',
        links: [
          { href: '/sicherheitstechnik/smarte-funktionen', label: 'Smarte Funktionen' },
          { href: '/sicherheitstechnik/panik-und-alarmtaster', label: 'Panik- und Alarmtaster' },
          { href: '/sicherheitstechnik/kombinierte-konzepte', label: 'Kombinierte Konzepte' },
          { href: '/ratgeber/einbruchschutz-wo-anfangen', label: 'Wo sinnvoll anfangen?' },
        ],
      },
    ],
  },
  {
    key: 'service-und-termin',
    label: 'Service und Termin',
    href: '/service-und-termin',
    summary: 'Anfrage, Terminstatus, Kontakt und Vor-Ort-Leistungen.',
    process: 'gefuehrte-anfrage',
    columns: [
      {
        title: 'Service',
        links: [
          { href: '/service-und-termin/anfrage', label: 'Allgemeine Anfrage', description: 'Wenn nichts anderes passt' },
          { href: '/service-und-termin/terminstatus', label: 'Terminstatus', description: 'Stand Ihres Vorgangs' },
          { href: '/service-und-termin/vor-ort', label: 'Vor-Ort-Leistungen', description: 'Was wir beim Kunden erledigen' },
          { href: '/service-und-termin/kontakt', label: 'Kontakt', description: 'Erreichbarkeit und Anfahrt' },
        ],
      },
    ],
  },
];

/** Einstiege auf der Startseite — dieselbe Reihenfolge wie die Navigation. */
export const QUICK_ENTRIES = NAV_AREAS.filter((a) => a.key !== 'service-und-termin');

export const FOOTER_LEGAL: NavLink[] = [
  { href: '/rechtliches/impressum', label: 'Impressum' },
  { href: '/rechtliches/datenschutz', label: 'Datenschutz' },
  { href: '/rechtliches/widerruf', label: 'Widerruf und Rückgabe' },
  { href: '/rechtliches/versand-und-zahlung', label: 'Zahlung und Versand' },
  { href: '/rechtliches/agb', label: 'AGB' },
  { href: '/rechtliches/cookie-einstellungen', label: 'Cookie-Einstellungen' },
];

export const FOOTER_CONTENT: NavLink[] = [
  { href: '/ratgeber', label: 'Ratgeber' },
  { href: '/standorte', label: 'Einsatzgebiete' },
  { href: '/service-und-termin/terminstatus', label: 'Terminstatus' },
  { href: '/service-und-termin/kontakt', label: 'Kontakt' },
];

/** Beschriftung der vier Kundenprozesse — überall gleich benannt. */
export const PROCESS_LABELS: Record<ProcessKind, { label: string; hint: string }> = {
  direktkauf: {
    label: 'Direkt kaufen',
    hint: 'Sie wählen aus, bezahlen und erhalten eine Bestellbestätigung.',
  },
  'gefuehrte-anfrage': {
    label: 'Geführte Anfrage',
    hint: 'Wir prüfen Ihren Fall und melden uns mit Machbarkeit und Preis.',
  },
  projektkonfigurator: {
    label: 'Projektkonfigurator',
    hint: 'Sie erfassen Ihr Projekt, wir erstellen daraus ein Angebot.',
  },
  'termin-mit-anzahlung': {
    label: 'Termin mit Anzahlung',
    hint: 'Sie leisten eine Anzahlung und buchen einen festen Termin.',
  },
};

export function areaByKey(key: AreaKey): NavArea | undefined {
  return NAV_AREAS.find((a) => a.key === key);
}
