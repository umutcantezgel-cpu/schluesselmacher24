'use client';

import { useConfig, useDocumentInfo } from '@payloadcms/ui';

/**
 * Links in der Seitenleiste eines Vorgangs: Vorgangsblatt in neuem Tab
 * (Endpunkt `vorgangsblatt`, dort „Drucken / als PDF speichern“) und als PDF
 * (Endpunkt `vorgangsblatt-pdf`, G-37).
 */
export function VorgangsblattKnopf() {
  const { id } = useDocumentInfo();
  const { config } = useConfig();
  if (!id) return null;
  const basis = `${config.serverURL}${config.routes.api}/vorgaenge/${encodeURIComponent(String(id))}`;
  return (
    <div className="field-type" style={{ marginBottom: 'var(--base)' }}>
      <a className="btn btn--style-secondary btn--size-small" href={`${basis}/vorgangsblatt`} target="_blank" rel="noopener noreferrer">
        Vorgangsblatt drucken
      </a>{' '}
      <a className="btn btn--style-secondary btn--size-small" href={`${basis}/vorgangsblatt-pdf`} target="_blank" rel="noopener noreferrer">
        Vorgangsblatt als PDF
      </a>
      <div className="field-description">Kompakte Übersicht zum Drucken, oder als PDF mit Vorschaubildern (Fahrzeugscheine nur als Eintrag).</div>
    </div>
  );
}
