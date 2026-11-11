// Bruitages synthétisés (Web Audio) : aucun fichier son à télécharger.
// shortcut: sons de synthèse simples ; remplacer par des enregistrements CC0 au lot 4 si on veut plus de réalisme.
let ctx = null;
let coupe = false;
try { coupe = localStorage.getItem("eratosthene-son") === "coupe"; } catch {}

export const sonCoupe = () => coupe;
export function basculerSon() {
  coupe = !coupe;
  try { localStorage.setItem("eratosthene-son", coupe ? "coupe" : "actif"); } catch {}
  return coupe;
}

function bruit(duree, frequence, volume, q = 1) {
  const n = ctx.sampleRate * duree;
  const tampon = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = tampon.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const src = ctx.createBufferSource();
  src.buffer = tampon;
  const filtre = Object.assign(ctx.createBiquadFilter(), { type: "bandpass" });
  filtre.frequency.value = frequence;
  filtre.Q.value = q;
  const g = ctx.createGain();
  g.gain.value = volume;
  src.connect(filtre).connect(g).connect(ctx.destination);
  src.start();
}

function note(freq, debut, duree, volume) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "triangle";
  o.frequency.value = freq;
  const t = ctx.currentTime + debut;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(volume, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + duree);
}

export function son(nom) {
  if (coupe) return;
  try {
    ctx ??= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    if (nom === "grattage") bruit(0.08, 3000, 0.15, 0.8);
    if (nom === "page") bruit(0.35, 900, 0.25, 0.5);
    if (nom === "deplie") { bruit(0.25, 500, 0.2, 0.7); note(220, 0.05, 0.3, 0.05); }
    if (nom === "reussite") { note(523, 0, 0.5, 0.12); note(659, 0.12, 0.5, 0.12); note(784, 0.24, 0.8, 0.12); }
    if (nom === "erreur") note(196, 0, 0.25, 0.06);
  } catch {}
}
