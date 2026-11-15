import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Datenmigration zur Arbeitsanweisung des Inhabers vom 11.11.2026 (FA-10-02, FA-11-02, A-046): Demo-Produkte
 * dürfen nicht live bleiben. Eine Datenbank, die vor dem 15.11.2026 gesät wurde, trägt die 52 Muster-Codelinien
 * ohne Beispiel-Haken. Diese Migration setzt den Haken, löscht nichts und fasst nur Einträge an, die noch
 * erkennbar Musterdaten sind: Schlüssel nach Code mit dem Platzhalter „[Hersteller eintragen]“. Ein Produkt, das
 * der Betrieb inzwischen mit einem echten Hersteller gepflegt hat, bleibt unberührt. Beispiele erscheinen nicht
 * auf der Seite und sind nicht bestellbar; im Admin bleiben sie sichtbar und lassen sich dort bearbeiten oder löschen.
 * Das Schema bleibt unverändert. Idempotent.
 */
const PLATZHALTER = '[Hersteller eintragen]'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "produkte" SET "beispiel" = true
    WHERE "typ" = 'code_key' AND "hersteller" = ${PLATZHALTER} AND ("beispiel" IS NULL OR "beispiel" = false);`)
  await db.execute(sql`
    UPDATE "_produkte_v" SET "version_beispiel" = true
    WHERE "latest" = true AND "version_typ" = 'code_key' AND "version_hersteller" = ${PLATZHALTER}
      AND ("version_beispiel" IS NULL OR "version_beispiel" = false);`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Kein Zurück: Welche Einträge vorher ohne Haken waren, ist nicht mehr bekannt, und Demo-Produkte sollen
  // nicht wieder erscheinen. Der Haken lässt sich im Admin je Produkt entfernen.
}
