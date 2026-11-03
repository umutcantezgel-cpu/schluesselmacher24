# E0-DATENPFLEGER-03 · Anforderungs-Spur: Ergänzender Leitfaden, offene Menschensachen und offene Evaluierungsbefunde

## 1. Kopfzeile
Kennung E0-DATENPFLEGER-03 · Rolle Datenpfleger · Modell Haiku 5.5 · Stufe 1 · Kern 2.0-Entwurf · Kostenklasse M · Anforderungen: Auftrag 3 (Anforderungs-Spur), Z-03 · Schreibrechte: _werkstatt/ausbau/erhebung/anforderungen-EL-M-E.json · Umfang: siehe Schritte

## 2. Rollenbriefing
Datenpfleger: überträgt Daten zeichengenau in Strukturen und Bögen, mit Quelle je Eintrag. Fehler: runden oder ergänzen; Einträge auslassen; Quelle vergessen.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran. Du änderst KEINE Projektdatei; du liest nur und schreibst ausschließlich die Dateien deiner Schreibrechte.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar mit Fertigung, Beratung und Außendienst, mit Schwerpunkt Wetzlar und Hessen und bestellbar in ganz Deutschland. Kundinnen und Kunden bestellen Autoschlüssel mit Anzahlung, Schlüssel nach Code, nach Foto oder per Einsendung, gleichschließende Zylinder und Schließanlagen über Konfiguratoren, oder sie schicken eine vollständige Anfrage. Technisch ist es Next.js 16 mit React 19, TypeScript strikt, Tailwind 3.4 und Payload 3.90 auf Postgres mit Stripe, Resend und S3-Ablage; ohne Datenbank liest die Seite content/*.json. Dieser Lauf baut den Bestand aus: ein Hub „Wobei können wir Ihnen helfen?“ im ersten Bildschirm, Rubriken aus Daten, ein Abschluss für alle Wege und neue Wege für Fahrzeuge, Einsenden, Konfiguratoren, Partner und Karte. Maßstab sind Laien ohne Geduld, offene Preise, Ehrlichkeit über Prüfungen, Berechtigungsnachweise, die nie geschwächt werden, und ein Bestand, von dem nichts verloren geht.

## 3. Aufgabe in einem Satz
Übertrage jede Anforderung aus Ergänzender Leitfaden, offene Menschensachen und offene Evaluierungsbefunde zeichengenau als eigenen Eintrag mit Fundstelle nach _werkstatt/ausbau/erhebung/anforderungen-EL-M-E.json und bestimme für jeden Eintrag den Bestand im Code mit Fundstelle.

## 5. Kern-Auszug (unveränderlich)
Felder je Eintrag (JSON-Objekt): "kennung" (EL-01 fortlaufend für den Ergänzenden Leitfaden, M-<Nummer aus der Quelle> für docs/gestaltung/MENSCHEN.md, E-01 fortlaufend für docs/wert/EVALUIERUNG.md) · "quelle" · "fundstelle" (Datei:Zeile) · "inhalt" (ein Satz, nah am Wortlaut, nichts ergänzt) · "bestand" ("vorhanden" | "teilweise" | "fehlt" | "nicht pruefbar") · "bestand_fundstelle" (Datei:Zeile im Code oder in content, oder null) · "status" ("offen") · "pakete" ([]) · "beleg" (null). Eine Anforderung ist eine Soll-Aussage (muss, soll, darf nicht, empfohlen, Pflicht, Ziel) oder ein Element einer Soll-Liste (Navigationspunkt, Formularfeld, Schritt, Seite). Reine Beschreibung ohne Soll ist keine Anforderung.
Ausgabeformat der Datei: {"quelle": "...", "eintraege": [ … ]} als gültiges JSON (UTF-8, Umlaute direkt).

## 6. Maßstab
Vorbild für den Abgleich: docs/wert/EVALUIERUNG.md Abschnitt 4 (Leitfaden-Abgleich Soll/Ist). Code: /home/user/schluesselmacher24/src, content.

## 7. Grenzen
Nur lesen außer deiner Ausgabedatei. Nichts erfinden: Wenn du den Bestand nicht findest, setze "fehlt" nur nach Suche mit mindestens zwei Suchbegriffen, sonst "nicht pruefbar".

## 8. Schritte
1. Ergänzender Leitfaden: /home/user/schluesselmacher24/docs/leitfaden/Ergaenzender-Leitfaden-2026-10-08.txt vollständig (163 Zeilen); jede Anforderung als EL-Eintrag mit Quelle "EL".
2. MENSCHEN: docs/gestaltung/MENSCHEN.md; nur Einträge, die nach ihrem Wortlaut nicht vollständig erledigt sind, als M-Eintrag mit Quelle "M" (Kennung = die M-Nummer der Quelle, etwa M-03). Vollständig erledigte Einträge zählst du im Bericht, ohne Eintrag.
3. EVALUIERUNG: docs/wert/EVALUIERUNG.md; nur offene Befunde: Abschnitt 4 Zeilen mit Ist ungleich Soll, Abschnitt 5.5 nicht behobene Fehler, Abschnitt 10 offene Punkte. Je Befund ein E-Eintrag mit Quelle "E". Ideen aus Abschnitt 6 nur, wenn ihr Status dort offen und nicht verworfen ist.
4. Bestand je Eintrag mit grep im Code prüfen.
5. Schreibe die Datei mit "quelle": "EL, M, E".

## 9. Selbstprüfung
Die Datei ist gültiges JSON (prüfe mit `python3 -m json.tool _werkstatt/ausbau/erhebung/anforderungen-EL-M-E.json > /dev/null && echo ok`); Zahl der Einträge genannt; jede Fundstelle zeigt auf eine existierende Zeile (prüfe zehn Stichproben mit sed -n).

## 10. Ausgabe
Datei _werkstatt/ausbau/erhebung/anforderungen-EL-M-E.json und Bericht nach _werkstatt/ausbau/berichte/E0-DATENPFLEGER-03.md (höchstens 600 Wörter: Zahl der Einträge je Bestand-Wert, die zehn wichtigsten fehlenden Anforderungen).

## 11. Letzte Zeile
=== ENDE E0-DATENPFLEGER-03 · BEREIT ZUR RÜCKGABE ===
