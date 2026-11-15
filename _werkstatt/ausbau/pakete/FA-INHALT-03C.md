# FA-INHALT-03C · Texte menschlicher: Rubrikseiten Zylinder, Schließanlagen, Zutritt, Service und Termin, Vor Ort, Beratung, Kontakt

Kopf: Etappe FA Priorität 5 · Rolle Autor · Modell Opus · Stufe 3 · Kostenklasse L · kein Datenschema · Anforderungen FA-02-01 bis FA-02-06, FA-16 (Schließanlagen für Laien direkt verständlich), FA-17 (mechanische und elektronische Kombinationen verständlich erklären), FA-23 (Erreichbarkeit konsistent).

## Auftrag
Es gelten vollständig die Regeln, der Ablauf, die Prüfungen und das Ausgabeformular aus `_werkstatt/ausbau/pakete/FA-INHALT-03.md` (lies die Datei zuerst ganz; sie enthält die Vorgabe des Inhabers im Wortlaut). Diese Datei nennt dir nur die Seitengruppe und die Schreibrechte.

## Seitengruppe
- src/app/(site)/gleichschliessende-zylinder/page.tsx
- src/app/(site)/schliessanlagen/page.tsx und src/components/schliessanlagen/system-erklaerung.tsx (Erklärungen zu Gleichschließung, Z, HS, GHS)
- src/app/(site)/elektronische-zutrittsloesungen/page.tsx
- src/app/(site)/service-und-termin/page.tsx, src/app/(site)/service-und-termin/vor-ort/page.tsx (mit kern.ts, falls dort Texte stehen), src/app/(site)/service-und-termin/kontakt/page.tsx
- src/app/(site)/beratung/page.tsx
Dazu die sichtbaren Kopftexte dieser Routen (Felder `headline`, `subline`, `intro`, `faq`, nicht `seo.title` und nicht `seo.description`) in `content/seo.json` und gleichlautend im Rückfall `src/lib/data/defaults/content.ts`.

## Besonderheiten dieser Gruppe
- Schließanlagen: Die Erklärung der Anlagenarten folgt der Tabelle des Inhabers (Abschnitt 16), für Laien in je ein bis zwei Sätzen: Z-Anlage „Zentralschließung: bestimmte gemeinsame Türen können von mehreren unterschiedlichen Einzelschlüsseln geöffnet werden.“ · HS-Anlage „Hauptschlüsselanlage: einzelne Nutzer haben definierte Berechtigungen, ein Hauptschlüssel öffnet alle zugeordneten Türen.“ · GHS-Anlage „Generalhauptschlüsselanlage: mehrere Bereiche und Hierarchiestufen, mit Generalhauptschlüssel an oberster Ebene.“ Der Sinn dieser drei Sätze muss erhalten bleiben; Beispiele aus dem Alltag (Mehrfamilienhaus, Büro, mehrere Gebäude) dürfen sie anschaulich machen, wenn der Bestand sie schon trägt.
- Zylinder: Maße A und B, Not- und Gefahrenfunktion, Sicherungskarte bleiben fachlich richtig und werden in einem Halbsatz erklärt. Keine Preise anfassen.
- Zutritt: RFID, Karten, Transponder, PIN, App, Smartphone, zeitlich begrenzte Berechtigungen, Benutzerverwaltung und digitale Zylinder je in einem kurzen Satz erklärt (Abschnitt 17), nur soweit der Bestand die Aussage trägt. Herstellernamen nur, wo sie schon stehen.
- Service und Termin, Kontakt: Erreichbarkeit ausschließlich aus den Einstellungen (Baustein `Erreichbarkeit`, `erreichbarkeit(settings)`); keine eigenen Sätze zu Zeiten, Reaktionszeiten oder Notdienst. Vor Ort: keine Zusage zu Terminen, Anfahrt oder Preisen, die der Bestand nicht trägt (der Kopfkommentar in vor-ort/kern.ts nennt die Regel).
- Zielgruppen heißen wie im Konfigurator: Privat, Gewerbe, Hausverwaltung, öffentliche Einrichtung, mehrere Liegenschaften.
- Konfiguratoren, Rechner, Formulare und ihre Logik fasst du nicht an; nur Fließtexte, Überschriften, Listen und Knopftexte der genannten Seiten.

## Schreibrechte
Die oben genannten Dateien; `content/seo.json` und `src/lib/data/defaults/content.ts` nur für `headline`, `subline`, `intro`, `faq` der Routen `gleichschliessende-zylinder`, `schliessanlagen`, `elektronische-zutrittsloesungen`, `service-und-termin`, `service-und-termin/vor-ort`, `service-und-termin/kontakt`, `beratung` (soweit vorhanden); Tests dieser Dateien; `_werkstatt/ausbau/berichte/FA-INHALT-03C.md`.
Nicht anfassen: Konfiguratoren, `src/components/konfigurator`, `src/components/schliessung`, Navigation, Rubrikdaten, Preise, Rechtstexte, SEO-Titel und -Beschreibungen.

=== ENDE FA-INHALT-03C · BEREIT ZUR RÜCKGABE ===
