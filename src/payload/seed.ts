/**
 * Überträgt die Inhalte aus `content/*.json` in die Datenbank (Aufruf über
 * `src/scripts/seed.ts`, bei jedem Produktions-Build nach den Migrationen).
 *
 * Eintrag für Eintrag nach seinem natürlichen Schlüssel (Route, Kennung,
 * Adresse, Datum, Titel — siehe `seed()` unten):
 *
 * - Neue Einträge aus `content/*.json` werden angelegt.
 * - Vorhandene werden nie überschrieben — außer beim Startwert-Abgleich.
 * - Gelöschte kommen nicht wieder: Je Sammlung führt der Vermerk
 *   `sm24:seed-schluessel:<name>` alle Schlüssel, die schon einmal angelegt
 *   waren. Beim ersten Lauf nach dem Umbau entsteht die Liste aus den
 *   Schlüsseln in der Datenbank und — war die Sammlung schon übernommen —
 *   denen des Schnappschusses `content/startwerte/2026-10-25/` (Livegang).
 *
 * Startwert-Abgleich: Für ausgewählte Textfelder (`abgleich`) gilt: Steht in
 * der Datenbank noch genau ein früherer Startwert, übernimmt der Seed den
 * aktuellen Text aus `content/*.json`. Hat der Betrieb den Text geändert,
 * bleibt seiner. Frühere Startwerte sind die Schnappschüsse unter
 * `content/startwerte/<Datum>/` und jeder Wert, den der Seed selbst angelegt
 * oder abgeglichen hat (Prüfsumme im Vermerk `sm24:seed-stand:<name>`). So
 * erreichen spätere Textänderungen in `content/*.json` die Produktion von
 * selbst. Einträge mit offenem Entwurf oder im Papierkorb bleiben unberührt.
 *
 * Globals werden einmal übernommen; danach füllt der Seed nur neue Felder,
 * die noch leer sind (`GLOBAL_ERGAENZUNGEN`).
 */
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { CollectionSlug, Payload, Where } from 'payload';

import type { CollectionName, Collections } from '../lib/data/adapter';
import { JsonFileAdapter } from '../lib/data/json-adapter';
import * as m from '../lib/data/payload-mapping';

const context = { disableRevalidate: true };

/** Woher die aktuellen Inhalte kommen — Standard: `content/*.json`. */
export interface InhaltsQuelle {
  read<K extends CollectionName>(name: K): Promise<Collections[K]>;
}

/** Dateien eines Schnappschusses unter `content/startwerte/<Datum>/`. */
const STARTWERT_DATEIEN = {
  pricingGroups: 'pricing-groups.json',
  carKeyServices: 'car-key-services.json',
  pricingRules: 'service-pricing.json',
  vehicleMakes: 'vehicles.json',
  codeLines: 'code-lines.json',
  standardArticles: 'standard-articles.json',
  servicePages: 'service-pages.json',
  pages: 'seo.json',
  guides: 'guides.json',
  cities: 'cities.json',
  blockedDays: 'blocked-days.json',
  nachweise: 'nachweise.json',
} as const;

export type StartwertName = keyof typeof STARTWERT_DATEIEN;

/** Ein früherer Stand der Inhalte, je Sammlung die Einträge wie in `content/*.json`. */
export type Startwerte = Partial<Record<StartwertName, unknown[]>>;

export interface SeedOptionen {
  quelle?: InhaltsQuelle;
  /** Frühere Stände; Standard: alle Ordner unter `content/startwerte/`. */
  startwerte?: Startwerte[];
}

/** Liest alle Schnappschüsse unter `content/startwerte/`, ältester zuerst. */
export async function startwerteLesen(wurzel = path.join(process.cwd(), 'content', 'startwerte')): Promise<Startwerte[]> {
  let ordner: string[];
  try {
    ordner = (await fs.readdir(wurzel, { withFileTypes: true }))
      .filter((eintrag) => eintrag.isDirectory())
      .map((eintrag) => eintrag.name)
      .sort();
  } catch {
    return [];
  }
  const staende: Startwerte[] = [];
  for (const name of ordner) {
    const stand: Startwerte = {};
    for (const [sammlung, datei] of Object.entries(STARTWERT_DATEIEN) as [StartwertName, string][]) {
      try {
        stand[sammlung] = JSON.parse(await fs.readFile(path.join(wurzel, name, datei), 'utf8')) as unknown[];
      } catch {
        // Datei fehlt in diesem Stand — dann gibt es dort keine Startwerte.
      }
    }
    staende.push(stand);
  }
  return staende;
}

