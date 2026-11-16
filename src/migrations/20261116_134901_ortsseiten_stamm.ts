import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "einsatzgebiete_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"partnerbetriebe_id" integer
  );
  
  CREATE TABLE "_einsatzgebiete_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"partnerbetriebe_id" integer
  );
  
  ALTER TABLE "einsatzgebiete" ADD COLUMN "gemeindeschluessel" varchar;
  ALTER TABLE "einsatzgebiete" ADD COLUMN "prioritaet" numeric;
  ALTER TABLE "einsatzgebiete" ADD COLUMN "stufe_anhang_a" boolean DEFAULT false;
  ALTER TABLE "einsatzgebiete" ADD COLUMN "suchvolumen" numeric;
  ALTER TABLE "einsatzgebiete" ADD COLUMN "fahrzeit_minuten" numeric;
  ALTER TABLE "einsatzgebiete" ADD COLUMN "verfuegbarkeit" varchar;
  ALTER TABLE "_einsatzgebiete_v" ADD COLUMN "version_gemeindeschluessel" varchar;
  ALTER TABLE "_einsatzgebiete_v" ADD COLUMN "version_prioritaet" numeric;
  ALTER TABLE "_einsatzgebiete_v" ADD COLUMN "version_stufe_anhang_a" boolean DEFAULT false;
  ALTER TABLE "_einsatzgebiete_v" ADD COLUMN "version_suchvolumen" numeric;
  ALTER TABLE "_einsatzgebiete_v" ADD COLUMN "version_fahrzeit_minuten" numeric;
  ALTER TABLE "_einsatzgebiete_v" ADD COLUMN "version_verfuegbarkeit" varchar;
  ALTER TABLE "einsatzgebiete_rels" ADD CONSTRAINT "einsatzgebiete_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."einsatzgebiete"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "einsatzgebiete_rels" ADD CONSTRAINT "einsatzgebiete_rels_partnerbetriebe_fk" FOREIGN KEY ("partnerbetriebe_id") REFERENCES "public"."partnerbetriebe"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_einsatzgebiete_v_rels" ADD CONSTRAINT "_einsatzgebiete_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_einsatzgebiete_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_einsatzgebiete_v_rels" ADD CONSTRAINT "_einsatzgebiete_v_rels_partnerbetriebe_fk" FOREIGN KEY ("partnerbetriebe_id") REFERENCES "public"."partnerbetriebe"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "einsatzgebiete_rels_order_idx" ON "einsatzgebiete_rels" USING btree ("order");
  CREATE INDEX "einsatzgebiete_rels_parent_idx" ON "einsatzgebiete_rels" USING btree ("parent_id");
  CREATE INDEX "einsatzgebiete_rels_path_idx" ON "einsatzgebiete_rels" USING btree ("path");
  CREATE INDEX "einsatzgebiete_rels_partnerbetriebe_id_idx" ON "einsatzgebiete_rels" USING btree ("partnerbetriebe_id");
  CREATE INDEX "_einsatzgebiete_v_rels_order_idx" ON "_einsatzgebiete_v_rels" USING btree ("order");
  CREATE INDEX "_einsatzgebiete_v_rels_parent_idx" ON "_einsatzgebiete_v_rels" USING btree ("parent_id");
  CREATE INDEX "_einsatzgebiete_v_rels_path_idx" ON "_einsatzgebiete_v_rels" USING btree ("path");
  CREATE INDEX "_einsatzgebiete_v_rels_partnerbetriebe_id_idx" ON "_einsatzgebiete_v_rels" USING btree ("partnerbetriebe_id");
  CREATE UNIQUE INDEX "einsatzgebiete_gemeindeschluessel_idx" ON "einsatzgebiete" USING btree ("gemeindeschluessel");
  CREATE INDEX "_einsatzgebiete_v_version_version_gemeindeschluessel_idx" ON "_einsatzgebiete_v" USING btree ("version_gemeindeschluessel");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Reihenfolge wie bei orte_stamm: zuerst Fremdschlüssel, Indizes und Spalten (IF EXISTS), dann die Tabellen.
  await db.execute(sql`
   ALTER TABLE "einsatzgebiete_rels" DROP CONSTRAINT IF EXISTS "einsatzgebiete_rels_partnerbetriebe_fk";
  ALTER TABLE "einsatzgebiete_rels" DROP CONSTRAINT IF EXISTS "einsatzgebiete_rels_parent_fk";
  ALTER TABLE "_einsatzgebiete_v_rels" DROP CONSTRAINT IF EXISTS "_einsatzgebiete_v_rels_partnerbetriebe_fk";
  ALTER TABLE "_einsatzgebiete_v_rels" DROP CONSTRAINT IF EXISTS "_einsatzgebiete_v_rels_parent_fk";
  DROP INDEX IF EXISTS "einsatzgebiete_gemeindeschluessel_idx";
  DROP INDEX IF EXISTS "_einsatzgebiete_v_version_version_gemeindeschluessel_idx";
  ALTER TABLE "einsatzgebiete" DROP COLUMN IF EXISTS "gemeindeschluessel";
  ALTER TABLE "einsatzgebiete" DROP COLUMN IF EXISTS "prioritaet";
  ALTER TABLE "einsatzgebiete" DROP COLUMN IF EXISTS "stufe_anhang_a";
  ALTER TABLE "einsatzgebiete" DROP COLUMN IF EXISTS "suchvolumen";
  ALTER TABLE "einsatzgebiete" DROP COLUMN IF EXISTS "fahrzeit_minuten";
  ALTER TABLE "einsatzgebiete" DROP COLUMN IF EXISTS "verfuegbarkeit";
  ALTER TABLE "_einsatzgebiete_v" DROP COLUMN IF EXISTS "version_gemeindeschluessel";
  ALTER TABLE "_einsatzgebiete_v" DROP COLUMN IF EXISTS "version_prioritaet";
  ALTER TABLE "_einsatzgebiete_v" DROP COLUMN IF EXISTS "version_stufe_anhang_a";
  ALTER TABLE "_einsatzgebiete_v" DROP COLUMN IF EXISTS "version_suchvolumen";
  ALTER TABLE "_einsatzgebiete_v" DROP COLUMN IF EXISTS "version_fahrzeit_minuten";
  ALTER TABLE "_einsatzgebiete_v" DROP COLUMN IF EXISTS "version_verfuegbarkeit";
  DROP TABLE IF EXISTS "einsatzgebiete_rels" CASCADE;
  DROP TABLE IF EXISTS "_einsatzgebiete_v_rels" CASCADE;`)
}
