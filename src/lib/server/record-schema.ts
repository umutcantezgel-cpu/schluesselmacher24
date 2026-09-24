import 'server-only';

import { z } from 'zod';

import { KUNDENDATEI_ID_MUSTER, UPLOAD_KATEGORIEN, UPLOAD_TOKEN_MUSTER } from './datei-pruefung';

/* Prüfregeln für alles, was aus dem Browser in einen Vorgang gelangt. */

const text = (max: number) => z.string().trim().max(max);

export const AREA_KEYS = [
  'autoschluessel',
  'schluessel-nach-vorlage',
  'schluessel-nach-code',
  'gleichschliessende-zylinder',
  'schliessanlagen',
  'elektronische-zutrittsloesungen',
  'tuer-und-schliesstechnik',
  'sicherheitstechnik',
  'service-und-termin',
] as const;

export const contactSchema = z.object({
  salutation: text(40).optional(),
  firstName: text(120).min(1),
  lastName: text(120).min(1),
  company: text(200).optional(),
  email: z.string().trim().max(254).email(),
  phone: text(60),
  street: text(200).optional(),
  postalCode: text(20).optional(),
  city: text(120).optional(),
  country: text(80).min(1),
});

export const summarySchema = z
  .array(
    z.object({
      title: text(200),
      rows: z.array(z.object({ label: text(300), value: text(4000) })).max(120),
    }),
  )
  .max(40);

export const uploadMetaSchema = z
  .array(
    z.object({
      fileName: text(255).min(1),
      sizeBytes: z.number().int().min(0).max(30 * 1024 * 1024),
      mimeType: text(120),
      category: z.enum(UPLOAD_KATEGORIEN),
      // Nur zusammen gültig: Kennung der Kundendatei und der Schlüssel aus dem Upload.
      // Ob beides zusammenpasst, prüft erst die Zuordnung zum Vorgang.
      storageKey: z.string().regex(KUNDENDATEI_ID_MUSTER).optional(),
      uploadToken: z.string().regex(UPLOAD_TOKEN_MUSTER).optional(),
    }),
  )
  .max(30);

/** Freie Formulardaten: beliebige Struktur, aber begrenzte Größe. */
export const payloadSchema = z
  .record(z.string(), z.unknown())
  .refine((value) => JSON.stringify(value).length <= 100_000, 'Die Angaben sind zu umfangreich.');

export const carKeyVerifySchema = z.object({
  kind: z.literal('autoschluessel'),
  makeSlug: text(80).min(1),
  modelSlug: text(80).nullish(),
  serviceId: text(80).min(1),
  keyKind: z.enum(['mechanisch', 'funk', 'klappschluessel', 'smart-key', 'keyless']),
  workingKeys: z.number().int().min(0).max(20),
});

export const requestedAppointmentSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
});

/** Eingabe der öffentlichen Aktion `submitRecord`. */
export const publicRecordSchema = z.object({
  kind: z.enum(['anfrage', 'termin', 'projekt', 'bestellung']),
  area: z.enum(AREA_KEYS),
  process: z.enum(['direktkauf', 'gefuehrte-anfrage', 'projektkonfigurator', 'termin-mit-anzahlung']),
  contact: contactSchema,
  payload: payloadSchema,
  summary: summarySchema,
  uploads: uploadMetaSchema,
  // Aus dem Browser nur als Wunsch; Preis, Anzahlung und Termin setzt der Server.
  appointment: requestedAppointmentSchema.passthrough().optional(),
  payment: z.object({ description: text(200).optional() }).passthrough().optional(),
  quote: z.unknown().optional(),
  verify: carKeyVerifySchema.optional(),
});

export type PublicRecordInput = z.infer<typeof publicRecordSchema>;
