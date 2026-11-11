// Effet livre pop-up : le parchemin s'incline, le schéma se dresse devant, puis se replie.
import { el, maths, reduireMouvement } from "./outils.js";
import { son } from "./son.js";

const scene = document.getElementById("scene-popup");

export function ouvrirPopup(bloc, monter) {
  return new Promise((fini) => {
    const retourFocus = document.activeElement;
    scene.innerHTML = "";
    const carte = el("div", "carte-popup");
    carte.setAttribute("role", "dialog");
    carte.setAttribute("aria-modal", "true");
    carte.setAttribute("aria-label", bloc.titre || "Schéma interactif");
    carte.tabIndex = -1;
    if (bloc.large) carte.classList.add("large");
    const consigne = el("p", "popup-consigne", bloc.consigne);
    const zone = el("div", "popup-zone");
    const etat = el("p", "popup-etat");
    etat.setAttribute("aria-live", "polite");
    const replier = el("button", "bouton-replier", "Replier le schéma");
    replier.disabled = true;
    carte.append(consigne, zone, etat, replier);
    scene.append(carte);
    scene.hidden = false;
    maths(carte);

    document.body.classList.add("popup-ouvert");
    son("deplie");
    requestAnimationFrame(() => carte.classList.add("dressee"));
    carte.focus({ preventScroll: true });

    monter(zone, {
      message(html) { etat.innerHTML = html; maths(etat); },
      terminer(html) {
        if (html) { etat.innerHTML = html; maths(etat); }
        carte.classList.add("terminee");
        replier.disabled = false;
        replier.focus({ preventScroll: true });
      },
    });

    const fermer = () => {
      document.removeEventListener("keydown", clavier);
      carte.classList.remove("dressee");
      document.body.classList.remove("popup-ouvert");
      son("deplie");
      setTimeout(() => {
        scene.hidden = true;
        scene.innerHTML = "";
        retourFocus?.focus?.({ preventScroll: true });
        fini();
      }, reduireMouvement() ? 0 : 700);
    };
    const clavier = (e) => { if (e.key === "Escape" && !replier.disabled) fermer(); };
    document.addEventListener("keydown", clavier);
    replier.addEventListener("click", fermer);
  });
}
