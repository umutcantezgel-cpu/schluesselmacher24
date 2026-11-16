# FA-SEO-03B · Mobile Leistung, Teil B: belegte Hebel einzeln gemessen

Stand 16.11.2026 · Anforderungen FA-25-13, FA-25-15 · Vergleichsstand `http://localhost:3200` (Commit 8939397, nicht angefasst) · Versuch `/home/user/sm24-versuch` auf Port 3300. Ich habe auf Port 3000 nichts gemessen oder gestartet, im Arbeitsbaum nicht gebaut und keinen git-Befehl ausgeführt.

Ergebnis kurz: Zwei Änderungen sind übernommen. Beide liegen in Hebel 4 (JavaScript) und ändern nur, welche Skripte eine Seite lädt.
- **Erste Änderung:** Der Serverbaustein `SeitenDaten` (Strukturdaten, auf rund 30 Seiten) hat Hilfswerte aus `fahrzeug-anfrage/seiten.tsx` gelesen. Diese Datei bindet das Anfrageformular ein. Dadurch hingen Formular, Foto-Upload und alle elf Zeichnungs-Generatoren am Client-Bündel jeder dieser Seiten, auch wenn die Seite kein Formular zeigt.
- **Zweite Änderung:** Der Konfigurator nutzt für das Messfoto `KompaktBild` statt `ImagePlaceholder compact`. Beide zeichnen dasselbe.
- **Gewinn an JavaScript (gzip):** Shop −60 KB und 5 Skripte weniger, Konfigurator −43 KB und 4 Skripte weniger, Assistent −23 KB und 3 Skripte weniger, Kontakt −17 KB und 1 Skript weniger.
- **Pixelgleich:** Alle neun Ansichten sind bei 412 und 1280 px pixelgleich (18 von 18 Bildern, 0 abweichende Pixel), mit gleichem Text und gleicher Zahl der Elemente.
- **Verworfen:** `inlineCss` abzuschalten. Im gedrosselten Browser wird der LCP damit um 0,6 bis 0,7 s schlechter.
- **Ohne Änderung, mit Zahlen begründet:** die Schriften (alle drei Mono-Schnitte stehen im sichtbaren Text), der Altbrowser-Code (er kommt aus Next selbst) und das späte Vorladen (es ist nicht die Ursache der späten langen Aufgabe).
- **Autoschlüssel-Seite:** Ursache gefunden (Stil und Layout eines langen Dokuments). Ein kleiner Eingriff dafür fehlt: OFFENE FRAGE.

## GEÄNDERTE DATEIEN

Im Arbeitsbaum:
- `src/components/fahrzeug-anfrage/rubrik.ts` (neu): `KLASSE_RUBRIK`, `rubrikLive`, `RUBRIK_PAUSIERT_LEAD`, `bereichsKrume`, unverändert aus `seiten.tsx` verschoben. Die Datei hat keinen Client-Baustein und importiert nur `@/lib/data` und `@/lib/fahrzeuge/anfrage-klassen`.
- `src/components/fahrzeug-anfrage/seiten.tsx`:
  - Zeile 11: `getRubrik` aus dem Import entfernt.
  - Zeile 19: Import aus `./rubrik`.
  - Zeilen 23 bis 26: Weitergabe derselben vier Namen (`export { … }`), damit alle bisherigen Importe gleich bleiben.
  - Die drei Blöcke selbst sind entfernt.
- `src/components/seo/seiten-daten.tsx`, Zeile 2: importiert aus `@/components/fahrzeug-anfrage/rubrik` statt aus `…/seiten`.
- `src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx`:
  - Zeilen 48 bis 50: Import `KompaktBild` aus `@/components/ui/bild-flaeche`, mit Kommentar, statt `ImagePlaceholder`.
  - Zeile 1335: `<KompaktBild slot={measureFigure} />` statt `<ImagePlaceholder slot={measureFigure} compact />`.
- `src/components/fahrzeug-anfrage/rubrik.test.ts` (neu, 4 Tests):
  - `rubrik.ts` ist frei von Client-Bausteinen.
  - `SeitenDaten` liest aus `./rubrik`.
  - `./seiten` gibt dieselben Objekte weiter.
  - Verhalten von `rubrikLive` und `bereichsKrume`.
- `src/app/(site)/gleichschliessende-zylinder/konfigurator/kompakt-bild.test.tsx` (neu, 5 Tests):
  - `KompaktBild` liefert in vier Fällen dasselbe Markup wie `ImagePlaceholder compact`: Foto, Foto ohne Alternativtext, Foto ohne Adresse, Generator ohne Foto.
  - Der Konfigurator bindet `image-placeholder` nicht mehr ein.
