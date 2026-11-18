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
| Kontakt (eingebettet) | Zurück 3→2, 2→1 | „Zurück“ (außer Bild), dann `body` | `h2` (412 im Bild; 1280 siehe OFFENE FRAGE 2) |
| Beratung | Zurück 3→2, 2→1 | „Zurück“, dann `body` | `h2` (wie Kontakt) |

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
- `sicher.sh --json -- npx vitest run`: 275 Dateien, 4309 Tests grün.
- `… -- npm run typecheck`: grün (0 Fehler).
- `… -- npm run lint`: grün (0 Meldungen).
- `SM24_INDEXIERUNG=an sicher.sh --json -- npm run build`: grün.

## OFFENE FRAGEN
1. Teil 2: Weg A, B oder C (oben), oder so lassen.
2. Ab 768 px rollt `zumSchrittScrollen` nach jedem Wechsel an den Seitenanfang. Bei Formularen weiter unten auf der Seite (Kontakt eingebettet, Beratung) steht die fokussierte Überschrift bei 1280 px dann außerhalb des Bildes (vorher stand dort der Fokus ebenfalls außerhalb: auf „Zurück“ bzw. `body`). Der nächste Tab rollt das nächste Feld ins Bild. Soll das Rollen ab 768 px bei solchen Seiten zur Überschrift gehen (wie am Telefon)? Das wäre eine Änderung der Bewegung, darum nicht in diesem Paket.
3. „Weitermachen“ im Hinweis auf den Zwischenstand schließt den Hinweis; der Knopf verschwindet, der Fokus fällt auf `body` (kein Schrittwechsel, darum nicht in diesem Paket). Fokus danach auf die Schrittüberschrift?
4. „Neu beginnen“ setzt den Fokus jetzt auf die Überschrift von Schritt 1 (vorher `body`). Das Paket nennt „Neu beginnen“ nicht ausdrücklich; es ist eine Bedienung mit Schrittwechsel und der Knopf verschwindet. Bitte bestätigen.
5. Vorlesegeräte nur im Baum der Zugänglichkeit geprüft (Rolle, Name, Beschreibung), nicht mit NVDA/VoiceOver gehört. VoiceOver liest `aria-describedby` mit kurzer Verzögerung; ein Hörtest durch einen Menschen steht aus.
