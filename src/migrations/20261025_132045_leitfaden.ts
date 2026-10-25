import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Leitfaden-Ausbau (Erg. Leitfaden 2026-10-08), nur Schema: Foto-Freigabe
 * (Status „freigegeben“/„nicht-moeglich“, Gruppe `freigabe`), Vermittlung an
 * Partnerbetriebe (Gruppe `vermittlung`, Art `partner`), Mail-Arten
 * „erinnerung“/„freigabe“/„team-hinweis“, Termin-Erinnerung in den
 * Einstellungen, SEO und Einleitung je Fahrzeugmarke und -modell, Profil und
 * Codeserie der Artikel, Hersteller im Zylinderkatalog.
 *
 * Erzeugt mit `payload migrate:create`. Neue Enum-Werte (`ADD VALUE`) sind
 * erst nach dem Abschluss dieser Transaktion nutzbar — Daten ändert deshalb
 * erst `20261025_132935_leitfaden_daten`.
 */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_vorgaenge_vermittlung_status" AS ENUM('neu', 'geprueft', 'partner-angefragt', 'angenommen', 'erledigt', 'provision-abgerechnet');
  CREATE TYPE "public"."enum_fahrzeugmarken_seo_social_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum__fahrzeugmarken_v_version_seo_social_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_zylinderkatalog_hersteller_bauformen" AS ENUM('doppelzylinder', 'knaufzylinder', 'halbzylinder');
  ALTER TYPE "public"."enum_vorgaenge_mails_art" ADD VALUE 'erinnerung' BEFORE 'sonstige';
  ALTER TYPE "public"."enum_vorgaenge_mails_art" ADD VALUE 'freigabe' BEFORE 'sonstige';
  ALTER TYPE "public"."enum_vorgaenge_mails_art" ADD VALUE 'team-hinweis' BEFORE 'sonstige';
  ALTER TYPE "public"."enum_vorgaenge_art" ADD VALUE 'partner';
  ALTER TYPE "public"."enum_vorgaenge_status" ADD VALUE 'freigegeben' BEFORE 'wartet-auf-kunde';
  ALTER TYPE "public"."enum_vorgaenge_status" ADD VALUE 'nicht-moeglich' BEFORE 'in-fertigung';
  CREATE TABLE "fahrzeugmarken_seo_interne_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "_fahrzeugmarken_v_version_seo_interne_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "zylinderkatalog_hersteller_bauformen" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_zylinderkatalog_hersteller_bauformen",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "zylinderkatalog_hersteller_zusatzkomponenten" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"preis" numeric NOT NULL,
  	"beschreibung" varchar
  );
  
  CREATE TABLE "zylinderkatalog_hersteller" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"kennung" varchar NOT NULL,
  	"aktiv" boolean DEFAULT false,
  	"beschreibung" varchar,
  	"aufpreis_je_zylinder" numeric
  );
  
  ALTER TABLE "vorgaenge" ADD COLUMN "freigabe_preis_cent" numeric;
  ALTER TABLE "vorgaenge" ADD COLUMN "freigabe_einsenden_noetig" boolean;
  ALTER TABLE "vorgaenge" ADD COLUMN "freigabe_freigegeben_am" timestamp(3) with time zone;
  ALTER TABLE "vorgaenge" ADD COLUMN "freigabe_hinweis" varchar;
  ALTER TABLE "vorgaenge" ADD COLUMN "vermittlung_status" "enum_vorgaenge_vermittlung_status";
  ALTER TABLE "vorgaenge" ADD COLUMN "vermittlung_partner_id" integer;
  ALTER TABLE "vorgaenge" ADD COLUMN "vermittlung_provision_cent" numeric;
  ALTER TABLE "vorgaenge" ADD COLUMN "vermittlung_notiz" varchar;
  ALTER TABLE "produkte" ADD COLUMN "profil" varchar;
  ALTER TABLE "produkte" ADD COLUMN "codeserie" varchar;
  ALTER TABLE "_produkte_v" ADD COLUMN "version_profil" varchar;
  ALTER TABLE "_produkte_v" ADD COLUMN "version_codeserie" varchar;
  ALTER TABLE "fahrzeugmarken_modelle" ADD COLUMN "einleitung" varchar;
  ALTER TABLE "fahrzeugmarken_modelle" ADD COLUMN "seo_titel" varchar;
  ALTER TABLE "fahrzeugmarken_modelle" ADD COLUMN "seo_beschreibung" varchar;
  ALTER TABLE "fahrzeugmarken_modelle" ADD COLUMN "seo_noindex" boolean DEFAULT false;
  ALTER TABLE "fahrzeugmarken" ADD COLUMN "seo_titel" varchar;
  ALTER TABLE "fahrzeugmarken" ADD COLUMN "seo_beschreibung" varchar;
  ALTER TABLE "fahrzeugmarken" ADD COLUMN "seo_noindex" boolean DEFAULT false;
  ALTER TABLE "fahrzeugmarken" ADD COLUMN "seo_social_bild_motiv" varchar;
  ALTER TABLE "fahrzeugmarken" ADD COLUMN "seo_social_bild_format" "enum_fahrzeugmarken_seo_social_bild_format" DEFAULT '16/9';
  ALTER TABLE "fahrzeugmarken" ADD COLUMN "seo_social_bild_bild_id" integer;
  ALTER TABLE "fahrzeugmarken" ADD COLUMN "seo_social_bild_hinweis" varchar;
  ALTER TABLE "_fahrzeugmarken_v_version_modelle" ADD COLUMN "einleitung" varchar;
  ALTER TABLE "_fahrzeugmarken_v_version_modelle" ADD COLUMN "seo_titel" varchar;
  ALTER TABLE "_fahrzeugmarken_v_version_modelle" ADD COLUMN "seo_beschreibung" varchar;
  ALTER TABLE "_fahrzeugmarken_v_version_modelle" ADD COLUMN "seo_noindex" boolean DEFAULT false;
  ALTER TABLE "_fahrzeugmarken_v" ADD COLUMN "version_seo_titel" varchar;
  ALTER TABLE "_fahrzeugmarken_v" ADD COLUMN "version_seo_beschreibung" varchar;
  ALTER TABLE "_fahrzeugmarken_v" ADD COLUMN "version_seo_noindex" boolean DEFAULT false;
  ALTER TABLE "_fahrzeugmarken_v" ADD COLUMN "version_seo_social_bild_motiv" varchar;
  ALTER TABLE "_fahrzeugmarken_v" ADD COLUMN "version_seo_social_bild_format" "enum__fahrzeugmarken_v_version_seo_social_bild_format" DEFAULT '16/9';
  ALTER TABLE "_fahrzeugmarken_v" ADD COLUMN "version_seo_social_bild_bild_id" integer;
  ALTER TABLE "_fahrzeugmarken_v" ADD COLUMN "version_seo_social_bild_hinweis" varchar;
  ALTER TABLE "einstellungen" ADD COLUMN "buchung_erinnerung_tage_vorher" numeric DEFAULT 1;
  ALTER TABLE "fahrzeugmarken_seo_interne_links" ADD CONSTRAINT "fahrzeugmarken_seo_interne_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fahrzeugmarken"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_fahrzeugmarken_v_version_seo_interne_links" ADD CONSTRAINT "_fahrzeugmarken_v_version_seo_interne_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_fahrzeugmarken_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "zylinderkatalog_hersteller_bauformen" ADD CONSTRAINT "zylinderkatalog_hersteller_bauformen_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."zylinderkatalog_hersteller"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "zylinderkatalog_hersteller_zusatzkomponenten" ADD CONSTRAINT "zylinderkatalog_hersteller_zusatzkomponenten_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."zylinderkatalog_hersteller"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "zylinderkatalog_hersteller" ADD CONSTRAINT "zylinderkatalog_hersteller_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."zylinderkatalog"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "fahrzeugmarken_seo_interne_links_order_idx" ON "fahrzeugmarken_seo_interne_links" USING btree ("_order");
  CREATE INDEX "fahrzeugmarken_seo_interne_links_parent_id_idx" ON "fahrzeugmarken_seo_interne_links" USING btree ("_parent_id");
  CREATE INDEX "_fahrzeugmarken_v_version_seo_interne_links_order_idx" ON "_fahrzeugmarken_v_version_seo_interne_links" USING btree ("_order");
  CREATE INDEX "_fahrzeugmarken_v_version_seo_interne_links_parent_id_idx" ON "_fahrzeugmarken_v_version_seo_interne_links" USING btree ("_parent_id");
  CREATE INDEX "zylinderkatalog_hersteller_bauformen_order_idx" ON "zylinderkatalog_hersteller_bauformen" USING btree ("order");
  CREATE INDEX "zylinderkatalog_hersteller_bauformen_parent_idx" ON "zylinderkatalog_hersteller_bauformen" USING btree ("parent_id");
  CREATE INDEX "zylinderkatalog_hersteller_zusatzkomponenten_order_idx" ON "zylinderkatalog_hersteller_zusatzkomponenten" USING btree ("_order");
  CREATE INDEX "zylinderkatalog_hersteller_zusatzkomponenten_parent_id_idx" ON "zylinderkatalog_hersteller_zusatzkomponenten" USING btree ("_parent_id");
  CREATE INDEX "zylinderkatalog_hersteller_order_idx" ON "zylinderkatalog_hersteller" USING btree ("_order");
  CREATE INDEX "zylinderkatalog_hersteller_parent_id_idx" ON "zylinderkatalog_hersteller" USING btree ("_parent_id");
  ALTER TABLE "vorgaenge" ADD CONSTRAINT "vorgaenge_vermittlung_partner_id_vorgaenge_id_fk" FOREIGN KEY ("vermittlung_partner_id") REFERENCES "public"."vorgaenge"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "fahrzeugmarken" ADD CONSTRAINT "fahrzeugmarken_seo_social_bild_bild_id_medien_id_fk" FOREIGN KEY ("seo_social_bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_fahrzeugmarken_v" ADD CONSTRAINT "_fahrzeugmarken_v_version_seo_social_bild_bild_id_medien_id_fk" FOREIGN KEY ("version_seo_social_bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "vorgaenge_vermittlung_vermittlung_status_idx" ON "vorgaenge" USING btree ("vermittlung_status");
  CREATE INDEX "vorgaenge_vermittlung_vermittlung_partner_idx" ON "vorgaenge" USING btree ("vermittlung_partner_id");
  CREATE INDEX "fahrzeugmarken_seo_social_bild_seo_social_bild_bild_idx" ON "fahrzeugmarken" USING btree ("seo_social_bild_bild_id");
  CREATE INDEX "_fahrzeugmarken_v_version_seo_social_bild_version_seo_so_idx" ON "_fahrzeugmarken_v" USING btree ("version_seo_social_bild_bild_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "fahrzeugmarken_seo_interne_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_fahrzeugmarken_v_version_seo_interne_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "zylinderkatalog_hersteller_bauformen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "zylinderkatalog_hersteller_zusatzkomponenten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "zylinderkatalog_hersteller" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "fahrzeugmarken_seo_interne_links" CASCADE;
  DROP TABLE "_fahrzeugmarken_v_version_seo_interne_links" CASCADE;
  DROP TABLE "zylinderkatalog_hersteller_bauformen" CASCADE;
  DROP TABLE "zylinderkatalog_hersteller_zusatzkomponenten" CASCADE;
  DROP TABLE "zylinderkatalog_hersteller" CASCADE;
  ALTER TABLE "vorgaenge" DROP CONSTRAINT "vorgaenge_vermittlung_partner_id_vorgaenge_id_fk";
  
  ALTER TABLE "fahrzeugmarken" DROP CONSTRAINT "fahrzeugmarken_seo_social_bild_bild_id_medien_id_fk";
  
  ALTER TABLE "_fahrzeugmarken_v" DROP CONSTRAINT "_fahrzeugmarken_v_version_seo_social_bild_bild_id_medien_id_fk";
  
  ALTER TABLE "vorgaenge_mails" ALTER COLUMN "art" SET DATA TYPE text;
  DROP TYPE "public"."enum_vorgaenge_mails_art";
  CREATE TYPE "public"."enum_vorgaenge_mails_art" AS ENUM('eingang-kunde', 'eingang-team', 'vertrag', 'zahlung-erhalten', 'zahlung-nicht-abgeschlossen', 'erstattung', 'status', 'widerruf', 'sonstige');
  ALTER TABLE "vorgaenge_mails" ALTER COLUMN "art" SET DATA TYPE "public"."enum_vorgaenge_mails_art" USING "art"::"public"."enum_vorgaenge_mails_art";
  ALTER TABLE "vorgaenge" ALTER COLUMN "art" SET DATA TYPE text;
  DROP TYPE "public"."enum_vorgaenge_art";
  CREATE TYPE "public"."enum_vorgaenge_art" AS ENUM('bestellung', 'anfrage', 'termin', 'projekt');
  ALTER TABLE "vorgaenge" ALTER COLUMN "art" SET DATA TYPE "public"."enum_vorgaenge_art" USING "art"::"public"."enum_vorgaenge_art";
  ALTER TABLE "vorgaenge" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "vorgaenge" ALTER COLUMN "status" SET DEFAULT 'neu'::text;
  DROP TYPE "public"."enum_vorgaenge_status";
  CREATE TYPE "public"."enum_vorgaenge_status" AS ENUM('neu', 'in-pruefung', 'geprueft', 'wartet-auf-kunde', 'in-fertigung', 'terminiert', 'versendet', 'abgeschlossen', 'storniert');
  ALTER TABLE "vorgaenge" ALTER COLUMN "status" SET DEFAULT 'neu'::"public"."enum_vorgaenge_status";
  ALTER TABLE "vorgaenge" ALTER COLUMN "status" SET DATA TYPE "public"."enum_vorgaenge_status" USING "status"::"public"."enum_vorgaenge_status";
  DROP INDEX "vorgaenge_vermittlung_vermittlung_status_idx";
  DROP INDEX "vorgaenge_vermittlung_vermittlung_partner_idx";
  DROP INDEX "fahrzeugmarken_seo_social_bild_seo_social_bild_bild_idx";
  DROP INDEX "_fahrzeugmarken_v_version_seo_social_bild_version_seo_so_idx";
  ALTER TABLE "vorgaenge" DROP COLUMN "freigabe_preis_cent";
  ALTER TABLE "vorgaenge" DROP COLUMN "freigabe_einsenden_noetig";
  ALTER TABLE "vorgaenge" DROP COLUMN "freigabe_freigegeben_am";
  ALTER TABLE "vorgaenge" DROP COLUMN "freigabe_hinweis";
  ALTER TABLE "vorgaenge" DROP COLUMN "vermittlung_status";
  ALTER TABLE "vorgaenge" DROP COLUMN "vermittlung_partner_id";
  ALTER TABLE "vorgaenge" DROP COLUMN "vermittlung_provision_cent";
  ALTER TABLE "vorgaenge" DROP COLUMN "vermittlung_notiz";
  ALTER TABLE "produkte" DROP COLUMN "profil";
  ALTER TABLE "produkte" DROP COLUMN "codeserie";
  ALTER TABLE "_produkte_v" DROP COLUMN "version_profil";
  ALTER TABLE "_produkte_v" DROP COLUMN "version_codeserie";
  ALTER TABLE "fahrzeugmarken_modelle" DROP COLUMN "einleitung";
  ALTER TABLE "fahrzeugmarken_modelle" DROP COLUMN "seo_titel";
  ALTER TABLE "fahrzeugmarken_modelle" DROP COLUMN "seo_beschreibung";
  ALTER TABLE "fahrzeugmarken_modelle" DROP COLUMN "seo_noindex";
  ALTER TABLE "fahrzeugmarken" DROP COLUMN "seo_titel";
  ALTER TABLE "fahrzeugmarken" DROP COLUMN "seo_beschreibung";
  ALTER TABLE "fahrzeugmarken" DROP COLUMN "seo_noindex";
  ALTER TABLE "fahrzeugmarken" DROP COLUMN "seo_social_bild_motiv";
  ALTER TABLE "fahrzeugmarken" DROP COLUMN "seo_social_bild_format";
  ALTER TABLE "fahrzeugmarken" DROP COLUMN "seo_social_bild_bild_id";
  ALTER TABLE "fahrzeugmarken" DROP COLUMN "seo_social_bild_hinweis";
  ALTER TABLE "_fahrzeugmarken_v_version_modelle" DROP COLUMN "einleitung";
  ALTER TABLE "_fahrzeugmarken_v_version_modelle" DROP COLUMN "seo_titel";
  ALTER TABLE "_fahrzeugmarken_v_version_modelle" DROP COLUMN "seo_beschreibung";
  ALTER TABLE "_fahrzeugmarken_v_version_modelle" DROP COLUMN "seo_noindex";
  ALTER TABLE "_fahrzeugmarken_v" DROP COLUMN "version_seo_titel";
  ALTER TABLE "_fahrzeugmarken_v" DROP COLUMN "version_seo_beschreibung";
  ALTER TABLE "_fahrzeugmarken_v" DROP COLUMN "version_seo_noindex";
  ALTER TABLE "_fahrzeugmarken_v" DROP COLUMN "version_seo_social_bild_motiv";
  ALTER TABLE "_fahrzeugmarken_v" DROP COLUMN "version_seo_social_bild_format";
  ALTER TABLE "_fahrzeugmarken_v" DROP COLUMN "version_seo_social_bild_bild_id";
  ALTER TABLE "_fahrzeugmarken_v" DROP COLUMN "version_seo_social_bild_hinweis";
  ALTER TABLE "einstellungen" DROP COLUMN "buchung_erinnerung_tage_vorher";
  DROP TYPE "public"."enum_vorgaenge_vermittlung_status";
  DROP TYPE "public"."enum_fahrzeugmarken_seo_social_bild_format";
  DROP TYPE "public"."enum__fahrzeugmarken_v_version_seo_social_bild_format";
  DROP TYPE "public"."enum_zylinderkatalog_hersteller_bauformen";`)
}
