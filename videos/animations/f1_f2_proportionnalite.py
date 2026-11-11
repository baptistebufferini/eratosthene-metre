"""Vidéo 6 (proportionnalité) : animations F1 (l'arc proportionnel et le coefficient) et F2 (passer par 1°, puis convertir).
Les exemples sont volontairement différents des données des étapes 6 et 8.

Rendu (depuis ce dossier) :
    .venv/Scripts/python -m manim -r 1920,1080 --fps 30 f1_f2_proportionnalite.py F1ArcEtCoefficient F2RegleDeTrois
"""
import numpy as np
from manim import (Scene, VGroup, Line, Arc, Circle, Rectangle, Text, CurvedArrow, Arrow, ValueTracker, always_redraw,
                   Create, FadeIn, FadeOut, Write, Indicate, TransformFromCopy, UP, DOWN, LEFT, RIGHT, PI, smooth, DEGREES)
from charte import (ENCRE, SEPIA, ROUGE_CIRE, SOLEIL, OCRE, BLEU, VERT, POLICE, fond_parchemin)

texte = lambda t, taille=0.5, couleur=ENCRE, **k: Text(t, font=POLICE, color=couleur, **k).scale(taille)


def tableau(entetes, lignes, largeur_entete=3.4, largeur=1.9, hauteur=0.9, taille=0.5):
    """Tableau de proportionnalité. Renvoie (groupe, cases) ; cases[l][c] est le texte de la ligne l, colonne c
    (les textes font partie du groupe : ils apparaissent avec lui)."""
    g, cases = VGroup(), []
    for l, (entete, valeurs) in enumerate(zip(entetes, lignes)):
        y = -l * hauteur
        g.add(Rectangle(width=largeur_entete, height=hauteur, stroke_color=ENCRE, stroke_width=3, fill_color=SEPIA,
                        fill_opacity=0.12).move_to([largeur_entete / 2, y, 0]),
              texte(entete, taille * 0.8).move_to([largeur_entete / 2, y, 0]))
        rang = []
        for c, v in enumerate(valeurs):
            x = largeur_entete + largeur * (c + 0.5)
            g.add(Rectangle(width=largeur, height=hauteur, stroke_color=ENCRE, stroke_width=3).move_to([x, y, 0]))
            t = texte(v, taille, ROUGE_CIRE if v == "?" else ENCRE).move_to([x, y, 0])
            rang.append(t)
            g.add(t)  # dans le groupe, pour suivre le tableau quand on le déplace
        cases.append(rang)
    return g, cases


def fleche(a, b, etiquette, haut=True, couleur=VERT):
    """Flèche courbe au-dessus (ou au-dessous) du tableau, entre deux cases, avec son opération."""
    decal = UP * 0.55 if haut else DOWN * 0.55
    f = CurvedArrow(a.get_center() + decal, b.get_center() + decal, angle=-PI / 2.5 if haut else PI / 2.5,
                    color=couleur, stroke_width=5, tip_length=0.2)
    e = texte(etiquette, 0.5, couleur, weight="BOLD").next_to(f, UP if haut else DOWN, buff=0.08)
    return VGroup(f, e)


