# Vidéo 9 · Pourquoi un dix-millionième ? Les puissances de 10

- **Emplacement** : `puissances-de-10` dans `config/videos.json`. La vidéo apparaît dans l'indice 1 de la question de l'étape 9 (« Par quelle puissance de 10 faut-il diviser le quart de méridien… »). Tant que le lien est vide, rien ne s'affiche.
- **Durée visée** : 2 min environ
- **Objectif** : comprendre ce que veut dire $10^n$, savoir diviser par une puissance de 10 (on enlève des zéros, ou on décale la virgule), et voir que chaque puissance change la taille d'un facteur 10 : il faut donc viser juste pour tomber dans la zone des unités humaines.
- **Ce que la vidéo ne fait pas** : elle ne divise jamais le quart de méridien (10 000 000 m). Elle ne dit pas quelle puissance donne le mètre, et ne prononce ni « dix-millionième » ni $10^7$. Elle travaille sur un autre exemple : une route de 15 km.

## Script minuté

| Plan | Temps | Ce que je dis | À l'écran |
|---|---|---|---|
| 1 | 0:00 – 0:15 | Le quart de méridien mesure dix millions de mètres. Impossible d'en faire une règle ! Les savants veulent le découper en parts égales, pour obtenir une unité de la taille d'un pied, d'une aune, d'une toise : entre 30 centimètres et 2 mètres environ. | Une barre bleue immense qui sort de l'écran, puis une petite zone verte « unités humaines » avec un pied, une aune, une toise. |
| 2 | 0:15 – 0:40 | Et pour découper, ils ne veulent diviser que par 10, 100, 1 000… comme quand on compte. Ces nombres, on les écrit avec des **puissances de 10**. $10^1$, c'est 10. $10^2$, c'est 10 × 10, donc 100. $10^3$, c'est 1 000. Le petit nombre en haut, l'exposant, c'est le nombre de zéros ! | Animation I1, première partie : $10^1$, $10^2$, $10^3$, $10^4$ s'écrivent, et à chaque fois un zéro de plus apparaît. |
| 3 | 0:40 – 1:00 | Diviser par une puissance de 10, c'est facile : on enlève autant de zéros que l'exposant. 50 000 divisé par $10^2$ : j'enlève deux zéros, il reste 500. Et quand il n'y a plus de zéros ? On décale la virgule. 5 divisé par 10, c'est 0,5. | Animation I1, deuxième partie : les zéros de 50 000 s'effacent un par un ; puis la virgule glisse vers la gauche. |
| 4 | 1:00 – 1:30 | Essayons avec une route de 15 kilomètres, soit 15 000 mètres. Divisée par $10^3$ : 15 mètres. Bien trop long pour mesurer un tissu ! Divisée par $10^4$ : 1,5 mètre. Là, on est dans la zone verte, entre l'aune et la toise. Divisée par $10^5$ : 15 centimètres. Trop petit, plus petit qu'un pied. | Animation I2 : la route divisée par $10^3$, $10^4$, $10^5$. À chaque fois la barre est comparée à la zone verte : trop grande, dedans, trop petite. |
| 5 | 1:30 – 1:45 | Vous voyez ? D'une puissance à la suivante, la longueur est divisée par 10. On saute d'un coup de « trop grand » à « juste bien » puis à « trop petit ». Une seule puissance tombe dans la zone. | Les trois barres côte à côte, avec « ÷ 10 » entre chacune. |
| 6 | 1:45 – 2:00 | À vous, avec le quart de méridien ! Écrivez-le en mètres, comptez ses zéros, et cherchez combien il faut en enlever pour arriver à la taille d'une toise ou d'une aune. Puis vérifiez avec les règles de la pop-up. | Retour à la barre bleue du quart de méridien, avec un grand « ? » à côté. |

## Rigueur

| Affirmation | Sceau | Comment c'est dit |
|---|---|---|
| Le quart de méridien mesure 10 000 000 m | texte de l'étape 9 (définition du mètre) | affirmé, puisque c'est la donnée de l'étape |
| Les savants voulaient une unité divisée selon le système décimal, de taille commode pour l'usage courant | 🟢 (`trois-raisons`, ○ à vérifier dans `SOURCES.md`) | affirmé, dans les mots du texte de l'étape 9 |
| Zone des unités humaines : de 30 cm à 2 m environ | valeurs de la pop-up (`ZONE = [0.3, 2.0]` dans `js/etapes/partie2.js`) | « environ » |
| Pied ≈ 32 cm, aune ≈ 1,19 m, toise ≈ 1,95 m | ○ valeurs d'illustration (`SOURCES.md`, fin du fichier) | aucune valeur dite à l'oral, seulement dessinées à l'échelle |
| $10^n$ s'écrit avec n zéros ; diviser par $10^n$ enlève n zéros ou décale la virgule de n rangs | maths (programme de 4e) | affirmé |
| Route de 15 km | exemple inventé | présenté comme un exemple |

À éviter : dire « dix-millionième », « $10^7$ » ou « 1 mètre » à propos du quart de méridien, c'est la réponse de la question. Ne pas utiliser $10^6$ ou $10^8$ sur le quart de méridien non plus : ce sont les retours de la question (10 m et 10 cm).

## Idées de mise en scène

- **Les zéros en papier** (plan 3) : écrivez 50 000 au tableau avec des zéros sur des petits papiers aimantés, et enlevez-en deux pour diviser par 100.
- **Le tableau de numération** (plan 3) : glissez le nombre d'un rang vers la droite à chaque division par 10, pour montrer que c'est la virgule qui « recule ».
- **Boucle d'or** (plan 5) : trois objets posés sur la table, une ficelle de 15 m enroulée, un bâton de 1,5 m, une règle de 15 cm : « trop grand, juste bien, trop petit ».

## Animations à monter (après validation de ce script)

- **I1 · L'exposant compte les zéros** : $10^1 = 10$, $10^2 = 100$, $10^3 = 1\,000$, $10^4 = 10\,000$ s'écrivent l'un sous l'autre, le nouveau zéro en couleur à chaque ligne. Puis « 50 000 ÷ 10² » : deux zéros s'effacent, il reste 500. Enfin « 5 ÷ 10 = 0,5 » : la virgule glisse d'un rang. Environ 10 s.
- **I2 · Trop grand, juste bien, trop petit** : une zone verte « unités humaines » (de 30 cm à 2 m) avec une toise dessinée à l'échelle. La route de 15 000 m divisée par 10³ donne une barre de 15 m qui déborde (« trop grand »), par 10⁴ une barre de 1,5 m qui tombe dans la zone (« juste bien »), par 10⁵ une barre de 15 cm à peine visible (« trop petit »). Environ 10 s.
