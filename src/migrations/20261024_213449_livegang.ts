import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Livegang: Zahlung (Ablauf, Index auf die Zahlungskennung), Mailprotokoll,
 * Versand, Zustimmungen, Kundenbenachrichtigung, Firmenangaben fürs
 * Impressum, Rechtstexte, Bundesland, Lieferzeiten, GPSR-Angaben, Widerrufe,
 * private interne Dateien und die Spalten der S3-Dateiablage.
 *
 * Erzeugt mit `payload migrate:create` (Dateiablage aktiv). Von Hand ergänzt:
 * Nachweis-Fotos zeigen künftig auf `interne_dateien` statt auf `medien`.
 * Bisherige Verweise werden geleert, sonst scheiterte der neue Fremdschlüssel
 * (es gibt noch keine Produktionsdaten; die Fotos lägen weiter in `medien`).
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_vorgaenge_mails_art" AS ENUM('eingang-kunde', 'eingang-team', 'vertrag', 'zahlung-erhalten', 'zahlung-nicht-abgeschlossen', 'erstattung', 'status', 'widerruf', 'sonstige');
  CREATE TYPE "public"."enum_vorgaenge_mails_ergebnis" AS ENUM('gesendet', 'fehlgeschlagen', 'nicht-eingerichtet');
  CREATE TYPE "public"."enum_vorgaenge_versand_dienstleister" AS ENUM('dhl', 'dpd', 'deutsche-post', 'hermes', 'gls', 'ups', 'sonstige');
  CREATE TYPE "public"."enum_widerrufe_zuordnung" AS ENUM('zugeordnet', 'zu-pruefen');
  CREATE TYPE "public"."enum_widerrufe_bestaetigung_ergebnis" AS ENUM('gesendet', 'fehlgeschlagen', 'nicht-eingerichtet');
  CREATE TYPE "public"."enum_einstellungen_firma_rechtsform" AS ENUM('einzelunternehmen', 'eingetragener-kaufmann', 'gmbh', 'ug');
  CREATE TYPE "public"."enum_einstellungen_buchung_bundesland" AS ENUM('BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH');
  CREATE TABLE "vorgaenge_mails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"art" "enum_vorgaenge_mails_art" NOT NULL,
  	"an" varchar NOT NULL,
  	"am" timestamp(3) with time zone NOT NULL,
  	"ergebnis" "enum_vorgaenge_mails_ergebnis" NOT NULL,
  	"anbieter_id" varchar,
  	"fehler" varchar
  );
  
  CREATE TABLE "widerrufe" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"email" varchar,
  	"vorgangsnummer" varchar,
  	"eingegangen_am" timestamp(3) with time zone NOT NULL,
  	"erklaerung" varchar,
  	"vorgang_id" integer,
  	"zuordnung" "enum_widerrufe_zuordnung" DEFAULT 'zu-pruefen',
  	"bearbeitet" boolean DEFAULT false,
  	"notiz" varchar,
  	"bestaetigung_ergebnis" "enum_widerrufe_bestaetigung_ergebnis",
  	"bestaetigung_am" timestamp(3) with time zone,
  	"bestaetigung_anbieter_id" varchar,
  	"bestaetigung_fehler" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "interne_dateien" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"beschreibung" varchar,
  	"prefix" varchar DEFAULT 'intern',
  	"_objectkey" varchar,
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
  
  ALTER TABLE "nachweise" DROP CONSTRAINT "nachweise_bild_bild_id_medien_id_fk";
  
  UPDATE "nachweise" SET "bild_bild_id" = NULL WHERE "bild_bild_id" IS NOT NULL;
  ALTER TABLE "vorgaenge" ADD COLUMN "kunde_informieren" boolean DEFAULT true;
  ALTER TABLE "vorgaenge" ADD COLUMN "nachricht_an_kunde" varchar;
  ALTER TABLE "vorgaenge" ADD COLUMN "zustimmungen_agb" boolean;
  ALTER TABLE "vorgaenge" ADD COLUMN "zustimmungen_widerrufsbelehrung" boolean;
  ALTER TABLE "vorgaenge" ADD COLUMN "zustimmungen_vorzeitiger_beginn" boolean;
  ALTER TABLE "vorgaenge" ADD COLUMN "zustimmungen_sonderanfertigung" boolean;
  ALTER TABLE "vorgaenge" ADD COLUMN "zustimmungen_anzahlung" boolean;
  ALTER TABLE "vorgaenge" ADD COLUMN "zustimmungen_berechtigung" boolean;
  ALTER TABLE "vorgaenge" ADD COLUMN "zustimmungen_am" timestamp(3) with time zone;
  ALTER TABLE "vorgaenge" ADD COLUMN "zustimmungen_fassung" varchar;
  ALTER TABLE "vorgaenge" ADD COLUMN "versand_dienstleister" "enum_vorgaenge_versand_dienstleister";
  ALTER TABLE "vorgaenge" ADD COLUMN "versand_sendungsnummer" varchar;
  ALTER TABLE "vorgaenge" ADD COLUMN "zahlung_ablauf_am" timestamp(3) with time zone;
  ALTER TABLE "kundendateien" ADD COLUMN "prefix" varchar DEFAULT 'kundendateien';
  ALTER TABLE "kundendateien" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "produkte" ADD COLUMN "gpsr_hersteller_name" varchar;
  ALTER TABLE "produkte" ADD COLUMN "gpsr_hersteller_anschrift" varchar;
  ALTER TABLE "produkte" ADD COLUMN "gpsr_hersteller_email" varchar;
  ALTER TABLE "produkte" ADD COLUMN "gpsr_hersteller_website" varchar;
  ALTER TABLE "produkte" ADD COLUMN "gpsr_produktkennung" varchar;
  ALTER TABLE "produkte" ADD COLUMN "gpsr_sicherheitshinweise" varchar;
  ALTER TABLE "_produkte_v" ADD COLUMN "version_gpsr_hersteller_name" varchar;
  ALTER TABLE "_produkte_v" ADD COLUMN "version_gpsr_hersteller_anschrift" varchar;
  ALTER TABLE "_produkte_v" ADD COLUMN "version_gpsr_hersteller_email" varchar;
  ALTER TABLE "_produkte_v" ADD COLUMN "version_gpsr_hersteller_website" varchar;
  ALTER TABLE "_produkte_v" ADD COLUMN "version_gpsr_produktkennung" varchar;
  ALTER TABLE "_produkte_v" ADD COLUMN "version_gpsr_sicherheitshinweise" varchar;
  ALTER TABLE "medien" ADD COLUMN "prefix" varchar DEFAULT 'medien';
  ALTER TABLE "medien" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "widerrufe_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "interne_dateien_id" integer;
  ALTER TABLE "zylinderkatalog" ADD COLUMN "gpsr_hersteller_name" varchar;
  ALTER TABLE "zylinderkatalog" ADD COLUMN "gpsr_hersteller_anschrift" varchar;
  ALTER TABLE "zylinderkatalog" ADD COLUMN "gpsr_hersteller_email" varchar;
  ALTER TABLE "zylinderkatalog" ADD COLUMN "gpsr_hersteller_website" varchar;
  ALTER TABLE "zylinderkatalog" ADD COLUMN "gpsr_produktkennung" varchar;
  ALTER TABLE "zylinderkatalog" ADD COLUMN "gpsr_sicherheitshinweise" varchar;
  ALTER TABLE "einstellungen_versand" ADD COLUMN "lieferzeit" varchar;
  ALTER TABLE "einstellungen" ADD COLUMN "firma_rechtsform" "enum_einstellungen_firma_rechtsform" DEFAULT 'einzelunternehmen';
  ALTER TABLE "einstellungen" ADD COLUMN "firma_inhaber" varchar;
  ALTER TABLE "einstellungen" ADD COLUMN "firma_steuernummer" varchar;
  ALTER TABLE "einstellungen" ADD COLUMN "firma_berufsbezeichnung" varchar;
  ALTER TABLE "einstellungen" ADD COLUMN "firma_kammer" varchar;
  ALTER TABLE "einstellungen" ADD COLUMN "firma_inhaltlich_verantwortlich" varchar;
  ALTER TABLE "einstellungen" ADD COLUMN "firma_standort_bezeichnung" varchar;
  ALTER TABLE "einstellungen" ADD COLUMN "firma_standort_strasse" varchar;
  ALTER TABLE "einstellungen" ADD COLUMN "firma_standort_plz" varchar;
  ALTER TABLE "einstellungen" ADD COLUMN "firma_standort_ort" varchar;
  ALTER TABLE "einstellungen" ADD COLUMN "buchung_bundesland" "enum_einstellungen_buchung_bundesland" DEFAULT 'HE';
  ALTER TABLE "einstellungen" ADD COLUMN "rechtstexte_agb" jsonb;
  ALTER TABLE "einstellungen" ADD COLUMN "rechtstexte_widerruf" jsonb;
  ALTER TABLE "einstellungen" ADD COLUMN "rechtstexte_datenschutz" jsonb;
  ALTER TABLE "einstellungen" ADD COLUMN "rechtstexte_versand_und_zahlung" jsonb;
  ALTER TABLE "vorgaenge_mails" ADD CONSTRAINT "vorgaenge_mails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vorgaenge"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "widerrufe" ADD CONSTRAINT "widerrufe_vorgang_id_vorgaenge_id_fk" FOREIGN KEY ("vorgang_id") REFERENCES "public"."vorgaenge"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "vorgaenge_mails_order_idx" ON "vorgaenge_mails" USING btree ("_order");
  CREATE INDEX "vorgaenge_mails_parent_id_idx" ON "vorgaenge_mails" USING btree ("_parent_id");
  CREATE INDEX "widerrufe_vorgangsnummer_idx" ON "widerrufe" USING btree ("vorgangsnummer");
  CREATE INDEX "widerrufe_eingegangen_am_idx" ON "widerrufe" USING btree ("eingegangen_am");
  CREATE INDEX "widerrufe_vorgang_idx" ON "widerrufe" USING btree ("vorgang_id");
  CREATE INDEX "widerrufe_updated_at_idx" ON "widerrufe" USING btree ("updated_at");
  CREATE INDEX "widerrufe_created_at_idx" ON "widerrufe" USING btree ("created_at");
  CREATE INDEX "interne_dateien_updated_at_idx" ON "interne_dateien" USING btree ("updated_at");
  CREATE INDEX "interne_dateien_created_at_idx" ON "interne_dateien" USING btree ("created_at");
  CREATE UNIQUE INDEX "interne_dateien_filename_idx" ON "interne_dateien" USING btree ("filename");
  ALTER TABLE "nachweise" ADD CONSTRAINT "nachweise_bild_bild_id_interne_dateien_id_fk" FOREIGN KEY ("bild_bild_id") REFERENCES "public"."interne_dateien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_widerrufe_fk" FOREIGN KEY ("widerrufe_id") REFERENCES "public"."widerrufe"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_interne_dateien_fk" FOREIGN KEY ("interne_dateien_id") REFERENCES "public"."interne_dateien"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "vorgaenge_zahlung_zahlung_anbieter_ref_idx" ON "vorgaenge" USING btree ("zahlung_anbieter_ref");
  CREATE INDEX "payload_locked_documents_rels_widerrufe_id_idx" ON "payload_locked_documents_rels" USING btree ("widerrufe_id");
  CREATE INDEX "payload_locked_documents_rels_interne_dateien_id_idx" ON "payload_locked_documents_rels" USING btree ("interne_dateien_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "vorgaenge_mails" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "widerrufe" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "interne_dateien" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "vorgaenge_mails" CASCADE;
  DROP TABLE "widerrufe" CASCADE;
  DROP TABLE "interne_dateien" CASCADE;
  ALTER TABLE "nachweise" DROP CONSTRAINT "nachweise_bild_bild_id_interne_dateien_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_widerrufe_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_interne_dateien_fk";
  
  DROP INDEX "vorgaenge_zahlung_zahlung_anbieter_ref_idx";
  DROP INDEX "payload_locked_documents_rels_widerrufe_id_idx";
  DROP INDEX "payload_locked_documents_rels_interne_dateien_id_idx";
  UPDATE "nachweise" SET "bild_bild_id" = NULL WHERE "bild_bild_id" IS NOT NULL;
  ALTER TABLE "nachweise" ADD CONSTRAINT "nachweise_bild_bild_id_medien_id_fk" FOREIGN KEY ("bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vorgaenge" DROP COLUMN "kunde_informieren";
  ALTER TABLE "vorgaenge" DROP COLUMN "nachricht_an_kunde";
  ALTER TABLE "vorgaenge" DROP COLUMN "zustimmungen_agb";
  ALTER TABLE "vorgaenge" DROP COLUMN "zustimmungen_widerrufsbelehrung";
  ALTER TABLE "vorgaenge" DROP COLUMN "zustimmungen_vorzeitiger_beginn";
  ALTER TABLE "vorgaenge" DROP COLUMN "zustimmungen_sonderanfertigung";
  ALTER TABLE "vorgaenge" DROP COLUMN "zustimmungen_anzahlung";
  ALTER TABLE "vorgaenge" DROP COLUMN "zustimmungen_berechtigung";
  ALTER TABLE "vorgaenge" DROP COLUMN "zustimmungen_am";
  ALTER TABLE "vorgaenge" DROP COLUMN "zustimmungen_fassung";
  ALTER TABLE "vorgaenge" DROP COLUMN "versand_dienstleister";
  ALTER TABLE "vorgaenge" DROP COLUMN "versand_sendungsnummer";
  ALTER TABLE "vorgaenge" DROP COLUMN "zahlung_ablauf_am";
  ALTER TABLE "kundendateien" DROP COLUMN "prefix";
  ALTER TABLE "kundendateien" DROP COLUMN "_objectkey";
  ALTER TABLE "produkte" DROP COLUMN "gpsr_hersteller_name";
  ALTER TABLE "produkte" DROP COLUMN "gpsr_hersteller_anschrift";
  ALTER TABLE "produkte" DROP COLUMN "gpsr_hersteller_email";
  ALTER TABLE "produkte" DROP COLUMN "gpsr_hersteller_website";
  ALTER TABLE "produkte" DROP COLUMN "gpsr_produktkennung";
  ALTER TABLE "produkte" DROP COLUMN "gpsr_sicherheitshinweise";
  ALTER TABLE "_produkte_v" DROP COLUMN "version_gpsr_hersteller_name";
  ALTER TABLE "_produkte_v" DROP COLUMN "version_gpsr_hersteller_anschrift";
  ALTER TABLE "_produkte_v" DROP COLUMN "version_gpsr_hersteller_email";
  ALTER TABLE "_produkte_v" DROP COLUMN "version_gpsr_hersteller_website";
  ALTER TABLE "_produkte_v" DROP COLUMN "version_gpsr_produktkennung";
  ALTER TABLE "_produkte_v" DROP COLUMN "version_gpsr_sicherheitshinweise";
  ALTER TABLE "medien" DROP COLUMN "prefix";
  ALTER TABLE "medien" DROP COLUMN "_objectkey";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "widerrufe_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "interne_dateien_id";
  ALTER TABLE "zylinderkatalog" DROP COLUMN "gpsr_hersteller_name";
  ALTER TABLE "zylinderkatalog" DROP COLUMN "gpsr_hersteller_anschrift";
  ALTER TABLE "zylinderkatalog" DROP COLUMN "gpsr_hersteller_email";
  ALTER TABLE "zylinderkatalog" DROP COLUMN "gpsr_hersteller_website";
  ALTER TABLE "zylinderkatalog" DROP COLUMN "gpsr_produktkennung";
  ALTER TABLE "zylinderkatalog" DROP COLUMN "gpsr_sicherheitshinweise";
  ALTER TABLE "einstellungen_versand" DROP COLUMN "lieferzeit";
  ALTER TABLE "einstellungen" DROP COLUMN "firma_rechtsform";
  ALTER TABLE "einstellungen" DROP COLUMN "firma_inhaber";
  ALTER TABLE "einstellungen" DROP COLUMN "firma_steuernummer";
  ALTER TABLE "einstellungen" DROP COLUMN "firma_berufsbezeichnung";
  ALTER TABLE "einstellungen" DROP COLUMN "firma_kammer";
  ALTER TABLE "einstellungen" DROP COLUMN "firma_inhaltlich_verantwortlich";
  ALTER TABLE "einstellungen" DROP COLUMN "firma_standort_bezeichnung";
  ALTER TABLE "einstellungen" DROP COLUMN "firma_standort_strasse";
  ALTER TABLE "einstellungen" DROP COLUMN "firma_standort_plz";
  ALTER TABLE "einstellungen" DROP COLUMN "firma_standort_ort";
  ALTER TABLE "einstellungen" DROP COLUMN "buchung_bundesland";
  ALTER TABLE "einstellungen" DROP COLUMN "rechtstexte_agb";
  ALTER TABLE "einstellungen" DROP COLUMN "rechtstexte_widerruf";
  ALTER TABLE "einstellungen" DROP COLUMN "rechtstexte_datenschutz";
  ALTER TABLE "einstellungen" DROP COLUMN "rechtstexte_versand_und_zahlung";
  DROP TYPE "public"."enum_vorgaenge_mails_art";
  DROP TYPE "public"."enum_vorgaenge_mails_ergebnis";
  DROP TYPE "public"."enum_vorgaenge_versand_dienstleister";
  DROP TYPE "public"."enum_widerrufe_zuordnung";
  DROP TYPE "public"."enum_widerrufe_bestaetigung_ergebnis";
  DROP TYPE "public"."enum_einstellungen_firma_rechtsform";
  DROP TYPE "public"."enum_einstellungen_buchung_bundesland";`)
}
