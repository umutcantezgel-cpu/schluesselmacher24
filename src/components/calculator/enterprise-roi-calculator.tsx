'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateRoi } from '@/actions/calculate-roi';

const initialState = {
  roi: 0,
  breakEvenMonths: 0,
  timestamp: 0
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateRoi, initialState);
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, optimisticValue: { roi: number, breakEvenMonths: number }) => ({
      ...currentState,
      ...optimisticValue
    })
  );

  function handleCalculate(e: React.ChangeEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const investment = Number(formData.get('investment') || 0);
    const timeframe = Number(formData.get('timeframe') || 1);

    startTransition(() => {
      setOptimisticState({
        roi: investment * 1.5 * timeframe,
        breakEvenMonths: Math.max(1, Math.round(12 / ((investment * 1.5 * timeframe) / investment)))
      });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] hover:shadow-[0_16px_48px_-8px_oklch(0.52_0.24_260/0.2)] transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Enterprise ROI Rechner</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
        Kalkulieren Sie den Return on Investment (ROI) und die Amortisationszeit für Ihre Sicherheitsinvestition.
      </p>

      <form action={formAction} onChange={handleCalculate} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Geplantes Investment (€)</label>
          <input
            type="range"
            name="investment"
            min="5000"
            max="100000"
            step="1000"
            defaultValue="25000"
            className="w-full accent-[oklch(0.52_0.24_260)] mt-2"
          />
          <div className="flex justify-between text-xs text-[oklch(0.32_0.02_260)] mt-1">
            <span>5.000 €</span>
            <span>100.000 €</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Betrachtungszeitraum (Jahre)</label>
          <select
            name="timeframe"
            defaultValue="3"
            className="mt-2 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-white py-2 px-3 shadow-sm focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-[oklch(0.52_0.24_260)] sm:text-sm text-[oklch(0.16_0.02_260)]"
          >
            <option value="1">1 Jahr</option>
            <option value="3">3 Jahre</option>
            <option value="5">5 Jahre</option>
            <option value="10">10 Jahre</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <div>
            <span className="block text-sm text-[oklch(0.52_0.015_260)]">Erwarteter ROI:</span>
            <span className="block text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] mt-1">
              {optimisticState.roi.toLocaleString('de-DE')} €
            </span>
          </div>
          <div>
            <span className="block text-sm text-[oklch(0.52_0.015_260)]">Break-Even (Monate):</span>
            <span className="block text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] mt-1">
              {optimisticState.breakEvenMonths}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Kalkuliere...' : 'Detaillierten ROI-Report anfordern'}
        </button>
      </form>
    </div>
  );
}
