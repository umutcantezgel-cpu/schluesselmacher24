import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_kundendateien_kategorie" ADD VALUE 'sicherungskarte';
  ALTER TYPE "public"."enum_kundendateien_kategorie" ADD VALUE 'vollmacht';
  ALTER TYPE "public"."enum_rubriken_pflicht_uploads" ADD VALUE 'sicherungskarte';
  ALTER TYPE "public"."enum_rubriken_pflicht_uploads" ADD VALUE 'vollmacht';
  ALTER TYPE "public"."enum__rubriken_v_version_pflicht_uploads" ADD VALUE 'sicherungskarte';
  ALTER TYPE "public"."enum__rubriken_v_version_pflicht_uploads" ADD VALUE 'vollmacht';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "kundendateien" ALTER COLUMN "kategorie" SET DATA TYPE text;
  DROP TYPE "public"."enum_kundendateien_kategorie";
  CREATE TYPE "public"."enum_kundendateien_kategorie" AS ENUM('schluesselfoto', 'fahrzeugschein', 'grundriss', 'dokument', 'objektfoto');
  ALTER TABLE "kundendateien" ALTER COLUMN "kategorie" SET DATA TYPE "public"."enum_kundendateien_kategorie" USING "kategorie"::"public"."enum_kundendateien_kategorie";
  ALTER TABLE "rubriken_pflicht_uploads" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_rubriken_pflicht_uploads";
  CREATE TYPE "public"."enum_rubriken_pflicht_uploads" AS ENUM('schluesselfoto', 'fahrzeugschein', 'grundriss', 'dokument', 'objektfoto');
  ALTER TABLE "rubriken_pflicht_uploads" ALTER COLUMN "value" SET DATA TYPE "public"."enum_rubriken_pflicht_uploads" USING "value"::"public"."enum_rubriken_pflicht_uploads";
  ALTER TABLE "_rubriken_v_version_pflicht_uploads" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum__rubriken_v_version_pflicht_uploads";
  CREATE TYPE "public"."enum__rubriken_v_version_pflicht_uploads" AS ENUM('schluesselfoto', 'fahrzeugschein', 'grundriss', 'dokument', 'objektfoto');
  ALTER TABLE "_rubriken_v_version_pflicht_uploads" ALTER COLUMN "value" SET DATA TYPE "public"."enum__rubriken_v_version_pflicht_uploads" USING "value"::"public"."enum__rubriken_v_version_pflicht_uploads";`)
}