- `_werkstatt/ausbau/berichte/FA-SEO-03B.md` (dieser Bericht).

Protokolle unter `_werkstatt/ausbau/protokolle/FA-SEO-03B/`:
- `leistung-*.json|md`: Lighthouse, Maßstab A und B, je Variante
- `gewicht-*.json`: lastunabhängige Werte je Variante
- `mono-schnitte.log` und `spur-aufgaben.log`
- `experimente/`:
  - `gewicht.mjs`, `spur-aufgaben.mjs`, `mono-schnitte.mjs` und `bildvergleich.mjs`
  - `analyse-teile.mjs` und `analyse-kette.mjs`: Auswertung von `next analyze export`
  - Alle laufen nur gegen localhost, die Browser-Skripte mit `attrappenSetzen` (G5).

Die vollen Lighthouse-Ergebnisse und die 36 Bildschirmfotos liegen unter `protokolle/roh/FA-SEO-03B/`. Der Ordner steht in `.gitignore`.

Nicht geändert:
- `next.config.ts`, `package.json`, `src/fonts/schriften.ts`, `globals.css` und `src/lib/spaet-vorladen.ts`. Die Gründe stehen je Hebel.
- Nichts unter `src/components/visual/generators/**`, `src/payload/**`, `src/lib/orte/**`, `src/lib/partner/**` und `src/lib/auftragsweg.ts`.
- Keine Texte, keine Daten, kein Schema.

## WAS UND WARUM

### Arbeitsweise und Maßstab

- **Bauten:** jede Variante als eigener Build im Versuchsordner, aufeinander aufbauend. Reihenfolge: Stand, dann v4a (Rubrik getrennt), dann v1 (zusätzlich ohne `inlineCss`, verworfen), dann v4b (v4a plus `KompaktBild`; das ist der Endstand).
- **Lastunabhängige Werte (maßgeblich)** mit `experimente/gewicht.mjs`:
  - HTML roh und gzip-9
  - Inline-`<style>` und RSC-Nutzlast
  - Zahl und Größe der `<script src>` im HTML, roh und gzip-9
  - CSS-Dateien
  - Vorladen im Kopf
- **Lighthouse nur als Hinweis:** `leistung.mjs`, 5 Läufe in Maßstab A, 5 oder 3 Läufe in Maßstab B. Auf der Maschine liefen gleichzeitig Lint, Tests und Builds eines anderen Pakets (Last bis 5,3). Leistung und TBT streuen deshalb stark. Ein Beispiel: Die Startseite hat in Stand und Endstand **byte-gleiche** Dateien und zeigte trotzdem 93 gegen 84 Punkte.
- **Bündelanalyse:** mit dem Werkzeug, das Next mitbringt (`next analyze --output --snapshot stand`, dann `next analyze export --route …`, Anleitung `01-app/02-guides/package-bundling.md`). Keine neue Abhängigkeit.

### Hebel 1 · CSS doppelt in der Nutzlast (`experimental.inlineCss`): verworfen, bleibt wie heute

Anleitung (`05-config/01-next-config-js/inlineCss.md`): Die Verdopplung („once within `<style>` tags for SSR and once in the RSC payload“) steht dort als bekannte Grenze. Einen Weg, nur die Kopie in der Nutzlast abzuschalten, nennt die Anleitung nicht. Die dritte Variante entfällt deshalb.

Lastunabhängig, Versuch v4a gegen v1 (gzip-9):

| Ansicht | HTML gz mit inlineCss | HTML gz ohne | CSS-Datei gz ohne | Summe vor dem ersten Zeichnen (HTML + CSS) | blockierende Anfragen |
|---|---|---|---|---|---|
| Startseite | 78,0 KB | 46,4 KB | 15,5 KB | 78,0 → 61,9 KB | 0 → 1 |
| Autoschlüssel | 73,9 KB | 42,5 KB | 15,5 KB | 73,9 → 58,0 KB | 0 → 1 |
| Shop | 50,5 KB | 19,2 KB | 15,5 KB | 50,5 → 34,7 KB | 0 → 1 |
| Ratgeber | 53,4 KB | 22,1 KB | 15,5 KB | 53,4 → 37,6 KB | 0 → 1 |

Ohne `inlineCss` sind es rund 16 KB weniger, aber eine blockierende Anfrage mehr. Das Inline-`<style>` hat 82,4 KB roh; die Nutzlast sinkt ohne `inlineCss` um rund 83 KB roh je Seite.

Lighthouse, Median aus 5 Läufen, Spanne in Klammern:

