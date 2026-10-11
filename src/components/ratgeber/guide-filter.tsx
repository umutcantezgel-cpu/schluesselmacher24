'use client';

import { useTransition, useRef, useState } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export function GuideFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const currentQuery = searchParams.get('query') || '';
  const currentCategory = searchParams.get('category') || 'all';

  const [optimisticQuery, setOptimisticQuery] = useState(currentQuery);
  const [optimisticCategory, setOptimisticCategory] = useState(currentCategory);

  function handleChange() {
    if (formRef.current) {
        const formData = new FormData(formRef.current);
        const query = formData.get('query')?.toString() || '';
        const category = formData.get('category')?.toString() || 'all';

        setOptimisticQuery(query);
        setOptimisticCategory(category);

        startTransition(() => {
            const params = new URLSearchParams();
            if (query) params.set('query', query);
            if (category !== 'all') params.set('category', category);

            router.push(`/ratgeber?${params.toString()}`);
        });
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      handleChange();
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] mb-12">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
           <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Ratgeber durchsuchen</h3>
           {isPending && <Loader2 className="animate-spin text-[oklch(0.52_0.24_260)]" size={20} />}
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4" onChange={handleChange}>
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-[oklch(0.32_0.02_260)]" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="query"
              id="query"
              className="block w-full rounded-xl border-0 py-3 pl-10 pr-3 text-[oklch(0.16_0.02_260)] ring-1 ring-inset ring-[oklch(0.89_0.008_260/0.55)] placeholder:text-[oklch(0.32_0.02_260)] focus:ring-2 focus:ring-inset focus:ring-[oklch(0.52_0.24_260)] sm:text-sm sm:leading-6 bg-[oklch(0.988_0.002_260)]"
              placeholder="Wonach suchen Sie?"
              value={optimisticQuery}
              onChange={(e) => setOptimisticQuery(e.target.value)}
            />
          </div>

          <div className="relative min-w-[200px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Filter className="h-5 w-5 text-[oklch(0.32_0.02_260)]" aria-hidden="true" />
            </div>
            <select
              id="category"
              name="category"
              className="block w-full rounded-xl border-0 py-3 pl-10 pr-10 text-[oklch(0.16_0.02_260)] ring-1 ring-inset ring-[oklch(0.89_0.008_260/0.55)] focus:ring-2 focus:ring-inset focus:ring-[oklch(0.52_0.24_260)] sm:text-sm sm:leading-6 bg-[oklch(0.988_0.002_260)] appearance-none"
              value={optimisticCategory}
              onChange={(e) => setOptimisticCategory(e.target.value)}
            >
              <option value="all">Alle Kategorien</option>
              <option value="schliessanlagen">Schließanlagen</option>
              <option value="elektronische-zutrittsloesungen">Elektronische Zutrittslösungen</option>
              <option value="tuer-und-schliesstechnik">Tür- und Schließtechnik</option>
              <option value="sicherheitstechnik">Sicherheitstechnik</option>
              <option value="autoschluessel">Autoschlüssel</option>
            </select>
          </div>

          <noscript>
              <button type="submit" className="rounded-xl bg-[oklch(0.52_0.24_260)] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[oklch(0.48_0.24_260)]">Suchen</button>
          </noscript>
        </form>
      </div>
    </div>
  );
}
