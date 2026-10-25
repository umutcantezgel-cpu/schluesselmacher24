'use client';

import { Button, toast, useAuth, useConfig } from '@payloadcms/ui';
import { useState, type FormEvent } from 'react';

/* Über der Liste der Vorgänge: Telefontermin eintragen (Team) und
   CSV-Export für die Buchhaltung (nur Inhaber). */

const LEER = {
  vorname: '',
  nachname: '',
  email: '',
  telefon: '',
  datum: '',
  uhrzeit: '',
  dauerMinuten: '60',
  ort: 'werkstatt',
  leistung: '',
  notiz: '',
};

/** ISO-Tag im Browser (deutsche Zeit des Teams). */
function isoTag(datum: Date): string {
  return `${datum.getFullYear()}-${String(datum.getMonth() + 1).padStart(2, '0')}-${String(datum.getDate()).padStart(2, '0')}`;
}

function Telefontermin({ api }: { api: string }) {
  const [werte, setWerte] = useState(LEER);
  const [informieren, setInformieren] = useState(true);
  const [laeuft, setLaeuft] = useState(false);
  const setzen = (feld: keyof typeof LEER) => (e: { target: { value: string } }) => setWerte((v) => ({ ...v, [feld]: e.target.value }));

  async function eintragen(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLaeuft(true);
    try {
      const antwort = await fetch(`${api}/vorgaenge/telefontermin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...werte,
          dauerMinuten: Number(werte.dauerMinuten),
          leistung: werte.leistung || undefined,
          notiz: werte.notiz || undefined,
          kundeInformieren: informieren,
        }),
      });
      const body = (await antwort.json().catch(() => ({}))) as { ok?: boolean; meldung?: string; error?: string };
      if (antwort.ok && body.ok) {
        toast.success(body.meldung ?? 'Termin eingetragen.');
        setWerte(LEER);
        window.setTimeout(() => window.location.reload(), 1200);
      } else {
        toast.error(body.error ?? 'Der Termin konnte nicht eingetragen werden.');
      }
    } catch {
      toast.error('Der Termin konnte nicht eingetragen werden.');
    } finally {
      setLaeuft(false);
    }
  }

  return (
    <form onSubmit={eintragen} className="sm24-werkzeug__formular">
      <div className="sm24-werkzeug__raster">
        <input required placeholder="Vorname" aria-label="Vorname" value={werte.vorname} onChange={setzen('vorname')} />
        <input required placeholder="Nachname" aria-label="Nachname" value={werte.nachname} onChange={setzen('nachname')} />
        <input required type="email" placeholder="E-Mail" aria-label="E-Mail" value={werte.email} onChange={setzen('email')} />
        <input required type="tel" placeholder="Telefon" aria-label="Telefon" value={werte.telefon} onChange={setzen('telefon')} />
        <input required type="date" aria-label="Datum" value={werte.datum} onChange={setzen('datum')} />
        <input required type="time" step={300} aria-label="Uhrzeit" value={werte.uhrzeit} onChange={setzen('uhrzeit')} />
        <input required type="number" min={15} max={600} step={15} aria-label="Dauer in Minuten" title="Dauer in Minuten" value={werte.dauerMinuten} onChange={setzen('dauerMinuten')} />
        <select aria-label="Ort" value={werte.ort} onChange={setzen('ort')}>
          <option value="werkstatt">Werkstatt</option>
          <option value="vor-ort">Vor Ort</option>
        </select>
        <input placeholder="Leistung (z. B. Zweitschlüssel)" aria-label="Leistung" value={werte.leistung} onChange={setzen('leistung')} />
        <input placeholder="Interne Notiz" aria-label="Interne Notiz" value={werte.notiz} onChange={setzen('notiz')} />
      </div>
      <label className="sm24-aktion__haken">
        <input type="checkbox" checked={informieren} onChange={(e) => setInformieren(e.target.checked)} />
        Kunden per E-Mail über den Termin informieren
      </label>
      <Button type="submit" buttonStyle="secondary" size="small" disabled={laeuft}>
        {laeuft ? 'Wird geprüft …' : 'Termin eintragen'}
      </Button>
      <p className="field-description">
        Gleiche Prüfung wie die Online-Buchung (Öffnungszeiten, Sperrtage, Feiertage, Belegung), ohne Vorlauf. Ohne
        Online-Zahlung; die Vertragsbestätigung geht einmalig an den Kunden.
      </p>
    </form>
  );
}

function CsvExport({ api }: { api: string }) {
  const heute = new Date();
  const [von, setVon] = useState(isoTag(new Date(heute.getFullYear(), heute.getMonth(), 1)));
  const [bis, setBis] = useState(isoTag(heute));
  const href = `${api}/vorgaenge/export?von=${encodeURIComponent(von)}&bis=${encodeURIComponent(bis)}`;
  return (
    <div className="sm24-werkzeug__formular">
      <div className="sm24-aktion__zeile">
        <label>
          Von <input type="date" value={von} onChange={(e) => setVon(e.target.value)} />
        </label>
        <label>
          Bis <input type="date" value={bis} onChange={(e) => setBis(e.target.value)} />
        </label>
        <a className="btn btn--style-secondary btn--size-small" href={href} download>
          CSV herunterladen
        </a>
      </div>
      <p className="field-description">
        Alle Vorgänge des Zeitraums (nach Eingangsdatum) mit Positionen, Netto, USt., Brutto, Versand und Zahlungsstand —
        Semikolon-getrennt für Excel.
      </p>
    </div>
  );
}

export function VorgaengeWerkzeuge() {
  const { config } = useConfig();
  const { user } = useAuth();
  const rollen = ((user as { rollen?: string[] } | null)?.rollen ?? []) as string[];
  const api = `${config.serverURL}${config.routes.api}`;
  return (
    <div className="sm24-werkzeug">
      <details>
        <summary>Telefontermin eintragen</summary>
        <Telefontermin api={api} />
      </details>
      {rollen.includes('inhaber') && (
        <details>
          <summary>CSV-Export für die Buchhaltung</summary>
          <CsvExport api={api} />
        </details>
      )}
    </div>
  );
}
