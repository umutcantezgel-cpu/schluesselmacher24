"use client";

import { useActionState, useOptimistic, startTransition } from "react";
import { calculateServiceBudget } from "@/actions/calculate-budget";

export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: { name: string; cost: number }[];
  tier: "BASIC" | "STANDARD" | "PREMIUM";
}

const initialState: BudgetCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: "STANDARD"
};

export function ServiceBudgetCalculator() {
  const [state, formAction, isPending] = useActionState(calculateServiceBudget, initialState);

  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleScopeChange(value: number) {
    startTransition(() => {
      setOptimisticTotal(value * 150);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Kostenrechner für Autoschlüssel</h3>
      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] mb-2 block">
            Leistungsart
          </label>
          <select
            name="keyType"
            className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            defaultValue="nachmachen"
            onChange={() => {
              // Trigger a basic recalculation for optimism if desired
            }}
          >
            <option value="kopieren">Mechanische Kopie</option>
            <option value="nachmachen">Schlüssel nachmachen (mit Anlernen)</option>
            <option value="programmieren">Programmierung (vorhandener Schlüssel)</option>
            <option value="smartkey">Smart Key / Keyless Go</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] block mb-2">Komplexitätsfaktor (Richtwert)</label>
          <input
            type="range"
            name="scopeDays"
            min="1"
            max="10"
            defaultValue="1"
            onChange={(e) => handleScopeChange(Number(e.target.value))}
            className="w-full accent-[oklch(0.52_0.24_260)]"
          />
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal > 0 ? `${optimisticTotal.toLocaleString('de-DE')} €` : "--- €"}
          </span>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Kalkuliere...' : 'Detaillierte Kosteneinschätzung berechnen'}
        </button>
      </form>
    </div>
  );
}
