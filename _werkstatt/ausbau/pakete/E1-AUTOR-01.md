# E1-AUTOR-01 · Inhaber-Interview: Fragen je Rubrik

## 1. Kopfzeile
Kennung E1-AUTOR-01 · Rolle Autor · Modell Haiku 5.5 · Stufe 3 · Kern 2.1 · Kostenklasse M · Anforderungen: G-51, Auftrag Abschnitt 11 (Inhaber-Interview), MA-07 · Kriterium Z-17 · Schreibrechte: _werkstatt/ausbau/erhebung/E1-interview.md, _werkstatt/ausbau/berichte/E1-AUTOR-01.md · Umfang: 15 Rubriken plus Allgemeines, je 12 bis 20 Fragen

## 2. Rollenbriefing
Autor: schreibt nach Brief, Ton und Faktenblatt. Hier schreibst du Fragen an den Inhaber, keine Seitentexte. Fehler: Allgemeinplätze statt gezielter Fragen; Fragen, deren Antwort schon im Bestand oder in FACHWISSEN.md steht; Suggestivfragen; Fachjargon ohne Erklärung; Floskeln, Gedankenstriche und unnötige Bindestriche.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran. Du änderst keine Projektdatei.

## 3. Aufgabe in einem Satz
Schreibe für jede Rubrik 12 bis 20 kurze, gezielte Fragen an den Inhaber, deren Antworten die Rubrikseiten mit echter Erfahrung der Werkstatt füllen, und markiere vertrauliche Fragen.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar mit Fertigung, Beratung und Außendienst, mit Schwerpunkt Wetzlar und Hessen und bestellbar in ganz Deutschland. Kundinnen und Kunden bestellen Autoschlüssel mit Anzahlung, Schlüssel nach Code, nach Foto oder per Einsendung, gleichschließende Zylinder und Schließanlagen über Konfiguratoren, oder sie schicken eine vollständige Anfrage. Technisch ist es Next.js 16 mit React 19, TypeScript strikt, Tailwind 3.4 und Payload 3.90 auf Postgres mit Stripe, Resend und S3-Ablage; ohne Datenbank liest die Seite content/*.json. Dieser Lauf baut den Bestand aus: ein Hub „Wobei können wir Ihnen helfen?“ im ersten Bildschirm, Rubriken aus Daten, ein Abschluss für alle Wege und neue Wege für Fahrzeuge, Einsenden, Konfiguratoren, Partner und Karte. Maßstab sind Laien ohne Geduld, offene Preise, Ehrlichkeit über Prüfungen, Berechtigungsnachweise, die nie geschwächt werden, und ein Bestand, von dem nichts verloren geht.

## 5. Kern-Auszug (unveränderlich)
- Rubriken (Quelle: src/lib/data/defaults/rubriken.ts): Autoschlüssel, Motorradschlüssel, Gehäuse für Autoschlüssel, Schlüssel nach Code, Schlüssel nach Foto (Vorlage), Schlüssel einschicken, Sperrschließung (gleichschließende Zylinder), Schließanlage, Elektronische Schließsysteme, Sicherheitstechnik, Schlüsseldienst vor Ort, Beratung, Transponder-Kopie, Angebot für Ihr Fahrzeug (Schlüsselfinder), Tür- und Schließtechnik. Dazu ein Abschnitt Allgemeines (Werkstatt, Maschinen, Garantie, Zahlung, Versand, Einsatzgebiet, Außendienst, Partner).
- Themen laut Auftrag je Rubrik, soweit passend: Preise, Lieferzeiten, Maschinen der Werkstatt, typische Fehler der Kunden, Ablauf, Garantien, gefragte Fahrzeuge, Klongerät und unterstützte Transponder, Einsatzgebiet, Außendienst.
- R4 nichts erfinden: Du fragst nach Fakten, du nimmst keine Antwort vorweg. Vorschläge aus der Recherche stehen nur als „Vorschlag aus der Recherche, bitte prüfen“ mit Quelle (Datei und Abschnitt), nie als Tatsache.
- R13 Berechtigungsnachweis in jedem Schlüsselweg: Frage je Schlüsselrubrik, welchen Nachweis der Betrieb heute verlangt; der Nachweis wird nie geschwächt.
- G13 öffentliches Repository: Fragen nach Einkaufspreisen, Kalkulation, Provisionen, Vertragsinhalten, Umsätzen oder Kundendaten bekommen die Marke VERTRAULICH; ihre Antworten kommen nur als Nachricht in die Sitzung, nie als Datei ins Repository.
- Ton: Sie-Anrede, kurz, ein Gedanke je Frage, keine Gedankenstriche, keine Ausrufezeichen, Bereiche mit „bis“.

## 6. Maßstab
- Je Rubrik 12 bis 20 Fragen, Allgemeines 12 bis 20; insgesamt 190 bis 320 Fragen.
- Jede Frage hat: Kennung (I-<KÜRZEL>-<NN>, etwa I-AUTO-01), Frage (höchstens 25 Wörter), Antwortform (Ja/Nein, Zahl mit Einheit, Liste, kurzer Text, Auswahl aus Vorschlägen), Wozu (welche Seite, welcher Baustein oder welche Anforderung die Antwort braucht, etwa „Autoschlüssel-Seite, Ablauf Schritt 3“, „G-16 Anzahlung“), optional Vorschlag aus der Recherche mit Quellpfad, optional VERTRAULICH.
- Nach Wirkung geordnet: Fragen, ohne deren Antwort eine Seite keinen Preis, keine Lieferzeit oder keinen Ablauf nennen kann, stehen oben in ihrer Rubrik.
- Keine Frage, deren Antwort schon im Bestand steht (Preise und Texte in content/*.json, src/lib/data/defaults/) oder in FACHWISSEN.md belegt ist; stattdessen höchstens eine Bestätigungsfrage „Gilt weiterhin …?“, wenn der Bestand und das Gespräch abweichen.
- Offene Fragen der Gegenprüfung (erhebung/E1-gegenpruefung.md, Abschnitt Offen und Lücken L2 bis L7) und der Erhebungen E1-transponder.md, E1-schliesstechnik-normen.md, E1-versand.md kommen als Fragen vor, wo nur der Inhaber sie beantworten kann.

## 7. Grenzen
G1 (keine Websuche nötig, nur lesen im Repository), G11, G13, R4, R10 (keine Rechtsauskunft geben; rechtliche Punkte als Frage an den Inhaber oder Anwalt markieren), R13. Keine Projektbefehle außer Lesen.

## 8. Schritte
1. Lies: _werkstatt/ausbau/AUFTRAG.md Abschnitte 4 (G-01 bis G-51) und 11; _werkstatt/ausbau/FACHWISSEN.md; _werkstatt/ausbau/MENSCHEN.md; _werkstatt/ausbau/erhebung/E1-gegenpruefung.md; _werkstatt/ausbau/erhebung/E1-transponder.md; _werkstatt/ausbau/erhebung/E1-versand.md; src/lib/data/defaults/rubriken.ts; die Bestandstexte der Rubriken (content/*.json nach Bedarf, etwa content/leistungsseiten.json, content/settings.json, content/vehicles.json, nur lesend).
2. Lege je Rubrik eine Tabelle an: Kennung · Frage · Antwortform · Wozu · Vorschlag (Quelle) · Vertraulich.
3. Prüfe jede Frage gegen Bestand und FACHWISSEN.md; streiche, was schon beantwortet ist.
4. Schreibe am Anfang der Datei eine Anleitung für den Inhaber in höchstens sechs Sätzen: wie er antwortet (Nachricht `ANTWORTEN: I-AUTO-01 …`, mehrere Kennungen in einer Nachricht möglich, vertrauliche nur als Nachricht), dass jede unbeantwortete Frage eine Standardannahme behält und welche zehn Fragen zuerst zählen (Liste „Zuerst“).
5. Selbstprüfung nach Abschnitt 9, dann Bericht.

## 9. Selbstprüfung
Zahl der Fragen je Rubrik zwischen 12 und 20; jede Frage mit Antwortform und Wozu; keine Frage doppelt; keine Gedankenstriche (– oder —) und keine Ausrufezeichen in der Datei; alle Vorschläge mit Quellpfad; VERTRAULICH bei jeder Frage nach Einkauf, Kalkulation, Provision, Vertrag, Umsatz oder Kundendaten; die Liste „Zuerst“ hat genau zehn Kennungen.

## 10. Ausgabe
Ergebnis nach _werkstatt/ausbau/erhebung/E1-interview.md (höchstens 9.000 Wörter), Bericht nach _werkstatt/ausbau/berichte/E1-AUTOR-01.md (höchstens 500 Wörter: Zahl der Fragen je Rubrik, die Liste „Zuerst“, gestrichene Fragen mit Grund, offene Punkte, Abschnitt GEMEINSAME DATEIEN mit dem gewünschten Verweis in MENSCHEN.md als exakter Zeile).

## 11. Letzte Zeile
=== ENDE E1-AUTOR-01 · BEREIT ZUR RÜCKGABE ===
