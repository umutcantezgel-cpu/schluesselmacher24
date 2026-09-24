import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres';

/**
 * Eigene Tabellen neben Payload:
 * - sm24_zaehler: lückenlose Vorgangsnummern je Art und Jahr (in derselben
 *   Transaktion wie der Vorgang hochgezählt — ein Abbruch vergibt keine Nummer)
 * - sm24_ratenbegrenzung: Anfragen je Absender und Zeitfenster, auch über
 *   mehrere Server-Instanzen hinweg
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "sm24_zaehler" (
      "schluessel" text PRIMARY KEY,
      "wert" integer NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS "sm24_ratenbegrenzung" (
      "schluessel" text PRIMARY KEY,
      "fenster_start" timestamp(3) with time zone NOT NULL,
      "anzahl" integer NOT NULL
    );
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "sm24_ratenbegrenzung";
    DROP TABLE IF EXISTS "sm24_zaehler";
  `);
}
