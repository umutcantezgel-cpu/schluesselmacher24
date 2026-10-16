# E5-BAUMEISTER-22 · Bericht und Abnahme

3 Prüfrunden, Prüfurteil: nicht bestanden. Abnahme durch den Orchestrator:

- **Prüfurteil nach Runde 3 nicht bestanden – der Muss-Befund war ein Fehler im Paket:** Es verlangte ein Fach-Icon im Arbeitskopf und berief sich auf Assistent und Kasse; beide zeigen keins, und `PageHeader` zeigt das Bereichs-Icon bewusst nur in Erzählansichten. Entscheidung: Arbeitsköpfe ohne Fach-Icon (wie Assistent und Kasse); der Befund entfällt.
- **Nacharbeit:** „Wie es weitergeht“ in der Erfolgsansicht als Haarlinienliste mit Mono-Ziffer statt absolut gesetzter Kreise (`-left-[37px]` entfällt, nur Klassen geändert; Logikwächter „gleich“, Wertesuche 0).
- **Entschieden:** Erfolgsansicht im Code geprüft (CheckDraw mit Titel, Vorgangsnummer in Mono, Schriftfeld „Ihre Angaben“); ein Bild bräuchte ein Absenden und bleibt der Funktionsliste in Prüfstufe C vorbehalten. Keine Feldfehler für Vorname, Nachname, Telefon und Land (neue Ausdrücke im geschützten Formular; die Sperre mit Hinweis bleibt). Formularspalte `max-w-3xl` am Desktop bestätigt (Arbeitsansicht, Lesebreite).
- **Bilder (eigene):** Desktop und mobil, Schritt 1 mit Aufnahmehinweisen, Beispielzeichnung und gesperrtem „Weiter“ mit Begründung.

## Prüfurteil

- **muss:** Fach-Icon im Arbeitskopf fehlt (Paket Aufgabe und Befund Kopf). page.tsx Z. 28-29 setzt bereich und art="arbeit", aber page-header.tsx zeigt das Bereichs-Icon nur bei art="erzaehl". Desktop- und Tablet-Bild zeigen keinen Icon. Umsetzbar in der eigenen Datei page.tsx nach dem Muster sicherheitstechnik/sicherheitscheck/page.tsx (Icon im children-Slot, Option c des Baumeisters). Die Behauptung des Baumeisters, Assistent (autoschluessel/anfrage/page.tsx) und Kasse (kasse/page.tsx) hätten kein bereich und kein Icon, trifft zu; das Paket ist damit in diesem Punkt fehlerhaft, bleibt aber als Auftrag unerfüllt. Entscheidung des Orchestrators nötig.
- **soll:** Schritt-Bilder fehlen: Paket Schritt 4 verlangt Startseite des Ablaufs und Foto-Schritt. Der Baumeister hat funktionsliste F-07 nicht gestartet; das Werkzeug schreibt Markdown- und JSON-Protokolle unbedingt ins Repository (funktionsliste.mjs Z. 890-902). Ohne Werkzeugänderung ist der Beleg nicht erzeugbar. Der Foto-Schritt ist nicht belegt.
- **soll:** Erfolgsansicht (formular Z. 392-396): Paket verlangt CheckDraw statt Badge mit Haken. Der Baumeister behält den Badge "Anfrage eingegangen" neben CheckDraw mit gleichem Text, daher doppelte Aussage. Die Ansicht ist nicht belegt (kein Bild, Absenden verboten).
- **soll:** Desktop 1440 px: Schrittbreite max-w-3xl lässt rechts etwa ein Viertel leer, während der Kopf volle Breite hat. Sichtbare Schwäche im Desktop-Bild; eine Layout-Entscheidung (Seitenspalte oder Raster) ist offen.
- **hinweis:** Token-Lücke -left-[37px] in anfrage-formular.tsx Z. 456 (werte-suche: 1 Fund, 0 Ausnahmen). Vom Baumeister gemeldet, im Paket als Meldepflicht vorgesehen.
- **hinweis:** Nebenwirkung im Repository: untracked Protokolle in _werkstatt/protokolle/ (werte-suche-2026-10-16_11-50-15.json und weitere, funktionsliste-2026-10-16_11-45-12.*). Nicht Teil dieses Pakets; Entscheidung des Orchestrators.
- **hinweis:** Der Baumeister hat eine Feldfehler-Anforderung nicht umgesetzt (Vorname, Nachname, Telefon, Land). Das Paket verlangt dies ausdrücklich nicht, daher kein Befund; offen bleibt die Freigabe von Logikwächter-Ausnahmen.

## Bericht des Baumeisters

E5-BAUMEISTER-22 · Runde 3 (Nacharbeit nach Ablehnung in Runde 2)

GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx (JSX-Attribute und className, keine Logik)
- page.tsx nicht geändert.

