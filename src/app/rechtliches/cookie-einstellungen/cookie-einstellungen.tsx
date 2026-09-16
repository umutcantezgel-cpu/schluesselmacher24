'use client';

import { useMemo, useState } from 'react';
import { Check, Trash2 } from 'lucide-react';

import { removeStoredValue, useStoredValue, writeStoredValue } from '@/lib/client-state';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

const STORAGE_KEY = 'sm24-cookie-einwilligung';

interface Consent {
  notwendig: true;
  statistik: boolean;
  komfort: boolean;
  updatedAt: string;
}

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

export function CookieSettings() {
  const raw = useStoredValue(STORAGE_KEY);
  const [entwurf, setEntwurf] = useState<Consent | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Gespeicherte Auswahl, sofern vorhanden. „Notwendig“ ist immer aktiv.
  const gespeichert = useMemo<Consent>(() => {
    const standard: Consent = {
      notwendig: true,
      statistik: false,
      komfort: false,
      updatedAt: '',
    };
    if (!raw) return standard;
    try {
      return { ...standard, ...(JSON.parse(raw) as Consent), notwendig: true };
    } catch {
      return standard;
    }
  }, [raw]);

  const consent = entwurf ?? gespeichert;
  const setConsent = (naechste: Consent | ((prev: Consent) => Consent)) =>
    setEntwurf(typeof naechste === 'function' ? naechste(consent) : naechste);

  function save() {
    const next = { ...consent, updatedAt: new Date().toISOString() };
    if (writeStoredValue(STORAGE_KEY, JSON.stringify(next))) {
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
        {CATEGORIES.map((category) => {
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
                  'mt-0.5 flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors',
                  checked ? 'bg-primary' : 'bg-surface-sunken',
                  category.locked || !category.active ? 'cursor-not-allowed opacity-60' : '',
                ].join(' ')}
              >
                <span
                  aria-hidden
                  className={[
                    'flex h-5 w-5 items-center justify-center rounded-full bg-white transition-transform',
                    checked ? 'translate-x-5' : 'translate-x-0',
                  ].join(' ')}
                >
                  {checked && <Check size={11} className="text-primary" strokeWidth={3} />}
                </span>
                <span className="sr-only">{category.label} aktivieren</span>
              </button>

              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-foreground">
                  {category.label}
                  {category.locked && (
                    <span className="ml-2 text-[12px] font-medium text-foreground-subtle">
                      (immer aktiv)
                    </span>
                  )}
                  {!category.locked && !category.active && (
                    <span className="ml-2 text-[12px] font-medium text-foreground-subtle">
                      (derzeit kein Dienst eingebunden)
                    </span>
                  )}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
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
          <Trash2 size={16} aria-hidden />
          Gespeicherte Daten löschen
        </Button>
      </div>

      {message && (
        <Alert tone="success" className="mt-4">
          {message}
        </Alert>
      )}

      {consent.updatedAt && (
        <p className="mt-3 text-[12px] text-foreground-subtle">
          Zuletzt gespeichert: {new Date(consent.updatedAt).toLocaleString('de-DE')}
        </p>
      )}
    </div>
  );
}
