'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSecurityAudit } from '@/actions/calculate-security-audit';

type SecurityAuditResult = {
  estimatedCost: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendations: string[];
};

const initialState: SecurityAuditResult = {
  estimatedCost: 0,
  riskLevel: 'LOW',
  recommendations: []
};

export function SecurityAuditCalculator() {
  const [state, formAction, isPending] = useActionState(calculateSecurityAudit, initialState);
  const [optimisticCost, setOptimisticCost] = useOptimistic(
    state.estimatedCost,
    (current, update: number) => update
  );

  function handleScopeChange(value: number) {
    startTransition(() => {
      // Rough frontend estimation for instant feedback
      setOptimisticCost(value * 250);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] motion-reduce:transition-none group hover:shadow-[0_12px_32px_-4px_oklch(0.16_0.02_260/0.08)] transition-all duration-300">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Sicherheits-Audit Kalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Berechnen Sie einen ersten Richtwert für Ihr Objekt-Audit.</p>

      <form action={formAction} className="mt-8 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Objektgröße & Zugänge (Komplexität)</label>
          <input
            type="range"
            name="complexity"
            min="1"
            max="10"
            defaultValue="3"
            onChange={(e) => handleScopeChange(Number(e.target.value))}
            className="w-full accent-[oklch(0.52_0.24_260)] mt-3"
          />
          <div className="flex justify-between mt-1 text-xs text-[oklch(0.52_0.015_260)]">
             <span>Wohnung (Einfach)</span>
             <span>Gewerbeobjekt (Komplex)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] block mb-2">Vorhandene Systeme</label>
              <select name="existingSystem" className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white px-3 py-2 text-sm text-[oklch(0.16_0.02_260)]">
                 <option value="none">Keine / Veraltet</option>
                 <option value="mechanical">Nur Mechanik</option>
                 <option value="electronic">Mechanik & Elektronik</option>
              </select>
           </div>
           <div>
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] block mb-2">Schutzziel</label>
              <select name="target" className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white px-3 py-2 text-sm text-[oklch(0.16_0.02_260)]">
                 <option value="basic">Grundschutz (RC2)</option>
                 <option value="advanced">Erweiterter Schutz (RC3+)</option>
                 <option value="high">Hochsicherheit</option>
              </select>
           </div>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 mt-6">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert (Audit):</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            ab {optimisticCost.toLocaleString('de-DE')} €
          </span>
        </div>

        {state.recommendations.length > 0 && (
           <div className="mt-6 p-4 rounded-lg bg-[oklch(0.988_0.002_260)] border border-[oklch(0.89_0.008_260/0.55)]">
              <h4 className="text-sm font-semibold text-[oklch(0.16_0.02_260)] mb-2">Erste Empfehlungen:</h4>
              <ul className="text-sm text-[oklch(0.32_0.02_260)] list-disc pl-4 space-y-1">
                 {state.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                 ))}
              </ul>
           </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.99] disabled:opacity-50 mt-4"
        >
          {isPending ? 'Analysiere Anforderungen...' : 'Detaillierte Analyse anfordern'}
        </button>
      </form>
    </div>
  );
}
