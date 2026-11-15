import type { Rubrik, RubrikNachweis, UploadRef, UploadSteckplatz } from '@/lib/types';

// Relativ und ohne 'server-only': Die Regel nutzen auch das Backend (Vorgänge) und der Browser.
import { EINSENDE_QUELLE } from '../einsenden/vorgang';
import {
  ANFRAGE_KLASSEN_DATEN,
  FAHRZEUG_ANFRAGE_QUELLE,
  istAnfrageKlasse,
  verlangtZulassung,
  type AnfrageKlasse,
  type RollerNachweis,
} from '../fahrzeuge/anfrage-klassen';
import { FOTO_ANFRAGE_QUELLE, SCHLUESSEL_STECKPLAETZE, steckplatzPasst } from '../wege/nachweis';

/* ==========================================================================
   Pflichtunterlagen beim Autoschlüssel-Termin (Leitfaden Kap. 05, Schritt 9)
   Der Assistent prüft im Browser (unterlagen-pruefung.ts); der Server prüft
   hier noch einmal, damit kein Termin ohne Fahrzeugschein entsteht.
   - Zulassungsbescheinigung Teil I: immer Pflicht, auch bei Totalverlust.
   - Schlüsselfotos: hier nicht geprüft — bei Totalverlust gibt es nichts zu
     fotografieren, sie bleiben dann freiwillig.
   Mit eingerichteter Dateiablage zählt nur eine hochgeladene Datei (Kennung
   und Einmal-Schlüssel); ohne Ablage (Entwicklung, Notbetrieb) genügt die
   Angabe, welche Datei der Kunde ausgewählt hat.
   ========================================================================== */

export const FAHRZEUGSCHEIN_FEHLT =
  'Bitte laden Sie im Schritt „Zulassungsbescheinigung Teil I“ ein Foto oder eine Datei Ihres Fahrzeugscheins hoch.';

export const FAHRZEUGSCHEIN_NICHT_HOCHGELADEN =
  'Ihr Fahrzeugschein ist noch nicht vollständig hochgeladen. Bitte laden Sie die Datei im Schritt '
  + '„Zulassungsbescheinigung Teil I“ erneut hoch.';

type UploadAngabe = Pick<UploadRef, 'category' | 'storageKey' | 'uploadToken'>;

/** Fehlermeldung, wenn der Fahrzeugschein fehlt — sonst `null`. */
export function fahrzeugscheinPruefen(uploads: readonly UploadAngabe[], ablageEingerichtet: boolean): string | null {
  const scheine = uploads.filter((upload) => upload.category === 'fahrzeugschein');
  if (scheine.length === 0) return FAHRZEUGSCHEIN_FEHLT;
  if (!ablageEingerichtet) return null;
  return scheine.some((upload) => upload.storageKey && upload.uploadToken) ? null : FAHRZEUGSCHEIN_NICHT_HOCHGELADEN;
}

/* ==========================================================================
   Nachweise und Pflichtunterlagen je Rubrik (R13, E3-OPUS-09)
   Jede Rubrik nennt im Rubriken-Modell ihren Berechtigungsnachweis und ihre
   Pflicht-Uploads. Neue Wege (Motorrad, Gehäuse, Transponder-Kopie) prüfen
   hier serverseitig; der Autoschlüssel-Weg nutzt weiter fahrzeugscheinPruefen
   mit unverändertem Verhalten. Kein Weg schwächt einen Nachweis.
   ========================================================================== */

export const SICHERUNGSKARTE_FEHLT =
  'Bitte laden Sie ein Foto Ihrer Sicherungskarte hoch. Ohne Karte fertigen wir Schlüssel mit geschütztem Profil nicht an.';

const NAME: Record<UploadRef['category'], string> = {
  schluesselfoto: 'ein Foto Ihres Schlüssels',
  fahrzeugschein: 'Ihren Fahrzeugschein',
  grundriss: 'einen Grundriss',
  dokument: 'das Dokument',
  objektfoto: 'ein Foto des Objekts',
  sicherungskarte: 'ein Foto Ihrer Sicherungskarte',
  vollmacht: 'die Vollmacht',
};

function hochgeladen(uploads: readonly UploadAngabe[], kategorie: UploadRef['category'], ablageEingerichtet: boolean): boolean {
  const passend = uploads.filter((upload) => upload.category === kategorie);
  if (!passend.length) return false;
  return !ablageEingerichtet || passend.some((upload) => upload.storageKey && upload.uploadToken);
}

