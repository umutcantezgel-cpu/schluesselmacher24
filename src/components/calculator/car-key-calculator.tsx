'use client';

import { useActionState, useOptimistic, startTransition, useState } from 'react';
import { calculateCarKeyBudget, type CarKeyCalculationResult } from '@/actions/calculate-car-key';

const initialState: CarKeyCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function CarKeyCalculator() {
  const [state, formAction, isPending] = useActionState(calculateCarKeyBudget, initialState);

  const [serviceType, setServiceType] = useState('kopieren');
  const [keyType, setKeyType] = useState('funk');

  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleServiceChange(val: string) {
    setServiceType(val);
    startTransition(() => {
      let base = 0;
      if (val === 'kopieren') base += 50;
      if (val === 'programmieren') base += 120;
      if (val === 'verloren') base += 250;
      if (keyType === 'funk') base += 80;
      if (keyType === 'smart') base += 150;
      if (keyType === 'mechanisch') base += 20;
      setOptimisticTotal(base);
    });
  }

  function handleKeyChange(val: string) {
    setKeyType(val);
    startTransition(() => {
      let base = 0;
      if (serviceType === 'kopieren') base += 50;
      if (serviceType === 'programmieren') base += 120;
      if (serviceType === 'verloren') base += 250;
      if (val === 'funk') base += 80;
      if (val === 'smart') base += 150;
      if (val === 'mechanisch') base += 20;
      setOptimisticTotal(base);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] my-12">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Kostenkalkulator für Autoschlüssel</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
        Berechnen Sie unverbindlich die voraussichtlichen Kosten für Ihren neuen Autoschlüssel.
      </p>
      <form action={formAction} className="mt-6 space-y-6">
        <input type="hidden" name="serviceType" value={serviceType} />
        <input type="hidden" name="keyType" value={keyType} />

        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Art der Dienstleistung</label>
          <select
            value={serviceType}
            onChange={(e) => handleServiceChange(e.target.value)}
            className="mt-2 block w-full rounded-md border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] text-[oklch(0.32_0.02_260)] shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
          >
            <option value="kopieren">Zweitschlüssel kopieren</option>
            <option value="programmieren">Neuen Schlüssel programmieren</option>
            <option value="verloren">Alle Schlüssel verloren (Neuanfertigung)</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Schlüsseltyp</label>
          <select
            value={keyType}
            onChange={(e) => handleKeyChange(e.target.value)}
            className="mt-2 block w-full rounded-md border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] text-[oklch(0.32_0.02_260)] shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
          >
            <option value="mechanisch">Mechanischer Schlüssel</option>
            <option value="funk">Funkschlüssel</option>
            <option value="smart">Smart Key / Keyless Go</option>
          </select>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            ab {optimisticTotal.toLocaleString('de-DE')} €
          </span>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Kalkuliere...' : 'Detaillierte Kostenaufstellung anfordern'}
        </button>
      </form>
    </div>
  );
}
