import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { de } from '@payloadcms/translations/languages/de';
import { buildConfig } from 'payload';
import sharp from 'sharp';

import { AutoschluesselLeistungen } from './payload/collections/AutoschluesselLeistungen';
import { Benutzer } from './payload/collections/Benutzer';
import { Einsatzgebiete } from './payload/collections/Einsatzgebiete';
import { Fahrzeugmarken } from './payload/collections/Fahrzeugmarken';
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
import { Einstellungen } from './payload/globals/Einstellungen';
import { Richtwerte } from './payload/globals/Richtwerte';
import { Zylinderkatalog } from './payload/globals/Zylinderkatalog';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL?.trim() || 'http://localhost:3000';

// Ohne Geheimnis und Datenbank (z. B. erster Vercel-Build) läuft die Seite
// aus content/*.json; das Backend ist dann nicht nutzbar. Zufallswert statt
// eines festen Werts, damit niemand Anmeldungen fälschen kann.
const secret = process.env.PAYLOAD_SECRET || crypto.randomUUID() + crypto.randomUUID();
if (!process.env.PAYLOAD_SECRET) {
  console.warn('PAYLOAD_SECRET fehlt — Backend deaktiviert, Seite läuft aus content/*.json.');
}

export default buildConfig({
  serverURL,
  // Ohne diese Liste akzeptiert Payload Anmelde-Cookies von jeder Herkunft.
  csrf: [serverURL],
  secret,
  admin: {
    user: Benutzer.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' – SCHLÜSSELMACHER24 Backend' },
    components: {
      graphics: {
        Logo: '/payload/components/Marke#Logo',
        Icon: '/payload/components/Marke#Icon',
      },
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
    WebhookEreignisse,
  ],
  globals: [Zylinderkatalog, Richtwerte, Einstellungen],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
    // Schema nur über committete Migrationen — gleich lokal und bei Supabase.
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  graphQL: { disable: true },
});
