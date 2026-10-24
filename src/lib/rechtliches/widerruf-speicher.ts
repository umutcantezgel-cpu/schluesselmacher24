import 'server-only';

import { getRecordByReference, vorgangAendern } from '@/lib/data';
import { payloadInstanz } from '@/lib/data/payload-adapter';

import type { WiderrufBestaetigung, WiderrufDatensatz, WiderrufUmgebung } from './widerruf-aufnahme';

/*
 * Anbindung des Widerrufs an die Datenbank (Local API, Sammlung `widerrufe`).
 * `overrideAccess`: Die Sammlung lässt öffentlich niemanden anlegen, und die
 * Erklärung selbst ist im Backend schreibgeschützt — nur der Server setzt sie.
 */

export async function widerrufSpeichern(datensatz: WiderrufDatensatz): Promise<{ id: number }> {
  const payload = await payloadInstanz();
  const doc = await payload.create({ collection: 'widerrufe', data: datensatz, overrideAccess: true });
  return { id: doc.id };
}

export async function widerrufBestaetigungVermerken(id: number | string, bestaetigung: WiderrufBestaetigung): Promise<void> {
  const payload = await payloadInstanz();
  await payload.update({ collection: 'widerrufe', id, data: { bestaetigung }, overrideAccess: true });
}

export const widerrufVorgangFinden: WiderrufUmgebung['vorgangFinden'] = async (nummer) => {
  const vorgang = await getRecordByReference(nummer);
  return vorgang ? { id: vorgang.id, contact: { email: vorgang.contact.email } } : null;
};

/** Interne Notiz am Vorgang — für Kunden nicht sichtbar. */
export async function widerrufAmVorgangVermerken(vorgangId: string, notiz: string): Promise<void> {
  await vorgangAendern(vorgangId, (vorgang) => ({
    internalNotes: [...vorgang.internalNotes, { at: new Date().toISOString(), actor: 'system', message: notiz }],
  }));
}
