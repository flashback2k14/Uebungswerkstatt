# Übungswerkstatt

Sammlung von Arbeitsblatt-Generatoren für das Üben zuhause. Reine statische Seite ohne Build-Schritt und ohne Abhängigkeiten. Jeder Generator ist eine eigenständige HTML-Datei und erzeugt über den Druckdialog des Browsers ein PDF.

## Struktur

```
uebungswerkstatt/
├── index.html          Shell: Startseite, Navigation, Routing
├── generatoren.js      Registry, ein Eintrag pro Generator
├── generatoren/
│   ├── rechenblatt.html
│   ├── einmaleins.html
│   ├── uhrzeit.html
│   └── diktat.html
└── README.md
```

Die Shell lädt jeden Generator in einem eigenen Iframe. Einmal geöffnete Generatoren bleiben im Hintergrund erhalten, Einstellungen gehen beim Wechseln also nicht verloren. Jede Ansicht hat eine eigene URL (`#/rechenblatt`, `#/diktat`) und lässt sich als Lesezeichen speichern.

## Hosten

Ein statischer Webserver reicht. Zum Ausprobieren lokal:

```
cd uebungswerkstatt
python3 -m http.server 8000
# oder
npx serve
```

Dann http://localhost:8000 öffnen.

Für den Dauerbetrieb bieten sich an:

* **GitHub Pages:** Ordnerinhalt in ein Repo pushen, Pages auf den Branch zeigen lassen. Kostenlos, kein Server nötig.
* **Eigener Server / NAS:** Ordner in das Webroot von nginx, Caddy oder Apache legen. Es gibt keine serverseitige Logik.
* **Docker:** `docker run -p 8080:80 -v $(pwd):/usr/share/nginx/html:ro nginx:alpine`

Das direkte Öffnen der `index.html` per Doppelklick funktioniert in den meisten Browsern ebenfalls, ein kleiner Server ist aber die verlässlichere Variante.

Die Schriften (Fraunces, Atkinson Hyperlegible) kommen von Google Fonts. Ohne Internet fällt die Seite auf Systemschriften zurück und bleibt benutzbar. Wer komplett offline sein will, legt die Schriftdateien lokal ab und passt die `<link>`-Zeilen in den HTML-Dateien an.

## Neuen Generator hinzufügen

1. Eine eigenständige HTML-Datei nach `generatoren/` legen. Sie sollte wie die vorhandenen aufgebaut sein: Bedienfeld links, Blattvorschau rechts, eigener Knopf „Drucken / PDF" (`window.print()`), Druck-Styles für A4 (`@media print`). Am einfachsten eine der beiden Dateien kopieren und umbauen.
2. In `generatoren.js` einen Eintrag ergänzen:

```js
{
  id: 'einmaleins',
  titel: 'Einmaleins',
  fach: 'Mathe',
  beschreibung: 'Reihen von 1 bis 10, gemischt oder einzeln.',
  datei: 'generatoren/einmaleins.html'
}
```

Navigation, Startkarte und Route entstehen daraus automatisch. Die Shell muss nicht angefasst werden.

## Konventionen für Generatoren

* Reproduzierbarkeit über eine Blattnummer (Seed), damit dasselbe Blatt erneut gedruckt werden kann. Die vorhandenen Generatoren nutzen dafür `mulberry32`.
* Lösungsblatt als eigene Seite anhängen, wo es Sinn ergibt.
* Farb- und Schriftvariablen aus den vorhandenen Dateien übernehmen (`--ink`, `--paper`, `--rot` usw.), damit alle Blätter zusammenpassen.
