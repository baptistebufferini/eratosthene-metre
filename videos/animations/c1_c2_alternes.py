"""Vidéo 3 (angles alternes-internes) : animations C1 (figure en Z et demi-tour) et C2 (le Z dans la Terre).

Rendu (depuis ce dossier) :
    .venv/Scripts/python -m manim -r 1920,1080 --fps 30 c1_c2_alternes.py C1FigureEnZ C2ZDansLaTerre
"""
import numpy as np
from manim import (Scene, VGroup, VMobject, Line, DashedLine, Dot, Circle, Sector, Text, Create, FadeIn, FadeOut,
                   Write, Rotate, Indicate, UP, DOWN, LEFT, RIGHT, PI, smooth)
from charte import (ENCRE, SEPIA, ROUGE_CIRE, SOLEIL, BLEU, VERT, OCRE, POLICE, fond_parchemin)

texte = lambda t, taille=0.5, couleur=ENCRE, **k: Text(t, font=POLICE, color=couleur, **k).scale(taille)
deg = lambda d: d * PI / 180


def angle(sommet, de, a, rayon=0.6, couleur=ROUGE_CIRE):
    """Secteur angulaire (angles en degrés, sens trigonométrique)."""
    return Sector(radius=rayon, start_angle=deg(de), angle=deg(a - de), arc_center=np.array(sommet),
                  fill_color=couleur, fill_opacity=0.85, stroke_width=0)


def trace_z(points, couleur=SOLEIL):
    return VMobject(stroke_color=couleur, stroke_width=16, stroke_opacity=0.55).set_points_as_corners([np.array(p) for p in points])


class C1FigureEnZ(Scene):
    """Deux parallèles, une sécante, les angles alternes-internes, le Z, puis le demi-tour. Environ 11 s."""

    def construct(self):
        self.add(fond_parchemin())
        Y, PENTE = 1.5, 60  # parallèles en y = ±1,5 ; sécante inclinée à 60° passant par l'origine
        dx = Y / np.tan(deg(PENTE))
        P1, P2 = np.array([dx, Y, 0]), np.array([-dx, -Y, 0])
        haut = Line([-5.5, Y, 0], [5.5, Y, 0], color=BLEU, stroke_width=6)
        bas = Line([-5.5, -Y, 0], [5.5, -Y, 0], color=BLEU, stroke_width=6)
        secante = Line(P2 + (P2 - P1) * 0.45, P1 + (P1 - P2) * 0.45, color=ENCRE, stroke_width=6)
        nom_par = texte("deux droites parallèles", 0.45, BLEU).next_to(haut, UP, buff=0.15).to_edge(LEFT, buff=0.8)
        nom_sec = texte("une sécante", 0.45).next_to(P1 + (P1 - P2) * 0.45, RIGHT, buff=0.1)
        self.play(Create(haut), Create(bas), FadeIn(nom_par), run_time=1.2)
        self.play(Create(secante), FadeIn(nom_sec), run_time=1)

        a1 = angle(P1, 180, 180 + PENTE)  # entre la parallèle (vers la gauche) et la sécante (vers le bas)
        a2 = angle(P2, 0, PENTE)          # entre la parallèle (vers la droite) et la sécante (vers le haut)
        nom_ang = texte("angles alternes-internes", 0.55, ROUGE_CIRE).to_edge(DOWN, buff=0.5)
        self.play(FadeIn(a1), FadeIn(a2), Write(nom_ang), run_time=1.2)

        z = trace_z([[-5.5, Y, 0], P1, P2, [5.5, -Y, 0]])
        lettre = texte("Z", 1.6, OCRE, weight="BOLD").to_corner(UP + RIGHT, buff=0.6)
        self.play(Create(z), FadeIn(lettre), run_time=1.5)
        self.wait(0.5)

        # Le demi-tour autour du milieu du segment de sécante pose un angle exactement sur l'autre.
        centre = Dot([0, 0, 0], radius=0.08, color=ENCRE)
        nom_centre = texte("demi-tour autour de ce point", 0.42).next_to(centre, RIGHT, buff=0.3)
        copie = a1.copy().set_fill(VERT, opacity=0.85)
        self.play(FadeOut(z), FadeIn(centre), FadeIn(nom_centre), run_time=0.8)
        self.add(copie)
        self.play(Rotate(copie, angle=PI, about_point=np.array([0, 0, 0])), run_time=2, rate_func=smooth)
        fin = texte("Même mesure !", 0.7, VERT, weight="BOLD").to_edge(DOWN, buff=0.5)
        self.play(FadeOut(nom_ang), FadeIn(fin), Indicate(copie, color=VERT), run_time=1.2)
        self.wait(1)


