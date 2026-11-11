// Calculatrice intégrée : disponible seulement aux étapes qui l'autorisent (champ "calculatrice" de l'étape).
// Elle réutilise le clavier mathématique et le lecteur d'expressions de la correction.
import { lireNombre } from "./correction.js";

const format = (x) => {
  const r = Math.round(x * 1e9) / 1e9;
  return r.toLocaleString("fr-FR", { maximumFractionDigits: 9 });
};

export class Calculatrice {
  constructor(racine, clavier) {
    this.racine = racine;
    this.clavier = clavier;
    racine.innerHTML = `
      <button type="button" class="calc-bouton" aria-expanded="false">🧮 Calculatrice</button>
      <div class="calc-panneau" hidden>
        <input class="calc-ecran" inputmode="none" autocomplete="off" aria-label="Calcul à effectuer">
        <output class="calc-resultat" aria-live="polite"></output>
      </div>`;
    this.bouton = racine.querySelector(".calc-bouton");
    this.panneau = racine.querySelector(".calc-panneau");
    this.ecran = racine.querySelector(".calc-ecran");
    this.resultat = racine.querySelector(".calc-resultat");
    const calculer = () => {
      const v = lireNombre(this.ecran.value);
      this.resultat.textContent = v === null ? "Calcul illisible" : `= ${format(v)}`;
    };
    this.bouton.addEventListener("click", () => {
      const ouvrir = this.panneau.hidden;
      this.panneau.hidden = !ouvrir;
      this.bouton.setAttribute("aria-expanded", ouvrir);
      if (ouvrir) this.ecran.focus(); else this.clavier.fermer();
    });
    this.ecran.addEventListener("focus", () => this.clavier.ouvrir(this.ecran, calculer));
    this.ecran.addEventListener("keydown", (e) => { if (e.key === "Enter") calculer(); });
    this.autoriser(false);
  }

  autoriser(oui) {
    this.racine.hidden = !oui;
    if (!oui) { this.panneau.hidden = true; this.bouton.setAttribute("aria-expanded", "false"); }
  }
}
