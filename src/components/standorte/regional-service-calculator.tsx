'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateRegionalService, type RegionalCalculationResult } from '@/actions/calculate-regional-service';

const initialState: RegionalCalculationResult = {
  estimatedCost: 80,
  travelTime: 20,
  availability: 'HIGH'
};

export function RegionalServiceCalculator() {
  const [state, formAction, isPending] = useActionState(calculateRegionalService, initialState);
  const [optimisticCost, setOptimisticCost] = useOptimistic(
    state.estimatedCost,
    (current, update: number) => update
  );

  function handleDistanceChange(value: number) {
    startTransition(() => {
      setOptimisticCost(80 + value * 1.5);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] motion-reduce:transition-none">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Regionaler Anfahrts- & Kostenkalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Berechnen Sie die voraussichtlichen Anfahrtskosten und Verfügbarkeiten für Ihren Standort.</p>

      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] flex justify-between">
            <span>Entfernung zum nächsten Servicepunkt (km)</span>
          </label>
          <input
            type="range"
            name="distance"
            min="1"
            max="100"
            defaultValue="10"
            onChange={(e) => handleDistanceChange(Number(e.target.value))}
            className="w-full accent-[oklch(0.52_0.24_260)] mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Dringlichkeit</label>
          <select name="urgency" className="mt-2 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-3 py-2 text-[oklch(0.16_0.02_260)] text-sm focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]">
            <option value="scheduled">Geplanter Termin (Standard)</option>
            <option value="immediate">Notfall (Soforteinsatz)</option>
          </select>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert (inkl. Anfahrt):</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            ab {Math.round(optimisticCost).toLocaleString('de-DE')} €
          </span>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Geschätzte Anfahrtszeit:</span>
          <span className="text-md font-semibold text-[oklch(0.32_0.02_260)]">
            ~{state.travelTime} Minuten
          </span>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.99] disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          {isPending ? 'Kalkuliere...' : 'Detaillierte Kostenaufstellung berechnen'}
        </button>
      </form>
    </div>
  );
}
