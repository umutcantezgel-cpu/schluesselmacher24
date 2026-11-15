/* ==========================================================================
   Adressen neuer Inhaltsseiten (FA-KERN-05, FA-22-33): reine Prüfung ohne
   Importe, für den Hook der Sammlung Seitentexte (`seiten-adresse.ts`) und die
   Auffangroute `src/app/(site)/[...unbekannt]`.
   ========================================================================== */

/**
 * Erste Abschnitte, die eine eigene Route der Website haben (src/app/(site), src/app/(payload) und
 * Dateien in src/app). Ein Test hält die Liste mit den Ordnern gleich.
 */
export const VORHANDENE_ROUTEN: readonly string[] = [
  'admin',
  'api',
  'artikel',
  'auftrag-bestaetigen',
  'autoschluessel',
  'beratung',
  'bestellung',
  'e-scooter',
  'elektronische-zutrittsloesungen',
  'fahrradschluessel',
  'gleichschliessende-zylinder',
  'kasse',
  'motorradschluessel',
  'partner-werden',
  'ratgeber',
  'rechtliches',
  'roller-und-kleinstfahrzeuge',
  'schliessanlagen',
  'schluessel-einschicken',
  'schluessel-nach-code',
  'schluessel-nach-vorlage',
  'seniorenmobile',
  'service-und-termin',
  'shop',
  'sicherheitstechnik',
  'standorte',
  'tuer-und-schliesstechnik',
  'warenkorb',
];

/** Namen, die eine neue Seite nie bekommt: technische Pfade, bekannte Angriffsziele, rechtliche Seiten. */
export const RESERVIERTE_NAMEN: readonly string[] = [
  'agb',
  'apple-icon',
  'assets',
  'datenschutz',
  'favicon',
  'feed',
  'graphql',
  'health',
  'home',
  'icon',
  'impressum',
  'index',
  'kontakt',
  'konto',
  'login',
  'logout',
  'manifest',
  'media',
  'medien',
  'next',
  'opengraph-image',
  'preview',
  'robots',
  'rss',
  'search',
  'seiten',
  'sitemap',
  'startseite',
  'static',
  'status',
  'suche',
  'twitter-image',
  'uploads',
  'vercel',
  'vorschau',
  'widerruf',
  'wp-admin',
  'wp-login',
];

const MUSTER = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const ADRESSE_MELDUNG = {
  form: 'Bitte als Adresse nur Kleinbuchstaben, Ziffern und einzelne Bindestriche verwenden, 3 bis 60 Zeichen, ohne Schrägstrich.',
  vergeben: 'Diese Adresse gehört schon zu einer Seite der Website. Bitte eine andere wählen.',
  reserviert: 'Diese Adresse ist reserviert. Bitte eine andere wählen.',
} as const;

/** Prüft die Adresse einer neuen Inhaltsseite. Liefert eine Meldung oder `null`. */
export function adressePruefen(adresse: unknown): string | null {
  if (typeof adresse !== 'string') return ADRESSE_MELDUNG.form;
  const wert = adresse.trim();
  if (wert.length < 3 || wert.length > 60 || !MUSTER.test(wert)) return ADRESSE_MELDUNG.form;
  if (VORHANDENE_ROUTEN.includes(wert)) return ADRESSE_MELDUNG.vergeben;
  if (RESERVIERTE_NAMEN.includes(wert)) return ADRESSE_MELDUNG.reserviert;
  return null;
}

/** Darf die Auffangroute diese Adresse als eigene Inhaltsseite zeigen? */
export function eigeneSeiteAdresse(abschnitte: readonly string[] | undefined): string | null {
  if (!abschnitte || abschnitte.length !== 1) return null;
  const adresse = abschnitte[0];
  return adressePruefen(adresse) === null ? adresse : null;
}
