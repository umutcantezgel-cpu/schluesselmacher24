import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/**
 * Symbol für den Startbildschirm unter iOS (180 × 180): dasselbe Zeichen wie
 * `icon.svg`, aber randlos auf vollem Quadrat — iOS rundet die Ecken selbst
 * und füllt durchsichtige Ecken sonst schwarz.
 */
export default async function AppleIcon() {
  const svg = await readFile(join(process.cwd(), 'src/app/icon.svg'));
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#0f172a' }}>
        <img src={`data:image/svg+xml;base64,${svg.toString('base64')}`} width={180} height={180} alt="" />
      </div>
    ),
    size,
  );
}
