import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_fahrzeugreihen_leistungen" AS ENUM('nachmachen', 'programmieren', 'gehaeuse-tausch', 'transponder-kopie');
  CREATE TYPE "public"."enum_fahrzeugreihen_klonbar" AS ENUM('unbekannt', 'bestaetigt', 'nein');
  CREATE TYPE "public"."enum_fahrzeugreihen_gehaeuse" AS ENUM('unbekannt', 'verfuegbar', 'nicht-verfuegbar');
  CREATE TABLE "fahrzeugreihen_leistungen" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_fahrzeugreihen_leistungen",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "fahrzeugreihen_alias" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"begriff" varchar NOT NULL
  );
  
  CREATE TABLE "fahrzeugreihen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"marke" varchar NOT NULL,
  	"reihe" varchar NOT NULL,
  	"kba_name" varchar,
  	"bestand" numeric,
  	"rang" numeric,
  	"segment" varchar,
  	"sichtbar" boolean DEFAULT true,
  	"quelle" varchar NOT NULL,
  	"bestands_modell" varchar,
  	"baujahr_von" numeric,
  	"baujahr_bis" numeric,
  	"baujahr_quelle" varchar,
  	"transponder_typ" varchar,
  	"transponder_quelle" varchar,
  	"klonbar" "enum_fahrzeugreihen_klonbar" DEFAULT 'unbekannt' NOT NULL,
  	"gehaeuse" "enum_fahrzeugreihen_gehaeuse" DEFAULT 'unbekannt' NOT NULL,
  	"kennung" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "fahrzeugreihen_id" integer;
  ALTER TABLE "fahrzeugreihen_leistungen" ADD CONSTRAINT "fahrzeugreihen_leistungen_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."fahrzeugreihen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fahrzeugreihen_alias" ADD CONSTRAINT "fahrzeugreihen_alias_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fahrzeugreihen"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "fahrzeugreihen_leistungen_order_idx" ON "fahrzeugreihen_leistungen" USING btree ("order");
  CREATE INDEX "fahrzeugreihen_leistungen_parent_idx" ON "fahrzeugreihen_leistungen" USING btree ("parent_id");
  CREATE INDEX "fahrzeugreihen_alias_order_idx" ON "fahrzeugreihen_alias" USING btree ("_order");
  CREATE INDEX "fahrzeugreihen_alias_parent_id_idx" ON "fahrzeugreihen_alias" USING btree ("_parent_id");
  CREATE INDEX "fahrzeugreihen_marke_idx" ON "fahrzeugreihen" USING btree ("marke");
  CREATE UNIQUE INDEX "fahrzeugreihen_kennung_idx" ON "fahrzeugreihen" USING btree ("kennung");
  CREATE INDEX "fahrzeugreihen_updated_at_idx" ON "fahrzeugreihen" USING btree ("updated_at");
  CREATE INDEX "fahrzeugreihen_created_at_idx" ON "fahrzeugreihen" USING btree ("created_at");
  CREATE INDEX "fahrzeugreihen_deleted_at_idx" ON "fahrzeugreihen" USING btree ("deleted_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_fahrzeugreihen_fk" FOREIGN KEY ("fahrzeugreihen_id") REFERENCES "public"."fahrzeugreihen"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_fahrzeugreihen_id_idx" ON "payload_locked_documents_rels" USING btree ("fahrzeugreihen_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "fahrzeugreihen_leistungen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "fahrzeugreihen_alias" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "fahrzeugreihen" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "fahrzeugreihen_leistungen" CASCADE;
  DROP TABLE "fahrzeugreihen_alias" CASCADE;
  DROP TABLE "fahrzeugreihen" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_fahrzeugreihen_fk";
  
  DROP INDEX "payload_locked_documents_rels_fahrzeugreihen_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "fahrzeugreihen_id";
  DROP TYPE "public"."enum_fahrzeugreihen_leistungen";
  DROP TYPE "public"."enum_fahrzeugreihen_klonbar";
  DROP TYPE "public"."enum_fahrzeugreihen_gehaeuse";`)
}
