'use client';

import { Button, toast, useConfig, useDocumentInfo, useFormFields } from '@payloadcms/ui';
import { useState } from 'react';

/**
 * Seitenleiste eines Termins: neues Datum und neue Uhrzeit wählen und
 * verschieben (Endpunkt `termin-verschieben`). Der Server prüft unter
 * derselben Sperre wie die Online-Buchung, ob das Zeitfenster frei ist.
 */
export function TerminVerschieben() {
  const { id } = useDocumentInfo();
  const { config } = useConfig();
  const datumBisher = useFormFields(([felder]) => felder['termin.datum']?.value as string | undefined);
  const uhrzeitBisher = useFormFields(([felder]) => felder['termin.uhrzeit']?.value as string | undefined);
  const [datum, setDatum] = useState('');
  const [uhrzeit, setUhrzeit] = useState('');
  const [informieren, setInformieren] = useState(true);
  const [laeuft, setLaeuft] = useState(false);
  if (!id) return null;

  async function verschieben() {
    if (!datum || !uhrzeit) {
      toast.error('Bitte neues Datum und neue Uhrzeit wählen.');
      return;
    }
    const bestaetigt = window.confirm(
      `Termin auf ${datum.split('-').reverse().join('.')}, ${uhrzeit} Uhr verschieben?`
        + (informieren ? ' Der Kunde erhält eine Mail.' : '')
        + ' Die Seite lädt danach neu — ungespeicherte Änderungen bitte vorher speichern.',
    );
    if (!bestaetigt) return;
    setLaeuft(true);
    try {
      const antwort = await fetch(`${config.serverURL}${config.routes.api}/vorgaenge/${id}/termin-verschieben`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datum, uhrzeit, kundeInformieren: informieren }),
      });
      const body = (await antwort.json().catch(() => ({}))) as { ok?: boolean; meldung?: string; error?: string };
      if (antwort.ok && body.ok) {
        toast.success(body.meldung ?? 'Termin verschoben.');
        window.setTimeout(() => window.location.reload(), 1200);
      } else {
        toast.error(body.error ?? 'Der Termin konnte nicht verschoben werden.');
      }
    } catch {
      toast.error('Der Termin konnte nicht verschoben werden.');
    } finally {
      setLaeuft(false);
    }
  }

  return (
    <div className="field-type sm24-aktion" style={{ marginBottom: 'var(--base)' }}>
      <div className="field-label">Termin verschieben</div>
      {datumBisher && uhrzeitBisher && (
        <div className="field-description">
          Bisher: {datumBisher.split('-').reverse().join('.')}, {uhrzeitBisher} Uhr
        </div>
      )}
      <div className="sm24-aktion__zeile">
        <input type="date" aria-label="Neues Datum" value={datum} onChange={(e) => setDatum(e.target.value)} />
        <input type="time" aria-label="Neue Uhrzeit" step={300} value={uhrzeit} onChange={(e) => setUhrzeit(e.target.value)} />
      </div>
      <label className="sm24-aktion__haken">
        <input type="checkbox" checked={informieren} onChange={(e) => setInformieren(e.target.checked)} />
        Kunden per E-Mail informieren
      </label>
      <Button buttonStyle="secondary" size="small" disabled={laeuft} onClick={verschieben}>
        {laeuft ? 'Wird geprüft …' : 'Termin verschieben'}
      </Button>
      <div className="field-description">
        Prüft Öffnungszeiten, Sperrtage, Feiertage und Belegung. Die Vertragsbestätigung geht einmalig mit, falls noch nicht gesendet.
      </div>
    </div>
  );
}
