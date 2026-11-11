"""Vidéo 5 (7,2° sur 360°) : animations E1 (le quart et l'horloge) et E2 (cinquante parts fines).

Rendu (depuis ce dossier) :
    .venv/Scripts/python -m manim -r 1920,1080 --fps 30 e1_e2_cinquantieme.py E1QuartEtHorloge E2CinquanteParts
"""
import numpy as np
from manim import (Scene, VGroup, Line, Circle, Sector, Text, ValueTracker, always_redraw, Create, FadeIn,
                   FadeOut, Write, Indicate, ReplacementTransform, UP, DOWN, LEFT, RIGHT, PI, linear, DEGREES)
from charte import (PARCHEMIN, ENCRE, SEPIA, ROUGE_CIRE, SOLEIL, OCRE, BLEU, VERT, POLICE, fond_parchemin)

texte = lambda t, taille=0.5, couleur=ENCRE, **k: Text(t, font=POLICE, color=couleur, **k).scale(taille)
COULEURS = [SOLEIL, OCRE, BLEU]


def fraction(num, den, taille=0.8, couleur=ENCRE):
    """Fraction écrite sans LaTeX : numérateur, trait, dénominateur."""
    n, d = texte(num, taille, couleur), texte(den, taille, couleur)
    trait = Line(LEFT, RIGHT, color=couleur, stroke_width=4).set_width(max(n.width, d.width) + 0.2)
    return VGroup(n, trait, d).arrange(DOWN, buff=0.12)


def ligne(*morceaux):
    return VGroup(*morceaux).arrange(RIGHT, buff=0.3)


def parts(centre, R, n, rouge=None):
    """Disque coupé en n parts égales, dans le sens des aiguilles d'une montre depuis midi."""
    g = VGroup()
    for k in range(n):
        couleur = ROUGE_CIRE if k == rouge else COULEURS[k % 3]
        g.add(Sector(radius=R, start_angle=PI / 2 - k * 2 * PI / n, angle=-2 * PI / n, arc_center=centre,
                     fill_color=couleur, fill_opacity=1 if k == rouge else 0.55, stroke_color=ENCRE, stroke_width=1.5))
    return g


class E1QuartEtHorloge(Scene):
    """Un quart : 90/360 = 1/4. Une heure sur l'horloge : 30/360 = 1/12. Environ 11 s."""

    def construct(self):
        self.add(fond_parchemin())
        C, R = np.array([-3.2, -0.2, 0]), 2.5
        contour = Circle(radius=R, color=ENCRE, stroke_width=4).move_to(C)
        self.play(Create(contour), run_time=0.7)

        quart = parts(C, R, 4, rouge=0)
        mesure4 = texte("90°", 0.6, PARCHEMIN, weight="BOLD").move_to(C + 0.6 * R * np.array([np.cos(PI / 4), np.sin(PI / 4), 0]))
        egalite4 = ligne(fraction("90", "360"), texte("=", 0.9), fraction("1", "4", couleur=ROUGE_CIRE)).move_to([3.0, 0.9, 0])
        phrase4 = texte("une part sur 4", 0.55, ROUGE_CIRE).next_to(egalite4, DOWN, buff=0.4)
        self.play(FadeIn(quart), run_time=0.8)
        self.play(FadeIn(mesure4), Write(egalite4), run_time=1.3)
        self.play(FadeIn(phrase4), run_time=0.6)
        self.wait(0.8)

        heures = parts(C, R, 12, rouge=0)
        chiffres = VGroup(*[texte(str(h), 0.45).move_to(C + 1.12 * R * np.array([np.cos(PI / 2 - h * PI / 6), np.sin(PI / 2 - h * PI / 6), 0]))
                            for h in range(1, 13)])
        mesure12 = texte("30°", 0.5, PARCHEMIN, weight="BOLD").move_to(C + 0.72 * R * np.array([np.cos(PI / 2 - PI / 12), np.sin(PI / 2 - PI / 12), 0]))
        egalite12 = ligne(fraction("30", "360"), texte("=", 0.9), fraction("1", "12", couleur=ROUGE_CIRE)).move_to([3.0, 0.9, 0])
        phrase12 = texte("une heure : une part sur 12", 0.55, ROUGE_CIRE).next_to(egalite12, DOWN, buff=0.4)
        self.play(ReplacementTransform(quart, heures), FadeOut(mesure4), FadeIn(chiffres), FadeOut(egalite4), FadeOut(phrase4), run_time=1.2)
        self.play(FadeIn(mesure12), Write(egalite12), run_time=1.3)
        self.play(FadeIn(phrase12), run_time=0.6)
        methode = texte("fraction du tour = angle ÷ 360", 0.6, VERT, weight="BOLD").to_edge(DOWN, buff=0.45).shift(RIGHT * 3)
        self.play(FadeIn(methode), run_time=0.8)
        self.wait(1.5)


class E2CinquanteParts(Scene):
    """Le disque se remplit de 50 parts de 7,2° ; une seule reste rouge ; la question est posée. Environ 9 s."""

    def construct(self):
        self.add(fond_parchemin())
        C, R = np.array([-3.0, -0.1, 0]), 2.9
        contour = Circle(radius=R, color=ENCRE, stroke_width=4).move_to(C)
        n = ValueTracker(0)
        disque = always_redraw(lambda: parts(C, R, 50, rouge=0)[: int(n.get_value())])
        compteur = always_redraw(lambda: texte(f"{int(n.get_value())} part{'s' if n.get_value() >= 2 else ''} de 7,2°", 0.6)
                                 .move_to([3.2, 1.6, 0]))
        self.add(contour, disque, compteur)
        self.play(n.animate.set_value(50), run_time=4, rate_func=linear)
        plein = texte("50 parts : le tour complet !", 0.55, VERT, weight="BOLD").next_to(compteur, DOWN, buff=0.35)
        self.play(FadeIn(plein), run_time=0.6)
        self.wait(0.4)

        question = VGroup(texte("1 part sur 50", 0.75, ROUGE_CIRE, weight="BOLD"),
                          texte("en fraction ?", 0.75, ROUGE_CIRE)).arrange(DOWN, buff=0.25).move_to([3.2, -1.2, 0])
        self.play(FadeIn(question), run_time=0.8)
        self.play(Indicate(question[1], color=ROUGE_CIRE, scale_factor=1.2), run_time=1)
        self.wait(1.5)
