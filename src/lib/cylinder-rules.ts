import type {
  CylinderCatalog,
  CylinderForm,
  CylinderFormOption,
  CylinderManufacturer,
  CylinderOrderDraft,
} from '@/lib/types';

/**
 * Regeln für gleichschließende Zylinder — gemeinsam für Konfigurator (Browser)
 * und Kasse (Server), damit beide exakt dasselbe erlauben.
 */

/** Kennung der Katalog-Option „Erweiterbar reservieren“. Die Antwort „Erweiterbar: Ja“ wählt sie mit. */
export const ERWEITERBAR_OPTION_ID = 'gleichschliessung-erweiterbar';

/**
 * Die Zusatzoptionen, die tatsächlich gelten. Die Option „Erweiterbar reservieren“ folgt allein
 * der Antwort zur Erweiterung: Bei „Ja“ ist sie gewählt (sofern im Katalog angeboten), bei „Nein“
 * nicht — eine erweiterbare Schließung ist damit nie kostenlos bestellbar.
 */
export function wirksameZusatzIds(
  draft: Pick<CylinderOrderDraft, 'extraIds' | 'expandable'>,
  catalog: Pick<CylinderCatalog, 'extras'>,
): string[] {
  const ohne = draft.extraIds.filter((id) => id !== ERWEITERBAR_OPTION_ID);
  const angeboten = catalog.extras.some((extra) => extra.id === ERWEITERBAR_OPTION_ID && extra.active);
  return draft.expandable && angeboten ? [...ohne, ERWEITERBAR_OPTION_ID] : ohne;
}

/** Angebotene Hersteller. Ist die Liste leer, fragt der Konfigurator keinen Hersteller ab. */
export function aktiveHersteller(catalog: Pick<CylinderCatalog, 'manufacturers'>): CylinderManufacturer[] {
  return (catalog.manufacturers ?? []).filter((hersteller) => hersteller.active);
}

/** Der gewählte Hersteller, sofern er angeboten wird. */
export function gewaehlterHersteller(
  draft: Pick<CylinderOrderDraft, 'manufacturerId'>,
  catalog: Pick<CylinderCatalog, 'manufacturers'>,
): CylinderManufacturer | undefined {
  if (!draft.manufacturerId) return undefined;
  return aktiveHersteller(catalog).find((hersteller) => hersteller.id === draft.manufacturerId);
}

/** Liefert der Hersteller diese Bauform? Eine leere Liste heißt: alle Bauformen. */
export function herstellerFuehrtBauform(hersteller: CylinderManufacturer | undefined, form: CylinderForm): boolean {
  return !hersteller || hersteller.forms.length === 0 || hersteller.forms.includes(form);
}

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
  return herstellerProblem(draft, catalog);
}

/**
 * Hersteller und Zusatzkomponenten. Bietet der Katalog Hersteller an, ist die Wahl Pflicht;
 * sonst darf keiner gewählt sein — dann gilt alles wie ohne Herstellerauswahl.
 */
function herstellerProblem(draft: CylinderOrderDraft, catalog: CylinderCatalog): string | null {
  const angeboten = aktiveHersteller(catalog);
  const komponenten = draft.components ?? [];

  if (angeboten.length === 0) {
    if (draft.manufacturerId || komponenten.length > 0) return 'Der gewählte Hersteller wird derzeit nicht angeboten.';
    return null;
  }

  if (!draft.manufacturerId) return 'Bitte wählen Sie einen Hersteller.';
  const hersteller = gewaehlterHersteller(draft, catalog);
  if (!hersteller) return 'Der gewählte Hersteller wird derzeit nicht angeboten.';

  for (const item of draft.items) {
    if (!herstellerFuehrtBauform(hersteller, item.form)) {
      const form = catalog.forms.find((f) => f.id === item.form);
      return `${form?.label ?? item.form} ist bei ${hersteller.name} nicht wählbar.`;
    }
  }

  const namen = new Set<string>();
  for (const wahl of komponenten) {
    if (!hersteller.components.some((komponente) => komponente.name === wahl.name)) {
      return `Die Zusatzkomponente „${wahl.name}“ wird bei ${hersteller.name} nicht angeboten.`;
    }
    if (namen.has(wahl.name)) return `Die Zusatzkomponente „${wahl.name}“ ist doppelt gewählt.`;
    namen.add(wahl.name);
    if (!Number.isInteger(wahl.qty) || wahl.qty < 1 || wahl.qty > catalog.maxCylinders) {
      return `Die Stückzahl für „${wahl.name}“ muss zwischen 1 und ${catalog.maxCylinders} liegen.`;
    }
  }
  return null;
}