WAS UND WARUM
1. CheckDraw-Titel (Soll, erledigt): Z. 392 jetzt `<CheckDraw title="Anfrage eingegangen" size={56} />`. Der Titel entspricht dem Badge-Text derselben Ansicht und folgt dem Muster bestaetigung.tsx (dort Titel gleich Augenbraue).
2. Desktop-Breite (Soll, teilweise): die fünf Schrittwrapper von `max-w-2xl space-y-…` auf `max-w-3xl space-y-…` (Hersteller, Nummern, Stückzahl, Kontakt, Fotoschritt). Der Absende-Schritt war schon max-w-3xl. Die Leerfläche rechts bleibt bei 1440 px etwa ein Viertel der Breite. Ein voller Ausgleich braucht eine Layout-Entscheidung (siehe offene Fragen).
3. Fach-Icon im Arbeitskopf (Muss): NICHT umgesetzt. Die Entscheidung liegt beim Orchestrator. page-header.tsx ist nicht meine Datei. Die Optionen (a) page-header-Änderung, (b) Paketänderung, (c) Fach-Icon im children-Slot wie beim Sicherheitscheck stehen unter OFFENE FRAGEN.
4. Erfolgsansicht (Soll): Code geprüft, Bild nicht möglich ohne Absenden. Als nicht belegt gemeldet.
5. Feldfehler Vorname, Nachname, Telefon, Land (Soll): als OFFENE FRAGE gemeldet, nicht umgesetzt (würde neue JSX-Ausdrücke brauchen).

PRÜFUNG UND ERGEBNIS
- Lock /tmp/sm24-messfenster.lock: nicht vorhanden, Messung frei.
- Logikwächter: gleich, abweichend 0.
- tsc: Exit 0. eslint (beide Dateien): Exit 0, ohne Befund.
- vitest src/components und src/lib: 61 Dateien, 1110 Tests bestanden.
- werte-suche: 1 Fund (-left-[37px], gemeldet).
- lucide in beiden Dateien: kein Treffer.
- Platzhalter im gerenderten HTML: 0 Treffer.
- Vollseiten mobil, tablet, desktop über Port 3001 gezogen und angesehen: nichts abgeschnitten, kein horizontaler Überlauf, Verweislinks umbrechen sauber.
- Schnellprüfung erneut vollständig gelaufen. funktionsliste (F-07) nicht ausgeführt, weil es ins Repository schreibt; Schritt-Bilder nicht neu erzeugt.

GEMEINSAME DATEIEN
- Token-Lücke `-left-[37px]` (anfrage-formular.tsx Z. 456), bleibt wie gemeldet.
- Werkzeug-Nebenwirkung: werte-suche.mjs hat /home/user/schluesselmacher24/_werkstatt/protokolle/werte-suche-2026-10-16_11-50-15.json im Repository angelegt. Nicht gelöscht; Entscheidung beim Orchestrator.
- Scroll-Ausnahme (L-03) und Import scrollVerhalten bleiben aus Runde 2 unverändert.
- Keine neuen Ausnahmen für den Logikwächter beantragt (keine neuen Ausdrücke).
- Fremder Befund: Der Fuß zeigt auf dem Entwicklungsserver den Redaktionshinweis zu Firmendaten (Entwicklungsmodus, D-016), nicht Teil dieses Pakets.

BILDBELEGE
- Ordner: /root/sm24-bilder/E5-BAUMEISTER-22-runde3/ (neuer Ordner, Runde 2 und frühere Ausgaben bleiben liegen).
- /root/sm24-bilder/E5-BAUMEISTER-22-runde3/schluessel-nach-vorlage-anfrage__mobil__ganz.jpg
- /root/sm24-bilder/E5-BAUMEISTER-22-runde3/schluessel-nach-vorlage-anfrage__tablet__ganz.jpg
- /root/sm24-bilder/E5-BAUMEISTER-22-runde3/schluessel-nach-vorlage-anfrage__desktop__ganz.jpg
- Protokolle: tsc.txt, eslint.txt, vitest.txt, werte-suche.txt, seite.html, bild-*.json im selben Ordner.
- Erfolgsansicht: kein Bild (nicht erreichbar ohne Absenden).

OFFENE FRAGEN
1. MUSS Fach-Icon im Arbeitskopf: Entscheidung des Orchestrators nötig. Optionen:
   (a) page-header.tsx zeigt das Bereichs-Icon bei art="arbeit" mit bereich. Gemeinsame Datei; wirkt auf alle Arbeitsköpfe mit bereich; Test page-header.test.tsx Z. 38–43 braucht eine Alt-Neu-Liste.
   (b) Paket ändern: Arbeitskopf ohne Fach-Icon. Begründung: Die Muster Assistent (autoschluessel/anfrage/page.tsx Z. 84–90) und Kasse (kasse/page.tsx Z. 40–44) haben kein bereich und kein Icon; die Paketbehauptung dazu stimmt nicht.
   (c) Fach-Icon im children-Slot des Kopfes in page.tsx (Muster sicherheitstechnik/sicherheitscheck/page.tsx Z. 42–70). Umsetzbar in meiner Datei, weicht aber vom Muster Assistent und Kasse ab.