/**
 * Berechtigungsnachweis nach R13 — Fehlermeldung oder `null`. Bei Schlüsseln nach Code gilt die
 * Sicherungskarte nur für geschützte Profile: Der Weg ruft die Prüfung je Codelinie mit
 * Kennzeichen „geschützt“ auf (E6), nie für alle Codes, damit der Bestand gleich bleibt.
 */
export function nachweisPruefen(nachweis: RubrikNachweis, uploads: readonly UploadAngabe[], ablageEingerichtet: boolean): string | null {
  if (nachweis === 'fahrzeugschein') return fahrzeugscheinPruefen(uploads, ablageEingerichtet);
  if (nachweis === 'sicherungskarte') return hochgeladen(uploads, 'sicherungskarte', ablageEingerichtet) ? null : SICHERUNGSKARTE_FEHLT;
  return null;
}

/** Pflicht-Uploads einer Rubrik — erste fehlende Unterlage als Meldung, sonst `null`. */
export function pflichtUploadsPruefen(pflicht: readonly UploadRef['category'][], uploads: readonly UploadAngabe[], ablageEingerichtet: boolean): string | null {
  const fehlt = pflicht.find((kategorie) => !hochgeladen(uploads, kategorie, ablageEingerichtet));
  return fehlt ? `Bitte laden Sie ${NAME[fehlt]} hoch.` : null;
}

/** Alles, was eine Rubrik verlangt: erst der Nachweis, dann die Pflicht-Uploads. */
export function rubrikUnterlagenPruefen(
  rubrik: Pick<Rubrik, 'nachweis' | 'pflichtUploads'>,
  uploads: readonly UploadAngabe[],
  ablageEingerichtet: boolean,
): string | null {
  return (
    nachweisPruefen(rubrik.nachweis, uploads, ablageEingerichtet)
    ?? pflichtUploadsPruefen(rubrik.pflichtUploads as UploadRef['category'][], uploads, ablageEingerichtet)
  );
}

/* ==========================================================================
   Eine Pflichtregel für jeden Weg, an dessen Ende ein Fahrzeugschlüssel entsteht (FA-KERN-02, A-048)
   - Fahrzeug mit Zulassung (Auto, Motorrad, zugelassener Roller, „Fahrzeug nicht gefunden“):
     Steckplatz `fahrzeugschein` ist Pflicht.
   - Kleinstfahrzeuge ohne Zulassungsbescheinigung (E-Scooter, Seniorenmobil, Roller mit
     Versicherungskennzeichen, Fahrrad): statt des Fahrzeugscheins ein `ersatznachweis` der
     anerkannten Art; dazu Typenschild oder Fahrzeug-Identifizierungsnummer, beim Fahrrad Hersteller und
     Schlüsselnummer des Schlosses. Nie für Auto oder Motorrad (R13).
   - Schlüssel vorhanden (auch defekt): alle drei Schlüsselfotos. Nur wer ausdrücklich bestätigt,
     keinen Schlüssel mehr zu haben, braucht keine Fotos.
   - Kurze Beschreibung des Anliegens: Pflicht, mindestens BESCHREIBUNG_MIN Zeichen.
   Mit eingerichteter Dateiablage zählt nur eine hochgeladene Datei (Kennung und Einmal-Schlüssel);
   Steckplatz und Kategorie setzt der Server dann aus der gespeicherten Kundendatei.
   ========================================================================== */

/** Grenze des Bestands für Pflichttexte (Anfrage-Formular, Feld Beschreibung). */
export const BESCHREIBUNG_MIN = 20;
export const BESCHREIBUNG_MAX = 2000;

export type SteckplatzAngabe = Pick<UploadRef, 'category' | 'steckplatz' | 'storageKey' | 'uploadToken'>;

export type FehlendeUnterlage =
  | 'fahrzeugschein'
  | 'ersatznachweis'
  | 'ersatznachweis-art'
  | 'typenschild'
  | 'schloss-angaben'
  | 'schluessel-vorderseite'
  | 'schluessel-rueckseite'
  | 'schluessel-spitze'
  | 'beschreibung';

export const FEHLT_TEXT: Record<FehlendeUnterlage, string> = {
  fahrzeugschein: 'den Fahrzeugschein (Zulassungsbescheinigung Teil I)',
  ersatznachweis: 'ein Foto oder PDF Ihres Nachweises',
  'ersatznachweis-art': 'die Angabe, welchen Nachweis Sie hochladen',
  typenschild: 'ein Foto des Typenschilds oder die Fahrzeug-Identifizierungsnummer',
  'schloss-angaben': 'Hersteller und Schlüsselnummer des Schlosses',
  'schluessel-vorderseite': 'das Foto der Vorderseite Ihres Schlüssels',
  'schluessel-rueckseite': 'das Foto der Rückseite Ihres Schlüssels',
  'schluessel-spitze': 'das Foto der Spitze beziehungsweise des Profils von vorne',
  beschreibung: `eine kurze Beschreibung Ihres Anliegens (mindestens ${BESCHREIBUNG_MIN} Zeichen)`,
};

