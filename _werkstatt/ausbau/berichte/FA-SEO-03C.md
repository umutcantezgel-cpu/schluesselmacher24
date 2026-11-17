# Bericht FA-SEO-03C · Mobile Leistung, Teil C: Assistent, Kontakt, Autoschlüssel-Seite

Stand 18.11.2026, 00:30 MEZ. Fortsetzung des Laufs vom 16.11. auf dem Messstand d1615fa (dunkelblaue Farbwelt). Der Zwischenstand aus Commit 034ee11 wurde geprüft, gegen den heutigen Messstand neu vermessen und ist fertig. Nur Hebel 1 ändert Code. Hebel 2 bis 4 sind mit Zahlen belegt, ohne Änderung im Arbeitsbaum.

## GEÄNDERTE DATEIEN

- `src/components/forms/upload-zustand.ts` (neu, aus dem Zwischenstand, unverändert übernommen): Zustand und Hilfen des Foto-Uploads ohne Oberfläche. Dazu gehören `PickedFile`, die Maps `ergebnisse`, `laufend` und `originale`, `neueDateiId`, `alsUpload`, `uploadsAbwarten`, `MAX_UPLOAD_BYTES`, `MAX_AUSWAHL_FOTO_BYTES` und die Hilfen `beispiel*`.
- `src/components/forms/photo-upload.tsx` (Zwischenstand, übernommen): liest den Zustand aus `./upload-zustand` und gibt alle bisherigen Namen unverändert weiter. Die übrigen fünfzehn Formulare bleiben unberührt.
- `src/app/(site)/autoschluessel/anfrage/assistent.tsx` (Zwischenstand, übernommen; nur die Stellen des Uploads):
  - Die Oberfläche `PhotoUpload` kommt per `import()` nach.
  - Nach dem Hydrieren wird sie vorgeladen wie im hauseigenen Muster `useSpaetVorladen`: erst nach `VORLADEN_NACH_MS` (2,5 s), dann im Leerlauf (`requestIdleCallback`, Zeitlimit 2 s), bei „Daten sparen“ gar nicht (Nachbesserung, Befund 5).
  - Solange sie lädt, steht eine ruhige Fläche gleicher Höhe da, mit einem Satz für Vorlesegeräte („Das Feld … wird geladen.“).
  - Scheitert das Laden (keine Verbindung), versucht der Assistent es nach 2 s erneut. Nach drei Fehlversuchen steht auf der Fläche sichtbar „Das Feld „…“ konnte nicht geladen werden. Bitte laden Sie die Seite neu.“ mit dem Knopf „Seite neu laden“; weitere Versuche dann alle 10 s (Nachbesserung, Befund 3).
- `src/components/forms/upload-zustand.test.ts` (neu, 6 Tests):
  - `photo-upload` gibt dieselben Objekte weiter (Muster `rubrik.test.ts`).
  - Es gibt einen gemeinsamen Zustand: `alsUpload` liest die Ergebnisse, die in das Modul geschrieben werden, und `uploadsAbwarten` wartet auch auf gescheiterte Uploads.
  - `upload-zustand.ts` ist kein Client-Baustein. Es importiert nur `@/lib/types` und `@/lib/visual/motiv`, und `motiv.ts` lädt selbst nur Typen.
  - Der Assistent importiert aus `photo-upload` nur den Typ, statisch und ohne Werte. Er nutzt `import()` und lädt im Leerlauf vor.
  - Nachbesserung: Vorladen erst nach `VORLADEN_NACH_MS` und nicht bei „Daten sparen“; sichtbarer Hinweis mit Knopf nach mehreren Ladefehlern.
- Protokolle unter `_werkstatt/ausbau/protokolle/FA-SEO-03C/` (neu am 17./18.11.):
  - `gewicht-stand-1711.json`, `gewicht-hebel1-1711.json`
  - `leistung-stand-1711-2026-11-18_00-04-28.{md,json}`, `leistung-hebel1-1711-2026-11-18_00-06-26.{md,json}`
  - `upload-pruefung-3200-1711.json`, `upload-pruefung-3300-1711.json`
  - `cv-probe-1711.log`, `skriptliste-wandert.log`
  - Versuchsskripte `experimente/netz.mjs`, `experimente/skripte.mjs`, `experimente/diff-teile.mjs`
  - Nachbesserung (18.11.): `gewicht-stand-nachbesserung.json`, `gewicht-nachbesserung.json`, `netz-3200-nachbesserung.log`, `netz-3300-nachbesserung.log`, `upload-pruefung-3200-nachbesserung.json`, `upload-pruefung-3300-nachbesserung.json`, `ladefehler-probe-3300-nachbesserung.json`, `leistung-stand-nachbesserung-2026-11-18_00-33-06.{md,json}`, `leistung-hebel1-nachbesserung-2026-11-18_00-33-47.{md,json}`; Versuchsskript `experimente/ladefehler-probe.mjs`; `experimente/netz.mjs` und `experimente/upload-pruefung.mjs` berichtigt.

Nicht geändert: `globals.css`, `schluessel-fotos.tsx`, die Bausteine der Kontakt- und der Autoschlüssel-Seite, alle gesperrten Pfade.

## WAS UND WARUM

### Vorab: Warum die Skriptliste des Assistenten wandert (Nachtrag A-075)

