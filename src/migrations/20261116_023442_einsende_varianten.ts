import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_einstellungen_einsenden_varianten_einlieferung" AS ENUM('briefkasten', 'filiale', 'paketshop');
  CREATE TYPE "public"."enum_einstellungen_einsenden_varianten_empfohlen_fuer" AS ENUM('originalschluessel', 'autoschluessel');
  CREATE TYPE "public"."enum_einstellungen_einsenden_varianten_kennung" AS ENUM('dhl-paket', 'einschreiben-einwurf', 'einschreiben-wert');
  CREATE TABLE "einstellungen_einsenden_varianten_einlieferung" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_einstellungen_einsenden_varianten_einlieferung",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "einstellungen_einsenden_varianten_empfohlen_fuer" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_einstellungen_einsenden_varianten_empfohlen_fuer",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "einstellungen_einsenden_varianten" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kennung" "enum_einstellungen_einsenden_varianten_kennung" NOT NULL,
  	"bezeichnung" varchar NOT NULL,
  	"aktiv" boolean DEFAULT true,
  	"einsatz" varchar NOT NULL,
  	"haftung" numeric,
  	"sendungsverfolgung" boolean,
  	"porto" numeric,
  	"aufpreis" numeric DEFAULT 0,
  	"nur_sonderfall" boolean,
  	"porto_stand" varchar
  );
  
  ALTER TABLE "vorgaenge" ADD COLUMN "freigabe_sonderfall_versand" boolean;
  ALTER TABLE "einstellungen_einsenden_varianten_einlieferung" ADD CONSTRAINT "einstellungen_einsenden_varianten_einlieferung_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."einstellungen_einsenden_varianten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "einstellungen_einsenden_varianten_empfohlen_fuer" ADD CONSTRAINT "einstellungen_einsenden_varianten_empfohlen_fuer_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."einstellungen_einsenden_varianten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "einstellungen_einsenden_varianten" ADD CONSTRAINT "einstellungen_einsenden_varianten_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."einstellungen"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "einstellungen_einsenden_varianten_einlieferung_order_idx" ON "einstellungen_einsenden_varianten_einlieferung" USING btree ("order");
  CREATE INDEX "einstellungen_einsenden_varianten_einlieferung_parent_idx" ON "einstellungen_einsenden_varianten_einlieferung" USING btree ("parent_id");
  CREATE INDEX "einstellungen_einsenden_varianten_empfohlen_fuer_order_idx" ON "einstellungen_einsenden_varianten_empfohlen_fuer" USING btree ("order");
  CREATE INDEX "einstellungen_einsenden_varianten_empfohlen_fuer_parent_idx" ON "einstellungen_einsenden_varianten_empfohlen_fuer" USING btree ("parent_id");
  CREATE INDEX "einstellungen_einsenden_varianten_order_idx" ON "einstellungen_einsenden_varianten" USING btree ("_order");
  CREATE INDEX "einstellungen_einsenden_varianten_parent_id_idx" ON "einstellungen_einsenden_varianten" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "einstellungen_einsenden_varianten_einlieferung" CASCADE;
  DROP TABLE "einstellungen_einsenden_varianten_empfohlen_fuer" CASCADE;
  DROP TABLE "einstellungen_einsenden_varianten" CASCADE;
  ALTER TABLE "vorgaenge" DROP COLUMN "freigabe_sonderfall_versand";
  DROP TYPE "public"."enum_einstellungen_einsenden_varianten_einlieferung";
  DROP TYPE "public"."enum_einstellungen_einsenden_varianten_empfohlen_fuer";
  DROP TYPE "public"."enum_einstellungen_einsenden_varianten_kennung";`)
}
