"""Vidéo 9 (puissances de 10) : animations I1 (l'exposant compte les zéros) et I2 (trop grand, juste bien, trop petit).

Rendu (depuis ce dossier) :
    .venv/Scripts/python -m manim -r 1920,1080 --fps 30 i1_i2_puissances.py I1ExposantZeros I2TropGrandTropPetit
"""
from manim import (Scene, VGroup, Line, Rectangle, Text, FadeIn, FadeOut, Write, Transform, Indicate, GrowFromEdge,
                   UP, DOWN, LEFT, RIGHT, ORIGIN)
from charte import ENCRE, SEPIA, ROUGE_CIRE, OCRE, BLEU, VERT, POLICE, fond_parchemin

texte = lambda t, taille=0.5, couleur=ENCRE, **k: Text(t, font=POLICE, color=couleur, **k).scale(taille)
PAS = 0.3  # avance d'un chiffre, pour que les zéros restent alignés d'une ligne à l'autre


def puissance(n, taille=0.8, couleur=ENCRE):
    """10 avec un exposant dessiné en petit (Georgia n'a pas tous les caractères ⁴, ⁵…)."""
    base = texte("10", taille, couleur)
    expo = texte(str(n), taille * 0.6, couleur).next_to(base, UP + RIGHT, buff=0.02).shift(DOWN * 0.12 * taille)
    return VGroup(base, expo)


def expression(*morceaux, taille=0.8, couleur=ENCRE):
    """Morceaux de texte (str) et puissances de 10 (int), alignés sur une même ligne."""
    elems = [puissance(m, taille, couleur) if isinstance(m, int) else texte(m, taille, couleur) for m in morceaux]
    ligne = VGroup(*elems).arrange(RIGHT, buff=0.18)
    for e, m in zip(elems, morceaux):
        if isinstance(m, int):  # aligne le « 10 » (et non le groupe avec son exposant) sur le reste de la ligne
            e.shift(UP * (elems[0].get_center()[1] - e[0].get_center()[1]))
    return ligne


def chiffres(nombre, taille=0.8):
    """Un Text par chiffre, à pas fixe ; une espace occupe un demi-pas."""
    groupe, x = VGroup(), 0.0
    for c in nombre:
        if c == " ":
            x += PAS / 2
            continue
        groupe.add(texte(c, taille).move_to([x, 0, 0], aligned_edge=DOWN if c == "," else ORIGIN))
        x += PAS if c != "," else PAS * 0.45
    return groupe


class I1ExposantZeros(Scene):
    """10¹ à 10⁴ avec un zéro de plus à chaque ligne ; 50 000 ÷ 10² = 500 ; 5 ÷ 10 = 0,5. Environ 10 s."""

    def construct(self):
        self.add(fond_parchemin())
        titre = texte("L'exposant compte les zéros", 0.75, weight="BOLD").to_edge(UP, buff=0.45)
        titre.set_stroke(ENCRE)
        self.play(Write(titre), run_time=1.0)

        # Colonne de gauche : les puissances, le nouveau zéro en ocre.
        for n in range(1, 5):
            y = 1.6 - 1.1 * (n - 1)
            gauche = expression(n, "=").move_to([-4.6, y, 0])
            nombre = chiffres(("10", "100", "1 000", "10 000")[n - 1])
            nombre.next_to(gauche, RIGHT, buff=0.3)
            nombre[-1].set_color(OCRE)
            self.play(FadeIn(gauche), FadeIn(nombre[:-1]), run_time=0.35)
            self.play(FadeIn(nombre[-1], shift=DOWN * 0.3), run_time=0.35)

        separation = Line([0.3, 2.2, 0], [0.3, -2.6, 0], color=SEPIA, stroke_width=2)
        self.play(FadeIn(separation), run_time=0.3)

        # À droite, en haut : diviser par 10², c'est enlever deux zéros.
        calcul = expression("50 000", "÷", 2, "=").move_to([3.0, 1.4, 0])
        self.play(FadeIn(calcul), run_time=0.6)
        nombre = chiffres("50 000").next_to(calcul, DOWN, buff=0.5)
        self.play(FadeIn(nombre), run_time=0.4)
        self.play(nombre[-2:].animate.set_color(ROUGE_CIRE), run_time=0.4)
        self.play(FadeOut(nombre[-2:], shift=UP * 0.4), run_time=0.6)
        reste = chiffres("500").move_to(nombre[:-2]).set_color(BLEU)
        self.play(Transform(nombre[:-2], reste), run_time=0.5)

        # À droite, en bas : plus de zéros, la virgule recule d'un rang.
        calcul2 = expression("5", "÷", "10", "=").move_to([3.0, -0.9, 0])
        self.play(FadeIn(calcul2), run_time=0.5)
        cinq = texte("5", 0.8).next_to(calcul2, DOWN, buff=0.5)
        virgule = texte(",", 0.8).next_to(cinq, RIGHT, buff=0.05, aligned_edge=DOWN)
        self.play(FadeIn(cinq), FadeIn(virgule), run_time=0.4)
        self.play(virgule.animate.next_to(cinq, LEFT, buff=0.05, aligned_edge=DOWN), run_time=0.7)
        zero = texte("0", 0.8).next_to(virgule, LEFT, buff=0.04).align_to(cinq, DOWN)
        self.play(FadeIn(zero, shift=RIGHT * 0.2), VGroup(zero, virgule, cinq).animate.set_color(BLEU), run_time=0.5)
        self.wait(1.2)