Belege in `skriptliste-wandert.log`.

**Nachgestellt am frisch gestarteten Messstand:**

| Abruf | Skripte im HTML |
|---|---|
| Assistent | 18 |
| Kontakt | 19 |
| Assistent | 20 |

Die zwei zusätzlichen Dateien sind die Teile von `(site)/error.tsx` und `(site)/not-found.tsx`.

**Ursache:**
- Die Fehlergrenze und die 404-Ansicht der Website sind Client-Bausteine im Layoutbaum jeder Seite unter `(site)`. Next schreibt sie **in jedem Abruf** als I-Zeile mit ihren Teilen in die RSC-Nutzlast, zum Beispiel `4b:I[86979,[…,"$4a"],"default"]` mit `4a:"/_next/static/chunks/2ap808zi3x4kb.js"` und `errorScripts`. Das gilt im frischen wie im späteren Zustand.
- Verschieden ist nur, ob der SSR-Teil auch ein `<script async>` dafür in den Kopf des HTML schreibt. Das geschieht, sobald der Serverprozess diese Module schon einmal geladen hat. Beim Bauen ist das in den Arbeitern fast immer der Fall: 50 von 52 vorgerenderten HTML-Dateien nennen die Teile.
- Das Client-Referenz-Manifest wandert nicht. Next liest es je Route (`next/dist/server/app-render/manifests-singleton.js`, Suche über `workStore.route`, in Produktion ohne Rückgriff auf andere Routen). Für `error.tsx` und `not-found.tsx` nennen Assistent, Kontakt und Shop dieselben Teile.

**Folge für Besucher: keine Mehrlast.** Der Browser lädt die beiden Teile in beiden Zuständen, weil React sie über die I-Zeile der Nutzlast ohnehin anfordert. Gemessen mit `netz.mjs` bei 412 px, bis Netzruhe plus 3 s (seit der Nachbesserung mit Dateiliste und Bytes je Datei aus dem Protokoll von Chromium, `netz-3200-nachbesserung.log`): Der Assistent lädt vor und nach dem Abruf der Kontaktseite dieselben 26 Dateien mit denselben Bytes je Datei, 944,6 KB roh und 317,4 KB übertragen in beiden Zuständen. Der frühere zweite Wert 967,3 KB war ein Messfehler des alten `netz.mjs` (Bytes über `body()`, ohne Dateiliste im Log). Unterschiedlich ist nur, ob die Datei schon aus dem HTML oder erst aus der Nutzlast bekannt wird. Die „bis zu 10 KB mehr“ aus A-075 sind also ein Messeffekt von `gewicht.mjs`, das nur `<script src>` im HTML zählt.

**Abstellen nur für den Assistenten:** nicht ohne Eingriff in die Fehlerbehandlung möglich. Die Grenze müsste aus dem Layout der Website entfernt oder verlegt werden. Das liegt außerhalb dieses Pakets und brächte für Besucher nichts. Die Messregel aus A-075 bleibt: frisch starten, Reihenfolge von `gewicht.mjs`.

### Hebel 1 · Foto-Upload im Assistenten nachladen: übernommen

**Mittel aus der Anleitung von Next** (`01-app/02-guides/lazy-loading.md`): Die Anleitung nennt `next/dynamic` und `React.lazy()`; beide bauen auf dynamischem `import()` auf. Gewählt ist `import()` mit eigenem Zustand statt `next/dynamic`, aus zwei Gründen:
- Die Fläche während des Ladens braucht die Props des Feldes (Beschriftung, Beispiel, Mehrfachwahl), um genau gleich hoch zu sein. `loading` von `next/dynamic` bekommt diese Props nicht.
- Ein schon vorgeladener Baustein erscheint ohne Umweg über Suspense, also ohne einen Rahmen mit Fläche.

Die Oberfläche ist derselbe `PhotoUpload` wie in allen Formularen. Gewählte Dateien liegen weiter im Zustand des Assistenten (`files`) und im gemeinsamen Modul.

| Variante | Skripte im HTML (Assistent) | JS gz im HTML | JS-Dateien im Browser bis Ruhe + 3 s | Lighthouse A, 5 Läufe, Median (Spanne) | TBT Median (Spanne) | CLS |
|---|---|---|---|---|---|---|
| Messstand d1615fa (3200) | 18 | 277,2 KB | 26 / 944,6 KB roh | 84 (84 bis 93) | 193 ms (157 bis 205) | 0 |
| Hebel 1 (3300), 17.11. | 17 | 258,5 KB (−18,7 KB) | 29 / 979,5 KB roh, Upload erst nach `load` im Leerlauf | 90 (84 bis 94) | 138 ms (100 bis 177) | 0 |
| Messstand, Nachmessung 18.11. | 18 | 277,2 KB | 26 / 944,6 KB roh, 317,4 KB übertragen | 88 (87 bis 90) | 180 ms (140 bis 303) | 0 |
| Hebel 1 nach Nachbesserung (3300), 18.11. | 17 | 258,8 KB (−18,4 KB) | 29 / 980,6 KB roh, 332,2 KB übertragen; Upload ab 2,5 s nach dem Hydrieren | 88 (86 bis 92) | 124 ms (96 bis 158) | 0 |

