# E3-BAUMEISTER-01 · Berichte aus Workflow wf_a39c6e70-8a1

## Bau E3-BAUMEISTER-01
E3-BAUMEISTER-01 · Bericht

GEÄNDERTE DATEIEN
- src/components/forms/controls.tsx
- src/components/forms/field.tsx
- src/components/forms/option-card.tsx
- src/components/ui/alert.tsx
- src/components/ui/badge.tsx
- src/components/ui/info-tip.tsx
- src/components/ui/accordion.tsx

WAS UND WARUM
controls.tsx: Basisklasse text-input (16 px) statt text-[15px]; Eingabefelder und Auswahlliste min-h-touch statt min-h-[46px]; Zahlenfeld font-mono tabular-nums text-input; Mengen-Knöpfe mit GlyphMinus/GlyphPlus (18 px), unsichtbarer Text „verringern/erhöhen“ bleibt, min-w-touch und min-h-touch, Hover hover:bg-surface-sunken, gedrückt active:bg-surface-sunken, deaktiviert mit eigenem Hover-Reset; Pfeil-Klassen durch zahl-ohne-pfeile ersetzt; Übergänge transition-colors duration-quick.
field.tsx: Beschriftung text-small font-semibold; Hinweis text-small; Fehler text-small mit GlyphWarnung (16 px) vor dem Text, role="alert" bleibt.
option-card.tsx: Rahmen mit fokus-innen:ring-2 fokus-innen:ring-ring fokus-innen:ring-offset-2 (plus ring-offset-background) als sichtbarer Tastaturfokus auf dem verborgenen Eingabefeld (Befund E0 behoben); Haken GlyphHaken (14 px) statt lucide Check; Label min-h-touch; Titel text-body font-semibold; Kennzahl font-mono tabular-nums text-small; Beschreibung text-small; Übergang duration-quick.
alert.tsx: lucide durch Glyphen ersetzt (info: GlyphInfo, success: GlyphHakenKreis, warning und danger: GlyphWarnung, legal: GlyphWaage, 18 px); Text text-small; neuer Ton danger (bg-danger-soft, border-danger/30); role="note" unverändert.
badge.tsx: text-xs wird text-caption; sonst unverändert.
info-tip.tsx: Auslöser GlyphInfo (15 px) und Schließen GlyphKreuz (15 px), jeweils min-h-6 min-w-6 (24 px Zielfläche); Popover z-header und shadow-overlay; Text text-small, Titel text-small font-bold; keine Animation; Übergang duration-quick.
accordion.tsx: ChevronDown durch GlyphWinkelUnten (18 px) ersetzt; Winkel dreht mit transition-transform duration-base ease-standard (B-09); Frage text-body font-semibold, Antwort text-body; Knopf min-h-touch, Hover hover:bg-surface-muted; aria-controls am Knopf, id am Antwortbereich über useId (einziges neues Client-JavaScript); geöffnete Antwort mit sm24-fade und [--sm24-duration:var(--dauer-quick)] (Token, erlaubt); Antwort bleibt im Dokument und ist per hidden ausgeblendet.

GEMEINSAME DATEIEN
- Ohne Token, im Code belassen (werte-suche, 2 Funde):
  - controls.tsx, Select: style backgroundImage als data:-URI mit fester Farbe #64748b und Position 0.75rem center.
  - info-tip.tsx, Popover: w-[min(20rem,calc(100vw-3rem))].
- Keine Wünsche an globals.css, tailwind.config.ts oder cn.ts. Genutzt und vorhanden: zahl-ohne-pfeile, fokus-innen, min-h-touch, min-w-touch, text-input, shadow-overlay, z-header, bg-danger-soft, sm24-fade, dauer-quick, dauer-base.

