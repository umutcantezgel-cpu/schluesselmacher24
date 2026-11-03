# Belege zur Leistungsdiagnose mobil (E5-PRUEFER-02)

Zusammenfassung: `leistung-diagnose-2026-11-03_13-43-43.json`. Rohberichte und Traces liegen in `protokolle/roh/E5-PRUEFER-02/` (nicht committet).

## Ressourcen vor dem beobachteten LCP (Medianlauf)

Schriften und Skripte, deren Übertragung im beobachteten Lauf vor dem ersten Darstellen des LCP-Textes endet. Übertragungsgröße aus dem Lighthouse-Bericht desselben Laufs.

| Ansicht | LCP beobachtet (ms) | LCP simuliert (ms) | Schriften (Anzahl, KiB) | Skripte (Anzahl, KiB) | Dokument (KiB) | Summe vor LCP (KiB) |
|---|---|---|---|---|---|---|
| H01-start | 212 | 2670 | 1, 45,5 | 13, 192,0 | 73,5 | 311,0 |
| H02-autoschluessel | 247 | 3010 | 5, 123,3 | 7, 140,6 | 70,5 | 334,4 |
| H03-modell-golf | 226 | 2960 | 4, 92,2 | 13, 189,4 | 62,7 | 344,2 |
| H04-autoschluessel-anfrage | 235 | 3151 | 2, 60,9 | 17, 240,7 | 61,1 | 362,7 |
| H05-code | 252 | 3430 | 4, 92,2 | 14, 201,3 | 63,7 | 357,3 |
| H06-code-produkt | 1267 | 3633 | 4, 92,2 | 16, 225,6 | 59,1 | 376,9 |
| H07-foto | 215 | 2953 | 4, 92,2 | 13, 190,9 | 62,8 | 345,9 |
| H08-einschicken | 179 | 3207 | 3, 76,1 | 13, 185,6 | 51,5 | 313,2 |
| H09-sperrschliessung-konfigurator | 206 | 2663 | 1, 45,5 | 15, 213,4 | 51,7 | 310,6 |
| H10-schliessanlagen | 256 | 3597 | 4, 92,2 | 14, 201,7 | 75,5 | 369,4 |
| H11-schliessanlagen-konfigurator | 1246 | 3880 | 3, 76,1 | 18, 239,3 | 48,0 | 363,4 |
| H12-partner-werden | 232 | 3609 | 3, 76,1 | 17, 230,0 | 51,2 | 357,2 |
| H13-kasse | 160 | 2646 | 1, 45,5 | 13, 190,5 | 54,8 | 290,8 |
| H14-ratgeber-messen | 199 | 2970 | 4, 92,2 | 13, 190,4 | 51,1 | 333,7 |

Spanne der Summe vor dem LCP: 291 bis 377 KiB. Im Drosselungsmodell (1 638,4 kbit/s) entspricht 1 KiB etwa 5 ms Übertragungszeit.

## Gegenprobe mit echter Drosselung (Lighthouse devtools, nicht Teil der Budgetwerte)

Gleiche Attrappen, gleiche Seiten, Drosselung 150 ms Netzlatenz, 1 638,4 kbit/s, CPU 4-fach über den Chrome-Modus devtools. Nur zwei Läufe je Ansicht, daher nur als Hinweis zu lesen.

| Ansicht | Lauf | Leistung | LCP (ms) | FCP (ms) | TBT (ms) | Roh-Datei |
|---|---|---|---|---|---|---|
| H01-start | 1 | 95 | 1189 | 1189 | 244 | gegenprobe-gegen---lauf1.lhr.json |
| H01-start | 2 | 97 | 1173 | 1173 | 205 | gegenprobe-gegen---lauf2.lhr.json |
| H05-code | 1 | 95 | 1172 | 1172 | 268 | gegenprobe-gegen--schluessel-nach-code-lauf1.lhr.json |
| H05-code | 2 | 95 | 1102 | 1102 | 246 | gegenprobe-gegen--schluessel-nach-code-lauf2.lhr.json |
| H04-autoschluessel-anfrage | 1 | 94 | 1039 | 1039 | 299 | gegenprobe-gegen--autoschluessel-anfrage-lauf1.lhr.json |
| H04-autoschluessel-anfrage | 2 | 95 | 1053 | 1053 | 248 | gegenprobe-gegen--autoschluessel-anfrage-lauf2.lhr.json |

Simulierter LCP des Medianlaufs (Zusammenfassung): H01 2 670 ms, H04 3 151 ms, H05 3 430 ms.

## Hinweise zur Lesart

- Der LCP-Text wird im Trace der Gegenprobe (H01, Lauf 1) bei 1 189 ms gezeichnet, zusammen mit der ersten Darstellung. Die Webschriften enden danach (ab 2 020 ms), der Text wartet nicht auf sie (font-display swap).

- Der simulierte LCP ist laut Lighthouse-Quelltext (`lantern` LargestContentfulPaint) der späteste Endzeitpunkt aller Netzanfragen außer Bildern mit niedriger Priorität und CPU-Aufgaben, die vor dem beobachteten LCP enden.

- Dokumentaufbau Startseite (curl mit gzip, `gzip -9` als Schätzung): Dokument 452 769 Byte, übertragen rund 74 KB; RSC-Nutzlast 253 395 Byte roh (rund 40 KB übertragen); Inline-CSS 81 689 Byte roh (rund 15 KB übertragen).

