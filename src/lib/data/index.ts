import 'server-only';

import { sql } from '@payloadcms/db-postgres';
import type { Payload, PayloadRequest, Where } from 'payload';
import { cache } from 'react';

import type { CollectionName, Collections, DataAdapter } from './adapter';
import { JsonFileAdapter } from './json-adapter';
import { PayloadAdapter, payloadInstanz } from './payload-adapter';
import { vorgangZuPayload, vorgangZuSeite } from './payload-mapping';
import { buildRecordId, buildReference, counterKey, nextSequenceFromExisting } from '@/lib/reference';
import type { RecordKind } from '@/lib/types';
import type { Vorgaenge } from '@/payload-types';

export type { CollectionName, Collections, DataAdapter };

/**
 * Aktive Datenschicht: Payload (Datenbank). Mit `SM24_DATA=json` liest die
 * Seite stattdessen die JSON-Dateien unter `content/` — nur für Notfälle und
 * Werkzeuge ohne Datenbank.
 */
const useJson = process.env.SM24_DATA === 'json';
const adapter: DataAdapter = useJson ? new JsonFileAdapter() : new PayloadAdapter();

/** Je Anfrage wird jede Sammlung höchstens einmal gelesen. */
const readCached = cache((name: CollectionName) => adapter.read(name));

export function getCollection<K extends CollectionName>(name: K): Promise<Collections[K]> {
  return readCached(name) as Promise<Collections[K]>;
}

/* ---------- Häufige Abfragen ------------------------------------------- */

export async function getSettings() {
  return getCollection('settings');
}

export async function getVehicleMakes() {
  return getCollection('vehicleMakes');
}

export async function getVehicleMake(slug: string) {
  const makes = await getVehicleMakes();
  return makes.find((m) => m.slug === slug) ?? null;
}

export async function getVehicleModel(makeSlug: string, modelSlug: string) {
  const make = await getVehicleMake(makeSlug);
  if (!make) return null;
  const model = make.models.find((m) => m.slug === modelSlug);
  return model ? { make, model } : null;
}

export async function getCodeLines(onlyActive = true) {
  const lines = await getCollection('codeLines');
  return onlyActive ? lines.filter((l) => l.active) : lines;
}

export async function getCodeLine(slug: string) {
  const lines = await getCollection('codeLines');
  return lines.find((l) => l.slug === slug) ?? null;
}

export async function getServicePages(area?: string) {
  const items = await getCollection('servicePages');
  const active = items.filter((s) => s.active);
  return area ? active.filter((s) => s.area === area) : active;
}

export async function getServicePage(area: string, slug: string) {
  const items = await getCollection('servicePages');
  return items.find((s) => s.area === area && s.slug === slug && s.active) ?? null;
}

export async function getGuides() {
  return getCollection('guides');
}

export async function getGuide(slug: string) {
  const items = await getGuides();
  return items.find((g) => g.slug === slug) ?? null;
}

export async function getCities() {
  return getCollection('cities');
}

export async function getCity(slug: string) {
  const items = await getCities();
  return items.find((c) => c.slug === slug) ?? null;
}

/**
 * Pflegbarer Seiteninhalt für eine Route.
 * `route` ohne führenden Slash, die Startseite ist der leere String.
 */
export async function getPageContent(route: string) {
  const items = await getCollection('pages');
  return items.find((p) => p.route === route) ?? null;
}

/* ---------- Vorgänge ----------------------------------------------------- */

type Vorgang = Collections['records'][number];

/** Ein neuer Vorgang, bevor Nummer und Kennung feststehen. */
export type NeuerVorgang = Omit<Vorgang, 'id' | 'reference' | 'kind'>;

/**
 * Prüfung des Wunschtermins innerhalb der Anlage. `istFrei` erhält die
 * frisch gelesenen, nicht stornierten Vorgänge dieses Tages.
 */
export interface TerminSperre {
  /** ISO-Datum des Termins. */
  datum: string;
  istFrei: (termineDesTages: Vorgang[]) => boolean;
}

export interface VorgangsAnlage {
  art: RecordKind;
  /** Jahr der Vorgangsnummer. */
  jahr: number;
  /** Baut den Vorgang, sobald seine Nummer feststeht. */
  aufbauen: (nummer: string) => NeuerVorgang;
  termin?: TerminSperre;
}

/** Der Wunschtermin wurde vergeben, während der Kunde gebucht hat. */
export class TerminVergebenFehler extends Error {
  constructor(datum: string) {
    super(`Das Zeitfenster am ${datum} ist bereits vergeben.`);
    this.name = 'TerminVergebenFehler';
  }
}

/**
 * Liest alle Vorgänge. Für Seiten und Prüfungen gibt es gezielte Abfragen
 * (`getRecord`, `getRecordByReference`, `getAppointments`).
 */
export async function getRecords() {
  return readRecordsFresh();
}

