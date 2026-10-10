'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { validateKeyCode } from '@/actions/validate-code';
import type { ValidationResult } from '@/actions/validate-code';

const initialState: ValidationResult = {
  isValid: false,
  message: '',
};

export function CodeValidatorInteractive() {
  const [state, formAction, isPending] = useActionState(validateKeyCode, initialState);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [optimisticCode, setOptimisticCode] = useOptimistic(
    '',
    (current, update: string) => update
  );

  function handleCodeChange(value: string) {
    startTransition(() => {
      setOptimisticCode(value);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Interaktive Schlüsselcode-Validierung</h3>
      <p className="mt-2 text-[15px] text-[oklch(0.32_0.02_260)] leading-relaxed">
        Prüfen Sie vorab unverbindlich das Format Ihres Schlüsselcodes. Unser System erkennt gängige
        Muster der großen Hersteller und gibt Ihnen direkte Rückmeldung zur Kompatibilität.
      </p>
      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Ihr Schlüsselcode (z.B. AB12345)</label>
          <input
            type="text"
            name="code"
            onChange={(e) => handleCodeChange(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-4 py-3 text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
            placeholder="Code hier eingeben..."
          />
        </div>

        {state.message && (
          <div className={`rounded-xl p-4 border ${state.isValid ? 'border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)]' : 'border-red-200 bg-red-50'}`}>
            <p className="text-[15px] font-medium text-[oklch(0.16_0.02_260)]">{state.message}</p>
            {state.manufacturer && (
              <ul className="mt-2 text-sm text-[oklch(0.32_0.02_260)] list-disc pl-5">
                <li>Hersteller: {state.manufacturer}</li>
                <li>Systemtyp: {state.keyType}</li>
              </ul>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Prüfe Format...' : 'Code-Format jetzt prüfen'}
        </button>
      </form>
    </div>
  );
}