2. Erfolgsansicht: Soll sie als nicht belegt abgenommen werden, oder darf ein Testaufbau ohne Absenden (Mock der Antwort) freigegeben werden?
3. Feldfehler Vorname, Nachname, Telefon, Land: Sollen benannte Logikwächter-Ausnahmen für `error={...}` je Feld freigegeben werden? Ohne Freigabe bleibt es offen.
4. Desktop-Leerfläche: Die Breite ist teilweise behoben (max-w-3xl). Soll eine Seitenspalte oder ein Zwölfer-Raster in den Schritten folgen? Das wäre eine Layout-Entscheidung mit neuer Struktur.
5. werte-suche-Protokoll im Repository (_werkstatt/protokolle/werte-suche-2026-10-16_11-50-15.json): Soll es entfernt werden? Ich habe nicht gelöscht.

## Offene Fragen

- MUSS, nicht behoben, Paketwiderspruch (Entscheidung Orchestrator): Fach-Icon im Arbeitskopf. `page.tsx` setzt `art="arbeit"` mit `bereich`, `page-header.tsx` Z. 49–54 zeigt das Icon nur bei `art="erzaehl"`, `page-header.test.tsx` Z. 38–43 schreibt das fest. Die Behauptung des Pakets, die Muster Assistent und Kasse hätten ein Fach-Icon im Kopf, trifft nicht zu: `autoschluessel/anfrage/page.tsx` (Z. 84–90) und `kasse/page.tsx` (Z. 40–44) setzen kein `bereich` und zeigen kein Icon. Optionen: (a) `page-header.tsx` zeigt das Bereichs-Icon auch bei `art="arbeit"` mit `bereich` (gemeinsame Datei, nicht mein Recht; wirkt auf alle Arbeitsköpfe mit `bereich`, die Test-Erwartung Z. 38–43 muss mit Alt-Neu-Liste geändert werden); (b) Paket ändern: Arbeitskopf ohne Fach-Icon, wie Assistent und Kasse; (c) Muster `sicherheitstechnik/sicherheitscheck/page.tsx` Z. 42–70: Fach-Icon in `children` des Kopfes in `page.tsx` (`IconSicherheitscheck`-Muster, Schriftfeld »Ablauf«). Option (c) ist in meiner Datei umsetzbar, bringt aber eine Abweichung zum Muster Assistent und Kasse. Ich setze bis zur Entscheidung nichts davon um.
- Soll, nicht belegt: Erfolgsansicht (CheckDraw, Vorgangsnummer in Mono, Schriftfeld »Ihre Angaben«). Ein Bild dieser Ansicht gibt es nicht, weil sie erst nach dem Absenden erscheint; ein Absenden ist verboten. Belegt ist nur die Code-Prüfung (anfrage-formular.tsx Z. 388–467). Frage: Soll ein Testaufbau ohne Absenden (Mock der Antwort) freigegeben werden, oder wird die Ansicht als nicht belegt abgenommen?
- Soll, offene Frage (Feldfehler): Vorname, Nachname, Telefon und Land zeigen keinen Feldfehler (`Field error=`). Das würde neue JSX-Ausdrücke brauchen, die der Logikwächter Teil B meldet. Sie wurden deshalb nicht eingebaut. Frage: Soll der Orchestrator benannte Ausnahmen dafür freigeben (Ausdruck `error={...}` je Feld, Zweck: Anzeige eines bestehenden Prüfergebnisses), oder bleibt es offen?
- Soll, teilweise: Desktop-Leerfläche. Die Formularspalte war `max-w-2xl`; ich habe die fünf Schrittwrapper (Hersteller, Nummern, Stückzahl, Kontakt, Fotoschritt) auf `max-w-3xl` gesetzt. Rechts bleibt auf 1440 px weiterhin rund ein Viertel der Breite leer (Bild desktop-Runde 3). Ein voller Ausgleich braucht eine Layout-Entscheidung (Seitenspalte mit Schriftfeld oder Zwölfer-Raster in den Schritten). Das fügt Struktur hinzu, deshalb nicht umgesetzt; Entscheidung Orchestrator.
- Hinweis, fremde Datei: Auf dem Entwicklungsserver zeigt der Fuß den Redaktionshinweis »Firmendaten sind noch Platzhalter« (Entwicklungsmodus, D-016). Nicht mein Bereich; Bilder zeigen ihn, weil Port 3001 im Entwicklungsmodus läuft.
