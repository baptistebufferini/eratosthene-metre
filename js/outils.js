// Crée un élément avec classe et contenu HTML (le HTML vient de config/, donc de confiance).
export function el(tag, classe, html) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

// Rend les formules $...$ et $$...$$ avec KaTeX.
export function maths(conteneur) {
  window.renderMathInElement?.(conteneur, {
    delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }],
    throwOnError: false,
  });
}

export const reduireMouvement = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// Lecteur vidéo : fichier .mp4 du dépôt, ou vidéo YouTube (lien ou identifiant).
export function lecteurVideo(lien, classe, titre) {
  if (/\.mp4$/i.test(lien)) return Object.assign(el("video", classe), { src: lien, controls: true, preload: "metadata" });
  const id = (lien.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/) || [, lien])[1];
  return Object.assign(el("iframe", classe), {
    src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`,
    title: titre, allow: "fullscreen; picture-in-picture", loading: "lazy",
  });
}
