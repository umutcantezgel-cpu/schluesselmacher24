import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

import { einsatzgebietZuSeite } from '../lib/data/payload-mapping'
import { stadtHatPlatzhalter } from '../lib/rechtliches/indexierung'
import type { Einsatzgebiete } from '../payload-types'

/**
 * Datenmigration zum Leitfaden-Ausbau. Eigene Datei nach
 * `20261025_132045_leitfaden`: Payload führt jede Migration in einer eigenen
 * Transaktion aus, und neue Enum-Werte sind erst nach deren Abschluss nutzbar.
 *
 * Idempotent und nur dort, wo noch der Startwert steht:
 *
 * 1. Einsatzgebiete mit Redaktions-Platzhaltern kommen in den Papierkorb
 *    (Erg. Leitfaden §5: keine künstlichen Städteseiten). Wiederherstellbar.
 * 2. Fahrzeug-Adressen „koda“ → „skoda“ und „m-gane“ → „megane“ (Akzente
 *    fielen beim Erzeugen der Adresse weg).
 * 3. ZY-02 (Sicherungskarte): Foto-Upload auf Pflicht, solange noch der
 *    Startwert „Freiwillig“ steht; der Hinweis nur, wenn er noch der alte ist.
 * 4. Online gebuchte Autoschlüssel-Termine aus der Zeit vor dem Leitfaden-Ausbau
 *    standen bei Leistungen am Fahrzeug auf „vor-ort“ (gemeint: „mit Fahrzeug,
 *    Ort stimmen wir ab“). Seit dem Ausbau heißt „vor-ort“ „beim Kunden nach
 *    Prüfung“; online gebuchte Termine finden in der Werkstatt statt. Diese
 *    Alttermine kommen auf „werkstatt“ — Telefontermine des Teams und die
 *    Fahrzeugöffnung (am Fahrzeug des Kunden) bleiben, wie sie sind.
 *
 * Einträge im Papierkorb und solche mit offenem Entwurf gehören dem Betrieb und
 * bleiben unberührt (wie im Seed).
 *
 * Über die Local API, damit Versionen und Kennungen stimmig bleiben. Auf einer
 * leeren Datenbank (Tests, neue Umgebung) gibt es nichts zu tun; dann fragt die
 * Migration die Local API gar nicht erst — spätere Schemaänderungen können sie
 * so nicht brechen.
 */

const context = { disableRevalidate: true }

/** Papierkorb und offene Entwürfe gehören dem Betrieb — wie im Seed nicht anfassen. */
function gehoertDemBetrieb(doc: { deletedAt?: string | null; _status?: string | null }): boolean {
  return Boolean(doc.deletedAt) || doc._status === 'draft'
}

const UMBENENNUNG_MARKE: Record<string, string> = { koda: 'skoda' }
const UMBENENNUNG_MODELL: Record<string, string> = { 'm-gane': 'megane' }

const FOTO_HINWEIS_ALT =
  'Ein Foto ist freiwillig. Es hilft uns, Profil und Beschriftung vor der Fertigung abzugleichen.'
