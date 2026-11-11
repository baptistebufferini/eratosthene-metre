# Reprise du projet : où on en est

À donner à Claude au début d'une nouvelle session : « Lis REPRISE.md et reprends. »

## ▶ Tâche de la prochaine session

**Commit et mise en ligne.**

1. Demander d'abord au professeur : le nom du dépôt GitHub, et s'il doit être public (GitHub Pages gratuit demande un dépôt public).
2. Lancer les tests (`node tests/correction.test.mjs` et `node tests/codes.test.mjs`), puis vérifier `git status` : rien ne doit être oublié (vidéos 7, 8, 9, `CLAUDE.md`, `REPRISE.md`). Ne pas commiter `videos/animations/media/` ni `.venv` (vérifier le `.gitignore`).
3. Commiter tout le travail en attente sur `main`.
4. Créer le dépôt avec `gh repo create`, pousser `main`, activer Pages (branche `main`, dossier racine), puis ouvrir le site en ligne et vérifier qu'il se charge, avec une étape de la partie 2.

Points ouverts à signaler : les liens de `config/videos.json` sont tous encore vides (les vidéos ne sont pas encore tournées ni mises en ligne). Le sceau `trois-raisons` est encore ○ dans `SOURCES.md`, et l'arrestation de Delambre / Méchain bloqué en Espagne n'y est pas encore ajoutée.

## Le projet

