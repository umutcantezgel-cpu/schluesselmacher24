# FA-SEO-03 · Mobile Leistung: messen mit festem Maßstab, Ursachen an der Startseite

Stand 16.11.2026 · Anforderungen FA-25-13, FA-25-15 · Messstand `http://localhost:3200` (Produktions-Build vom Commit 321f64b, Ordner `/home/user/sm24-messstand`). Ich habe keinen Server gestartet, nichts gebaut, keinen git-Befehl ausgeführt, der etwas ändert, und auf Port 3000 nichts gemessen.

Ergebnis in drei Sätzen: Das Messwerkzeug steht, der Maßstab ist festgelegt, und alle neun Ansichten sind doppelt gemessen. Der größte sichtbare Inhalt ist auf jeder Ansicht ein Text, der im ersten Zeichnen erscheint (gemessen LCP = FCP, 1,0 bis 1,2 s, CLS 0). Die Eingangsinszenierung hält die erste Ansicht nicht auf. Sie kostet aber Hauptthread-Zeit, und diese lässt sich nicht ohne sichtbare Folgen verschieben. Ich habe deshalb am Code der Startseite nichts geändert. Die Entscheidung steht als OFFENE FRAGE 1 unten.

## GEÄNDERTE DATEIEN

- `_werkstatt/ausbau/werkzeuge/leistung.mjs` (neu): das Messwerkzeug.
- `_werkstatt/ausbau/werkzeuge/leistung.test.mjs` (neu): der Selbsttest, 13 von 13 bestanden.
- `_werkstatt/ausbau/berichte/FA-SEO-03.md` (dieser Bericht).
- Rohdaten unter `_werkstatt/ausbau/protokolle/FA-SEO-03/`:
  - `leistung-vorher-2026-11-16_14-43-27.json` und `.md`: Maßstab A (simuliert)
  - `leistung-vorher-devtools-2026-11-16_15-05-28.json` und `.md`: Maßstab B (im Browser gedrosselt)
  - `vorher-konsole.log` und `vorher-devtools-konsole.log`
  - `experiment-bewegung-lighthouse.log`
  - `experimente/` mit den Versuchsskripten `lh-modi.mjs`, `spur2.mjs`, `startzeit.mjs` und `anim.mjs`. Sie verweisen auf meinen Arbeitsordner und liegen hier nur zum Nachvollziehen.
- Volle Lighthouse-Ergebnisse unter `protokolle/roh/FA-SEO-03/` (54 Dateien, 14 MB). Dieser Ordner steht in `.gitignore` und wird nicht committet.

An `src/**`, `next.config`, Abhängigkeiten, Texten und Daten habe ich nichts geändert.

## WAS UND WARUM

### 1. Werkzeug und Maßstab (FA-25-13)

`leistung.mjs` folgt dem Muster von `onpage.mjs`, `lighthouse.mjs` und `leistung-diagnose.mjs`:

- **Ablauf:** Je Lauf startet ein frischer Chrome aus `/opt/pw-browsers` mit `--headless=new --no-sandbox --disable-gpu`. Die Attrappen nach G5 (`attrappenSetzen`) sind aktiv. Gemessen wird nur die Kategorie Leistung.
- **Basis:** Die Adresse kommt aus `--basis`, sonst aus der Umgebungsvariable `BASIS`, sonst gilt `http://localhost:3000`. Erlaubt ist nur localhost (G1).
  - Damit die Attrappen fremde Ursprünge richtig erkennen, setzt das Werkzeug `SM24_BASIS_URL` selbst, bevor es `lib.mjs` lädt.
  - Deshalb hat es eine eigene Fassung von `argumente()`.
- **Neun Ansichten (So bauen, Punkt 1):**
  - `/`
  - `/autoschluessel`
  - `/autoschluessel/anfrage` (Assistent)
  - `/schluessel-nach-code` (mit Liste)
  - `/gleichschliessende-zylinder/konfigurator`
  - `/shop`
  - `/standorte/wetzlar`
  - `/ratgeber/zylinder-richtig-ausmessen`
  - `/service-und-termin/kontakt`
