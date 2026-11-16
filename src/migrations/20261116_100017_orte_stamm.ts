import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_orte_art" AS ENUM('markt', 'kreisfreie-stadt', 'stadtkreis', 'stadt', 'gemeinde', 'grosse-kreisstadt');
  CREATE TABLE "orte" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"bezeichnung" varchar,
  	"art" "enum_orte_art" NOT NULL,
  	"gemeindeschluessel" varchar NOT NULL,
  	"regionalschluessel" varchar,
  	"slug" varchar,
  	"kreis_schluessel" varchar,
  	"kreis_name" varchar,
  	"land_schluessel" varchar,
  	"land" varchar,
  	"plz_verwaltungssitz" varchar,
  	"einwohner" numeric,
  	"aktiv" boolean DEFAULT true,
  	"postleitzahlen" varchar,
  	"breite" numeric,
  	"laenge" numeric,
  	"stand" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "orte_id" integer;
  CREATE INDEX "orte_name_idx" ON "orte" USING btree ("name");
  CREATE UNIQUE INDEX "orte_gemeindeschluessel_idx" ON "orte" USING btree ("gemeindeschluessel");
  CREATE INDEX "orte_slug_idx" ON "orte" USING btree ("slug");
  CREATE INDEX "orte_kreis_schluessel_idx" ON "orte" USING btree ("kreis_schluessel");
  CREATE INDEX "orte_plz_verwaltungssitz_idx" ON "orte" USING btree ("plz_verwaltungssitz");
  CREATE INDEX "orte_updated_at_idx" ON "orte" USING btree ("updated_at");
  CREATE INDEX "orte_created_at_idx" ON "orte" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orte_fk" FOREIGN KEY ("orte_id") REFERENCES "public"."orte"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_orte_id_idx" ON "payload_locked_documents_rels" USING btree ("orte_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_orte_fk";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_orte_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "orte_id";
  ALTER TABLE "orte" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "orte" CASCADE;
  DROP TYPE "public"."enum_orte_art";`)
}
