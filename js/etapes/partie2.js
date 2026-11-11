// Partie 2 : la naissance du mètre.
import { reduireMouvement } from "../outils.js";

const rad = (d) => d * Math.PI / 180;

// Étape 8 : l'arc de méridien de Dunkerque à Barcelone (schéma à la plume, angle agrandi).
export function schemaArcMeridien() {
  const O = [40, 226], R = 190, a1 = 22, a2 = 52; // angles depuis l'équateur, agrandis pour la lisibilité
  const p = (a, r = R) => [O[0] + r * Math.cos(rad(a)), O[1] - r * Math.sin(rad(a))];
  const arc = (r, de, a) => { const [ux, uy] = p(de, r), [vx, vy] = p(a, r); return `M${ux} ${uy} A${r} ${r} 0 0 0 ${vx} ${vy}`; };
  const [dx, dy] = p(a2), [bx, by] = p(a1), [px, py] = p(90);
  const [tx, ty] = p((a1 + a2) / 2, R + 12), [gx, gy] = p((a1 + a2) / 2, 62);
  return `<svg viewBox="0 0 320 272" role="img" aria-label="Quart de méridien, de l'équateur au pôle Nord, avec l'arc mesuré entre Barcelone et Dunkerque">
    <g class="plume">
      <path d="${arc(R, 0, 90)}"/>
      <line x1="${O[0]}" y1="${O[1]}" x2="${O[0] + R}" y2="${O[1]}"/>
      <line x1="${O[0]}" y1="${O[1]}" x2="${px}" y2="${py}"/>
      <line x1="${O[0]}" y1="${O[1]}" x2="${dx}" y2="${dy}"/>
      <line x1="${O[0]}" y1="${O[1]}" x2="${bx}" y2="${by}"/>
      <path class="arc-angle" d="${arc(R, a1, a2)}" style="stroke-width:5"/>
      <path class="arc-angle" d="${arc(46, a1, a2)}"/>
      <circle cx="${dx}" cy="${dy}" r="3" class="plein"/><circle cx="${bx}" cy="${by}" r="3" class="plein"/>
    </g>
    <g class="ecrit">
      <text x="${dx - 6}" y="${dy - 8}" text-anchor="end">Dunkerque</text>
      <text x="${bx + 8}" y="${by + 4}">Barcelone</text>
      <text x="${px + 8}" y="${py + 10}">pôle Nord</text>
      <text x="${O[0] + R}" y="${O[1] + 18}" text-anchor="middle">équateur</text>
      <text x="${O[0] - 4}" y="${O[1] + 18}">centre</text>
      <text x="${gx}" y="${gy + 4}" class="petit angle">9,67°</text>
      <text x="${tx}" y="${ty}" class="petit angle">551 585 toises</text>
      <text x="160" y="268" text-anchor="middle" class="petit">(angle agrandi pour qu'on le voie bien)</text>
    </g>
  </svg>`;
}

// Étape 9 : les règles des unités anciennes et le quart de méridien divisé par des puissances de 10.
// Longueurs réelles en mètres, utilisées seulement pour dessiner à l'échelle (jamais affichées).
const UNITES = [
  { nom: "pied du roi", m: 0.3248 },
  { nom: "coudée royale égyptienne", m: 0.524 },
  { nom: "yard anglais", m: 0.9144 },
  { nom: "aune de Paris", m: 1.188 },
  { nom: "pas romain (double pas)", m: 1.48 },
  { nom: "brasse", m: 1.624 },
  { nom: "toise", m: 1.949 },
  { nom: "canne de Provence", m: 1.99 },
];
const ZONE = [0.3, 2.0];
const QUART = 1e7; // le quart de méridien mesure 10 000 km
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";

function lisible(m) {
  const f = (x) => x.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
  if (m >= 1000) return `${f(m / 1000)} km`;
  if (m >= 1) return `${f(m)} m`;
  if (m >= 0.01) return `${f(m * 100)} cm`;
  return `${f(m * 1000)} mm`;
}