- **Kennwerte je Lauf:**
  - Leistung, FCP, LCP, Speed Index, TBT, CLS
  - Gewicht und Zahl der Dateien, JS-Gewicht, HTML-Gewicht (Übertragung)
- **Ursachen aus dem Medianlauf:**
  - LCP-Element mit Phasen
  - blockierende Dateien
  - Skripte mit Ausführungszeit und ungenutztem Anteil
  - lange Aufgaben, Verschiebungen
  - Leistungsbefunde mit einem Wert unter 0,9
- **Ausgabe:** JSON und Markdown nach `protokolle/FA-SEO-03/`, volle LHR nach `protokolle/roh/FA-SEO-03/`. Mit `--vorher <json>` kommt eine Vergleichstabelle hinzu.

**Festgelegter Maßstab (Labor):**

| | Maßstab A (Standard, `--methode simulate`) | Maßstab B (`--methode devtools`) |
|---|---|---|
| Werkzeug | Lighthouse 12.6.1 aus `/root/sm24-werkzeuge`, Chrome 153 | dasselbe |
| Geräteprofil | Lighthouse mobil: 412 × 823, DPR 1,75, Touch | dasselbe |
| Drosselung | simuliert (Lantern): Rundlaufzeit 150 ms, 1.638,4 kbit/s, CPU 4-fach | im Browser angewandt: Latenz 562,5 ms je Anfrage, 1.474,6 kbit/s herunter, 675 kbit/s hinauf, CPU 4-fach |
| Läufe | 3 je Ansicht, Median je Kennwert; die Ursachen stammen aus dem Medianlauf (mittlere Leistung, bei Gleichstand der niedrigere LCP) | dasselbe |
| Zweck | vergleichbar mit PageSpeed Insights | zeigt, wann Inhalt im gedrosselten Browser wirklich erscheint |

Maßstab A bleibt der Standard. Maßstab B habe ich ergänzt, weil der Befund unten zeigt, dass Maßstab A beim LCP vor allem das Gewicht der Seite misst.

### 2. Ursachen je Ansicht (Belege mit Zahlen)

**Befund 1: Der LCP ist auf allen neun Ansichten ein Text, der mit dem ersten Zeichnen erscheint.**
- In jedem Lauf beobachtet Lighthouse LCP = FCP: auf der Startseite 292 bis 317 ms ungedrosselt.
- Mit Maßstab B gilt auf allen Ansichten LCP = FCP = 1.004 bis 1.227 ms (Median).
- Das LCP-Element ist die Hub-Frage `h1#hub-frage` oder ein Einleitungsabsatz. Die LCP-Phasen von Maßstab A: Ladeverzögerung 0 ms und Ladedauer 0 ms. Es gibt also kein Bild, auf das der LCP wartet.

**Befund 2: Der simulierte LCP (2,8 bis 3,8 s) misst vor allem, wie viel bis zum ersten Zeichnen angefordert ist.**
- Lantern rechnet zum LCP jede Anfrage, die im beobachteten Lauf vor dem LCP begann.
- Auf der Startseite sind das:
  - HTML 79,5 KB
  - Plex Sans 45 KB, vorgeladen
  - drei Plex-Mono-Schnitte mit zusammen 46 KB, Priorität „VeryHigh“, aus dem Inline-CSS bei rund 185 ms angefordert
  - 13 Skripte mit 192 KB, Priorität „Low“
- Zusammen 367,5 KB in 20 Dateien. Bei 1.474,6 kbit/s ergibt das rund 2 s reine Übertragung.
- Deshalb verfehlen alle neun Ansichten die Grenze LCP 2,5 s nur in Maßstab A. Die Rangfolge folgt dem JS-Gewicht: Assistent 281,7 KB mit LCP 3,8 s, Kontakt 263,8 KB mit 3,8 s.