export async function getRecord(id: string): Promise<Vorgang | null> {
  if (useJson) {
    return (await readRecordsFresh()).find((r) => r.id === id) ?? null;
  }
  // Die Datenbank vergibt ganze Zahlen — alles andere kann kein Vorgang sein.
  if (!/^\d{1,15}$/.test(id)) return null;
  const payload = await payloadInstanz();
  const doc = (await payload.findByID({
    collection: 'vorgaenge',
    id: Number(id),
    depth: 0,
    overrideAccess: true,
    disableErrors: true,
  })) as Vorgaenge | null;
  return doc ? vorgangZuSeite(doc) : null;
}

export async function getRecordByReference(reference: string): Promise<Vorgang | null> {
  // Vorgangsnummern werden immer in Großbuchstaben vergeben.
  const nummer = reference.trim().toUpperCase();
  if (!nummer) return null;
  if (useJson) {
    return (await readRecordsFresh()).find((r) => r.reference.toUpperCase() === nummer) ?? null;
  }
  const [treffer] = await vorgaengeFinden(await payloadInstanz(), { nummer: { equals: nummer } });
  return treffer ?? null;
}

/** Nicht stornierte Vorgänge mit Termin zwischen `von` und `bis` (ISO-Daten, jeweils einschließlich). */
export async function getAppointments(von: string, bis: string): Promise<Vorgang[]> {
  if (useJson) {
    return (await readRecordsFresh()).filter((r) => hatTerminImZeitraum(r, von, bis));
  }
  return vorgaengeFinden(await payloadInstanz(), terminImZeitraum(von, bis));
}

/**
 * Legt einen Vorgang an — mit lückenloser Nummer und, falls gewünscht,
 * erneut geprüftem Termin.
 *
 * Zähler, Terminprüfung und Vorgang liegen in einer Transaktion: Scheitert
 * ein Schritt, wird alles zurückgerollt und keine Nummer verbraucht. Wer
 * denselben Tag bucht, wartet auf die Sperre des anderen und sieht danach
 * dessen Termin.
 */
export async function vorgangAnlegen(anlage: VorgangsAnlage): Promise<Vorgang> {
  if (useJson) return vorgangAnlegenOhneDatenbank(anlage);

  const payload = await payloadInstanz();
  return inTransaktion(payload, async ({ execute, req }) => {
    if (anlage.termin) {
      const { datum, istFrei } = anlage.termin;
      await execute(sql`SELECT pg_advisory_xact_lock(hashtext(${`sm24:termin:${datum}`}))`);
      const tag = await vorgaengeFinden(payload, terminImZeitraum(datum, datum), req());
      if (!istFrei(tag)) throw new TerminVergebenFehler(datum);
    }

    const { rows } = await execute(sql`
      INSERT INTO sm24_zaehler (schluessel, wert)
      VALUES (${counterKey(anlage.art, anlage.jahr)}, 1)
      ON CONFLICT (schluessel) DO UPDATE SET wert = sm24_zaehler.wert + 1
      RETURNING wert
    `);
    const wert = Number(rows[0]?.wert);
    if (!Number.isSafeInteger(wert) || wert < 1) {
      throw new Error('Der Nummernzähler hat keinen gültigen Wert geliefert.');
    }

    const nummer = buildReference(anlage.art, anlage.jahr, wert);
    // Die Kennung vergibt die Datenbank beim Einfügen.
    const record: Vorgang = { ...anlage.aufbauen(nummer), id: '', reference: nummer, kind: anlage.art };
    const doc = (await payload.create({
      collection: 'vorgaenge',
      data: vorgangZuPayload(record),
      overrideAccess: true,
      depth: 0,
      req: req(),
    })) as Vorgaenge;
    return vorgangZuSeite(doc);
  });
}

/**
 * Legt einen fertigen Vorgang ohne Nummernvergabe an.
 * @deprecated Nur für Übernahmen und Werkzeuge. Neue Vorgänge über `vorgangAnlegen`.
 */
export async function appendRecord(record: Vorgang) {
  if (useJson) {
    const items = await readRecordsFresh();
    await adapter.write('records', [record, ...items]);
    return record;
  }
  const payload = await payloadInstanz();
  const doc = (await payload.create({
    collection: 'vorgaenge',
    data: vorgangZuPayload(record),
    overrideAccess: true,
  })) as Vorgaenge;
  return vorgangZuSeite(doc);
}

export async function updateRecord(id: string, patch: Partial<Vorgang>) {
  if (useJson) {
    const items = await readRecordsFresh();
    const current = items.find((r) => r.id === id);
    if (!current) return null;
    const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
    await adapter.write('records', items.map((r) => (r.id === id ? next : r)));
    return next;
  }
  const current = await getRecord(id);
  if (!current) return null;
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  const payload = await payloadInstanz();
  const doc = (await payload.update({
    collection: 'vorgaenge',
    id: Number(id),
    data: vorgangZuPayload(next),
    overrideAccess: true,
    depth: 0,
  })) as Vorgaenge;
  return vorgangZuSeite(doc);
}

