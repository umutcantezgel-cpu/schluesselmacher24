import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_vorgaenge_lead_verlauf_ergebnis" AS ENUM('zugeteilt', 'angeboten', 'angenommen', 'abgelehnt', 'zurueckgezogen', 'zur-klaerung');
  CREATE TYPE "public"."enum_vorgaenge_zuordnung_rueckgabe" AS ENUM('abgelehnt', 'zurueckgezogen');
  CREATE TYPE "public"."enum_partnerbetriebe_einsatzgebiet_regionen_art" AS ENUM('ort', 'landkreis');
  CREATE TYPE "public"."enum_partnerbetriebe_pruefliste_besuch_ergebnis" AS ENUM('geeignet', 'auflagen', 'nicht-geeignet');
  ALTER TYPE "public"."enum_partnerbetriebe_status" ADD VALUE 'gesperrt' BEFORE 'abgelehnt';
  CREATE TABLE "vorgaenge_lead_verlauf" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"partnerbetrieb_id" integer,
  	"am" timestamp(3) with time zone NOT NULL,
  	"von" varchar,
  	"ergebnis" "enum_vorgaenge_lead_verlauf_ergebnis" NOT NULL,
  	"notiz" varchar
  );
  
  CREATE TABLE "partnerbetriebe_einsatzgebiet_regionen" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"art" "enum_partnerbetriebe_einsatzgebiet_regionen_art" NOT NULL,
  	"name" varchar NOT NULL,
  	"schluessel" varchar
  );
  
  CREATE TABLE "partnerbetriebe_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"interne_dateien_id" integer
  );
  
  ALTER TABLE "vorgaenge" ADD COLUMN "zuordnung_rueckgabe" "enum_vorgaenge_zuordnung_rueckgabe";
  ALTER TABLE "vorgaenge" ADD COLUMN "zuordnung_notiz" varchar;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_vor_einfuehrung" boolean;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_identitaet_erledigt" boolean;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_identitaet_am" timestamp(3) with time zone;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_identitaet_pruefer" varchar;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_identitaet_notiz" varchar;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_leistungsumfang_erledigt" boolean;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_leistungsumfang_am" timestamp(3) with time zone;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_leistungsumfang_pruefer" varchar;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_leistungsumfang_notiz" varchar;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_ausstattung_erledigt" boolean;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_ausstattung_am" timestamp(3) with time zone;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_ausstattung_pruefer" varchar;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_ausstattung_notiz" varchar;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_region_erledigt" boolean;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_region_am" timestamp(3) with time zone;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_region_pruefer" varchar;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_region_notiz" varchar;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_besuch_am" timestamp(3) with time zone;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_besuch_pruefer" varchar;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_besuch_ergebnis" "enum_partnerbetriebe_pruefliste_besuch_ergebnis";
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_besuch_notiz" varchar;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_besuch_nicht_moeglich" boolean;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_besuch_nicht_moeglich_grund" varchar;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_standard_erledigt" boolean;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_standard_am" timestamp(3) with time zone;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_standard_pruefer" varchar;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_standard_notiz" varchar;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_standard_datei_id" integer;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "pruefliste_standard_vertragsverweis" varchar;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "sperre_grund" varchar;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "sperre_seit" timestamp(3) with time zone;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "sperre_von" varchar;
  ALTER TABLE "vorgaenge_lead_verlauf" ADD CONSTRAINT "vorgaenge_lead_verlauf_partnerbetrieb_id_partnerbetriebe_id_fk" FOREIGN KEY ("partnerbetrieb_id") REFERENCES "public"."partnerbetriebe"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vorgaenge_lead_verlauf" ADD CONSTRAINT "vorgaenge_lead_verlauf_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vorgaenge"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partnerbetriebe_einsatzgebiet_regionen" ADD CONSTRAINT "partnerbetriebe_einsatzgebiet_regionen_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partnerbetriebe"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partnerbetriebe_rels" ADD CONSTRAINT "partnerbetriebe_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."partnerbetriebe"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partnerbetriebe_rels" ADD CONSTRAINT "partnerbetriebe_rels_interne_dateien_fk" FOREIGN KEY ("interne_dateien_id") REFERENCES "public"."interne_dateien"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "vorgaenge_lead_verlauf_order_idx" ON "vorgaenge_lead_verlauf" USING btree ("_order");
  CREATE INDEX "vorgaenge_lead_verlauf_parent_id_idx" ON "vorgaenge_lead_verlauf" USING btree ("_parent_id");
  CREATE INDEX "vorgaenge_lead_verlauf_partnerbetrieb_idx" ON "vorgaenge_lead_verlauf" USING btree ("partnerbetrieb_id");
  CREATE INDEX "partnerbetriebe_einsatzgebiet_regionen_order_idx" ON "partnerbetriebe_einsatzgebiet_regionen" USING btree ("_order");
  CREATE INDEX "partnerbetriebe_einsatzgebiet_regionen_parent_id_idx" ON "partnerbetriebe_einsatzgebiet_regionen" USING btree ("_parent_id");
  CREATE INDEX "partnerbetriebe_rels_order_idx" ON "partnerbetriebe_rels" USING btree ("order");
  CREATE INDEX "partnerbetriebe_rels_parent_idx" ON "partnerbetriebe_rels" USING btree ("parent_id");
  CREATE INDEX "partnerbetriebe_rels_path_idx" ON "partnerbetriebe_rels" USING btree ("path");
  CREATE INDEX "partnerbetriebe_rels_interne_dateien_id_idx" ON "partnerbetriebe_rels" USING btree ("interne_dateien_id");
  ALTER TABLE "partnerbetriebe" ADD CONSTRAINT "partnerbetriebe_pruefliste_standard_datei_id_interne_dateien_id_fk" FOREIGN KEY ("pruefliste_standard_datei_id") REFERENCES "public"."interne_dateien"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "partnerbetriebe_pruefliste_standard_pruefliste_standard__idx" ON "partnerbetriebe" USING btree ("pruefliste_standard_datei_id");`)
  // FA-PLATTFORM-01B: Betriebe, die vor der Prüfliste freigeschaltet oder pausiert waren, bleiben es (G6). Nur die
  // neue Spalte wird gesetzt; die Prüfliste zeigt bei ihnen „vor Einführung der Prüfliste freigeschaltet“.
  await db.execute(sql`
   UPDATE "partnerbetriebe" SET "pruefliste_vor_einfuehrung" = true WHERE "status" IN ('freigeschaltet', 'pausiert');`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "vorgaenge_lead_verlauf" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partnerbetriebe_einsatzgebiet_regionen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partnerbetriebe_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "vorgaenge_lead_verlauf" CASCADE;
  DROP TABLE "partnerbetriebe_einsatzgebiet_regionen" CASCADE;
  DROP TABLE "partnerbetriebe_rels" CASCADE;
  ALTER TABLE "partnerbetriebe" DROP CONSTRAINT "partnerbetriebe_pruefliste_standard_datei_id_interne_dateien_id_fk";
  
  ALTER TABLE "partnerbetriebe" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "partnerbetriebe" ALTER COLUMN "status" SET DEFAULT 'eingegangen'::text;
  DROP TYPE "public"."enum_partnerbetriebe_status";
  CREATE TYPE "public"."enum_partnerbetriebe_status" AS ENUM('eingegangen', 'in-pruefung', 'nachweise-fehlen', 'vertrag-versendet', 'vertrag-unterschrieben', 'freigeschaltet', 'pausiert', 'abgelehnt', 'beendet');
  ALTER TABLE "partnerbetriebe" ALTER COLUMN "status" SET DEFAULT 'eingegangen'::"public"."enum_partnerbetriebe_status";
  ALTER TABLE "partnerbetriebe" ALTER COLUMN "status" SET DATA TYPE "public"."enum_partnerbetriebe_status" USING "status"::"public"."enum_partnerbetriebe_status";
  DROP INDEX "partnerbetriebe_pruefliste_standard_pruefliste_standard__idx";
  ALTER TABLE "vorgaenge" DROP COLUMN "zuordnung_rueckgabe";
  ALTER TABLE "vorgaenge" DROP COLUMN "zuordnung_notiz";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_vor_einfuehrung";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_identitaet_erledigt";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_identitaet_am";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_identitaet_pruefer";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_identitaet_notiz";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_leistungsumfang_erledigt";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_leistungsumfang_am";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_leistungsumfang_pruefer";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_leistungsumfang_notiz";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_ausstattung_erledigt";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_ausstattung_am";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_ausstattung_pruefer";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_ausstattung_notiz";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_region_erledigt";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_region_am";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_region_pruefer";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_region_notiz";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_besuch_am";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_besuch_pruefer";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_besuch_ergebnis";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_besuch_notiz";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_besuch_nicht_moeglich";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_besuch_nicht_moeglich_grund";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_standard_erledigt";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_standard_am";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_standard_pruefer";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_standard_notiz";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_standard_datei_id";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "pruefliste_standard_vertragsverweis";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "sperre_grund";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "sperre_seit";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "sperre_von";
  DROP TYPE "public"."enum_vorgaenge_lead_verlauf_ergebnis";
  DROP TYPE "public"."enum_vorgaenge_zuordnung_rueckgabe";
  DROP TYPE "public"."enum_partnerbetriebe_einsatzgebiet_regionen_art";
  DROP TYPE "public"."enum_partnerbetriebe_pruefliste_besuch_ergebnis";`)
}
