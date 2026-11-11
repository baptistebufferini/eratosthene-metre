"""Vidéo 2 (rayons parallèles) : animations B1 (la lampe qui s'éloigne) et B2 (l'échelle vertigineuse).

Rendu (depuis ce dossier) :
    .venv/Scripts/python -m manim -r 1920,1080 --fps 30 b1_b2_rayons.py B1LampeQuiRecule B2Echelle
"""
import numpy as np
from manim import (Scene, MovingCameraScene, VGroup, Line, Dot, Circle, Text, ValueTracker,
                   always_redraw, UpdateFromAlphaFunc, FadeIn, FadeOut, Write, Create, UP, DOWN, LEFT, RIGHT, linear, smooth)
from charte import (ENCRE, SEPIA, ROUGE_CIRE, SOLEIL, BLEU, VERT, POLICE, fond_parchemin)

texte = lambda t, taille=0.5, couleur=ENCRE, **k: Text(t, font=POLICE, color=couleur, **k).scale(taille)


class B1LampeQuiRecule(Scene):
    """Deux crayons vus de dessus ; la lampe recule et les ombres passent de l'éventail au parallèle. Environ 9 s."""

    def construct(self):
        self.add(fond_parchemin())
        ECART, Y = 0.7, -1.4  # demi-écart entre les crayons, position des crayons
        D0, D1 = 1.4, 400.0
        t = ValueTracker(0)
        dist = lambda: D0 * (D1 / D0) ** t.get_value()  # recul exponentiel : on voit bien le début et la fin
        crayons = [np.array([-ECART, Y, 0]), np.array([ECART, Y, 0])]

        def scene():
            lampe = np.array([0, Y + dist(), 0])
            g = VGroup()
            for c in crayons:
                u = (c - lampe) / np.linalg.norm(c - lampe)
                g.add(Line(lampe, c, color=SOLEIL, stroke_width=4))  # rayon
                g.add(Line(c, c + u * 1.6, color=ENCRE, stroke_width=14, stroke_opacity=0.55))  # ombre
                g.add(Dot(c, radius=0.11, color=SEPIA))  # crayon vu de dessus
            y_vu = min(lampe[1], 3.2)
            g.add(Dot([0, y_vu, 0], radius=0.22, color=SOLEIL))
            if lampe[1] > 3.2:
                cm = dist() * 10  # 1 unité = 10 cm (crayons écartés de 14 cm)
                g.add(texte(f"lampe à {cm / 100:.0f} m" if cm >= 200 else f"lampe à {cm:.0f} cm", 0.4, SEPIA).next_to([0, y_vu, 0], RIGHT, buff=0.3))
            return g

        dessin = always_redraw(scene)
        titre = texte("Vue de dessus : deux crayons éclairés par une lampe", 0.42, SEPIA).to_corner(UP + LEFT, buff=0.4)
        # Text plutôt que DecimalNumber : DecimalNumber exige LaTeX
        angle = always_redraw(lambda: texte(f"{np.degrees(2 * np.arctan(ECART / dist())):.1f}°".replace(".", ","), 0.8, ROUGE_CIRE,
                                            weight="BOLD").to_corner(DOWN + RIGHT, buff=0.6))
        legende = texte("écart entre les deux rayons :", 0.42).next_to(angle, LEFT, buff=0.25)
        self.add(titre)
        self.play(FadeIn(dessin), FadeIn(legende), FadeIn(angle), run_time=1)
        self.wait(1)
        self.play(t.animate.set_value(1), run_time=5, rate_func=smooth)
        fin = texte("Plus la lampe est loin,\nplus les rayons\nsont parallèles.", 0.6, VERT).to_edge(LEFT, buff=0.8).shift(UP * 0.3)
        self.play(FadeIn(fin), run_time=0.8)
        self.wait(1.5)


class B2Echelle(MovingCameraScene):
    """Zoom arrière à l'échelle « 800 km = 1 cm », de la règle jusqu'au Soleil. Environ 10 s.
    Unité de la scène : 1 centimètre de la maquette."""

    def construct(self):
        cadre = self.camera.frame
        L0, L1 = 6.0, 520000.0  # largeur visible au début et à la fin (en cm de maquette)
        CENTRE = 0.3  # l'origine reste vers la gauche de l'écran
        cadre.set(width=L0).move_to([L0 * CENTRE, 0, 0])

        def etiquette(t, x, hauteur, couleur=ENCRE):
            e = texte(t, 1, couleur)
            e.scale(hauteur / e.height)
            return e

        seg = Line([0, 0, 0], [1, 0, 0], color=ROUGE_CIRE, stroke_width=10)
        reperes = VGroup()
        for x, nom in ((10, "10 cm"), (100, "1 m"), (1000, "10 m"), (10000, "100 m"), (100000, "1 km")):
            h = x * 0.12  # chaque repère est lisible quand l'écran montre environ 2 à 10 fois sa distance
            reperes.add(Line([x, -h, 0], [x, h, 0], color=SEPIA, stroke_width=6),
                        etiquette(nom, x, x * 0.07, SEPIA).next_to([x, -h, 0], DOWN, buff=h * 0.25))
        # rappels « Alexandrie – Syène » de plus en plus grands, placés de plus en plus haut :
        # chacun n'entre dans l'écran qu'à son échelle, pour ne jamais perdre le point de départ de vue
        drapeaux = VGroup(*[etiquette("Alexandrie – Syène (1 cm)", 0, h * 0.025, ROUGE_CIRE).next_to([0, h * 0.06, 0], RIGHT, buff=0)
                            for h in (100, 1000, 10000, 100000)])
        axe = Line([0, 0, 0], [190000, 0, 0], color=SEPIA, stroke_width=6)
        # Soleil à l'échelle : 150 000 000 km ÷ 800 = 187 500 cm ; diamètre 1 392 000 km ÷ 800 ≈ 1 740 cm
        soleil = Circle(radius=870, fill_color=SOLEIL, fill_opacity=1, stroke_width=0).move_to([187500, 0, 0])
        halo = Circle(radius=14000, fill_color=SOLEIL, fill_opacity=0.25, stroke_color=SOLEIL, stroke_width=6).move_to(soleil)
        nom_soleil = etiquette("Soleil (à 1,9 km)", 187500, 16000, ENCRE).next_to(halo, UP, buff=4000)
        villes = etiquette("Alexandrie – Syène = 1 cm", 0.5, 0.25, ROUGE_CIRE).next_to(seg, UP, buff=0.15)

        self.add(axe, seg, reperes, drapeaux, halo, soleil, nom_soleil)
        self.play(Write(villes), run_time=1.2)
        self.wait(0.5)
        zoom = lambda c, a: c.set(width=L0 * (L1 / L0) ** smooth(a)).move_to([c.width * CENTRE, 0, 0])  # zoom exponentiel
        self.play(UpdateFromAlphaFunc(cadre, zoom), run_time=6, rate_func=linear)
        w = cadre.width
        conclusion = etiquette("Le Soleil serait à près de 2 km !", 0, w * 0.045, ROUGE_CIRE).move_to([w * CENTRE, -w * 0.17, 0])
        self.play(FadeIn(conclusion), run_time=0.8)
        self.wait(1.5)
