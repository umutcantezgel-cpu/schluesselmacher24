## Prüfbericht L0 · Machbarkeit

Geprüft gegen das Repo. `node_modules` fehlt, deshalb sind Paketquellen nicht lesbar und Verhalten wird aus dem Code geschlossen.

**BEFUNDE**

1. **hoch** · K-005, Planzeile 91 (`cn.ts`) · `src/lib/cn.ts` nutzt plain `twMerge` ohne Erweiterung. `package-lock.json:12485` nennt tailwind-merge 3.6.0. Unbekannte `text-<wort>`-Klassen werden als Textfarbe behandelt, daher verwirft `cn('text-caption', 'text-foreground-muted')` die Größe. Der Validator von 3.6.0 ist nicht lesbar (siehe offene Fragen). Vorschlag: `extendTailwindMerge` mit der Gruppe `font-size` für alle neun Größen. Alle übrigen neuen Tokens ebenfalls registrieren (`duration-*`, Kurven, `shadow-raised`, `z-header` usw., `min-h-touch`, `max-w-measure`). Sonst bleiben Paare wie `shadow-md shadow-raised` beide erhalten. Der Test sollte solche Paare prüfen, nicht nur `text-`.

2. **mittel** · K-008, Planzeile 118 (`vector-effect`) · `icon-base.tsx` setzt `strokeWidth={2}` am Wurzel-`<svg>`. `icons.test.tsx` verlangt genau ein `stroke-width=`, nur `currentColor` oder `none` als `stroke`, und verbietet `url(`, `<mask`, `gradient` und `id=`. Ein `vectorEffect`-Attribut bricht diese Asserts nicht. Aber `vector-effect` wird nicht vererbt, es muss auf jedem Kindelement stehen, etwa per CSS-Regel `.sm24-icon *`. Der Strich wird bei 24 px damit doppelt so kräftig. Masken aus Planzeile 94 sind in Fach-Icons verboten und nur für Generatoren denkbar. Ob `non-scaling-stroke` die `sm24-draw`-Animation mit `pathLength={1}` und `stroke-dasharray:1` stört, ist nur im Browser prüfbar.

3. **mittel** · `markiert`, Planzeilen 191 und 198 · `schliessplan.test.tsx` zählt `rx="2.5"` für Türen, `<text>` mit A–Z für Kürzel, und exakt fünf `class="sm24-draw stroke-area"` im Gleichschließungs-Test. Hervorhebung über zusätzliche Rechtecke, Pfade mit derselben Klasse oder Großbuchstaben-Texte verfälscht diese Zählungen. Vorschlag: Hervorhebung als Klasse oder Strichstärke am bestehenden Element, neue Testfälle für `markiert`, Zählungen nicht lockern. Der Generator ist in einer Client-Komponente importierbar: keine `server-only`-Abhängigkeit, nur ein Typ-Import aus `registry`. Die Aussage „Server-Komponente“ in `components/visual/README.md` ist dann anzupassen.

4. **mittel** · Neue Generatoren, Planzeile 168 · `registry.test.tsx` hat `NAMEN` als exakte Liste der fünf Generatoren, und `generatorDateien()` schließt nur `grafik-basis.tsx` aus. Jeder neue Generator muss in `NAMEN` und in `registry.tsx`. Jede Helferdatei in `generators/` bricht den Test. Vorschlag: Im Plan festhalten, dass `NAMEN` im selben Paket erweitert wird, und Helfer außerhalb von `generators/` ablegen.

5. **mittel** · Bildstellen, Planzeilen 132 und 188 · `image-placeholder.tsx` hat die Rangfolge bereits: `slot.bild`, dann `renderVisual(slot.visual)`, dann Platzhalter. Umzubauen ist also nur der Fall ohne `visual`. Keine Tests und keine Aufrufer prüfen „Bild folgt“ oder `aria-label` „Bildplatzhalter“. Die Komponente importiert `ImageOff` aus `lucide-react`, das muss im E5-Abbau (Zeile 216) ausdrücklich erfasst werden. Eine Testdatei fehlt.

