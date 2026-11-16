/*
 * Ortsstamm in die Datenbank (FA-PLATTFORM-03, A-051 Nr. 2): Sammlung `orte` aus content/orte/.
 *
 * Wiederholbar und in Stapeln: Je Stapel ein INSERT … ON CONFLICT über den Gemeindeschlüssel. Ein Vermerk im
 * Schlüsselspeicher (`sm24:orte-stamm`) hält Prüfsumme und Umfang des letzten Laufs; ist beides gleich, schreibt
 * der Lauf nichts. Gemeinden, die ein neuer Stand nicht mehr führt, werden nur im Volllauf auf „nicht aktiv“
 * gesetzt, nie gelöscht (G6; spätere Ortsseiten können auf sie verweisen).
 *
 * Umfang: „voll“ (alle Gemeinden), „stichprobe“ (Lahn-Dill-Kreis und alle Orte der Prioritätsliste, für die
 * Datenbanktests, Zusatz 1) oder „aus“. Der Seed nimmt `SM24_ORTSSTAMM`, sonst „voll“.
 * Volllauf als eigener Befehl: `npx payload run src/lib/orte/uebernahme-lauf.ts` (content/orte/LIZENZ.md, Abschnitt Aktualisierung).
 *
 * Ohne server-only, weil `payload run` es nicht lädt; die Anwendung liest den Stamm über stamm.ts.
 */

import { createHash } from 'node:crypto';

import { sql } from '@payloadcms/db-postgres';
import type { Payload } from 'payload';

import { ortsstammLesen } from './dateien';
import type { Gemeinde, OrtsstammDaten } from './typen';
import { LAENDER } from './typen';

export type OrtsstammUmfang = 'voll' | 'stichprobe' | 'aus';

export const ORTSSTAMM_VERMERK = 'sm24:orte-stamm';
/** Kreis der Stichprobe: Lahn-Dill-Kreis (Werkstatt in Wetzlar). */
export const STICHPROBE_KREIS = '06532';
export const STAPEL_GROESSE = 500;

export interface OrtsstammErgebnis {
  umfang: OrtsstammUmfang;
  uebersprungen: boolean;
  geschrieben: number;
  zugaenge: number;
  umbenennungen: number;
  abgaenge: number;
}

interface OrtsstammOptionen {
  umfang?: OrtsstammUmfang;
  daten?: OrtsstammDaten;
  stapel?: number;
  /** Auch bei gleichem Vermerk schreiben. */
  erzwingen?: boolean;
  protokoll?: (zeile: string) => void;
}

/** Umfang aus der Umgebung; unbekannte Werte gelten als „voll“. */
export function umfangAusUmgebung(wert = process.env.SM24_ORTSSTAMM): OrtsstammUmfang {
  return wert === 'stichprobe' || wert === 'aus' ? wert : 'voll';
}

/** Gemeinden des Umfangs, in der Reihenfolge des Gemeindeverzeichnisses. */
export function gemeindenImUmfang(daten: OrtsstammDaten, umfang: OrtsstammUmfang): Gemeinde[] {
  if (umfang === 'aus') return [];
  const alle = daten.gemeinden.gemeinden;
  if (umfang === 'voll') return alle;
  const prioritaet = new Set(daten.prioritaet.eintraege.map((e) => e.schluessel).filter((s): s is string => Boolean(s)));
  return alle.filter((g) => g.kreis === STICHPROBE_KREIS || prioritaet.has(g.schluessel));
}

/** Zeile der Tabelle `orte` (Spaltennamen wie in der Migration orte_stamm). */
export function zeileFuerGemeinde(g: Gemeinde, kreisName: string | null, stand: string | null, postleitzahlen: string[]) {
  return {
    gemeindeschluessel: g.schluessel,
    regionalschluessel: g.regionalschluessel,
    name: g.name,
    bezeichnung: g.bezeichnung,
    art: g.art,
    slug: g.slug,
    kreis_schluessel: g.kreis,
    kreis_name: kreisName,
    land_schluessel: g.land,
    land: LAENDER[g.land] ?? null,
    plz_verwaltungssitz: g.plz,
    postleitzahlen: postleitzahlen.join(', '),
    breite: g.breite,
    laenge: g.laenge,
    einwohner: g.einwohner,
    stand,
  };
}

function pruefsumme(daten: OrtsstammDaten): string {
  return createHash('sha256')
    .update(JSON.stringify(daten.gemeinden.gemeinden))
    .update(JSON.stringify(daten.kreise.kreise))
    .update(JSON.stringify(daten.postleitzahlen.postleitzahlen.map((p) => [p.plz, p.gemeinden])))
    .update(JSON.stringify(daten.prioritaet.eintraege.map((e) => e.schluessel)))
    .digest('hex');
}

type Ausfuehrer = { execute: (abfrage: ReturnType<typeof sql>) => Promise<{ rows: Array<Record<string, unknown>> }> };

