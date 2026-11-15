import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Fahrzeugklasse und Generationen (FA-KERN-01, A-047). Additiv (G6): neue Spalte „klasse“ mit Standard
 * „pkw“, sodass jede vorhandene Reihe Pkw bleibt, und eine neue Tabelle für Generationen. Nichts wird
 * gelöscht oder umbenannt. Die neuen Zeilen aus KBA FZ 2 legt der Seed an (Plan fahrzeugreihen).
 */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_fahrzeugreihen_klasse" AS ENUM('pkw', 'kraftrad');
  CREATE TABLE "fahrzeugreihen_generationen" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"bezeichnung" varchar NOT NULL,
  	"baujahr_von" numeric,
  	"baujahr_bis" numeric,
  	"quelle" varchar NOT NULL
  );
  
  ALTER TABLE "fahrzeugreihen" ADD COLUMN "klasse" "enum_fahrzeugreihen_klasse" DEFAULT 'pkw' NOT NULL;
  ALTER TABLE "fahrzeugreihen_generationen" ADD CONSTRAINT "fahrzeugreihen_generationen_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fahrzeugreihen"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "fahrzeugreihen_generationen_order_idx" ON "fahrzeugreihen_generationen" USING btree ("_order");
  CREATE INDEX "fahrzeugreihen_generationen_parent_id_idx" ON "fahrzeugreihen_generationen" USING btree ("_parent_id");
  CREATE INDEX "fahrzeugreihen_klasse_idx" ON "fahrzeugreihen" USING btree ("klasse");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "fahrzeugreihen_generationen" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "fahrzeugreihen_generationen" CASCADE;
  DROP INDEX "fahrzeugreihen_klasse_idx";
  ALTER TABLE "fahrzeugreihen" DROP COLUMN "klasse";
  DROP TYPE "public"."enum_fahrzeugreihen_klasse";`)
}
