import 'server-only';

import config from '@payload-config';
import { getPayload, type CollectionSlug, type Payload, type Where } from 'payload';

import type { CollectionName, Collections, DataAdapter } from './adapter';
import { defaults } from './defaults';
import * as m from './payload-mapping';
import type {
  AutoschluesselLeistungen,
  Bauformen,
  Einsatzgebiete,
  Einstellungen,
  Fahrzeugmarken,
  Hersteller,
  Kategorien,
  Leistungsseiten,
  Preisgruppen,
  Preisregeln,
  Produkte,
  Ratgeber,
  Rubriken,
  Fahrzeugreihen,
  Seiten,
  Sperrtage,
  Tutorials,
  UmbauBeispiele,
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
      case 'fahrzeugkatalog': {
        const docs = await alle<Fahrzeugreihen>('fahrzeugreihen', undefined, 'marke');
        return docs.length ? docs.map(m.fahrzeugreiheZuSeite) : defaults.fahrzeugkatalog();
      }
      case 'rubriken': {
        const docs = await alle<Rubriken>('rubriken', undefined, 'reihenfolge');
        return docs.length ? docs.map(m.rubrikZuSeite) : defaults.rubriken();
      }
      // Shop-Kategorien und Hersteller (FA-SHOP-01): leere Sammlung (frische Datenbank ohne Seed) = Startbestand.
      case 'kategorien': {
        const docs = await alle<Kategorien>('kategorien', undefined, 'reihenfolge');
        return docs.length ? docs.map(m.kategorieZuSeite) : defaults.kategorien();
      }
      case 'hersteller': {
        const docs = await alle<Hersteller>('hersteller', undefined, 'reihenfolge');
        return docs.length ? docs.map(m.herstellerZuSeite) : defaults.hersteller();
      }
      // Gehäuse und Ersatzteile (FA-SHOP-02): Startbestand nur, solange nie Bauformen angelegt wurden.
      // Liegen alle im Papierkorb, bleibt die Liste leer: Gelöschtes kommt nicht wieder.
      case 'bauformen': {
        const docs = await alle<Bauformen>('bauformen', undefined, 'reihenfolge');
        if (docs.length) return docs.map(m.bauformZuSeite);
        const payload = await payloadInstanz();
        const { totalDocs } = await payload.count({ collection: 'bauformen', trash: true, overrideAccess: true });
        return totalDocs ? [] : defaults.bauformen();
      }
      // Umbau-Beispiele nur veröffentlicht, mit Freigabe und beiden Fotos; kein Startbestand (R4).
      case 'umbauBeispiele':
        return (await alle<UmbauBeispiele>('umbau-beispiele', VEROEFFENTLICHT, 'reihenfolge'))
          .map(m.umbauBeispielZuSeite)
          .filter((b): b is NonNullable<typeof b> => b !== null);
      // Tutorials (FA-INHALT-01): nur veröffentlichte. Startbestand nur, solange nie ein Tutorial angelegt wurde
      // (frische Datenbank ohne Seed); Entwürfe und Gelöschtes kommen so nicht über den Rückfall zurück.
      case 'tutorials': {
        const docs = await alle<Tutorials>('tutorials', VEROEFFENTLICHT, 'reihenfolge');
        if (docs.length) return docs.map(m.tutorialZuSeite);
        const payload = await payloadInstanz();
        const { totalDocs } = await payload.count({ collection: 'tutorials', trash: true, overrideAccess: true });
        return totalDocs ? [] : defaults.tutorials();
      }
    }
  }

  async write(): Promise<void> {
    throw new Error('Inhalte werden im Backend (/admin) gepflegt.');
  }
}
