'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseROI } from '@/lib/actions/calculate-roi';
import type { ROICalculationResult } from '@/lib/actions/calculate-roi';

const initialState: ROICalculationResult = {
  estimatedCost: 0,
  setupTime: '-',
  roiMonths: 0,
};

export function EnterpriseROICalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseROI, initialState);

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, update: { doors: number }) => {
      const doors = update.doors;
      return {
        estimatedCost: 500 + doors * 120,
        setupTime: `${Math.max(1, Math.ceil(doors / 5))} ${Math.max(1, Math.ceil(doors / 5)) === 1 ? 'Tag' : 'Tage'}`,
        roiMonths: Math.max(6, Math.floor(48 - doors / 2)),
      };
    }
  );

  function handleDoorsChange(value: number) {
    startTransition(() => {
      setOptimisticState({ doors: value });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] my-12">
      <h3 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight mb-2">Interaktiver Enterprise ROI- und Ladezeit-Kalkulator</h3>
      <p className="text-[oklch(0.32_0.02_260)] mb-8 text-sm">Berechnen Sie in Echtzeit die initialen Investitionskosten, Einrichtungszeit und den voraussichtlichen Break-Even-Point Ihrer neuen Schließanlage.</p>

      <form action={formAction} className="space-y-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-semibold text-[oklch(0.16_0.02_260)]">Anzahl der Türen (Schließstellen)</label>
            <span className="font-mono text-sm text-[oklch(0.52_0.24_260)] bg-[oklch(0.988_0.002_260)] px-2 py-1 rounded border border-[oklch(0.89_0.008_260/0.55)]">
              {optimisticState.estimatedCost > 0 ? (optimisticState.estimatedCost - 500) / 120 : 10}
            </span>
          </div>
          <input
            type="range"
            name="doors"
            min="5"
            max="200"
            defaultValue="10"
            onChange={(e) => handleDoorsChange(Number(e.target.value))}
            className="w-full accent-[oklch(0.52_0.24_260)] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-[oklch(0.32_0.02_260)] mt-2">
            <span>5 Türen (Kleinbetrieb)</span>
            <span>200 Türen (Enterprise)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 grid-rows-subgrid">
          <div className="bg-[oklch(0.988_0.002_260)] p-4 rounded-xl border border-[oklch(0.89_0.008_260/0.55)]">
            <p className="text-xs text-[oklch(0.52_0.015_260)] mb-1 uppercase tracking-wider font-semibold">Investition (Ca.)</p>
            <p className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.estimatedCost.toLocaleString('de-DE')} €
            </p>
          </div>
          <div className="bg-[oklch(0.988_0.002_260)] p-4 rounded-xl border border-[oklch(0.89_0.008_260/0.55)]">
             <p className="text-xs text-[oklch(0.52_0.015_260)] mb-1 uppercase tracking-wider font-semibold">Einrichtungszeit</p>
             <p className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.setupTime}
            </p>
          </div>
          <div className="bg-[oklch(0.988_0.002_260)] p-4 rounded-xl border border-[oklch(0.89_0.008_260/0.55)]">
             <p className="text-xs text-[oklch(0.52_0.015_260)] mb-1 uppercase tracking-wider font-semibold">Amortisation (ROI)</p>
             <p className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              ~ {optimisticState.roiMonths} Monate
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-4 rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(0.52_0.24_260)]"
        >
          {isPending ? 'Verarbeite Anfragedaten...' : 'Detaillierte Analyse & Schließplan-Entwurf anfordern'}
        </button>
      </form>
    </div>
  );
}
