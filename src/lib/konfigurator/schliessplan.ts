/*
 * Konfigurator-Kern (G-27, G-28, Z-06): ein Schließplan aus Türen (Zylindern), Schlüsseln und der
 * Schließmatrix „welcher Schlüssel schließt welche Tür“. Reine Funktionen ohne Seiteneffekte; die
 * Oberflächen der Konfiguratoren (E5) bauen darauf. Begriffe in Laiensprache (FACHWISSEN.md).
 */

import type { CylinderForm } from '../types';

export interface PlanTuer {
  id: string;
  /** Bezeichnung der Tür, etwa „Haustür“ oder „Wohnung 1“. */
  bezeichnung: string;
  form: CylinderForm;
  /** Maß A (außen) in mm. */
  a: number;
  /** Maß B (innen) in mm, nur bei Bauformen mit zwei Maßen. */
  b?: number;
  /** Funktion aus dem Katalog, etwa „not-gefahr“. */
  funktionId?: string;
  /** Kennungen weiterer Optionen (Schutz, Oberfläche), soweit das System sie führt. */
  optionen?: string[];
}

export interface PlanSchluessel {
  id: string;
  /** Bezeichnung, etwa „Familie“ oder „Hausverwaltung“. */
  bezeichnung: string;
  /** Anzahl jetzt. */
  anzahl: number;
  /** Planreserve: weitere Schlüssel derselben Art später nachbestellen (G-27). */
  reserve?: number;
  /** Schlüsselkappe oder Farbclip, Wortlaut nach MA-14 noch offen. */
  kennzeichnung?: string;
}

export interface Schliessplan {
  version: 1;
  /** System aus den Systemdaten, etwa „bravus-2000“; leer bei Sperrschließung ohne Systemwahl. */
  system?: string;
  tueren: PlanTuer[];
  schluessel: PlanSchluessel[];
  /** Je Schlüssel die Türen, die er schließt. */
  berechtigungen: Record<string, string[]>;
  /** Pflichtbestätigung „Maße geprüft“ (G-29). */
  masseGeprueft?: boolean;
}

export type Ebene = 'generalhauptschluessel' | 'gruppenschluessel' | 'einzelschluessel' | 'ohne-tuer';

export const EBENE_TEXT: Record<Ebene, string> = {
  generalhauptschluessel: 'schließt alle Türen',
  gruppenschluessel: 'schließt mehrere Türen',
  einzelschluessel: 'schließt eine Tür',
  'ohne-tuer': 'schließt noch keine Tür',
};

export function leererPlan(system?: string): Schliessplan {
  return { version: 1, ...(system ? { system } : {}), tueren: [], schluessel: [], berechtigungen: {} };
}

function neueId(praefix: string, vorhanden: { id: string }[]): string {
  let n = vorhanden.length + 1;
  while (vorhanden.some((x) => x.id === `${praefix}${n}`)) n += 1;
  return `${praefix}${n}`;
}

export function tuerHinzufuegen(plan: Schliessplan, tuer: Omit<PlanTuer, 'id'>): Schliessplan {
  return { ...plan, tueren: [...plan.tueren, { ...tuer, id: neueId('t', plan.tueren) }] };
}

export function schluesselHinzufuegen(plan: Schliessplan, schluessel: Omit<PlanSchluessel, 'id'>, alleTueren = false): Schliessplan {
  const id = neueId('s', plan.schluessel);
  return {
    ...plan,
    schluessel: [...plan.schluessel, { ...schluessel, id }],
    berechtigungen: { ...plan.berechtigungen, [id]: alleTueren ? plan.tueren.map((t) => t.id) : [] },
  };
}

export function tuerEntfernen(plan: Schliessplan, tuerId: string): Schliessplan {
  const berechtigungen = Object.fromEntries(Object.entries(plan.berechtigungen).map(([s, t]) => [s, t.filter((id) => id !== tuerId)]));
  return { ...plan, tueren: plan.tueren.filter((t) => t.id !== tuerId), berechtigungen };
}

export function schluesselEntfernen(plan: Schliessplan, schluesselId: string): Schliessplan {
  const { [schluesselId]: _weg, ...berechtigungen } = plan.berechtigungen;
  return { ...plan, schluessel: plan.schluessel.filter((s) => s.id !== schluesselId), berechtigungen };
}

