'use client';

import { useActionState, useOptimistic, startTransition, useState } from 'react';
import { calculateSicherheit } from '@/actions/calculate-sicherheit';

export interface SicherheitCalculationResult {
  totalEstimate: number;
  breakdown: { name: string; value: number }[];
  tier: 'STANDARD' | 'PREMIUM';
}

const initialState: SicherheitCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function SicherheitRechner() {
  const [state, formAction, isPending] = useActionState(calculateSicherheit, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic<number, number>(
    state.totalEstimate,
    (current, update) => update
  );

  const [days, setDays] = useState(5);
  const [cameras, setCameras] = useState(0);

  function handleDaysChange(newDays: number) {
    setDays(newDays);
    startTransition(() => {
      setOptimisticTotal((newDays * 150) + (cameras * 450));
    });
  }

  function handleCamerasChange(newCameras: number) {
    setCameras(newCameras);
    startTransition(() => {
      setOptimisticTotal((days * 150) + (newCameras * 450));
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Sicherheitstechnik Budget Kalkulator</h3>
      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Projektumfang (Tage)</label>
          <input
            type="range"
            name="scopeDays"
            min="2"
            max="30"
            value={days}
            onChange={(e) => handleDaysChange(Number(e.target.value))}
            className="w-full accent-[oklch(0.52_0.24_260)]"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl Kameras</label>
          <input
            type="number"
            name="cameras"
            min="0"
            max="20"
            value={cameras}
            onChange={(e) => handleCamerasChange(Number(e.target.value))}
            className="w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] p-2"
          />
        </div>
        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal.toLocaleString('de-DE')} €
          </span>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Kalkuliere...' : 'Detaillierte Kostenaufstellung anfordern'}
        </button>
      </form>
    </div>
  );
}
