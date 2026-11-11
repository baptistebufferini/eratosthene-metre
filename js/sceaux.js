// Sceaux de cire : vert = attesté, orange = débattu, rouge = légende ou simplification.
import { el, maths } from "./outils.js";

const SENS = { vert: "Attesté par les sources", orange: "Débattu par les historiens", rouge: "Légende ou simplification" };

export function creerSceau(s, id) {
  if (!s) { console.warn(`Sceau inconnu : ${id}`); return document.createTextNode(""); }
  const boite = el("span", "sceau-boite");
  const bouton = el("button", `sceau ${s.couleur}`);
  bouton.type = "button";
  bouton.setAttribute("aria-label", `Sceau ${s.couleur} : ${SENS[s.couleur]}. Afficher l'explication`);
  bouton.setAttribute("aria-expanded", "false");
  const bulle = el("span", `bulle-sceau ${s.couleur}`,
    `<strong>${SENS[s.couleur]}</strong><span>${s.texte}</span>${s.source ? `<em>Source : ${s.source}</em>` : ""}`);
  bulle.hidden = true;
  bouton.addEventListener("click", (e) => {
    e.stopPropagation();
    const ouvrir = bulle.hidden;
    document.querySelectorAll(".bulle-sceau").forEach((b) => (b.hidden = true));
    document.querySelectorAll(".sceau").forEach((b) => b.setAttribute("aria-expanded", "false"));
    bulle.hidden = !ouvrir;
    bouton.setAttribute("aria-expanded", ouvrir);
    if (ouvrir) maths(bulle);
  });
  boite.append(bouton, bulle);
  return boite;
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".bulle-sceau")) document.querySelectorAll(".bulle-sceau").forEach((b) => (b.hidden = true));
});
