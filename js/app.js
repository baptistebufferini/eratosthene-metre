// Moteur de l'activité : écrans, étapes, questions, carnet, carte, sauvegarde.
import { estJuste, debrouiller } from "./correction.js";
import { Clavier } from "./clavier.js";
import { creerMarge } from "./indices.js";
import { creerSceau } from "./sceaux.js";
import { ouvrirPopup } from "./popup.js";
import { dessinerCarte, placerBematiste } from "./carte.js";
import { SCHEMAS, POPUPS } from "./etapes/index.js";
import { el, maths, lecteurVideo } from "./outils.js";
import { son, basculerSon, sonCoupe } from "./son.js";
import { Calculatrice } from "./calculatrice.js";
import { dessinerDiplome } from "./diplome.js";
import { encoderCode, decoderCode, masqueDe, reussiesDe, etapesNotees } from "./codes.js";

const SAUVEGARDE = "eratosthene-metre-v1";
const page = document.getElementById("page");
const carnetEl = document.getElementById("carnet");

let C, V; // contenu.json, videos.json
let etat = { nom: "", etape: 0, reussies: [], erreurs: 0, indices: 0, carnet: [] };
const clavier = new Clavier(document.getElementById("clavier"));
const calculatrice = new Calculatrice(document.getElementById("calculatrice"), clavier);

const enregistrer = () => { try { localStorage.setItem(SAUVEGARDE, JSON.stringify(etat)); } catch {} };
function charger() {
  try { return JSON.parse(localStorage.getItem(SAUVEGARDE)); } catch { return null; }
}

const carnetDe = (reussies) => C.etapes.filter((e) => e.carnet && reussies.includes(e.id)).map((e) => ({ id: e.id, ...e.carnet }));
const codeActuel = () => encoderCode(etat.nom, { etape: etat.etape, masque: masqueDe(C.etapes, etat.reussies), erreurs: etat.erreurs, indices: etat.indices });

function majCode() {
  const zone = document.getElementById("code-reprise");
  zone.hidden = !etat.nom;
  if (etat.nom) zone.querySelector("strong").textContent = codeActuel();
}

function blocTexte(b) {
  const p = el("div", "affirmation" + (b.sceau ? " avec-sceau" : ""), b.texte.startsWith("<table") ? b.texte : `<p>${b.texte}</p>`);
  if (b.sceau) p.prepend(creerSceau(C.sceaux[b.sceau], b.sceau));
  return p;
}

// ---------- Panneau : carte + carnet ----------
function majPanneau() {
  carnetEl.innerHTML = "";
  if (!etat.carnet.length) carnetEl.append(el("li", "carnet-vide", "Tes résultats s'inscriront ici."));
  for (const n of etat.carnet) carnetEl.append(el("li", "", `<span>${n.libelle}</span><strong>${n.valeur}</strong>`));
  maths(carnetEl);
  // La carte suit la partie de l'étape en cours (le prologue compte avec la partie 1).
  const n = Math.max(1, C.etapes[etat.etape]?.partie || C.parties.length);
  const partie = C.parties[n - 1];
  dessinerCarte(document.getElementById("carte"), partie);
  const faites = etat.reussies.filter((id) => {
    const e = C.etapes.find((x) => x.id === id);
    return e?.partie === n && e.numero > 0;
  }).length;
  placerBematiste(faites / partie.nbEtapes);
  majCode();
}

const bascule = document.getElementById("panneau-bascule");
bascule.addEventListener("click", () => {
  const ouvert = document.getElementById("panneau").classList.toggle("ouvert");
  bascule.setAttribute("aria-expanded", ouvert);
});

const boutonSon = document.getElementById("bouton-son");
const majBoutonSon = () => {
  boutonSon.textContent = sonCoupe() ? "🔇" : "🔊";
  boutonSon.setAttribute("aria-label", sonCoupe() ? "Activer le son" : "Couper le son");
};
boutonSon.addEventListener("click", () => { basculerSon(); majBoutonSon(); });
majBoutonSon();

