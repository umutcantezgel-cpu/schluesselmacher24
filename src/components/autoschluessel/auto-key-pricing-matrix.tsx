'use client';

import { useActionState, useOptimistic, startTransition, useState } from 'react';
import { calculateKeyPrice, type KeyPriceCalculationResult } from '@/actions/calculate-key-price';

const initialState: KeyPriceCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function AutoKeyPricingMatrix() {
  const [state, formAction, isPending] = useActionState(calculateKeyPrice, initialState);
  const [brandGroup, setBrandGroup] = useState('STANDARD');
  const [keyType, setKeyType] = useState('REMOTE');

  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleEstimateChange(newBrand: string, newType: string) {
      let tempTotal = 0;
      if (newBrand === 'PREMIUM') tempTotal += 200;
      else if (newBrand === 'STANDARD') tempTotal += 130;
      else tempTotal += 80;

      if (newType === 'SMART_KEY') tempTotal += 160;
      else if (newType === 'REMOTE') tempTotal += 60;
      else tempTotal += 20;

      tempTotal += 35; // milling
      if (newType === 'MECHANICAL') tempTotal -= 100; // rough adjust

      startTransition(() => {
          setOptimisticTotal(Math.max(55, tempTotal)); // min 55
      });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Interaktive Preismatrix</h3>
      <form action={formAction} className="mt-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] mb-2 block">Fahrzeugklasse (Beispiele)</label>
              <select
                name="brandGroup"
                value={brandGroup}
                onChange={(e) => {
                    setBrandGroup(e.target.value);
                    handleEstimateChange(e.target.value, keyType);
                }}
                className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-4 py-2.5 text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
              >
                <option value="PREMIUM">Premium (Mercedes, BMW, Audi, Porsche)</option>
                <option value="STANDARD">Standard (VW, Ford, Opel, Toyota)</option>
                <option value="BUDGET">Budget (Dacia, Lada, ältere Modelle)</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] mb-2 block">Schlüsselart</label>
              <select
                name="keyType"
                value={keyType}
                onChange={(e) => {
                    setKeyType(e.target.value);
                    handleEstimateChange(brandGroup, e.target.value);
                }}
                className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-4 py-2.5 text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
              >
                <option value="MECHANICAL">Nur mechanisch (ohne Funk/Transponder)</option>
                <option value="REMOTE">Funkschlüssel (mit Fernbedienung & Wegfahrsperre)</option>
                <option value="SMART_KEY">Smart Key (Keyless Go, Keyless Entry)</option>
              </select>
            </div>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal > 0 ? `${optimisticTotal.toLocaleString('de-DE')} €` : '---'}
          </span>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.52_0.24_260)] focus-visible:ring-offset-2"
        >
          {isPending ? 'Kalkuliere exakt...' : 'Detaillierte Kostenaufstellung anfordern'}
        </button>

        {state.totalEstimate > 0 && !isPending && (
            <div className="mt-4 rounded-lg bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
                <h4 className="text-sm font-bold text-[oklch(0.16_0.02_260)] mb-3">Aufschlüsselung:</h4>
                <ul className="space-y-2">
                    {state.breakdown.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-sm text-[oklch(0.32_0.02_260)]">
                            <span>{item.label}</span>
                            <span>{item.amount} €</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}
      </form>
    </div>
  );
}
