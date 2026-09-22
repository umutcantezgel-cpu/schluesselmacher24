'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateRoi } from '@/lib/actions/calculate-roi';
import type { RoiCalculationResult } from '@/lib/actions/calculate-roi';

const initialState: RoiCalculationResult = {
  estimatedSavings: 0,
  timeSavingsHours: 0,
  securityScoreIncrease: 0,
  tierRecommended: 'STANDARD',
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateRoi, initialState);

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, update: Partial<RoiCalculationResult>) => ({
      ...currentState,
      ...update,
    })
  );

  function handleChange(e: React.ChangeEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
        const employees = Number(formData.get('employees')) || 50;
    const turnoverRate = Number(formData.get('turnoverRate')) || 10;

    startTransition(() => {
      // Simplified client-side approximation for optimistic UI
      const lostKeyCostPerIncident = 250;
      const incidentsPerYear = Math.max(1, Math.round(employees * (turnoverRate / 100) * 0.15));
      const estimatedSavings = incidentsPerYear * lostKeyCostPerIncident;

      setOptimisticState({
        estimatedSavings,
      });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] transition-all hover:shadow-[0_12px_32px_-4px_oklch(0.52_0.24_260/0.12)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Enterprise ROI- & Ladezeit-Kalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
        Berechnen Sie das Einsparpotenzial durch moderne, erweiterbare Schließanlagen anhand Ihrer aktuellen Betriebsstruktur.
      </p>

      <form action={formAction} onChange={handleChange} className="mt-8 space-y-8">
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl Türen</label>
            <input
              type="range"
              name="doors"
              min="5"
              max="200"
              defaultValue="10"
              className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
            />
            <div className="mt-1 flex justify-between text-xs text-[oklch(0.32_0.02_260)]">
              <span>5</span>
              <span>200+</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Mitarbeiter</label>
            <input
              type="range"
              name="employees"
              min="10"
              max="500"
              defaultValue="50"
              className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
            />
            <div className="mt-1 flex justify-between text-xs text-[oklch(0.32_0.02_260)]">
              <span>10</span>
              <span>500+</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Fluktuation (%)</label>
            <input
              type="range"
              name="turnoverRate"
              min="0"
              max="50"
              defaultValue="10"
              className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
            />
            <div className="mt-1 flex justify-between text-xs text-[oklch(0.32_0.02_260)]">
              <span>0%</span>
              <span>50%</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 sm:grid-cols-3">
          <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
            <span className="block text-xs font-medium uppercase tracking-wider text-[oklch(0.52_0.015_260)]">
              Potenzielle Ersparnis/Jahr
            </span>
            <span className="mt-2 block text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.estimatedSavings.toLocaleString('de-DE')} €
            </span>
          </div>
          <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
            <span className="block text-xs font-medium uppercase tracking-wider text-[oklch(0.52_0.015_260)]">
              Zeitersparnis (Verwaltung)
            </span>
            <span className="mt-2 block text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {state.timeSavingsHours} h
            </span>
          </div>
          <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
            <span className="block text-xs font-medium uppercase tracking-wider text-[oklch(0.52_0.015_260)]">
              Empfohlene Klasse
            </span>
            <span className="mt-2 block text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {state.tierRecommended}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Berechne exakte Matrix...' : 'Detaillierten ROI-Report generieren'}
        </button>
      </form>
    </div>
  );
}