class C2ZDansLaTerre(Scene):
    """Coupe de la Terre : les deux rayons parallèles, la sécante centre–obélisque, le Z, puis l'angle reporté au centre."""

    def construct(self):
        self.add(fond_parchemin())
        O, R, ECART, OBEL = np.array([1.0, -3.0, 0]), 3.2, -25, 1.4  # écart agrandi (25° au lieu de 7,2°)
        pt = lambda d, r: O + r * np.array([np.sin(deg(d)), np.cos(deg(d)), 0])
        S, A, P = pt(0, R), pt(ECART, R), pt(ECART, R + OBEL)
        sol_p = np.array([P[0], O[1] + np.sqrt(R ** 2 - (P[0] - O[0]) ** 2), 0])  # où le rayon du sommet touche le sol

        terre = Circle(radius=R, fill_color=OCRE, fill_opacity=0.35, stroke_color=SEPIA, stroke_width=4).move_to(O)
        obelisque = Line(A, P, color=SEPIA, stroke_width=10)
        centre = Dot(O, radius=0.09, color=ENCRE)
        noms = VGroup(texte("Syène", 0.45).next_to(S, RIGHT, buff=0.15).shift(DOWN * 0.15),
                      texte("Alexandrie", 0.45).next_to([P[0] - 0.15, A[1] - 0.35, 0], LEFT, buff=0),
                      texte("centre de la Terre", 0.45).next_to(O, DOWN, buff=0.2),
                      texte("écart entre les villes agrandi", 0.32, SEPIA, slant="ITALIC").to_corner(DOWN + RIGHT, buff=0.3))
        self.add(terre, obelisque, centre, noms)

        rayon_p = Line([P[0], 4.2, 0], sol_p, color=SOLEIL, stroke_width=6)
        rayon_s = Line([S[0], 4.2, 0], S, color=SOLEIL, stroke_width=6)
        prolonge_s = DashedLine(S, O, color=SOLEIL, stroke_width=5)
        nom_rayons = texte("rayons du Soleil, parallèles", 0.45, OCRE).to_corner(UP + LEFT, buff=0.4)
        self.play(Create(rayon_p), Create(rayon_s), FadeIn(nom_rayons), run_time=1.2)
        self.play(Create(prolonge_s), run_time=0.8)
        secante = DashedLine(O, P + (P - O) * 0.12, color=ENCRE, stroke_width=5)
        nom_sec = texte("sécante", 0.45).next_to((O + P) / 2, LEFT, buff=0.25)
        self.play(Create(secante), FadeIn(nom_sec), run_time=1)

        vers_o = np.degrees(np.arctan2(*(O - P)[[1, 0]]))  # direction de P vers le centre
        vers_p = np.degrees(np.arctan2(*(P - O)[[1, 0]]))  # direction du centre vers P
        a_haut = angle(P, -90, vers_o, rayon=1.0)
        a_centre = angle(O, 90, vers_p, rayon=1.0)
        mesure = texte("7,2°", 0.5, ROUGE_CIRE, weight="BOLD").next_to(P + DOWN * 0.55, LEFT, buff=0.15)
        self.play(FadeIn(a_haut), FadeIn(mesure), run_time=0.8)

        z = trace_z([P + DOWN * 1.5, P, O, O + UP * 1.8])
        lettre = texte("Z", 1.6, OCRE, weight="BOLD").to_corner(UP + RIGHT, buff=0.6)
        self.play(Create(z), FadeIn(lettre), run_time=1.5)
        self.wait(0.4)

        milieu = (O + P) / 2
        copie = a_haut.copy()
        self.play(FadeOut(z), run_time=0.5)
        self.add(copie)
        self.play(Rotate(copie, angle=PI, about_point=milieu), run_time=2, rate_func=smooth)
        self.add(a_centre)
        mesure_centre = texte("7,2° aussi !", 0.6, VERT, weight="BOLD").next_to(O + UP * 1.2, RIGHT, buff=0.3)
        self.play(FadeIn(mesure_centre), Indicate(copie, color=VERT), run_time=1.2)
        self.wait(1.2)