/**
 * Vermerkt am Vorgang die zugeordneten Kundendateien (Beziehung fürs Backend)
 * und die Upload-Angaben mit Kennung.
 */
export async function vorgangDateienSetzen(
  id: string,
  dateiIds: number[],
  uploads: Vorgang['uploads'],
): Promise<Vorgang | null> {
  if (useJson) return updateRecord(id, { uploads });
  if (!/^\d{1,15}$/.test(id)) return null;
  const payload = await payloadInstanz();
  const doc = (await payload.update({
    collection: 'vorgaenge',
    id: Number(id),
    data: { dateien: dateiIds, uploads: uploads as unknown as Record<string, unknown>[] },
    overrideAccess: true,
    depth: 0,
  })) as Vorgaenge;
  return vorgangZuSeite(doc);
}

/* ---------- Vorgänge: interne Helfer ------------------------------------- */

/**
 * Vorgänge werden nicht aus dem Zwischenspeicher gelesen: Terminbelegung und
 * Bestellstatus müssen immer aktuell sein.
 */
async function readRecordsFresh(): Promise<Collections['records']> {
  return adapter.read('records');
}

function terminImZeitraum(von: string, bis: string): Where {
  // ISO-Daten gleicher Länge sortieren als Text richtig.
  return {
    and: [
      { 'termin.datum': { greater_than_equal: von } },
      { 'termin.datum': { less_than_equal: bis } },
      { status: { not_equals: 'storniert' } },
    ],
  };
}

function hatTerminImZeitraum(record: Vorgang, von: string, bis: string): boolean {
  const datum = record.appointment?.date;
  return Boolean(datum && datum >= von && datum <= bis && record.status !== 'storniert');
}

async function vorgaengeFinden(
  payload: Payload,
  where: Where,
  req?: Partial<PayloadRequest>,
): Promise<Vorgang[]> {
  const result = await payload.find({
    collection: 'vorgaenge',
    where,
    sort: '-createdAt',
    depth: 0,
    pagination: false,
    overrideAccess: true,
    req,
  });
  return (result.docs as Vorgaenge[]).map(vorgangZuSeite);
}

/** Dateimodus: ohne Datenbank gibt es keine Transaktion — nur für Notfälle und Werkzeuge. */
async function vorgangAnlegenOhneDatenbank(anlage: VorgangsAnlage): Promise<Vorgang> {
  const items = await readRecordsFresh();
  if (anlage.termin) {
    const { datum, istFrei } = anlage.termin;
    if (!istFrei(items.filter((r) => hatTerminImZeitraum(r, datum, datum)))) {
      throw new TerminVergebenFehler(datum);
    }
  }
  const sequence = nextSequenceFromExisting(
    items.map((r) => r.reference),
    anlage.art,
    anlage.jahr,
  );
  const nummer = buildReference(anlage.art, anlage.jahr, sequence);
  const record: Vorgang = {
    ...anlage.aufbauen(nummer),
    id: buildRecordId(nummer),
    reference: nummer,
    kind: anlage.art,
  };
  await adapter.write('records', [record, ...items]);
  return record;
}

type Abfrage = ReturnType<typeof sql>;

interface Transaktion {
  execute: (abfrage: Abfrage) => Promise<{ rows: Record<string, unknown>[] }>;
  /** `req` für Aufrufe der Local API innerhalb dieser Transaktion. */
  req: () => Partial<PayloadRequest>;
}

interface Sitzungsregister {
  sessions?: Record<string, { db: { execute: Transaktion['execute'] } } | undefined>;
}

/** Commit bei Erfolg, sonst Rollback. */
async function inTransaktion<T>(payload: Payload, arbeit: (t: Transaktion) => Promise<T>): Promise<T> {
  const tid = await payload.db.beginTransaction();
  if (tid === null || tid === undefined) {
    throw new Error('Die Datenbank bietet keine Transaktionen an — Vorgänge werden so nicht angelegt.');
  }

  // Scheitert ein Aufruf der Local API, rollt Payload die Transaktion selbst
  // zurück. Jede weitere Abfrage liefe dann still außerhalb — daher vor jedem
  // Schritt prüfen, ob sie noch offen ist.
  const sitzung = () => {
    const offen = (payload.db as unknown as Sitzungsregister).sessions?.[String(tid)];
    if (!offen) throw new Error('Die Datenbanktransaktion ist bereits beendet.');
    return offen.db;
  };

  try {
    const ergebnis = await arbeit({
      execute: (abfrage) => sitzung().execute(abfrage),
      req: () => {
        sitzung();
        return { transactionID: tid };
      },
    });
    sitzung();
    await payload.db.commitTransaction(tid);
    return ergebnis;
  } catch (error) {
    await payload.db.rollbackTransaction(tid).catch(() => undefined);
    throw error;
  }
}
