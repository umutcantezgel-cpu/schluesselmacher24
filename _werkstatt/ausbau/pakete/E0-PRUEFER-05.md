# E0-PRUEFER-05 · Planwerkzeug plan.mjs und anforderungen.mjs

## 1. Kopfzeile
Kennung E0-PRUEFER-05 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 2 · Kern 2.0-Entwurf · Kostenklasse L · Anforderungen: Auftrag 9 (Planformat und plan.mjs), 3 (Anforderungs-Spur), Z-01, Z-03 · Schreibrechte: _werkstatt/ausbau/werkzeuge/plan.mjs, _werkstatt/ausbau/werkzeuge/anforderungen.mjs, _werkstatt/ausbau/werkzeuge/plan.pruef.mjs, _werkstatt/ausbau/werkzeuge/testdaten/** (neu), berichte/E0-PRUEFER-05.md · Umfang: zwei Werkzeuge mit Selbsttest

## 2. Rollenbriefing
Prüfer: richtet Werkzeuge ein, prüft nach seiner Stufe, schreibt Tests für neue Logik und berichtet knapp mit Belegpfaden. Fehler: Entwicklungsserver statt Produktions-Build; Einzelmessung statt Median aus drei Läufen; deuten statt berichten.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran. Du änderst keine Projektdatei.

## 3. Aufgabe in einem Satz
Baue plan.mjs und anforderungen.mjs nach dem Schema unten als reines Node-ESM ohne Abhängigkeiten, mit einem Selbsttest auf erfundenen Testdaten.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar mit Fertigung, Beratung und Außendienst, mit Schwerpunkt Wetzlar und Hessen und bestellbar in ganz Deutschland. Kundinnen und Kunden bestellen Autoschlüssel mit Anzahlung, Schlüssel nach Code, nach Foto oder per Einsendung, gleichschließende Zylinder und Schließanlagen über Konfiguratoren, oder sie schicken eine vollständige Anfrage. Technisch ist es Next.js 16 mit React 19, TypeScript strikt, Tailwind 3.4 und Payload 3.90 auf Postgres mit Stripe, Resend und S3-Ablage; ohne Datenbank liest die Seite content/*.json. Dieser Lauf baut den Bestand aus: ein Hub „Wobei können wir Ihnen helfen?“ im ersten Bildschirm, Rubriken aus Daten, ein Abschluss für alle Wege und neue Wege für Fahrzeuge, Einsenden, Konfiguratoren, Partner und Karte. Maßstab sind Laien ohne Geduld, offene Preise, Ehrlichkeit über Prüfungen, Berechtigungsnachweise, die nie geschwächt werden, und ein Bestand, von dem nichts verloren geht.

## 5. Kern-Auszug (unveränderlich): Schema
Pfade: PLAN = _werkstatt/ausbau/PLAN.json, ANF = _werkstatt/ausbau/ANFORDERUNGEN.json, ABNAHME = _werkstatt/ausbau/ABNAHME.md; jedes Werkzeug nimmt mit `--plan <datei>`, `--anf <datei>`, `--abnahme <datei>` andere Pfade (für Tests).

PLAN.json:
```
{ "version": 1, "stand": "ISO-Zeit",
  "etappen": [ { "kennung": "E3", "ziel": "…", "eingang": "…", "ausgang": "…", "tor": "…", "kriterien": ["Z-02"], "tage": 1.0 } ],
  "pakete": [ { "kennung": "E3-BAUMEISTER-07", "titel": "…", "etappe": "E3", "welle": 2,
      "rolle": "Baumeister", "modell": "haiku-5.5" | "opus-5.5", "stufe": 1 | 2 | 3, "kostenklasse": "S" | "M" | "L",
      "schreibrechte": ["src/…"], "abhaengigkeiten": ["E3-…"], "anforderungen": ["G-01"], "kriterien": ["Z-04"],
      "art": "pflicht" | "kuer", "wirkung": 1-5,
      "status": "offen" | "bereit" | "läuft" | "abgenommen" | "committet" | "blockiert" | "zurückgestellt",
      "grund": null | "…", "versuche": 0, "commit": null | "sha", "massstab": null | "pfad", "muster": null | "pfad" } ],
  "mengengeruest": { "frei": "…" },
  "kapazitaet": { "pakete_pro_tag": { "S": 12, "M": 8, "L": 3 }, "puffer": 0.2, "tage": 0 },
  "kritischer_pfad": ["E3-…"],
  "vorrat": ["E10-…"] }
```
ANFORDERUNGEN.json:
```
{ "version": 1, "stand": "ISO-Zeit", "eintraege": [ { "kennung": "G-01", "quelle": "G" | "L" | "EL" | "M" | "E" | "K",
  "fundstelle": "…", "inhalt": "…", "bestand": "vorhanden" | "teilweise" | "fehlt" | "nicht pruefbar" | null, "bestand_fundstelle": null | "…",
  "status": "offen" | "in Arbeit" | "umgesetzt" | "später" | "menschensache" | "entfällt", "pakete": ["…"], "beleg": null | "…", "gruppe": null | "…" } ] }
```
Endstatus = umgesetzt, später, menschensache, entfällt; jeder Endstatus braucht beleg (nicht leer). „später“ ist nur für G-21 und G-50 erlaubt (sonst Befund). „entfällt“ braucht im beleg einen Verweis „ENTSCHEIDUNGEN.md#…“.
ABNAHME.md: Zeilen der Form `| Z-01 | … | Status | Beleg |`; Status-Spalte ist die vorletzte Spalte und enthält genau eines von „offen“, „erfüllt“, „AUSNAHME“, „UMGEBUNGSAUSNAHME“.

## 6. Maßstab
Stil der übrigen Werkzeuge (argumente() wie in lib.mjs, aber plan.mjs und anforderungen.mjs importieren NICHT aus lib.mjs, damit sie ohne Playwright laufen; kopiere die kleine argumente()-Funktion). Ausgaben deutsch, ohne Fachjargon.

## 7. Grenzen
Schreibrechte strikt. Die Werkzeuge schreiben PLAN.json und ANFORDERUNGEN.json nur bei `setze` bzw. nie (anforderungen.mjs schreibt nur ANFORDERUNGEN.md). Schreiben immer atomar (temporäre Datei, dann rename) und mit 1 Leerzeichen Einzug wie JSON.stringify(x, null, 1).

## 8. Schritte
1. plan.mjs mit Befehlen:
   - `pruefen`: Schema (Pflichtfelder, erlaubte Werte, Kennungen eindeutig); jedes Kriterium Z-01 bis Z-22 hat mindestens ein Paket; jedes Paket nennt mindestens eine Anforderung oder ein Kriterium; jede Anforderung aus ANF ist in mindestens einem Paket genannt oder hat einen Endstatus; keine Datei (Eintrag in schreibrechte) in zwei Paketen derselben Etappe und Welle; jedes Paket mit modell haiku-5.5 hat massstab und muster; modell nur opus-5.5 oder haiku-5.5; jede Abhängigkeit existiert; keine Zyklen; vorrat und kritischer_pfad nennen nur existierende Pakete. Ausgabe: „PLAN-PRÜFUNG: OK“ oder Liste der Befunde, Exit 0 bei OK, 1 bei Befunden.
   - `naechste [--plaetze 4] [--modell haiku-5.5|opus-5.5|alle]`: bereite Pakete = Status offen oder bereit, alle Abhängigkeiten abgenommen oder committet, Etappe ist die früheste Etappe mit offenen Pflichtpaketen (Kür aus späteren Etappen nur, wenn die aktuelle Etappe keine bereiten Pakete mehr hat), Welle ist die kleinste Welle mit offenen Paketen dieser Etappe, keine Überschneidung der Schreibrechte mit Paketen im Status läuft; sortiert Pflicht vor Kür, dann wirkung absteigend; höchstens --plaetze Haiku-Pakete (Opus-Pakete zählen nicht gegen die Plätze). Ausgabe: Tabelle Kennung · Titel · Modell · Klasse · Schreibrechte (Zahl).
   - `setze <kennung> <status> [--commit sha] [--grund text] [--versuch]`: setzt Status, optional Commit und Grund; --versuch erhöht versuche um 1; setzt stand auf jetzt.
   - `stand`: Zahlen für die Statuszeile: Etappe n/m (erste Etappe mit offenen Pflichtpaketen, Index und Gesamtzahl), Welle, Pflicht erledigt/gesamt (erledigt = committet), Kür erledigt/gesamt, laufende Pakete, blockierte Pakete mit Grund; mit `--zeile` genau eine Zeile im Format „Etappe 3/11 · Welle 2 · Pflicht 12/80 · Kür 0/20 · läuft 3 · blockiert 1“.
   - `zeichne`: schreibt _werkstatt/ausbau/PLAN.md: Kopf mit Stand und Zahlen, je Etappe Ziel, Tor, Kriterien, Tage, dann je Welle eine Tabelle der Pakete (Kennung, Titel, Modell, Klasse, Art, Wirkung, Status, Commit); am Ende kritischer Pfad und Vorrat.
   - `abschluss`: prüft alle Pflichtpakete committet, alle Einträge in ANF mit Endstatus und beleg, alle Zeilen Z-01 bis Z-22 in ABNAHME.md mit Status erfüllt, AUSNAHME oder UMGEBUNGSAUSNAHME (höchstens zwei AUSNAHME, keine AUSNAHME für Z-02, Z-03, Z-14, Z-20) und gibt genau „ABSCHLUSS-PRÜFUNG: BEREIT“ aus oder „ABSCHLUSS-PRÜFUNG: LÜCKEN“ mit der Liste.
2. anforderungen.mjs mit Befehlen:
   - `pruefen`: Schema, Kennungen eindeutig, Status erlaubt, Endstatus mit beleg, Regel für später und entfällt; Zahlen je Quelle und Status; „belegt“ = Endstatus mit beleg. Ausgabe „ANFORDERUNGEN-PRÜFUNG: OK · belegt n/gesamt“ oder Befunde; Exit wie oben.
   - `zeichne`: schreibt _werkstatt/ausbau/ANFORDERUNGEN.md: Kopf mit Zahlen je Quelle und Status, dann je Quelle eine Tabelle Kennung · Inhalt (gekürzt auf 120 Zeichen) · Bestand · Status · Pakete · Beleg.
   - `zusammenfuehren <datei…>`: liest Teildateien im Format {"quelle", "eintraege"} und fügt Einträge mit neuen Kennungen an ANF an (bestehende Kennungen bleiben unverändert, Dubletten werden gemeldet); schreibt ANF atomar; gibt Zahl neuer Einträge aus.
3. plan.pruef.mjs: Selbsttest mit node:test und node:assert, der unter _werkstatt/ausbau/werkzeuge/testdaten/ erfundene Dateien anlegt (kleiner Plan mit 2 Etappen, 6 Paketen, Abhängigkeiten, einer Dateiüberschneidung in derselben Welle, einem Haiku-Paket ohne Muster; ANF mit 5 Einträgen; ABNAHME mit 22 Zeilen) und jede Regel von pruefen, naechste, setze, stand, zeichne (in eine Testdatei über --ausgabe <datei>, die zeichne zusätzlich verstehen muss) und abschluss sowie anforderungen pruefen, zeichne (ebenfalls mit --ausgabe) und zusammenfuehren mindestens einmal positiv und einmal negativ prüft. Aufruf: `node --test _werkstatt/ausbau/werkzeuge/plan.pruef.mjs`.
4. Führe den Selbsttest aus, bis er grün ist (höchstens drei Reparaturrunden).

## 9. Selbstprüfung
Selbsttest grün; jede Regel aus Schritt 1 und 2 hat mindestens einen Test (zähle sie im Bericht); keine Abhängigkeiten außer Node-Bordmitteln.

## 10. Ausgabe
Bericht nach _werkstatt/ausbau/berichte/E0-PRUEFER-05.md mit der Ausgabe des Selbsttests (Zusammenfassungszeilen).

## 11. Letzte Zeile
=== ENDE E0-PRUEFER-05 · BEREIT ZUR RÜCKGABE ===
