// Indices dans la marge : notes à gratter, débloquées une par une après une erreur
// ou après une minute sans réponse (la note brille alors, sans s'ouvrir seule).
import { el, maths, lecteurVideo } from "./outils.js";
import { son } from "./son.js";

const DELAI_BLOCAGE = 60_000;
const NIVEAUX = ["Un indice", "Un indice plus précis", "Un exemple corrigé"];

export function creerMarge(q, videos, quandRevele) {
  const marge = el("aside", "marge");
  marge.setAttribute("aria-label", "Indices dans la marge");
  const indices = q.indices || [];
  let niveau = 0;
  let minuteur;

  function debloquer() {
    if (niveau >= indices.length) return null;
    const note = creerNote(indices[niveau], NIVEAUX[niveau], videos, quandRevele);
    niveau++;
    marge.append(note);
    requestAnimationFrame(() => {
      note.couvrir();
      note.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    return note;
  }

  function relancer() {
    clearTimeout(minuteur);
    minuteur = setTimeout(() => {
      const cachee = [...marge.querySelectorAll(".note:not(.revelee)")].pop() || debloquer();
      cachee?.classList.add("brille");
    }, DELAI_BLOCAGE);
  }
  relancer();

  return {
    el: marge,
    erreur() { debloquer(); relancer(); },
    activite: relancer,
    fin() { clearTimeout(minuteur); marge.querySelectorAll(".note:not(.revelee)").forEach((n) => n.remove()); },
  };
}

function creerNote(indice, titre, videos, quandRevele) {
  const note = el("div", "note");
  const contenu = el("div", "note-contenu", `<p class="note-titre">${titre}</p>`);
  const lien = indice.video && videos[indice.video];
  if (lien) contenu.append(lecteurVideo(lien, "video-indice", "Indice en vidéo"));
  else contenu.append(el("div", "", indice.texte));
  maths(contenu);
  note.append(contenu);

  const cache = el("canvas", "note-cache");
  cache.tabIndex = 0;
  cache.setAttribute("role", "button");
  cache.setAttribute("aria-label", `${titre} : gratte la note, ou appuie sur Entrée pour la révéler`);
  note.append(cache);

  let revelee = false;
  const reveler = () => {
    if (revelee) return;
    revelee = true;
    note.classList.add("revelee");
    note.classList.remove("brille");
    cache.remove();
    quandRevele();
  };

  note.couvrir = () => {
    const r = note.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cache.width = r.width * dpr;
    cache.height = r.height * dpr;
    const ctx = cache.getContext("2d");
    ctx.scale(dpr, dpr);
    const g = ctx.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0, "#8a6a43");
    g.addColorStop(1, "#6e5233");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, r.width, r.height);
    for (let i = 0; i < 260; i++) { // grain de la cire / de l'encre
      ctx.fillStyle = `rgba(${Math.random() < 0.5 ? "255,240,210" : "40,25,10"},${Math.random() * 0.12})`;
      ctx.fillRect(Math.random() * r.width, Math.random() * r.height, 2, 2);
    }
    ctx.fillStyle = "#f3e6c8";
    ctx.font = "600 22px Caveat, cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${titre} · gratte ici`, r.width / 2, r.height / 2);
    ctx.globalCompositeOperation = "destination-out";

    ctx.lineWidth = 38;
    ctx.lineCap = ctx.lineJoin = "round";
    let dernier = null; // trait continu entre deux événements, même si le doigt va vite
    let traits = 0;
    const point = (e) => {
      const b = cache.getBoundingClientRect();
      const p = [e.clientX - b.left, e.clientY - b.top];
      ctx.beginPath();
      ctx.moveTo(...(dernier || p));
      ctx.lineTo(p[0] + 0.01, p[1]);
      ctx.stroke();
      dernier = p;
      if (++traits % 6 === 0) { son("grattage"); if (proportionEffacee(cache) > 0.45) reveler(); }
    };
    cache.addEventListener("pointerdown", (e) => { try { cache.setPointerCapture(e.pointerId); } catch {} dernier = null; point(e); });
    cache.addEventListener("pointermove", (e) => dernier && point(e));
    cache.addEventListener("pointerup", () => { dernier = null; if (proportionEffacee(cache) > 0.45) reveler(); });
    cache.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); reveler(); } });
  };
  return note;
}

function proportionEffacee(canvas) {
  const d = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
  let vides = 0, total = 0;
  for (let i = 3; i < d.length; i += 4 * 16) { total++; if (d[i] === 0) vides++; }
  return vides / total;
}
