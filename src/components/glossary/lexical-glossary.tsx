'use client';

import { useState } from 'react';

const GLOSSARY_TERMS = [
  { term: 'OBD2', definition: 'On-Board-Diagnose Schnittstelle (On-Board Diagnostics). Ein genormtes System, das seit den späten 1990er Jahren in Fahrzeugen verbaut wird. Es ermöglicht Diagnosegeräten den Zugriff auf die elektronischen Steuergeräte, unter anderem zur Programmierung neuer Autoschlüssel und dem Anlernen der Wegfahrsperre.' },
  { term: 'Transponder (RFID)', definition: 'Radio-Frequency Identification. Ein winziger, passiver Chip im Schlüsselkopf. Er benötigt keine eigene Batterie, sondern wird durch das elektromagnetische Feld der Lesespule am Zündschloss mit Energie versorgt, woraufhin er seinen Code an das Steuergerät sendet.' },
  { term: 'Wegfahrsperre (WFS)', definition: 'Ein elektronisches Diebstahlschutzsystem. Wenn der Transpondercode des Schlüssels nicht mit dem im Motorsteuergerät hinterlegten Code übereinstimmt, unterbricht die Wegfahrsperre lebenswichtige Systeme (Zündung, Kraftstoffzufuhr, Anlasser), und das Fahrzeug startet nicht.' },
  { term: 'EEPROM', definition: 'Electrically Erasable Programmable Read-Only Memory. Ein nichtflüchtiger Speicherchip in Steuergeräten. Bei &quot;All Keys Lost&quot;-Situationen oder sehr spezifischen Fahrzeugen müssen die Wegfahrsperrendaten oft direkt aus diesem Chip ausgelesen (gedumpt) und manipuliert werden, da keine Programmierung über OBD2 möglich ist.' },
  { term: 'Smart-Key / Keyless-Go', definition: 'Ein fortschrittliches Zugangssystem, bei dem der Schlüssel nicht mehr aktiv in ein Schloss gesteckt werden muss. Das Fahrzeug erkennt den Schlüssel per Funk (Hoch- und Niederfrequenz) in der Tasche. Das Entriegeln erfolgt durch Berühren des Türgriffs, das Starten über den Push-to-Start-Knopf.' },
  { term: 'Krypto-Transponder', definition: 'Im Gegensatz zu älteren Festcode-Transpondern verwenden Krypto-Transponder (z.B. Megamos Crypto, Hitag) komplexe Verschlüsselungsalgorithmen (oft mit dynamisch wechselnden Rolling-Codes). Dies verhindert das einfache Auslesen und Klonen des Signals (&quot;Replay-Attacken&quot;).' },
  { term: 'CNC-Fräsen nach Code', definition: 'Das Fräsen eines Schlüssels anhand seines werkseitigen &quot;Bitting-Codes&quot; anstelle des simplen Abpausens eines abgenutzten Schlüssels. Dies garantiert eine Passgenauigkeit, die der eines fabrikneuen Schlüssels entspricht.' },
];

export function LexicalGlossary() {
  const [query, setQuery] = useState('');

  const filteredTerms = GLOSSARY_TERMS.filter(item =>
    item.term.toLowerCase().includes(query.toLowerCase()) ||
    item.definition.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mb-2">Lexikalisches Fachglossar</h3>
      <p className="text-sm text-[oklch(0.32_0.02_260)] mb-6">
        Schlagen Sie komplexe Fachbegriffe rund um Autoschlüssel-Technologie und Wegfahrsperren nach.
      </p>

      <div className="mb-6">
        <label htmlFor="glossary-search" className="sr-only">Begriff suchen</label>
        <input
          id="glossary-search"
          type="search"
          placeholder="Suchen Sie nach Begriffen wie OBD2, EEPROM, Transponder..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-4 py-3 text-sm text-[oklch(0.16_0.02_260)] placeholder:text-[oklch(0.52_0.015_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
        />
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {filteredTerms.length > 0 ? (
          filteredTerms.map((item, idx) => (
            <div key={idx} className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white p-4 transition-colors hover:border-[oklch(0.52_0.24_260)/0.5]">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">{item.term}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-[oklch(0.32_0.02_260)]">{item.definition}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-[oklch(0.52_0.015_260)] text-sm">
            Keine passenden Begriffe für &quot;{query}&quot; gefunden.
          </div>
        )}
      </div>
    </div>
  );
}
