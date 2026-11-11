// Étape 2 : mesurer l'angle à Alexandrie avec un rapporteur virtuel que l'élève place lui-même.
const rad = (d) => d * Math.PI / 180;
const ANGLE = 7.2;
const T = [110, 34], BASE = 232; // sommet de l'obélisque, niveau du sol
const RAYON = 104;

function rapporteur() {
  let g = `<path class="rap-corps" d="M${-RAYON - 6} 0 A${RAYON + 6} ${RAYON + 6} 0 0 1 ${RAYON + 6} 0 Z"/>`;
  for (let a = 0; a <= 180; a++) {
    const l = a % 10 === 0 ? 12 : a % 5 === 0 ? 8 : 4;
    const c = Math.cos(rad(a)), s = -Math.sin(rad(a));
    g += `<line class="rap-trait" x1="${RAYON * c}" y1="${RAYON * s}" x2="${(RAYON - l) * c}" y2="${(RAYON - l) * s}"/>`;
    if (a % 10 === 0 && a > 0 && a < 180) g += `<text class="rap-nombre" x="${(RAYON - 22) * c}" y="${(RAYON - 22) * s + 3}" text-anchor="middle">${a}</text>`;
  }
  g += `<text class="rap-nombre" x="${RAYON - 20}" y="-4" text-anchor="middle">0</text>`;
  g += `<line class="rap-base" x1="${-RAYON - 6}" y1="0" x2="${RAYON + 6}" y2="0"/><circle class="rap-centre" r="3"/>`;
  return g;
}

export function popupRapporteur(zone, api) {
  const ombre = (BASE - T[1]) * Math.tan(rad(ANGLE));
  const pointe = [T[0] + ombre, BASE];
  let rayons = "";
  for (const o of [-60, -30, 0, 30, 60]) {
    const x2 = pointe[0] + o, x1 = x2 - Math.tan(rad(ANGLE)) * BASE;
    rayons += `<line class="rayon ${o === 0 ? "fort" : ""}" x1="${x1}" y1="0" x2="${x2}" y2="${BASE}"/>`;
  }
  zone.innerHTML = `
    <svg class="scene-rapporteur" viewBox="0 0 320 250" role="img" aria-label="L'obélisque d'Alexandrie, son ombre, les rayons du Soleil et un rapporteur à placer">
      <rect class="ciel" width="320" height="${BASE}"/><rect class="sable" y="${BASE}" width="320" height="18"/>
      ${rayons}
      <polygon class="ombre-sol" points="${T[0]},${BASE} ${pointe[0]},${BASE} ${pointe[0]},${BASE + 3} ${T[0]},${BASE + 3}"/>
      <polygon class="obel" points="${T[0] - 9},${BASE} ${T[0] + 9},${BASE} ${T[0] + 5},${T[1] + 12} ${T[0]},${T[1]} ${T[0] - 5},${T[1] + 12}"/>
      <circle class="cible" cx="${T[0]}" cy="${T[1]}" r="5"/>
      <g class="rapporteur" tabindex="0" role="group" aria-label="Rapporteur : fais-le glisser avec le doigt ou les flèches du clavier">${rapporteur()}</g>
    </svg>
    <div class="reglage large">
      <span class="borne">Tourner</span>
      <input type="range" min="0" max="359" value="0" aria-label="Tourner le rapporteur (degrés)">
    </div>
    <div class="loupe" hidden></div>`;
  const svgEl = zone.querySelector("svg");
  const rap = zone.querySelector(".rapporteur");
  const tourner = zone.querySelector("input");
  const loupe = zone.querySelector(".loupe");
  let pos = [230, 205], rot = 0, place = false;

  function maj() {
    // aimantation : centre sur le sommet, zéro le long de l'obélisque
    if (Math.hypot(pos[0] - T[0], pos[1] - T[1]) < 12) pos = [...T];
    if (Math.abs(rot - 90) <= 4) { rot = 90; tourner.value = 90; }
    rap.setAttribute("transform", `translate(${pos[0]} ${pos[1]}) rotate(${rot})`);
    const centre = pos[0] === T[0] && pos[1] === T[1];
    if (centre && rot === 90) {
      rap.classList.add("bien-place");
      if (!place) {
        place = true;
        afficherLoupe();
        api.terminer("Rapporteur bien placé ! Lis la mesure dans la loupe.");
      }
    } else if (!place) {
      rap.classList.remove("bien-place");
      api.message(!centre ? "Place le centre du rapporteur au sommet de l'obélisque (point rouge)."
        : "Tourne le rapporteur pour que la graduation 0 soit le long de l'obélisque.");
    }
  }

  function afficherLoupe() {
    // Agrandissement de la zone entre 0° et 14° du rapporteur
    let g = "";
    for (let a = 0; a <= 14; a += 0.5) {
      const x = 20 + a * 20, l = a % 5 === 0 ? 26 : a % 1 === 0 ? 18 : 10;
      g += `<line class="rap-trait" x1="${x}" y1="20" x2="${x}" y2="${20 + l}"/>`;
      if (a % 1 === 0) g += `<text class="rap-nombre grand" x="${x}" y="62" text-anchor="middle">${a}</text>`;
    }
    const xr = 20 + ANGLE * 20;
    loupe.hidden = false;
    loupe.innerHTML = `<p class="vue-titre">Loupe sur les petites graduations</p>
      <svg viewBox="0 0 320 76" role="img" aria-label="Loupe sur les graduations de 0 à 14 degrés, le rayon passe entre 7 et 7,5">
        <rect class="rap-corps" x="6" y="12" width="308" height="58" rx="6"/>${g}
        <line class="rayon-loupe" x1="${xr}" y1="8" x2="${xr}" y2="56"/>
        <text class="legende-loupe" x="${xr + 4}" y="10">rayon du Soleil</text>
      </svg>`;
  }

  // Glisser au doigt ou à la souris
  const versSvg = (e) => {
    const p = svgEl.createSVGPoint();
    p.x = e.clientX; p.y = e.clientY;
    const q = p.matrixTransform(svgEl.getScreenCTM().inverse());
    return [q.x, q.y];
  };
  let prise = null;
  rap.addEventListener("pointerdown", (e) => {
    const [x, y] = versSvg(e);
    prise = [x - pos[0], y - pos[1]];
    try { rap.setPointerCapture(e.pointerId); } catch {}
    e.preventDefault();
  });
  rap.addEventListener("pointermove", (e) => {
    if (!prise) return;
    const [x, y] = versSvg(e);
    pos = [Math.max(0, Math.min(320, x - prise[0])), Math.max(0, Math.min(250, y - prise[1]))];
    maj();
  });
  rap.addEventListener("pointerup", () => (prise = null));
  rap.addEventListener("keydown", (e) => {
    const d = { ArrowLeft: [-4, 0], ArrowRight: [4, 0], ArrowUp: [0, -4], ArrowDown: [0, 4] }[e.key];
    if (!d) return;
    e.preventDefault();
    pos = [pos[0] + d[0], pos[1] + d[1]];
    maj();
  });
  tourner.addEventListener("input", () => { rot = +tourner.value; maj(); });
  maj();
}
