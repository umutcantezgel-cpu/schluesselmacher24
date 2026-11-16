# FA-QA-04B · Formularschritte in der Browser-Historie

Baumeister, 16.11.2026. Anforderung FA-26-04 („Zurückfunktion ohne Datenverlust“, „Mobile Bedienung besonders intensiv testen“). Kein git, kein Server, keine Formularsendung. Serveraktionen, Pflichtregeln für Unterlagen (R13), Texte, Gestaltungssystem, Navigation und die Schrittliste der FlowShell (FA-QA-04A) sind nicht angefasst. Gelesen: `node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md` (Abschnitt `window.history.pushState`) und der Code dahinter (`next/dist/client/components/app-router.js`: Next übernimmt `pushState`/`replaceState` ohne Adresse ohne eigene Navigation, kopiert `__NA` und den Baum in den Eintrag; `popstate` auf einen Eintrag mit `__NA` stellt denselben Baum wieder her).

## GEÄNDERTE DATEIEN

Neu
- `src/lib/flow/schritt-historie.ts`: Schritt-Historie je Ablauf (`SchrittHistorie`) und die reinen Entscheidungen (`eintragAus`, `rueckwegDelta`, `aufRelevant`, `popstateEntscheiden`, `browserFenster`).
- `src/lib/flow/schritt-historie.test.ts`: 35 Tests (reine Logik und Nachbau von Browser, Ablauf und Rückfrage).
- `src/lib/flow/use-flow-vorab.test.tsx`: 2 Tests (Vorabrendern ohne Fenster mit FlowShell).

Geändert
- `src/lib/flow/use-flow.ts`: `goTo`, `updateAndGoTo`, `next`, `back` laufen über einen gemeinsamen Wechsel mit Historie; Abgleich des aktuellen Eintrags nach jedem Rendern; `popstate`-Hörer; `FlowState.historie` (optional im Typ).
- `src/lib/flow/verlassen-warnung.ts`: `WachOptionen` (`wache`, `imAblauf`) für `wacheEinrichten` und `useVerlassenWarnung`; ohne Optionen verhält sich alles wie bisher.
- `src/lib/flow/verlassen-warnung.test.ts`: 2 neue Tests.
- `src/components/flow/flow-shell.tsx`: nur der Block um `useVerlassenWarnung` (Wache nur am Anfang des Ablaufs, Freigabe für Browser-Vorwärts). Schrittliste unberührt.
- `src/components/flow/flow-shell.test.tsx`: 1 neuer Test.
- `src/components/forms/formulare-bedienbarkeit.test.ts`: Sammeltest um 17 Fälle erweitert (je Formular und Muster).
- `src/components/fahrzeug-anfrage/zustand.test.ts`: der React-Ersatz des Tests kennt jetzt `useRef` und `useEffect` (Effekte laufen dort nicht, wie beim Vorabrendern). Nötig, weil `useFlow` nun beide nutzt; keine Änderung am Muster-Formular selbst.
- dieser Bericht.

## WAS UND WARUM

