# FA-SEO-03C · Mobile Leistung, Teil C: Assistent, Kontakt und die lange Autoschlüssel-Seite

Kopf: Etappe FA Priorität 6 · Rolle Baumeister und Prüfer · Modell Opus · Stufe 3 (gemeinsamer Upload-Baustein von sechzehn Formularen, Ladeweise einer Hauptseite) · Kostenklasse L · ohne Datenschema · Anforderungen FA-25-13, FA-25-15 · Befunde: `berichte/FA-SEO-03B.md` (OFFENE FRAGEN 3 und 4, Abnahme des Orchestrators), `berichte/FA-SEO-03.md`, ENTSCHEIDUNGEN A-069 und A-071.

## Aufgabe in einem Satz
Bringe die drei Ansichten, die im Maßstab von PageSpeed noch unter 90 Punkten liegen, mit belegten, einzeln gemessenen Eingriffen voran, ohne dass sich Aussehen, Inhalt oder Bedienung ändern, und übernimm nur, was messbar hilft.

## Vorgabe des Inhabers (wörtlich, Abschnitt 25)
„Sehr gute mobile Performance, optimierte Bilder und kurze Ladezeiten.“ Und: „Der Score ist ein Qualitätsindikator, aber kein Selbstzweck: echte Inhalte, Nutzbarkeit und saubere Technik gehen vor künstlichem Score Tuning.“

## Stand (Abnahme von FA-SEO-03B, Commit ca1a4d5)
Maßstab A (Lighthouse mobil, simuliert, Median aus drei Läufen auf ruhiger Maschine): Startseite 92, Autoschlüssel 89, Assistent 85, Schlüssel nach Code 92, Konfigurator 90, Shop 97, Ortsseite 93, Ratgeber 91, Kontakt 88; CLS überall 0. Die Werte unveränderter Seiten schwanken zwischen zwei Messungen um bis zu drei Punkte. JavaScript komprimiert: Assistent 277 KB in 18 Skripten, Kontakt 267 KB in 19, Autoschlüssel 221 KB in 15.

Nachtrag 17.11.2026 (Abnahmen von FA-INHALT-01 und FA-FARBE-01, A-075): Der Assistent wird bei jedem Abruf erzeugt, und seine Skriptliste hängt vom Zustand des Serverprozesses ab: Am frisch gestarteten Server nennt die Seite 18 Skripte (277,2 KB); hat derselbe Prozess vorher die Kontaktseite erzeugt, nennt sie 20 (287,4 KB), in jedem Build und unabhängig von der Next-Fassung. Die zwei zusätzlichen Dateien sind die Ansichten der 404-Seite und der Fehlergrenze der Website (`src/app/(site)/not-found.tsx` und `error.tsx`, je mit der Zeichnung der Stiftzuhaltung; 5,2 und 5,4 KB komprimiert); auch die Kontaktseite nennt sie in ihrem HTML. Kläre zuerst, warum die Zuordnung der Client-Bausteine zwischen Seiten wandert (lies dazu die Anleitung von Next unter `node_modules/next/dist/docs`), ob sich das für den Assistenten abstellen lässt, und miss immer am frisch gestarteten Server in der Reihenfolge von `gewicht.mjs`. Seit FA-FARBE-01 tragen Kopfzeile, Seitenkopf und Fuß die dunkle Bühne; Vergleichsbilder mit Ständen davor sind deshalb nicht mehr pixelgleich. Versuchsordner und Messstand neu aufbauen (Quelltext des letzten geprüften Commits, `node_modules` mit Next.js 16.4.6).

