# E5-BAUMEISTER-29 · Bericht und Abnahme (Rechtstexte und Cookie-Einstellungen)

1 Prüfrunde, Prüfurteil: nicht bestanden (1 Muss). Die Reparaturrunden scheiterten am Sitzungslimit; Nacharbeit und Abnahme durch den Orchestrator:

- **Muss Tabelle mobil:** Unter `md` stehen die Versandarten als gestapelte `dl`-Zeilen mit denselben Angaben, die Tabelle erscheint ab `md` (KERN 1.6). Textabzug aller sechs Rechtsseiten (Desktop): gleich.
- **Soll Cookie-Beschriftung:** bleibt wortgleich (Textabzug, Rechtstexte unantastbar).
- **Soll `role` der Fehlermeldung:** bleibt `status` – Erfolg und Fehler teilen einen Meldungszustand; eine Unterscheidung wäre eine Logikänderung. Eine höfliche Live-Region sagt beide an.
- **Hinweis:** Die Platzhalter im Wortlaut der Rechtstexte („[Platzhalter: …]“) sind Inhalt und bleiben; offen für Menschen (MENSCHEN M-02).
- **Prüfung:** Logikwächter 0 abweichend, Wertesuche 0, F-09 bestanden; Bilder `versand-und-zahlung` und `cookie-einstellungen` mobil.

## Prüfurteil (Runde 1)


## Bericht des Baumeisters

GEÄNDERTE DATEIEN
- src/app/(site)/rechtliches/layout.tsx
- src/app/(site)/rechtliches/impressum/page.tsx
- src/app/(site)/rechtliches/agb/page.tsx
- src/app/(site)/rechtliches/widerruf/page.tsx
- src/app/(site)/rechtliches/datenschutz/page.tsx
- src/app/(site)/rechtliches/versand-und-zahlung/page.tsx
- src/app/(site)/rechtliches/cookie-einstellungen/page.tsx
- src/app/(site)/rechtliches/cookie-einstellungen/cookie-einstellungen.tsx (Logikwächter: nur JSX im return, className, Importe aus @/components/visual/)

WAS UND WARUM
- Layout: Navigation mobil als Leiste mit Anschnitt (snap-x, Links min-h-touch, text-small, Rand -mx-5 wie .table-scroll); ab lg Zwölfer-Raster: Navigation lg:col-span-3, Text lg:col-span-8 lg:col-start-5, Lesespalte max-w-measure. Eyebrow als font-mono text-caption uppercase tracking-label text-foreground-muted. Text und Entwurfshinweis unverändert.
- Alle sechs Seiten: h1 von text-[1.75rem] md:text-3xl leading-tight auf text-headline font-bold text-balance (K-005a, KERN 1.13 Textumbruch). Wortlaut unverändert.
- Datenschutz: Aufbewahrungsfristen und Beträge als font-mono tabular-nums in span (Text und Zahlen bleiben gleich).
- Versand und Zahlung: Tabelle ohne min-w-[34rem], text-small, Kosten font-mono tabular-nums rechtsbündig (kein zweites gestapeltes Format). Anzahlungsbeträge und Tage in Mono in span/strong; Wortlaut gleich.
- Cookie-Einstellungen (Logikwächter, nur Darstellung): Icons Check/Trash2 auf GlyphHaken (14 px) und GlyphPapierkorb (16 px). Schalter: Trefferfläche 44 px (min-h-touch min-w-touch, -my-2.5), Spur h-6 w-11 in der Mitte, Übergänge duration-quick ease-standard, bg-white auf bg-surface, Hover über group-hover (feiner Zeiger), Fokus über die globale :focus-visible-Regel (ring-ring). Meldungen tone="info" und role="status" (Zeichenketten). Zeitstempel font-mono text-caption, Hilfstexte text-foreground-muted, text-[15/13/12px] auf text-body/text-small/text-caption.
- Nicht umgesetzt: die versteckte Beschriftung „{label} aktivieren“ bleibt. Eine Änderung auf „{label}“ meldete der Textabzug als Abweichung (siehe OFFENE FRAGEN).

