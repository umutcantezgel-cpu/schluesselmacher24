import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_partnerbetriebe_auftragsarten" AS ENUM('autoschluessel-vor-ort', 'schluesseldienst-vor-ort', 'montage-zylinder', 'montage-schliessanlage', 'beratung-vor-ort', 'einbau-elektronik');
  CREATE TYPE "public"."enum_partnerbetriebe_provisionen_auftragsart" AS ENUM('autoschluessel-vor-ort', 'schluesseldienst-vor-ort', 'montage-zylinder', 'montage-schliessanlage', 'beratung-vor-ort', 'einbau-elektronik');
  CREATE TYPE "public"."enum_partnerbetriebe_status" AS ENUM('eingegangen', 'in-pruefung', 'nachweise-fehlen', 'vertrag-versendet', 'vertrag-unterschrieben', 'freigeschaltet', 'pausiert', 'abgelehnt', 'beendet');
  CREATE TYPE "public"."enum_partnerbetriebe_abrechnungsmodell" AS ENUM('A', 'B');
  CREATE TABLE "partnerbetriebe_auftragsarten" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_partnerbetriebe_auftragsarten",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "partnerbetriebe_provisionen" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"auftragsart" "enum_partnerbetriebe_provisionen_auftragsart" NOT NULL,
  	"prozent" numeric,
  	"festbetrag" numeric
  );
  
  CREATE TABLE "partnerbetriebe" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"firma" varchar NOT NULL,
  	"ansprechpartner" varchar,
  	"email" varchar,
  	"telefon" varchar,
  	"ort" varchar NOT NULL,
  	"status" "enum_partnerbetriebe_status" DEFAULT 'eingegangen' NOT NULL,
  	"abrechnungsmodell" "enum_partnerbetriebe_abrechnungsmodell" DEFAULT 'A' NOT NULL,
  	"einsatzgebiet_postleitzahlen" varchar,
  	"einsatzgebiet_radius_km" numeric,
  	"pruefung_gewerbe_geprueft" boolean,
  	"pruefung_identitaet_geprueft" boolean,
  	"pruefung_eignung_geprueft" boolean,
  	"pruefung_notiz" varchar,
  	"vertrag_versendet_am" timestamp(3) with time zone,
  	"vertrag_unterschrieben_am" timestamp(3) with time zone,
  	"vertrag_datei_id" integer,
  	"bewerbung_id" integer,
  	"notiz" varchar,
  	"kennung" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "partnerbetriebe_id" integer;
  ALTER TABLE "partnerbetriebe_auftragsarten" ADD CONSTRAINT "partnerbetriebe_auftragsarten_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."partnerbetriebe"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partnerbetriebe_provisionen" ADD CONSTRAINT "partnerbetriebe_provisionen_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partnerbetriebe"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partnerbetriebe" ADD CONSTRAINT "partnerbetriebe_vertrag_datei_id_interne_dateien_id_fk" FOREIGN KEY ("vertrag_datei_id") REFERENCES "public"."interne_dateien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partnerbetriebe" ADD CONSTRAINT "partnerbetriebe_bewerbung_id_vorgaenge_id_fk" FOREIGN KEY ("bewerbung_id") REFERENCES "public"."vorgaenge"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "partnerbetriebe_auftragsarten_order_idx" ON "partnerbetriebe_auftragsarten" USING btree ("order");
  CREATE INDEX "partnerbetriebe_auftragsarten_parent_idx" ON "partnerbetriebe_auftragsarten" USING btree ("parent_id");
  CREATE INDEX "partnerbetriebe_provisionen_order_idx" ON "partnerbetriebe_provisionen" USING btree ("_order");
  CREATE INDEX "partnerbetriebe_provisionen_parent_id_idx" ON "partnerbetriebe_provisionen" USING btree ("_parent_id");
  CREATE INDEX "partnerbetriebe_status_idx" ON "partnerbetriebe" USING btree ("status");
  CREATE INDEX "partnerbetriebe_vertrag_vertrag_datei_idx" ON "partnerbetriebe" USING btree ("vertrag_datei_id");
  CREATE INDEX "partnerbetriebe_bewerbung_idx" ON "partnerbetriebe" USING btree ("bewerbung_id");
  CREATE UNIQUE INDEX "partnerbetriebe_kennung_idx" ON "partnerbetriebe" USING btree ("kennung");
  CREATE INDEX "partnerbetriebe_updated_at_idx" ON "partnerbetriebe" USING btree ("updated_at");
  CREATE INDEX "partnerbetriebe_created_at_idx" ON "partnerbetriebe" USING btree ("created_at");
  CREATE INDEX "partnerbetriebe_deleted_at_idx" ON "partnerbetriebe" USING btree ("deleted_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partnerbetriebe_fk" FOREIGN KEY ("partnerbetriebe_id") REFERENCES "public"."partnerbetriebe"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_partnerbetriebe_id_idx" ON "payload_locked_documents_rels" USING btree ("partnerbetriebe_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "partnerbetriebe_auftragsarten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partnerbetriebe_provisionen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partnerbetriebe" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "partnerbetriebe_auftragsarten" CASCADE;
  DROP TABLE "partnerbetriebe_provisionen" CASCADE;
  DROP TABLE "partnerbetriebe" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_partnerbetriebe_fk";
  
  DROP INDEX "payload_locked_documents_rels_partnerbetriebe_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "partnerbetriebe_id";
  DROP TYPE "public"."enum_partnerbetriebe_auftragsarten";
  DROP TYPE "public"."enum_partnerbetriebe_provisionen_auftragsart";
  DROP TYPE "public"."enum_partnerbetriebe_status";
  DROP TYPE "public"."enum_partnerbetriebe_abrechnungsmodell";`)
}
