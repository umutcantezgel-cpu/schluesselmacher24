# E6-PRUEFER-C · Messfenster B · Nachlese und Auswertung (Teil 4)

Stand 2026-10-17. Nicht neu gemessen. Der Prüfer hat die Mediane aus den Einzelläufen selbst nachgerechnet; alle Mediane stimmen mit den gedruckten Protokollzeilen überein.

## Quellen
- Jetzt, beide Profile: `_werkstatt/protokolle/E6-PRUEFER-C-messung.log` mit `_werkstatt/protokolle/messung-2026-10-17_16-46-12.json` (Zeitstempel 2026-10-17T14:46:12Z, 3 Läufe je Ansicht und Profil).
- E0 heute, mobil: `_werkstatt/protokolle/E6-PRUEFER-C-messung-e0.log` mit `_werkstatt/protokolle/messung-2026-10-17_16-50-26.json` (Zeitstempel 2026-10-17T14:50:26Z, Port 3100).
- E5 mobil (nur Vergleich, gedruckte Mediane): `_werkstatt/protokolle/E5-PRUEFER-B-messung.log`, JSON `messung-2026-10-16_21-13-28.json`.
- Budgets K-011 (`_werkstatt/KERN.md`): LCP ≤ 2500 ms, CLS ≤ 0,1, INP ≤ 200 ms, je am Median.
- Z-08 (`_werkstatt/ABNAHME.md`, K-011): keine Hauptansicht schlechter als E0 heute um mehr als die Spanne der drei E0-Läufe.

## Methode
- Median = Median von 3 Einzelläufen (`serien[].laeufe[]`, Felder `lcp`, `cls`, `inp`, `jsKB`).
- E0-Spanne = Maximum minus Minimum der 3 E0-Läufe je Ansicht und Wert.
- Z-08 je Ansicht und Wert: Verschlechterung = Median jetzt minus Median E0 heute. Erfüllt, wenn die Verschlechterung höchstens die E0-Spanne beträgt. Verbesserungen erfüllen. Angewandt auf LCP, CLS und INP (Budgetwerte). JS-KB ist nur informativ.
- Die E0-Läufe liegen nur mobil vor. Z-08 für Desktop ist nicht bewertbar.

## Zeitbezug
- Die Messung „jetzt“ ist vor 14:46 UTC gelaufen. Nach Aktenlage war der Messstand der Build aus `_werkstatt/protokolle/E6-PRUEFER-C-build.log` (13:54 UTC, 208/208). Das Messprotokoll nennt keinen Build-Stand; das ist eine Ableitung aus den Zeitstempeln.
- Der heutige Build auf Port 3000 (`.next/BUILD_ID` = `mJcKPvGMRy5iL1fttdhAu`, geändert 2026-10-17 22:25:20 UTC) ist jünger als beide Läufe. Die Zahlen betreffen also nicht den Stand von 2cdcbab, sondern den Stand vor 2cdcbab.
- INP-Werte sind alle Vielfache von 8 ms (Werkzeugauflösung). Die E0-Spannen sind bei INP deshalb oft 0 bis 16 ms, und Z-08 ist bei INP entsprechend streng.