/** Ruhiger Satz zur Meldung: Unterlagen schützen den Kunden. */
export const UNTERLAGEN_SCHUTZ = 'Die Unterlagen schützen Sie vor Missbrauch: Wir fertigen Schlüssel nur für Berechtigte.';

/** Eine Meldung, die sagt, was fehlt — oder `null`, wenn nichts fehlt. */
export function unterlagenMeldung(fehlt: readonly FehlendeUnterlage[]): string | null {
  if (fehlt.length === 0) return null;
  const teile = fehlt.map((art) => FEHLT_TEXT[art]);
  const liste = teile.length === 1 ? teile[0] : `${teile.slice(0, -1).join(', ')} und ${teile.at(-1)}`;
  return `Bitte ergänzen Sie noch ${liste}. ${UNTERLAGEN_SCHUTZ}`;
}

/** Ist der Steckplatz belegt? Ohne Steckplatz zählt nur ein Fahrzeugschein (eindeutig über die Kategorie). */
export function steckplatzBelegt(uploads: readonly SteckplatzAngabe[], steckplatz: UploadSteckplatz, ablageEingerichtet: boolean): boolean {
  return uploads.some((upload) => {
    const passt = upload.steckplatz
      ? upload.steckplatz === steckplatz && steckplatzPasst(upload.category, upload.steckplatz)
      : steckplatz === 'fahrzeugschein' && upload.category === 'fahrzeugschein';
    return passt && (!ablageEingerichtet || Boolean(upload.storageKey && upload.uploadToken));
  });
}

/** Fehlende Schlüsselfotos (Vorderseite, Rückseite, Spitze beziehungsweise Profil von vorne). */
export function fehlendeSchluesselfotos(uploads: readonly SteckplatzAngabe[], ablageEingerichtet: boolean): FehlendeUnterlage[] {
  return SCHLUESSEL_STECKPLAETZE.filter((platz) => !steckplatzBelegt(uploads, platz, ablageEingerichtet));
}

export function beschreibungGueltig(text: unknown): boolean {
  if (typeof text !== 'string') return false;
  const laenge = text.trim().length;
  return laenge >= BESCHREIBUNG_MIN && laenge <= BESCHREIBUNG_MAX;
}

/** Angaben des Falls für die Pflichtregel. Unbekanntes aus dem Browser zählt als nicht angegeben. */
export interface FahrzeugFall {
  klasse: AnfrageKlasse;
  /** Nur Roller: zugelassen oder mit Versicherungskennzeichen. */
  roller?: RollerNachweis | null;
  /** Ausdrücklich bestätigt: „Ich habe keinen Schlüssel mehr“. Ein defekter Schlüssel zählt als vorhanden. */
  keinSchluesselMehr: boolean;
  beschreibung: unknown;
  /** Art des Ersatznachweises (ERSATZNACHWEIS_ARTEN). */
  ersatznachweis?: unknown;
  /** Fahrzeug-Identifizierungsnummer als Angabe statt des Typenschild-Fotos. */
  fin?: unknown;
  /** Bestätigt: Das Fahrzeug hat kein Typenschild. */
  keinTypenschild?: unknown;
  schlossHersteller?: unknown;
  schluesselnummer?: unknown;
}

const FIN_MUSTER = /^[A-Z0-9]{5,30}$/i;

function text(wert: unknown, max: number): string | null {
  if (typeof wert !== 'string') return null;
  const t = wert.trim();
  return t.length >= 1 && t.length <= max ? t : null;
}

