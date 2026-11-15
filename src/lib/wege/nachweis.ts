/*
 * Berechtigungsnachweis in jedem Schlüsselweg (R13, E6-OPUS-01, E-102). Die Regeln stehen im
 * Rubriken-Modell (`nachweis`) und in unterlagen-pflicht.ts; hier steht, wann ein Weg sie verlangt:
 *
 * - Schlüssel nach Code: Ein Pflichtfoto der Codelinie ist der Nachweis der Rubrik, die
 *   Sicherungskarte eines geschützten Profils (heute ZY-02). Codelinien mit freiwilligem Foto
 *   bleiben, wie sie sind; die Kasse prüft das Pflichtfoto jetzt auch auf dem Server.
 * - Schlüssel nach Vorlage (Anfrage mit Fotos): Gehört der Schlüssel zu einer Anlage mit Sicherungskarte („ja“), ist ein
 *   Foto der Karte Pflicht. „Nein“ und „weiß ich nicht“ halten die Anfrage nicht auf; die Werkstatt
 *   prüft vor der Fertigung (die Antwort steht im Vorgang).
 *
 * Reine Funktionen ohne Seiteneffekte, im Browser und auf dem Server nutzbar.
 */

import type { CodeLine, UploadRef, UploadSteckplatz } from '@/lib/types';

/** Antwort auf die Frage nach der Sicherungskarte in der Foto-Anfrage. */
export type KartenAntwort = '' | 'ja' | 'nein' | 'unklar';

export const KARTEN_ANTWORTEN: ReadonlyArray<{ wert: Exclude<KartenAntwort, ''>; titel: string; satz: string }> = [
  { wert: 'ja', titel: 'Ja, ich habe die Karte', satz: 'Sie laden gleich ein Foto der Karte hoch.' },
  { wert: 'nein', titel: 'Nein, es gibt keine Karte', satz: 'Das ist bei den meisten Haus- und Wohnungsschlüsseln so.' },
  { wert: 'unklar', titel: 'Weiß ich nicht', satz: 'Wir prüfen das anhand Ihrer Fotos und melden uns.' },
];

export const KARTEN_LABEL: Record<Exclude<KartenAntwort, ''>, string> = {
  ja: 'vorhanden, Foto liegt bei',
  nein: 'keine',
  unklar: 'unklar, bitte prüfen',
};

/** Kategorie des Fotos einer Codelinie: Pflichtfoto ist die Sicherungskarte, sonst ein Schlüsselfoto. */
export function codeFotoKategorie(line: Pick<CodeLine, 'photoUpload'>): Extract<UploadRef['category'], 'schluesselfoto' | 'sicherungskarte'> {
  return line.photoUpload === 'pflicht' ? 'sicherungskarte' : 'schluesselfoto';
}

/** Verlangt die Codelinie die Sicherungskarte als Nachweis? */
export function codeVerlangtKarte(line: Pick<CodeLine, 'photoUpload'>): boolean {
  return codeFotoKategorie(line) === 'sicherungskarte';
}

/** Verlangt die Foto-Anfrage die Sicherungskarte? Nur bei der Antwort „ja“. */
export function fotoAnfrageVerlangtKarte(payload: Record<string, unknown>): boolean {
  return payload.sicherungskarte === 'ja';
}

/** Quelle der Einsatz-Anfrage vor Ort (E6-BAUMEISTER-05). */
export const VOR_ORT_QUELLE = 'vor-ort';

/**
 * Arbeiten an Türen und Schlössern vor Ort nur mit bestätigter Berechtigung (R13): Die Anfrage trägt
 * `berechtigt: true`, sonst nimmt der Server sie nicht an. Der Nachweis selbst folgt vor Ort.
 */
export function vorOrtOhneBerechtigung(payload: Record<string, unknown>): boolean {
  return payload.quelle === VOR_ORT_QUELLE && payload.berechtigt !== true;
}

/** Gültige Antwort aus dem payload, sonst leer (ältere Anfragen kennen die Frage nicht). */
export function kartenAntwort(wert: unknown): KartenAntwort {
  return wert === 'ja' || wert === 'nein' || wert === 'unklar' ? wert : '';
}

