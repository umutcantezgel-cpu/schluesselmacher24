# E2-PRUEFER-01 · L0: Plan prüfen gegen Werkzeug und Checkliste

## 1. Kopfzeile
Kennung E2-PRUEFER-01 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 1 · Kern 2.0 · Kostenklasse M · Anforderungen: Auftrag 9 und 19 (L0), Z-01 · Schreibrechte: _werkstatt/ausbau/berichte/E2-PRUEFER-01.md · Umfang: ein Planlauf und 14 Prüffragen

## 2. Rollenbriefing
Prüfer: richtet Werkzeuge ein, prüft nach seiner Stufe, schreibt Tests für neue Logik und berichtet knapp mit Belegpfaden. Fehler: Entwicklungsserver statt Produktions-Build; Einzelmessung statt Median aus drei Läufen; deuten statt berichten.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md. Du änderst nichts außer deinem Bericht.

## 3. Aufgabe in einem Satz
Lass plan.mjs pruefen laufen und prüfe PLAN.json, ABNAHME.md und ANFORDERUNGEN.json gegen die Checkliste unten; melde jede Lücke mit Paketkennung.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar mit Fertigung, Beratung und Außendienst, mit Schwerpunkt Wetzlar und Hessen und bestellbar in ganz Deutschland. Kundinnen und Kunden bestellen Autoschlüssel mit Anzahlung, Schlüssel nach Code, nach Foto oder per Einsendung, gleichschließende Zylinder und Schließanlagen über Konfiguratoren, oder sie schicken eine vollständige Anfrage. Technisch ist es Next.js 16 mit React 19, TypeScript strikt, Tailwind 3.4 und Payload 3.90 auf Postgres mit Stripe, Resend und S3-Ablage; ohne Datenbank liest die Seite content/*.json. Dieser Lauf baut den Bestand aus: ein Hub „Wobei können wir Ihnen helfen?“ im ersten Bildschirm, Rubriken aus Daten, ein Abschluss für alle Wege und neue Wege für Fahrzeuge, Einsenden, Konfiguratoren, Partner und Karte. Maßstab sind Laien ohne Geduld, offene Preise, Ehrlichkeit über Prüfungen, Berechtigungsnachweise, die nie geschwächt werden, und ein Bestand, von dem nichts verloren geht.

## 5. Kern-Auszug (unveränderlich)
Der Plan ist eine Datei, die ein Werkzeug prüft und aus der es die nächste Welle ausgibt. Jedes Kriterium hat Pakete, jedes Paket dient einer Anforderung oder einem Kriterium, jede Anforderung ist gedeckt oder hat einen Endstatus, keine Datei in zwei Paketen derselben Welle, jedes Haiku-Paket hat Maßstab und Muster, nur Opus 5.5 und Haiku 5.5.

## 6. Maßstab
/home/user/schluesselmacher24/_werkstatt/ausbau/AUFTRAG.md Abschnitte 9, 18, 19 und 20; PLAN.json; PLAN.md; ABNAHME.md; ANFORDERUNGEN.json; KERN.md.

## 7. Grenzen
Nur lesen. Werkzeuge: `node /home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/plan.mjs pruefen`, `… stand`, `… naechste --plaetze 4`, `node …/anforderungen.mjs pruefen`, python3 zum Auszählen.

## 8. Schritte
1. Führe plan.mjs pruefen, stand, naechste und anforderungen.mjs pruefen aus und gib die Ausgaben wieder.
2. Prüffragen (je Frage: ja oder nein, Beleg, bei nein die betroffenen Pakete):
   a. Hat jedes Kriterium Z-01 bis Z-22 mindestens ein Pflichtpaket, und hat jedes Kriterium in ABNAHME.md Methode, Schwelle und Ausgangswert?
   b. Steht jedes G-01 bis G-51 in mindestens einem Paket, und passt das Paket inhaltlich (Stichprobe von 15 G)?
   c. Sind G-21 und G-50 nur als Konzept mit Schalter geplant (E9-OPUS-04)?
   d. Hat jede Etappe ein prüfbares Tor?
   e. Liegen alle Opus-Pakete in Stufe 3 und alle Haiku-Pakete in Stufe 1 oder 2?
   f. Hat jedes Haiku-Paket eine Paketdatei unter pakete/ oder ist es eines, dessen Datei noch geschrieben werden muss (liste diese)?
   g. Gibt es Pakete, die Projektdateien ändern, ohne dass ein Prüferpaket der Etappe (Prüfstufe B) danach kommt?
   h. Sind Rechtstexte, Preise, Firmendaten und Zahlungsabläufe in keinem Paket als Änderung geplant (G9)? Suche in Titeln nach „Rechtstext“, „Preis“, „Zahlung“, „AGB“ und prüfe, ob es nur Erweiterungen sind.
   i. Gibt es ein Paket für jede Menschensache-Vorbereitung (E9-DOKUMENTAR-01) und für AUSSEN.md (E8-DOKUMENTAR-01)?
   j. Ist der kritische Pfad lückenlos über Abhängigkeiten verbunden?
   k. Sind die Kostenklassen plausibel (Opus-Kernpakete L, kleine Haiku-Pakete M)?
   l. Stehen Jury, Blindprüfung und Endprüfer als frische Opus-Pakete im Plan (E4-JURY-01, E4-BLIND-01, E8-BLIND-01, EA-JURY-01, EA-ENDPRUEFER-01)?
   m. Gibt es für jede Rubrik aus G-03 einen Weg-Baustein im Plan (Autoschlüssel, Motorrad, Gehäuse, Code, Foto, Einschicken, Sperrschließung, Schließanlage, Elektronik, Sicherheitstechnik, Vor Ort, Beratung)?
   n. Ist die Agenturnennung nach Abschnitt 15 geplant und standardmäßig aus (E8-OPUS-04)?

## 9. Selbstprüfung
14 Prüffragen beantwortet, jede mit Beleg.

## 10. Ausgabe
Bericht nach _werkstatt/ausbau/berichte/E2-PRUEFER-01.md (höchstens 600 Wörter; Tabelle Frage · Ergebnis · Beleg · Pakete). Ausdrücklich erlaubt.

## 11. Letzte Zeile
=== ENDE E2-PRUEFER-01 · BEREIT ZUR RÜCKGABE ===
