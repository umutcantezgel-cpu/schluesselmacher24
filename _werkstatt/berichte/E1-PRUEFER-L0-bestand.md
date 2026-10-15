## Prüfbericht E1-PRUEFER-L0-bestand (Blickwinkel: Bestandsschutz)

**BEFUNDE**

1. **hoch** · Unantastbar / E4 W3–W4 · „Nur Darstellung“ für Kasse, Warenkorb und Bestellung stimmt nicht. `kasse/kasse-formular.tsx:61` (`pruefen`), `:246` (`absenden`), `:283` (`submitOrder`), `:310` (Redirect mit Zugangstoken). `warenkorb/warenkorb-ansicht.tsx:105-109` (useEffect setzt Versandart). `bestellung/[id]/page.tsx:141-149` (`verifyAccessToken`, `notFound`), `:153` (`connection()`). **Vorschlag:** Logik-Inventar je Datei in den Plan, Zugriffsprüfung der Bestellseite ausdrücklich unantastbar nennen.

2. **hoch** · Unantastbar / E4 W4, E5 · Weitere Logik ist nicht geschützt. `autoschluessel/anfrage/assistent.tsx` (`isStepComplete` :374, `buildUploads` :571, `handleSubmit` :710). `schliessanlagen/konfigurator/projekt-konfigurator.tsx` (`recommend` :344, `validateStep` :396, `updateDoor` :861, `handleSubmit` :895). `rechtliches/cookie-einstellungen/cookie-einstellungen.tsx` (`STORAGE_KEY` :10, `save` :73, `clearAll` :85). **Vorschlag:** In die Schutzliste aufnehmen.

3. **hoch** · E0 / Prüfung · Kein Test deckt die geschützten Abläufe. Unter den 38 Testdateien gibt es keine für `kasse/`, `warenkorb/`, `bestellung/`, `rechtliches/`, Assistent oder Konfigurator. Der Store `src/lib/store/cart.ts:133` (persist-Name `sm24-warenkorb`, version 1) hat keinen Test. **Vorschlag:** In E0 Charakterisierungstests anlegen: Store-Persistenz, Textextrakt der Rechtsseiten, 404 bei falschem Token.

4. **mittel** · K-008 · Widerspruch. K-008 verlangt Glyphen „ohne Zweiton“. `components/visual/icons/icons.test.tsx:223` verlangt für jedes Fach-Icon eine `fill-area`-Fläche ohne Kontur. Neue UI-Glyphen würden entweder rot, oder der Test müsste gelockert werden, was der Plan verbietet. **Vorschlag:** K-008 präzisieren, etwa Zweitonfläche erlaubt oder eine dokumentierte Ausnahmeliste im Test per Opus.

5. **mittel** · Tests „nie lockern“ · Exakte Markup-Asserts, die geplante Pakete treffen: `calculator/rechner.test.tsx:43` (`text-[14px]`), `:76` (`legend class="text-sm …"`); `visual/bereich-icon.test.tsx:43`; `visual/motion/reveal.test.tsx:19,45` (exakt `<div class="sm24-reveal">x</div>`); `draw-on.test.tsx:51,90-91`; `check-draw.test.tsx:60`; `vertrauen/nachweise-liste.test.tsx:26,30,44`; `generators/schluessel.test.tsx:36,55`; `generators/schliessplan.test.tsx:86`. **Vorschlag:** Teständerung nur mit Alt-Neu-Liste im Paket; Zahl der Assertions darf nicht sinken; Reveal bekommt kein neues Attribut.

6. **mittel** · K-005 / Rechtstexte · Die Rechtsseiten lesen Settings. `datenschutz/page.tsx:12,82-85` (`retentionDays`), `versand-und-zahlung/page.tsx:13,36,79-81,89` (Versand, Anzahlung, `leadTimeDays`), `impressum/page.tsx:11` (`company`). **Vorschlag:** Für `rechtliches/*` einen Textknoten-Vergleich vor und nach dem Umbau mit Testdaten aus Settings als Pflichtprüfung. Platzhalter wie `agb/page.tsx:48,79` bleiben wortgleich.

