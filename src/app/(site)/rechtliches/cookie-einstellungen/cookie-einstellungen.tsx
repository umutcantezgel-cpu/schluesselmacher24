'use client';

import { useMemo, useState } from 'react';

import { removeStoredValue } from '@/lib/client-state';
import {
  einwilligungEntfernen,
  einwilligungLesen,
  einwilligungSpeichern,
  useEinwilligungRoh,
  type Einwilligung,
} from '@/lib/einwilligung';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { GlyphHaken } from '@/components/visual/glyphen/haken';
import { GlyphPapierkorb } from '@/components/visual/glyphen/papierkorb';

type Consent = Einwilligung;

const CATEGORIES = [
  {
    id: 'notwendig' as const,
    label: 'Notwendig',
    description:
      'Warenkorb, Zwischenstand in Formularen und Ihre Auswahl auf dieser Seite. Ohne diese '
      + 'Speicherung funktionieren Bestellung und Konfiguratoren nicht.',
    locked: true,
    active: true,
  },
  {
    id: 'komfort' as const,
    label: 'Komfort',
    description:
      'Zusätzliche Erleichterungen, etwa das Merken zuletzt verwendeter Filter. Derzeit ist kein '
      + 'solcher Dienst eingebunden.',
    locked: false,
    active: false,
  },
  {
    id: 'statistik' as const,
    label: 'Statistik',
    description:
      'Anonyme Auswertung der Seitennutzung. Derzeit ist kein Analysedienst eingebunden.',
    locked: false,
    active: false,
  },
];

/** „Statistik“, wenn Google Analytics eingebunden ist (Mess-ID gesetzt). */
const STATISTIK_AKTIV = {
  id: 'statistik' as const,
  label: 'Statistik',
  description:
    'Reichweitenmessung mit Google Analytics (Google Ireland Limited): welche Seiten aufgerufen und welche '
    + 'Abläufe abgeschlossen werden. Erst mit Ihrer Einwilligung wird das Skript geladen; dabei können Daten in '
    + 'die USA übertragen werden. Schalten Sie die Statistik aus, endet die Messung und die Analytics-Cookies '
    + 'werden gelöscht.',
  locked: false,
  active: true,
};

export function CookieSettings({ statistikAktiv = false }: { statistikAktiv?: boolean }) {
  const raw = useEinwilligungRoh();
  const [entwurf, setEntwurf] = useState<Consent | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const kategorien = useMemo(
    () => CATEGORIES.map((category) => (category.id === 'statistik' && statistikAktiv ? STATISTIK_AKTIV : category)),
    [statistikAktiv],
  );

  // Gespeicherte Auswahl, sofern vorhanden. „Notwendig“ ist immer aktiv.
  const gespeichert = useMemo<Consent>(
    () => einwilligungLesen(raw) ?? { notwendig: true, statistik: false, komfort: false, updatedAt: '' },
    [raw],
  );

  const consent = entwurf ?? gespeichert;
  const setConsent = (naechste: Consent | ((prev: Consent) => Consent)) =>
    setEntwurf(typeof naechste === 'function' ? naechste(consent) : naechste);

  function save() {
    // Ohne eingebundenen Dienst bleibt „Statistik“ aus, auch wenn ein alter Stand anderes sagt.
    const next = einwilligungSpeichern({ statistik: statistikAktiv && consent.statistik, komfort: consent.komfort });
    if (next) {
      setEntwurf(next);
      setMessage('Ihre Auswahl wurde gespeichert.');
    } else {
      setMessage(
        'Ihre Auswahl konnte nicht gespeichert werden — Ihr Browser blockiert die Speicherung.',
      );
    }
  }

  function clearAll() {
    try {
      const keys: string[] = [];
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i);
        if (key && (key.startsWith('sm24') || key.startsWith('sm24:'))) keys.push(key);
      }
      for (const key of keys) removeStoredValue(key);
      // Auch die Einwilligung ist damit gelöscht: gilt als Widerruf, eine laufende Messung endet.
      einwilligungEntfernen();
      setEntwurf(null);
      setMessage(
        `${keys.length} gespeicherte Einträge wurden gelöscht. Warenkorb und Zwischenstände sind zurückgesetzt.`,
      );
    } catch {
      setMessage('Die gespeicherten Daten konnten nicht gelöscht werden.');
    }
  }

  return (
    <div className="not-prose my-8 rounded-lg border border-border bg-surface p-5 md:p-6">
      <ul className="divide-y divide-border">
        {kategorien.map((category) => {
          const checked = category.locked ? true : consent[category.id];
          return (
            <li key={category.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
              <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={category.locked || !category.active}
                onClick={() =>
                  !category.locked &&
                  setConsent((prev) => ({ ...prev, [category.id]: !prev[category.id] }))
                }
                className={[
                  'group -my-2.5 flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-full',
                  category.locked || !category.active ? 'cursor-not-allowed' : '',
                ].join(' ')}
              >
                <span
                  aria-hidden
                  className={[
                    'flex h-6 w-11 items-center rounded-full p-0.5 transition-colors duration-quick ease-standard',
                    checked ? 'bg-primary' : 'bg-surface-sunken',
                    category.locked || !category.active ? 'opacity-60' : '',
                    !category.locked && category.active && checked ? 'group-hover:bg-primary-hover' : '',
                    !category.locked && category.active && !checked ? 'group-hover:bg-surface-muted' : '',
                  ].join(' ')}
                >
                  <span
                    aria-hidden
                    className={[
                      'flex h-5 w-5 items-center justify-center rounded-full bg-surface transition-transform duration-quick ease-standard',
                      checked ? 'translate-x-5' : 'translate-x-0',
                    ].join(' ')}
                  >
                    {checked && <GlyphHaken size={14} className="text-primary" />}
                  </span>
                </span>
                <span className="sr-only">{category.label} aktivieren</span>
              </button>

              <div className="min-w-0">
                <p className="text-body font-semibold text-foreground">
                  {category.label}
                  {category.locked && (
                    <span className="ml-2 text-caption font-medium text-foreground-muted">
                      (immer aktiv)
                    </span>
                  )}
                  {!category.locked && !category.active && (
                    <span className="ml-2 text-caption font-medium text-foreground-muted">
                      (derzeit kein Dienst eingebunden)
                    </span>
                  )}
                </p>
                <p className="mt-1 max-w-measure text-small leading-relaxed text-foreground-muted">
                  {category.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button onClick={save}>Auswahl speichern</Button>
        <Button variant="outline" onClick={clearAll}>
          <GlyphPapierkorb size={16} />
          Gespeicherte Daten löschen
        </Button>
      </div>

      {message && (
        <Alert tone="info" role="status" className="mt-4">
          {message}
        </Alert>
      )}

      {consent.updatedAt && (
        <p className="mt-3 font-mono text-caption tabular-nums text-foreground-muted">
          Zuletzt gespeichert: {new Date(consent.updatedAt).toLocaleString('de-DE')}
        </p>
      )}
    </div>
  );
}
