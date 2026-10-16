# E4-BAUMEISTER-18 · Bericht und Abnahme

Workflow `wf_8c908891-137` (Welle E), 2 Prüfrunde(n), letzte Prüfung bestanden. Abnahme und Nacharbeit durch den Orchestrator (D-033), Commit siehe PLAN.

## Abnahme durch den Orchestrator

- Ganzer Unterschied gegen `fab24ac` gelesen. Alle Texte sind erhalten (verschoben aus Attributen in Textknoten). Neu ist der Hero mit der Zeichnung `zutritt-signal`.
- Soll-Befund „Waisenzelle auf dem Tablet“: Der Datenschutz-Hinweis zu Baustein 10 steht jetzt unter der Liste (`max-w-measure`). Dadurch sind Baustein 9 und 10 gleich hoch, und auf 768 px bleibt keine Lücke (Bild angesehen).
- Soll-Befund „02 und 03 gleich gebaut“: Abschnitt 03 stellt auf `lg` die Zeichnung links und den Text rechts (`lg:col-start-*`, `lg:row-start-1`). Die drei Schritte stehen als nummerierte Stückliste mit Mono-Ziffern, Texte wortgleich in der Konstante `ABLAUF`.
- Offene Frage `align-[-2px]`: Der Hinweissatz unter „Passende Bereiche“ ist jetzt ein Flex-Satz mit Glyphe (`mt-0.5 shrink-0`), ohne freien Wert.
- Protokolldatei der Wertesuche im Repository: Protokolle liegen bewusst unter `_werkstatt/protokolle/` und werden mit der Welle committet.

## Prüfurteil (letzte Runde)

- **soll:** Die Abschnitte Mechanisch (Z. 527-557) und Ablauf (Z. 618-661) stehen direkt nebeneinander und haben beide Text links, Visual rechts im Zwölfer-Raster. Die Anforderung, benachbarte Abschnitte mit verschiedener Struktur zu setzen, ist damit nicht erfüllt. Ein Wechsel etwa über Stellung oder Tonfolge wäre nötig.
- **soll:** Auf Tablet (sm, 768 px) bleibt unter Baustein 9 (sperren, links neben protokoll) eine leere Fläche von etwa 450 px, weil die protokoll-Zelle mit Hinweisbox deutlich höher ist. Die Waisenzelle ist also nur verschoben, nicht aufgelöst. Sichtbare Schwäche.
- **hinweis:** werte-suche meldet align-[-2px] an Z. 711 (GlyphGebaeude). Wert ohne Token, im Bericht als GEMEINSAME DATEIEN geführt und unverändert belassen. Kein Verstoß.
- **hinweis:** sm24-reveal steht nur am Kopf des Bausteine-Abschnitts (Z. 459). Andere Abschnittsköpfe haben keine Einstiegsbewegung. B-04 ist registriert, die Verwendung ist aber uneinheitlich.

## Letzter Bericht des Baumeisters

E4-BAUMEISTER-18 Runde 2. Geaendert: src/app/(site)/elektronische-zutrittsloesungen/page.tsx (nur cn()-Klassen des Bausteine-Listenelements, Zeilen ca. 472 bis 480). Befund 1 (Muss, Haarlinien lg): sm:border-l galt ab lg auch fuer Bausteine in lg-Spalte 0; ergaenzt sm && !lg && 'lg:border-l-0'. Gemessen: x=132 ohne durchgehende Linie. Befund 2 (Soll, Waisenzelle sm): kombination mit 'sm:col-span-2 lg:col-span-1'; sperren bleibt mit protokoll in einer Zeile. Pruefung: tsc, eslint, vitest (758 gruen), werte-suche (1 Fund align-[-2px], siehe gemeinsame_dateien), grep lucide ohne Treffer. Bilder in /root/sm24-bilder/E4-BAUMEISTER-18/runde-2/. Offene Fragen siehe Liste. === ENDE E4-BAUMEISTER-18 · BEREIT ZUR RUECKGABE ===

## Offene Fragen des Baumeisters

- werte-suche.mjs hat die Protokolldatei /home/user/schluesselmacher24/_werkstatt/protokolle/werte-suche-2026-10-16_09-19-44.json im Repository angelegt; nichts geloescht, Entscheidung beim Orchestrator.
- align-[-2px] braucht eine Entscheidung (Token oder Freigabe).