// ---------- Écrans ----------
function afficher(contenu) {
  son("page");
  page.classList.remove("tourne");
  void page.offsetWidth; // relance l'animation de page qui tourne
  page.classList.add("tourne");
  page.innerHTML = "";
  page.append(...contenu);
  maths(page);
  page.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function ecranAccueil() {
  const a = C.accueil;
  const titre = el("header", "titre-page", `<p class="surtitre">${a.surtitre}</p><h1>${a.titre}</h1>`);
  const intro = el("div", "colonne");
  intro.append(...a.blocs.map(blocTexte));
  const video = blocVideo("introduction");
  if (video) intro.append(video);

  const form = el("form", "formulaire-nom", `
    <label for="nom">${a.questionNom}</label>
    <input id="nom" name="nom" autocomplete="off" maxlength="40" required>
    <button class="bouton-encre">${a.boutonDepart}</button>
    <details class="reprise">
      <summary>${a.reprise}</summary>
      <label for="code-saisi">${a.repriseAide}</label>
      <input id="code-saisi" name="code" autocomplete="off" maxlength="14" placeholder="XXXXX-XXXXX">
    </details>
    <p class="retour faux" aria-live="polite"></p>`);
  const repris = charger();
  if (repris?.nom) form.querySelector("#nom").value = repris.nom;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nom = form.nom.value.trim().replace(/\s+/g, " ");
    if (!nom) return;
    const code = form.code.value.trim();
    if (code) {
      // Reprise sur un autre appareil : le code doit correspondre au nom.
      const d = decoderCode(nom, code);
      if (!d) { form.querySelector(".retour").textContent = a.repriseInvalide; return; }
      const reussies = reussiesDe(C.etapes, d.masque);
      etat = { nom, etape: Math.min(d.etape, C.etapes.length), reussies, erreurs: d.erreurs, indices: d.indices, carnet: carnetDe(reussies) };
    } else {
      // Même nom qu'une partie sauvegardée sur cet appareil : on reprend ; sinon on repart de zéro.
      etat = repris && repris.nom === nom ? repris : { nom, etape: 0, reussies: [], erreurs: 0, indices: 0, carnet: [] };
    }
    enregistrer();
    majPanneau();
    lancerEtape(etat.etape);
  });
  intro.append(form);
  afficher([titre, intro]);
}

function blocVideo(cle) {
  if (!V[cle]) return null;
  const boite = el("div", "video");
  boite.append(lecteurVideo(V[cle], "", "Vidéo du professeur"));
  return boite;
}

function lancerEtape(i) {
  const E = C.etapes[i];
  calculatrice.autoriser(!!E?.calculatrice);
  etat.etape = i;
  enregistrer();
  if (!E) { majPanneau(); return ecranFin(); }
  majPanneau();
  if (E.type === "diplome") return ecranDiplome(E, i);

  const surtitre = E.surtitre || `${C.parties[E.partie - 1].titre} · Étape ${E.numero}`;
  const titre = el("header", "titre-page", `<p class="surtitre">${surtitre}</p><h1>${E.titre}</h1>`);
  const corps = el("div", "colonne");
  afficher([titre, corps]);
  derouler(E, corps);
}

