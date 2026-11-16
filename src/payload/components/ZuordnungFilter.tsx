'use client';

import { wartetAufZuordnungFilter } from '../../lib/partner/lead-verlauf';

/**
 * Über der Liste der Vorgänge (FA-PLATTFORM-01B, FA-22-41): Filter „wartet auf Zuordnung“. Zeigt Vorgänge in
 * der Vermittlung bei „neu“ oder „geprüft“ und Vorgänge im Partnerweg ohne Vermittlung, ohne stornierte und
 * abgeschlossene.
 */
export function ZuordnungFilter() {
  const { suche } = wartetAufZuordnungFilter();
  return (
    <div className="sm24-werkzeug__formular" style={{ marginBottom: 'var(--base)' }}>
      <div className="sm24-aktion__zeile">
        <a className="btn btn--style-secondary btn--size-small" href={suche}>
          Wartet auf Zuordnung
        </a>
        <a className="btn btn--style-secondary btn--size-small" href="?">
          Alle Vorgänge
        </a>
      </div>
      <p className="field-description">
        Leads, die noch keinem Partnerbetrieb angeboten sind oder nach einer Ablehnung neu zugeordnet werden müssen.
      </p>
    </div>
  );
}