export function popupPuissances(zone, api) {
  const X0 = 14, LARG = 292; // zone de dessin en pixels
  zone.innerHTML = `
    <svg class="scene-regles" viewBox="0 0 320 250" role="img" aria-label="Règles des unités anciennes et quart de méridien divisé"></svg>
    <div class="reglage large">
      <span class="borne">÷ 1</span>
      <input type="range" min="0" max="9" step="1" value="0" aria-label="Diviser le quart de méridien par une puissance de 10">
      <span class="borne">÷ 10⁹</span>
    </div>
    <p class="calcul division"></p>`;
  const svg = zone.querySelector("svg");
  const curseur = zone.querySelector("input");
  const division = zone.querySelector(".division");
  const vus = new Set();
  let largeurVue = QUART * 1.3, fini = false, anim = 0;

  const cibleVue = (k) => { const L = QUART / 10 ** k; return L > 2.6 ? L * 1.3 : 2.6; };

  function dessiner(W, k) {
    const L = QUART / 10 ** k;
    const px = (m) => (m / W) * LARG;
    const zx1 = X0 + px(ZONE[0]), zw = Math.max(px(ZONE[1] - ZONE[0]), 1.5);
    let lignes = "";
    UNITES.forEach((u, n) => {
      const y = 46 + n * 19, w = px(u.m);
      lignes += `<rect class="regle" x="${X0}" y="${y}" width="${Math.max(w, 0.8)}" height="7" rx="1"/>
        <text class="nom-regle" x="${X0 + Math.max(w, 0) + 4}" y="${y + 7}">${u.nom}</text>`;
    });
    const yL = 46 + UNITES.length * 19 + 8, wL = px(L);
    const dedans = L >= ZONE[0] && L <= ZONE[1];
    svg.innerHTML = `
      <rect class="zone-humaine ${dedans ? "touchee" : ""}" x="${zx1}" y="30" width="${zw}" height="${yL - 18}"/>
      <text class="zone-texte" x="${X0}" y="22">Zone des unités humaines${zw < 20 ? " (minuscule à cette échelle !)" : ""}</text>
      ${lignes}
      <rect class="regle-meridien ${dedans ? "touchee" : ""}" x="${X0}" y="${yL}" width="${Math.min(Math.max(wL, 1), LARG + 4)}" height="12" rx="2"/>
      <text class="nom-meridien" x="${X0}" y="${yL + 28}">quart de méridien ÷ 10${k ? [...String(k)].map((c) => SUP[c]).join("") : "⁰"} = ${lisible(L)}</text>
      <line class="echelle" x1="${X0}" y1="242" x2="${X0 + LARG}" y2="242"/>
      <text class="echelle-texte" x="${X0 + LARG}" y="238" text-anchor="end">largeur de l'écran ≈ ${lisible(W)}</text>`;
  }

  function aller() {
    const k = +curseur.value;
    vus.add(k);
    const L = QUART / 10 ** k;
    division.textContent = `10 000 000 m ÷ 10${[...String(k)].map((c) => SUP[c]).join("")} = ${lisible(L)}`;
    const de = largeurVue, a = cibleVue(k), t0 = performance.now(), duree = reduireMouvement() ? 0 : 900;
    cancelAnimationFrame(anim);
    const pas = (t) => { // zoom logarithmique, pour que le changement d'échelle reste lisible
      const f = duree ? Math.min(1, (t - t0) / duree) : 1;
      largeurVue = Math.exp(Math.log(de) + (Math.log(a) - Math.log(de)) * (1 - Math.cos(f * Math.PI)) / 2);
      dessiner(largeurVue, k);
      if (f < 1) anim = requestAnimationFrame(pas);
    };
    anim = requestAnimationFrame(pas);

    const msg = k < 6 ? "Encore beaucoup trop grand : impossible d'en faire une règle !"
      : k === 6 ? "10 m : trop grand pour une unité de tous les jours."
      : k === 7 ? "1 m : en plein dans la zone des unités humaines !"
      : k === 8 ? "10 cm : trop petit, plus petit qu'un pied."
      : "Beaucoup trop petit !";
    if (!fini && k === 7 && vus.has(6) && vus.has(8)) { fini = true; api.terminer(msg + " Le mètre était un excellent choix."); }
    else if (!fini) api.message(k === 7 && !(vus.has(6) && vus.has(8)) ? msg + " Essaie aussi la puissance juste au-dessus et juste au-dessous." : msg);
    else api.message(msg);
  }
  curseur.addEventListener("input", aller);
  dessiner(largeurVue, 0);
  aller();
}
