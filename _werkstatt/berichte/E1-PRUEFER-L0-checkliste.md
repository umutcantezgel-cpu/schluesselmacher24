## BEFUNDE

1. **hoch** · Prüfung und Abnahme (Z-01 bis Z-10) · Die zehn Kriterien stehen nirgends im Plan. Z.159 und Z.242 verweisen nur auf ABNAHME.md, das es noch nicht gibt. Im Repo und in den E0-Berichten (`scratchpad/e0`) findet sich kein „Z-0“. Vorschlag: Die Kriterien mit Beleg und Schwelle in den Plan übernehmen. Zuordnung: Plan → E1, Bestand → E0-Gates, Designsystem → L-01, Gestaltung → E2 bis E4, Bewegung → L-02/E6, Grafik → L-03/E5, Zugänglichkeit → L-02/L-05/B-01.

2. **hoch** · Leistung (Kriterium 8) · Kein Paket. Das Messwerkzeug taucht nur in E0 auf (Z.150). Die Begrenzung von `sm24-dash` (Z.116), die Schriftladung und die Bildauslieferung haben keinen Eigentümer. Vorschlag: Ein LEITUNG-Paket „Leistungsbudget“ in E3 aufnehmen, mit Messpflicht je Welle.

3. **hoch** · K-008 gegen Icon-Vertrag · Z.117 verlangt UI-Glyphen „ohne Zweiton“ im Ordner der Fach-Icons. `src/components/visual/icons/icons.test.tsx:170` verlangt, dass jede Datei dieses Ordners in `ICONS` steht. `:223` verlangt für jedes Icon eine `fill-area`-Fläche. Folge: Jeder UI-Glyph scheitert, und jedes Glyphen-Paket muss die Opus-only-Datei ändern. Dadurch kollidieren E2 GRAFIKER-01 und -02 an derselben Datei. Vorschlag: UI-Glyphen in einen eigenen Ordner mit eigenem Vertrag legen, oder L-03 ändert den Vertrag vorab.

4. **hoch** · E5 (Z.211 bis 217) · Keine Wellenzuordnung, keine Dateilisten, keine Rolle je Paket. Z.135 verlangt exakte Dateilisten, die in PLAN.md entstehen sollen. Ohne sie ist die Kollisionsfreiheit nicht prüfbar. Vorschlag: E1 legt je Paket Welle, Dateiliste und Modell fest.

5. **hoch** · Zuordnung (Prüfung 5) · Sieben Leistungsseiten fehlen im Plan: `src/app/(site)/autoschluessel/{fahrzeugoeffnung,funkschluessel,kopieren,programmieren,nachmachen,schluesselbart-fraesen,smart-key}/page.tsx`. B-03 (Z.184) nennt sie nur als Vorlage. `components/autoschluessel/service-article.tsx` wird genau von diesen sieben importiert. Vorschlag: ein eigenes Paket „Leistungsseiten“ in E4 oder E5.

6. **mittel** · Zuordnung · Unklar zugeordnet, alle drei mit lucide-react: `autoschluessel/marken/page.tsx` (nur über „3 Dateien“, Z.196), `autoschluessel/anfrage/page.tsx` (nur assistent.tsx in W4), `sicherheitstechnik/[slug]/page.tsx` (nur „Bereichsseiten“). Ohne lucide nicht zugeordnet: `src/app/(site)/layout.tsx` (Skip-Link bei Z.77, Shell; kein Eigentümer) und `src/app/(site)/kasse/kasse-formular.tsx` (von kasse/page.tsx importiert).

7. **mittel** · E3 Welle 1 · Kein gemeinsamer Dateiname, aber API-Abhängigkeiten innerhalb derselben Welle. service-article (B-03) nutzt info-tip, accordion, badge (B-01) und breadcrumbs (B-02). preis-anzeige und bestaetigung (B-04) nutzen info-tip, badge und summary-list. option-card (B-01) steckt in tuer-absicherung-rechner, den rechner.test.tsx (B-04) rendert. Vorschlag: B-01 und B-02 vor B-03 und B-04 abschließen, oder Props-Verträge einfrieren.

8. **mittel** · Grafik · Registrierung · `visual/registry.tsx` wird nur von `ui/image-placeholder.tsx` importiert. Keine Seite nutzt Generatoren direkt. Der Generator `tuer-schutz` (W3) braucht einen Registry-Eintrag, den nur Opus schreiben darf (Z.135). Vorschlag: Eintrag als Opus-Schritt vor das Grafiker-Paket setzen.

9. **mittel** · PageHeader (Z.187) · Der Plan nennt ihn „neu“. `layout/page-header.tsx` existiert bereits und wird von 35 Seiten importiert. Vorschlag: als Erweiterung mit Regressionsprüfung dieser 35 Seiten formulieren.

10. **mittel** · Übergabe (Z-Kriterium 10) · README und UMSETZUNG.md stehen nur in E6, also in der Kür (Z.226). Vorschlag: als Pflichtpaket in E5 oder ABSCHLUSS.

11. **mittel** · B-01/B-02/L-05 · Keine Pflichttests für geänderte Bausteine. Für option-card, field, alert, flow-shell, mobile-action-bar, button und page-header existiert keine Testdatei. Vorschlag: je Paket einen Verhaltenstest vorschreiben, etwa `focus-within` und `scaleX`.

12. **niedrig** · Lagebild Z.35 und Z.43 · `[Hersteller eintragen]` steht nicht in `schluessel-nach-code/[slug]/page.tsx:54`, dort steht nur `line.manufacturer`. Die Quelle ist `src/lib/data/defaults/code-lines.ts:179` und `content/code-lines.json` (Z.6, 66, 126). Die Fundstelle muss korrigiert werden.

13. **niedrig** · Lagebild Z.33 · `text-[11|13|14|15px]` kommt 539 Mal in src vor, nicht „rund 470“. Vorschlag: Zählweise angeben.

Bestätigt: 48 page.tsx (Glob), 62 lucide-Dateien, 60 lucide-Glyphen (mehrzeilige Imports berücksichtigt), kein `focus` in option-card.tsx, Hover-Schatten bei page.tsx:301, `transition-[width]` bei flow-shell.tsx:60, smooth scroll bei use-flow.ts:153, `sm24-float` und `fade-in` ungenutzt.

## OFFENE FRAGEN

- Ist `<ViewTransition>` in React 19.2.4 stabil verfügbar, oder braucht Next 16 `experimental.viewTransition`? `next.config.ts` hat keine Flags, und `node_modules` fehlt. Die Doku ist nicht prüfbar.
- Deckt die Zuordnungstabelle alle 60 lucide-Glyphen mit etwa 36 neuen UI-Glyphen und den Fach-Icons ab?
- Gehört `autoschluessel/anfrage/page.tsx` zum Paket „Assistent“ (W4)?
- Sind `marken/page.tsx` und `sicherheitstechnik/[slug]` gemeint?

=== ENDE E1-PRUEFER-L0-checkliste · BEREIT ZUR RÜCKGABE ===