# E6-PROBENUTZER-01 · Probelauf der Wege mit vier Personas

Stand 4. November 2026, Server http://localhost:3000.

## GEÄNDERTE DATEIEN
- Neu, nur im Protokollordner: `_werkstatt/ausbau/protokolle/E6-PROBENUTZER-01/` mit `lauf.mjs` (einziges Skript), `lauf-<id>.json` (acht Läufe), `zusammenfassung.json`, `testbild-erfunden.png`, `bilder/` (25 JPEG, 1,3 MB).
- Bericht: `_werkstatt/ausbau/berichte/E6-PROBENUTZER-01.md`.
- Nicht von mir geändert, aber durch `sicher.sh` beschrieben: `_werkstatt/ausbau/protokolle/datenweiche.log`. Nicht committen.

## WAS UND WARUM
Acht Läufe (vier Personas, mobil 390 × 844 und Desktop 1440 × 900), nur sichtbare Knöpfe und Links, Formulare bis vor „Absenden“. Terminstatus mit SM24-T-2026-9999 in allen acht Läufen.

Grenzen: Das Skript denkt nicht. Gedankenzitate der Personas fehlen, Zitate stammen wörtlich aus den Seiten. „Zögern“ ist ersetzt durch Sichtbarkeitswartezeit über 5 s (Proxy). Das Skript wählt bei Pflicht-Auswahl ohne Vorauswahl die erste Option (Versandart „Versichert“, 4,45 €), außer bei der Rentnerin („Weiß ich nicht“).

## PRÜFUNG UND ERGEBNIS

| Lauf | Tipps Hub bis erste Eingabe | Tipps bis Ziel | Zeit | Ziel erreicht | Stopps |
|---|---|---|---|---|---|
| Rentnerin mobil | 3 | 12 | 12 s | ja | 2 |
| Rentnerin Desktop | 3 | 12 | 12 s | ja | 2 |
| Eilige mobil | 3 | 39 | 75 s | Warenkorb ja, Preis nein | 1 |
| Eilige Desktop | 2 | 38 | 70 s | Warenkorb ja, Preis nein | 1 |
| Verwalterin mobil | 1 | 9 | 9 s | ja | 2 |
| Verwalterin Desktop | 1 | 8 | 8 s | ja | 2 |
| Partner mobil | 1 | 6 | 7 s | ja | 1 |
| Partner Desktop | 1 | 6 | 7 s | ja | 1 |

- Prüfpunkt Hub bis erste Eingabe höchstens drei Tipps: erfüllt (1 bis 3).
- Anruf oder Rückruf auf jeder besuchten Seite (50 von 50) erreichbar, ohne Scrollen auf 29 von 50.
- Kostenhinweis im Text auf 39 von 50 Seiten (Stichwort-Heuristik).
- Zögern über 5 s: einmal (Eilige mobil).

Netzwerk: 26 Anfragen mit Methode außer GET. 13 Schritt-Anfragen („Weiter“ mehrstufiger Formulare), 5 Upload-Anfragen an `/api/kunden-upload` (durch die Fotoauswahl ausgelöst, abgefangen), 8 Terminstatus-Abfragen (lesend, vom Server beantwortet). Keine Absenden-Anfrage, keine Kasse, keine Zahlung. Kein Klick auf Absenden, Bezahlen oder Kasse.

Terminstatus, alle acht Läufe: „Nichts gefunden. Zu dieser Kombination aus Vorgangsnummer und E-Mail-Adresse wurde nichts gefunden. Bitte prüfen Sie Ihre Eingabe. Nehmen Sie Kontakt auf, wenn Sie Ihre Nummer nicht mehr haben.“