**Befund 3: Die Startseite hat das schwerste HTML und den meisten Hauptthread.**
- HTML 515 KB roh, 79,5 KB übertragen. Die anderen Ansichten liegen bei 52 bis 75 KB.
  - Davon RSC-Nutzlast 292 KB roh, 43 KB gz; Markup 139 KB roh, 20,5 KB gz.
  - Der Abstand zum Shop: Markup +12,7 KB gz, Nutzlast +14,7 KB gz. Die Startseite trägt schlicht mehr Inhalt: 8 Abschnitte, 68 SVG, 1.161 Elemente.
- In der RSC-Nutzlast **jeder** Seite steht das ganze CSS ein zweites Mal: 81 KB roh, rund 16 KB gz. Das ist eine Nebenwirkung von `experimental.inlineCss` (OFFENE FRAGE 2).
- Hauptthread im Medianlauf (Maßstab A): Startseite 3.202 ms, die übrigen Ansichten 1.446 bis 2.836 ms.

**Befund 4: Die Eingangsinszenierung (B-31) verursacht den Mehraufwand der Startseite im Hauptthread, hält aber weder LCP noch Hub auf.**
- Die Animation verschiebt SVG-Gruppen mit `transform`. Chromium muss dafür in jedem Bild Stil, SVG-Layout und Zeichnen auf dem Hauptthread neu rechnen; Ursache laut Spur: „SVG changed“, „Animation“.
- Spur bei 412 × 823 und CPU 4-fach über 5 s, je zwei Läufe:
  - Bewegung an: 44 bis 50 Layouts, 66 bis 85 Zeichnungen, Aufgaben 1,65 bis 2,3 s
  - nur die Eingangsanimation abgeschaltet: 7 bis 8 Layouts, 17 bis 18 Zeichnungen, Aufgaben 1,33 bis 1,87 s
- `contain: layout paint style` an der Szene und `transform-box: view-box` verringern das nicht (Versuch, je zwei Läufe).
- Lighthouse mit Maßstab A, je 5 Läufe auf `/`, Median. Die Varianten habe ich per Init-Skript und konstruierbarem Stylesheet eingespielt, nicht im Code:

| Variante | Leistung | LCP ms | TBT ms | Hauptthread ms |
|---|---|---|---|---|
| wie ausgeliefert (Bewegung an) | 89 | 2.720 | 167 | 2.868 |
| ohne Eingangsanimation | 89 | 3.273 | 202 | 1.934 |
| Eingangsanimation erst nach `load` und Leerlauf gestartet | 88 | 2.789 | 255 | 2.483 |
| Bewegung ruhig | 89 | 2.790 | 276 | 1.908 |

  - Die Animation kostet rund 0,9 s Hauptthread.
  - Leistung, LCP und TBT ändern sich im Rahmen der Streuung **nicht**. Die Bilder der Animation sind kurze Aufgaben unter 50 ms, und das LCP-Element ist schon gezeichnet.
  - Speed Index = FCP: Die erste Ansicht steht im ersten Bild vollständig.
  - CLS ist auf allen Ansichten 0. Der Hub springt nicht.
- Die Fräsbahn (B-01) startet erst, wenn sie zur Hälfte sichtbar ist. Bei 412 × 823 liegt sie unter dem ersten Bildschirm und läuft beim Laden nicht.
- Ihr Code liegt mit HubWechselMerker, InView, Dauerschleife und Seitenwechsel im Seitenbündel `36_03ed5otp0s.js`: 21,5 KB roh, 8,8 KB übertragen, ohne messbare Ausführungszeit. Nachladen brächte rund 2 KB.

