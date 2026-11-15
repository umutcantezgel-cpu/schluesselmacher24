import type { Metadata } from 'next';
import { connection } from 'next/server';

import { PageHeader } from '@/components/layout/page-header';
import { Alert } from '@/components/ui/alert';
import { getRecord, getSettings } from '@/lib/data';
import { BESTAETIGUNG_BEDEUTUNG, BESTAETIGUNG_MELDUNG, bestaetigungsLage, fragenSatz, telefonSatz } from '@/lib/partner/kundenbestaetigung';
import { kontakt } from '@/lib/rechtliches/firma';
import { verifyAccessToken } from '@/lib/server/access-token';

import { BestaetigenKnopf } from './bestaetigen-knopf';

interface SeiteProps {
  params: Promise<{ id: string }>;
  /** `k` ist der persönliche Einmal-Schlüssel aus der Mail. */
  searchParams: Promise<{ k?: string | string[] }>;
}

export const metadata: Metadata = {
  title: 'Ausführung bestätigen',
  description: 'Bestätigen Sie, dass Ihr vermittelter Auftrag ausgeführt wurde.',
  // Persönlicher Link: nicht in den Suchindex, Schlüssel nicht an andere Seiten weitergeben.
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

const erster = (wert: string | string[] | undefined) => (Array.isArray(wert) ? wert[0] : wert);

/**
 * Bestätigung der Ausführung durch den Kunden (FA-KERN-04, A-049 Nr. 4). Das Öffnen ändert nichts; erst der
 * Knopf bestätigt. Unbekannter Vorgang und falscher oder benutzter Schlüssel sehen gleich aus.
 */
export default async function AuftragBestaetigenSeite(props: SeiteProps) {
  // Persönliche Daten: immer zur Anfragezeit rendern.
  await connection();
  const [{ id }, suche] = await Promise.all([props.params, props.searchParams]);
  const schluessel = erster(suche.k) ?? '';
  const vorgang = schluessel ? await getRecord(id) : null;
  const lage = bestaetigungsLage(vorgang, Boolean(vorgang) && verifyAccessToken(schluessel, vorgang?.referral?.confirmTokenHash));
  const firma = (await getSettings().catch(() => null))?.company;
  const telefon = firma ? kontakt(firma).telefon : undefined;

  return (
    <>
      <PageHeader eyebrow="Ihr Auftrag" art="arbeit" title="Ausführung bestätigen" />
      <div className="shell max-w-2xl space-y-6 py-8 md:py-12">
        {lage === 'offen' && vorgang ? (
          <>
            <p className="text-body leading-relaxed text-foreground">
              Vorgangsnummer <span className="font-mono tabular-nums">{vorgang.reference}</span>
            </p>
            <p className="text-body leading-relaxed text-foreground">{BESTAETIGUNG_BEDEUTUNG}</p>
            <BestaetigenKnopf recordId={vorgang.id} schluessel={schluessel} />
          </>
        ) : (
          <Alert tone="info" title="Keine Bestätigung möglich" role="status">
            {lage === 'nicht-offen' ? BESTAETIGUNG_MELDUNG.nichtOffen : BESTAETIGUNG_MELDUNG.ungueltig}
          </Alert>
        )}
        <p className="text-small leading-relaxed text-foreground-muted">{lage === 'offen' ? telefonSatz(telefon) : fragenSatz(telefon)}</p>
      </div>
    </>
  );
}
