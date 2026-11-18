# FA-QA-04E · Fokus nach dem Schrittwechsel und Fortsetzen ohne Sprung (Bericht)

Stand: 18.11.2026 · Paket `pakete/FA-QA-04E.md` · Anforderung FA-26 · Befund FA-SEO-03C (Abnahme Punkt 4), A-076.

## Was sich für wen ändert
Wer mit Tastatur oder Vorlesegerät durch ein mehrschrittiges Formular geht, landet nach „Weiter“, „Zurück“, einem Schrittknopf, Browser-Zurück/-Vorwärts, einem übernommenen Vorschlag oder „Neu beginnen“ auf der Überschrift des neuen Schritts; der nächste Tab führt in den Schritt statt zurück in die Kopfzeile, und das Vorlesegerät sagt Titel und „Schritt x von y“ in einer Ansage. Für Maus- und Fingerbedienung, beim Laden und beim Fortsetzen eines Zwischenstands ändert sich sichtbar nichts (kein Ring, kein zusätzliches Rollen, kein Fokus beim Laden); Teil 2 (Sprung beim Fortsetzen) ist nicht umgesetzt, sondern als OFFENE FRAGE beschrieben.

## Teil 1: Umsetzung
- `src/lib/flow/use-flow.ts`: neuer Zähler `wechsel: { nr, historie }` im `FlowState`. Er zählt nur Schrittwechsel aus Bedienwegen: `goTo`/`next`/`back`/`updateAndGoTo` (nur wenn sich der Schritt wirklich ändert), den popstate-Hörer (Browser-Zurück/-Vorwärts und der eigene Zurück-Knopf über die Historie, `historie: true`) und `reset`. Laden und Wiederherstellen (Hydrieren über `useSyncExternalStore`) zählen nicht.
- `src/components/flow/flow-shell.tsx`:
  - Ein Effekt setzt bei neuem Zähler den Fokus auf `h2[data-schritt-titel]` (`tabIndex={-1}`, `focus({ preventScroll: true })`; das Rollen bleibt bei `zumSchrittScrollen`).
  - Schutz vor Sprüngen ohne Bedienung: Ein Wechsel über `goTo` zählt nur, wenn seit dem letzten Wechsel im Ablauf geklickt oder eine Taste gedrückt wurde (`onClickCapture`/`onKeyDownCapture` am Rahmen). So nimmt etwa der Schließplan-Planer, der beim Laden mit einem Plan aus dem Link selbst auf „Türen“ springt (`schliessplan-planer.tsx`, Effekt), niemandem den Fokus. Browser-Historie gilt immer als Bedienung.
  - Bleibt der Schritt stehen (gesperrtes „Weiter“, `goTo` auf den aktuellen Schritt, Fehlermeldung beim Absenden ohne Sprung), zählt nichts; der Fokus bleibt.
  - Vorlesegeräte: Die Zeile „Schritt x von y · Name“ war `aria-live="polite"`; mit dem Fokus auf der Überschrift hätte sie zusätzlich gesprochen (zwei Ansagen). Jetzt verweist die Überschrift mit `aria-describedby` auf diese Zeile, die keine Live-Region mehr ist: eine Ansage „Titel, Überschrift Ebene 2, Schritt x von y · Name“. Sichtbare Texte unverändert; `aria-valuetext` des Fortschrittsbalkens unverändert.
- `src/app/(site)/globals.css`: eine Regel `[data-schritt-titel]:focus:not(:focus-visible) { outline: none; }`. Der Ring bei Tastatur kommt aus der bestehenden `:focus-visible`-Regel (Tokens `ring-ring`, `ring-offset-background`).
- Tests: `src/components/flow/flow-shell-fokus.test.tsx` (neu, 8 Fälle, führt das Verhalten in einem DOM aus: happy-dom, `react-dom/client`, Hydrieren mit `hydrateRoot`): kein Fokus beim ersten Render; „Weiter“ → Überschrift; „Zurück“ und Sprung aus dem Schritt → Überschrift; Schrittknopf → Überschrift; gleicher Schritt → Fokus bleibt; Sprung ohne Bedienung → fremder Fokus bleibt; Wiederherstellen beim Hydrieren → Schritt springt, Fokus nicht; „Neu beginnen“ → Überschrift von Schritt 1. `flow-shell.test.tsx` an `aria-describedby` statt `aria-live` angepasst (zwei Erwartungen). happy-dom ist über vitest bereits installiert (`node_modules/happy-dom` 20.14.6), keine neue Abhängigkeit in `package.json`; die Datei wählt die Umgebung per Kopfkommentar.