1. Ein Eintrag je Schritt nach vorn. `useFlow` legt bei jedem Wechsel auf einen späteren Schritt mit `history.pushState(zustand, '')` einen Eintrag an, ohne Adresse und ohne Suchparameter (canonical und Messung unberührt). Der Eintrag trägt unter `sm24Ablauf` die Kennung des Formulars und den Pfad der bekannten Schritte darunter. Der Pfad ist relativ und behauptet nie mehr Einträge, als der Ablauf selbst angelegt hat.
2. Browser- und Android-Zurück: `popstate` führt auf den Schritt des Eintrags. Zurück im ersten Schritt (kein eigener Eintrag darunter) verlässt das Formular wie bisher.
3. Browser-Vorwärts: wieder auf den späteren Schritt, aber nur, solange der aktuelle Schritt erfüllt ist (`validate` des Ablaufs und die Freigabe der FlowShell = `canContinue`, im Muster also auch mit fehlenden Unterlagen) und nur einen Schritt weit. Ist der Schritt gesperrt, springt der Browser auf den Eintrag zurück, von dem er kam; ein Sprung über mehrere Einträge (langes Drücken auf Vorwärts) endet auf dem nächsten Schritt. Damit wird kein Schritt übersprungen, auch keiner mit Nachweis (R13). Zurück ist immer frei.
4. Eigener Zurück-Knopf und Schrittlinks nutzen dieselbe Historie: Liegt ein Eintrag mit dem Zielschritt darunter, geht der Ablauf mit `history.go(-n)` dorthin (der nächste Eintrag mit dem Ziel, nie weiter) und wechselt mit dem `popstate`. Kein doppelter Eintrag; Vorwärts im Browser führt danach wieder hinauf. Ein laufender Sprung sperrt weitere Wechsel (doppelter Klick springt nicht um zwei Schritte); kommt ein Sprung nie an, wechselt der nächste Klick nach einer Sekunde direkt. `updateAndGoTo` rückwärts übernimmt die Daten sofort, der Schritt folgt mit dem `popstate`.
5. Kein Eintrag darunter (Neuladen mitten im Ablauf, Zwischenstand aus einem früheren Besuch): Der eigene Zurück-Knopf wechselt direkt wie bisher, und der aktuelle Eintrag wird umbeschriftet (`replaceState`). Beim Neuladen setzt das Formular am gespeicherten Schritt fort wie bisher; liegen noch Schritteinträge in der Historie, gelten sie weiter.
6. Abgleich: Nach jedem Rendern prüft der Ablauf, ob der aktuelle Eintrag den angezeigten Schritt nennt, und schreibt nur bei Abweichung (`replaceState`, nie ein neuer Eintrag). Das fängt Wiederherstellen, „Neu beginnen“ und Einträge, deren Zustand Next.js oder die Adressbereinigung der Konfiguratoren ersetzt hat. Ein Eintrag ohne Kennung darunter wird beim Zurück aus dem bekannten Pfad erkannt.
7. Rückfrage vor dem Verlassen und Schritte stören sich nicht. Die Rückfrage beim Neuladen und Schließen gilt wie bisher auf jedem Schritt. Den Wacheintrag gegen Browser-Zurück braucht es nur noch am Anfang des Ablaufs (`amAnfang`: kein eigener Schritteintrag darunter), weil Zurück weiter oben einen Schritt zurückführt und nichts verliert. Die FlowShell liest `amAnfang` über `useSyncExternalStore` und richtet die Wache mit `wache: !historie || amAnfang` ein. Vorwärts auf einen späteren Schritt gilt nicht als Verlassen (`imAblauf`). Ohne Schritt-Historie (Test-Ersatz) verhält sich die Wache genau wie bisher.
8. Gewählte Dateien liegen im Zustand der Formular-Komponente. Zurück und Vorwärts bleiben im selben Dokument; die Komponente bleibt, die Dateien bleiben (im Nachbau geprüft, im Browser zu bestätigen).
9. Muster Fahrzeugschlüssel: hatte die Rückfrage schon (`ungesichert={dateienGewaehlt}`, `mitDateien`, Abnahme FA-QA-02 vom 15.11.2026). Nichts zu ändern; der Sammeltest sichert es jetzt ab.
10. Ohne Fenster (Vorabrendern): Alle Zugriffe gehen über `browserFenster()`, das ohne `window` oder ohne `history` `null` gibt; Effekte laufen auf dem Server nicht. Test mit `renderToStaticMarkup` von `useFlow` und FlowShell.

## GEMEINSAME DATEIEN

- `src/lib/flow/use-flow.ts` und `src/lib/flow/verlassen-warnung.ts` wirken auf alle 15 mehrstufigen Formulare.
- `src/components/flow/flow-shell.tsx`: nur der Block nach `const hinweisId = useId();` und zwei Hilfsfunktionen über `FlowShell`; die Schrittliste (FA-QA-04A) unverändert. Die Schrittknöpfe rufen weiter `flow.goTo`, das jetzt die Historie nutzt.
- Formulare, die den gemeinsamen Ablauf umgehen: keines. Kein Formular ruft `history.pushState`, `go`, `back` oder `forward` selbst (Sammeltest). Berührungspunkt, nicht geändert: Zylinder-Konfigurator (`src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx`, `adresseBereinigen`) und Schließplan-Planer (`src/components/konfigurator/schliessplan-planer.tsx`, ebenso) ersetzen beim Laden mit Link-Zwischenstand den Eintrag (`replaceState(null, '', pathname)`) und hören auf `popstate` für ihre Adresse. Der Abgleich stellt den Schritteintrag danach wieder her; der Sammeltest erlaubt dort nur genau diesen Aufruf.

## PRÜFUNG UND ERGEBNIS