| Ansicht | A: FCP mit → ohne | A: LCP mit → ohne | B: FCP = LCP mit → ohne |
|---|---|---|---|
| Startseite | 1.515 (1.505–1.527) → 1.236 (1.076–1.536) | 3.062 (2.769–3.344) → 2.747 (2.088–2.809) | 1.214 (1.159–1.440) → **1.861** (1.812–1.919) |
| Autoschlüssel | 1.809 (1.808–1.860) → 1.064 (1.060–1.211) | 3.746 (2.460–3.830) → 2.621 (2.458–2.933) | 1.156 (1.121–1.201) → **1.831** (1.765–1.838) |
| Shop | 1.361 (1.107–1.364) → 924 (914–1.371) | 2.721 (2.344–3.172) → 2.748 (1.869–3.026) | 1.020 (982–1.069) → **1.696** (1.664–1.840) |
| Ratgeber | 1.357 (1.354–1.366) → 1.362 (906–1.364) | 3.339 (2.909–3.509) → 2.896 (2.590–3.213) | 1.113 (1.069–1.176) → **1.774** (1.693–1.862) |

A-Werte „mit“: Startseite, Autoschlüssel und Ratgeber aus der Stand-Messung (byte-gleich mit v4a), Shop aus v4a. B-Werte „mit“ aus `leistung-v4a-devtools-…`.

Entscheidung: **verworfen.**
- Maßstab A (Lantern) rechnet die zusätzliche Anfrage fast ohne Latenz und belohnt die kleineren Bytes.
- Im gedrosselten Browser (B, 562,5 ms Latenz je Anfrage) kommt der Text auf allen vier Ansichten **0,6 bis 0,7 s später**. Die Spannen überlappen nicht.
- Die Regel des Pakets lautet: in keinem Maßstab schlechter und in einem klar besser. Hier ist es in B klar schlechter. Das bestätigt D-050.
- `next.config.ts` bleibt unverändert, ohne neuen Kommentar, weil nichts geändert ist. Die Zahlen stehen hier.

### Hebel 2 · Schriften: keine Änderung, OFFENE FRAGE 1

Einbindung: `src/fonts/schriften.ts` über `next/font/local`.
- Plex Sans ist variabel (100 bis 700) und als einzige Datei vorgeladen.
- Plex Mono hat drei Schnitte 400, 500 und 600, schon mit `preload: false`.
- Alle Dateien sind bereits auf `latin` beschränkt (`unicode-range`). Für `latin-ext` gibt es eigene Dateien, die nur bei Bedarf laden. Weiter beschneiden hieße, Zeichen wegzulassen, die gepflegte Inhalte (Payload) enthalten können. Das habe ich nicht getan.

Welche Mono-Schnitte nutzt sichtbarer Text? Gemessen mit `experimente/mono-schnitte.mjs` (berechnete Schrift jedes sichtbaren Textknotens; Protokoll `mono-schnitte.log`). Bei 412 px im ersten Bildschirm:

| Ansicht | 400 | 500 | 600 | Beispiel 600 |
|---|---|---|---|---|
| Startseite | – | 1 | 1 | Telefonnummer „06441 …“ |
| Autoschlüssel | 8 | 1 | 2 | „69,90 €“, „ca. 7 Tage“ |
| Assistent | 11 | 1 | – (Seite: 1) | |
| Schlüssel nach Code | 1 | 1 | – (Seite: 3) | |
| Konfigurator | 11 | 1 | 5 | Stückzahlen |
| Shop | 1 | 3 | – (Seite: 0) | lädt 600 gar nicht |
| Ortsseite | 1 | 1 | – (Seite: 1) | |
| Ratgeber | 3 | 1 | 4 | Maße „A 30“ |
| Kontakt | 1 | 3 | – (Seite: 1) | |

Bei 1280 px nutzt die Startseite im ersten Bildschirm nur 400 (14 Stellen). Auf der Seite stehen aber 20-mal 500 und 12-mal 600.

Ergebnis:
- Jeder der drei Schnitte trägt auf mehreren Ansichten sichtbaren Text, auch im ersten Bildschirm. Kein Schnitt darf entfallen.
- Der Browser lädt nur Schnitte, die die Seite nutzt (Shop: nur 400 und 500).
- Zur Reihenfolge: Plex Sans ist vorgeladen und wird zuerst angefordert (28 bis 70 ms). Die Mono-Schnitte folgen, sobald das Inline-CSS gelesen ist (65 bis 234 ms).
- Eine weitere Umordnung ginge nur über `font-display: optional` oder späteres Laden von Mono. Beides lässt den Ersatz sichtbar stehen oder tauscht später: eine sichtbare Änderung des Schriftbilds und damit eine Gestaltungsentscheidung (A-003, KERN).
- Bildvergleiche vorher und nachher entfallen, weil nichts an den Schriften geändert ist. Der Bildvergleich des Endstands (siehe BELEGE) zeigt gleiche Pixel.

