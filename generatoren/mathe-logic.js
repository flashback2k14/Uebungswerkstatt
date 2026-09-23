/* ------------------------------------------------------------------
   Gemeinsame Mathe-Logik der Übungswerkstatt

   Wird von plus-minus.html, einmaleins.html, uhrzeit.html und
   mathe-mix.html per <script src="mathe-logic.js"> geladen.
   Aufgabenlogik hier ändern, dann gilt sie überall.

   Klassisches Skript ohne Module, damit die Seiten auch per
   Doppelklick (file://) funktionieren.
------------------------------------------------------------------- */

/* ---------- Zufall mit Startwert, damit Blätter reproduzierbar sind ---------- */
function mulberry32(a){
  return function(){
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const ganz = (rng, min, max) => min + Math.floor(rng() * (max - min + 1));
const wahl = (rng, liste) => liste[Math.floor(rng() * liste.length)];

/* Einfacher Zahlen-Hash über Einstellungen, damit jeder Baustein
   seinen eigenen, stabilen Zufallsstrom bekommt. */
function hash(text){
  let h = 7;
  for (const c of String(text)) h = Math.imul(h, 31) + c.charCodeAt(0) | 0;
  return h;
}

/* Genau die Hälfte der Aufgaben bekommt einen Platzhalter, zufällig verteilt. */
function verteilePlatzhalter(rng, liste){
  const plaetze = liste.map((_, i) => i);
  for (let i = plaetze.length - 1; i > 0; i--){
    const j = Math.floor(rng() * (i + 1));
    [plaetze[i], plaetze[j]] = [plaetze[j], plaetze[i]];
  }
  const anzahl = Math.round(liste.length / 2);
  for (let i = 0; i < anzahl; i++){
    liste[plaetze[i]].form = rng() < 0.5 ? 'mitte' : 'links';
  }
}

/* ---------- Plus & Minus ---------- */
function zweiteZahl(rng, art, obergrenze){
  if (obergrenze < 1) return null;
  if (art === 'one')  return ganz(rng, 1, Math.min(9, obergrenze));
  if (art === 'two')  return obergrenze < 10 ? null : ganz(rng, 10, Math.min(99, obergrenze));
  return ganz(rng, 1, Math.min(99, obergrenze));
}

function baueAddition(rng, max, art, uebergang){
  for (let i = 0; i < 3000; i++){
    const b = zweiteZahl(rng, art, max - 1);
    if (!b) continue;
    const a = ganz(rng, 1, max - b);
    const kreuzt = (a % 10) + (b % 10) >= 10;
    if (uebergang === 'force' && !kreuzt) continue;
    if (uebergang === 'avoid' && kreuzt) continue;
    return {op:'+', a, b, r:a + b, kreuzt};
  }
  return null;
}

function baueSubtraktion(rng, max, art, uebergang){
  for (let i = 0; i < 3000; i++){
    const a = ganz(rng, 2, max);
    const b = zweiteZahl(rng, art, a - 1);
    if (!b) continue;
    const kreuzt = (a % 10) < (b % 10);
    if (uebergang === 'force' && !kreuzt) continue;
    if (uebergang === 'avoid' && kreuzt) continue;
    return {op:'−', a, b, r:a - b, kreuzt};
  }
  return null;
}

/* pm: { anzahl, max, zweite, uebergang } */
function seriePlusMinus(rng, bauer, pm, luecken){
  const raus = [], gesehen = new Set();
  let fehlversuche = 0;
  while (raus.length < pm.anzahl && fehlversuche < 400){
    const auf = bauer(rng, pm.max, pm.zweite, pm.uebergang);
    if (!auf){ fehlversuche += 50; continue; }
    const key = auf.a + auf.op + auf.b;
    if (gesehen.has(key)){ fehlversuche++; continue; }
    gesehen.add(key);
    auf.form = 'ergebnis';
    raus.push(auf);
  }
  if (luecken) verteilePlatzhalter(rng, raus);
  return raus;
}

/* Rechenweg: 47 + 8 → 47 + 3 + 5 */
function rechenweg(auf){
  if (!auf.kreuzt) return '';
  if (auf.op === '+'){
    const bis = 10 - (auf.a % 10);
    return `${auf.a} + ${bis} + ${auf.b - bis}`;
  }
  const bis = auf.a % 10;
  return `${auf.a} − ${bis} − ${auf.b - bis}`;
}

/* ---------- Einmaleins ---------- */
function baueMultiplikation(rng, reihen){
  const b = wahl(rng, reihen);        /* geübte Reihe */
  const a = ganz(rng, 1, 10);
  return { op:'·', a, b, r:a * b };
}

/* Division als Umkehraufgabe: r : b = a, der Teiler kommt aus der Reihe */
function baueDivision(rng, reihen){
  const b = wahl(rng, reihen);
  const a = ganz(rng, 1, 10);
  return { op:':', a:a * b, b, r:a };
}

function serieEinmaleins(rng, bauer, anzahl, reihen, luecken){
  const raus = [], gesehen = new Set();
  const maxVerschieden = reihen.length * 10;
  let fehlversuche = 0;
  while (raus.length < Math.min(anzahl, maxVerschieden) && fehlversuche < 1200){
    const auf = bauer(rng, reihen);
    const key = auf.a + auf.op + auf.b;
    if (gesehen.has(key)){ fehlversuche++; continue; }
    gesehen.add(key);
    auf.form = 'ergebnis';
    raus.push(auf);
  }
  if (luecken) verteilePlatzhalter(rng, raus);
  return raus;
}

function reihenText(reihen){
  return reihen.length === 10 ? 'alle Reihen' : reihen.join('er-, ') + 'er-Reihe';
}

/* ---------- Uhrzeit ---------- */
const MINUTEN = {
  stunde:  [0],
  halb:    [0, 30],
  viertel: [0, 15, 30, 45],
  fuenf:   [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
  minute:  Array.from({length:60}, (_, i) => i)
};

const GENAU_NAMEN = {
  stunde:'volle Stunden', halb:'halbe Stunden', viertel:'Viertelstunden',
  fuenf:'5-Minuten-Schritte', minute:'minutengenau'
};

/* uz: { anzahl, genau, tageszeit, art } */
function baueZeiten(rng, uz){
  const raus = [], gesehen = new Set();
  const minuten = MINUTEN[uz.genau];
  const maxVerschieden = minuten.length * 12;
  let fehlversuche = 0;
  while (raus.length < Math.min(uz.anzahl, maxVerschieden) && fehlversuche < 2000){
    let h;
    if (uz.tageszeit === 'nachmittag')      h = ganz(rng, 13, 23);
    else if (uz.tageszeit === 'gemischt')   h = rng() < 0.5 ? ganz(rng, 1, 12) : ganz(rng, 13, 23);
    else                                    h = ganz(rng, 1, 12);
    const m = wahl(rng, minuten);
    const key = (h % 12) + ':' + m;         /* gleiche Zeigerstellung nur einmal */
    if (gesehen.has(key)){ fehlversuche++; continue; }
    gesehen.add(key);
    const typ = uz.art === 'gemischt' ? (rng() < 0.5 ? 'ablesen' : 'einzeichnen') : uz.art;
    raus.push({ h, m, typ });
  }
  return raus;
}

const digital = z => `${z.h}:${String(z.m).padStart(2, '0')}`;

/* ---------- Uhr als SVG ---------- */
function uhrSvg(z, mitZeigern, rot){
  const teile = [];
  teile.push('<circle cx="50" cy="50" r="46" fill="#fff" stroke="var(--ink)" stroke-width="2"/>');

  for (let i = 0; i < 60; i++){
    const winkel = i * 6 * Math.PI / 180;
    const gross = i % 5 === 0;
    const r1 = gross ? 40.5 : 43;
    const x1 = 50 + r1 * Math.sin(winkel), y1 = 50 - r1 * Math.cos(winkel);
    const x2 = 50 + 45 * Math.sin(winkel), y2 = 50 - 45 * Math.cos(winkel);
    teile.push(`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--ink)" stroke-width="${gross ? 1.6 : 0.6}"/>`);
  }

  for (let i = 1; i <= 12; i++){
    const winkel = i * 30 * Math.PI / 180;
    const x = 50 + 33 * Math.sin(winkel), y = 50 - 33 * Math.cos(winkel);
    teile.push(`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dy="0.36em" font-size="9.5" font-weight="700" font-family="var(--sans)" fill="var(--ink)">${i}</text>`);
  }

  if (mitZeigern){
    const farbe = rot ? 'var(--rot)' : 'var(--ink)';
    const stunde = ((z.h % 12) + z.m / 60) * 30;
    const minute = z.m * 6;
    teile.push(`<line x1="50" y1="50" x2="50" y2="29" stroke="${farbe}" stroke-width="4" stroke-linecap="round" transform="rotate(${stunde.toFixed(1)} 50 50)"/>`);
    teile.push(`<line x1="50" y1="50" x2="50" y2="14" stroke="${farbe}" stroke-width="2.4" stroke-linecap="round" transform="rotate(${minute} 50 50)"/>`);
    teile.push(`<circle cx="50" cy="50" r="2.6" fill="${farbe}"/>`);
  }

  return `<svg viewBox="0 0 100 100" role="img" aria-label="Ziffernblatt">${teile.join('')}</svg>`;
}

/* Im gemischten Modus braucht jede Ablese-Uhr einen Hinweis, sonst ist
   nicht entscheidbar, ob z. B. 3:40 oder 15:40 gemeint ist. */
function uhrAufgabeHtml(z, nr, tageszeitModus){
  if (z.typ === 'ablesen'){
    let tageszeit = '';
    if (tageszeitModus === 'gemischt'){
      tageszeit = `<span class="tageszeit">${z.h > 12 ? 'nachmittags' : 'vormittags'}</span>`;
    } else if (z.h > 12){
      tageszeit = '<span class="tageszeit">nachmittags</span>';
    }
    return `<div class="uhr">
      <span class="nr">${nr}.</span>
      ${uhrSvg(z, true, false)}
      ${tageszeit}
      <span class="antwort"><span class="schreiblinie"></span> Uhr</span>
    </div>`;
  }
  return `<div class="uhr">
    <span class="nr">${nr}.</span>
    ${uhrSvg(z, false, false)}
    <span class="vorgabe">${digital(z)} Uhr</span>
  </div>`;
}

function uhrLoesungHtml(z, nr){
  return `<div class="uhr">
    <span class="nr">${nr}.</span>
    ${uhrSvg(z, true, z.typ === 'einzeichnen')}
    <span class="antwort">${digital(z)} Uhr</span>
  </div>`;
}

function uhrBlockHtml(titel, zeiten, spalten, startNr, zelle){
  if (!zeiten.length) return '';
  return `<section class="block">
    <h3 class="block-titel">${titel}</h3>
    <div class="uhrgitter" style="grid-template-columns:repeat(${spalten},minmax(0,1fr))">
      ${zeiten.map((z, i) => zelle(z, startNr + i)).join('')}
    </div>
  </section>`;
}

/* ---------- Darstellung der Rechenaufgaben ---------- */
function termHtml(auf, karo){
  const feld = karo ? '<span class="kasten"></span>' : '<span class="luecke"></span>';
  const lue  = '<span class="luecke"></span>';
  if (auf.form === 'mitte') return `${auf.a} ${auf.op} ${lue} = ${auf.r}`;
  if (auf.form === 'links') return `${lue} ${auf.op} ${auf.b} = ${auf.r}`;
  return `${auf.a} ${auf.op} ${auf.b} = ${feld}`;
}

function loesungHtml(auf){
  return `${auf.a} ${auf.op} ${auf.b} = <span class="erg">${auf.r}</span>`;
}

function blockHtml(titel, liste, spalten, karo, startNr, mitWeg){
  if (!liste.length) return '';
  const zeilen = liste.map((auf, i) => {
    const weg = mitWeg ? rechenweg(auf) : '';
    return `<div class="aufgabe">
      <span class="nr">${startNr + i}.</span>
      <span class="term">${termHtml(auf, karo)}</span>
      ${weg ? `<span class="weg">${weg}</span>` : ''}
    </div>`;
  }).join('');
  return `<section class="block">
    <h3 class="block-titel">${titel}</h3>
    <div class="gitter" style="grid-template-columns:repeat(${spalten},minmax(0,1fr))">${zeilen}</div>
  </section>`;
}

function loesungsBlockHtml(titel, liste, startNr){
  if (!liste.length) return '';
  const zeilen = liste.map((auf, i) =>
    `<div class="aufgabe"><span class="nr">${startNr + i}.</span><span class="term">${loesungHtml(auf)}</span></div>`
  ).join('');
  return `<section class="block">
    <h3 class="block-titel">${titel}</h3>
    <div class="gitter" style="grid-template-columns:repeat(3,minmax(0,1fr))">${zeilen}</div>
  </section>`;
}
