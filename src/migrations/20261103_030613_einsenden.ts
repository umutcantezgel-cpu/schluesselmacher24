import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "einstellungen" ADD COLUMN "einsenden_label_aktiv" boolean DEFAULT false;
  ALTER TABLE "einstellungen" ADD COLUMN "einsenden_aufpreis_versichert" numeric DEFAULT 0;
  ALTER TABLE "einstellungen" ADD COLUMN "einsenden_aufpreis_unversichert" numeric DEFAULT 0;
  ALTER TABLE "einstellungen" ADD COLUMN "einsenden_porto_versichert" numeric DEFAULT 4.45;
  ALTER TABLE "einstellungen" ADD COLUMN "einsenden_porto_unversichert" numeric DEFAULT 1.8;
  ALTER TABLE "einstellungen" ADD COLUMN "einsenden_haftung_versichert" numeric DEFAULT 25;
  ALTER TABLE "einstellungen" ADD COLUMN "einsenden_porto_stand" varchar DEFAULT 'Deutsche Post, Preise ab 1.1.2026: Einschreiben 4,45 €, Großbrief 1,80 €';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "einstellungen" DROP COLUMN "einsenden_label_aktiv";
  ALTER TABLE "einstellungen" DROP COLUMN "einsenden_aufpreis_versichert";
  ALTER TABLE "einstellungen" DROP COLUMN "einsenden_aufpreis_unversichert";
  ALTER TABLE "einstellungen" DROP COLUMN "einsenden_porto_versichert";
  ALTER TABLE "einstellungen" DROP COLUMN "einsenden_porto_unversichert";
  ALTER TABLE "einstellungen" DROP COLUMN "einsenden_haftung_versichert";
  ALTER TABLE "einstellungen" DROP COLUMN "einsenden_porto_stand";`)
}