Alles über `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- …`.
- `npx vitest run`: 246 Dateien, 3.815 Tests bestanden (zweimal, zuletzt nach dem Bericht).
- `npm run typecheck`: ohne Fehler.
- `npm run lint`: ohne Fehler und Warnungen.
- `npm run build`: erfolgreich, 181 von 181 Seiten erzeugt.
- Erster Lauf rot: `zustand.test.ts` (Muster) ersetzt React durch einen eigenen Nachbau ohne `useRef`; Nachbau ergänzt, `browserFenster()` gibt ohne `history` `null`.

## BELEGE

- Logik: `src/lib/flow/schritt-historie.ts` (`popstateEntscheiden`, `SchrittHistorie.vor`, `.zurueck`, `.beiPopstate`, `.abgleichen`, `.amAnfang`, `.istFolgeEintrag`).
- Einbau: `src/lib/flow/use-flow.ts` (`wechseln`, Abgleich-Effekt, `popstate`-Effekt), `src/components/flow/flow-shell.tsx` (`useVerlassenWarnung(…, { wache: !historie || amAnfang, imAblauf })`, `setzeFreigabe`).
- Tests: `schritt-historie.test.ts` deckt vor, zurück, vorwärts, gesperrten Schritt (Validierung und Freigabe des Rahmens), Sprung über mehrere Einträge, ersten Schritt, Neuladen, „Neu beginnen“, ersetzten Zustand, ausgeblendeten Schritt, doppelten Klick, ausbleibenden Sprung, Wacheintrag der Rückfrage (Abbrechen, OK, Dateien in Schritt 3, ohne Dateien, Dateien entfernt) und den Betrieb ohne Fenster ab. `formulare-bedienbarkeit.test.ts` je Formular und Muster.

## FÜR DEN ORCHESTRATOR: BROWSERPROBE (Android- und iPhone-Profil)

Je ein Formular mit Dateien (`/beratung` oder `/schluessel-einschicken/anmelden`) und das Muster (Fahrzeugschlüssel-Anfrage), Upload als Attrappe, nichts senden:
1. Zwei Schritte mit „Weiter“, dann Browser-Zurück: genau ein Schritt zurück, Adresse unverändert (kein `?`), Angaben da. Noch einmal Zurück im ersten Schritt ohne Datei: sofort zur vorigen Seite, keine Rückfrage.
2. Vorwärts im Browser: wieder auf den späteren Schritt. Dann im früheren Schritt ein Pflichtfeld leeren und Vorwärts: der Schritt bleibt, kein Sprung vorbei. Im Muster im Schritt „Unterlagen“ eine Pflichtdatei entfernen, Vorwärts: bleibt bei „Unterlagen“.
3. Eigener Zurück-Knopf, dann Browser-Vorwärts: wieder vorn. Doppelt auf „Zurück“ tippen: nur ein Schritt. Schrittliste (ab Tablet) zwei Schritte zurück, dann Browser-Zurück: ein weiterer Schritt zurück, nicht hinaus.
4. Datei im Schritt 3 wählen, dreimal Zurück: zweimal ohne Frage bis Schritt 1, die Datei ist nach Vorwärts bis Schritt 3 noch da; das dritte Zurück fragt. „Abbrechen“ bleibt im Formular, „OK“ verlässt mit genau einer Frage.
5. Datei im ersten Schritt wählen, „Weiter“, Zurück, Zurück: erst Schritt 1 ohne Frage, dann die Frage.
6. Neuladen auf Schritt 3: Fortsetzen am gespeicherten Schritt; Zurück führt auf Schritt 2.
7. Scrollen: Nach Browser-Zurück steht die Schrittüberschrift oben unter Kopf und Band (390 × 844), nicht die alte Scrollposition des Browsers.
8. Android-Zurück-Geste und iOS-Wischgeste (M-07, echte Geräte): wie 1 bis 5. Safari kennt keine Rückfrage beim Schließen; die Wache gegen Zurück gilt dort trotzdem.
9. Zylinder-Konfigurator mit Link-Zwischenstand (`?…`): nach dem Laden ist die Adresse bereinigt, Weiter und Zurück verhalten sich wie in 1.
10. (Nachbesserung) Bis Schritt 3, „Neu beginnen“ (Zylinder-Konfigurator: „Zusammenstellung verwerfen“): das Formular steht auf Schritt 1, Browser-Zurück führt einmal gedrückt zur vorigen Seite, nie auf einen späteren Schritt.
11. (Nachbesserung) Auf Schritt 2 einen Link im Formular auf eine andere Seite der Website, Browser-Zurück ins Formular, eine Datei wählen: die Seite bleibt stehen (kein Sprung der Scrollposition, kein Schrittwechsel), danach ist Browser-Vorwärts grau oder ohne Wirkung; Zurück geht auf Schritt 1, dann fragt das Verlassen.

