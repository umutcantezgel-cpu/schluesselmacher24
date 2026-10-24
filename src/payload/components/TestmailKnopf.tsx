'use client';

import { Button, toast, useConfig } from '@payloadcms/ui';
import { useState } from 'react';

/** „Testmail an mich“ — sendet an die Adresse des angemeldeten Inhabers. */
export function TestmailKnopf() {
  const { config } = useConfig();
  const [laeuft, setLaeuft] = useState(false);

  async function senden() {
    setLaeuft(true);
    try {
      const antwort = await fetch(`${config.serverURL}${config.routes.api}/globals/einstellungen/testmail`, {
        method: 'POST',
        credentials: 'include',
      });
      const body = (await antwort.json().catch(() => ({}))) as { ok?: boolean; meldung?: string; error?: string };
      if (antwort.ok && body.ok) toast.success(body.meldung ?? 'Testmail gesendet.');
      else toast.error(body.error ?? 'Die Testmail konnte nicht gesendet werden.');
    } catch {
      toast.error('Die Testmail konnte nicht gesendet werden.');
    } finally {
      setLaeuft(false);
    }
  }

  return (
    <Button buttonStyle="secondary" size="small" disabled={laeuft} onClick={senden}>
      {laeuft ? 'Wird gesendet …' : 'Testmail an mich'}
    </Button>
  );
}
