# FA-SHOP-03 · Versand eingesendeter Schlüssel: DHL Paket, Einschreiben Einwurf, Einschreiben Wert mit Kosten und ehrlicher Haftung

Kopf: Etappe FA Priorität 3 · Rolle Baumeister · Modell Opus · Stufe 3 (Versand-Adapter, Preisanzeige) · Kostenklasse L · ändert das Datenschema und nutzt `sicher.sh --pg` (in dieser Zeit kein anderes Paket) · Anforderungen FA-13-01 bis FA-13-10, FA-AB-01 bis FA-AB-03, FA-22-25, FA-22-26, FA-12-06, FA-12-07 · Befunde: `berichte/FA-ABGLEICH.md` Block 06, `berichte/FA-BLINDPRUEFUNG-06.md` · Recherche: `erhebung/FA-RECHERCHE-03.md`, `erhebung/E1-versand.md` · Entscheidung A-050.

## Aufgabe in einem Satz
Ersetze die zwei Einsendeoptionen „versichert“ und „unversichert“ durch die drei Varianten des Inhabers mit Kosten und wahrem Haftungshinweis, empfiehl für wertvolle Originalschlüssel das DHL Paket, speichere Variante und Sendungsnummer am Auftrag und bereite die automatische Labelerzeugung vor.

## Vorgabe des Inhabers (wörtlich, Arbeitsanweisung vom 11.11.2026, Abschnitt 13 und Anhang B)
- „Der Einsendeprozess soll möglichst direkt aus der Website heraus funktionieren. Idealerweise wird die bestehende DHL beziehungsweise Deutsche Post Geschäftskundenlösung angebunden oder ein kompatibler Versanddienst integriert.“
- Tabelle: DHL Paket · empfohlene Standardoption für wertvolle Originalschlüssel · Sendungsverfolgung und Haftung national bis 500 Euro; Kunde trägt Versandkosten oder diese werden im Auftrag berechnet. — Einschreiben Einwurf · günstige Briefoption für weniger wertvolle Sendungen · dokumentierte Zustellung, aber Haftung nur bis 20 Euro; darf nicht pauschal als voll versichert beworben werden. — Einschreiben Wert · nur für geeignete Sonderfälle · höhere Absicherung, aber Einlieferung in Filiale nötig.
- „Wenn ein Geschäftskundenkonto vorhanden ist, Versandmarken beziehungsweise Retourenlabels möglichst automatisch erzeugen. Kunde kann Versandart auswählen und Kosten vor Abschluss sehen. Für Original Autoschlüssel standardmäßig eine Variante mit ausreichender Haftung empfehlen. Verpackungshinweis anzeigen: Schlüssel nicht lose in einfachen Papierumschlag legen, sondern gepolstert beziehungsweise stabil verpacken. Sendungsnummer im Kundenauftrag und Adminbereich speichern.“
- Abschnitt 12: „Wenn eine sichere Fertigung nur am Original möglich ist, soll der Kunde den Schlüssel einfach einsenden können. Auch mechanische Autoschlüssel beziehungsweise reine Schlüsselbärte können je nach Fall eingesendet werden.“

## Zuschnitt (vom Orchestrator, 16.11.2026)
Das Paket ist geteilt. Du baust Teil A (dieser Auftrag): die Punkte 1 bis 5 unter „Entscheidung (A-050), so bauen“ (Varianten als Daten, Wahrheit vor Werbung, Empfehlung, Kosten vor Abschluss, Verpackungshinweis). Die Punkte 6 bis 8 (Sendungsnummer durch den Kunden, vorbereiteter Label-Anschluss, Status der Einsendung) gehören zu Teil B (`pakete/FA-SHOP-03B.md`) und bleiben unberührt. Von den Pflichttests gehören „Sendungsnummer erscheint in Kundenansicht und Admin“ und „ohne Vertrag kein Label-Aufruf“ zu Teil B. Schreibe am Ende des Berichts einen Abschnitt „Stand für Teil B“: welche Typen, Felder und Funktionen Teil B benutzen kann (Namen, Dateien), und was dort noch fehlt.

