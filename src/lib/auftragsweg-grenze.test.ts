import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/* `src/lib/auftragsweg.ts` laden auch Bausteine im Browser (Assistent, Preisanzeige, Bestätigung). Die
   Partnerlogik (Abdeckungsregel, Prüfliste, Vermittlung, Terminstandorte) gehört deshalb nicht in ihren
   Modulgraphen: Die Abnahme von FA-PLATTFORM-01C hat rund 20 KB zusätzliches Skript im Bündel des
   Assistenten gemessen, als `auftragsweg.ts` die Abdeckungsregel importierte. Die Logik liegt in
   `src/lib/auftragsweg-partner.ts`, das nur der Server lädt. */
const lies = (pfad: string) => readFileSync(pfad, 'utf8');
const ziele = (quelle: string) => [...quelle.matchAll(/(?:from|import\()\s*'([^']+)'/g)].map((m) => m[1]);

describe('Auftragsweg: Partnerlogik bleibt aus dem Browser-Bündel', () => {
  it('auftragsweg.ts importiert weder die Partnerlogik noch das Server-Modul', () => {
    const importe = ziele(lies('src/lib/auftragsweg.ts'));
    for (const verboten of ['./auftragsweg-partner', './partner/region', './partner/vermittlung', './partner/leistungen']) {
      expect(importe, verboten).not.toContain(verboten);
    }
    // Die Prüfliste höchstens als Typ; Laufzeitcode der Partnerprüfung gehört nicht hierher.
    expect(lies('src/lib/auftragsweg.ts')).not.toMatch(/import\s+\{[^}]*\}\s+from\s+'\.\/partner\/pruefliste'/);
  });

  it('auftragsweg.ts gibt die verschobenen Namen nicht weiter', async () => {
    const modul = (await import('./auftragsweg')) as Record<string, unknown>;
    for (const name of ['terminstandorte', 'passendePartner', 'partnerFuerWegAusBetrieb']) {
      expect(modul[name], name).toBeUndefined();
    }
  });

  it('kein Baustein mit „use client“ importiert das Server-Modul der Partnerlogik', () => {
    const dateien = execSync("grep -rl \"^'use client'\" src --include=*.ts --include=*.tsx", { encoding: 'utf8' }).split('\n').filter(Boolean);
    expect(dateien.length).toBeGreaterThan(20);
    for (const datei of dateien) {
      const importe = ziele(lies(datei));
      expect(importe.some((z) => /auftragsweg-partner$/.test(z)), datei).toBe(false);
      expect(importe.some((z) => /partner\/(region|partnerweg-daten)$/.test(z)), datei).toBe(false);
    }
  });

  it('die Server-Aufrufer lesen die Partnerlogik aus auftragsweg-partner', () => {
    for (const datei of ['src/lib/partner/partnerweg-daten.ts', 'src/payload/hooks/auftragsweg.ts', 'src/lib/orte/stamm.ts']) {
      expect(ziele(lies(datei)).some((z) => /auftragsweg-partner$/.test(z)), datei).toBe(true);
    }
  });
});
