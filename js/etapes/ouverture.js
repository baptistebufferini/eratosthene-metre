// Prologue : trois animations côte à côte, Terre plate à gauche, Terre ronde à droite,
// pilotées par un seul curseur. Les proportions (hauteurs, rayon de la Terre) sont exagérées
// pour être visibles, mais chaque vue est calculée à partir de la même modélisation.

const svg = (vb, label, contenu = "") => `<svg viewBox="${vb}" role="img" aria-label="${label}">${contenu}</svg>`;

function gabaritDuo(zone, { vueTitre, modeleTitre, curseurLabel, gauche, droite }) {
  zone.innerHTML = `
    <div class="duo">
      ${["plate", "ronde"].map((c) => `
      <figure class="cote ${c}">
        <figcaption>${c === "plate" ? "Terre plate" : "Terre ronde"}</figcaption>
        <p class="vue-titre">${vueTitre}</p>
        <div class="vue"></div>
        <p class="vue-titre">${modeleTitre}</p>
        <div class="modele"></div>
      </figure>`).join("")}
    </div>
    <div class="reglage large">
      <span class="borne">${gauche}</span>
      <input type="range" min="0" max="100" value="0" aria-label="${curseurLabel}">
      <span class="borne">${droite}</span>
    </div>`;
  const q = (s) => zone.querySelector(s);
  return {
    vuePlate: q(".plate .vue"), modelePlate: q(".plate .modele"),
    vueRonde: q(".ronde .vue"), modeleRonde: q(".ronde .modele"),
    curseur: q("input"),
  };
}

function bonhomme(x, y, h, classe = "") { // petit personnage debout en (x, y), hauteur h
  return `<g class="perso ${classe}"><circle cx="${x}" cy="${y - h}" r="${h * 0.18}"/><path d="M${x} ${y - h * 0.8} V${y - h * 0.35} M${x} ${y - h * 0.35} L${x - h * 0.2} ${y} M${x} ${y - h * 0.35} L${x + h * 0.2} ${y} M${x - h * 0.25} ${y - h * 0.65} H${x + h * 0.25}"/></g>`;
}

function crepe(cx, cy, rx, ry) { // la « pizza » vue de biais, avec son épaisseur
  return `<path class="crepe-bord" d="M${cx - rx} ${cy} v6 a${rx} ${ry} 0 0 0 ${2 * rx} 0 v-6"/>
    <ellipse class="crepe" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`;
}