## STOLPERSTEINE (nach Wirkung)
1. **/autoschluessel/anfrage** (Eilige, beide Geräte): Der Schritt „Fotos hochladen“ bleibt nach der Foto-Auswahl stehen. Die Preisanzeige wurde nicht erreicht. Beleg: `lauf-eilige-mobil.json`, `befunde.assistentEnde`.
2. **/partner-werden**, Schritt 3 (beide Geräte): „Weiter“ bleibt gesperrt. Die Felder „Autohersteller und Systeme“ und „Qualifikationen“ haben keinen Pflichtvermerk. Der Grund ist nicht erkennbar. Beleg: `befunde.leere_textfelder_schritt_3`.
3. **/schluessel-einschicken/anmelden**, Schritt 2: Pflicht-Auswahl ohne Vorauswahl. Die erste Option verlangt ein Foto der Karte. Die Rentnerin muss die richtige Option erraten.
4. **/motorradschluessel**: kein direkter Weg zum Gehäuse. Der Umweg führt über das Logo und die Startseite. Beleg: Schritt-Protokoll der Eilige-Läufe.
5. **Mobil**: Ein Weg verlangt erst „Menü öffnen“, das kostet einen Tipp.
6. **/service-und-termin/terminstatus**: Bei unbekannter Nummer gibt es nur den Hinweis „Nehmen Sie Kontakt auf“. Ohne Nummer führt kein Weg weiter.
7. **/service-und-termin/vor-ort**: Der Satz „Wir klären, ob die Werkstatt oder ein Partner zu Ihnen kommen kann“ lässt offen, wer kommt. Beleg: `befunde.vorOrtPartner`.
8. **/service-und-termin/kontakt** (Verwalterin): Das Foto wird beim Auswählen sofort hochgeladen, also vor „Absenden“. Ob vorher ein Hinweis erscheint, ist nicht geprüft.

## GEMEINSAME DATEIEN
Keine Änderung gewünscht.

## OFFENE FRAGEN
- Die Attrappe beantwortet alle nicht lesenden Server-Aktionen mit einer Fake-Antwort. Ob sie die Schritte „Weiter“ und den Foto-Upload blockiert (Punkte 1 und 8), ist offen. Dafür braucht es einen Test mit echter Antwort.
- Gedanken der Personas und echtes Zögern sind nicht belegt. Bitte von Hand oder mit einem menschlichen Probenutzer ergänzen.
- Die Kostenhinweis-Heuristik ergibt 11 Seiten ohne Treffer. Diese sind von Hand zu prüfen.
- `datenweiche.log` ist im Git-Status verändert. Entscheidung beim Orchestrator.

=== ENDE E6-PROBENUTZER-01 · BEREIT ZUR RÜCKGABE ===

## ABNAHME DURCH DEN ORCHESTRATOR (886a8f6e)
- 1 Assistent hängt im Fotoschritt: kommt von der Attrappe. Die Upload-Attrappe in werkzeuge/lib.mjs lieferte kein `uploadToken`, und photo-upload.tsx wertet das als Fehler. Die Attrappe ist behoben, der Weg bis zum Preis wird in E6-PRUEFER-01 (F-Liste) erneut belegt.
- 2 Partner Schritt 3: kein Produktfehler. „Weiter“ ist gesperrt, bis eine Leistung gewählt ist, und darüber steht „Bitte wählen Sie mindestens eine Leistung aus.“ (flow-shell.tsx blockedHint). Das Skript hatte keine Leistung gewählt.
- 3 Einschicken Schritt 2 ohne Vorauswahl: gewollt, Pflichtwahl ohne Voreinstellung, „Weiß ich nicht“ ist vorhanden.
- 4 Motorrad ohne Weg zum Gehäuse: kein Befund. Das Gehäuse-Angebot gilt Autoschlüsseln.
- 5 Menü mobil: üblich, der Hub erreicht alle Rubriken ohne Menü.
- 6 Terminstatus: „Nehmen Sie Kontakt auf“ ist ein Link auf /service-und-termin/kontakt, also keine Sackgasse.
- 7 Vor Ort „Werkstatt oder Partner“: ehrlich formuliert (R4), bleibt so.
- 8 Upload beim Auswählen: gewollt (Vorab-Upload mit Token), vorgemerkt für die Prüfung, ob die Seite das vorher sagt.
- Grenzen des Laufs: Gedanken und Zögern der Personas sind nicht belegt, weil das Skript sie nicht erheben kann. Die 11 Seiten ohne Kostentreffer prüft E6-PRUEFER-01 mit. Urteil: abgenommen, ohne Produktänderung.
