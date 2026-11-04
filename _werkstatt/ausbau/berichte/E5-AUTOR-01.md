# E5-AUTOR-01 · Bericht · Texte der Konfiguratoren (Messhilfe, Maßhinweise, Sperrschließung und Schließanlage, Privat oder Unternehmen)

## GEÄNDERTE DATEIEN
- src/lib/konfigurator/masse.ts
- src/components/konfigurator/schliessplan-planer.tsx
- src/components/konfigurator/schliessplan-editor.tsx
- src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx

Keine Testdatei geändert. Die Prüfung der Texte in den Tests blieb gleich streng (siehe unten).

## WAS UND WARUM
Nur Zeichenketten geändert, keine Logik, keine Zahlen, keine Preise, keine Fristen. Ziel: Ein Laie versteht beim ersten Lesen, was er messen und welche Schließung er wählen soll.

| Datei:Zeile | vorher | nachher | Grund |
|---|---|---|---|
| masse.ts:28 | „Maß A X mm ist nicht wählbar (30 bis 60 mm in Schritten von 5 mm).“ | „Maß A X mm ist nicht wählbar. Wählbar sind 30 bis 60 mm in Schritten von 5 mm.“ | Laienprobe: Der Bereich wird als Antwort auf die Frage „Was geht stattdessen?“ genannt. |
| masse.ts:31 | wie 28 für Maß B | wie 28 für Maß B | wie 28 |
| masse.ts:33 | „A und B unterscheiden sich um X mm. Bitte prüfen Sie, ob innen und außen richtig zugeordnet sind.“ | „Maß A und Maß B unterscheiden sich um X mm. Bitte prüfen Sie, ob Sie Maß A nach außen und Maß B nach innen gemessen haben.“ | Die Rückfrage nennt die Richtung, nach der man messen soll. „unterscheiden“ bleibt, der Test in schliessplan-editor.test.tsx prüft das Wort. |
| schliessplan-planer.tsx:66 (Schritt Türen) | „Je Tür ein Zylinder. Die Maße A und B messen Sie an der Tür ab der Mitte der Stulpschraube.“ | „Je Tür ein Zylinder. Gemessen wird ab der Mitte der Stulpschraube, der langen Schraube in der Türkante. Maß A reicht nach außen, Maß B nach innen.“ | Erster Auftritt des Fachbegriffs Stulpschraube auf dieser Seite, erklärt nach KERN-Glossar. Richtung von A und B ausgeschrieben. |
| schliessplan-planer.tsx:84 (Schritt Abschluss) | „Für eine Schließanlage mit Ebenen schicken wir Ihnen ein Angebot.“ | „Für eine Schließanlage mit Ebenen, also mit Schlüsseln, die nicht alle Türen öffnen, schicken wir Ihnen ein Angebot.“ | „Ebenen“ war unerklärt. Der Halbsatz erklärt den Unterschied zur Sperrschließung. |
| schliessplan-planer.tsx:454 (Titel der Maßgrafik) | „So messen Sie Maß A und B: …“ | „So messen Sie Maß A und Maß B: …“ | Lesbarkeit, keine Abkürzung im Titel. |
| schliessplan-planer.tsx:456 (Bildunterschrift Prüfen) | „Gemessen wird ab der Mitte der Stulpschraube bis zum Zylinderende, außen A, innen B. Ein Schutzbeschlag zählt mit.“ | „Gemessen wird ab der Mitte der Stulpschraube bis zum Zylinderende. Maß A misst man nach außen, Maß B nach innen. Ein Schutzbeschlag zählt mit.“ | „außen A, innen B“ ist eine Kurzform, die man erst entschlüsseln muss. |
| schliessplan-editor.tsx:517 (Hinweis Preis Sperrschließung) | „Alle Schlüssel schließen alle Türen (Sperrschließung).“ | „Alle Schlüssel schließen alle Türen. Man nennt das eine Sperrschließung.“ | Der Fachbegriff wird erklärt, statt nur in Klammern zu stehen. |
| konfigurator.tsx:558 (Laienbox Sperrschließung) | „Anders bei einer Schließanlage: Dort öffnet etwa der Schlüssel des Kindes nur sein Zimmer und die Haustür, der Schlüssel der Eltern alle Türen.“ | „Bei einer Schließanlage ist das anders. Dort öffnet der Schlüssel des Kindes etwa nur sein Zimmer und die Haustür, der Schlüssel der Eltern alle Türen.“ | Beispiel bleibt (G-09). Der Satz beginnt nicht mehr mit einem Einschub ohne Bezug. |
| konfigurator.tsx:846 (Alert Schlüssel) | „… ist damit nicht möglich — dafür planen wir eine Schließanlage.“ | „… ist damit nicht möglich. Dafür planen wir eine Schließanlage.“ | Gedankenstrich ersetzt (G-48), Inhalt gleich. |
| konfigurator.tsx:1204 (Maßhinweis je Position) | „Gemessen wird ab Mitte der Stulpschraube — Maß A nach außen{, Maß B nach innen}.“ | „Gemessen wird ab der Mitte der Stulpschraube, der langen Schraube in der Türkante. Maß A messen Sie nach außen{, Maß B nach innen}.“ | Gedankenstrich ersetzt, Fachbegriff erklärt. Die Bedingung `form.measures === 'beide'` ist unverändert. |

