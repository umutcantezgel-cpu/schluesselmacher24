import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_vorgaenge_vermittlung_auftragsart" AS ENUM('autoschluessel-vor-ort', 'schluesseldienst-vor-ort', 'montage-zylinder', 'montage-schliessanlage', 'beratung-vor-ort', 'einbau-elektronik');
  CREATE TYPE "public"."enum_vorgaenge_auszahlung_stand" AS ENUM('offen', 'freigegeben', 'ausgezahlt', 'gesperrt');
  CREATE TYPE "public"."enum_vorgaenge_auszahlung_weg" AS ENUM('ueberweisung', 'zahlungsdienst');
  CREATE TYPE "public"."enum_vorgaenge_erstattung_art" AS ENUM('ganz', 'teilweise');
  ALTER TYPE "public"."enum_vorgaenge_mails_art" ADD VALUE 'ausfuehrung' BEFORE 'sonstige';
  ALTER TYPE "public"."enum_vorgaenge_vermittlung_status" ADD VALUE 'termin-bestaetigt' BEFORE 'erledigt';
  ALTER TYPE "public"."enum_vorgaenge_vermittlung_status" ADD VALUE 'kunde-bestaetigt' BEFORE 'provision-abgerechnet';
  ALTER TYPE "public"."enum_vorgaenge_vermittlung_status" ADD VALUE 'auszahlung-freigegeben' BEFORE 'provision-abgerechnet';
  ALTER TYPE "public"."enum_vorgaenge_vermittlung_status" ADD VALUE 'ausgezahlt' BEFORE 'provision-abgerechnet';
  ALTER TYPE "public"."enum_vorgaenge_zahlung_status" ADD VALUE 'teilweise-erstattet';
  ALTER TABLE "vorgaenge" ADD COLUMN "vermittlung_auftragsart" "enum_vorgaenge_vermittlung_auftragsart";
  ALTER TABLE "vorgaenge" ADD COLUMN "vermittlung_gesamt_cent" numeric;
  ALTER TABLE "vorgaenge" ADD COLUMN "vermittlung_plattformanteil_cent" numeric;
  ALTER TABLE "vorgaenge" ADD COLUMN "vermittlung_partnerbetrag_cent" numeric;
  ALTER TABLE "vorgaenge" ADD COLUMN "vermittlung_anteil_hinweis" varchar;
  ALTER TABLE "vorgaenge" ADD COLUMN "vermittlung_festgeschrieben_am" timestamp(3) with time zone;
  ALTER TABLE "vorgaenge" ADD COLUMN "vermittlung_bestaetigung_gesendet_am" timestamp(3) with time zone;
  ALTER TABLE "vorgaenge" ADD COLUMN "vermittlung_kunde_bestaetigt_am" timestamp(3) with time zone;
  ALTER TABLE "vorgaenge" ADD COLUMN "vermittlung_team_bestaetigung_grund" varchar;
  ALTER TABLE "vorgaenge" ADD COLUMN "vermittlung_bestaetigung_hash" varchar;
  ALTER TABLE "vorgaenge" ADD COLUMN "auszahlung_stand" "enum_vorgaenge_auszahlung_stand";
  ALTER TABLE "vorgaenge" ADD COLUMN "auszahlung_freigegeben_am" timestamp(3) with time zone;
  ALTER TABLE "vorgaenge" ADD COLUMN "auszahlung_freigegeben_von" varchar;
  ALTER TABLE "vorgaenge" ADD COLUMN "auszahlung_ausgezahlt_am" timestamp(3) with time zone;
  ALTER TABLE "vorgaenge" ADD COLUMN "auszahlung_weg" "enum_vorgaenge_auszahlung_weg";
  ALTER TABLE "vorgaenge" ADD COLUMN "auszahlung_referenz" varchar;
  ALTER TABLE "vorgaenge" ADD COLUMN "auszahlung_notiz" varchar;
  ALTER TABLE "vorgaenge" ADD COLUMN "erstattung_art" "enum_vorgaenge_erstattung_art";
  ALTER TABLE "vorgaenge" ADD COLUMN "erstattung_betrag_cent" numeric;
  ALTER TABLE "vorgaenge" ADD COLUMN "erstattung_am" timestamp(3) with time zone;
  ALTER TABLE "vorgaenge" ADD COLUMN "erstattung_grund" varchar;
  ALTER TABLE "partnerbetriebe" ADD COLUMN "konto_kennung" varchar;
  CREATE INDEX "vorgaenge_auszahlung_auszahlung_stand_idx" ON "vorgaenge" USING btree ("auszahlung_stand");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "vorgaenge_mails" ALTER COLUMN "art" SET DATA TYPE text;
  DROP TYPE "public"."enum_vorgaenge_mails_art";
  CREATE TYPE "public"."enum_vorgaenge_mails_art" AS ENUM('eingang-kunde', 'eingang-team', 'vertrag', 'zahlung-erhalten', 'zahlung-nicht-abgeschlossen', 'erstattung', 'status', 'widerruf', 'erinnerung', 'freigabe', 'team-hinweis', 'sonstige');
  ALTER TABLE "vorgaenge_mails" ALTER COLUMN "art" SET DATA TYPE "public"."enum_vorgaenge_mails_art" USING "art"::"public"."enum_vorgaenge_mails_art";
  ALTER TABLE "vorgaenge" ALTER COLUMN "vermittlung_status" SET DATA TYPE text;
  DROP TYPE "public"."enum_vorgaenge_vermittlung_status";
  CREATE TYPE "public"."enum_vorgaenge_vermittlung_status" AS ENUM('neu', 'geprueft', 'partner-angefragt', 'angenommen', 'erledigt', 'provision-abgerechnet');
  ALTER TABLE "vorgaenge" ALTER COLUMN "vermittlung_status" SET DATA TYPE "public"."enum_vorgaenge_vermittlung_status" USING "vermittlung_status"::"public"."enum_vorgaenge_vermittlung_status";
  ALTER TABLE "vorgaenge" ALTER COLUMN "zahlung_status" SET DATA TYPE text;
  DROP TYPE "public"."enum_vorgaenge_zahlung_status";
  CREATE TYPE "public"."enum_vorgaenge_zahlung_status" AS ENUM('offen', 'bezahlt', 'fehlgeschlagen', 'erstattet');
  ALTER TABLE "vorgaenge" ALTER COLUMN "zahlung_status" SET DATA TYPE "public"."enum_vorgaenge_zahlung_status" USING "zahlung_status"::"public"."enum_vorgaenge_zahlung_status";
  DROP INDEX "vorgaenge_auszahlung_auszahlung_stand_idx";
  ALTER TABLE "vorgaenge" DROP COLUMN "vermittlung_auftragsart";
  ALTER TABLE "vorgaenge" DROP COLUMN "vermittlung_gesamt_cent";
  ALTER TABLE "vorgaenge" DROP COLUMN "vermittlung_plattformanteil_cent";
  ALTER TABLE "vorgaenge" DROP COLUMN "vermittlung_partnerbetrag_cent";
  ALTER TABLE "vorgaenge" DROP COLUMN "vermittlung_anteil_hinweis";
  ALTER TABLE "vorgaenge" DROP COLUMN "vermittlung_festgeschrieben_am";
  ALTER TABLE "vorgaenge" DROP COLUMN "vermittlung_bestaetigung_gesendet_am";
  ALTER TABLE "vorgaenge" DROP COLUMN "vermittlung_kunde_bestaetigt_am";
  ALTER TABLE "vorgaenge" DROP COLUMN "vermittlung_team_bestaetigung_grund";
  ALTER TABLE "vorgaenge" DROP COLUMN "vermittlung_bestaetigung_hash";
  ALTER TABLE "vorgaenge" DROP COLUMN "auszahlung_stand";
  ALTER TABLE "vorgaenge" DROP COLUMN "auszahlung_freigegeben_am";
  ALTER TABLE "vorgaenge" DROP COLUMN "auszahlung_freigegeben_von";
  ALTER TABLE "vorgaenge" DROP COLUMN "auszahlung_ausgezahlt_am";
  ALTER TABLE "vorgaenge" DROP COLUMN "auszahlung_weg";
  ALTER TABLE "vorgaenge" DROP COLUMN "auszahlung_referenz";
  ALTER TABLE "vorgaenge" DROP COLUMN "auszahlung_notiz";
  ALTER TABLE "vorgaenge" DROP COLUMN "erstattung_art";
  ALTER TABLE "vorgaenge" DROP COLUMN "erstattung_betrag_cent";
  ALTER TABLE "vorgaenge" DROP COLUMN "erstattung_am";
  ALTER TABLE "vorgaenge" DROP COLUMN "erstattung_grund";
  ALTER TABLE "partnerbetriebe" DROP COLUMN "konto_kennung";
  DROP TYPE "public"."enum_vorgaenge_vermittlung_auftragsart";
  DROP TYPE "public"."enum_vorgaenge_auszahlung_stand";
  DROP TYPE "public"."enum_vorgaenge_auszahlung_weg";
  DROP TYPE "public"."enum_vorgaenge_erstattung_art";`)
}