## OFFENE FRAGEN

- Wird die Rückfrage erst weiter oben nötig (Datei in Schritt 3) und geht man im Browser bis Schritt 1 zurück, legt die Wache dort ihren Eintrag an. Das schneidet die Vorwärts-Einträge ab: Browser-Vorwärts führt dann nicht mehr auf Schritt 2 (der Knopf „Weiter“ schon, die Angaben bleiben). Ein Wacheintrag lässt sich nicht unter bestehende Einträge schieben. Reicht das, oder soll die Wache in diesem Fall entfallen (dann verlässt Zurück im ersten Schritt ohne Frage, nur innerhalb der Website)?
- (Erledigt in der Nachbesserung, Befund 3.) Die frühere Aussage, alte Schritteinträge nach „Neu beginnen“ seien „unschädlich, aber ungewohnt“, war falsch: Bei leerem ersten Schritt war Browser-Zurück eine Sackgasse. „Neu beginnen“ springt jetzt auf den ersten eigenen Eintrag zurück.
- Kommt ein Formular über einen gespeicherten Zwischenstand frisch auf Schritt 3 (neuer Besuch, kein Eintrag darunter), verlässt Browser-Zurück das Formular (mit Rückfrage, falls Dateien gewählt sind). Künstliche Einträge für Schritt 1 und 2 nachzulegen habe ich bewusst nicht gebaut.
- Die Scrollwiederherstellung des Browsers für Einträge derselben Seite läuft vor dem `popstate`; danach scrollt der Ablauf zur Schrittüberschrift. Ob iOS Safari das ruckelfrei zeigt, zeigt nur die Geräteprobe (Punkt 7).

## FÜR MENSCHEN

- Geräteprobe mit echten iPhone- und Android-Geräten (M-07, FA-26-09): Zurück-Geste und Zurück-Taste nach den Punkten 1 bis 8 oben, besonders mit gewählten Fotos.
- Inhaber: Entscheidung zur ersten offenen Frage (Vorwärts nach der Rückfrage im ersten Schritt) nur, falls die Geräteprobe es als störend zeigt.

## NACHBESSERUNG (16.11.2026, nach zwei Gegenprüfungen)

Geänderte Dateien: `src/lib/flow/schritt-historie.ts`, `src/lib/flow/use-flow.ts`, `src/lib/flow/verlassen-warnung.ts`, `src/components/flow/flow-shell.tsx` (nur der Block um `useVerlassenWarnung`), `src/lib/flow/schritt-historie.test.ts` (8 neue Tests, 1 umgeschrieben), `src/lib/flow/verlassen-warnung.test.ts` (1 neuer Test), `src/components/forms/formulare-bedienbarkeit.test.ts` (Sammeltest um 1 Fall und 4 Prüfungen erweitert), dieser Bericht. Kein Formular selbst geändert.

