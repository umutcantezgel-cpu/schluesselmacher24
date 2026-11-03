import type { Payload, PayloadRequest } from 'payload';

import type { BusinessRecord, CompanyProfile } from '../types';

import { erzeugePdf } from './erzeuge-pdf';
import { vorgangsblattDateiname, vorgangsblattInhalt } from './vorgangsblatt';
import { ladeVorschaubilder } from './vorschaubilder';

/** Vorgangsblatt als PDF mit Vorschaubildern, für Abruf im Admin und Anhang der Betriebsmail (G-37). */
export async function vorgangsblattPdf({
  payload,
  vorgang,
  firma,
  req,
  jetzt = new Date(),
}: {
  payload: Payload;
  vorgang: BusinessRecord;
  firma?: CompanyProfile;
  req?: PayloadRequest;
  jetzt?: Date;
}): Promise<{ dateiname: string; daten: Buffer }> {
  const bilder = await ladeVorschaubilder(payload, vorgang.uploads, req);
  const daten = await erzeugePdf(vorgangsblattInhalt({ vorgang, firma, bilder, jetzt }));
  return { dateiname: vorgangsblattDateiname(vorgang.reference), daten };
}
