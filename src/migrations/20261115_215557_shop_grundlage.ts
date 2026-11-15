import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_produkte_verfuegbarkeit" AS ENUM('lieferbar', 'auf-anfrage', 'nicht-lieferbar');
  CREATE TYPE "public"."enum__produkte_v_version_verfuegbarkeit" AS ENUM('lieferbar', 'auf-anfrage', 'nicht-lieferbar');
  CREATE TYPE "public"."enum_kategorien_art" AS ENUM('codeprodukte', 'artikel', 'konfigurator', 'anfrage');
  CREATE TYPE "public"."enum_kategorien_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_kategorien_seo_social_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum__kategorien_v_version_art" AS ENUM('codeprodukte', 'artikel', 'konfigurator', 'anfrage');
  CREATE TYPE "public"."enum__kategorien_v_version_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum__kategorien_v_version_seo_social_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TABLE "kategorien_fruehere_adressen" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"adresse" varchar NOT NULL
  );
  
  CREATE TABLE "kategorien_seo_interne_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "kategorien" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"eltern_id" integer,
  	"beschreibung" varchar NOT NULL,
  	"art" "enum_kategorien_art" DEFAULT 'anfrage' NOT NULL,
  	"ziel" varchar NOT NULL,
  	"hinweis" varchar,
  	"bild_motiv" varchar,
  	"bild_format" "enum_kategorien_bild_format" DEFAULT '4/3',
  	"bild_bild_id" integer,
  	"bild_hinweis" varchar,
  	"seo_titel" varchar,
  	"seo_beschreibung" varchar,
  	"seo_noindex" boolean DEFAULT false,
  	"seo_social_bild_motiv" varchar,
  	"seo_social_bild_format" "enum_kategorien_seo_social_bild_format" DEFAULT '16/9',
  	"seo_social_bild_bild_id" integer,
  	"seo_social_bild_hinweis" varchar,
  	"slug" varchar,
  	"kennung" varchar,
  	"reihenfolge" numeric DEFAULT 100 NOT NULL,
  	"im_shop" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_kategorien_v_version_fruehere_adressen" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"adresse" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_kategorien_v_version_seo_interne_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_kategorien_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar NOT NULL,
  	"version_eltern_id" integer,
  	"version_beschreibung" varchar NOT NULL,
  	"version_art" "enum__kategorien_v_version_art" DEFAULT 'anfrage' NOT NULL,
  	"version_ziel" varchar NOT NULL,
  	"version_hinweis" varchar,
  	"version_bild_motiv" varchar,
  	"version_bild_format" "enum__kategorien_v_version_bild_format" DEFAULT '4/3',
  	"version_bild_bild_id" integer,
  	"version_bild_hinweis" varchar,
  	"version_seo_titel" varchar,
  	"version_seo_beschreibung" varchar,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_seo_social_bild_motiv" varchar,
  	"version_seo_social_bild_format" "enum__kategorien_v_version_seo_social_bild_format" DEFAULT '16/9',
  	"version_seo_social_bild_bild_id" integer,
  	"version_seo_social_bild_hinweis" varchar,
  	"version_slug" varchar,
  	"version_kennung" varchar,
  	"version_reihenfolge" numeric DEFAULT 100 NOT NULL,
  	"version_im_shop" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "hersteller" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"einsatz" varchar,
  	"angeboten" boolean DEFAULT false,
  	"logo_bild_id" integer,
  	"logo_freigabe" boolean DEFAULT false,
  	"logo_freigabe_notiz" varchar,
  	"slug" varchar,
  	"kennung" varchar,
  	"reihenfolge" numeric DEFAULT 100 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_hersteller_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar NOT NULL,
  	"version_einsatz" varchar,
  	"version_angeboten" boolean DEFAULT false,
  	"version_logo_bild_id" integer,
  	"version_logo_freigabe" boolean DEFAULT false,
  	"version_logo_freigabe_notiz" varchar,
  	"version_slug" varchar,
  	"version_kennung" varchar,
  	"version_reihenfolge" numeric DEFAULT 100 NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "produkte" ADD COLUMN "verfuegbarkeit" "enum_produkte_verfuegbarkeit" DEFAULT 'lieferbar';
  ALTER TABLE "produkte" ADD COLUMN "kategorie_id" integer;
  ALTER TABLE "produkte" ADD COLUMN "hersteller_auswahl_id" integer;
  ALTER TABLE "produkte" ADD COLUMN "system" varchar;
  ALTER TABLE "produkte" ADD COLUMN "codebereich" varchar;
  ALTER TABLE "_produkte_v" ADD COLUMN "version_verfuegbarkeit" "enum__produkte_v_version_verfuegbarkeit" DEFAULT 'lieferbar';
  ALTER TABLE "_produkte_v" ADD COLUMN "version_kategorie_id" integer;
  ALTER TABLE "_produkte_v" ADD COLUMN "version_hersteller_auswahl_id" integer;
  ALTER TABLE "_produkte_v" ADD COLUMN "version_system" varchar;
  ALTER TABLE "_produkte_v" ADD COLUMN "version_codebereich" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "kategorien_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "hersteller_id" integer;
  ALTER TABLE "kategorien_fruehere_adressen" ADD CONSTRAINT "kategorien_fruehere_adressen_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kategorien"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "kategorien_seo_interne_links" ADD CONSTRAINT "kategorien_seo_interne_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kategorien"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "kategorien" ADD CONSTRAINT "kategorien_eltern_id_kategorien_id_fk" FOREIGN KEY ("eltern_id") REFERENCES "public"."kategorien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "kategorien" ADD CONSTRAINT "kategorien_bild_bild_id_medien_id_fk" FOREIGN KEY ("bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "kategorien" ADD CONSTRAINT "kategorien_seo_social_bild_bild_id_medien_id_fk" FOREIGN KEY ("seo_social_bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_kategorien_v_version_fruehere_adressen" ADD CONSTRAINT "_kategorien_v_version_fruehere_adressen_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_kategorien_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_kategorien_v_version_seo_interne_links" ADD CONSTRAINT "_kategorien_v_version_seo_interne_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_kategorien_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_kategorien_v" ADD CONSTRAINT "_kategorien_v_parent_id_kategorien_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."kategorien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_kategorien_v" ADD CONSTRAINT "_kategorien_v_version_eltern_id_kategorien_id_fk" FOREIGN KEY ("version_eltern_id") REFERENCES "public"."kategorien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_kategorien_v" ADD CONSTRAINT "_kategorien_v_version_bild_bild_id_medien_id_fk" FOREIGN KEY ("version_bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_kategorien_v" ADD CONSTRAINT "_kategorien_v_version_seo_social_bild_bild_id_medien_id_fk" FOREIGN KEY ("version_seo_social_bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hersteller" ADD CONSTRAINT "hersteller_logo_bild_id_medien_id_fk" FOREIGN KEY ("logo_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_hersteller_v" ADD CONSTRAINT "_hersteller_v_parent_id_hersteller_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."hersteller"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_hersteller_v" ADD CONSTRAINT "_hersteller_v_version_logo_bild_id_medien_id_fk" FOREIGN KEY ("version_logo_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "kategorien_fruehere_adressen_order_idx" ON "kategorien_fruehere_adressen" USING btree ("_order");
  CREATE INDEX "kategorien_fruehere_adressen_parent_id_idx" ON "kategorien_fruehere_adressen" USING btree ("_parent_id");
  CREATE INDEX "kategorien_seo_interne_links_order_idx" ON "kategorien_seo_interne_links" USING btree ("_order");
  CREATE INDEX "kategorien_seo_interne_links_parent_id_idx" ON "kategorien_seo_interne_links" USING btree ("_parent_id");
  CREATE INDEX "kategorien_eltern_idx" ON "kategorien" USING btree ("eltern_id");
  CREATE INDEX "kategorien_bild_bild_bild_idx" ON "kategorien" USING btree ("bild_bild_id");
  CREATE INDEX "kategorien_seo_social_bild_seo_social_bild_bild_idx" ON "kategorien" USING btree ("seo_social_bild_bild_id");
  CREATE UNIQUE INDEX "kategorien_slug_idx" ON "kategorien" USING btree ("slug");
  CREATE UNIQUE INDEX "kategorien_kennung_idx" ON "kategorien" USING btree ("kennung");
  CREATE INDEX "kategorien_updated_at_idx" ON "kategorien" USING btree ("updated_at");
  CREATE INDEX "kategorien_created_at_idx" ON "kategorien" USING btree ("created_at");
  CREATE INDEX "kategorien_deleted_at_idx" ON "kategorien" USING btree ("deleted_at");
  CREATE INDEX "_kategorien_v_version_fruehere_adressen_order_idx" ON "_kategorien_v_version_fruehere_adressen" USING btree ("_order");
  CREATE INDEX "_kategorien_v_version_fruehere_adressen_parent_id_idx" ON "_kategorien_v_version_fruehere_adressen" USING btree ("_parent_id");
  CREATE INDEX "_kategorien_v_version_seo_interne_links_order_idx" ON "_kategorien_v_version_seo_interne_links" USING btree ("_order");
  CREATE INDEX "_kategorien_v_version_seo_interne_links_parent_id_idx" ON "_kategorien_v_version_seo_interne_links" USING btree ("_parent_id");
  CREATE INDEX "_kategorien_v_parent_idx" ON "_kategorien_v" USING btree ("parent_id");
  CREATE INDEX "_kategorien_v_version_version_eltern_idx" ON "_kategorien_v" USING btree ("version_eltern_id");
  CREATE INDEX "_kategorien_v_version_bild_version_bild_bild_idx" ON "_kategorien_v" USING btree ("version_bild_bild_id");
  CREATE INDEX "_kategorien_v_version_seo_social_bild_version_seo_social_idx" ON "_kategorien_v" USING btree ("version_seo_social_bild_bild_id");
  CREATE INDEX "_kategorien_v_version_version_slug_idx" ON "_kategorien_v" USING btree ("version_slug");
  CREATE INDEX "_kategorien_v_version_version_kennung_idx" ON "_kategorien_v" USING btree ("version_kennung");
  CREATE INDEX "_kategorien_v_version_version_updated_at_idx" ON "_kategorien_v" USING btree ("version_updated_at");
  CREATE INDEX "_kategorien_v_version_version_created_at_idx" ON "_kategorien_v" USING btree ("version_created_at");
  CREATE INDEX "_kategorien_v_version_version_deleted_at_idx" ON "_kategorien_v" USING btree ("version_deleted_at");
  CREATE INDEX "_kategorien_v_created_at_idx" ON "_kategorien_v" USING btree ("created_at");
  CREATE INDEX "_kategorien_v_updated_at_idx" ON "_kategorien_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "hersteller_name_idx" ON "hersteller" USING btree ("name");
  CREATE INDEX "hersteller_logo_logo_bild_idx" ON "hersteller" USING btree ("logo_bild_id");
  CREATE UNIQUE INDEX "hersteller_slug_idx" ON "hersteller" USING btree ("slug");
  CREATE UNIQUE INDEX "hersteller_kennung_idx" ON "hersteller" USING btree ("kennung");
  CREATE INDEX "hersteller_updated_at_idx" ON "hersteller" USING btree ("updated_at");
  CREATE INDEX "hersteller_created_at_idx" ON "hersteller" USING btree ("created_at");
  CREATE INDEX "hersteller_deleted_at_idx" ON "hersteller" USING btree ("deleted_at");
  CREATE INDEX "_hersteller_v_parent_idx" ON "_hersteller_v" USING btree ("parent_id");
  CREATE INDEX "_hersteller_v_version_version_name_idx" ON "_hersteller_v" USING btree ("version_name");
  CREATE INDEX "_hersteller_v_version_logo_version_logo_bild_idx" ON "_hersteller_v" USING btree ("version_logo_bild_id");
  CREATE INDEX "_hersteller_v_version_version_slug_idx" ON "_hersteller_v" USING btree ("version_slug");
  CREATE INDEX "_hersteller_v_version_version_kennung_idx" ON "_hersteller_v" USING btree ("version_kennung");
  CREATE INDEX "_hersteller_v_version_version_updated_at_idx" ON "_hersteller_v" USING btree ("version_updated_at");
  CREATE INDEX "_hersteller_v_version_version_created_at_idx" ON "_hersteller_v" USING btree ("version_created_at");
  CREATE INDEX "_hersteller_v_version_version_deleted_at_idx" ON "_hersteller_v" USING btree ("version_deleted_at");
  CREATE INDEX "_hersteller_v_created_at_idx" ON "_hersteller_v" USING btree ("created_at");
  CREATE INDEX "_hersteller_v_updated_at_idx" ON "_hersteller_v" USING btree ("updated_at");
  ALTER TABLE "produkte" ADD CONSTRAINT "produkte_kategorie_id_kategorien_id_fk" FOREIGN KEY ("kategorie_id") REFERENCES "public"."kategorien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "produkte" ADD CONSTRAINT "produkte_hersteller_auswahl_id_hersteller_id_fk" FOREIGN KEY ("hersteller_auswahl_id") REFERENCES "public"."hersteller"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_produkte_v" ADD CONSTRAINT "_produkte_v_version_kategorie_id_kategorien_id_fk" FOREIGN KEY ("version_kategorie_id") REFERENCES "public"."kategorien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_produkte_v" ADD CONSTRAINT "_produkte_v_version_hersteller_auswahl_id_hersteller_id_fk" FOREIGN KEY ("version_hersteller_auswahl_id") REFERENCES "public"."hersteller"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_kategorien_fk" FOREIGN KEY ("kategorien_id") REFERENCES "public"."kategorien"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_hersteller_fk" FOREIGN KEY ("hersteller_id") REFERENCES "public"."hersteller"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "produkte_kategorie_idx" ON "produkte" USING btree ("kategorie_id");
  CREATE INDEX "produkte_hersteller_auswahl_idx" ON "produkte" USING btree ("hersteller_auswahl_id");
  CREATE INDEX "_produkte_v_version_version_kategorie_idx" ON "_produkte_v" USING btree ("version_kategorie_id");
  CREATE INDEX "_produkte_v_version_version_hersteller_auswahl_idx" ON "_produkte_v" USING btree ("version_hersteller_auswahl_id");
  CREATE INDEX "payload_locked_documents_rels_kategorien_id_idx" ON "payload_locked_documents_rels" USING btree ("kategorien_id");
  CREATE INDEX "payload_locked_documents_rels_hersteller_id_idx" ON "payload_locked_documents_rels" USING btree ("hersteller_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "kategorien_fruehere_adressen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "kategorien_seo_interne_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "kategorien" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_kategorien_v_version_fruehere_adressen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_kategorien_v_version_seo_interne_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_kategorien_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hersteller" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hersteller_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "kategorien_fruehere_adressen" CASCADE;
  DROP TABLE "kategorien_seo_interne_links" CASCADE;
  DROP TABLE "kategorien" CASCADE;
  DROP TABLE "_kategorien_v_version_fruehere_adressen" CASCADE;
  DROP TABLE "_kategorien_v_version_seo_interne_links" CASCADE;
  DROP TABLE "_kategorien_v" CASCADE;
  DROP TABLE "hersteller" CASCADE;
  DROP TABLE "_hersteller_v" CASCADE;
  ALTER TABLE "produkte" DROP CONSTRAINT "produkte_kategorie_id_kategorien_id_fk";
  
  ALTER TABLE "produkte" DROP CONSTRAINT "produkte_hersteller_auswahl_id_hersteller_id_fk";
  
  ALTER TABLE "_produkte_v" DROP CONSTRAINT "_produkte_v_version_kategorie_id_kategorien_id_fk";
  
  ALTER TABLE "_produkte_v" DROP CONSTRAINT "_produkte_v_version_hersteller_auswahl_id_hersteller_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_kategorien_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_hersteller_fk";
  
  DROP INDEX "produkte_kategorie_idx";
  DROP INDEX "produkte_hersteller_auswahl_idx";
  DROP INDEX "_produkte_v_version_version_kategorie_idx";
  DROP INDEX "_produkte_v_version_version_hersteller_auswahl_idx";
  DROP INDEX "payload_locked_documents_rels_kategorien_id_idx";
  DROP INDEX "payload_locked_documents_rels_hersteller_id_idx";
  ALTER TABLE "produkte" DROP COLUMN "verfuegbarkeit";
  ALTER TABLE "produkte" DROP COLUMN "kategorie_id";
  ALTER TABLE "produkte" DROP COLUMN "hersteller_auswahl_id";
  ALTER TABLE "produkte" DROP COLUMN "system";
  ALTER TABLE "produkte" DROP COLUMN "codebereich";
  ALTER TABLE "_produkte_v" DROP COLUMN "version_verfuegbarkeit";
  ALTER TABLE "_produkte_v" DROP COLUMN "version_kategorie_id";
  ALTER TABLE "_produkte_v" DROP COLUMN "version_hersteller_auswahl_id";
  ALTER TABLE "_produkte_v" DROP COLUMN "version_system";
  ALTER TABLE "_produkte_v" DROP COLUMN "version_codebereich";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "kategorien_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "hersteller_id";
  DROP TYPE "public"."enum_produkte_verfuegbarkeit";
  DROP TYPE "public"."enum__produkte_v_version_verfuegbarkeit";
  DROP TYPE "public"."enum_kategorien_art";
  DROP TYPE "public"."enum_kategorien_bild_format";
  DROP TYPE "public"."enum_kategorien_seo_social_bild_format";
  DROP TYPE "public"."enum__kategorien_v_version_art";
  DROP TYPE "public"."enum__kategorien_v_version_bild_format";
  DROP TYPE "public"."enum__kategorien_v_version_seo_social_bild_format";`)
}
