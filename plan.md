1. **Explore & Prepare Target Route:**
   - I will fetch `src/app/schliessanlagen/page.tsx` and analyze its content to ensure I can insert the required minimum of 850 words.
   - The goal is to deeply expand the content describing "Mechanische Schließanlagen", "Zentralschlossanlagen", "Hauptschlüsselanlagen", and "Generalhauptschlüsselanlagen" (as these match the scope), as well as provide a deeper FAQ.
2. **Create Interactive Module (Enterprise ROI Calculator):**
   - Create `src/components/calculator/enterprise-roi-calculator.tsx` (the required interactive component for `IDEA_051`).
   - Create the corresponding action `src/lib/actions/estimate-roi.ts` utilizing `useActionState` and `useOptimistic` (React 19 style).
   - Ensure it respects the Swiss Light Mode doctrine (OKLCH colors, 1px borders, smooth subgrid).
3. **In-place Content Expansion (Target > 850 Words):**
   - I will modify `src/app/schliessanlagen/page.tsx` to add > 850 words of highly professional, technically sound content (e.g. detailed architectural methodology, structural tiers, and an extensive minimum 5-question FAQ section).
   - I will inject the `<EnterpriseRoiCalculator />` component into the page.
4. **Compile & Verification (Phase 3 Gates):**
   - Run `npx tsc --noEmit`
   - Run `npm run lint`
   - Run `npx next build`
   - Ensure the modified word count satisfies > 850 words in `src/app/schliessanlagen/page.tsx`.
5. **Handoff Synthesis & Pre-Commit & Submit:**
   - Create the builder handoff JSON at `.jules/builder-handoff.json` and heartbeat at `.jules/heartbeat.json`.
   - Update `README.md` and `llms.txt`.
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
   - Run git commands to commit `feat(expansion): elevate schliessanlagen with 880w content and interactive Enterprise ROI Calculator`.