// Les blocs s'affichent dans l'ordre : on s'arrête à chaque pop-up et à chaque question
// tant que l'élève ne les a pas terminés.
async function derouler(E, corps) {
  let attente = false;
  for (const b of E.blocs) {
    let nouveau = null;
    if (b.type === "texte") nouveau = blocTexte(b);
    if (b.type === "schema") nouveau = el("figure", "schema-plume", SCHEMAS[b.nom]());
    if (b.type === "video") nouveau = blocVideo(b.cle);
    if (nouveau) {
      corps.append(nouveau);
      maths(nouveau);
      if (attente) nouveau.classList.add("apparait");
    }
    if (b.type === "popup") {
      const bouton = el("button", "bouton-popup", `<span>${b.bouton}</span>`);
      corps.append(bouton);
      if (attente) bouton.scrollIntoView({ behavior: "smooth", block: "center" });
      await new Promise((fini) => {
        bouton.addEventListener("click", async () => {
          await ouvrirPopup(b, POPUPS[b.nom]);
          bouton.classList.add("fait");
          bouton.querySelector("span").textContent = b.boutonRevoir;
          fini();
        });
      });
      attente = true;
    }
    if (b.type === "question") {
      await poserQuestion(b, corps);
      attente = true;
    }
  }
  reussirEtape(E, corps);
}

// Affiche une question et attend qu'elle soit réussie.
function poserQuestion(q, conteneur) {
  return new Promise((reussi) => {
    const bloc = el("section", "question");
    bloc.append(el("div", "enonce", q.enonce));
    const zone = el("div", "zone-reponse");
    const retour = el("p", "retour");
    retour.setAttribute("aria-live", "polite");
    const marge = creerMarge(q, V, () => { etat.indices++; enregistrer(); majCode(); });
    bloc.append(zone, retour, marge.el);
    conteneur.append(bloc);
    bloc.scrollIntoView({ behavior: "smooth", block: "center" });

    const attendu = debrouiller(q.reponse);
    const erreur = (texte) => {
      etat.erreurs++;
      enregistrer();
      majCode();
      son("erreur");
      retour.className = "retour faux";
      retour.innerHTML = texte || C.messages.faux;
      maths(retour);
      marge.erreur();
    };
    const succes = () => {
      marge.fin();
      retour.className = "retour juste";
      retour.innerHTML = q.bravo || C.messages.juste;
      maths(retour);
      bloc.classList.add("reussie");
      bloc.querySelectorAll("input, button").forEach((b) => (b.disabled = true));
      clavier.fermer();
      reussi();
    };

    if (q.saisie === "valeur") {
      const champ = el("input", "champ");
      Object.assign(champ, { type: "text", inputMode: "none", autocomplete: "off", spellcheck: false });
      champ.setAttribute("aria-label", "Ta réponse");
      const valider = el("button", "bouton-encre", "Valider");
      zone.append(champ, q.unite ? el("span", "unite", q.unite) : "", valider);
      const tester = () => {
        marge.activite();
        const r = estJuste(champ.value, attendu, q.tolerance);
        if (r === null) { retour.className = "retour"; retour.textContent = C.messages.illisible; return; }
        if (r) succes(); else erreur();
      };
      valider.addEventListener("click", tester);
      champ.addEventListener("keydown", (e) => { marge.activite(); if (e.key === "Enter") tester(); });
      champ.addEventListener("focus", () => clavier.ouvrir(champ, tester));
      champ.addEventListener("input", () => marge.activite());
    }

    if (q.saisie === "choix") {
      const liste = el("div", "choix");
      q.options.forEach((texte, n) => {
        const b = el("button", "option", texte);
        b.addEventListener("click", () => {
          marge.activite();
          if (n === attendu) { b.classList.add("bonne"); succes(); }
          else { b.classList.add("mauvaise"); b.disabled = true; erreur(q.retours?.[n]); }
        });
        liste.append(b);
      });
      zone.append(liste);
    }
    if (q.facultatif) {
      const passer = el("button", "bouton-passer", C.messages.passer);
      passer.addEventListener("click", () => {
        marge.fin();
        bloc.classList.add("passee");
        bloc.querySelectorAll("input, button").forEach((b) => (b.disabled = true));
        clavier.fermer();
        reussi();
      });
      bloc.append(passer);
    }
    maths(bloc);
  });
}