Eingebettete Abläufe und Abschluss: kein Sonderweg. Der Abschluss (Absenden, Bestätigung, Kasse) löst keinen Schrittwechsel aus und ist unverändert. Eingebettete Abläufe bekommen denselben Fokus; vorher fiel er dort auf `body` (Beleg unten).

### Abläufe: fokussiertes Element nach jedem Wechsel (vorher Port 3200, nachher Port 3000; nur Tastatur: Tab bis zum Knopf, Enter)
Protokolle: `protokolle/FA-QA-04E/fokus-3200.json` (vorher), `fokus-3000.json` (nachher); Skript `fokus-probe.mjs`. Gleiche Ergebnisse bei 412 und 1280 px, sofern nicht anders genannt.

| Ablauf | Wechsel | vorher: Fokus · nächster Tab | nachher: Fokus · nächster Tab |
|---|---|---|---|
| Autoschlüssel-Assistent | Weiter 1→2 … 6→7 (6×) | Knopf „Weiter“ · 412: Kopfzeile/Seite (Link „Bereich Autoschlüssel“), 1280: Schrittliste („Fahrzeug“); bis zum nächsten „Weiter“ 55–67 Tabs | `h2` des neuen Schritts · erstes Feld oder Knopf im Schritt; bis „Weiter“ 4–9 Tabs |
| Autoschlüssel-Assistent | Weiter 7→8 (Fotos) | `body` | `h2` „Fotos Ihres Schlüssels“ · Telefonlink im Schritt |
| Autoschlüssel-Assistent | Zurück 8→7 … 2→1 (7×) | Knopf „Zurück“, auf Schritt 1 `body` · nächster Tab „Weiter“ in der Leiste | `h2` des neuen Schritts · Feld/Knopf im Schritt |
| Konfigurator gleichschließende Zylinder | Zurück 3→2, 2→1 | „Zurück“, dann `body` | `h2` · Link im Schritt |
| Partner-Bewerbung | Zurück 3→2, 2→1 | „Zurück“, dann `body` · nächster Tab außerhalb des Formulars | `h2` · Eingabefeld im Schritt |
| Fahrzeug-Anfrage E-Scooter | Zurück 3→2, 2→1 | „Zurück“, dann `body` · Telefonlink der Seite | `h2` · Eingabefeld im Schritt |
| Kontakt (eingebettet) | Zurück 3→2, 2→1 | „Zurück“ (außer Bild), dann `body` | `h2`, im Bild bei 412 und 1280 (seit der Nachbesserung, siehe unten) |
| Beratung | Zurück 3→2, 2→1 | „Zurück“, dann `body` | `h2`, im Bild bei 412 und 1280 (wie Kontakt) |

Weitere Belege (nachher):
- Ring: nach Tastatur `:focus-visible` an der Überschrift wahr (alle Wechsel). Nach Mausklick (1280) und Fingertipp (412) auf „Weiter“: Fokus auf `h2`, `:focus-visible` falsch, `outline: none`, `box-shadow: none`.
- Telefon (412) nach Fingertipp „Weiter“: Überschrift bei y = 136–160 px, unter Kopf (65) und Fortschrittsband (126), im Bild (823). Unverändert gegenüber vorher (gleiche Lage).
- Baum der Zugänglichkeit: `- heading "Fotos Ihres Schlüssels" [level=2]`, Beschreibung „Schritt 2 von 5 · Unterlagen hochladen“; Partner: `- heading "Region und Einsatzgebiet" [level=2]`, „Schritt 2 von 7 · Region“.
- Laden ohne Zwischenstand (412, 1280): Fokus `body`, nicht im Formular; Layoutverschiebung 0 (`quellen-3000-nachher.json`).
- Fortsetzen mit Zwischenstand auf Schritt 8: Schritt „Fotos Ihres Schlüssels“, Fokus `body` (vorher wie nachher), Verschiebung unverändert (Teil 2).
- Server-HTML des Assistenten: Unterschied nur in drei Attributen (`tabindex="-1"`, `aria-describedby` an der `h2`, `id` statt `aria-live` am Band), 313 456 → 313 631 Byte.

