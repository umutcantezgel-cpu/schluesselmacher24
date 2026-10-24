'use client';

import { useActionState, useOptimistic, startTransition } from 'react';

type BudgetCalculationResult = {
  totalEstimate: number;
  breakdown: unknown[];
  tier: string;
};

const initialState: BudgetCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

async function calculateSecurityBudget(state: BudgetCalculationResult, payload: FormData): Promise<BudgetCalculationResult> {
  const scopeDoors = Number(payload.get('scopeDoors')) || 0;
  const isElectronic = payload.get('isElectronic') === 'on';

  let basePrice = scopeDoors * 250; // Mechanisch ca. 250€ pro Tür
  if (isElectronic) {
      basePrice = scopeDoors * 650; // Elektronisch ca. 650€ pro Tür
  }

  return {
      ...state,
      totalEstimate: basePrice
  };
}

export function SicherheitsBudgetRechner() {
  const [state, formAction, isPending] = useActionState(calculateSecurityBudget, initialState);

  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleScopeChange(e: React.ChangeEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const scopeDoors = Number(formData.get('scopeDoors')) || 0;
    const isElectronic = formData.get('isElectronic') === 'on';

    let updateValue = scopeDoors * 250;
    if (isElectronic) {
        updateValue = scopeDoors * 650;
    }

    startTransition(() => {
      setOptimisticTotal(updateValue);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Sicherheits-Budget Kalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Kalkulieren Sie einen ersten Richtwert für Ihre Schließanlage.</p>

      <form action={formAction} onChange={handleScopeChange} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] flex justify-between">
            <span>Anzahl der Türen</span>
          </label>
          <input
            type="range"
            name="scopeDoors"
            min="1"
            max="20"
            defaultValue="3"
            className="w-full accent-[oklch(0.52_0.24_260)] mt-2"
          />
          <div className="flex justify-between text-xs text-[oklch(0.52_0.015_260)] mt-1">
             <span>1 Tür</span>
             <span>20 Türen</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <input
              type="checkbox"
              name="isElectronic"
              id="isElectronic"
              className="w-5 h-5 accent-[oklch(0.52_0.24_260)] rounded border-[oklch(0.89_0.008_260/0.55)]"
           />
           <label htmlFor="isElectronic" className="text-sm font-medium text-[oklch(0.32_0.02_260)] cursor-pointer">
              Elektronisches System (statt mechanisch)
           </label>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert (ab):</span>
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
