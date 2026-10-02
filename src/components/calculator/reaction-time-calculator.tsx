'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateReactionTime } from '@/lib/actions/reaction-time';

type CalculationResult = {
  timeEstimate: string;
  distance: string;
  status: 'SUCCESS' | 'IDLE' | 'ERROR';
  message?: string;
};

const initialState: CalculationResult = {
  timeEstimate: '',
  distance: '',
  status: 'IDLE',
};

export function ReactionTimeCalculator() {
  const [state, formAction, isPending] = useActionState(calculateReactionTime, initialState);
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: CalculationResult) => update
  );

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Reaktionszeit-Rechner</h3>
      <p className="mt-2 text-[14px] text-[oklch(0.32_0.02_260)] leading-relaxed">
        Geben Sie Ihre Postleitzahl ein, um eine erste, unverbindliche Schätzung der Anfahrtszeit und Entfernung zu erhalten.
      </p>
      <form
        action={(formData) => {
          startTransition(() => {
            setOptimisticState({
              timeEstimate: 'Berechne...',
              distance: 'Berechne...',
              status: 'IDLE'
            });
          });
          formAction(formData);
        }}
        className="mt-6 space-y-6"
      >
        <div>
          <label htmlFor="plz" className="text-sm font-medium text-[oklch(0.32_0.02_260)] block mb-1">
            Postleitzahl (PLZ)
          </label>
          <input
            type="text"
            id="plz"
            name="plz"
            pattern="[0-9]{5}"
            required
            maxLength={5}
            placeholder="z.B. 10115"
            className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-4 py-2.5 text-[15px] text-[oklch(0.16_0.02_260)] placeholder:text-[oklch(0.6_0.01_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)] transition-colors"
          />
        </div>

        {optimisticState.status === 'ERROR' && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-100">
             <p className="text-sm text-red-700">{optimisticState.message}</p>
          </div>
        )}

        {(optimisticState.status === 'SUCCESS' || optimisticState.timeEstimate === 'Berechne...') && (
           <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-5 space-y-4">
              <div className="flex items-baseline justify-between border-b border-[oklch(0.89_0.008_260/0.55)] pb-3">
                 <span className="text-sm font-medium text-[oklch(0.52_0.015_260)]">Geschätzte Anfahrtszeit:</span>
                 <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                   {optimisticState.timeEstimate}
                 </span>
              </div>
              <div className="flex items-baseline justify-between">
                 <span className="text-sm font-medium text-[oklch(0.52_0.015_260)]">Entfernung (Luftlinie):</span>
                 <span className="text-lg font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">
                   {optimisticState.distance}
                 </span>
              </div>
           </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Berechne...
            </>
          ) : 'Anfahrtszeit schätzen'}
        </button>
      </form>
    </div>
  );
}
