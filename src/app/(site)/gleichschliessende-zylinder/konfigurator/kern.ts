/*
 * Brücke zwischen dem Konfigurator für gleichschließende Zylinder (Bestand) und dem Konfigurator-Kern
 * (E5-OPUS-02, G-28, KE5): Positionen mit Stückzahl werden zu Türen eines Schließplans, in dem jeder
 * Schlüssel jede Tür schließt. Damit gelten dieselbe Linkform wie im Schließplan-Planer und dieselbe
 * Maßprüfung; Preis, Prüfung der Bestellung und Warenkorb bleiben beim Bestand (G9).
 *
 * Abbildung wie im Kern (planZuEntwurf): Ziehschutz an allen Türen ist die Option „ziehschutz“,
 * vorgemerkte Schlüssel sind die Antwort „später erweiterbar“. Hersteller und Komponenten trägt der
 * eigene Link nicht; sie wählt, wer den Link öffnet. Der Weg in die Anfrage (FA-SHOP-04B) trägt dagegen
 * alles: den Hersteller als System des Plans und die übrigen Optionen als Wünsche.
 */

import { ERWEITERBAR_OPTION_ID, aktiveHersteller, measureOptions, wirksameZusatzIds } from '@/lib/cylinder-rules';
import {
  KEINE_HERSTELLER_VORGABE,
  SCHUTZ_OPTION_ID,
  istGleichschliessung,
  kodiere,
  passtInLink,
  pruefeMasse,
  schutzUmfang,
  type HerstellerSystem,
  type PlanTuer,
  type Schliessplan,
} from '@/lib/konfigurator';
import type { CylinderCatalog, CylinderComponentChoice, CylinderLineItem, CylinderOrderDraft } from '@/lib/types';

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
  /**
   * Herstellerwahl ohne Preiswirkung (FA-SHOP-04B), solange der Katalog keinen Hersteller anbietet:
   * Kennung eines Systems aus der Stammliste, `KEINE_HERSTELLER_VORGABE` oder leer (noch nicht gewählt).
   */
  herstellerAngabe: string;
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
  { extraIds = [], expandable = null, system }: { extraIds?: string[]; expandable?: boolean | null; system?: string } = {},
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
    ...(system?.trim() ? { system: system.trim().slice(0, 40) } : {}),
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

/** Gewähltes System der Stammliste (FA-SHOP-04B); keins bei „keine Vorgabe“ oder ohne Wahl. */
export function gewaehltesSystem(z: Pick<Zusammenstellung, 'herstellerAngabe'>, systeme: HerstellerSystem[]): HerstellerSystem | undefined {
  if (!z.herstellerAngabe || z.herstellerAngabe === KEINE_HERSTELLER_VORGABE) return undefined;
  return systeme.find((s) => s.id === z.herstellerAngabe);
}

/**
 * Bestellentwurf aus dem Zwischenstand. Hersteller und Komponenten des Katalogs kommen nur hinein, wenn der
 * Katalog Hersteller anbietet (Preisregel des Bestands); sonst höchstens der Name eines gewählten Systems als
 * Angabe ohne Preiswirkung (FA-SHOP-04B).
 */
export function zuEntwurf(z: Zusammenstellung, katalog: CylinderCatalog, systeme: HerstellerSystem[] = []): CylinderOrderDraft {
  const expandable = z.expandable === true;
  const entwurf: CylinderOrderDraft = {
    items: z.items,
    keyCount: z.keyCount,
    extraIds: wirksameZusatzIds({ extraIds: z.extraIds, expandable }, katalog),
    expandable,
  };
  const angeboten = aktiveHersteller(katalog);
  if (angeboten.length > 0) {
    if (z.manufacturerId) {
      entwurf.manufacturerId = z.manufacturerId;
      const hersteller = angeboten.find((h) => h.id === z.manufacturerId);
      const components = z.components.filter((wahl) => wahl.qty >= 1 && hersteller?.components.some((k) => k.name === wahl.name));
      if (components.length > 0) entwurf.components = components;
    }
    return entwurf;
  }
  const system = gewaehltesSystem(z, systeme);
  if (system) entwurf.herstellerAngabe = system.name;
  return entwurf;
}

/**
 * Weg in die Anfrage, wenn ein Preis nicht bestätigt ist (FA-SHOP-04B, Punkt 9): in den Schließplan-Planer
 * mit Zylindern, Maßen, Schlüsseln, Ziehschutz, Erweiterung, dem Hersteller als System und den übrigen
 * Optionen als Wünsche. Passt das nicht in einen Link, die allgemeine Anfrage zum Thema.
 */
export function anfrageZiel(
  z: Zusammenstellung,
  hersteller?: string,
): { href: string; mitPlan: boolean } {
  const plan = positionenZuPlan(z.items, z.keyCount, { extraIds: z.extraIds, expandable: z.expandable, system: hersteller });
  if (!passtInLink(plan)) return { href: ALLGEMEINE_ANFRAGE, mitPlan: false };
  const wuensche = z.extraIds.filter((id) => id !== SCHUTZ_OPTION_ID && id !== ERWEITERBAR_OPTION_ID);
  return {
    href: `/schliessanlagen/konfigurator/schliessplan?plan=${kodiere(plan)}${wuensche.length ? `&wuensche=${encodeURIComponent(wuensche.join(','))}` : ''}`,
    mitPlan: true,
  };
}

/** Anfrage zum Thema des Konfigurators, wenn kein Link möglich ist: alle Auswege landen im selben Fachbereich. */
export const ALLGEMEINE_ANFRAGE = '/service-und-termin/anfrage?thema=gleichschliessende-zylinder';

/** Ausweg für eine Bauform, die der Katalog nicht führt (FA-15-03): Anfrage mit vorbelegtem Thema. */
export const ANDERE_BAUFORM_ANFRAGE = '/service-und-termin/anfrage?thema=gleichschliessende-zylinder&artikel=Andere%20Zylinder-Bauform';

/**
 * Knopf am Ende: mit bestätigten Preisen „In den Warenkorb“, sonst kein Bestellknopf, sondern der Weg in die
 * Anfrage (FA-SHOP-04B, Punkt 6).
 */
export function abschlussKnopf(preisOffen: boolean): { label: string; ziel: 'warenkorb' | 'anfrage' } {
  return preisOffen ? { label: 'Zusammenstellung als Anfrage schicken', ziel: 'anfrage' } : { label: 'In den Warenkorb', ziel: 'warenkorb' };
}

/** Ergebnis der Schrittprüfungen des Konfigurators. */
export interface AngabenPruefung {
  herstellerOk: boolean;
  cylindersOk: boolean;
  keysOk: boolean;
  erweiterungOk: boolean;
}

/**
 * Schrittprüfung der Zusammenfassung: Alle Angaben müssen vollständig sein. Ein unbestätigter Preis sperrt
 * hier nicht, denn der Knopf führt dann in die Anfrage statt in den Warenkorb (FA-SHOP-04B, Punkt 6).
 */
export function zusammenfassungBereit(p: AngabenPruefung): boolean {
  return p.herstellerOk && p.cylindersOk && p.keysOk && p.erweiterungOk;
}

/** Was der Knopf am Ende tut: bei offenem Preis nie der Warenkorb, sondern der Weg in die Anfrage (Punkt 6). */
export function abschlussAktion(preisOffen: boolean, anfrageHref: string): { art: 'warenkorb' } | { art: 'anfrage'; href: string } {
  return preisOffen ? { art: 'anfrage', href: anfrageHref } : { art: 'warenkorb' };
}
