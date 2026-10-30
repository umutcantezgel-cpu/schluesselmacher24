/* ==========================================================================
   Betriebszustand: Messwerte → Befunde (docs/SUPABASE.md, Überwachung)
   Reine Funktionen ohne Datenbank. Gemessen wird im täglichen Cron
   (src/lib/server/betriebszustand.ts); hier wird nur bewertet.

   Bewertet werden die Grenzen des Supabase-Free-Plans (Datenbank 500 MB je
   Projekt, Dateiablage 1 GB für die ganze Organisation – davon 800 MB als
   Basis für diese Seite), die Lebenszeichen der nächtlichen Sicherung und
   der hochgerechnete Egress der Sicherung (5 GB im Monat für die ganze
   Organisation). Alle Schwellen lassen sich per Umgebungsvariable anpassen,
   etwa nach dem Wechsel zu Pro.
   ========================================================================== */

export const MB = 1024 * 1024;

export type Stufe = 'warnung' | 'kritisch';

export type BefundArt =
  | 'datenbank-groesse'
  | 'ablage-groesse'
  | 'sicherung-db'
  | 'sicherung-dateien'
  | 'sicherung-egress';

export interface Befund {
  art: BefundArt;
  stufe: Stufe;
  /** Für die Betriebsmail: nur Kennzahlen, nie Kundendaten. */
  text: string;
}

/** Quellen der Lebenszeichen (supabase/sql/0004_lebenszeichen.sql). */
export type LebenszeichenQuelle = 'cron-taeglich' | 'sicherung-db' | 'sicherung-dateien' | 'wache';

export interface Messwerte {
  datenbankBytes: number;
  /** Schätzung aus den Dateigrößen in der Datenbank – ohne Abfrage beim Bucket. */
  ablageBytes: number;
  /** Rohgröße der Tabellen in `public`: so viel überträgt ein Abzug je Lauf. */
  tabellenBytes: number;
  /** `null`, wenn es die Tabelle nicht gibt (lokale Datenbank ohne Supabase-Härtung). */
  lebenszeichen: Partial<Record<LebenszeichenQuelle, Date>> | null;
}

export interface Grenzen {
  datenbankBytes: number;
  ablageBytes: number;
  /** Anteil der Grenze, ab dem gewarnt wird (0–1). */
  warnung: number;
  /** Anteil der Grenze, ab dem es kritisch ist (0–1). */
  kritisch: number;
  /** Höchstalter der Sicherungs-Lebenszeichen in Stunden. */
  sicherungStunden: number;
  /** Hochgerechneter Egress der Sicherung je Monat. */
  egressBytes: number;
  /** Ohne eingerichtete Sicherung (SM24_SICHERUNG_PRUEFEN=0) entfallen deren Prüfungen. */
  sicherungPruefen: boolean;
}

export const STANDARD_GRENZEN: Grenzen = {
  datenbankBytes: 500 * MB,
  ablageBytes: 800 * MB,
  warnung: 0.6,
  kritisch: 0.8,
  sicherungStunden: 36,
  egressBytes: 1536 * MB,
  sicherungPruefen: true,
};

/** Ein vollständiger Abzug je Tag (der zweite Lauf holt nur Verpasstes nach). */
const ABZUEGE_JE_MONAT = 30;

function zahl(env: Record<string, string | undefined>, name: string, standard: number, min = 0): number {
  const roh = env[name]?.trim();
  if (!roh) return standard;
  const wert = Number(roh.replace(',', '.'));
  return Number.isFinite(wert) && wert >= min ? wert : standard;
}