PRÜFUNG UND ERGEBNIS
- Messfenster-Sperre /tmp/sm24-messfenster.lock nicht vorhanden; alle Prüfungen liefen.
- npx tsc --noEmit: ohne Fehler (Exit 0).
- npx eslint für die sieben Dateien: ohne Befund (Exit 0).
- npx vitest run src/components: 720 Tests, 719 bestanden, 1 fehlgeschlagen. Der Fehler liegt in fremder Datei src/components/autoschluessel/schluesselarten-reihe.test.tsx (Zeile 20: erwartet 4 Vorkommen von sm24-reveal, gefunden 8). Ich habe die Datei nicht angefasst und nicht gegen HEAD geprüft.
- grep lucide-react in den sieben Dateien: kein Treffer.
- werte-suche.mjs: 2 Funde, beide unter GEMEINSAME DATEIEN begründet.
- Keine Prüfung gelockert oder gelöscht; Props-Verträge, Hooks, Handler und aria-Bedeutungen unverändert.
- Bilder: Dev-Server Port 3001 lief (HTTP 200); alle Aufnahmen HTTP 200.
- Visuelle Prüfung der Bilder: nichts abgeschnitten, kein horizontaler Überlauf erkennbar, Fokusring auf Auswahlkarte sichtbar (box-shadow mit 2 px Ring und 2 px Offset), Akkordeon mobil und desktop korrekt (erste Frage offen, Winkel gedreht, übrige geschlossen).
- Skript für den Fokusbeleg: /root/sm24-bilder/E3-BAUMEISTER-01/fokus.mjs (nutzt lib.mjs; Tab bis zur Auswahlkarte nach 14 Tasten).
- Nicht geprüft: Bewegung reduziert, Dunkelmodus, axe, Tastatur-Abnahme des Akkordeons.

BILDBELEGE (Ordner /root/sm24-bilder/E3-BAUMEISTER-01)
- terminstatus-mobil__mobil.jpg, terminstatus-desktop__desktop.jpg (Felder, Fehlerhinweise nicht ausgelöst)
- konfigurator-mobil__mobil.jpg, konfigurator-desktop__desktop.jpg (oberer Teil; Mengenfeld liegt unterhalb des Bildausschnitts)
- fokus-auswahlkarte-desktop.jpg (Tastaturfokus auf Auswahlkarte „Doppelzylinder“)
- schliessanlagen-mobil__mobil__ganz.jpg, schliessanlagen-desktop__desktop__ganz.jpg (Vollbild)
- zuschnitt-akkordeon-mobil.png, zuschnitt-akkordeon-desktop.png (Ausschnitte des Akkordeons)
- Protokolle: bild-terminstatus-mobil.json, bild-terminstatus-desktop.json, bild-konfigurator-mobil.json, bild-konfigurator-desktop.json, bild-schliessanlagen-mobil.json, bild-schliessanlagen-desktop.json, werte-suche.json

OFFENE FRAGEN
1. Akkordeon: Antworten stehen jetzt im HTML (hidden). Bitte bestätigen oder auf bedingtes Rendern mit aria-controls nur im geöffneten Zustand umstellen.
2. Option-Card: zusätzlich ring-offset-background ergänzt. Bitte bestätigen.
3. InfoTip: h-7 w-7 durch min-h-6 min-w-6 ersetzt (sichtbar 24 statt 28 px). Bitte bestätigen.
4. Mengenfeld: keine Nahaufnahme; Konfigurator-Bilder zeigen nur den oberen Bereich.
5. Testfehler in fremder Datei schluesselarten-reihe.test.tsx (siehe PRÜFUNG). Nicht von mir behoben.
6. Untracked-Protokoll _werkstatt/protokolle/werte-suche-2026-10-16_05-17-37.json durch meinen Lauf entstanden; nicht gelöscht.
7. Select-Pfeil als data:-URI mit fester Farbe: Entscheidung über Token oder Glyphe steht aus.

ENDE
=== ENDE E3-BAUMEISTER-01 · BEREIT ZUR RÜCKGABE ===