7. **mittel** · Schutzregel (Auftrag 1) · Markup und Logik sind verflochten: 13 `onChange` in `kasse`, rund 18 in `assistent`, rund 40 in `projekt-konfigurator`; Berechnung im JSX (`projekt-konfigurator.tsx:1401` map, `:1697` reduce). **Vorschlag, prüfbar:** Der Diff je Datei darf nur `className`-Strings, Wrapper-Elemente, Icon-Importe und JSX-Textknoten ändern. Unverändert bleiben alle Hooks (`useState`, `useMemo`, `useEffect`, `useCartStore`, `useFlow`, `useHydrated`), alle Funktionen außerhalb der Komponente, Handler-Namen, Aufrufe von `submit*`, `fetch*`, `uploadsAbwarten`, sowie `notFound()` und `connection()`. Kontrolle als grep-Vergleich der Token vor und nach dem Paket.

8. **mittel** · CSS-Namen · Umbenennung wirkt breit. `.shell` (15 Dateien), `.eyebrow` (3), `.section`, `.prose-sm24` (`rechtliches/layout.tsx:38` und 4 Seiten), definiert in `globals.css:125,136,145,150`. `data-area` in `area-scope.tsx:12`, `tailwind.config.ts:125`, `globals.css:9`. `data-motion` in `in-view.tsx:48`, `globals.css:206,266`. `sm24-warenkorb` ist ein localStorage-Schlüssel und darf nicht umbenannt werden. `sm24-float` steht nur in `globals.css:255-256` und `visual/README.md:166`; die README-Anpassung fehlt im Plan.

9. **niedrig** · Pfade · `payload/components/Marke.tsx` heißt `src/payload/components/Marke.tsx`. `icon.svg` liegt unter `src/app/(site)/icon.svg`. `area-theme.test.ts` liegt unter `src/lib/visual/`.

10. **niedrig** · Funktionsliste · Sitemap, robots, llms.txt und JSON-LD (`src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt`, `src/components/seo/json-ld.tsx`) haben keinen Test.

**BESTAND (Auftrag 3, nach E0 je einmal durchlaufen)**
- `/warenkorb`: Menge, Entfernen, Versandart-Vorwahl, Summe.
- `/kasse`: Pflichtfelder, zwei Bestätigungen, `submitOrder`, Redirect auf `/bestellung/[id]?t=`.
- `/bestellung/[id]`: gültiger Token zeigt Vorgang, falscher Token ergibt 404.
- `/autoschluessel/anfrage`: Schritte, Uploads, Termin-Slots, Absenden, Bestätigung.
- `/gleichschliessende-zylinder/konfigurator`, `/schliessanlagen/konfigurator`: Summe, Absenden, Referenz.
- `/service-und-termin/terminstatus`: Nummer und E-Mail ergeben den Status.
- `/rechtliches/cookie-einstellungen`: speichern und löschen.
- `useFlow` (`lib/flow/use-flow.ts:64`, Präfix `sm24:flow:`): Stand nach Neuladen.
- Sitemap, robots, llms.txt, JSON-LD: nach `next start` abrufen und vor und nach dem Umbau zählen.

**OFFENE FRAGEN**
- Gilt die Schutzregel auch für Konfiguratoren, Assistent und Cookie-Seite? Der Plan nennt nur Kasse, Warenkorb und Bestellung.
- Darf `pruefen` (`kasse-formular.tsx:61`, nicht exportiert) für einen Test exportiert werden? Der Export ändert keine Logik, berührt aber evtl. die Regel.
- Sollen UI-Glyphen eine Zweitonfläche haben (Befund 4)?
- Reicht ein Textvergleich für `rechtliches/*`, oder sind Mikrotext-Änderungen dort ganz auszuschließen?

=== ENDE E1-PRUEFER-L0-bestand · BEREIT ZUR RÜCKGABE ===