/** Ein Feld der Matrix setzen oder löschen. */
export function berechtigen(plan: Schliessplan, schluesselId: string, tuerId: string, schliesst: boolean): Schliessplan {
  const jetzt = new Set(plan.berechtigungen[schluesselId] ?? []);
  if (schliesst) jetzt.add(tuerId);
  else jetzt.delete(tuerId);
  const reihenfolge = plan.tueren.map((t) => t.id).filter((id) => jetzt.has(id));
  return { ...plan, berechtigungen: { ...plan.berechtigungen, [schluesselId]: reihenfolge } };
}

/** Matrix Schlüssel mal Tür (Zeilen in Reihenfolge der Schlüssel, Spalten der Türen). */
export function matrix(plan: Schliessplan): boolean[][] {
  return plan.schluessel.map((s) => {
    const erlaubt = new Set(plan.berechtigungen[s.id] ?? []);
    return plan.tueren.map((t) => erlaubt.has(t.id));
  });
}

export function ebene(plan: Schliessplan, schluesselId: string): Ebene {
  const zahl = new Set(plan.berechtigungen[schluesselId] ?? []).size;
  if (zahl === 0) return 'ohne-tuer';
  if (plan.tueren.length > 1 && zahl === plan.tueren.length) return 'generalhauptschluessel';
  return zahl > 1 ? 'gruppenschluessel' : 'einzelschluessel';
}

/** Gleichschließung: jeder Schlüssel schließt jede Tür (Sperrschließung, G-28). */
export function istGleichschliessung(plan: Schliessplan): boolean {
  return plan.tueren.length > 0 && plan.schluessel.length > 0 && matrix(plan).every((zeile) => zeile.every(Boolean));
}

export interface PlanBefund {
  art: 'fehler' | 'hinweis';
  text: string;
}

/** Prüft den Plan auf Lücken, die vor der Fertigung geklärt sein müssen. */
export function pruefePlan(plan: Schliessplan, { hoechstensTueren = 50, hoechstensSchluessel = 100 } = {}): PlanBefund[] {
  const befunde: PlanBefund[] = [];
  if (!plan.tueren.length) befunde.push({ art: 'fehler', text: 'Bitte legen Sie mindestens eine Tür an.' });
  if (!plan.schluessel.length) befunde.push({ art: 'fehler', text: 'Bitte legen Sie mindestens einen Schlüssel an.' });
  if (plan.tueren.length > hoechstensTueren) befunde.push({ art: 'fehler', text: `Höchstens ${hoechstensTueren} Türen je Plan; größere Anlagen planen wir mit Ihnen.` });
  const namen = new Map<string, number>();
  for (const t of plan.tueren) namen.set(t.bezeichnung.trim().toLowerCase(), (namen.get(t.bezeichnung.trim().toLowerCase()) ?? 0) + 1);
  for (const [name, zahl] of namen) if (name && zahl > 1) befunde.push({ art: 'hinweis', text: `Die Bezeichnung „${name}“ steht ${zahl}-mal; eindeutige Namen helfen beim Einbau.` });
  for (const t of plan.tueren) {
    if (!t.bezeichnung.trim()) befunde.push({ art: 'fehler', text: 'Jede Tür braucht eine Bezeichnung.' });
    if (!plan.schluessel.some((s) => (plan.berechtigungen[s.id] ?? []).includes(t.id))) {
      befunde.push({ art: 'fehler', text: `Für „${t.bezeichnung || t.id}“ gibt es noch keinen Schlüssel.` });
    }
  }
  let schluesselGesamt = 0;
  for (const s of plan.schluessel) {
    schluesselGesamt += s.anzahl;
    if (!Number.isInteger(s.anzahl) || s.anzahl < 1) befunde.push({ art: 'fehler', text: `„${s.bezeichnung || s.id}“: mindestens ein Schlüssel.` });
    if (ebene(plan, s.id) === 'ohne-tuer') befunde.push({ art: 'hinweis', text: `„${s.bezeichnung || s.id}“ schließt noch keine Tür.` });
  }
  if (schluesselGesamt > hoechstensSchluessel) befunde.push({ art: 'fehler', text: `Höchstens ${hoechstensSchluessel} Schlüssel je Plan; mehr planen wir mit Ihnen.` });
  return befunde;
}