**Befund 5: Weitere Ursachen, alle seitenübergreifend.**
- `unused-javascript` 25 bis 28 KB und `legacy-javascript` 13 bis 14 KB in den gemeinsamen Bündeln.
- Lange Aufgaben bei rund 3,2 bis 3,9 s simuliert in den gemeinsamen Bündeln (`262uxxszab7p8.js`, `17_pbdm6y2ffj.js`) mit 141 bis 194 ms auf allen Ansichten. Zeitlich passt das zum späten Vorladen der Navigation (`useSpaetVorladen`, 2,5 s nach dem Laden). Das ist nicht belegt (OFFENE FRAGE 5).
- Der Shop, die Ortsseite und der Ratgeber melden `unused-css-rules` mit rund 12 KB.
- Bilder: In der ersten Ansicht der neun Ansichten steht kein Rasterbild. Die Zeichnungen sind Inline-SVG. Bildgrößen geben deshalb nichts her.
- Vorladen: Plex Sans ist vorgeladen. Die Mono-Schnitte findet der Browser schon im Inline-CSS, bei rund 185 ms mit höchster Priorität. Ein weiteres Vorladen brächte nichts.

### 3. Beheben an der Startseite (FA-25-15): bewusst keine Codeänderung

Die naheliegende Behebung lautet: Die Eingangsanimation bis nach dem Hydrieren anhalten (Startbild), dann starten. Ich habe sie gebaut und gemessen, aber nicht eingebaut. Die Gründe:

1. **Sie bringt keinen Messgewinn.** Leistung, LCP und TBT bleiben gleich (Tabelle oben). Nur der Hauptthread sinkt im Ladefenster, um rund 0,4 s.
2. **Sie ändert, was Kunden sehen.** Das Startskript (`src/lib/bewegung.ts`, Auftrag 12) zeigt nach 2 s das Endbild. Die Animation dauert 1,47 s und muss also bis 0,53 s nach dem Navigationsstart beginnen.
   - Bei CPU 4-fach endet das Hydrieren erst nach 1,09 bis 1,49 s, bei 6-fach nach 1,85 bis 2,04 s (ungedrosselt 0,31 bis 0,37 s). Gemessen mit `experimente/startzeit.mjs`, je drei Läufe.
   - Auf mittleren Telefonen fiele der Auftritt damit ganz weg.
   - Die andere Wahl wäre, die 2-s-Grenze zu überschreiten. Das widerspricht Auftrag 12.

Beides wäre Tuning ohne Nutzen oder eine Gestaltungsentscheidung. Das Paket verbietet Ersteres („Kein künstliches Tuning“), Letzteres gehört zum Inhaber. Die Messung belegt: Bewegung und Inszenierung halten die erste Ansicht heute nicht auf (LCP = FCP, Speed Index = FCP, CLS 0, Hub ohne Sprung). Der Schalter „Bewegung: ruhig“ und `prefers-reduced-motion` bleiben unverändert wirksam.

Eine Nachher-Messung gibt es deshalb nicht. Die Vorher-Messung ist zugleich der Stand.

### 4. Kleine Eingriffe (Bildgrößen, Vorladen)

Keiner möglich, Begründung in Befund 5. Die größeren Hebel stehen mit Zahl und Vorschlag unter OFFENE FRAGEN.

## Tabelle je Ansicht (Median aus drei Läufen)

„vorher“ ist der Stand 321f64b. „nachher“ entfällt, weil sich der Code nicht geändert hat. Gewicht, JS und HTML sind Übertragungsgrößen.

