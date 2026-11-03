# E5-OPUS-03 · Schließplan als PDF und Vorgang mit vollständigem Schnappschuss

Paket der Etappe E5, Welle 2 (Opus, Klasse M). Anforderungen G-27 (Schließplan als PDF), G-37 (strukturiertes PDF je Anfrage, Druckblatt als Grundlage), E-103 (Nachbestell-Ablauf für Hausverwaltung und Gewerbe). Kriterien Z-06, Z-19. Commit 99b5a9f.

## Ergebnis
- Vorgang: Eine Anfrage aus dem Schließplan-Planer (`payload.quelle = schliessplan-planer`) baut der Server neu. `planAusDaten` prüft den Plan nach demselben Schema wie den Link (doppelte Kennungen verwerfen, unbekannte Türen und doppelte Matrixeinträge fallen weg), `pruefePlan` darf keinen Fehler melden, Zusatzwünsche nur aus dem Katalog, Notiz höchstens 2000 Zeichen, Einwilligung als Wahrheitswert. Der Schnappschuss (Türen und Schlüssel nummeriert, Namen aus dem Katalog, Matrix als Türnummern je Schlüssel, Ebene, Vormerkung, „Maße geprüft“, Preisweg, Wünsche) kommt immer vom Server; ein mitgeschickter wird verworfen. Ungültige Pläne enden mit der allgemeinen Fehlermeldung.
- Vorgangsblatt: `vorgangsblattInhalt` hängt nach den Angaben des Kunden die Abschnitte aus dem Schnappschuss an: Türen, Schlüssel, Schließmatrix in Blöcken zu höchstens zwölf Türen (schmale Spalten, Rest als leere Spalte), Eckdaten mit vorgemerkten Schlüsseln „für spätere Nachbestellungen“. Damit tragen Admin-Abruf und Anhang der Betriebsmail den vollständigen Plan (G-37). Ältere Vorgänge ohne Schnappschuss bleiben unverändert.
- Herunterladen: `GET /schliessanlagen/konfigurator/schliessplan/pdf?plan=…` setzt aus dem Link des Planers ein eigenes Blatt „Schließplan · Entwurf“ (Eckdaten im Kopf, Fuß „Dieses Blatt ist keine Bestellung.“). Nichts wird gespeichert, keine Kontaktdaten, eigene Ratenbegrenzung (20 je 10 Minuten), `no-store` und `noindex`. Im Planer steht „Schließplan als PDF“ neben „Plan als Link speichern“, solange der Plan in einen Link passt.
- Nachbestellung (E-103): Nach dem Absenden erklärt der Planer, dass unter der Vorgangsnummer der Schließplan gespeichert ist, und verweist auf den Abschnitt „Nachbestellen“ mit Sicherungskarte (R13).

## Prüfung
- Prüfstufe A: Typprüfung und Lint sauber, Unit 2041 von 2041 (neu: vorgang.test.ts 8, schliessplan.test.ts 4, security.test.ts 1), DB-Tests 97 von 97, Build ohne Datenbank 226 Seiten (Route dynamisch).
- Beleg am laufenden Server: Antwort 200 mit `application/pdf`, `inline; filename="Schliessplan.pdf"`, `no-store`, `noindex`; ungültiger Link 400. Bild der Seiten: Plan mit 2 Türen (eine Seite) und mit 14 Türen (drei Seiten, Tabellenköpfe wiederholt, Matrix in Blöcken 1 bis 12 und 13 bis 14).
- Gegenprüfung durch einen Haiku-Skeptiker (schmal wegen des Kontofensters, A-027), fünf Befunde, behoben in 34a4342:
  1. hoch: Ein Schnappschuss ließ sich mit einer anderen Vorgangsart einschleusen. Jetzt entfernt die Aktion das Feld aus allen anderen Anfragen, und das Vorgangsblatt liest ihn nur bei Projekt, Projektkonfigurator und Quelle des Planers (Test in security.test.ts und schliessplan.test.ts).
  2. mittel bis hoch: Die Zusammenfassung kam aus dem Browser. Jetzt bildet der Server sie aus dem Schnappschuss, mit der Nachricht des Kunden, die vorher in keinem Blatt stand.
  3. mittel: Das PDF zum Herunterladen rechnete ohne Zusatzwünsche. Jetzt trägt der Link `?wuensche=` (nur bekannte Kennungen).
  4. niedrig: Die Route antwortet bei einem Fehler mit 500 und eigenem Text statt mit der Fehlerseite.
  5. niedrig, bewusst offen: Die Route prüft nicht wie der Vorgang, damit auch Entwürfe druckbar sind; Größe begrenzt durch den Link (6000 Zeichen) und die Ratenbegrenzung.
- Danach Unit 2042 von 2042, Typprüfung und Lint sauber.

## Offen
- Die HTML-Druckansicht im Admin zeigt den Plan weiter nur über die Zusammenfassung; das PDF ist vollständiger (an E9, Vorgangsblätter).
- Eigene Kopie des Schließplans an den Kunden per Mail ist nicht gebaut (keine Anforderung verlangt sie; Herunterladen genügt G-27).
- Der Preisweg „Angebot“ nennt im Blatt den Grund aus dem Planer wörtlich.