Alt-Neu (Mikrotexte): keine Mikrotexte geändert.

GEMEINSAME DATEIEN
- Keine Werte ohne Token im Code; keine Änderung an globals.css, tailwind.config.ts, Alert, Button oder anderen gemeinsamen Dateien.
- Hinweise: text-balance (Tailwind-Standardklasse). Fokus des Schalters über die globale Regel, nicht über eigene Ringklassen. Ausnahme Logikwächter: keine (kein neuer JSX-Ausdruck, keine Ausnahme nötig).

PRÜFUNG UND ERGEBNIS
- Textabzug (vergleichen, SM24_BASIS_URL=http://localhost:3001): vorher alle sechs gleich. Nach den Änderungen zunächst cookie-einstellungen ABWEICHEND (sr-only „aktivieren“ entfernt), daher zurückgenommen. Letzter Lauf: alle sechs gleich.
- Logikwächter pruefen: cookie-einstellungen.tsx gleich, 0 Ausnahmen, Gesamtlauf abweichend 0.
- tsc --noEmit: ohne Fehler.
- eslint auf die acht Dateien: ohne Befund.
- vitest run src/components src/lib: 64 Dateien, 1136 Tests, alle grün.
- werte-suche (JSON unter /root/sm24-bilder/E5-BAUMEISTER-29/werte-suche.json): 0 Funde.
- lucide-react in den acht Dateien: kein Treffer.
- funktionsliste --nur F-09: BESTANDEN 1 von 1 (Protokolle im Repository, siehe OFFENE FRAGEN).
- Platzhalter im gerenderten HTML: nur in den Rechtstexten und im Entwurfshinweis (Wortlaut, unverändert).
- Kein Lock /tmp/sm24-messfenster.lock während der Läufe. Keine Dateien gelöscht, nichts committet oder gepusht. Fremde Dateien nicht angefasst.

BILDBELEGE (Ordner /root/sm24-bilder/E5-BAUMEISTER-29/, je Seite mobil, tablet, desktop, ganz; JSON-Protokolle je Seite und Gerät)
- Impressum, AGB, Widerruf, Datenschutz, Versand und Zahlung, Cookie-Einstellungen (18 Bilder). Geprüft: Versand mobil und Cookie mobil (Leiste mit Anschnitt, Schalter mit 44-px-Fläche, Tabelle ohne seitlichen Überlauf), Impressum desktop (Navigation 3 Spalten, Text 8 Spalten), Versand tablet (Tabelle passt). Auf den mobilen Aufnahmen überdeckt die fixierte Leiste unten den Text, das ist eine Eigenheit der Vollseitenaufnahme und nicht Teil dieses Pakets.

OFFENE FRAGEN
1. Cookie-Schalter: „{label} aktivieren“ bleibt wegen des Textabzugs. Lösung für gesperrte Schalter offen.
2. Cookie-Meldungen: alle als role="status"; Fehler bräuchten role="alert" über eine Zustandsunterscheidung, die die Logik nicht hergibt.
3. Sichtbare Platzhalter als Fakt aus content/settings.json (Impressum und Datenschutz, Fristen 90/180/365/365) bleiben unverändert; Entscheidung beim Orchestrator (M-03).
4. Entwurfshinweis im Layout (Z. 30–36) bleibt bis zum Livegang sichtbar?
5. Versand-Tabelle: einzige Fassung mit Umbruch; stapelnde dl-Fassung nicht gebaut.
6. Navigation mobil: keine Markierung der aktuellen Seite (aria-current bräuchte Client-Code).
7. Werkzeug funktionsliste.mjs schreibt Protokolle ins Repository (_werkstatt/protokolle/funktionsliste-2026-10-16_17-04-43.{md,json}).
8. bild.mjs überschreibt JSON bei gleichem Pfad; deshalb je Seite und Gerät eigene JSON-Dateien statt bild-mobil.json.

=== ENDE E5-BAUMEISTER-29 · BEREIT ZUR RÜCKGABE ===
