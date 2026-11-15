import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Hub mit den 14 Hauptzugängen des Inhabers (FA-03, FA-SOFORT-05, A-052).
 *
 * Schema (additiv): Die Wertelisten der Rubriken kennen die Symbole der vier neuen Fahrzeugklassen
 * (`roller`, `e-scooter`, `seniorenmobil`, `fahrradschluessel`) und den Nachweis `ersatznachweis`
 * (Fahrzeuge ohne Fahrzeugschein). `IF NOT EXISTS`, damit die Migration wiederholbar bleibt.
 *
 * Daten: Reihenfolge und Hub-Haken gleicht der Seed nur ab, wenn er sie selbst gesetzt hat; in einer
 * bestehenden Datenbank setzt sie diese Migration einmal auf die Reihenfolge des Inhabers, je Rubrik
 * nur, wenn dort noch der alte Startwert steht (vom Betrieb geändert bleibt). Das
 * Autoschlüsselgehäuse verlässt den Hub (Seite und Navigation bleiben, FA-SHOP-02). Die vier neuen
 * Rubriken legt der Seed an, die neuen Namen gleicht er über die Startwerte ab. Nur der aktuelle Stand;
 * die Versionen bleiben als Verlauf, wie sie waren.
 */
const REIHENFOLGE_NEU: ReadonlyArray<[string, number]> = [
  ['autoschluessel', 10],
  ['motorradschluessel', 20],
  ['schluessel-nach-vorlage', 70],
  ['schluessel-nach-code', 80],
  ['sperrschliessung', 90],
  ['schliessanlage', 100],
  ['elektronische-schliesssysteme', 110],
  ['sicherheitstechnik', 120],
  ['schluesseldienst-vor-ort', 130],
  ['beratung', 140],
  ['autoschluessel-gehaeuse', 150],
  ['schluessel-einschicken', 160],
  ['transponder-kopie', 170],
  ['schluesselfinder', 180],
  ['tuer-und-schliesstechnik', 190],
]

/** Stand vor dieser Migration (für down). */
const REIHENFOLGE_ALT: ReadonlyArray<[string, number]> = [
  ['autoschluessel', 10],
  ['motorradschluessel', 20],
  ['autoschluessel-gehaeuse', 30],
  ['schluessel-nach-code', 40],
  ['schluessel-nach-vorlage', 50],
  ['schluessel-einschicken', 60],
  ['sperrschliessung', 70],
  ['schliessanlage', 80],
  ['elektronische-schliesssysteme', 90],
  ['sicherheitstechnik', 100],
  ['schluesseldienst-vor-ort', 110],
  ['beratung', 120],
  ['transponder-kopie', 130],
  ['schluesselfinder', 140],
  ['tuer-und-schliesstechnik', 150],
]

/**
 * Setzt die Reihenfolge je Kennung von `von` auf `nach`, aber nur dort, wo noch der Startwert `von`
 * steht: Eine vom Betrieb im Backend geänderte Reihenfolge bleibt (wie im Seed-Abgleich, seed.ts).
 * Je Kennung bedingt, darum wiederholbar und ohne Wechselwirkung zwischen den Einträgen.
 */
