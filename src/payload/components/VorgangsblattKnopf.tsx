'use client';

import { useConfig, useDocumentInfo } from '@payloadcms/ui';

/**
 * Link in der Seitenleiste eines Vorgangs: Vorgangsblatt in neuem Tab
 * (Endpunkt `vorgangsblatt`) — dort „Drucken / als PDF speichern“.
 */
export function VorgangsblattKnopf() {
  const { id } = useDocumentInfo();
  const { config } = useConfig();
  if (!id) return null;
  const href = `${config.serverURL}${config.routes.api}/vorgaenge/${encodeURIComponent(String(id))}/vorgangsblatt`;
  return (
    <div className="field-type" style={{ marginBottom: 'var(--base)' }}>
      <a className="btn btn--style-secondary btn--size-small" href={href} target="_blank" rel="noopener noreferrer">
        Vorgangsblatt drucken
      </a>
      <div className="field-description">Kompakte Übersicht zum Drucken oder als PDF speichern.</div>
    </div>
  );
}
