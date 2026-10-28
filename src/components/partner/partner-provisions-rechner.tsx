'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateProvision } from '@/actions/calculate-provision';
import type { ProvisionCalculationResult } from '@/types/provision';

const initialState: ProvisionCalculationResult = {
  auftraegeProMonat: 15,
  durchschnittlicherAuftragswert: 180,
  umsatz: 15 * 180,
  provisionProzent: 12,
  provisionBetrag: (15 * 180 * 12) / 100,
  nettoGewinn: (15 * 180) - ((15 * 180 * 12) / 100),
};

export function PartnerProvisionsRechner() {
  const [state, formAction, isPending] = useActionState(calculateProvision, initialState);
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: Partial<ProvisionCalculationResult>) => ({ ...current, ...update })
  );

  function handleChange(auftraege: number, wert: number) {
    startTransition(() => {
      const umsatz = auftraege * wert;
      let provisionProzent = 15;
      if (umsatz > 5000) provisionProzent = 10;
      else if (umsatz > 2000) provisionProzent = 12;

      const provisionBetrag = (umsatz * provisionProzent) / 100;

      setOptimisticState({
        auftraegeProMonat: auftraege,
        durchschnittlicherAuftragswert: wert,
        umsatz,
        provisionProzent,
        provisionBetrag,
        nettoGewinn: umsatz - provisionBetrag
      });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-title-sm font-semibold text-[oklch(0.16_0.02_260)]">Umsatz- & Provisions-Kalkulator</h3>
      <p className="mt-2 text-small text-[oklch(0.32_0.02_260)]">Simulieren Sie Ihr monatliches Potenzial als Partnerbetrieb.</p>

      <form action={formAction} className="mt-8 space-y-8">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Erwartete Aufträge pro Monat</label>
              <span className="text-sm font-semibold text-[oklch(0.16_0.02_260)]">{optimisticState.auftraegeProMonat} Aufträge</span>
            </div>
            <input
              type="range"
              name="auftraegeProMonat"
              min="1"
              max="100"
              value={optimisticState.auftraegeProMonat}
              onChange={(e) => handleChange(Number(e.target.value), optimisticState.durchschnittlicherAuftragswert)}
              className="w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Ø Auftragswert (brutto)</label>
              <span className="text-sm font-semibold text-[oklch(0.16_0.02_260)]">{optimisticState.durchschnittlicherAuftragswert} €</span>
            </div>
            <input
              type="range"
              name="durchschnittlicherAuftragswert"
              min="50"
              max="500"
              step="10"
              value={optimisticState.durchschnittlicherAuftragswert}
              onChange={(e) => handleChange(optimisticState.auftraegeProMonat, Number(e.target.value))}
              className="w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.3)]">
             <span className="block text-xs text-[oklch(0.52_0.015_260)]">Bruttoumsatz</span>
             <span className="mt-1 block text-lg font-semibold text-[oklch(0.16_0.02_260)]">{optimisticState.umsatz.toLocaleString('de-DE')} €</span>
          </div>
          <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.3)]">
             <span className="block text-xs text-[oklch(0.52_0.015_260)]">Provision ({optimisticState.provisionProzent}%)</span>
             <span className="mt-1 block text-lg font-semibold text-[oklch(0.16_0.02_260)]">- {optimisticState.provisionBetrag.toLocaleString('de-DE')} €</span>
          </div>
          <div className="col-span-2 rounded-xl bg-[oklch(0.968_0.004_260)] p-5 border border-[oklch(0.89_0.008_260/0.8)] shadow-sm">
             <span className="block text-sm text-[oklch(0.52_0.015_260)]">Verbleibender Monatsumsatz (vor eigenen Steuern)</span>
             <span className="mt-1 block text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
               {optimisticState.nettoGewinn.toLocaleString('de-DE')} €
             </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Berechne exakte Konditionen...' : 'Individuelles Angebot anfordern'}
        </button>
      </form>
    </div>
  );
}
