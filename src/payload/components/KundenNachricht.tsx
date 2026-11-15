'use client';

import { Button, toast, useConfig, useDocumentInfo } from '@payloadcms/ui';
import { useState } from 'react';

import { NACHRICHT_GRENZEN, NACHRICHT_VORLAGEN, nachrichtPruefen, vorlageFuer } from '@/lib/mail/nachricht-vorlagen';

/**
 * Knopf „Nachricht an den Kunden“ in der Seitenleiste eines Vorgangs (FA-KERN-05): Vorlage wählen oder frei
 * schreiben, Betreff und Text prüfen, senden (Endpunkt `nachricht`). Die Mail steht danach mit vollem Text
 * im Reiter „E-Mails“.
 */
export function KundenNachricht() {
  const { id, title } = useDocumentInfo();
  const { config } = useConfig();
  const [offen, setOffen] = useState(false);
  const [betreff, setBetreff] = useState('');
  const [text, setText] = useState('');
  const [laeuft, setLaeuft] = useState(false);
  if (!id) return null;
  const nummer = typeof title === 'string' && title ? title : 'Ihr Vorgang';

  function vorlageWaehlen(vorlageId: string) {
    const vorlage = vorlageFuer(vorlageId, nummer);
    if (!vorlage) return;
    setBetreff(vorlage.betreff);
    setText(vorlage.text);
  }

  async function senden() {
    const fehler = nachrichtPruefen(betreff, text);
    if (fehler) {
      toast.error(fehler);
      return;
    }
    if (!window.confirm(`Nachricht „${betreff.trim()}“ jetzt an den Kunden senden?`)) return;
    setLaeuft(true);
    try {
      const antwort = await fetch(`${config.serverURL}${config.routes.api}/vorgaenge/${id}/nachricht`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ betreff, text }),
      });
      const body = (await antwort.json().catch(() => ({}))) as { ok?: boolean; meldung?: string; error?: string };
      if (antwort.ok && body.ok) {
        toast.success(body.meldung ?? 'Nachricht gesendet.');
        setBetreff('');
        setText('');
        setOffen(false);
      } else {
        toast.error(body.error ?? 'Die Nachricht konnte nicht gesendet werden.');
      }
    } catch {
      toast.error('Die Nachricht konnte nicht gesendet werden.');
    } finally {
      setLaeuft(false);
    }
  }

  if (!offen) {
    return (
      <div className="field-type" style={{ marginBottom: 'var(--base)' }}>
        <Button buttonStyle="secondary" size="small" onClick={() => setOffen(true)}>
          Nachricht an den Kunden
        </Button>
        <div className="field-description">E-Mail mit Betreff und Text, auf Wunsch aus einer Vorlage. Steht danach im Reiter „E-Mails“.</div>
      </div>
    );
  }

  const feld = { width: '100%', boxSizing: 'border-box' as const, marginBottom: 'calc(var(--base) / 2)' };
  return (
    <div className="field-type" style={{ marginBottom: 'var(--base)' }}>
      <label className="field-label" htmlFor="sm24-nachricht-vorlage">
        Vorlage
      </label>
      <select id="sm24-nachricht-vorlage" defaultValue="" onChange={(e) => vorlageWaehlen(e.target.value)} style={feld}>
        <option value="">Frei schreiben</option>
        {NACHRICHT_VORLAGEN.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
      <label className="field-label" htmlFor="sm24-nachricht-betreff">
        Betreff
      </label>
      <input
        id="sm24-nachricht-betreff"
        type="text"
        value={betreff}
        maxLength={NACHRICHT_GRENZEN.betreff}
        onChange={(e) => setBetreff(e.target.value)}
        style={feld}
      />
      <label className="field-label" htmlFor="sm24-nachricht-text">
        Text
      </label>
      <textarea
        id="sm24-nachricht-text"
        rows={8}
        value={text}
        maxLength={NACHRICHT_GRENZEN.text}
        onChange={(e) => setText(e.target.value)}
        style={feld}
      />
      <div className="field-description" style={{ marginBottom: 'calc(var(--base) / 2)' }}>
        Anrede, Vorgangsnummer und Firmenangaben setzt die Mail selbst. Antworten des Kunden kommen in Ihr Postfach.
      </div>
      <div style={{ display: 'flex', gap: 'calc(var(--base) / 2)', flexWrap: 'wrap' }}>
        <Button buttonStyle="primary" size="small" disabled={laeuft} onClick={senden}>
          {laeuft ? 'Wird gesendet …' : 'Nachricht senden'}
        </Button>
        <Button buttonStyle="secondary" size="small" disabled={laeuft} onClick={() => setOffen(false)}>
          Abbrechen
        </Button>
      </div>
    </div>
  );
}
