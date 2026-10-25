import 'server-only';

import { sql } from '@payloadcms/db-postgres';
import type { Payload, PayloadRequest, Where } from 'payload';
import { cache } from 'react';

import type { CollectionName, Collections, DataAdapter } from './adapter';
import { JsonFileAdapter } from './json-adapter';
import { PayloadAdapter, payloadInstanz } from './payload-adapter';
import {
  vorgangAenderungZuPayload,
  vorgangZuPayload,
  vorgangZuSeite,
  type VorgangsAenderung,
} from './payload-mapping';
import { buildRecordId, buildReference, counterKey, nextSequenceFromExisting } from '@/lib/reference';
import type { AppointmentInfo, RecordKind } from '@/lib/types';
import { mitDatenbank } from '@/lib/umgebung';
import type { Vorgaenge } from '@/payload-types';

export type { CollectionName, Collections, DataAdapter, VorgangsAenderung };

/**
 * Aktive Datenschicht: Payload (Datenbank). Mit `SM24_DATA=json` liest die
 * Seite stattdessen die JSON-Dateien unter `content/` — nur für Notfälle und
 * Werkzeuge ohne Datenbank.
 */
const useJson = !mitDatenbank();
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
  /**
   * Höchstzahl offener, unbezahlter Termine je E-Mail-Adresse (Schutz gegen
   * Kalenderblockaden). Gezählt werden nicht stornierte, nicht
   * abgeschlossene Termine ab `abDatum`, deren Zahlung offen oder
   * fehlgeschlagen ist.
   */
  kunde?: { email: string; hoechstensOffen: number; abDatum: string };
}

export interface VorgangsAnlage {
  art: RecordKind;
  /** Jahr der Vorgangsnummer. */
  jahr: number;
  /** Baut den Vorgang, sobald seine Nummer feststeht. */
  aufbauen: (nummer: string) => NeuerVorgang;
  termin?: TerminSperre;
}

