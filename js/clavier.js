// Clavier mathématique à l'écran. Le clavier physique reste utilisable sur ordinateur.
const TOUCHES = [
  ["7", "8", "9", "÷", "⌫"],
  ["4", "5", "6", "×", "("],
  ["1", "2", "3", "−", ")"],
  ["0", ",", "/", "+", "%"],
  ["°", "^", "espace", "fermer", "valider"],
];
const LIBELLES = { espace: "␣", fermer: "▾", valider: "Valider", "/": "a/b" };
const ARIA = { "⌫": "Effacer", espace: "Espace", fermer: "Fermer le clavier", valider: "Valider", "/": "Fraction", "^": "Puissance" };

export class Clavier {
  constructor(racine) {
    this.racine = racine;
    this.champ = null;
    racine.setAttribute("role", "group");
    racine.setAttribute("aria-label", "Clavier mathématique");
    for (const ligne of TOUCHES) for (const t of ligne) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "touche" + (t === "valider" ? " touche-valider" : "") + (/[0-9,]/.test(t) && t.length === 1 ? " touche-chiffre" : "");
      b.textContent = LIBELLES[t] || t;
      if (ARIA[t]) b.setAttribute("aria-label", ARIA[t]);
      // pointerdown + preventDefault : le champ garde le focus et le curseur
      b.addEventListener("pointerdown", (e) => e.preventDefault());
      b.addEventListener("click", () => this.taper(t));
      racine.append(b);
    }
  }

  ouvrir(champ, valider) {
    this.champ = champ;
    this.valider = valider;
    this.racine.hidden = false;
    document.body.classList.add("clavier-ouvert");
    setTimeout(() => champ.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  }

  fermer() {
    this.racine.hidden = true;
    document.body.classList.remove("clavier-ouvert");
    this.champ = null;
  }

  taper(t) {
    const c = this.champ;
    if (!c || c.disabled) return;
    if (t === "fermer") return this.fermer();
    if (t === "valider") return this.valider?.();
    const debut = c.selectionStart ?? c.value.length;
    const fin = c.selectionEnd ?? c.value.length;
    if (t === "⌫") {
      const de = debut === fin ? Math.max(0, debut - 1) : debut;
      c.setRangeText("", de, fin, "end");
    } else {
      c.setRangeText(t === "espace" ? " " : t, debut, fin, "end");
    }
    c.focus();
    c.dispatchEvent(new Event("input", { bubbles: true }));
  }
}
