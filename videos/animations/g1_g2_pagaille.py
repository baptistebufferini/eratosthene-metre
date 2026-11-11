"""Vidéo 7 (la pagaille des unités) : animations G1 (deux aunes) et G2 (toise, pieds, pouces).

Rendu (depuis ce dossier) :
    .venv/Scripts/python -m manim -r 1920,1080 --fps 30 g1_g2_pagaille.py G1DeuxAunes G2ToisePiedsPouces
"""
from manim import (Scene, VGroup, Line, Rectangle, Text, Create, FadeIn, Write, Indicate, GrowFromEdge,
                   ReplacementTransform, UP, DOWN, LEFT, RIGHT)
from charte import (PARCHEMIN_FONCE, ENCRE, SEPIA, ROUGE_CIRE, OCRE, BLEU, POLICE, fond_parchemin)

texte = lambda t, taille=0.5, couleur=ENCRE, **k: Text(t, font=POLICE, color=couleur, **k).scale(taille)


def regle(longueur, couleur, n_traits, hauteur=0.55):
    """Règle en bois posée à partir de l'origine (bord gauche en x = 0), avec n_traits graduations."""
    corps = Rectangle(width=longueur, height=hauteur, fill_color=couleur, fill_opacity=0.85,
                      stroke_color=ENCRE, stroke_width=3).move_to([longueur / 2, 0, 0])
    traits = VGroup(*[Line([longueur * k / n_traits, hauteur / 2, 0], [longueur * k / n_traits, hauteur / 2 - 0.18, 0],
                           color=ENCRE, stroke_width=2) for k in range(1, n_traits)])
    return VGroup(corps, traits)


def segments(x0, longueur, n, y, hauteur, couleurs):
    """Barre coupée en n cases égales, de x0 à x0 + longueur."""
    pas = longueur / n
    return VGroup(*[Rectangle(width=pas, height=hauteur, fill_color=couleurs[k % len(couleurs)], fill_opacity=0.75,
                              stroke_color=ENCRE, stroke_width=2.5).move_to([x0 + pas * (k + 0.5), y, 0])
                    for k in range(n)])


class G1DeuxAunes(Scene):
    """Deux règles « aune » de longueurs différentes, alignées à gauche ; l'écart clignote en rouge. Environ 7 s."""

    def construct(self):
        self.add(fond_parchemin())
        x0 = -5.0
        # Longueurs volontairement non chiffrées : le script ne donne pas les valeurs exactes des deux aunes.
        paris = regle(8.6, OCRE, 12).shift([x0, 1.0, 0])
        lyon = regle(7.6, BLEU, 12).shift([x0, -1.0, 0])
        nom_p = texte("Paris", 0.6, weight="BOLD").next_to(paris, LEFT, buff=0.35)
        nom_l = texte("Lyon", 0.6, weight="BOLD").next_to(lyon, LEFT, buff=0.35)
        mot_p = texte("une aune", 0.5, SEPIA).next_to(paris, UP, buff=0.2)
        mot_l = texte("une aune", 0.5, SEPIA).next_to(lyon, DOWN, buff=0.2)
        titre = texte("Même nom…", 0.75, weight="BOLD").to_edge(UP, buff=0.5)
        titre.set_stroke(ENCRE)

        self.play(Write(titre), run_time=0.8)
        self.play(FadeIn(nom_p), GrowFromEdge(paris, LEFT), FadeIn(mot_p), run_time=1.0)
        self.play(FadeIn(nom_l), GrowFromEdge(lyon, LEFT), FadeIn(mot_l), run_time=1.0)

        bout_l, bout_p = 7.6 + x0, 8.6 + x0
        ecart = Rectangle(width=bout_p - bout_l, height=2.55, fill_color=ROUGE_CIRE, fill_opacity=0.25,
                          stroke_color=ROUGE_CIRE, stroke_width=3).move_to([(bout_l + bout_p) / 2, 0, 0])
        point = texte("?", 1.3, ROUGE_CIRE, weight="BOLD").move_to([bout_p + 0.75, 0, 0])
        suite = texte("…pas la même longueur !", 0.75, ROUGE_CIRE, weight="BOLD").to_edge(DOWN, buff=0.5)
        self.play(FadeIn(ecart), run_time=0.5)
        self.play(Indicate(ecart, color=ROUGE_CIRE, scale_factor=1.15), FadeIn(point), run_time=0.8)
        self.play(Indicate(ecart, color=ROUGE_CIRE, scale_factor=1.15), run_time=0.8)
        self.play(FadeIn(suite), run_time=0.6)
        self.wait(1.5)


