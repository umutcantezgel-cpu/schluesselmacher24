import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_vorgaenge_auftragsweg" AS ENUM('hauptzentrale', 'eigenbereich', 'partner');
  CREATE TYPE "public"."enum_vorgaenge_restzahlung_rest_zahlart" AS ENUM('bar', 'karte', 'ueberweisung');
  ALTER TABLE "vorgaenge" ADD COLUMN "auftragsweg" "enum_vorgaenge_auftragsweg";
  ALTER TABLE "vorgaenge" ADD COLUMN "auftragsweg_grund" varchar;
  ALTER TABLE "vorgaenge" ADD COLUMN "vermittlung_partnerbetrieb_id" integer;
  ALTER TABLE "vorgaenge" ADD COLUMN "restzahlung_gesamtpreis_cent" numeric;
  ALTER TABLE "vorgaenge" ADD COLUMN "restzahlung_rest_cent" numeric;
  ALTER TABLE "vorgaenge" ADD COLUMN "restzahlung_rest_bezahlt_am" timestamp(3) with time zone;
  ALTER TABLE "vorgaenge" ADD COLUMN "restzahlung_rest_zahlart" "enum_vorgaenge_restzahlung_rest_zahlart";
  ALTER TABLE "einstellungen" ADD COLUMN "buchung_eigenbereich_bezeichnung" varchar DEFAULT 'Wetzlar und Umgebung';
  ALTER TABLE "einstellungen" ADD COLUMN "buchung_eigenbereich_postleitzahlen" varchar DEFAULT '35*';
  ALTER TABLE "vorgaenge" ADD CONSTRAINT "vorgaenge_vermittlung_partnerbetrieb_id_partnerbetriebe_id_fk" FOREIGN KEY ("vermittlung_partnerbetrieb_id") REFERENCES "public"."partnerbetriebe"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "vorgaenge_auftragsweg_idx" ON "vorgaenge" USING btree ("auftragsweg");
  CREATE INDEX "vorgaenge_vermittlung_vermittlung_partnerbetrieb_idx" ON "vorgaenge" USING btree ("vermittlung_partnerbetrieb_id");
  CREATE INDEX "vorgaenge_restzahlung_restzahlung_rest_cent_idx" ON "vorgaenge" USING btree ("restzahlung_rest_cent");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "vorgaenge" DROP CONSTRAINT "vorgaenge_vermittlung_partnerbetrieb_id_partnerbetriebe_id_fk";
  
  DROP INDEX "vorgaenge_auftragsweg_idx";
  DROP INDEX "vorgaenge_vermittlung_vermittlung_partnerbetrieb_idx";
  DROP INDEX "vorgaenge_restzahlung_restzahlung_rest_cent_idx";
  ALTER TABLE "vorgaenge" DROP COLUMN "auftragsweg";
  ALTER TABLE "vorgaenge" DROP COLUMN "auftragsweg_grund";
  ALTER TABLE "vorgaenge" DROP COLUMN "vermittlung_partnerbetrieb_id";
  ALTER TABLE "vorgaenge" DROP COLUMN "restzahlung_gesamtpreis_cent";
  ALTER TABLE "vorgaenge" DROP COLUMN "restzahlung_rest_cent";
  ALTER TABLE "vorgaenge" DROP COLUMN "restzahlung_rest_bezahlt_am";
  ALTER TABLE "vorgaenge" DROP COLUMN "restzahlung_rest_zahlart";
  ALTER TABLE "einstellungen" DROP COLUMN "buchung_eigenbereich_bezeichnung";
  ALTER TABLE "einstellungen" DROP COLUMN "buchung_eigenbereich_postleitzahlen";
  DROP TYPE "public"."enum_vorgaenge_auftragsweg";
  DROP TYPE "public"."enum_vorgaenge_restzahlung_rest_zahlart";`)
}
