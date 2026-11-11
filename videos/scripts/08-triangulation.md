# Vidéo 8 · Delambre et Méchain, mesurer la France en triangles

- **Emplacement** : `triangulation` dans `config/videos.json`. La vidéo apparaît au tout début de l'étape 8, avant le texte sur Delambre et Méchain. Tant que le lien est vide, rien ne s'affiche.
- **Durée visée** : 2 min environ
- **Objectif** : comprendre comment on peut mesurer plus de 1 000 km sans poser une règle tout du long : avec une chaîne de triangles, dont on mesure surtout des **angles**.
- **Ce que la vidéo ne fait pas** : elle ne fait aucun calcul de proportionnalité, et n'utilise ni les 551 585 toises ni les 9,67° de l'étape. Elle ne calcule pas le quart de méridien, qui est la question de l'étape 8.

## Script minuté

| Plan | Temps | Ce que je dis | À l'écran |
|---|---|---|---|
| 1 | 0:00 – 0:15 | 1792. Les savants ont décidé que le mètre viendrait de la Terre. Il faut donc mesurer un grand morceau de méridien, de Dunkerque à Barcelone : plus de mille kilomètres ! | Carte de France, le méridien de Dunkerque à Barcelone en rouge. |
| 2 | 0:15 – 0:35 | Deux astronomes se partagent le travail. Jean-Baptiste Delambre part du nord, de Dunkerque jusqu'à Rodez. Pierre Méchain part du sud, de Barcelone jusqu'à Rodez. Ils doivent se retrouver au milieu. | Le méridien se colore en deux parties : nord pour Delambre, sud pour Méchain. Rodez marqué d'un point. |
| 3 | 0:35 – 0:55 | Mais comment mesurer mille kilomètres ? Avec une règle posée bout à bout, il faudrait des années, à travers les champs, les forêts, les rivières et les montagnes. Leur astuce : ne presque rien mesurer en longueur… et tout mesurer en **angles**. | Une règle posée bout à bout qui bute sur une rivière, puis sur une montagne. Un grand « ? ». |
| 4 | 0:55 – 1:20 | Voici l'idée. On mesure très soigneusement une seule longueur au sol : c'est la **base**. Depuis ses deux bouts, on vise un clocher au loin et on mesure les deux angles. Un côté et les deux angles à ses extrémités : il n'y a qu'un seul triangle possible. On peut donc calculer ses autres côtés, sans les parcourir ! | Animation H1 : une base, deux angles, et un seul triangle qui se construit. |
| 5 | 1:20 – 1:40 | Ensuite, on recommence : un côté du premier triangle sert de base au suivant. Triangle après triangle, de clocher en colline, la chaîne descend jusqu'à Barcelone. Pour vérifier, ils mesurent une deuxième base au sol, tout au sud, près de Perpignan. | Animation H2 : une chaîne de triangles qui se déroule le long du méridien. |
| 6 | 1:40 – 2:00 | Le travail dure de 1792 à 1798, en pleine Révolution, au milieu de la guerre : Delambre sera même arrêté comme espion, et Méchain restera bloqué en Espagne ! Au bout du compte, ils connaissent la longueur de l'arc, et l'angle qui lui correspond, mesuré grâce aux étoiles. Une distance, un angle… ça ne vous rappelle personne ? | Retour à la carte, avec la chaîne complète. Un petit portrait d'Ératosthène fait un clin d'œil dans un coin. |

## Rigueur

| Affirmation | Sceau | Comment c'est dit |
|---|---|---|
| Delambre au nord (Dunkerque–Rodez), Méchain au sud (Rodez–Barcelone) | 🟢 (`delambre-mechain`) | affirmé |
| Triangulation : on mesure des angles, avec seulement deux bases mesurées au sol (près de Melun et de Perpignan) | 🟢 (`delambre-mechain`) | affirmé. La première base n'est pas nommée à l'oral pour rester court ; la seconde, « près de Perpignan », l'est. |
| Arc de plus de 1 000 km | 🟠 (`arc-valeurs`, environ 1 076 km) | « plus de mille kilomètres », sans valeur précise |
| De 1792 à 1798, en pleine Révolution | 🟢 (`delambre-mechain`, texte de l'étape 8) | affirmé |
| Delambre arrêté comme espion ; Méchain bloqué en Espagne par la guerre | ◐ souvent raconté (Ken Alder, *Mesurer le monde*), pas encore dans `SOURCES.md` | sans date ni lieu. Le texte de l'étape 8 dit « arrêtés comme espions » au pluriel : à nuancer, ou à ajouter à `SOURCES.md` après vérification |
| Un côté et deux angles adjacents déterminent un seul triangle | maths (programme de 5e) | affirmé |
| L'écart de latitude mesuré grâce aux étoiles | 🟢 (principe connu) | sans valeur chiffrée |

À éviter : citer un nombre précis de triangles ou la longueur exacte des bases. Ces valeurs varient selon les sources et ne sont pas vérifiées dans `SOURCES.md`. Ne pas nommer l'instrument (le cercle répétiteur de Borda) sans l'avoir vérifié.

## Idées de mise en scène

- **La règle qui bute** (plan 3) : posez une règle de 30 cm bout à bout sur la table, jusqu'à un livre ouvert debout (« la montagne ») : on ne peut pas passer.
- **Triangle au rapporteur** (plan 4) : tracez au tableau un segment, mesurez deux angles à ses extrémités, prolongez les côtés : ils se coupent en un seul point. Demandez : « Peut-on en tracer un autre ? »
- **Chaîne de triangles en papier** (plan 5) : des triangles découpés, posés côte à côte sur une carte de France, chacun partageant un côté avec le précédent.

## Animations à monter (après validation de ce script)

- **H1 · Une base, deux angles, un seul triangle** : une base horizontale se pose (« base mesurée au sol »). À chaque bout, un arc d'angle s'ouvre et une demi-droite part vers le haut. Les deux demi-droites se croisent en un point : un clocher apparaît. Le texte « un côté + deux angles = un seul triangle » s'écrit. Environ 9 s.
- **H2 · La chaîne de triangles** : sur une carte simplifiée de la France, une chaîne de triangles se construit de Dunkerque vers Barcelone, chaque nouveau triangle s'appuyant sur un côté du précédent. Rodez est marqué, puis la base de Perpignan clignote en vert (« base de vérification »). Environ 10 s.
