import { describe, expect, it } from 'vitest';

import {
  anbieterEinzeilig,
  anbieterZeilen,
  inhaberZeile,
  inhaltlichVerantwortlich,
  kontakt,
  registereintrag,
  standort,
  ustId,
} from './firma';
import { echteEinstellungen, platzhalterEinstellungen } from './test-hilfen';

describe('Firmendaten für Pflichtangaben', () => {
  const firma = echteEinstellungen().company;

  it('gibt Inhaber, Sitz und Kontakt aus den Einstellungen aus', () => {
    expect(inhaberZeile(firma)).toBe('Inhaber: Mina Saad');
    expect(anbieterZeilen(firma)).toEqual([
      'SCHLÜSSELMACHER24 – Inhaber Mina Saad',
      'Gloelstraße 11',
      '35576 Wetzlar',
      'Deutschland',
    ]);
    expect(anbieterEinzeilig(firma)).toBe('SCHLÜSSELMACHER24 – Inhaber Mina Saad, Gloelstraße 11, 35576 Wetzlar');
    expect(kontakt(firma)).toEqual({ telefon: '06441 8056279', email: 'info@schluesselmacher24.de' });
    expect(ustId(firma)).toBe('DE 282140471');
  });

  it('nennt die Werkstatt nur, wenn sie vom Sitz abweicht', () => {
    expect(standort(firma)).toEqual({
      label: 'Werkstatt und Abholung',
      street: 'Langgasse 70',
      postalCode: '35576',
      city: 'Wetzlar',
    });
    expect(standort({ ...firma, location: { label: 'Laden', street: firma.street, postalCode: firma.postalCode, city: firma.city } })).toBeUndefined();
    expect(standort({ ...firma, location: undefined })).toBeUndefined();
  });

  it('führt ohne Registergericht und -nummer keinen Registereintrag', () => {
    expect(registereintrag(firma)).toBeUndefined();
    expect(registereintrag({ ...firma, registerCourt: 'Amtsgericht Wetzlar', registerNumber: '' })).toBeUndefined();
    expect(registereintrag({ ...firma, registerCourt: 'Amtsgericht Wetzlar', registerNumber: 'HRA 1' })).toEqual({
      gericht: 'Amtsgericht Wetzlar',
      nummer: 'HRA 1',
    });
  });

  it('nimmt für § 18 MStV die gepflegte Angabe, sonst Inhaber und Sitz', () => {
    expect(inhaltlichVerantwortlich(firma)).toEqual(['Mina Saad', 'Gloelstraße 11', '35576 Wetzlar']);
    expect(inhaltlichVerantwortlich({ ...firma, contentResponsible: undefined })).toEqual([
      'Mina Saad',
      'Gloelstraße 11',
      '35576 Wetzlar',
    ]);
  });

  it('veröffentlicht bei Platzhalter-Daten nichts außer der Marke', () => {
    const platzhalter = platzhalterEinstellungen().company;
    expect(anbieterZeilen(platzhalter)).toEqual(['SCHLÜSSELMACHER24']);
    expect(kontakt(platzhalter)).toEqual({});
    expect(ustId(platzhalter)).toBeUndefined();
    expect(inhaltlichVerantwortlich(platzhalter)).toEqual([]);
    // Auch einzelne Platzhalter in sonst echten Daten erscheinen nicht.
    expect(kontakt({ ...firma, phone: '[Platzhalter: Telefonnummer]' })).toEqual({ email: 'info@schluesselmacher24.de' });
  });

  it('gibt die Steuernummer nirgends aus', () => {
    const alles = JSON.stringify([
      anbieterZeilen(firma),
      kontakt(firma),
      inhaltlichVerantwortlich(firma),
      standort(firma),
      ustId(firma),
    ]);
    expect(firma.taxNumber).toBeTruthy();
    expect(alles).not.toContain(firma.taxNumber!);
  });
});
