import 'server-only';

import config from '@payload-config';
import { getPayload, type CollectionSlug, type Payload, type Where } from 'payload';

import type { CollectionName, Collections, DataAdapter } from './adapter';
import { defaults } from './defaults';
import * as m from './payload-mapping';
import type {
  AutoschluesselLeistungen,
  Einsatzgebiete,
  Einstellungen,
  Fahrzeugmarken,
  Leistungsseiten,
  Preisgruppen,
  Preisregeln,
  Produkte,
  Ratgeber,
  Seiten,
  Sperrtage,
  Vorgaenge,
  Zylinderkatalog,
} from '@/payload-types';

export function payloadInstanz(): Promise<Payload> {
  return getPayload({ config });
}

const VEROEFFENTLICHT: Where = { _status: { equals: 'published' } };

async function alle<T>(collection: CollectionSlug, where?: Where, sort?: string): Promise<T[]> {
  const payload = await payloadInstanz();
  const result = await payload.find({
    collection,
    where,
    sort: sort ?? 'id',
    depth: 1,
    draft: false,
    pagination: false,
    limit: 0,
    overrideAccess: true,
  });
  return result.docs as T[];
}

/**
 * Liest die Inhalte über die Local API von Payload.
 *
 * Öffentlich erscheinen nur veröffentlichte Dokumente außerhalb des
 * Papierkorbs. Ist eine Sammlung noch leer (frische Datenbank ohne Seed),
 * greift der eingebaute Standardinhalt — die Seite bricht nie zusammen.
 */
export class PayloadAdapter implements DataAdapter {
  readonly name = 'payload';
  readonly writable = false;

  async read<K extends CollectionName>(name: K): Promise<Collections[K]> {
    return (await this.lesen(name)) as Collections[K];
  }

  private async lesen(name: CollectionName): Promise<Collections[CollectionName]> {
    const payload = await payloadInstanz();
    switch (name) {
      case 'settings': {
        const doc = (await payload.findGlobal({ slug: 'einstellungen', depth: 1, overrideAccess: true })) as Einstellungen;
        return doc.firma?.marke ? m.einstellungenZuSeite(doc) : defaults.settings();
      }
      case 'cylinderCatalog': {
        const doc = (await payload.findGlobal({ slug: 'zylinderkatalog', depth: 1, overrideAccess: true })) as Zylinderkatalog;
        return doc.bauformen?.length ? m.zylinderkatalogZuSeite(doc) : defaults.cylinderCatalog();
      }
      case 'pricingGroups':
        return (await alle<Preisgruppen>('preisgruppen')).map(m.preisgruppeZuSeite);
      case 'carKeyServices':
        return (await alle<AutoschluesselLeistungen>('autoschluessel-leistungen')).map(m.leistungZuSeite);
      case 'pricingRules':
        return (await alle<Preisregeln>('preisregeln')).map((doc) => m.preisregelZuSeite(doc));
      case 'vehicleMakes':
        return (await alle<Fahrzeugmarken>('fahrzeugmarken', VEROEFFENTLICHT, 'id')).map((doc) =>
          m.fahrzeugmarkeZuSeite(doc),
        );
      case 'codeLines':
        return (
          await alle<Produkte>(
            'produkte',
            { and: [VEROEFFENTLICHT, { typ: { equals: 'code_key' } }] },
            'id',
          )
        ).map(m.codeLineZuSeite);
      case 'standardArticles':
        return (
          await alle<Produkte>(
            'produkte',
            { and: [VEROEFFENTLICHT, { typ: { equals: 'standard' } }] },
            'id',
          )
        ).map(m.standardartikelZuSeite);
      case 'servicePages':
        return (await alle<Leistungsseiten>('leistungsseiten', VEROEFFENTLICHT, 'id')).map(
          m.leistungsseiteZuSeite,
        );
      case 'pages':
        return (await alle<Seiten>('seiten', VEROEFFENTLICHT)).map(m.seiteZuSeite);
      case 'guides':
        return (await alle<Ratgeber>('ratgeber', VEROEFFENTLICHT, 'id')).map(m.ratgeberZuSeite);
      case 'cities':
        return (await alle<Einsatzgebiete>('einsatzgebiete', VEROEFFENTLICHT, 'id')).map(
          m.einsatzgebietZuSeite,
        );
      case 'blockedDays':
        return (await alle<Sperrtage>('sperrtage', undefined, 'datum')).map(m.sperrtagZuSeite);
      case 'records':
        return (await alle<Vorgaenge>('vorgaenge', undefined, '-createdAt')).map(m.vorgangZuSeite);
    }
  }

  async write(): Promise<void> {
    throw new Error('Inhalte werden im Backend (/admin) gepflegt.');
  }
}
