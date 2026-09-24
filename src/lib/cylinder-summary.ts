import { formatMillimeter } from '@/lib/format';
import type { CylinderCatalog, CylinderOrderDraft } from '@/lib/types';

/**
 * Lesbare Zusammenstellung gleichschließender Zylinder — dieselbe Sicht im
 * Warenkorb, in der Kasse und in den festgeschriebenen Bestellpositionen.
 */

export interface ZylinderZeile {
  label: string;
  value: string;
}

/** Zusammenstellung einer Zylinder-Position in lesbaren Zeilen. */
export function zylinderZeilen(draft: CylinderOrderDraft, catalog: CylinderCatalog): ZylinderZeile[] {
  const zeilen: ZylinderZeile[] = [];

  const formsMap = new Map(catalog.forms.map((f) => [f.id, f]));
  const functionsMap = new Map(catalog.functions.map((f) => [f.id, f]));
  const extrasMap = new Map(catalog.extras.map((e) => [e.id, e]));

  for (const eintrag of draft.items) {
    const form = formsMap.get(eintrag.form);
    const funktion = eintrag.functionId ? functionsMap.get(eintrag.functionId) : undefined;
    const masse =
      eintrag.measureBMm === undefined
        ? formatMillimeter(eintrag.measureAMm)
        : `${formatMillimeter(eintrag.measureAMm)} / ${formatMillimeter(eintrag.measureBMm)}`;

    const teile = [masse];
    if (funktion) teile.push(funktion.label);
    teile.push(`${eintrag.qty} Stück`);

    zeilen.push({ label: form?.label ?? eintrag.form, value: teile.join(' · ') });
  }

  zeilen.push({ label: 'Gemeinsame Schlüssel', value: `${draft.keyCount} Stück` });

  const zusatz = draft.extraIds
    .map((id) => extrasMap.get(id)?.label)
    .filter((label): label is string => Boolean(label));
  if (zusatz.length > 0) {
    zeilen.push({ label: 'Zusatzoptionen', value: zusatz.join(', ') });
  }

  zeilen.push({
    label: 'Spätere Erweiterung',
    value: draft.expandable ? 'Vorgesehen' : 'Nicht vorgesehen',
  });

  return zeilen;
}

/** Dieselben Angaben als mehrzeiliger Text, z. B. für die Details einer Bestellposition. */
export function zylinderDetails(draft: CylinderOrderDraft, catalog: CylinderCatalog): string {
  return zylinderZeilen(draft, catalog)
    .map((zeile) => `${zeile.label}: ${zeile.value}`)
    .join('\n');
}