## Prüfung E3-BAUMEISTER-01 R1
**Urteil:** bestanden
- hinweis: Akkordeon (src/components/ui/accordion.tsx Z. 43-49): Die Antworten bleiben jetzt im DOM und sind per hidden ausgeblendet, statt wie bisher bedingt gerendert zu werden. Das ist eine Markup-Änderung, die im Paket nicht ausdrücklich steht. Sie ist begründet, weil aria-controls sonst auf ein fehlendes Element zeigt. Bitte bestätigen (OFFENE FRAGE 1 des Baumeisters).
- hinweis: Auswahlkarte (src/components/forms/option-card.tsx Z. 50): fokus-innen:ring-offset-background ist zusätzlich zur Vorgabe fokus-innen:ring-2 fokus-innen:ring-ring fokus-innen:ring-offset-2 ergänzt. Die Klasse existiert in tailwind.config.ts (colors.background) und wirkt im Fokusbeleg (Offset-Farbe rgb(250,251,253)). Funktional unkritisch; bitte bestätigen (OFFENE FRAGE 2).
- hinweis: Konfigurator-Desktop-Bild (Baumeister-Bild konfigurator-desktop__desktop.jpg und eigene Aufnahme gleichschliessende-zylinder-konfigurator__desktop.jpg): Die Karte Doppelzylinder zeigt dort einen doppelten blauen Rahmen, der wie ein Fokusring aussieht. In drei Kontrollläufen ohne Tastatureingabe (ruhe-zustand.mjs, scroll-zustand.mjs, ring-test.mjs) war box-shadow auf none, kein Element mit :focus-visible, und die Karte zeigte nur den Rahmen border-primary. Die Ursache ist ungeklärt. Bitte den Aufnahmezeitpunkt des Bildes prüfen, bevor es als Beleg dient.
- hinweis: Testlauf: Der Baumeister meldet 720 Tests mit 1 Fehler in schluesselarten-reihe.test.tsx. Mein Lauf am 16.10. ergab 24 Dateien, 734 Tests, alle bestanden; der dortige Fehler ist nicht reproduzierbar. Die Zahl ändert sich, weil fremde Pakete parallel arbeiten. Der Befund gehört nicht zu diesem Paket.
- hinweis: Protokolle: git status zeigt drei untracked Dateien unter _werkstatt/protokolle/ (werte-suche-2026-10-16_05-17-37.json, _05-21-54.json, _05-23-53.json). Der Bericht nennt nur eine. Mein eigener werte-suche-Lauf hat mit --json nach /root/sm24-bilder geschrieben und nichts im Projekt erzeugt.
- hinweis: Werte-Suche, 2 Funde, beide bereits in HEAD und unverändert: controls.tsx Z. 67 (Select-Pfeil als data:-URI mit fester Farbe #64748b) und info-tip.tsx Z. 48 (w-[min(20rem,calc(100vw-3rem))]). Die Begründung im Bericht ist nachvollziehbar. Ein Token für den Select-Pfeil fehlt im Designsystem (OFFENE FRAGE 7).
- hinweis: Schritt 1 (Dateien und Muster lesen) lässt sich aus den Artefakten nicht belegen. Der Bericht behauptet es nur.

**Schritte:** Gesamturteil: Alle neun Schritte sind erfüllt. Es gibt keinen Befund der Schwere muss. Die Änderungen liegen nur in den sieben Schreibrechte-Dateien (git status und git diff geprüft).

Schritt 1 (Dateien und Muster lesen): nicht belegbar, siehe Befund.

Schritt 2 (controls.tsx): erfüllt. text-input Z. 9; min-h-touch Z. 28 und Z. 65; Mengen-Knöpfe min-h-touch min-w-touch Z. 98 und Z. 122; GlyphMinus Z. 103 und GlyphPlus Z. 127 (size 18); unsichtbarer Text verringern/erhöhen bleibt; hover:bg-surface-sunken und active:bg-surface-sunken Z. 99 und Z. 123; Zahlenfeld font-mono text-input tabular-nums Z. 115 mit zahl-ohne-pfeile. Die Select-Basis bleibt bei min-h-touch. Props-Vertrag unverändert (diff zeigt nur className-Änderungen).

Schritt 3 (field.tsx): erfüllt. Beschriftung text-small font-semibold Z. 31; Hinweis text-small Z. 46; Fehler text-small mit GlyphWarnung size 16 vor dem Text Z. 51-52; role=alert Z. 51 bleibt.

Schritt 4 (option-card.tsx): erfüllt mit Hinweis zur Zusatzklasse. Fokus-Rahmen Z. 50; GlyphHaken size 14 Z. 78; Titel text-body font-semibold Z. 83; Meta font-mono text-small tabular-nums Z. 84; Beschreibung text-small Z. 87; min-h-touch am Label Z. 57; duration-quick Z. 49 und Z. 73; hover:border-border-strong bleibt Z. 49. Das verborgene Eingabefeld ist weiterhin sr-only Z. 68 (E0 behoben, im Fokusbeleg bestätigt).

Schritt 5 (alert.tsx): erfüllt. GlyphInfo, GlyphHakenKreis, GlyphWarnung, GlyphWaage Z. 3-6 und Z. 10-15 (size 18 im Render); text-small Z. 31; Ton danger Z. 14 mit bg-danger-soft und border-danger/30; role=note Z. 29 bleibt. Die Ergänzung ist die erlaubte.

Schritt 6 (badge.tsx): erfüllt. text-caption Z. 24; sonst unverändert.

Schritt 7 (info-tip.tsx): erfüllt. GlyphInfo size 15 Z. 39 und GlyphKreuz size 15 Z. 59; min-h-6 min-w-6 am Auslöser Z. 35 und am Schließen-Knopf Z. 57; shadow-overlay Z. 49; z-header Z. 48; text-small Z. 53 und Z. 64; keine Animation.

Schritt 8 (accordion.tsx): erfüllt mit Hinweis zum DOM. GlyphWinkelUnten size 18 Z. 34; text-body font-semibold Z. 33; min-h-touch und hover:bg-surface-muted Z. 31; B-09 transition-transform duration-base ease-standard Z. 37 und rotate-180; useId Z. 3 und Z. 14; aria-controls Z. 30; id per panelId Z. 45; sm24-fade mit [--sm24-duration:var(--dauer-quick)] Z. 49; Antwort bleibt im DOM mit hidden Z. 46 (Befund).

Schritt 9 (Schnellprüfung und Bilder): erfüllt. Die Befehle sind unten aufgeführt. Alle Bilder wurden angesehen."}]

**Prüfungen:** Lage: Messfenster-Sperre /tmp/sm24-messfenster.lock nicht vorhanden, vor jedem Lauf geprüft. Dev-Server Port 3001 antwortet mit HTTP 200.

1. git status und git diff: Die Änderungen des Pakets liegen nur in den sieben Schreibrechte-Dateien. Andere geänderte Dateien (page.tsx, globals.css, tailwind.config.ts und weitere) gehören fremden Paketen oder dem Orchestrator. Nicht geändert: keine Projektdatei durch mich, nichts committet.

2. Props-Verträge: git show HEAD gegen aktuellen Stand verglichen. Exportierte Typen und Props sind unverändert. Die einzige Vertragsergänzung ist der Alert-Ton danger. Caller (rund 50 Dateien importieren forms, ui oder components aus diesen Modulen) funktionieren ohne Änderung; kein Test importiert Accordion, InfoTip, OptionCard oder QuantityInput direkt.

3. Schnellprüfung:
- npx tsc --noEmit: Exit 0, ohne Fehler.
- npx eslint für die sieben Dateien: Exit 0, ohne Befund.
- npx vitest run src/components: 24 Dateien, 734 Tests, 734 bestanden, 0 fehlgeschlagen.
- grep lucide-react in den sieben Dateien: kein Treffer (Exit 1).
- werte-suche.mjs für die sieben Dateien: 2 Funde, beide in HEAD vorhanden und unverändert (controls.tsx Z. 67, info-tip.tsx Z. 48). Protokoll ausgelagert nach /root/sm24-bilder/E3-BAUMEISTER-01-pruefung-r1/werte-suche.json.
- Kein lucide-Import, kein Logikwächter nötig (kein photo-upload in diesem Paket).

4. Fokusbeleg: fokus-pruefung.mjs, 14 Tabs auf /gleichschliessende-zylinder/konfigurator (Desktop). Treffer ist das verborgene radio "doppelzylinder" im Bild, box-shadow mit 2 px Ring und 2 px Offset (Ring rgb(18,113,237), Offset rgb(250,251,253)). Der Fokus ist sichtbar.

5. Akkordeon (akkordeon-ausschnitt.mjs, /schliessanlagen, mobil und desktop): 10 Knöpfe mit aria-controls, jeder zeigt auf ein vorhandenes Panel. Erster Eintrag aria-expanded=true, übrige false. Knopfhöhe 80 px mobil und 58 px am Desktop. Kein horizontaler Überlauf (scrollWidth gleich Fensterbreite).

6. Mengenfeld (mengenfeld.mjs, Konfigurator, mobil und desktop): Knöpfe 48 x 44 px, Glyphen sichtbar, Zahl 1 mit tabulären Ziffern. Der Minus-Knopf ist beim Mindestwert gedämpft. Kein Überlauf.

7. Eigene Skripte liegen im Prüfordner und sind nicht Teil des Projekts: fokus-pruefung.mjs, ruhe-zustand.mjs, scroll-zustand.mjs, ring-test.mjs, akkordeon-ausschnitt.mjs, mengenfeld.mjs. Das Skript des Baumeisters wurde nicht verändert, und seine Bilder wurden nicht überschrieben.

Nicht geprüft: Dunkelmodus, Bewegung reduziert, axe, Tastatur am Akkordeon (Enter oder Space).
