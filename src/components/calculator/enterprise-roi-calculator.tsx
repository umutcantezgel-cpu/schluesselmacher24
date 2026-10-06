'use client';

import React, { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseROI } from '@/actions/calculate-roi';
import type { ROICalculationResult } from '@/actions/calculate-roi';

const initialState: ROICalculationResult = {
  estimatedROI: 0,
  timeSavingsHours: 0,
  financialImpact: 0
};

export function EnterpriseROICalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseROI, initialState);

  const [optimisticFinancialImpact, setOptimisticFinancialImpact] = useOptimistic(
    state.financialImpact,
    (current, update: number) => update
  );

  const [empVal, setEmpVal] = React.useState(50);
  const [timeVal, setTimeVal] = React.useState(10);
  const [rateVal, setRateVal] = React.useState(45);

  function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Very simple optimistic update for visual feedback
    const employees = Number(e.target.form?.employees.value || 50);
    const processTime = Number(e.target.form?.currentProcessTime.value || 10);
    const rate = Number(e.target.form?.averageHourlyRate.value || 45);

    const timeSavings = (processTime * 0.6) * employees * 52;
    const newImpact = timeSavings * rate;

    startTransition(() => {
      setOptimisticFinancialImpact(newImpact);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] motion-reduce:transition-none transition-all hover:shadow-[0_12px_32px_-4px_oklch(0.16_0.02_260/0.08)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Enterprise ROI- und Ladezeit-Kalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
        Berechnen Sie das finanzielle Einsparpotenzial durch optimierte digitale Prozesse und schnellere Ladezeiten in Ihrem Unternehmen.
      </p>

      <form action={formAction} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between">
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Mitarbeiterzahl</label>
              <span className="text-sm font-semibold text-[oklch(0.16_0.02_260)]" id="emp-val">{empVal}</span>
            </div>
            <input
              type="range"
              name="employees"
              min="10"
              max="500"
              defaultValue="50"
              onChange={(e) => {
                setEmpVal(Number(e.target.value));
                handleSliderChange(e);
              }}
              className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>

          <div>
             <div className="flex justify-between">
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Aktueller Prozessaufwand (Stunden/Woche pro Mitarbeiter)</label>
              <span className="text-sm font-semibold text-[oklch(0.16_0.02_260)]" id="time-val">{timeVal}</span>
            </div>
            <input
              type="range"
              name="currentProcessTime"
              min="1"
              max="40"
              defaultValue="10"
              onChange={(e) => {
                setTimeVal(Number(e.target.value));
                handleSliderChange(e);
              }}
              className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>

          <div>
             <div className="flex justify-between">
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Durchschnittlicher Stundensatz (€)</label>
              <span className="text-sm font-semibold text-[oklch(0.16_0.02_260)]" id="rate-val">{rateVal}</span>
            </div>
            <input
              type="range"
              name="averageHourlyRate"
              min="20"
              max="150"
              defaultValue="45"
              onChange={(e) => {
                setRateVal(Number(e.target.value));
                handleSliderChange(e);
              }}
              className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
            <span className="block text-xs text-[oklch(0.52_0.015_260)] uppercase tracking-wider">Geschätzter ROI</span>
            <span className="mt-1 block text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {state.estimatedROI > 0 ? `+${state.estimatedROI}%` : '---'}
            </span>
          </div>

          <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
            <span className="block text-xs text-[oklch(0.52_0.015_260)] uppercase tracking-wider">Finanzieller Impact / Jahr</span>
            <span className="mt-1 block text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticFinancialImpact > 0 ? `${Math.round(optimisticFinancialImpact).toLocaleString('de-DE')} €` : '---'}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Berechne exakten Report...' : 'Detaillierten ROI-Report generieren'}
        </button>
      </form>
    </div>
  );
}
