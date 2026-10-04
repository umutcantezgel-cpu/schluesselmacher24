'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseRoi, type EnterpriseRoiState } from '@/lib/actions/calculate-roi';

const initialState: EnterpriseRoiState = {
  estimatedSavings: 0,
  amortizationMonths: 0,
  tier: 'BASIC'
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current: EnterpriseRoiState, update: Partial<EnterpriseRoiState>) => ({ ...current, ...update })
  );

  function handleDoorsChange(value: number) {
    startTransition(() => {
      setOptimisticState({
        estimatedSavings: value * 120 + 50 * 15,
        amortizationMonths: Math.max(1, Math.floor(5000 / (value * 120 + 50 * 15))),
        tier: value > 150 ? 'ENTERPRISE' : value > 50 ? 'PRO' : 'BASIC',
      });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] my-12 group transition-all duration-700 hover:shadow-[0_16px_48px_-8px_oklch(0.16_0.02_260/0.08)] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-[oklch(0.52_0.24_260/0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Enterprise ROI Kalkulator</h3>
      <p className="text-sm text-[oklch(0.32_0.02_260)] mt-2 mb-6">
        Berechnen Sie das Einsparpotenzial und die Amortisationsdauer einer zentralisierten Schließanlage für Ihre Einrichtung.
      </p>
      <form action={formAction} className="mt-6 space-y-8 relative z-10">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] flex justify-between">
            <span>Anzahl der Türen</span>
          </label>
          <input
            type="range"
            name="doors"
            min="5"
            max="300"
            defaultValue="10"
            onChange={(e) => handleDoorsChange(Number(e.target.value))}
            className="w-full mt-4 accent-[oklch(0.52_0.24_260)]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] flex justify-between">
            <span>Anzahl der Nutzer (Schlüssel/Transponder)</span>
          </label>
          <input
            type="number"
            name="users"
            min="5"
            max="2000"
            defaultValue="50"
            className="w-full mt-2 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-4 py-2 text-[oklch(0.16_0.02_260)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.52_0.24_260)]"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 gap-4">
          <div>
            <span className="block text-sm text-[oklch(0.52_0.015_260)]">Geschätzte jährliche Einsparung:</span>
            <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.estimatedSavings > 0 ? `${optimisticState.estimatedSavings.toLocaleString('de-DE')} €` : '—'}
            </span>
          </div>
          <div>
            <span className="block text-sm text-[oklch(0.52_0.015_260)]">Amortisationsdauer:</span>
            <span className="text-xl font-semibold tracking-tight text-[oklch(0.32_0.02_260)]">
              {optimisticState.amortizationMonths > 0 ? `ca. ${optimisticState.amortizationMonths} Monate` : '—'}
            </span>
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-4 text-sm font-semibold text-white shadow-[0_4px_12px_oklch(0.52_0.24_260/0.2)] transition-all hover:bg-[oklch(0.46_0.24_260)] hover:shadow-[0_6px_16px_oklch(0.52_0.24_260/0.3)] active:scale-[0.99] disabled:opacity-50 disabled:active:scale-100"
        >
          {isPending ? 'Kalkuliere detaillierten ROI...' : 'Vollständige ROI-Analyse anfordern'}
        </button>
      </form>
    </div>
  );
}
