'use client';

import { useActionState, useOptimistic, startTransition, useState } from 'react';
import { calculateServiceBudget } from '@/actions/calculate-budget';
import type { BudgetCalculationResult } from '@/types/budget';

const initialState: BudgetCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function ServiceBudgetCalculator() {
  const [state, formAction, isPending] = useActionState(calculateServiceBudget, initialState);

  // Local state for optimistic UI updates before submit
  const [doors, setDoors] = useState(10);
  const [keys, setKeys] = useState(20);
  const [systemType, setSystemType] = useState('mechanic');

  const optimisticTotalBase =
    (doors * (systemType === 'electronic' ? 350 : 150)) +
    (keys * (systemType === 'electronic' ? 45 : 25));

  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate || optimisticTotalBase,
    (current, update: number) => update
  );

  function updateEstimates(newDoors: number, newKeys: number, newType: string) {
    const calc = (newDoors * (newType === 'electronic' ? 350 : 150)) + (newKeys * (newType === 'electronic' ? 45 : 25));
    startTransition(() => {
      setOptimisticTotal(calc);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Interaktiver Budget-Kalkulator für Schließanlagen</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
        Ermitteln Sie mit wenigen Klicks einen ersten Richtwert für Ihre neue Schließanlage.
        Die Berechnung basiert auf Erfahrungswerten und dient zur ersten Orientierung.
      </p>

      <form action={formAction} className="mt-8 space-y-8">

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] mb-3 block">
              Anzahl der zu sichernden Türen: <span className="font-bold text-[oklch(0.16_0.02_260)]">{doors}</span>
            </label>
            <input
              type="range"
              name="doors"
              min="1"
              max="100"
              value={doors}
              onChange={(e) => {
                const val = Number(e.target.value);
                setDoors(val);
                updateEstimates(val, keys, systemType);
              }}
              className="w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] mb-3 block">
              Benötigte Schlüssel/Transponder: <span className="font-bold text-[oklch(0.16_0.02_260)]">{keys}</span>
            </label>
            <input
              type="range"
              name="keys"
              min="1"
              max="200"
              value={keys}
              onChange={(e) => {
                const val = Number(e.target.value);
                setKeys(val);
                updateEstimates(doors, val, systemType);
              }}
              className="w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] mb-3 block">Technologie der Schließanlage</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="systemType"
                value="mechanic"
                checked={systemType === 'mechanic'}
                onChange={(e) => {
                  setSystemType(e.target.value);
                  updateEstimates(doors, keys, e.target.value);
                }}
                className="accent-[oklch(0.52_0.24_260)]"
              />
              <span className="text-[14px] text-[oklch(0.16_0.02_260)]">Mechanisch (klassische Schlüssel)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="systemType"
                value="electronic"
                checked={systemType === 'electronic'}
                onChange={(e) => {
                  setSystemType(e.target.value);
                  updateEstimates(doors, keys, e.target.value);
                }}
                className="accent-[oklch(0.52_0.24_260)]"
              />
              <span className="text-[14px] text-[oklch(0.16_0.02_260)]">Elektronisch (Transponder/App)</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 gap-4">
          <div className="flex flex-col">
             <span className="text-sm text-[oklch(0.52_0.015_260)]">Geschätzter Richtwert (netto):</span>
             {state.breakdown.length > 0 && (
                <div className="mt-2 flex flex-col gap-1 text-[12px] text-[oklch(0.52_0.015_260)]">
                  {state.breakdown.map((item, idx) => (
                    <span key={idx}>- {item.item}: {item.cost.toLocaleString('de-DE')} €</span>
                  ))}
                </div>
             )}
          </div>
          <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            ab {optimisticTotal.toLocaleString('de-DE')} €
          </span>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-4 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Berechne detailliertes Angebot...' : 'Verbindliches Angebot anfordern'}
        </button>
      </form>
    </div>
  );
}