Geprüft, unverändert: vorlagen.ts (alle Titel und Sätze, Sätze ohne Gedankenstrich, Ausrufezeichen und Fragezeichen, so auch der Test in konfigurator.test.ts:86); Hinweis „Maße geprüft: Ich habe Maß A und Maß B an jeder Tür selbst gemessen.“ (planer:493); Privat-Kasten „Haus, kleines Team oder Firma?“ (planer:405–410) und Absatz im Sperrschließungs-Konfigurator (konfigurator.tsx:562–564); Zusammenfassung „Anfertigung nach Ihren Maßen“ (konfigurator.tsx:1017–1020); Titel „Alle Schlüssel sind gleichwertig“.

## GEMEINSAME DATEIEN
Keine Änderung nötig. Außerhalb meiner Schreibrechte fallen auf (nur gemeldet):
- src/app/(site)/schliessanlagen/konfigurator/schliessplan/page.tsx:17 nutzt denselben Satz „für eine Schließanlage mit Ebenen schicken wir Ihnen ein Angebot“ ohne Erklärung von „Ebenen“. Vorschlag für den Besitzer der Datei: den Halbsatz aus planer:84 übernehmen.
- src/lib/data/defaults/content.ts:537 und src/lib/data/defaults/cylinders.ts:16 enthalten Gedankenstriche in der Stulpschrauben-Erklärung.

## PRÜFUNG UND ERGEBNIS
- Vitest (`sicher.sh --json -- npx vitest run src/lib/konfigurator src/components/konfigurator "src/app/(site)/gleichschliessende-zylinder"`): 4 Dateien, 44 Tests, alle grün.
- ESLint (`sicher.sh --json -- npx eslint …`): ohne Fehler, Exit 0.
- Typprüfung (`sicher.sh --json -- npm run typecheck`): ohne Ausgabe, also ohne Fehler.
- Selbstprüfung: In den geänderten Textzeichenketten kein „—“, kein „–“ und kein Ausrufezeichen. `git diff` zeigt in den Textzeilen nur Zeichenketten und JSX-Text, keine Logik. Keine neue Zahl, Frist, Zusage oder Preis.
- Tests: kein Test gelockert. Der Test für „nicht wählbar“ prüft weiter „Maß A“ und „nicht wählbar“, der exakte Text „Bitte auch Maß B angeben.“ blieb unverändert, der Test auf „unterscheiden“ blieb erfüllt.

## BELEGE
- Glossar Stulpschraube: KERN.md Zeile 333 („die lange Schraube in der Türkante, die den Zylinder hält“).
- Maßbeschreibung A außen, B innen: zylinder-mass.test.tsx Zeilen 185–186.
- Regeln: AUFTRAG.md Abschnitt 14 (Floskeln, Gedankenstriche, Laiensprache), KERN K-010, G-09, G-30.

## Entwurf für den Anwalt (nur zur Prüfung, nicht in der Oberfläche, R10)
Der Hinweis zur Anfertigung nach Kundenmaß (kein Widerruf bei Sonderanfertigung) ist Recht und gehört nicht in diesen Auftrag. Vorschlag zur Prüfung durch die Rechtsberatung: „Bei einer Anfertigung nach Ihren Maßen besteht kein Widerrufsrecht.“ Ob der Satz stimmt, wie er lautet und wo er steht, entscheidet die Rechtsberatung. Der Satz ist nicht veröffentlicht.

## OFFENE FRAGEN
1. Außerhalb meines Pakets, Gedankenstriche in konfigurator.tsx: Zeile 110 (Erweiterung, „gefertigt werden können — etwa“), Zeile 716 (Hersteller, „auf Anfrage — schreiben Sie“), Zeile 890 („Freiwillig — Stückzahl 0“), Zeile 1091 (sr-only, „ — Position“), Zeile 1107 („mischen — die Schließung“). Sie gehören zu anderen Schritten und sind nicht geändert.
2. Die Wortwahl „Schließanlage mit Ebenen“ steht auch in Dateien außerhalb meiner Rechte (siehe GEMEINSAME DATEIEN). Eine einheitliche Formulierung braucht eine Entscheidung des Orchestrators.
