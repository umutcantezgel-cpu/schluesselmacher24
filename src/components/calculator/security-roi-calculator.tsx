'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSecurityBudget } from '@/actions/calculate-budget';
import type { SecurityBudgetResult, SecurityTier } from '@/actions/calculate-budget';

const initialState: SecurityBudgetResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'BASIC'
};

export function SecurityRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateSecurityBudget, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleOptimisticUpdate(formData: FormData) {
    const doors = Number(formData.get('doors') || 1);
    const windows = Number(formData.get('windows') || 0);
    const tier = (formData.get('tier') as SecurityTier) || 'BASIC';

    let dm = 150; let wm = 120; let bf = 200;
    if (tier === 'ENHANCED') { dm = 350; wm = 250; bf = 400; }
    if (tier === 'MAXIMUM') { dm = 800; wm = 500; bf = 900; }

    startTransition(() => {
      setOptimisticTotal(doors * dm + windows * wm + bf);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] my-12 relative overflow-hidden group motion-reduce:transition-none">
      {/* Kinetischer Glow Effekt */}
      <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-overlay motion-reduce:hidden"
           style={{ background: 'radial-gradient(600px circle at 50% 50%, oklch(0.52 0.24 260 / 0.1), transparent 40%)' }} />

      <h3 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight mb-2">Interaktiver Sicherheits-ROI & Budget-Kalkulator</h3>
      <p className="text-[oklch(0.32_0.02_260)] text-sm mb-8 leading-relaxed">
        Ermitteln Sie vorab eine realistische Budget-Indikation für Ihr Objekt. Verändern Sie die Parameter, um die Auswirkungen auf das Investitionsvolumen sofort zu sehen.
      </p>

      <form action={formAction} onChange={(e) => handleOptimisticUpdate(new FormData(e.currentTarget))} className="space-y-8 relative z-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)] mb-3">
                <span>Zu sichernde Türen</span>
              </label>
              <input
                type="range"
                name="doors"
                min="1"
                max="20"
                defaultValue="2"
                className="w-full accent-[oklch(0.52_0.24_260)] hover:accent-[oklch(0.48_0.24_260)] transition-all cursor-pointer h-2 bg-[oklch(0.89_0.008_260)] rounded-full appearance-none"
              />
              <div className="flex justify-between text-xs text-[oklch(0.52_0.015_260)] mt-2"><span>1 Tür</span><span>20 Türen</span></div>
            </div>

            <div>
              <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)] mb-3">
                <span>Zu sichernde Fenster (EG / Balkon)</span>
              </label>
              <input
                type="range"
                name="windows"
                min="0"
                max="30"
                defaultValue="4"
                className="w-full accent-[oklch(0.52_0.24_260)] hover:accent-[oklch(0.48_0.24_260)] transition-all cursor-pointer h-2 bg-[oklch(0.89_0.008_260)] rounded-full appearance-none"
              />
              <div className="flex justify-between text-xs text-[oklch(0.52_0.015_260)] mt-2"><span>0 Fenster</span><span>30 Fenster</span></div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] block mb-1">Sicherheits-Level</label>
            <div className="grid grid-rows-3 gap-3" style={{ gridTemplateRows: 'subgrid' }}>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-[oklch(0.89_0.008_260)] bg-[oklch(0.988_0.002_260)] cursor-pointer hover:border-[oklch(0.52_0.24_260)] transition-colors">
                <input type="radio" name="tier" value="BASIC" defaultChecked className="accent-[oklch(0.52_0.24_260)] w-4 h-4" />
                <span className="text-sm font-medium text-[oklch(0.16_0.02_260)]">Mechanischer Basisschutz (RC2-Niveau)</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-[oklch(0.89_0.008_260)] bg-[oklch(0.988_0.002_260)] cursor-pointer hover:border-[oklch(0.52_0.24_260)] transition-colors">
                <input type="radio" name="tier" value="ENHANCED" className="accent-[oklch(0.52_0.24_260)] w-4 h-4" />
                <span className="text-sm font-medium text-[oklch(0.16_0.02_260)]">Erweitert (Mech. + Elektr. Komponenten)</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-[oklch(0.89_0.008_260)] bg-[oklch(0.988_0.002_260)] cursor-pointer hover:border-[oklch(0.52_0.24_260)] transition-colors">
                <input type="radio" name="tier" value="MAXIMUM" className="accent-[oklch(0.52_0.24_260)] w-4 h-4" />
                <span className="text-sm font-medium text-[oklch(0.16_0.02_260)]">Maximal (Vernetzte Alarm- & Zutrittsanlage)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 mt-8 gap-4">
          <div className="flex-1 w-full">
            <span className="text-sm text-[oklch(0.52_0.015_260)] block mb-1">Kalkulierter Richtwert (Netto):</span>
            <span className="text-4xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] tabular-nums" style={{ viewTransitionName: 'budget-total' }}>
              {optimisticTotal > 0 ? optimisticTotal.toLocaleString('de-DE') : '—'} €
            </span>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto rounded-xl bg-[oklch(0.52_0.24_260)] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_4px_12px_oklch(0.52_0.24_260/0.2)] transition-all hover:bg-[oklch(0.48_0.24_260)] hover:shadow-[0_6px_16px_oklch(0.52_0.24_260/0.3)] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 whitespace-nowrap"
          >
            {isPending ? 'Berechne exakten Wert...' : 'Präzises Angebot anfordern'}
          </button>
        </div>
      </form>
    </div>
  );
}