// ===================== 1. Le navire =====================
export function popupNavire(zone, api) {
  const R = 100, OEIL = 7, NAVIRE = 16, CAP = 0.3; // unités de la modélisation
  const ALPHA = Math.acos(R / (R + OEIL)); // angle jusqu'à l'horizon
  const T0 = 0.2, T1 = 0.92;
  const v = gabaritDuo(zone, {
    vueTitre: "À la longue-vue, depuis le rivage", modeleTitre: "Vu de l'extérieur",
    curseurLabel: "Éloigner le navire", gauche: "près", droite: "loin",
  });
  let vu = false;

  function dessinNavire(x, base, h, clip) {
    const coque = h * CAP, l = h * 1.1;
    return `<g ${clip ? `clip-path="url(#${clip})"` : ""}>
      <path class="coque" d="M${x - l / 2} ${base - coque} H${x + l / 2} L${x + l * 0.35} ${base} H${x - l * 0.35} Z"/>
      <line class="mat" x1="${x}" y1="${base - coque}" x2="${x}" y2="${base - h}"/>
      <path class="voile" d="M${x + 0.5} ${base - h * 0.95} L${x + l * 0.4} ${base - coque - h * 0.05} H${x + 0.5} Z"/>
    </g>`;
  }

  function vue(cachePx, hPx, basePerspective, rond) {
    const H = 55;
    const base = H + (rond && cachePx > 0 ? cachePx : basePerspective);
    return svg("0 0 160 100", rond ? "Vue de l'observateur sur la Terre ronde" : "Vue de l'observateur sur la Terre plate", `
      <defs><clipPath id="ciel-${rond ? "r" : "p"}"><rect width="160" height="${rond && cachePx > 0 ? H : 100}"/></clipPath></defs>
      <rect class="ciel" width="160" height="${H}"/><rect class="mer" y="${H}" width="160" height="${100 - H}"/>
      <line class="horizon" x1="0" x2="160" y1="${H}" y2="${H}"/>
      ${dessinNavire(80, base, hPx, `ciel-${rond ? "r" : "p"}`)}`);
  }

  function dessiner() {
    const t = v.curseur.value / 100;
    const theta = T0 + (T1 - T0) * t;
    const d = R * theta;
    const cache = theta > ALPHA ? Math.min(R / Math.cos(theta - ALPHA) - R, NAVIRE * 1.2) : 0;
    const hPx = 1000 / d; // vu à la longue-vue, pour que le navire reste visible
    const cachePx = cache * hPx / NAVIRE;

    // Terre plate : le navire rapetisse mais reste entier ; sa base remonte lentement vers l'horizon.
    v.vuePlate.innerHTML = vue(0, hPx, 120 / d, false);
    // Terre ronde : la base atteint l'horizon à la distance de l'horizon, puis le navire passe derrière.
    v.vueRonde.innerHTML = vue(cachePx, hPx, (120 / d) * Math.max(0, 1 - theta / ALPHA), true);

    // Modélisation plate : on avance en ligne droite sur la « pizza ».
    const xo = 14, xn = 14 + (d / (R * T1)) * 128;
    v.modelePlate.innerHTML = svg("0 0 160 110", "Modélisation : Terre plate", `
      ${crepe(80, 70, 74, 22)}
      ${bonhomme(xo, 70, 9)}
      <line class="mat-modele" x1="${xn}" y1="70" x2="${xn}" y2="58"/><path class="coque" d="M${xn - 5} 66 H${xn + 5} L${xn + 3} 70 H${xn - 3} Z"/>
      <line class="visee" x1="${xo}" y1="61" x2="${xn}" y2="58"/>`);

    // Modélisation ronde : la ligne de visée frôle la Terre (tangente) et passe au-dessus de la coque.
    const cx = 80, cy = 152, phiO = -0.5;
    const pt = (phi, r) => [cx + r * Math.sin(phi), cy - r * Math.cos(phi)];
    const [ox, oy] = pt(phiO, R), [ex, ey] = pt(phiO, R + OEIL);
    const [tx, ty] = pt(phiO + ALPHA, R);
    const phiN = phiO + theta;
    const [b1x, b1y] = pt(phiN, R), [c1x, c1y] = pt(phiN, R + Math.min(cache, NAVIRE)), [h1x, h1y] = pt(phiN, R + NAVIRE);
    const k = 2.2; // prolonge la ligne de visée au-delà du point de tangence
    v.modeleRonde.innerHTML = svg("0 0 160 110", "Modélisation : Terre ronde", `
      <circle class="boule" cx="${cx}" cy="${cy}" r="${R}"/>
      <line class="mat-modele cachee" x1="${b1x}" y1="${b1y}" x2="${c1x}" y2="${c1y}"/>
      <line class="mat-modele" x1="${c1x}" y1="${c1y}" x2="${h1x}" y2="${h1y}"/>
      <circle class="pt-horizon" cx="${tx}" cy="${ty}" r="2"/>
      <line class="visee" x1="${ex}" y1="${ey}" x2="${ex + (tx - ex) * k}" y2="${ey + (ty - ey) * k}"/>
      <g transform="rotate(${phiO * 180 / Math.PI} ${ox} ${oy})">${bonhomme(ox, oy, OEIL)}</g>`);

    if (t > 0.97 && !vu) { vu = true; api.terminer("Sur la Terre ronde, la coque disparaît d'abord, puis le mât."); }
    else if (!vu) api.message(cache > 0 ? "Le navire passe derrière la courbure de la Terre…" : "Éloigne le navire jusqu'au bout.");
  }
  v.curseur.addEventListener("input", dessiner);
  dessiner();
}

