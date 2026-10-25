import 'server-only';

/**
 * Liest den Anfragekörper, bricht aber ab, sobald er zu groß wird — ohne den
 * ganzen Körper vorher in den Speicher zu laden (`request.text()` kennt keine
 * Obergrenze). Gleiche Logik wie im Upload-Endpunkt.
 */
export async function leseBegrenzt(request: Request, max: number): Promise<Uint8Array<ArrayBuffer> | 'zu-gross'> {
  const angegeben = Number(request.headers.get('content-length'));
  if (Number.isFinite(angegeben) && angegeben > max) return 'zu-gross';
  if (!request.body) return new Uint8Array(0);

  const reader = request.body.getReader();
  const teile: Uint8Array[] = [];
  let gesamt = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    gesamt += value.byteLength;
    if (gesamt > max) {
      await reader.cancel().catch(() => {});
      return 'zu-gross';
    }
    teile.push(value);
  }

  const koerper = new Uint8Array(gesamt);
  let position = 0;
  for (const teil of teile) {
    koerper.set(teil, position);
    position += teil.byteLength;
  }
  return koerper;
}