### Hebel 3 · Altbrowser-Code (13 bis 14 KB): keine Änderung, OFFENE FRAGE 2

Herkunft: Lighthouse meldet in `17_pbdm6y2ffj.js` die Signale `Array.prototype.at`, `flat`, `flatMap`, `Object.fromEntries`, `Object.hasOwn`, `String.prototype.trimStart` und `trimEnd`.
- Das ist `next/dist/build/polyfills/polyfill-module.js` (1.380 Byte roh). `next/dist/client/app-globals.js` bindet ihn ohne Bedingung ein.
- Er stammt also weder aus unserem Code noch aus einer Abhängigkeit, und er hängt nicht an den Zielbrowsern.
- Die 13,4 KB sind die Schätzung von Lighthouse je erkanntem Polyfill. Wirklich übertragen wird rund 1 KB.

Zielbrowser laut Anleitung (`03-architecture/supported-browsers.md`): Next nimmt ohne Angabe `chrome 111, edge 111, firefox 111, safari 16.4`. Diese Browser kennen alle sieben Funktionen schon. Modernere Ziele in `package.json` würden den Baustein deshalb **nicht** entfernen.

Eine Aussage, welche Browser die Seite tragen muss, steht in `AUFTRAG.md`, `KERN.md` und `docs/` nicht. Gesucht habe ich nach browserslist, Zielbrowser, Browserunterstützung, Safari- und iOS-Versionen sowie „alte Browser“; ohne Treffer.

Entscheidung: keine Änderung. `package.json` bleibt unverändert.

### Hebel 4 · JavaScript der schweren Ansichten: zwei Änderungen übernommen

**Befund aus `next analyze`:**
- `src/components/seo/seiten-daten.tsx` ist ein Serverbaustein für die Strukturdaten auf rund 30 Seiten.
- Er importierte `RUBRIK_PAUSIERT_LEAD`, `bereichsKrume` und `rubrikLive` aus `src/components/fahrzeug-anfrage/seiten.tsx`.
- Diese Datei importiert den Client-Baustein `FahrzeugAnfrageFormular`. Turbopack hängt jeden Client-Baustein im Modulgraphen einer Seite an deren Client-Bündel.
- Die Importkette lautet: `shop/page.tsx` → `seo/seiten-daten.tsx` → `fahrzeug-anfrage/seiten.tsx` → `fahrzeug-anfrage/formular.tsx` → `forms/photo-upload.tsx` → `ui/image-placeholder.tsx` → `visual/registry.tsx` → alle elf Generatoren.
- Damit lud etwa der Shop ein Anfrageformular mit Foto-Upload und elf Zeichnungen, die er nie zeigt.

**Änderung v4a:** Die vier reinen Werte und Funktionen stehen jetzt in `rubrik.ts`. `SeitenDaten` liest sie dort. `seiten.tsx` gibt sie unverändert weiter.

**Zweiter Befund:** Der Konfigurator importierte `ImagePlaceholder` nur für `<ImagePlaceholder slot={measureFigure} compact />`, und zwar nur, wenn ein Messfoto gepflegt ist.
- Mit `compact` zeichnet `ImagePlaceholder` nie eine Fachgrafik. Trotzdem zog der Import das Register mit allen Generatoren nach.
- `KompaktBild` (`ui/bild-flaeche.tsx`, „wie `ImagePlaceholder compact`“, schon von `InfoTip` so genutzt) zeichnet dasselbe ohne Register. Der Test vergleicht das Markup in vier Fällen.

**Änderung v4b:** `KompaktBild` an dieser einen Stelle.

Lastunabhängig: Skripte im HTML, JS-Summe gzip-9. Der Stand ist der Messstand, v4b ist der Endstand:

| Ansicht | Stand: Skripte / JS gz | v4a | Endstand (v4b) | Differenz |
|---|---|---|---|---|
| Assistent | 21 / 300,8 KB | 18 / 277,3 KB | 18 / 277,6 KB | −3 Skripte, −23,2 KB |
| Konfigurator | 21 / 296,2 KB | 19 / 271,8 KB | 17 / 252,9 KB | −4 Skripte, −43,3 KB |
| Shop | 20 / 281,0 KB | 15 / 220,7 KB | 15 / 220,7 KB | −5 Skripte, −60,3 KB |
| Kontakt | 20 / 284,0 KB | 18 / 266,2 KB | 19 / 267,2 KB | −1 Skript, −16,8 KB |
| Startseite, Autoschlüssel, Code, Ort, Ratgeber | unverändert | unverändert | unverändert | 0 |

