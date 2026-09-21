'use client';

import { useActionState, useOptimistic, startTransition, useRef } from 'react';
import { calculateEnterpriseRoi } from '@/lib/actions/calculate-roi';
import type { RoiCalculationResult } from '@/lib/types/roi';
import { cn } from '@/lib/cn';

const initialState: RoiCalculationResult = {
  mechanicalCost: 3000,
  electronicCost: 4100,
  savingsYear1: -1100,
  savingsYear3: 500,
  breakEvenMonths: 24,
  recommendation: 'ELECTRONIC'
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, update: Partial<RoiCalculationResult>) => ({
      ...currentState,
      ...update,
    })
  );


  const debounceRef = useRef<NodeJS.Timeout>(null);

  const handleInputChange = () => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const doorCount = formData.has('doorCount') ? Number(formData.get('doorCount')) : 10;
      const employeeCount = formData.has('employeeCount') ? Number(formData.get('employeeCount')) : 20;
      const keyReplacements = formData.has('keyReplacementsPerYear') ? Number(formData.get('keyReplacementsPerYear')) : 2;

      // Approximate optimistic update logic for smooth UI
      const mechBase = doorCount * 120 + employeeCount * 15;
      const elecBase = doorCount * 350 + employeeCount * 5;
      const mechMaint = keyReplacements * 250;
      const elecMaint = keyReplacements * 25 + doorCount * 10;

      const mechCost = mechBase + mechMaint;
      const elecCost = elecBase + elecMaint;
      const mech3Y = mechBase + mechMaint * 3;
      const elec3Y = elecBase + elecMaint * 3;

      startTransition(() => {
        setOptimisticState({
          mechanicalCost: mechCost,
          electronicCost: elecCost,
          savingsYear1: mechCost - elecCost,
          savingsYear3: mech3Y - elec3Y,
          recommendation: (mech3Y - elec3Y) > 0 ? 'ELECTRONIC' : 'MECHANICAL'
        });

        // Debounce server request
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          formRef.current?.requestSubmit();
        }, 500);
      });
    }
  };
  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mb-2">Interaktiver Enterprise ROI- und Ladezeit-Kalkulator</h3>
      <p className="text-[14px] text-[oklch(0.32_0.02_260)] mb-8">
        Ermitteln Sie den Break-Even-Point zwischen mechanischen und elektronischen Schließanlagen basierend auf Ihrer Infrastruktur.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        <form ref={formRef} action={formAction} className="space-y-8" onChange={handleInputChange}>
          <div>
            <div className="flex justify-between mb-2">
              <label htmlFor="doorCount" className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl Türen (Schließstellen)</label>
              <span className="text-sm font-semibold text-[oklch(0.16_0.02_260)]" id="doorCountVal">10</span>
            </div>
            <input
              type="range"
              id="doorCount"
              name="doorCount"
              min="5"
              max="200"
              defaultValue="10"
              className="w-full accent-[oklch(0.52_0.24_260)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(0.52_0.24_260)]"
              onInput={(e) => {
                const el = document.getElementById('doorCountVal');
                if (el) el.innerText = e.currentTarget.value;
              }}
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label htmlFor="employeeCount" className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl Mitarbeiter (Nutzer)</label>
              <span className="text-sm font-semibold text-[oklch(0.16_0.02_260)]" id="empCountVal">20</span>
            </div>
            <input
              type="range"
              id="employeeCount"
              name="employeeCount"
              min="5"
              max="500"
              defaultValue="20"
              className="w-full accent-[oklch(0.52_0.24_260)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(0.52_0.24_260)]"
              onInput={(e) => {
                const el = document.getElementById('empCountVal');
                if (el) el.innerText = e.currentTarget.value;
              }}
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label htmlFor="keyReplacementsPerYear" className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Schlüsselverluste pro Jahr</label>
              <span className="text-sm font-semibold text-[oklch(0.16_0.02_260)]" id="keyRepVal">2</span>
            </div>
            <input
              type="range"
              id="keyReplacementsPerYear"
              name="keyReplacementsPerYear"
              min="0"
              max="20"
              defaultValue="2"
              className="w-full accent-[oklch(0.52_0.24_260)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(0.52_0.24_260)]"
              onInput={(e) => {
                const el = document.getElementById('keyRepVal');
                if (el) el.innerText = e.currentTarget.value;
              }}
            />
          </div>
        </form>

        <div className={cn(
          "flex flex-col justify-between rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 transition-opacity duration-300",
          isPending && "opacity-70"
        )}>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[oklch(0.32_0.02_260)]">ROI Analyse (3 Jahre)</h4>

            <div className="flex items-center justify-between border-b border-[oklch(0.89_0.008_260/0.55)] pb-3">
              <span className="text-sm text-[oklch(0.32_0.02_260)]">Kosten Mechanik:</span>
              <span className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">
                {optimisticState.mechanicalCost.toLocaleString('de-DE')} €
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[oklch(0.89_0.008_260/0.55)] pb-3">
              <span className="text-sm text-[oklch(0.32_0.02_260)]">Kosten Elektronik:</span>
              <span className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">
                {optimisticState.electronicCost.toLocaleString('de-DE')} €
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Ersparnis (3 Jahre):</span>
              <span className={cn(
                "text-2xl font-bold tracking-tight",
                optimisticState.savingsYear3 > 0 ? "text-[oklch(0.52_0.24_260)]" : "text-red-500"
              )}>
                {optimisticState.savingsYear3 > 0 ? '+' : ''}{optimisticState.savingsYear3.toLocaleString('de-DE')} €
              </span>
            </div>
          </div>

          <div className="mt-8 rounded-lg bg-[oklch(0.968_0.004_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
            <p className="text-xs uppercase font-bold tracking-wider text-[oklch(0.32_0.02_260)] mb-1">Empfehlung</p>
            <p className="text-sm font-semibold text-[oklch(0.16_0.02_260)]">
              {optimisticState.recommendation === 'ELECTRONIC' && `Elektronische Anlage empfohlen. Amortisiert sich ab ca. Monat ${optimisticState.breakEvenMonths || 24}.`}
              {optimisticState.recommendation === 'MECHANICAL' && 'Mechanische Anlage bei dieser Konstellation langfristig wirtschaftlicher.'}
              {optimisticState.recommendation === 'HYBRID' && 'Hybride Anlage: Außentüren elektronisch, Innentüren mechanisch absichern.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