class G2ToisePiedsPouces(Scene):
    """Une toise se coupe en 6 pieds (× 6), puis un pied grossit et se coupe en 12 pouces (× 12). Environ 9 s."""

    def construct(self):
        self.add(fond_parchemin())
        x0, L, y_t = -6.0, 12.0, 2.0
        toise = Rectangle(width=L, height=0.7, fill_color=OCRE, fill_opacity=0.85, stroke_color=ENCRE,
                          stroke_width=3).move_to([x0 + L / 2, y_t, 0])
        nom_toise = texte("1 toise", 0.6, weight="BOLD").next_to(toise, UP, buff=0.25)
        self.play(GrowFromEdge(toise, LEFT), FadeIn(nom_toise), run_time=1.0)

        pieds = segments(x0, L, 6, y_t, 0.7, [OCRE, PARCHEMIN_FONCE])
        noms_pieds = VGroup(*[texte("pied", 0.4).move_to(p) for p in pieds])
        fois6 = texte("× 6", 0.7, ROUGE_CIRE, weight="BOLD").next_to(nom_toise, RIGHT, buff=0.6)
        self.play(ReplacementTransform(toise, pieds), FadeIn(noms_pieds), run_time=1.0)
        self.play(FadeIn(fois6), run_time=0.6)
        self.wait(0.5)

        # Le premier pied « descend » et s'agrandit à toute la largeur.
        y_p = -0.6
        grand = Rectangle(width=L, height=0.9, fill_color=OCRE, fill_opacity=0.85, stroke_color=ENCRE,
                          stroke_width=3).move_to([x0 + L / 2, y_p, 0])
        loupe = VGroup(Line(pieds[0].get_corner(DOWN + LEFT), grand.get_corner(UP + LEFT), color=SEPIA, stroke_width=2),
                       Line(pieds[0].get_corner(DOWN + RIGHT), grand.get_corner(UP + RIGHT), color=SEPIA, stroke_width=2))
        nom_pied = texte("1 pied", 0.55, weight="BOLD").next_to(grand, DOWN, buff=0.35).align_to(grand, LEFT)
        self.play(Indicate(pieds[0], color=ROUGE_CIRE), run_time=0.6)
        self.play(ReplacementTransform(pieds[0].copy(), grand), Create(loupe), FadeIn(nom_pied), run_time=1.0)

        pouces = segments(x0, L, 12, y_p, 0.9, [OCRE, PARCHEMIN_FONCE])
        noms_pouces = VGroup(*[texte("pouce", 0.3).move_to(p) for p in pouces])
        fois12 = texte("× 12", 0.7, ROUGE_CIRE, weight="BOLD").next_to(grand, DOWN, buff=0.35)
        self.play(ReplacementTransform(grand, pouces), FadeIn(noms_pouces), run_time=1.0)
        self.play(FadeIn(fois12), run_time=0.6)
        self.wait(0.4)

        alerte = texte("pas en base 10 !", 0.9, ROUGE_CIRE, weight="BOLD").to_edge(DOWN, buff=0.45)
        alerte.set_stroke(ROUGE_CIRE)
        self.play(Write(alerte), run_time=0.9)
        self.play(Indicate(fois6, color=ROUGE_CIRE), Indicate(fois12, color=ROUGE_CIRE), run_time=0.8)
        self.wait(1.5)
