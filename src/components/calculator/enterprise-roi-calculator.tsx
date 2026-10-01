'use client';

import { useActionState, useOptimistic, startTransition } from 'react';

// --- Inline Types ---
export type CalculatorTier = 'STANDARD' | 'ENTERPRISE' | 'HYBRID';

export interface BudgetCalculationResult {
  totalEstimate: number;
  timeSavedHours: number;
  tier: CalculatorTier;
}

// --- Inline Server Action ---
export async function calculateEnterpriseRoi(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulating Server Action delay for realism
  await new Promise((resolve) => setTimeout(resolve, 500));

  const doors = Number(formData.get('doors')) || 10;

  let tier: CalculatorTier = 'STANDARD';
  let costPerDoor = 350; // Base mechanical

  if (doors > 100) {
    tier = 'ENTERPRISE';
    costPerDoor = 650; // Cloud-based fully electronic
  } else if (doors > 30) {
    tier = 'HYBRID';
    costPerDoor = 450; // Mechatronic hybrid
  }

  const totalEstimate = doors * costPerDoor;

  // Calculate time saved in administration per year
  // A mechanical system requires manual key handovers and cylinder changes.
  // Electronic systems save significant time.
  const timeSavedHours = doors > 30 ? Math.floor(doors * 1.5) : Math.floor(doors * 0.5);

  return {
    totalEstimate,
    timeSavedHours,
    tier,
  };
}

// --- Client Component ---
const initialState: BudgetCalculationResult = {
  totalEstimate: 3500, // Default for 10 doors at 350
  timeSavedHours: 5,
  tier: 'STANDARD'
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, optimisticValue: Partial<BudgetCalculationResult>) => ({
      ...currentState,
      ...optimisticValue
    })
  );

  function handleDoorsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const doors = Number(e.target.value);

    // Optimistic calculation logic matching the server action
    let tier: CalculatorTier = 'STANDARD';
    let costPerDoor = 350;

    if (doors > 100) {
      tier = 'ENTERPRISE';
      costPerDoor = 650;
    } else if (doors > 30) {
      tier = 'HYBRID';
      costPerDoor = 450;
    }

    const optimisticTotal = doors * costPerDoor;
    const optimisticTimeSaved = doors > 30 ? Math.floor(doors * 1.5) : Math.floor(doors * 0.5);

    startTransition(() => {
      setOptimisticState({
        totalEstimate: optimisticTotal,
        timeSavedHours: optimisticTimeSaved,
        tier
      });
    });

    // Explicitly submit form on change to keep server state in sync
    e.currentTarget.form?.requestSubmit();
  }

  return (
    <div className="w-full rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] motion-reduce:transition-none">
      <header className="mb-8">
        <h3 className="text-2xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">
          Enterprise ROI & Ladezeit-Kalkulator
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
          Ermitteln Sie die initialen Investitionskosten und die administrativen Zeiteinsparungen
          einer modernen, skalierbaren Schließanlage für Ihr Gebäude.
        </p>
      </header>

      <form action={formAction} className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="doors" className="text-sm font-semibold text-[oklch(0.16_0.02_260)]">
              Anzahl der abzusichernden Türen
            </label>
            <span className="font-mono text-sm text-[oklch(0.52_0.24_260)]">
              {/* Fallback to read from input value if we wanted, but we rely on optimistic tier to infer */}
              {optimisticState.tier === 'ENTERPRISE' ? '> 100' : optimisticState.tier === 'HYBRID' ? '31 - 100' : '1 - 30'}
            </span>
          </div>
          <input
            id="doors"
            type="range"
            name="doors"
            min="5"
            max="250"
            defaultValue="10"
            onChange={handleDoorsChange}
            className="w-full accent-[oklch(0.52_0.24_260)] motion-reduce:transition-none"
            aria-label="Anzahl der abzusichernden Türen"
          />
          <div className="flex justify-between text-xs text-[oklch(0.32_0.02_260)]">
            <span>5 Türen</span>
            <span>250+ Türen</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.32_0.02_260)]">
              System-Level
            </p>
            <p className="mt-2 text-lg font-bold text-[oklch(0.16_0.02_260)]">
              {optimisticState.tier}
            </p>
            <p className="mt-1 text-[13px] text-[oklch(0.32_0.02_260)]">
              Empfohlene Architektur
            </p>
          </div>

          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.32_0.02_260)]">
              Zeitersparnis
            </p>
            <p className="mt-2 text-lg font-bold text-[oklch(0.52_0.24_260)]">
              ~{optimisticState.timeSavedHours} Std. / Jahr
            </p>
            <p className="mt-1 text-[13px] text-[oklch(0.32_0.02_260)]">
              Durch zentrale Verwaltung
            </p>
          </div>

          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-5 sm:col-span-2 md:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.32_0.02_260)]">
              Richtwert (Netto)
            </p>
            <p className="mt-2 text-xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.totalEstimate.toLocaleString('de-DE')} €
            </p>
            <p className="mt-1 text-[13px] text-[oklch(0.32_0.02_260)]">
              Inkl. Basis-Komponenten
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 motion-reduce:transition-none"
        >
          {isPending ? 'Kalkuliere in Echtzeit...' : 'Individuelles Angebot anfragen'}
        </button>
      </form>
    </div>
  );
}
