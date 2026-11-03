# E0-KUNDSCHAFTER-02 · Rubriken, Wege und Formulare

## 1. Kopfzeile
Kennung E0-KUNDSCHAFTER-02 · Rolle Kundschafter · Modell Haiku 5.5 · Stufe 1 · Kern 2.0-Entwurf · Kostenklasse M · Anforderungen: G-01 bis G-51, Auftrag 11, LAGEBILD · Schreibrechte: _werkstatt/ausbau/berichte/E0-KUNDSCHAFTER-02-wege.md · Umfang: siehe Schritte

## 2. Rollenbriefing
Kundschafter: erfasst einen Bereich vollständig mit Datei- und Zeilenangaben. Fehler, die du vermeidest: zusammenfassen statt auflisten; Vermutung als Befund; Teile außerhalb der Navigation übersehen.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran. Du änderst KEINE Projektdatei; du liest nur und schreibst ausschließlich deine Berichtsdatei.

## 3. Aufgabe in einem Satz
Erfasse jeden Kundenweg, jede Rubrik, jedes Formular und die Navigation des Bestands vollständig mit Datei- und Zeilenangaben, damit der Orchestrator Intent-Hub, Rubriken-Modell und den gemeinsamen Abschluss auf dem Vorhandenen aufbauen kann.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar mit Fertigung, Beratung und Außendienst, mit Schwerpunkt Wetzlar und Hessen und bestellbar in ganz Deutschland. Kundinnen und Kunden bestellen Autoschlüssel mit Anzahlung, Schlüssel nach Code, nach Foto oder per Einsendung, gleichschließende Zylinder und Schließanlagen über Konfiguratoren, oder sie schicken eine vollständige Anfrage. Technisch ist es Next.js 16 mit React 19, TypeScript strikt, Tailwind 3.4 und Payload 3.90 auf Postgres mit Stripe, Resend und S3-Ablage; ohne Datenbank liest die Seite content/*.json. Dieser Lauf baut den Bestand aus: ein Hub „Wobei können wir Ihnen helfen?“ im ersten Bildschirm, Rubriken aus Daten, ein Abschluss für alle Wege und neue Wege für Fahrzeuge, Einsenden, Konfiguratoren, Partner und Karte. Maßstab sind Laien ohne Geduld, offene Preise, Ehrlichkeit über Prüfungen, Berechtigungsnachweise, die nie geschwächt werden, und ein Bestand, von dem nichts verloren geht.

## 5. Kern-Auszug (unveränderlich)
Jeder Weg endet heute in Kasse, Zahlungslink, Termin mit Anzahlung oder Anfrage. Berechtigungsnachweise (Fahrzeugschein, Vollmacht, Sicherungskarte) dürfen nie geschwächt werden; dein Bericht nennt sie je Weg genau.

## 6. Maßstab
/home/user/schluesselmacher24/src/app/(site)/** (alle page.tsx, layout.tsx), src/components/**, src/lib/navigation.ts, src/lib/** (Formular-Schemas, Preislogik, Warenkorb), src/app/**/route.ts, content/*.json.

## 7. Grenzen
Nur lesen. Keine Befehle über die Datenweiche nötig.

## 8. Schritte
1. Navigation: Gib src/lib/navigation.ts vollständig als Baum wieder (Hauptpunkte, Unterpunkte, Pfade), dazu Fußbereich-Links (Datei:Zeile) und die mobile Navigation (Komponente, Datei).
2. Startseite: Beschreibe src/app/(site)/page.tsx Abschnitt für Abschnitt in Reihenfolge (Komponente, Datei:Zeile, Inhalt in einem Satz); wo genau steht der Schnelleinstieg „Wobei können wir helfen?“, welche Einträge hat er (Name, Ziel, Icon), woher kommen sie (Code oder Daten)? Welche Animation zeigt die Startseite (Komponente, Datei), und wo wird der Schlüssel gezeichnet (Datei:Zeile, Maße oder Proportionen im SVG)?
3. Wege: Für jeden dieser Wege eine Zeile mit Einstiegsseite, Schritten (Komponenten und Dateien), Formularfeldern (Name, Pflicht ja/nein), Pflicht-Uploads, Berechtigungsnachweis, Abschlussart (Kasse, Zahlungslink, Termin mit Anzahlung, Anfrage), API-Route und Vorgangsart: Autoschlüssel (Termin, Anfrage, Modellseiten), Schlüssel nach Code, Schlüssel nach Foto (Foto-Freigabe), Schlüssel einschicken, gleichschließende Zylinder oder Sperrschließung (Konfigurator), Schließanlage (Konfigurator oder Anfrage), elektronische Zutrittslösungen, Tür- und Schließtechnik, Sicherheitstechnik, Service und Termin, Vor-Ort-Service, Kontakt, Partner werden, Terminstatus, Warenkorb und Kasse, Widerruf.
4. Rubriken als Daten: Gibt es eine Datenquelle für Leistungen oder Rubriken (Leistungsseiten-Sammlung, content/*.json)? Welche Felder? Welche Seiten lesen daraus?
5. Formular-Bausteine: Welche gemeinsamen Formular-, Upload-, Zusammenfassungs- und Bestätigungs-Komponenten gibt es (Datei, Zweck)? Welche Validierung (zod-Schemas, Datei)?
6. „So läuft Ihr Auftrag ab“: Gibt es schon Ablaufschritte mit Icons auf Rubrikseiten? Wo?
7. Anrufen und Rückruf: Wie erreicht man von jeder Rubrik das Telefon oder den Rückruf (Komponente, Datei)?
8. Lücken gegen G-01 bis G-51 (Abschnitt 4 in _werkstatt/ausbau/AUFTRAG.md): Für jede G-Kennung eine Zeile mit Bestand (vorhanden, teilweise, fehlt) und Fundstelle, soweit Wege, Seiten oder Formulare betroffen sind. Rein technische oder inhaltliche Punkte darfst du mit „nicht Wegebereich“ markieren.

## 9. Selbstprüfung
Alle page.tsx unter src/app/(site) sind gezählt (Zahl nennen) und jeder Weg aus Schritt 3 ist vorhanden oder als fehlend markiert; G-01 bis G-51 vollständig.

## 10. Ausgabe
Bericht nach _werkstatt/ausbau/berichte/E0-KUNDSCHAFTER-02-wege.md (höchstens 1.500 Wörter, Tabellen erlaubt).

## 11. Letzte Zeile
=== ENDE E0-KUNDSCHAFTER-02 · BEREIT ZUR RÜCKGABE ===
