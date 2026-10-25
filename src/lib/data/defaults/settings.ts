import type { Settings } from '@/lib/types';

/**
 * Standard-Einstellungen — nur der Rückfall, wenn weder `content/settings.json`
 * noch das Global „Einstellungen“ Daten liefern.
 *
 * Die Firmenangaben bleiben hier bewusst Platzhalter: Fällt die Seite auf
 * diese Werte zurück, soll das auffallen, statt still fremde Daten zu zeigen.
 * Die echten Angaben stehen in `content/settings.json` (einmalige Übernahme
 * in die Datenbank beim ersten Build) und danach im Backend unter
 * „Einstellungen“. `isPlaceholder` blendet Firmenangaben in Fußzeile,
 * Kontaktseite und strukturierten Daten aus.
 */
export function settings(): Settings {
  return {
    company: {
      legalName: '[Platzhalter: vollständige Firmierung]',
      brandName: 'SCHLÜSSELMACHER24',
      legalForm: 'einzelunternehmen',
      owner: '[Platzhalter: Inhaberin oder Inhaber]',
      street: '[Platzhalter: Straße und Hausnummer]',
      postalCode: '[PLZ]',
      city: '[Ort]',
      country: 'Deutschland',
      phone: '[Platzhalter: Telefonnummer]',
      email: '[Platzhalter: E-Mail-Adresse]',
      vatId: '[Platzhalter: Umsatzsteuer-Identifikationsnummer]',
      registerCourt: '[Platzhalter: Registergericht]',
      registerNumber: '[Platzhalter: Registernummer]',
      managingDirector: '[Platzhalter: vertretungsberechtigte Person]',
      profession: '[Platzhalter: Berufsbezeichnung]',
      chamber: '[Platzhalter: zuständige Kammer mit Anschrift]',
      isPlaceholder: true,
    },
    openingHours: [
      { day: 1, spans: [{ from: '09:00', to: '13:00' }, { from: '14:00', to: '17:00' }] },
      { day: 2, spans: [{ from: '09:00', to: '13:00' }, { from: '14:00', to: '17:00' }] },
      { day: 3, spans: [{ from: '09:00', to: '13:00' }, { from: '14:00', to: '17:00' }] },
      { day: 4, spans: [{ from: '09:00', to: '13:00' }, { from: '14:00', to: '17:00' }] },
      { day: 5, spans: [{ from: '09:00', to: '13:00' }] },
      { day: 6, spans: [] },
      { day: 7, spans: [] },
    ],
    booking: {
      // Leitfaden Abschnitt 06: Standard-Vorlauf 7 bis 8 Tage.
      leadTimeDays: 7,
      // Leitfaden Abschnitt 06: Standard-Anzahlung 69,90 Euro,
      // je Fahrzeug oder Leistung etwa 50 bis 80 Euro einstellbar.
      depositCents: 6990,
      depositMinCents: 5000,
      depositMaxCents: 8000,
      slotMinutes: 60,
      bookingHorizonDays: 90,
      slotsPerWindow: 1,
      federalState: 'HE',
      windows: [
        { from: '09:00', to: '10:00' },
        { from: '10:00', to: '11:00' },
        { from: '11:00', to: '12:00' },
        { from: '14:00', to: '15:00' },
        { from: '15:00', to: '16:00' },
        { from: '16:00', to: '17:00' },
      ],
    },
    shipping: [
      {
        id: 'brief-verfolgt',
        label: 'Versand verfolgbar',
        description: 'Versand mit Sendungsverfolgung. Geeignet für einzelne Schlüssel.',
        priceCents: 495,
        tracked: true,
        insured: false,
        productClasses: ['code-schluessel', 'zubehoer'],
      },
      {
        id: 'paket-versichert',
        label: 'Paket versichert',
        description: 'Versicherter Paketversand mit Sendungsverfolgung.',
        priceCents: 795,
        tracked: true,
        insured: true,
        productClasses: ['code-schluessel', 'zylinder', 'zubehoer'],
      },
      {
        id: 'abholung',
        label: 'Abholung im Fachbetrieb',
        description: 'Sie holen Ihre Bestellung nach Benachrichtigung selbst ab.',
        priceCents: 0,
        tracked: false,
        insured: false,
        productClasses: ['code-schluessel', 'zylinder', 'zubehoer'],
      },
    ],
    retentionDays: {
      vehicleRegistration: 90,
      keyPhotos: 180,
      floorPlans: 365,
      projectDocuments: 365,
    },
    updatedAt: '2026-09-15T00:00:00.000Z',
  };
}