/* ---------- Werte vergleichen -------------------------------------------- */

type Daten = Record<string, unknown>;

/** Textfeld für den Startwert-Abgleich. */
interface AbgleichFeld {
  /** Pfad im Payload-Dokument, z. B. `seo.titel`. */
  pfad: string;
  /**
   * Bei Listen: die Textspalten je Zeile. Alles andere einer Zeile (Kennung,
   * Bild) bleibt beim Abgleich erhalten.
   */
  spalten?: string[];
}

const SEO_ABGLEICH: AbgleichFeld[] = [
  { pfad: 'seo.titel' },
  { pfad: 'seo.beschreibung' },
  { pfad: 'seo.interneLinks', spalten: ['href', 'label'] },
];

function lesen(daten: unknown, pfad: string): unknown {
  return pfad.split('.').reduce<unknown>((wert, teil) => (wert && typeof wert === 'object' ? (wert as Daten)[teil] : undefined), daten);
}

function setzen(ziel: Daten, pfad: string, wert: unknown) {
  const teile = pfad.split('.');
  let knoten = ziel;
  for (const teil of teile.slice(0, -1)) {
    if (!knoten[teil] || typeof knoten[teil] !== 'object') knoten[teil] = {};
    knoten = knoten[teil] as Daten;
  }
  knoten[teile[teile.length - 1]] = wert;
}

/** Leer ist leer — `null`, `undefined` und `''` gelten als gleich. */
const normal = (wert: unknown) => (wert === undefined || wert === null || wert === '' ? null : wert);

function vergleichswert(daten: unknown, feld: AbgleichFeld): unknown {
  const roh = lesen(daten, feld.pfad);
  if (!feld.spalten) return normal(roh);
  const spalten = feld.spalten;
  return (Array.isArray(roh) ? roh : []).map((zeile) =>
    Object.fromEntries(spalten.map((spalte) => [spalte, normal(lesen(zeile, spalte))])),
  );
}

const pruefsumme = (wert: unknown) => createHash('sha256').update(JSON.stringify(wert)).digest('hex').slice(0, 16);

/** Neue Zeilen mit den Texten aus dem Inhalt; Kennung und übrige Spalten der alten Zeile an gleicher Stelle bleiben. */
function zeilenAbgleichen(alt: unknown, neu: unknown, spalten: string[]): unknown[] {
  const vorher = Array.isArray(alt) ? (alt as Daten[]) : [];
  return (Array.isArray(neu) ? (neu as Daten[]) : []).map((zeile, index) => {
    const bisher = vorher[index];
    if (!bisher || typeof bisher !== 'object') return zeile;
    const texte = Object.fromEntries(spalten.map((spalte) => [spalte, zeile[spalte]]));
    return { ...bisher, ...texte };
  });
}

/* ---------- Übernahme ---------------------------------------------------- */

interface Plan<T> {
  /** Name im Vermerk, z. B. `seiten`. */
  name: string;
  collection: CollectionSlug;
  inhalt: T[];
  startwert: StartwertName;
  /** Natürlicher Schlüssel eines Inhalts. */
  schluessel: (item: T) => string;
  /** Derselbe Schlüssel aus dem gespeicherten Dokument. */
  dbSchluessel: (doc: Daten) => string | undefined;
  zuDaten: (item: T) => Daten;
  /** Nur Dokumente dieser Auswahl gehören zur Sammlung (z. B. Artikelart). */
  where?: Where;
  abgleich?: AbgleichFeld[];
  /** Schlüssel, die eine Datenmigration umbenannt hat: alt → neu. */
  umbenannt?: Record<string, string>;
}