class F1ArcEtCoefficient(Scene):
    """L'arc double quand l'angle double ; puis 12° → 360° (× 30) et 1 500 → 45 000 stades. Environ 11 s."""

    def construct(self):
        self.add(fond_parchemin())
        O, R = np.array([-4.3, -0.6, 0]), 2.2
        ang = ValueTracker(12)
        cercle = Circle(radius=R, color=SEPIA, stroke_width=3).move_to(O)

        def figure():
            a = ang.get_value()
            d1, d2 = O + R * np.array([np.cos(PI / 2), np.sin(PI / 2), 0]), O + R * np.array([np.cos(PI / 2 - a * DEGREES), np.sin(PI / 2 - a * DEGREES), 0])
            return VGroup(Line(O, d1, color=ENCRE, stroke_width=4), Line(O, d2, color=ENCRE, stroke_width=4),
                          Arc(radius=R, start_angle=PI / 2, angle=-a * DEGREES, arc_center=O, color=ROUGE_CIRE, stroke_width=12),
                          texte(f"{a:.0f}°", 0.5).move_to(RIGHT * 0.45 + O + 1.2 * np.array([np.cos(PI / 2 - a * DEGREES / 2), np.sin(PI / 2 - a * DEGREES / 2), 0])),
                          texte(f"{a / 12 * 1500:,.0f} stades".replace(",", " "), 0.45, ROUGE_CIRE).next_to(O + UP * R, UP, buff=0.25).shift(RIGHT * 0.6))

        dessin = always_redraw(figure)
        titre = texte("angle double, arc double", 0.5, VERT).next_to(cercle, DOWN, buff=0.35)
        self.play(Create(cercle), FadeIn(dessin), run_time=1)
        self.play(ang.animate.set_value(24), run_time=1.6, rate_func=smooth)
        self.play(FadeIn(titre), run_time=0.5)
        self.play(ang.animate.set_value(12), run_time=0.8)

        g, cases = tableau(["Angle (en °)", "Arc (en stades)"], [["12", "360"], ["1 500", "?"]])
        g.move_to([2.6, 0.2, 0])
        self.play(FadeIn(g), run_time=1)
        haut = fleche(cases[0][0], cases[0][1], "× 30")
        calcul = texte("360 ÷ 12 = 30", 0.45, VERT).next_to(g, UP, buff=1.25)
        self.play(Create(haut[0]), FadeIn(haut[1]), FadeIn(calcul), run_time=1.2)
        bas = fleche(cases[1][0], cases[1][1], "× 30", haut=False)
        self.play(Create(bas[0]), FadeIn(bas[1]), run_time=1)
        resultat = texte("45 000", 0.5, VERT, weight="BOLD").move_to(cases[1][1])
        self.play(FadeOut(cases[1][1]), FadeIn(resultat), run_time=0.6)
        self.play(Indicate(resultat, color=VERT), run_time=0.8)
        self.wait(1.5)


class F2RegleDeTrois(Scene):
    """2,5° → 280 km ; on passe par 1° (112 km) pour aller à 90° (10 080 km), puis on convertit en mètres. Environ 11 s."""

    def construct(self):
        self.add(fond_parchemin())
        g, cases = tableau(["Angle (en °)", "Arc (en km)"], [["2,5", "1", "90"], ["280", "?", "?"]], largeur=2.2)
        g.move_to([0, 1.0, 0])
        titre = texte("Passer par 1°", 0.6, SEPIA).to_corner(UP + LEFT, buff=0.4)
        self.play(FadeIn(titre), FadeIn(g), run_time=1.2)

        h1, b1 = fleche(cases[0][0], cases[0][1], "÷ 2,5"), fleche(cases[1][0], cases[1][1], "÷ 2,5", haut=False)
        self.play(Create(h1[0]), FadeIn(h1[1]), run_time=0.8)
        self.play(Create(b1[0]), FadeIn(b1[1]), run_time=0.8)
        v112 = texte("112", 0.5, VERT, weight="BOLD").move_to(cases[1][1])
        self.play(FadeOut(cases[1][1]), FadeIn(v112), run_time=0.6)

        h2, b2 = fleche(cases[0][1], cases[0][2], "× 90", couleur=BLEU), fleche(cases[1][1], cases[1][2], "× 90", haut=False, couleur=BLEU)
        self.play(Create(h2[0]), FadeIn(h2[1]), run_time=0.8)
        self.play(Create(b2[0]), FadeIn(b2[1]), run_time=0.8)
        v10080 = texte("10 080", 0.5, BLEU, weight="BOLD").move_to(cases[1][2])
        self.play(FadeOut(cases[1][2]), FadeIn(v10080), run_time=0.6)

        # Conversion d'unité
        km = texte("10 080 km", 0.7, ENCRE).move_to([-3.2, -2.6, 0])
        m = texte("10 080 000 m", 0.7, VERT, weight="BOLD").move_to([3.0, -2.6, 0])
        conv = Arrow(km.get_right(), m.get_left(), color=OCRE, stroke_width=6, buff=0.3)
        op = texte("× 1 000", 0.55, OCRE, weight="BOLD").next_to(conv, UP, buff=0.1)
        self.play(TransformFromCopy(v10080, km), run_time=0.9)
        self.play(Create(conv), FadeIn(op), run_time=0.8)
        self.play(FadeIn(m), run_time=0.7)
        rappel = texte("des km aux m : × 1 000     des m aux km : ÷ 1 000", 0.45, SEPIA).to_edge(DOWN, buff=0.35)
        self.play(FadeIn(rappel), run_time=0.6)
        self.wait(1.5)