1. [rot] `schritt-historie.ts`, Sackgasse nach „Neu beginnen“: **behoben.** Zutreffend: Der Abgleich schrieb [f,s,u] auf [f,s,f] um, Zurück auf [f,s] galt als Vorwärts mit Sperre und sprang zurück, immer wieder. Jetzt (a) geht `SchrittHistorie.neuBeginnen()` mit `history.go(-(Pfadlänge − 1))` auf den ersten eigenen Eintrag, statt umzuschreiben; der Abgleich wartet, solange der Sprung läuft. (b) `popstateEntscheiden` wendet die Vorwärtssperre nur noch bei Vorwärts in der Historie an: Geht die Historie zurück (`tiefe < 0`) auf einen Eintrag mit einem späteren Schritt, bleibt der Schritt, kein Sprung nach vorn, und der Eintrag wird umbeschriftet. (c) Damit ein Sprung über mehrere Einträge nach vorn weiter auf dem nächsten Schritt endet, misst der Rücksprung am Ausgangseintrag, nicht am übersprungenen. Tests im Nachbau: weiter, weiter, Neu beginnen, Zurück bei leerem ersten Schritt verlässt mit einem Zurück; ebenso mit gültigem erstem Schritt; verwirft der Browser den Sprung, kommt man nach höchstens drei Zurück hinaus, immer auf Schritt 1, nie nach vorn.
2. [rot] `use-flow.ts`, `reset` ohne Historie: **behoben.** Zutreffend (Konfigurator, „Zusammenstellung verwerfen“ mitten im Ablauf). `reset` ruft jetzt `historie.neuBeginnen()` und setzt den Stand für den popstate-Hörer sofort auf den leeren Stand, damit das popstate des Sprungs den alten Stand nicht zurückholt. Sammeltest: `reset` ruft `historie.neuBeginnen()`, der Konfigurator ruft `flow.reset`.
3. [gelb] Bericht verharmlost: **behoben.** Die offene Frage ist ersetzt; sie nennt den Fehler und die Korrektur.
4. [rot] `schritt-historie.ts`, Eintrag ohne Kennung immer als Zurück gedeutet: **behoben.** Zutreffend. (a) Die Richtung wird nicht mehr geraten: Ein Eintrag ohne Kennung wird nur aus dem Pfad abgeleitet, wenn ein eigener Sprung erwartet wird oder die Position der Navigation API (`navigation.currentEntry.index`) kleiner ist als die zuletzt bekannte. Sonst `null`: kein `replaceState`, kein Schrittwechsel, kein Speichern eines Schritts. (b) Statt einer Rückfrage bei Vorwärts hinaus schneidet die Warnung ohne Wacheintrag (`wache: false`) fremde Vorwärts-Einträge ab, sobald sie gilt (`vorwaertsKappen`: ein Eintrag zurück auf den eigenen Schritt darunter, den aktuellen wieder darüber, Scrollposition gehalten, Schritt unverändert). Das stellt die frühere Zusicherung wieder her (der Wacheintrag schnitt ab), ohne zusätzlichen Eintrag. Eine Rückfrage beim popstate hätte das Verlassen nicht verhindert: Next.js beginnt die Navigation auf die andere Seite im selben popstate, die Komponente mit den Dateien würde abgehängt, auch nach „Abbrechen“. Nach „Weiter“ oder einem vorigen Abschneiden passiert nichts (über dem Eintrag liegen dann nur eigene). Tests: Vorwärts auf eine fremde Seite ohne Dateien (fremder Eintrag unverändert, Schritt bleibt), Schritt 2 mit Datei nach Rückkehr von einer anderen Seite (abgeschnitten, Vorwärts ohne Wirkung, Scroll gehalten, Zurück bis zur Frage im ersten Schritt), ohne Navigation API kein Raten, kein doppeltes Abschneiden nach „Weiter“, Wache-Einheitstest für `vorwaertsKappen`.
5. [gelb] `use-flow.ts`, Exemplar in `useMemo`: **behoben.** Zutreffend laut React-Dokumentation. Jetzt `useState(() => new SchrittHistorie(id, browserFenster))`; ändert sich die Kennung, entsteht während des Renderns ein neues Exemplar (Muster „Informationen aus früheren Renderdurchläufen“). Sammeltest sichert es ab.

Prüfung der Nachbesserung über `_werkstatt/ausbau/werkzeuge/sicher.sh`: `npx vitest run` 246 Dateien, 3.829 Tests bestanden; `npm run typecheck` ohne Fehler; `npm run lint` ohne Fehler und Warnungen; `npm run build` erfolgreich, 181 von 181 Seiten. Für die Browserprobe neu: Punkte 10 und 11 oben.

Offene Fragen aus der Nachbesserung:
- Ohne Navigation API (ältere Browser) wird ein Eintrag ohne Kennung beim Browser-Zurück nicht mehr erkannt: Ein Zurück bleibt dann ohne sichtbare Wirkung, das nächste führt auf den Schritt darunter. Tritt nur auf, wenn Next.js den Zustand eines Schritteintrags ersetzt hat; bewusst so, weil Raten den Eintrag einer fremden Seite überschreiben kann.
- Das Abschneiden (Punkt 11 der Browserprobe) löst ein kurzes Zurück und Wieder-Vor im Browser aus. Ob iOS Safari oder Android dabei etwas zeigt (Flackern, Wischgeste), zeigt nur die Geräteprobe.

## Abnahme durch den Orchestrator (16.11.2026)

