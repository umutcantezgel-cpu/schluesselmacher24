'use client';

import { useConfig, useDocumentInfo } from '@payloadcms/ui';

/**
 * Link in der Seitenleiste eines Partnerbetriebs: Partnervertrag als PDF aus der Vorlage
 * (Endpunkt `vertrag-pdf`, E7-OPUS-01, G-39).
 */
export function PartnervertragKnopf() {
  const { id } = useDocumentInfo();
  const { config } = useConfig();
  if (!id) return null;
  const href = `${config.serverURL}${config.routes.api}/partnerbetriebe/${encodeURIComponent(String(id))}/vertrag-pdf`;
  return (
    <div className="field-type" style={{ marginBottom: 'var(--base)' }}>
      <a className="btn btn--style-secondary btn--size-small" href={href} target="_blank" rel="noopener noreferrer">
        Partnervertrag als PDF
      </a>
      <div className="field-description">
        Mit den Daten dieses Betriebs. Solange die Vorlage des Anwalts fehlt, ist es ein Entwurf und nicht zum Unterschreiben.
      </div>
    </div>
  );
}
