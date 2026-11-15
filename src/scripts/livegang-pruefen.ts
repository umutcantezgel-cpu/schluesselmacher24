/**
 * Prüft vor dem Livegang, ob noch Redaktions-Platzhalter sichtbar wären:
 * - Firmendaten (Global „Einstellungen“, Tab „Firma“; ohne Datenbank
 *   content/settings.json) und die Mailadressen der Umgebung (Absender,
 *   Antwortadresse, Betriebsempfänger: nur auf der eigenen Domain),
 * - Quelltext der Rechtsseiten unter src/app/(site)/rechtliches/,
 * - Beispiel-Einträge (A-046): SM24_BEISPIELE=1 oder ein veröffentlichtes
 *   Produkt aus den Musterdaten ohne Beispiel-Haken (ohne Datenbank
 *   content/code-lines.json und die Standardartikel).
 *
 * Seitenzahlen oder eine Mindestzahl an Codelinien erwartet die Prüfung nicht:
 * Ohne echte Produkte hat der Shop keine Produktseiten.
 *
 *   npm run pruefen:livegang
 *
 * Exit 1 bei einem Fund. Der Produktions-Build bricht dann ab
 * (scripts/build.mjs), andere Builds warnen nur. Ohne Datenbank (Schaufenster)
 * läuft die Prüfung im Build nicht.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

import config from '@payload-config';
import { createLocalReq, getPayload } from 'payload';

import { JsonFileAdapter } from '../lib/data/json-adapter';
import { einstellungenZuPayload } from '../lib/data/payload-mapping';
import { beispielFunde, firmendatenFunde, rechtsseitenFunde, umgebungsMailFunde, type Fund, type ProduktEintrag } from '../lib/livegang-pruefung';
import type { Settings } from '../lib/types';
import { mitDatenbank } from '../lib/umgebung';

async function firmendaten(): Promise<Fund[]> {
  if (!mitDatenbank()) {
    const settings = JSON.parse(readFileSync(path.resolve(process.cwd(), 'content/settings.json'), 'utf8')) as Settings;
    console.log('Ohne Datenbank: Firmendaten aus content/settings.json.');
    return firmendatenFunde(einstellungenZuPayload(settings).firma as Record<string, unknown>);
  }
  const payload = await getPayload({ config });
  const einstellungen = await payload.findGlobal({ slug: 'einstellungen', depth: 0, overrideAccess: true });
  return firmendatenFunde(einstellungen.firma as Record<string, unknown>, await createLocalReq({}, payload));
}

async function produkte(): Promise<ProduktEintrag[]> {
  if (!mitDatenbank()) {
    const dateien = new JsonFileAdapter();
    const [linien, artikel] = await Promise.all([dateien.read('codeLines'), dateien.read('standardArticles')]);
    return [...linien.filter((l) => l.active), ...artikel].map((e) => ({ kennung: e.id, name: e.name, beispiel: e.example === true }));
  }
  const payload = await getPayload({ config });
  // Nur Veröffentlichtes: ohne Entwürfe und ohne Papierkorb.
  const { docs } = await payload.find({
    collection: 'produkte',
    where: { _status: { equals: 'published' } },
    pagination: false,
    depth: 0,
    overrideAccess: true,
  });
  return docs.map((doc) => ({ kennung: doc.kennung ?? '', name: doc.name, beispiel: doc.beispiel === true }));
}

try {
  const funde = [
    ...(await firmendaten()),
    ...umgebungsMailFunde(),
    ...beispielFunde(await produkte()),
    ...rechtsseitenFunde(path.resolve(process.cwd(), 'src/app/(site)/rechtliches')),
  ];

  if (funde.length === 0) {
    console.log('Livegang-Prüfung: keine Platzhalter und keine veröffentlichten Beispiele gefunden.');
    process.exit(0);
  }
  console.error(`Livegang-Prüfung: ${funde.length} Funde (Platzhalter oder veröffentlichte Beispiele).`);
  for (const fund of funde) console.error(`  ${fund.ort}  ${fund.hinweis}`);
  process.exit(1);
} catch (error) {
  console.error('Livegang-Prüfung fehlgeschlagen.', error);
  process.exit(1);
}
