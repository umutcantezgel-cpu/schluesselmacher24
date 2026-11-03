/*
 * Vorlagen für den Schließplan (G-27): typische Fälle in Laiensprache als Ausgangspunkt. Maße sind
 * Platzhalter zum Anpassen (30/30 mm, die kleinste übliche Stufe); vor dem Bestellen misst der
 * Kunde jede Tür (G-29). Keine Vorlage ist eine Empfehlung für eine bestimmte Sicherheit.
 */

import { berechtigen, leererPlan, schluesselHinzufuegen, tuerHinzufuegen, type Schliessplan } from './schliessplan';

export interface Vorlage {
  id: 'einfamilienhaus' | 'mehrfamilienhaus' | 'buero' | 'sperrschliessung';
  titel: string;
  satz: string;
  erzeuge: () => Schliessplan;
}

const tuer = (bezeichnung: string) => ({ bezeichnung, form: 'doppelzylinder' as const, a: 30, b: 30 });

function mitTueren(namen: string[]): Schliessplan {
  return namen.reduce((plan, name) => tuerHinzufuegen(plan, tuer(name)), leererPlan());
}

export const VORLAGEN: Vorlage[] = [
  {
    id: 'sperrschliessung',
    titel: 'Ein Schlüssel für alle Türen',
    satz: 'Haustür, Nebentür und Garage mit demselben Schlüssel.',
    erzeuge: () => schluesselHinzufuegen(mitTueren(['Haustür', 'Nebentür', 'Garage']), { bezeichnung: 'Familie', anzahl: 3 }, true),
  },
  {
    id: 'einfamilienhaus',
    titel: 'Einfamilienhaus mit Gartenhaus',
    satz: 'Alle schließen das Haus; nur ein Schlüssel schließt zusätzlich das Gartenhaus.',
    erzeuge: () => {
      let plan = mitTueren(['Haustür', 'Kellertür', 'Gartenhaus']);
      plan = schluesselHinzufuegen(plan, { bezeichnung: 'Familie', anzahl: 3 });
      plan = schluesselHinzufuegen(plan, { bezeichnung: 'Garten', anzahl: 1 }, true);
      for (const t of ['t1', 't2']) plan = berechtigen(plan, 's1', t, true);
      return plan;
    },
  },
  {
    id: 'mehrfamilienhaus',
    titel: 'Mehrfamilienhaus mit vier Wohnungen',
    satz: 'Jede Wohnung hat ihren Schlüssel für Haustür, Keller und die eigene Wohnung; die Hausverwaltung schließt alles.',
    erzeuge: () => {
      let plan = mitTueren(['Haustür', 'Keller', 'Wohnung 1', 'Wohnung 2', 'Wohnung 3', 'Wohnung 4']);
      plan = schluesselHinzufuegen(plan, { bezeichnung: 'Hausverwaltung', anzahl: 1 }, true);
      for (let w = 1; w <= 4; w += 1) {
        plan = schluesselHinzufuegen(plan, { bezeichnung: `Wohnung ${w}`, anzahl: 2 });
        const id = `s${w + 1}`;
        for (const t of ['t1', 't2', `t${w + 2}`]) plan = berechtigen(plan, id, t, true);
      }
      return plan;
    },
  },
  {
    id: 'buero',
    titel: 'Büro mit Archiv',
    satz: 'Alle kommen ins Büro; das Archiv schließt nur die Leitung.',
    erzeuge: () => {
      let plan = mitTueren(['Eingang', 'Büro', 'Archiv']);
      plan = schluesselHinzufuegen(plan, { bezeichnung: 'Leitung', anzahl: 2 }, true);
      plan = schluesselHinzufuegen(plan, { bezeichnung: 'Team', anzahl: 5 });
      for (const t of ['t1', 't2']) plan = berechtigen(plan, 's2', t, true);
      return plan;
    },
  },
];
