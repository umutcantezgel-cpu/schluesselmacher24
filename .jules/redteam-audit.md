# Red-Team Audit Findings

## 1. Silent Logic Death
Found `onClick={() => {}}` in `src/components/ui/button.tsx`. Form submissions lack proper hydration states.

## 2. Hydration Mismatches
`window.innerWidth` used without `useEffect` in `src/components/flow/flow-shell.tsx`.

## 3. TypeScript Weaknesses
Missing satisfies constraint in `src/components/seo/json-ld.tsx`.

## 4. Core Web Vitals
Missing explicit aspect ratios in `src/components/ui/card.tsx` leading to layout shifts.
