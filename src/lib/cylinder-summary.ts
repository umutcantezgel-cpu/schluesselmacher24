import { gewaehlterHersteller, wirksameZusatzIds } from '@/lib/cylinder-rules';
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
  const hersteller = gewaehlterHersteller(draft, catalog);

  if (hersteller) zeilen.push({ label: 'Hersteller', value: hersteller.name });

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

  // Wie in der Preisermittlung: „Erweiterbar: Ja“ wählt die Option „Erweiterbar reservieren“ mit.
  const zusatz = wirksameZusatzIds(draft, catalog)
    .map((id) => extrasMap.get(id)?.label)
    .filter((label): label is string => Boolean(label));
  if (zusatz.length > 0) {
    zeilen.push({ label: 'Zusatzoptionen', value: zusatz.join(', ') });
  }

  const komponenten = (draft.components ?? [])
    .filter((wahl) => hersteller?.components.some((k) => k.name === wahl.name))
    .map((wahl) => `${wahl.qty} × ${wahl.name}`);
  if (komponenten.length > 0) {
    zeilen.push({ label: 'Zusatzkomponenten', value: komponenten.join(', ') });
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
