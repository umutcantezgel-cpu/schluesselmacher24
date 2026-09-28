1. **Initialize Phase 0:**
   - Fetch and checkout `sentinel/auto` (Already done).
   - Verify `src/app/(site)/autoschluessel/page.tsx` exists.
   - Record `$BUILDER_START_HEAD`.

2. **Phase 1: In-Place Content Expansion & Phase 2: Interactive Module Integration:**
   - Use a script to expand `src/app/(site)/autoschluessel/page.tsx` and inject the calculator.
   - The script reads the file, replaces the intro section under `{/* Einordnung */}` with a much longer > 800 word content block detailing car key architecture (transponders, keyless go, mechanical vs electronic), detailed comparison matrices.
   - It also modifies the `{/* Fragen */}` section to add more detailed FAQs using `AccordionItem`. (And imports it).
   - We create `src/actions/calculate-car-key.ts` using `cat << 'EOF' > ...`
   - We create `src/components/calculator/car-key-calculator.tsx` using `cat << 'EOF' > ...` (The module uses `useActionState` and `useOptimistic` as per React 19 standards).
   - The script will import `CarKeyCalculator` and insert it into `page.tsx` right after the "Einordnung" section.
   - Verify using `git diff src/app/\(site\)/autoschluessel/page.tsx`.

3. **Phase 3: Local Gates & Compile Verification:**
   - Run `npm ci && npm run test && npm run typecheck && npm run lint && DATABASE_URL= npx next build`.
   - Verify the word count of `page.tsx` using a small node script.

4. **Phase 4: Handoff Synthesis & Pre-Commit:**
   - Update telemetry `.jules/builder-handoff.json` and `.jules/heartbeat.json` using exact bash commands (unquoted heredocs for dynamic dates).
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
   - Stage changes (`git add`).
   - Commit and submit.
