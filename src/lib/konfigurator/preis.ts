/*
 * Preis eines Schließplans über die vorhandenen Preisregeln (G-27, G-28, G9: Preiswerte unverändert).
 * Eine Sperrschließung (jeder Schlüssel schließt jede Tür) kostet wie im Bestand über
 * priceCylinderOrder. Für einen Plan mit Ebenen führt der Katalog keine Preise: Dann gibt es keinen
 * Preis, und der Weg endet als Anfrage mit Angebot (R9, keine erfundenen Preise).
 *
 * Reihenfolge (E5-OPUS-01): erst muss der Plan vollständig sein („offen“ mit dem ersten Fehler),
 * dann entscheidet die Matrix (Ebenen → Angebot), dann der Katalog: Aufbohr- und Ziehschutz kennt
 * er nur für alle Zylinder einer Bestellung, und seine Höchstwerte gelten wie in der Kasse
 * (validateCylinderDraft). Was der Katalog nicht rechnen kann, wird ein Angebot, nie ein Schätzwert.
 */

import { priceCylinderOrder, type CylinderPriceBreakdown } from '../pricing';
import type { CylinderCatalog, CylinderLineItem, CylinderOrderDraft } from '../types';
import { aktiveHersteller, ERWEITERBAR_OPTION_ID, validateCylinderDraft } from '../cylinder-rules';

import { pruefeMasse } from './masse';
import { ohneSperreWeg } from './preisbestaetigung';
import { istGleichschliessung, pruefePlan, type Schliessplan } from './schliessplan';

/** Katalog-Option „Aufbohr- und Ziehschutz“ (Einheit je Zylinder); im Plan eine Option der Tür. */
export const SCHUTZ_OPTION_ID = 'ziehschutz';

/** Hat jede, keine oder nur ein Teil der Türen den Aufbohr- und Ziehschutz? */
export function schutzUmfang(plan: Schliessplan): 'alle' | 'keine' | 'einige' {
  const mit = plan.tueren.filter((t) => t.optionen?.includes(SCHUTZ_OPTION_ID)).length;
  if (mit === 0) return 'keine';
  return mit === plan.tueren.length ? 'alle' : 'einige';
}

/**
 * Gleiche Türen werden eine Position mit Stückzahl, wie im Bestand. Der Schutz folgt allein den
 * Türen (an allen: Option je Zylinder), die Planreserve der Option „erweiterbar“.
 */
export function planZuEntwurf(plan: Schliessplan, extraIds: string[] = []): CylinderOrderDraft {
  const positionen = new Map<string, CylinderLineItem>();
  for (const t of plan.tueren) {
    const schluessel = `${t.form}|${t.a}|${t.b ?? ''}|${t.funktionId ?? ''}`;
    const vorhanden = positionen.get(schluessel);
    if (vorhanden) vorhanden.qty += 1;
    else positionen.set(schluessel, { uid: `p${positionen.size + 1}`, form: t.form, measureAMm: t.a, ...(t.b !== undefined ? { measureBMm: t.b } : {}), ...(t.funktionId ? { functionId: t.funktionId } : {}), qty: 1 });
  }
  const reserve = plan.schluessel.some((s) => (s.reserve ?? 0) > 0);
  const extras = new Set(extraIds.filter((id) => id !== SCHUTZ_OPTION_ID && id !== ERWEITERBAR_OPTION_ID));
  if (reserve) extras.add(ERWEITERBAR_OPTION_ID);
  if (schutzUmfang(plan) === 'alle') extras.add(SCHUTZ_OPTION_ID);
  return {
    items: [...positionen.values()],
    keyCount: plan.schluessel.reduce((n, s) => n + s.anzahl, 0),
    extraIds: [...extras],
    expandable: reserve,
    // Hersteller aus dem Konfigurator (FA-SHOP-04B): Angabe ohne Preiswirkung, die Kasse prüft sie.
    ...(plan.system?.trim() ? { herstellerAngabe: plan.system.trim() } : {}),
  };
}

/**
 * Zusatzwünsche aus dem Link des Konfigurators (`?wuensche=`, FA-SHOP-04B): nur angebotene Optionen des
 * Katalogs, ohne Doppel, ohne Schutz und Vormerkung (die folgen dem Plan selbst).
 */
export function wuenscheAusLink(roh: string | null | undefined, katalog: Pick<CylinderCatalog, 'extras'>): string[] {
  if (!roh) return [];
  const erlaubt = new Set(
    katalog.extras.filter((e) => e.active && e.id !== SCHUTZ_OPTION_ID && e.id !== ERWEITERBAR_OPTION_ID).map((e) => e.id),
  );
  return [...new Set(roh.split(',').slice(0, 20).map((id) => id.trim()).filter((id) => erlaubt.has(id)))];
}

export type PlanPreis =
  | { art: 'preis'; aufstellung: CylinderPriceBreakdown; entwurf: CylinderOrderDraft }
  | { art: 'angebot'; grund: string }
  /** Der Plan ist noch nicht vollständig; `grund` nennt den ersten Fehler. */
  | { art: 'offen'; grund: string };

export function preisFuerPlan(plan: Schliessplan, katalog: CylinderCatalog, extraIds: string[] = []): PlanPreis {
  const fehler = [
    ...pruefePlan(plan).filter((b) => b.art === 'fehler'),
    ...pruefeMasse(plan, katalog).befunde.filter((b) => b.art === 'fehler'),
  ];
  if (fehler.length) return { art: 'offen', grund: fehler[0].text };
  if (!istGleichschliessung(plan)) {
    return { art: 'angebot', grund: 'Für eine Schließanlage mit Ebenen erstellen wir Ihnen ein Angebot; die Matrix geht vollständig mit.' };
  }
  if (schutzUmfang(plan) === 'einige') {
    return { art: 'angebot', grund: 'Aufbohr- und Ziehschutz nur an einzelnen Türen rechnen wir im Angebot; online gibt es ihn für alle Zylinder.' };
  }
  // Herstelleraufpreise rechnet der Planer nicht (E5-OPUS-02); bietet der Katalog Hersteller an, klären wir sie im
  // Angebot. Ein Hersteller aus dem Konfigurator steht als System im Plan und geht mit (FA-SHOP-04B).
  if (aktiveHersteller(katalog).length > 0) {
    return {
      art: 'angebot',
      grund: plan.system?.trim()
        ? `Ihren Hersteller ${plan.system.trim()} nehmen wir ins Angebot auf. Sie bekommen ein Angebot mit Preis.`
        : 'Den Hersteller wählen wir mit Ihnen; Sie bekommen ein Angebot mit Preis.',
    };
  }
  const entwurf = planZuEntwurf(plan, extraIds);
  const erweiterbarAngeboten = katalog.extras.some((e) => e.id === ERWEITERBAR_OPTION_ID && e.active);
  if (entwurf.expandable && !erweiterbarAngeboten) {
    return { art: 'angebot', grund: 'Schlüssel für später vormerken bieten wir derzeit im Angebot an.' };
  }
  const problem = validateCylinderDraft(entwurf, katalog);
  if (problem) return { art: 'angebot', grund: `${ohneSperreWeg(problem)} Diese Schließung planen wir mit Ihnen und schicken Ihnen ein Angebot.` };
  return { art: 'preis', aufstellung: priceCylinderOrder(entwurf, katalog), entwurf };
}
