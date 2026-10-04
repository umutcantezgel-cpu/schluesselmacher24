# RED-TEAM AUDIT (JC-PHILOSOPHER-REDTEAM-v1)

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
* **src/components/layout/header/CartDrawer.tsx (Beispiel)**: Einige Buttons für Mengen-Änderungen rufen möglicherweise nur Dummy-Funktionen auf (z.B. `onClick={() => console.log('update')}`), was zu einer frustrierenden User Experience führt.
* **src/components/forms/ContactForm.tsx (Beispiel)**: Das Formular zeigt bei langsamer Netzwerkverbindung keinen Ladezustand an. Nutzer könnten mehrfach klicken, was zu Mehrfach-Submissions führt.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
* **src/components/ui/ThemeToggle.tsx (Beispiel)**: Direkter Zugriff auf `localStorage` vor dem Client-Mounting kann zu Hydration-Fehlern zwischen SSR-Render (default Theme) und Client-Render (Nutzer-Theme) führen.
* **src/app/(site)/page.tsx**: Zufallsbasierte Hero-Images ohne Seed oder Server-Side-State verursachen visuelle Sprünge beim Hydrieren.

## 3. TYPESCRIPT-SCHWÄCHEN
* **src/lib/utils.ts**: Übermäßige Nutzung von `any` oder `unknown` in Helper-Funktionen maskiert potentielle Laufzeitfehler.
* **Schema.org JSON-LD**: Fehlen von strikten `schema-dts` Typisierungen in einigen SEO-Komponenten kann zu fehlerhaften Graphen führen.

## 4. CORE WEB VITALS SÜNDEN
* **Bilder**: Fehlende `width` und `height` Attribute in generischen `<img>` Tags verursachen Cumulative Layout Shift (CLS).
* **Bundle-Size**: Unnötiger Import von großen Bibliotheken in Client-Komponenten, die eigentlich auf dem Server ausgeführt werden könnten.

## 5. SCHWEIZER AESTHETIK-STANDARDS
* **Farben**: Inkonsistente Verwendung von Hex-Codes statt der geforderten OKLCH-Tokens.
* **Typografie**: Teilweise mangelnde Rhythmik und fehlendes Tracking bei großen Headlines.
