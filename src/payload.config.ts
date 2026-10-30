import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { resendAdapter } from '@payloadcms/email-resend';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import { de } from '@payloadcms/translations/languages/de';
import { buildConfig } from 'payload';
import sharp from 'sharp';

import { dateiablage, mailKonfiguration } from './lib/umgebung';
import { csrfHerkuenfte, payloadGeheimnis, payloadServerUrl, poolKonfiguration } from './payload/betrieb';
import { AutoschluesselLeistungen } from './payload/collections/AutoschluesselLeistungen';
import { Benutzer } from './payload/collections/Benutzer';
import { Einsatzgebiete } from './payload/collections/Einsatzgebiete';
import { Fahrzeugmarken } from './payload/collections/Fahrzeugmarken';
import { InterneDateien } from './payload/collections/InterneDateien';
import { Kundendateien } from './payload/collections/Kundendateien';
import { Leistungsseiten } from './payload/collections/Leistungsseiten';
import { Medien } from './payload/collections/Medien';
import { Nachweise } from './payload/collections/Nachweise';
import { Preisgruppen } from './payload/collections/Preisgruppen';
import { Preisregeln } from './payload/collections/Preisregeln';
import { Produkte } from './payload/collections/Produkte';
import { Ratgeber } from './payload/collections/Ratgeber';
import { Seiten } from './payload/collections/Seiten';
import { Sperrtage } from './payload/collections/Sperrtage';
import { Vorgaenge } from './payload/collections/Vorgaenge';
import { WebhookEreignisse } from './payload/collections/WebhookEreignisse';
import { Widerrufe } from './payload/collections/Widerrufe';
import { Einstellungen } from './payload/globals/Einstellungen';
import { Richtwerte } from './payload/globals/Richtwerte';
import { Zylinderkatalog } from './payload/globals/Zylinderkatalog';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const ablage = dateiablage();
const mail = mailKonfiguration();

// Server-Adresse, CSRF-Liste, Geheimnis und Pool: src/payload/betrieb.ts
// (dort auch, warum die Server-Adresse in Vorschauen leer bleibt).
const serverURL = payloadServerUrl();

export default buildConfig({
  serverURL,
  // Ohne diese Liste akzeptiert Payload Anmelde-Cookies von jeder Herkunft.
  csrf: csrfHerkuenfte(),
  // In Produktion mit Datenbank Pflicht — sonst bricht der Start hier mit klarer Meldung ab.
  secret: payloadGeheimnis(),
  admin: {
    user: Benutzer.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' – SCHLÜSSELMACHER24 Backend' },
    components: {
      graphics: {
        Logo: '/payload/components/Marke#Logo',
        Icon: '/payload/components/Marke#Icon',
      },
      // Kennzahlen aus den Vorgängen (Erg. Leitfaden §4), nur für das Team.
      beforeDashboard: ['/payload/components/Kennzahlen#Kennzahlen'],
    },
    theme: 'light',
  },
  i18n: {
    supportedLanguages: { de },
    fallbackLanguage: 'de',
  },
  collections: [
    // Aufträge
    Vorgaenge,
    Kundendateien,
    Widerrufe,
    // Shop
    Produkte,
    // Autoschlüssel
    Fahrzeugmarken,
    AutoschluesselLeistungen,
    Preisregeln,
    Preisgruppen,
    // Termine
    Sperrtage,
    // Inhalte
    Seiten,
    Leistungsseiten,
    Ratgeber,
    Einsatzgebiete,
    Nachweise,
    Medien,
    // Verwaltung
    Benutzer,
    InterneDateien,
    WebhookEreignisse,
  ],
  globals: [Zylinderkatalog, Richtwerte, Einstellungen],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: poolKonfiguration(),
    // Payloads createDatabase() verbände ohne CA und sslmode, also unverschlüsselt;
    // die Datenbank gibt es ohnehin immer (Supabase, scripts/db.mjs).
    disableCreateDatabase: true,
    // Schema nur über committete Migrationen — gleich lokal und bei Supabase.
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  // Passwort vergessen und Einladungen. Ohne vollständige Resend-Angaben
  // schreibt Payload Mails nur ins Protokoll.
  ...(mail
    ? {
        email: resendAdapter({
          apiKey: mail.apiKey,
          defaultFromAddress: mail.fromAddress,
          defaultFromName: mail.fromName,
          overrideRecipientAddress: mail.redirectTo,
        }),
      }
    : {}),
  plugins: [
    // Privater Bucket: Payload liefert jede Datei selbst aus und prüft dabei
    // `access.read` der Sammlung. Deshalb kein `acl` und nie
    // `disablePayloadAccessControl`. `alwaysInsertFields` hält das Schema
    // gleich, ob mit oder ohne Bucket (sonst fehlten die Spalten `prefix`
    // und `_object_key` je nach Umgebung in den Migrationen).
    s3Storage({
      enabled: ablage !== null,
      alwaysInsertFields: true,
      collections: {
        medien: { prefix: 'medien' },
        kundendateien: { prefix: 'kundendateien' },
        'interne-dateien': { prefix: 'intern' },
      },
      bucket: ablage?.bucket ?? '',
      config: ablage
        ? {
            endpoint: ablage.endpoint,
            region: ablage.region,
            // S3-kompatible Anbieter (Supabase, R2) erwarten den Bucket im Pfad.
            forcePathStyle: Boolean(ablage.endpoint),
            // Neuere AWS-SDKs senden sonst Prüfsummen-Trailer, die S3-kompatible
            // Anbieter (Supabase, R2) nicht immer annehmen.
            requestChecksumCalculation: 'WHEN_REQUIRED',
            responseChecksumValidation: 'WHEN_REQUIRED',
            credentials: { accessKeyId: ablage.accessKeyId, secretAccessKey: ablage.secretAccessKey },
          }
        : {},
    }),
  ],
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  graphQL: { disable: true },
});
