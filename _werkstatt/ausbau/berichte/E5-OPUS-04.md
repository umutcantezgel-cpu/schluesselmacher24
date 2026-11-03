# E5-OPUS-04 · Leistungsbudgets (Teil E5)

Paket der Etappe E5, Welle 3 (Opus, Klasse M). Anforderungen EL-33, G-06; Kriterien Z-15, Z-16. Grundlage: Diagnose E5-PRUEFER-02. Commits aac4204 (Brotkrumen „Startseite“, SEO), a4878d5 (zod ohne eval-Versuch), 591769a (zod aus dem Browser, kein Vorladen des Versandkosten-Links).

## Ergebnis
- SEO 100 auf den gemessenen Ansichten (vorher 92 auf zwölf von vierzehn): Brotkrumen und BreadcrumbList mit „Startseite“.
- Best Practices 100 auf beiden Konfiguratoren und dem Assistenten: zod 4 versuchte im Browser `new Function`, die CSP ohne `unsafe-eval` meldete das als Verstoß (vorher 96). Die Link-Prüfung des Kerns läuft jetzt mit kleinen Prüffunktionen ohne zod; im Browser fallen rund 34 KiB weg, davon waren vier Fünftel ungenutzt.
- Der Link „Versandkosten“ im Preishinweis lädt nicht mehr vor; das Vorladen kostete im ersten Bildschirm rund 23 KiB vor dem größten Element.
- Lighthouse mobil (ein Lauf je Ansicht, nach den Änderungen): Start 94 (LCP 2,82 s), Sperrschließungs-Konfigurator 92 (vorher 87, LCP 3,75 auf 3,17 s), Assistent 90 (vorher 86, LCP 4,00 auf 3,18 s), Schließplan-Planer 94 (LCP 3,01 s); Barrierefreiheit, Best Practices und SEO je 100.

## Prüfung
- Typprüfung und Lint sauber, Unit 2050 von 2050, Build 226 Seiten, keine CSP-Verstöße auf Start, beiden Konfiguratoren und Assistent (Playwright, `securitypolicyviolation`).
- Protokolle: Lighthouse-Läufe im Arbeitsordner der Sitzung; Werte oben.

## Offen
- LCP mobil in der Lighthouse-Simulation über 2,5 s (2,8 bis 3,2 s). Die Diagnose E5-PRUEFER-02 maß mit echter Drosselung 1,0 bis 1,2 s; die Simulation rechnet alle Ressourcen ein, die bis zum beobachteten größten Element fertig werden. Hebel nach Wirkung: ungenutzter Code der Kopf- und Leistenbündel, Schriften vor dem ersten Bild, Dokumentgewicht (RSC-Nutzlast mit Inline-SVG), Polyfills (Zielbrowser: Inhaber). Neues Paket E9-OPUS-05; Messmodell A-032.
