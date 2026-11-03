# E0-KUNDSCHAFTER-03 · Gestaltung, Bewegung, Icons und KERN 1.19

## 1. Kopfzeile
Kennung E0-KUNDSCHAFTER-03 · Rolle Kundschafter · Modell Haiku 5.5 · Stufe 1 · Kern 2.0-Entwurf · Kostenklasse M · Anforderungen: G-04 bis G-07, G-12, G-13, Auftrag 12, S1 bis S9 · Schreibrechte: _werkstatt/ausbau/berichte/E0-KUNDSCHAFTER-03-gestaltung.md · Umfang: siehe Schritte

## 2. Rollenbriefing
Kundschafter: erfasst einen Bereich vollständig mit Datei- und Zeilenangaben. Fehler, die du vermeidest: zusammenfassen statt auflisten; Vermutung als Befund; Teile außerhalb der Navigation übersehen.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran. Du änderst KEINE Projektdatei; du liest nur und schreibst ausschließlich deine Berichtsdatei.

## 3. Aufgabe in einem Satz
Erfasse Designsystem, Schriften, Farben, Bewegung, Icons, Grafiken und den Stand von KERN 1.19 vollständig mit Datei- und Zeilenangaben, damit KERN Version 2 darauf aufbaut und kein zweites System entsteht.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar mit Fertigung, Beratung und Außendienst, mit Schwerpunkt Wetzlar und Hessen und bestellbar in ganz Deutschland. Kundinnen und Kunden bestellen Autoschlüssel mit Anzahlung, Schlüssel nach Code, nach Foto oder per Einsendung, gleichschließende Zylinder und Schließanlagen über Konfiguratoren, oder sie schicken eine vollständige Anfrage. Technisch ist es Next.js 16 mit React 19, TypeScript strikt, Tailwind 3.4 und Payload 3.90 auf Postgres mit Stripe, Resend und S3-Ablage; ohne Datenbank liest die Seite content/*.json. Dieser Lauf baut den Bestand aus: ein Hub „Wobei können wir Ihnen helfen?“ im ersten Bildschirm, Rubriken aus Daten, ein Abschluss für alle Wege und neue Wege für Fahrzeuge, Einsenden, Konfiguratoren, Partner und Karte. Maßstab sind Laien ohne Geduld, offene Preise, Ehrlichkeit über Prüfungen, Berechtigungsnachweise, die nie geschwächt werden, und ein Bestand, von dem nichts verloren geht.

## 5. Kern-Auszug (unveränderlich)
KERN 1.19 (docs/gestaltung/KERN.md) ist das bestehende System: Leitidee, Prinzipien, Designsystem, Formsystem und Register werden übernommen und geschärft, nie ersetzt. Anti-Slop-Liste S1 bis S9 steht in AUFTRAG.md Abschnitt 12.

## 6. Maßstab
/home/user/schluesselmacher24/docs/gestaltung/KERN.md, docs/gestaltung/ENTSCHEIDUNGEN.md (nur Überschriften und Ergebnisse), tailwind.config.ts, src/app/globals.css oder die globale CSS-Datei, src/app/layout.tsx und (site)/layout.tsx (Schriften), src/components/visual/** (Icons, Registry, Generatoren), alle Dateien mit framer-motion, data-motion, @keyframes, prefers-reduced-motion.

## 7. Grenzen
Nur lesen.

## 8. Schritte
1. KERN 1.19: Gib in höchstens 25 Zeilen wieder, welche Abschnitte (K-Kennungen) es gibt, mit Titel und einem Satz Inhalt; zitiere die Leitidee wörtlich.
2. Tokens: Liste die Farb-Tokens aus tailwind.config.ts und der globalen CSS (Name, Wert, Farbraum HSL oder OKLCH), Abstands-, Radius-, Schatten-, Schrift- und Dauer-Skalen. Gibt es Werte außerhalb der Tokens im Code? Suche mit `grep -rnE "\[[0-9.]+(px|rem)\]|#[0-9a-fA-F]{3,6}\b" src --include=*.tsx | wc -l` und nenne die zehn häufigsten Dateien.
3. Schriften: welche Familien, wie geladen (next/font/google oder @fontsource oder Dateien), wo (Datei:Zeile), welche Gewichte und Teilmengen; Fließtextgröße mobil (Klasse und px).
4. Bewegung: Liste jede Animation (Komponente oder CSS, Datei:Zeile, Bibliothek, Auslöser, Dauer, Verhalten bei prefers-reduced-motion, data-motion-Kennung falls vorhanden). Gibt es ein zentrales Bewegungsmodul oder einen Bewegungsschalter? Wo steht das Bewegungsregister in KERN 1.19?
5. Leuchten beim Überfahren (G-06): Wo ist der Hover-Leuchteffekt umgesetzt (Klassen, Datei:Zeile)?
6. Startseiten-Animation (G-04, G-07): Datei, Aufbau des SVG, Proportionen des Schlüssels (Länge zu Breite von Reide und Bart aus den Koordinaten), Ablauf.
7. Icons: Registry-Datei, Zahl der Icons, Namen, Strichstärke und viewBox; gibt es noch fremde Icon-Sets (lucide, heroicons) oder Emojis im Code? (`grep -rn "lucide\|heroicons" src package.json`)
8. Grafik-Generatoren: Liste der Generatoren (Datei, Zweck).
9. Logo: Wo liegt das bisherige Logo (Dateien), wie wird es eingebunden (Kopf, Fuß, Favicon, Teilen-Bilder)?
10. Anti-Slop-Vorbefund: Je Punkt S1 bis S9 aus AUFTRAG.md Abschnitt 12 eine Zeile mit Befund im Code (z. B. S1: Inter wird geladen in Datei:Zeile).

## 9. Selbstprüfung
Jede Datei mit framer-motion ist genannt (zähle mit `grep -rln framer-motion src | wc -l`); jede Schriftfamilie mit Fundstelle; S1 bis S9 vollständig.

## 10. Ausgabe
Bericht nach _werkstatt/ausbau/berichte/E0-KUNDSCHAFTER-03-gestaltung.md (höchstens 1.500 Wörter).

## 11. Letzte Zeile
=== ENDE E0-KUNDSCHAFTER-03 · BEREIT ZUR RÜCKGABE ===
