'use client';

import { useActionState, useOptimistic, startTransition, useState } from 'react';
import { analyzeCode } from '@/actions/analyze-code';
import type { CodeAnalysisResult } from '@/actions/analyze-code';

const initialState: CodeAnalysisResult = {
  valid: false,
  code: '',
  category: 'Unbekannt',
  details: ''
};

export function CodeAnalysisCalculator() {
  const [state, formAction, isPending] = useActionState(analyzeCode, initialState);
  const [inputValue, setInputValue] = useState('');

  // Use optimistic state to instantly show the category while the server action is pending
  const [optimisticCategory, setOptimisticCategory] = useOptimistic(
    state.category,
    (current, update: CodeAnalysisResult['category']) => update
  );

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value.toUpperCase());
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const code = formData.get('keyCode')?.toString().trim() ?? '';

    // Provide a quick optimistic update based on basic regex before the server responds
    let optimisticCat: CodeAnalysisResult['category'] = 'Unbekannt';
    if (/^\d{3,5}$/.test(code)) {
      optimisticCat = 'Low Security';
    } else if (/^[A-Z]{1,2}\d{3,5}$/.test(code)) {
      optimisticCat = 'Medium Security';
    } else if (/^[A-Z0-9]{6,}$/.test(code)) {
      optimisticCat = 'High Security';
    }

    startTransition(() => {
      setOptimisticCategory(optimisticCat);
      formAction(formData);
    });
    e.preventDefault();
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] transition-all motion-reduce:transition-none">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Code-Format Checker</h3>
      <form onSubmit={handleFormSubmit} className="mt-6 space-y-6">
        <div>
          <label htmlFor="keyCode" className="text-sm font-medium text-[oklch(0.32_0.02_260)] block mb-2">Schlüsselcode eingeben</label>
          <input
            id="keyCode"
            type="text"
            name="keyCode"
            placeholder="z.B. FH1234 oder 8532"
            value={inputValue}
            onChange={handleCodeChange}
            className="w-full rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-white px-4 py-3 text-[oklch(0.16_0.02_260)] shadow-sm focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)] font-mono uppercase"
          />
        </div>

        {(state.valid || isPending) && (
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-5">
             <div className="flex items-baseline justify-between mb-3 border-b border-[oklch(0.89_0.008_260/0.55)] pb-3">
               <span className="text-sm font-semibold text-[oklch(0.52_0.015_260)] uppercase tracking-wider">Erkannte Kategorie</span>
               <span className="text-lg font-bold tracking-tight text-[oklch(0.52_0.24_260)]">
                 {optimisticCategory}
               </span>
             </div>
             <p className="text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
               {isPending ? 'Kategorie wird berechnet...' : state.details}
             </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || inputValue.trim() === ''}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 motion-reduce:transition-none"
        >
          {isPending ? 'Analysiere Format...' : 'Format überprüfen'}
        </button>
      </form>
    </div>
  );
}