/** Grenzen aus den Umgebungsvariablen (SM24_GRENZE_*), sonst die Werte des Free-Plans. */
export function grenzenAusUmgebung(env: Record<string, string | undefined> = process.env): Grenzen {
  const warnung = zahl(env, 'SM24_GRENZE_WARNUNG_PROZENT', STANDARD_GRENZEN.warnung * 100, 1) / 100;
  const kritisch = zahl(env, 'SM24_GRENZE_KRITISCH_PROZENT', STANDARD_GRENZEN.kritisch * 100, 1) / 100;
  return {
    datenbankBytes: zahl(env, 'SM24_GRENZE_DATENBANK_MB', 500, 1) * MB,
    ablageBytes: zahl(env, 'SM24_GRENZE_ABLAGE_MB', 800, 1) * MB,
    warnung: Math.min(warnung, kritisch),
    kritisch,
    sicherungStunden: zahl(env, 'SM24_GRENZE_SICHERUNG_STUNDEN', STANDARD_GRENZEN.sicherungStunden, 1),
    egressBytes: zahl(env, 'SM24_GRENZE_EGRESS_MB', 1536, 1) * MB,
    sicherungPruefen: env.SM24_SICHERUNG_PRUEFEN?.trim() !== '0',
  };
}

export function inMb(bytes: number): number {
  return Math.round((bytes / MB) * 10) / 10;
}

function prozent(anteil: number): string {
  return `${Math.round(anteil * 100)} %`;
}

function fuellstand(art: 'datenbank-groesse' | 'ablage-groesse', bytes: number, grenze: number, grenzen: Grenzen): Befund | null {
  const anteil = bytes / grenze;
  const stufe: Stufe | null = anteil >= grenzen.kritisch ? 'kritisch' : anteil >= grenzen.warnung ? 'warnung' : null;
  if (!stufe) return null;
  const was = art === 'datenbank-groesse' ? 'Datenbank' : 'Dateiablage (Schätzung)';
  return {
    art,
    stufe,
    text: `${was}: ${inMb(bytes)} MB von ${inMb(grenze)} MB belegt (${prozent(anteil)}).`,
  };
}

function sicherung(
  art: 'sicherung-db' | 'sicherung-dateien',
  zuletzt: Date | undefined,
  jetzt: Date,
  grenzen: Grenzen,
): Befund | null {
  const was = art === 'sicherung-db' ? 'Sicherung der Datenbank' : 'Sicherung der Dateien';
  if (!zuletzt) {
    return { art, stufe: 'warnung', text: `${was}: noch nie gelaufen. Einrichtung siehe docs/SUPABASE.md.` };
  }
  const stunden = (jetzt.getTime() - zuletzt.getTime()) / 3_600_000;
  if (stunden <= grenzen.sicherungStunden) return null;
  return { art, stufe: 'kritisch', text: `${was}: letzter Erfolg vor ${Math.floor(stunden)} Stunden.` };
}

/** Bewertet die Messwerte. Ohne Befund ist alles im grünen Bereich. */
export function betriebBefunde(messwerte: Messwerte, jetzt: Date, grenzen: Grenzen = STANDARD_GRENZEN): Befund[] {
  const befunde: Array<Befund | null> = [
    fuellstand('datenbank-groesse', messwerte.datenbankBytes, grenzen.datenbankBytes, grenzen),
    fuellstand('ablage-groesse', messwerte.ablageBytes, grenzen.ablageBytes, grenzen),
  ];

  // Ohne Lebenszeichen-Tabelle (lokal) gibt es keine Sicherung zu prüfen.
  if (messwerte.lebenszeichen && grenzen.sicherungPruefen) {
    befunde.push(
      sicherung('sicherung-db', messwerte.lebenszeichen['sicherung-db'], jetzt, grenzen),
      sicherung('sicherung-dateien', messwerte.lebenszeichen['sicherung-dateien'], jetzt, grenzen),
    );
    const egress = messwerte.tabellenBytes * ABZUEGE_JE_MONAT;
    if (egress > grenzen.egressBytes) {
      befunde.push({
        art: 'sicherung-egress',
        stufe: 'warnung',
        text:
          `Sicherung: etwa ${inMb(egress)} MB Egress im Monat hochgerechnet `
          + `(Grenze ${inMb(grenzen.egressBytes)} MB, Kontingent 5 GB für die ganze Organisation).`,
      });
    }
  }
  return befunde.filter((befund): befund is Befund => befund !== null);
}
