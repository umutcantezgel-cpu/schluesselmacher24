# E5-AUTOR-01 · Texte der Konfiguratoren: Messhilfe, Maßhinweise, Sperrschließung oder Schließanlage, Privat oder Unternehmen

## 1. Kopfzeile
Kennung E5-AUTOR-01 · Rolle Autor · Modell Haiku 5.5 · Stufe 2 · Kostenklasse M · Anforderungen G-09, G-29, G-30, KA5 · Kriterien Z-06, Z-17 · Schreibrechte (nur sichtbare Texte, keine Logik): src/lib/konfigurator/masse.ts, src/lib/konfigurator/vorlagen.ts, src/components/konfigurator/schliessplan-planer.tsx, src/components/konfigurator/schliessplan-editor.tsx, src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx, dazu Tests nur dort, wo sie einen geänderten Text wörtlich prüfen (src/lib/konfigurator/konfigurator.test.ts, src/components/konfigurator/schliessplan-editor.test.tsx, src/app/(site)/gleichschliessende-zylinder/konfigurator/kern.test.ts), Bericht _werkstatt/ausbau/berichte/E5-AUTOR-01.md. Neu geschnitten vom Orchestrator: statt einer neuen Datei content/konfigurator-texte.json, die nichts liest, die Texte an ihrer Stelle.

## 2. Rollenbriefing
Autor: schreibt kurze Erklär- und Hinweistexte für Laien ohne KI-Spuren nach KERN K-010 und Auftrag 14. Fehler: Floskeln, Gedankenstriche, Ausrufezeichen, Dreierreihen von Adjektiven, rhetorische Fragen, erfundene Fakten, Preise, Fristen oder Zusagen, veränderte Logik, gelockerte Tests.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und _werkstatt/ausbau/pakete/_MUSTER-REFERENZ.md und halte dich daran.

## 3. Aufgabe in einem Satz
Überarbeite in den Schreibrechten nur die sichtbaren Texte zu Messhilfe, Maßhinweisen, dem Unterschied zwischen Sperrschließung und Schließanlage und der Empfehlung für Privat oder Unternehmen, sodass ein Laie sie beim ersten Lesen versteht und richtig handelt.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar. Unter /gleichschliessende-zylinder/konfigurator stellt man eine Sperrschließung zusammen (ein Schlüssel für alle Türen) und bestellt sie über den Warenkorb. Unter /schliessanlagen/konfigurator/schliessplan plant man Türen und Schlüssel einer Schließanlage (wer öffnet welche Tür); Sperrschließungen gehen dort in den Warenkorb, Anlagen mit Ebenen als Anfrage. Beide nutzen den Kern in src/lib/konfigurator/ (Maßprüfung in masse.ts, Vorlagen in vorlagen.ts). Die Texte stehen heute als Zeichenketten in diesen Dateien.

## 5. Kern-Auszug (unveränderlich)
- Ton (K-010): Sie-Anrede, kurze klare Sätze, Hauptwörter und Verben, konkret. Keine Gedankenstriche (weder `—` noch `–`), Bindestriche nur, wo die Rechtschreibung sie verlangt, keine Ausrufezeichen, keine Emojis, keine Floskeln aus Auftrag 14 (_werkstatt/ausbau/AUFTRAG.md Abschnitt 14). Austauschprobe: Passt ein Satz zu jedem Schlüsseldienst, neu schreiben.
- G-09: Sperrschließung trägt überall die Laienerklärung „ein Schlüssel für alle Türen“; der Unterschied zur Schließanlage steht mit Beispiel da: In der Schließanlage öffnet der Schlüssel des Kindes nur sein Zimmer und die Haustür, der der Eltern alle Türen.
- G-30: Für Firmen empfiehlt die Seite die Schließanlage, für kleine Teams und Häuser die Sperrschließung, mit Beratung als Ausweg (die beiden Kästen „Haus, kleines Team oder Firma?“ im Planer und der Absatz neben dem Sperrschließungs-Konfigurator).
- G-29: Messhilfe, Plausibilitätsprüfung, Pflichtbestätigung „Maße geprüft“, Rückfrage bei Auffälligkeiten. Der Hinweis zur Anfertigung nach Kundenmaß (kein Widerruf bei Sonderanfertigung) ist Recht: Du schreibst ihn nur als Entwurf in den Bericht, nicht in die Oberfläche (R10).
- KA5: sachliche Vergleiche, keine Wertung des Wettbewerbs.
- Nicht ändern: Logik, Bedingungen, Zahlen, Kennungen, Klassen, Struktur der JSX-Elemente, Preise, Fristen, Rechtstexte, Firmendaten, Platzhalter in Texten (etwa `${…}`), Aria-Bezeichnungen nur, wenn sie danach noch genau das Element beschreiben.

## 6. Maßstab
Bericht mit Tabelle: Datei:Zeile · vorher · nachher · Grund (Regel oder Laienprobe). Jede Änderung einzeln. Ein Text, der schon passt, bleibt; dann eine Zeile „geprüft, unverändert“. Dazu der Abschnitt „Entwurf für den Anwalt“ mit dem Hinweis zur Anfertigung nach Kundenmaß.

## 7. Grenzen
G4, G8 (kein Test wird gelockert: prüft ein Test einen Text wörtlich, ziehst du ihn im neuen Wortlaut nach, gleich streng), G9, R4, R9, R10. Nur die Schreibrechte aus Abschnitt 1. Kein Build, kein Commit.

## 8. Schritte
1. Lies die fünf Dateien und sammle die sichtbaren Texte zu den vier Themen (Messhilfe und „Maße geprüft“ im Schritt „Prüfen“ des Planers, Befundtexte in masse.ts, Vorlagentexte in vorlagen.ts, Kästen und Absätze zu Sperrschließung, Schließanlage, Privat oder Unternehmen in Planer und Sperrschließungs-Konfigurator, Hinweise im Zylinderschritt).
2. Prüfe jeden Text gegen Abschnitt 5 und die Laienprobe: Versteht jemand ohne Fachwissen, was er tun soll?
3. Ändere nur die Zeichenketten. Suche vor jeder Änderung mit `grep -rn` in src/, ob ein Test den Text prüft, und ziehe ihn gleich streng nach.
4. Prüfe mit `/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run src/lib/konfigurator src/components/konfigurator "src/app/(site)/gleichschliessende-zylinder"`, `… sicher.sh --json -- npx eslint src/lib/konfigurator src/components/konfigurator "src/app/(site)/gleichschliessende-zylinder/konfigurator"` und `… sicher.sh --json -- npm run typecheck` (alles grün).
5. Bericht.

## 9. Selbstprüfung
Kein `—`, kein `–` und kein Ausrufezeichen in geänderten Texten; `git diff` zeigt nur geänderte Zeichenketten (und gleich strenge Testerwartungen); keine Zahl, Frist oder Zusage neu; Tests, Lint und Typprüfung grün.

## 10. Ausgabe
Geänderte Dateien aus Abschnitt 1, Bericht nach _werkstatt/ausbau/berichte/E5-AUTOR-01.md (höchstens 700 Wörter) mit Tabelle, Testergebnis und „Entwurf für den Anwalt“.

## 11. Letzte Zeile
=== ENDE E5-AUTOR-01 · BEREIT ZUR RÜCKGABE ===
