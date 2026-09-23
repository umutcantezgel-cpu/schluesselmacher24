'use client';

import { useActionState, useOptimistic, startTransition, useState } from 'react';
import { estimateRoiAction } from '@/lib/actions/estimate-roi';

type RoiState = {
  estimatedSavings: number;
  breakEvenMonths: number;
  maintenanceReduction: number;
};

const initialState: RoiState = {
  estimatedSavings: 0,
  breakEvenMonths: 0,
  maintenanceReduction: 0,
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(estimateRoiAction, initialState);
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: RoiState) => update
  );

  const [cylindersVal, setCylindersVal] = useState(50);
  const [turnoverVal, setTurnoverVal] = useState(5);

  function handleSliderChange(cylinders: number, turnover: number) {
    setCylindersVal(cylinders);
    setTurnoverVal(turnover);
    startTransition(() => {
      setOptimisticState({
        estimatedSavings: cylinders * 45 + turnover * 200,
        breakEvenMonths: Math.max(12, 60 - turnover * 2),
        maintenanceReduction: cylinders * 15,
      });
    });
  }

  return (
    <div className="rounded-3xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_32px_-4px_oklch(0.16_0.02_260/0.04)] motion-reduce:transition-none transition-all hover:shadow-[0_16px_48px_-8px_oklch(0.16_0.02_260/0.08)]">
      <h3 className="text-2xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">
        Enterprise ROI & Effizienz-Kalkulator
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
        Berechnen Sie das Einsparpotenzial durch reduzierte Verwaltungsaufwände und minimierte Schlüsselverlustrisiken.
      </p>

      <form action={formAction} className="mt-8 space-y-8">
        <div className="grid gap-8 md:grid-cols-2 md:grid-rows-subgrid">
          <div className="space-y-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[oklch(0.16_0.02_260)]">Anzahl der Schließstellen (Zylinder)</span>
              <input
                type="range"
                name="cylinders"
                min="10"
                max="500"
                step="10"
                value={cylindersVal}
                className="w-full accent-[oklch(0.52_0.24_260)]"
                onChange={(e) => handleSliderChange(Number(e.target.value), turnoverVal)}
              />
              <span className="text-xs text-[oklch(0.32_0.02_260)] text-right block" id="cylinders-val">{cylindersVal} Zylinder</span>
            </label>
          </div>
          <div className="space-y-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[oklch(0.16_0.02_260)]">Mitarbeiterfluktuation pro Jahr (%)</span>
              <input
                type="range"
                name="turnover"
                min="0"
                max="30"
                step="1"
                value={turnoverVal}
                className="w-full accent-[oklch(0.52_0.24_260)]"
                onChange={(e) => handleSliderChange(cylindersVal, Number(e.target.value))}
              />
              <span className="text-xs text-[oklch(0.32_0.02_260)] text-right block" id="turnover-val">{turnoverVal} %</span>
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 pt-6 border-t border-[oklch(0.89_0.008_260/0.55)]">
          <div className="rounded-2xl bg-white p-5 border border-[oklch(0.89_0.008_260/0.55)]">
            <div className="text-sm text-[oklch(0.52_0.015_260)]">Ersparnis (5 Jahre)</div>
            <div className="mt-1 text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.estimatedSavings.toLocaleString('de-DE')} €
            </div>
          </div>
          <div className="rounded-2xl bg-white p-5 border border-[oklch(0.89_0.008_260/0.55)]">
            <div className="text-sm text-[oklch(0.52_0.015_260)]">Wartungsreduktion</div>
            <div className="mt-1 text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.maintenanceReduction.toLocaleString('de-DE')} €
            </div>
          </div>
          <div className="rounded-2xl bg-[oklch(0.988_0.002_260)] p-5 border border-[oklch(0.89_0.008_260/0.55)]">
            <div className="text-sm text-[oklch(0.52_0.015_260)]">Amortisation in</div>
            <div className="mt-1 text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.breakEvenMonths} Mon.
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-4 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.99] disabled:opacity-50 motion-reduce:transition-none"
        >
          {isPending ? 'Kalkuliere detaillierten Report...' : 'Präzise ROI-Analyse anfordern'}
        </button>
      </form>
    </div>
  );
}
