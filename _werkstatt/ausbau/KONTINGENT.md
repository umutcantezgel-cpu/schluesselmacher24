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
