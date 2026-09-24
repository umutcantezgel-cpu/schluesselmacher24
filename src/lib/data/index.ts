import 'server-only';

import { cache } from 'react';

import type { CollectionName, Collections, DataAdapter } from './adapter';
import { JsonFileAdapter } from './json-adapter';
import { PayloadAdapter, payloadInstanz } from './payload-adapter';
import { vorgangZuPayload, vorgangZuSeite } from './payload-mapping';
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

export async function getRecords() {
  return readRecordsFresh();
}

export async function getRecord(id: string) {
  const items = await getRecords();
  return items.find((r) => r.id === id) ?? null;
}

export async function getRecordByReference(reference: string) {
  const items = await getRecords();
  return items.find((r) => r.reference.toLowerCase() === reference.toLowerCase()) ?? null;
}

/**
 * Vorgänge werden nicht aus dem Zwischenspeicher gelesen: Terminbelegung und
 * Bestellstatus müssen immer aktuell sein.
 */
async function readRecordsFresh(): Promise<Collections['records']> {
  return adapter.read('records');
}

export async function appendRecord(record: Collections['records'][number]) {
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

export async function updateRecord(
  id: string,
  patch: Partial<Collections['records'][number]>,
) {
  const items = await readRecordsFresh();
  const current = items.find((r) => r.id === id);
  if (!current) return null;
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  if (useJson) {
    await adapter.write('records', items.map((r) => (r.id === id ? next : r)));
    return next;
  }
  const payload = await payloadInstanz();
  const doc = (await payload.update({
    collection: 'vorgaenge',
    id: Number(id),
    data: vorgangZuPayload(next),
    overrideAccess: true,
  })) as Vorgaenge;
  return vorgangZuSeite(doc);
}