- JS roh: Shop 900 → 705 KB, Konfigurator 950 → 809 KB, Assistent 971 → 901 KB, Kontakt 909 → 853 KB.
- HTML gz sinkt um 0,1 bis 0,4 KB, weil weniger Skripte verwiesen werden.
- Kontakt hat mit v4b ein Skript und 1,0 KB mehr als mit v4a. Turbopack hat die gemeinsamen Teile anders geschnitten; am Kontakt selbst hat sich nichts geändert. Gegenüber dem Stand bleibt es ein Gewinn.

Lighthouse Maßstab A (Übertragung laut Lighthouse; Leistung und LCP als Median mit Spanne):

| Ansicht | JS KB | Dateien | Leistung Stand → Endstand | LCP ms Stand → Endstand |
|---|---|---|---|---|
| Assistent | 282 → 268 | 29 → 28 | 80 (77–92) → 79 (72–90) | 3.027 (1.372–4.141) → 2.180 (1.548–3.759) |
| Konfigurator | 277 → 230 | 27 → 23 | 89 (86–91) → 86 (83–93) | 3.396 (3.317–3.831) → 2.930 (1.484–3.227) |
| Shop | 261 → 196 | 25 → 20 | 90 (88–90) → 94 (85–96) | 3.626 (2.936–3.642) → 2.564 (2.012–2.738) |
| Kontakt | 264 → 246 | 30 → 29 | 89 (84–91) → 91 (82–95) | 3.501 (3.196–3.926) → 2.949 (2.670–3.692) |

- Der LCP sinkt in A auf allen vier Ansichten um 0,5 bis 1,1 s, wie Befund 2 von FA-SEO-03 es erwarten ließ: Weniger Bytes werden vor dem ersten Zeichnen angefordert.
- Der Leistungswert streut wegen des TBT unter Last. Die Endmessung lief gleichzeitig mit dem vollen Testlauf. Aussagekräftig ist das erst auf ruhiger Maschine (siehe Nachmessung).
- Die Zwischenmessungen v4a und v4b stehen in `leistung-v4a-rubrik-…md` und `leistung-v4b-kompaktbild-…md`.

**Nicht übernommen, als OFFENE FRAGE 3:**
- **Nachladen des Foto-Uploads im Assistenten:** Er erscheint erst in Schritt 8 und 9. `assistent.tsx` importiert aber zugleich `alsUpload` und `uploadsAbwarten` aus derselben Datei, und Turbopack teilt Module nicht nach Exporten. Ein `next/dynamic` allein spart deshalb nichts. Nötig wäre, die Upload-Hilfen aus `forms/photo-upload.tsx` in ein eigenes Modul zu ziehen. Dieser gemeinsame Baustein liegt außerhalb meiner Schreibrechte.
- **Kontakt:** Der Foto-Upload steht im ersten Schritt, also sichtbar. Nachladen ist dort nach den Bedingungen des Pakets ausgeschlossen.
- **Ungenutztes JavaScript (25 bis 28 KB):** Es steckt laut Lighthouse ganz in `17_pbdm6y2ffj.js`, dem Bündel aus React DOM und dem Next-Client. Daran ändert sich ohne andere Bibliotheken nichts.

### Hebel 5 · Späte lange Aufgaben: `useSpaetVorladen` ist nicht die Ursache, keine Änderung

Probe mit `experimente/spur-aufgaben.mjs`: Spur bei 412 × 823 und CPU 4-fach bis 6 s nach `load`, je zweimal mit und ohne Vorladen. Ohne Vorladen beantwortet die Probe alle Anfragen mit `next-router-prefetch` mit 204. Protokoll: `spur-aufgaben.log`.
- In keiner der vier Spuren gibt es nach dem Vorladen eine Aufgabe über 50 ms.
- Die einzige lange Aufgabe in `17_pbdm6y2ffj.js` ist `EvaluateScript` des Hauptbündels, also das Hydrieren: 170 bis 183 ms mit Vorladen, 185 bis 194 ms ohne.
- Mit Vorladen und ohne sind die Werte gleich. Im gedrosselten Netz liegt diese Aufgabe spät, weil sie auf das Laden aller Skripte wartet: in A bei rund 3,3 bis 3,9 s simuliert, in B bei 2,5 s (`leistung-v4a-devtools-…md`: 187 bis 270 ms bei 2.479 bis 2.560 ms).
- Die Vermutung aus FA-SEO-03 (OFFENE FRAGE 5) ist damit widerlegt. Zerlegen hilft hier nicht, weil das Hydrieren eine einzige Aufgabe von React ist.
- Jede Verkleinerung der Bündel (Hebel 4) verkürzt die Wartezeit davor.
- `src/lib/spaet-vorladen.ts` bleibt unverändert.