/** Was im Fall fehlt — erst der Nachweis, dann die Schlüsselfotos, dann die Beschreibung. */
export function fehlendeFahrzeugUnterlagen(fall: FahrzeugFall, uploads: readonly SteckplatzAngabe[], ablageEingerichtet: boolean): FehlendeUnterlage[] {
  const fehlt: FehlendeUnterlage[] = [];
  const klasse = ANFRAGE_KLASSEN_DATEN[fall.klasse];
  if (verlangtZulassung(fall.klasse, fall.roller)) {
    // Ein Ersatznachweis ersetzt den Fahrzeugschein hier nie (R13).
    if (!steckplatzBelegt(uploads, 'fahrzeugschein', ablageEingerichtet)) fehlt.push('fahrzeugschein');
  } else {
    if (!steckplatzBelegt(uploads, 'ersatznachweis', ablageEingerichtet)) fehlt.push('ersatznachweis');
    const art = klasse.ersatznachweise.find((erlaubt) => erlaubt === fall.ersatznachweis);
    if (!art) fehlt.push('ersatznachweis-art');
    if (klasse.typenschild) {
      const fin = typeof fall.fin === 'string' && FIN_MUSTER.test(fall.fin.trim());
      if (!fin && fall.keinTypenschild !== true && !steckplatzBelegt(uploads, 'typenschild', ablageEingerichtet)) fehlt.push('typenschild');
    }
    if (klasse.schloss && (!text(fall.schlossHersteller, 60) || !text(fall.schluesselnummer, 40))) fehlt.push('schloss-angaben');
  }
  if (!fall.keinSchluesselMehr) fehlt.push(...fehlendeSchluesselfotos(uploads, ablageEingerichtet));
  if (!beschreibungGueltig(fall.beschreibung)) fehlt.push('beschreibung');
  return fehlt;
}

/** Pflichtregel für einen Fahrzeugschlüssel-Weg: Meldung, die sagt, was fehlt, oder `null`. */
export function fahrzeugUnterlagenPruefen(fall: FahrzeugFall, uploads: readonly SteckplatzAngabe[], ablageEingerichtet: boolean): string | null {
  return unterlagenMeldung(fehlendeFahrzeugUnterlagen(fall, uploads, ablageEingerichtet));
}

/** Schlüssel nach Vorlage (Anfrage mit Fotos): drei Schlüsselfotos und eine kurze Beschreibung. */
export function fehlendeVorlageUnterlagen(beschreibung: unknown, uploads: readonly SteckplatzAngabe[], ablageEingerichtet: boolean): FehlendeUnterlage[] {
  return [...fehlendeSchluesselfotos(uploads, ablageEingerichtet), ...(beschreibungGueltig(beschreibung) ? [] : (['beschreibung'] as const))];
}

/* ---------- Welcher Weg, welcher Fall ------------------------------------ */

/** Wege mit Pflichtunterlagen. `fahrzeug-anfrage` ist die gemeinsame Anfrage aus FA-KERN-02B. */
export type UnterlagenWeg = 'termin' | 'motorrad' | 'gehaeuse' | 'vorlage' | 'fahrzeug-anfrage';

/** Ordnet einen Vorgang seinem Weg zu; `null`, wenn der Weg keine Pflichtunterlagen dieser Regel hat. */
export function unterlagenWeg(vorgang: { kind: string; area: string; payload: Record<string, unknown> }): UnterlagenWeg | null {
  const quelle = vorgang.payload?.quelle;
  if (vorgang.kind === 'termin') return vorgang.area === 'autoschluessel' ? 'termin' : null;
  if (vorgang.kind !== 'anfrage') return null;
  if (quelle === FAHRZEUG_ANFRAGE_QUELLE) return 'fahrzeug-anfrage';
  if (vorgang.area === 'autoschluessel' && quelle === 'motorrad') return 'motorrad';
  if (vorgang.area === 'autoschluessel' && quelle === 'gehaeuse') return 'gehaeuse';
  // Foto-Anfrage: eigene Quelle; ältere Vorgänge ohne Quelle zählen dazu. Die allgemeine Anfrage mit dem
  // Thema „Schlüssel nach Vorlage“ trägt `thema` und ist kein Weg dieser Regel (offene Frage im Bericht).
  if (vorgang.area === 'schluessel-nach-vorlage' && quelle !== EINSENDE_QUELLE) {
    if (quelle === FOTO_ANFRAGE_QUELLE || (quelle === undefined && !('thema' in (vorgang.payload ?? {})))) return 'vorlage';
  }
  return null;
}

/**
 * Der Fall eines Fahrzeugweges aus den Angaben des Vorgangs. Beim Termin gilt der Totalverlust nur mit
 * „keine funktionierenden Schlüssel“ und der ausdrücklichen Bestätigung. Das Gehäuse braucht immer den
 * Schlüssel. `null` bei unbekannter Klasse (die gemeinsame Anfrage muss eine nennen).
 */
