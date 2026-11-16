import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_partnerbetriebe_geraete_art" AS ENUM('fraesmaschine', 'programmiergeraet', 'diagnose');
  CREATE TYPE "public"."enum_partnerbetriebe_werkstatt_vorhanden" AS ENUM('ja', 'nein');
  ALTER TYPE "public"."enum_vorgaenge_vermittlung_auftragsart" ADD VALUE 'schluessel-nachmachen' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_vorgaenge_vermittlung_auftragsart" ADD VALUE 'programmierung-anlernen' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_vorgaenge_vermittlung_auftragsart" ADD VALUE 'schluesselverlust' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_vorgaenge_vermittlung_auftragsart" ADD VALUE 'keyless-smart-key' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_vorgaenge_vermittlung_auftragsart" ADD VALUE 'transponder' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_vorgaenge_vermittlung_auftragsart" ADD VALUE 'funk' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_vorgaenge_vermittlung_auftragsart" ADD VALUE 'fahrzeugoeffnung' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_vorgaenge_vermittlung_auftragsart" ADD VALUE 'reparatur-gehaeuse' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_vorgaenge_vermittlung_auftragsart" ADD VALUE 'motorrad-weitere' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_partnerbetriebe_auftragsarten" ADD VALUE 'schluessel-nachmachen' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_partnerbetriebe_auftragsarten" ADD VALUE 'programmierung-anlernen' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_partnerbetriebe_auftragsarten" ADD VALUE 'schluesselverlust' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_partnerbetriebe_auftragsarten" ADD VALUE 'keyless-smart-key' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_partnerbetriebe_auftragsarten" ADD VALUE 'transponder' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_partnerbetriebe_auftragsarten" ADD VALUE 'funk' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_partnerbetriebe_auftragsarten" ADD VALUE 'fahrzeugoeffnung' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_partnerbetriebe_auftragsarten" ADD VALUE 'reparatur-gehaeuse' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_partnerbetriebe_auftragsarten" ADD VALUE 'motorrad-weitere' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_partnerbetriebe_provisionen_auftragsart" ADD VALUE 'schluessel-nachmachen' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_partnerbetriebe_provisionen_auftragsart" ADD VALUE 'programmierung-anlernen' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_partnerbetriebe_provisionen_auftragsart" ADD VALUE 'schluesselverlust' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_partnerbetriebe_provisionen_auftragsart" ADD VALUE 'keyless-smart-key' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_partnerbetriebe_provisionen_auftragsart" ADD VALUE 'transponder' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_partnerbetriebe_provisionen_auftragsart" ADD VALUE 'funk' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_partnerbetriebe_provisionen_auftragsart" ADD VALUE 'fahrzeugoeffnung' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_partnerbetriebe_provisionen_auftragsart" ADD VALUE 'reparatur-gehaeuse' BEFORE 'autoschluessel-vor-ort';
  ALTER TYPE "public"."enum_partnerbetriebe_provisionen_auftragsart" ADD VALUE 'motorrad-weitere' BEFORE 'autoschluessel-vor-ort';
  CREATE TABLE "partnerbetriebe_geraete" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"art" "enum_partnerbetriebe_geraete_art" NOT NULL,
  	"hersteller" varchar,
  	"typ" varchar
  );
  
  ALTER TABLE "partnerbetriebe" ADD COLUMN "plz" varchar;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "werkstatt_vorhanden" "enum_partnerbetriebe_werkstatt_vorhanden";
  ALTER TABLE "partnerbetriebe" ADD COLUMN "werkstatt_mobil" boolean;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "werkstatt_anschrift" varchar;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "erfahrung_jahre" numeric;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "erfahrung_schwerpunkte" varchar;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "erfahrung_fahrzeugabdeckung" varchar;
  ALTER TABLE "partnerbetriebe_geraete" ADD CONSTRAINT "partnerbetriebe_geraete_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partnerbetriebe"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "partnerbetriebe_geraete_order_idx" ON "partnerbetriebe_geraete" USING btree ("_order");
  CREATE INDEX "partnerbetriebe_geraete_parent_id_idx" ON "partnerbetriebe_geraete" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "partnerbetriebe_geraete" CASCADE;
  ALTER TABLE "vorgaenge" ALTER COLUMN "vermittlung_auftragsart" SET DATA TYPE text;
  DROP TYPE "public"."enum_vorgaenge_vermittlung_auftragsart";
  CREATE TYPE "public"."enum_vorgaenge_vermittlung_auftragsart" AS ENUM('autoschluessel-vor-ort', 'schluesseldienst-vor-ort', 'montage-zylinder', 'montage-schliessanlage', 'beratung-vor-ort', 'einbau-elektronik');
  ALTER TABLE "vorgaenge" ALTER COLUMN "vermittlung_auftragsart" SET DATA TYPE "public"."enum_vorgaenge_vermittlung_auftragsart" USING "vermittlung_auftragsart"::"public"."enum_vorgaenge_vermittlung_auftragsart";
  ALTER TABLE "partnerbetriebe_auftragsarten" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_partnerbetriebe_auftragsarten";
  CREATE TYPE "public"."enum_partnerbetriebe_auftragsarten" AS ENUM('autoschluessel-vor-ort', 'schluesseldienst-vor-ort', 'montage-zylinder', 'montage-schliessanlage', 'beratung-vor-ort', 'einbau-elektronik');
  ALTER TABLE "partnerbetriebe_auftragsarten" ALTER COLUMN "value" SET DATA TYPE "public"."enum_partnerbetriebe_auftragsarten" USING "value"::"public"."enum_partnerbetriebe_auftragsarten";
  ALTER TABLE "partnerbetriebe_provisionen" ALTER COLUMN "auftragsart" SET DATA TYPE text;
  DROP TYPE "public"."enum_partnerbetriebe_provisionen_auftragsart";
  CREATE TYPE "public"."enum_partnerbetriebe_provisionen_auftragsart" AS ENUM('autoschluessel-vor-ort', 'schluesseldienst-vor-ort', 'montage-zylinder', 'montage-schliessanlage', 'beratung-vor-ort', 'einbau-elektronik');
  ALTER TABLE "partnerbetriebe_provisionen" ALTER COLUMN "auftragsart" SET DATA TYPE "public"."enum_partnerbetriebe_provisionen_auftragsart" USING "auftragsart"::"public"."enum_partnerbetriebe_provisionen_auftragsart";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "plz";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "werkstatt_vorhanden";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "werkstatt_mobil";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "werkstatt_anschrift";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "erfahrung_jahre";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "erfahrung_schwerpunkte";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "erfahrung_fahrzeugabdeckung";
  DROP TYPE "public"."enum_partnerbetriebe_geraete_art";
  DROP TYPE "public"."enum_partnerbetriebe_werkstatt_vorhanden";`)
}