## Tabelle 1 · Jetzt (2026-10-17 14:46 UTC), Median [Einzelläufe], beide Profile
| Ansicht | Profil | LCP ms | CLS | INP ms | JS-KB | LCP ≤2500 | CLS ≤0,1 | INP ≤200 |
|---|---|---|---|---|---|---|---|---|
| H01-start | mobil | 1112 [1072 / 1128 / 1112] | 0,000 [0,000 / 0,000 / 0,000] | 160 [160 / 192 / 160] | 231,1 [231,1 / 215,4 / 231,1] | ja | ja | ja |
| H01-start | desktop | 172 [172 / 216 / 156] | 0,000 [0,000 / 0,000 / 0,000] | 48 [48 / 48 / 48] | 346,9 [346,9 / 346,9 / 346,9] | ja | ja | ja |
| H02-autoschluessel | mobil | 1104 [1144 / 1080 / 1104] | 0,000 [0,000 / 0,000 / 0,000] | 168 [192 / 144 / 168] | 217,5 [217,5 / 223,4 / 215,4] | ja | ja | ja |
| H02-autoschluessel | desktop | 172 [196 / 172 / 172] | 0,000 [0,000 / 0,000 / 0,000] | 32 [40 / 32 / 32] | 278,3 [278,3 / 278,3 / 278,3] | ja | ja | ja |
| H03-modell-golf | mobil | 1080 [1080 / 1100 / 1040] | 0,000 [0,000 / 0,000 / 0,000] | 160 [120 / 160 / 168] | 228,4 [228,4 / 235,8 / 228,4] | ja | ja | ja |
| H03-modell-golf | desktop | 180 [128 / 200 / 180] | 0,000 [0,000 / 0,000 / 0,000] | 56 [40 / 56 / 56] | 278,3 [278,3 / 278,3 / 278,3] | ja | ja | ja |
| H04-assistent | mobil | 968 [972 / 968 / 932] | 0,000 [0,000 / 0,000 / 0,000] | 96 [88 / 104 / 96] | 226,0 [226,0 / 226,0 / 226,0] | ja | ja | ja |
| H04-assistent | desktop | 128 [120 / 128 / 156] | 0,000 [0,000 / 0,000 / 0,000] | 40 [40 / 48 / 40] | 305,2 [305,2 / 305,2 / 305,2] | ja | ja | ja |
| H05-code-shop | mobil | 1056 [1056 / 1040 / 1160] | 0,000 [0,000 / 0,000 / 0,000] | 128 [128 / 144 / 112] | 236,0 [229,0 / 236,0 / 247,3] | ja | ja | ja |
| H05-code-shop | desktop | 148 [144 / 168 / 148] | 0,000 [0,000 / 0,000 / 0,000] | 32 [32 / 32 / 32] | 289,8 [289,8 / 289,8 / 289,8] | ja | ja | ja |
| H06-code-produkt | mobil | 1080 [1080 / 1136 / 1076] | 0,000 [0,000 / 0,000 / 0,000] | 160 [160 / 112 / 160] | 235,7 [237,6 / 235,7 / 233,5] | ja | ja | ja |
| H06-code-produkt | desktop | 132 [164 / 132 / 124] | 0,000 [0,000 / 0,000 / 0,000] | 48 [48 / 40 / 48] | 289,8 [289,8 / 289,8 / 289,8] | ja | ja | ja |
| H07-zylinder-konfigurator | mobil | 1028 [1068 / 1028 / 1000] | 0,000 [0,000 / 0,000 / 0,000] | 88 [72 / 88 / 96] | 219,1 [219,1 / 214,0 / 219,1] | ja | ja | ja |
| H07-zylinder-konfigurator | desktop | 144 [144 / 152 / 116] | 0,000 [0,000 / 0,000 / 0,000] | 48 [56 / 48 / 48] | 293,2 [293,2 / 293,2 / 293,2] | ja | ja | ja |
| H08-schliessanlagen | mobil | 1168 [1116 / 1172 / 1168] | 0,000 [0,000 / 0,000 / 0,000] | 168 [136 / 200 / 168] | 268,5 [268,5 / 265,2 / 272,6] | ja | ja | ja |
| H08-schliessanlagen | desktop | 164 [160 / 164 / 176] | 0,000 [0,000 / 0,000 / 0,000] | 40 [40 / 40 / 40] | 301,2 [301,2 / 301,2 / 301,2] | ja | ja | ja |
| H09-tuertechnik | mobil | 1108 [1108 / 1100 / 1136] | 0,000 [0,000 / 0,000 / 0,000] | 144 [192 / 136 / 144] | 226,3 [226,3 / 223,4 / 239,4] | ja | ja | ja |
| H09-tuertechnik | desktop | 164 [148 / 164 / 164] | 0,000 [0,000 / 0,000 / 0,000] | 32 [32 / 32 / 32] | 278,3 [278,3 / 278,3 / 278,3] | ja | ja | ja |
| H10-warenkorb | mobil | 984 [988 / 976 / 984] | 0,007 [0,007 / 0,007 / 0,007] | 104 [104 / 104 / 120] | 243,4 [245,6 / 243,4 / 238,3] | ja | ja | ja |
| H10-warenkorb | desktop | 120 [120 / 100 / 132] | 0,003 [0,003 / 0,003 / 0,003] | 48 [40 / 48 / 48] | 293,2 [293,2 / 293,2 / 293,2] | ja | ja | ja |
| H11-kasse | mobil | 984 [984 / 996 / 976] | 0,010 [0,010 / 0,010 / 0,010] | 112 [128 / 112 / 112] | 234,1 [234,1 / 234,1 / 241,4] | ja | ja | ja |
| H11-kasse | desktop | 124 [120 / 124 / 148] | 0,004 [0,004 / 0,004 / 0,004] | 40 [40 / 48 / 40] | 289,0 [289,0 / 289,0 / 289,0] | ja | ja | ja |
| H12-ratgeber | mobil | 1004 [1016 / 1000 / 1004] | 0,000 [0,000 / 0,000 / 0,000] | 128 [128 / 128 / 112] | 177,9 [177,9 / 177,9 / 185,2] | ja | ja | ja |
| H12-ratgeber | desktop | 144 [144 / 192 / 116] | 0,000 [0,000 / 0,000 / 0,000] | 40 [40 / 40 / 32] | 278,3 [278,3 / 278,3 / 278,3] | ja | ja | ja |

