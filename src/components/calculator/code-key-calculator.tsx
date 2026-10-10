'use client';

import { useActionState, useOptimistic } from 'react';
import { validateCodeAction } from '@/actions/validate-code';

export function CodeKeyCalculator() {
  const [state, formAction, isPending] = useActionState(validateCodeAction, {
    success: false,
    message: '',
    calculatedPrice: 0,
  });

  const [optimisticPrice] = useOptimistic(
    state.calculatedPrice,
    (current, update: number) => update
  );

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Interaktive Code-Validierung & Preiskalkulation</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)] mb-6">
        Geben Sie Ihren Schlüsselcode ein, um die Machbarkeit sofort zu prüfen und den Preis in Echtzeit zu kalkulieren.
      </p>

      <form action={formAction} className="space-y-6">
        <div>
          <label htmlFor="code" className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Schlüsselcode / Schließungsnummer</label>
          <input
            type="text"
            id="code"
            name="code"
            placeholder="z.B. AB12345"
            className="mt-1 w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-4 py-2.5 text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)] transition-colors"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="quantity" className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Stückzahl</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              defaultValue="1"
              className="mt-1 w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-4 py-2.5 text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)] transition-colors"
            />
          </div>
          <div className="flex items-center space-x-3 pt-6">
            <input
              type="checkbox"
              id="hasSecurityCard"
              name="hasSecurityCard"
              className="h-5 w-5 rounded border-[oklch(0.89_0.008_260/0.55)] text-[oklch(0.52_0.24_260)] focus:ring-[oklch(0.52_0.24_260)]"
            />
            <label htmlFor="hasSecurityCard" className="text-sm font-medium text-[oklch(0.32_0.02_260)]">
              Sicherungskarte vorhanden
            </label>
          </div>
        </div>

        {state.message && (
          <div className={`rounded-lg p-4 text-sm ${state.success ? 'bg-[oklch(0.95_0.1_150)] text-[oklch(0.2_0.1_150)] border border-[oklch(0.85_0.1_150)]' : 'bg-[oklch(0.95_0.1_20)] text-[oklch(0.3_0.1_20)] border border-[oklch(0.85_0.1_20)]'}`}>
            {state.message}
          </div>
        )}

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Preis:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
          </span>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] motion-reduce:transition-none motion-reduce:active:scale-100 active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Prüfe & Kalkuliere...' : 'Jetzt validieren und Preis berechnen'}
        </button>
      </form>
    </div>
  );
}
