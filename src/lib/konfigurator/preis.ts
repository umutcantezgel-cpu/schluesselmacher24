/*
 * Preis eines Schließplans über die vorhandenen Preisregeln (G-27, G-28, G9: Preiswerte unverändert).
 * Eine Sperrschließung (jeder Schlüssel schließt jede Tür) kostet wie im Bestand über
 * priceCylinderOrder. Für einen Plan mit Ebenen führt der Katalog keine Preise: Dann gibt es keinen
 * Preis, und der Weg endet als Anfrage mit Angebot (R9, keine erfundenen Preise).
 */

import { priceCylinderOrder, type CylinderPriceBreakdown } from '../pricing';
import type { CylinderCatalog, CylinderLineItem, CylinderOrderDraft } from '../types';
import { ERWEITERBAR_OPTION_ID } from '../cylinder-rules';

import { istGleichschliessung, type Schliessplan } from './schliessplan';

/** Gleiche Türen werden eine Position mit Stückzahl, wie im Bestand. */
export function planZuEntwurf(plan: Schliessplan, extraIds: string[] = []): CylinderOrderDraft {
  const positionen = new Map<string, CylinderLineItem>();
  for (const t of plan.tueren) {
    const schluessel = `${t.form}|${t.a}|${t.b ?? ''}|${t.funktionId ?? ''}`;
    const vorhanden = positionen.get(schluessel);
    if (vorhanden) vorhanden.qty += 1;
    else positionen.set(schluessel, { uid: `p${positionen.size + 1}`, form: t.form, measureAMm: t.a, ...(t.b !== undefined ? { measureBMm: t.b } : {}), ...(t.funktionId ? { functionId: t.funktionId } : {}), qty: 1 });
  }
  const reserve = plan.schluessel.some((s) => (s.reserve ?? 0) > 0);
  const extras = new Set(extraIds);
  if (reserve) extras.add(ERWEITERBAR_OPTION_ID);
  return {
    items: [...positionen.values()],
    keyCount: plan.schluessel.reduce((n, s) => n + s.anzahl, 0),
    extraIds: [...extras],
    expandable: reserve,
  };
}

export type PlanPreis =
  | { art: 'preis'; aufstellung: CylinderPriceBreakdown; entwurf: CylinderOrderDraft }
  | { art: 'angebot'; grund: string };

export function preisFuerPlan(plan: Schliessplan, katalog: CylinderCatalog, extraIds: string[] = []): PlanPreis {
  if (!istGleichschliessung(plan)) {
    return { art: 'angebot', grund: 'Für eine Schließanlage mit Ebenen erstellen wir Ihnen ein Angebot; die Matrix geht vollständig mit.' };
  }
  const entwurf = planZuEntwurf(plan, extraIds);
  return { art: 'preis', aufstellung: priceCylinderOrder(entwurf, katalog), entwurf };
}