/** Überträgt den Stamm. Gibt zurück, was geschrieben wurde; mehrfach aufrufbar. */
export async function ortsstammUebernehmen(payload: Payload, optionen: OrtsstammOptionen = {}): Promise<OrtsstammErgebnis> {
  const umfang = optionen.umfang ?? umfangAusUmgebung();
  const protokoll = optionen.protokoll ?? ((zeile: string) => console.log(zeile));
  const leer = { umfang, geschrieben: 0, zugaenge: 0, umbenennungen: 0, abgaenge: 0 };
  if (umfang === 'aus') return { ...leer, uebersprungen: true };

  const daten = optionen.daten ?? (await ortsstammLesen());
  const summe = pruefsumme(daten);
  const vermerk = await payload.kv.get<{ pruefsumme: string; umfang: OrtsstammUmfang }>(ORTSSTAMM_VERMERK);
  // Ein früherer Volllauf deckt auch eine Stichprobe ab.
  if (!optionen.erzwingen && vermerk?.pruefsumme === summe && (vermerk.umfang === umfang || vermerk.umfang === 'voll')) {
    protokoll(`  orte: aktuell (${vermerk.umfang})`);
    return { ...leer, uebersprungen: true };
  }

  const db = payload.db.drizzle as unknown as Ausfuehrer;
  const gemeinden = gemeindenImUmfang(daten, umfang);
  const kreisNamen = new Map(daten.kreise.kreise.map((k) => [k.schluessel, k.name]));
  const stand = daten.gemeinden.herkunft.gebietsstand ?? null;
  const plzJeGemeinde = new Map<string, string[]>();
  for (const p of daten.postleitzahlen.postleitzahlen) {
    for (const ags of p.gemeinden) plzJeGemeinde.set(ags, [...(plzJeGemeinde.get(ags) ?? []), p.plz]);
  }

  const vorhanden = new Map<string, { name: string; aktiv: boolean }>();
  const { rows } = await db.execute(sql`SELECT "gemeindeschluessel", "name", "aktiv" FROM "orte"`);
  for (const r of rows) vorhanden.set(String(r.gemeindeschluessel), { name: String(r.name), aktiv: r.aktiv !== false });

  let zugaenge = 0;
  let umbenennungen = 0;
  for (const g of gemeinden) {
    const alt = vorhanden.get(g.schluessel);
    if (!alt) zugaenge += 1;
    else if (alt.name !== g.name) umbenennungen += 1;
  }

  const groesse = Math.max(1, optionen.stapel ?? STAPEL_GROESSE);
  for (let i = 0; i < gemeinden.length; i += groesse) {
    const werte = gemeinden.slice(i, i + groesse).map((g) => {
      const z = zeileFuerGemeinde(g, kreisNamen.get(g.kreis) ?? null, stand, [...(plzJeGemeinde.get(g.schluessel) ?? [])].sort());
      return sql`(${z.gemeindeschluessel}, ${z.regionalschluessel}, ${z.name}, ${z.bezeichnung}, ${z.art}::"enum_orte_art", ${z.slug},
        ${z.kreis_schluessel}, ${z.kreis_name}, ${z.land_schluessel}, ${z.land}, ${z.plz_verwaltungssitz}, ${z.postleitzahlen},
        ${z.breite}, ${z.laenge}, ${z.einwohner}, true, ${z.stand}, now(), now())`;
    });
    await db.execute(sql`
      INSERT INTO "orte" ("gemeindeschluessel", "regionalschluessel", "name", "bezeichnung", "art", "slug",
        "kreis_schluessel", "kreis_name", "land_schluessel", "land", "plz_verwaltungssitz", "postleitzahlen",
        "breite", "laenge", "einwohner", "aktiv", "stand", "updated_at", "created_at")
      VALUES ${sql.join(werte, sql`, `)}
      ON CONFLICT ("gemeindeschluessel") DO UPDATE SET
        "regionalschluessel" = EXCLUDED."regionalschluessel", "name" = EXCLUDED."name", "bezeichnung" = EXCLUDED."bezeichnung",
        "art" = EXCLUDED."art", "slug" = EXCLUDED."slug", "kreis_schluessel" = EXCLUDED."kreis_schluessel",
        "kreis_name" = EXCLUDED."kreis_name", "land_schluessel" = EXCLUDED."land_schluessel", "land" = EXCLUDED."land",
        "plz_verwaltungssitz" = EXCLUDED."plz_verwaltungssitz", "postleitzahlen" = EXCLUDED."postleitzahlen",
        "breite" = EXCLUDED."breite", "laenge" = EXCLUDED."laenge", "einwohner" = EXCLUDED."einwohner",
        "aktiv" = true, "stand" = EXCLUDED."stand", "updated_at" = now()`);
  }

  // Abgänge nur im Volllauf: Die Stichprobe kennt nicht alle Gemeinden.
  let abgaenge = 0;
  if (umfang === 'voll') {
    const aktuell = new Set(gemeinden.map((g) => g.schluessel));
    const weg = [...vorhanden].filter(([s, v]) => v.aktiv && !aktuell.has(s)).map(([s]) => s);
    for (let i = 0; i < weg.length; i += groesse) {
      const teil = weg.slice(i, i + groesse);
      await db.execute(sql`UPDATE "orte" SET "aktiv" = false, "updated_at" = now() WHERE "gemeindeschluessel" IN (${sql.join(
        teil.map((s) => sql`${s}`),
        sql`, `,
      )})`);
    }
    abgaenge = weg.length;
  }

  await payload.kv.set(ORTSSTAMM_VERMERK, { pruefsumme: summe, umfang, gebietsstand: daten.gemeinden.herkunft.gebietsstand });
  protokoll(`  orte: ${gemeinden.length} geschrieben (${umfang}), ${zugaenge} neu, ${umbenennungen} umbenannt, ${abgaenge} nicht mehr aktiv`);
  return { umfang, uebersprungen: false, geschrieben: gemeinden.length, zugaenge, umbenennungen, abgaenge };
}