## Teil 2: Fortsetzen ohne Sprung — Ursache, Messung, OFFENE FRAGE (nichts geändert)
Skript `protokolle/FA-QA-04E/verschiebung-quellen.mjs` (nach Vorlage FA-SEO-03C Teil B, mit Quellen der Verschiebung und größtem Element); Protokolle `quellen-3200-vorher.json`, `quellen-3000-nachher.json` (gleiche Werte).

| Lauf | Schritt | Verschiebung | Quellen |
|---|---|---|---|
| ohne Zwischenstand, 412 / 1280 | 1 | 0 / 0 | – |
| mit Zwischenstand Schritt 8, 412 | 8 | 0,1305 (Chromium meldet `hadRecentInput`, zählt sie in dieser Emulation mit Touch also nicht; FA-SEO-03C zählte sie) | Rasterhülle des Ablaufs (`lg:mt-6 lg:grid`), y 360 → 353, Höhe 463 → 470 |
| mit Zwischenstand Schritt 8, 1280 | 8 | 0,0884 | Hülle des Schritts (`-mx-5 overflow-x-clip`) y 463 → 606 (Hinweis „Zwischenstand … geladen“ schiebt sich davor); Etappenliste der Seite (Einträge 2–5 erscheinen bzw. rücken nach unten, weil sich die Teilschritte der aktuellen Etappe öffnen) |

Ursache: Die Seite ist statisch vorgerendert. Der Server kennt den Zwischenstand im Browserspeicher nicht und liefert Schritt 1; das wird gemalt (größtes Element bei ~200 ms ist der Hinweistext von Schritt 1). Nach dem Hydrieren liest `useStoredValue` (`useSyncExternalStore`) den Stand und React rendert Schritt 8 samt Hinweis „Zwischenstand geladen“. Bestehende Hüllen (Schrittbereich, Etappenliste, Raster) bleiben dabei Knoten im DOM und rücken; das misst die Layoutverschiebung. Bei einer Navigation innerhalb der Seite (ohne Server-HTML) gibt es den Sprung nicht, nur beim direkten Aufruf oder Neuladen.

Warum keine Umsetzung: Jede Lösung, die das Malen von Schritt 1 für Fortsetzende vermeidet, braucht vor dem Hydrieren ein Wissen über den Zwischenstand. Das gibt es nur über ein eingebettetes Skript (verboten, Sicherheitskopfzeilen) oder über den Server (Cookie, siehe Weg B), was die Seite für alle ändert. Ein Verstecken des Formulars bis zum Hydrieren änderte das erste Bild und das größte Element für alle Besucher. Damit erfüllt keine Lösung alle Bedingungen aus Teil 2.2.

