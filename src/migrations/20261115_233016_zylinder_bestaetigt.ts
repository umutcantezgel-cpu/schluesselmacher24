import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_hersteller_bereiche_art" AS ENUM('sperrschliessung', 'zutritt');
  CREATE TYPE "public"."enum__hersteller_v_version_bereiche_art" AS ENUM('sperrschliessung', 'zutritt');
  CREATE TABLE "hersteller_bereiche" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"art" "enum_hersteller_bereiche_art" NOT NULL,
  	"einsatz" varchar NOT NULL
  );
  
  CREATE TABLE "_hersteller_v_version_bereiche" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"art" "enum__hersteller_v_version_bereiche_art" NOT NULL,
  	"einsatz" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  ALTER TABLE "zylinderkatalog_hersteller" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "zylinderkatalog_hersteller" ALTER COLUMN "kennung" DROP NOT NULL;
  ALTER TABLE "zylinderkatalog_bauformen" ADD COLUMN "preis_nicht_bestaetigt" boolean DEFAULT false;
  ALTER TABLE "zylinderkatalog_funktionen" ADD COLUMN "preis_nicht_bestaetigt" boolean DEFAULT false;
  ALTER TABLE "zylinderkatalog_extras" ADD COLUMN "preis_nicht_bestaetigt" boolean DEFAULT false;
  ALTER TABLE "zylinderkatalog_hersteller" ADD COLUMN "stamm_id" integer;
  ALTER TABLE "zylinderkatalog_hersteller" ADD COLUMN "preis_nicht_bestaetigt" boolean DEFAULT false;
  ALTER TABLE "zylinderkatalog" ADD COLUMN "schluessel_preis_nicht_bestaetigt" boolean DEFAULT false;
  ALTER TABLE "hersteller_bereiche" ADD CONSTRAINT "hersteller_bereiche_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hersteller"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hersteller_v_version_bereiche" ADD CONSTRAINT "_hersteller_v_version_bereiche_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_hersteller_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "hersteller_bereiche_order_idx" ON "hersteller_bereiche" USING btree ("_order");
  CREATE INDEX "hersteller_bereiche_parent_id_idx" ON "hersteller_bereiche" USING btree ("_parent_id");
  CREATE INDEX "_hersteller_v_version_bereiche_order_idx" ON "_hersteller_v_version_bereiche" USING btree ("_order");
  CREATE INDEX "_hersteller_v_version_bereiche_parent_id_idx" ON "_hersteller_v_version_bereiche" USING btree ("_parent_id");
  ALTER TABLE "zylinderkatalog_hersteller" ADD CONSTRAINT "zylinderkatalog_hersteller_stamm_id_hersteller_id_fk" FOREIGN KEY ("stamm_id") REFERENCES "public"."hersteller"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "zylinderkatalog_hersteller_stamm_idx" ON "zylinderkatalog_hersteller" USING btree ("stamm_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hersteller_bereiche" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hersteller_v_version_bereiche" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "hersteller_bereiche" CASCADE;
  DROP TABLE "_hersteller_v_version_bereiche" CASCADE;
  ALTER TABLE "zylinderkatalog_hersteller" DROP CONSTRAINT "zylinderkatalog_hersteller_stamm_id_hersteller_id_fk";
  
  DROP INDEX "zylinderkatalog_hersteller_stamm_idx";
  ALTER TABLE "zylinderkatalog_hersteller" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "zylinderkatalog_hersteller" ALTER COLUMN "kennung" SET NOT NULL;
  ALTER TABLE "zylinderkatalog_bauformen" DROP COLUMN "preis_nicht_bestaetigt";
  ALTER TABLE "zylinderkatalog_funktionen" DROP COLUMN "preis_nicht_bestaetigt";
  ALTER TABLE "zylinderkatalog_extras" DROP COLUMN "preis_nicht_bestaetigt";
  ALTER TABLE "zylinderkatalog_hersteller" DROP COLUMN "stamm_id";
  ALTER TABLE "zylinderkatalog_hersteller" DROP COLUMN "preis_nicht_bestaetigt";
  ALTER TABLE "zylinderkatalog" DROP COLUMN "schluessel_preis_nicht_bestaetigt";
  DROP TYPE "public"."enum_hersteller_bereiche_art";
  DROP TYPE "public"."enum__hersteller_v_version_bereiche_art";`)
}
