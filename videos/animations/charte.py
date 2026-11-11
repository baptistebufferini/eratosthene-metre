"""Charte graphique commune aux animations : celle de l'activité (parchemin + couleurs du mode pop-up)."""
from manim import Rectangle, Circle, VGroup, config, ManimColor

PARCHEMIN = ManimColor("#F1E2C0")
PARCHEMIN_FONCE = ManimColor("#E2CC9C")
ENCRE = ManimColor("#3A2614")
SEPIA = ManimColor("#7A4F27")
ROUGE_CIRE = ManimColor("#9E2A22")
SOLEIL = ManimColor("#F5B700")
OCRE = ManimColor("#D4813A")
BLEU = ManimColor("#2F6FB3")
VERT = ManimColor("#2E9E5B")
POLICE = "Georgia"  # shortcut: police système ; installer IM Fell English pour coller exactement au site

config.background_color = PARCHEMIN


def fond_parchemin():
    """Bords plus sombres et quelques taches d'encre, comme le carnet du site."""
    w, h = config.frame_width, config.frame_height
    bords = VGroup(*[
        Rectangle(width=w + 2 * k * 0.12, height=h + 2 * k * 0.12, stroke_color=PARCHEMIN_FONCE,
                  stroke_width=26, stroke_opacity=0.10 + 0.05 * k)
        for k in range(6)
    ])
    taches = VGroup(
        Circle(radius=0.45, fill_color=SEPIA, fill_opacity=0.10, stroke_width=0).move_to([w / 2 - 1.3, h / 2 - 1.0, 0]),
        Circle(radius=0.8, fill_color=SEPIA, fill_opacity=0.06, stroke_width=0).move_to([w / 2 - 1.2, h / 2 - 1.2, 0]),
        Circle(radius=0.2, fill_color=SEPIA, fill_opacity=0.10, stroke_width=0).move_to([-w / 2 + 1.0, -h / 2 + 1.2, 0]),
    )
    return VGroup(bords, taches)