### Hebel 6 · Autoschlüssel-Seite: Ursache gefunden, kein kleiner Eingriff, OFFENE FRAGE 4

Spur (2 Läufe, `spur-aufgaben.log`):
- Die Seite hat 6 lange Aufgaben, über 50 ms zusammen 363 bis 438 ms. Der Shop hat 3 bis 5 Aufgaben mit 235 bis 293 ms.
- Drei bis vier davon sind reines **Stilrechnen und Layout** (`UpdateLayoutTree` und `Layout` je 34 bis 76 ms, Aufgaben von 97 bis 176 ms). Sie fallen beim stückweisen Lesen des langen Dokuments und beim Eintreffen der Schriften an.
- Dazu kommt das Hydrieren mit 154 bis 204 ms.
- Das Dokument hat 1.045 bis 1.079 Elemente, 86 Inline-SVG mit 55 KB Markup und 472 KB HTML roh. Der Inhalt ist nötig und darf nicht entfallen (R1).
- Die 383 ms in B aus FA-SEO-03 sind diese Aufgaben im gedrosselten Browser. Ein kleiner Eingriff innerhalb meiner Schreibrechte, der weder Inhalt noch Bild ändert, fehlt.

## GEMEINSAME DATEIEN

- `src/components/seo/seiten-daten.tsx` und `src/components/fahrzeug-anfrage/seiten.tsx` werden von vielen Seiten genutzt.
  - Die Änderung verschiebt nur vier Werte und Funktionen in `rubrik.ts`. Alle bisherigen Importe aus `…/seiten` funktionieren weiter. Das prüft der Test: dieselben Objekte.
  - Zu den Schreibrechten: Das Paket nennt „die Stellen in den Bausteinen der schweren Ansichten, an denen ein Modul nachgeladen wird“. Die Trennung ist kein Nachladen. Sie entfernt ein Modul, das die Ansichten gar nicht brauchen, und ist der größte belegte Hebel. Ich habe sie deshalb gebaut und lege sie dem Orchestrator ausdrücklich zur Abnahme vor (OFFENE FRAGE 5).
- `src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx` ist nur von dieser Ansicht genutzt.
- `next.config.ts`, `package.json`, `src/fonts/schriften.ts`, `globals.css` und `spaet-vorladen.ts` sind unverändert.
- Keine Datei von FA-PLATTFORM-01C ist berührt. Die geänderten Dateien unter `src/lib/orte`, `src/lib/partner`, `auftragsweg.ts` und `src/payload` im Arbeitsbaum stammen von dort.

## PRÜFUNG UND ERGEBNIS

Im Arbeitsbaum über die Datenweiche:
- `sicher.sh --json -- npx vitest run`: **264 Testdateien, 4.122 Tests, alle bestanden** (Exit 0).
  - Im ersten vollen Lauf überschritt der neue Test „./seiten gibt dieselben Werte weiter“ unter Last die 5 s Vorgabezeit für Tests. Er importiert `./seiten` samt Formular.
  - Behoben mit einer Zeitgrenze von 30 s für genau diesen Test, mit Kommentar. Danach war der volle Lauf grün.
- `sicher.sh --json -- npm run typecheck` (`tsc --noEmit`): Exit 0, ohne Fehler.
- `sicher.sh --json -- npm run lint` (`eslint .`): Exit 0, ohne Befund. Nach der letzten Teständerung wiederholt, wieder Exit 0.
- Kein Lauf schlug in Dateien von FA-PLATTFORM-01C fehl.

Build im Versuchsordner mit allen übernommenen Änderungen (Endstand v4b, `inlineCss` wie heute):
- `SM24_INDEXIERUNG=an … npm run build`: Exit 0.
- **181 von 181 Seiten**, statisch erzeugt in 6,5 s.
- Gesamtdauer **51 s** (Wanduhr, unter Last).
- Inhaltlich ist das derselbe Stand wie im Arbeitsbaum: Quelltextvergleich der geänderten Dateien ohne Unterschied. Die beiden neuen Testdateien liegen nur im Arbeitsbaum.

## BELEGE

- **Lastunabhängige Werte:** `protokolle/FA-SEO-03B/gewicht-stand.json`, `gewicht-v4a-rubrik.json`, `gewicht-v1-ohne-inlinecss.json` und `gewicht-nachher.json`. Werkzeug: `experimente/gewicht.mjs`.
- **Lighthouse A:**
  - `leistung-stand-2026-11-16_16-22-43.md` (5 Läufe, 9 Ansichten, Port 3200)
  - `leistung-v4a-rubrik-…md`, `leistung-v1-ohne-inlinecss-…md`, `leistung-v4b-kompaktbild-…md`
  - `leistung-nachher-2026-11-16_17-02-12.md` (Endstand, 5 Läufe, 9 Ansichten, mit Vergleich zum Stand)
