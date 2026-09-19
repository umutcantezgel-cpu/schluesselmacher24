1. **Fokussierung auf Vector 1 (SEO & Schema.org)**:
   - DOMAIN_VECTOR = epoch % 4 = 1.
2. **Aktualisierung von `src/components/seo/json-ld.tsx`**:
   - Integration von `import type { Graph } from 'schema-dts'`.
   - Umstellung der Funktionen auf `@graph`-Strukturen, die mit `satisfies Graph` typisiert sind.
   - Sicherstellen, dass Konstanten via `as const` getypt sind, um die strengen TypeScript-Vorgaben zu erfüllen.
3. **Überprüfung und Anpassung der Meta-Tags und Linktexte**:
   - Prüfung von Home (`src/app/page.tsx`), Ratgeber (`src/app/ratgeber/[slug]/page.tsx`), etc.
   - Sicherstellen, dass SEO-Metadaten korrekt gesetzt sind und keine generischen Linktexte ("mehr erfahren") existieren.
4. **Verifizierung & Rollback-Anker**:
   - Sicherstellen, dass TypeScript (`tsc --noEmit`), ESLint (`npm run lint`) und Next.js Build erfolgreich sind.
   - Wenn alles erfolgreich ist, wird der State-Ledger synchronisiert.
5. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**
6. **Commit & Push**:
   - Code absenden über den sentinel/auto Branch.