## Arbeitsweise: eigener Bauordner, der Arbeitsbaum bleibt ruhig
Wie in FA-SEO-03B (lies dort „Arbeitsweise“ und nutze die Skripte unter `protokolle/FA-SEO-03B/experimente/`: `gewicht.mjs`, `bildvergleich.mjs`, `spur-aufgaben.mjs`, `analyse-*.mjs`):
- Versuchsordner `/home/user/sm24-versuch`: Quelltext des Commits ca1a4d5, noch ohne Build. `node_modules` ist hart verlinkt mit dem Arbeitsbaum: nie `npm install`, nie eine Datei unter `node_modules` ändern (G7).
- Bauen: `cd /home/user/sm24-versuch && SM24_INDEXIERUNG=an SICHER_WURZEL=/home/user/sm24-versuch /home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npm run build`. Server des Versuchs auf Port 3300: `… SICHER_PORT=3300 nohup …/sicher.sh --json -- npx next start -p 3300 > /tmp/sm24-versuch.log 2>&1 &`; beenden mit `pkill -f "next start -p 3300"; fuser -k 3300/tcp`. Am Ende des Pakets ist der Server beendet.
- Vergleichsstand: der Messstand auf `http://localhost:3200` (Commit ca1a4d5, nicht anfassen). Auf Port 3000 misst und startest du nichts; im Arbeitsbaum baust du nicht (dort arbeitet gleichzeitig FA-INHALT-01 mit Datenbank und Build).
- Protokolle nach `_werkstatt/ausbau/protokolle/FA-SEO-03C/` (über `sicher.sh --json --als-root`, sonst fehlt das Schreibrecht).
- Gleichzeitig laufen Tests und Builds eines anderen Pakets: Leistungswert und TBT streuen stark. Maßgeblich sind lastunabhängige Werte (Skripte und Bytes im HTML, JavaScript komprimiert, Zahl und Dauer langer Aufgaben im Vergleich mehrerer Läufe, Bildvergleich). Nenne zu jedem Lighthouse-Wert die Spanne. Der Orchestrator misst bei der Abnahme auf ruhiger Maschine nach.
- Was im Versuch gewinnt, trägst du mit derselben Änderung in den Arbeitsbaum ein und fährst dort Tests, Typprüfung und Lint.

## Hebel, in dieser Reihenfolge
1. **Autoschlüssel-Assistent: Foto-Upload erst laden, wenn er gebraucht wird.** Der Upload und die Beispielzeichnungen erscheinen erst in den Schritten 8 und 9, hängen aber am ersten Laden (rund 25 bis 35 KB komprimiert laut Bündelanalyse).
   - Voraussetzung: `alsUpload`, `uploadsAbwarten` und ihr gemeinsamer Zustand ziehen aus `src/components/forms/photo-upload.tsx` in ein eigenes Modul ohne die Oberfläche; `photo-upload.tsx` gibt sie unverändert weiter, damit die übrigen fünfzehn Formulare gleich bleiben (belege das mit einem Test auf dieselben Objekte, wie `rubrik.test.ts`).
   - Im Assistenten den Baustein mit dem Mittel aus der Anleitung von Next nachladen (lies `node_modules/next/dist/docs` zum verzögerten Laden von Client-Bausteinen, G12) und nach dem Hydrieren im Leerlauf vorladen, damit der Schritt ohne Warten erscheint. Solange der Baustein lädt, steht an seiner Stelle eine ruhige Fläche gleicher Höhe (kein Springen, CLS bleibt 0) mit einem Satz für Vorlesegeräte.
   - Nichts ändert sich an: gewählten Dateien beim Vor- und Zurückgehen (FA-QA-04B: sie bleiben), „Später weitermachen“, Fehlermeldungen und Hilfen (FA-QA-02), Pflichtregel für Unterlagen (R13), Beispielzeichnungen und ihrem Satz darunter (FA-QA-04C), Tastaturbedienung und Fokus beim Schrittwechsel.
   - Prüfe im Browser am Versuchs-Build (Attrappen, nichts absenden): Schritt mit Upload erreichen bei gedrosselter Leitung und CPU, Datei wählen, zurück und wieder vor, Datei ist noch da; ohne JavaScript-Fehler; mit „Bewegung: ruhig“.