- **Lighthouse B:**
  - `leistung-v4a-devtools-…md` und `leistung-v1-ohne-inlinecss-devtools-…md` (Hebel 1, je 5 Läufe)
  - `leistung-stand-devtools-…md` und `leistung-nachher-devtools-…md` (9 Ansichten, je 3 Läufe)
- **Bündelanalyse:**
  - `next analyze --output --snapshot stand` im Versuchsordner, dann `next analyze export --snapshot stand --route <Ansicht>`.
  - Die Kette oben stammt aus `experimente/analyse-kette.mjs`, die Größen aus `analyse-teile.mjs`.
  - Die Schnappschüsse liegen nur im Versuchsordner unter `.next/diagnostics`.
- **Mono-Schnitte:** `mono-schnitte.log`.
- **Spuren zu Hebel 5 und 6:** `spur-aufgaben.log`.
- **Bildvergleich Stand (3200) gegen Endstand (3300)** mit `experimente/bildvergleich.mjs`:
  - Aufbau: neun Ansichten bei 412 und 1280 px, ganze Seite, Bewegung ruhig, nach `document.fonts.ready`.
  - Ergebnis: **18 von 18 Bildern mit 0 abweichenden Pixeln** bei gleicher Größe. `innerText` ist in allen 18 gleich, ebenso die Zahl der Elemente (zum Beispiel Startseite 1.146 zu 1.146, Konfigurator 330 zu 330).
  - Die Liste der geladenen Schriftflächen unterschied sich in 5 Fällen. Betroffen sind nur die Ersatzschriften „SM24 Ersatz …“, in beide Richtungen: ein Zeitpunkt-Effekt beim Tausch, keine Änderung.
  - Ergebnis in `protokolle/roh/FA-SEO-03B/bildvergleich/bildvergleich.json`, die Bilder daneben.

Was die Änderungen ausdrücklich **nicht** geändert haben (Belege oben):
- **Aussehen und Text:** pixelgleich, textgleich und mit gleicher Zahl der Elemente auf allen neun Ansichten bei 412 und 1280 px.
- **CLS:** in A und B in jedem Lauf 0.
- **Schriften, kleinste Textstufe, Schrift der Zeichnungen:** Schriftdateien, `schriften.ts`, `globals.css` und Generatoren sind unberührt.
- **Bedienung der Formulare:**
  - Kein Baustein wird nachgeladen. Assistent, Kontakt und Konfigurator laden dieselben Bausteine wie vorher, nur ohne fremde.
  - Fehlermeldungen, Hilfen und „Zurück“ (FA-QA-02, FA-QA-04B) laufen im unveränderten Code.
  - Die Tests dazu sind Teil des grünen Gesamtlaufs.
- **Strukturdaten:** `SeitenDaten` liefert dieselben Werte aus derselben Funktion. Die Tests zu json-ld, Seiten und Waisen sind grün.
- **Unverändert:** Sicherheitskopfzeilen (`next.config.ts`), Eingangsinszenierung, Hub, der Schalter „Bewegung: ruhig“ und `prefers-reduced-motion`.
- **G5:** Die Attrappen-Zählung zeigt in allen Läufen nur die bekannten abgefangenen Anfragen des Formularschutzes beim Laden, auf Assistent und Kontakt. Nichts ging nach außen.

### Nachmessung durch den Orchestrator auf ruhiger Maschine

Nach dem Build im Arbeitsbaum, Server auf Port 3000:

```
_werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- node _werkstatt/ausbau/werkzeuge/leistung.mjs --ziel _werkstatt/ausbau/protokolle/FA-SEO-03B --roh _werkstatt/ausbau/protokolle/roh/FA-SEO-03B --marke abnahme --laeufe 5 --vorher _werkstatt/ausbau/protokolle/FA-SEO-03B/leistung-stand-2026-11-16_16-22-43.json
_werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- node _werkstatt/ausbau/werkzeuge/leistung.mjs --methode devtools --ziel _werkstatt/ausbau/protokolle/FA-SEO-03B --roh _werkstatt/ausbau/protokolle/roh/FA-SEO-03B --marke abnahme-devtools --laeufe 3 --vorher _werkstatt/ausbau/protokolle/FA-SEO-03B/<leistung-stand-devtools-….json>
node _werkstatt/ausbau/protokolle/FA-SEO-03B/experimente/gewicht.mjs http://localhost:3000
```

Erwartung für `gewicht.mjs`:
- Shop 15 Skripte und rund 221 KB JS gz.
- Konfigurator 17 und rund 253 KB.
- Assistent 18 und rund 278 KB.
- Kontakt 19 und rund 267 KB.
- Die übrigen Ansichten wie der Stand.

