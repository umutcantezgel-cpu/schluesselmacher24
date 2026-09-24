import type { CylinderCatalog, CylinderFormOption, CylinderOrderDraft } from '@/lib/types';

/**
 * Regeln für gleichschließende Zylinder — gemeinsam für Konfigurator (Browser)
 * und Kasse (Server), damit beide exakt dasselbe erlauben.
 */

/** Wählbare Maße einer Bauform: Mindestmaß, dann Vielfache der Schrittweite. */
export function measureOptions(form: CylinderFormOption): number[] {
  const step = Math.max(1, form.stepMm);
  const values: number[] = [];
  if (form.minMm % step !== 0) values.push(form.minMm);
  for (let mm = Math.ceil(form.minMm / step) * step; mm <= form.maxMm; mm += step) {
    values.push(mm);
  }
  return values;
}

/**
 * Prüft eine Zusammenstellung gegen den aktuellen Katalog.
 * Gibt eine verständliche Fehlermeldung zurück oder `null`, wenn alles passt.
 */
export function validateCylinderDraft(draft: CylinderOrderDraft, catalog: CylinderCatalog): string | null {
  if (draft.items.length === 0) return 'Die Zusammenstellung enthält keinen Zylinder.';

  let cylinders = 0;
  for (const item of draft.items) {
    const form = catalog.forms.find((f) => f.id === item.form && f.active);
    if (!form) return 'Eine gewählte Bauform wird derzeit nicht angeboten.';

    const allowed = measureOptions(form);
    if (!allowed.includes(item.measureAMm)) return `Maß A von ${form.label} ist nicht wählbar.`;
    if (form.measures === 'beide') {
      if (item.measureBMm === undefined || !allowed.includes(item.measureBMm)) {
        return `Maß B von ${form.label} ist nicht wählbar.`;
      }
    } else if (item.measureBMm !== undefined) {
      return `${form.label} hat nur ein Maß.`;
    }

    if (item.functionId) {
      const fn = catalog.functions.find((f) => f.id === item.functionId && f.active);
      if (!fn || !fn.forms.includes(item.form)) {
        return `Die gewählte Funktion ist für ${form.label} nicht verfügbar.`;
      }
    }

    if (!Number.isInteger(item.qty) || item.qty < 1) return 'Die Stückzahl muss mindestens 1 sein.';
    cylinders += item.qty;
  }

  if (cylinders > catalog.maxCylinders) {
    return `Höchstens ${catalog.maxCylinders} Zylinder je Schließung.`;
  }
  if (!Number.isInteger(draft.keyCount) || draft.keyCount < 1 || draft.keyCount > catalog.maxKeys) {
    return `Die Schlüsselanzahl muss zwischen 1 und ${catalog.maxKeys} liegen.`;
  }
  for (const extraId of draft.extraIds) {
    if (!catalog.extras.some((e) => e.id === extraId && e.active)) {
      return 'Eine gewählte Zusatzoption wird derzeit nicht angeboten.';
    }
  }
  return null;
}