**OFFENE FRAGE 1 (Inhaber/Orchestrator): Wie soll das Fortsetzen künftig aussehen?**
- Weg A, ausdrückliche Rückfrage: Beim Laden mit Zwischenstand bleibt Schritt 1 stehen; ein Hinweis über dem Schritt fragt „Zwischenstand von zuletzt fortsetzen?“ mit „Fortsetzen“ und „Neu beginnen“. Der Sprung folgt einer Eingabe und zählt nicht als Verschiebung; für den Hinweis wird Platz nur bei Fortsetzenden gebraucht (er schiebt Schritt 1 einmal nach unten, außer man legt ihn in die feste Leiste oder ersetzt Schritt 1 erst nach dem Klick). Folgen: ein Klick mehr; neue Texte (Inhaber); „Später weitermachen“ bliebe, das Fortsetzen verhielte sich aber nicht mehr wie bisher (Sprung erst auf Wunsch).
- Weg B, Merkmal im Cookie und Server-Render des gespeicherten Schritts: Der Server läse ein Cookie „Zwischenstand auf Schritt x“ und renderte diesen Schritt. Folgen: Die Seite wird dynamisch statt statisch (Zeit bis zum ersten Byte und Zwischenspeicher für alle Besucher), ein neues Cookie (Datenschutzerklärung, ggf. Einwilligung: G9, Inhaber), Angaben müssten trotzdem erst nach dem Hydrieren erscheinen.
- Weg C, Neuaufbau statt Verschieben: Beim Wiederherstellen bekommt der Bereich unter dem Fortschrittsband einen neuen `key`, React baut ihn neu auf; neue Knoten zählen nicht als Verschiebung, der Messwert fiele voraussichtlich unter 0,02. Folgen: Was das Auge sieht, bliebe genau gleich (Schritt 1 für Sekundenbruchteile, dann Schritt 8); verbessert wäre nur die Kennzahl. Darum nicht umgesetzt; nur auf ausdrücklichen Wunsch, und dann als Kennzahl-Maßnahme benannt.
Empfehlung: Weg A, wenn der Sprung als störend gilt; sonst so lassen (betrifft nur Fortsetzende beim direkten Aufruf, Lighthouse-CLS beim normalen Laden bleibt 0).

## Skript-Gewicht des Assistenten (frisch gestarteter Server, `FA-SEO-03B/experimente/gewicht.mjs`)
| | Skripte | JS roh | JS gz |
|---|---|---|---|
| vorher (`gewicht-vorher.json`) | 18 | 899,0 KB | 277,2 KB |
| nachher (`gewicht-nachher.json`) | 18 | 899,5 KB | 277,4 KB |
Zuwachs +0,5 KB roh, +0,2 KB gz; Konfigurator 809,4 → 809,9 KB roh. Hinweis: Spätere Abrufe desselben Servers liefern beim Assistenten 20 Skripte (926 KB roh), vorher wie nachher; für den Vergleich gilt nur der erste Abruf nach dem Start.

## Prüfungen
- `sicher.sh --json -- npx vitest run`: 275 Dateien, 4309 Tests grün (nach der Nachbesserung 4314, siehe unten).
- `… -- npm run typecheck`: grün (0 Fehler).
- `… -- npm run lint`: grün (0 Meldungen).
- `SM24_INDEXIERUNG=an sicher.sh --json -- npm run build`: grün.

## OFFENE FRAGEN
1. Teil 2: Weg A, B oder C (oben), oder so lassen.
2. (In der Nachbesserung umgesetzt, Bestätigung erbeten; siehe Abschnitt „Nachbesserung“, Befunde 1 und 4.) Ab 768 px rollte `zumSchrittScrollen` nach jedem Wechsel an den Seitenanfang. Bei Formularen weiter unten auf der Seite (Kontakt eingebettet, Beratung) steht die fokussierte Überschrift bei 1280 px dann außerhalb des Bildes (vorher stand dort der Fokus ebenfalls außerhalb: auf „Zurück“ bzw. `body`). Der nächste Tab rollt das nächste Feld ins Bild. Soll das Rollen ab 768 px bei solchen Seiten zur Überschrift gehen (wie am Telefon)? Das wäre eine Änderung der Bewegung, darum nicht in diesem Paket.
3. „Weitermachen“ im Hinweis auf den Zwischenstand schließt den Hinweis; der Knopf verschwindet, der Fokus fällt auf `body` (kein Schrittwechsel, darum nicht in diesem Paket). Fokus danach auf die Schrittüberschrift?
4. „Neu beginnen“ setzt den Fokus jetzt auf die Überschrift von Schritt 1 (vorher `body`). Das Paket nennt „Neu beginnen“ nicht ausdrücklich; es ist eine Bedienung mit Schrittwechsel und der Knopf verschwindet. Bitte bestätigen.
5. Vorlesegeräte nur im Baum der Zugänglichkeit geprüft (Rolle, Name, Beschreibung), nicht mit NVDA/VoiceOver gehört. VoiceOver liest `aria-describedby` mit kurzer Verzögerung; ein Hörtest durch einen Menschen steht aus.

