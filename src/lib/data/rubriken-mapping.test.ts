import { describe, expect, it } from 'vitest';

import type { Rubriken } from '@/payload-types';

import { rubriken } from './defaults/rubriken';
import { rubrikZuPayload, rubrikZuSeite } from './payload-mapping';

describe('Rubriken: Abbildung zwischen Seite und Backend', () => {
  it('jede Rubrik übersteht den Weg ins Backend und zurück unverändert', () => {
    for (const rubrik of rubriken()) {
      const daten = rubrikZuPayload(rubrik);
      const doc = { ...daten, id: 1, updatedAt: '', createdAt: '' } as unknown as Rubriken;
      expect(rubrikZuSeite(doc)).toEqual(rubrik);
    }
  });
});
