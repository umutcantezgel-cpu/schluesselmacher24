import type { Payload } from 'payload';

import { formatCents } from '@/lib/format';
import { kennzahlenAb, kennzahlenBerechnen, type KennzahlVorgang } from '@/lib/kennzahlen';
import { ERLEDIGTE_STATUS } from '@/lib/vorgang-status';

import { hatRolle } from '../access/rollen';

/**
 * Kennzahlen über dem Dashboard (Erg. Leitfaden §4): Bestellungen,
 * Fotoanfragen, Terminanfragen, Projektanfragen und Partneranmeldungen je
 * Monat, offene Vorgänge je Status und bezahlte Beträge. Serverkomponente —
 * gezählt wird aus den Vorgängen, ohne Cookies und ohne Fremddienst. Nur für
 * das Team (Inhaber, Mitarbeiter).
 */

const zelle = { padding: 'calc(var(--base) / 3) calc(var(--base) / 2)', borderBottom: '1px solid var(--theme-elevation-150)' } as const;
const zahl = { ...zelle, textAlign: 'right' as const, fontVariantNumeric: 'tabular-nums' as const };

export async function Kennzahlen({ payload, user }: { payload: Payload; user?: unknown }) {
  if (!hatRolle(user, 'inhaber', 'mitarbeiter')) return null;

  const jetzt = new Date();
  const ab = kennzahlenAb(jetzt);
  let vorgaenge: KennzahlVorgang[];
  try {
    const { docs } = await payload.find({
      collection: 'vorgaenge',
      where: {
        or: [
          { createdAt: { greater_than_equal: ab } },
          { 'zahlung.bezahltAm': { greater_than_equal: ab } },
          { status: { not_in: [...ERLEDIGTE_STATUS] } },
        ],
      },
      select: { art: true, bereich: true, status: true, createdAt: true, zahlung: true },
      depth: 0,
      pagination: false,
      overrideAccess: true,
    });
    vorgaenge = docs as unknown as KennzahlVorgang[];
  } catch (error) {
    payload.logger.error({ msg: 'Kennzahlen nicht geladen', err: error });
    return <p style={{ marginBottom: 'var(--base)' }}>Kennzahlen konnten nicht geladen werden.</p>;
  }

  const k = kennzahlenBerechnen(vorgaenge, jetzt);
  return (
    <section style={{ marginBottom: 'calc(var(--base) * 2)' }} aria-labelledby="sm24-kennzahlen">
      <h2 id="sm24-kennzahlen" style={{ margin: '0 0 calc(var(--base) / 2)' }}>Kennzahlen</h2>
      <p style={{ margin: '0 0 var(--base)', opacity: 0.8 }}>
        Eingänge je Monat (deutsche Zeit), gezählt aus den Vorgängen — ohne Cookies und ohne Fremddienst.
      </p>
      <div style={{ display: 'grid', gap: 'calc(var(--base) * 2)', gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ ...zelle, textAlign: 'left' }}>Eingang</th>
              {k.monate.map((monat) => (
                <th key={monat.schluessel} style={{ ...zahl, fontWeight: 600 }}>{monat.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {k.zeilen.map((zeile) => (
              <tr key={zeile.id}>
                <td style={zelle}>{zeile.label}</td>
                {zeile.werte.map((wert, index) => (
                  <td key={k.monate[index].schluessel} style={zahl}>{wert}</td>
                ))}
              </tr>
            ))}
            <tr>
              <td style={zelle}>Bezahlt (Zahlungseingang, abzüglich Erstattungen)</td>
              {k.umsatzCent.map((cent, index) => (
                <td key={k.monate[index].schluessel} style={zahl}>{formatCents(cent)}</td>
              ))}
            </tr>
          </tbody>
        </table>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ ...zelle, textAlign: 'left' }}>Offene Vorgänge</th>
              <th style={{ ...zahl, fontWeight: 600 }}>Anzahl</th>
            </tr>
          </thead>
          <tbody>
            {k.offen.map((zeile) => (
              <tr key={zeile.status}>
                <td style={zelle}>
                  <a href={`/admin/collections/vorgaenge?where[status][equals]=${zeile.status}`}>{zeile.label}</a>
                </td>
                <td style={zahl}>{zeile.anzahl}</td>
              </tr>
            ))}
            <tr>
              <td style={{ ...zelle, fontWeight: 600 }}>Gesamt</td>
              <td style={{ ...zahl, fontWeight: 600 }}>{k.offenGesamt}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
