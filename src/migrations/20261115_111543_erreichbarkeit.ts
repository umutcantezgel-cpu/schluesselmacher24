import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "einstellungen" ADD COLUMN "erreichbarkeit_kernaussage" varchar DEFAULT '24 Stunden erreichbar';
  ALTER TABLE "einstellungen" ADD COLUMN "erreichbarkeit_zeilen" varchar DEFAULT 'Notdienst rund um die Uhr
Werkstatt und persönliche Beratung nach Terminvereinbarung';
  ALTER TABLE "einstellungen" ADD COLUMN "erreichbarkeit_rund_um_die_uhr" boolean DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "einstellungen" DROP COLUMN "erreichbarkeit_kernaussage";
  ALTER TABLE "einstellungen" DROP COLUMN "erreichbarkeit_zeilen";
  ALTER TABLE "einstellungen" DROP COLUMN "erreichbarkeit_rund_um_die_uhr";`)
}
