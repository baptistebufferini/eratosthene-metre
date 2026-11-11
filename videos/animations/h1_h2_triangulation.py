"""Vidéo 8 (Delambre et Méchain) : animations H1 (une base, deux angles) et H2 (la chaîne de triangles).

Rendu (depuis ce dossier) :
    .venv/Scripts/python -m manim -r 1920,1080 --fps 30 h1_h2_triangulation.py H1BaseDeuxAngles H2ChaineDeTriangles
"""
import numpy as np
from manim import (Scene, VGroup, VMobject, Line, Arc, Dot, Polygon, Rectangle, Triangle, Text, Create, FadeIn,
                   Write, Indicate, GrowFromCenter, UP, DOWN, LEFT, RIGHT, DEGREES)
from charte import (ENCRE, SEPIA, ROUGE_CIRE, OCRE, BLEU, VERT, SOLEIL, POLICE, fond_parchemin)

texte = lambda t, taille=0.5, couleur=ENCRE, **k: Text(t, font=POLICE, color=couleur, **k).scale(taille)


def clocher(pied):
    """Petit clocher (tour + flèche) posé sur le point pied."""
    tour = Rectangle(width=0.32, height=0.5, fill_color=SEPIA, fill_opacity=0.9, stroke_color=ENCRE, stroke_width=2)
    tour.move_to(pied + UP * 0.25)
    fleche = Triangle(fill_color=ROUGE_CIRE, fill_opacity=0.9, stroke_color=ENCRE, stroke_width=2)
    fleche.stretch_to_fit_width(0.42).stretch_to_fit_height(0.45).next_to(tour, UP, buff=0)
    return VGroup(tour, fleche)


class H1BaseDeuxAngles(Scene):
    """Une base se pose, deux angles s'ouvrent à ses bouts, les demi-droites se coupent sur un clocher. Environ 9 s."""

    def construct(self):
        self.add(fond_parchemin())
        a, b = np.array([-2.8, -2.4, 0]), np.array([2.8, -2.4, 0])
        alpha, beta = 60 * DEGREES, 50 * DEGREES
        # Côté AC par la loi des sinus : c'est le seul point où les deux demi-droites se croisent.
        ac = np.linalg.norm(b - a) * np.sin(beta) / np.sin(np.pi - alpha - beta)
        c = a + ac * np.array([np.cos(alpha), np.sin(alpha), 0])

        base = Line(a, b, color=VERT, stroke_width=9)
        nom_base = texte("base mesurée au sol", 0.55, VERT, weight="BOLD").next_to(base, DOWN, buff=0.3)
        self.play(Create(base), FadeIn(nom_base), run_time=1.2)

        arc_a = Arc(radius=0.8, start_angle=0, angle=alpha, arc_center=a, color=ROUGE_CIRE, stroke_width=6)
        arc_b = Arc(radius=0.8, start_angle=np.pi - beta, angle=beta, arc_center=b, color=ROUGE_CIRE, stroke_width=6)
        nom_a = texte("angle visé", 0.42, ROUGE_CIRE).next_to(arc_a, LEFT, buff=0.15).shift(UP * 0.2)
        nom_b = texte("angle visé", 0.42, ROUGE_CIRE).next_to(arc_b, RIGHT, buff=0.15).shift(UP * 0.2)
        self.play(Create(arc_a), FadeIn(nom_a), run_time=0.8)
        self.play(Create(arc_b), FadeIn(nom_b), run_time=0.8)

        self.play(Create(Line(a, c, color=ENCRE, stroke_width=5)), Create(Line(b, c, color=ENCRE, stroke_width=5)),
                  run_time=1.6)
        point = Dot(c, radius=0.09, color=ENCRE)
        tour = clocher(c)
        self.play(GrowFromCenter(point), FadeIn(tour, shift=DOWN * 0.3), run_time=0.7)
        fond = Polygon(a, b, c, stroke_width=0, fill_color=SOLEIL, fill_opacity=0.25)
        self.play(FadeIn(fond), run_time=0.6)

        regle = texte("un côté + deux angles = un seul triangle", 0.7, weight="BOLD").to_edge(UP, buff=0.45)
        regle.set_stroke(ENCRE)
        self.play(Write(regle), run_time=1.5)
        self.play(Indicate(fond, color=SOLEIL, scale_factor=1.03), run_time=0.8)
        self.wait(1.2)


def projection(lon, lat):
    """Carte de France : x = (longitude − 2,4) × 0,49 − 2 ; y = (latitude − 46,3) × 0,7 (unités Manim)."""
    return np.array([(lon - 2.4) * 0.49 - 2.0, (lat - 46.3) * 0.7, 0])


