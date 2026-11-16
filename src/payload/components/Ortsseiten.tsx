import type { Payload } from 'payload';

import { getCities } from '@/lib/data';
import { gemeindenMitPartnerAbfragen, ortsstamm } from '@/lib/orte/stamm';
import {
  gemeindeNamePasst,
  prioritaetsorteZeilen,
  vorgaengeJeGemeinde,
  zwoelfMonateVor,
  type OrtsseiteKurz,
  type PrioritaetsortZeile,
} from '@/lib/orte/ortsseiten';
import { stadtIndexierbar } from '@/lib/rechtliches/indexierung';
import type { CityPage } from '@/lib/types';

import { hatRolle } from '../access/rollen';

/*
 * Über der Liste der Einsatzgebiete (FA-PLATTFORM-03B): je Ortsseite, ob sie in Suchmaschinen und Sitemap steht, und
 * wenn nicht, warum; darunter die Prioritätsorte des Inhabers (Anhang A) mit Seite, Veröffentlichung, Partner und
 * Vorgängen der letzten zwölf Monate. Nur Anzeige: Aus der Liste entsteht keine Seite, die Zahlen setzen keine
 * Priorität. Serverkomponente, nur für das Team.
 */

const zelle = { padding: 'calc(var(--base) / 4) calc(var(--base) / 2)', borderBottom: '1px solid var(--theme-elevation-150)', verticalAlign: 'top' as const };
const kopf = { ...zelle, textAlign: 'left' as const, fontWeight: 600 };
const zahl = { ...zelle, textAlign: 'right' as const, fontVariantNumeric: 'tabular-nums' as const };
const jaNein = (wert: boolean) => (wert ? 'ja' : 'nein');

interface Gespeichert {
  id: number | string;
  stadt: string;
  gemeindeschluessel?: string | null;
  _status?: 'draft' | 'published' | null;
}

