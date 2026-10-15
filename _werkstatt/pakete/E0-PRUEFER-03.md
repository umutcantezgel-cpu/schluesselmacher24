E0-PRUEFER-03 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 1 · Kern-Version 0 · Schreibrechte (exakt): `_werkstatt/werkzeuge/logikwaechter.mjs`, `_werkstatt/werkzeuge/logik-ausnahmen.json`, `_werkstatt/werkzeuge/textabzug.mjs`, `_werkstatt/protokolle/logik-fingerabdruecke.json`, `_werkstatt/protokolle/textabzug/*.txt`, `src/lib/store/cart.test.ts` (neu) · Umfang: Schutzwerkzeuge für Geschäftslogik und Rechtstexte, Charakterisierungstest des Warenkorbs

## Rollenbriefing
Du bist Prüfer. Du richtest Prüfwerkzeuge ein, schreibst Tests für Abläufe, deren Ausfall teuer wäre, und berichtest knapp mit Belegpfaden. Häufige Fehler: deuten statt berichten; über die Stufe hinaus prüfen; Tests, die nur das Aussehen prüfen. Du committest und pushst nie und änderst keine bestehende Projektdatei.

## Aufgabe in einem Satz
Baue einen Logikwächter, der jede Änderung an Geschäftslogik in Darstellungsdateien aufdeckt, einen Textabzug der Rechtsseiten und einen Charakterisierungstest für den Warenkorb-Store, und sichere damit den Ausgangsstand.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug
- Gemeinsame Grundlage, nur importieren: `_werkstatt/werkzeuge/lib.mjs` (Pfade, `browserStarten`, `kontextFuer`, `laden`, `argumente`, `zeitstempel`), `_werkstatt/werkzeuge/server.sh`. Die Werkzeug-Abhängigkeiten (`playwright-core`) installiert E0-PRUEFER-02 nach `/root/sm24-werkzeuge`; falls `_werkstatt/werkzeuge/node_modules` noch fehlt, warte nicht, sondern schreibe die Skripte fertig und erprobe `textabzug.mjs` zuletzt.
- TypeScript-Compiler: aus dem Projekt, `createRequire(<REPO>/package.json)('typescript')` (`node_modules/typescript`).
- Geschützte Dateien (Logikwächter-Liste, in dieser Reihenfolge):
  `src/app/(site)/kasse/kasse-formular.tsx`, `src/app/(site)/warenkorb/warenkorb-ansicht.tsx`, `src/app/(site)/bestellung/[id]/page.tsx`, `src/app/(site)/autoschluessel/anfrage/assistent.tsx`, `src/app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx`, `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx`, `src/app/(site)/sicherheitstechnik/sicherheitscheck/sicherheitscheck.tsx`, `src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx`, `src/app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx`, `src/app/(site)/service-und-termin/anfrage/anfrage-formular.tsx`, `src/app/(site)/service-und-termin/terminstatus/status-formular.tsx`, `src/app/(site)/schluessel-nach-code/[slug]/bestell-formular.tsx`, `src/app/(site)/artikel/[slug]/artikel-kauf.tsx`, `src/app/(site)/rechtliches/cookie-einstellungen/cookie-einstellungen.tsx`, `src/components/forms/photo-upload.tsx` (15 Dateien).

## Maßstab
Stil und Aufbau wie `lib.mjs` (ESM, deutscher Kopfkommentar, `argumente()`, Markdown-Ausgabe, Exit-Codes: 0 = alles gleich, 3 = Abweichung gefunden, 2 = Bedienfehler, 1 = technischer Fehler). Testmuster für `cart.test.ts`: `src/lib/staffel.test.ts` (Vitest, `describe`/`it`, Umgebung `node`, `globals: true`).

## Grenzen
- Keine bestehende Datei ändern. `cart.test.ts` ist neu und prüft nur Verhalten (Zustandsänderungen), nie Aussehen.
- Rechtstexte nur lesen; der Textabzug läuft gegen den laufenden Server (`server.sh start`).

