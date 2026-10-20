1. **Understand the Target Route:**
   - Review `src/app/(site)/sicherheitstechnik/page.tsx`.
   - The current word count is ~1400 words (including code). We need to increase the actual *content* word count substantially to exceed 800 *content* words.
   - It's part of the `sicherheitstechnik` area.
   - The existing layout uses a Swiss Light Mode style with specific grid structures (`Section`, `SectionHeading`).

2. **Expand the Content (> 800 words):**
   - We will write deep, authoritative content in German about security technology ("Sicherheitstechnik").
   - Topics:
     - Architectural methodology (Architektonische Methodik): How to approach building a secure environment systematically.
     - Structured performance tiers and comparison matrices (Leistungsstufen und Vergleichsmatrizen): Comparing different security levels (e.g., mechanical, electronic, hybrid).
     - Extensive FAQ section (mindestens 5 Fragen & Antworten): Addressing common questions about security concepts, maintenance, and specific solutions.
   - Strict hierarchical headings (only one `h1`, then `h2`, `h3`).

3. **Develop the Interactive Module (`sicherheitscheck-rechner`):**
   - Create `src/components/calculator/sicherheitscheck-rechner.tsx`.
   - Create the corresponding action `src/actions/calculate-sicherheitscheck.ts`.
   - The module will use React 19's `useActionState` and `useOptimistic`.
   - It will feature a sleek Swiss Light Mode design (OKLCH, 1px borders, smooth shadows) with a kinetic signature interaction (e.g., hover glow effect).
   - This calculator will help users estimate their security needs based on property size, current protection level, and desired features.

4. **Integrate the Module into the Route:**
   - Import and place the `SicherheitscheckRechner` in `src/app/(site)/sicherheitstechnik/page.tsx` within an appropriate `Section`.

5. **Ensure Swiss Light Mode Doctrine:**
   - Use only OKLCH variables for colors (e.g., `bg-[oklch(0.968_0.004_260)]`).
   - No `dark:` classes.
   - 1px hairline borders (`border-[oklch(0.890_0.008_260/0.55)]`).

6. **Local Gates & Verifications:**
   - `npx tsc --noEmit`
   - `npm run lint`
   - `npm run build`
   - Check the physical word count.

7. **Handoff Synthesis:**
   - Update `.jules/builder-handoff.json` with the achievement.
   - Update `.jules/backlog-top2.json` to mark `COMPLETED_BY_BUILDER`.
   - Update `README.md` and `llms.txt` with summaries of the newly added interactive modules (remember to use the `.jules` ledger sync memory).
   - Update `.jules/heartbeat.json` with telemetry.

8. **Complete pre-commit steps:**
   - Call `pre_commit_instructions` to get instructions for verification.

9. **Submit to `sentinel/auto`:**
   - Final `git push` via `request_code_review` or `submit`.