Prüfkette (`bash _werkstatt/ausbau/werkzeuge/abnahme.sh FA-PLATTFORM-01B`, alle drei Pakete der Welle gemeinsam im Arbeitsbaum, nach allen Eingriffen): Typprüfung grün, Lint grün, Unit 3834 von 3834, Datenbanktests 165 von 165 (beide Partner-Migrationen laufen auf einer frischen Datenbank), Build 181 von 181 Seiten. Onpage-Messung am neu gestarteten Prüfserver: 137 Seiten, Median 100, kein roter und kein gelber Befund. `reste.mjs` über alle vier Quellen: nur die zehn bekannten Platzhalter in `src/lib/pdf/partnervertrag.ts` (MA-29).

Befund der Browserprobe, behoben:
- Browser-Vorwärts auf einen gesperrten Schritt (im ersten Schritt ein Pflichtfeld geleert, dann Vorwärts) sprang nicht auf den Eintrag des Schritts zurück. Stattdessen wurde der erreichte Eintrag umbeschriftet; es entstand ein doppelter Eintrag desselben Schritts, der Eintrag von Schritt 3 ging verloren, und ein späteres Zurück blieb einmal ohne sichtbare Wirkung. Kein Datenverlust, keine Falle.
- Ursache (mit einer Aufzeichnung der Aufrufe im Browser belegt): Bei `popstate` hört Next.js zuerst und lässt React im selben Ereignis neu rendern. Der Abgleich nach dem Rendern lief deshalb mit dem noch alten Schritt, bevor der eigene Hörer das Ereignis auswertete, schrieb den erreichten Eintrag um und ersetzte den bekannten Pfad. Danach maß `beiPopstate` die Richtung falsch.
- Behebung in `SchrittHistorie.abgleichen` (`src/lib/flow/schritt-historie.ts`): Steht der Browser schon auf einem anderen eigenen Eintrag als dem bekannten, fasst der Abgleich ihn nicht an; `beiPopstate` entscheidet und gleicht danach ab. Der Nachbau im Test kann die echte Reihenfolge jetzt nachstellen (`abgleichVorPopstate`); zwei neue Tests, einer davon schlug vor der Behebung fehl („gesperrtes Vorwärts mit Abgleich vor dem popstate“).

Browserprobe (Attrappen, nichts abgesendet, G5) an der Gehäuse-Anfrage, Einstieg über einen Verweis, damit unter dem Formular eine Seite liegt. Drei Profile: Android (Pixel 7), iPhone 14, iPhone 14 ohne Navigation API (nachgestellt, weil Safari sie lange nicht kennt). Am Prüfserver mit dem Produktions-Build und an einer Entwicklungsinstanz: je 18 von 18.
- Browser-Zurück führt je einen Schritt zurück, die Adresse bleibt gleich, die Angaben bleiben.
- Browser-Vorwärts bleibt bei ungültigem Schritt stehen und führt bei gültigem Schritt je einen Schritt weiter, auch zweimal hintereinander.
- Eigener Zurück-Knopf ohne Doppelsprung; danach „Weiter“ wieder auf Schritt 3.
- Eine in Schritt 3 gewählte Datei übersteht Zurück und Vorwärts.
- Zurück bis Schritt 1 ohne Rückfrage; das Verlassen im ersten Schritt fragt nach, „Abbrechen“ hält im Formular, Angaben und Datei bleiben.
- Verweis aus dem Formular hinaus und Browser-Zurück: wieder im Formular auf dem Schritt.
- Neuladen setzt am gespeicherten Schritt fort; „Neu beginnen“ führt auf Schritt 1 mit leeren Angaben, danach führt Browser-Zurück aus dem Formular (keine Falle).

Nicht im Browser geprüft: „Zusammenstellung verwerfen“ im Zylinder-Konfigurator (der Knopf war im Probelauf nicht erreichbar; derselbe Weg `reset` ist über „Neu beginnen“ geprüft und im Nachbau getestet) und Punkt 11 der Liste mit Dateiwahl nach der Rückkehr (im Nachbau getestet). Echte Geräte mit Wischgeste bleiben für die Geräteprobe (FA-26-09).

Ein Konsolenhinweis in der Probe („Failed to load resource“) stammt vom abgefangenen Upload der Attrappe, nicht von der Seite.

=== ENDE FA-QA-04B · BEREIT ZUR RÜCKGABE ===