Übertragen im Lighthouse-Lauf (Assistent, Median aus 5 Läufen, alle Läufe gleich):

| Variante | Dateien | JS | Gewicht |
|---|---|---|---|
| Messstand (17.11. und 18.11.) | 28 | 267 KB | 450 KB |
| Hebel 1, 17.11. (Vorladen sofort im Leerlauf) | 30 | 271 KB | 454 KB |
| Hebel 1 nach Nachbesserung (Vorladen nach 2,5 s) | 27 | 248 KB | 431 KB |

Hebel 1 verkürzt die Arbeit vor dem Hydrieren (weniger Skripte im HTML, kürzere TBT); die Gesamtmenge, die der Browser bis zur Ruhe lädt, senkt er nicht, sie steigt sogar leicht (siehe unten). Am 17.11. lag das Vorladen im Messfenster von Lighthouse, deshalb übertrug der Lauf dort mehr als der Messstand. Seit der Nachbesserung fällt das Vorladen hinter das Messfenster; die niedrigeren Zahlen sind also eine Folge des späteren Zeitpunkts, keine Einsparung. Die Spannen des Leistungswerts überlappen sich in allen Varianten.

Weitere Werte:
- Andere Ansichten (`gewicht-*-1711.json`): Startseite, Autoschlüssel, Code, Shop, Ort, Ratgeber und Kontakt bleiben auf ±0,1 KB gleich.
- Der Konfigurator nennt 18 statt 17 Skripte (+0,3 KB gz). Das ist ein anderer Zuschnitt der Teile im Build, kein neues Modul.
- Lighthouse ist nur ein Hinweis: Die unveränderte Kontaktseite zeigte im selben Durchgang 88 gegen 93 Punkte.
- Im Browser lädt die neue Fassung insgesamt 36,0 KB roh mehr (980,6 gegen 944,6 KB) und 14,8 KB übertragen mehr (332,2 gegen 317,4 KB), verteilt auf drei Dateien mehr (29 gegen 26). Die Dateilisten beider Stände stehen in `netz-*-nachbesserung.log`. Das kommt vom Zuschnitt der nachgeladenen Teile. Diese Dateien kommen nach dem Hydrieren, nicht im kritischen Weg. Der Wert 979,5 KB vom 17.11. bestätigt sich (+1,1 KB durch den Code der Nachbesserung).

**Belege der Bedienung** (`upload-pruefung-3200-1711.json` und `-3300-1711.json`; Werkzeug `experimente/upload-pruefung.mjs`, Attrappen nach G5, Bewegung „ruhig“):

Teil A, Weg durchs Formular bei CPU 4-fach und gedrosselter Leitung, Zwischenstand auf Schritt 7:
- Das Teilbündel mit dem Upload kam im Versuch 282 ms nach `load` im Leerlauf, also vor dem Klick auf „Weiter“. Nach der Nachbesserung (Vorladen erst nach 2,5 s) kam es 2.645 ms nach `load`, weiter vor dem Klick (die Probe klickt nach 5 s).
- Schritt 8 „Fotos Ihres Schlüssels“ erschien ohne Fläche (`platzhalterGesehen` 0).
- Eine Datei wurde gewählt, die Attrappe nahm den Upload an. Nach „Zurück“ auf „Was sollen wir für Sie tun?“ und wieder „Weiter“ stand die gewählte Datei noch in der Liste. Die Probe zählt seit der Nachbesserung die Listeneinträge mit dem Dateinamen (`dateiNochDa` 1); der Dateiname kommt als Text zweimal vor (`dateiTextstellen` 2: Name und unsichtbarer Text des Knopfes „… entfernen“). Gleich am Messstand und im Versuch (`upload-pruefung-*-nachbesserung.json`).
- „Später weitermachen“ wurde gefunden.
- Tabfolge mit 12 Stationen, gleich wie am Messstand.
- Keine Fehler in der Konsole.

Teil B, Wiederaufnahme direkt auf Schritt 8, Teilbündel zusätzlich 1,5 s zurückgehalten:
- Bei 412 und 1280 px standen alle vier Upload-Felder zuerst als Fläche da, jeweils genau so hoch wie danach das Feld. Bei 412 px waren es 497,5 / 521,9 / 638,9 / 521,9 px, bei 1280 px 305,6 / 329,9 / 428,0 / 329,9 px.
- Keine Fehler in der Konsole.

Verschiebungen:
- Teil B zeigt in beiden Ständen genau dieselbe Verschiebung beim Wiederherstellen des Zwischenstands: 0,1305 bei 412 px und 0,0885 bei 1280 px, zeitgleich mit dem Sprung auf den gespeicherten Schritt.
- Sie ist also schon im Bestand und nicht vom Platzhalter. Lighthouse misst beim normalen Laden CLS 0 in beiden Ständen.

Unverändert:
- Die Pflichtregel für Unterlagen (R13) liest `files` und `alsUpload` wie bisher.
- Beispielzeichnung und Satz darunter kommen aus derselben Oberfläche. Die Fläche nutzt dieselben Hilfen `beispielFuerFeld` und `beispielSatz`, unsichtbar, nur für die Höhe.
- Fehlermeldungen und Hilfen sind unverändert.

### Hebel 2 · Kontaktseite: nichts übernommen, Befund als OFFENE FRAGE

