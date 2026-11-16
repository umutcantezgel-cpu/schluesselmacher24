import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_produkte_fahrzeugteil_schluesselarten" AS ENUM('mechanisch', 'funk', 'klappschluessel', 'smart-key', 'keyless');
  CREATE TYPE "public"."enum_produkte_fahrzeugteil_teileart" AS ENUM('gehaeuse', 'tasten', 'gummimatte', 'batterie', 'klappmechanismus', 'schluesselbart', 'weitere');
  CREATE TYPE "public"."enum_produkte_fahrzeugteil_elektronik" AS ENUM('ja', 'nein', 'pruefung');
  CREATE TYPE "public"."enum__produkte_v_version_fahrzeugteil_schluesselarten" AS ENUM('mechanisch', 'funk', 'klappschluessel', 'smart-key', 'keyless');
  CREATE TYPE "public"."enum__produkte_v_version_fahrzeugteil_teileart" AS ENUM('gehaeuse', 'tasten', 'gummimatte', 'batterie', 'klappmechanismus', 'schluesselbart', 'weitere');
  CREATE TYPE "public"."enum__produkte_v_version_fahrzeugteil_elektronik" AS ENUM('ja', 'nein', 'pruefung');
  CREATE TYPE "public"."enum_umbau_beispiele_uebernommen" AS ENUM('elektronik', 'transponder', 'tasten', 'schluesselbart', 'weitere');
  CREATE TYPE "public"."enum_umbau_beispiele_einsatz" AS ENUM('customizing', 'gehaeuse', 'reparatur');
  CREATE TYPE "public"."enum_umbau_beispiele_schluesselart" AS ENUM('mechanisch', 'funk', 'klappschluessel', 'smart-key', 'keyless');
  CREATE TYPE "public"."enum_umbau_beispiele_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__umbau_beispiele_v_version_uebernommen" AS ENUM('elektronik', 'transponder', 'tasten', 'schluesselbart', 'weitere');
  CREATE TYPE "public"."enum__umbau_beispiele_v_version_einsatz" AS ENUM('customizing', 'gehaeuse', 'reparatur');
  CREATE TYPE "public"."enum__umbau_beispiele_v_version_schluesselart" AS ENUM('mechanisch', 'funk', 'klappschluessel', 'smart-key', 'keyless');
  CREATE TYPE "public"."enum__umbau_beispiele_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "produkte_fahrzeugteil_schluesselarten" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_produkte_fahrzeugteil_schluesselarten",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_produkte_v_version_fahrzeugteil_schluesselarten" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__produkte_v_version_fahrzeugteil_schluesselarten",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "bauformen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"beschreibung" varchar,
  	"slug" varchar,
  	"kennung" varchar,
  	"reihenfolge" numeric DEFAULT 100 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_bauformen_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar NOT NULL,
  	"version_beschreibung" varchar,
  	"version_slug" varchar,
  	"version_kennung" varchar,
  	"version_reihenfolge" numeric DEFAULT 100 NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "umbau_beispiele_uebernommen" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_umbau_beispiele_uebernommen",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "umbau_beispiele_einsatz" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_umbau_beispiele_einsatz",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "umbau_beispiele" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"vorher_bild_id" integer,
  	"vorher_beschriftung" varchar,
  	"nachher_bild_id" integer,
  	"nachher_beschriftung" varchar,
  	"marke" varchar,
  	"reihe_id" integer,
  	"schluesselart" "enum_umbau_beispiele_schluesselart",
  	"hinweis" varchar,
  	"freigabe" boolean DEFAULT false,
  	"reihenfolge" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_umbau_beispiele_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_umbau_beispiele_v_version_uebernommen" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__umbau_beispiele_v_version_uebernommen",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_umbau_beispiele_v_version_einsatz" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__umbau_beispiele_v_version_einsatz",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_umbau_beispiele_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titel" varchar,
  	"version_vorher_bild_id" integer,
  	"version_vorher_beschriftung" varchar,
  	"version_nachher_bild_id" integer,
  	"version_nachher_beschriftung" varchar,
  	"version_marke" varchar,
  	"version_reihe_id" integer,
  	"version_schluesselart" "enum__umbau_beispiele_v_version_schluesselart",
  	"version_hinweis" varchar,
  	"version_freigabe" boolean DEFAULT false,
  	"version_reihenfolge" numeric DEFAULT 100,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__umbau_beispiele_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "produkte" ADD COLUMN "fahrzeugteil_aktiv" boolean DEFAULT false;
  ALTER TABLE "produkte" ADD COLUMN "fahrzeugteil_teileart" "enum_produkte_fahrzeugteil_teileart";
  ALTER TABLE "produkte" ADD COLUMN "fahrzeugteil_elektronik" "enum_produkte_fahrzeugteil_elektronik";
  ALTER TABLE "produkte" ADD COLUMN "fahrzeugteil_kompatibilitaet" varchar;
  ALTER TABLE "produkte" ADD COLUMN "fahrzeugteil_marke" varchar;
  ALTER TABLE "produkte" ADD COLUMN "fahrzeugteil_baujahr_von" numeric;
  ALTER TABLE "produkte" ADD COLUMN "fahrzeugteil_baujahr_bis" numeric;
  ALTER TABLE "produkte" ADD COLUMN "fahrzeugteil_tastenzahl" numeric;
  ALTER TABLE "produkte_rels" ADD COLUMN "bauformen_id" integer;
  ALTER TABLE "produkte_rels" ADD COLUMN "fahrzeugreihen_id" integer;
  ALTER TABLE "_produkte_v" ADD COLUMN "version_fahrzeugteil_aktiv" boolean DEFAULT false;
  ALTER TABLE "_produkte_v" ADD COLUMN "version_fahrzeugteil_teileart" "enum__produkte_v_version_fahrzeugteil_teileart";
  ALTER TABLE "_produkte_v" ADD COLUMN "version_fahrzeugteil_elektronik" "enum__produkte_v_version_fahrzeugteil_elektronik";
  ALTER TABLE "_produkte_v" ADD COLUMN "version_fahrzeugteil_kompatibilitaet" varchar;
  ALTER TABLE "_produkte_v" ADD COLUMN "version_fahrzeugteil_marke" varchar;
  ALTER TABLE "_produkte_v" ADD COLUMN "version_fahrzeugteil_baujahr_von" numeric;
  ALTER TABLE "_produkte_v" ADD COLUMN "version_fahrzeugteil_baujahr_bis" numeric;
  ALTER TABLE "_produkte_v" ADD COLUMN "version_fahrzeugteil_tastenzahl" numeric;
  ALTER TABLE "_produkte_v_rels" ADD COLUMN "bauformen_id" integer;
  ALTER TABLE "_produkte_v_rels" ADD COLUMN "fahrzeugreihen_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "bauformen_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "umbau_beispiele_id" integer;
  ALTER TABLE "produkte_fahrzeugteil_schluesselarten" ADD CONSTRAINT "produkte_fahrzeugteil_schluesselarten_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."produkte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_produkte_v_version_fahrzeugteil_schluesselarten" ADD CONSTRAINT "_produkte_v_version_fahrzeugteil_schluesselarten_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_produkte_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_bauformen_v" ADD CONSTRAINT "_bauformen_v_parent_id_bauformen_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."bauformen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "umbau_beispiele_uebernommen" ADD CONSTRAINT "umbau_beispiele_uebernommen_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."umbau_beispiele"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "umbau_beispiele_einsatz" ADD CONSTRAINT "umbau_beispiele_einsatz_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."umbau_beispiele"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "umbau_beispiele" ADD CONSTRAINT "umbau_beispiele_vorher_bild_id_medien_id_fk" FOREIGN KEY ("vorher_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "umbau_beispiele" ADD CONSTRAINT "umbau_beispiele_nachher_bild_id_medien_id_fk" FOREIGN KEY ("nachher_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "umbau_beispiele" ADD CONSTRAINT "umbau_beispiele_reihe_id_fahrzeugreihen_id_fk" FOREIGN KEY ("reihe_id") REFERENCES "public"."fahrzeugreihen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_umbau_beispiele_v_version_uebernommen" ADD CONSTRAINT "_umbau_beispiele_v_version_uebernommen_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_umbau_beispiele_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_umbau_beispiele_v_version_einsatz" ADD CONSTRAINT "_umbau_beispiele_v_version_einsatz_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_umbau_beispiele_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_umbau_beispiele_v" ADD CONSTRAINT "_umbau_beispiele_v_parent_id_umbau_beispiele_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."umbau_beispiele"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_umbau_beispiele_v" ADD CONSTRAINT "_umbau_beispiele_v_version_vorher_bild_id_medien_id_fk" FOREIGN KEY ("version_vorher_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_umbau_beispiele_v" ADD CONSTRAINT "_umbau_beispiele_v_version_nachher_bild_id_medien_id_fk" FOREIGN KEY ("version_nachher_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_umbau_beispiele_v" ADD CONSTRAINT "_umbau_beispiele_v_version_reihe_id_fahrzeugreihen_id_fk" FOREIGN KEY ("version_reihe_id") REFERENCES "public"."fahrzeugreihen"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "produkte_fahrzeugteil_schluesselarten_order_idx" ON "produkte_fahrzeugteil_schluesselarten" USING btree ("order");
  CREATE INDEX "produkte_fahrzeugteil_schluesselarten_parent_idx" ON "produkte_fahrzeugteil_schluesselarten" USING btree ("parent_id");
  CREATE INDEX "_produkte_v_version_fahrzeugteil_schluesselarten_order_idx" ON "_produkte_v_version_fahrzeugteil_schluesselarten" USING btree ("order");
  CREATE INDEX "_produkte_v_version_fahrzeugteil_schluesselarten_parent_idx" ON "_produkte_v_version_fahrzeugteil_schluesselarten" USING btree ("parent_id");
  CREATE UNIQUE INDEX "bauformen_name_idx" ON "bauformen" USING btree ("name");
  CREATE UNIQUE INDEX "bauformen_slug_idx" ON "bauformen" USING btree ("slug");
  CREATE UNIQUE INDEX "bauformen_kennung_idx" ON "bauformen" USING btree ("kennung");
  CREATE INDEX "bauformen_updated_at_idx" ON "bauformen" USING btree ("updated_at");
  CREATE INDEX "bauformen_created_at_idx" ON "bauformen" USING btree ("created_at");
  CREATE INDEX "bauformen_deleted_at_idx" ON "bauformen" USING btree ("deleted_at");
  CREATE INDEX "_bauformen_v_parent_idx" ON "_bauformen_v" USING btree ("parent_id");
  CREATE INDEX "_bauformen_v_version_version_name_idx" ON "_bauformen_v" USING btree ("version_name");
  CREATE INDEX "_bauformen_v_version_version_slug_idx" ON "_bauformen_v" USING btree ("version_slug");
  CREATE INDEX "_bauformen_v_version_version_kennung_idx" ON "_bauformen_v" USING btree ("version_kennung");
  CREATE INDEX "_bauformen_v_version_version_updated_at_idx" ON "_bauformen_v" USING btree ("version_updated_at");
  CREATE INDEX "_bauformen_v_version_version_created_at_idx" ON "_bauformen_v" USING btree ("version_created_at");
  CREATE INDEX "_bauformen_v_version_version_deleted_at_idx" ON "_bauformen_v" USING btree ("version_deleted_at");
  CREATE INDEX "_bauformen_v_created_at_idx" ON "_bauformen_v" USING btree ("created_at");
  CREATE INDEX "_bauformen_v_updated_at_idx" ON "_bauformen_v" USING btree ("updated_at");
  CREATE INDEX "umbau_beispiele_uebernommen_order_idx" ON "umbau_beispiele_uebernommen" USING btree ("order");
  CREATE INDEX "umbau_beispiele_uebernommen_parent_idx" ON "umbau_beispiele_uebernommen" USING btree ("parent_id");
  CREATE INDEX "umbau_beispiele_einsatz_order_idx" ON "umbau_beispiele_einsatz" USING btree ("order");
  CREATE INDEX "umbau_beispiele_einsatz_parent_idx" ON "umbau_beispiele_einsatz" USING btree ("parent_id");
  CREATE INDEX "umbau_beispiele_vorher_vorher_bild_idx" ON "umbau_beispiele" USING btree ("vorher_bild_id");
  CREATE INDEX "umbau_beispiele_nachher_nachher_bild_idx" ON "umbau_beispiele" USING btree ("nachher_bild_id");
  CREATE INDEX "umbau_beispiele_reihe_idx" ON "umbau_beispiele" USING btree ("reihe_id");
  CREATE INDEX "umbau_beispiele_updated_at_idx" ON "umbau_beispiele" USING btree ("updated_at");
  CREATE INDEX "umbau_beispiele_created_at_idx" ON "umbau_beispiele" USING btree ("created_at");
  CREATE INDEX "umbau_beispiele_deleted_at_idx" ON "umbau_beispiele" USING btree ("deleted_at");
  CREATE INDEX "umbau_beispiele__status_idx" ON "umbau_beispiele" USING btree ("_status");
  CREATE INDEX "_umbau_beispiele_v_version_uebernommen_order_idx" ON "_umbau_beispiele_v_version_uebernommen" USING btree ("order");
  CREATE INDEX "_umbau_beispiele_v_version_uebernommen_parent_idx" ON "_umbau_beispiele_v_version_uebernommen" USING btree ("parent_id");
  CREATE INDEX "_umbau_beispiele_v_version_einsatz_order_idx" ON "_umbau_beispiele_v_version_einsatz" USING btree ("order");
  CREATE INDEX "_umbau_beispiele_v_version_einsatz_parent_idx" ON "_umbau_beispiele_v_version_einsatz" USING btree ("parent_id");
  CREATE INDEX "_umbau_beispiele_v_parent_idx" ON "_umbau_beispiele_v" USING btree ("parent_id");
  CREATE INDEX "_umbau_beispiele_v_version_vorher_version_vorher_bild_idx" ON "_umbau_beispiele_v" USING btree ("version_vorher_bild_id");
  CREATE INDEX "_umbau_beispiele_v_version_nachher_version_nachher_bild_idx" ON "_umbau_beispiele_v" USING btree ("version_nachher_bild_id");
  CREATE INDEX "_umbau_beispiele_v_version_version_reihe_idx" ON "_umbau_beispiele_v" USING btree ("version_reihe_id");
  CREATE INDEX "_umbau_beispiele_v_version_version_updated_at_idx" ON "_umbau_beispiele_v" USING btree ("version_updated_at");
  CREATE INDEX "_umbau_beispiele_v_version_version_created_at_idx" ON "_umbau_beispiele_v" USING btree ("version_created_at");
  CREATE INDEX "_umbau_beispiele_v_version_version_deleted_at_idx" ON "_umbau_beispiele_v" USING btree ("version_deleted_at");
  CREATE INDEX "_umbau_beispiele_v_version_version__status_idx" ON "_umbau_beispiele_v" USING btree ("version__status");
  CREATE INDEX "_umbau_beispiele_v_created_at_idx" ON "_umbau_beispiele_v" USING btree ("created_at");
  CREATE INDEX "_umbau_beispiele_v_updated_at_idx" ON "_umbau_beispiele_v" USING btree ("updated_at");
  CREATE INDEX "_umbau_beispiele_v_latest_idx" ON "_umbau_beispiele_v" USING btree ("latest");
  ALTER TABLE "produkte_rels" ADD CONSTRAINT "produkte_rels_bauformen_fk" FOREIGN KEY ("bauformen_id") REFERENCES "public"."bauformen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produkte_rels" ADD CONSTRAINT "produkte_rels_fahrzeugreihen_fk" FOREIGN KEY ("fahrzeugreihen_id") REFERENCES "public"."fahrzeugreihen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_produkte_v_rels" ADD CONSTRAINT "_produkte_v_rels_bauformen_fk" FOREIGN KEY ("bauformen_id") REFERENCES "public"."bauformen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_produkte_v_rels" ADD CONSTRAINT "_produkte_v_rels_fahrzeugreihen_fk" FOREIGN KEY ("fahrzeugreihen_id") REFERENCES "public"."fahrzeugreihen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bauformen_fk" FOREIGN KEY ("bauformen_id") REFERENCES "public"."bauformen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_umbau_beispiele_fk" FOREIGN KEY ("umbau_beispiele_id") REFERENCES "public"."umbau_beispiele"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "produkte_rels_bauformen_id_idx" ON "produkte_rels" USING btree ("bauformen_id");
  CREATE INDEX "produkte_rels_fahrzeugreihen_id_idx" ON "produkte_rels" USING btree ("fahrzeugreihen_id");
  CREATE INDEX "_produkte_v_rels_bauformen_id_idx" ON "_produkte_v_rels" USING btree ("bauformen_id");
  CREATE INDEX "_produkte_v_rels_fahrzeugreihen_id_idx" ON "_produkte_v_rels" USING btree ("fahrzeugreihen_id");
  CREATE INDEX "payload_locked_documents_rels_bauformen_id_idx" ON "payload_locked_documents_rels" USING btree ("bauformen_id");
  CREATE INDEX "payload_locked_documents_rels_umbau_beispiele_id_idx" ON "payload_locked_documents_rels" USING btree ("umbau_beispiele_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "produkte_fahrzeugteil_schluesselarten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_produkte_v_version_fahrzeugteil_schluesselarten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "bauformen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_bauformen_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "umbau_beispiele_uebernommen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "umbau_beispiele_einsatz" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "umbau_beispiele" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_umbau_beispiele_v_version_uebernommen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_umbau_beispiele_v_version_einsatz" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_umbau_beispiele_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "produkte_fahrzeugteil_schluesselarten" CASCADE;
  DROP TABLE "_produkte_v_version_fahrzeugteil_schluesselarten" CASCADE;
  DROP TABLE "bauformen" CASCADE;
  DROP TABLE "_bauformen_v" CASCADE;
  DROP TABLE "umbau_beispiele_uebernommen" CASCADE;
  DROP TABLE "umbau_beispiele_einsatz" CASCADE;
  DROP TABLE "umbau_beispiele" CASCADE;
  DROP TABLE "_umbau_beispiele_v_version_uebernommen" CASCADE;
  DROP TABLE "_umbau_beispiele_v_version_einsatz" CASCADE;
  DROP TABLE "_umbau_beispiele_v" CASCADE;
  ALTER TABLE "produkte_rels" DROP CONSTRAINT "produkte_rels_bauformen_fk";
  
  ALTER TABLE "produkte_rels" DROP CONSTRAINT "produkte_rels_fahrzeugreihen_fk";
  
  ALTER TABLE "_produkte_v_rels" DROP CONSTRAINT "_produkte_v_rels_bauformen_fk";
  
  ALTER TABLE "_produkte_v_rels" DROP CONSTRAINT "_produkte_v_rels_fahrzeugreihen_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_bauformen_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_umbau_beispiele_fk";
  
  DROP INDEX "produkte_rels_bauformen_id_idx";
  DROP INDEX "produkte_rels_fahrzeugreihen_id_idx";
  DROP INDEX "_produkte_v_rels_bauformen_id_idx";
  DROP INDEX "_produkte_v_rels_fahrzeugreihen_id_idx";
  DROP INDEX "payload_locked_documents_rels_bauformen_id_idx";
  DROP INDEX "payload_locked_documents_rels_umbau_beispiele_id_idx";
  ALTER TABLE "produkte" DROP COLUMN "fahrzeugteil_aktiv";
  ALTER TABLE "produkte" DROP COLUMN "fahrzeugteil_teileart";
  ALTER TABLE "produkte" DROP COLUMN "fahrzeugteil_elektronik";
  ALTER TABLE "produkte" DROP COLUMN "fahrzeugteil_kompatibilitaet";
  ALTER TABLE "produkte" DROP COLUMN "fahrzeugteil_marke";
  ALTER TABLE "produkte" DROP COLUMN "fahrzeugteil_baujahr_von";
  ALTER TABLE "produkte" DROP COLUMN "fahrzeugteil_baujahr_bis";
  ALTER TABLE "produkte" DROP COLUMN "fahrzeugteil_tastenzahl";
  ALTER TABLE "produkte_rels" DROP COLUMN "bauformen_id";
  ALTER TABLE "produkte_rels" DROP COLUMN "fahrzeugreihen_id";
  ALTER TABLE "_produkte_v" DROP COLUMN "version_fahrzeugteil_aktiv";
  ALTER TABLE "_produkte_v" DROP COLUMN "version_fahrzeugteil_teileart";
  ALTER TABLE "_produkte_v" DROP COLUMN "version_fahrzeugteil_elektronik";
  ALTER TABLE "_produkte_v" DROP COLUMN "version_fahrzeugteil_kompatibilitaet";
  ALTER TABLE "_produkte_v" DROP COLUMN "version_fahrzeugteil_marke";
  ALTER TABLE "_produkte_v" DROP COLUMN "version_fahrzeugteil_baujahr_von";
  ALTER TABLE "_produkte_v" DROP COLUMN "version_fahrzeugteil_baujahr_bis";
  ALTER TABLE "_produkte_v" DROP COLUMN "version_fahrzeugteil_tastenzahl";
  ALTER TABLE "_produkte_v_rels" DROP COLUMN "bauformen_id";
  ALTER TABLE "_produkte_v_rels" DROP COLUMN "fahrzeugreihen_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "bauformen_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "umbau_beispiele_id";
  DROP TYPE "public"."enum_produkte_fahrzeugteil_schluesselarten";
  DROP TYPE "public"."enum_produkte_fahrzeugteil_teileart";
  DROP TYPE "public"."enum_produkte_fahrzeugteil_elektronik";
  DROP TYPE "public"."enum__produkte_v_version_fahrzeugteil_schluesselarten";
  DROP TYPE "public"."enum__produkte_v_version_fahrzeugteil_teileart";
  DROP TYPE "public"."enum__produkte_v_version_fahrzeugteil_elektronik";
  DROP TYPE "public"."enum_umbau_beispiele_uebernommen";
  DROP TYPE "public"."enum_umbau_beispiele_einsatz";
  DROP TYPE "public"."enum_umbau_beispiele_schluesselart";
  DROP TYPE "public"."enum_umbau_beispiele_status";
  DROP TYPE "public"."enum__umbau_beispiele_v_version_uebernommen";
  DROP TYPE "public"."enum__umbau_beispiele_v_version_einsatz";
  DROP TYPE "public"."enum__umbau_beispiele_v_version_schluesselart";
  DROP TYPE "public"."enum__umbau_beispiele_v_version_status";`)
}