/** Zu dieser E-Mail-Adresse sind schon zu viele Termine ohne Zahlung offen. */
export class ZuVieleOffeneTermineFehler extends Error {
  constructor() {
    super('Zu dieser E-Mail-Adresse sind bereits mehrere unbezahlte Termine offen.');
    this.name = 'ZuVieleOffeneTermineFehler';
  }
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
      const { datum, istFrei, kunde } = anlage.termin;
      if (kunde) {
        // Reihenfolge der Sperren: erst Kunde, dann Tag — überall gleich, sonst droht eine Verklemmung.
        const email = kunde.email.trim().toLowerCase();
        await execute(sql`SELECT pg_advisory_xact_lock(hashtext(${`sm24:termin-kunde:${email}`}))`);
        const { rows } = await execute(sql`
          SELECT count(*)::int AS anzahl FROM vorgaenge
          WHERE art = 'termin'
            AND lower(kontakt_email) = ${email}
            AND status NOT IN ('storniert', 'abgeschlossen')
            AND zahlung_status IN ('offen', 'fehlgeschlagen')
            AND termin_datum >= ${kunde.abDatum}
        `);
        if (Number(rows[0]?.anzahl ?? 0) >= kunde.hoechstensOffen) throw new ZuVieleOffeneTermineFehler();
      }
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

/**
 * Schreibt den ganzen Vorgang zurück (gelesen, ergänzt, gespeichert — ohne
 * Sperre). Ändert in der Zwischenzeit ein Webhook oder das Team den Vorgang,
 * geht dessen Änderung verloren.
 * @deprecated Nur noch für bestehende Aufrufer. Neue Änderungen über `vorgangAendern`.
 */
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

/**
 * Ändert einen Vorgang gezielt und ohne verlorene Änderungen.
 *
 * `aendern` erhält den frisch gelesenen Vorgang und liefert nur die Gruppen,
 * die sich ändern (z. B. `{ timeline: [...v.timeline, eintrag] }`), oder
 * `null` für „nichts zu tun“. Mit Datenbank liegt alles in einer Transaktion:
 * Die Zeile bleibt bis zum Ende gesperrt (`FOR UPDATE`), parallele Aufrufe
 * warten und sehen danach den neuen Stand. Geschrieben werden nur die
 * geänderten Gruppen — Dateien, Mailprotokoll und alles andere bleiben, wie
 * sie sind.
 *
 * Liefert den Vorgang nach der Änderung, unverändert bei `null` aus
 * `aendern`, und `null`, wenn es den Vorgang nicht gibt.
 */
export async function vorgangAendern(
  id: string,
  aendern: (vorgang: Vorgang) => VorgangsAenderung | null,
): Promise<Vorgang | null> {
  if (useJson) {
    // Dateimodus: ohne Datenbank gibt es keine Sperre — nur für Notfälle und Werkzeuge.
    const items = await readRecordsFresh();
    const current = items.find((r) => r.id === id);
    if (!current) return null;
    const aenderung = aendern(current);
    if (!aenderung) return current;
    const next: Vorgang = { ...current, ...aenderung, updatedAt: new Date().toISOString() };
    await adapter.write('records', items.map((r) => (r.id === id ? next : r)));
    return next;
  }
  if (!/^\d{1,15}$/.test(id)) return null;
  const payload = await payloadInstanz();
  return inTransaktion(payload, async (t) => {
    const vorgang = await vorgangSperren(payload, t, { vorgangId: id });
    if (!vorgang) return null;
    const aenderung = aendern(vorgang);
    return aenderung ? aenderungSchreiben(payload, t, vorgang, aenderung) : vorgang;
  });
}

/* ---------- Termin verschieben ------------------------------------------- */

export interface TerminVerschiebung {
  vorgangId: string;
  /** Neuer Termin (Datum, Uhrzeit, Dauer, Ort). */
  neu: AppointmentInfo;
  /**
   * Prüft unter der Sperre des neuen Tages: `termineDesTages` sind die frisch
   * gelesenen, nicht stornierten Vorgänge dieses Tages (der eigene kann darunter
   * sein — die Prüfung nimmt ihn selbst aus).
   */
  istFrei: (termineDesTages: Vorgang[], vorgang: Vorgang) => boolean;
  /** Weitere Änderungen am gesperrten Vorgang (Status, Verlauf, Notiz). */
  aendern: (vorgang: Vorgang) => Omit<VorgangsAenderung, 'appointment'>;
}

/**
 * Verschiebt einen Termin unter derselben Tagessperre wie `vorgangAnlegen`:
 * erst der neue Tag (Advisory-Lock), dann die Zeile des Vorgangs. Wer
 * gleichzeitig denselben Tag bucht, wartet und sieht danach den neuen Termin.
 * Liefert den geänderten Vorgang, `null` ohne Vorgang; wirft
 * `TerminVergebenFehler`, wenn das Zeitfenster nicht frei ist.
 */
export async function terminVerschieben(verschiebung: TerminVerschiebung): Promise<Vorgang | null> {
  const { vorgangId, neu, istFrei, aendern } = verschiebung;
  if (useJson) {
    const items = await readRecordsFresh();
    const current = items.find((r) => r.id === vorgangId);
    if (!current) return null;
    if (!istFrei(items.filter((r) => hatTerminImZeitraum(r, neu.date, neu.date)), current)) {
      throw new TerminVergebenFehler(neu.date);
    }
    const next: Vorgang = { ...current, ...aendern(current), appointment: neu, updatedAt: new Date().toISOString() };
    await adapter.write('records', items.map((r) => (r.id === vorgangId ? next : r)));
    return next;
  }
  if (!/^\d{1,15}$/.test(vorgangId)) return null;
  const payload = await payloadInstanz();
  return inTransaktion(payload, async (t) => {
    await t.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${`sm24:termin:${neu.date}`}))`);
    const vorgang = await vorgangSperren(payload, t, { vorgangId });
    if (!vorgang) return null;
    const tag = await vorgaengeFinden(payload, terminImZeitraum(neu.date, neu.date), t.req());
    if (!istFrei(tag, vorgang)) throw new TerminVergebenFehler(neu.date);
    return aenderungSchreiben(payload, t, vorgang, { ...aendern(vorgang), appointment: neu });
  });
}

/* ---------- Zahlungsereignisse ------------------------------------------ */

/** Woran ein Zahlungsereignis seinen Vorgang erkennt — in dieser Reihenfolge. */
export interface ZahlungsVerweis {
  vorgangId?: string;
  checkoutSitzung?: string;
  anbieterRef?: string;
}

export interface Zahlungsereignis<E extends string = string> {
  /** Kennung beim Anbieter (Stripe: `evt_…`) — jedes Ereignis zählt nur einmal. */
  ereignisId: string;
  /** Art des Ereignisses, z. B. `checkout.session.completed`. */
  typ: string;
  anbieter?: string;
  finde: ZahlungsVerweis;
  /**
   * Leitet aus dem frisch gelesenen, gesperrten Vorgang die Änderung ab.
   * `ergebnis` landet in der Ereigniszeile. `null`: Ereignis ohne Wirkung.
   */
  anwenden: (vorgang: Vorgang) => { aenderung: VorgangsAenderung | null; ergebnis: E } | null;
}

export type ZahlungsVerbuchung<E extends string = string> =
  /** Ereignis war schon verbucht (oder wird es gerade) — nichts geändert. */
  | { ergebnis: 'doppelt' }
  /** Kein passender Vorgang; das Ereignis ist trotzdem vermerkt. */
  | { ergebnis: 'kein-vorgang' }
  /** `anwenden` lieferte `null`. */
  | { ergebnis: 'ignoriert'; vorgang: Vorgang }
  | { ergebnis: E; vorgang: Vorgang };

/**
 * Verbucht ein Zahlungsereignis genau einmal.
 *
 * Alles in einer Transaktion: Ereignis eintragen (`ON CONFLICT DO NOTHING` —
 * eine Wiederholung derselben Kennung wartet auf die erste und ist dann
 * „doppelt“), Vorgang sperren und frisch lesen, Änderung anwenden und
 * schreiben, Ergebnis und Vorgang in der Ereigniszeile vermerken. Scheitert
 * ein Schritt, wird alles zurückgerollt und der Fehler geworfen — der
 * Anbieter stellt das Ereignis dann erneut zu.
 */
export async function zahlungsereignisVerbuchen<E extends string>(
  ereignis: Zahlungsereignis<E>,
): Promise<ZahlungsVerbuchung<E>> {
  if (useJson) {
    throw new Error('Zahlungsereignisse werden nur mit Datenbank verbucht.');
  }
  const payload = await payloadInstanz();
  return inTransaktion(payload, async (t): Promise<ZahlungsVerbuchung<E>> => {
    const { rows } = await t.execute(sql`
      INSERT INTO webhook_ereignisse (ereignis_id, anbieter, typ)
      VALUES (${ereignis.ereignisId}, ${ereignis.anbieter ?? 'stripe'}, ${ereignis.typ})
      ON CONFLICT (ereignis_id) DO NOTHING
      RETURNING id
    `);
    if (rows.length === 0) return { ergebnis: 'doppelt' };
    const zeile = Number(rows[0].id);

    const vermerken = (ergebnis: string, vorgangId: string | null) =>
      t.execute(sql`
        UPDATE webhook_ereignisse
        SET ergebnis = ${ergebnis}, vorgang_id = ${vorgangId === null ? null : Number(vorgangId)}, updated_at = now()
        WHERE id = ${zeile}
      `);

    const vorgang = await vorgangSperren(payload, t, ereignis.finde);
    if (!vorgang) {
      await vermerken('kein-vorgang', null);
      return { ergebnis: 'kein-vorgang' };
    }

    const wirkung = ereignis.anwenden(vorgang);
    if (!wirkung) {
      await vermerken('ignoriert', vorgang.id);
      return { ergebnis: 'ignoriert', vorgang };
    }
    const neu = wirkung.aenderung ? await aenderungSchreiben(payload, t, vorgang, wirkung.aenderung) : vorgang;
    await vermerken(wirkung.ergebnis, vorgang.id);
    return { ergebnis: wirkung.ergebnis, vorgang: neu };
  });
}

/**
 * Vorgang zu einer Checkout-Sitzung oder Zahlungskennung — ohne Sperre, etwa
 * für die Rückkehr von der Zahlungsseite.
 */
export async function findeVorgangFuerZahlung(
  verweis: Pick<ZahlungsVerweis, 'checkoutSitzung' | 'anbieterRef'>,
): Promise<Vorgang | null> {
  const { checkoutSitzung, anbieterRef } = verweis;
  if (!checkoutSitzung && !anbieterRef) return null;
  if (useJson) {
    const items = await readRecordsFresh();
    return (
      items.find((r) =>
        checkoutSitzung
          ? r.payment?.checkoutSessionId === checkoutSitzung
          : r.payment?.providerRef === anbieterRef,
      ) ?? null
    );
  }
  const where: Where = checkoutSitzung
    ? { 'zahlung.checkoutSitzung': { equals: checkoutSitzung } }
    : { 'zahlung.anbieterRef': { equals: anbieterRef } };
  const [treffer] = await vorgaengeFinden(await payloadInstanz(), where);
  return treffer ?? null;
}

/* ---------- Vorgänge: interne Helfer ------------------------------------- */

/**
 * Sperrt den Vorgang bis zum Ende der Transaktion und liest ihn danach frisch
 * (nach der Sperre — so ist eine eben bestätigte Änderung schon sichtbar).
 */
async function vorgangSperren(
  payload: Payload,
  t: Transaktion,
  verweis: ZahlungsVerweis,
): Promise<Vorgang | null> {
  let abfrage: Abfrage | null = null;
  if (verweis.vorgangId) {
    if (!/^\d{1,15}$/.test(verweis.vorgangId)) return null;
    abfrage = sql`SELECT id FROM vorgaenge WHERE id = ${Number(verweis.vorgangId)} FOR UPDATE`;
  } else if (verweis.checkoutSitzung) {
    abfrage = sql`SELECT id FROM vorgaenge WHERE zahlung_checkout_sitzung = ${verweis.checkoutSitzung} ORDER BY id LIMIT 1 FOR UPDATE`;
  } else if (verweis.anbieterRef) {
    abfrage = sql`SELECT id FROM vorgaenge WHERE zahlung_anbieter_ref = ${verweis.anbieterRef} ORDER BY id LIMIT 1 FOR UPDATE`;
  }
  if (!abfrage) return null;
  const { rows } = await t.execute(abfrage);
  if (rows.length === 0) return null;
  const doc = (await payload.findByID({
    collection: 'vorgaenge',
    id: Number(rows[0].id),
    depth: 0,
    overrideAccess: true,
    req: t.req(),
  })) as Vorgaenge;
  return vorgangZuSeite(doc);
}

/** Schreibt nur die geänderten Gruppen des gesperrten Vorgangs. */
async function aenderungSchreiben(
  payload: Payload,
  t: Transaktion,
  vorgang: Vorgang,
  aenderung: VorgangsAenderung,
): Promise<Vorgang> {
  const data = vorgangAenderungZuPayload(aenderung);
  if (Object.keys(data).length === 0) return vorgang;
  const doc = (await payload.update({
    collection: 'vorgaenge',
    id: Number(vorgang.id),
    data,
    overrideAccess: true,
    depth: 0,
    req: t.req(),
  })) as Vorgaenge;
  return vorgangZuSeite(doc);
}

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

/** Dateimodus: offene, unbezahlte Termine einer E-Mail-Adresse (wie die Abfrage in `vorgangAnlegen`). */
function offeneTermine(items: Vorgang[], email: string, abDatum: string): number {
  const adresse = email.trim().toLowerCase();
  return items.filter(
    (r) =>
      r.kind === 'termin'
      && r.contact.email.trim().toLowerCase() === adresse
      && r.status !== 'storniert'
      && r.status !== 'abgeschlossen'
      && (r.payment?.status === 'offen' || r.payment?.status === 'fehlgeschlagen')
      && (r.appointment?.date ?? '') >= abDatum,
  ).length;
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
    const { datum, istFrei, kunde } = anlage.termin;
    if (kunde && offeneTermine(items, kunde.email, kunde.abDatum) >= kunde.hoechstensOffen) {
      throw new ZuVieleOffeneTermineFehler();
    }
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