Bündelanalyse mit `next analyze --output --snapshot hebel1` im Versuch, dann `next analyze export --route …`. Ausgewertet mit `experimente/diff-teile.mjs` gegen `/autoschluessel`: 54 Module und 52,1 KB gz stehen nur auf der Kontaktseite.

| Stelle | gz | Gehört dorthin? |
|---|---|---|
| `forms/photo-upload.tsx` → `ui/image-placeholder.tsx` → `visual/registry.tsx` → 10 Generatoren | 21,5 + 0,9 KB | Sichtbar ist nur eine Zeichnung (Beispiel am Upload im ersten Schritt). Das Register zieht alle Generatoren nach, weil `visualFuerMotiv` für jedes Motiv jeden Generator liefern kann. |
| Formular selbst (`kontakt-formular.tsx`, `flow-shell.tsx`, `use-flow.ts`, `schritt-historie.ts`, Felder, Hilfe, Bestätigung) | rund 18 KB | ja |
| `lib/wege/naechste-schritte.ts` → `lib/einsenden/vorgang.ts` → `lib/versand/varianten.ts`, `lib/wege/nachweis.ts` | 1,7 + 0,7 + 1,6 + 0,4 KB | Nur `SCHRITTE_NACH_ART` wird gebraucht. `istEinsendung` (für `naechsteSchritte`) zieht Vorgangs- und Versandlogik nach. |

Entscheidung:
- Keine Änderung. Der Upload steht im ersten sichtbaren Schritt, und Nachladen sichtbarer Teile ist ausgeschlossen.
- Die Generatoren ließen sich nur trennen, wenn das Beispiel auf dem Server gezeichnet und als Element an das Formular gereicht würde. Das betrifft den gemeinsamen Baustein aller sechzehn Formulare.
- Die Kette über `naechste-schritte.ts` liegt unter `src/lib/wege` und `src/lib/einsenden`, also außerhalb der Schreibrechte.
- Beides steht unter OFFENE FRAGEN.

Lighthouse A, Kontakt, 5 Läufe, unverändert: 88 (88 bis 92) am Messstand gegen 93 (89 bis 93) im Versuch. Die Dateien sind byte-gleich, der Unterschied ist Streuung.

### Hebel 3 · `content-visibility: auto` auf der Autoschlüssel-Seite: verworfen, die Seite bleibt, wie sie ist

Erneut gemessen am Versuchs-Build vom 17.11. (`cv-probe-1711.log`, Werkzeug `experimente/cv-spur.mjs`):
- Die Regel wurde in das ausgelieferte HTML eingesetzt; nichts wurde gebaut.
- 412 × 823, CPU 4-fach, Spur bis 6 s nach `load`, 8 Läufe je Variante im Wechsel.

| Variante | lange Aufgaben | Summe über 50 ms | Stil + Layout | Zeichnen | Hauptthread gesamt |
|---|---|---|---|---|---|
| keine | 4 (3–6) | 317 ms (227–380) | 268,5 ms (252–297) | 189 ms (172–213) | 1.427,5 ms (1.261–1.566) |
| ab `#aufbau` | 3 (3–4) | 219,5 ms (185–272), −31 % | 166,5 ms (161–189), −38 % | 119 ms | 1.231 ms (1.221–1.329), **−14 %** |
| ohne `#leistungen` | 3 (2–5) | 235,5 ms (156–311), −26 % | 205 ms (170–235), −24 % | 140 ms | 1.248 ms (1.185–1.386), **−13 %** |

Entscheidung: nicht übernommen.
- Der Gewinn im Hauptthread insgesamt bleibt mit 13 bis 14 % unter einem Viertel.
- Die Variante „ab `#aufbau`“ schließt `#leistungen` ein. Dort öffnen sich Hinweise (`InfoTip`, absolut positioniert), die die Malbegrenzung von `content-visibility` abschneiden würde. Damit ist der Bildvergleich ohne abweichendes Pixel nicht zu erwarten.
- In der Variante ohne diesen Abschnitt liegt auch der Gewinn bei den langen Aufgaben (−26 %) innerhalb der Spannen.
- Die übrigen Belege (Bildvergleich, CLS beim Ankersprung, Druck, Baum der Zugänglichkeit) wurden deshalb nicht erhoben. `globals.css` bleibt unverändert.
- Lighthouse A, Autoschlüssel, unverändert: 91 (86 bis 93) gegen 91 (87 bis 93).

### Hebel 4 · Was die Bündelanalyse sonst zeigt: nichts übernommen, Stellen genannt

