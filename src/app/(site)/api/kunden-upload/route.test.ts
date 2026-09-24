import { beforeEach, describe, expect, it, vi } from 'vitest';

import { defaults } from '@/lib/data/defaults';

/* Der Upload-Endpunkt so, wie ihn ein Browser — oder ein Angreifer mit
 * selbst gebauter Anfrage — aufruft. Speicherung und Zählung sind ersetzt;
 * der echte Durchlauf gegen die Datenbank steht in route.db.test.ts. */

const zustand = { erlaubt: true, ablage: true };

vi.mock('@/lib/server/rate-limit', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/server/rate-limit')>()),
  allowRequest: vi.fn(async () => zustand.erlaubt),
}));

vi.mock('@/lib/integrations', () => ({
  storageStatus: () => ({ configured: zustand.ablage }),
}));

vi.mock('@/lib/data', () => ({
  getSettings: async () => defaults.settings(),
}));

const speichere = vi.fn();
vi.mock('@/lib/server/kundendateien', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/server/kundendateien')>()),
  speichereKundendatei: (...args: unknown[]) => speichere(...args),
}));

const route = await import('./route');
const { hashToken } = await import('@/lib/server/access-token');

const URL_UPLOAD = 'http://localhost:3000/api/kunden-upload';
const JPEG = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00]);
const PDF = new TextEncoder().encode('%PDF-1.4\n1 0 obj<<>>endobj\nxref\n0 1\ntrailer<<>>\n%%EOF\n');

function formular(felder: Record<string, string | [Uint8Array, string, string?]>): FormData {
  const form = new FormData();
  for (const [name, wert] of Object.entries(felder)) {
    if (typeof wert === 'string') form.append(name, wert);
    else form.append(name, new Blob([wert[0] as Uint8Array<ArrayBuffer>], { type: wert[2] ?? '' }), wert[1]);
  }
  return form;
}

function anfrage(body: FormData | string, headers: Record<string, string> = {}): Request {
  return new Request(URL_UPLOAD, {
    method: 'POST',
    body,
    headers: { host: 'localhost:3000', origin: 'http://localhost:3000', ...headers },
  });
}

async function fehlerVon(response: Response): Promise<string> {
  return ((await response.json()) as { error: string }).error;
}

beforeEach(() => {
  zustand.erlaubt = true;
  zustand.ablage = true;
  speichere.mockReset();
  speichere.mockImplementation(async (neu: { dateiname: string; typ: { mimeType: string }; kategorie: string; daten: Uint8Array }) => ({
    id: '42',
    fileName: neu.dateiname,
    sizeBytes: neu.daten.byteLength,
    mimeType: neu.typ.mimeType,
    category: neu.kategorie,
  }));
});

