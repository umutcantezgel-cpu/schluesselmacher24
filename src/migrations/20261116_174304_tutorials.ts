import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_tutorials_schritte_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_tutorials_erscheint_auf" AS ENUM('schluessel-nach-vorlage', 'schluessel-nach-vorlage-fotos', 'autoschluessel-fotos', 'autoschluessel-fahrzeugschein', 'schluessel-nach-code', 'schluessel-einschicken', 'gleichschliessende-zylinder', 'gleichschliessende-zylinder-messen', 'gleichschliessende-zylinder-funktion', 'schliessanlagen', 'autoschluessel-gehaeuse');
  CREATE TYPE "public"."enum_tutorials_thema" AS ENUM('autoschluessel', 'schluessel-nach-vorlage', 'schluessel-nach-code', 'gleichschliessende-zylinder', 'schliessanlagen', 'elektronische-zutrittsloesungen', 'tuer-und-schliesstechnik', 'sicherheitstechnik', 'service-und-termin');
  CREATE TYPE "public"."enum_tutorials_seo_social_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_tutorials_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__tutorials_v_version_schritte_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum__tutorials_v_version_erscheint_auf" AS ENUM('schluessel-nach-vorlage', 'schluessel-nach-vorlage-fotos', 'autoschluessel-fotos', 'autoschluessel-fahrzeugschein', 'schluessel-nach-code', 'schluessel-einschicken', 'gleichschliessende-zylinder', 'gleichschliessende-zylinder-messen', 'gleichschliessende-zylinder-funktion', 'schliessanlagen', 'autoschluessel-gehaeuse');
  CREATE TYPE "public"."enum__tutorials_v_version_thema" AS ENUM('autoschluessel', 'schluessel-nach-vorlage', 'schluessel-nach-code', 'gleichschliessende-zylinder', 'schliessanlagen', 'elektronische-zutrittsloesungen', 'tuer-und-schliesstechnik', 'sicherheitstechnik', 'service-und-termin');
  CREATE TYPE "public"."enum__tutorials_v_version_seo_social_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum__tutorials_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "tutorials_schritte" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ueberschrift" varchar,
  	"text" varchar,
  	"bild_motiv" varchar,
  	"bild_format" "enum_tutorials_schritte_bild_format" DEFAULT '4/3',
  	"bild_bild_id" integer,
  	"bild_hinweis" varchar
  );
  
  CREATE TABLE "tutorials_erscheint_auf" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_tutorials_erscheint_auf",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tutorials_seo_interne_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "tutorials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"kurzantwort" varchar,
  	"thema" "enum_tutorials_thema",
  	"video_youtube" varchar,
  	"video_titel" varchar,
  	"video_dauer" varchar,
  	"video_datum" timestamp(3) with time zone,
  	"video_vorschaubild_id" integer,
  	"video_transkript" varchar,
  	"ratgeber_id" integer,
  	"reihenfolge" numeric DEFAULT 100,
  	"seo_titel" varchar,
  	"seo_beschreibung" varchar,
  	"seo_noindex" boolean DEFAULT false,
  	"seo_social_bild_motiv" varchar,
  	"seo_social_bild_format" "enum_tutorials_seo_social_bild_format" DEFAULT '16/9',
  	"seo_social_bild_bild_id" integer,
  	"seo_social_bild_hinweis" varchar,
  	"slug" varchar,
  	"kennung" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_tutorials_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_tutorials_v_version_schritte" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"ueberschrift" varchar,
  	"text" varchar,
  	"bild_motiv" varchar,
  	"bild_format" "enum__tutorials_v_version_schritte_bild_format" DEFAULT '4/3',
  	"bild_bild_id" integer,
  	"bild_hinweis" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tutorials_v_version_erscheint_auf" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__tutorials_v_version_erscheint_auf",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_tutorials_v_version_seo_interne_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tutorials_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titel" varchar,
  	"version_kurzantwort" varchar,
  	"version_thema" "enum__tutorials_v_version_thema",
  	"version_video_youtube" varchar,
  	"version_video_titel" varchar,
  	"version_video_dauer" varchar,
  	"version_video_datum" timestamp(3) with time zone,
  	"version_video_vorschaubild_id" integer,
  	"version_video_transkript" varchar,
  	"version_ratgeber_id" integer,
  	"version_reihenfolge" numeric DEFAULT 100,
  	"version_seo_titel" varchar,
  	"version_seo_beschreibung" varchar,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_seo_social_bild_motiv" varchar,
  	"version_seo_social_bild_format" "enum__tutorials_v_version_seo_social_bild_format" DEFAULT '16/9',
  	"version_seo_social_bild_bild_id" integer,
  	"version_seo_social_bild_hinweis" varchar,
  	"version_slug" varchar,
  	"version_kennung" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__tutorials_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tutorials_id" integer;
  ALTER TABLE "tutorials_schritte" ADD CONSTRAINT "tutorials_schritte_bild_bild_id_medien_id_fk" FOREIGN KEY ("bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tutorials_schritte" ADD CONSTRAINT "tutorials_schritte_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tutorials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tutorials_erscheint_auf" ADD CONSTRAINT "tutorials_erscheint_auf_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tutorials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tutorials_seo_interne_links" ADD CONSTRAINT "tutorials_seo_interne_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tutorials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tutorials" ADD CONSTRAINT "tutorials_video_vorschaubild_id_medien_id_fk" FOREIGN KEY ("video_vorschaubild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tutorials" ADD CONSTRAINT "tutorials_ratgeber_id_ratgeber_id_fk" FOREIGN KEY ("ratgeber_id") REFERENCES "public"."ratgeber"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tutorials" ADD CONSTRAINT "tutorials_seo_social_bild_bild_id_medien_id_fk" FOREIGN KEY ("seo_social_bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tutorials_v_version_schritte" ADD CONSTRAINT "_tutorials_v_version_schritte_bild_bild_id_medien_id_fk" FOREIGN KEY ("bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tutorials_v_version_schritte" ADD CONSTRAINT "_tutorials_v_version_schritte_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tutorials_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tutorials_v_version_erscheint_auf" ADD CONSTRAINT "_tutorials_v_version_erscheint_auf_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_tutorials_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tutorials_v_version_seo_interne_links" ADD CONSTRAINT "_tutorials_v_version_seo_interne_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tutorials_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tutorials_v" ADD CONSTRAINT "_tutorials_v_parent_id_tutorials_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tutorials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tutorials_v" ADD CONSTRAINT "_tutorials_v_version_video_vorschaubild_id_medien_id_fk" FOREIGN KEY ("version_video_vorschaubild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tutorials_v" ADD CONSTRAINT "_tutorials_v_version_ratgeber_id_ratgeber_id_fk" FOREIGN KEY ("version_ratgeber_id") REFERENCES "public"."ratgeber"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tutorials_v" ADD CONSTRAINT "_tutorials_v_version_seo_social_bild_bild_id_medien_id_fk" FOREIGN KEY ("version_seo_social_bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "tutorials_schritte_order_idx" ON "tutorials_schritte" USING btree ("_order");
  CREATE INDEX "tutorials_schritte_parent_id_idx" ON "tutorials_schritte" USING btree ("_parent_id");
  CREATE INDEX "tutorials_schritte_bild_bild_bild_idx" ON "tutorials_schritte" USING btree ("bild_bild_id");
  CREATE INDEX "tutorials_erscheint_auf_order_idx" ON "tutorials_erscheint_auf" USING btree ("order");
  CREATE INDEX "tutorials_erscheint_auf_parent_idx" ON "tutorials_erscheint_auf" USING btree ("parent_id");
  CREATE INDEX "tutorials_seo_interne_links_order_idx" ON "tutorials_seo_interne_links" USING btree ("_order");
  CREATE INDEX "tutorials_seo_interne_links_parent_id_idx" ON "tutorials_seo_interne_links" USING btree ("_parent_id");
  CREATE INDEX "tutorials_video_video_vorschaubild_idx" ON "tutorials" USING btree ("video_vorschaubild_id");
  CREATE INDEX "tutorials_ratgeber_idx" ON "tutorials" USING btree ("ratgeber_id");
  CREATE INDEX "tutorials_seo_social_bild_seo_social_bild_bild_idx" ON "tutorials" USING btree ("seo_social_bild_bild_id");
  CREATE UNIQUE INDEX "tutorials_slug_idx" ON "tutorials" USING btree ("slug");
  CREATE UNIQUE INDEX "tutorials_kennung_idx" ON "tutorials" USING btree ("kennung");
  CREATE INDEX "tutorials_updated_at_idx" ON "tutorials" USING btree ("updated_at");
  CREATE INDEX "tutorials_created_at_idx" ON "tutorials" USING btree ("created_at");
  CREATE INDEX "tutorials_deleted_at_idx" ON "tutorials" USING btree ("deleted_at");
  CREATE INDEX "tutorials__status_idx" ON "tutorials" USING btree ("_status");
  CREATE INDEX "_tutorials_v_version_schritte_order_idx" ON "_tutorials_v_version_schritte" USING btree ("_order");
  CREATE INDEX "_tutorials_v_version_schritte_parent_id_idx" ON "_tutorials_v_version_schritte" USING btree ("_parent_id");
  CREATE INDEX "_tutorials_v_version_schritte_bild_bild_bild_idx" ON "_tutorials_v_version_schritte" USING btree ("bild_bild_id");
  CREATE INDEX "_tutorials_v_version_erscheint_auf_order_idx" ON "_tutorials_v_version_erscheint_auf" USING btree ("order");
  CREATE INDEX "_tutorials_v_version_erscheint_auf_parent_idx" ON "_tutorials_v_version_erscheint_auf" USING btree ("parent_id");
  CREATE INDEX "_tutorials_v_version_seo_interne_links_order_idx" ON "_tutorials_v_version_seo_interne_links" USING btree ("_order");
  CREATE INDEX "_tutorials_v_version_seo_interne_links_parent_id_idx" ON "_tutorials_v_version_seo_interne_links" USING btree ("_parent_id");
  CREATE INDEX "_tutorials_v_parent_idx" ON "_tutorials_v" USING btree ("parent_id");
  CREATE INDEX "_tutorials_v_version_video_version_video_vorschaubild_idx" ON "_tutorials_v" USING btree ("version_video_vorschaubild_id");
  CREATE INDEX "_tutorials_v_version_version_ratgeber_idx" ON "_tutorials_v" USING btree ("version_ratgeber_id");
  CREATE INDEX "_tutorials_v_version_seo_social_bild_version_seo_social__idx" ON "_tutorials_v" USING btree ("version_seo_social_bild_bild_id");
  CREATE INDEX "_tutorials_v_version_version_slug_idx" ON "_tutorials_v" USING btree ("version_slug");
  CREATE INDEX "_tutorials_v_version_version_kennung_idx" ON "_tutorials_v" USING btree ("version_kennung");
  CREATE INDEX "_tutorials_v_version_version_updated_at_idx" ON "_tutorials_v" USING btree ("version_updated_at");
  CREATE INDEX "_tutorials_v_version_version_created_at_idx" ON "_tutorials_v" USING btree ("version_created_at");
  CREATE INDEX "_tutorials_v_version_version_deleted_at_idx" ON "_tutorials_v" USING btree ("version_deleted_at");
  CREATE INDEX "_tutorials_v_version_version__status_idx" ON "_tutorials_v" USING btree ("version__status");
  CREATE INDEX "_tutorials_v_created_at_idx" ON "_tutorials_v" USING btree ("created_at");
  CREATE INDEX "_tutorials_v_updated_at_idx" ON "_tutorials_v" USING btree ("updated_at");
  CREATE INDEX "_tutorials_v_latest_idx" ON "_tutorials_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tutorials_fk" FOREIGN KEY ("tutorials_id") REFERENCES "public"."tutorials"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_tutorials_id_idx" ON "payload_locked_documents_rels" USING btree ("tutorials_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Reihenfolge der Abnahme: zuerst Fremdschlüssel, Indizes und Spalten (IF EXISTS), dann die Tabellen, zuletzt die Typen.
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_tutorials_fk";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_tutorials_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "tutorials_id";
  DROP TABLE IF EXISTS "tutorials_schritte" CASCADE;
  DROP TABLE IF EXISTS "tutorials_erscheint_auf" CASCADE;
  DROP TABLE IF EXISTS "tutorials_seo_interne_links" CASCADE;
  DROP TABLE IF EXISTS "_tutorials_v_version_schritte" CASCADE;
  DROP TABLE IF EXISTS "_tutorials_v_version_erscheint_auf" CASCADE;
  DROP TABLE IF EXISTS "_tutorials_v_version_seo_interne_links" CASCADE;
  DROP TABLE IF EXISTS "_tutorials_v" CASCADE;
  DROP TABLE IF EXISTS "tutorials" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_tutorials_schritte_bild_format";
  DROP TYPE IF EXISTS "public"."enum_tutorials_erscheint_auf";
  DROP TYPE IF EXISTS "public"."enum_tutorials_thema";
  DROP TYPE IF EXISTS "public"."enum_tutorials_seo_social_bild_format";
  DROP TYPE IF EXISTS "public"."enum_tutorials_status";
  DROP TYPE IF EXISTS "public"."enum__tutorials_v_version_schritte_bild_format";
  DROP TYPE IF EXISTS "public"."enum__tutorials_v_version_erscheint_auf";
  DROP TYPE IF EXISTS "public"."enum__tutorials_v_version_thema";
  DROP TYPE IF EXISTS "public"."enum__tutorials_v_version_seo_social_bild_format";
  DROP TYPE IF EXISTS "public"."enum__tutorials_v_version_status";`)
}
