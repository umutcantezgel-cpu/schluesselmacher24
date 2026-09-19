'use client';

import { useActionState, useOptimistic, startTransition, useState } from 'react';
import { calculateServiceBudget, type BudgetCalculationResult } from '@/lib/actions/calculate-budget';

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

  const [scopeDays, setScopeDays] = useState(15);
  const [doorCount, setDoorCount] = useState(1);
  const [securityLevel, setSecurityLevel] = useState('basic');

  function calculateOptimistic() {
    let baseRate = 150;
    if (securityLevel === 'high') baseRate = 220;
    if (securityLevel === 'maximum') baseRate = 350;

    const labor = scopeDays * baseRate;
    const hw = doorCount * (securityLevel === 'basic' ? 250 : securityLevel === 'high' ? 600 : 1200);
    return labor + hw;
  }

  function handleScopeChange(value: number) {
    setScopeDays(value);
    startTransition(() => {
      setOptimisticTotal(calculateOptimistic());
    });
  }

  function handleDoorChange(value: number) {
    setDoorCount(value);
    startTransition(() => {
      setOptimisticTotal(calculateOptimistic());
    });
  }

  function handleLevelChange(value: string) {
    setSecurityLevel(value);
    startTransition(() => {
      setOptimisticTotal(calculateOptimistic());
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="font-semibold tracking-tight text-[oklch(0.16_0.02_260)]" style={{ fontSize: 'clamp(1.25rem, 2vw + 1rem, 1.5rem)' }}>Projekt-Budget Kalkulator</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
        Ermitteln Sie sofort einen realistischen Preisrahmen für Ihre Schließanlage.
      </p>

      <form action={formAction} className="mt-6 space-y-8">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between">
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl Türen</label>
              <span className="text-sm font-semibold text-[oklch(0.16_0.02_260)]">{doorCount} Türen</span>
            </div>
            <input
              type="range"
              name="doorCount"
              min="1"
              max="50"
              value={doorCount}
              onChange={(e) => handleDoorChange(Number(e.target.value))}
              className="mt-3 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>

          <div>
             <div className="flex justify-between">
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Sicherheitsklasse</label>
            </div>
            <select
              name="securityLevel"
              value={securityLevel}
              onChange={(e) => handleLevelChange(e.target.value)}
              className="mt-2 w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-3 py-2 text-sm text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
            >
              <option value="basic">Grundschutz (mechanisch)</option>
              <option value="high">Erhöhter Schutz (mit Aufbohrschutz)</option>
              <option value="maximum">Hochsicherheit (VdS-zertifiziert)</option>
            </select>
          </div>

          <div>
             <div className="flex justify-between">
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Projektumfang (Beratung & Montage)</label>
              <span className="text-sm font-semibold text-[oklch(0.16_0.02_260)]">{scopeDays} Stunden</span>
            </div>
            <input
              type="range"
              name="scopeDays"
              min="2"
              max="100"
              value={scopeDays}
              onChange={(e) => handleScopeChange(Number(e.target.value))}
              className="mt-3 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Kalkulierter Richtwert:</span>
          <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal.toLocaleString('de-DE')} €
          </span>
        </div>

        {state.breakdown.length > 0 && !isPending && (
          <div className="rounded-lg bg-[oklch(0.988_0.002_260)] p-4 text-sm text-[oklch(0.32_0.02_260)] border border-[oklch(0.89_0.008_260/0.55)]">
            <p className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">Aufschlüsselung:</p>
            <ul className="space-y-1">
              {state.breakdown.map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>{item.label}</span>
                  <span>{item.cost.toLocaleString('de-DE')} €</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.99] disabled:opacity-50 motion-reduce:transition-none motion-reduce:transform-none"
        >
          {isPending ? 'Kalkuliere exaktes Budget...' : 'Detaillierte Kostenaufstellung anfordern'}
        </button>
      </form>
    </div>
  );
}
