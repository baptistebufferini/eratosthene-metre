// Lancer : node tests/correction.test.mjs
import assert from "node:assert/strict";
import { lireNombre, estJuste, brouiller, debrouiller } from "../js/correction.js";

const cas = [
  ["1/50", 0.02], ["0,02", 0.02], ["0.02", 0.02], ["2%", 0.02], ["2 %", 0.02],
  ["7,2/360", 0.02], ["7,2 ÷ 360", 0.02], ["250 000", 250000], ["250000", 250000],
  ["5 000 × 50", 250000], ["5000x50", 250000], ["10^7", 1e7], ["-3", -3],
  ["(1+1)/100", 0.02], ["7,2°", 7.2], ["0,513", 0.513],
];
for (const [s, v] of cas) assert.ok(Math.abs(lireNombre(s) - v) < 1e-9, `${s} → ${lireNombre(s)}`);
for (const s of ["", "abc", "1/", "1//2", "(1", "1,2,3", "alert(1)"]) assert.equal(lireNombre(s), null, s);

assert.equal(estJuste("1/50", 0.02), true);
assert.equal(estJuste("1/49", 0.02), false);
assert.equal(estJuste("0,513", 0.513074, 0.005), true);
assert.equal(estJuste("0,5", 0.513074, 0.005), false);
assert.equal(estJuste("bof", 0.02), null);

for (const v of [0.02, 250000, "1/50", 2, { a: 1 }]) assert.deepEqual(debrouiller(brouiller(v)), v);

console.log("correction : tous les tests passent");
