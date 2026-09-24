import { getPayload, type Payload } from 'payload';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';
import type { Richtwerte } from '@/payload-types';
import { serviceEinsatzBerechnen, tuerAbsicherungBerechnen } from '@/lib/richtwerte/rechnen';
import type { RechnerRichtwerte } from '@/lib/richtwerte/typen';
import { PLATZHALTER_RICHTWERTE } from '@/lib/richtwerte/uebersetzung';
import { getRichtwerte } from './richtwerte';

/* Gegen die Testdatenbank (siehe src/test/db-global-setup.ts): Der Seed hat
 * den Aufbau der Rechner angelegt, Beträge sind leer. */

let payload: Payload;
let original: Richtwerte;
const context = { disableRevalidate: true };

/** Nur, was die Rechner anzeigen und auswählen — ohne Beträge. */
const aufbau = (werte: RechnerRichtwerte) => ({
  tuerarten: werte.tuerAbsicherung.tuerarten.map(({ kennung, label, beschreibung }) => ({ kennung, label, beschreibung })),
  massnahmen: werte.tuerAbsicherung.massnahmen.map(({ kennung, label, beschreibung }) => ({ kennung, label, beschreibung })),
  leistungen: werte.serviceEinsatz.leistungen.map(({ kennung, label, beschreibung, einheit }) => ({
    kennung,
    label,
    beschreibung,
    einheit,
  })),
});

async function speichern(data: Record<string, unknown>) {
  await payload.updateGlobal({ slug: 'richtwerte', data: data as never, depth: 0, context });
}

beforeAll(async () => {
  payload = await getPayload({ config });
  original = (await payload.findGlobal({ slug: 'richtwerte', depth: 0 })) as Richtwerte;
});

afterAll(async () => {
  // Andere Testdateien teilen sich die Datenbank — Seed-Stand wiederherstellen.
  const { platzhalter, hinweis, tuerAbsicherung, serviceEinsatz } = original;
  await speichern({ platzhalter, hinweis, tuerAbsicherung, serviceEinsatz });
});

describe('Richtwerte aus der Datenbank', () => {
  it('liefert nach dem Seed den Aufbau ohne Beträge — deckungsgleich mit der Platzhalter-Struktur', async () => {
    const werte = await getRichtwerte();
    expect(werte.tuerAbsicherung.platzhalter).toBe(true);
    expect(werte.serviceEinsatz.platzhalter).toBe(true);
    expect(aufbau(werte)).toEqual(aufbau(PLATZHALTER_RICHTWERTE));
    expect(werte.tuerAbsicherung.tuerarten.every((t) => t.spanne === null)).toBe(true);
    expect(werte.serviceEinsatz.anfahrt).toBeNull();
    expect(werte.tuerAbsicherung.hinweis).toMatch(/unverbindlich/i);
  });

  it('liest das Global, obwohl es ohne Anmeldung gesperrt ist', async () => {
    await expect(payload.findGlobal({ slug: 'richtwerte', overrideAccess: false })).rejects.toThrow();
    await expect(getRichtwerte()).resolves.toBeDefined();
  });

  it('rechnet mit gepflegten Beträgen, sobald der Platzhalter-Haken entfernt ist', async () => {
    await speichern({
      platzhalter: false,
      tuerAbsicherung: {
        tuerarten: [{ kennung: 'haustuer', label: 'Hauseingangstür', preisVon: 40, preisBis: 60.5 }],
        massnahmen: [
          { kennung: 'zylinder', label: 'Profilzylinder', preisVon: 89.99, preisBis: 149.5 },
          { kennung: 'querriegel', label: 'Querriegelschloss' },
        ],
      },
      serviceEinsatz: {
        leistungen: [{ kennung: 'zylindertausch', label: 'Zylinder tauschen', einheit: 'je-tuer', preisVon: 25, preisBis: 45 }],
        anfahrtVon: 30,
        anfahrtBis: 50,
      },
    });

    const werte = await getRichtwerte();
    expect(werte.tuerAbsicherung.platzhalter).toBe(false);
    expect(tuerAbsicherungBerechnen(werte.tuerAbsicherung, { tuerart: 'haustuer', massnahmen: ['zylinder'] })).toEqual({
      art: 'spanne',
      spanne: { vonCent: 4000 + 8999, bisCent: 6050 + 14950 },
    });
    expect(
      tuerAbsicherungBerechnen(werte.tuerAbsicherung, { tuerart: 'haustuer', massnahmen: ['zylinder', 'querriegel'] }),
    ).toEqual({ art: 'kein-richtwert', grund: 'betrag-fehlt' });
    expect(
      serviceEinsatzBerechnen(werte.serviceEinsatz, { leistungen: ['zylindertausch'], anzahlTueren: 2 }),
    ).toEqual({ art: 'spanne', spanne: { vonCent: 2 * 2500 + 3000, bisCent: 2 * 4500 + 5000 } });
  });

  it('fällt bei leerem Global auf die Platzhalter-Struktur zurück', async () => {
    await speichern({
      platzhalter: false,
      tuerAbsicherung: { tuerarten: [], massnahmen: [] },
      serviceEinsatz: { leistungen: [], anfahrtVon: 30, anfahrtBis: 50 },
    });
    expect(await getRichtwerte()).toEqual(PLATZHALTER_RICHTWERTE);
  });
});
