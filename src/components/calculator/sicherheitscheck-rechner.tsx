'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSicherheitscheck, type SicherheitscheckResult } from '@/lib/actions/calculate-sicherheitscheck';

const initialState: SicherheitscheckResult = {
  score: 0,
  recommendations: [],
  estimatedCost: 0,
  tier: 'BASIS'
};

export function SicherheitscheckRechner() {
  const [state, formAction, isPending] = useActionState(calculateSicherheitscheck, initialState);
  const [optimisticCost, setOptimisticCost] = useOptimistic(
    state.estimatedCost,
    (current, update: number) => update
  );

  function handleAccessPointsChange(value: number) {
    startTransition(() => {
      setOptimisticCost(value * 250);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] sm24-bento-glow">
      <h3 className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]" style={{ viewTransitionName: 'sicherheitscheck-title' }}>
        Sicherheitscheck Kalkulator
      </h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
        Ermitteln Sie Ihren aktuellen Schutzbedarf und eine erste Kostenschätzung.
      </p>

      <form action={formAction} className="mt-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="objectType" className="block text-sm font-medium text-[oklch(0.32_0.02_260)]">
                  Objektart
              </label>
              <select
                  name="objectType"
                  id="objectType"
                  className="mt-2 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] py-2 px-3 text-sm focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
              >
                  <option value="residential">Privathaushalt</option>
                  <option value="commercial">Gewerbeobjekt</option>
              </select>
            </div>

            <div>
              <label htmlFor="currentLevel" className="block text-sm font-medium text-[oklch(0.32_0.02_260)]">
                  Aktueller Schutz
              </label>
              <select
                  name="currentLevel"
                  id="currentLevel"
                  className="mt-2 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] py-2 px-3 text-sm focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
              >
                  <option value="low">Veraltet / Gering</option>
                  <option value="medium">Standard (Zylinder, normale Beschläge)</option>
                  <option value="high">Hoch (Alarmanlage, Sicherheitsbeschläge)</option>
              </select>
            </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] flex justify-between">
            <span>Zugangspunkte (Türen, Fenster im EG)</span>
          </label>
          <div className="mt-2 flex items-center gap-4">
              <input
                type="range"
                name="accessPoints"
                min="1"
                max="20"
                defaultValue="3"
                onChange={(e) => handleAccessPointsChange(Number(e.target.value))}
                className="w-full accent-[oklch(0.52_0.24_260)]"
              />
          </div>
        </div>

        {state.score > 0 && !isPending && (
            <div className="mt-6 rounded-lg bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
                <h4 className="text-sm font-semibold text-[oklch(0.16_0.02_260)]">Ergebnis: {state.tier}</h4>
                <ul className="mt-2 list-inside list-disc text-sm text-[oklch(0.32_0.02_260)]">
                    {state.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                    ))}
                </ul>
            </div>
        )}

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <span className="text-sm font-medium text-[oklch(0.52_0.015_260)]">Geschätztes Budget:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            ab {optimisticCost.toLocaleString('de-DE')} €
          </span>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Wird berechnet...' : 'Detail-Analyse anfordern'}
        </button>
      </form>
    </div>
  );
}
