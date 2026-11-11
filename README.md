# De la Terre d'Ératosthène au mètre

Activité web de mathématiques pour le collège, d'environ 30 minutes, à faire sur téléphone ou sur ordinateur. Elle se déroule comme une seule aventure en deux parties :

1. **Ératosthène mesure la Terre** (un prologue et 6 étapes) : le puits de Syène, l'angle à Alexandrie, les angles alternes-internes, 1/50 du tour, 5 000 stades, puis 250 000 stades. Elle se termine par le diplôme de bématiste royal.
2. **La naissance du mètre** (5 étapes) : la pagaille des unités, Delambre et Méchain, le dix-millionième du quart de méridien, le mètre en toises, puis la valeur d'un stade en mètres.

C'est un site statique (HTML, CSS et JavaScript, sans serveur ni compilation), prêt pour GitHub Pages.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | l'activité des élèves |
| `prof.html` | la page de vérification des codes (pour le professeur) |
| `config/contenu.json` | **tous les textes, questions, réponses, indices et sceaux** |
| `config/videos.json` | les liens des vidéos |
| `SOURCES.md` | les sources de chaque sceau de cire et l'état de leur vérification |
| `outils/brouiller.html` | sert à brouiller une nouvelle réponse avant de la mettre dans le contenu |
| `js/` | le code (moteur, correction, clavier, codes, animations) |
| `js/etapes/` | les schémas et les manipulations pop-up, une fonction par manipulation |
| `lib/katex/` | KaTeX (affichage des formules, licence MIT), copié dans le dépôt |
| `tests/` | les tests automatiques |

## Déployer sur GitHub Pages

1. Créez un dépôt sur GitHub et envoyez-y tout le contenu de ce dossier.
2. Sur GitHub, ouvrez **Settings → Pages**.
3. Dans « Build and deployment », choisissez **Deploy from a branch**, la branche `main` et le dossier `/ (root)`, puis enregistrez.
4. Au bout d'une minute, l'activité est en ligne à l'adresse `https://<votre-compte>.github.io/<nom-du-dépôt>/`.
5. La page du professeur est à la même adresse, suivie de `prof.html`. Elle n'est pas indexée par les moteurs de recherche, mais elle reste accessible à qui connaît l'adresse.

## Essayer en local

L'activité lit ses fichiers `config/*.json` : elle doit être servie par un petit serveur. Elle ne fonctionne pas si l'on ouvre simplement `index.html` en double-cliquant.

```bash
python -m http.server 8765
```

Puis ouvrez http://localhost:8765 (et http://localhost:8765/prof.html pour la page du professeur).

## Ajouter une vidéo

Dans `config/videos.json`, mettez à côté de l'emplacement :

- un lien YouTube (de préférence une vidéo **non répertoriée**), par exemple `"https://youtu.be/XXXXXXXXXXX"` ou l'identifiant seul ;
- ou le chemin d'un fichier du dépôt, par exemple `"videos/clips/rayons.mp4"`. Restez sous 100 Mo par fichier et compressez les vidéos.

Un emplacement vide (`""`) affiche l'indice en texte, ce qui est le comportement actuel.

| Emplacement | Où il apparaît |
|---|---|
| `introduction` | écran d'accueil |
| `rayons-paralleles` | étape 1, premier indice de la question sur les rayons |
| `alternes-internes` | étape 3, premier indice |
| `rapporteur` | étape 2, premier indice |
| `cinquantieme` | étape 4, premier indice de la fraction du tour |
| `proportionnalite` | étapes 6 et 8, premier indice |
| `puissances-de-10` | étape 9, premier indice |

Pour placer une vidéo sur un autre indice, ajoutez `"video": "nom-de-l-emplacement"` à cet indice dans `config/contenu.json`, puis ajoutez l'emplacement dans `config/videos.json`.

## Modifier les textes

Tout est dans `config/contenu.json`. Les étapes sont dans la liste `"etapes"`. Chaque étape contient une liste de `"blocs"`, qui s'affichent les uns après les autres :

- `"texte"` : un paragraphe (HTML simple autorisé : `<strong>`, `<em>`, `<br>`, tableau). Ajoutez `"sceau": "nom"` pour poser un sceau de cire.
- `"schema"` : un schéma à la plume dessiné par le code.
- `"popup"` : une manipulation qui se déplie. L'élève doit la terminer pour continuer.
- `"question"` : une question. L'élève doit la réussir pour continuer, sauf si elle porte `"facultatif": true` (les défis bonus).

**Formules.** Elles s'écrivent entre `$…$` en LaTeX. Dans le JSON, il faut doubler les barres obliques inverses : `$\\frac{1}{50}$`.

**Sceaux.** Ils sont définis dans `"sceaux"`, avec une couleur (`vert`, `orange` ou `rouge`), un texte et une source. Si vous en modifiez un, pensez à mettre `SOURCES.md` à jour.

**Questions :**
- `"saisie": "valeur"` : une réponse tapée. La correction accepte la virgule ou le point, les fractions (`1/50`), les pourcentages, les espaces dans les milliers et les calculs (`360/7,2`).
- `"saisie": "choix"` : plusieurs propositions. La réponse est le **numéro** de la bonne option, en comptant à partir de **0**.
- `"tolerance"` : l'écart relatif accepté. Par exemple `0.01` accepte 1 % d'écart, et `0` exige la valeur exacte.
- `"indices"` : trois niveaux (un indice léger, un indice plus précis, puis un exemple corrigé). Un nouveau niveau apparaît dans la marge après chaque erreur. Après une minute sans réponse, la note de la marge se met à briller.
- `"retours"` (pour un choix) : le message propre à chaque mauvaise option.

**Réponses brouillées.** Les réponses ne sont pas écrites en clair. Pour en changer une, ouvrez http://localhost:8765/outils/brouiller.html, tapez la bonne réponse, puis copiez le code obtenu dans `"reponse"`.

**Calculatrice.** Ajoutez `"calculatrice": true` à une étape pour l'y rendre disponible (c'est le cas des étapes 6, 8, 10 et 11).

Après une modification, vérifiez que le JSON est toujours valide, par exemple avec https://jsonlint.com, puis rechargez la page.

## Suivi des élèves et codes

- **Sauvegarde.** La progression est enregistrée automatiquement dans le navigateur. Si l'élève revient avec le même nom, il reprend là où il en était.
- **Code de reprise.** Il s'affiche sous le carnet de notes et change à chaque étape. Il permet de continuer sur un autre appareil : sur l'écran d'accueil, l'élève ouvre « Tu as déjà commencé sur un autre appareil ? », puis tape le même nom et son code.
- **Code final.** Il s'affiche à la fin. Il est calculé à partir du nom, des étapes réussies, du nombre d'erreurs et du nombre d'indices utilisés.
- **Vérification.** Sur `prof.html`, tapez le nom de l'élève et son code. La page indique si le code est valide, puis affiche les étapes réussies, les erreurs et les indices. Les accents, les majuscules et les espaces du nom ne comptent pas.
- **Limite.** Tout se vérifie dans le navigateur, sans serveur. Les codes et les réponses brouillées découragent la triche ordinaire, mais un élève capable de lire et de modifier le JavaScript pourrait les contourner.

## Tests

```bash
node tests/correction.test.mjs
```

```bash
node tests/codes.test.mjs
```

## Crédits

- KaTeX (licence MIT).
- Polices Google Fonts : IM Fell English, EB Garamond et Caveat (licence OFL).
- Les bruitages sont synthétisés dans le navigateur (Web Audio) : aucun fichier son n'est utilisé.
