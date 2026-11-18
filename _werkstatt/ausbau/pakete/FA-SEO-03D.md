# FA-SEO-03D · Mobile Leistung, Teil D: weniger Skript auf Formularseiten

Kopf: Etappe FA Priorität 6 · Rolle Baumeister und Prüfer · Modell Opus · Stufe 3 (gemeinsamer Upload-Baustein von sechzehn Formularen, Preislogik in der Nähe von G9) · Kostenklasse M · ohne Datenschema · Anforderungen FA-25-13, FA-25-15 · Befunde: `berichte/FA-SEO-03C.md` (Abschnitte „Hebel 2“, „Hebel 4“, „OFFENE FRAGEN“ und „Abnahme durch den Orchestrator“), Entscheidungen A-071 und A-076.

## Aufgabe in einem Satz
Nimm aus den Formularseiten Skript heraus, das dort geladen, aber nicht gebraucht wird, sodass der Browser insgesamt weniger lädt und abarbeitet, ohne dass sich Aussehen, Inhalt oder Bedienung ändern.

## Vorgabe des Inhabers (wörtlich, Abschnitt 25)
„Sehr gute mobile Performance, optimierte Bilder und kurze Ladezeiten.“ Und: „Der Score ist ein Qualitätsindikator, aber kein Selbstzweck: echte Inhalte, Nutzbarkeit und saubere Technik gehen vor künstlichem Score Tuning.“

## Regel dieses Pakets (A-076)
Ein Eingriff zählt nur, wenn er die Menge senkt, die der Browser **insgesamt** lädt oder abarbeitet (gemessen bis Netzruhe plus einige Sekunden, nicht nur die Skriptzeilen im HTML). Verschieben oder Nachladen zählt nicht und ist in diesem Paket ausgeschlossen: kein `import()` für sichtbare oder später sichtbare Teile, kein `next/dynamic`, kein Vorladen. Was nicht messbar hilft, bleibt, wie es ist, mit Zahlen im Bericht.

## Stand (Commit dieses Pakets, Quelltext wie b0aa692; live)
Am frisch gestarteten Server (Reihenfolge von `protokolle/FA-SEO-03B/experimente/gewicht.mjs`): Assistent 18 Skripte und 277,6 KB komprimiert, Kontakt 19 und 267,7 KB, Zylinder-Konfigurator 17 und 253,3 KB. Vom Browser geladen auf dem Assistenten: 26 Dateien bis Netzruhe (vor FA-QA-04E 317,4 KB übertragen).

## Kandidaten (aus FA-SEO-03C, dort mit Datei, Zeile und Bytes)
1. **Beispielzeichnungen am Upload-Feld.** `photo-upload.tsx` zeichnet seine Beispiele über `ImagePlaceholder` und das Register aller zehn Generatoren (`src/components/visual/registry.tsx`). Auf der Kontaktseite stehen dadurch 21,5 KB komprimiert für Generatoren, von denen einer sichtbar ist; dasselbe gilt für andere Formulare mit Upload. Wege: nur die Generatoren importieren, die an Upload-Feldern wirklich vorkommen (eine eigene kleine Zuordnung für das Upload-Feld statt des ganzen Registers), oder das Beispiel auf dem Server zeichnen und als fertiges Element übergeben. Die Zeichnung selbst, ihr Satz darunter und die Regeln aus FA-QA-04C bleiben Pixel für Pixel gleich.
2. **`src/lib/wege/naechste-schritte.ts`** mischt Listen (`SCHRITTE_*`) und Logik (`naechsteSchritte()` mit `istEinsendung`, `istFotoanfrage`): Formulare, die nur die Listen lesen, laden rund 2,8 KB komprimiert Vorgangs- und Versandlogik mit. Trennen in eine Datei mit Werten und eine mit Logik (Regel A-071); alle Aufrufer bleiben gleich (Weitergabe aus der alten Datei oder umgestellte Importe, mit Test auf dieselben Objekte).
3. **`src/components/autoschluessel/optionen.ts`** zieht über `fahrzeugVorOrtNoetig` aus `src/lib/pricing.ts` die Zylinder- und Konfiguratorregeln in den Assistenten (rund 2,7 KB). Trennen, ohne eine Preisregel, einen Betrag oder ein Ergebnis zu ändern (G9): nur verschieben, was der Browser nicht braucht; belege mit den vorhandenen Preis-Tests und einem Vergleich der Ergebnisse vor und nach.
4. Was die Bündelanalyse der drei Seiten sonst zeigt (Skripte unter `protokolle/FA-SEO-03B/experimente/` und `FA-SEO-03C/experimente/`): nur aufnehmen, wenn es die Gesamtmenge senkt.