// ===================== 2. Les étoiles du Sud =====================
// Déclinaisons réelles (degrés). Chaque étoile est dessinée à sa hauteur maximale au-dessus
// de l'horizon sud : 90° − latitude + déclinaison.
const ETOILES = [
  { x: 22, dec: -47.3 },            // γ Velorum
  { x: 55, dec: -57.2 },            // Achernar
  { x: 82, dec: -52.7, nom: "Canopus" },
  { x: 112, dec: -60.8 },           // α Centauri
  { x: 140, dec: -63.1 },           // Acrux (Croix du Sud)
];
const VILLES = [{ nom: "Athènes", lat: 38 }, { nom: "Rhodes", lat: 36.4 }, { nom: "Alexandrie", lat: 31.2 }, { nom: "Syène", lat: 24.1 }];

export function popupEtoiles(zone, api) {
  const L0 = 38, L1 = 24.1, PX = 3.5; // pixels par degré de hauteur
  const v = gabaritDuo(zone, {
    vueTitre: "Le ciel, face au sud", modeleTitre: "Vu de l'extérieur",
    curseurLabel: "Voyager de la Grèce vers l'Égypte", gauche: "Grèce", droite: "Égypte",
  });
  let vu = false;

  function ciel(lat, rond) {
    const H = 84;
    let etoiles = "";
    for (const e of ETOILES) {
      const h = 90 - lat + e.dec;
      if (h <= 0) continue;
      const y = H - h * PX, r = e.nom ? 3.4 : 1.8;
      etoiles += `<circle class="etoile${e.nom ? " canopus" : ""}" cx="${e.x}" cy="${y}" r="${r}"/>`;
      if (e.nom) etoiles += `<text class="nom-etoile" x="${e.x}" y="${y - 6}" text-anchor="middle">${e.nom}</text>`;
    }
    return svg("0 0 160 100", rond ? "Ciel du voyageur sur la Terre ronde" : "Ciel du voyageur sur la Terre plate", `
      <rect class="nuit" width="160" height="${H}"/>${etoiles}
      <rect class="sol" y="${H}" width="160" height="${100 - H}"/>
      <text class="cardinal" x="80" y="96" text-anchor="middle">Sud</text>`);
  }

  function dessiner() {
    const t = v.curseur.value / 100;
    const lat = L0 + (L1 - L0) * t;
    const ville = VILLES.reduce((a, b) => (Math.abs(b.lat - lat) < Math.abs(a.lat - lat) ? b : a));

    v.vuePlate.innerHTML = ciel(L0, false); // Terre plate : tout le monde voit le même ciel
    v.vueRonde.innerHTML = ciel(lat, true);

    const xp = 18 + t * 124;
    v.modelePlate.innerHTML = svg("0 0 160 110", "Modélisation : Terre plate", `
      ${crepe(80, 64, 74, 22)}
      <text class="lieu" x="16" y="104">Grèce</text><text class="lieu" x="144" y="104" text-anchor="end">Égypte</text>
      <line class="horizon-modele" x1="${xp - 26}" y1="64" x2="${xp + 26}" y2="64"/>
      ${bonhomme(xp, 64, 11, "voyageur")}`);

    // Coupe de la Terre selon un méridien : le nord en haut, le voyageur sur le bord droit.
    const cx = 62, cy = 58, r = 40, a = lat * Math.PI / 180;
    const px = cx + r * Math.cos(a), py = cy - r * Math.sin(a);
    const tgx = Math.sin(a), tgy = Math.cos(a); // direction de l'horizon (tangente)
    const dec = -52.7 * Math.PI / 180, ux = Math.cos(dec), uy = -Math.sin(dec); // vers Canopus
    const visible = 90 - lat - 52.7 > 0;
    let rayons = "";
    for (const o of [-10, 0, 10]) { // rayons parallèles venant de Canopus ; celui du milieu arrive sur le voyageur
      const fx = px - o * uy, fy = py + o * ux;
      rayons += `<line class="rayon-etoile" x1="${fx + ux * 60}" y1="${fy + uy * 60}" x2="${fx}" y2="${fy}"/>`;
    }
    v.modeleRonde.innerHTML = svg("0 0 160 110", "Modélisation : Terre ronde", `
      <circle class="boule" cx="${cx}" cy="${cy}" r="${r}"/>
      <line class="equateur" x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}"/>
      ${rayons}<text class="nom-etoile modele" x="150" y="108" text-anchor="end">vers Canopus</text>
      <line class="horizon-modele ${visible ? "voit" : ""}" x1="${px - tgx * 30}" y1="${py - tgy * 30}" x2="${px + tgx * 30}" y2="${py + tgy * 30}"/>
      <g transform="rotate(${90 - lat} ${px} ${py})">${bonhomme(px, py, 10, "voyageur")}</g>`);

    api.message(`Le voyageur est près de <strong>${ville.nom}</strong> (latitude ${Math.round(lat)}° N).`);
    if (t > 0.97 && !vu) { vu = true; api.terminer("En Égypte, Canopus s'est levée au-dessus de l'horizon sud… mais seulement sur la Terre ronde !"); }
  }
  v.curseur.addEventListener("input", dessiner);
  dessiner();
}

