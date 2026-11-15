import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Datenmigration zur Arbeitsanweisung des Inhabers vom 11.11.2026 (FA-03): Die Leistung „Schlüssel nach
 * Foto“ wird nicht angeboten; die Rubrik heißt „Schlüssel nach Vorlage“. Ihre Kennung zieht mit, damit der
 * alte Name auch im Quelltext der Seite nicht mehr vorkommt. Das Schema bleibt unverändert.
 *
 * Im Hub steht dafür ein Hauptzugang statt zwei („Schlüssel einschicken beziehungsweise Schlüssel nach
 * Vorlage“): Die Rubrik „Schlüssel einschicken“ bleibt als Seite erreichbar, verlässt aber den Hub. Der
 * Seed gleicht diesen Schalter nicht ab, deshalb setzt ihn die Migration einmal.
 *
 * Idempotent: Gibt es die neue Kennung schon oder die alte nicht mehr, passiert nichts. Namen und Texte
 * ändert diese Migration nicht; die gleicht der Seed ab, solange noch der Startwert steht.
 */
const ALT = 'schluessel-nach-foto'
const NEU = 'schluessel-nach-vorlage'

async function umbenennen(db: MigrateUpArgs['db'], von: string, nach: string): Promise<void> {
  await db.execute(sql`
    UPDATE "rubriken" SET "kennung" = ${nach}
    WHERE "kennung" = ${von} AND NOT EXISTS (SELECT 1 FROM "rubriken" WHERE "kennung" = ${nach});`)
  await db.execute(sql`UPDATE "_rubriken_v" SET "version_kennung" = ${nach} WHERE "version_kennung" = ${von};`)
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await umbenennen(db, ALT, NEU)
  // Nur der aktuelle Stand; die Versionen der Rubrik bleiben als Verlauf, wie sie waren.
  await db.execute(sql`UPDATE "rubriken" SET "im_hub" = false WHERE "kennung" = 'schluessel-einschicken';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await umbenennen(db, NEU, ALT)
  await db.execute(sql`UPDATE "rubriken" SET "im_hub" = true WHERE "kennung" = 'schluessel-einschicken';`)
}