type Stand = Record<string, Record<string, string>>;

/** Übernimmt neue Inhalte und gleicht Startwerte ab. Mehrfach aufrufbar. */
export async function inhalteUebernehmen(payload: Payload, optionen: SeedOptionen = {}): Promise<void> {
  const quelle: InhaltsQuelle = optionen.quelle ?? new JsonFileAdapter();
  const startwerte = optionen.startwerte ?? (await startwerteLesen());
  const vermerk = (name: string) => `sm24:seed:${name}`;
  const schluesselVermerk = (name: string) => `sm24:seed-schluessel:${name}`;
  const standVermerk = (name: string) => `sm24:seed-stand:${name}`;

  async function schonUebernommen(name: string, vorhanden: () => Promise<boolean>): Promise<boolean> {
    if (await payload.kv.has(vermerk(name))) return true;
    // Datenbanken aus der Zeit vor dem Vermerk: Inhalt vorhanden = übernommen.
    if (await vorhanden()) {
      await payload.kv.set(vermerk(name), { nachgetragen: true });
      return true;
    }
    return false;
  }

  /** Kennung → Datenbank-ID, für Verweise auf Preisgruppen und Leistungen. */
  async function kennungen(collection: CollectionSlug): Promise<Map<string, number>> {
    const { docs } = await payload.find({ collection, limit: 0, pagination: false, trash: true, depth: 0 });
    const ids = new Map<string, number>();
    for (const doc of docs as { id: number; kennung?: string | null }[]) {
      if (doc.kennung) ids.set(doc.kennung, doc.id);
    }
    return ids;
  }

  /** Schlüssel eines Startwert-Eintrags — nach einer Umbenennung der neue. */
  function startwertSchluessel<T>(plan: Plan<T>, item: unknown): string[] {
    const alt = plan.schluessel(item as T);
    const neu = plan.umbenannt?.[alt];
    return neu ? [alt, neu] : [alt];
  }

  async function bekannteSchluessel<T>(plan: Plan<T>, vorhanden: Map<string, Daten>): Promise<Set<string>> {
    const gespeichert = await payload.kv.get<{ schluessel: string[] }>(schluesselVermerk(plan.name));
    if (gespeichert) return new Set(gespeichert.schluessel);
    const bekannt = new Set(vorhanden.keys());
    // War die Sammlung schon übernommen, gelten auch die Einträge des
    // Livegang-Stands als angelegt — der Betrieb kann sie gelöscht haben.
    if (vorhanden.size > 0 || (await payload.kv.has(vermerk(plan.name)))) {
      for (const stand of startwerte) {
        for (const item of stand[plan.startwert] ?? []) {
          for (const schluessel of startwertSchluessel(plan, item)) bekannt.add(schluessel);
        }
      }
    }
    return bekannt;
  }

  /** Prüfsummen früherer Startwerte je Schlüssel und Feld. */
  function fruehereWerte<T>(plan: Plan<T>): Map<string, Map<string, Set<string>>> {
    const werte = new Map<string, Map<string, Set<string>>>();
    if (!plan.abgleich?.length) return werte;
    for (const stand of startwerte) {
      for (const item of stand[plan.startwert] ?? []) {
        let daten: Daten;
        try {
          daten = plan.zuDaten(item as T);
        } catch {
          continue; // Verweis aus einem alten Stand gibt es nicht mehr.
        }
        for (const schluessel of startwertSchluessel(plan, item)) {
          const jeFeld = werte.get(schluessel) ?? new Map<string, Set<string>>();
          for (const feld of plan.abgleich) {
            const summen = jeFeld.get(feld.pfad) ?? new Set<string>();
            summen.add(pruefsumme(vergleichswert(daten, feld)));
            jeFeld.set(feld.pfad, summen);
          }
          werte.set(schluessel, jeFeld);
        }
      }
    }
    return werte;
  }

  async function eintraegeUebernehmen<T>(plan: Plan<T>): Promise<void> {
    const { docs } = await payload.find({
      collection: plan.collection,
      where: plan.where,
      limit: 0,
      pagination: false,
      trash: true,
      depth: 0,
      // Neuester Stand je Dokument, auch ein offener Entwurf.
      draft: true,
    });
    const vorhanden = new Map<string, Daten>();
    for (const doc of docs as unknown as Daten[]) {
      const schluessel = plan.dbSchluessel(doc);
      if (schluessel !== undefined) vorhanden.set(schluessel, doc);
    }
    const bekannt = await bekannteSchluessel(plan, vorhanden);
    const stand = (await payload.kv.get<Stand>(standVermerk(plan.name))) ?? {};
    const frueher = fruehereWerte(plan);
    let angelegt = 0;
    let abgeglichen = 0;

    const standMerken = (schluessel: string, daten: unknown) => {
      if (!plan.abgleich?.length) return;
      stand[schluessel] = Object.fromEntries(plan.abgleich.map((feld) => [feld.pfad, pruefsumme(vergleichswert(daten, feld))]));
    };

    for (const item of plan.inhalt) {
      const schluessel = plan.schluessel(item);
      const doc = vorhanden.get(schluessel);

      if (!doc) {
        // Schon einmal angelegt und inzwischen gelöscht: nicht wiederbeleben.
        if (bekannt.has(schluessel)) continue;
        const data = plan.zuDaten(item);
        await payload.create({ collection: plan.collection, data: data as never, draft: data._status === 'draft', context });
        bekannt.add(schluessel);
        standMerken(schluessel, data);
        angelegt += 1;
        continue;
      }

      bekannt.add(schluessel);
      // Papierkorb und offene Entwürfe gehören dem Betrieb.
      if (!plan.abgleich?.length || doc.deletedAt || doc._status === 'draft') continue;

      const neu = plan.zuDaten(item);
      const aenderung: Daten = {};
      const eigenerStand = { ...stand[schluessel] };
      for (const feld of plan.abgleich) {
        const summeNeu = pruefsumme(vergleichswert(neu, feld));
        const summeDb = pruefsumme(vergleichswert(doc, feld));
        if (summeDb === summeNeu) {
          eigenerStand[feld.pfad] = summeNeu;
          continue;
        }
        const unveraendert = eigenerStand[feld.pfad] === summeDb || frueher.get(schluessel)?.get(feld.pfad)?.has(summeDb);
        if (!unveraendert) continue; // vom Betrieb geändert — bleibt
        const wert = feld.spalten
          ? zeilenAbgleichen(lesen(doc, feld.pfad), lesen(neu, feld.pfad), feld.spalten)
          : (lesen(neu, feld.pfad) ?? null);
        setzen(aenderung, feld.pfad, wert);
        eigenerStand[feld.pfad] = summeNeu;
      }
      stand[schluessel] = eigenerStand;
      if (Object.keys(aenderung).length) {
        await payload.update({ collection: plan.collection, id: doc.id as number, data: aenderung as never, context });
        abgeglichen += 1;
      }
    }

    await payload.kv.set(schluesselVermerk(plan.name), { schluessel: [...bekannt].sort() });
    await payload.kv.set(standVermerk(plan.name), stand);
    const teile = [angelegt && `${angelegt} angelegt`, abgeglichen && `${abgeglichen} abgeglichen`].filter(Boolean);
    console.log(`  ${plan.name}: ${teile.length ? teile.join(', ') : 'aktuell'}`);
  }

  async function globalUebernehmen(
    slug: 'einstellungen' | 'zylinderkatalog' | 'richtwerte',
    gefuellt: (doc: Record<string, unknown>) => boolean,
    daten: () => Promise<Record<string, unknown>>,
  ) {
    const doc = (await payload.findGlobal({ slug, depth: 0 })) as unknown as Record<string, unknown>;
    if (await schonUebernommen(slug, async () => gefuellt(doc))) {
      await globalErgaenzen(slug, doc, daten);
      return;
    }
    await payload.updateGlobal({ slug, data: (await daten()) as never, context });
    await payload.kv.set(vermerk(slug), { uebernommen: true });
    console.log(`  ${slug}: übernommen`);
  }

  /** Neue Felder eines schon übernommenen Globals: nur füllen, solange sie leer sind. */
  async function globalErgaenzen(
    slug: keyof typeof GLOBAL_ERGAENZUNGEN,
    doc: Record<string, unknown>,
    daten: () => Promise<Record<string, unknown>>,
  ) {
    const pfade = GLOBAL_ERGAENZUNGEN[slug];
    const offen = pfade.filter((pfad) => normal(lesen(doc, pfad)) === null);
    if (!offen.length) {
      console.log(`  ${slug}: bereits übernommen`);
      return;
    }
    const neu = await daten();
    const aenderung: Daten = {};
    for (const pfad of offen) {
      const wert = lesen(neu, pfad);
      if (normal(wert) !== null) setzen(aenderung, pfad, wert);
    }
    if (!Object.keys(aenderung).length) return;
    await payload.updateGlobal({ slug, data: aenderung as never, context });
    console.log(`  ${slug}: ergänzt (${Object.keys(aenderung).join(', ')})`);
  }

  const kennung = (doc: Daten) => (typeof doc.kennung === 'string' && doc.kennung ? doc.kennung : undefined);

  async function seed() {
    console.log('Inhalte übernehmen …');

    await globalUebernehmen(
      'einstellungen',
      (d) => Boolean((d.firma as { marke?: string } | undefined)?.marke),
      async () => m.einstellungenZuPayload(await quelle.read('settings')) as unknown as Record<string, unknown>,
    );
    await globalUebernehmen(
      'zylinderkatalog',
      (d) => Boolean((d.bauformen as unknown[] | undefined)?.length),
      async () => m.zylinderkatalogZuPayload(await quelle.read('cylinderCatalog')) as unknown as Record<string, unknown>,
    );

    await eintraegeUebernehmen({
      name: 'preisgruppen',
      collection: 'preisgruppen',
      inhalt: await quelle.read('pricingGroups'),
      startwert: 'pricingGroups',
      schluessel: (g) => g.id,
      dbSchluessel: kennung,
      zuDaten: m.preisgruppeZuPayload,
      abgleich: [{ pfad: 'label' }, { pfad: 'beschreibung' }],
    });
    await eintraegeUebernehmen({
      name: 'autoschluessel-leistungen',
      collection: 'autoschluessel-leistungen',
      inhalt: await quelle.read('carKeyServices'),
      startwert: 'carKeyServices',
      schluessel: (s) => s.id,
      dbSchluessel: kennung,
      zuDaten: m.leistungZuPayload,
      abgleich: [{ pfad: 'label' }, { pfad: 'beschreibung' }],
    });
    const gruppen = await kennungen('preisgruppen');
    const leistungen = await kennungen('autoschluessel-leistungen');

    await eintraegeUebernehmen({
      name: 'preisregeln',
      collection: 'preisregeln',
      inhalt: await quelle.read('pricingRules'),
      startwert: 'pricingRules',
      schluessel: (r) => r.id,
      dbSchluessel: kennung,
      zuDaten: (r) => m.preisregelZuPayload(r, gruppen, leistungen),
      abgleich: [{ pfad: 'hinweis' }],
    });
    await eintraegeUebernehmen({
      name: 'fahrzeugmarken',
      collection: 'fahrzeugmarken',
      inhalt: await quelle.read('vehicleMakes'),
      startwert: 'vehicleMakes',
      // Die Adresse: Die Kennung umbenannter Marken bleibt in der Datenbank fest.
      schluessel: (v) => v.slug,
      dbSchluessel: (doc) => (typeof doc.slug === 'string' ? doc.slug : undefined),
      zuDaten: (v) => m.fahrzeugmarkeZuPayload(v, gruppen),
      abgleich: [{ pfad: 'intro' }],
      // Datenmigration 20261025 „leitfaden_daten“.
      umbenannt: { koda: 'skoda' },
    });
    await eintraegeUebernehmen({
      name: 'codelinien',
      collection: 'produkte',
      inhalt: await quelle.read('codeLines'),
      startwert: 'codeLines',
      schluessel: (l) => l.id,
      dbSchluessel: kennung,
      zuDaten: m.codeLineZuPayload,
      where: { typ: { equals: 'code_key' } },
      abgleich: [
        { pfad: 'name' },
        { pfad: 'beschreibung' },
        { pfad: 'hersteller' },
        { pfad: 'profil' },
        { pfad: 'codeserie' },
        { pfad: 'einsatz' },
        { pfad: 'schluesseltyp' },
        { pfad: 'umfang' },
        { pfad: 'codeFormat' },
        { pfad: 'codeHinweis' },
        { pfad: 'fotoHinweis' },
        ...SEO_ABGLEICH,
      ],
    });
    await eintraegeUebernehmen({
      name: 'beispielartikel',
      collection: 'produkte',
      inhalt: await quelle.read('standardArticles'),
      startwert: 'standardArticles',
      schluessel: (a) => a.id,
      dbSchluessel: kennung,
      zuDaten: m.standardartikelZuPayload,
      where: { typ: { equals: 'standard' } },
      abgleich: [{ pfad: 'name' }, { pfad: 'beschreibung' }, { pfad: 'umfang' }, { pfad: 'lieferzeit' }, ...SEO_ABGLEICH],
    });
    await eintraegeUebernehmen({
      name: 'leistungsseiten',
      collection: 'leistungsseiten',
      inhalt: await quelle.read('servicePages'),
      startwert: 'servicePages',
      // Kennung statt Adresse: Gleiche Adressen gibt es in mehreren Bereichen.
      schluessel: (p) => p.id,
      dbSchluessel: kennung,
      zuDaten: m.leistungsseiteZuPayload,
      abgleich: [
        { pfad: 'titel' },
        { pfad: 'zusammenfassung' },
        { pfad: 'stichpunkte', spalten: ['text'] },
        { pfad: 'ctaHref' },
        { pfad: 'ctaLabel' },
        ...SEO_ABGLEICH,
      ],
    });
    await eintraegeUebernehmen({
      name: 'seiten',
      collection: 'seiten',
      inhalt: await quelle.read('pages'),
      startwert: 'pages',
      schluessel: (p) => p.route,
      dbSchluessel: (doc) => (typeof doc.route === 'string' ? doc.route : doc.route === null ? '' : undefined),
      zuDaten: m.seiteZuPayload,
      abgleich: [
        { pfad: 'headline' },
        { pfad: 'subline' },
        { pfad: 'intro' },
        { pfad: 'abschnitte', spalten: ['ueberschrift', 'text'] },
        { pfad: 'faq', spalten: ['frage', 'antwort'] },
        ...SEO_ABGLEICH,
      ],
    });
    await eintraegeUebernehmen({
      name: 'ratgeber',
      collection: 'ratgeber',
      inhalt: await quelle.read('guides'),
      startwert: 'guides',
      schluessel: (g) => g.id,
      dbSchluessel: kennung,
      zuDaten: m.ratgeberZuPayload,
      abgleich: [
        { pfad: 'titel' },
        { pfad: 'auszug' },
        { pfad: 'abschnitte', spalten: ['ueberschrift', 'text'] },
        { pfad: 'naechsterSchritt.href' },
        { pfad: 'naechsterSchritt.label' },
        ...SEO_ABGLEICH,
      ],
    });
    await eintraegeUebernehmen({
      name: 'einsatzgebiete',
      collection: 'einsatzgebiete',
      inhalt: await quelle.read('cities'),
      startwert: 'cities',
      schluessel: (c) => c.id,
      dbSchluessel: kennung,
      zuDaten: m.einsatzgebietZuPayload,
    });
    await eintraegeUebernehmen({
      name: 'sperrtage',
      collection: 'sperrtage',
      inhalt: await quelle.read('blockedDays'),
      startwert: 'blockedDays',
      schluessel: (d) => d.date,
      dbSchluessel: (doc) => (typeof doc.datum === 'string' ? m.zeitpunktZuTag(doc.datum) : undefined),
      zuDaten: m.sperrtagZuPayload,
    });
    await eintraegeUebernehmen({
      name: 'nachweise',
      collection: 'nachweise',
      inhalt: NACHWEISE,
      startwert: 'nachweise',
      schluessel: (n) => String(n.titel),
      dbSchluessel: (doc) => (typeof doc.titel === 'string' ? doc.titel : undefined),
      zuDaten: (n) => n,
    });
    await globalUebernehmen(
      'richtwerte',
      (d) => Boolean((d.tuerAbsicherung as { tuerarten?: unknown[] } | undefined)?.tuerarten?.length),
      async () => RICHTWERTE,
    );

    console.log('Fertig.');
  }

  await seed();
}

