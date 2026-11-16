/*
 * Sperre für unbestätigte Preise (FA-SHOP-04, Abschnitt 15: „keine Demo Preise“, G9, R9).
 *
 * Im Zylinderkatalog kann der Betrieb bei jeder Bauform, Funktion, Option, jedem Hersteller und beim
 * Schlüsselpreis den Haken „Preis nicht bestätigt“ setzen. Eine Zusammenstellung, die einen solchen
 * Eintrag nutzt, ist nicht bestellbar: Die gemeinsame Prüfung (validateCylinderDraft) lehnt sie in
 * Konfigurator und Kasse ab, und der Konfigurator führt in die Anfrage mit Angebot. Der Preis selbst
 * bleibt unverändert; ohne Haken ändert sich nichts.
 *
 * Dieses Modul kennt nur Typen, damit `cylinder-rules` es ohne Kreisbezug einbinden kann. Die
 * wirksamen Zusatzoptionen (mit „Erweiterbar reservieren“) gibt der Aufrufer mit.
 */

import type { CylinderCatalog, CylinderLineItem, CylinderOrderDraft } from '../types';

export type UnbestaetigtArt = 'bauform' | 'funktion' | 'option' | 'schluessel' | 'hersteller';

/** Ein Eintrag mit dem Haken „Preis nicht bestätigt“, den eine Zusammenstellung nutzt. */
export interface UnbestaetigterPreis {
  art: UnbestaetigtArt;
  /** Kennung im Katalog; beim Schlüsselpreis „schluessel“. */
  kennung: string;
  /** Bezeichnung für den Kunden. */
  label: string;
}

/** Bauform oder Funktion dieser Position mit unbestätigtem Preis. */
export function unbestaetigteInPosition(item: CylinderLineItem, katalog: CylinderCatalog): UnbestaetigterPreis[] {
  const treffer: UnbestaetigterPreis[] = [];
  const form = katalog.forms.find((f) => f.id === item.form);
  if (form?.priceUnconfirmed) treffer.push({ art: 'bauform', kennung: form.id, label: form.label });
  const fn = item.functionId ? katalog.functions.find((f) => f.id === item.functionId) : undefined;
  if (fn?.priceUnconfirmed) treffer.push({ art: 'funktion', kennung: fn.id, label: fn.label });
  return treffer;
}

/**
 * Alle Einträge mit unbestätigtem Preis, die diese Zusammenstellung nutzt, ohne Doppelte, in der
 * Reihenfolge Hersteller, Positionen, Schlüssel, Optionen. Leer heißt: bestellbar, soweit es die
 * Preise betrifft.
 */
export function unbestaetigtePreise(
  entwurf: CylinderOrderDraft,
  katalog: CylinderCatalog,
  zusatzIds: string[] = entwurf.extraIds,
): UnbestaetigterPreis[] {
  const treffer: UnbestaetigterPreis[] = [];
  const gesehen = new Set<string>();
  const merken = (t: UnbestaetigterPreis) => {
    const schluessel = `${t.art}|${t.kennung}`;
    if (gesehen.has(schluessel)) return;
    gesehen.add(schluessel);
    treffer.push(t);
  };

  if (entwurf.manufacturerId) {
    const hersteller = (katalog.manufacturers ?? []).find((h) => h.id === entwurf.manufacturerId);
    if (hersteller?.priceUnconfirmed) merken({ art: 'hersteller', kennung: hersteller.id, label: hersteller.name });
  }
  for (const item of entwurf.items) unbestaetigteInPosition(item, katalog).forEach(merken);
  if (katalog.keyPriceUnconfirmed && entwurf.keyCount > katalog.includedKeys) {
    merken({ art: 'schluessel', kennung: 'schluessel', label: 'zusätzliche Schlüssel' });
  }
  for (const id of zusatzIds) {
    const extra = katalog.extras.find((e) => e.id === id);
    if (extra?.priceUnconfirmed) merken({ art: 'option', kennung: extra.id, label: extra.label });
  }
  return treffer;
}

/** Namen lesbar verbinden: „A“, „A und B“, „A, B und C“. */
function aufzaehlung(namen: string[]): string {
  if (namen.length <= 1) return namen.join('');
  return `${namen.slice(0, -1).join(', ')} und ${namen[namen.length - 1]}`;
}

/** Satz für Konfigurator und Kasse; null, wenn kein Preis unbestätigt ist. */
export function preisSperreText(treffer: UnbestaetigterPreis[]): string | null {
  if (treffer.length === 0) return null;
  const namen = treffer.map((t) => `„${t.label}“`);
  return treffer.length === 1
    ? `Der Preis für ${namen[0]} ist noch nicht bestätigt.`
    : `Die Preise für ${aufzaehlung(namen)} sind noch nicht bestätigt.`;
}

/**
 * Weg aus der Sperre für Warenkorb und Kasse: Ein älterer Warenkorb endet sonst ohne Ausweg. Der
 * Schließplan-Planer nennt sein eigenes Angebot und lässt diesen Satz weg (`ohneSperreWeg`).
 */
export const PREIS_SPERRE_WEG =
  'Bitte schicken Sie Ihre Zusammenstellung im Konfigurator für gleichschließende Zylinder als Anfrage. Sie bekommen dann ein Angebot.';

/** Gemeinsame Prüfung: Meldung mit Weg in die Anfrage, wenn die Zusammenstellung einen unbestätigten Preis nutzt, sonst null. */
export function preisSperre(entwurf: CylinderOrderDraft, katalog: CylinderCatalog, zusatzIds?: string[]): string | null {
  const text = preisSperreText(unbestaetigtePreise(entwurf, katalog, zusatzIds));
  return text ? `${text} ${PREIS_SPERRE_WEG}` : null;
}

/** Meldung ohne den Weg aus `preisSperre`, für Stellen, die selbst in die Anfrage führen. */
export function ohneSperreWeg(meldung: string): string {
  return meldung.endsWith(` ${PREIS_SPERRE_WEG}`) ? meldung.slice(0, -(PREIS_SPERRE_WEG.length + 1)) : meldung;
}