# shortcut: contour très simplifié à la main, suffisant pour situer le méridien ; prendre un vrai tracé si la carte doit être exacte.
FRANCE = [(2.5, 51.1), (4.2, 50.0), (5.9, 49.5), (8.2, 49.0), (7.6, 47.6), (6.1, 46.2), (7.0, 45.2), (7.6, 43.8),
          (6.2, 43.1), (4.6, 43.4), (3.1, 43.1), (3.2, 42.4), (1.7, 42.5), (-1.8, 43.4), (-1.2, 44.6), (-1.2, 46.2),
          (-2.5, 47.2), (-4.7, 48.0), (-4.6, 48.6), (-3.0, 48.8), (-1.6, 48.7), (-1.9, 49.7), (-1.2, 49.4),
          (0.2, 49.5), (1.6, 50.2), (2.5, 51.1)]
COTE_ESPAGNE = [(3.2, 42.4), (3.2, 41.9), (2.17, 41.39), (1.2, 41.1)]
VILLES = {"Dunkerque": (2.38, 51.03), "Rodez": (2.57, 44.35), "Barcelone": (2.17, 41.39)}
# Sommets de la chaîne, en zigzag de part et d'autre du méridien (nombre de triangles volontairement non historique).
SOMMETS = [VILLES["Dunkerque"]] + [(3.3 if k % 2 else 1.5, lat) for k, lat in
                                   enumerate(np.linspace(51.03, 41.39, 9)[1:-1], start=1)] + [VILLES["Barcelone"]]


class H2ChaineDeTriangles(Scene):
    """Sur la carte, la chaîne de triangles descend de Dunkerque à Barcelone ; Rodez, puis la base de Perpignan. Environ 10 s."""

    def construct(self):
        self.add(fond_parchemin())
        contour = VMobject(stroke_color=SEPIA, stroke_width=4, fill_color=SOLEIL, fill_opacity=0.12)
        contour.set_points_as_corners([projection(*p) for p in FRANCE])
        espagne = VMobject(stroke_color=SEPIA, stroke_width=3).set_points_as_corners([projection(*p) for p in COTE_ESPAGNE])
        self.play(Create(contour), Create(espagne), run_time=1.3)

        points = [projection(*p) for p in SOMMETS]
        y_rodez = projection(*VILLES["Rodez"])[1]
        for nom in ("Dunkerque", "Barcelone"):
            pos = projection(*VILLES[nom])
            etiquette = texte(nom, 0.5, weight="BOLD").next_to(pos, RIGHT if nom == "Dunkerque" else LEFT, buff=0.2)
            self.add(Dot(pos, radius=0.08, color=ENCRE), etiquette)

        # Chaque triangle (k, k+1, k+2) partage le côté (k+1, k+2) avec le suivant.
        for k in range(len(points) - 2):
            tri = points[k:k + 3]
            couleur = OCRE if np.mean([p[1] for p in tri]) > y_rodez else BLEU
            triangle = Polygon(*tri, stroke_color=ENCRE, stroke_width=2.5, fill_color=couleur, fill_opacity=0.45)
            self.play(Create(triangle), run_time=0.6)

        rodez = projection(*VILLES["Rodez"])
        point_r = Dot(rodez, radius=0.11, color=ROUGE_CIRE)
        nom_r = texte("Rodez", 0.55, ROUGE_CIRE, weight="BOLD").next_to(rodez, RIGHT, buff=0.9)
        trait_r = Line(rodez, nom_r.get_left() + LEFT * 0.1, color=ROUGE_CIRE, stroke_width=2)
        self.play(GrowFromCenter(point_r), Create(trait_r), FadeIn(nom_r), run_time=0.8)

        legende = VGroup(*[VGroup(Rectangle(width=0.4, height=0.3, fill_color=c, fill_opacity=0.6, stroke_color=ENCRE,
                                            stroke_width=2), texte(n, 0.55, c, weight="BOLD")).arrange(RIGHT, buff=0.25)
                           for n, c in (("Delambre (nord)", OCRE), ("Méchain (sud)", BLEU))])
        legende.arrange(DOWN, aligned_edge=LEFT, buff=0.3).move_to([3.8, 2.4, 0])
        self.play(FadeIn(legende), run_time=0.6)

        base = Line(projection(2.3, 43.0), projection(3.1, 42.5), color=VERT, stroke_width=12)
        nom_base = texte("base de vérification", 0.5, VERT, weight="BOLD").next_to(base, RIGHT, buff=0.9)
        trait_b = Line(base.get_right(), nom_base.get_left() + LEFT * 0.1, color=VERT, stroke_width=2)
        self.play(Create(base), Create(trait_b), FadeIn(nom_base), run_time=0.8)
        self.play(Indicate(base, color=VERT, scale_factor=1.4), run_time=0.7)
        self.play(Indicate(base, color=VERT, scale_factor=1.4), run_time=0.7)
        self.wait(1.2)
