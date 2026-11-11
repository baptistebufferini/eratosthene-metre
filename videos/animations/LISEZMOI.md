# Animations des vidéos (Manim)

Les animations sont générées en Python avec [Manim](https://www.manim.community/) et exportées en MP4 (1920 × 1080, 30 images par seconde). Elles reprennent les couleurs de l'activité, définies dans `charte.py`.

| Fichier MP4 | Scène | Vidéo | Durée |
|---|---|---|---|
| `mp4/A1Titre.mp4` | `A1Titre` | 1 · Introduction | 6 s |
| `mp4/A2CarteEgypte.mp4` | `A2CarteEgypte` | 1 · Introduction | 10 s |
| `mp4/B1LampeQuiRecule.mp4` | `B1LampeQuiRecule` | 2 · Rayons parallèles | 9 s |
| `mp4/B2Echelle.mp4` | `B2Echelle` | 2 · Rayons parallèles | 10 s |
| `mp4/C1FigureEnZ.mp4` | `C1FigureEnZ` | 3 · Alternes-internes | 10 s |
| `mp4/C2ZDansLaTerre.mp4` | `C2ZDansLaTerre` | 3 · Alternes-internes | 11 s |
| `mp4/D1TroisGestes.mp4` | `D1TroisGestes` | 4 · Rapporteur | 10 s |
| `mp4/D2Loupe.mp4` | `D2Loupe` | 4 · Rapporteur | 7 s |
| `mp4/E1QuartEtHorloge.mp4` | `E1QuartEtHorloge` | 5 · Un cinquantième | 10 s |
| `mp4/E2CinquanteParts.mp4` | `E2CinquanteParts` | 5 · Un cinquantième | 8 s |
| `mp4/F1ArcEtCoefficient.mp4` | `F1ArcEtCoefficient` | 6 · Proportionnalité | 10 s |
| `mp4/F2RegleDeTrois.mp4` | `F2RegleDeTrois` | 6 · Proportionnalité | 11 s |

## Refaire le rendu

Manim ne s'installe pas encore avec Python 3.15. Il faut un Python 3.12, installé ici grâce à `uv` :

```bash
python -m pip install --user uv
```

```bash
python -m uv python install 3.12
```

Ensuite, depuis ce dossier, créez l'environnement avec le Python 3.12 obtenu, installez Manim et lancez le rendu :

```bash
python -m uv venv --python 3.12 .venv
```

```bash
python -m uv pip install --python .venv/Scripts/python.exe manim
```

```bash
.venv/Scripts/python -m manim -r 1920,1080 --fps 30 a1_a2_introduction.py A1Titre A2CarteEgypte
```

```bash
.venv/Scripts/python -m manim -r 1920,1080 --fps 30 b1_b2_rayons.py B1LampeQuiRecule B2Echelle
```

```bash
.venv/Scripts/python -m manim -r 1920,1080 --fps 30 c1_c2_alternes.py C1FigureEnZ C2ZDansLaTerre
```

```bash
.venv/Scripts/python -m manim -r 1920,1080 --fps 30 d1_d2_rapporteur.py D1TroisGestes D2Loupe
```

```bash
.venv/Scripts/python -m manim -r 1920,1080 --fps 30 e1_e2_cinquantieme.py E1QuartEtHorloge E2CinquanteParts
```

```bash
.venv/Scripts/python -m manim -r 1920,1080 --fps 30 f1_f2_proportionnalite.py F1ArcEtCoefficient F2RegleDeTrois
```

Évitez aussi les symboles absents de Georgia (①, ↓…) : ils s'affichent comme des carrés.

N'utilisez pas d'objets Manim qui passent par LaTeX (`MathTex`, `DecimalNumber`…) : LaTeX n'est pas installé. Écrivez les nombres avec `Text`.

Les vidéos sont produites dans `media/videos/…/1080p30/`. Copiez-les ensuite dans `mp4/`.

Pour un aperçu rapide en basse qualité, remplacez `-r 1920,1080 --fps 30` par `-ql`. Pour ne rendre que la dernière image, ajoutez `-s`.
