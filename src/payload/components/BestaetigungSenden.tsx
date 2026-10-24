'use client';

import { Button, toast, useConfig, useDocumentInfo } from '@payloadcms/ui';
import { useState } from 'react';

/**
 * Knopf in der Seitenleiste eines Vorgangs: Eingangsbestätigung mit neuem
 * persönlichen Link erneut senden (Endpunkt `bestaetigung-senden`).
 */
export function BestaetigungSenden() {
  const { id } = useDocumentInfo();
  const { config } = useConfig();
  const [laeuft, setLaeuft] = useState(false);
  if (!id) return null;

  async function senden() {
    const bestaetigt = window.confirm(
      'Eingangsbestätigung mit neuem persönlichen Link an den Kunden senden? Der bisherige Link gilt danach nicht mehr.',
    );
    if (!bestaetigt) return;
    setLaeuft(true);
    try {
      const antwort = await fetch(`${config.serverURL}${config.routes.api}/vorgaenge/${id}/bestaetigung-senden`, {
        method: 'POST',
        credentials: 'include',
      });
      const body = (await antwort.json().catch(() => ({}))) as { ok?: boolean; meldung?: string; error?: string };
      if (antwort.ok && body.ok) toast.success(body.meldung ?? 'Bestätigung gesendet.');
      else toast.error(body.error ?? 'Die Bestätigung konnte nicht gesendet werden.');
    } catch {
      toast.error('Die Bestätigung konnte nicht gesendet werden.');
    } finally {
      setLaeuft(false);
    }
  }

  return (
    <div className="field-type" style={{ marginBottom: 'var(--base)' }}>
      <Button buttonStyle="secondary" size="small" disabled={laeuft} onClick={senden}>
        {laeuft ? 'Wird gesendet …' : 'Bestätigung erneut senden'}
      </Button>
      <div className="field-description">Sendet die Eingangsbestätigung mit neuem Link an den Kunden.</div>
    </div>
  );
}
