# E6-BEFUND2-H05 · Bericht des Baumeisters und Urteil der Prüfstufe A

- Runden: 3 · Urteil letzte Runde: nicht bestanden
- Hinweis: Der Entwicklungsserver (Port 3001) war während des Baus abgestürzt (Turbopack-Panik); Bildbelege fehlten deshalb. Bildprüfung und Abnahme: `_werkstatt/berichte/E6-BEFUND2-welle2-abnahme.md` (D-048).

## Befunde der letzten Prüfrunde
- **muss:** Prüfblocker, kein Paketfehler: Die Bildprüfung (Schritt 5) fehlt. Port 3001 antwortet nicht (curl liefert 000, mehrfach geprüft, kein Dev-Server-Prozess). Laut Vorgabe nicht selbst gestartet; Port 3000 ist ein älterer Build und wurde nicht verwendet. Es entstanden keine Bilder unter /root/sm24-bilder/E6-BEFUND2-H05-pruefung-r3. Ohne Bilder fehlen die Belege für Sprungleiste, Kopfgrafik, Einzelbilder mit Zeitfenster, Ausschnitt mobil und die Gegenproben.
- **soll:** Logikwächter nicht ausgeführt: `pruefen` meldet für alle vier Dateien „Datei ist nicht im Protokoll. Erst sichern ausführen“. `sichern` schreibt in _werkstatt/protokolle im Repository, das ich nicht verändere. Ersatz: Diff vollständig manuell gelesen, keine Logik-, Daten- oder Propsänderung gefunden. Der Orchestrator sollte `sichern` auf der Basis d4a1d47 ausführen und danach `pruefen` nachholen.
- **soll:** Hinweislinie „Am Schlüsselkopf“ (code-fundstelle.tsx Z. 120, Pfad M128 190V238) läuft durch die Kopffläche, die bis y 224 reicht. Ob sie den Kopf schneidet oder stört, ist nur im Bild zu entscheiden; ungeprüft.
- **soll:** Tablet 640 bis 1023 px: Der Ausschnitt greift erst unter 640 px (globals.css, Media-Query max-width 639.98px). Dort zeigt sich die volle Zeichnung, und die Beschriftung misst je nach Spaltenbreite rechnerisch etwa 8 bis 11 px. Das Paket nennt nur Telefonbreiten. Nicht gemessen.
- **soll:** Sprungleiste (shop-liste.tsx Z. 323) nutzt `snap-x`. Das KERN-Muster für horizontale Leisten nennt `snap-x snap-mandatory`. Das Paket (U4c) schreibt `snap-x` vor; KERN gilt vorrangig. Abweichung begründen oder anpassen.
- **hinweis:** Pfeil in der Zeile (shop-liste.tsx Z. 392): Das Paket sagt „Pfeil unverändert“, der Code folgt aber KERN 1.14 (Ruhe text-foreground-muted, group-focus-visible:text-primary). KERN gilt; die Abweichung vom Paketwortlaut sollte im Bericht stehen.
- **hinweis:** Gruppen-Schaltfläche „Alle n anzeigen“ (shop-liste.tsx Z. 421): Der Inhalt steht zusätzlich in `<span className="min-w-0">`. Das Paket nennt diesen Wrapper nicht. Harmlos, aber im Bericht als Abweichung nennen.
- **hinweis:** werte-suche: Zwei Treffer (rgb(, oklch() in code-fundstelle.test.tsx Z. 23 bis 24 sind Bestandszeilen außerhalb des Diffs und als Bildinhalt-Ausnahme gelistet. Keine neuen Funde.

## Bericht des Baumeisters (letzte Fassung)

Test