| Ansicht | Stelle (Datei, Zeile) | gz | Befund |
|---|---|---|---|
| Kontakt und alle Formulare mit `SCHRITTE_*` | `src/lib/wege/naechste-schritte.ts:11` (`import { istEinsendung } from '@/lib/einsenden/vorgang'`) | 2,7 KB (`vorgang.ts` 0,7, `versand/varianten.ts` 1,6, `wege/nachweis.ts` 0,4) | Nur `naechsteSchritte()` braucht es. Die Formulare lesen nur die Listen. Möglich wäre eine Datei mit den Listen ohne diese Importe; außerhalb der Schreibrechte. |
| Kontakt und alle Formulare mit `SCHRITTE_*` | `src/lib/wege/naechste-schritte.ts:12` (`import { istFotoanfrage } from '@/lib/foto-freigabe'`) | 0,08 KB (`foto-freigabe.ts` nach dem Baumschütteln, nur `istFotoanfrage`) | Ebenfalls nur für `naechsteSchritte()`. Zusammen mit Zeile 11: rund 2,8 KB gz. |
| Assistent | `src/components/autoschluessel/optionen.ts:1` (`fahrzeugVorOrtNoetig` aus `@/lib/pricing`) → `src/lib/pricing.ts:17` → `cylinder-rules.ts` → `konfigurator/preisbestaetigung.ts` | rund 2,7 KB (`pricing` 0,9, `cylinder-rules` 1,1, `preisbestaetigung` 0,7) | Zylinder- und Konfiguratorlogik im Assistenten. Zu prüfen ist, ob `fahrzeugVorOrtNoetig` ohne `cylinder-rules` stehen kann; außerhalb der Schreibrechte (Preislogik, G9-nah). |
| alle Seiten unter `(site)` | `error.tsx`, `not-found.tsx` → `layout/fehler-ansicht.tsx` → `generators/stiftzuhaltung.tsx`, `profillinie.tsx` | rund 10,5 KB | Wird über die Nutzlast immer geladen (siehe oben). Gewollt seit E7-L-39: einmal im Bündel statt in jeder Nutzlast. Keine Änderung. |

Sonst lädt keine der neun Ansichten Module, die dort nicht gebraucht werden und die die Regel aus A-071 trennen könnte, ohne gesperrte Pfade zu berühren.

## GEMEINSAME DATEIEN

- `src/components/forms/photo-upload.tsx`: gemeinsamer Baustein von sechzehn Formularen. Seine Schnittstelle ist gleich geblieben, alle bisherigen Namen werden weitergegeben. Belegt durch `upload-zustand.test.ts` (dieselben Objekte) und die unveränderten 22 Tests in `photo-upload.test.tsx`.
- `src/components/forms/upload-zustand.ts`: neu. Die Maps sind Modulzustand. Da `photo-upload.tsx` aus demselben Modul liest, bleibt es ein gemeinsamer Zustand, auch über Formulare hinweg.

## PRÜFUNG UND ERGEBNIS

Im Arbeitsbaum über die Datenweiche:
- `sicher.sh --json -- npx vitest run`: **275 Testdateien, 4.307 Tests, alle grün** (nach der Nachbesserung). Davon `src/components/forms` und `…/autoschluessel/anfrage`: 7 Dateien, 135 Tests (129 vorher + 6 neu).
- `sicher.sh --json -- npm run typecheck` (`tsc --noEmit`): ohne Fehler.
- `sicher.sh --json -- npm run lint` (`eslint .`): ohne Befund.

Build im Versuchsordner `/home/user/sm24-versuch` mit allen übernommenen Änderungen:
- `npm run build`, Exit 0
- „Compiled successfully in 34.9s“, 190 von 190 Seiten in 4,2 s, gesamt rund 71 s
- Nach der Nachbesserung erneut: Exit 0, „Compiled successfully in 9.3s“, 190 von 190 Seiten in 4,2 s, gesamt 42 s

Server:
- Der Versuchsserver (3300) ist beendet.
- Der Messstand (3200) läuft frisch gestartet weiter, wie vor dem Paket. Seine Dateien sind unverändert.

## BELEGE

Befehle zum Nachmessen auf ruhiger Maschine:

```
# Server frisch starten (A-075), dann Gewicht
pkill -f "next start -p 3200"; fuser -k 3200/tcp
cd /home/user/sm24-messstand && SM24_INDEXIERUNG=an SICHER_WURZEL=/home/user/sm24-messstand SICHER_PORT=3200 nohup /home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx next start -p 3200 > /tmp/sm24-messstand.log 2>&1 &
cd /home/user/schluesselmacher24 && _werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- node _werkstatt/ausbau/protokolle/FA-SEO-03B/experimente/gewicht.mjs http://localhost:3200
#   dasselbe mit /home/user/sm24-versuch und Port 3300

# Lighthouse A, 5 Läufe
_werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- node _werkstatt/ausbau/werkzeuge/leistung.mjs --basis http://localhost:3300 --ansichten /autoschluessel/anfrage,/service-und-termin/kontakt,/autoschluessel --laeufe 5 --marke nachher

# Bedienprobe Upload (Attrappen)
BASIS=http://localhost:3300 _werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- node _werkstatt/ausbau/protokolle/FA-SEO-03C/experimente/upload-pruefung.mjs

# Wandernde Skriptliste
node _werkstatt/ausbau/protokolle/FA-SEO-03C/experimente/skripte.mjs http://localhost:3200 /autoschluessel/anfrage /service-und-termin/kontakt /autoschluessel/anfrage
SM24_BASIS_URL=http://localhost:3200 _werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- node _werkstatt/ausbau/protokolle/FA-SEO-03C/experimente/netz.mjs http://localhost:3200 /autoschluessel/anfrage

# content-visibility
BASIS=http://localhost:3300 _werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- node _werkstatt/ausbau/protokolle/FA-SEO-03C/experimente/cv-spur.mjs /autoschluessel 8 keine,ab-aufbau,ohne-leistungen
```

