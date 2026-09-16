'use server';

import { revalidatePath } from 'next/cache';

import { dataAdapter, getCollection, saveCollection, updateRecord } from '@/lib/data';
import type { CollectionName, Collections } from '@/lib/data';
import type { BlockedDay, RecordStatus } from '@/lib/types';

export interface SaveResult {
  ok: boolean;
  message: string;
}

const READONLY_HINT =
  'Die Inhalte sind auf dieser Umgebung schreibgeschützt. Für den laufenden Betrieb muss '
  + 'in src/lib/data/index.ts ein Datenbank-Adapter hinterlegt werden.';

/** Speichert eine komplette Sammlung. Wird vom Backend verwendet. */
export async function saveContent<K extends CollectionName>(
  name: K,
  value: Collections[K],
): Promise<SaveResult> {
  if (!dataAdapter().writable) {
    return { ok: false, message: READONLY_HINT };
  }

  try {
    await saveCollection(name, value);
    revalidatePath('/', 'layout');
    return { ok: true, message: 'Gespeichert.' };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Speichern fehlgeschlagen.',
    };
  }
}

/* ---------- Preise, Anzahlung, Vorlauf, Terminlänge ---------------------- */

export interface BookingDefaultsInput {
  leadTimeDays: number;
  depositCents: number;
  depositMinCents: number;
  depositMaxCents: number;
  slotMinutes: number;
  bookingHorizonDays: number;
  slotsPerWindow: number;
}

export async function saveBookingDefaults(input: BookingDefaultsInput): Promise<SaveResult> {
  const settings = await getCollection('settings');
  return saveContent('settings', {
    ...settings,
    booking: { ...settings.booking, ...input },
    updatedAt: new Date().toISOString(),
  });
}

export interface PricingRuleInput {
  id: string;
  mode: 'fest' | 'rahmen' | 'pruefung';
  priceCents?: number;
  priceFromCents?: number;
  priceToCents?: number;
  depositCents?: number;
  slotMinutes?: number;
  leadTimeDays?: number;
  note?: string;
}

export async function savePricingRule(input: PricingRuleInput): Promise<SaveResult> {
  const rules = await getCollection('pricingRules');
  const next = rules.map((rule) => (rule.id === input.id ? { ...rule, ...input } : rule));
  return saveContent('pricingRules', next);
}

/* ---------- Produkte ----------------------------------------------------- */

export interface CodeLineInput {
  id: string;
  name?: string;
  manufacturer?: string;
  application?: string;
  keyType?: string;
  description?: string;
  codeFormatLabel?: string;
  codePattern?: string;
  codeExample?: string;
  codeHint?: string;
  priceCents?: number;
  scope?: string;
  maxQty?: number;
  photoUpload?: 'nein' | 'optional' | 'pflicht';
  active?: boolean;
}

export async function saveCodeLine(input: CodeLineInput): Promise<SaveResult> {
  const lines = await getCollection('codeLines');
  const next = lines.map((line) => (line.id === input.id ? { ...line, ...input } : line));
  return saveContent('codeLines', next);
}

/* ---------- Termine und Sperrtage --------------------------------------- */

export async function addBlockedDay(day: Omit<BlockedDay, 'id'>): Promise<SaveResult> {
  const days = await getCollection('blockedDays');
  const id = `sperre-${day.date}-${days.length + 1}`;
  return saveContent('blockedDays', [...days, { ...day, id }]);
}

export async function removeBlockedDay(id: string): Promise<SaveResult> {
  const days = await getCollection('blockedDays');
  return saveContent(
    'blockedDays',
    days.filter((d) => d.id !== id),
  );
}

/* ---------- Vorgänge ----------------------------------------------------- */

export async function setRecordStatus(
  id: string,
  status: RecordStatus,
  note?: string,
): Promise<SaveResult> {
  if (!dataAdapter().writable) {
    return { ok: false, message: READONLY_HINT };
  }

  const record = await updateRecord(id, { status });
  if (!record) return { ok: false, message: 'Vorgang nicht gefunden.' };

  const entry = {
    at: new Date().toISOString(),
    actor: 'team' as const,
    message: note ? `Status: ${status} — ${note}` : `Status auf „${status}“ gesetzt.`,
  };
  await updateRecord(id, { timeline: [...record.timeline, entry] });

  revalidatePath('/admin/vorgaenge');
  revalidatePath(`/admin/vorgaenge/${id}`);
  return { ok: true, message: 'Status aktualisiert.' };
}

export async function addInternalNote(id: string, message: string): Promise<SaveResult> {
  if (!dataAdapter().writable) {
    return { ok: false, message: READONLY_HINT };
  }

  const records = await getCollection('records');
  const record = records.find((r) => r.id === id);
  if (!record) return { ok: false, message: 'Vorgang nicht gefunden.' };

  const entry = { at: new Date().toISOString(), actor: 'team' as const, message };
  await updateRecord(id, { internalNotes: [...record.internalNotes, entry] });

  revalidatePath(`/admin/vorgaenge/${id}`);
  return { ok: true, message: 'Notiz gespeichert.' };
}

export async function setPaymentPaid(id: string): Promise<SaveResult> {
  if (!dataAdapter().writable) {
    return { ok: false, message: READONLY_HINT };
  }

  const records = await getCollection('records');
  const record = records.find((r) => r.id === id);
  if (!record?.payment) return { ok: false, message: 'Für diesen Vorgang ist keine Zahlung vorgesehen.' };

  await updateRecord(id, {
    payment: { ...record.payment, status: 'bezahlt', paidAt: new Date().toISOString() },
    timeline: [
      ...record.timeline,
      { at: new Date().toISOString(), actor: 'team' as const, message: 'Zahlungseingang manuell bestätigt.' },
    ],
  });

  revalidatePath(`/admin/vorgaenge/${id}`);
  return { ok: true, message: 'Zahlung als eingegangen vermerkt.' };
}
