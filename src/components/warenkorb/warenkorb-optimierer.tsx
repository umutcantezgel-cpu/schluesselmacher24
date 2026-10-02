'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { optimizeWarenkorb } from '@/actions/warenkorb-action';

type State = {
  optimizedTotal: number;
  savings: number;
  status: 'IDLE' | 'OPTIMIZED' | 'ERROR';
};

const initialState: State = {
  optimizedTotal: 0,
  savings: 0,
  status: 'IDLE',
};

export function WarenkorbOptimierer({ currentTotal = 150000 }: { currentTotal?: number }) {
  const [state, formAction, isPending] = useActionState(optimizeWarenkorb, initialState);
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, optimisticUpdate: State) => optimisticUpdate
  );



  return (
    <div className="mt-8 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Enterprise ROI & Bulk-Order Optimierung</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
        Nutzen Sie unseren algorithmischen Warenkorb-Optimierer für Geschäftskunden. Das System analysiert Ihre Positionen auf Volumenrabatte, konsolidiert Versandwege und berechnet die maximale Effizienz für Ihre Bestellung.
      </p>

      <form action={(formData) => {
          const val = Number(formData.get('currentTotal')) || 0;
          startTransition(() => {
            setOptimisticState({
              optimizedTotal: val * 0.85,
              savings: val * 0.15,
              status: 'OPTIMIZED',
            });
          });
          formAction(formData);
        }} className="mt-6">
        <div className="mb-4">
             <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Simuliertes Warenkorb-Volumen (in Cents)</label>
             <input
               type="number"
               name="currentTotal"
               defaultValue={currentTotal}
               className="mt-1 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] p-2"
             />
           </div>
        <div className="flex flex-col sm:flex-row items-end gap-4">
           <div className="flex-1 w-full flex items-baseline justify-between border-b border-[oklch(0.89_0.008_260/0.55)] pb-2">
               <span className="text-sm font-medium text-[oklch(0.52_0.015_260)]">Kalkuliertes Potenzial:</span>
               <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                 {optimisticState.status === 'OPTIMIZED' ? `-${(optimisticState.savings / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}` : 'Analyse ausstehend'}
               </span>
           </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto shrink-0 rounded-xl bg-[oklch(0.52_0.24_260)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
          >
            {isPending ? 'Analysiere...' : 'Warenkorb analysieren'}
          </button>
        </div>
      </form>
    </div>
  );
}