| Ansicht | A: Leistung | A: FCP ms | A: LCP ms | A: TBT ms | CLS | B: Leistung | B: FCP ms | B: LCP ms | B: TBT ms | Gewicht KB / Dateien | JS KB | HTML KB | LCP-Element | Ursache des Werts | getan |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Startseite (/) | 87 | 1.513 | 2.786 | 215 | 0,000 | 96 | 1.207 | 1.207 | 226 | 367,5 / 20 | 192,2 | 79,5 | h1#hub-frage | Gewicht bis zum ersten Zeichnen; schwerstes HTML (CSS doppelt in der RSC-Nutzlast, viel Inhalt); Eingangsanimation +0,9 s Hauptthread ohne Wirkung auf LCP und TBT | gemessen, Ursachen belegt, Entscheidung als OFFENE FRAGE 1 |
| Autoschlüssel | 87 | 1.809 | 3.019 | 296 | 0,000 | 89 | 1.227 | 1.227 | 432 | 397,8 / 22 | 195,7 | 75,3 | p.mt-4 | Gewicht; höchster TBT in B (lange Aufgaben im Dokument 296 ms und 151 ms) | gemessen; nicht im Schreibrecht |
| Assistent | 85 | 1.656 | 3.809 | 176 | 0,000 | 93 | 1.062 | 1.062 | 305 | 463,5 / 29 | 281,7 | 55 | p.mt-2 | JS 281,7 KB | gemessen; nicht im Schreibrecht |
| Schlüssel nach Code | 94 | 1.359 | 3.046 | 60 | 0,000 | 99 | 1.037 | 1.037 | 147 | 365,3 / 25 | 209 | 56 | p.mt-4 | Gewicht | gemessen |
| Konfigurator | 90 | 1.363 | 3.341 | 100 | 0,000 | 98 | 1.004 | 1.004 | 161 | 425,7 / 27 | 277 | 52,9 | h1.text-balance | JS 277 KB | gemessen |
| Shop | 91 | 1.364 | 3.469 | 70 | 0,000 | 99 | 1.024 | 1.024 | 139 | 392,5 / 25 | 260,8 | 52,1 | p.mt-1 | JS 260,8 KB; 12 KB ungenutztes CSS | gemessen |
| Ortsseite Wetzlar | 93 | 1.361 | 3.216 | 68 | 0,000 | 98 | 1.081 | 1.081 | 145 | 336,9 / 22 | 185,3 | 52,5 | h1.text-balance | Gewicht | gemessen; FA-PLATTFORM-03B baut gleichzeitig an dieser Seite |
| Ratgeber | 90 | 1.363 | 3.390 | 144 | 0,000 | 98 | 1.093 | 1.093 | 165 | 341 / 20 | 190,6 | 54,7 | p.mt-4 | Gewicht | gemessen |
| Kontakt | 88 | 1.359 | 3.792 | 85 | 0,000 | 97 | 1.071 | 1.071 | 208 | 417,1 / 30 | 263,8 | 54,1 | p.mt-4 | JS 263,8 KB, 30 Dateien | gemessen |

Spannen und Einzelläufe stehen in den Markdown-Dateien unter `protokolle/FA-SEO-03/`.

Die Streuung auf dieser Maschine ist hoch. Die Startseite hatte in A Leistung 86 bis 92 und TBT 207 bis 364 ms. Ein Unterschied von wenigen Punkten ist kein Befund.

## GEMEINSAME DATEIEN

Keine. `lib.mjs`, `LIESMICH.md`, `globals.css`, `next.config.ts` und `src/lib/bewegung.ts` sind unberührt.

Für den Orchestrator: `LIESMICH.md` kennt das neue Werkzeug noch nicht. Vorschlag für eine Zeile:

> `node leistung.mjs [--basis http://localhost:3200] [--methode simulate|devtools] [--ansichten start,shop] [--laeufe 3] [--marke vorher] [--vorher <json>]` – mobile Leistung der neun Ansichten von FA-SEO-03 mit festem Maßstab (Selbsttest `leistung.test.mjs`: 13 von 13)

## PRÜFUNG UND ERGEBNIS

