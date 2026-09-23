'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseRoi } from '@/actions/calculate-roi';
import type { RoiCalculationResult } from '@/types/roi-budget';

const initialState: RoiCalculationResult = {
  totalEstimate: 0,
  timeSaved: 0,
  roiFactor: 0,
  breakdown: [],
};

import { useState } from 'react';

export function EnterpriseRoiCalculator() {
  const [userCount, setUserCount] = useState(50);
  const [doorCount, setDoorCount] = useState(20);
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, update: { users: number; doors: number }) => {
      const totalEstimate = update.doors * 150 + update.users * 25;
      const timeSaved = update.users * 1.5;
      const roiFactor = ((timeSaved * 50) / totalEstimate) * 100;
      return {
        ...currentState,
        totalEstimate,
        timeSaved,
        roiFactor,
      };
    }
  );

  function handleChange(e: React.ChangeEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const users = Number((form.elements.namedItem('users') as HTMLInputElement)?.value || 50);
    const doors = Number((form.elements.namedItem('doors') as HTMLInputElement)?.value || 20);
    setUserCount(users);
    setDoorCount(doors);

    startTransition(() => {
      setOptimisticState({ users, doors });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] mb-12">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mb-2">Interaktiver Enterprise ROI-Kalkulator</h3>
      <p className="text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)] mb-6">
        Schätzen Sie schnell das Budget und den Return on Investment (ROI) für Ihre neue Schließanlage basierend auf der Unternehmensgröße.
      </p>

      <form action={formAction} onChange={handleChange} className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)] mb-3">
              <span>Anzahl der Nutzer/Mitarbeiter</span>
              <span className="font-bold text-[oklch(0.16_0.02_260)]">
                {userCount}
              </span>
            </label>
            <input
              type="range"
              name="users"
              min="10"
              max="500"
              defaultValue="50"
              className="w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>
          <div>
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)] mb-3">
              <span>Anzahl der Türen/Zylinder</span>
              <span className="font-bold text-[oklch(0.16_0.02_260)]">
                {doorCount}
              </span>
            </label>
            <input
              type="range"
              name="doors"
              min="5"
              max="200"
              defaultValue="20"
              className="w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>
        </div>

        <div className="grid grid-rows-subgrid gap-6 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 md:grid-cols-3">
          <div className="flex flex-col">
            <span className="text-sm text-[oklch(0.52_0.015_260)] mb-1">Geschätztes Budget</span>
            <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.totalEstimate > 0 ? `${optimisticState.totalEstimate.toLocaleString('de-DE')} €` : '---'}
            </span>
          </div>
          <div className="flex flex-col border-t border-[oklch(0.89_0.008_260/0.55)] pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6">
            <span className="text-sm text-[oklch(0.52_0.015_260)] mb-1">Zeitersparnis p.a.</span>
            <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.timeSaved > 0 ? `${Math.round(optimisticState.timeSaved)} Std.` : '---'}
            </span>
          </div>
          <div className="flex flex-col border-t border-[oklch(0.89_0.008_260/0.55)] pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6">
            <span className="text-sm text-[oklch(0.52_0.015_260)] mb-1">ROI (1 Jahr)</span>
            <span className="text-2xl font-bold tracking-tight text-[oklch(0.52_0.24_260)]">
              {optimisticState.roiFactor > 0 ? `+${Math.round(optimisticState.roiFactor)}%` : '---'}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 motion-reduce:transition-none"
          style={{ viewTransitionName: 'roi-calc-submit' }}
        >
          {isPending ? 'Kalkuliere exakte Werte...' : 'Detaillierte Analyse anfordern'}
        </button>
      </form>
    </div>
  );
}