const FOTO_HINWEIS_ZY02 =
  'Pflicht: Bitte laden Sie ein Foto Ihrer Sicherungskarte hoch. Bei Anlagen mit Sicherungskarte bestellt nur, wer die Karte vorlegt.'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  async function hatZeilen(tabelle: 'einsatzgebiete' | 'fahrzeugmarken' | 'produkte'): Promise<boolean> {
    const { rows } = await db.execute(sql`SELECT EXISTS (SELECT 1 FROM ${sql.identifier(tabelle)}) AS vorhanden`)
    return Boolean((rows[0] as { vorhanden?: boolean } | undefined)?.vorhanden)
  }

  // 1. Einsatzgebiete mit Platzhaltern (wie `stadtIndexierbar`) in den Papierkorb.
  if (await hatZeilen('einsatzgebiete')) {
    const { docs } = await payload.find({ collection: 'einsatzgebiete', pagination: false, depth: 0, draft: true, req, context })
    for (const doc of docs) {
      if (gehoertDemBetrieb(doc)) continue
      if (!stadtHatPlatzhalter(einsatzgebietZuSeite(doc as Einsatzgebiete))) continue
      await payload.update({
        collection: 'einsatzgebiete',
        id: doc.id,
        data: { deletedAt: new Date().toISOString() },
        req,
        context,
      })
      payload.logger.info({ msg: `Einsatzgebiet „${doc.stadt}“ mit Platzhaltern in den Papierkorb gelegt` })
    }
  }

  // 2. Adressen von Marken und Modellen — nur, wo noch der alte Wert steht.
  if (await hatZeilen('fahrzeugmarken')) {
    const { docs } = await payload.find({ collection: 'fahrzeugmarken', pagination: false, depth: 0, trash: true, draft: true, req, context })
    const belegt = new Set(docs.map((doc) => doc.slug))
    for (const doc of docs) {
      if (gehoertDemBetrieb(doc)) {
        if (UMBENENNUNG_MARKE[doc.slug] || doc.modelle?.some((modell) => UMBENENNUNG_MODELL[modell.slug])) {
          payload.logger.warn({ msg: `Fahrzeugmarke „${doc.name}“ liegt im Papierkorb oder hat einen Entwurf – Adressen bitte im Backend prüfen` })
        }
        continue
      }
      const data: { slug?: string; modelle?: typeof doc.modelle } = {}
      const neueAdresse = UMBENENNUNG_MARKE[doc.slug]
      if (neueAdresse && !belegt.has(neueAdresse)) data.slug = neueAdresse
      if (doc.modelle?.some((modell) => UMBENENNUNG_MODELL[modell.slug])) {
        const vorhandeneModelle = new Set(doc.modelle.map((modell) => modell.slug))
        data.modelle = doc.modelle.map((modell) => {
          const neu = UMBENENNUNG_MODELL[modell.slug]
          return neu && !vorhandeneModelle.has(neu) ? { ...modell, slug: neu } : modell
        })
      }
      if (!Object.keys(data).length) continue
      await payload.update({ collection: 'fahrzeugmarken', id: doc.id, data, req, context })
      payload.logger.info({ msg: `Fahrzeugmarke „${doc.name}“: Adressen korrigiert` })
    }
  }

  // 3. ZY-02: Foto der Sicherungskarte ist Pflicht.
  if (await hatZeilen('produkte')) {
    const { docs } = await payload.find({
      collection: 'produkte',
      where: { kennung: { equals: 'zy-02' } },
      pagination: false,
      depth: 0,
      trash: true,
      draft: true,
      req,
      context,
    })
    for (const doc of docs) {
      if (gehoertDemBetrieb(doc)) {
        payload.logger.warn({ msg: 'ZY-02 liegt im Papierkorb oder hat einen Entwurf – Foto-Pflicht bitte im Backend setzen' })
        continue
      }
      const data: { fotoUpload?: 'pflicht'; fotoHinweis?: string } = {}
      if (doc.fotoUpload === 'optional') data.fotoUpload = 'pflicht'
      const wirdPflicht = data.fotoUpload === 'pflicht' || doc.fotoUpload === 'pflicht'
      if (wirdPflicht && doc.fotoHinweis === FOTO_HINWEIS_ALT) data.fotoHinweis = FOTO_HINWEIS_ZY02
      if (!Object.keys(data).length) continue
      await payload.update({ collection: 'produkte', id: doc.id, data, req, context })
      payload.logger.info({ msg: 'ZY-02: Foto der Sicherungskarte ist jetzt Pflicht' })
    }
  }

  // 4. Online gebuchte Alttermine mit „vor-ort“ finden in der Werkstatt statt.
  const { rows } = await db.execute(sql`
    UPDATE "vorgaenge" SET "termin_ort" = 'werkstatt'
    WHERE "art" = 'termin'
      AND "termin_ort" = 'vor-ort'
      AND coalesce(("daten"->>'telefonisch')::boolean, false) = false
      AND coalesce("daten"->>'serviceId', '') <> 'fahrzeugoeffnung'
    RETURNING "id"`)
  if (rows.length) payload.logger.info({ msg: `${rows.length} online gebuchte Termine auf „Werkstatt“ umgestellt` })
}

/** Nicht umkehrbar: Einsatzgebiete lassen sich aus dem Papierkorb wiederherstellen. */
export async function down(_args?: MigrateDownArgs): Promise<void> {}
