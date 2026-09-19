'use client';

import { useActionState, useOptimistic, startTransition, useRef } from 'react';
import { calculateEnterpriseRoi } from '@/lib/actions/calculate-enterprise-roi';
import type { EnterpriseRoiResult } from '@/lib/actions/calculate-enterprise-roi';
import { TrendingDown, ShieldCheck, Euro } from 'lucide-react';

const initialState: EnterpriseRoiResult = {
  doors: 50,
  keys: 100,
  mechanicalCost: 9500,
  electronicCost: 24000,
  breakEvenMonths: 42,
  yearlySavings: 4200,
};

export function EnterpriseRoiCalculator() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);

  const [optimisticState, setOptimisticState] = useOptimistic<EnterpriseRoiResult, { doors: number, keys: number }>(
    state,
    (current, update) => {
        // Quick optimistic estimation logic for immediate UI feedback
        const doors = update.doors;
        const keys = update.keys;
        const mechBase = doors * 120 + keys * 35;
        const elecBase = doors * 450 + keys * 15;
        const mechYearly = 500 + 2 * (5 * 120 + 15 * 35);
        const elecYearly = 800 + 30;
        const savings = mechYearly - elecYearly;

        return {
            ...current,
            doors,
            keys,
            mechanicalCost: mechBase,
            electronicCost: elecBase,
            yearlySavings: savings,
            breakEvenMonths: savings > 0 ? Math.max(0, Math.ceil(((elecBase - mechBase) / savings) * 12)) : 999
        };
    }
  );

  function handleChange() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const doors = Number(formData.get('doors')) || 50;
    const keys = Number(formData.get('keys')) || 100;

    startTransition(() => {
      setOptimisticState({ doors, keys });
    });

    // Also trigger the real server action
    formRef.current.requestSubmit();
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] @container">
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Elektronik vs. Mechanik ROI-Kalkulator</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
          Ermitteln Sie den Break-Even-Point für eine elektronische Anlage auf Basis Ihrer Unternehmensgröße.
        </p>
      </div>

      <div className="grid gap-10 @3xl:grid-cols-2">
        <form ref={formRef} action={formAction} className="space-y-8">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl Türen (Schließstellen)</label>
              <span className="text-sm font-semibold text-[oklch(0.16_0.02_260)]">{optimisticState.doors}</span>
            </div>
            <input
              type="range"
              name="doors"
              min="10"
              max="500"
              step="10"
              value={optimisticState.doors}
              onChange={handleChange}
              className="w-full accent-[oklch(0.52_0.24_260)] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl Nutzer (Schlüssel/Transponder)</label>
              <span className="text-sm font-semibold text-[oklch(0.16_0.02_260)]">{optimisticState.keys}</span>
            </div>
            <input
              type="range"
              name="keys"
              min="20"
              max="2000"
              step="20"
              value={optimisticState.keys}
              onChange={handleChange}
              className="w-full accent-[oklch(0.52_0.24_260)] cursor-pointer"
            />
          </div>

          <noscript>
            <button
               type="submit"
               className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99]"
            >
               Kalkulieren
            </button>
          </noscript>
        </form>

        <div className="grid gap-4 grid-rows-subgrid row-span-3">
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-5 transition-opacity duration-300" style={{ opacity: isPending ? 0.7 : 1 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[oklch(0.968_0.004_260)] text-[oklch(0.52_0.24_260)]">
                 <Euro size={16} />
              </div>
              <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Jährliche Einsparung</span>
            </div>
            <div className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.yearlySavings.toLocaleString('de-DE')} €
            </div>
            <p className="mt-1 text-xs text-[oklch(0.52_0.015_260)]">
              Weniger Folgekosten bei Schlüsselverlust (inkl. Zylindertausch)
            </p>
          </div>

          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-5 transition-opacity duration-300" style={{ opacity: isPending ? 0.7 : 1 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[oklch(0.968_0.004_260)] text-[oklch(0.52_0.24_260)]">
                 <TrendingDown size={16} />
              </div>
              <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Amortisation (ROI)</span>
            </div>
            <div className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              ~{Math.ceil(optimisticState.breakEvenMonths / 12)} Jahre
            </div>
            <p className="mt-1 text-xs text-[oklch(0.52_0.015_260)]">
              In {optimisticState.breakEvenMonths} Monaten haben sich die Mehrkosten rentiert.
            </p>
          </div>

          <div className="rounded-xl bg-[oklch(0.52_0.24_260)/0.05] border border-[oklch(0.52_0.24_260)/0.2] p-5">
             <div className="flex items-start gap-3">
               <ShieldCheck className="mt-0.5 text-[oklch(0.52_0.24_260)]" size={18} />
               <div>
                 <p className="text-[13px] font-medium text-[oklch(0.16_0.02_260)]">Sicherheitsempfehlung</p>
                 <p className="mt-1 text-[13px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                   Ab {optimisticState.keys > 150 ? 'Ihrer Nutzeranzahl' : 'ca. 150 Nutzern'} ist ein elektronisches System fast immer wirtschaftlicher und deutlich sicherer.
                 </p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