## Nachbesserung (18.11.2026, nach zwei Gegenprüfungen)
Geänderte Dateien: `src/lib/flow/use-flow.ts`, `src/lib/flow/use-flow.test.ts`, `src/components/flow/flow-shell.tsx`, `src/components/flow/flow-shell.test.tsx`, `src/components/flow/flow-shell-fokus.test.tsx`; neue Protokolle `protokolle/FA-QA-04E/wege-probe.mjs` → `wege-3000.json`, `ansage-probe.mjs` → `ansage-3000.json`, `quellen-3000-nachbesserung.json`, `gewicht-nachbesserung.md`; neu gemessen: `fokus-3000.json`, `eingebettet-kontakt-3000.json`, `beratung-3000.json`.

| Nr. | Befund | Ergebnis |
|---|---|---|
| 1 [rot] | Fokus bei eingebetteten und weiter unten liegenden Abläufen ab 768 px außerhalb des Bildes (`use-flow.ts:121`) | **behoben**, Bestätigung erbeten (OFFENE FRAGE N1) |
| 2 [gelb] | `aria-live` ganz entfernt; Wechsel ohne Fokus werden nicht mehr angesagt | **behoben** |
| 3 [gelb] | Weiter, Schrittknopf, Browser-Zurück/-Vorwärts, Vorschlag nur im Unit-Test belegt | **behoben** (im Browser belegt) |
| 4 [gelb] | wie 1 (WCAG 2.4.7, `flow-shell.tsx:193`) | **behoben** mit 1 |
| 5 [gelb] | wie 2 (Sprünge ohne Bedienung, `schliessplan-planer.tsx:190`) | **behoben** mit 2 |
| 6 [gelb] | `bedient` gilt nach Tippen bis zum nächsten Wechsel | **behoben** (anders als vorgeschlagen, Begründung unten) |
| 7 [gelb] | Schwache Erwartung bei „Zurück“, Historie zwischen den Fällen nicht zurückgesetzt | **behoben** |

**Befunde 1 und 4 (Fokus außerhalb des Bildes).** Trifft zu: Ab 768 px rollte `zumSchrittScrollen` immer an den Seitenanfang. Bei Formularen weiter unten auf der Seite lag die fokussierte Überschrift dann außerhalb des Bildes (Kontakt und Beratung bei 1280 px `imBild: false`). Umsetzung ohne neue Art der Bewegung: Ab 768 px misst `zumSchrittScrollen` vor dem Wechsel, wo die Überschrift am Seitenanfang stünde (Unterkante im Dokument gegen die Fensterhöhe). Passt sie dort ins Bild, rollt die Seite wie bisher an den Anfang. Das gilt für alle Abläufe oben auf der Seite: Assistent, Konfigurator, E-Scooter-Anfrage, gemessen `scrollY 0`, unverändert. Sonst rollt die Seite wie am Telefon zur Überschrift (`scrollIntoView({ block: 'start' })` unter Kopf und Band über `scroll-padding-top`). Die Art der Bewegung bleibt `scrollVerhalten()`, „Bewegung: ruhig“ springt also weiterhin. Die Überschrift wird weiterhin mit `preventScroll` fokussiert; es gibt keine zweite Bewegung.
Beim Prüfen von Browser-Zurück im Browser (Befund 3) fiel ein zweiter Fall auf: Chromium stellt bei einer Rückkehr innerhalb des Dokuments die gespeicherte Rollposition erst **nach** dem `popstate` wieder her. Das überschrieb das Rollen; beim Konfigurator stand die Überschrift bei 1280 px nach Browser-Zurück bei y −129 (`scrollY 601`). Der popstate-Hörer ruft `zumSchrittScrollen` deshalb ein Bild später auf (`requestAnimationFrame`); danach steht sie bei y 472 (`scrollY 0`).
Belege nachher: `eingebettet-kontakt-3000.json` und `beratung-3000.json` zeigen bei 412 und 1280 px nach beiden Wechseln Fokus auf `h2` und `imBild: true`. Partner-Bewerbung bei 1280 px: Die Überschrift steht nach Weiter, Browser-Zurück/-Vorwärts und Schrittknopf bei y 160 (`wege-3000.json`). Unit-Tests: `use-flow.test.ts` (Seitenanfang, wenn die Überschrift dort im Bild steht; Überschrift, wenn der Ablauf weiter unten steht; ohne Überschrift an den Anfang).
Weil sich damit das Ziel des Rollens ab 768 px für Formulare weiter unten auf der Seite ändert (nicht die Art der Bewegung), bleibt die Frage zur Bestätigung offen: **OFFENE FRAGE N1**.

