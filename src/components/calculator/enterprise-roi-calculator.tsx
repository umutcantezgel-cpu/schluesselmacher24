'use client';

import { useActionState, useOptimistic, startTransition, useState } from 'react';
import { calculateEnterpriseRoi } from '@/lib/actions/calculate-enterprise-roi';
import type { EnterpriseRoiState } from '@/lib/actions/calculate-enterprise-roi';

const initialState: EnterpriseRoiState = {
  doors: 50,
  employees: 100,
  turnoverRate: 10,
  maintenanceCostPerDoor: 45,
  estimatedMechanicalCost: 9500,
  estimatedMechatronicCost: 19500,
  roiYears: 3.5,
  annualSavings: 2800,
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);

  const [doors, setDoors] = useState(state.doors);
  const [employees, setEmployees] = useState(state.employees);

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: Partial<EnterpriseRoiState>) => ({ ...current, ...update })
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] transition-all hover:shadow-[0_12px_32px_-8px_oklch(0.16_0.02_260/0.12)]">
        <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">System-Parameter</h3>
        <form action={formAction} className="mt-8 space-y-8">
          <div>
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
              <span>Anzahl zu sichernder Türen</span>
              <span className="font-semibold">{optimisticState.doors}</span>
            </label>
            <input
              type="range"
              name="doors"
              min="10"
              max="500"
              step="10"
              value={doors}
              onChange={(e) => {
                setDoors(Number(e.target.value));
                startTransition(() => setOptimisticState({ doors: Number(e.target.value) }));
              }}
              className="mt-4 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>
          <div>
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
              <span>Anzahl Mitarbeiter / Nutzer</span>
              <span className="font-semibold">{optimisticState.employees}</span>
            </label>
            <input
              type="range"
              name="employees"
              min="20"
              max="1000"
              step="20"
              value={employees}
              onChange={(e) => {
                setEmployees(Number(e.target.value));
                startTransition(() => setOptimisticState({ employees: Number(e.target.value) }));
              }}
              className="mt-4 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Fluktuation p.a. (%)</label>
               <input type="number" name="turnoverRate" defaultValue={state.turnoverRate} className="mt-2 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] px-3 py-2 text-sm" />
             </div>
             <div>
               <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Wartungskosten/Tür (€)</label>
               <input type="number" name="maintenanceCostPerDoor" defaultValue={state.maintenanceCostPerDoor} className="mt-2 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] px-3 py-2 text-sm" />
             </div>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
          >
            {isPending ? 'Berechne ROI...' : 'Detaillierte Analyse generieren'}
          </button>
        </form>
      </div>

      <div className="grid grid-rows-[auto_auto_1fr] gap-6">
        <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
           <h4 className="text-sm font-medium text-[oklch(0.32_0.02_260)] uppercase tracking-wider">Erwarteter ROI</h4>
           <div className="mt-2 flex items-baseline gap-2">
             <span className="text-4xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
               {optimisticState.roiYears.toFixed(1)}
             </span>
             <span className="text-lg text-[oklch(0.32_0.02_260)]">Jahre</span>
           </div>
           <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Bis zur Amortisation der Mechatronik-Mehrkosten.</p>
        </div>
        <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
           <h4 className="text-sm font-medium text-[oklch(0.32_0.02_260)] uppercase tracking-wider">Jährliche Einsparung</h4>
           <div className="mt-2 flex items-baseline gap-2">
             <span className="text-4xl font-bold tracking-tight text-[oklch(0.52_0.24_260)]">
               {optimisticState.annualSavings.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
             </span>
           </div>
           <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Durch reduzierte Wartung und entfallende Zylindertausche.</p>
        </div>
      </div>
    </div>
  );
}
