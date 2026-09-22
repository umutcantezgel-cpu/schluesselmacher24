'use client';
import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseRoi } from '@/lib/actions/calculate-enterprise-roi';

type RoiState = {
  doors: number;
  users: number;
  mechanicalCost: number;
  electronicCost: number;
  timeSavingsPerYear: number;
  roiMonths: number;
  calculatedAt: number;
};

const initialState: RoiState = {
  doors: 10,
  users: 20,
  mechanicalCost: 2000,
  electronicCost: 4700,
  timeSavingsPerYear: 500,
  roiMonths: 64.8,
  calculatedAt: 0
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current: RoiState, update: Partial<RoiState>) => ({ ...current, ...update })
  );

  function handleFormChange(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const doors = Number(formData.get('doors') || 10);
    const users = Number(formData.get('users') || 20);

    const mechanicalCost = (doors * 150) + (users * 25);
    const electronicCost = (doors * 450) + (users * 10);
    const timeSavingsPerYear = users * 0.5 * 50;
    const roiMonths = Math.round(((electronicCost - mechanicalCost) / (timeSavingsPerYear / 12)) * 10) / 10;

    startTransition(() => {
      setOptimisticState({
        doors,
        users,
        mechanicalCost,
        electronicCost,
        timeSavingsPerYear,
        roiMonths: isFinite(roiMonths) && roiMonths > 0 ? roiMonths : 0,
        calculatedAt: Date.now()
      });
    });

    if (!isPending) {
        e.currentTarget.requestSubmit();
    }
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Enterprise ROI- & Ladezeit-Kalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Berechnen Sie den ROI beim Wechsel von mechanischen zu elektronischen Schließanlagen unter Berücksichtigung von Verwaltungsaufwand und Schlüsselverlusten.</p>

      <form action={formAction} onChange={handleFormChange} className="mt-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl der Türen / Schließzylinder ({optimisticState.doors})</label>
              <input
                type="range"
                name="doors"
                min="5"
                max="200"
                defaultValue={optimisticState.doors}
                className="mt-4 w-full accent-[oklch(0.52_0.24_260)]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl der Nutzer / Mitarbeiter ({optimisticState.users})</label>
              <input
                type="range"
                name="users"
                min="5"
                max="500"
                defaultValue={optimisticState.users}
                className="mt-4 w-full accent-[oklch(0.52_0.24_260)]"
              />
            </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
            <div className="flex flex-col">
                <span className="text-xs text-[oklch(0.52_0.015_260)] uppercase tracking-wider">Investition Mechanik</span>
                <span className="text-xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">{optimisticState.mechanicalCost.toLocaleString('de-DE')} €</span>
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-[oklch(0.52_0.015_260)] uppercase tracking-wider">Investition Elektronik</span>
                <span className="text-xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">{optimisticState.electronicCost.toLocaleString('de-DE')} €</span>
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-[oklch(0.52_0.24_260)] font-bold uppercase tracking-wider">ROI erreicht in</span>
                <span className="text-2xl font-bold tracking-tight text-[oklch(0.52_0.24_260)]">{optimisticState.roiMonths} Monaten</span>
            </div>
        </div>

        <button
          type="submit"
          className="hidden"
          aria-hidden="true"
        >
          Berechnen
        </button>
      </form>
    </div>
  );
}