Stand des Bestands seit dem Brief: Die Formulare sind in FA-QA-02 auf Bedienbarkeit geprüft (Hilfeblock, Fehlermeldung beim Absenden, Rückfrage vor dem Verlassen mit gewählten Dateien; lies `berichte/FA-QA-02.md`), die Pflichtunterlagen laufen über eine Regel (`src/lib/server/unterlagen-pflicht.ts`, FA-KERN-02) und die Steckplätze der Schlüsselfotos; beides bleibt. Sichtbare Texte der Einsendeseiten stammen aus FA-INHALT-03: nur ändern, was die Varianten verlangen.

## Lage (geprüft)
- `src/lib/versand` (typen.ts, angebot.ts, begleitschein.ts, dhl-retoure.ts), `src/lib/einsenden`, Einstellungen → Versand → „Schlüssel einschicken“ (labelAktiv, Aufpreise, Porto versichert 4,45 Euro und unversichert 1,80 Euro, Haftung 25 Euro, Stand der Portopreise). Der Kunde wählt heute „versichert“ (Einschreiben, 25 Euro) oder „unversichert“ (Großbrief). Der DHL-Retouren-Adapter ist gebaut und abgeschaltet (kein Vertrag, MA-08). Die Einsendung nach einer Freigabe ist fest auf „versichert“ gestellt. Originale Autoschlüssel sind im Einsendeformular ausgeschlossen.
- Recherche 03 nennt Haftung und Preise mit Quelle und Stand; lies sie und übernimm nur belegte Werte.

## Entscheidung (A-050), so bauen
1. Varianten als Daten in den Einstellungen (additiv, die alten Felder bleiben lesbar): je Variante Kennung, Bezeichnung, Einsatz in einem Satz, Haftung in Euro, Sendungsverfolgung ja oder nein, Einlieferung (Briefkasten, Filiale oder Paketshop), Porto in Euro mit Stand und Quelle, „empfohlen für“ (Originalschlüssel, Autoschlüssel), „nur Sonderfall“ (wird nur gezeigt, wenn das Team es am Vorgang freigibt oder der Kunde es ausdrücklich wählt und den Hinweis bestätigt), aktiv. Startwerte: die drei Varianten des Inhabers mit den Haftungswerten aus seiner Tabelle (500 Euro, 20 Euro) und den belegten Preisen der Recherche; ist ein Wert nicht belegt, bleibt das Feld leer und die Seite sagt „Porto laut Post, bitte dort prüfen“. Der bisherige Großbrief „unversichert“ entfällt als Kundenwahl.
2. Wahrheit vor Werbung: Das Wort „versichert“ steht bei keiner Variante allein. Jede Variante zeigt Haftung als Zahl („Haftung der Post bis 20 Euro“), und der Einwurf trägt den Satz, dass der Wert eines Autoschlüssels meist darüber liegt. Kein „kostenlos“, solange der Kunde das Porto trägt (R9).
3. Empfehlung: Bei Original-Autoschlüsseln, Schlüsseln mit Elektronik und allem, was der Kunde als wertvoll angibt, ist „DHL Paket“ vorausgewählt und als Empfehlung gekennzeichnet; der Einwurf bleibt wählbar mit Warnhinweis. Mechanische Autoschlüssel und reine Bärte dürfen eingesendet werden (Ausschluss im Formular aufheben, soweit er dem Inhaber widerspricht; Schlüssel mit Elektronik nur mit Empfehlung DHL Paket). Der Berechtigungsnachweis für Fahrzeugschlüssel bleibt (R13: Fahrzeugschein).
4. Kosten vor Abschluss: Der Kunde sieht je Variante Porto, einen etwaigen Aufpreis des Betriebs und die Summe, bevor er absendet. Zwei Betriebsarten wie im Bestand: ohne Label kauft der Kunde das Porto selbst (die Seite nennt den Tarif der Post als Angabe mit Stand); mit aktivem Label (Geschäftskundenvertrag) erzeugt die Seite das Label und rechnet die Kosten im Auftrag ab. Dieselbe Wahl und Anzeige gilt für die Einsendung nach einer Freigabe (bisher fest „versichert“).
5. Verpackungshinweis im Formular, auf dem Begleitschein, in der Bestätigungsmail und auf der Landingpage, im Wortlaut des Inhabers: nicht lose in einen einfachen Papierumschlag, sondern gepolstert und stabil verpacken.
6. Sendungsnummer: Der Kunde kann seine Einlieferungs- oder Sendungsnummer auf der Vorgangsseite nachtragen (signierter Zugang wie im Bestand); sie steht im Kundenauftrag, im Admin, im Vorgangsblatt und in der Statusmail. Getrennt geführt: Sendung zur Werkstatt und Rücksendung an den Kunden (das Feld für die Rücksendung gibt es schon). Im Admin lässt sich zusätzlich eine Labeldatei am Vorgang ablegen.
7. Label über Schnittstelle, vorbereitet und abgeschaltet: Die Versandschnittstelle (`src/lib/versand`) bekommt neben der DHL-Retoure einen zweiten, abgeschalteten Anschluss für das DHL-Paket-Label für Geschäftskunden nach der Recherche (nur Aufbau, Sandbox-Adresse, Attrappe in Tests; kein echter Aufruf, G3 und G5). Im Admin steht, welcher Weg aktiv ist und was dafür fehlt. Die Schritte für den Vertrag stehen im Bericht unter FÜR MENSCHEN.
8. Status der Einsendung für den Kunden: angemeldet · unterwegs zu uns (wenn eine Sendungsnummer vorliegt) · eingegangen · geprüft, Angebot · in Fertigung · Rückversand mit Sendungsnummer. Nutze die vorhandenen Stände; ergänze nur, was fehlt.