async function reihenfolgeSetzen(
  db: MigrateUpArgs['db'],
  von: ReadonlyArray<[string, number]>,
  nach: ReadonlyArray<[string, number]>,
  gehaeuseImHub: boolean,
): Promise<void> {
  const alt = new Map(von)
  for (const [kennung, reihenfolge] of nach) {
    const vorher = alt.get(kennung)
    if (vorher === undefined || vorher === reihenfolge) continue
    await db.execute(sql`UPDATE "rubriken" SET "reihenfolge" = ${reihenfolge} WHERE "kennung" = ${kennung} AND "reihenfolge" = ${vorher};`)
  }
  // Hub-Haken des Gehäuses: Entscheidung des Inhabers (A-052), gilt unabhängig vom bisherigen Wert.
  await db.execute(sql`UPDATE "rubriken" SET "im_hub" = ${gehaeuseImHub} WHERE "kennung" = 'autoschluessel-gehaeuse';`)
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_rubriken_ablauf_icon" ADD VALUE IF NOT EXISTS 'roller' BEFORE 'dokument';
  ALTER TYPE "public"."enum_rubriken_ablauf_icon" ADD VALUE IF NOT EXISTS 'e-scooter' BEFORE 'dokument';
  ALTER TYPE "public"."enum_rubriken_ablauf_icon" ADD VALUE IF NOT EXISTS 'seniorenmobil' BEFORE 'dokument';
  ALTER TYPE "public"."enum_rubriken_ablauf_icon" ADD VALUE IF NOT EXISTS 'fahrradschluessel' BEFORE 'dokument';
  ALTER TYPE "public"."enum_rubriken_icon" ADD VALUE IF NOT EXISTS 'roller' BEFORE 'dokument';
  ALTER TYPE "public"."enum_rubriken_icon" ADD VALUE IF NOT EXISTS 'e-scooter' BEFORE 'dokument';
  ALTER TYPE "public"."enum_rubriken_icon" ADD VALUE IF NOT EXISTS 'seniorenmobil' BEFORE 'dokument';
  ALTER TYPE "public"."enum_rubriken_icon" ADD VALUE IF NOT EXISTS 'fahrradschluessel' BEFORE 'dokument';
  ALTER TYPE "public"."enum_rubriken_nachweis" ADD VALUE IF NOT EXISTS 'ersatznachweis';
  ALTER TYPE "public"."enum__rubriken_v_version_ablauf_icon" ADD VALUE IF NOT EXISTS 'roller' BEFORE 'dokument';
  ALTER TYPE "public"."enum__rubriken_v_version_ablauf_icon" ADD VALUE IF NOT EXISTS 'e-scooter' BEFORE 'dokument';
  ALTER TYPE "public"."enum__rubriken_v_version_ablauf_icon" ADD VALUE IF NOT EXISTS 'seniorenmobil' BEFORE 'dokument';
  ALTER TYPE "public"."enum__rubriken_v_version_ablauf_icon" ADD VALUE IF NOT EXISTS 'fahrradschluessel' BEFORE 'dokument';
  ALTER TYPE "public"."enum__rubriken_v_version_icon" ADD VALUE IF NOT EXISTS 'roller' BEFORE 'dokument';
  ALTER TYPE "public"."enum__rubriken_v_version_icon" ADD VALUE IF NOT EXISTS 'e-scooter' BEFORE 'dokument';
  ALTER TYPE "public"."enum__rubriken_v_version_icon" ADD VALUE IF NOT EXISTS 'seniorenmobil' BEFORE 'dokument';
  ALTER TYPE "public"."enum__rubriken_v_version_icon" ADD VALUE IF NOT EXISTS 'fahrradschluessel' BEFORE 'dokument';
  ALTER TYPE "public"."enum__rubriken_v_version_nachweis" ADD VALUE IF NOT EXISTS 'ersatznachweis';`)
  await reihenfolgeSetzen(db, REIHENFOLGE_ALT, REIHENFOLGE_NEU, false)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await reihenfolgeSetzen(db, REIHENFOLGE_NEU, REIHENFOLGE_ALT, true)
  // Die Wertelisten lassen sich nur zurückbauen, wenn keine Rubrik die neuen Werte trägt: Die vier
  // Rubriken der Fahrzeugklassen (vom Seed angelegt) vorher im Backend löschen.
  await db.execute(sql`
   ALTER TABLE "rubriken_ablauf" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_rubriken_ablauf_icon";
  CREATE TYPE "public"."enum_rubriken_ablauf_icon" AS ENUM('alarmtechnik', 'anzahlung', 'aussenhautsicherung', 'autoschluessel', 'beratung-telefon', 'datenschutz', 'einsteckschloss', 'elektronische-zutrittsloesungen', 'fahrzeugmarke', 'fahrzeugoeffnung', 'foto-hochladen', 'funkschluessel', 'gleichschliessende-zylinder', 'halbzylinder', 'klappschluessel', 'knaufzylinder', 'kombinierte-konzepte', 'lieferung', 'mechanischer-schutz', 'mehrfachverriegelung', 'montage', 'nachweis', 'panik-alarmtaster', 'panik-fluchttuer', 'profilzylinder', 'pruefung', 'reparatur-austausch', 'rueckgabe', 'schliessanlagen', 'schluessel-kopieren', 'schluessel-nach-code', 'schluessel-nach-vorlage', 'schluessel-programmieren', 'schluesselbart-fraesen', 'schutzbeschlag', 'service-und-termin', 'sicherheitscheck', 'sicherheitstechnik', 'sicherungskarte', 'smart-key', 'smarte-funktionen', 'standort', 'technische-beratung', 'termin', 'transponder', 'tuer-und-schliesstechnik', 'tuerschliesser', 'tuerzusatzschloss', 'versand-paket', 'videoueberwachung', 'warenkorb', 'werkstatt', 'zahlung', 'zylinder-mass', 'motorradschluessel', 'schluesselgehaeuse', 'transponder-kopie', 'schluesselfinder', 'vor-ort', 'karte', 'video', 'dokument');
  ALTER TABLE "rubriken_ablauf" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_rubriken_ablauf_icon" USING "icon"::"public"."enum_rubriken_ablauf_icon";
  ALTER TABLE "rubriken" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_rubriken_icon";
  CREATE TYPE "public"."enum_rubriken_icon" AS ENUM('alarmtechnik', 'anzahlung', 'aussenhautsicherung', 'autoschluessel', 'beratung-telefon', 'datenschutz', 'einsteckschloss', 'elektronische-zutrittsloesungen', 'fahrzeugmarke', 'fahrzeugoeffnung', 'foto-hochladen', 'funkschluessel', 'gleichschliessende-zylinder', 'halbzylinder', 'klappschluessel', 'knaufzylinder', 'kombinierte-konzepte', 'lieferung', 'mechanischer-schutz', 'mehrfachverriegelung', 'montage', 'nachweis', 'panik-alarmtaster', 'panik-fluchttuer', 'profilzylinder', 'pruefung', 'reparatur-austausch', 'rueckgabe', 'schliessanlagen', 'schluessel-kopieren', 'schluessel-nach-code', 'schluessel-nach-vorlage', 'schluessel-programmieren', 'schluesselbart-fraesen', 'schutzbeschlag', 'service-und-termin', 'sicherheitscheck', 'sicherheitstechnik', 'sicherungskarte', 'smart-key', 'smarte-funktionen', 'standort', 'technische-beratung', 'termin', 'transponder', 'tuer-und-schliesstechnik', 'tuerschliesser', 'tuerzusatzschloss', 'versand-paket', 'videoueberwachung', 'warenkorb', 'werkstatt', 'zahlung', 'zylinder-mass', 'motorradschluessel', 'schluesselgehaeuse', 'transponder-kopie', 'schluesselfinder', 'vor-ort', 'karte', 'video', 'dokument');
  ALTER TABLE "rubriken" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_rubriken_icon" USING "icon"::"public"."enum_rubriken_icon";
  ALTER TABLE "rubriken" ALTER COLUMN "nachweis" SET DATA TYPE text;
  ALTER TABLE "rubriken" ALTER COLUMN "nachweis" SET DEFAULT 'keiner'::text;
  DROP TYPE "public"."enum_rubriken_nachweis";
  CREATE TYPE "public"."enum_rubriken_nachweis" AS ENUM('keiner', 'fahrzeugschein', 'sicherungskarte');
  ALTER TABLE "rubriken" ALTER COLUMN "nachweis" SET DEFAULT 'keiner'::"public"."enum_rubriken_nachweis";
  ALTER TABLE "rubriken" ALTER COLUMN "nachweis" SET DATA TYPE "public"."enum_rubriken_nachweis" USING "nachweis"::"public"."enum_rubriken_nachweis";
  ALTER TABLE "_rubriken_v_version_ablauf" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__rubriken_v_version_ablauf_icon";
  CREATE TYPE "public"."enum__rubriken_v_version_ablauf_icon" AS ENUM('alarmtechnik', 'anzahlung', 'aussenhautsicherung', 'autoschluessel', 'beratung-telefon', 'datenschutz', 'einsteckschloss', 'elektronische-zutrittsloesungen', 'fahrzeugmarke', 'fahrzeugoeffnung', 'foto-hochladen', 'funkschluessel', 'gleichschliessende-zylinder', 'halbzylinder', 'klappschluessel', 'knaufzylinder', 'kombinierte-konzepte', 'lieferung', 'mechanischer-schutz', 'mehrfachverriegelung', 'montage', 'nachweis', 'panik-alarmtaster', 'panik-fluchttuer', 'profilzylinder', 'pruefung', 'reparatur-austausch', 'rueckgabe', 'schliessanlagen', 'schluessel-kopieren', 'schluessel-nach-code', 'schluessel-nach-vorlage', 'schluessel-programmieren', 'schluesselbart-fraesen', 'schutzbeschlag', 'service-und-termin', 'sicherheitscheck', 'sicherheitstechnik', 'sicherungskarte', 'smart-key', 'smarte-funktionen', 'standort', 'technische-beratung', 'termin', 'transponder', 'tuer-und-schliesstechnik', 'tuerschliesser', 'tuerzusatzschloss', 'versand-paket', 'videoueberwachung', 'warenkorb', 'werkstatt', 'zahlung', 'zylinder-mass', 'motorradschluessel', 'schluesselgehaeuse', 'transponder-kopie', 'schluesselfinder', 'vor-ort', 'karte', 'video', 'dokument');
  ALTER TABLE "_rubriken_v_version_ablauf" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__rubriken_v_version_ablauf_icon" USING "icon"::"public"."enum__rubriken_v_version_ablauf_icon";
  ALTER TABLE "_rubriken_v" ALTER COLUMN "version_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__rubriken_v_version_icon";
  CREATE TYPE "public"."enum__rubriken_v_version_icon" AS ENUM('alarmtechnik', 'anzahlung', 'aussenhautsicherung', 'autoschluessel', 'beratung-telefon', 'datenschutz', 'einsteckschloss', 'elektronische-zutrittsloesungen', 'fahrzeugmarke', 'fahrzeugoeffnung', 'foto-hochladen', 'funkschluessel', 'gleichschliessende-zylinder', 'halbzylinder', 'klappschluessel', 'knaufzylinder', 'kombinierte-konzepte', 'lieferung', 'mechanischer-schutz', 'mehrfachverriegelung', 'montage', 'nachweis', 'panik-alarmtaster', 'panik-fluchttuer', 'profilzylinder', 'pruefung', 'reparatur-austausch', 'rueckgabe', 'schliessanlagen', 'schluessel-kopieren', 'schluessel-nach-code', 'schluessel-nach-vorlage', 'schluessel-programmieren', 'schluesselbart-fraesen', 'schutzbeschlag', 'service-und-termin', 'sicherheitscheck', 'sicherheitstechnik', 'sicherungskarte', 'smart-key', 'smarte-funktionen', 'standort', 'technische-beratung', 'termin', 'transponder', 'tuer-und-schliesstechnik', 'tuerschliesser', 'tuerzusatzschloss', 'versand-paket', 'videoueberwachung', 'warenkorb', 'werkstatt', 'zahlung', 'zylinder-mass', 'motorradschluessel', 'schluesselgehaeuse', 'transponder-kopie', 'schluesselfinder', 'vor-ort', 'karte', 'video', 'dokument');
  ALTER TABLE "_rubriken_v" ALTER COLUMN "version_icon" SET DATA TYPE "public"."enum__rubriken_v_version_icon" USING "version_icon"::"public"."enum__rubriken_v_version_icon";
  ALTER TABLE "_rubriken_v" ALTER COLUMN "version_nachweis" SET DATA TYPE text;
  ALTER TABLE "_rubriken_v" ALTER COLUMN "version_nachweis" SET DEFAULT 'keiner'::text;
  DROP TYPE "public"."enum__rubriken_v_version_nachweis";
  CREATE TYPE "public"."enum__rubriken_v_version_nachweis" AS ENUM('keiner', 'fahrzeugschein', 'sicherungskarte');
  ALTER TABLE "_rubriken_v" ALTER COLUMN "version_nachweis" SET DEFAULT 'keiner'::"public"."enum__rubriken_v_version_nachweis";
  ALTER TABLE "_rubriken_v" ALTER COLUMN "version_nachweis" SET DATA TYPE "public"."enum__rubriken_v_version_nachweis" USING "version_nachweis"::"public"."enum__rubriken_v_version_nachweis";`)
}
