/*
 * Einsende-Varianten des Inhabers (FA-13, Anhang B, A-050): DHL Paket, Einschreiben Einwurf,
 * Einschreiben Wert. Startwerte nur mit belegten Angaben (R4, R9): Haftung aus der Tabelle des Inhabers,
 * Porto aus FA-RECHERCHE-03 und E1-versand (Quelle und Stand im Feld `portoStand`). Ist ein Porto nicht
 * belegt, bleibt es leer, und die Seite sagt „Porto laut Post, bitte dort prüfen“.
 *
 * Reine Daten und Funktionen, nur relative Importe (Browser, Server, Backend-Hooks).
 */

import type { EinsendeEinstellungen, EinsendeEmpfehlung, EinsendeVariante, EinsendeVarianteKennung, Einlieferung } from '../types';

export const VARIANTEN_KENNUNGEN: readonly EinsendeVarianteKennung[] = ['dhl-paket', 'einschreiben-einwurf', 'einschreiben-wert'];

/** Verpackungshinweis im Wortlaut des Inhabers (Abschnitt 13). */
export const VERPACKUNG_HINWEIS =
  'Schlüssel nicht lose in einen einfachen Papierumschlag legen, sondern gepolstert beziehungsweise stabil verpacken.';

/** Steht, wenn ein Porto nicht belegt ist (R4). */
export const PORTO_UNBELEGT = 'Porto laut Post, bitte dort prüfen';

/** Ehrlicher Satz zur Haftung für alle Varianten (FA-RECHERCHE-03, Abschnitt 5). */
export const HAFTUNG_HINWEIS =
  'Die Haftung gilt je Sendung nach den Bedingungen des Versanddienstes. Im Schadensfall ist der Wert nachzuweisen.';

/** Hinweis, den der Kunde vor der Wahl eines Sonderfalls bestätigt. */
export const SONDERFALL_HINWEIS =
  'Diese Versandart ist nur für geeignete Sonderfälle gedacht. Sie geben den Brief in einer Filiale der Post ab und bewahren '
  + 'den Einlieferungsbeleg auf. Ob ein Schlüssel als Wertgegenstand gilt, klären Sie bitte vorher mit der Post.';

const PREISLISTE_POST = 'Deutsche Post, Leistungen und Preise (Stand 1.1.2026), geprüft am 15.11.2026';

/** Startwerte (A-050, Punkt 1). Reihenfolge = Reihenfolge auf der Seite. */
export const STANDARD_VARIANTEN: readonly EinsendeVariante[] = [
  {
    kennung: 'dhl-paket',
    bezeichnung: 'DHL Paket',
    einsatz: 'Empfohlene Standardoption für wertvolle Originalschlüssel, mit Sendungsverfolgung.',
    haftungEuro: 500,
    sendungsverfolgung: true,
    einlieferung: ['filiale', 'paketshop'],
    portoCents: 769,
    portoStand: `DHL Paket bis 5 kg, abgegeben in Filiale oder Paketshop. ${PREISLISTE_POST}`,
    aufpreisCents: 0,
    empfohlenFuer: ['originalschluessel', 'autoschluessel'],
    nurSonderfall: false,
    aktiv: true,
  },
  {
    kennung: 'einschreiben-einwurf',
    bezeichnung: 'Einschreiben Einwurf',
    einsatz: 'Günstige Briefoption für weniger wertvolle Schlüssel. Die Zustellung ist dokumentiert.',
    haftungEuro: 20,
    sendungsverfolgung: true,
    einlieferung: ['filiale'],
    portoCents: 415,
    portoStand: `Großbrief 1,80 € und Zuschlag Einschreiben Einwurf 2,35 €. ${PREISLISTE_POST}`,
    aufpreisCents: 0,
    empfohlenFuer: [],
    nurSonderfall: false,
    aktiv: true,
  },
  {
    kennung: 'einschreiben-wert',
    bezeichnung: 'Einschreiben Wert',
    einsatz: 'Nur für geeignete Sonderfälle: höhere Absicherung, Einlieferung nur in der Filiale.',
    haftungEuro: 500,
    sendungsverfolgung: true,
    einlieferung: ['filiale'],
    portoCents: 625,
    portoStand: `Großbrief 1,80 €, Zuschlag Einschreiben 2,65 € und Zusatzentgelt Wert 1,80 €. ${PREISLISTE_POST}`,
    aufpreisCents: 0,
    empfohlenFuer: [],
    nurSonderfall: true,
    aktiv: true,
  },
];

export function istVariantenKennung(wert: unknown): wert is EinsendeVarianteKennung {
  return typeof wert === 'string' && (VARIANTEN_KENNUNGEN as readonly string[]).includes(wert);
}

/**
 * Bisheriger Aufpreis des Betriebs für eine Variante, solange die Liste noch nicht gepflegt ist (G9):
 * DHL Paket und Einschreiben Wert aus „versichert“, Einschreiben Einwurf aus „unversichert“. So fällt
 * ein im Admin eingetragener Aufpreis beim Wechsel auf die Varianten nicht still weg.
 */
export function altAufpreis<T>(kennung: EinsendeVarianteKennung, alt: { versichert?: T; unversichert?: T }): T | undefined {
  return kennung === 'einschreiben-einwurf' ? alt.unversichert : alt.versichert;
}

type VariantenQuelle = Pick<EinsendeEinstellungen, 'varianten'> & Partial<Pick<EinsendeEinstellungen, 'aufpreisVersichertCents' | 'aufpreisUnversichertCents'>>;

