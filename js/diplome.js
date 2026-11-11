// Diplôme de bématiste royal : dessiné sur un canvas, téléchargeable en image PNG.
export async function dessinerDiplome(nom, D) {
  try {
    await Promise.all(["64px 'IM Fell English'", "40px 'EB Garamond'", "48px Caveat"].map((f) => document.fonts.load(f)));
  } catch {}
  const L = 1400, H = 1000;
  const c = Object.assign(document.createElement("canvas"), { width: L, height: H });
  const x = c.getContext("2d");

  // parchemin
  const g = x.createRadialGradient(L / 2, H / 2, 200, L / 2, H / 2, 900);
  g.addColorStop(0, "#f6ead0");
  g.addColorStop(1, "#d9bf8a");
  x.fillStyle = g;
  x.fillRect(0, 0, L, H);
  for (let i = 0; i < 1800; i++) {
    x.fillStyle = `rgba(110,70,30,${Math.random() * 0.06})`;
    x.fillRect(Math.random() * L, Math.random() * H, 2 + Math.random() * 3, 2 + Math.random() * 3);
  }
  // double cadre
  x.strokeStyle = "#7a4f27";
  x.lineWidth = 6;
  x.strokeRect(40, 40, L - 80, H - 80);
  x.lineWidth = 2;
  x.strokeRect(58, 58, L - 116, H - 116);
  // frise de méandres grecs
  x.lineWidth = 3;
  for (let px = 90; px < L - 120; px += 40) for (const py of [80, H - 110]) {
    x.beginPath();
    x.moveTo(px, py + 30); x.lineTo(px, py); x.lineTo(px + 30, py); x.lineTo(px + 30, py + 20);
    x.lineTo(px + 12, py + 20); x.lineTo(px + 12, py + 10);
    x.stroke();
  }

  const texte = (t, y, police, couleur = "#3a2614") => {
    x.font = police;
    x.fillStyle = couleur;
    x.textAlign = "center";
    x.fillText(t, L / 2, y, L - 240);
  };
  texte(D.surtitre, 220, "italic 34px 'IM Fell English', Georgia, serif", "#7a4f27");
  texte(D.titre, 310, "76px 'IM Fell English', Georgia, serif");
  texte(D.decerne, 400, "36px 'EB Garamond', Georgia, serif");
  texte(nom, 500, "700 84px Caveat, cursive", "#2a3b6e");
  D.lignes.forEach((l, n) => texte(l, 590 + n * 50, "36px 'EB Garamond', Georgia, serif"));
  const date = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  x.textAlign = "left";
  x.font = "34px Caveat, cursive";
  x.fillStyle = "#3a2614";
  x.fillText(`Le ${date}`, 150, H - 170);
  x.fillText(D.signature, 150, H - 125);

  // sceau de cire
  const sx = L - 230, sy = H - 220;
  const s = x.createRadialGradient(sx - 25, sy - 25, 10, sx, sy, 95);
  s.addColorStop(0, "#c8473c");
  s.addColorStop(0.7, "#9e2a22");
  s.addColorStop(1, "#6e1a14");
  x.fillStyle = s;
  x.beginPath();
  for (let a = 0; a <= Math.PI * 2 + 0.01; a += Math.PI / 24) {
    const r = 95 + (Math.sin(a * 7) + Math.cos(a * 11)) * 4;
    x.lineTo(sx + r * Math.cos(a), sy + r * Math.sin(a));
  }
  x.fill();
  x.strokeStyle = "rgba(255,230,220,.45)";
  x.lineWidth = 3;
  x.beginPath(); x.arc(sx, sy, 68, 0, Math.PI * 2); x.stroke();
  x.fillStyle = "rgba(255,235,225,.85)";
  x.font = "60px 'IM Fell English', Georgia, serif";
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.fillText("Β", sx, sy + 2); // bêta, initiale de « bématiste »

  return c.toDataURL("image/png");
}
