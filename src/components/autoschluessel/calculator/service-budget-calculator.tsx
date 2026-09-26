'use client';

import { useActionState, useOptimistic, startTransition, useState } from 'react';
import { calculateServiceBudget } from '@/actions/autoschluessel/calculate-budget';
import type { BudgetCalculationResult } from '@/types/budget';

const initialState: BudgetCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function ServiceBudgetCalculator() {
  const [state, formAction, isPending] = useActionState(calculateServiceBudget, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  const [serviceType, setServiceType] = useState('standard');
  const [brandGroup, setBrandGroup] = useState('standard');


  function handleChange(type: string, brand: string) {
      setServiceType(type);
      setBrandGroup(brand);

      let baseRate = 0;
      if (type === 'basic') baseRate = 60;
      else if (type === 'standard') baseRate = 180;
      else if (type === 'advanced') baseRate = 280;
      else if (type === 'premium') baseRate = 450;

      let brandMultiplier = 1.0;
      if (brand === 'premium') brandMultiplier = 1.3;
      if (brand === 'exotic') brandMultiplier = 2.0;

      startTransition(() => {
          setOptimisticTotal(Math.round(baseRate * brandMultiplier));
      });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Autoschlüssel-Preis-Kalkulator</h3>
      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Leistungsstufe</label>
          <select
            name="serviceType"
            value={serviceType}
            onChange={(e) => handleChange(e.target.value, brandGroup)}
            className="w-full mt-2 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-2.5 text-sm text-[oklch(0.16_0.02_260)]"
          >
            <option value="basic">Basic (Gehäuse/Batterie Reparatur)</option>
            <option value="standard">Standard (Zweitschlüssel)</option>
            <option value="advanced">Advanced (Smart Key)</option>
            <option value="premium">Premium (All Keys Lost)</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Fahrzeugklasse</label>
          <select
            name="brandGroup"
            value={brandGroup}
            onChange={(e) => handleChange(serviceType, e.target.value)}
            className="w-full mt-2 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-2.5 text-sm text-[oklch(0.16_0.02_260)]"
          >
            <option value="standard">Volumenhersteller (VW, Ford, Opel...)</option>
            <option value="premium">Premiumhersteller (Audi, BMW, Mercedes...)</option>
            <option value="exotic">Exoten / Luxusklasse</option>
          </select>
        </div>
        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Geschätzte Kosten:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            ab {optimisticTotal.toLocaleString('de-DE')} €
          </span>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Berechne...' : 'Aufschlüsselung anzeigen'}
        </button>
      </form>
    </div>
  );
}
