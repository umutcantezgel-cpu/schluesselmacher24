import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_vorgaenge_storno_entscheidung" AS ENUM('ganz', 'teilweise', 'keine');
  CREATE TYPE "public"."enum_vorgaenge_erstattung_weg" AS ENUM('zahlungsdienst', 'ueberweisung', 'bar', 'sonstige');
  ALTER TYPE "public"."enum_vorgaenge_mails_art" ADD VALUE 'nachricht' BEFORE 'sonstige';
  CREATE TABLE "vorgaenge_korrekturen" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"betrag_cent" numeric NOT NULL,
  	"grund" varchar NOT NULL,
  	"am" timestamp(3) with time zone,
  	"von" varchar
  );
  
  ALTER TABLE "vorgaenge_mails" ADD COLUMN "betreff" varchar;
  ALTER TABLE "vorgaenge_mails" ADD COLUMN "text" varchar;
  ALTER TABLE "vorgaenge" ADD COLUMN "storno_entscheidung" "enum_vorgaenge_storno_entscheidung";
  ALTER TABLE "vorgaenge" ADD COLUMN "storno_grund" varchar;
  ALTER TABLE "vorgaenge" ADD COLUMN "storno_entschieden_am" timestamp(3) with time zone;
  ALTER TABLE "vorgaenge" ADD COLUMN "storno_entschieden_von" varchar;
  ALTER TABLE "vorgaenge" ADD COLUMN "erstattung_weg" "enum_vorgaenge_erstattung_weg";
  ALTER TABLE "vorgaenge" ADD COLUMN "erstattung_beleg" varchar;
  ALTER TABLE "vorgaenge" ADD COLUMN "erstattung_berichtigung_grund" varchar;
  ALTER TABLE "vorgaenge_korrekturen" ADD CONSTRAINT "vorgaenge_korrekturen_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vorgaenge"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "vorgaenge_korrekturen_order_idx" ON "vorgaenge_korrekturen" USING btree ("_order");
  CREATE INDEX "vorgaenge_korrekturen_parent_id_idx" ON "vorgaenge_korrekturen" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "vorgaenge_korrekturen" CASCADE;
  ALTER TABLE "vorgaenge_mails" ALTER COLUMN "art" SET DATA TYPE text;
  DROP TYPE "public"."enum_vorgaenge_mails_art";
  CREATE TYPE "public"."enum_vorgaenge_mails_art" AS ENUM('eingang-kunde', 'eingang-team', 'vertrag', 'zahlung-erhalten', 'zahlung-nicht-abgeschlossen', 'erstattung', 'status', 'widerruf', 'erinnerung', 'freigabe', 'team-hinweis', 'ausfuehrung', 'sonstige');
  ALTER TABLE "vorgaenge_mails" ALTER COLUMN "art" SET DATA TYPE "public"."enum_vorgaenge_mails_art" USING "art"::"public"."enum_vorgaenge_mails_art";
  ALTER TABLE "vorgaenge_mails" DROP COLUMN "betreff";
  ALTER TABLE "vorgaenge_mails" DROP COLUMN "text";
  ALTER TABLE "vorgaenge" DROP COLUMN "storno_entscheidung";
  ALTER TABLE "vorgaenge" DROP COLUMN "storno_grund";
  ALTER TABLE "vorgaenge" DROP COLUMN "storno_entschieden_am";
  ALTER TABLE "vorgaenge" DROP COLUMN "storno_entschieden_von";
  ALTER TABLE "vorgaenge" DROP COLUMN "erstattung_weg";
  ALTER TABLE "vorgaenge" DROP COLUMN "erstattung_beleg";
  ALTER TABLE "vorgaenge" DROP COLUMN "erstattung_berichtigung_grund";
  DROP TYPE "public"."enum_vorgaenge_storno_entscheidung";
  DROP TYPE "public"."enum_vorgaenge_erstattung_weg";`)
}
