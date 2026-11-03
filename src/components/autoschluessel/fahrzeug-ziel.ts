import type { FahrzeugReihe, VehicleMake } from '@/lib/types';
import type { SuchReihe } from '@/lib/fahrzeuge/suche';

/** Schlanker Eintrag des Fahrzeugkatalogs für die Suche im Browser (G-14). */
export interface KatalogEintrag extends SuchReihe {
  id: string;
  /** „makeSlug/modelSlug“ eines gepflegten Modells (Preise, Schlüsselarten), sonst leer. */
  bestandsModell?: string;
}

/** Quellenvermerk des Katalogs (QUELLEN.md, MA-17), sichtbar überall, wo der Katalog genutzt wird. */
export const KATALOG_QUELLE =
  'Quelle der Marken und Modellreihen: Kraftfahrt-Bundesamt (KBA), FZ 12, Stand 1.1.2026, Datenlizenz Deutschland, Namensnennung, Version 2.0';

/** Nur sichtbare Reihen, nur die Felder der Suche. */
export function katalogIndex(reihen: readonly FahrzeugReihe[]): KatalogEintrag[] {
  return reihen
    .filter((r) => r.sichtbar)
    .map((r) => ({
      id: r.id,
      marke: r.marke,
      reihe: r.reihe,
      sichtbar: true,
      ...(r.alias?.length ? { alias: r.alias } : {}),
      ...(r.bestand ? { bestand: r.bestand } : {}),
      ...(r.bestandsModell ? { bestandsModell: r.bestandsModell } : {}),
    }));
}

export type FahrzeugZiel =
  /** Gepflegtes Modell: Preis, Anzahlung und Termin im Assistenten (G-16). */
  | { art: 'gepflegt'; makeSlug: string; modelSlug: string; name: string }
  /** Marke gepflegt, Reihe nicht: Weg „Modell nicht aufgeführt“ des Bestands. */
  | { art: 'marke'; makeSlug: string; modelOther: string; name: string }
  /** Marke nicht gepflegt: Anfrage mit Fahrzeugschein und Schlüsselfoto (G-15). */
  | { art: 'anfrage'; name: string };

/**
 * Marke des Katalogs → Marken-Slug des Bestands, abgeleitet aus den Reihen, die auf ein gepflegtes
 * Modell verweisen (kein Abgleich über ähnlich klingende Namen).
 */
export function markenZuordnung(index: readonly KatalogEintrag[], makes: readonly VehicleMake[]): Map<string, string> {
  const bekannte = new Set(makes.map((m) => m.slug));
  const zuordnung = new Map<string, string>();
  for (const e of index) {
    const makeSlug = e.bestandsModell?.split('/')[0];
    if (makeSlug && bekannte.has(makeSlug) && !zuordnung.has(e.marke)) zuordnung.set(e.marke, makeSlug);
  }
  return zuordnung;
}

/** Wohin ein Treffer führt: gepflegtes Modell, gepflegte Marke oder Anfrage. */
export function fahrzeugZiel(e: KatalogEintrag, makes: readonly VehicleMake[], marken: ReadonlyMap<string, string>): FahrzeugZiel {
  const name = `${e.marke} ${e.reihe}`;
  const [makeSlug, modelSlug] = e.bestandsModell?.split('/') ?? [];
  const make = makes.find((m) => m.slug === makeSlug);
  if (make && modelSlug && make.models.some((m) => m.slug === modelSlug)) return { art: 'gepflegt', makeSlug, modelSlug, name };
  const markeSlug = marken.get(e.marke);
  if (markeSlug && makes.some((m) => m.slug === markeSlug)) return { art: 'marke', makeSlug: markeSlug, modelOther: e.reihe, name };
  return { art: 'anfrage', name };
}

/** Anfrage für ein Fahrzeug außerhalb der gepflegten Marken (G-15), mit Vorbelegung. */
export function anfrageHref(fahrzeug?: string): string {
  const basis = '/service-und-termin/anfrage?thema=autoschluessel';
  const text = fahrzeug?.trim().slice(0, 80);
  return text ? `${basis}&fahrzeug=${encodeURIComponent(text)}` : basis;
}
