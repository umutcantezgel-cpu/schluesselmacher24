import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_vorgaenge_positionen_art" AS ENUM('code-schluessel', 'zylinder-schliessung', 'standard');
  CREATE TYPE "public"."enum_kundendateien_kategorie" AS ENUM('schluesselfoto', 'fahrzeugschein', 'grundriss', 'dokument', 'objektfoto');
  CREATE TYPE "public"."enum_nachweise_art" AS ENUM('zertifikat', 'norm', 'schulung', 'versicherung', 'mitgliedschaft');
  CREATE TYPE "public"."enum_nachweise_status" AS ENUM('bereithalten', 'liegt-vor', 'abgelaufen');
  CREATE TYPE "public"."enum_nachweise_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_richtwerte_service_einsatz_leistungen_einheit" AS ENUM('pauschal', 'je-tuer');
  CREATE TABLE "vorgaenge_positionen" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"bezeichnung" varchar NOT NULL,
  	"kennung" varchar NOT NULL,
  	"art" "enum_vorgaenge_positionen_art" NOT NULL,
  	"details" varchar,
  	"menge" numeric NOT NULL,
  	"einzelpreis_cent" numeric NOT NULL,
  	"summe_cent" numeric NOT NULL,
  	"steuersatz" numeric NOT NULL
  );
  
  CREATE TABLE "vorgaenge_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"kundendateien_id" integer
  );
  
  CREATE TABLE "kundendateien" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kategorie" "enum_kundendateien_kategorie" NOT NULL,
  	"vorgang_id" integer,
  	"aufbewahren_bis" timestamp(3) with time zone,
  	"upload_schluessel_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "nachweise" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"art" "enum_nachweise_art" NOT NULL,
  	"status" "enum_nachweise_status" DEFAULT 'bereithalten' NOT NULL,
  	"beschreibung" varchar,
  	"aussteller" varchar,
  	"gueltig_bis" timestamp(3) with time zone,
  	"bild_motiv" varchar,
  	"bild_format" "enum_nachweise_bild_format" DEFAULT '4/3',
  	"bild_bild_id" integer,
  	"bild_hinweis" varchar,
  	"oeffentlich" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "webhook_ereignisse" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ereignis_id" varchar NOT NULL,
  	"anbieter" varchar DEFAULT 'stripe' NOT NULL,
  	"typ" varchar NOT NULL,
  	"vorgang_id" integer,
  	"ergebnis" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "richtwerte_tuer_absicherung_tuerarten" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kennung" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"beschreibung" varchar,
  	"preis_von" numeric,
  	"preis_bis" numeric
  );
  
  CREATE TABLE "richtwerte_tuer_absicherung_massnahmen" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kennung" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"beschreibung" varchar,
  	"preis_von" numeric,
  	"preis_bis" numeric
  );
  
  CREATE TABLE "richtwerte_service_einsatz_leistungen" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kennung" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"einheit" "enum_richtwerte_service_einsatz_leistungen_einheit" DEFAULT 'pauschal' NOT NULL,
  	"beschreibung" varchar,
  	"preis_von" numeric,
  	"preis_bis" numeric
  );
  
  CREATE TABLE "richtwerte" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"platzhalter" boolean DEFAULT true,
  	"hinweis" varchar DEFAULT 'Unverbindliche Orientierung. Der tatsächliche Preis hängt von Tür, Einbausituation und Material ab und steht erst nach unserer Prüfung fest.',
  	"service_einsatz_anfahrt_von" numeric,
  	"service_einsatz_anfahrt_bis" numeric,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "vorgaenge" ADD COLUMN "summen_artikel_cent" numeric;
  ALTER TABLE "vorgaenge" ADD COLUMN "summen_versand_cent" numeric;
  ALTER TABLE "vorgaenge" ADD COLUMN "summen_gesamt_cent" numeric;
  ALTER TABLE "vorgaenge" ADD COLUMN "summen_steuer_cent" numeric;
  ALTER TABLE "vorgaenge" ADD COLUMN "summen_versandart" varchar;
  ALTER TABLE "vorgaenge" ADD COLUMN "zahlung_checkout_sitzung" varchar;
  ALTER TABLE "vorgaenge" ADD COLUMN "zahlung_erstattet_cent" numeric;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "kundendateien_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "nachweise_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "webhook_ereignisse_id" integer;
  ALTER TABLE "vorgaenge_positionen" ADD CONSTRAINT "vorgaenge_positionen_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vorgaenge"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vorgaenge_rels" ADD CONSTRAINT "vorgaenge_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."vorgaenge"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vorgaenge_rels" ADD CONSTRAINT "vorgaenge_rels_kundendateien_fk" FOREIGN KEY ("kundendateien_id") REFERENCES "public"."kundendateien"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "kundendateien" ADD CONSTRAINT "kundendateien_vorgang_id_vorgaenge_id_fk" FOREIGN KEY ("vorgang_id") REFERENCES "public"."vorgaenge"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "nachweise" ADD CONSTRAINT "nachweise_bild_bild_id_medien_id_fk" FOREIGN KEY ("bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "webhook_ereignisse" ADD CONSTRAINT "webhook_ereignisse_vorgang_id_vorgaenge_id_fk" FOREIGN KEY ("vorgang_id") REFERENCES "public"."vorgaenge"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "richtwerte_tuer_absicherung_tuerarten" ADD CONSTRAINT "richtwerte_tuer_absicherung_tuerarten_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."richtwerte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "richtwerte_tuer_absicherung_massnahmen" ADD CONSTRAINT "richtwerte_tuer_absicherung_massnahmen_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."richtwerte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "richtwerte_service_einsatz_leistungen" ADD CONSTRAINT "richtwerte_service_einsatz_leistungen_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."richtwerte"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "vorgaenge_positionen_order_idx" ON "vorgaenge_positionen" USING btree ("_order");
  CREATE INDEX "vorgaenge_positionen_parent_id_idx" ON "vorgaenge_positionen" USING btree ("_parent_id");
  CREATE INDEX "vorgaenge_positionen_kennung_idx" ON "vorgaenge_positionen" USING btree ("kennung");
  CREATE INDEX "vorgaenge_rels_order_idx" ON "vorgaenge_rels" USING btree ("order");
  CREATE INDEX "vorgaenge_rels_parent_idx" ON "vorgaenge_rels" USING btree ("parent_id");
  CREATE INDEX "vorgaenge_rels_path_idx" ON "vorgaenge_rels" USING btree ("path");
  CREATE INDEX "vorgaenge_rels_kundendateien_id_idx" ON "vorgaenge_rels" USING btree ("kundendateien_id");
  CREATE INDEX "kundendateien_vorgang_idx" ON "kundendateien" USING btree ("vorgang_id");
  CREATE INDEX "kundendateien_aufbewahren_bis_idx" ON "kundendateien" USING btree ("aufbewahren_bis");
  CREATE INDEX "kundendateien_updated_at_idx" ON "kundendateien" USING btree ("updated_at");
  CREATE INDEX "kundendateien_created_at_idx" ON "kundendateien" USING btree ("created_at");
  CREATE UNIQUE INDEX "kundendateien_filename_idx" ON "kundendateien" USING btree ("filename");
  CREATE INDEX "nachweise_bild_bild_bild_idx" ON "nachweise" USING btree ("bild_bild_id");
  CREATE INDEX "nachweise_updated_at_idx" ON "nachweise" USING btree ("updated_at");
  CREATE INDEX "nachweise_created_at_idx" ON "nachweise" USING btree ("created_at");
  CREATE INDEX "nachweise_deleted_at_idx" ON "nachweise" USING btree ("deleted_at");
  CREATE UNIQUE INDEX "webhook_ereignisse_ereignis_id_idx" ON "webhook_ereignisse" USING btree ("ereignis_id");
  CREATE INDEX "webhook_ereignisse_vorgang_idx" ON "webhook_ereignisse" USING btree ("vorgang_id");
  CREATE INDEX "webhook_ereignisse_updated_at_idx" ON "webhook_ereignisse" USING btree ("updated_at");
  CREATE INDEX "webhook_ereignisse_created_at_idx" ON "webhook_ereignisse" USING btree ("created_at");
  CREATE INDEX "richtwerte_tuer_absicherung_tuerarten_order_idx" ON "richtwerte_tuer_absicherung_tuerarten" USING btree ("_order");
  CREATE INDEX "richtwerte_tuer_absicherung_tuerarten_parent_id_idx" ON "richtwerte_tuer_absicherung_tuerarten" USING btree ("_parent_id");
  CREATE INDEX "richtwerte_tuer_absicherung_massnahmen_order_idx" ON "richtwerte_tuer_absicherung_massnahmen" USING btree ("_order");
  CREATE INDEX "richtwerte_tuer_absicherung_massnahmen_parent_id_idx" ON "richtwerte_tuer_absicherung_massnahmen" USING btree ("_parent_id");
  CREATE INDEX "richtwerte_service_einsatz_leistungen_order_idx" ON "richtwerte_service_einsatz_leistungen" USING btree ("_order");
  CREATE INDEX "richtwerte_service_einsatz_leistungen_parent_id_idx" ON "richtwerte_service_einsatz_leistungen" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_kundendateien_fk" FOREIGN KEY ("kundendateien_id") REFERENCES "public"."kundendateien"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_nachweise_fk" FOREIGN KEY ("nachweise_id") REFERENCES "public"."nachweise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_webhook_ereignisse_fk" FOREIGN KEY ("webhook_ereignisse_id") REFERENCES "public"."webhook_ereignisse"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "vorgaenge_zahlung_zahlung_checkout_sitzung_idx" ON "vorgaenge" USING btree ("zahlung_checkout_sitzung");
  CREATE INDEX "payload_locked_documents_rels_kundendateien_id_idx" ON "payload_locked_documents_rels" USING btree ("kundendateien_id");
  CREATE INDEX "payload_locked_documents_rels_nachweise_id_idx" ON "payload_locked_documents_rels" USING btree ("nachweise_id");
  CREATE INDEX "payload_locked_documents_rels_webhook_ereignisse_id_idx" ON "payload_locked_documents_rels" USING btree ("webhook_ereignisse_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "vorgaenge_positionen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vorgaenge_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "kundendateien" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nachweise" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "webhook_ereignisse" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "richtwerte_tuer_absicherung_tuerarten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "richtwerte_tuer_absicherung_massnahmen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "richtwerte_service_einsatz_leistungen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "richtwerte" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "vorgaenge_positionen" CASCADE;
  DROP TABLE "vorgaenge_rels" CASCADE;
  DROP TABLE "kundendateien" CASCADE;
  DROP TABLE "nachweise" CASCADE;
  DROP TABLE "webhook_ereignisse" CASCADE;
  DROP TABLE "richtwerte_tuer_absicherung_tuerarten" CASCADE;
  DROP TABLE "richtwerte_tuer_absicherung_massnahmen" CASCADE;
  DROP TABLE "richtwerte_service_einsatz_leistungen" CASCADE;
  DROP TABLE "richtwerte" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_kundendateien_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_nachweise_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_webhook_ereignisse_fk";
  
  DROP INDEX "vorgaenge_zahlung_zahlung_checkout_sitzung_idx";
  DROP INDEX "payload_locked_documents_rels_kundendateien_id_idx";
  DROP INDEX "payload_locked_documents_rels_nachweise_id_idx";
  DROP INDEX "payload_locked_documents_rels_webhook_ereignisse_id_idx";
  ALTER TABLE "vorgaenge" DROP COLUMN "summen_artikel_cent";
  ALTER TABLE "vorgaenge" DROP COLUMN "summen_versand_cent";
  ALTER TABLE "vorgaenge" DROP COLUMN "summen_gesamt_cent";
  ALTER TABLE "vorgaenge" DROP COLUMN "summen_steuer_cent";
  ALTER TABLE "vorgaenge" DROP COLUMN "summen_versandart";
  ALTER TABLE "vorgaenge" DROP COLUMN "zahlung_checkout_sitzung";
  ALTER TABLE "vorgaenge" DROP COLUMN "zahlung_erstattet_cent";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "kundendateien_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "nachweise_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "webhook_ereignisse_id";
  DROP TYPE "public"."enum_vorgaenge_positionen_art";
  DROP TYPE "public"."enum_kundendateien_kategorie";
  DROP TYPE "public"."enum_nachweise_art";
  DROP TYPE "public"."enum_nachweise_status";
  DROP TYPE "public"."enum_nachweise_bild_format";
  DROP TYPE "public"."enum_richtwerte_service_einsatz_leistungen_einheit";`)
}
