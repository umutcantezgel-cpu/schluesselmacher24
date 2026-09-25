'use client';

import { useActionState, useOptimistic, startTransition, useState } from 'react';
import { calculateEnterpriseROI } from '@/actions/calculate-roi';
import type { ROICalculationResult } from '@/actions/calculate-roi';

const initialState: ROICalculationResult = {
  roiPercentage: 0,
  paybackMonths: 0,
  totalSavings: 0,
  efficiencyGain: 'Bereit',
};

export function EnterpriseROICalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseROI, initialState);

  const [optimisticState, setOptimisticState] = useOptimistic<ROICalculationResult, Partial<ROICalculationResult>>(
    state,
    (current, update) => ({ ...current, ...update })
  );

  const [doors, setDoors] = useState(50);
  const [users, setUsers] = useState(100);
  const [lifespan, setLifespan] = useState(15);

  function handleOptimisticUpdate() {
    startTransition(() => {
      // Rough optimistic estimation
      const estimateSavings = (doors * 15 + users * 4) * lifespan - (doors * 150 * 0.3);
      setOptimisticState({
        totalSavings: Math.max(0, Math.round(estimateSavings)),
        roiPercentage: estimateSavings > 0 ? 85 : 0,
        efficiencyGain: 'Kalkuliert...',
      });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] grid md:grid-cols-[1fr_1fr] gap-8">
      <div>
        <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Anlagen-Parameter</h3>
        <p className="text-sm text-[oklch(0.32_0.02_260)] mt-2 mb-6">Passen Sie die Werte an, um das Einsparpotenzial einer optimierten Sicherheitsarchitektur zu simulieren.</p>

        <form action={formAction} className="space-y-6" onChange={handleOptimisticUpdate}>
          <div>
            <div className="flex justify-between">
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Türen / Schließstellen</label>
              <span className="text-sm font-bold text-[oklch(0.16_0.02_260)]">{doors}</span>
            </div>
            <input
              type="range"
              name="doors"
              min="10"
              max="500"
              value={doors}
              onChange={(e) => setDoors(Number(e.target.value))}
              className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Nutzer / Schlüssel</label>
              <span className="text-sm font-bold text-[oklch(0.16_0.02_260)]">{users}</span>
            </div>
            <input
              type="range"
              name="users"
              min="10"
              max="1000"
              value={users}
              onChange={(e) => setUsers(Number(e.target.value))}
              className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Betrachtungszeitraum (Jahre)</label>
              <span className="text-sm font-bold text-[oklch(0.16_0.02_260)]">{lifespan}</span>
            </div>
            <input
              type="range"
              name="lifespan"
              min="5"
              max="30"
              value={lifespan}
              onChange={(e) => setLifespan(Number(e.target.value))}
              className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
          >
            {isPending ? 'Kalkuliere exakte Matrix...' : 'Detaillierte ROI-Berechnung anfordern'}
          </button>
        </form>
      </div>

      <div className="flex flex-col justify-center space-y-6 border-t md:border-t-0 md:border-l border-[oklch(0.89_0.008_260/0.55)] pt-6 md:pt-0 md:pl-8">
        <div>
          <span className="text-sm text-[oklch(0.52_0.015_260)] block">Geschätzte Ersparnis (TCO)</span>
          <span className="text-4xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] mt-1 block">
            {optimisticState.totalSavings.toLocaleString('de-DE')} €
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
            <span className="text-xs text-[oklch(0.52_0.015_260)] uppercase tracking-wider block">ROI Potential</span>
            <span className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-1 block">
              +{optimisticState.roiPercentage}%
            </span>
          </div>
          <div className="rounded-lg bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
            <span className="text-xs text-[oklch(0.52_0.015_260)] uppercase tracking-wider block">Effizienzgewinn</span>
            <span className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-1 block">
              {optimisticState.efficiencyGain}
            </span>
          </div>
        </div>

        {optimisticState.paybackMonths > 0 && (
          <div className="text-sm text-[oklch(0.32_0.02_260)] mt-4">
            Der Break-Even Point (Amortisation) ist nach ca. <span className="font-bold">{optimisticState.paybackMonths} Monaten</span> erreicht.
          </div>
        )}
      </div>
    </div>
  );
}
