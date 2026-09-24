import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Widerruf und Rückgabe',
  description: 'Widerrufsbelehrung und Hinweise zur Rückgabe bei SCHLÜSSELMACHER24.',
  robots: { index: false, follow: true },
};

export default function WiderrufPage() {
  return (
    <>
      <h1 className="text-[1.75rem] font-bold leading-tight md:text-3xl">Widerruf und Rückgabe</h1>
      <p className="mt-3">
        Diese Seite fasst zusammen, wann ein Widerrufsrecht besteht, wie es ausgeübt wird und
        welche Ausnahmen für Sonderanfertigungen gelten.
      </p>

      <h2>1. Widerrufsbelehrung für Verbraucherinnen und Verbraucher</h2>
      <p>
        [Platzhalter: Vollständige gesetzliche Widerrufsbelehrung einsetzen. Sie muss den Beginn
        der Frist, die Frist selbst, den Widerrufsadressaten mit vollständigen Kontaktdaten und die
        Rechtsfolgen benennen. Der Text ist anwaltlich zu erstellen oder zu prüfen — hier steht
        bewusst keine erfundene Belehrung.]
      </p>

      <h2>2. Muster-Widerrufsformular</h2>
      <p>
        [Platzhalter: Gesetzliches Muster-Widerrufsformular einsetzen und als abrufbare Fassung
        bereitstellen.]
      </p>

      <h2>3. Sonderanfertigungen und kundenspezifische Produkte</h2>
      <p>
        Ein Teil unserer Leistungen wird eigens für Sie hergestellt. Dazu gehören insbesondere:
      </p>
      <ul>
        <li>Schlüssel, die nach einem von Ihnen angegebenen Code gefertigt werden</li>
        <li>Schlüssel, die nach Ihrer Vorlage angefertigt werden</li>
        <li>Gleichschließende Zylinder mit einer für Sie erzeugten Schließung</li>
        <li>Schließanlagen und Anlagenerweiterungen</li>
        <li>Autoschlüssel, die auf Ihr Fahrzeug angelernt werden</li>
      </ul>
      <p>
        [Platzhalter: Hier ist juristisch zu klären und zu formulieren, für welche dieser Fälle
        das Widerrufsrecht nach den gesetzlichen Ausnahmen für nicht vorgefertigte, nach
        Kundenwunsch angefertigte Waren ausgeschlossen ist, wie darüber vor Vertragsschluss zu
        informieren ist und welche Bestätigung im Bestellvorgang einzuholen ist. Die Bestellung
        enthält bereits eine gesonderte Bestätigung dazu; deren Wortlaut ist abzustimmen.]
      </p>

      <h2>4. Anzahlungen auf Termine</h2>
      <p>
        Für Autoschlüssel-Termine wird eine Anzahlung erhoben, die vollständig auf den
        Gesamtpreis angerechnet wird.
      </p>
      <p>
        [Platzhalter: Regelungen zur Anzahlung juristisch festlegen und hier beschreiben —
        insbesondere Verhältnis zum Widerrufsrecht, Erstattung bei Absage durch den Kunden,
        Erstattung bei Absage durch uns, Fristen und der Umgang mit bereits beschafftem
        fahrzeugspezifischem Material.]
      </p>

      <h2>5. Rückgabe und Reklamation</h2>
      <p>
        [Platzhalter: Ablauf für Rücksendungen, Kostentragung der Rücksendung, Zustand der Ware,
        Umgang mit Transportschäden und das Vorgehen bei Mängeln beschreiben.]
      </p>

      <h2>6. Eingesandte Originalschlüssel</h2>
      <p>
        Für den Bereich Schlüssel nach Vorlage kann es nötig sein, dass Sie uns Ihren
        Originalschlüssel zusenden.
      </p>
      <p>
        [Platzhalter: Regelungen zur Einsendung festlegen — empfohlene Versandart, Haftung für den
        Versandweg, Rücksendung des Originals, Aufbewahrungsdauer und Vorgehen bei Verlust auf dem
        Transportweg.]
      </p>
    </>
  );
}