## Grenzen
- Kein Inhalt entfällt, nichts wird vor Suchmaschinen verborgen (R1); CLS bleibt 0; Bedienung, Fokus (A-077), Fehlermeldungen, Pflichtregeln und der Berechtigungsnachweis (R13) bleiben gleich.
- Preise, Beträge, Fristen und Rechtstexte unverändert (G9). Keine neue Abhängigkeit (G7).
- Die Farbwelt (helle Seite, Markenblau; A-074, A-078) und `src/components/visual/generators/**` bleiben unverändert: Die Generatoren werden anders eingebunden, nicht geändert.
- Kleinste Textstufe 14 px, auch in Zeichnungen (A-068).

## Arbeitsweise
Du arbeitest im Arbeitsbaum; kein anderes Paket läuft. Du darfst bauen (`SM24_INDEXIERUNG=an _werkstatt/ausbau/werkzeuge/sicher.sh --json -- npm run build`) und den Prüfserver über `bash _werkstatt/ausbau/werkzeuge/server.sh stop|start` auf Port 3000 starten. Der Messstand auf Port 3200 zeigt den Stand vor diesem Paket; für Messungen startest du ihn neu: `pkill -f "next start -p 3200"; fuser -k 3200/tcp; SM24_INDEXIERUNG=an SICHER_WURZEL=/home/user/sm24-messstand SICHER_PORT=3200 nohup /home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx next start -p 3200 > /tmp/sm24-messstand.log 2>&1 &` (Dateien dort nicht ändern).
Messen, je Kandidat einzeln und am Ende zusammen, alter und neuer Stand gleich behandelt:
- Skripte im HTML und komprimierte Bytes der neun Ansichten am frisch gestarteten Server (`gewicht.mjs`).
- Was der Browser wirklich lädt: Zahl der Skriptdateien und übertragene Bytes bis Netzruhe plus 5 Sekunden für Assistent, Kontakt, einen Konfigurator und zwei weitere Formulare mit Upload (Vorlage: `protokolle/FA-SEO-03C/experimente/netz.mjs`, Bytes aus dem Protokoll von Chromium).
- Bildvergleich Pixel für Pixel für jede Seite mit Upload-Feld, auf dem Schritt, der das Feld zeigt, bei 412 und 1280 px (Attrappen nach G5, nichts absenden), dazu die Kontaktseite ganz.
- Lighthouse nur als Hinweis, mit Spanne.
Skripte und Protokolle nach `_werkstatt/ausbau/protokolle/FA-SEO-03D/` (schreiben über `sicher.sh --json --als-root`). Nur localhost.

## Schreibrechte
`src/components/forms/photo-upload.tsx` und neue Dateien daneben, `src/components/ui/image-placeholder.tsx` und `src/components/visual/registry.tsx` nur, soweit die Einbindung es braucht (alle anderen Nutzer bleiben Pixel für Pixel gleich; belege das), `src/lib/wege/naechste-schritte.ts` und eine neue Datei daneben, `src/components/autoschluessel/optionen.ts`, `src/lib/pricing.ts` und eine neue Datei daneben (nur verschieben, nichts ändern), die Importzeilen der Aufrufer, zugehörige Tests, `_werkstatt/ausbau/berichte/FA-SEO-03D.md`, `_werkstatt/ausbau/protokolle/FA-SEO-03D/**`.
Nicht anfassen: `src/components/visual/generators/**`, `src/components/flow/**`, `src/payload/**`, `src/migrations/**`, `src/lib/data/**`, `content/**`, `src/app/(site)/globals.css`, `tailwind.config.ts`, `package.json`, `next.config.ts`, Texte, Preise.

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`, Build wie oben; alles grün, Zahlen nennen. Tests: Grenzen der Importe wie `src/lib/auftragsweg-grenze.test.ts` (die getrennten Dateien ziehen die Logik nicht wieder herein), dieselben Objekte bei Weitergaben, Preis-Ergebnisse unverändert.

## Bericht (`_werkstatt/ausbau/berichte/FA-SEO-03D.md`)
Je Kandidat: was geändert wurde, Datei und Zeile, Bytes vorher und nachher im HTML und im Browser insgesamt, Bildvergleich, Entscheidung (übernommen, verworfen, OFFENE FRAGE) mit Grund. Am Ende eine Tabelle der neun Ansichten vorher und nachher.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-SEO-03D · BEREIT ZUR RÜCKGABE ===