// ===================== 3. Les éclipses de Lune =====================
export function popupEclipses(zone, api) {
  const U = 17, O = 80; // pixels par unité, origine du repère
  zone.innerHTML = `
    <p class="aide-popup">Fais glisser la Lune (ou utilise le curseur). Le Soleil est toujours à l'opposé de la Lune : c'est ce qui crée une éclipse de Lune.</p>
    <div class="duo">
      ${["plate", "ronde"].map((c) => `
      <figure class="cote ${c}">
        <figcaption>${c === "plate" ? "Terre plate (un disque)" : "Terre ronde (une boule)"}</figcaption>
        <div class="repere"></div>
        <p class="vue-titre">L'ombre vue sur la Lune</p>
        <div class="ombre"></div>
      </figure>`).join("")}
    </div>
    <div class="reglage large">
      <input type="range" min="0" max="360" value="100" aria-label="Position de la Lune autour de la Terre (angle en degrés)">
    </div>`;
  const curseur = zone.querySelector("input");
  const reperes = [...zone.querySelectorAll(".repere")];
  const ombres = [...zone.querySelectorAll(".ombre")];
  let lune = { d: 3.2, phi: 100 * Math.PI / 180 };
  let rond = false, ligne = false, fini = false;

  function axes() {
    let s = `<line class="axe" x1="8" y1="${O}" x2="152" y2="${O}"/><line class="axe" x1="${O}" y1="8" x2="${O}" y2="152"/>`;
    for (let i = -4; i <= 4; i++) {
      if (!i) continue;
      s += `<line class="graduation" x1="${O + i * U}" y1="${O - 2}" x2="${O + i * U}" y2="${O + 2}"/><line class="graduation" x1="${O - 2}" y1="${O - i * U}" x2="${O + 2}" y2="${O - i * U}"/>`;
      if (i % 2 === 0) s += `<text class="valeur-axe" x="${O + i * U}" y="${O + 10}" text-anchor="middle">${i}</text><text class="valeur-axe" x="${O - 5}" y="${O - i * U + 3}" text-anchor="end">${i}</text>`;
    }
    return s;
  }

  function repere(plate) {
    const ux = Math.cos(lune.phi), uy = Math.sin(lune.phi);
    const mx = O + lune.d * ux * U, my = O - lune.d * uy * U;
    // demi-largeur de l'ombre perpendiculairement aux rayons
    const demi = 0.9 * (plate ? Math.abs(uy) : 1);
    const nx = -uy, ny = ux; // perpendiculaire (repère mathématique)
    const P = (s, l) => `${O + (s * ux + l * nx) * U},${O - (s * uy + l * ny) * U}`;
    const ombre = `<polygon class="cone-ombre" points="${P(0, demi)} ${P(4.6, demi)} ${P(4.6, -demi)} ${P(0, -demi)}"/>`;
    let rayons = "";
    for (const l of [-1.4, -0.5, 0.5, 1.4]) rayons += `<line class="rayon-soleil" x1="${O + (-4.8 * ux + l * nx) * U}" y1="${O - (-4.8 * uy + l * ny) * U}" x2="${O + (-1.4 * ux + l * nx) * U}" y2="${O - (-1.4 * uy + l * ny) * U}"/>`;
    const terre = plate
      ? `<rect class="disque" x="${O - 0.9 * U}" y="${O - 0.1 * U}" width="${1.8 * U}" height="${0.2 * U}" rx="1"/>`
      : `<circle class="boule" cx="${O}" cy="${O}" r="${0.9 * U}"/>`;
    return svg("0 0 160 160", plate ? "Repère : Terre plate, Soleil et Lune" : "Repère : Terre ronde, Soleil et Lune", `
      ${axes()}${ombre}${rayons}
      <text class="soleil-texte" x="${O - 4.4 * ux * U}" y="${O + 4.4 * uy * U + 3}" text-anchor="middle">☀</text>
      ${terre}
      <g class="lune-poignee" tabindex="0" role="slider" aria-label="Lune : glisser pour la déplacer" aria-valuenow="${Math.round(lune.phi * 180 / Math.PI)}">
        <circle class="zone-doigt" cx="${mx}" cy="${my}" r="14"/>
        <circle class="lune" cx="${mx}" cy="${my}" r="${0.32 * U}"/>
      </g>`);
  }

  function ombreSurLune(plate, id) {
    const s = plate ? Math.abs(Math.sin(lune.phi)) : 1;
    const R = 20, A = 2.7 * R, B = Math.max(A * s, 0.6);
    const cy = 52 - R * 0.35 - B; // le bord bas de l'ombre traverse la Lune
    return svg("0 0 160 80", "Forme de l'ombre de la Terre sur la Lune", `
      <defs><clipPath id="${id}"><circle cx="80" cy="52" r="${R}"/></clipPath></defs>
      <ellipse class="ombre-contour" cx="80" cy="${cy}" rx="${A}" ry="${B}"/>
      <circle class="lune-grande" cx="80" cy="52" r="${R}"/>
      <ellipse class="ombre-sur-lune" clip-path="url(#${id})" cx="80" cy="${cy}" rx="${A}" ry="${B}"/>`);
  }

  function dessiner() {
    reperes[0].innerHTML = repere(true);
    reperes[1].innerHTML = repere(false);
    ombres[0].innerHTML = ombreSurLune(true, "clip-lune-p");
    ombres[1].innerHTML = ombreSurLune(false, "clip-lune-r");
    curseur.value = Math.round(((lune.phi * 180 / Math.PI) % 360 + 360) % 360);

    const s = Math.abs(Math.sin(lune.phi));
    if (s > 0.92) rond = true;
    if (s < 0.3) ligne = true;
    const forme = s > 0.92 ? "ronde" : s < 0.3 ? "presque une ligne droite" : "ovale";
    if (rond && ligne && !fini) { fini = true; api.terminer("Le disque donne des ombres de toutes les formes ; la boule, toujours une ombre ronde."); }
    else if (!fini) api.message(`Ombre du disque : <strong>${forme}</strong>. Ombre de la boule : <strong>ronde</strong>.`);
  }

  curseur.addEventListener("input", () => { lune.phi = curseur.value * Math.PI / 180; dessiner(); });
  for (const r of reperes) {
    let glisse = false;
    const deplacer = (e) => {
      const b = r.querySelector("svg").getBoundingClientRect();
      const x = ((e.clientX - b.left) / b.width * 160 - O) / U;
      const y = -((e.clientY - b.top) / b.height * 160 - O) / U;
      lune = { d: Math.min(4, Math.max(2, Math.hypot(x, y))), phi: Math.atan2(y, x) };
      dessiner();
    };
    r.addEventListener("pointerdown", (e) => {
      if (!e.target.closest(".lune-poignee")) return;
      glisse = true;
      try { r.setPointerCapture(e.pointerId); } catch {}
      e.preventDefault();
    });
    r.addEventListener("pointermove", (e) => glisse && deplacer(e));
    r.addEventListener("pointerup", () => (glisse = false));
    r.addEventListener("keydown", (e) => {
      const pas = { ArrowLeft: 5, ArrowUp: 5, ArrowRight: -5, ArrowDown: -5 }[e.key];
      if (!pas) return;
      e.preventDefault();
      lune.phi += pas * Math.PI / 180;
      dessiner();
      r.querySelector(".lune-poignee").focus();
    });
  }
  dessiner();
}
