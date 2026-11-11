"""Vidéo 1 (introduction) : animations A1 (titre) et A2 (carte de l'Égypte).

Rendu (depuis ce dossier) :
    .venv/Scripts/python -m manim -r 1920,1080 --fps 30 a1_a2_introduction.py A1Titre A2CarteEgypte
"""
import numpy as np
from manim import (Scene, VGroup, VMobject, Circle, Ellipse, Line, Dot, Text, DashedLine,
                   ValueTracker, always_redraw, Create, Write, FadeIn, GrowFromCenter, Indicate,
                   UP, DOWN, LEFT, RIGHT, PI, smooth, linear)
from charte import (PARCHEMIN, ENCRE, SEPIA, ROUGE_CIRE, SOLEIL, OCRE, BLEU, POLICE, fond_parchemin)


class A1Titre(Scene):
    """Un globe qui tourne, puis le titre qui s'écrit. Environ 6 s."""

    def construct(self):
        self.add(fond_parchemin())
        R = 1.7
        phase = ValueTracker(0)

        def globe():
            g = VGroup(Circle(radius=R, fill_color=BLEU, fill_opacity=1, stroke_color=ENCRE, stroke_width=4))
            for lat in (-60, -30, 0, 30, 60):  # parallèles
                y = R * np.sin(np.radians(lat))
                demi = R * np.cos(np.radians(lat))
                g.add(Line([-demi, y, 0], [demi, y, 0], stroke_color=PARCHEMIN, stroke_width=1.5, stroke_opacity=0.6))
            for k in range(6):  # méridiens : des ellipses dont la largeur varie avec la rotation
                a = phase.get_value() + k * PI / 6
                largeur = abs(np.cos(a)) * 2 * R
                if largeur > 0.02:
                    g.add(Ellipse(width=largeur, height=2 * R, stroke_color=PARCHEMIN, stroke_width=1.5, stroke_opacity=0.6))
            # un « continent » ocre qui passe d'un bord à l'autre
            x = R * np.sin(phase.get_value() * 0.5 % (2 * PI) - PI)
            if abs(x) < R * 0.9:
                g.add(Ellipse(width=0.9 * np.sqrt(max(0.05, 1 - (x / R) ** 2)), height=1.3, fill_color=OCRE, fill_opacity=1,
                              stroke_width=0).move_to([x, 0.2, 0]))
            return g.shift(UP * 0.9)

        terre = always_redraw(globe)
        self.play(GrowFromCenter(terre), run_time=1)
        titre = Text("De la Terre d'Ératosthène au mètre", font=POLICE, color=ENCRE, slant="ITALIC").scale(0.9)
        titre.set_stroke(ENCRE)  # sinon le tracé de Write apparaît en blanc
        titre.next_to(terre, DOWN, buff=0.6)
        trait = Line(LEFT * 1.6, RIGHT * 1.6, color=SEPIA, stroke_width=3).next_to(titre, DOWN, buff=0.25)
        self.play(phase.animate.set_value(PI), Write(titre), run_time=2.5, rate_func=linear)
        self.play(phase.animate.set_value(2 * PI), Create(trait), run_time=1.5, rate_func=linear)
        self.play(phase.animate.set_value(2.5 * PI), run_time=1, rate_func=linear)


def projection(lon, lat):
    """Carte : x = (longitude − 27) × 0,55 ; y = (latitude − 28) × 0,55 (unités Manim)."""
    return np.array([(lon - 27) * 0.55, (lat - 28) * 0.55, 0])


COTE = [(13.5, 32.9), (15.5, 32.2), (17.5, 30.9), (19.0, 30.6), (20.0, 32.1), (21.0, 32.8), (22.0, 32.9), (23.0, 32.6), (24.0, 32.0), (25.2, 31.6), (27.0, 31.3),
        (28.5, 30.9), (29.9, 31.2), (30.6, 31.5), (31.5, 31.6), (32.3, 31.3), (33.0, 31.1), (34.3, 31.4), (34.8, 32.6), (35.3, 34.2)]
NIL = [(31.24, 30.04), (31.1, 29.07), (30.75, 28.1), (31.2, 27.18), (32.1, 26.5), (32.72, 26.16), (32.64, 25.69),
       (32.87, 24.98), (32.9, 24.09)]
VILLES = {"Cyrène": (21.86, 32.82), "Alexandrie": (29.92, 31.2), "Syène": (32.9, 24.09)}


class A2CarteEgypte(Scene):
    """Le Nil se trace, les villes apparaissent, puis la question entre Alexandrie et Syène. Environ 9 s."""

    def construct(self):
        self.add(fond_parchemin())
        cote = [projection(*p) for p in COTE]
        trait_cote = VMobject(stroke_color=SEPIA, stroke_width=4).set_points_smoothly(cote)
        mer = trait_cote.copy().set_stroke(width=0).set_fill(BLEU, opacity=0.35)
        mer.add_line_to(projection(35.3, 36)).add_line_to(projection(13.5, 36)).close_path()
        nom_mer = Text("Mer Méditerranée", font=POLICE, slant="ITALIC", color=SEPIA).scale(0.45).move_to(projection(26.5, 33.2))
        self.play(FadeIn(mer), Create(trait_cote), FadeIn(nom_mer), run_time=1.5)

        branches = VGroup(*[VMobject(stroke_color=BLEU, stroke_width=4).set_points_smoothly(
            [projection(*a), projection(*b), projection(31.24, 30.04)]) for a, b in (((30.4, 31.45), (30.9, 30.8)), ((31.8, 31.45), (31.5, 30.8)))])
        nil = VMobject(stroke_color=BLEU, stroke_width=5).set_points_smoothly([projection(*p) for p in NIL])
        nom_nil = Text("Nil", font=POLICE, slant="ITALIC", color=BLEU).scale(0.5).next_to(projection(32.1, 26.5), RIGHT, buff=0.2)
        self.play(Create(branches), run_time=0.6)
        self.play(Create(nil), FadeIn(nom_nil), run_time=2, rate_func=smooth)

        points = {}
        for nom, p in VILLES.items():
            pos = projection(*p)
            point = Dot(pos, radius=0.08, color=ENCRE)
            dessous = nom == "Syène"
            etiquette = Text(nom, font=POLICE, color=ENCRE).scale(0.55)
            etiquette.set_stroke(ENCRE)
            direction = {"Syène": RIGHT, "Alexandrie": DOWN + LEFT, "Cyrène": DOWN}[nom]
            etiquette.next_to(point, direction, buff=0.15)
            points[nom] = point
            self.play(GrowFromCenter(point), Write(etiquette), run_time=0.6)

        a, s = points["Alexandrie"].get_center(), points["Syène"].get_center()
        liaison = DashedLine(a, s, color=ROUGE_CIRE, stroke_width=4, dash_length=0.15)
        question = Text("?", font=POLICE, color=ROUGE_CIRE, weight="BOLD").scale(1.4).move_to((a + s) / 2 + LEFT * 1.3)
        self.play(Create(liaison), run_time=1.2)
        self.play(FadeIn(question, scale=1.6), run_time=0.6)
        self.play(Indicate(question, color=SOLEIL), run_time=1)
        self.wait(1)
