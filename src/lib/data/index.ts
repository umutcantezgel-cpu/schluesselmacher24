import 'server-only';

import type { CollectionName, Collections, DataAdapter } from './adapter';
import { JsonFileAdapter } from './json-adapter';

export type { CollectionName, Collections, DataAdapter };

/**
 * Aktive Datenschicht.
 *
 * Austausch gegen eine Datenbank: hier eine andere Umsetzung des
 * `DataAdapter`-Interfaces einsetzen. Alle Aufrufer bleiben unverändert.
 */
const adapter: DataAdapter = new JsonFileAdapter();

export function dataAdapter(): DataAdapter {
  return adapter;
}

/**
 * Ob Inhalte auf dieser Umgebung gespeichert werden können.
 * Das Backend warnt damit vorab, statt erst beim ersten Speicherversuch.
 */
export async function contentWritable(): Promise<{ writable: boolean; adapter: string }> {
  return { writable: adapter.writable, adapter: adapter.name };
}

export function getCollection<K extends CollectionName>(name: K): Promise<Collections[K]> {
  return adapter.read(name);
}

export function saveCollection<K extends CollectionName>(
  name: K,
  value: Collections[K],
): Promise<void> {
  return adapter.write(name, value);
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
  return getCollection('records');
}

export async function getRecord(id: string) {
  const items = await getRecords();
  return items.find((r) => r.id === id) ?? null;
}

export async function getRecordByReference(reference: string) {
  const items = await getRecords();
  return items.find((r) => r.reference.toLowerCase() === reference.toLowerCase()) ?? null;
}

export async function appendRecord(record: Collections['records'][number]) {
  const items = await getRecords();
  await saveCollection('records', [record, ...items]);
  return record;
}

export async function updateRecord(
  id: string,
  patch: Partial<Collections['records'][number]>,
) {
  const items = await getRecords();
  const next = items.map((r) => (r.id === id ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r));
  await saveCollection('records', next);
  return next.find((r) => r.id === id) ?? null;
}