function reussirEtape(E, corps) {
  if (!etat.reussies.includes(E.id)) etat.reussies.push(E.id);
  if (E.carnet && !etat.carnet.some((n) => n.id === E.id)) etat.carnet.push({ id: E.id, ...E.carnet });
  enregistrer();
  majPanneau();
  if (!E.transition) poserTampon();

  const fin = el("div", "fin-etape");
  if (E.conclusion) {
    const c = blocTexte({ texte: E.conclusion, sceau: E.conclusionSceau });
    c.classList.add("conclusion");
    fin.append(c);
  }
  const suite = el("button", "bouton-encre", C.messages.suivant);
  suite.addEventListener("click", () => lancerEtape(C.etapes.indexOf(E) + 1));
  fin.append(suite);
  corps.append(fin);
  maths(fin);
  fin.scrollIntoView({ behavior: "smooth", block: "center" });
}

function poserTampon() {
  son("reussite");
  const t = document.getElementById("tampon");
  t.classList.remove("pose");
  void t.offsetWidth;
  t.classList.add("pose");
}

async function ecranDiplome(E, i) {
  const corps = el("div", "colonne diplome-page");
  corps.append(el("p", "", E.texte));
  const image = el("img", "diplome-image");
  image.alt = `Diplôme de bématiste royal décerné à ${etat.nom}`;
  const lien = el("a", "bouton-encre", E.boutonTelecharger);
  lien.download = "diplome-bematiste-royal.png";
  const suite = el("button", "bouton-encre", C.messages.suivant);
  suite.addEventListener("click", () => lancerEtape(i + 1));
  const actions = el("div", "actions-diplome");
  actions.append(lien, suite);
  corps.append(image, actions);
  afficher([el("header", "titre-page", `<p class="surtitre">${E.surtitre}</p><h1>${E.titre}</h1>`), corps]);
  poserTampon();
  const url = await dessinerDiplome(etat.nom, E.diplome);
  image.src = lien.href = url;
}

function ecranFin() {
  const f = C.fin;
  const nom = etat.nom.replace(/[<>&"]/g, "");
  const total = etapesNotees(C.etapes).length;
  const faites = etapesNotees(C.etapes).filter((e) => etat.reussies.includes(e.id)).length;
  const corps = el("div", "colonne");
  corps.append(
    el("p", "", f.texte.replace("{nom}", nom)),
    el("p", "", f.codeTexte),
    el("output", "code-final", codeActuel()),
    el("ul", "bilan", `<li>${faites} / ${total} étapes réussies</li><li>${etat.erreurs} erreur${etat.erreurs > 1 ? "s" : ""}</li><li>${etat.indices} indice${etat.indices > 1 ? "s" : ""} utilisé${etat.indices > 1 ? "s" : ""}</li>`),
  );
  const loin = el("section", "plus-loin", `<h2>${f.plusLoinTitre}</h2><ol>${f.plusLoin.map((t) => `<li>${t}</li>`).join("")}</ol>`);
  const recommencer = el("button", "bouton-encre", f.bouton);
  recommencer.addEventListener("click", () => {
    // Les erreurs et les indices sont conservés : recommencer ne remet pas le compteur à zéro.
    etat = { ...etat, etape: 0, reussies: [], carnet: [] };
    enregistrer();
    lancerEtape(0);
  });
  corps.append(loin, el("p", "fin-actions"));
  corps.lastChild.append(recommencer);
  afficher([el("header", "titre-page", `<p class="surtitre">${f.surtitre}</p><h1>${f.titre}</h1>`), corps]);
  poserTampon();
}

// ---------- Démarrage ----------
async function demarrer() {
  try {
    [C, V] = await Promise.all(["config/contenu.json", "config/videos.json"].map((u) => fetch(u).then((r) => r.json())));
  } catch {
    page.innerHTML = "<p>Impossible de charger les fichiers de configuration. Ouvre l'activité depuis un serveur (voir README).</p>";
    return;
  }
  majPanneau();
  ecranAccueil();
}
demarrer();