Die Stand-Messung (Port 3200) lief unter Last. Für einen sauberen Vergleich sollte sie auf ruhiger Maschine wiederholt werden: dieselben Befehle mit `--basis http://localhost:3200 --marke stand-ruhig`.

## OFFENE FRAGEN

1. **OFFENE FRAGE (Gestaltung, A-003/KERN): Mono-Schnitte.**
   - Alle drei Schnitte stehen in sichtbarem Text, auch im ersten Bildschirm. Belege:
     - 600: Telefonnummer auf der Startseite (412 px), Preise auf der Autoschlüssel-Seite, Maße im Ratgeber, Stückzahlen im Konfigurator.
     - 500: Eyebrows auf allen Ansichten.
   - Weniger Schnitte oder späteres Laden von Mono ändern das Schriftbild sichtbar.
   - Möglicher Gewinn: 500 und 600 auf einen Schnitt zusammenlegen spart 14,9 bis 15,6 KB auf jeder Ansicht, die beide nutzt.
   - Vorschlag: so lassen. Die Mono-Dateien kommen nach Plex Sans, und im gedrosselten Browser liegt der LCP schon bei 1,0 bis 1,2 s.
2. **OFFENE FRAGE (Inhaber oder Technik): Welche Browser muss die Seite tragen?**
   - `AUFTRAG.md`, `KERN.md` und `docs/` sagen dazu nichts.
   - Für den Altbrowser-Code ist die Frage ohne Folgen: Next lädt seinen Polyfill-Baustein unabhängig von den Zielen. Er hat rund 1 KB übertragen; die 13 KB sind die Schätzung von Lighthouse.
   - Vorschlag: die Vorgabe von Next festhalten (Chrome und Edge ab 111, Firefox ab 111, Safari ab 16.4) und den Lighthouse-Hinweis hinnehmen.
3. **OFFENE FRAGE (Technik, gemeinsamer Baustein): Foto-Upload im Assistenten nachladen.**
   - Möglicher Gewinn: die Generatoren und den Upload (laut `next analyze` rund 25 bis 35 KB gz) aus dem ersten Laden des Assistenten nehmen.
   - Voraussetzung: `alsUpload`, `uploadsAbwarten` und ihr gemeinsamer Zustand ziehen aus `src/components/forms/photo-upload.tsx` in ein eigenes Modul (Schreibrecht für diesen gemeinsamen Baustein).
   - Danach in `assistent.tsx` ein `next/dynamic` für `PhotoUpload`, mit Vorladen im Leerlauf nach dem Hydrieren, damit Schritt 8 ohne Warten erscheint.
   - Für Kontakt nicht anwendbar: Der Upload steht dort im ersten, sichtbaren Schritt.
4. **OFFENE FRAGE (Technik oder Gestaltung): Autoschlüssel-Seite.**
   - Ursache: Stil und Layout des langen Dokuments, in 3 bis 4 Aufgaben von 97 bis 176 ms (CPU 4-fach), dazu Hydrieren 154 bis 204 ms.
   - Ein möglicher Weg ist `content-visibility: auto` mit `contain-intrinsic-size` für Abschnitte unterhalb des ersten Bildschirms.
   - Das greift in `globals.css` oder die Abschnitts-Bausteine ein (außerhalb meiner Schreibrechte). Es braucht Prüfungen für Sprungziele, die Suche im Browser, die Scroll-Animationen und CLS.
   - Nicht ohne eigenes Paket.
5. **OFFENE FRAGE (Orchestrator): Abnahme der Trennung `rubrik.ts`.**
   - Das ist kein „Nachladen“ im Wortlaut der Schreibrechte, sondern das Entfernen eines unnötigen Imports. Berührt sind `seiten-daten.tsx` und `fahrzeug-anfrage/seiten.tsx`.
   - Wenn das nicht abgedeckt ist: Die Änderung lässt sich mit den drei Dateien und dem Test vollständig zurücknehmen, ohne dass die Konfigurator-Änderung daran hängt.

## FÜR MENSCHEN

- **Gestaltung:** Sollen Plex Mono 500 und 600 auf einen Schnitt zusammengelegt werden? Das spart rund 15 KB je Seite, ändert aber das Schriftbild (OFFENE FRAGE 1). Vorschlag: nein.
- **Inhaber oder Technik:** Welche Browser die Seite mindestens tragen muss. Vorschlag: die Vorgabe von Next, also Geräte etwa ab 2023 (OFFENE FRAGE 2).

=== ENDE FA-SEO-03B · BEREIT ZUR RÜCKGABE ===
