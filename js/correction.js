// Correction souple : lit ce que l'élève tape (virgule ou point, fractions, %,
// ×, ÷, puissances, espaces de milliers) et compare à la valeur attendue.

const CLE = "eratosthene";

// Brouillage des réponses : obscurcit seulement, ne protège pas un élève qui lit le JavaScript.
export function brouiller(valeur) {
  const s = JSON.stringify(valeur);
  let out = "";
  for (let i = 0; i < s.length; i++) out += String.fromCharCode(s.charCodeAt(i) ^ CLE.charCodeAt(i % CLE.length));
  return btoa(unescape(encodeURIComponent(out)));
}

export function debrouiller(code) {
  const s = decodeURIComponent(escape(atob(code)));
  let out = "";
  for (let i = 0; i < s.length; i++) out += String.fromCharCode(s.charCodeAt(i) ^ CLE.charCodeAt(i % CLE.length));
  return JSON.parse(out);
}

// Transforme la saisie en nombre, ou renvoie null si elle est illisible.
export function lireNombre(saisie) {
  let s = String(saisie).trim().toLowerCase()
    .replace(/[  ]/g, " ")
    .replace(/×|x|\*/g, "*")
    .replace(/÷|:/g, "/")
    .replace(/−|–/g, "-")
    .replace(/°/g, "");
  // espaces de milliers (« 250 000 ») avant de traiter la virgule décimale
  s = s.replace(/(\d)\s+(?=\d{3}\b)/g, "$1").replace(/\s+/g, "");
  s = s.replace(/(\d),(\d)/g, "$1.$2");
  if (!s || !/^[0-9.+\-*/^()%]+$/.test(s)) return null;
  const jetons = s.match(/\d*\.?\d+|[+\-*/^()%]/g);
  if (!jetons || jetons.join("") !== s) return null;
  let i = 0;
  const voir = () => jetons[i];
  const prendre = () => jetons[i++];

  function expression() {
    let v = terme();
    while (voir() === "+" || voir() === "-") v = prendre() === "+" ? v + terme() : v - terme();
    return v;
  }
  function terme() {
    let v = facteur();
    while (voir() === "*" || voir() === "/") v = prendre() === "*" ? v * facteur() : v / facteur();
    return v;
  }
  function facteur() {
    let v = unaire();
    if (voir() === "^") { prendre(); v = Math.pow(v, facteur()); }
    while (voir() === "%") { prendre(); v /= 100; }
    return v;
  }
  function unaire() {
    if (voir() === "-") { prendre(); return -unaire(); }
    if (voir() === "+") { prendre(); return unaire(); }
    if (voir() === "(") {
      prendre();
      const v = expression();
      if (prendre() !== ")") throw new Error("parenthèse");
      return v;
    }
    const t = prendre();
    if (t === undefined || !/^\d*\.?\d+$/.test(t)) throw new Error("nombre");
    return parseFloat(t);
  }

  try {
    const v = expression();
    return i === jetons.length && Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

// tolerance : écart relatif accepté (0.01 = 1 %), pour les arrondis raisonnables.
export function estJuste(saisie, attendu, tolerance = 0.005) {
  const v = lireNombre(saisie);
  if (v === null) return null;
  if (attendu === 0) return Math.abs(v) < 1e-9;
  return Math.abs(v - attendu) <= Math.abs(attendu) * tolerance + 1e-12;
}
