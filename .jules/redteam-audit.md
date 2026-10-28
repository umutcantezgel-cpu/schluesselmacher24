# RED-TEAM AUDIT
## SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- app/(site)/autoschluessel/page.tsx: Empty onClick handler found in some buttons.
- app/(site)/kasse/page.tsx: Missing loading state on form submission.

## HYDRATION MISMATCHES & SSR-KONFLIKTE
- app/(site)/page.tsx: Random number generation during SSR without useEffect guard.

## TYPESCRIPT-SCHWÄCHEN
- app/(site)/partner-werden/page.tsx: 'as unknown as Type' casting used instead of strict types.

## CORE WEB VITALS SÜNDEN
- app/(site)/schluessel-nach-code/page.tsx: Images missing explicit dimensions.

## SCHWEIZER LIGHT MODE MARKEN-DNA
- Found dirty gray hex colors in globals.css, must migrate to OKLCH.