- `sicher.sh --json -- npx vitest run`: 258 Testdateien, 4.075 Tests, alle bestanden (Exit 0).
- `sicher.sh --json -- npm run typecheck` (`tsc --noEmit`): ohne Fehler (Exit 0).
- `sicher.sh --json -- npm run lint` (`eslint .`): ohne Befund (Exit 0). `_werkstatt/**` ist in eslint ausgenommen; das gilt für alle Werkzeuge.
- `node --test _werkstatt/ausbau/werkzeuge/leistung.test.mjs`: 13 von 13 bestanden. Der Test braucht weder Server noch Browser noch Lighthouse.
- Die Messläufe liefen über `sicher.sh --json --als-root -- node …`, wie in `protokolle/einrichtung.md` Abschnitt 11 vorgesehen.
- Kein Lauf schlug wegen FA-PLATTFORM-03B fehl.

**Nachmessung durch den Orchestrator nach dem Build auf Port 3000:** Eine Codeänderung gibt es nicht. Die Nachmessung dient deshalb als Kontrolle des neuen Builds mit demselben Maßstab:

```
_werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- node _werkstatt/ausbau/werkzeuge/leistung.mjs --marke nachher --vorher _werkstatt/ausbau/protokolle/FA-SEO-03/leistung-vorher-2026-11-16_14-43-27.json
_werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- node _werkstatt/ausbau/werkzeuge/leistung.mjs --methode devtools --marke nachher-devtools --vorher _werkstatt/ausbau/protokolle/FA-SEO-03/leistung-vorher-devtools-2026-11-16_15-05-28.json
```

Ohne `--basis` gilt Port 3000. Dauer: A rund 5 min, B rund 12 min. Während der Messung sollte auf der Maschine kein Build laufen, sonst streut der TBT stark.

## BELEGE

- Werte, Spannen und Ursachen je Ansicht: `protokolle/FA-SEO-03/leistung-vorher-2026-11-16_14-43-27.md` (A) und `leistung-vorher-devtools-2026-11-16_15-05-28.md` (B).
- Volle Lighthouse-Ergebnisse je Lauf: `protokolle/roh/FA-SEO-03/*.lhr.json`, nicht im Commit.
- Lighthouse-Varianten der Eingangsanimation: `protokolle/FA-SEO-03/experiment-bewegung-lighthouse.log`, Skript `experimente/lh-modi.mjs`.
- Spur mit Layout- und Stilursachen: `experimente/spur2.mjs`. Hydrierzeit je CPU-Drosselung: `experimente/startzeit.mjs`. Laufende Animationen beim Laden: `experimente/anim.mjs`. Die Zahlen dieser drei Versuche stehen in Abschnitt 2, Befund 4.
- Aufteilung des HTML der Startseite (Nutzlast, CSS, Markup, gz): eigene Auswertung von `curl http://localhost:3200/` und `/shop` mit gzip -9, Zahlen in Befund 3.

## OFFENE FRAGEN

1. **OFFENE FRAGE (Inhaber und Gestaltung): Soll die Eingangsinszenierung erst nach dem Hydrieren starten?**
   - Gewinn: rund 0,4 s weniger Hauptthread im Ladefenster bei CPU 4-fach. Leistung, LCP und TBT bleiben gleich.
   - Folge: Unter der 2-s-Grenze aus Auftrag 12 entfällt der Auftritt auf Telefonen mittlerer Leistung, denn das Hydrieren endet dort nach 1,1 bis 1,5 s.
   - Vorschlag: so lassen wie es ist. Nur wenn der Inhaber die Grenze für die dekorative Bühne lockern will, das Startbild bis zum Hydrieren halten und den Auftritt danach ganz spielen.
   - Der Bau ist klein: `--eingang-lauf` an der Hülle `EingangBuehne`, `animation-play-state: var(--eingang-lauf, running)` in `teil()`, Start nach `requestAnimationFrame` und `requestIdleCallback`.
   - Heute ruckelt der Auftritt auf langsamen Geräten vermutlich ohnehin, weil er parallel zum Hydrieren läuft. Bei CPU 6-fach endet das Hydrieren nach rund 1,9 s.