2. **Kontaktseite.** Der Upload steht im ersten, sichtbaren Schritt und bleibt. Finde mit der Bündelanalyse, was die Seite über das Formular hinaus lädt (267 KB), und trenne wie in FA-SEO-03B, was nicht dorthin gehört (Regel A-071). Kein Nachladen sichtbarer Teile.
3. **Autoschlüssel-Seite (lang: 1.045 Elemente, 86 Zeichnungen).** Stil und Layout brauchen beim Laden drei bis vier Aufgaben von 97 bis 176 ms. Prüfe `content-visibility: auto` mit `contain-intrinsic-size` für Abschnitte unterhalb des ersten Bildschirms, zuerst nur im Versuch. Übernimm es nur, wenn alles Folgende belegt ist: Bildvergleich der ganzen Seite bei 412 und 1280 px ohne abweichendes Pixel (nach vollständigem Durchscrollen); CLS 0 auch beim Scrollen und beim Sprung auf Anker der Seite; die Suche im Browser findet Text in den Abschnitten; Einblendungen beim Scrollen und der Schalter „Bewegung: ruhig“ arbeiten wie vorher; Druckansicht vollständig; Vorlesegeräte erreichen alle Überschriften (Baum der Zugänglichkeit vergleichen). Fehlt ein Beleg oder bleibt der Gewinn im Hauptthread unter einem Viertel, bleibt die Seite, wie sie ist, mit Zahlen im Bericht. Kein Abschnitt wird entfernt, gekürzt oder nachgeladen (R1).
4. **Was die Bündelanalyse sonst zeigt.** Module, die auf einer der neun Ansichten laden und dort nicht gebraucht werden, nach der Regel aus A-071 trennen (Datei mit Werten ohne Client-Baustein; Serverlogik nicht in Dateien, die der Browser lädt). Nenne jede Stelle mit Datei, Zeile, Bytes vorher und nachher.

## Grenzen der Eingriffe
Kein Inhalt entfällt, nichts wird vor Suchmaschinen verborgen (R1), CLS bleibt 0, die Eingangsinszenierung und der Hub bleiben unverändert (A-052, A-069), `inlineCss`, Schriften und Zielbrowser bleiben (A-071), kleinste Textstufe 14 px und die Schrift der Zeichnungen unverändert (A-068), keine neue Abhängigkeit (G7), Sicherheitskopfzeilen bleiben. Kein künstliches Tuning: Was Kunden sehen und bedienen, geht vor der Zahl.

## Schreibrechte
Im Arbeitsbaum: `src/components/forms/photo-upload.tsx` und ein neues Modul daneben für Zustand und Hilfsfunktionen, `src/app/(site)/autoschluessel/anfrage/assistent.tsx` (nur die Stellen des Uploads), `src/components/autoschluessel/schluessel-fotos.tsx` (nur wenn der Assistent den Upload darüber einbindet), die Bausteine der Kontaktseite und der Autoschlüssel-Seite für die Trennung von Importen, `src/app/(site)/globals.css` nur für eine Hilfsklasse zu Hebel 3, zugehörige Tests, `_werkstatt/ausbau/berichte/FA-SEO-03C.md`, Protokolle unter `_werkstatt/ausbau/protokolle/FA-SEO-03C/`. Der Versuchsordner ist frei.
Nicht anfassen: `src/payload/**`, `src/migrations/**`, `src/payload-types.ts`, `src/lib/data/**`, `content/**`, `src/app/(site)/tutorials/**`, `src/app/sitemap.ts`, `content/seo.json` (dort arbeitet gleichzeitig FA-INHALT-01; schlägt Typprüfung oder ein Test nur in dessen Dateien fehl, wiederhole den Lauf später und nenne das im Bericht), `src/components/visual/generators/**`, `next.config.ts`, `package.json`, Texte, Preise.

## Prüfen
Im Arbeitsbaum: `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`. Den Build mit allen übernommenen Änderungen fährst du im Versuchsordner und nennst Seitenzahl und Dauer; den Build im Arbeitsbaum macht der Orchestrator. Kein git, keine Formularsendung und kein echter Upload (G5), Messung nur gegen localhost (G1).

## Bericht
Je Hebel eine Tabelle: Variante, lastunabhängige Werte vorher und nachher, Lighthouse als Hinweis (Median und Spanne), Entscheidung (übernommen, verworfen, OFFENE FRAGE) mit Grund; dazu die Belege der Bedienung (was du im Browser getan und gesehen hast) und die Befehle, mit denen der Orchestrator auf ruhiger Maschine nachmisst.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-SEO-03C · BEREIT ZUR RÜCKGABE ===