Ältere Protokolle vom 16.11. (oranger Stand) bleiben zum Nachvollziehen liegen:
- `gewicht-stand.json`, `gewicht-v1-upload.json`, `gewicht-nachher.json`
- `leistung-*-2026-11-16_*`
- `upload-pruefung-3200.json`, `upload-pruefung-3300.json`
- `assistent-spur.log`, `cv-vorprobe*.log`

Ihre lastunabhängigen Werte stimmen mit denen vom 17./18.11. überein: Assistent 18 → 17 Skripte, 277,2 → 258,5 KB.

## OFFENE FRAGEN

1. **OFFENE FRAGE (Technik, gemeinsamer Baustein, Stufe 3): Zeichnungen am Upload ohne Register.** Auf der Kontaktseite und den übrigen Formularseiten mit Upload im ersten Schritt hängen über `ImagePlaceholder` alle zehn Generatoren am Client-Bündel (21,5 KB gz plus Register 0,9 KB), obwohl je Feld eine Zeichnung erscheint.
   - Möglicher Weg: das Beispiel auf dem Server zeichnen und als Element an `PhotoUpload` reichen. Das ist ein Eingriff in sechzehn Formulare und ihre Seiten.
   - Alternative: Die Upload-Beispiele auf die Zeichnungen beschränken, die Steckplätze und Beispielmotive tatsächlich liefern (`foto-beispiel` und andere), und `photo-upload.tsx` nur diese importieren lassen. Dafür muss feststehen, welche Motive an Upload-Feldern vorkommen.
2. **OFFENE FRAGE (Technik, Schreibrecht `src/lib/wege`):** `naechste-schritte.ts` trennen in Listen (Werte) und `naechsteSchritte()` (mit `istEinsendung` und `istFotoanfrage`). Spart rund 2,8 KB gz auf der Kontaktseite und allen Formularen, die nur `SCHRITTE_*` lesen (2,7 KB über `istEinsendung`, 0,08 KB über `istFotoanfrage`).
3. **OFFENE FRAGE (Technik, Preislogik, G9-nah):** Im Assistenten zieht `optionen.ts` über `fahrzeugVorOrtNoetig` aus `lib/pricing.ts` die Zylinder- und Konfiguratorregeln nach (rund 2,7 KB gz). Ändern nur mit Schreibrecht und ohne Wirkung auf Preise.
4. **Hinweis aus der Bedienprobe (schon im Bestand, nicht aus diesem Paket):**
   - Beim Wiederaufnehmen eines gespeicherten Zwischenstands direkt auf Schritt 8 verschiebt sich die Seite einmal: 0,13 bei 412 px, 0,09 bei 1280 px, in Messstand und Versuch gleich.
   - Die Probe las nach dem Schrittwechsel `document.activeElement` als `body`, in beiden Ständen gleich.
   - Beides prüft besser ein Paket zu Bedienbarkeit oder Wiederaufnahme.

## Nachbesserung (18.11.2026, Befunde zweier Gegenprüfer)

Alle Messungen am frisch gestarteten Messstand (3200) und am neu gebauten Versuch (3300), Reihenfolge nach A-075. Der Versuchsserver ist danach beendet, der Messstand läuft frisch gestartet weiter.

