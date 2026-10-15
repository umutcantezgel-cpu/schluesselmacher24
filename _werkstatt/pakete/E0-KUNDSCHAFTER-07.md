E0-KUNDSCHAFTER-07 · Rolle Kundschafter · Modell Haiku 5.5 · Stufe 1 · Kern-Version 0 · Schreibrechte: nur `_werkstatt/berichte/E0-KUNDSCHAFTER-07-lucide-inventar.md` · Umfang: jede lucide-react-Fundstelle mit Größe und Zusammenhang erfassen

## Rollenbriefing
Du bist Kundschafter. Du erfasst einen Bereich vollständig mit Fundstellen (Pfad:Zeile). Häufige Fehler: zusammenfassen statt auflisten; Vermutung als Befund; Teile übersehen (auch Icons, die über Variablen, Objekte oder Props weitergereicht werden). Du änderst nichts außer deiner Berichtsdatei.

## Aufgabe in einem Satz
Liste jede Verwendung eines lucide-react-Icons im Ordner `src/` mit Datei, Zeile, Icon-Name, Darstellungsgröße und Zusammenhang, damit jede Stelle eindeutig einem eigenen Glyphen oder Fach-Icon zugeordnet werden kann.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug
- 62 Dateien importieren aus `lucide-react`, 60 verschiedene Namen (Häufigkeit: ArrowRight 38, Check 9, CheckCircle2 8, Layers 6, Trash2 5, KeyRound 5, ShieldCheck 4, RotateCcw 4, MapPin 4, Loader2 4, CalendarClock 4, …).
- Eigene Fach-Icons (54) liegen in `src/components/visual/icons/` (Dateiname = Motiv, z. B. `termin.tsx`, `standort.tsx`, `warenkorb.tsx`).

## Maßstab
Berichtsform wie `_werkstatt/berichte/E0-KUNDSCHAFTER-04-grafik-bewegung.md`, aber als eine große Tabelle.

## Grenzen
Nur lesen (Grep, Read, Glob). Keine Datei außer der Berichtsdatei.

## Schritte
1. Finde alle Importe aus `lucide-react` (mehrzeilige Importe beachten) und alle Stellen, an denen ein importiertes Icon verwendet wird: als JSX-Element, in Objekten oder Arrays (z. B. `AREA_ICONS`, `icon: Wrench`), als Prop weitergereicht oder als Typ (`typeof KeyRound`, `LucideIcon`).
2. Erfasse **jede Verwendung** als Tabellenzeile: `Datei:Zeile · Icon · Größe in px (aus size={…}, h-/w-Klassen oder Standard 24) · Zusammenhang` mit einer dieser Kategorien:
   - **K1 Text/Knopf** – im Fließtext, in einem Link oder Knopf neben Text (meist 12–20 px)
   - **K2 Status** – Rückmeldung wie Haken, Warnung, Info, Ladeanzeige
   - **K3 Kachel** – Symbol einer Karte oder Kachel, eines Abschnitts oder einer Leistung (meist 18–40 px, oft in einem farbigen Kasten)
   - **K4 Steuerung** – Menü, Schließen, Aufklappen, Plus/Minus, Löschen, Filter
   Dazu die Spalte **Bedeutung** in 2–5 Wörtern (z. B. „Leistung Videoüberwachung“, „weiter zum Konfigurator“, „Warenkorb im Kopf“).
3. Für Verwendungen der Kategorie K3: Nenne in einer weiteren Spalte das Fach-Icon aus `src/components/visual/icons/`, dessen Dateiname am besten zur Bedeutung passt, oder „kein passendes“.
4. Zusammenfassung am Ende: Zahl der Verwendungen je Kategorie; Liste der Icon-Namen, die **nur** in K3 vorkommen; Liste der Icon-Namen, die in K1, K2 oder K4 vorkommen (diese brauchen einen kleinen Glyphen).

## Schnellprüfung und Selbstprüfung
- Zahl der erfassten Dateien = 62; jeder der 60 Namen kommt mindestens einmal vor.
- Keine Zeile ohne Größe und Kategorie.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN (keine) · PRÜFUNG UND ERGEBNIS · BILDBELEGE (keine) · OFFENE FRAGEN — der vollständige Bericht steht in der Berichtsdatei; die Antwort enthält nur die Zusammenfassung aus Schritt 4.

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E0-KUNDSCHAFTER-07 · BEREIT ZUR RÜCKGABE ===
