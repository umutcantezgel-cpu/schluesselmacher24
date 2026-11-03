/*
 * Maßprüfung (G-29): Fehler bei Maßen außerhalb der Systemdaten, Rückfragen bei Auffälligkeiten.
 * Die Werkstatt prüft jede Bestellung vor der Fertigung; die Prüfung hier ersetzt das nicht.
 * Grenzen aus dem Zylinderkatalog (measureOptions), keine erfundenen Normwerte.
 */

import { measureOptions } from '../cylinder-rules';
import type { CylinderCatalog } from '../types';

import type { PlanTuer, Schliessplan } from './schliessplan';

/** Ab diesem Unterschied zwischen A und B fragen wir nach (ungewöhnlich, oft vertauscht oder falsch gemessen). */
export const UNTERSCHIED_RUECKFRAGE_MM = 30;

export interface MassBefund {
  tuerId: string;
  art: 'fehler' | 'rueckfrage';
  text: string;
}

export function pruefeTuerMasse(tuer: PlanTuer, katalog: CylinderCatalog): MassBefund[] {
  const form = katalog.forms.find((f) => f.id === tuer.form && f.active);
  const name = tuer.bezeichnung || tuer.id;
  if (!form) return [{ tuerId: tuer.id, art: 'fehler', text: `„${name}“: Diese Bauform wird derzeit nicht angeboten.` }];
  const erlaubt = measureOptions(form);
  const befunde: MassBefund[] = [];
  const bereich = `${form.minMm} bis ${form.maxMm} mm in Schritten von ${form.stepMm} mm`;
  if (!erlaubt.includes(tuer.a)) befunde.push({ tuerId: tuer.id, art: 'fehler', text: `„${name}“: Maß A ${tuer.a} mm ist nicht wählbar. Wählbar sind ${bereich}.` });
  if (form.measures === 'beide') {
    if (tuer.b === undefined) befunde.push({ tuerId: tuer.id, art: 'fehler', text: `„${name}“: Bitte auch Maß B angeben.` });
    else if (!erlaubt.includes(tuer.b)) befunde.push({ tuerId: tuer.id, art: 'fehler', text: `„${name}“: Maß B ${tuer.b} mm ist nicht wählbar. Wählbar sind ${bereich}.` });
    else if (Math.abs(tuer.a - tuer.b) >= UNTERSCHIED_RUECKFRAGE_MM) {
      befunde.push({ tuerId: tuer.id, art: 'rueckfrage', text: `„${name}“: Maß A und Maß B unterscheiden sich um ${Math.abs(tuer.a - tuer.b)} mm. Bitte prüfen Sie, ob Sie Maß A nach außen und Maß B nach innen gemessen haben.` });
    }
  } else if (tuer.b !== undefined) {
    befunde.push({ tuerId: tuer.id, art: 'fehler', text: `„${name}“: ${form.label} hat nur ein Maß.` });
  }
  if (tuer.funktionId) {
    const fn = katalog.functions.find((f) => f.id === tuer.funktionId && f.active);
    if (!fn || !fn.forms.includes(tuer.form)) befunde.push({ tuerId: tuer.id, art: 'fehler', text: `„${name}“: Die gewählte Funktion gibt es für ${form.label} nicht.` });
  }
  return befunde;
}

export interface MassErgebnis {
  befunde: MassBefund[];
  /** Bestellen erst ohne Fehler und mit der Bestätigung „Maße geprüft“. */
  bestellbar: boolean;
}

export function pruefeMasse(plan: Schliessplan, katalog: CylinderCatalog): MassErgebnis {
  const befunde = plan.tueren.flatMap((t) => pruefeTuerMasse(t, katalog));
  return { befunde, bestellbar: !befunde.some((b) => b.art === 'fehler') && plan.masseGeprueft === true };
}
