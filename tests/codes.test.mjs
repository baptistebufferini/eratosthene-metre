// Lancer : node tests/codes.test.mjs
import assert from "node:assert/strict";
import { encoderCode, decoderCode, normaliserNom, masqueDe, reussiesDe } from "../js/codes.js";

const d = { etape: 13, masque: 0b1011111111111, erreurs: 7, indices: 3 };
const code = encoderCode("Léa Martin", d);
assert.match(code, /^[2-9A-Z]{5}-[2-9A-Z]{5}$/);
assert.deepEqual(decoderCode("Léa Martin", code), d);
assert.deepEqual(decoderCode("  lea   MARTIN ", code.toLowerCase()), d, "nom et code tolérants (accents, casse, espaces)");
assert.equal(decoderCode("Léo Martin", code), null, "un autre nom ne valide pas le code");

// une faute de frappe dans le code est (presque toujours) détectée
let detectees = 0;
for (let i = 0; i < 11; i++) {
  if (code[i] === "-") continue;
  const autre = code.slice(0, i) + (code[i] === "Z" ? "Y" : "Z") + code.slice(i + 1);
  if (decoderCode("Léa Martin", autre) === null) detectees++;
}
assert.ok(detectees >= 9, `fautes détectées : ${detectees}/10`);

// valeurs plafonnées, pas d'erreur
assert.deepEqual(decoderCode("x", encoderCode("x", { etape: 40, masque: 0, erreurs: 999, indices: 300 })), { etape: 31, masque: 0, erreurs: 255, indices: 255 });

assert.equal(normaliserNom("  Zoé-Ève  "), "zoe eve");
const etapes = [{ id: "a" }, { id: "dip", type: "diplome" }, { id: "b" }, { id: "t", transition: true }, { id: "c" }];
assert.equal(masqueDe(etapes, ["a", "c"]), 0b101);
assert.deepEqual(reussiesDe(etapes, 0b101), ["a", "c"]);

console.log("codes : tous les tests passent");