1. **[rot] „beide Dateien noch da“ (Bericht, Teil A): behoben.** Der Befund stimmt: Gewählt war eine Datei, `dateiNochDa` zählte Textstellen, und der Name steht auch im unsichtbaren Text des Knopfes „… entfernen“. `experimente/upload-pruefung.mjs` zählt jetzt Listeneinträge (`li` mit dem Dateinamen) und gibt die Textstellen getrennt aus. Neu gemessen: `dateiNochDa` 1, `dateiTextstellen` 2, an beiden Ständen. Der Satz im Bericht ist berichtigt.
2. **[gelb] „keine Mehrlast … dieselben 26 Dateien“ nicht sauber belegt: behoben.** Der Befund stimmt: Das alte `netz.mjs` zählte Bytes über `r.body()` mit stillem 0 und schrieb keine Dateiliste. Es misst jetzt über das Protokoll von Chromium (`encodedDataLength` bei `loadingFinished`, Rohgröße über `getResponseBody`), meldet Dateien ohne Größe ausdrücklich (`ohneGroesse`, hier leer) und schreibt jede Datei mit Roh- und Übertragungsgröße ins Log. Ergebnis: Assistent vor und nach dem Abruf der Kontaktseite dieselben 26 Dateien mit identischen Größen, 944,6 KB roh, 317,4 KB übertragen. 944,6 KB ist bestätigt, 967,3 KB war ein Messfehler. Versuch: 29 Dateien, 980,6 KB roh, 332,2 KB übertragen (17.11.: 979,5 KB; +1,1 KB durch den Code der Nachbesserung). Damit sind es 36,0 KB roh mehr, nicht „rund 35 KB“; der Satz ist berichtigt und um die übertragenen 14,8 KB ergänzt.
3. **[gelb] Endlose Versuche ohne sichtbaren Text: behoben.** Der Befund stimmt (Wiederholung alle 2 s ohne Ende, Text nur für Vorlesegeräte). Nach drei Fehlversuchen steht jetzt auf der Fläche, sichtbar und als `role="alert"`: „Das Feld „…“ konnte nicht geladen werden.“ / „Bitte laden Sie die Seite neu.“ und der Knopf „Seite neu laden“ (`window.location.reload()`). Danach wird alle 10 s weiter versucht, damit das Feld bei wiederkehrender Verbindung von selbst erscheint. Die Höhe der Fläche bleibt gleich (Hinweis liegt oben über der Fläche). Belegt mit `experimente/ladefehler-probe.mjs` (Teilbündel mit 404 beantwortet, Zwischenstand auf Schritt 9): Hinweis nach rund 5,7 s sichtbar bei 412 und 1280 px, Knopf vorn und mit der Tastatur erreichbar, Enter lädt die Seite neu, Höhe vorher und nachher gleich (583,5 und 392,5 px), keine Fehler in der Konsole. Die Angaben bleiben dabei auf dem Gerät gespeichert, wie es die Hilfe „Später weitermachen“ schon sagt; Fotos müssen danach neu gewählt werden, auch das sagt sie. Der Wortlaut des Hinweises braucht eine Freigabe (FÜR MENSCHEN).
4. **[gelb] Hebel 4 ohne `istFotoanfrage`: behoben.** Der Befund stimmt: `naechste-schritte.ts:12` importiert `istFotoanfrage` aus `@/lib/foto-freigabe`. Aus der Bündelanalyse der Kontaktseite: `foto-freigabe.ts` trägt nach dem Baumschütteln nur 0,08 KB gz bei. Die Zeile steht jetzt in der Tabelle, die Summe in der offenen Frage 2 ist auf rund 2,8 KB angeglichen.
5. **[gelb] Vorladen ohne „Daten sparen“ und ohne `VORLADEN_NACH_MS`: behoben.** Der Befund stimmt. Das Vorladen folgt jetzt `useSpaetVorladen`: bei `navigator.connection.saveData` gar nicht (der Schritt lädt dann selbst nach und zeigt so lange die Fläche), sonst `setTimeout(VORLADEN_NACH_MS)` (2,5 s, aus `@/lib/spaet-vorladen` importiert), dann `requestIdleCallback` mit Zeitlimit 2 s. Gemessen: Teilbündel 2.645 ms nach `load`, weiter vor dem Klick auf „Weiter“; Schritt 8 erschien ohne Fläche, Höhen der Fläche in Teil B unverändert gleich den Feldern (412 px: 497,5 / 521,9 / 638,9 / 521,9; 1280 px: 305,6 / 329,9 / 428,0 / 329,9), Tabfolge 12 Stationen, keine Fehler in der Konsole. Skripte im HTML 17, 258,8 KB gz (+0,3 KB gegen den 17.11.).
6. **[gelb] Fehlermeldung (`error`) im Platzhalter unsichtbar: nicht zutreffend, nichts geändert.** Der Assistent reicht keinem seiner fünf `PhotoUpload` ein `error` weiter (Schritt 8 und 9, Zeilen mit `<PhotoUpload`); die Pflichtmeldung zur Unterlage (R13, FA-QA-02) kommt über `blockedHint` der Formularleiste (`FlowShell`), außerhalb des Feldes, und ist während des Ladens sichtbar und hörbar wie vorher. Das `error` in der Vorlage dient nur der Höhe, falls ein späterer Aufruf es setzt.
7. **[gelb] Lighthouse-Übertragung zu Hebel 1 fehlt: behoben.** Der Befund stimmt für den Lauf vom 17.11. (30 statt 28 Dateien, JS 271 statt 267 KB, Gewicht 454 statt 450 KB, weil das Vorladen im Messfenster lag). Die Werte stehen jetzt in einer eigenen Tabelle bei Hebel 1, zusammen mit der Nachmessung vom 18.11. (Messstand 28 / 267 / 450, Hebel 1 nach Nachbesserung 27 / 248 / 431, weil das Vorladen jetzt hinter dem Messfenster liegt). Der Bericht sagt jetzt ausdrücklich: Hebel 1 verkürzt die Arbeit vor dem Hydrieren und senkt die Gesamtmenge nicht.

Prüfung nach der Nachbesserung im Arbeitsbaum über die Datenweiche: `npx vitest run` 275 Dateien, 4.307 Tests grün; `npm run typecheck` ohne Fehler; `npm run lint` ohne Befund. Build im Versuch: Exit 0, 190 von 190 Seiten, 42 s.

## FÜR MENSCHEN

- Freigabe des Wortlauts (Nachbesserung, Befund 3): Nach drei gescheiterten Ladeversuchen zeigt das Upload-Feld im Autoschlüssel-Assistenten „Das Feld „…“ konnte nicht geladen werden.“, „Bitte laden Sie die Seite neu.“ und den Knopf „Seite neu laden“. Sonst wurden keine Preise, Texte oder Rechtstexte berührt.
- Die offenen Fragen 1 bis 3 sind technische Entscheidungen für den Orchestrator: Schreibrechte, Stufe 3.

## Abnahme durch den Orchestrator (18.11.2026)

**Ergebnis: Das Paket ist abgeschlossen, ohne Änderung am Quelltext. Hebel 1 ist gemessen und verworfen; der Quelltext unter `src` steht wieder auf dem Stand vor dem Paket (wie Commit d1615fa).** Bericht, Protokolle und Versuchsskripte bleiben als Beleg. Der unfertige Stand vom 16.11. liegt weiter auf dem Zweig `rettung/fa-seo-03c-zwischenstand`, der vollständige Versuch in Commit 034ee11 und im Verlauf danach.