Activité web de maths pour le collège, « De la Terre d'Ératosthène au mètre ». C'est un site statique pour GitHub Pages, dans `C:\Users\bapti\Documents\eratosthene-metre`. Les consignes d'origine sont dans le PDF `Downloads\Consignes Claude Code — De la Terre d'Ératosthène au mètre.pdf`.

**Règle des consignes :** chaque script vidéo, puis chaque paire d'animations, est validé par le professeur avant de passer au suivant.

## Ce qui est fait (commit `e669616` sur `main`, non poussé)

- **Site complet** : `index.html`, avec un prologue (Terre ronde, 3 animations), la partie 1 (étapes 1 à 6 et le diplôme), une transition, la partie 2 (étapes 7 à 11) et l'écran final avec le code de l'élève.
- **Page professeur** : `prof.html`.
- **Contenu** : tous les textes, questions, réponses brouillées, indices et sceaux sont dans `config/contenu.json`. Les liens vidéo sont dans `config/videos.json` (tous encore vides).
- **Documentation** : `README.md` (déploiement, édition, codes), `SOURCES.md` (33 sceaux et état de leur vérification), `outils/brouiller.html` (pour brouiller une nouvelle réponse).
- **Tests** : `node tests/correction.test.mjs` et `node tests/codes.test.mjs`.
- **Vidéos de la partie 1** : 6 scripts dans `videos/scripts/01` à `06`, et 12 animations MP4 dans `videos/animations/mp4/` (A1-A2, B1-B2, C1-C2, D1-D2, E1-E2, F1-F2). Elles sont toutes validées.

## Fait depuis le commit (modifications non commitées)

- **Vidéo 7** « La pagaille des unités » : terminée et validée. Le script est `videos/scripts/07-pagaille-unites.md`, les animations sont dans `g1_g2_pagaille.py` et dans `mp4/G1DeuxAunes.mp4` et `mp4/G2ToisePiedsPouces.mp4`. L'emplacement s'appelle `partie2-introduction` (écran de transition).
- **Vidéo 8** « Delambre et Méchain » : l'emplacement `triangulation` est créé, avec un bloc vidéo au début de l'étape 8, une ligne dans `videos.json` et une dans le README. Le script `videos/scripts/08-triangulation.md` est validé. Les animations sont dans `h1_h2_triangulation.py` et dans `mp4/H1BaseDeuxAngles.mp4` (9 s) et `mp4/H2ChaineDeTriangles.mp4` (10 s) ; elles sont **validées**. La carte de France de H2 est un contour très simplifié, tracé à la main.
- **Étape 8** (`config/contenu.json`) : « arrêtés comme espions, bloqués par la guerre » devient « Delambre arrêté comme espion, Méchain bloqué en Espagne par la guerre ». Ce point n'est pas encore ajouté à `SOURCES.md` (◐, source : Ken Alder, *Mesurer le monde*).
- **Vidéo 9** « Les puissances de 10 » : terminée et validée. Le script est `videos/scripts/09-puissances-de-10.md` (exemple d'une route de 15 km, pour ne jamais diviser le quart de méridien). Les animations sont dans `i1_i2_puissances.py`, `mp4/I1ExposantZeros.mp4` (10 s) et `mp4/I2TropGrandTropPetit.mp4` (9 s).
- Les tests passent.

## Ce qui reste à faire, dans l'ordre (une tâche par session)

1. **Commit et mise en ligne** : commiter tout le travail en attente, puis créer le dépôt GitHub (avec `gh`), pousser `main`, activer Pages (branche `main`, dossier racine), puis vérifier le site en ligne. Demander d'abord au professeur le nom du dépôt et s'il doit être public. C'est la tâche décrite en haut de ce fichier.

## Conventions pour les vidéos

- **Format d'un script** (`videos/scripts/NN-nom.md`) : en-tête (emplacement, durée, objectif, ce que la vidéo ne fait **pas**), tableau minuté « Plan | Temps | Ce que je dis | À l'écran », tableau de rigueur avec les sceaux, idées de mise en scène, puis les 2 animations proposées.
- **Ne jamais donner la réponse d'une question de l'activité** dans une vidéo d'indice : utiliser des exemples différents. Éviter aussi les valeurs citées dans les « retours » des mauvaises réponses. Choisir un exemple qui tombe nettement à l'intérieur d'une zone, pas sur sa limite.
- **Animations** : avec Manim, dans `videos/animations/`, un fichier `x1_x2_nom.py` par vidéo. La charte commune (parchemin et couleurs du pop-up) est dans `charte.py`.
  - Rendu final : `.venv/Scripts/python -m manim -r 1920,1080 --fps 30 fichier.py Scene1 Scene2`, depuis ce dossier. Copier ensuite le MP4 de `media/videos/…/1080p30/` vers `mp4/`, et ajouter une ligne au tableau de `videos/animations/LISEZMOI.md`.
  - Vérification : rendu d'essai avec `-ql`, puis extraction d'images avec PyAV (`av`) dans le `.venv`, et lecture des images.
  - **Pièges** : LaTeX n'est pas installé, donc pas de `MathTex` ni de `DecimalNumber` (utiliser `Text`). Georgia n'a pas les symboles ①, ↓ ou → (ils s'affichent en carrés). Faire `set_stroke(ENCRE)` sur un texte animé avec `Write`, sinon son tracé apparaît en blanc. Pour un zoom de caméra, utiliser `UpdateFromAlphaFunc` plutôt qu'un updater. Ne pas mettre `Indicate` et `FadeIn` sur le même objet dans un même `play`. Pour une carte, une chaîne de triangles trop serrée en largeur ressemble à une échelle : écarter les sommets. Pour un exposant, dessiner un petit `Text` surélevé (fonction `puissance` de `i1_i2_puissances.py`) plutôt que les caractères ⁴, ⁵…, absents de Georgia. Pour des chiffres qu'on fait disparaître un à un, un `Text` par chiffre à pas fixe (0,3 à l'échelle 0,8) ; un pas plus large se lit « 1 0 0 0 ». Pour extraire les images, passer par un petit script `.py` dans le scratchpad plutôt que par `python -c` (les antislashs Windows cassent la commande).
  - **Python** : Manim tourne sous Python 3.12 (installé par `uv` dans `AppData\Roaming\uv`), dans `videos/animations/.venv`. Python 3.15 ne convient pas.

## Divers

- **Tester le site en local** : `python -m http.server 8765` à la racine, puis ouvrir http://localhost:8765. Il ne s'ouvre pas en double-cliquant sur le fichier.
- **Identité Git** : elle est configurée seulement pour ce dépôt, reprise de `trivial-maths`.
- **Points historiques encore marqués ○ ou ◐** dans `SOURCES.md` : les valeurs exactes de Delambre, la composition de la commission de 1791, Aristote et Canopus, etc.
