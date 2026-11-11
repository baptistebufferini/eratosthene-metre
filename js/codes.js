// Codes de l'élève : un même format sert de code de reprise (à chaque étape) et de code final.
// Il contient l'étape en cours, les étapes réussies, les erreurs et les indices, et une
// signature liée au nom. Il se vérifie sans serveur, mais il ne résiste pas à quelqu'un
// qui lirait ce fichier : c'est une protection contre la triche ordinaire, pas un coffre-fort.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // sans 0/O ni 1/I, faciles à confondre
const SEL = "eratosthene-250000-stades";
const NB_CAR = 10;

export function normaliserNom(nom) {
  return String(nom).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function fnv(texte) { // empreinte FNV-1a sur 32 bits
  let h = 0x811c9dc5;
  for (const c of texte) {
    h ^= c.codePointAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

// Disposition des 50 bits : étape (5) | masque des étapes réussies (16) | erreurs (8) | indices (8) | signature (13)
export function encoderCode(nom, { etape, masque, erreurs, indices }) {
  const n = normaliserNom(nom);
  const donnees = (BigInt(Math.min(etape, 31)) << 32n) | (BigInt(masque & 0xffff) << 16n)
    | (BigInt(Math.min(erreurs, 255)) << 8n) | BigInt(Math.min(indices, 255));
  const signature = BigInt(fnv(`${SEL}|${n}|${donnees}`) & 0x1fff);
  const brouillage = (BigInt(fnv(`${n}|${SEL}`)) << 5n) & ((1n << 37n) - 1n);
  let v = ((donnees ^ brouillage) << 13n) | signature;
  let s = "";
  for (let i = 0; i < NB_CAR; i++) { s = ALPHABET[Number(v & 31n)] + s; v >>= 5n; }
  return `${s.slice(0, 5)}-${s.slice(5)}`;
}

// Renvoie les données si le code correspond au nom, sinon null.
export function decoderCode(nom, code) {
  const s = String(code).toUpperCase().replace(/[^0-9A-Z]/g, "");
  if (s.length !== NB_CAR) return null;
  let v = 0n;
  for (const c of s) {
    const k = ALPHABET.indexOf(c);
    if (k < 0) return null;
    v = (v << 5n) | BigInt(k);
  }
  const n = normaliserNom(nom);
  const signature = v & 0x1fffn;
  const brouillage = (BigInt(fnv(`${n}|${SEL}`)) << 5n) & ((1n << 37n) - 1n);
  const donnees = (v >> 13n) ^ brouillage;
  if (BigInt(fnv(`${SEL}|${n}|${donnees}`) & 0x1fff) !== signature) return null;
  return {
    etape: Number(donnees >> 32n),
    masque: Number((donnees >> 16n) & 0xffffn),
    erreurs: Number((donnees >> 8n) & 0xffn),
    indices: Number(donnees & 0xffn),
  };
}

// Étapes qui comptent dans le masque (ni diplôme ni transition), dans l'ordre du contenu.
export const etapesNotees = (etapes) => etapes.filter((e) => e.type !== "diplome" && !e.transition);

export function masqueDe(etapes, reussies) {
  return etapesNotees(etapes).reduce((m, e, i) => (reussies.includes(e.id) ? m | (1 << i) : m), 0);
}

export function reussiesDe(etapes, masque) {
  return etapesNotees(etapes).filter((_, i) => masque & (1 << i)).map((e) => e.id);
}
