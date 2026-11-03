import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_rubriken_ablauf_icon" AS ENUM('alarmtechnik', 'anzahlung', 'aussenhautsicherung', 'autoschluessel', 'beratung-telefon', 'datenschutz', 'einsteckschloss', 'elektronische-zutrittsloesungen', 'fahrzeugmarke', 'fahrzeugoeffnung', 'foto-hochladen', 'funkschluessel', 'gleichschliessende-zylinder', 'halbzylinder', 'klappschluessel', 'knaufzylinder', 'kombinierte-konzepte', 'lieferung', 'mechanischer-schutz', 'mehrfachverriegelung', 'montage', 'nachweis', 'panik-alarmtaster', 'panik-fluchttuer', 'profilzylinder', 'pruefung', 'reparatur-austausch', 'rueckgabe', 'schliessanlagen', 'schluessel-kopieren', 'schluessel-nach-code', 'schluessel-nach-vorlage', 'schluessel-programmieren', 'schluesselbart-fraesen', 'schutzbeschlag', 'service-und-termin', 'sicherheitscheck', 'sicherheitstechnik', 'sicherungskarte', 'smart-key', 'smarte-funktionen', 'standort', 'technische-beratung', 'termin', 'transponder', 'tuer-und-schliesstechnik', 'tuerschliesser', 'tuerzusatzschloss', 'versand-paket', 'videoueberwachung', 'warenkorb', 'werkstatt', 'zahlung', 'zylinder-mass', 'motorradschluessel', 'schluesselgehaeuse', 'transponder-kopie', 'schluesselfinder', 'vor-ort', 'karte', 'video', 'dokument');
  CREATE TYPE "public"."enum_rubriken_pflicht_uploads" AS ENUM('schluesselfoto', 'fahrzeugschein', 'grundriss', 'dokument', 'objektfoto');
  CREATE TYPE "public"."enum_rubriken_icon" AS ENUM('alarmtechnik', 'anzahlung', 'aussenhautsicherung', 'autoschluessel', 'beratung-telefon', 'datenschutz', 'einsteckschloss', 'elektronische-zutrittsloesungen', 'fahrzeugmarke', 'fahrzeugoeffnung', 'foto-hochladen', 'funkschluessel', 'gleichschliessende-zylinder', 'halbzylinder', 'klappschluessel', 'knaufzylinder', 'kombinierte-konzepte', 'lieferung', 'mechanischer-schutz', 'mehrfachverriegelung', 'montage', 'nachweis', 'panik-alarmtaster', 'panik-fluchttuer', 'profilzylinder', 'pruefung', 'reparatur-austausch', 'rueckgabe', 'schliessanlagen', 'schluessel-kopieren', 'schluessel-nach-code', 'schluessel-nach-vorlage', 'schluessel-programmieren', 'schluesselbart-fraesen', 'schutzbeschlag', 'service-und-termin', 'sicherheitscheck', 'sicherheitstechnik', 'sicherungskarte', 'smart-key', 'smarte-funktionen', 'standort', 'technische-beratung', 'termin', 'transponder', 'tuer-und-schliesstechnik', 'tuerschliesser', 'tuerzusatzschloss', 'versand-paket', 'videoueberwachung', 'warenkorb', 'werkstatt', 'zahlung', 'zylinder-mass', 'motorradschluessel', 'schluesselgehaeuse', 'transponder-kopie', 'schluesselfinder', 'vor-ort', 'karte', 'video', 'dokument');
  CREATE TYPE "public"."enum_rubriken_bereich" AS ENUM('autoschluessel', 'schluessel-nach-vorlage', 'schluessel-nach-code', 'gleichschliessende-zylinder', 'schliessanlagen', 'elektronische-zutrittsloesungen', 'tuer-und-schliesstechnik', 'sicherheitstechnik', 'service-und-termin');
  CREATE TYPE "public"."enum_rubriken_abschluss" AS ENUM('kasse', 'anfrage', 'termin-anzahlung', 'angebot-zahlungslink', 'beratung');
  CREATE TYPE "public"."enum_rubriken_nachweis" AS ENUM('keiner', 'fahrzeugschein', 'sicherungskarte');
  CREATE TYPE "public"."enum_rubriken_status" AS ENUM('live', 'spaeter', 'aus');
  CREATE TYPE "public"."enum_rubriken_navigation" AS ENUM('autoschluessel', 'code', 'sperrschliessung', 'schliessanlagen', 'mehr');
  CREATE TYPE "public"."enum__rubriken_v_version_ablauf_icon" AS ENUM('alarmtechnik', 'anzahlung', 'aussenhautsicherung', 'autoschluessel', 'beratung-telefon', 'datenschutz', 'einsteckschloss', 'elektronische-zutrittsloesungen', 'fahrzeugmarke', 'fahrzeugoeffnung', 'foto-hochladen', 'funkschluessel', 'gleichschliessende-zylinder', 'halbzylinder', 'klappschluessel', 'knaufzylinder', 'kombinierte-konzepte', 'lieferung', 'mechanischer-schutz', 'mehrfachverriegelung', 'montage', 'nachweis', 'panik-alarmtaster', 'panik-fluchttuer', 'profilzylinder', 'pruefung', 'reparatur-austausch', 'rueckgabe', 'schliessanlagen', 'schluessel-kopieren', 'schluessel-nach-code', 'schluessel-nach-vorlage', 'schluessel-programmieren', 'schluesselbart-fraesen', 'schutzbeschlag', 'service-und-termin', 'sicherheitscheck', 'sicherheitstechnik', 'sicherungskarte', 'smart-key', 'smarte-funktionen', 'standort', 'technische-beratung', 'termin', 'transponder', 'tuer-und-schliesstechnik', 'tuerschliesser', 'tuerzusatzschloss', 'versand-paket', 'videoueberwachung', 'warenkorb', 'werkstatt', 'zahlung', 'zylinder-mass', 'motorradschluessel', 'schluesselgehaeuse', 'transponder-kopie', 'schluesselfinder', 'vor-ort', 'karte', 'video', 'dokument');
  CREATE TYPE "public"."enum__rubriken_v_version_pflicht_uploads" AS ENUM('schluesselfoto', 'fahrzeugschein', 'grundriss', 'dokument', 'objektfoto');
  CREATE TYPE "public"."enum__rubriken_v_version_icon" AS ENUM('alarmtechnik', 'anzahlung', 'aussenhautsicherung', 'autoschluessel', 'beratung-telefon', 'datenschutz', 'einsteckschloss', 'elektronische-zutrittsloesungen', 'fahrzeugmarke', 'fahrzeugoeffnung', 'foto-hochladen', 'funkschluessel', 'gleichschliessende-zylinder', 'halbzylinder', 'klappschluessel', 'knaufzylinder', 'kombinierte-konzepte', 'lieferung', 'mechanischer-schutz', 'mehrfachverriegelung', 'montage', 'nachweis', 'panik-alarmtaster', 'panik-fluchttuer', 'profilzylinder', 'pruefung', 'reparatur-austausch', 'rueckgabe', 'schliessanlagen', 'schluessel-kopieren', 'schluessel-nach-code', 'schluessel-nach-vorlage', 'schluessel-programmieren', 'schluesselbart-fraesen', 'schutzbeschlag', 'service-und-termin', 'sicherheitscheck', 'sicherheitstechnik', 'sicherungskarte', 'smart-key', 'smarte-funktionen', 'standort', 'technische-beratung', 'termin', 'transponder', 'tuer-und-schliesstechnik', 'tuerschliesser', 'tuerzusatzschloss', 'versand-paket', 'videoueberwachung', 'warenkorb', 'werkstatt', 'zahlung', 'zylinder-mass', 'motorradschluessel', 'schluesselgehaeuse', 'transponder-kopie', 'schluesselfinder', 'vor-ort', 'karte', 'video', 'dokument');
  CREATE TYPE "public"."enum__rubriken_v_version_bereich" AS ENUM('autoschluessel', 'schluessel-nach-vorlage', 'schluessel-nach-code', 'gleichschliessende-zylinder', 'schliessanlagen', 'elektronische-zutrittsloesungen', 'tuer-und-schliesstechnik', 'sicherheitstechnik', 'service-und-termin');
  CREATE TYPE "public"."enum__rubriken_v_version_abschluss" AS ENUM('kasse', 'anfrage', 'termin-anzahlung', 'angebot-zahlungslink', 'beratung');
  CREATE TYPE "public"."enum__rubriken_v_version_nachweis" AS ENUM('keiner', 'fahrzeugschein', 'sicherungskarte');
  CREATE TYPE "public"."enum__rubriken_v_version_status" AS ENUM('live', 'spaeter', 'aus');
  CREATE TYPE "public"."enum__rubriken_v_version_navigation" AS ENUM('autoschluessel', 'code', 'sperrschliessung', 'schliessanlagen', 'mehr');
  CREATE TABLE "rubriken_ablauf" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"icon" "enum_rubriken_ablauf_icon" NOT NULL
  );
  
  CREATE TABLE "rubriken_pflicht_uploads" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_rubriken_pflicht_uploads",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "rubriken" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"laienname" varchar NOT NULL,
  	"zusatz" varchar,
  	"erklaerung" varchar NOT NULL,
  	"icon" "enum_rubriken_icon" NOT NULL,
  	"ziel" varchar NOT NULL,
  	"bereich" "enum_rubriken_bereich" NOT NULL,
  	"abschluss" "enum_rubriken_abschluss" NOT NULL,
  	"nachweis" "enum_rubriken_nachweis" DEFAULT 'keiner' NOT NULL,
  	"status" "enum_rubriken_status" DEFAULT 'spaeter' NOT NULL,
  	"reihenfolge" numeric DEFAULT 100 NOT NULL,
  	"navigation" "enum_rubriken_navigation" NOT NULL,
  	"im_hub" boolean DEFAULT true,
  	"kennung" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_rubriken_v_version_ablauf" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"icon" "enum__rubriken_v_version_ablauf_icon" NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_rubriken_v_version_pflicht_uploads" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__rubriken_v_version_pflicht_uploads",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_rubriken_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar NOT NULL,
  	"version_laienname" varchar NOT NULL,
  	"version_zusatz" varchar,
  	"version_erklaerung" varchar NOT NULL,
  	"version_icon" "enum__rubriken_v_version_icon" NOT NULL,
  	"version_ziel" varchar NOT NULL,
  	"version_bereich" "enum__rubriken_v_version_bereich" NOT NULL,
  	"version_abschluss" "enum__rubriken_v_version_abschluss" NOT NULL,
  	"version_nachweis" "enum__rubriken_v_version_nachweis" DEFAULT 'keiner' NOT NULL,
  	"version_status" "enum__rubriken_v_version_status" DEFAULT 'spaeter' NOT NULL,
  	"version_reihenfolge" numeric DEFAULT 100 NOT NULL,
  	"version_navigation" "enum__rubriken_v_version_navigation" NOT NULL,
  	"version_im_hub" boolean DEFAULT true,
  	"version_kennung" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "rubriken_id" integer;
  ALTER TABLE "rubriken_ablauf" ADD CONSTRAINT "rubriken_ablauf_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rubriken"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rubriken_pflicht_uploads" ADD CONSTRAINT "rubriken_pflicht_uploads_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."rubriken"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_rubriken_v_version_ablauf" ADD CONSTRAINT "_rubriken_v_version_ablauf_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_rubriken_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_rubriken_v_version_pflicht_uploads" ADD CONSTRAINT "_rubriken_v_version_pflicht_uploads_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_rubriken_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_rubriken_v" ADD CONSTRAINT "_rubriken_v_parent_id_rubriken_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."rubriken"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "rubriken_ablauf_order_idx" ON "rubriken_ablauf" USING btree ("_order");
  CREATE INDEX "rubriken_ablauf_parent_id_idx" ON "rubriken_ablauf" USING btree ("_parent_id");
  CREATE INDEX "rubriken_pflicht_uploads_order_idx" ON "rubriken_pflicht_uploads" USING btree ("order");
  CREATE INDEX "rubriken_pflicht_uploads_parent_idx" ON "rubriken_pflicht_uploads" USING btree ("parent_id");
  CREATE UNIQUE INDEX "rubriken_kennung_idx" ON "rubriken" USING btree ("kennung");
  CREATE INDEX "rubriken_updated_at_idx" ON "rubriken" USING btree ("updated_at");
  CREATE INDEX "rubriken_created_at_idx" ON "rubriken" USING btree ("created_at");
  CREATE INDEX "rubriken_deleted_at_idx" ON "rubriken" USING btree ("deleted_at");
  CREATE INDEX "_rubriken_v_version_ablauf_order_idx" ON "_rubriken_v_version_ablauf" USING btree ("_order");
  CREATE INDEX "_rubriken_v_version_ablauf_parent_id_idx" ON "_rubriken_v_version_ablauf" USING btree ("_parent_id");
  CREATE INDEX "_rubriken_v_version_pflicht_uploads_order_idx" ON "_rubriken_v_version_pflicht_uploads" USING btree ("order");
  CREATE INDEX "_rubriken_v_version_pflicht_uploads_parent_idx" ON "_rubriken_v_version_pflicht_uploads" USING btree ("parent_id");
  CREATE INDEX "_rubriken_v_parent_idx" ON "_rubriken_v" USING btree ("parent_id");
  CREATE INDEX "_rubriken_v_version_version_kennung_idx" ON "_rubriken_v" USING btree ("version_kennung");
  CREATE INDEX "_rubriken_v_version_version_updated_at_idx" ON "_rubriken_v" USING btree ("version_updated_at");
  CREATE INDEX "_rubriken_v_version_version_created_at_idx" ON "_rubriken_v" USING btree ("version_created_at");
  CREATE INDEX "_rubriken_v_version_version_deleted_at_idx" ON "_rubriken_v" USING btree ("version_deleted_at");
  CREATE INDEX "_rubriken_v_created_at_idx" ON "_rubriken_v" USING btree ("created_at");
  CREATE INDEX "_rubriken_v_updated_at_idx" ON "_rubriken_v" USING btree ("updated_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_rubriken_fk" FOREIGN KEY ("rubriken_id") REFERENCES "public"."rubriken"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_rubriken_id_idx" ON "payload_locked_documents_rels" USING btree ("rubriken_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "rubriken_ablauf" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "rubriken_pflicht_uploads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "rubriken" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_rubriken_v_version_ablauf" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_rubriken_v_version_pflicht_uploads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_rubriken_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "rubriken_ablauf" CASCADE;
  DROP TABLE "rubriken_pflicht_uploads" CASCADE;
  DROP TABLE "rubriken" CASCADE;
  DROP TABLE "_rubriken_v_version_ablauf" CASCADE;
  DROP TABLE "_rubriken_v_version_pflicht_uploads" CASCADE;
  DROP TABLE "_rubriken_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_rubriken_fk";
  
  DROP INDEX "payload_locked_documents_rels_rubriken_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "rubriken_id";
  DROP TYPE "public"."enum_rubriken_ablauf_icon";
  DROP TYPE "public"."enum_rubriken_pflicht_uploads";
  DROP TYPE "public"."enum_rubriken_icon";
  DROP TYPE "public"."enum_rubriken_bereich";
  DROP TYPE "public"."enum_rubriken_abschluss";
  DROP TYPE "public"."enum_rubriken_nachweis";
  DROP TYPE "public"."enum_rubriken_status";
  DROP TYPE "public"."enum_rubriken_navigation";
  DROP TYPE "public"."enum__rubriken_v_version_ablauf_icon";
  DROP TYPE "public"."enum__rubriken_v_version_pflicht_uploads";
  DROP TYPE "public"."enum__rubriken_v_version_icon";
  DROP TYPE "public"."enum__rubriken_v_version_bereich";
  DROP TYPE "public"."enum__rubriken_v_version_abschluss";
  DROP TYPE "public"."enum__rubriken_v_version_nachweis";
  DROP TYPE "public"."enum__rubriken_v_version_status";
  DROP TYPE "public"."enum__rubriken_v_version_navigation";`)
}
