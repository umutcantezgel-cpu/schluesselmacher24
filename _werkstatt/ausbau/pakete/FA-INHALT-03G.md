# FA-INHALT-03G · Texte menschlicher: Kasse, Vorgangsseite, Terminstatus, Bestätigungen, Mails an Kunden

Kopf: Etappe FA Priorität 5 · Rolle Autor · Modell Opus · Stufe 3 · Kostenklasse L · kein Datenschema · Anforderungen FA-02-01 bis FA-02-06, FA-01 (für ältere Kunden bedienbar), FA-26 (verständliche Fehlermeldungen, keine Sackgassen), FA-05 (Anzeige vor der Zahlung verständlich).

## Auftrag
Es gelten vollständig die Regeln, der Ablauf, die Prüfungen und das Ausgabeformular aus `_werkstatt/ausbau/pakete/FA-INHALT-03.md` (lies die Datei zuerst ganz; sie enthält die Vorgabe des Inhabers im Wortlaut). Diese Datei nennt dir nur die Seitengruppe und die Schreibrechte.

## Seitengruppe
- Kasse: src/app/(site)/kasse/page.tsx; in kasse-formular.tsx nur sichtbare Beschriftungen, Hilfetexte und Fehlermeldungen
- Vorgangsseite: src/app/(site)/bestellung/[id]/** (Stand, nächste Schritte, Zahlung, Erstattung, Begleitschein-Hinweise) und die Texte, die sie erzeugen (`src/lib/kundenstatus.ts`, `src/lib/wege/naechste-schritte.ts`, `src/lib/zahlung/ansicht.ts`: nur Wortlaut)
- Terminstatus: src/app/(site)/service-und-termin/terminstatus/**
- Bestätigungen nach dem Absenden: src/components/weg/bestaetigung.tsx, src/components/autoschluessel/bestaetigung.tsx (nur Wortlaut), `/auftrag-bestaetigen/[id]`
- Mails an Kunden: src/lib/mail/vorlagen/** (Betreff und Fließtext der Kundenmails: Eingang, Status, Freigabe, Zahlung, Erinnerung, Ausführung, Nachricht-Vorlagen in `src/lib/mail/nachricht-vorlagen.ts`)

## Besonderheiten dieser Gruppe
- Unantastbar (G9, R10), wörtlich lassen: Widerrufsbelehrung und Widerrufshinweise, AGB-Auszüge und AGB-Kurzfassungen (auch der als ENTWURF markierte Text für den Partnerweg), Pflichtangaben und Einwilligungstexte, der Wortlaut des Bestellknopfs („zahlungspflichtig bestellen“ oder gleichwertig) und alles, was eine Zustimmung des Kunden beschreibt, Preisangaben mit Steuerhinweis, die Vertragsbestätigung als Ganzes (`vertragsbestaetigung.ts`, `vertrag.ts`). Wenn dir dort etwas unklar oder sprachlich schwach erscheint, nenne es im Bericht unter FÜR MENSCHEN; ändere es nicht.
- Beträge, Fristen, Zeitfenster und Zahlungsregeln stehen nie als eigener Text da: Sie kommen aus den Daten. Du änderst keine Logik, keine Platzhalter und keine Bedingungen, nur den Wortlaut zwischen ihnen. Anzahlung, Gesamtbetrag, Rest beim Termin und der Auftragsweg heißen überall so wie in FA-KERN-03 und FA-KERN-04 (lies `berichte/FA-KERN-03.md` und `berichte/FA-KERN-04.md`): Im Direktweg „Anzahlung“ und „Rest beim Termin“, im Partnerweg „Gesamtbetrag“ und „vermittelter Termin“; nie vermischen.
- Statusmails und Vorgangsseite sagen in einem Satz, was geschehen ist, und in einem zweiten, was der Kunde jetzt tun muss oder dass er nichts tun muss. Keine internen Wörter (Vorgang nur zusammen mit „Vorgangsnummer“, sonst „Auftrag“ oder „Anfrage“, je nachdem was es ist; nie „Fotoanfrage“, „Codelinie“, „Steckplatz“).
- Erreichbarkeit und Telefon kommen aus den Einstellungen; keine eigenen Sätze zu Zeiten. Die Signatur der Mails bleibt, wie die Einstellungen sie liefern.
- Persönliche Links (Zahlung, Bestätigung, Upload) bleiben technisch unverändert; nur der Satz davor darf klarer werden.
- Betreffzeilen: kurz, ohne Gedankenstriche, das Wichtige vorn; die Vorgangsnummer bleibt im Betreff, wo sie heute steht (das Team sucht danach).
- Tests binden manche Sätze wörtlich (zum Beispiel Verlaufstexte und Betreffe). Ändert sich ein Satz, passt du die Erwartung im Test an und sagst es im Bericht; du lockerst keine Prüfung (G8).
- Gleichzeitig arbeiten zwei andere Pakete: FA-SHOP-01 (Datenmodell des Shops, `src/payload`, Shopseiten, `src/lib/actions/orders.ts`) und FA-SEO-01C (Strukturdaten, Brotkrumen, Verweislisten in Seitenvorlagen). Fasse deren Stellen nicht an und ändere geteilte Dateien nur mit dem Bearbeitungswerkzeug an einzelnen Stellen. Ein roter Test in fremden Dateien ist nicht dein Fehler; wiederhole den Lauf und nenne es im Bericht.

## Schreibrechte
Die oben genannten Dateien, jeweils nur sichtbarer Wortlaut; Tests dieser Dateien; `_werkstatt/ausbau/berichte/FA-INHALT-03G.md`.
Nicht anfassen: Rechtstexte und alles unter „Unantastbar“, `src/lib/actions/**`, `src/payload/**`, Zahlungslogik, Mails an das Team (nur Kundenmails), `content/**`, Navigation, SEO-Felder, Strukturdaten.

=== ENDE FA-INHALT-03G · BEREIT ZUR RÜCKGABE ===
