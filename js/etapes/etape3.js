// Étape 3 : reporter l'angle de 7,2° au centre de la Terre (angles alternes-internes).
// L'élève fait glisser l'étiquette « 7,2° » (ou touche une zone) vers l'angle qui lui est égal.
const rad = (d) => d * Math.PI / 180;
const O = [160, 236], R = 150, ECART = -20; // écart agrandi pour la lisibilité
const pt = (deg, r) => [O[0] + r * Math.sin(rad(deg)), O[1] - r * Math.cos(rad(deg))];
const S = pt(0, R), A = pt(ECART, R), P = pt(ECART, R + 56); // Syène, Alexandrie, sommet de l'obélisque

function arc(c, r, de, a) { // arc de cercle autour de c, angles en degrés (0 = vers le haut, sens horaire)
  const p1 = [c[0] + r * Math.sin(rad(de)), c[1] - r * Math.cos(rad(de))];
  const p2 = [c[0] + r * Math.sin(rad(a)), c[1] - r * Math.cos(rad(a))];
  return `M${p1[0]} ${p1[1]} A${r} ${r} 0 0 ${a > de ? 1 : 0} ${p2[0]} ${p2[1]}`;
}

const ZONES = [
  { id: "centre", c: pt(ECART / 2, 46), juste: true, arc: arc(O, 34, ECART, 0), texte: [O[0] - 5, O[1] - 46] },
  { id: "syene", c: [S[0] + 20, S[1] + 10], arc: arc(S, 16, 90, 180) },
  { id: "pied", c: pt(ECART - 6, R - 18), arc: arc(A, 16, 180 + ECART, 270 + ECART) },
];

export function popupAngleCentre(zone, api) {
  const solP = O[1] - Math.sqrt(R * R - (P[0] - O[0]) ** 2); // où le rayon du sommet touche le sol
  zone.innerHTML = `
    <svg class="scene-placement" viewBox="0 0 320 260" role="img" aria-label="Coupe de la Terre : rayons parallèles, centre, Syène, Alexandrie et l'obélisque">
      <rect class="ciel-clair" width="320" height="260"/>
      <circle class="boule" cx="${O[0]}" cy="${O[1]}" r="${R}"/>
      <line class="rayon fort" x1="${S[0]}" y1="0" x2="${S[0]}" y2="${S[1]}"/>
      <line class="rayon fort" x1="${P[0]}" y1="0" x2="${P[0]}" y2="${solP}"/>
      <line class="prolonge" x1="${O[0]}" y1="${O[1]}" x2="${S[0]}" y2="${S[1]}"/>
      <line class="prolonge" x1="${O[0]}" y1="${O[1]}" x2="${P[0]}" y2="${P[1]}"/>
      <line class="obel-trait" x1="${A[0]}" y1="${A[1]}" x2="${P[0]}" y2="${P[1]}"/>
      <path class="arc-donne" d="${arc(P, 30, 180, 180 + ECART)}"/>
      <text class="etiquette-donnee" x="${P[0] - 6}" y="${P[1] + 44}" text-anchor="end">7,2°</text>
      <circle class="centre-terre" cx="${O[0]}" cy="${O[1]}" r="3"/>
      <text class="lieu" x="${O[0] + 8}" y="${O[1] + 4}">centre</text>
      <text class="lieu" x="${S[0] + 6}" y="${S[1] - 6}">Syène</text>
      <text class="lieu" x="${A[0] - 22}" y="${A[1] + 6}" text-anchor="end">Alexandrie</text>
      ${ZONES.map((z, n) => `<g class="zone-depot" data-n="${n}" tabindex="0" role="button" aria-label="Déposer l'étiquette ici (zone ${n + 1})">
        <path class="zone-arc" d="${z.arc}"/><circle cx="${z.c[0]}" cy="${z.c[1]}" r="14"/></g>`).join("")}
      <g class="etiquette" transform="translate(262 40)"><rect x="-26" y="-14" width="52" height="28" rx="8"/><text y="5" text-anchor="middle">7,2°</text></g>
      <text class="note-echelle" x="316" y="256" text-anchor="end">écart entre les villes agrandi</text>
    </svg>`;
  const svgEl = zone.querySelector("svg");
  const etiquette = zone.querySelector(".etiquette");
  let pos = [262, 40], prise = false, fini = false;

  const placer = (p) => { pos = p; etiquette.setAttribute("transform", `translate(${p[0]} ${p[1]})`); };
  function deposer(n) {
    if (fini) return;
    const z = ZONES[n];
    placer(z.c);
    zone.querySelectorAll(".zone-depot").forEach((g) => g.classList.toggle("choisie", g.dataset.n == n));
    if (z.juste) {
      fini = true;
      etiquette.classList.add("juste");
      api.terminer("Oui ! L'angle au centre de la Terre est égal à l'angle mesuré au sommet de l'obélisque.");
    } else {
      etiquette.classList.add("faux");
      setTimeout(() => { etiquette.classList.remove("faux"); placer([262, 40]); }, 900);
      api.message(n === 1 ? "À Syène, il n'y a pas d'angle avec le rayon : il arrive tout droit." : "Cet angle-là n'est pas égal à 7,2°. Cherche l'angle formé par les deux droites qui passent par le centre de la Terre.");
    }
  }

  const versSvg = (e) => {
    const p = svgEl.createSVGPoint();
    p.x = e.clientX; p.y = e.clientY;
    const q = p.matrixTransform(svgEl.getScreenCTM().inverse());
    return [q.x, q.y];
  };
  etiquette.addEventListener("pointerdown", (e) => { if (fini) return; prise = true; try { etiquette.setPointerCapture(e.pointerId); } catch {} e.preventDefault(); });
  etiquette.addEventListener("pointermove", (e) => prise && placer(versSvg(e)));
  etiquette.addEventListener("pointerup", () => {
    if (!prise) return;
    prise = false;
    const proche = ZONES.map((z, n) => [Math.hypot(z.c[0] - pos[0], z.c[1] - pos[1]), n]).sort((a, b) => a[0] - b[0])[0];
    if (proche[0] < 30) deposer(proche[1]);
  });
  zone.querySelectorAll(".zone-depot").forEach((g) => {
    g.addEventListener("click", () => deposer(+g.dataset.n));
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); deposer(+g.dataset.n); } });
  });
  api.message("Fais glisser l'étiquette « 7,2° » sur l'angle qui lui est égal (ou touche cet angle).");
}