/**
 * Anfragen aus Rubrik-Wegen ohne eigene Vorgangsart (E6): Die Quelle im payload bestimmt die Rubrik,
 * deren Nachweis und Pflicht-Uploads der Server verlangt (R13). Die Regeln selbst stehen in den
 * Rubrikdaten (G-11); hier steht nur, welcher Weg zu welcher Rubrik gehört.
 */
export const QUELLE_RUBRIK: Readonly<Record<string, string>> = {
  motorrad: 'motorradschluessel',
  gehaeuse: 'autoschluessel-gehaeuse',
};

/* ==========================================================================
   Steckplätze der Kundendateien (FA-KERN-02, A-048)
   Jede Datei trägt neben der Kategorie einen Steckplatz. Der Server vergibt und prüft ihn beim
   Hochladen und übernimmt ihn beim Absenden nur aus der gespeicherten Kundendatei.
   ========================================================================== */

export const UPLOAD_STECKPLAETZE = [
  'fahrzeugschein',
  'schluessel-vorderseite',
  'schluessel-rueckseite',
  'schluessel-spitze',
  'ersatznachweis',
  'typenschild',
  'sicherungskarte',
  'sonstiges',
] as const satisfies readonly UploadSteckplatz[];

/** Die drei Schlüsselfotos in der Reihenfolge der Fotoanleitung. */
export const SCHLUESSEL_STECKPLAETZE = ['schluessel-vorderseite', 'schluessel-rueckseite', 'schluessel-spitze'] as const satisfies readonly UploadSteckplatz[];

/** Beschriftung im Backend, im Vorgangsblatt und in der Mail an das Team. */
export const STECKPLATZ_LABEL: Record<UploadSteckplatz, string> = {
  fahrzeugschein: 'Fahrzeugschein',
  'schluessel-vorderseite': 'Schlüssel Vorderseite',
  'schluessel-rueckseite': 'Schlüssel Rückseite',
  'schluessel-spitze': 'Schlüssel Spitze und Profil von vorne',
  ersatznachweis: 'Ersatznachweis',
  typenschild: 'Typenschild',
  sicherungskarte: 'Sicherungskarte',
  sonstiges: 'Sonstiges',
};

/**
 * Welche Kategorie zu welchem Steckplatz passt. Der Fahrzeugschein-Steckplatz nimmt nur die Kategorie
 * Fahrzeugschein; ein Ersatznachweis ist nie ein Fahrzeugschein (R13). „Sonstiges“ passt zu jeder Kategorie.
 */
export const STECKPLATZ_KATEGORIEN: Record<UploadSteckplatz, readonly UploadRef['category'][] | 'alle'> = {
  fahrzeugschein: ['fahrzeugschein'],
  'schluessel-vorderseite': ['schluesselfoto'],
  'schluessel-rueckseite': ['schluesselfoto'],
  'schluessel-spitze': ['schluesselfoto'],
  ersatznachweis: ['dokument'],
  typenschild: ['dokument'],
  sicherungskarte: ['sicherungskarte'],
  sonstiges: 'alle',
};

/** Passt der Steckplatz zur Kategorie? Ohne Steckplatz (ältere Formulare) immer ja. */
export function steckplatzPasst(kategorie: UploadRef['category'], steckplatz: UploadSteckplatz | undefined | null): boolean {
  if (!steckplatz) return true;
  const erlaubt = STECKPLATZ_KATEGORIEN[steckplatz];
  return erlaubt === 'alle' || erlaubt.includes(kategorie);
}

/** Bezeichnung einer Datei: Steckplatz, sonst die Kategorie (ältere Vorgänge). */
export function dateiBezeichnung(
  datei: Pick<UploadRef, 'category' | 'steckplatz'>,
  kategorieLabel: Partial<Record<UploadRef['category'], string>>,
): string {
  const art = kategorieLabel[datei.category] ?? datei.category;
  if (!datei.steckplatz) return art;
  if (datei.steckplatz === 'sonstiges') return `${art} (Sonstiges)`;
  return STECKPLATZ_LABEL[datei.steckplatz] ?? art;
}