export async function Ortsseiten({ payload, user }: { payload: Payload; user?: unknown }) {
  if (!hatRolle(user, 'inhaber', 'mitarbeiter')) return null;

  let gespeichert: Gespeichert[];
  let veroeffentlicht: CityPage[];
  let plzVorgaenge: Array<{ plz?: string | null; createdAt: string }>;
  const jetzt = new Date();
  try {
    const [seiten, orte, vorgaenge] = await Promise.all([
      payload.find({
        collection: 'einsatzgebiete',
        depth: 0,
        limit: 0,
        pagination: false,
        overrideAccess: true,
        select: { stadt: true, gemeindeschluessel: true, _status: true },
      }),
      getCities(),
      payload.find({
        collection: 'vorgaenge',
        where: { createdAt: { greater_than_equal: zwoelfMonateVor(jetzt).toISOString() } },
        depth: 0,
        limit: 0,
        pagination: false,
        overrideAccess: true,
        select: { createdAt: true, kontakt: { plz: true } },
      }),
    ]);
    gespeichert = seiten.docs as unknown as Gespeichert[];
    veroeffentlicht = orte;
    plzVorgaenge = (vorgaenge.docs as unknown as Array<{ createdAt: string; kontakt?: { plz?: string | null } | null }>).map((v) => ({
      createdAt: v.createdAt,
      plz: v.kontakt?.plz ?? null,
    }));
  } catch (error) {
    payload.logger.error({ msg: 'Ortsseiten und Prioritätsorte nicht geladen', err: error });
    return <p style={{ marginBottom: 'var(--base)' }}>Ortsseiten und Prioritätsorte konnten nicht geladen werden.</p>;
  }

  // Stamm und Partner eigens abfangen: Ohne Stamm bleibt die Tabelle der Ortsseiten (mit Grund) und die Liste darunter.
  let zeilen: PrioritaetsortZeile[] | null = null;
  try {
    const stamm = await ortsstamm();
    const schluessel = stamm.prioritaet.flatMap((e) => (e.zuordnung !== 'offen' && e.schluessel ? [e.schluessel] : []));
    const mitPartner = await gemeindenMitPartnerAbfragen(schluessel);
    const kurz: OrtsseiteKurz[] = gespeichert.map((s) => ({ gemeindeschluessel: s.gemeindeschluessel, veroeffentlicht: s._status === 'published' }));
    zeilen = prioritaetsorteZeilen(stamm, kurz, mitPartner, vorgaengeJeGemeinde(plzVorgaenge, stamm, jetzt));
  } catch (error) {
    payload.logger.error({ msg: 'Ortsstamm für die Prioritätsorte nicht lesbar', err: error });
  }
  const stammGelesen = zeilen !== null;
  const mitSeite = zeilen?.filter((z) => z.seiteVorhanden).length ?? 0;
  const offen = zeilen?.filter((z) => z.offen) ?? [];

  /** Schlüssel mit dem Namen der Gemeinde im Stamm; Hinweis, wenn der Name nicht zum Ort passt. Ohne Stamm nur die Ziffern. */
  const schluesselZelle = (ort: CityPage) => {
    const gemeinde = ort.lage?.gemeinde;
    if (gemeinde) {
      return (
        <>
          {gemeinde.schluessel} {gemeinde.name}
          {!gemeindeNamePasst(ort.city, gemeinde.name) && (
            <>
              <br />
              <strong>Name im Stamm passt nicht zum Ort, bitte Schlüssel prüfen.</strong>
            </>
          )}
        </>
      );
    }
    if (!ort.gemeindeschluessel) return 'fehlt';
    return stammGelesen ? `${ort.gemeindeschluessel} (nicht im Stamm)` : ort.gemeindeschluessel;
  };

  return (
    <section style={{ marginBottom: 'calc(var(--base) * 2)' }} aria-labelledby="sm24-ortsseiten">
      <h2 id="sm24-ortsseiten" style={{ margin: '0 0 calc(var(--base) / 2)' }}>Veröffentlichung der Ortsseiten</h2>
      <p style={{ margin: '0 0 var(--base)', opacity: 0.8 }}>
        In Suchmaschinen und Sitemap steht eine Ortsseite nur mit eigener Einleitung, Gemeindeschlüssel aus dem Stamm und einem Leistungsweg. Sonst bleibt sie
        erreichbar, aber auf noindex; der Grund steht hier.
      </p>
      {!stammGelesen && (
        <p style={{ margin: '0 0 var(--base)' }}>
          <strong>Ortsstamm nicht lesbar.</strong> Landkreis, Postleitzahlen, Partner und Prioritätsorte fehlen deshalb.
        </p>
      )}
      <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 'calc(var(--base) * 2)' }}>
        <thead>
          <tr>
            <th style={kopf}>Ort</th>
            <th style={kopf}>Gemeindeschlüssel</th>
            <th style={kopf}>Landkreis</th>
            <th style={kopf}>Priorität</th>
            <th style={kopf}>Partner deckt ab</th>
            <th style={kopf}>In Suchmaschinen</th>
            <th style={kopf}>Grund</th>
          </tr>
        </thead>
        <tbody>
          {veroeffentlicht.map((ort) => (
            <tr key={ort.id}>
              <td style={zelle}>{ort.city}</td>
              <td style={zelle}>{schluesselZelle(ort)}</td>
              <td style={zelle}>{ort.lage?.kreis?.name ?? ''}</td>
              <td style={zahl}>{ort.lage?.prioritaet ?? ''}</td>
              <td style={zelle}>{stammGelesen ? jaNein(Boolean(ort.lage?.partnerDeckt)) : ''}</td>
              <td style={zelle}>{jaNein(stadtIndexierbar(ort))}</td>
              <td style={zelle}>{ort.lage?.gruende.join(' ') ?? ''}</td>
            </tr>
          ))}
          {gespeichert
            .filter((s) => s._status !== 'published')
            .map((s) => (
              <tr key={`entwurf-${s.id}`}>
                <td style={zelle}>{s.stadt}</td>
                <td style={zelle}>{s.gemeindeschluessel ?? 'fehlt'}</td>
                <td style={zelle} />
                <td style={zahl} />
                <td style={zelle} />
                <td style={zelle}>nein</td>
                <td style={zelle}>Entwurf, nicht veröffentlicht.</td>
              </tr>
            ))}
        </tbody>
      </table>

      {zeilen && (
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
            Prioritätsorte des Inhabers (Anhang A): {zeilen.length} Orte, {mitSeite} mit Ortsseite
            {offen.length > 0 ? `, ${offen.length} offen` : ''}
          </summary>
          <p style={{ margin: 'calc(var(--base) / 2) 0', opacity: 0.8 }}>
            Nur Anzeige. Aus dieser Liste entsteht keine Seite. Vorgänge: letzte zwölf Monate, gezählt über die Postleitzahl des
            Vorgangs; sie setzen keine Priorität.
          </p>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={kopf}>Land</th>
                <th style={kopf}>Rang</th>
                <th style={kopf}>Ort</th>
                <th style={kopf}>Seite vorhanden</th>
                <th style={kopf}>Veröffentlicht</th>
                <th style={kopf}>Partner vorhanden</th>
                <th style={kopf}>Vorgänge (12 Monate)</th>
              </tr>
            </thead>
            <tbody>
              {zeilen.map((z) => (
                <tr key={`${z.land}-${z.rang}`}>
                  <td style={zelle}>{z.land}</td>
                  <td style={zahl}>{z.rang}</td>
                  <td style={zelle}>
                    {z.name}
                    {z.offen && (
                      <>
                        <br />
                        <strong>offen, bitte bestätigen:</strong> {z.offen.kandidaten.join(', ')}
                      </>
                    )}
                  </td>
                  <td style={zelle}>{jaNein(z.seiteVorhanden)}</td>
                  <td style={zelle}>{jaNein(z.veroeffentlicht)}</td>
                  <td style={zelle}>{jaNein(z.partnerVorhanden)}</td>
                  <td style={zahl}>{z.vorgaenge12Monate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
    </section>
  );
}