6. **mittel** · FlowShell und Smooth-Scroll, Planzeilen 41, 105 und 183 · `flow-shell.tsx:60` animiert `transition-[width]`. Kein Test und kein Aufrufer bindet an `width`. Smooth-Scroll steht in `use-flow.ts:153`, dazu in `anfrage-formular.tsx:373` und `zutritt-konfigurator.tsx:675`. Letzteres ist ein Konfigurator, kein Formular, der Plantext „zwei Formulare“ ist also ungenau. `src/lib/flow/` hat keine Tests. `vitest.config.ts` läuft mit `environment: 'node'`, und jsdom oder Testing-Library fehlen in `package.json`, Hooks sind also nicht rendernd testbar. Vorschlag: reine Funktion `scrollVerhalten(reduziert)` exportieren und testen, `matchMedia('(prefers-reduced-motion: reduce)')` im Hook lesen. Die CSS-Regel in `globals.css:272-281` erfasst JavaScript nicht (Befund bestätigt). Für den Balken: `w-full`, `origin-left`, `transform: scaleX(p)`.

7. **niedrig** · MobileActionBar, Planzeilen 44 und 169 · `mobile-action-bar.tsx`: `pathname === item.href` ist exakt. Damit ist `/autoschluessel/marken/volkswagen/golf` für „Autoschlüssel“ nicht aktiv. Kein Test vorhanden. Vorschlag: reine Funktion `istAktiv(pathname, href)` mit `pathname === href || pathname.startsWith(href + '/')`, testbar in der Node-Umgebung.

8. **hoch** · Build-Pfade, Planzeilen 144–148 · `package.json` `build`: Die Bedingung `[ -n "$DATABASE_URL" ] || [ -z "$VERCEL" ]` führt lokal ohne `DATABASE_URL` `node scripts/db.mjs ensure` aus. `initialise()` ruft `initdb` per `spawnSync` auf und bricht bei Fehler mit Code 1 ab. Pfad 1 (`npm run build`) als root ist also ein erwartetes Rot und kein Gate. Pfad 2 gelingt nur mit lokaler URL auf Port 5433 und als Nicht-root. Eine externe URL überspringt `ensure` (`usesExternalDatabase`). Pfad 3 (`SM24_DATA=json npx next build`) ist machbar: `data/index.ts:22`, `richtwerte.ts:19`, `nachweise.ts:77`, `rate-limit.ts:63` und `integrations/index.ts:144` folgen derselben Bedingung, und `PayloadAdapter` wird nur bei Bedarf gebaut. Vorschlag: Pfad 1 als „erwartet rot unter root“ dokumentieren, Pfad 3 als Build-Gate nehmen.

9. **niedrig** · Next-16-Hinweise, Planzeile 130 · `next.config.ts` hat keine `experimental`-Einträge. `ViewTransition` taucht nirgends auf, weder in `src`, `docs`, `UMSETZUNG.md` noch `CLAUDE.md`. `react` ist fest auf 19.2.4 (`package-lock.json:11273`).

**Bestätigt ohne Abweichung:** `--header-height` ist nur definiert (`globals.css:73-74`) und ungenutzt. `page.tsx:301` enthält `rgba(var(--primary),0.15)`. 62 Dateien importieren `lucide-react`. Die neuen Token-Namen kollidieren mit keiner bestehenden Klasse.

**OFFENE FRAGEN**
- Genaues Verhalten von tailwind-merge 3.6.0 für `text-*`. Der Tarball fehlt im npm-Cache, daher ist vor L-01 ein `npm ci` nötig.
- Ist `ViewTransition` im stabilen `react@19.2.4` exportiert, oder nur über einen Next-Kanal? Nur Typprüfung und Next-Doku klären das. Falls nicht, Seitenwechsel streichen.
- Stört `non-scaling-stroke` das Dashing der Zeichen-Animation? Nur Browser-Test.
- Startet `next build` mit `SM24_DATA=json` die `(payload)`-Routen ohne Datenbank? Nicht ohne Lauf prüfbar.

=== ENDE E1-PRUEFER-L0-machbarkeit · BEREIT ZUR RÜCKGABE ===