import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Steckplätze der Kundendateien (FA-KERN-02, A-048). Additiv (G6): neue, freiwillige Spalte „steckplatz“
 * ohne Standardwert. Vorhandene Dateien bleiben gültig und haben keinen Steckplatz. Nichts wird gelöscht
 * oder umbenannt.
 */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_kundendateien_steckplatz" AS ENUM('fahrzeugschein', 'schluessel-vorderseite', 'schluessel-rueckseite', 'schluessel-spitze', 'ersatznachweis', 'typenschild', 'sicherungskarte', 'sonstiges');
  ALTER TABLE "kundendateien" ADD COLUMN "steckplatz" "enum_kundendateien_steckplatz";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "kundendateien" DROP COLUMN "steckplatz";
  DROP TYPE "public"."enum_kundendateien_steckplatz";`)
}
