'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { findCodeAction, type CodeResult } from '@/actions/find-code';

const initialState: CodeResult = {
  status: 'IDLE',
  message: ''
};

export function InteractiveCodeFinder() {
  const [state, formAction, isPending] = useActionState(findCodeAction, initialState);
  const [optimisticState, setOptimisticState] = useOptimistic<CodeResult, CodeResult>(
    state,
    (_, update) => update
  );

  function handleSubmit(formData: FormData) {
    const code = formData.get('code') as string;
    startTransition(() => {
      setOptimisticState({ status: 'SEARCHING', message: `Suche nach Code "${code}"...` });
    });
    formAction(formData);
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 md:p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] motion-reduce:transition-none">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Code-Machbarkeit prüfen</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
        Geben Sie Ihren Schlüsselcode ein, um in Echtzeit zu prüfen, ob wir ihn in unserer Datenbank haben.
      </p>

      <form action={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="code" className="sr-only">Schlüsselcode</label>
          <input
            type="text"
            id="code"
            name="code"
            placeholder="z.B. AB12345"
            required
            className="w-full rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-white px-4 py-3 text-[oklch(0.16_0.02_260)] placeholder:text-[oklch(0.65_0.01_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
          />
        </div>

        <button
          type="submit"
          disabled={isPending || optimisticState.status === 'SEARCHING'}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending || optimisticState.status === 'SEARCHING' ? 'Prüfe Datenbank...' : 'Jetzt prüfen'}
        </button>
      </form>

      {optimisticState.status !== 'IDLE' && (
        <div className={`mt-6 rounded-xl border p-4 text-sm ${
          optimisticState.status === 'FOUND'
            ? 'border-green-200 bg-green-50 text-green-800'
            : optimisticState.status === 'SEARCHING'
              ? 'border-blue-200 bg-blue-50 text-blue-800'
              : 'border-amber-200 bg-amber-50 text-amber-800'
        }`}>
          {optimisticState.status === 'FOUND' && (
             <svg className="mb-2 h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
             </svg>
          )}
          {optimisticState.status === 'NOT_FOUND' && (
             <svg className="mb-2 h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
          )}
          <p className="font-medium">{optimisticState.message}</p>
        </div>
      )}
    </div>
  );
}