**Befunde 2 und 5 (Ansage ohne Fokus).** Trifft zu: Ohne `aria-live` an der Zeile „Schritt x von y“ blieben das Wiederherstellen beim Hydrieren und Sprünge ohne Bedienung stumm. Umsetzung: eine eigene, unsichtbare Live-Region im Rahmen (`<p class="sr-only" aria-live="polite" data-schritt-ansage>`). Sie ist beim Laden leer. Der Fokuseffekt füllt sie nur, wenn der Schritt wechselt, **ohne** dass der Fokus auf die Überschrift geht. Inhalt: „Schritt x von y: Name. Titel“, aus denselben Teilen wie `aria-valuetext` und die Überschrift. Geht der Fokus auf die Überschrift, wird die Region geleert, und es bleibt bei einer Ansage. Sichtbare Texte sind unverändert.
Belege: `ansage-3000.json`. Ohne Zwischenstand ist die Region leer, im Server-HTML wie nach dem Laden (412 und 1280). Mit Zwischenstand auf „Fotos“ steht nach dem Hydrieren „Schritt 2 von 5: Unterlagen hochladen. Fotos Ihres Schlüssels“ darin, der Fokus bleibt auf `body`. Nach Wechseln mit Fokus ist sie leer (`wege-3000.json`, Feld `ansage`). Unit-Tests: Wiederherstellen und Sprung ohne Bedienung füllen die Region, „Weiter“ lässt sie leer, beim ersten Render ist sie leer.
Layoutverschiebung beim Laden ohne Zwischenstand weiter 0, mit Zwischenstand unverändert 0,0884 (1280) (`quellen-3000-nachbesserung.json`). Ein Hörtest mit NVDA oder VoiceOver steht weiter aus (OFFENE FRAGE 5).

**Befund 3 (Wege im Browser).** Trifft zu. Die neue Probe `wege-probe.mjs` (Ausgabe `wege-3000.json`) prüft bei 412 und 1280 px die Partner-Bewerbung, den Konfigurator gleichschließende Zylinder und die E-Scooter-Anfrage. Ablauf: Schritt 1 nur mit der Tastatur füllen (erfundene Angaben), dann „Weiter“ per Tab und Enter, `page.goBack()`, `page.goForward()` und den Schrittknopf des ersten Schritts per Umschalt+Tab und Enter. Ergebnis: Nach jedem Wechsel liegt der Fokus auf `h2[data-schritt-titel]`, `:focus-visible` ist gesetzt, die Überschrift steht im Bild, und der nächste Tab landet im Ablauf. Einschränkung: Der Schrittknopf ist nur bei 1280 px geprüft. Unter 768 px ist die Leiste ausgeblendet (`md:flex`) und daher nicht bedienbar.
Übernommener Vorschlag im Assistenten: In die Fahrzeugsuche „Golf“ tippen. Der Hinweis lautet dann „Weiter mit Volkswagen Golf“. Danach „Weiter“ per Tastatur. Der Fokus liegt auf `h2` „Baujahr oder Erstzulassung“, im Bild bei 412 und 1280 px; der nächste Tab geht auf „Ändern“ im Schritt.
Die bisherige Probe `fokus-probe.mjs` wurde gegen den nachgebesserten Stand wiederholt (`fokus-3000.json`) und zeigt dasselbe Ergebnis wie zuvor. Der Satz unter „Was sich für wen ändert“ ist damit im Browser belegt; „Neu beginnen“ ist weiterhin nur im Unit-Test belegt.