Die Spalte JS-KB ist die Summe aller Skript-Ressourcen. Das Bewegungscode-Budget (60 KB) wird nicht gemessen.

## Tabelle 2 · E0 heute, mobil, Median [Einzelläufe] (Spanne = max − min)
| Ansicht | LCP ms | Spanne | CLS | INP ms | Spanne | JS-KB | E0 Budget | E5 mobil LCP / INP / CLS / JS-KB (Median, Protokoll) |
|---|---|---|---|---|---|---|---|---|
| H01-start | 980 [1032 / 980 / 960] | 72 | 0,000 [0,000 / 0,000 / 0,000] | 72 [72 / 64 / 72] | 8 | 246,3 | eingehalten | 1072 / 168 / 0,000 / 300,0 |
| H02-autoschluessel | 984 [1012 / 984 / 976] | 36 | 0,000 [0,000 / 0,000 / 0,000] | 56 [56 / 56 / 48] | 8 | 219,1 | eingehalten | 1152 / 160 / 0,000 / 237,1 |
| H03-modell-golf | 944 [932 / 944 / 944] | 12 | 0,000 [0,000 / 0,000 / 0,000] | 64 [56 / 72 / 64] | 16 | 219,1 | eingehalten | 1052 / 136 / 0,000 / 240,9 |
| H04-assistent | 924 [916 / 924 / 928] | 12 | 0,000 [0,000 / 0,000 / 0,000] | 64 [64 / 64 / 64] | 0 | 227,0 | eingehalten | 996 / 96 / 0,000 / 242,5 |
| H05-code-shop | 1064 [1104 / 1064 / 1036] | 68 | 0,000 [0,000 / 0,000 / 0,000] | 64 [72 / 56 / 64] | 16 | 234,9 | eingehalten | 1100 / 144 / 0,000 / 252,3 |
| H06-code-produkt | 1032 [1032 / 1032 / 1020] | 12 | 0,000 [0,000 / 0,000 / 0,000] | 64 [64 / 56 / 72] | 16 | 234,9 | eingehalten | 1060 / 128 / 0,000 / 255,8 |
| H07-zylinder-konfigurator | 976 [984 / 976 / 956] | 28 | 0,000 [0,000 / 0,000 / 0,000] | 64 [64 / 48 / 64] | 16 | 210,0 | eingehalten | 1020 / 88 / 0,000 / 230,5 |
| H08-schliessanlagen | 988 [996 / 988 / 976] | 20 | 0,000 [0,000 / 0,000 / 0,000] | 56 [56 / 56 / 72] | 16 | 248,5 | eingehalten | 1052 / 136 / 0,000 / 262,8 |
| H09-tuertechnik | 1036 [1072 / 1032 / 1036] | 40 | 0,000 [0,000 / 0,000 / 0,000] | 64 [56 / 64 / 72] | 16 | 222,2 | eingehalten | 1020 / 128 / 0,000 / 247,9 |
| H10-warenkorb | 2668 [2668 / 2740 / 2660] | 80 | 0,117 [0,117 / 0,117 / 0,117] | 72 [88 / 56 / 72] | 32 | 231,0 | ÜBER: LCP, CLS | 968 / 96 / 0,000 / 262,0 |
| H11-kasse | 908 [904 / 908 / 920] | 16 | 0,104 [0,104 / 0,104 / 0,104] | 56 [56 / 56 / 56] | 0 | 217,0 | ÜBER: CLS | 956 / 80 / 0,007 / 239,9 |
| H12-ratgeber | 924 [932 / 920 / 924] | 12 | 0,000 [0,000 / 0,000 / 0,000] | 72 [72 / 48 / 72] | 24 | 212,6 | eingehalten | 976 / 88 / 0,000 / 244,9 |