M = 3.0       # unités Manim par mètre
X0 = -5.8     # bord gauche commun aux barres
ZONE = (0.3, 2.0)  # mêmes bornes que la pop-up (js/etapes/partie2.js)


class I2TropGrandTropPetit(Scene):
    """La route de 15 000 m divisée par 10³, 10⁴, 10⁵, comparée à la zone des unités humaines. Environ 10 s."""

    def construct(self):
        self.add(fond_parchemin())
        titre = texte("Une route de 15 000 m, divisée par…", 0.7, weight="BOLD").to_edge(UP, buff=0.4)
        titre.set_stroke(ENCRE)
        self.play(Write(titre), run_time=1.0)

        zone = Rectangle(width=(ZONE[1] - ZONE[0]) * M, height=4.9, stroke_width=0, fill_color=VERT, fill_opacity=0.16)
        zone.move_to([X0 + (ZONE[0] + ZONE[1]) / 2 * M, -0.35, 0])
        nom_zone = texte("zone des unités humaines", 0.5, VERT, weight="BOLD").next_to(zone, UP, buff=0.12)
        regles = VGroup()
        for i, (nom, m) in enumerate((("toise", 1.949), ("pied", 0.3248))):
            y = 1.6 - 0.5 * i
            regle = Rectangle(width=m * M, height=0.2, stroke_color=ENCRE, stroke_width=1.5, fill_color=OCRE,
                              fill_opacity=0.9).move_to([X0 + m * M / 2, y, 0])
            regles.add(regle, texte(nom, 0.45, OCRE, weight="BOLD").next_to(regle, RIGHT, buff=0.15))
        self.play(FadeIn(zone), FadeIn(nom_zone), FadeIn(regles), run_time=1.0)

        # (exposant, longueur en m, résultat affiché, verdict, couleur du verdict)
        cas = ((3, 15, "15 m", "trop grand !", ROUGE_CIRE), (4, 1.5, "1,5 m", "juste bien !", VERT),
               (5, 0.15, "15 cm", "trop petit !", ROUGE_CIRE))
        for i, (n, m, resultat, verdict, couleur) in enumerate(cas):
            y = 0.1 - 1.25 * i
            etiquette = expression("÷", n, "=", resultat, taille=0.55).move_to([X0, y + 0.42, 0], aligned_edge=LEFT)
            largeur = min(m * M, 13.5)  # la barre de 15 m sort de l'écran, et c'est voulu
            barre = Rectangle(width=largeur, height=0.26, stroke_color=ENCRE, stroke_width=1.5, fill_color=BLEU,
                              fill_opacity=0.9).move_to([X0 + largeur / 2, y, 0])
            avis = texte(verdict, 0.6, couleur, weight="BOLD").move_to([5.6, y + 0.42, 0])
            self.play(FadeIn(etiquette), GrowFromEdge(barre, LEFT), run_time=0.9)
            self.play(FadeIn(avis, scale=1.2), run_time=0.4)
            if n == 4:
                self.play(Indicate(zone, color=VERT, scale_factor=1.03), run_time=0.6)
            if i:
                saut = texte("÷ 10", 0.4, SEPIA).move_to([X0 - 0.45, y + 0.62, 0])
                self.play(FadeIn(saut), run_time=0.3)
        self.wait(2.0)