describe('POST /api/kunden-upload', () => {
  it('speichert ein Foto und gibt einen Schlüssel zurück, von dem nur der Hash gespeichert wird', async () => {
    const response = await route.POST(
      anfrage(formular({ kategorie: 'schluesselfoto', datei: [JPEG, 'C:\\fotos\\Schlüssel vorn.JPG', 'text/plain'] })),
    );
    expect(response.status).toBe(201);
    expect(response.headers.get('cache-control')).toBe('no-store');

    const body = (await response.json()) as Record<string, unknown>;
    expect(body).toMatchObject({ id: '42', mimeType: 'image/jpeg', category: 'schluesselfoto' });
    expect(body.uploadToken).toMatch(/^[A-Za-z0-9_-]{43}$/);

    const neu = speichere.mock.calls[0][0];
    // Typ aus dem Inhalt, nicht aus der Angabe „text/plain“ des Browsers
    expect(neu.typ.mimeType).toBe('image/jpeg');
    expect(neu.dateiname).toBe('schluessel-vorn.jpg');
    expect(neu.uploadSchluesselHash).toBe(hashToken(body.uploadToken as string));
    expect(JSON.stringify(neu)).not.toContain(body.uploadToken as string);

    // Schlüsselfotos: Frist aus den Einstellungen (180 Tage)
    const tage = (neu.aufbewahrenBis.getTime() - Date.now()) / (24 * 60 * 60 * 1000);
    expect(tage).toBeGreaterThan(179.9);
    expect(tage).toBeLessThanOrEqual(180);
  });

  it('nimmt PDF für den Fahrzeugschein an, aber nicht als Schlüsselfoto', async () => {
    const ok = await route.POST(anfrage(formular({ kategorie: 'fahrzeugschein', datei: [PDF, 'schein.pdf'] })));
    expect(ok.status).toBe(201);

    const abgelehnt = await route.POST(anfrage(formular({ kategorie: 'schluesselfoto', datei: [PDF, 'foto.jpg', 'image/jpeg'] })));
    expect(abgelehnt.status).toBe(415);
    expect(speichere).toHaveBeenCalledTimes(1);
  });

  it('erkennt getarnte Dateien am Inhalt', async () => {
    const html = new TextEncoder().encode('<html><script>alert(1)</script></html>');
    const response = await route.POST(anfrage(formular({ kategorie: 'dokument', datei: [html, 'scan.pdf', 'application/pdf'] })));
    expect(response.status).toBe(415);
    expect(await fehlerVon(response)).toMatch(/Dateiformat/);
    expect(speichere).not.toHaveBeenCalled();
  });

  it('begrenzt die Größe je Dateityp', async () => {
    const grossesFoto = new Uint8Array(12 * 1024 * 1024 + 1);
    grossesFoto.set(JPEG);
    const response = await route.POST(anfrage(formular({ kategorie: 'objektfoto', datei: [grossesFoto, 'gross.jpg'] })));
    expect(response.status).toBe(413);
    expect(await fehlerVon(response)).toMatch(/12 MB/);
  });

  it('bricht zu große Anfragen ab, ohne sie ganz zu lesen', async () => {
    const angekuendigt = await route.POST(
      anfrage('x', { 'content-type': 'multipart/form-data; boundary=x', 'content-length': String(40 * 1024 * 1024) }),
    );
    expect(angekuendigt.status).toBe(413);

    // Ohne Längenangabe (chunked): Abbruch beim Lesen
    let gelesen = 0;
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        gelesen += 1024 * 1024;
        controller.enqueue(new Uint8Array(1024 * 1024));
        if (gelesen > 64 * 1024 * 1024) controller.close();
      },
    });
    const gestreamt = await route.POST(
      new Request(URL_UPLOAD, {
        method: 'POST',
        body: stream,
        headers: { 'content-type': 'multipart/form-data; boundary=x', origin: 'http://localhost:3000', host: 'localhost:3000' },
        duplex: 'half',
      } as RequestInit),
    );
    expect(gestreamt.status).toBe(413);
    expect(gelesen).toBeLessThan(20 * 1024 * 1024);
  });

  it('verlangt genau eine Datei und eine gültige Kategorie', async () => {
    const ohneDatei = await route.POST(anfrage(formular({ kategorie: 'dokument' })));
    expect(ohneDatei.status).toBe(400);

    const zwei = formular({ kategorie: 'dokument', datei: [JPEG, 'a.jpg'] });
    zwei.append('datei', new Blob([JPEG]), 'b.jpg');
    expect((await route.POST(anfrage(zwei))).status).toBe(400);

    const ohneKategorie = await route.POST(anfrage(formular({ datei: [JPEG, 'a.jpg'] })));
    expect(ohneKategorie.status).toBe(400);

    const falscheKategorie = await route.POST(anfrage(formular({ kategorie: 'ausweis', datei: [JPEG, 'a.jpg'] })));
    expect(falscheKategorie.status).toBe(400);

    const leer = await route.POST(anfrage(formular({ kategorie: 'dokument', datei: [new Uint8Array(), 'leer.jpg'] })));
    expect(leer.status).toBe(400);

    expect(speichere).not.toHaveBeenCalled();
  });

  it('nimmt nur multipart/form-data an', async () => {
    const response = await route.POST(anfrage('{"datei":"…"}', { 'content-type': 'application/json' }));
    expect(response.status).toBe(415);
  });

  it('lehnt Uploads von fremden Seiten ab', async () => {
    const response = await route.POST(
      anfrage(formular({ kategorie: 'dokument', datei: [JPEG, 'a.jpg'] }), { origin: 'https://fremde-seite.example' }),
    );
    expect(response.status).toBe(403);
    expect(speichere).not.toHaveBeenCalled();
  });

  it('bremst bei zu vielen Uploads', async () => {
    zustand.erlaubt = false;
    const response = await route.POST(anfrage(formular({ kategorie: 'dokument', datei: [JPEG, 'a.jpg'] })));
    expect(response.status).toBe(429);
  });

  it('meldet eine fehlende Ablage verständlich', async () => {
    zustand.ablage = false;
    const response = await route.POST(anfrage(formular({ kategorie: 'dokument', datei: [JPEG, 'a.jpg'] })));
    expect(response.status).toBe(503);
    expect(await fehlerVon(response)).toMatch(/trotzdem absenden/);
  });

  it('unterscheidet beschädigte Dateien von Speicherfehlern', async () => {
    speichere.mockRejectedValueOnce(Object.assign(new Error('Invalid PDF file.'), { name: 'ValidationError' }));
    const beschaedigt = await route.POST(anfrage(formular({ kategorie: 'dokument', datei: [PDF, 'a.pdf'] })));
    expect(beschaedigt.status).toBe(422);

    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    speichere.mockRejectedValueOnce(new Error('Verbindung verloren'));
    const kaputt = await route.POST(anfrage(formular({ kategorie: 'dokument', datei: [PDF, 'a.pdf'] })));
    expect(kaputt.status).toBe(500);
    log.mockRestore();
  });

  it('bietet nur POST an — kein Abruf, keine Liste', () => {
    expect(Object.keys(route)).toEqual(['POST']);
  });
});
