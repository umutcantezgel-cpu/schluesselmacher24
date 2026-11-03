# KONTINGENT
Quelle: Messwert aus den rate_limit_event der Sitzung (list_events): five_hour und seven_day mit utilization und resetsAt. ~/.claude/kontingent.json fehlt. Sicherheitsziel 99 %, volle HAIKU-PLÄTZE (4).
Fenster bis 2026-11-03 03:10 MEZ · Woche bis 2026-11-07 02:00 MEZ.

| Uhrzeit | Fenster Verbrauch/Soll/Ziel | Woche Verbrauch/Spielraum | Plätze | Tempomat | Quelle |
|---|---|---|---|---|---|
| 2026-11-02 22:21 | ?/?/99 | ?/? | 0 von 2 | Halten | keine |
| 2026-11-02 22:23 | 2/4/99 | 0/≈5 je Fenster | 0 von 4 | Halten | rate_limit_event 22:23 |
| 2026-11-02 22:35 | 2+/≈8/99 | 0/≈5 je Fenster | 4 von 4 | Gas | rate_limit_event 22:23 (Welle E0-1 gestartet) |
| 2026-11-02 23:46 | 28,9/31,7/99 | 0 (21:23)/≈5 je Fenster | 4 von 4 | Halten | kontingent.mjs, 1 Kalibrierpunkt (2 % um 22:23) |
| 2026-11-03 01:56 | 44,8 %/≈83/99 | 0 (21:23)/≈5 je Fenster | 4 von 4 | Gas | kontingent.mjs, 1 Kalibrierpunkt |
| 2026-11-03 02:51 | 61,0 %/≈93/99 | 0 (21:23)/≈5 je Fenster | 4 von 4 | Gas | kontingent.mjs, 1 Kalibrierpunkt; Fenster endet 03:10 |
| 2026-11-03 03:26 | 6,2 %/≈5,3/99 (neues Fenster seit 03:10) | kein frischer Wochenwert (kein rate_limit_event in den letzten 100 Ereignissen); Sicherheitsziel 95 nach A-012 | 4 von 4 | Halten | kontingent.mjs --seit 02:10Z, 17,6 Mio. gewichtet |
| 2026-11-03 04:04 | 27,6 %/≈17,5/99 (Fenster seit 03:10, 18 % der Zeit) | kein frischer Wochenwert; Sicherheitsziel 95 | 3 von 4 | Bremse | kontingent.mjs, 77,8 Mio. gewichtet (Opus 62,0); Maßnahme: keine neuen Agenten, Kür zurückgestellt, größere Arbeitsschritte |
| 2026-11-03 04:27 | 37.2 %/≈25.7/99 (Fenster seit 03:10, 26 % der Zeit) | kein frischer Wochenwert; Sicherheitsziel 95 | 2 von 4 | Bremse | kontingent.mjs, 104.9 Mio. gewichtet |
| 2026-11-03 04:43 | 43,3 %/≈30,6/99 (31 % der Fensterzeit) | kein frischer Wochenwert; Sicherheitsziel 95 | 2 von 4 | Bremse | kontingent.mjs; Maßnahme: E3-Opus-Arbeit abgeschlossen, nur Haiku-Pakete (Updates, Prüfstufe B), Orchestrator wartet mit kurzen Wartebefehlen |
| 2026-11-03 05:25 | 49,0 %/≈42,9/95 (45 % der Fensterzeit) | kein frischer Wochenwert; Sicherheitsziel 95 | 1 von 4 | Bremse (6,1 Punkte über Soll; Verbrauch seit 05:03 rund 8 %/h gegen 19 %/h Soll-Anstieg, Abstand schrumpft) | kontingent.mjs, 137,9 Mio. gewichtet (Opus 112,4); Maßnahme: ein Haiku-Platz (E3-PRUEFER-01), Opus-Verdichtung E1-OPUS-01 in wenigen großen Schritten |
| 2026-11-03 06:02 | 34,7 %/Soll ≈16,6/Fensterziel 21,6 (aus der Woche; Sicherheitsziel 95) | ≈15,0 % (14 % um 05:22 aus rate_limit_event des Wachhund-Laufs, dazu Schätzung), Spielraum 80 % auf 18,4 Fenster bis Sa 02:00 = 4,35 %/Fenster, Verhältnis Woche zu Fenster 0,201 | 0 von 4 | Grenze: Warten bis 08:10 (Zurücksetzen des Fensters) | Kalibrierung neu: Punkt 05:22 mit 29 % (Faktor 0,216), Faktor jetzt Summenverhältnis 0,222 (A-024); vorher überschätzte der Faktor 0,355 das Fenster um etwa das 1,6-Fache |
| 2026-11-03 07:27 | 35 % gemessen (rate_limit_event des Wachhund-Laufs 07:22; Schätzer vorher 34,7 %) | 15 % gemessen; Spielraum 80 % auf 18,0 Fenster bis Sa 02:00 = 4,45 %/Fenster, Fensterziel ab 08:10 ≈ 22 % | 0 von 4 | Grenze bis 08:10, danach Halten | dritter Kalibrierpunkt eingetragen |
| 2026-11-03 08:51 | 4,6 %/Soll 2,9/Fensterziel 22 (Fenster seit 08:10) | ≈16 % (Schätzung seit 07:22: 15 % gemessen) | 0 von 4 | Halten | kontingent.mjs --seit 07:10Z; E4-OPUS-01 kostete rund 4,6 % des Fensters |
| 2026-11-03 09:06 | 6,8 %/Soll 4,2/Fensterziel 22 | ≈16 % (Schätzung) | 0 von 4 | Halten | kontingent.mjs; E4-OPUS-02 kostete rund 2,2 % |
| 2026-11-03 09:20 | 9,0 %/Soll 5,1/Fensterziel 22 | ≈16 % (Schätzung) | 0 von 4 | Halten (3,9 Punkte über Soll) | kontingent.mjs; E4-OPUS-03 kostete rund 2,2 % |
| 2026-11-03 09:29 | 10,8 %/Soll 5,8/Fensterziel 22 | ≈16 % (Schätzung) | 0 von 4 | Halten an der Schwelle (5,0 Punkte), Verbrauch etwa 12 %/h gegen 4,4 %/h Soll-Anstieg: Erkundung an Haiku, große Schritte, bei etwa 20 % Warten bis 13:10 | kontingent.mjs |
| 2026-11-03 09:57 | 14,6 %/Soll 8,0/Fensterziel 22 | ≈17 % (Schätzung) | 1 von 4 (E4-TEXTER-01) | Bremse (6,6 Punkte über Soll): keine neue Opus-Arbeit, Haiku-Texter läuft, Warten; Pause bei etwa 20 % bis 13:10 | kontingent.mjs |
