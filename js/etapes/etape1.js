// Étape 1 : le puits de Syène. L'élève déplace le Soleil jusqu'à éclairer tout le fond du puits.
const rad = (d) => d * Math.PI / 180;
const ECART = 7.2; // angle réel entre Alexandrie et Syène, vu du centre de la Terre

function soleil(x, y, r = 13) {
  let rayons = "";
  for (let k = 0; k < 12; k++) {
    const a = k * Math.PI / 6;
    rayons += `<line x1="${x + Math.cos(a) * (r + 3)}" y1="${y + Math.sin(a) * (r + 3)}" x2="${x + Math.cos(a) * (r + 9)}" y2="${y + Math.sin(a) * (r + 9)}"/>`;
  }
  return `<g class="soleil"><circle cx="${x}" cy="${y}" r="${r}"/>${rayons}</g>`;
}

export function popupPuits(zone, api) {
  zone.innerHTML = `
    <div class="scene-terre"></div>
    <div class="duo">
      <figure class="cote"><figcaption>Le puits de Syène</figcaption><div class="puits"></div></figure>
      <figure class="cote"><figcaption>L'obélisque d'Alexandrie</figcaption><div class="obelisque"></div></figure>
    </div>
    <div class="reglage large">
      <button type="button" class="rond moins" aria-label="Déplacer le Soleil vers la gauche">−</button>
      <input type="range" min="-15" max="15" step="0.25" value="9" aria-label="Position du Soleil">
      <button type="button" class="rond plus" aria-label="Déplacer le Soleil vers la droite">+</button>
    </div>`;
  const curseur = zone.querySelector("input");
  const scene = zone.querySelector(".scene-terre");
  const puits = zone.querySelector(".puits");
  const obel = zone.querySelector(".obelisque");
  let fini = false;

  function dessiner() {
    const b = +curseur.value; // inclinaison des rayons par rapport à la verticale de Syène (degrés)
    const dx = Math.sin(rad(b)), dy = Math.cos(rad(b));

    // Vue d'ensemble : l'écart Alexandrie–Syène est agrandi (20° au lieu de 7,2°).
    const O = [160, 330], R = 230, A = rad(-20);
    const S = [160, 100], Al = [O[0] + R * Math.sin(A), O[1] - R * Math.cos(A)];
    const Ob = [O[0] + (R + 26) * Math.sin(A), O[1] - (R + 26) * Math.cos(A)];
    let rayons = "";
    for (let x = 20; x <= 320; x += 22) rayons += `<line class="rayon" x1="${x - dx * 30}" y1="${-dy * 30 + 10}" x2="${x + dx * 140}" y2="${10 + dy * 140}"/>`;
    scene.innerHTML = `<svg viewBox="0 0 320 175" role="img" aria-label="La Terre, Syène, Alexandrie et les rayons du Soleil">
      <rect class="ciel-clair" width="320" height="175"/>${rayons}
      <circle class="boule" cx="${O[0]}" cy="${O[1]}" r="${R}"/>
      <rect class="puits-trou" x="${S[0] - 3}" y="${S[1]}" width="6" height="10"/>
      <line class="obel-trait" x1="${Al[0]}" y1="${Al[1]}" x2="${Ob[0]}" y2="${Ob[1]}"/>
      <text class="lieu" x="${S[0] + 8}" y="${S[1] + 18}">Syène</text>
      <text class="lieu" x="${Al[0] - 6}" y="${Al[1] + 18}" text-anchor="end">Alexandrie</text>
      ${soleil(160 - dx * 60, 22)}
      <text class="note-echelle" x="316" y="170" text-anchor="end">écart entre les villes agrandi</text>
    </svg>`;

    // Le puits : profond et étroit. La paroi fait de l'ombre sur le fond dès que les rayons sont inclinés.
    const g = 50; // bord gauche du puits (largeur 24, profondeur 72)
    const haut = 22, fond = haut + 72;
    const decal = 72 * Math.tan(rad(b));
    const eclaireG = Math.max(g, g + decal), eclaireD = Math.min(g + 24, g + 24 + decal);
    const eclaire = Math.max(0, eclaireD - eclaireG) / 24;
    puits.innerHTML = `<svg viewBox="0 0 140 110" role="img" aria-label="Coupe du puits : fond éclairé à ${Math.round(eclaire * 100)} %">
      <rect class="ciel" width="140" height="${haut}"/>
      <rect class="sable" y="${haut}" width="140" height="${110 - haut}"/>
      <rect class="trou" x="${g}" y="${haut}" width="24" height="72"/>
      ${eclaire > 0 ? `<polygon class="lumiere" points="${g},${haut} ${g + 24},${haut} ${eclaireD},${fond} ${eclaireG},${fond}"/>` : ""}
      <line class="fond-eclaire" x1="${eclaireG}" y1="${fond}" x2="${Math.max(eclaireG, eclaireD)}" y2="${fond}"/>
      <text class="mesure" x="70" y="106" text-anchor="middle">fond éclairé : ${Math.round(eclaire * 100)} %</text>
    </svg>`;

    // L'obélisque : à Alexandrie, les rayons arrivent inclinés de 7,2° de plus.
    const angle = b + ECART;
    const hO = 62, base = 92, xo = 62;
    const ombre = hO * Math.tan(rad(angle));
    obel.innerHTML = `<svg viewBox="0 0 140 110" role="img" aria-label="Obélisque d'Alexandrie et son ombre">
      <rect class="ciel" width="140" height="${base}"/>
      <rect class="sable" y="${base}" width="140" height="${110 - base}"/>
      <polygon class="ombre-sol" points="${xo - 4},${base} ${xo + 4},${base} ${xo + ombre + 1},${base + 4} ${xo + ombre - 1},${base + 4}"/>
      <line class="rayon fort" x1="${xo - Math.sin(rad(angle)) * 40}" y1="${base - hO - Math.cos(rad(angle)) * 40}" x2="${xo + ombre}" y2="${base}"/>
      <polygon class="obel" points="${xo - 5},${base} ${xo + 5},${base} ${xo + 3},${base - hO + 6} ${xo},${base - hO} ${xo - 3},${base - hO + 6}"/>
      <text class="mesure" x="70" y="106" text-anchor="middle">${Math.abs(ombre) < 0.5 ? "pas d'ombre" : "une ombre !"}</text>
    </svg>`;

    if (b === 0) {
      if (!fini) { fini = true; api.terminer("Le fond du puits est entièrement éclairé : le Soleil est exactement à la verticale de Syène. Et pourtant, à Alexandrie, l'obélisque a une ombre !"); }
    } else if (!fini) {
      api.message(eclaire < 1 ? "Le fond du puits est encore en partie dans l'ombre." : "");
    }
  }
  curseur.addEventListener("input", dessiner);
  zone.querySelector(".moins").addEventListener("click", () => { curseur.stepDown(); dessiner(); });
  zone.querySelector(".plus").addEventListener("click", () => { curseur.stepUp(); dessiner(); });
  dessiner();
}
