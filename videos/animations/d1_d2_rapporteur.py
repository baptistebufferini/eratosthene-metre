"""Vidéo 4 (lire un rapporteur) : animations D1 (les trois gestes) et D2 (la loupe sur les petits angles).

Rendu (depuis ce dossier) :
    .venv/Scripts/python -m manim -r 1920,1080 --fps 30 d1_d2_rapporteur.py D1TroisGestes D2Loupe
"""
import numpy as np
from manim import (Scene, VGroup, Line, Dot, Arc, Text, Circle, Rectangle, Create, FadeIn, FadeOut, Write,
                   Indicate, UP, DOWN, LEFT, RIGHT, PI, smooth, DEGREES)
from charte import (ENCRE, SEPIA, ROUGE_CIRE, SOLEIL, BLEU, VERT, POLICE, fond_parchemin)

texte = lambda t, taille=0.5, couleur=ENCRE, **k: Text(t, font=POLICE, color=couleur, **k).scale(taille)
pol = lambda r, a: np.array([r * np.cos(a * DEGREES), r * np.sin(a * DEGREES), 0])


def rapporteur(R=3.0):
    """Rapporteur centré sur l'origine, zéro vers la droite. Échelle extérieure : a ; intérieure : 180 − a."""
    g = VGroup()
    corps = Arc(radius=R, start_angle=0, angle=PI, stroke_color=BLEU, stroke_width=3)
    corps.add_line_to(pol(R, 0))
    corps.set_fill(BLEU, opacity=0.12)
    g.add(corps, Line(pol(R, 180), pol(R, 0), color=BLEU, stroke_width=3))
    for a in range(0, 181):
        l = 0.32 if a % 10 == 0 else 0.2 if a % 5 == 0 else 0.1
        g.add(Line(pol(R, a), pol(R - l, a), color=BLEU, stroke_width=1.5))
    exterieur, interieur = VGroup(), VGroup()
    for a in range(0, 181, 10):
        exterieur.add(texte(str(a), 0.28, BLEU).move_to(pol(R - 0.52, a)))
        interieur.add(texte(str(180 - a), 0.22, BLEU).move_to(pol(R - 0.88, a)))
    g.add(exterieur, interieur, Dot([0, 0, 0], radius=0.06, color=BLEU))
    return g, exterieur, interieur


