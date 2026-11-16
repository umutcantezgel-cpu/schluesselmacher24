import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_vorgaenge_einsende_sendung_dienstleister" AS ENUM('dhl', 'dpd', 'deutsche-post', 'hermes', 'gls', 'ups', 'sonstige');
  CREATE TYPE "public"."enum_vorgaenge_einsende_sendung_variante" AS ENUM('dhl-paket', 'einschreiben-einwurf', 'einschreiben-wert');
  CREATE TYPE "public"."enum_vorgaenge_einsende_sendung_eingetragen_von" AS ENUM('kunde', 'team');
  ALTER TABLE "vorgaenge" ADD COLUMN "einsende_sendung_sendungsnummer" varchar;
  ALTER TABLE "vorgaenge" ADD COLUMN "einsende_sendung_dienstleister" "enum_vorgaenge_einsende_sendung_dienstleister";
  ALTER TABLE "vorgaenge" ADD COLUMN "einsende_sendung_variante" "enum_vorgaenge_einsende_sendung_variante";
  ALTER TABLE "vorgaenge" ADD COLUMN "einsende_sendung_eingetragen_am" timestamp(3) with time zone;
  ALTER TABLE "vorgaenge" ADD COLUMN "einsende_sendung_eingetragen_von" "enum_vorgaenge_einsende_sendung_eingetragen_von";
  ALTER TABLE "vorgaenge" ADD COLUMN "einsende_sendung_label_datei_id" integer;
  ALTER TABLE "vorgaenge" ADD CONSTRAINT "vorgaenge_einsende_sendung_label_datei_id_interne_dateien_id_fk" FOREIGN KEY ("einsende_sendung_label_datei_id") REFERENCES "public"."interne_dateien"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "vorgaenge_einsende_sendung_einsende_sendung_label_datei_idx" ON "vorgaenge" USING btree ("einsende_sendung_label_datei_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "vorgaenge" DROP CONSTRAINT "vorgaenge_einsende_sendung_label_datei_id_interne_dateien_id_fk";
  
  DROP INDEX "vorgaenge_einsende_sendung_einsende_sendung_label_datei_idx";
  ALTER TABLE "vorgaenge" DROP COLUMN "einsende_sendung_sendungsnummer";
  ALTER TABLE "vorgaenge" DROP COLUMN "einsende_sendung_dienstleister";
  ALTER TABLE "vorgaenge" DROP COLUMN "einsende_sendung_variante";
  ALTER TABLE "vorgaenge" DROP COLUMN "einsende_sendung_eingetragen_am";
  ALTER TABLE "vorgaenge" DROP COLUMN "einsende_sendung_eingetragen_von";
  ALTER TABLE "vorgaenge" DROP COLUMN "einsende_sendung_label_datei_id";
  DROP TYPE "public"."enum_vorgaenge_einsende_sendung_dienstleister";
  DROP TYPE "public"."enum_vorgaenge_einsende_sendung_variante";
  DROP TYPE "public"."enum_vorgaenge_einsende_sendung_eingetragen_von";`)
}
