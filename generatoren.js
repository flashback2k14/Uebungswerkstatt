/* ------------------------------------------------------------------
   Generator-Registry der Übungswerkstatt

   Neuen Generator hinzufügen:
   1. HTML-Datei in den Ordner "generatoren/" legen
      (eigenständige Seite mit eigenem Druck-Knopf, wie die vorhandenen).
   2. Hier einen Eintrag ergänzen. Fertig.

   Felder:
   id           eindeutig, wird Teil der URL (#/id)
   titel        Name in Navigation und auf der Startseite
   fach         Kurzlabel, z. B. "Mathe" oder "Deutsch"
   beschreibung ein bis zwei Sätze für die Startkarte
   datei        Pfad relativ zur index.html
------------------------------------------------------------------- */

const GENERATOREN = [
  {
    id: 'rechenblatt',
    titel: 'Rechenblatt',
    fach: 'Mathe',
    beschreibung: 'Plus- und Minusaufgaben im Zahlenraum bis 20, 100 oder 1000. Mit Zehnerübergang, Platzhaltern und Lösungsblatt.',
    datei: 'generatoren/rechenblatt.html'
  },
  {
    id: 'einmaleins',
    titel: 'Einmaleins',
    fach: 'Mathe',
    beschreibung: 'Mal- und Geteilt-Aufgaben zu frei wählbaren Reihen von 1 bis 10. Mit Platzhaltern und Lösungsblatt.',
    datei: 'generatoren/einmaleins.html'
  },
  {
    id: 'uhrzeit',
    titel: 'Uhrzeit',
    fach: 'Mathe',
    beschreibung: 'Analoge Uhren ablesen oder Zeiger einzeichnen, von vollen Stunden bis minutengenau. Auch mit Nachmittagszeiten.',
    datei: 'generatoren/uhrzeit.html'
  },
  {
    id: 'mathe-mix',
    titel: 'Mathe-Mix',
    fach: 'Mathe',
    beschreibung: 'Plus und Minus, Einmaleins und Uhrzeit frei kombiniert auf einem Blatt. Jeder Baustein mit eigenen Einstellungen, dazu ein gemeinsames Lösungsblatt.',
    datei: 'generatoren/mathe-mix.html'
  },
  {
    id: 'diktat',
    titel: 'Diktat',
    fach: 'Deutsch',
    beschreibung: 'Diktate für Klasse 1 bis 4 mit Rechtschreib-Schwerpunkten. Schreibblatt mit Lineatur, Lückentext und Vorleseblatt.',
    datei: 'generatoren/diktat.html'
  }
];
