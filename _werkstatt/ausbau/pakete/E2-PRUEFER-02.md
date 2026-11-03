# E2-PRUEFER-02 · L0: Vorab-Scheitern

## 1. Kopfzeile
Kennung E2-PRUEFER-02 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 1 · Kern 2.0 · Kostenklasse M · Anforderungen: Auftrag 18 E2 (Vorab-Scheitern), 21 (Risiken), Z-01, Z-21 · Schreibrechte: _werkstatt/ausbau/berichte/E2-PRUEFER-02.md · Umfang: zehn Szenarien

## 2. Rollenbriefing
Prüfer: richtet Werkzeuge ein, prüft nach seiner Stufe, schreibt Tests für neue Logik und berichtet knapp mit Belegpfaden. Fehler: Entwicklungsserver statt Produktions-Build; Einzelmessung statt Median aus drei Läufen; deuten statt berichten.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md. Du änderst nichts außer deinem Bericht.

## 3. Aufgabe in einem Satz
Beantworte die Frage „Woran stockt der Lauf am dritten Tag?“ mit zehn konkreten Szenarien aus PLAN.json, dem Stand des Repositorys und den Berichten, je mit Frühwarnzeichen und einer Gegenmaßnahme, die sich in den Plan schreiben lässt.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar mit Fertigung, Beratung und Außendienst, mit Schwerpunkt Wetzlar und Hessen und bestellbar in ganz Deutschland. Kundinnen und Kunden bestellen Autoschlüssel mit Anzahlung, Schlüssel nach Code, nach Foto oder per Einsendung, gleichschließende Zylinder und Schließanlagen über Konfiguratoren, oder sie schicken eine vollständige Anfrage. Technisch ist es Next.js 16 mit React 19, TypeScript strikt, Tailwind 3.4 und Payload 3.90 auf Postgres mit Stripe, Resend und S3-Ablage; ohne Datenbank liest die Seite content/*.json. Dieser Lauf baut den Bestand aus: ein Hub „Wobei können wir Ihnen helfen?“ im ersten Bildschirm, Rubriken aus Daten, ein Abschluss für alle Wege und neue Wege für Fahrzeuge, Einsenden, Konfiguratoren, Partner und Karte. Maßstab sind Laien ohne Geduld, offene Preise, Ehrlichkeit über Prüfungen, Berechtigungsnachweise, die nie geschwächt werden, und ein Bestand, von dem nichts verloren geht.

## 5. Kern-Auszug (unveränderlich)
Risiken aus AUFTRAG.md Abschnitt 21 (Neubau statt Ausbau, Griff in die Produktion, erfundene Fahrzeugdaten, Konfigurator überfordert, Spam-Muster, Filmzitat, prächtig aber träge, KI-Ton, Menschenstau, doppelte Sitzung, Stillstand, Leerlauf, Gedächtnisverlust). Bekannte Befunde: Recherche-Pakete brauchten 60 bis 95 Minuten; ein Neustart der Umgebung hat am 2026-11-03 gegen 02:10 vier Pakete abgebrochen; Lighthouse und eigene Messung weichen stark ab; 47 Opus-Pakete.

## 6. Maßstab
PLAN.json, PLAN.md, KONTINGENT.md, STATUS.md, berichte/*.md (nur Kopf und offene Fragen), werkzeuge/LIESMICH.md.

## 7. Grenzen
Nur lesen.

## 8. Schritte
1. Lies PLAN.md und den kritischen Pfad in PLAN.json.
2. Prüfe für E3 und E4: Welche Pakete hängen an Daten, Zugängen oder Antworten, die nicht vorliegen? Welche gemeinsamen Dateien (payload.config.ts, migrations, globals.css, tailwind.config.ts, navigation.ts, layout.tsx) berühren mehrere Pakete nacheinander, und wo droht ein Konflikt?
3. Schreibe zehn Szenarien „Am dritten Tag stockt der Lauf, weil …“ mit: betroffene Pakete · Frühwarnzeichen (messbar) · Gegenmaßnahme als konkrete Planänderung (Paket teilen, Abhängigkeit ändern, Attrappe, Reihenfolge) · Aufwand.
4. Ordne die Szenarien nach Wahrscheinlichkeit mal Wirkung.

## 9. Selbstprüfung
Zehn Szenarien, jedes mit Paketkennungen aus PLAN.json und einer umsetzbaren Planänderung.

## 10. Ausgabe
Bericht nach _werkstatt/ausbau/berichte/E2-PRUEFER-02.md (höchstens 600 Wörter). Ausdrücklich erlaubt.

## 11. Letzte Zeile
=== ENDE E2-PRUEFER-02 · BEREIT ZUR RÜCKGABE ===
