/*
 * Brücke zwischen dem Konfigurator für gleichschließende Zylinder (Bestand) und dem Konfigurator-Kern
 * (E5-OPUS-02, G-28, KE5): Positionen mit Stückzahl werden zu Türen eines Schließplans, in dem jeder
 * Schlüssel jede Tür schließt. Damit gelten dieselbe Linkform wie im Schließplan-Planer und dieselbe
 * Maßprüfung; Preis, Prüfung der Bestellung und Warenkorb bleiben beim Bestand (G9).
 */

import { istGleichschliessung, pruefeMasse, type Schliessplan } from '@/lib/konfigurator';
import type { CylinderCatalog, CylinderLineItem } from '@/lib/types';

/** Übliche Größe einer Sperrschließung (G-28); bestellbar bleibt alles bis `maxCylinders` des Katalogs. */
export const SET_UEBLICH = { von: 2, bis: 10 } as const;

/** Je Zylinder eine Tür „Zylinder n“, ein Schlüssel „Schlüssel“ für alle Türen. */
export function positionenZuPlan(items: CylinderLineItem[], keyCount: number): Schliessplan {
  const einzeln = items.flatMap((item) => Array.from({ length: Math.max(0, item.qty) }, () => item));
  const tueren = einzeln.map((item, i) => ({
    id: `t${i + 1}`,
    bezeichnung: `Zylinder ${i + 1}`,
    form: item.form,
    a: item.measureAMm,
    ...(item.measureBMm !== undefined ? { b: item.measureBMm } : {}),
    ...(item.functionId ? { funktionId: item.functionId } : {}),
  }));
  return {
    version: 1,
    tueren,
    schluessel: [{ id: 's1', bezeichnung: 'Schlüssel', anzahl: keyCount }],
    berechtigungen: { s1: tueren.map((t) => t.id) },
  };
}

/**
 * Plan aus einem Link zurück in Positionen: gleiche Türen werden wieder eine Position mit Stückzahl.
 * Nur Gleichschließungen (jeder Schlüssel schließt jede Tür); ein Plan mit Ebenen gehört in den
 * Schließplan-Planer und ergibt null.
 */
export function planZuPositionen(plan: Schliessplan): { items: CylinderLineItem[]; keyCount: number } | null {
  if (!istGleichschliessung(plan)) return null;
  const gruppen = new Map<string, CylinderLineItem>();
  for (const t of plan.tueren) {
    const schluessel = `${t.form}|${t.a}|${t.b ?? ''}|${t.funktionId ?? ''}`;
    const vorhanden = gruppen.get(schluessel);
    if (vorhanden) {
      vorhanden.qty += 1;
      continue;
    }
    gruppen.set(schluessel, {
      uid: `position-${gruppen.size + 1}`,
      form: t.form,
      measureAMm: t.a,
      ...(t.b !== undefined ? { measureBMm: t.b } : {}),
      ...(t.funktionId ? { functionId: t.funktionId } : {}),
      qty: 1,
    });
  }
  return { items: [...gruppen.values()], keyCount: plan.schluessel.reduce((n, s) => n + s.anzahl, 0) };
}

/**
 * Rückfragen der Maßprüfung des Kerns je Position (etwa sehr ungleiche Maße A und B). Sie halten nichts
 * auf; ob ein Maß wählbar ist, prüft weiter der Bestand.
 */
export function masseRueckfragen(items: CylinderLineItem[], katalog: CylinderCatalog): string[] {
  const plan: Schliessplan = {
    version: 1,
    tueren: items.map((item, i) => ({
      id: item.uid,
      bezeichnung: `Tür ${i + 1}`,
      form: item.form,
      a: item.measureAMm,
      ...(item.measureBMm !== undefined ? { b: item.measureBMm } : {}),
    })),
    schluessel: [],
    berechtigungen: {},
  };
  return pruefeMasse(plan, katalog).befunde.filter((b) => b.art === 'rueckfrage').map((b) => b.text);
}

/** Bleibt die Zusammenstellung beim Start, darf ein Link sie ohne Rückfrage ersetzen. */
export function istStartzustand(items: CylinderLineItem[], keyCount: number, start: { items: CylinderLineItem[]; keyCount: number }): boolean {
  const ohneUid = (liste: CylinderLineItem[]) => JSON.stringify(liste.map(({ uid: _uid, ...rest }) => (void _uid, rest)));
  return keyCount === start.keyCount && ohneUid(items) === ohneUid(start.items);
}