export function fahrzeugFall(weg: Exclude<UnterlagenWeg, 'vorlage'>, payload: Record<string, unknown>, workingKeys?: number | null): FahrzeugFall | null {
  const bestaetigt = payload.keinSchluesselMehr === true;
  switch (weg) {
    case 'termin':
      return { klasse: 'auto', keinSchluesselMehr: bestaetigt && workingKeys === 0, beschreibung: payload.note };
    case 'motorrad':
      return { klasse: 'motorrad', keinSchluesselMehr: bestaetigt, beschreibung: payload.beschreibung };
    case 'gehaeuse':
      return { klasse: 'auto', keinSchluesselMehr: false, beschreibung: payload.beschreibung };
    case 'fahrzeug-anfrage': {
      if (!istAnfrageKlasse(payload.klasse)) return null;
      const roller = payload.roller === 'zulassung' || payload.roller === 'versicherungskennzeichen' ? payload.roller : null;
      return {
        klasse: payload.klasse,
        roller,
        keinSchluesselMehr: bestaetigt,
        beschreibung: payload.beschreibung,
        ersatznachweis: payload.ersatznachweis,
        fin: payload.fin,
        keinTypenschild: payload.keinTypenschild,
        schlossHersteller: payload.schlossHersteller,
        schluesselnummer: payload.schluesselnummer,
      };
    }
  }
}

/**
 * Was einem Vorgang nach der Regel fehlt. Für die Prüfung beim Absenden und den Hinweis im Backend.
 * `null`, wenn der Weg keine Pflichtunterlagen dieser Regel hat; `'ungueltig'` bei unbekannter Klasse.
 */
export function fehlendePflichtunterlagen(
  vorgang: { kind: string; area: string; payload: Record<string, unknown>; workingKeys?: number | null },
  uploads: readonly SteckplatzAngabe[],
  ablageEingerichtet: boolean,
): FehlendeUnterlage[] | 'ungueltig' | null {
  const weg = unterlagenWeg(vorgang);
  if (!weg) return null;
  if (weg === 'vorlage') return fehlendeVorlageUnterlagen(vorgang.payload.beschreibung, uploads, ablageEingerichtet);
  const fall = fahrzeugFall(weg, vorgang.payload, vorgang.workingKeys);
  return fall ? fehlendeFahrzeugUnterlagen(fall, uploads, ablageEingerichtet) : 'ungueltig';
}

/** Kurzbezeichnung für den Hinweis im Backend und in der Mail an das Team. */
export const FEHLT_KURZ: Record<FehlendeUnterlage, string> = {
  fahrzeugschein: 'Fahrzeugschein',
  ersatznachweis: 'Ersatznachweis',
  'ersatznachweis-art': 'Art des Ersatznachweises',
  typenschild: 'Typenschild oder FIN',
  'schloss-angaben': 'Hersteller und Schlüsselnummer des Schlosses',
  'schluessel-vorderseite': 'Schlüssel Vorderseite',
  'schluessel-rueckseite': 'Schlüssel Rückseite',
  'schluessel-spitze': 'Schlüssel Spitze und Profil von vorne',
  beschreibung: 'Beschreibung des Anliegens',
};

/**
 * Hinweis für das Team an einem gespeicherten Vorgang: welche Pflicht-Steckplätze fehlen. Ältere
 * Vorgänge (vor den Steckplätzen) kennen keine Ansicht der Schlüsselfotos; das steht dann dabei.
 * Gezählt werden nur gespeicherte Dateien (mit Kennung).
 */
export function unterlagenHinweis(vorgang: {
  kind: string;
  area: string;
  payload: Record<string, unknown> | null | undefined;
  uploads: readonly Pick<UploadRef, 'category' | 'steckplatz' | 'storageKey'>[] | null | undefined;
}): string | null {
  const payload = vorgang.payload ?? {};
  const uploads = (vorgang.uploads ?? []).filter((upload) => Boolean(upload.storageKey)).map((upload) => ({ ...upload, uploadToken: 'gespeichert' }));
  const workingKeys = typeof payload.workingKeys === 'number' ? payload.workingKeys : null;
  const fehlt = fehlendePflichtunterlagen({ kind: vorgang.kind, area: vorgang.area, payload, workingKeys }, uploads, true);
  if (fehlt === null) return null;
  if (fehlt === 'ungueltig') return 'Unbekannte Fahrzeugklasse: Unterlagen bitte von Hand prüfen.';
  if (fehlt.length === 0) return null;
  const ohneSteckplatz = uploads.some((upload) => upload.category === 'schluesselfoto' && !upload.steckplatz);
  return (
    `Pflicht-Steckplatz fehlt: ${fehlt.map((art) => FEHLT_KURZ[art]).join(', ')}.`
    + (ohneSteckplatz ? ' Schlüsselfotos aus der Zeit vor den Steckplätzen sind keiner Ansicht zugeordnet.' : '')
  );
}
