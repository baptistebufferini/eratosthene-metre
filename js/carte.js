// Carte du panneau : le marcheur avance à chaque étape réussie.
// Partie 1 : l'Égypte, d'Alexandrie à Syène. Partie 2 : la France, de Dunkerque à Barcelone.
import { reduireMouvement } from "./outils.js";

// Égypte : x = (longitude − 28) × 35, y = (32 − latitude) × 30
const ROUTE_EGYPTE = "M66 24 C78 30 98 40 112 60 C111 75 109 82 108 87 C104 100 96 108 96 117 C98 130 108 138 112 144 C130 160 150 166 164 174 C163 180 161 185 161 189 C165 197 170 203 171 210 C172 220 171 230 171 237";
const NIL = "M84 18 C95 35 105 48 112 60 M133 18 C125 35 117 48 112 60 " + ROUTE_EGYPTE.slice(ROUTE_EGYPTE.indexOf("C111"));

// France : x = (longitude + 5,2) × 16, y = (51,6 − latitude) × 23 (contour très simplifié)
const fr = ([lon, lat]) => [(lon + 5.2) * 16, (51.6 - lat) * 23].map((v) => v.toFixed(1)).join(" ");
const CONTOUR_FRANCE = [[2.5, 51.1], [4.2, 49.95], [5.8, 49.5], [8.2, 49.0], [7.6, 47.6], [6.9, 47.3], [6.0, 46.2], [7.0, 45.9], [6.6, 45.1], [7.0, 44.2], [7.5, 43.8], [6.2, 43.1], [4.8, 43.4], [3.1, 43.1], [3.2, 42.4], [1.5, 42.5], [-0.3, 42.8], [-1.8, 43.4], [-1.2, 44.6], [-1.2, 46.2], [-2.2, 47.1], [-4.6, 47.9], [-4.7, 48.5], [-3.0, 48.8], [-1.6, 48.7], [-1.9, 49.7], [-1.3, 49.6], [0.1, 49.4], [1.4, 50.1], [1.6, 50.9]];
const VILLES_FRANCE = { Dunkerque: [2.38, 51.03], Paris: [2.35, 48.85], Rodez: [2.57, 44.35], Barcelone: [2.17, 41.38] };
const COTE_ESPAGNE = [[3.2, 42.4], [3.1, 41.9], [2.2, 41.4], [1.2, 41.1]];

const DECORS = {
  egypte: (c) => ({
    route: ROUTE_EGYPTE,
    fond: `<path class="mer" d="M0 0 H210 V20 C190 26 170 16 150 20 C135 22 120 14 100 18 C85 21 70 26 50 22 C30 20 15 26 0 24 Z"/>
      <text class="carte-legende" x="105" y="11">${c.mer}</text>
      <path class="nil" d="${NIL}"/><text class="carte-legende" x="122" y="118">Nil</text>`,
    villes: `<circle class="ville" cx="66" cy="24" r="3.5"/><text class="carte-ville" x="58" y="38" text-anchor="middle">${c.depart}</text>
      <circle class="ville" cx="171" cy="237" r="3.5"/><text class="carte-ville" x="150" y="241" text-anchor="end">${c.arrivee}</text>`,
  }),
  france: (c) => ({
    route: "M" + ["Dunkerque", "Paris", "Rodez", "Barcelone"].map((v) => fr(VILLES_FRANCE[v])).join(" L"),
    fond: `<path class="terre-carte" d="M${CONTOUR_FRANCE.map(fr).join(" L")} Z"/>
      <path class="cote-carte" d="M${COTE_ESPAGNE.map(fr).join(" L")}"/>
      <text class="carte-legende" x="40" y="160">${c.mer}</text>`,
    villes: Object.entries(VILLES_FRANCE).map(([nom, p]) => {
      const [x, y] = fr(p).split(" ");
      return `<circle class="ville" cx="${x}" cy="${y}" r="${nom === "Paris" || nom === "Rodez" ? 2.5 : 3.5}"/><text class="carte-ville${nom === "Paris" || nom === "Rodez" ? " petite" : ""}" x="${+x + 7}" y="${+y + 4}">${nom}</text>`;
    }).join(""),
  }),
};

let trace, marcheur, longueur, actuel = 0, texte = "", typeActuel = null;

export function dessinerCarte(conteneur, partie) {
  const c = partie.carte;
  if (typeActuel === c.type) return;
  typeActuel = c.type;
  const d = DECORS[c.type](c);
  conteneur.innerHTML = `
    <svg viewBox="0 0 210 250" role="img" aria-label="${c.titre}">
      ${d.fond}
      <path class="route" d="${d.route}"/>
      <path class="route-faite" d="${d.route}"/>
      ${d.villes}
      <g class="bematiste" aria-hidden="true">
        <circle r="7" class="bematiste-halo"/>
        <circle cy="-5" r="2.2"/><path d="M0 -3 V3 M0 3 L-2.5 7 M0 3 L2.5 7 M-3 -1 L3 0"/>
      </g>
    </svg>
    <p class="carte-texte" id="carte-texte"></p>`;
  trace = conteneur.querySelector(".route-faite");
  marcheur = conteneur.querySelector(".bematiste");
  longueur = trace.getTotalLength();
  trace.style.strokeDasharray = longueur;
  texte = c.progression;
  actuel = 0;
  poser(0);
}

function poser(f) {
  const p = trace.getPointAtLength(longueur * f);
  marcheur.setAttribute("transform", `translate(${p.x} ${p.y})`);
  trace.style.strokeDashoffset = longueur * (1 - f);
}

export function placerBematiste(fraction) {
  if (!trace) return;
  const cible = Math.max(0, Math.min(1, fraction));
  document.getElementById("carte-texte").textContent = texte.replace("{p}", Math.round(cible * 100));
  if (reduireMouvement()) { actuel = cible; return poser(cible); }
  const depart = actuel, t0 = performance.now(), duree = 1600;
  const pas = (t) => {
    const k = Math.min(1, (t - t0) / duree);
    actuel = depart + (cible - depart) * (1 - Math.cos(k * Math.PI)) / 2;
    poser(actuel);
    marcheur.classList.toggle("marche", k < 1);
    if (k < 1) requestAnimationFrame(pas);
  };
  requestAnimationFrame(pas);
}