Nachmessung auf ruhiger Maschine (frisch gestartete Server, alter und neuer Stand im Wechsel):
| Wert | ohne Hebel 1 | mit Hebel 1 |
|---|---|---|
| Skripte im HTML des Assistenten | 18, 277,2 KB | 17, 258,8 KB |
| Vom Browser geladen, 1,5 s nach dem Laden | 19 Dateien, 267,4 KB | 18 Dateien, 248,1 KB (−19,3 KB) |
| Vom Browser geladen, 7 s nach dem Laden | 26 Dateien, 317,4 KB | 29 Dateien, 332,2 KB (+14,8 KB) |
| Lighthouse Leistung (10 Läufe) | 88,5 (85 bis 92) | 88 (86 bis 92) |
| TBT | 178 ms (118 bis 259) | 146 ms (87 bis 192) |
| LCP | 3,40 s (2,97 bis 4,09) | 3,69 s (2,86 bis 3,96) |
| FCP | 5 von 10 Läufen bei 1,0 bis 1,4 s, sonst 1,66 s | 9 von 10 Läufen bei 1,66 s |
| Zylinder-Konfigurator, Skripte im HTML | 17, 252,9 KB | 18, 253,2 KB |
Die Zahlen des Baumeisters sind damit bestätigt. Die Bedienproben am Build des Arbeitsbaums bestanden (Datei bleibt beim Zurück- und Vorgehen, Fläche und Feld gleich hoch, Fehlerhinweis nach etwa 5,8 s mit Knopf, keine Konsolenfehler; 14 Formulare laden und wechseln den Schritt).

Warum verworfen (eigene Abwägung und eine Jury aus drei unabhängigen Blickwinkeln: Kunde, Wartung, Vorgabe des Inhabers; zweimal „verwerfen“, einmal „nur die Aufteilung behalten, das Nachladen verwerfen“):
- Was Kunden sehen, wird nicht schneller: Der Leistungswert bleibt gleich, FCP und LCP zeigen eher in die falsche Richtung, der Gewinn bei der Übertragung am Anfang ist rund eine Zehntelsekunde bei 1,6 Mbit/s.
- Insgesamt lädt das Telefon mehr (14,8 KB und drei Dateien); wer mobile Daten nutzt, zahlt drauf.
- Im wichtigsten Formular entstünde ein neuer Fehlerweg genau im Schritt mit dem Berechtigungsnachweis (R13): Bei „Daten sparen“, schwacher Verbindung oder einer neuen Fassung der Seite stünde dort erst eine graue Fläche und dann „Seite neu laden“.
- 238 Zeilen mehr im Assistenten, darunter eine von Hand nachgebaute Kopie des Upload-Feldes für die Höhe der Fläche; das Feld teilen sich 16 Formulare, und kein Test hielte Kopie und Feld zusammen.
- Die Aufteilung in `upload-zustand.ts` allein spart nichts und erzeugt im Konfigurator eine Datei mehr; sie kommt wieder, wenn ein Paket sie braucht.
Das entspricht der Vorgabe des Inhabers: „echte Inhalte, Nutzbarkeit und saubere Technik gehen vor künstlichem Score Tuning“.

Was aus dem Paket bleibt:
1. **Die wandernde Skriptliste ist ein Messeffekt** (berichtigt A-075): Der Browser lädt auf dem Assistenten in beiden Zuständen des Servers dieselben Dateien mit denselben Bytes (nachgemessen: 19 Dateien und 267,4 KB nach 1,5 s, 26 und 317,4 KB nach 7 s, gleich ob der Server vorher die Kontaktseite erzeugt hat). Nur die Zahl der `<script>`-Zeilen im HTML ändert sich. Für Besucher gibt es keine Mehrlast.
2. **Hebel, die die Gesamtmenge wirklich senken würden** (nächstes Paket FA-SEO-03D): Die Beispielzeichnungen am Upload-Feld ziehen das Register aller zehn Generatoren in jedes Formular mit Upload (21,5 KB komprimiert auf der Kontaktseite, sichtbar ist eine Zeichnung); `naechste-schritte.ts` mischt Listen und Logik (rund 2,8 KB auf Formularen, die nur die Listen lesen); `optionen.ts` zieht über die Preislogik die Zylinder- und Konfiguratorregeln in den Assistenten (rund 2,7 KB).
3. **Hebel 3 (`content-visibility` auf der Autoschlüssel-Seite)** bleibt verworfen: 13 bis 14 Prozent weniger Arbeit im Hauptthread, unter der Schwelle von einem Viertel.
4. **Zwei Mängel am Bestand, gefunden von der Bedienprobe** (im Stand davor genauso; vorgemerkt als FA-QA-04E): Nach „Weiter“ und „Zurück“ liegt der Tastaturfokus auf der Seite selbst statt auf der Überschrift des neuen Schritts; wer einen Zwischenstand direkt auf Schritt 8 fortsetzt, sieht die Seite einmal springen (Layoutverschiebung 0,13 bei 412 px, 0,09 bei 1280 px).

Prüfkette nach dem Zurücksetzen: in STATUS.md.

