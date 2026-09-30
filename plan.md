1. **Sync and Setup**
   - Verify that `src/app/(site)/schluessel-nach-vorlage/anfrage/page.tsx` exists.
   - I will fetch `origin/main` and `git checkout -B sentinel/auto origin/main`. (I am currently already checked out on this branch).

2. **Phase 1: In-Place Content Expansion (> 800 Wörter)**
   - Expand `src/app/(site)/schluessel-nach-vorlage/anfrage/page.tsx` with >800 words of deeply technical, expert content.
   - Topics include the architectural methodology of key copying from templates, security considerations, and a comprehensive 5+ question FAQ.
   - Adhere to the strict heading hierarchy (`<h1>` handled by `PageHeader`, then `<h2>` and `<h3>`).
   - Use Swiss Light Mode doctrines: `bg-[oklch(0.988_0.002_260)]`, `text-[oklch(0.32_0.02_260)]` etc.
   - Update component to handle `params` and `searchParams` as Promises, to comply with Next.js 15/16 App Router.

3. **Phase 2: Interactive Module Creation**
   - Create `src/types/budget.ts` if needed, or put the type in the action. Let's create `src/types/roi.ts`.
   - Create the Server Action: `src/actions/calculate-roi.ts` to calculate ROI and wait time saved.
   - Create the Interactive component: `src/components/calculator/enterprise-roi-calculator.tsx`.
   - Ensure the component utilizes `useActionState`, `useOptimistic`, and `startTransition` correctly per React 19 standards.
   - Use `grid-template-rows: subgrid` and Container Queries if applicable.
   - Include a kinetic interaction with `@media (prefers-reduced-motion: reduce)` fallback.
   - Integrate `EnterpriseRoiCalculator` directly into `src/app/(site)/schluessel-nach-vorlage/anfrage/page.tsx`.

4. **Phase 3: Local Gates & Compile Verification**
   - Run `npx tsc --noEmit`.
   - Run `npm run lint`.
   - Run `npm run test` (to ensure we didn't break things).
   - Run `npx next build`.

5. **Phase 4: Handoff Synthesis**
   - Write/Update `.jules/builder-handoff.json` with achieved word count and added modules.
   - Update `.jules/backlog-top2.json` to mark `IDEA_063` as `COMPLETED_BY_BUILDER`.
   - Update `.jules/heartbeat.json` to record telemetry.
   - Verify creation/update of these state ledger files via `cat`.

6. **Version Control Setup**
   - Stage changes via `git add .jules/builder-handoff.json .jules/backlog-top2.json src/app/(site)/schluessel-nach-vorlage/anfrage/page.tsx src/components/calculator/enterprise-roi-calculator.tsx src/actions/calculate-roi.ts src/types/roi.ts`.
   - Commit the changes via: `git commit -m "feat(expansion): elevate [ROUTE_NAME] with 850w content and interactive EnterpriseRoiCalculator"`.
   - Simulate pushing to main: `echo "Simulating push to origin sentinel/auto"`.

7. **Pre-Commit Steps**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.

8. **Submit Changes**
   - Call the `submit` tool to finish the pipeline.
