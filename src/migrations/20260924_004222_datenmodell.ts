import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_vorgaenge_notizen_von" AS ENUM('kunde', 'team', 'system');
  CREATE TYPE "public"."enum_vorgaenge_verlauf_von" AS ENUM('kunde', 'team', 'system');
  CREATE TYPE "public"."enum_vorgaenge_art" AS ENUM('bestellung', 'anfrage', 'termin', 'projekt');
  CREATE TYPE "public"."enum_vorgaenge_bereich" AS ENUM('autoschluessel', 'schluessel-nach-vorlage', 'schluessel-nach-code', 'gleichschliessende-zylinder', 'schliessanlagen', 'elektronische-zutrittsloesungen', 'tuer-und-schliesstechnik', 'sicherheitstechnik', 'service-und-termin');
  CREATE TYPE "public"."enum_vorgaenge_prozess" AS ENUM('direktkauf', 'gefuehrte-anfrage', 'projektkonfigurator', 'termin-mit-anzahlung');
  CREATE TYPE "public"."enum_vorgaenge_status" AS ENUM('neu', 'in-pruefung', 'geprueft', 'wartet-auf-kunde', 'in-fertigung', 'terminiert', 'versendet', 'abgeschlossen', 'storniert');
  CREATE TYPE "public"."enum_vorgaenge_termin_ort" AS ENUM('werkstatt', 'vor-ort');
  CREATE TYPE "public"."enum_vorgaenge_zahlung_umfang" AS ENUM('anzahlung', 'gesamt');
  CREATE TYPE "public"."enum_vorgaenge_zahlung_status" AS ENUM('offen', 'bezahlt', 'fehlgeschlagen', 'erstattet');
  CREATE TYPE "public"."enum_produkte_typ" AS ENUM('code_key', 'standard');
  CREATE TYPE "public"."enum_produkte_versandklasse" AS ENUM('code-schluessel', 'zylinder', 'zubehoer');
  CREATE TYPE "public"."enum_produkte_code_fundstelle_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_produkte_foto_upload" AS ENUM('nein', 'optional', 'pflicht');
  CREATE TYPE "public"."enum_produkte_produktbild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_produkte_seo_social_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_produkte_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__produkte_v_version_typ" AS ENUM('code_key', 'standard');
  CREATE TYPE "public"."enum__produkte_v_version_versandklasse" AS ENUM('code-schluessel', 'zylinder', 'zubehoer');
  CREATE TYPE "public"."enum__produkte_v_version_code_fundstelle_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum__produkte_v_version_foto_upload" AS ENUM('nein', 'optional', 'pflicht');
  CREATE TYPE "public"."enum__produkte_v_version_produktbild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum__produkte_v_version_seo_social_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum__produkte_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_fahrzeugmarken_modelle_schluesselarten" AS ENUM('mechanisch', 'funk', 'klappschluessel', 'smart-key', 'keyless');
  CREATE TYPE "public"."enum_fahrzeugmarken_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_fahrzeugmarken_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__fahrzeugmarken_v_version_modelle_schluesselarten" AS ENUM('mechanisch', 'funk', 'klappschluessel', 'smart-key', 'keyless');
  CREATE TYPE "public"."enum__fahrzeugmarken_v_version_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum__fahrzeugmarken_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_autoschluessel_leistungen_schluesselarten" AS ENUM('mechanisch', 'funk', 'klappschluessel', 'smart-key', 'keyless');
  CREATE TYPE "public"."enum_preisregeln_schluesselart" AS ENUM('alle', 'mechanisch', 'funk', 'klappschluessel', 'smart-key', 'keyless');
  CREATE TYPE "public"."enum_preisregeln_modus" AS ENUM('fest', 'rahmen', 'pruefung');
  CREATE TYPE "public"."enum_seiten_abschnitte_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_seiten_seo_social_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_seiten_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__seiten_v_version_abschnitte_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum__seiten_v_version_seo_social_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum__seiten_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_leistungsseiten_bereich" AS ENUM('autoschluessel', 'schluessel-nach-vorlage', 'schluessel-nach-code', 'gleichschliessende-zylinder', 'schliessanlagen', 'elektronische-zutrittsloesungen', 'tuer-und-schliesstechnik', 'sicherheitstechnik', 'service-und-termin');
  CREATE TYPE "public"."enum_leistungsseiten_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_leistungsseiten_prozess" AS ENUM('direktkauf', 'gefuehrte-anfrage', 'projektkonfigurator', 'termin-mit-anzahlung');
  CREATE TYPE "public"."enum_leistungsseiten_seo_social_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_leistungsseiten_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__leistungsseiten_v_version_bereich" AS ENUM('autoschluessel', 'schluessel-nach-vorlage', 'schluessel-nach-code', 'gleichschliessende-zylinder', 'schliessanlagen', 'elektronische-zutrittsloesungen', 'tuer-und-schliesstechnik', 'sicherheitstechnik', 'service-und-termin');
  CREATE TYPE "public"."enum__leistungsseiten_v_version_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum__leistungsseiten_v_version_prozess" AS ENUM('direktkauf', 'gefuehrte-anfrage', 'projektkonfigurator', 'termin-mit-anzahlung');
  CREATE TYPE "public"."enum__leistungsseiten_v_version_seo_social_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum__leistungsseiten_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_ratgeber_thema" AS ENUM('autoschluessel', 'schluessel-nach-vorlage', 'schluessel-nach-code', 'gleichschliessende-zylinder', 'schliessanlagen', 'elektronische-zutrittsloesungen', 'tuer-und-schliesstechnik', 'sicherheitstechnik', 'service-und-termin');
  CREATE TYPE "public"."enum_ratgeber_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_ratgeber_seo_social_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_ratgeber_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__ratgeber_v_version_thema" AS ENUM('autoschluessel', 'schluessel-nach-vorlage', 'schluessel-nach-code', 'gleichschliessende-zylinder', 'schliessanlagen', 'elektronische-zutrittsloesungen', 'tuer-und-schliesstechnik', 'sicherheitstechnik', 'service-und-termin');
  CREATE TYPE "public"."enum__ratgeber_v_version_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum__ratgeber_v_version_seo_social_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum__ratgeber_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_einsatzgebiete_leistungen" AS ENUM('autoschluessel', 'schluessel-nach-vorlage', 'schluessel-nach-code', 'gleichschliessende-zylinder', 'schliessanlagen', 'elektronische-zutrittsloesungen', 'tuer-und-schliesstechnik', 'sicherheitstechnik', 'service-und-termin');
  CREATE TYPE "public"."enum_einsatzgebiete_seo_social_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_einsatzgebiete_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__einsatzgebiete_v_version_leistungen" AS ENUM('autoschluessel', 'schluessel-nach-vorlage', 'schluessel-nach-code', 'gleichschliessende-zylinder', 'schliessanlagen', 'elektronische-zutrittsloesungen', 'tuer-und-schliesstechnik', 'sicherheitstechnik', 'service-und-termin');
  CREATE TYPE "public"."enum__einsatzgebiete_v_version_seo_social_bild_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum__einsatzgebiete_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_zylinderkatalog_bauformen_kennung" AS ENUM('doppelzylinder', 'knaufzylinder', 'halbzylinder');
  CREATE TYPE "public"."enum_zylinderkatalog_bauformen_masse" AS ENUM('beide', 'eines');
  CREATE TYPE "public"."enum_zylinderkatalog_bauformen_info_grafik_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_zylinderkatalog_bauformen_grafik_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_zylinderkatalog_funktionen_bauformen" AS ENUM('doppelzylinder', 'knaufzylinder', 'halbzylinder');
  CREATE TYPE "public"."enum_zylinderkatalog_funktionen_info_grafik_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_zylinderkatalog_extras_einheit" AS ENUM('einmal', 'stueck');
  CREATE TYPE "public"."enum_zylinderkatalog_extras_info_grafik_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_zylinderkatalog_mess_info_grafik_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_zylinderkatalog_mess_grafik_format" AS ENUM('16/9', '4/3', '1/1', '3/2', '21/9');
  CREATE TYPE "public"."enum_einstellungen_oeffnungszeiten_tag" AS ENUM('1', '2', '3', '4', '5', '6', '7');
  CREATE TYPE "public"."enum_einstellungen_versand_produktklassen" AS ENUM('code-schluessel', 'zylinder', 'zubehoer');
  CREATE TABLE "vorgaenge_zusammenfassung_zeilen" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"wert" varchar
  );
  
  CREATE TABLE "vorgaenge_zusammenfassung" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar
  );
  
  CREATE TABLE "vorgaenge_notizen" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"am" timestamp(3) with time zone NOT NULL,
  	"von" "enum_vorgaenge_notizen_von" DEFAULT 'team' NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "vorgaenge_verlauf" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"am" timestamp(3) with time zone NOT NULL,
  	"von" "enum_vorgaenge_verlauf_von" DEFAULT 'team' NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "vorgaenge" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nummer" varchar NOT NULL,
  	"art" "enum_vorgaenge_art" NOT NULL,
  	"bereich" "enum_vorgaenge_bereich" NOT NULL,
  	"prozess" "enum_vorgaenge_prozess" NOT NULL,
  	"status" "enum_vorgaenge_status" DEFAULT 'neu' NOT NULL,
  	"termin_datum" varchar,
  	"termin_uhrzeit" varchar,
  	"termin_dauer_minuten" numeric,
  	"termin_ort" "enum_vorgaenge_termin_ort",
  	"kontakt_anrede" varchar,
  	"kontakt_vorname" varchar NOT NULL,
  	"kontakt_nachname" varchar NOT NULL,
  	"kontakt_firma" varchar,
  	"kontakt_email" varchar NOT NULL,
  	"kontakt_telefon" varchar NOT NULL,
  	"kontakt_strasse" varchar,
  	"kontakt_plz" varchar,
  	"kontakt_ort" varchar,
  	"kontakt_land" varchar NOT NULL,
  	"zahlung_umfang" "enum_vorgaenge_zahlung_umfang",
  	"zahlung_betrag_cent" numeric,
  	"zahlung_status" "enum_vorgaenge_zahlung_status",
  	"zahlung_bezahlt_am" timestamp(3) with time zone,
  	"zahlung_anbieter_ref" varchar,
  	"daten" jsonb,
  	"angebot" jsonb,
  	"uploads" jsonb,
  	"zugriffs_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "produkte_eigenschaften" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"wert" varchar
  );
  
  CREATE TABLE "produkte_staffeln" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ab_menge" numeric,
  	"rabatt_prozent" numeric
  );
  
  CREATE TABLE "produkte_seo_interne_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "produkte" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"typ" "enum_produkte_typ" DEFAULT 'code_key',
  	"slug" varchar,
  	"kennung" varchar,
  	"beispiel" boolean DEFAULT false,
  	"name" varchar,
  	"beschreibung" varchar,
  	"hersteller" varchar,
  	"schluesseltyp" varchar,
  	"einsatz" varchar,
  	"umfang" varchar,
  	"lieferzeit" varchar,
  	"preis" numeric,
  	"max_menge" numeric DEFAULT 20,
  	"versandklasse" "enum_produkte_versandklasse" DEFAULT 'code-schluessel',
  	"code_format" varchar,
  	"code_muster" varchar,
  	"code_beispiel" varchar,
  	"code_hinweis" varchar,
  	"code_fundstelle_motiv" varchar,
  	"code_fundstelle_format" "enum_produkte_code_fundstelle_format" DEFAULT '4/3',
  	"code_fundstelle_bild_id" integer,
  	"code_fundstelle_hinweis" varchar,
  	"foto_upload" "enum_produkte_foto_upload" DEFAULT 'optional',
  	"foto_hinweis" varchar,
  	"produktbild_motiv" varchar,
  	"produktbild_format" "enum_produkte_produktbild_format" DEFAULT '1/1',
  	"produktbild_bild_id" integer,
  	"produktbild_hinweis" varchar,
  	"seo_titel" varchar,
  	"seo_beschreibung" varchar,
  	"seo_noindex" boolean DEFAULT false,
  	"seo_social_bild_motiv" varchar,
  	"seo_social_bild_format" "enum_produkte_seo_social_bild_format" DEFAULT '16/9',
  	"seo_social_bild_bild_id" integer,
  	"seo_social_bild_hinweis" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_produkte_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "produkte_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "produkte_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"medien_id" integer
  );
  
  CREATE TABLE "_produkte_v_version_eigenschaften" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"wert" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_produkte_v_version_staffeln" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"ab_menge" numeric,
  	"rabatt_prozent" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_produkte_v_version_seo_interne_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_produkte_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_typ" "enum__produkte_v_version_typ" DEFAULT 'code_key',
  	"version_slug" varchar,
  	"version_kennung" varchar,
  	"version_beispiel" boolean DEFAULT false,
  	"version_name" varchar,
  	"version_beschreibung" varchar,
  	"version_hersteller" varchar,
  	"version_schluesseltyp" varchar,
  	"version_einsatz" varchar,
  	"version_umfang" varchar,
  	"version_lieferzeit" varchar,
  	"version_preis" numeric,
  	"version_max_menge" numeric DEFAULT 20,
  	"version_versandklasse" "enum__produkte_v_version_versandklasse" DEFAULT 'code-schluessel',
  	"version_code_format" varchar,
  	"version_code_muster" varchar,
  	"version_code_beispiel" varchar,
  	"version_code_hinweis" varchar,
  	"version_code_fundstelle_motiv" varchar,
  	"version_code_fundstelle_format" "enum__produkte_v_version_code_fundstelle_format" DEFAULT '4/3',
  	"version_code_fundstelle_bild_id" integer,
  	"version_code_fundstelle_hinweis" varchar,
  	"version_foto_upload" "enum__produkte_v_version_foto_upload" DEFAULT 'optional',
  	"version_foto_hinweis" varchar,
  	"version_produktbild_motiv" varchar,
  	"version_produktbild_format" "enum__produkte_v_version_produktbild_format" DEFAULT '1/1',
  	"version_produktbild_bild_id" integer,
  	"version_produktbild_hinweis" varchar,
  	"version_seo_titel" varchar,
  	"version_seo_beschreibung" varchar,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_seo_social_bild_motiv" varchar,
  	"version_seo_social_bild_format" "enum__produkte_v_version_seo_social_bild_format" DEFAULT '16/9',
  	"version_seo_social_bild_bild_id" integer,
  	"version_seo_social_bild_hinweis" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__produkte_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_produkte_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_produkte_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"medien_id" integer
  );
  
  CREATE TABLE "fahrzeugmarken_modelle_schluesselarten" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_fahrzeugmarken_modelle_schluesselarten",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "fahrzeugmarken_modelle" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"kennung" varchar,
  	"baujahr_von" numeric,
  	"baujahr_bis" numeric,
  	"fahrzeug_vor_ort" boolean DEFAULT true,
  	"preisgruppe_id" integer,
  	"hinweise" varchar
  );
  
  CREATE TABLE "fahrzeugmarken" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"preisgruppe_id" integer,
  	"intro" varchar,
  	"bild_motiv" varchar,
  	"bild_format" "enum_fahrzeugmarken_bild_format" DEFAULT '16/9',
  	"bild_bild_id" integer,
  	"bild_hinweis" varchar,
  	"slug" varchar,
  	"kennung" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_fahrzeugmarken_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_fahrzeugmarken_v_version_modelle_schluesselarten" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__fahrzeugmarken_v_version_modelle_schluesselarten",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_fahrzeugmarken_v_version_modelle" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"kennung" varchar,
  	"baujahr_von" numeric,
  	"baujahr_bis" numeric,
  	"fahrzeug_vor_ort" boolean DEFAULT true,
  	"preisgruppe_id" integer,
  	"hinweise" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_fahrzeugmarken_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_preisgruppe_id" integer,
  	"version_intro" varchar,
  	"version_bild_motiv" varchar,
  	"version_bild_format" "enum__fahrzeugmarken_v_version_bild_format" DEFAULT '16/9',
  	"version_bild_bild_id" integer,
  	"version_bild_hinweis" varchar,
  	"version_slug" varchar,
  	"version_kennung" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__fahrzeugmarken_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "autoschluessel_leistungen_schluesselarten" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_autoschluessel_leistungen_schluesselarten",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "autoschluessel_leistungen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"beschreibung" varchar NOT NULL,
  	"fahrzeug_vor_ort" boolean DEFAULT false,
  	"aktiv" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"kennung" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "preisregeln" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"preisgruppe_id" integer NOT NULL,
  	"leistung_id" integer NOT NULL,
  	"schluesselart" "enum_preisregeln_schluesselart" DEFAULT 'alle' NOT NULL,
  	"modus" "enum_preisregeln_modus" DEFAULT 'fest' NOT NULL,
  	"preis" numeric,
  	"preis_von" numeric,
  	"preis_bis" numeric,
  	"anzahlung" numeric,
  	"termin_minuten" numeric,
  	"vorlauf_tage" numeric,
  	"hinweis" varchar,
  	"kennung" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "preisgruppen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"beschreibung" varchar,
  	"slug" varchar NOT NULL,
  	"kennung" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sperrtage_zeitfenster" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"von" varchar NOT NULL,
  	"bis" varchar NOT NULL
  );
  
  CREATE TABLE "sperrtage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"datum" timestamp(3) with time zone NOT NULL,
  	"grund" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "seiten_abschnitte" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ueberschrift" varchar,
  	"text" varchar,
  	"bild_motiv" varchar,
  	"bild_format" "enum_seiten_abschnitte_bild_format" DEFAULT '16/9',
  	"bild_bild_id" integer,
  	"bild_hinweis" varchar
  );
  
  CREATE TABLE "seiten_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"frage" varchar,
  	"antwort" varchar
  );
  
  CREATE TABLE "seiten_seo_interne_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "seiten" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"route" varchar,
  	"headline" varchar,
  	"subline" varchar,
  	"intro" varchar,
  	"seo_titel" varchar,
  	"seo_beschreibung" varchar,
  	"seo_noindex" boolean DEFAULT false,
  	"seo_social_bild_motiv" varchar,
  	"seo_social_bild_format" "enum_seiten_seo_social_bild_format" DEFAULT '16/9',
  	"seo_social_bild_bild_id" integer,
  	"seo_social_bild_hinweis" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_seiten_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_seiten_v_version_abschnitte" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"ueberschrift" varchar,
  	"text" varchar,
  	"bild_motiv" varchar,
  	"bild_format" "enum__seiten_v_version_abschnitte_bild_format" DEFAULT '16/9',
  	"bild_bild_id" integer,
  	"bild_hinweis" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_seiten_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"frage" varchar,
  	"antwort" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_seiten_v_version_seo_interne_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_seiten_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_route" varchar,
  	"version_headline" varchar,
  	"version_subline" varchar,
  	"version_intro" varchar,
  	"version_seo_titel" varchar,
  	"version_seo_beschreibung" varchar,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_seo_social_bild_motiv" varchar,
  	"version_seo_social_bild_format" "enum__seiten_v_version_seo_social_bild_format" DEFAULT '16/9',
  	"version_seo_social_bild_bild_id" integer,
  	"version_seo_social_bild_hinweis" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__seiten_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "leistungsseiten_stichpunkte" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "leistungsseiten_seo_interne_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "leistungsseiten" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"bereich" "enum_leistungsseiten_bereich",
  	"zusammenfassung" varchar,
  	"bild_motiv" varchar,
  	"bild_format" "enum_leistungsseiten_bild_format" DEFAULT '16/9',
  	"bild_bild_id" integer,
  	"bild_hinweis" varchar,
  	"prozess" "enum_leistungsseiten_prozess" DEFAULT 'gefuehrte-anfrage',
  	"cta_href" varchar,
  	"cta_label" varchar,
  	"seo_titel" varchar,
  	"seo_beschreibung" varchar,
  	"seo_noindex" boolean DEFAULT false,
  	"seo_social_bild_motiv" varchar,
  	"seo_social_bild_format" "enum_leistungsseiten_seo_social_bild_format" DEFAULT '16/9',
  	"seo_social_bild_bild_id" integer,
  	"seo_social_bild_hinweis" varchar,
  	"slug" varchar,
  	"kennung" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_leistungsseiten_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_leistungsseiten_v_version_stichpunkte" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_leistungsseiten_v_version_seo_interne_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_leistungsseiten_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titel" varchar,
  	"version_bereich" "enum__leistungsseiten_v_version_bereich",
  	"version_zusammenfassung" varchar,
  	"version_bild_motiv" varchar,
  	"version_bild_format" "enum__leistungsseiten_v_version_bild_format" DEFAULT '16/9',
  	"version_bild_bild_id" integer,
  	"version_bild_hinweis" varchar,
  	"version_prozess" "enum__leistungsseiten_v_version_prozess" DEFAULT 'gefuehrte-anfrage',
  	"version_cta_href" varchar,
  	"version_cta_label" varchar,
  	"version_seo_titel" varchar,
  	"version_seo_beschreibung" varchar,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_seo_social_bild_motiv" varchar,
  	"version_seo_social_bild_format" "enum__leistungsseiten_v_version_seo_social_bild_format" DEFAULT '16/9',
  	"version_seo_social_bild_bild_id" integer,
  	"version_seo_social_bild_hinweis" varchar,
  	"version_slug" varchar,
  	"version_kennung" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__leistungsseiten_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "ratgeber_abschnitte" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ueberschrift" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "ratgeber_seo_interne_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "ratgeber" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"auszug" varchar,
  	"thema" "enum_ratgeber_thema",
  	"bild_motiv" varchar,
  	"bild_format" "enum_ratgeber_bild_format" DEFAULT '16/9',
  	"bild_bild_id" integer,
  	"bild_hinweis" varchar,
  	"naechster_schritt_href" varchar,
  	"naechster_schritt_label" varchar,
  	"seo_titel" varchar,
  	"seo_beschreibung" varchar,
  	"seo_noindex" boolean DEFAULT false,
  	"seo_social_bild_motiv" varchar,
  	"seo_social_bild_format" "enum_ratgeber_seo_social_bild_format" DEFAULT '16/9',
  	"seo_social_bild_bild_id" integer,
  	"seo_social_bild_hinweis" varchar,
  	"slug" varchar,
  	"kennung" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_ratgeber_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_ratgeber_v_version_abschnitte" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"ueberschrift" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_ratgeber_v_version_seo_interne_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_ratgeber_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titel" varchar,
  	"version_auszug" varchar,
  	"version_thema" "enum__ratgeber_v_version_thema",
  	"version_bild_motiv" varchar,
  	"version_bild_format" "enum__ratgeber_v_version_bild_format" DEFAULT '16/9',
  	"version_bild_bild_id" integer,
  	"version_bild_hinweis" varchar,
  	"version_naechster_schritt_href" varchar,
  	"version_naechster_schritt_label" varchar,
  	"version_seo_titel" varchar,
  	"version_seo_beschreibung" varchar,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_seo_social_bild_motiv" varchar,
  	"version_seo_social_bild_format" "enum__ratgeber_v_version_seo_social_bild_format" DEFAULT '16/9',
  	"version_seo_social_bild_bild_id" integer,
  	"version_seo_social_bild_hinweis" varchar,
  	"version_slug" varchar,
  	"version_kennung" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__ratgeber_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "einsatzgebiete_lokale_fakten" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"wert" varchar
  );
  
  CREATE TABLE "einsatzgebiete_leistungen" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_einsatzgebiete_leistungen",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "einsatzgebiete_seo_interne_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "einsatzgebiete" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stadt" varchar,
  	"bundesland" varchar,
  	"lokal_intro" varchar,
  	"radius_km" numeric DEFAULT 0,
  	"seo_titel" varchar,
  	"seo_beschreibung" varchar,
  	"seo_noindex" boolean DEFAULT false,
  	"seo_social_bild_motiv" varchar,
  	"seo_social_bild_format" "enum_einsatzgebiete_seo_social_bild_format" DEFAULT '16/9',
  	"seo_social_bild_bild_id" integer,
  	"seo_social_bild_hinweis" varchar,
  	"slug" varchar,
  	"kennung" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_einsatzgebiete_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_einsatzgebiete_v_version_lokale_fakten" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"wert" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_einsatzgebiete_v_version_leistungen" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__einsatzgebiete_v_version_leistungen",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_einsatzgebiete_v_version_seo_interne_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_einsatzgebiete_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_stadt" varchar,
  	"version_bundesland" varchar,
  	"version_lokal_intro" varchar,
  	"version_radius_km" numeric DEFAULT 0,
  	"version_seo_titel" varchar,
  	"version_seo_beschreibung" varchar,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_seo_social_bild_motiv" varchar,
  	"version_seo_social_bild_format" "enum__einsatzgebiete_v_version_seo_social_bild_format" DEFAULT '16/9',
  	"version_seo_social_bild_bild_id" integer,
  	"version_seo_social_bild_hinweis" varchar,
  	"version_slug" varchar,
  	"version_kennung" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__einsatzgebiete_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "zylinderkatalog_bauformen" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kennung" "enum_zylinderkatalog_bauformen_kennung" NOT NULL,
  	"label" varchar NOT NULL,
  	"aktiv" boolean DEFAULT true,
  	"beschreibung" varchar NOT NULL,
  	"masse" "enum_zylinderkatalog_bauformen_masse" NOT NULL,
  	"mass_label_a" varchar NOT NULL,
  	"mass_label_b" varchar,
  	"min_mm" numeric NOT NULL,
  	"max_mm" numeric NOT NULL,
  	"schritt_mm" numeric NOT NULL,
  	"grundlaenge_mm" numeric NOT NULL,
  	"grundpreis" numeric NOT NULL,
  	"laengen_aufpreis" numeric NOT NULL,
  	"info_titel" varchar NOT NULL,
  	"info_text" varchar NOT NULL,
  	"info_grafik_motiv" varchar,
  	"info_grafik_format" "enum_zylinderkatalog_bauformen_info_grafik_format" DEFAULT '4/3',
  	"info_grafik_bild_id" integer,
  	"info_grafik_hinweis" varchar,
  	"grafik_motiv" varchar,
  	"grafik_format" "enum_zylinderkatalog_bauformen_grafik_format" DEFAULT '4/3',
  	"grafik_bild_id" integer,
  	"grafik_hinweis" varchar
  );
  
  CREATE TABLE "zylinderkatalog_funktionen_bauformen" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_zylinderkatalog_funktionen_bauformen",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "zylinderkatalog_funktionen" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kennung" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"aktiv" boolean DEFAULT true,
  	"beschreibung" varchar NOT NULL,
  	"aufpreis" numeric NOT NULL,
  	"info_titel" varchar NOT NULL,
  	"info_text" varchar NOT NULL,
  	"info_grafik_motiv" varchar,
  	"info_grafik_format" "enum_zylinderkatalog_funktionen_info_grafik_format" DEFAULT '4/3',
  	"info_grafik_bild_id" integer,
  	"info_grafik_hinweis" varchar
  );
  
  CREATE TABLE "zylinderkatalog_extras" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kennung" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"aktiv" boolean DEFAULT true,
  	"beschreibung" varchar NOT NULL,
  	"preis" numeric NOT NULL,
  	"einheit" "enum_zylinderkatalog_extras_einheit" NOT NULL,
  	"info_titel" varchar NOT NULL,
  	"info_text" varchar NOT NULL,
  	"info_grafik_motiv" varchar,
  	"info_grafik_format" "enum_zylinderkatalog_extras_info_grafik_format" DEFAULT '4/3',
  	"info_grafik_bild_id" integer,
  	"info_grafik_hinweis" varchar
  );
  
  CREATE TABLE "zylinderkatalog" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"schluessel_preis" numeric NOT NULL,
  	"inklusive_schluessel" numeric NOT NULL,
  	"max_schluessel" numeric NOT NULL,
  	"max_zylinder" numeric NOT NULL,
  	"mess_info_titel" varchar NOT NULL,
  	"mess_info_text" varchar NOT NULL,
  	"mess_info_grafik_motiv" varchar,
  	"mess_info_grafik_format" "enum_zylinderkatalog_mess_info_grafik_format" DEFAULT '4/3',
  	"mess_info_grafik_bild_id" integer,
  	"mess_info_grafik_hinweis" varchar,
  	"mess_grafik_motiv" varchar,
  	"mess_grafik_format" "enum_zylinderkatalog_mess_grafik_format" DEFAULT '16/9',
  	"mess_grafik_bild_id" integer,
  	"mess_grafik_hinweis" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "einstellungen_oeffnungszeiten_zeiten" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"von" varchar NOT NULL,
  	"bis" varchar NOT NULL
  );
  
  CREATE TABLE "einstellungen_oeffnungszeiten" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" "enum_einstellungen_oeffnungszeiten_tag" NOT NULL
  );
  
  CREATE TABLE "einstellungen_buchung_fenster" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"von" varchar NOT NULL,
  	"bis" varchar NOT NULL
  );
  
  CREATE TABLE "einstellungen_versand_produktklassen" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_einstellungen_versand_produktklassen",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "einstellungen_versand" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kennung" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"beschreibung" varchar NOT NULL,
  	"preis" numeric NOT NULL,
  	"verfolgt" boolean,
  	"versichert" boolean
  );
  
  CREATE TABLE "einstellungen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"firma_platzhalter" boolean DEFAULT true,
  	"firma_rechtlicher_name" varchar NOT NULL,
  	"firma_marke" varchar NOT NULL,
  	"firma_strasse" varchar NOT NULL,
  	"firma_plz" varchar NOT NULL,
  	"firma_ort" varchar NOT NULL,
  	"firma_land" varchar DEFAULT 'Deutschland' NOT NULL,
  	"firma_telefon" varchar NOT NULL,
  	"firma_email" varchar NOT NULL,
  	"firma_ust_id" varchar,
  	"firma_registergericht" varchar,
  	"firma_registernummer" varchar,
  	"firma_geschaeftsfuehrung" varchar,
  	"buchung_vorlauf_tage" numeric NOT NULL,
  	"buchung_horizont_tage" numeric NOT NULL,
  	"buchung_termin_minuten" numeric NOT NULL,
  	"buchung_anzahlung" numeric NOT NULL,
  	"buchung_anzahlung_min" numeric NOT NULL,
  	"buchung_anzahlung_max" numeric NOT NULL,
  	"buchung_termine_je_fenster" numeric DEFAULT 1 NOT NULL,
  	"aufbewahrung_fahrzeugschein" numeric NOT NULL,
  	"aufbewahrung_schluesselfotos" numeric NOT NULL,
  	"aufbewahrung_grundrisse" numeric NOT NULL,
  	"aufbewahrung_projektunterlagen" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "vorgaenge_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "produkte_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "fahrzeugmarken_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "autoschluessel_leistungen_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "preisregeln_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "preisgruppen_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sperrtage_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "seiten_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "leistungsseiten_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "ratgeber_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "einsatzgebiete_id" integer;
  ALTER TABLE "vorgaenge_zusammenfassung_zeilen" ADD CONSTRAINT "vorgaenge_zusammenfassung_zeilen_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vorgaenge_zusammenfassung"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vorgaenge_zusammenfassung" ADD CONSTRAINT "vorgaenge_zusammenfassung_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vorgaenge"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vorgaenge_notizen" ADD CONSTRAINT "vorgaenge_notizen_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vorgaenge"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vorgaenge_verlauf" ADD CONSTRAINT "vorgaenge_verlauf_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vorgaenge"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produkte_eigenschaften" ADD CONSTRAINT "produkte_eigenschaften_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."produkte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produkte_staffeln" ADD CONSTRAINT "produkte_staffeln_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."produkte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produkte_seo_interne_links" ADD CONSTRAINT "produkte_seo_interne_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."produkte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produkte" ADD CONSTRAINT "produkte_code_fundstelle_bild_id_medien_id_fk" FOREIGN KEY ("code_fundstelle_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "produkte" ADD CONSTRAINT "produkte_produktbild_bild_id_medien_id_fk" FOREIGN KEY ("produktbild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "produkte" ADD CONSTRAINT "produkte_seo_social_bild_bild_id_medien_id_fk" FOREIGN KEY ("seo_social_bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "produkte_texts" ADD CONSTRAINT "produkte_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."produkte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produkte_rels" ADD CONSTRAINT "produkte_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."produkte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produkte_rels" ADD CONSTRAINT "produkte_rels_medien_fk" FOREIGN KEY ("medien_id") REFERENCES "public"."medien"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_produkte_v_version_eigenschaften" ADD CONSTRAINT "_produkte_v_version_eigenschaften_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_produkte_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_produkte_v_version_staffeln" ADD CONSTRAINT "_produkte_v_version_staffeln_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_produkte_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_produkte_v_version_seo_interne_links" ADD CONSTRAINT "_produkte_v_version_seo_interne_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_produkte_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_produkte_v" ADD CONSTRAINT "_produkte_v_parent_id_produkte_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."produkte"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_produkte_v" ADD CONSTRAINT "_produkte_v_version_code_fundstelle_bild_id_medien_id_fk" FOREIGN KEY ("version_code_fundstelle_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_produkte_v" ADD CONSTRAINT "_produkte_v_version_produktbild_bild_id_medien_id_fk" FOREIGN KEY ("version_produktbild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_produkte_v" ADD CONSTRAINT "_produkte_v_version_seo_social_bild_bild_id_medien_id_fk" FOREIGN KEY ("version_seo_social_bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_produkte_v_texts" ADD CONSTRAINT "_produkte_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_produkte_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_produkte_v_rels" ADD CONSTRAINT "_produkte_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_produkte_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_produkte_v_rels" ADD CONSTRAINT "_produkte_v_rels_medien_fk" FOREIGN KEY ("medien_id") REFERENCES "public"."medien"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fahrzeugmarken_modelle_schluesselarten" ADD CONSTRAINT "fahrzeugmarken_modelle_schluesselarten_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."fahrzeugmarken_modelle"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fahrzeugmarken_modelle" ADD CONSTRAINT "fahrzeugmarken_modelle_preisgruppe_id_preisgruppen_id_fk" FOREIGN KEY ("preisgruppe_id") REFERENCES "public"."preisgruppen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "fahrzeugmarken_modelle" ADD CONSTRAINT "fahrzeugmarken_modelle_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fahrzeugmarken"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fahrzeugmarken" ADD CONSTRAINT "fahrzeugmarken_preisgruppe_id_preisgruppen_id_fk" FOREIGN KEY ("preisgruppe_id") REFERENCES "public"."preisgruppen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "fahrzeugmarken" ADD CONSTRAINT "fahrzeugmarken_bild_bild_id_medien_id_fk" FOREIGN KEY ("bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_fahrzeugmarken_v_version_modelle_schluesselarten" ADD CONSTRAINT "_fahrzeugmarken_v_version_modelle_schluesselarten_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_fahrzeugmarken_v_version_modelle"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_fahrzeugmarken_v_version_modelle" ADD CONSTRAINT "_fahrzeugmarken_v_version_modelle_preisgruppe_id_preisgruppen_id_fk" FOREIGN KEY ("preisgruppe_id") REFERENCES "public"."preisgruppen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_fahrzeugmarken_v_version_modelle" ADD CONSTRAINT "_fahrzeugmarken_v_version_modelle_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_fahrzeugmarken_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_fahrzeugmarken_v" ADD CONSTRAINT "_fahrzeugmarken_v_parent_id_fahrzeugmarken_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."fahrzeugmarken"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_fahrzeugmarken_v" ADD CONSTRAINT "_fahrzeugmarken_v_version_preisgruppe_id_preisgruppen_id_fk" FOREIGN KEY ("version_preisgruppe_id") REFERENCES "public"."preisgruppen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_fahrzeugmarken_v" ADD CONSTRAINT "_fahrzeugmarken_v_version_bild_bild_id_medien_id_fk" FOREIGN KEY ("version_bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "autoschluessel_leistungen_schluesselarten" ADD CONSTRAINT "autoschluessel_leistungen_schluesselarten_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."autoschluessel_leistungen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "preisregeln" ADD CONSTRAINT "preisregeln_preisgruppe_id_preisgruppen_id_fk" FOREIGN KEY ("preisgruppe_id") REFERENCES "public"."preisgruppen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "preisregeln" ADD CONSTRAINT "preisregeln_leistung_id_autoschluessel_leistungen_id_fk" FOREIGN KEY ("leistung_id") REFERENCES "public"."autoschluessel_leistungen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sperrtage_zeitfenster" ADD CONSTRAINT "sperrtage_zeitfenster_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sperrtage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seiten_abschnitte" ADD CONSTRAINT "seiten_abschnitte_bild_bild_id_medien_id_fk" FOREIGN KEY ("bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seiten_abschnitte" ADD CONSTRAINT "seiten_abschnitte_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seiten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seiten_faq" ADD CONSTRAINT "seiten_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seiten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seiten_seo_interne_links" ADD CONSTRAINT "seiten_seo_interne_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seiten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seiten" ADD CONSTRAINT "seiten_seo_social_bild_bild_id_medien_id_fk" FOREIGN KEY ("seo_social_bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_seiten_v_version_abschnitte" ADD CONSTRAINT "_seiten_v_version_abschnitte_bild_bild_id_medien_id_fk" FOREIGN KEY ("bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_seiten_v_version_abschnitte" ADD CONSTRAINT "_seiten_v_version_abschnitte_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_seiten_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_seiten_v_version_faq" ADD CONSTRAINT "_seiten_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_seiten_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_seiten_v_version_seo_interne_links" ADD CONSTRAINT "_seiten_v_version_seo_interne_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_seiten_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_seiten_v" ADD CONSTRAINT "_seiten_v_parent_id_seiten_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."seiten"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_seiten_v" ADD CONSTRAINT "_seiten_v_version_seo_social_bild_bild_id_medien_id_fk" FOREIGN KEY ("version_seo_social_bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leistungsseiten_stichpunkte" ADD CONSTRAINT "leistungsseiten_stichpunkte_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."leistungsseiten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leistungsseiten_seo_interne_links" ADD CONSTRAINT "leistungsseiten_seo_interne_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."leistungsseiten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leistungsseiten" ADD CONSTRAINT "leistungsseiten_bild_bild_id_medien_id_fk" FOREIGN KEY ("bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leistungsseiten" ADD CONSTRAINT "leistungsseiten_seo_social_bild_bild_id_medien_id_fk" FOREIGN KEY ("seo_social_bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leistungsseiten_v_version_stichpunkte" ADD CONSTRAINT "_leistungsseiten_v_version_stichpunkte_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_leistungsseiten_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_leistungsseiten_v_version_seo_interne_links" ADD CONSTRAINT "_leistungsseiten_v_version_seo_interne_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_leistungsseiten_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_leistungsseiten_v" ADD CONSTRAINT "_leistungsseiten_v_parent_id_leistungsseiten_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."leistungsseiten"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leistungsseiten_v" ADD CONSTRAINT "_leistungsseiten_v_version_bild_bild_id_medien_id_fk" FOREIGN KEY ("version_bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leistungsseiten_v" ADD CONSTRAINT "_leistungsseiten_v_version_seo_social_bild_bild_id_medien_id_fk" FOREIGN KEY ("version_seo_social_bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ratgeber_abschnitte" ADD CONSTRAINT "ratgeber_abschnitte_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ratgeber"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ratgeber_seo_interne_links" ADD CONSTRAINT "ratgeber_seo_interne_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ratgeber"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ratgeber" ADD CONSTRAINT "ratgeber_bild_bild_id_medien_id_fk" FOREIGN KEY ("bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ratgeber" ADD CONSTRAINT "ratgeber_seo_social_bild_bild_id_medien_id_fk" FOREIGN KEY ("seo_social_bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ratgeber_v_version_abschnitte" ADD CONSTRAINT "_ratgeber_v_version_abschnitte_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_ratgeber_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ratgeber_v_version_seo_interne_links" ADD CONSTRAINT "_ratgeber_v_version_seo_interne_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_ratgeber_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ratgeber_v" ADD CONSTRAINT "_ratgeber_v_parent_id_ratgeber_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ratgeber"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ratgeber_v" ADD CONSTRAINT "_ratgeber_v_version_bild_bild_id_medien_id_fk" FOREIGN KEY ("version_bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ratgeber_v" ADD CONSTRAINT "_ratgeber_v_version_seo_social_bild_bild_id_medien_id_fk" FOREIGN KEY ("version_seo_social_bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "einsatzgebiete_lokale_fakten" ADD CONSTRAINT "einsatzgebiete_lokale_fakten_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."einsatzgebiete"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "einsatzgebiete_leistungen" ADD CONSTRAINT "einsatzgebiete_leistungen_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."einsatzgebiete"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "einsatzgebiete_seo_interne_links" ADD CONSTRAINT "einsatzgebiete_seo_interne_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."einsatzgebiete"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "einsatzgebiete" ADD CONSTRAINT "einsatzgebiete_seo_social_bild_bild_id_medien_id_fk" FOREIGN KEY ("seo_social_bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_einsatzgebiete_v_version_lokale_fakten" ADD CONSTRAINT "_einsatzgebiete_v_version_lokale_fakten_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_einsatzgebiete_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_einsatzgebiete_v_version_leistungen" ADD CONSTRAINT "_einsatzgebiete_v_version_leistungen_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_einsatzgebiete_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_einsatzgebiete_v_version_seo_interne_links" ADD CONSTRAINT "_einsatzgebiete_v_version_seo_interne_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_einsatzgebiete_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_einsatzgebiete_v" ADD CONSTRAINT "_einsatzgebiete_v_parent_id_einsatzgebiete_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."einsatzgebiete"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_einsatzgebiete_v" ADD CONSTRAINT "_einsatzgebiete_v_version_seo_social_bild_bild_id_medien_id_fk" FOREIGN KEY ("version_seo_social_bild_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "zylinderkatalog_bauformen" ADD CONSTRAINT "zylinderkatalog_bauformen_info_grafik_bild_id_medien_id_fk" FOREIGN KEY ("info_grafik_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "zylinderkatalog_bauformen" ADD CONSTRAINT "zylinderkatalog_bauformen_grafik_bild_id_medien_id_fk" FOREIGN KEY ("grafik_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "zylinderkatalog_bauformen" ADD CONSTRAINT "zylinderkatalog_bauformen_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."zylinderkatalog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "zylinderkatalog_funktionen_bauformen" ADD CONSTRAINT "zylinderkatalog_funktionen_bauformen_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."zylinderkatalog_funktionen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "zylinderkatalog_funktionen" ADD CONSTRAINT "zylinderkatalog_funktionen_info_grafik_bild_id_medien_id_fk" FOREIGN KEY ("info_grafik_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "zylinderkatalog_funktionen" ADD CONSTRAINT "zylinderkatalog_funktionen_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."zylinderkatalog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "zylinderkatalog_extras" ADD CONSTRAINT "zylinderkatalog_extras_info_grafik_bild_id_medien_id_fk" FOREIGN KEY ("info_grafik_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "zylinderkatalog_extras" ADD CONSTRAINT "zylinderkatalog_extras_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."zylinderkatalog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "zylinderkatalog" ADD CONSTRAINT "zylinderkatalog_mess_info_grafik_bild_id_medien_id_fk" FOREIGN KEY ("mess_info_grafik_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "zylinderkatalog" ADD CONSTRAINT "zylinderkatalog_mess_grafik_bild_id_medien_id_fk" FOREIGN KEY ("mess_grafik_bild_id") REFERENCES "public"."medien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "einstellungen_oeffnungszeiten_zeiten" ADD CONSTRAINT "einstellungen_oeffnungszeiten_zeiten_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."einstellungen_oeffnungszeiten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "einstellungen_oeffnungszeiten" ADD CONSTRAINT "einstellungen_oeffnungszeiten_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."einstellungen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "einstellungen_buchung_fenster" ADD CONSTRAINT "einstellungen_buchung_fenster_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."einstellungen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "einstellungen_versand_produktklassen" ADD CONSTRAINT "einstellungen_versand_produktklassen_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."einstellungen_versand"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "einstellungen_versand" ADD CONSTRAINT "einstellungen_versand_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."einstellungen"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "vorgaenge_zusammenfassung_zeilen_order_idx" ON "vorgaenge_zusammenfassung_zeilen" USING btree ("_order");
  CREATE INDEX "vorgaenge_zusammenfassung_zeilen_parent_id_idx" ON "vorgaenge_zusammenfassung_zeilen" USING btree ("_parent_id");
  CREATE INDEX "vorgaenge_zusammenfassung_order_idx" ON "vorgaenge_zusammenfassung" USING btree ("_order");
  CREATE INDEX "vorgaenge_zusammenfassung_parent_id_idx" ON "vorgaenge_zusammenfassung" USING btree ("_parent_id");
  CREATE INDEX "vorgaenge_notizen_order_idx" ON "vorgaenge_notizen" USING btree ("_order");
  CREATE INDEX "vorgaenge_notizen_parent_id_idx" ON "vorgaenge_notizen" USING btree ("_parent_id");
  CREATE INDEX "vorgaenge_verlauf_order_idx" ON "vorgaenge_verlauf" USING btree ("_order");
  CREATE INDEX "vorgaenge_verlauf_parent_id_idx" ON "vorgaenge_verlauf" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "vorgaenge_nummer_idx" ON "vorgaenge" USING btree ("nummer");
  CREATE INDEX "vorgaenge_status_idx" ON "vorgaenge" USING btree ("status");
  CREATE INDEX "vorgaenge_updated_at_idx" ON "vorgaenge" USING btree ("updated_at");
  CREATE INDEX "vorgaenge_created_at_idx" ON "vorgaenge" USING btree ("created_at");
  CREATE INDEX "produkte_eigenschaften_order_idx" ON "produkte_eigenschaften" USING btree ("_order");
  CREATE INDEX "produkte_eigenschaften_parent_id_idx" ON "produkte_eigenschaften" USING btree ("_parent_id");
  CREATE INDEX "produkte_staffeln_order_idx" ON "produkte_staffeln" USING btree ("_order");
  CREATE INDEX "produkte_staffeln_parent_id_idx" ON "produkte_staffeln" USING btree ("_parent_id");
  CREATE INDEX "produkte_seo_interne_links_order_idx" ON "produkte_seo_interne_links" USING btree ("_order");
  CREATE INDEX "produkte_seo_interne_links_parent_id_idx" ON "produkte_seo_interne_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "produkte_slug_idx" ON "produkte" USING btree ("slug");
  CREATE UNIQUE INDEX "produkte_kennung_idx" ON "produkte" USING btree ("kennung");
  CREATE INDEX "produkte_code_fundstelle_code_fundstelle_bild_idx" ON "produkte" USING btree ("code_fundstelle_bild_id");
  CREATE INDEX "produkte_produktbild_produktbild_bild_idx" ON "produkte" USING btree ("produktbild_bild_id");
  CREATE INDEX "produkte_seo_social_bild_seo_social_bild_bild_idx" ON "produkte" USING btree ("seo_social_bild_bild_id");
  CREATE INDEX "produkte_updated_at_idx" ON "produkte" USING btree ("updated_at");
  CREATE INDEX "produkte_created_at_idx" ON "produkte" USING btree ("created_at");
  CREATE INDEX "produkte_deleted_at_idx" ON "produkte" USING btree ("deleted_at");
  CREATE INDEX "produkte__status_idx" ON "produkte" USING btree ("_status");
  CREATE INDEX "produkte_texts_order_parent" ON "produkte_texts" USING btree ("order","parent_id");
  CREATE INDEX "produkte_rels_order_idx" ON "produkte_rels" USING btree ("order");
  CREATE INDEX "produkte_rels_parent_idx" ON "produkte_rels" USING btree ("parent_id");
  CREATE INDEX "produkte_rels_path_idx" ON "produkte_rels" USING btree ("path");
  CREATE INDEX "produkte_rels_medien_id_idx" ON "produkte_rels" USING btree ("medien_id");
  CREATE INDEX "_produkte_v_version_eigenschaften_order_idx" ON "_produkte_v_version_eigenschaften" USING btree ("_order");
  CREATE INDEX "_produkte_v_version_eigenschaften_parent_id_idx" ON "_produkte_v_version_eigenschaften" USING btree ("_parent_id");
  CREATE INDEX "_produkte_v_version_staffeln_order_idx" ON "_produkte_v_version_staffeln" USING btree ("_order");
  CREATE INDEX "_produkte_v_version_staffeln_parent_id_idx" ON "_produkte_v_version_staffeln" USING btree ("_parent_id");
  CREATE INDEX "_produkte_v_version_seo_interne_links_order_idx" ON "_produkte_v_version_seo_interne_links" USING btree ("_order");
  CREATE INDEX "_produkte_v_version_seo_interne_links_parent_id_idx" ON "_produkte_v_version_seo_interne_links" USING btree ("_parent_id");
  CREATE INDEX "_produkte_v_parent_idx" ON "_produkte_v" USING btree ("parent_id");
  CREATE INDEX "_produkte_v_version_version_slug_idx" ON "_produkte_v" USING btree ("version_slug");
  CREATE INDEX "_produkte_v_version_version_kennung_idx" ON "_produkte_v" USING btree ("version_kennung");
  CREATE INDEX "_produkte_v_version_code_fundstelle_version_code_fundste_idx" ON "_produkte_v" USING btree ("version_code_fundstelle_bild_id");
  CREATE INDEX "_produkte_v_version_produktbild_version_produktbild_bild_idx" ON "_produkte_v" USING btree ("version_produktbild_bild_id");
  CREATE INDEX "_produkte_v_version_seo_social_bild_version_seo_social_b_idx" ON "_produkte_v" USING btree ("version_seo_social_bild_bild_id");
  CREATE INDEX "_produkte_v_version_version_updated_at_idx" ON "_produkte_v" USING btree ("version_updated_at");
  CREATE INDEX "_produkte_v_version_version_created_at_idx" ON "_produkte_v" USING btree ("version_created_at");
  CREATE INDEX "_produkte_v_version_version_deleted_at_idx" ON "_produkte_v" USING btree ("version_deleted_at");
  CREATE INDEX "_produkte_v_version_version__status_idx" ON "_produkte_v" USING btree ("version__status");
  CREATE INDEX "_produkte_v_created_at_idx" ON "_produkte_v" USING btree ("created_at");
  CREATE INDEX "_produkte_v_updated_at_idx" ON "_produkte_v" USING btree ("updated_at");
  CREATE INDEX "_produkte_v_latest_idx" ON "_produkte_v" USING btree ("latest");
  CREATE INDEX "_produkte_v_texts_order_parent" ON "_produkte_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_produkte_v_rels_order_idx" ON "_produkte_v_rels" USING btree ("order");
  CREATE INDEX "_produkte_v_rels_parent_idx" ON "_produkte_v_rels" USING btree ("parent_id");
  CREATE INDEX "_produkte_v_rels_path_idx" ON "_produkte_v_rels" USING btree ("path");
  CREATE INDEX "_produkte_v_rels_medien_id_idx" ON "_produkte_v_rels" USING btree ("medien_id");
  CREATE INDEX "fahrzeugmarken_modelle_schluesselarten_order_idx" ON "fahrzeugmarken_modelle_schluesselarten" USING btree ("order");
  CREATE INDEX "fahrzeugmarken_modelle_schluesselarten_parent_idx" ON "fahrzeugmarken_modelle_schluesselarten" USING btree ("parent_id");
  CREATE INDEX "fahrzeugmarken_modelle_order_idx" ON "fahrzeugmarken_modelle" USING btree ("_order");
  CREATE INDEX "fahrzeugmarken_modelle_parent_id_idx" ON "fahrzeugmarken_modelle" USING btree ("_parent_id");
  CREATE INDEX "fahrzeugmarken_modelle_preisgruppe_idx" ON "fahrzeugmarken_modelle" USING btree ("preisgruppe_id");
  CREATE INDEX "fahrzeugmarken_preisgruppe_idx" ON "fahrzeugmarken" USING btree ("preisgruppe_id");
  CREATE INDEX "fahrzeugmarken_bild_bild_bild_idx" ON "fahrzeugmarken" USING btree ("bild_bild_id");
  CREATE UNIQUE INDEX "fahrzeugmarken_slug_idx" ON "fahrzeugmarken" USING btree ("slug");
  CREATE UNIQUE INDEX "fahrzeugmarken_kennung_idx" ON "fahrzeugmarken" USING btree ("kennung");
  CREATE INDEX "fahrzeugmarken_updated_at_idx" ON "fahrzeugmarken" USING btree ("updated_at");
  CREATE INDEX "fahrzeugmarken_created_at_idx" ON "fahrzeugmarken" USING btree ("created_at");
  CREATE INDEX "fahrzeugmarken_deleted_at_idx" ON "fahrzeugmarken" USING btree ("deleted_at");
  CREATE INDEX "fahrzeugmarken__status_idx" ON "fahrzeugmarken" USING btree ("_status");
  CREATE INDEX "_fahrzeugmarken_v_version_modelle_schluesselarten_order_idx" ON "_fahrzeugmarken_v_version_modelle_schluesselarten" USING btree ("order");
  CREATE INDEX "_fahrzeugmarken_v_version_modelle_schluesselarten_parent_idx" ON "_fahrzeugmarken_v_version_modelle_schluesselarten" USING btree ("parent_id");
  CREATE INDEX "_fahrzeugmarken_v_version_modelle_order_idx" ON "_fahrzeugmarken_v_version_modelle" USING btree ("_order");
  CREATE INDEX "_fahrzeugmarken_v_version_modelle_parent_id_idx" ON "_fahrzeugmarken_v_version_modelle" USING btree ("_parent_id");
  CREATE INDEX "_fahrzeugmarken_v_version_modelle_preisgruppe_idx" ON "_fahrzeugmarken_v_version_modelle" USING btree ("preisgruppe_id");
  CREATE INDEX "_fahrzeugmarken_v_parent_idx" ON "_fahrzeugmarken_v" USING btree ("parent_id");
  CREATE INDEX "_fahrzeugmarken_v_version_version_preisgruppe_idx" ON "_fahrzeugmarken_v" USING btree ("version_preisgruppe_id");
  CREATE INDEX "_fahrzeugmarken_v_version_bild_version_bild_bild_idx" ON "_fahrzeugmarken_v" USING btree ("version_bild_bild_id");
  CREATE INDEX "_fahrzeugmarken_v_version_version_slug_idx" ON "_fahrzeugmarken_v" USING btree ("version_slug");
  CREATE INDEX "_fahrzeugmarken_v_version_version_kennung_idx" ON "_fahrzeugmarken_v" USING btree ("version_kennung");
  CREATE INDEX "_fahrzeugmarken_v_version_version_updated_at_idx" ON "_fahrzeugmarken_v" USING btree ("version_updated_at");
  CREATE INDEX "_fahrzeugmarken_v_version_version_created_at_idx" ON "_fahrzeugmarken_v" USING btree ("version_created_at");
  CREATE INDEX "_fahrzeugmarken_v_version_version_deleted_at_idx" ON "_fahrzeugmarken_v" USING btree ("version_deleted_at");
  CREATE INDEX "_fahrzeugmarken_v_version_version__status_idx" ON "_fahrzeugmarken_v" USING btree ("version__status");
  CREATE INDEX "_fahrzeugmarken_v_created_at_idx" ON "_fahrzeugmarken_v" USING btree ("created_at");
  CREATE INDEX "_fahrzeugmarken_v_updated_at_idx" ON "_fahrzeugmarken_v" USING btree ("updated_at");
  CREATE INDEX "_fahrzeugmarken_v_latest_idx" ON "_fahrzeugmarken_v" USING btree ("latest");
  CREATE INDEX "autoschluessel_leistungen_schluesselarten_order_idx" ON "autoschluessel_leistungen_schluesselarten" USING btree ("order");
  CREATE INDEX "autoschluessel_leistungen_schluesselarten_parent_idx" ON "autoschluessel_leistungen_schluesselarten" USING btree ("parent_id");
  CREATE UNIQUE INDEX "autoschluessel_leistungen_slug_idx" ON "autoschluessel_leistungen" USING btree ("slug");
  CREATE UNIQUE INDEX "autoschluessel_leistungen_kennung_idx" ON "autoschluessel_leistungen" USING btree ("kennung");
  CREATE INDEX "autoschluessel_leistungen_updated_at_idx" ON "autoschluessel_leistungen" USING btree ("updated_at");
  CREATE INDEX "autoschluessel_leistungen_created_at_idx" ON "autoschluessel_leistungen" USING btree ("created_at");
  CREATE INDEX "autoschluessel_leistungen_deleted_at_idx" ON "autoschluessel_leistungen" USING btree ("deleted_at");
  CREATE INDEX "preisregeln_preisgruppe_idx" ON "preisregeln" USING btree ("preisgruppe_id");
  CREATE INDEX "preisregeln_leistung_idx" ON "preisregeln" USING btree ("leistung_id");
  CREATE UNIQUE INDEX "preisregeln_kennung_idx" ON "preisregeln" USING btree ("kennung");
  CREATE INDEX "preisregeln_updated_at_idx" ON "preisregeln" USING btree ("updated_at");
  CREATE INDEX "preisregeln_created_at_idx" ON "preisregeln" USING btree ("created_at");
  CREATE UNIQUE INDEX "preisgruppen_slug_idx" ON "preisgruppen" USING btree ("slug");
  CREATE UNIQUE INDEX "preisgruppen_kennung_idx" ON "preisgruppen" USING btree ("kennung");
  CREATE INDEX "preisgruppen_updated_at_idx" ON "preisgruppen" USING btree ("updated_at");
  CREATE INDEX "preisgruppen_created_at_idx" ON "preisgruppen" USING btree ("created_at");
  CREATE INDEX "sperrtage_zeitfenster_order_idx" ON "sperrtage_zeitfenster" USING btree ("_order");
  CREATE INDEX "sperrtage_zeitfenster_parent_id_idx" ON "sperrtage_zeitfenster" USING btree ("_parent_id");
  CREATE INDEX "sperrtage_datum_idx" ON "sperrtage" USING btree ("datum");
  CREATE INDEX "sperrtage_updated_at_idx" ON "sperrtage" USING btree ("updated_at");
  CREATE INDEX "sperrtage_created_at_idx" ON "sperrtage" USING btree ("created_at");
  CREATE INDEX "seiten_abschnitte_order_idx" ON "seiten_abschnitte" USING btree ("_order");
  CREATE INDEX "seiten_abschnitte_parent_id_idx" ON "seiten_abschnitte" USING btree ("_parent_id");
  CREATE INDEX "seiten_abschnitte_bild_bild_bild_idx" ON "seiten_abschnitte" USING btree ("bild_bild_id");
  CREATE INDEX "seiten_faq_order_idx" ON "seiten_faq" USING btree ("_order");
  CREATE INDEX "seiten_faq_parent_id_idx" ON "seiten_faq" USING btree ("_parent_id");
  CREATE INDEX "seiten_seo_interne_links_order_idx" ON "seiten_seo_interne_links" USING btree ("_order");
  CREATE INDEX "seiten_seo_interne_links_parent_id_idx" ON "seiten_seo_interne_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "seiten_route_idx" ON "seiten" USING btree ("route");
  CREATE INDEX "seiten_seo_social_bild_seo_social_bild_bild_idx" ON "seiten" USING btree ("seo_social_bild_bild_id");
  CREATE INDEX "seiten_updated_at_idx" ON "seiten" USING btree ("updated_at");
  CREATE INDEX "seiten_created_at_idx" ON "seiten" USING btree ("created_at");
  CREATE INDEX "seiten__status_idx" ON "seiten" USING btree ("_status");
  CREATE INDEX "_seiten_v_version_abschnitte_order_idx" ON "_seiten_v_version_abschnitte" USING btree ("_order");
  CREATE INDEX "_seiten_v_version_abschnitte_parent_id_idx" ON "_seiten_v_version_abschnitte" USING btree ("_parent_id");
  CREATE INDEX "_seiten_v_version_abschnitte_bild_bild_bild_idx" ON "_seiten_v_version_abschnitte" USING btree ("bild_bild_id");
  CREATE INDEX "_seiten_v_version_faq_order_idx" ON "_seiten_v_version_faq" USING btree ("_order");
  CREATE INDEX "_seiten_v_version_faq_parent_id_idx" ON "_seiten_v_version_faq" USING btree ("_parent_id");
  CREATE INDEX "_seiten_v_version_seo_interne_links_order_idx" ON "_seiten_v_version_seo_interne_links" USING btree ("_order");
  CREATE INDEX "_seiten_v_version_seo_interne_links_parent_id_idx" ON "_seiten_v_version_seo_interne_links" USING btree ("_parent_id");
  CREATE INDEX "_seiten_v_parent_idx" ON "_seiten_v" USING btree ("parent_id");
  CREATE INDEX "_seiten_v_version_version_route_idx" ON "_seiten_v" USING btree ("version_route");
  CREATE INDEX "_seiten_v_version_seo_social_bild_version_seo_social_bil_idx" ON "_seiten_v" USING btree ("version_seo_social_bild_bild_id");
  CREATE INDEX "_seiten_v_version_version_updated_at_idx" ON "_seiten_v" USING btree ("version_updated_at");
  CREATE INDEX "_seiten_v_version_version_created_at_idx" ON "_seiten_v" USING btree ("version_created_at");
  CREATE INDEX "_seiten_v_version_version__status_idx" ON "_seiten_v" USING btree ("version__status");
  CREATE INDEX "_seiten_v_created_at_idx" ON "_seiten_v" USING btree ("created_at");
  CREATE INDEX "_seiten_v_updated_at_idx" ON "_seiten_v" USING btree ("updated_at");
  CREATE INDEX "_seiten_v_latest_idx" ON "_seiten_v" USING btree ("latest");
  CREATE INDEX "leistungsseiten_stichpunkte_order_idx" ON "leistungsseiten_stichpunkte" USING btree ("_order");
  CREATE INDEX "leistungsseiten_stichpunkte_parent_id_idx" ON "leistungsseiten_stichpunkte" USING btree ("_parent_id");
  CREATE INDEX "leistungsseiten_seo_interne_links_order_idx" ON "leistungsseiten_seo_interne_links" USING btree ("_order");
  CREATE INDEX "leistungsseiten_seo_interne_links_parent_id_idx" ON "leistungsseiten_seo_interne_links" USING btree ("_parent_id");
  CREATE INDEX "leistungsseiten_bild_bild_bild_idx" ON "leistungsseiten" USING btree ("bild_bild_id");
  CREATE INDEX "leistungsseiten_seo_social_bild_seo_social_bild_bild_idx" ON "leistungsseiten" USING btree ("seo_social_bild_bild_id");
  CREATE INDEX "leistungsseiten_slug_idx" ON "leistungsseiten" USING btree ("slug");
  CREATE UNIQUE INDEX "leistungsseiten_kennung_idx" ON "leistungsseiten" USING btree ("kennung");
  CREATE INDEX "leistungsseiten_updated_at_idx" ON "leistungsseiten" USING btree ("updated_at");
  CREATE INDEX "leistungsseiten_created_at_idx" ON "leistungsseiten" USING btree ("created_at");
  CREATE INDEX "leistungsseiten_deleted_at_idx" ON "leistungsseiten" USING btree ("deleted_at");
  CREATE INDEX "leistungsseiten__status_idx" ON "leistungsseiten" USING btree ("_status");
  CREATE INDEX "_leistungsseiten_v_version_stichpunkte_order_idx" ON "_leistungsseiten_v_version_stichpunkte" USING btree ("_order");
  CREATE INDEX "_leistungsseiten_v_version_stichpunkte_parent_id_idx" ON "_leistungsseiten_v_version_stichpunkte" USING btree ("_parent_id");
  CREATE INDEX "_leistungsseiten_v_version_seo_interne_links_order_idx" ON "_leistungsseiten_v_version_seo_interne_links" USING btree ("_order");
  CREATE INDEX "_leistungsseiten_v_version_seo_interne_links_parent_id_idx" ON "_leistungsseiten_v_version_seo_interne_links" USING btree ("_parent_id");
  CREATE INDEX "_leistungsseiten_v_parent_idx" ON "_leistungsseiten_v" USING btree ("parent_id");
  CREATE INDEX "_leistungsseiten_v_version_bild_version_bild_bild_idx" ON "_leistungsseiten_v" USING btree ("version_bild_bild_id");
  CREATE INDEX "_leistungsseiten_v_version_seo_social_bild_version_seo_s_idx" ON "_leistungsseiten_v" USING btree ("version_seo_social_bild_bild_id");
  CREATE INDEX "_leistungsseiten_v_version_version_slug_idx" ON "_leistungsseiten_v" USING btree ("version_slug");
  CREATE INDEX "_leistungsseiten_v_version_version_kennung_idx" ON "_leistungsseiten_v" USING btree ("version_kennung");
  CREATE INDEX "_leistungsseiten_v_version_version_updated_at_idx" ON "_leistungsseiten_v" USING btree ("version_updated_at");
  CREATE INDEX "_leistungsseiten_v_version_version_created_at_idx" ON "_leistungsseiten_v" USING btree ("version_created_at");
  CREATE INDEX "_leistungsseiten_v_version_version_deleted_at_idx" ON "_leistungsseiten_v" USING btree ("version_deleted_at");
  CREATE INDEX "_leistungsseiten_v_version_version__status_idx" ON "_leistungsseiten_v" USING btree ("version__status");
  CREATE INDEX "_leistungsseiten_v_created_at_idx" ON "_leistungsseiten_v" USING btree ("created_at");
  CREATE INDEX "_leistungsseiten_v_updated_at_idx" ON "_leistungsseiten_v" USING btree ("updated_at");
  CREATE INDEX "_leistungsseiten_v_latest_idx" ON "_leistungsseiten_v" USING btree ("latest");
  CREATE INDEX "ratgeber_abschnitte_order_idx" ON "ratgeber_abschnitte" USING btree ("_order");
  CREATE INDEX "ratgeber_abschnitte_parent_id_idx" ON "ratgeber_abschnitte" USING btree ("_parent_id");
  CREATE INDEX "ratgeber_seo_interne_links_order_idx" ON "ratgeber_seo_interne_links" USING btree ("_order");
  CREATE INDEX "ratgeber_seo_interne_links_parent_id_idx" ON "ratgeber_seo_interne_links" USING btree ("_parent_id");
  CREATE INDEX "ratgeber_bild_bild_bild_idx" ON "ratgeber" USING btree ("bild_bild_id");
  CREATE INDEX "ratgeber_seo_social_bild_seo_social_bild_bild_idx" ON "ratgeber" USING btree ("seo_social_bild_bild_id");
  CREATE UNIQUE INDEX "ratgeber_slug_idx" ON "ratgeber" USING btree ("slug");
  CREATE UNIQUE INDEX "ratgeber_kennung_idx" ON "ratgeber" USING btree ("kennung");
  CREATE INDEX "ratgeber_updated_at_idx" ON "ratgeber" USING btree ("updated_at");
  CREATE INDEX "ratgeber_created_at_idx" ON "ratgeber" USING btree ("created_at");
  CREATE INDEX "ratgeber_deleted_at_idx" ON "ratgeber" USING btree ("deleted_at");
  CREATE INDEX "ratgeber__status_idx" ON "ratgeber" USING btree ("_status");
  CREATE INDEX "_ratgeber_v_version_abschnitte_order_idx" ON "_ratgeber_v_version_abschnitte" USING btree ("_order");
  CREATE INDEX "_ratgeber_v_version_abschnitte_parent_id_idx" ON "_ratgeber_v_version_abschnitte" USING btree ("_parent_id");
  CREATE INDEX "_ratgeber_v_version_seo_interne_links_order_idx" ON "_ratgeber_v_version_seo_interne_links" USING btree ("_order");
  CREATE INDEX "_ratgeber_v_version_seo_interne_links_parent_id_idx" ON "_ratgeber_v_version_seo_interne_links" USING btree ("_parent_id");
  CREATE INDEX "_ratgeber_v_parent_idx" ON "_ratgeber_v" USING btree ("parent_id");
  CREATE INDEX "_ratgeber_v_version_bild_version_bild_bild_idx" ON "_ratgeber_v" USING btree ("version_bild_bild_id");
  CREATE INDEX "_ratgeber_v_version_seo_social_bild_version_seo_social_b_idx" ON "_ratgeber_v" USING btree ("version_seo_social_bild_bild_id");
  CREATE INDEX "_ratgeber_v_version_version_slug_idx" ON "_ratgeber_v" USING btree ("version_slug");
  CREATE INDEX "_ratgeber_v_version_version_kennung_idx" ON "_ratgeber_v" USING btree ("version_kennung");
  CREATE INDEX "_ratgeber_v_version_version_updated_at_idx" ON "_ratgeber_v" USING btree ("version_updated_at");
  CREATE INDEX "_ratgeber_v_version_version_created_at_idx" ON "_ratgeber_v" USING btree ("version_created_at");
  CREATE INDEX "_ratgeber_v_version_version_deleted_at_idx" ON "_ratgeber_v" USING btree ("version_deleted_at");
  CREATE INDEX "_ratgeber_v_version_version__status_idx" ON "_ratgeber_v" USING btree ("version__status");
  CREATE INDEX "_ratgeber_v_created_at_idx" ON "_ratgeber_v" USING btree ("created_at");
  CREATE INDEX "_ratgeber_v_updated_at_idx" ON "_ratgeber_v" USING btree ("updated_at");
  CREATE INDEX "_ratgeber_v_latest_idx" ON "_ratgeber_v" USING btree ("latest");
  CREATE INDEX "einsatzgebiete_lokale_fakten_order_idx" ON "einsatzgebiete_lokale_fakten" USING btree ("_order");
  CREATE INDEX "einsatzgebiete_lokale_fakten_parent_id_idx" ON "einsatzgebiete_lokale_fakten" USING btree ("_parent_id");
  CREATE INDEX "einsatzgebiete_leistungen_order_idx" ON "einsatzgebiete_leistungen" USING btree ("order");
  CREATE INDEX "einsatzgebiete_leistungen_parent_idx" ON "einsatzgebiete_leistungen" USING btree ("parent_id");
  CREATE INDEX "einsatzgebiete_seo_interne_links_order_idx" ON "einsatzgebiete_seo_interne_links" USING btree ("_order");
  CREATE INDEX "einsatzgebiete_seo_interne_links_parent_id_idx" ON "einsatzgebiete_seo_interne_links" USING btree ("_parent_id");
  CREATE INDEX "einsatzgebiete_seo_social_bild_seo_social_bild_bild_idx" ON "einsatzgebiete" USING btree ("seo_social_bild_bild_id");
  CREATE UNIQUE INDEX "einsatzgebiete_slug_idx" ON "einsatzgebiete" USING btree ("slug");
  CREATE UNIQUE INDEX "einsatzgebiete_kennung_idx" ON "einsatzgebiete" USING btree ("kennung");
  CREATE INDEX "einsatzgebiete_updated_at_idx" ON "einsatzgebiete" USING btree ("updated_at");
  CREATE INDEX "einsatzgebiete_created_at_idx" ON "einsatzgebiete" USING btree ("created_at");
  CREATE INDEX "einsatzgebiete_deleted_at_idx" ON "einsatzgebiete" USING btree ("deleted_at");
  CREATE INDEX "einsatzgebiete__status_idx" ON "einsatzgebiete" USING btree ("_status");
  CREATE INDEX "_einsatzgebiete_v_version_lokale_fakten_order_idx" ON "_einsatzgebiete_v_version_lokale_fakten" USING btree ("_order");
  CREATE INDEX "_einsatzgebiete_v_version_lokale_fakten_parent_id_idx" ON "_einsatzgebiete_v_version_lokale_fakten" USING btree ("_parent_id");
  CREATE INDEX "_einsatzgebiete_v_version_leistungen_order_idx" ON "_einsatzgebiete_v_version_leistungen" USING btree ("order");
  CREATE INDEX "_einsatzgebiete_v_version_leistungen_parent_idx" ON "_einsatzgebiete_v_version_leistungen" USING btree ("parent_id");
  CREATE INDEX "_einsatzgebiete_v_version_seo_interne_links_order_idx" ON "_einsatzgebiete_v_version_seo_interne_links" USING btree ("_order");
  CREATE INDEX "_einsatzgebiete_v_version_seo_interne_links_parent_id_idx" ON "_einsatzgebiete_v_version_seo_interne_links" USING btree ("_parent_id");
  CREATE INDEX "_einsatzgebiete_v_parent_idx" ON "_einsatzgebiete_v" USING btree ("parent_id");
  CREATE INDEX "_einsatzgebiete_v_version_seo_social_bild_version_seo_so_idx" ON "_einsatzgebiete_v" USING btree ("version_seo_social_bild_bild_id");
  CREATE INDEX "_einsatzgebiete_v_version_version_slug_idx" ON "_einsatzgebiete_v" USING btree ("version_slug");
  CREATE INDEX "_einsatzgebiete_v_version_version_kennung_idx" ON "_einsatzgebiete_v" USING btree ("version_kennung");
  CREATE INDEX "_einsatzgebiete_v_version_version_updated_at_idx" ON "_einsatzgebiete_v" USING btree ("version_updated_at");
  CREATE INDEX "_einsatzgebiete_v_version_version_created_at_idx" ON "_einsatzgebiete_v" USING btree ("version_created_at");
  CREATE INDEX "_einsatzgebiete_v_version_version_deleted_at_idx" ON "_einsatzgebiete_v" USING btree ("version_deleted_at");
  CREATE INDEX "_einsatzgebiete_v_version_version__status_idx" ON "_einsatzgebiete_v" USING btree ("version__status");
  CREATE INDEX "_einsatzgebiete_v_created_at_idx" ON "_einsatzgebiete_v" USING btree ("created_at");
  CREATE INDEX "_einsatzgebiete_v_updated_at_idx" ON "_einsatzgebiete_v" USING btree ("updated_at");
  CREATE INDEX "_einsatzgebiete_v_latest_idx" ON "_einsatzgebiete_v" USING btree ("latest");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "zylinderkatalog_bauformen_order_idx" ON "zylinderkatalog_bauformen" USING btree ("_order");
  CREATE INDEX "zylinderkatalog_bauformen_parent_id_idx" ON "zylinderkatalog_bauformen" USING btree ("_parent_id");
  CREATE INDEX "zylinderkatalog_bauformen_info_grafik_info_grafik_bild_idx" ON "zylinderkatalog_bauformen" USING btree ("info_grafik_bild_id");
  CREATE INDEX "zylinderkatalog_bauformen_grafik_grafik_bild_idx" ON "zylinderkatalog_bauformen" USING btree ("grafik_bild_id");
  CREATE INDEX "zylinderkatalog_funktionen_bauformen_order_idx" ON "zylinderkatalog_funktionen_bauformen" USING btree ("order");
  CREATE INDEX "zylinderkatalog_funktionen_bauformen_parent_idx" ON "zylinderkatalog_funktionen_bauformen" USING btree ("parent_id");
  CREATE INDEX "zylinderkatalog_funktionen_order_idx" ON "zylinderkatalog_funktionen" USING btree ("_order");
  CREATE INDEX "zylinderkatalog_funktionen_parent_id_idx" ON "zylinderkatalog_funktionen" USING btree ("_parent_id");
  CREATE INDEX "zylinderkatalog_funktionen_info_grafik_info_grafik_bild_idx" ON "zylinderkatalog_funktionen" USING btree ("info_grafik_bild_id");
  CREATE INDEX "zylinderkatalog_extras_order_idx" ON "zylinderkatalog_extras" USING btree ("_order");
  CREATE INDEX "zylinderkatalog_extras_parent_id_idx" ON "zylinderkatalog_extras" USING btree ("_parent_id");
  CREATE INDEX "zylinderkatalog_extras_info_grafik_info_grafik_bild_idx" ON "zylinderkatalog_extras" USING btree ("info_grafik_bild_id");
  CREATE INDEX "zylinderkatalog_mess_info_grafik_mess_info_grafik_bild_idx" ON "zylinderkatalog" USING btree ("mess_info_grafik_bild_id");
  CREATE INDEX "zylinderkatalog_mess_grafik_mess_grafik_bild_idx" ON "zylinderkatalog" USING btree ("mess_grafik_bild_id");
  CREATE INDEX "einstellungen_oeffnungszeiten_zeiten_order_idx" ON "einstellungen_oeffnungszeiten_zeiten" USING btree ("_order");
  CREATE INDEX "einstellungen_oeffnungszeiten_zeiten_parent_id_idx" ON "einstellungen_oeffnungszeiten_zeiten" USING btree ("_parent_id");
  CREATE INDEX "einstellungen_oeffnungszeiten_order_idx" ON "einstellungen_oeffnungszeiten" USING btree ("_order");
  CREATE INDEX "einstellungen_oeffnungszeiten_parent_id_idx" ON "einstellungen_oeffnungszeiten" USING btree ("_parent_id");
  CREATE INDEX "einstellungen_buchung_fenster_order_idx" ON "einstellungen_buchung_fenster" USING btree ("_order");
  CREATE INDEX "einstellungen_buchung_fenster_parent_id_idx" ON "einstellungen_buchung_fenster" USING btree ("_parent_id");
  CREATE INDEX "einstellungen_versand_produktklassen_order_idx" ON "einstellungen_versand_produktklassen" USING btree ("order");
  CREATE INDEX "einstellungen_versand_produktklassen_parent_idx" ON "einstellungen_versand_produktklassen" USING btree ("parent_id");
  CREATE INDEX "einstellungen_versand_order_idx" ON "einstellungen_versand" USING btree ("_order");
  CREATE INDEX "einstellungen_versand_parent_id_idx" ON "einstellungen_versand" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vorgaenge_fk" FOREIGN KEY ("vorgaenge_id") REFERENCES "public"."vorgaenge"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_produkte_fk" FOREIGN KEY ("produkte_id") REFERENCES "public"."produkte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_fahrzeugmarken_fk" FOREIGN KEY ("fahrzeugmarken_id") REFERENCES "public"."fahrzeugmarken"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_autoschluessel_leistungen_fk" FOREIGN KEY ("autoschluessel_leistungen_id") REFERENCES "public"."autoschluessel_leistungen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_preisregeln_fk" FOREIGN KEY ("preisregeln_id") REFERENCES "public"."preisregeln"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_preisgruppen_fk" FOREIGN KEY ("preisgruppen_id") REFERENCES "public"."preisgruppen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sperrtage_fk" FOREIGN KEY ("sperrtage_id") REFERENCES "public"."sperrtage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_seiten_fk" FOREIGN KEY ("seiten_id") REFERENCES "public"."seiten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leistungsseiten_fk" FOREIGN KEY ("leistungsseiten_id") REFERENCES "public"."leistungsseiten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ratgeber_fk" FOREIGN KEY ("ratgeber_id") REFERENCES "public"."ratgeber"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_einsatzgebiete_fk" FOREIGN KEY ("einsatzgebiete_id") REFERENCES "public"."einsatzgebiete"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_vorgaenge_id_idx" ON "payload_locked_documents_rels" USING btree ("vorgaenge_id");
  CREATE INDEX "payload_locked_documents_rels_produkte_id_idx" ON "payload_locked_documents_rels" USING btree ("produkte_id");
  CREATE INDEX "payload_locked_documents_rels_fahrzeugmarken_id_idx" ON "payload_locked_documents_rels" USING btree ("fahrzeugmarken_id");
  CREATE INDEX "payload_locked_documents_rels_autoschluessel_leistungen__idx" ON "payload_locked_documents_rels" USING btree ("autoschluessel_leistungen_id");
  CREATE INDEX "payload_locked_documents_rels_preisregeln_id_idx" ON "payload_locked_documents_rels" USING btree ("preisregeln_id");
  CREATE INDEX "payload_locked_documents_rels_preisgruppen_id_idx" ON "payload_locked_documents_rels" USING btree ("preisgruppen_id");
  CREATE INDEX "payload_locked_documents_rels_sperrtage_id_idx" ON "payload_locked_documents_rels" USING btree ("sperrtage_id");
  CREATE INDEX "payload_locked_documents_rels_seiten_id_idx" ON "payload_locked_documents_rels" USING btree ("seiten_id");
  CREATE INDEX "payload_locked_documents_rels_leistungsseiten_id_idx" ON "payload_locked_documents_rels" USING btree ("leistungsseiten_id");
  CREATE INDEX "payload_locked_documents_rels_ratgeber_id_idx" ON "payload_locked_documents_rels" USING btree ("ratgeber_id");
  CREATE INDEX "payload_locked_documents_rels_einsatzgebiete_id_idx" ON "payload_locked_documents_rels" USING btree ("einsatzgebiete_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "vorgaenge_zusammenfassung_zeilen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vorgaenge_zusammenfassung" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vorgaenge_notizen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vorgaenge_verlauf" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vorgaenge" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "produkte_eigenschaften" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "produkte_staffeln" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "produkte_seo_interne_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "produkte" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "produkte_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "produkte_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_produkte_v_version_eigenschaften" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_produkte_v_version_staffeln" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_produkte_v_version_seo_interne_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_produkte_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_produkte_v_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_produkte_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "fahrzeugmarken_modelle_schluesselarten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "fahrzeugmarken_modelle" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "fahrzeugmarken" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_fahrzeugmarken_v_version_modelle_schluesselarten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_fahrzeugmarken_v_version_modelle" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_fahrzeugmarken_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "autoschluessel_leistungen_schluesselarten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "autoschluessel_leistungen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "preisregeln" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "preisgruppen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sperrtage_zeitfenster" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sperrtage" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seiten_abschnitte" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seiten_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seiten_seo_interne_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seiten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_seiten_v_version_abschnitte" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_seiten_v_version_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_seiten_v_version_seo_interne_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_seiten_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "leistungsseiten_stichpunkte" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "leistungsseiten_seo_interne_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "leistungsseiten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_leistungsseiten_v_version_stichpunkte" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_leistungsseiten_v_version_seo_interne_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_leistungsseiten_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ratgeber_abschnitte" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ratgeber_seo_interne_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ratgeber" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_ratgeber_v_version_abschnitte" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_ratgeber_v_version_seo_interne_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_ratgeber_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "einsatzgebiete_lokale_fakten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "einsatzgebiete_leistungen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "einsatzgebiete_seo_interne_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "einsatzgebiete" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_einsatzgebiete_v_version_lokale_fakten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_einsatzgebiete_v_version_leistungen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_einsatzgebiete_v_version_seo_interne_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_einsatzgebiete_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs_log" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "zylinderkatalog_bauformen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "zylinderkatalog_funktionen_bauformen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "zylinderkatalog_funktionen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "zylinderkatalog_extras" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "zylinderkatalog" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "einstellungen_oeffnungszeiten_zeiten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "einstellungen_oeffnungszeiten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "einstellungen_buchung_fenster" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "einstellungen_versand_produktklassen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "einstellungen_versand" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "einstellungen" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "vorgaenge_zusammenfassung_zeilen" CASCADE;
  DROP TABLE "vorgaenge_zusammenfassung" CASCADE;
  DROP TABLE "vorgaenge_notizen" CASCADE;
  DROP TABLE "vorgaenge_verlauf" CASCADE;
  DROP TABLE "vorgaenge" CASCADE;
  DROP TABLE "produkte_eigenschaften" CASCADE;
  DROP TABLE "produkte_staffeln" CASCADE;
  DROP TABLE "produkte_seo_interne_links" CASCADE;
  DROP TABLE "produkte" CASCADE;
  DROP TABLE "produkte_texts" CASCADE;
  DROP TABLE "produkte_rels" CASCADE;
  DROP TABLE "_produkte_v_version_eigenschaften" CASCADE;
  DROP TABLE "_produkte_v_version_staffeln" CASCADE;
  DROP TABLE "_produkte_v_version_seo_interne_links" CASCADE;
  DROP TABLE "_produkte_v" CASCADE;
  DROP TABLE "_produkte_v_texts" CASCADE;
  DROP TABLE "_produkte_v_rels" CASCADE;
  DROP TABLE "fahrzeugmarken_modelle_schluesselarten" CASCADE;
  DROP TABLE "fahrzeugmarken_modelle" CASCADE;
  DROP TABLE "fahrzeugmarken" CASCADE;
  DROP TABLE "_fahrzeugmarken_v_version_modelle_schluesselarten" CASCADE;
  DROP TABLE "_fahrzeugmarken_v_version_modelle" CASCADE;
  DROP TABLE "_fahrzeugmarken_v" CASCADE;
  DROP TABLE "autoschluessel_leistungen_schluesselarten" CASCADE;
  DROP TABLE "autoschluessel_leistungen" CASCADE;
  DROP TABLE "preisregeln" CASCADE;
  DROP TABLE "preisgruppen" CASCADE;
  DROP TABLE "sperrtage_zeitfenster" CASCADE;
  DROP TABLE "sperrtage" CASCADE;
  DROP TABLE "seiten_abschnitte" CASCADE;
  DROP TABLE "seiten_faq" CASCADE;
  DROP TABLE "seiten_seo_interne_links" CASCADE;
  DROP TABLE "seiten" CASCADE;
  DROP TABLE "_seiten_v_version_abschnitte" CASCADE;
  DROP TABLE "_seiten_v_version_faq" CASCADE;
  DROP TABLE "_seiten_v_version_seo_interne_links" CASCADE;
  DROP TABLE "_seiten_v" CASCADE;
  DROP TABLE "leistungsseiten_stichpunkte" CASCADE;
  DROP TABLE "leistungsseiten_seo_interne_links" CASCADE;
  DROP TABLE "leistungsseiten" CASCADE;
  DROP TABLE "_leistungsseiten_v_version_stichpunkte" CASCADE;
  DROP TABLE "_leistungsseiten_v_version_seo_interne_links" CASCADE;
  DROP TABLE "_leistungsseiten_v" CASCADE;
  DROP TABLE "ratgeber_abschnitte" CASCADE;
  DROP TABLE "ratgeber_seo_interne_links" CASCADE;
  DROP TABLE "ratgeber" CASCADE;
  DROP TABLE "_ratgeber_v_version_abschnitte" CASCADE;
  DROP TABLE "_ratgeber_v_version_seo_interne_links" CASCADE;
  DROP TABLE "_ratgeber_v" CASCADE;
  DROP TABLE "einsatzgebiete_lokale_fakten" CASCADE;
  DROP TABLE "einsatzgebiete_leistungen" CASCADE;
  DROP TABLE "einsatzgebiete_seo_interne_links" CASCADE;
  DROP TABLE "einsatzgebiete" CASCADE;
  DROP TABLE "_einsatzgebiete_v_version_lokale_fakten" CASCADE;
  DROP TABLE "_einsatzgebiete_v_version_leistungen" CASCADE;
  DROP TABLE "_einsatzgebiete_v_version_seo_interne_links" CASCADE;
  DROP TABLE "_einsatzgebiete_v" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "zylinderkatalog_bauformen" CASCADE;
  DROP TABLE "zylinderkatalog_funktionen_bauformen" CASCADE;
  DROP TABLE "zylinderkatalog_funktionen" CASCADE;
  DROP TABLE "zylinderkatalog_extras" CASCADE;
  DROP TABLE "zylinderkatalog" CASCADE;
  DROP TABLE "einstellungen_oeffnungszeiten_zeiten" CASCADE;
  DROP TABLE "einstellungen_oeffnungszeiten" CASCADE;
  DROP TABLE "einstellungen_buchung_fenster" CASCADE;
  DROP TABLE "einstellungen_versand_produktklassen" CASCADE;
  DROP TABLE "einstellungen_versand" CASCADE;
  DROP TABLE "einstellungen" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_vorgaenge_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_produkte_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_fahrzeugmarken_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_autoschluessel_leistungen_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_preisregeln_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_preisgruppen_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sperrtage_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_seiten_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_leistungsseiten_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_ratgeber_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_einsatzgebiete_fk";
  
  DROP INDEX "payload_locked_documents_rels_vorgaenge_id_idx";
  DROP INDEX "payload_locked_documents_rels_produkte_id_idx";
  DROP INDEX "payload_locked_documents_rels_fahrzeugmarken_id_idx";
  DROP INDEX "payload_locked_documents_rels_autoschluessel_leistungen__idx";
  DROP INDEX "payload_locked_documents_rels_preisregeln_id_idx";
  DROP INDEX "payload_locked_documents_rels_preisgruppen_id_idx";
  DROP INDEX "payload_locked_documents_rels_sperrtage_id_idx";
  DROP INDEX "payload_locked_documents_rels_seiten_id_idx";
  DROP INDEX "payload_locked_documents_rels_leistungsseiten_id_idx";
  DROP INDEX "payload_locked_documents_rels_ratgeber_id_idx";
  DROP INDEX "payload_locked_documents_rels_einsatzgebiete_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "vorgaenge_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "produkte_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "fahrzeugmarken_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "autoschluessel_leistungen_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "preisregeln_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "preisgruppen_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sperrtage_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "seiten_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "leistungsseiten_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "ratgeber_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "einsatzgebiete_id";
  DROP TYPE "public"."enum_vorgaenge_notizen_von";
  DROP TYPE "public"."enum_vorgaenge_verlauf_von";
  DROP TYPE "public"."enum_vorgaenge_art";
  DROP TYPE "public"."enum_vorgaenge_bereich";
  DROP TYPE "public"."enum_vorgaenge_prozess";
  DROP TYPE "public"."enum_vorgaenge_status";
  DROP TYPE "public"."enum_vorgaenge_termin_ort";
  DROP TYPE "public"."enum_vorgaenge_zahlung_umfang";
  DROP TYPE "public"."enum_vorgaenge_zahlung_status";
  DROP TYPE "public"."enum_produkte_typ";
  DROP TYPE "public"."enum_produkte_versandklasse";
  DROP TYPE "public"."enum_produkte_code_fundstelle_format";
  DROP TYPE "public"."enum_produkte_foto_upload";
  DROP TYPE "public"."enum_produkte_produktbild_format";
  DROP TYPE "public"."enum_produkte_seo_social_bild_format";
  DROP TYPE "public"."enum_produkte_status";
  DROP TYPE "public"."enum__produkte_v_version_typ";
  DROP TYPE "public"."enum__produkte_v_version_versandklasse";
  DROP TYPE "public"."enum__produkte_v_version_code_fundstelle_format";
  DROP TYPE "public"."enum__produkte_v_version_foto_upload";
  DROP TYPE "public"."enum__produkte_v_version_produktbild_format";
  DROP TYPE "public"."enum__produkte_v_version_seo_social_bild_format";
  DROP TYPE "public"."enum__produkte_v_version_status";
  DROP TYPE "public"."enum_fahrzeugmarken_modelle_schluesselarten";
  DROP TYPE "public"."enum_fahrzeugmarken_bild_format";
  DROP TYPE "public"."enum_fahrzeugmarken_status";
  DROP TYPE "public"."enum__fahrzeugmarken_v_version_modelle_schluesselarten";
  DROP TYPE "public"."enum__fahrzeugmarken_v_version_bild_format";
  DROP TYPE "public"."enum__fahrzeugmarken_v_version_status";
  DROP TYPE "public"."enum_autoschluessel_leistungen_schluesselarten";
  DROP TYPE "public"."enum_preisregeln_schluesselart";
  DROP TYPE "public"."enum_preisregeln_modus";
  DROP TYPE "public"."enum_seiten_abschnitte_bild_format";
  DROP TYPE "public"."enum_seiten_seo_social_bild_format";
  DROP TYPE "public"."enum_seiten_status";
  DROP TYPE "public"."enum__seiten_v_version_abschnitte_bild_format";
  DROP TYPE "public"."enum__seiten_v_version_seo_social_bild_format";
  DROP TYPE "public"."enum__seiten_v_version_status";
  DROP TYPE "public"."enum_leistungsseiten_bereich";
  DROP TYPE "public"."enum_leistungsseiten_bild_format";
  DROP TYPE "public"."enum_leistungsseiten_prozess";
  DROP TYPE "public"."enum_leistungsseiten_seo_social_bild_format";
  DROP TYPE "public"."enum_leistungsseiten_status";
  DROP TYPE "public"."enum__leistungsseiten_v_version_bereich";
  DROP TYPE "public"."enum__leistungsseiten_v_version_bild_format";
  DROP TYPE "public"."enum__leistungsseiten_v_version_prozess";
  DROP TYPE "public"."enum__leistungsseiten_v_version_seo_social_bild_format";
  DROP TYPE "public"."enum__leistungsseiten_v_version_status";
  DROP TYPE "public"."enum_ratgeber_thema";
  DROP TYPE "public"."enum_ratgeber_bild_format";
  DROP TYPE "public"."enum_ratgeber_seo_social_bild_format";
  DROP TYPE "public"."enum_ratgeber_status";
  DROP TYPE "public"."enum__ratgeber_v_version_thema";
  DROP TYPE "public"."enum__ratgeber_v_version_bild_format";
  DROP TYPE "public"."enum__ratgeber_v_version_seo_social_bild_format";
  DROP TYPE "public"."enum__ratgeber_v_version_status";
  DROP TYPE "public"."enum_einsatzgebiete_leistungen";
  DROP TYPE "public"."enum_einsatzgebiete_seo_social_bild_format";
  DROP TYPE "public"."enum_einsatzgebiete_status";
  DROP TYPE "public"."enum__einsatzgebiete_v_version_leistungen";
  DROP TYPE "public"."enum__einsatzgebiete_v_version_seo_social_bild_format";
  DROP TYPE "public"."enum__einsatzgebiete_v_version_status";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_zylinderkatalog_bauformen_kennung";
  DROP TYPE "public"."enum_zylinderkatalog_bauformen_masse";
  DROP TYPE "public"."enum_zylinderkatalog_bauformen_info_grafik_format";
  DROP TYPE "public"."enum_zylinderkatalog_bauformen_grafik_format";
  DROP TYPE "public"."enum_zylinderkatalog_funktionen_bauformen";
  DROP TYPE "public"."enum_zylinderkatalog_funktionen_info_grafik_format";
  DROP TYPE "public"."enum_zylinderkatalog_extras_einheit";
  DROP TYPE "public"."enum_zylinderkatalog_extras_info_grafik_format";
  DROP TYPE "public"."enum_zylinderkatalog_mess_info_grafik_format";
  DROP TYPE "public"."enum_zylinderkatalog_mess_grafik_format";
  DROP TYPE "public"."enum_einstellungen_oeffnungszeiten_tag";
  DROP TYPE "public"."enum_einstellungen_versand_produktklassen";`)
}