## Schreibrechte
- src/lib/versand/**, src/lib/einsenden/**, src/app/(site)/schluessel-einschicken/**, src/app/(site)/bestellung/[id]/** (Einsendeteil, Sendungsnummer), src/lib/mail/vorlagen (Einsendung, Freigabe mit Einsendung), src/lib/pdf (Begleitschein), src/payload/globals/Einstellungen.ts (nur „Schlüssel einschicken“), src/payload/collections/Vorgaenge.ts (nur Versand- und Einsendefelder), neue Migration (`sicher.sh --pg -- npx payload migrate:create einsende_varianten`), src/migrations/index.ts, src/payload-types.ts, src/payload/seed.ts (neue Felder ergänzen), content/settings.json (nur `sendIn`), src/lib/data/payload-mapping.ts und defaults/settings.ts (nur Einsenden), src/lib/types.ts (nur Einsende-Typen), src/lib/rechtliches/texte.ts nur, wenn dort Portowerte berechnet eingesetzt werden (Wortlaut der Rechtstexte nicht ändern; sonst als Entwurf in den Bericht)
- zugehörige Tests; _werkstatt/ausbau/berichte/FA-SHOP-03.md
Nicht anfassen: Versandarten für Bestellungen aus dem Shop (Rückversand an Kunden) in ihren Preisen (G9), Rechtstexte, Navigation, Startseite.

## Prüfen
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`
- `_werkstatt/ausbau/werkzeuge/sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npm run build`
- Tests, die nicht fehlen dürfen: keine Variante heißt allein „versichert“; Einwurf zeigt 20 Euro; Autoschlüssel wählt DHL Paket vor; Summe stimmt; Sonderfall nur mit Freigabe oder Bestätigung; Sendungsnummer erscheint in Kundenansicht und Admin; ohne Vertrag kein Label-Aufruf.
- Lies vor Änderungen an Next-Schnittstellen die Anleitungen in `node_modules/next/dist/docs` (G12). Kein Server, kein git.

## Grenzen
G3, G5 (keine echten Versandmarken), G4, G6, G8, G9 (eigene Preise des Betriebs nicht ändern; Posttarife nur als belegte Angabe mit Stand), R4, R9, R10, R13. Texte kurz, verständlich, ohne Gedankenstriche. Prettier nicht auf Bestand anwenden.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS (Zahlen) · BELEGE (Quelle und Stand jedes Tarifs) · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-SHOP-03 · BEREIT ZUR RÜCKGABE ===