## Schritte
1. **`logikwaechter.mjs`** – Aufruf: `node logikwaechter.mjs sichern [dateien…]` · `node logikwaechter.mjs pruefen [dateien…] [--basis <commit>]` · ohne Dateien gilt die Liste oben.
   Fingerabdruck einer Datei (Funktion `fingerabdruck(quelltext, dateiname)`):
   a. Mit `ts.createSourceFile(…, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)` parsen.
   b. **Teil A – Code außerhalb von JSX:** Jeden `JsxElement`, `JsxSelfClosingElement` und `JsxFragment` durch den Platzhalter `__JSX__` ersetzen. Importdeklarationen entfernen, deren Modul `lucide-react` ist oder mit `@/components/visual/` beginnt. Rest mit `ts.createPrinter({ removeComments: true })` ausgeben und Leerraum normalisieren.
   c. **Teil B – Ausdrücke in JSX:** Sammle aus allen JSX-Knoten den normalisierten Text jedes `JsxExpression` in Kindpositionen sowie jedes Attributs mit Ausdruckswert (`name={…}`), **außer** den Attributen `className`, `style`, `size`, `strokeWidth`, `width`, `height`, `viewBox`, `key`. Darin enthaltene JSX-Knoten werden ebenfalls zu `__JSX__`. Attribute mit reinem Zeichenkettenwert und Textknoten werden nicht gesammelt (Mikrotexte dürfen sich ändern). Die Liste sortieren (Mehrfachmenge, Reihenfolge egal).
   d. Fingerabdruck = SHA-256 über Teil A + Trenner + Teil B. Exportiere `fingerabdruck` für Tests.
   - `sichern`: schreibt `_werkstatt/protokolle/logik-fingerabdruecke.json` als `{ "basis": "<git rev-parse HEAD>", "dateien": { "<pfad>": "<hash>" } }`.
   - `pruefen`: berechnet die Hashes des Arbeitsbaums und vergleicht sie mit der Datei. Bei Abweichung erzeugt es den Vergleichstext aus `git show <basis>:<pfad>` und zeigt einen zeilenweisen Unterschied der normalisierten Teile A und B (höchstens 40 Zeilen je Datei; für Teil B: hinzugekommene und entfallene Ausdrücke).
   - `logik-ausnahmen.json`: `{ "<pfad>": [ { "grund": "…", "suchen": "<regulärer Ausdruck>", "ersetzen": "<text>" } ] }`. Vor dem Fingerabdruck werden die Ersetzungen auf den Quelltext angewendet (alt **und** neu). Lege die Datei mit genau diesen zwei Einträgen an:
     - `src/app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx`: Grund „Scrollverhalten folgt reduzierter Bewegung (L-03)“, suchen `behavior:\s*(?:'smooth'|scrollVerhalten\(\))`, ersetzen `behavior: __SCROLL__`.
     - `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx`: gleicher Grund und gleiche Ersetzung.
   - Selbsttest: Kopiere `kasse-formular.tsx` nach `/tmp`, ändere dort **nur** einen `className`-String und einen Textknoten → `fingerabdruck` gleich; ändere stattdessen ein `onClick={…}` oder einen Funktionsaufruf in `pruefen` → anders. Ergebnis im Bericht.
   - Danach `node logikwaechter.mjs sichern` ausführen (15 Dateien).
2. **`textabzug.mjs`** – Aufruf: `node textabzug.mjs sichern` · `node textabzug.mjs vergleichen`. Seiten: `/rechtliches/agb`, `/rechtliches/widerruf`, `/rechtliches/impressum`, `/rechtliches/datenschutz`, `/rechtliches/versand-und-zahlung`, `/rechtliches/cookie-einstellungen`. Je Seite `innerText` von `main#inhalt` (Desktop), Leerraum je Zeile normalisiert, leere Zeilen entfernt. `sichern` schreibt `_werkstatt/protokolle/textabzug/<letztes-pfadsegment>.txt`; `vergleichen` zeigt je Seite gleich/abweichend und bei Abweichung die ersten 20 unterschiedlichen Zeilen. Danach `sichern` ausführen.
3. **`src/lib/store/cart.test.ts`** – Charakterisierungstest des Store-Verhaltens über `useCartStore.getState()` und `useCartStore.setState({ items: [], shippingOptionId: undefined })` vor jedem Test. Mindestens diese 8 Fälle: `addCodeKey` legt einen Eintrag an · gleiche Codelinie und gleicher Code werden zusammengefasst (Menge addiert, Preis aktualisiert) · anderer Code ergibt zweiten Eintrag · `addCylinderOrder` legt einen Eintrag an · `addStandard` legt einen Eintrag an · `updateQty` ändert die Menge · `remove` entfernt genau einen Eintrag · `setShipping` und `clear`. Zusätzlich `count()` nach zwei Einträgen. Lies dafür `src/lib/store/cart.ts` und `src/lib/types.ts` vollständig; erfinde keine Felder. Falls `persist` ohne `localStorage` eine Warnung druckt, ist das kein Fehler.
4. `npx vitest run src/lib/store/cart.test.ts` grün; `npx eslint src/lib/store/cart.test.ts` und `npx tsc --noEmit` ohne neue Fehler.

## Schnellprüfung und Selbstprüfung
- 15 Fingerabdrücke gesichert, 6 Textabzüge gesichert, mindestens 9 Testfälle grün (Zahlen im Bericht).
- Selbsttest des Logikwächters: beide Richtungen belegt.
- `git status --short` zeigt nur die erlaubten Dateien.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN (gewünschte Änderungen als exakte Liste) · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E0-PRUEFER-03 · BEREIT ZUR RÜCKGABE ===