**Befund 6 (Bedienung bleibt nach dem Tippen stehen).** Trifft zu. Die vorgeschlagene Lösung, die Bedienung nur im selben Ereignisdurchlauf gelten zu lassen, ist **nicht** umgesetzt. Grund: Der Assistent springt nach „Absenden“ erst nach `await uploadsAbwarten()` auf einen unvollständigen Schritt (`assistent.tsx:1006`). Dieser Sprung folgt einem Klick und verlöre sonst den Fokus. Umgesetzt ist stattdessen: Als Bedienung zählt nur noch das Auslösen, also ein Klick oder Enter bzw. Leertaste im Ablauf. Jede andere Taste (Tippen, Pfeiltasten, Tab) hebt die Bedienung wieder auf. Nach dem Ausfüllen eines Feldes zieht ein späterer Sprung ohne Auslösen den Fokus also nicht mehr an sich; er wird dann über die Live-Region angesagt. Der verbleibende Randfall steht im Kommentar: nach einem Mausklick auf eine Option ohne weitere Eingabe. Heute ruft kein Formular in diesem Fall einen Sprung auf.
Unit-Tests: „Tippen im Feld gilt nicht als Bedienung“ (vorher wäre der Fokus auf die Überschrift gegangen) und „Enter auf einem Knopf im Ablauf gilt als Bedienung, auch wenn der Sprung später folgt“.

**Befund 7 (Tests).** Trifft zu. Der Test erwartet jetzt `'Zweiter Schritt'`, und `beforeEach` setzt die Historie mit `window.history.replaceState(null, '')` neutral.

### Prüfungen nach der Nachbesserung
- `sicher.sh --json -- npx vitest run`: 275 Dateien, 4314 Tests grün (vorher 4309; neu: 5 Fälle, davon 3 in `flow-shell-fokus.test.tsx` und 2 in `use-flow.test.ts`; dazu angepasste Erwartungen).
- `… -- npm run typecheck`: grün (0 Fehler). `… -- npm run lint`: grün (0 Meldungen).
- `SM24_INDEXIERUNG=an sicher.sh --json -- npm run build`: grün. Der Prüfserver auf Port 3000 wurde danach neu gestartet.
- Skript-Gewicht des Assistenten beim ersten Abruf nach dem Start (`gewicht-nachbesserung.md`): 18 Skripte, 900,2 KB roh, 277,6 KB gz. Zum Vergleich: vor dem Paket 899,0 / 277,2, nach dem Paket 899,5 / 277,4. Zuwachs insgesamt +1,2 KB roh, +0,4 KB gz. Konfigurator 810,6 KB roh.

### OFFENE FRAGEN der Nachbesserung
- **N1 (Inhaber/Orchestrator, B-11):** Ab 768 px rollt die Seite bei Formularen weiter unten auf der Seite (Kontakt, Beratung, Partner-Bewerbung) nach einem Schrittwechsel jetzt zur Schrittüberschrift statt an den Seitenanfang. Nur so bleiben Fokus und Überschrift im Bild. Die Art der Bewegung ist unverändert (`scrollVerhalten()`, „ruhig“ springt). Abläufe oben auf der Seite rollen wie bisher an den Anfang. Bitte bestätigen. Falls nicht: Rücknahme in `zumSchrittScrollen` (eine Bedingung); dann ist Teil 1.6 für diese Seiten nicht erfüllt.
- **N2:** Browser-Zurück rollt jetzt ein Bild später (`requestAnimationFrame`), damit die Rollposition, die der Browser wiederherstellt, das Rollen zum Schritt nicht überschreibt. Gemessen ist das in Chromium; Safari und Firefox sind nicht geprüft.

## Abnahme durch den Orchestrator (18.11.2026)

**Ergebnis: Teil 1 abgenommen. Teil 2 bleibt offen beim Inhaber (MA-62); am Fortsetzen ist nichts geändert.**