## Tabelle 3 · Z-08 mobil (Verschlechterung = jetzt − E0 heute; erfüllt wenn ≤ E0-Spanne)
| Ansicht | Wert | jetzt | E0 heute | Differenz | E0-Spanne | Z-08 |
|---|---|---|---|---|---|---|
| H01-start | LCP ms | 1112 | 980 | +132 | 72 | NICHT erfüllt |
| H01-start | CLS | 0,000 | 0,000 | 0,000 | 0,000 | erfüllt |
| H01-start | INP ms | 160 | 72 | +88 | 8 | NICHT erfüllt |
| H02-autoschluessel | LCP ms | 1104 | 984 | +120 | 36 | NICHT erfüllt |
| H02-autoschluessel | CLS | 0,000 | 0,000 | 0,000 | 0,000 | erfüllt |
| H02-autoschluessel | INP ms | 168 | 56 | +112 | 8 | NICHT erfüllt |
| H03-modell-golf | LCP ms | 1080 | 944 | +136 | 12 | NICHT erfüllt |
| H03-modell-golf | CLS | 0,000 | 0,000 | 0,000 | 0,000 | erfüllt |
| H03-modell-golf | INP ms | 160 | 64 | +96 | 16 | NICHT erfüllt |
| H04-assistent | LCP ms | 968 | 924 | +44 | 12 | NICHT erfüllt |
| H04-assistent | CLS | 0,000 | 0,000 | 0,000 | 0,000 | erfüllt |
| H04-assistent | INP ms | 96 | 64 | +32 | 0 | NICHT erfüllt |
| H05-code-shop | LCP ms | 1056 | 1064 | -8 | 68 | erfüllt |
| H05-code-shop | CLS | 0,000 | 0,000 | 0,000 | 0,000 | erfüllt |
| H05-code-shop | INP ms | 128 | 64 | +64 | 16 | NICHT erfüllt |
| H06-code-produkt | LCP ms | 1080 | 1032 | +48 | 12 | NICHT erfüllt |
| H06-code-produkt | CLS | 0,000 | 0,000 | 0,000 | 0,000 | erfüllt |
| H06-code-produkt | INP ms | 160 | 64 | +96 | 16 | NICHT erfüllt |
| H07-zylinder-konfigurator | LCP ms | 1028 | 976 | +52 | 28 | NICHT erfüllt |
| H07-zylinder-konfigurator | CLS | 0,000 | 0,000 | 0,000 | 0,000 | erfüllt |
| H07-zylinder-konfigurator | INP ms | 88 | 64 | +24 | 16 | NICHT erfüllt |
| H08-schliessanlagen | LCP ms | 1168 | 988 | +180 | 20 | NICHT erfüllt |
| H08-schliessanlagen | CLS | 0,000 | 0,000 | 0,000 | 0,000 | erfüllt |
| H08-schliessanlagen | INP ms | 168 | 56 | +112 | 16 | NICHT erfüllt |
| H09-tuertechnik | LCP ms | 1108 | 1036 | +72 | 40 | NICHT erfüllt |
| H09-tuertechnik | CLS | 0,000 | 0,000 | 0,000 | 0,000 | erfüllt |
| H09-tuertechnik | INP ms | 144 | 64 | +80 | 16 | NICHT erfüllt |
| H10-warenkorb | LCP ms | 984 | 2668 | -1684 | 80 | erfüllt |
| H10-warenkorb | CLS | 0,007 | 0,117 | -0,110 | 0,000 | erfüllt |
| H10-warenkorb | INP ms | 104 | 72 | +32 | 32 | erfüllt |
| H11-kasse | LCP ms | 984 | 908 | +76 | 16 | NICHT erfüllt |
| H11-kasse | CLS | 0,010 | 0,104 | -0,094 | 0,000 | erfüllt |
| H11-kasse | INP ms | 112 | 56 | +56 | 0 | NICHT erfüllt |
| H12-ratgeber | LCP ms | 1004 | 924 | +80 | 12 | NICHT erfüllt |
| H12-ratgeber | CLS | 0,000 | 0,000 | 0,000 | 0,000 | erfüllt |
| H12-ratgeber | INP ms | 128 | 72 | +56 | 24 | NICHT erfüllt |

Ergebnis Z-08 mobil: LCP erfüllt 2 von 12, nicht erfüllt 10. CLS erfüllt 12 von 12, nicht erfüllt 0. INP erfüllt 1 von 12, nicht erfüllt 11. Ansichten mit allen drei Werten erfüllt: 1 von 12 (H10-warenkorb).

Grenzfall: H10 mobil INP, Differenz 32 ms = Spanne 32 ms, als erfüllt gewertet (≤).

## Budgets
- Jetzt: 0 Verstöße am Median in 24 Serien (LCP, CLS, INP). Höchster Einzellauf: LCP 1172 ms (H08 mobil), CLS 0,010 (H11 mobil), INP 200 ms (H08 mobil, Lauf 2, genau am Budget, nicht darüber). Keine Einzelmessung über einem Budget. Protokoll: `E6-PRUEFER-C-messung.log`, Spalte „Budget (Median)“.
- E0 heute, mobil: H10 LCP 2668 ms (über 2500) und CLS 0,117 (über 0,1). H11 CLS 0,104 (über 0,1). Die übrigen 9 Ansichten sind eingehalten.

## Offen
- Z-08 für Desktop: kein E0-Lauf heute, nicht bewertbar.
- Zeitbezug: die Messung „jetzt“ betrifft den Stand vor 2cdcbab. Eine neue Messung ist nicht Teil dieser Nachlese.
