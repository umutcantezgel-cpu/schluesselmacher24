import type { FahrzeugKlasse, FahrzeugReihe, VehicleMake } from '@/lib/types';
import { NICHT_GEFUNDEN_ADRESSE } from '@/lib/fahrzeuge/anfrage-klassen';
import type { SuchReihe } from '@/lib/fahrzeuge/suche';

/** Schlanker Eintrag des Fahrzeugkatalogs für die Suche im Browser (G-14). */
export interface KatalogEintrag extends SuchReihe {
  id: string;
  /** „makeSlug/modelSlug“ eines gepflegten Modells (Preise, Schlüsselarten), sonst leer. */
  bestandsModell?: string;
  /** Generationen mit Bauzeitraum, nur bei Reihen, die welche tragen (A-047). */
  generationen?: Array<{ bezeichnung: string; baujahrVon?: number; baujahrBis?: number }>;
}

/** Quellenvermerk der Pkw-Daten aus FZ 12 (QUELLEN.md, MA-17), im Wortlaut wie bisher. */
const FZ12_VERMERK = 'Kraftfahrt-Bundesamt (KBA), FZ 12, Stand 1.1.2026, Datenlizenz Deutschland, Namensnennung, Version 2.0';
/** Quellenvermerk der Daten aus FZ 2, im Wortlaut des Blatts „Impressum“ der Datei (QUELLEN.md). */
const FZ2_VERMERK = 'Kraftfahrt-Bundesamt (KBA), FZ 2, Stand 1.1.2026, © Kraftfahrt-Bundesamt, Flensburg, Datenlizenz Deutschland - Namensnennung - Version 2.0';

/** Quellenvermerk des Pkw-Katalogs, sichtbar überall, wo der Katalog genutzt wird (Fahrzeugsuche, Markenübersicht). */
export const KATALOG_QUELLE = `Quelle der Marken und Modellreihen: ${FZ12_VERMERK}; seltene Marken und weitere Handelsnamen: ${FZ2_VERMERK}`;

/** Quellenvermerk der Krafträder im Motorradweg. */
export const KRAFTRAD_QUELLE = `Quelle der Hersteller und Handelsnamen: ${FZ2_VERMERK}`;

/**
 * Adressen, unter denen der Browser den Katalog einer Klasse nachlädt (A-047): Der Katalog gehört nicht in
 * den ersten Seitenaufruf, die Suche holt ihn beim ersten Gebrauch.
 */
export const KATALOG_ADRESSE: Readonly<Record<FahrzeugKlasse, string>> = {
  pkw: '/autoschluessel/anfrage/fahrzeuge',
  kraftrad: '/motorradschluessel/anfrage/fahrzeuge',
};

/** Nur sichtbare Reihen, nur die Felder der Suche; mit `klasse` nur Reihen dieser Klasse (ohne Klasse: Pkw). */
export function katalogIndex(reihen: readonly FahrzeugReihe[], klasse?: FahrzeugKlasse): KatalogEintrag[] {
  return reihen
    .filter((r) => r.sichtbar && (!klasse || (r.klasse ?? 'pkw') === klasse))
    .map((r) => ({
      id: r.id,
      marke: r.marke,
      reihe: r.reihe,
      sichtbar: true,
      ...(r.klasse && r.klasse !== 'pkw' ? { klasse: r.klasse } : {}),
      ...(r.alias?.length ? { alias: r.alias } : {}),
      ...(r.bestand ? { bestand: r.bestand } : {}),
      ...(r.bestandsModell ? { bestandsModell: r.bestandsModell } : {}),
      ...(r.generationen?.length
        ? {
            generationen: r.generationen.map((g) => ({
              bezeichnung: g.bezeichnung,
              ...(g.baujahrVon ? { baujahrVon: g.baujahrVon } : {}),
              ...(g.baujahrBis ? { baujahrBis: g.baujahrBis } : {}),
            })),
          }
        : {}),
    }));
}

/** Alle Marken einer Klasse von A bis Z, mit Zahl der Reihen (Markenübersicht). */
export function markenAZ(reihen: readonly FahrzeugReihe[], klasse: FahrzeugKlasse = 'pkw'): Array<{ marke: string; reihen: number }> {
  const zahl = new Map<string, number>();
  for (const r of reihen) {
    if (!r.sichtbar || (r.klasse ?? 'pkw') !== klasse) continue;
    zahl.set(r.marke, (zahl.get(r.marke) ?? 0) + 1);
  }
  const sortierer = new Intl.Collator('de', { sensitivity: 'base' });
  return [...zahl].map(([marke, n]) => ({ marke, reihen: n })).sort((a, b) => sortierer.compare(a.marke, b.marke));
}

export type FahrzeugZiel =
  /** Gepflegtes Modell: Preis, Anzahlung und Termin im Assistenten (G-16). */
  | { art: 'gepflegt'; makeSlug: string; modelSlug: string; name: string }
  /** Marke gepflegt, Reihe nicht: Weg „Modell nicht aufgeführt“ des Bestands. */
  | { art: 'marke'; makeSlug: string; modelOther: string; name: string }
  /** Marke nicht gepflegt: Anfrage „Fahrzeug nicht gefunden“ mit Fahrzeugschein und drei Schlüsselfotos (G-15, FA-KERN-02B). */
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

/**
 * „Fahrzeug nicht gefunden?“ (FA-KERN-02B): Anfrage mit Fahrzeugschein, drei Schlüsselfotos und Beschreibung
 * für ein Fahrzeug außerhalb der gepflegten Marken (G-15), mit Vorbelegung. Ein Treffer des Katalogs geht
 * mit Marke und Reihe getrennt mit; ein freier Suchtext als `fahrzeug`.
 */
export function anfrageHref(fahrzeug?: string | { marke: string; reihe?: string }): string {
  const basis = NICHT_GEFUNDEN_ADRESSE;
  if (fahrzeug && typeof fahrzeug === 'object') {
    const marke = fahrzeug.marke.trim().slice(0, 60);
    const reihe = fahrzeug.reihe?.trim().slice(0, 80) ?? '';
    const teile = [marke && `marke=${encodeURIComponent(marke)}`, reihe && `modell=${encodeURIComponent(reihe)}`].filter(Boolean);
    return teile.length ? `${basis}?${teile.join('&')}` : basis;
  }
  const text = fahrzeug?.trim().slice(0, 80);
  return text ? `${basis}?fahrzeug=${encodeURIComponent(text)}` : basis;
}
