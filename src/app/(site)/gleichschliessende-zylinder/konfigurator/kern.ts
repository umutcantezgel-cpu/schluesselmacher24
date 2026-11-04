/*
 * Brücke zwischen dem Konfigurator für gleichschließende Zylinder (Bestand) und dem Konfigurator-Kern
 * (E5-OPUS-02, G-28, KE5): Positionen mit Stückzahl werden zu Türen eines Schließplans, in dem jeder
 * Schlüssel jede Tür schließt. Damit gelten dieselbe Linkform wie im Schließplan-Planer und dieselbe
 * Maßprüfung; Preis, Prüfung der Bestellung und Warenkorb bleiben beim Bestand (G9).
 *
 * Abbildung wie im Kern (planZuEntwurf): Ziehschutz an allen Türen ist die Option „ziehschutz“,
 * vorgemerkte Schlüssel sind die Antwort „später erweiterbar“. Hersteller und Komponenten trägt der
 * Link nicht; sie wählt, wer den Link öffnet.
 */

import { measureOptions } from '@/lib/cylinder-rules';
import { SCHUTZ_OPTION_ID, istGleichschliessung, pruefeMasse, schutzUmfang, type PlanTuer, type Schliessplan } from '@/lib/konfigurator';
import type { CylinderCatalog, CylinderComponentChoice, CylinderLineItem } from '@/lib/types';

/** Übliche Größe einer Sperrschließung (G-28); bestellbar bleibt alles bis `maxCylinders` des Katalogs. */
export const SET_UEBLICH = { von: 2, bis: 10 } as const;

/** Der Zustand des Konfigurators, soweit ein Link ihn berührt (Form wie dort). */
export interface Zusammenstellung {
  items: CylinderLineItem[];
  keyCount: number;
  extraIds: string[];
  expandable: boolean | null;
  manufacturerId: string;
  components: CylinderComponentChoice[];
}

/** Was ein Link mitbringt, dazu der Hinweis, wenn er Ziehschutz nur an einigen Türen verlangt. */
export interface LinkInhalt {
  items: CylinderLineItem[];
  keyCount: number;
  extraIds: string[];
  expandable: boolean | null;
  /** Schutz nur an einigen Türen gibt es hier nicht; der Planer macht daraus ein Angebot. */
  schutzTeilweise: boolean;
}

/** Je Zylinder eine Tür „Zylinder n“, ein Schlüssel „Schlüssel“ für alle Türen. */
export function positionenZuPlan(
  items: CylinderLineItem[],
  keyCount: number,
  { extraIds = [], expandable = null }: { extraIds?: string[]; expandable?: boolean | null } = {},
): Schliessplan {
  const schutz = extraIds.includes(SCHUTZ_OPTION_ID);
  const einzeln = items.flatMap((item) => Array.from({ length: Math.max(0, item.qty) }, () => item));
  const tueren: PlanTuer[] = einzeln.map((item, i) => ({
    id: `t${i + 1}`,
    bezeichnung: `Zylinder ${i + 1}`,
    form: item.form,
    a: item.measureAMm,
    ...(item.measureBMm !== undefined ? { b: item.measureBMm } : {}),
    ...(item.functionId ? { funktionId: item.functionId } : {}),
    ...(schutz ? { optionen: [SCHUTZ_OPTION_ID] } : {}),
  }));
  return {
    version: 1,
    tueren,
    schluessel: [{ id: 's1', bezeichnung: 'Schlüssel', anzahl: keyCount, ...(expandable ? { reserve: 1 } : {}) }],
    berechtigungen: { s1: tueren.map((t) => t.id) },
  };
}

/** Bauform aktiv, Maße wählbar, Maß B nur bei zwei Maßen, Funktion zur Bauform: sonst keine Übernahme. */
function tuerPasst(t: PlanTuer, katalog: CylinderCatalog): boolean {
  const form = katalog.forms.find((f) => f.id === t.form && f.active);
  if (!form) return false;
  const werte = measureOptions(form);
  if (!werte.includes(t.a)) return false;
  if (form.measures === 'beide' ? t.b === undefined || !werte.includes(t.b) : t.b !== undefined) return false;
  return !t.funktionId || katalog.functions.some((fn) => fn.id === t.funktionId && fn.active && fn.forms.includes(form.id));
}

/**
 * Plan aus einem Link zurück in Positionen: gleiche Türen werden wieder eine Position mit Stückzahl.
 * Nur Gleichschließungen, die der Bestand so bestellen kann (Bauform, Maße, Funktion, Höchstzahlen
 * des Katalogs); alles andere ergibt null. Ein Plan mit Ebenen gehört in den Schließplan-Planer.
 */
export function planZuPositionen(plan: Schliessplan, katalog: CylinderCatalog): LinkInhalt | null {
  if (!istGleichschliessung(plan) || plan.tueren.length > katalog.maxCylinders) return null;
  if (!plan.tueren.every((t) => tuerPasst(t, katalog))) return null;
  const keyCount = plan.schluessel.reduce((n, s) => n + s.anzahl, 0);
  if (keyCount < 1 || keyCount > katalog.maxKeys) return null;

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
  const schutz = schutzUmfang(plan);
  const schutzAngeboten = katalog.extras.some((e) => e.id === SCHUTZ_OPTION_ID && e.active);
  return {
    items: [...gruppen.values()],
    keyCount,
    extraIds: schutz === 'alle' && schutzAngeboten ? [SCHUTZ_OPTION_ID] : [],
    expandable: plan.schluessel.some((s) => (s.reserve ?? 0) > 0) ? true : null,
    schutzTeilweise: schutz === 'einige',
  };
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

/** Ganz unverändert seit dem Start (alle Felder, ohne Kennungen): dann darf ein Link ohne Rückfrage ersetzen. */
export function istStartzustand(jetzt: Zusammenstellung, start: Zusammenstellung): boolean {
  const vergleich = (z: Zusammenstellung) =>
    JSON.stringify({ ...z, items: z.items.map(({ uid: _uid, ...rest }) => (void _uid, rest)) });
  return vergleich(jetzt) === vergleich(start);
}

/** Zusammenstellung aus dem Link: ersetzt alles, auch Hersteller und Komponenten (die der Link nicht trägt). */
export function ausLink(inhalt: LinkInhalt, start: Zusammenstellung): Zusammenstellung {
  return { ...start, items: inhalt.items, keyCount: inhalt.keyCount, extraIds: inhalt.extraIds, expandable: inhalt.expandable };
}