/**
 * Neue Felder schon übernommener Globals, die der Seed füllt, solange sie
 * leer sind. Gepflegte Werte bleiben unberührt.
 */
const GLOBAL_ERGAENZUNGEN = {
  einstellungen: ['buchung.erinnerungTageVorher'],
  zylinderkatalog: [] as string[],
  richtwerte: [] as string[],
} satisfies Record<'einstellungen' | 'zylinderkatalog' | 'richtwerte', string[]>;

/**
 * Nachweise, auf die sich Aussagen der Seite stützen. Der Betreiber hat die
 * Fachkunde für Flucht- und Rettungswegtechnik bestätigt; das Dokument muss
 * noch hinterlegt werden.
 */
const NACHWEISE: Record<string, unknown>[] = [
  {
    titel: 'Flucht- und Rettungswegtechnik nach DIN EN 179 und DIN EN 1125',
    art: 'norm',
    status: 'bereithalten',
    beschreibung:
      'Grundlage für die Aussage auf der Seite „Tür- und Schließtechnik“: Bearbeitung und '
      + 'Instandhaltung von Notausgangs- und Paniktürverschlüssen. Bitte Zertifikat oder '
      + 'Schulungsnachweis hochladen und den Status auf „Liegt vor“ setzen.',
    oeffentlich: false,
  },
];

