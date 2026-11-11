// Étape 4 : un cinquantième du tour.
import { el } from "../outils.js";

const ANGLE = 7.2;
const fmt = (x) => (Math.round(x * 10) / 10).toString().replace(".", ",");

function point(cx, cy, r, deg) {
  const a = (deg - 90) * Math.PI / 180; // 0° en haut, sens horaire
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function part(cx, cy, r, de, a) {
  const [x1, y1] = point(cx, cy, r, de);
  const [x2, y2] = point(cx, cy, r, a);
  return `M${cx} ${cy} L${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
}

// Schéma « à la plume » sur le parchemin.
export function schemaAngleCentre() {
  const [ax, ay] = point(160, 150, 110, -10);
  const [sx, sy] = point(160, 150, 110, 10);
  const [lx, ly] = point(160, 150, 42, 0);
  return `<svg viewBox="0 0 320 300" role="img" aria-label="La Terre, son centre, et les rayons vers Alexandrie et Syène séparés d'un angle de 7,2 degrés">
    <g class="plume">
      <circle cx="160" cy="150" r="110"/>
      <line x1="160" y1="150" x2="${ax}" y2="${ay}"/><line x1="160" y1="150" x2="${sx}" y2="${sy}"/>
      <path d="${part(160, 150, 30, -10, 10).replace(/^M[^L]+L/, "M").replace(/ Z$/, "")}" class="arc-angle"/>
      <circle cx="160" cy="150" r="2.5" class="plein"/>
      <circle cx="${ax}" cy="${ay}" r="3" class="plein"/><circle cx="${sx}" cy="${sy}" r="3" class="plein"/>
    </g>
    <g class="ecrit">
      <text x="${ax - 6}" y="${ay - 10}" text-anchor="end">Alexandrie</text>
      <text x="${sx + 6}" y="${sy - 10}">Syène</text>
      <text x="168" y="168">centre</text>
      <text x="${lx + 14}" y="${ly + 10}" class="petit angle">7,2°</text>
      <text x="160" y="290" text-anchor="middle" class="petit">(angle agrandi pour qu'on le voie bien)</text>
    </g>
  </svg>`;
}

// Manipulation pop-up : combien de parts de 7,2° pour faire le tour ?
export function popupCercle50(zone, api) {
  const COULEURS = ["var(--pop-soleil)", "var(--pop-ocre)", "var(--pop-bleu)"];
  zone.innerHTML = `
    <svg class="cercle50" viewBox="0 0 260 260" role="img" aria-label="Disque découpé en parts de 7,2 degrés">
      <circle cx="130" cy="130" r="112" class="fond-disque"/>
      <g class="parts"></g>
      <circle cx="130" cy="130" r="112" class="contour-disque"/>
      <text x="130" y="136" text-anchor="middle" class="compteur"></text>
    </svg>
    <div class="reglage">
      <button type="button" class="rond moins" aria-label="Une part de moins">−</button>
      <input type="range" min="1" max="60" value="1" aria-label="Nombre de parts de 7,2°">
      <button type="button" class="rond plus" aria-label="Une part de plus">+</button>
    </div>
    <p class="calcul" aria-live="polite"></p>`;
  const parts = zone.querySelector(".parts");
  const curseur = zone.querySelector("input");
  const compteur = zone.querySelector(".compteur");
  const calcul = zone.querySelector(".calcul");
  let fini = false;

  function dessiner() {
    const n = +curseur.value;
    const total = n * ANGLE;
    let html = "";
    for (let i = 0; i < n; i++) {
      const de = i * ANGLE;
      const trop = de >= 360 - 1e-9;
      html += `<path d="${part(130, 130, trop ? 124 : 112, de, de + ANGLE)}" fill="${trop ? "var(--pop-rouge)" : COULEURS[i % 3]}" class="${trop ? "part trop" : "part"}"/>`;
    }
    parts.innerHTML = html;
    compteur.textContent = `${n} part${n > 1 ? "s" : ""}`;
    calcul.textContent = `${n} × ${fmt(ANGLE)}° = ${fmt(total)}°`;
    if (Math.abs(total - 360) < 1e-9) {
      zone.classList.add("complet");
      if (!fini) { fini = true; api.terminer("Le disque est exactement rempli : le tour est complet !"); }
      else api.message("Le disque est exactement rempli : le tour est complet !");
    } else {
      zone.classList.remove("complet");
      api.message(total > 360 ? "Trop de parts : elles se chevauchent et dépassent le tour." : "Le tour n'est pas encore complet.");
    }
  }
  curseur.addEventListener("input", dessiner);
  zone.querySelector(".moins").addEventListener("click", () => { curseur.stepDown(); dessiner(); });
  zone.querySelector(".plus").addEventListener("click", () => { curseur.stepUp(); dessiner(); });
  dessiner();
}