2. **OFFENE FRAGE (`next.config`, außerhalb meines Schreibrechts): Das CSS steht auf jeder Seite doppelt.**
   - `experimental.inlineCss` schreibt das ganze CSS als `<style>` in den Kopf und ein zweites Mal in die RSC-Nutzlast (81 KB roh, rund 16 KB gz).
   - Das sind rund 20 bis 30 % des HTML jeder Seite und bei 1.474,6 kbit/s rund 90 ms simulierter LCP.
   - Vorschlag: Nicht ohne Messung ändern, denn die Einstellung ist begründet (D-050, LCP 1,09 auf 0,62 s). Mit `leistung.mjs` beide Varianten auf einem Prüf-Build vergleichen, oder prüfen, ob Next die Nutzlast-Kopie abschalten kann.
3. **OFFENE FRAGE (Gestaltung, G9 Schrift): drei Mono-Schnitte vor dem ersten Zeichnen.**
   - Plex Mono 400, 500 und 600 sind zusammen 46 KB. Jede Seite lädt sie mit höchster Priorität, weil Eyebrows, Telefonnummer und Eckdaten Mono nutzen.
   - Vorschlag: auf zwei Schnitte oder eine variable Datei zurückführen. Das spart rund 15 bis 30 KB, je nach Lösung, auf jeder Ansicht.
4. **OFFENE FRAGE (Messmaßstab, laut FA-BESTAND vom Inhaber zu entscheiden): Labor oder Feld?**
   - Maßstab A (wie PageSpeed Insights) zeigt mobil Leistung 85 bis 94 und LCP 2,8 bis 3,8 s.
   - Maßstab B (gedrosselt im Browser) zeigt 89 bis 99 und LCP 1,0 bis 1,2 s.
   - Den Unterschied macht die Lantern-Rechnung, die alle früh angeforderten Skripte (Priorität „Low“) zum Text-LCP zählt.
   - Vorschlag: A bleibt die Prüfgrenze, damit die Zahlen mit dem vergleichbar sind, was der Inhaber in PageSpeed sieht. B steht im Bericht daneben. Feldwerte (CrUX) gibt es erst nach dem Livegang.
5. **OFFENE FRAGE (gemeinsame Bündel und Kopf, außerhalb meines Schreibrechts):**
   - Auf allen Ansichten gibt es lange Aufgaben von 141 bis 194 ms bei rund 3,2 bis 3,9 s simuliert. Zeitlich passt das zum späten Vorladen (`useSpaetVorladen`, 2,5 s). Belegt ist das nicht.
   - Dazu kommen ungenutztes JS (25 bis 28 KB) und Legacy-JS (13 bis 14 KB, Browserslist).
   - Vorschlag: ein eigenes Paket für Bündel und Vorladen mit Next-Bundle-Analyse.
6. **OFFENE FRAGE (Autoschlüssel-Seite, außerhalb meines Schreibrechts):** Die Seite hat in Maßstab B den höchsten TBT, 432 ms. Die langen Aufgaben im Dokument dauern 296 ms und 151 ms. Ich habe die Ursache dort nicht weiter untersucht.

## FÜR MENSCHEN

- **Inhaber:** Entscheiden, ob die Eingangsinszenierung auf langsameren Telefonen weglaufen oder nach dem Laden voll spielen darf (OFFENE FRAGE 1).
- **Inhaber:** Entscheiden, welcher Messmaßstab für „sehr gute mobile Performance“ gilt: PageSpeed-Labor (A), gedrosselter Browser (B) oder später Felddaten (OFFENE FRAGE 4).
- **Gestaltung:** Entscheiden, ob die Mono-Schrift auf weniger Schnitte reduziert werden darf (OFFENE FRAGE 3).

=== ENDE FA-SEO-03 · BEREIT ZUR RÜCKGABE ===