/** Varianten aus den Einstellungen; ältere Stände ohne Varianten nehmen die Startwerte mit dem bisherigen Aufpreis. */
export function variantenAus(e: VariantenQuelle | undefined): EinsendeVariante[] {
  if (e?.varianten?.length) return e.varianten;
  const alt = { versichert: e?.aufpreisVersichertCents, unversichert: e?.aufpreisUnversichertCents };
  return STANDARD_VARIANTEN.map((v) => {
    const aufpreis = altAufpreis(v.kennung, alt);
    return {
      ...v,
      einlieferung: [...v.einlieferung],
      empfohlenFuer: [...v.empfohlenFuer],
      aufpreisCents: typeof aufpreis === 'number' && Number.isFinite(aufpreis) && aufpreis > 0 ? aufpreis : v.aufpreisCents,
    };
  });
}

export function varianteZu(e: Pick<EinsendeEinstellungen, 'varianten'> | undefined, kennung: unknown): EinsendeVariante | undefined {
  return istVariantenKennung(kennung) ? variantenAus(e).find((v) => v.kennung === kennung) : undefined;
}

/** Was der Kunde einschickt (A-050, Punkt 3). Fahrzeugschlüssel brauchen den Fahrzeugschein (R13). */
export type Schluesselart = 'haus' | 'auto-mechanisch' | 'elektronik';

export const SCHLUESSELARTEN: readonly { wert: Schluesselart; titel: string; satz: string }[] = [
  { wert: 'haus', titel: 'Haus-, Wohnungs- oder Briefkastenschlüssel', satz: 'Auch Möbel- und Vorhängeschlossschlüssel, ohne Elektronik.' },
  { wert: 'auto-mechanisch', titel: 'Mechanischer Autoschlüssel oder reiner Schlüsselbart', satz: 'Ohne Transponder und Funk. Dafür brauchen wir Ihren Fahrzeugschein.' },
  { wert: 'elektronik', titel: 'Schlüssel mit Elektronik', satz: 'Zum Beispiel mit Transponder oder Funk, nicht für Fahrzeuge.' },
];

/**
 * Was das Einsendeformular anbietet: alle Schlüsselarten. Mechanische Autoschlüssel nimmt der Server nur
 * mit Fahrzeugschein an (R13): `src/lib/actions/records.ts` übergibt `einsendeVorgang` den Nachweis.
 */
export const SCHLUESSELARTEN_IM_FORMULAR: readonly (typeof SCHLUESSELARTEN)[number][] = SCHLUESSELARTEN;

export function istSchluesselart(wert: unknown): wert is Schluesselart {
  return SCHLUESSELARTEN.some((art) => art.wert === wert);
}

/** Verlangt die Schlüsselart den Fahrzeugschein (R13)? */
export function brauchtFahrzeugschein(art: unknown): boolean {
  return art === 'auto-mechanisch';
}

/**
 * Für welche Empfehlung der Fall zählt: Autoschlüssel, Schlüssel mit Elektronik und alles, was der Kunde
 * als wertvoll angibt. `null` = keine Empfehlung, der Kunde wählt frei.
 */
export function empfehlungFuer(fall: { schluesselart?: unknown; wertvoll?: unknown }): EinsendeEmpfehlung | null {
  if (fall.schluesselart === 'auto-mechanisch') return 'autoschluessel';
  if (fall.schluesselart === 'elektronik' || fall.wertvoll === true) return 'originalschluessel';
  return null;
}

/** Haftung als Zahl (A-050, Punkt 2); das Wort „versichert“ steht nie allein. */
export function haftungSatz(v: Pick<EinsendeVariante, 'haftungEuro'>): string {
  return v.haftungEuro === null ? 'Haftung nicht belegt, bitte beim Versanddienst prüfen' : `Haftung bis ${v.haftungEuro} € je Sendung`;
}

/** Warnung für Varianten mit geringer Haftung: Der Wert eines Autoschlüssels liegt meist darüber. */
export function haftungWarnung(v: Pick<EinsendeVariante, 'haftungEuro'>): string | undefined {
  if (v.haftungEuro === null || v.haftungEuro >= 100) return undefined;
  return `Ein Schaden über ${v.haftungEuro} € ist nicht gedeckt. Der Wert eines Autoschlüssels liegt meist darüber.`;
}

const ORT: Record<Einlieferung, string> = { briefkasten: 'Briefkasten', filiale: 'Filiale', paketshop: 'Paketshop' };

/** „Abgabe in Filiale oder Paketshop“. */
export function einlieferungSatz(v: Pick<EinsendeVariante, 'einlieferung'>): string {
  const orte = v.einlieferung.map((o) => ORT[o]);
  if (!orte.length) return '';
  const liste = orte.length === 1 ? orte[0] : `${orte.slice(0, -1).join(', ')} oder ${orte.at(-1)}`;
  return `Abgabe: ${liste}`;
}

/** Bezeichnung für Zusammenfassung und Begleitschein, auch für ältere Vorgänge. */
export function versandBezeichnung(art: unknown, e?: Pick<EinsendeEinstellungen, 'varianten'>): string {
  if (art === 'versichert') return 'Einschreiben (ältere Angabe)';
  if (art === 'unversichert') return 'Großbrief (ältere Angabe)';
  return varianteZu(e, art)?.bezeichnung ?? STANDARD_VARIANTEN.find((v) => v.kennung === art)?.bezeichnung ?? 'keine Angabe';
}