Geprüft:
- Kette `abnahme.sh FA-QA-04E`: Typprüfung, Lint, Unit-Tests 4314, Datenbanktests 190, Build 190/190 grün.
- Eigene Tastaturprobe, unabhängig von den Skripten des Baumeisters (Autoschlüssel-Assistent, 412 und 1280 px, alter Stand auf Port 3200 gegen neuen auf Port 3000): Marke wählen, mit Tab zu „Weiter“, Enter. Alt: Fokus auf der Seite selbst, kein sichtbarer Fokus. Neu: Fokus auf der Überschrift „Welches Modell fahren Sie?“, Fokusring sichtbar, Überschrift im Bild (Telefon bei 136 px unter dem festen Kopf, Desktop bei 463 px), Beschreibung „Schritt 1 von 5 · Fahrzeug wählen“; der nächste Tab landet im Eingabefeld des Schritts. „Zurück“ mit der Maus: Fokus auf der Überschrift, kein Ring. Beim Laden: Fokus nicht im Formular, Layoutverschiebung 0, in beiden Ständen gleich.
- Proben des Baumeisters nach der Nachbesserung gelesen: Kontakt (eingebettet) und Beratung stehen nach dem Wechsel bei beiden Breiten im Bild; 46 Wechsel über „Weiter“, Browser-Zurück und -Vorwärts, Schrittknopf und Vorschlag in vier Abläufen: Fokus jedes Mal auf der Überschrift und im Bild.
- Alle Formulare laden und wechseln den Schritt ohne Konsolenfehler (12 Abläufe und das Kontaktformular).
- Lagevergleich beim Laden mit dem Stand davor (13 Seiten, 390 und 1280 px): Auf den Formularseiten ist ein einziges Element dazugekommen (die unsichtbare Ansagezeile, 1 × 1 px), nichts ist verschoben; Seiten ohne Formular sind gleich.
- Skript-Gewicht am frisch gestarteten Server: Assistent 18 Skripte, 277,2 auf 277,6 KB; Konfigurator 252,9 auf 253,3 KB; Kontakt 267,3 auf 267,7 KB (der Ablauf-Baustein, je 0,4 KB). Grund: Fokus und Ansage.

Entschieden (A-077):
- Ab 768 px rollt die Seite nach einem Schrittwechsel bei Formularen, die weiter unten auf der Seite stehen (Kontakt, Beratung, Partner-Bewerbung), zur Überschrift des Schritts statt an den Seitenanfang. Vorher rollte sie vom Formular weg; die fokussierte Überschrift muss im Bild stehen. Abläufe am Seitenanfang rollen wie bisher. Die Art der Bewegung (B-11, „ruhig“ bleibt ruhig) ist unverändert.
- Die Ansage für Vorlesegeräte: mit Fokus spricht die Überschrift (mit Schrittzahl als Beschreibung); ohne Fokus (Fortsetzen, Sprung ohne Bedienung) spricht eine unsichtbare Ansagezeile. Sichtbare Texte sind unverändert.
- `happy-dom` (Testumgebung der neuen Verhaltenstests) kommt über `@payloadcms/richtext-lexical` in die Sperrdatei und steht nicht in `package.json`. Solange das so ist, laufen die Tests; fällt die Abhängigkeit dort weg, wird der Test laut rot. Ein eigener Eintrag unter den Entwicklungsabhängigkeiten ist vorgemerkt (kein Laufzeitcode).

Offen:
- Teil 2 (Sprung beim Fortsetzen, 0,13 am Telefon und 0,09 am Desktop, unverändert): Wege A (Rückfrage „Zwischenstand fortsetzen?“), B (Cookie und Erzeugen auf dem Server) oder so lassen; Entscheidung des Inhabers (MA-62). Weg C ist verworfen (senkt nur die Kennzahl).
- „Weitermachen“ im Hinweis auf den Zwischenstand lässt den Fokus auf der Seite (kein Schrittwechsel): kleiner Nachzug, vorgemerkt.
- Hörtest mit einem echten Vorlesegerät und ein Blick in Safari und Firefox auf Browser-Zurück im Konfigurator (hier steht nur Chromium bereit): MA-62.