class D1TroisGestes(Scene):
    """Le rapporteur se pose sur le sommet, tourne pour aligner le zéro, puis on choisit la bonne graduation."""

    def construct(self):
        self.add(fond_parchemin())
        V, ANGLE = np.array([-0.5, -2.6, 0]), 40
        cote1 = Line(V, V + pol(5.2, 0), color=ENCRE, stroke_width=6)
        cote2 = Line(V, V + pol(5.2, ANGLE), color=ENCRE, stroke_width=6)
        sommet = Dot(V, radius=0.08, color=ROUGE_CIRE)
        self.add(cote1, cote2, sommet)

        etapes = [texte(t, 0.45, SEPIA) for t in ("1. le centre sur le sommet", "2. le zéro sur un côté", "3. la graduation qui part de 0")]
        VGroup(*etapes).arrange(DOWN, aligned_edge=LEFT, buff=0.25).to_corner(UP + LEFT, buff=0.5)
        r, exterieur, interieur = rapporteur()
        r.rotate(28 * DEGREES, about_point=np.array([0, 0, 0])).shift(np.array([-3.6, 1.2, 0]))
        self.play(FadeIn(r), run_time=0.6)

        self.play(FadeIn(etapes[0]), r.animate.shift(V - np.array([-3.6, 1.2, 0])), run_time=1.6, rate_func=smooth)
        self.play(Indicate(sommet, color=ROUGE_CIRE), run_time=0.6)
        self.play(FadeIn(etapes[1]), r.animate.rotate(-28 * DEGREES, about_point=V), run_time=1.6, rate_func=smooth)
        self.play(Indicate(cote1, color=VERT), run_time=0.6)

        # ③ : sur le côté du zéro, l'échelle extérieure part de 0 → on lit 40 ; l'intérieure donnerait 140
        bon, faux = exterieur[ANGLE // 10], interieur[ANGLE // 10]
        self.play(FadeIn(etapes[2]), run_time=0.5)
        self.play(Indicate(exterieur[0], color=VERT, scale_factor=1.8), run_time=0.8)
        rond = Circle(radius=0.32, color=VERT, stroke_width=5).move_to(bon)
        barre = Line(faux.get_corner(DOWN + LEFT), faux.get_corner(UP + RIGHT), color=ROUGE_CIRE, stroke_width=5)
        lecture = texte("40°", 0.9, VERT, weight="BOLD").next_to(V + pol(5.2, ANGLE), RIGHT, buff=0.2)
        erreur = texte("pas 140° !", 0.55, ROUGE_CIRE).next_to(lecture, DOWN, buff=0.2)
        self.play(Create(rond), FadeIn(lecture), run_time=0.9)
        self.play(Create(barre), FadeIn(erreur), run_time=0.8)
        self.wait(1.5)


class D2Loupe(Scene):
    """La loupe de l'activité, de 0 à 14°, et un côté qui passe entre 3 et 3,5 : on lit environ 3,2°."""

    def construct(self):
        self.add(fond_parchemin())
        X0, PAS = -6.0, 0.85  # position du 0 et largeur d'un degré à l'écran
        x = lambda a: X0 + a * PAS
        bande = Rectangle(width=14 * PAS + 0.6, height=2.2, fill_color=BLEU, fill_opacity=0.10, stroke_color=BLEU,
                          stroke_width=3).move_to([x(7), 0.2, 0])
        traits, nombres = VGroup(), VGroup()
        for k in range(29):
            a = k / 2
            l = 1.0 if a % 5 == 0 else 0.7 if a % 1 == 0 else 0.4
            traits.add(Line([x(a), 1.2, 0], [x(a), 1.2 - l, 0], color=BLEU, stroke_width=4 if a % 1 == 0 else 2.5))
            if a % 1 == 0:
                nombres.add(texte(str(int(a)), 0.45, BLEU).move_to([x(a), -0.25, 0]))
        titre = texte("Loupe sur les petites graduations", 0.5, SEPIA).to_corner(UP + LEFT, buff=0.5)
        legende = texte("grands traits : 5 en 5 · moyens : degrés · petits : demi-degrés", 0.38, SEPIA).next_to(bande, DOWN, buff=0.5)
        self.play(FadeIn(titre), FadeIn(bande), Create(traits), Write(nombres), run_time=1.8)
        self.play(FadeIn(legende), run_time=0.6)

        MESURE = 3.2  # exemple volontairement différent de l'angle de l'étape 2
        cote = Line([x(MESURE), 1.9, 0], [x(MESURE), -0.7, 0], color=ROUGE_CIRE, stroke_width=6)
        nom_cote = texte("le côté de l'angle", 0.4, ROUGE_CIRE).next_to(cote, UP, buff=0.1)
        self.play(Create(cote), FadeIn(nom_cote), run_time=1)

        # comparer les deux distances : jusqu'au 3 et jusqu'au 3,5
        vers3 = Line([x(3), 1.5, 0], [x(MESURE), 1.5, 0], color=VERT, stroke_width=14)
        vers35 = Line([x(MESURE), 1.5, 0], [x(3.5), 1.5, 0], color=SOLEIL, stroke_width=14)
        self.play(Create(vers3), Create(vers35), run_time=0.8)
        conclusion = texte("Plus proche de 3 que de 3,5 : environ 3,2°", 0.6, VERT, weight="BOLD").to_edge(DOWN, buff=0.6)
        self.play(Indicate(vers3, color=VERT), FadeIn(conclusion), run_time=1.2)
        self.wait(1.5)
