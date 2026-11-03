# _MUSTER-REFERENZ · Startseite und Autoschlüssel-Weg als Muster (E4, KERN 2.5)

Seit E4 sind Startseite und Autoschlüssel-Weg das Muster jedes Pakets (Auftrag 18). Wer eine Rubrik, einen Weg oder eine Erzählansicht baut, hält sich an diese Bausteine und Regeln; Abweichungen nur mit Grund im Bericht.

## Bausteine (Dateien)
- Hub und erster Bildschirm: `src/components/hub/` (`IntentHub`, `HubKachel`, `CodeMotiv`), Regeln in KERN K-013. Kacheln kommen nur aus den Rubriken (`getHubRubriken`), nie aus Listen im Code.
- Fach-Icons nach Namen aus den Daten: `src/components/visual/fach-icon.tsx` (`FachIcon`, `FACH_ICON_REGISTRY`). In Client-Komponenten Icons nicht importieren, sondern auf dem Server zeichnen und als Element übergeben (Muster: Root-Layout an `SiteHeader`).
- Navigation: `navigationsGruppen(rubriken)` in `src/lib/navigation.ts` (G-08); eine neue Rubrik mit Status „live“ erscheint dort ohne Codeänderung.
- Rubrikkopf: `PageHeader` mit `rubrik={await getRubrik('<id>')}` (Übergang B-35, Fokus auf der h1 nach dem Tipp im Hub).
- Ablauf „So läuft Ihr Auftrag ab“: `RubrikAblauf` aus `rubrik.ablauf` (`src/components/rubrik/`), Werte aus den Einstellungen nur über Platzhalter `{anzahlung}`, `{vorlauf}` (G9).
- Fahrzeugwahl: `FahrzeugSuche` und `fahrzeugZiel` (`src/components/autoschluessel/`): gepflegtes Modell, gepflegte Marke, Anfrage. Quellenvermerk des KBA-Katalogs überall, wo er genutzt wird.
- Bewegung: nur über das Register (KERN K-007) mit `data-motion`, Start über `sm24-start` und Keyframes mit `from`, Startwerte je Teil vollständig (`--start-*`), Dauerschleifen mit `useDauerschleife` und `PauseKnopf`.

## Regeln, die in E4 gemessen wurden
- Erster Bildschirm: Kacheln ohne Scrollen bei 390 × 844 und 1440 × 900, mindestens neun bei 360 × 780, gemessen gegen die Oberkante der festen Aktionsleiste (`protokolle/E4-OPUS-01-hub-mass.log`).
- Laiennamen höchstens zwei Zeilen bei 360 px, Zusätze höchstens zwei Zeilen; Trennung mit `.trennung-kachel`.
- Keine Gedankenstriche, keine Floskeln, Zahlen in Mono mit geschütztem Leerzeichen (K-010).
- Kein Wischen für Auswahl (G-02), keine Sackgasse: Rubriken erscheinen nur mit Status „live“.
- Jeder Weg behält den Berechtigungsnachweis (R13); Anzahlung, Preis und Zahlung bleiben unverändert und durch Tests belegt (G9).

## Prüfen vor der Rückgabe
- Lint, Typprüfung, Unit, DB über die Datenweiche; Build JSON; Funktionsliste F-01 bis F-19 (`werkzeuge/funktionsliste.mjs`).
- Sichtprüfung in den fünf Gerätegrößen mit Attrappen für Drittdienste; Messwerte als Protokoll, nicht geschätzt.