/** Aufbau der Orientierungsrechner — Beträge trägt der Betreiber ein. */
const RICHTWERTE: Record<string, unknown> = {
  platzhalter: true,
  tuerAbsicherung: {
    tuerarten: [
      { kennung: 'wohnungstuer', label: 'Wohnungseingangstür', beschreibung: 'Tür im Mehrfamilienhaus' },
      { kennung: 'haustuer', label: 'Hauseingangstür', beschreibung: 'Außentür eines Hauses' },
      { kennung: 'nebentuer', label: 'Neben- oder Kellertür', beschreibung: 'Keller, Garage, Hintereingang' },
      { kennung: 'gewerbetuer', label: 'Tür im Gewerbe', beschreibung: 'Büro, Laden, Lager' },
    ],
    massnahmen: [
      { kennung: 'zylinder', label: 'Profilzylinder mit Kopierschutz', beschreibung: 'Schutz gegen Aufbohren und Ziehen' },
      { kennung: 'schutzbeschlag', label: 'Schutzbeschlag', beschreibung: 'deckt den Zylinder von außen ab' },
      { kennung: 'zusatzschloss', label: 'Tür-Zusatzschloss', beschreibung: 'zweiter Verschlusspunkt' },
      { kennung: 'mehrfachverriegelung', label: 'Mehrfachverriegelung', beschreibung: 'mehrere Riegel über die Türhöhe' },
      { kennung: 'querriegel', label: 'Querriegelschloss', beschreibung: 'Riegel über die ganze Türbreite' },
    ],
  },
  serviceEinsatz: {
    leistungen: [
      { kennung: 'wartung-anlage', label: 'Wartung einer Schließanlage', einheit: 'je-tuer', beschreibung: 'Zylinder prüfen und pflegen' },
      { kennung: 'tuerschliesser', label: 'Türschließer einstellen', einheit: 'je-tuer', beschreibung: 'Schließgeschwindigkeit und Endschlag' },
      { kennung: 'zylindertausch', label: 'Zylinder tauschen', einheit: 'je-tuer', beschreibung: 'ohne Material' },
      { kennung: 'beratung', label: 'Beratung vor Ort', einheit: 'pauschal', beschreibung: 'Begehung und Empfehlung' },
    ],
  },
};
