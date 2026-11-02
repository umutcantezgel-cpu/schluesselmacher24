# E0-KUNDSCHAFTER-01 · Technik und Datenmodell

## 1. Kopfzeile
Kennung E0-KUNDSCHAFTER-01 · Rolle Kundschafter · Modell Haiku 5.5 · Stufe 1 · Kern 2.0-Entwurf · Kostenklasse M · Anforderungen: Auftrag 10, 18 E0, LAGEBILD · Schreibrechte: _werkstatt/ausbau/berichte/E0-KUNDSCHAFTER-01-technik.md · Umfang: siehe Schritte

## 2. Rollenbriefing
Kundschafter: erfasst einen Bereich vollständig mit Datei- und Zeilenangaben. Fehler, die du vermeidest: zusammenfassen statt auflisten; Vermutung als Befund; Teile außerhalb der Navigation übersehen.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran. Du änderst KEINE Projektdatei; du liest nur und schreibst ausschließlich deine Berichtsdatei.

## 3. Aufgabe in einem Satz
Erfasse Technik und Datenmodell des Bestands vollständig mit Datei- und Zeilenangaben, damit der Orchestrator Rubriken-Modell, Fahrzeugkatalog, Konfigurator-Kern, Versand-Adapter, Vorgangsblatt und Partner-Modelle als Erweiterung statt als Duplikat planen kann.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar mit Fertigung, Beratung und Außendienst, mit Schwerpunkt Wetzlar und Hessen und bestellbar in ganz Deutschland. Kundinnen und Kunden bestellen Autoschlüssel mit Anzahlung, Schlüssel nach Code, nach Foto oder per Einsendung, gleichschließende Zylinder und Schließanlagen über Konfiguratoren, oder sie schicken eine vollständige Anfrage. Technisch ist es Next.js 16 mit React 19, TypeScript strikt, Tailwind 3.4 und Payload 3.90 auf Postgres mit Stripe, Resend und S3-Ablage; ohne Datenbank liest die Seite content/*.json. Dieser Lauf baut den Bestand aus: ein Hub „Wobei können wir Ihnen helfen?“ im ersten Bildschirm, Rubriken aus Daten, ein Abschluss für alle Wege und neue Wege für Fahrzeuge, Einsenden, Konfiguratoren, Partner und Karte. Maßstab sind Laien ohne Geduld, offene Preise, Ehrlichkeit über Prüfungen, Berechtigungsnachweise, die nie geschwächt werden, und ein Bestand, von dem nichts verloren geht.

## 5. Kern-Auszug (unveränderlich)
Ausbauen statt neu bauen: Jede spätere Erweiterung fügt sich in vorhandene Sammlungen, Felder, Hooks, Zugriffsregeln, Datenpfade und Tests ein. Dein Bericht ist die Grundlage dafür; jede Angabe braucht eine Fundstelle Datei:Zeile.

## 6. Maßstab
/home/user/schluesselmacher24/src/payload.config.ts, src/payload/** (collections, globals, fields, access, hooks, components, seed.ts, betrieb.ts), src/migrations/**, src/lib/** (besonders data/, umgebung.ts, integrations/, rate-limit, uploads), src/app/**/route.ts (API), scripts/*.mjs, content/*.json, vercel.json, next.config.ts, README.md, UMSETZUNG.md.

## 7. Grenzen
Nur lesen (G1, G2). Keine Befehle über die Datenweiche nötig; nutze grep, sed -n, ls, git log.

## 8. Schritte
1. Sammlungen: Liste jede Sammlung aus src/payload.config.ts mit Datei, slug, Zweck in einem Satz, Felderzahl, wichtigen Feldern (Name und Typ), Zugriffsregeln (read, create, update, delete mit Funktion und Datei:Zeile), Hooks und Uploads (ja/nein, staticDir oder Ablage).
2. Globals: dasselbe für jedes Global (Zylinderkatalog, Richtwerte, Einstellungen); bei Einstellungen alle Feldgruppen mit Feldnamen, bei Zylinderkatalog die Struktur (Systeme, Bauformen, Maße, Preise als Felder, ohne Werte abzuschreiben).
3. Migrationen: Liste aller Dateien in src/migrations mit Datum und Kurzinhalt; wie wird eine neue Migration erzeugt (Befehl aus package.json oder README).
4. Datenpfad und JSON-Fallback: Wie liest die Seite Daten mit und ohne Datenbank (Dateien, Funktionen, Bedingung mitDatenbank)? Welche content/*.json gibt es, mit Zahl der Einträge je Datei? Wie spiegelt der Seed content/*.json in die Datenbank (Startwert-Abgleich)?
5. Vorgänge: Vorgangsarten (Feld und Werte), Statusverläufe je Art (Werte und wo sie gesetzt werden), Nummernvergabe, Zahlungsstatus, Zahlungslink, Anzahlung (wo berechnet, welcher Wert, Datei:Zeile, Wert nicht abschreiben, nur „Wert im Bestand“).
6. Integrationen: Stripe (Checkout, Webhook, Abgleich-Cron), Resend (Mailvorlagen und Auslöser), S3-Ablage, GA4-Einwilligung; je Datei:Zeile und Schalter.
7. Uploads: die vorhandene Upload-Strecke (Signaturprüfung, Einmal-Schlüssel, Zuordnung, Ratenbegrenzung, Aufräumen) mit allen Dateien und Funktionen; Aufbewahrungs-Bereinigung (Fristen je Zweck als Feldnamen, Werte nicht abschreiben).
8. PDFs und Druck: Wo entsteht das Druckblatt (Kennzahlen und Druckblatt), womit (Bibliothek oder HTML-Druck), welche Vorgangsarten; gibt es schon PDF-Erzeugung im Projekt?
9. Admin: Dashboard-Komponenten (Kennzahlen), eigene Admin-Ansichten, Rollen in Benutzer.
10. API-Routen: Liste jeder route.ts mit Pfad, Methoden, Zweck, Schutz (Rate-Limit, Signatur, Cron-Geheimnis).
11. Tests: Zahl der Testdateien je Ordner (Unit *.test.ts, Datenbank *.db.test.ts), Testhilfen in src/test.
12. Abhängigkeiten: Versionen aus package.json und tatsächlich installiert, falls node_modules existiert (`node -p "require('/home/user/schluesselmacher24/node_modules/next/package.json').version"` und ebenso für payload, react, stripe, framer-motion, tailwindcss, zod); veraltete oder doppelte Bibliotheken.
13. Lücken gegen das Gespräch: Gibt es schon etwas zu Fahrzeugkatalog (Marke, Modell, Baujahr), Versand oder Versandschein, Partner-Abrechnung oder Provision, Schließplan oder Schließmatrix, Rubriken als Daten? Je Thema: vorhanden, teilweise oder fehlt, mit Fundstelle.

## 9. Selbstprüfung
Jede Sammlung und jedes Global aus payload.config.ts kommt vor (zähle sie); jede Angabe hat Datei:Zeile; Werte von Preisen nicht abgeschrieben.

## 10. Ausgabe
Bericht nach _werkstatt/ausbau/berichte/E0-KUNDSCHAFTER-01-technik.md (höchstens 1.500 Wörter; lange Listen als kompakte Tabellen).

## 11. Letzte Zeile
=== ENDE E0-KUNDSCHAFTER-01 · BEREIT ZUR RÜCKGABE ===
