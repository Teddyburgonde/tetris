# Étapes pour réaliser le projet Tetris en JavaScript

## 1. Définir la structure de base du projet 🎉

- Créer les fichiers `index.html`, `style.css` et `script.js`. ✅
- Configurer le fichier HTML avec une structure de base (sans Canvas). ✅
- Utiliser une mise en page basée sur **grid** ou **flexbox** pour le rendu graphique. ✅

## 2. Créer la grille de jeu 🎉

- Définir une grille de 10 colonnes et 20 lignes en utilisant des éléments HTML (comme des `<div>`). ✅
- Styler la grille avec CSS pour qu'elle ressemble à un terrain de Tetris. ✅

## 3. Définir les pièces (tétrominos) et leurs rotations ❌

Les pièces de Tetris (tétrominos) sont représentées sous forme de tableaux 2D. Chaque `1` dans le tableau représente un bloc de la pièce, et chaque `0` représente un espace vide.

### 3.1. Pièce `O` (carré) ✅
- Créer un tableau 2D de 2x2 pour représenter la pièce `O`.
- Exemple :
[
[1, 1],
[1, 1]
]
- **Pas de rotation** : La pièce `O` ne change pas d'apparence quand on la tourne.

### 3.2. Pièce `I` (barre) ❌
- Créer un tableau 2D de 4x1 (ou 1x4 selon l'orientation) pour représenter la pièce `I`.
- Exemple (orientation horizontale) :
[
[1, 1, 1, 1]
]

- Implémenter la rotation pour passer de 4x1 à 1x4 (et inversement).

### 3.3. Pièce `T` ❌
- Créer un tableau 2D de 3x2 pour représenter la pièce `T`.
- Exemple :
[
[0, 1, 0],
[1, 1, 1]
]
- Implémenter la rotation pour gérer ses 4 orientations possibles.

### 3.4. Pièce `L` ❌
- Créer un tableau 2D de 3x2 pour représenter la pièce `L`.
- Exemple :
[
[1, 0],
[1, 0],
[1, 1]
]

- Implémenter la rotation pour gérer ses 4 orientations possibles.

### 3.5. Pièce `J` ❌
- Créer un tableau 2D de 3x2 pour représenter la pièce `J`.
- Exemple :
[
[0, 1],
[0, 1],
[1, 1]
]
- Implémenter la rotation pour gérer ses 4 orientations possibles.

### 3.6. Pièce `S` ❌
- Créer un tableau 2D de 3x2 pour représenter la pièce `S`.
- Exemple :
[
[0, 1, 1],
[1, 1, 0]
]
- Implémenter la rotation pour gérer ses 2 orientations possibles.

### 3.7. Pièce `Z` ❌
- Créer un tableau 2D de 3x2 pour représenter la pièce `Z`.
- Exemple :
[
[1, 1, 0],
[0, 1, 1]
]

- Implémenter la rotation pour gérer ses 2 orientations possibles.


## 4. Gérer la génération aléatoire des pièces ❌
- Créer un système pour générer aléatoirement les pièces qui tombent. ❌
- Assurer que tous les joueurs reçoivent la même séquence de pièces (pour le mode multijoueur). ❌

## 5. Implémenter les mouvements des pièces
- Gérer les déplacements horizontaux (gauche/droite) avec les flèches du clavier. ❌
- Implémenter la rotation avec la flèche du haut. ❌
- Gérer la chute rapide avec la flèche du bas et la chute instantanée avec la barre d'espace. ❌

## 6. Vérifier les collisions
- Vérifier si une pièce entre en collision avec le bas de la grille ou avec d'autres pièces déjà placées. ❌
- Bloquer la pièce et en générer une nouvelle en cas de collision. ❌

## 7. Supprimer les lignes complètes
- Vérifier si une ligne est complètement remplie. ❌
- Supprimer la ligne et décaler les lignes au-dessus vers le bas. ❌
- Ajouter des lignes de pénalité pour les autres joueurs en mode multijoueur. ❌

## 8. Gérer le mode multijoueur
- Configurer un serveur Node.js avec **Socket.IO** pour gérer les connexions des joueurs. ❌
- Synchroniser les pièces et les mouvements entre les joueurs. ❌
- Envoyer des lignes de pénalité aux autres joueurs lorsqu'un joueur supprime des lignes. ❌

## 9. Gérer les spectres des adversaires
- Afficher un spectre simplifié du terrain de chaque adversaire (indiquant la hauteur des colonnes). ❌
- Mettre à jour les spectres en temps réel. ❌

## 10. Implémenter la logique de fin de jeu
- Détecter quand un joueur ne peut plus placer de nouvelles pièces. ❌
- Déclarer le dernier joueur en lice comme gagnant. ❌

## 11. Ajouter des tests unitaires
- Écrire des tests pour couvrir au moins 70 % des lignes de code, fonctions et instructions. ❌
- Utiliser des outils comme **Jest** ou **Mocha** pour les tests. ❌

## 12. Optimiser et peaufiner l’interface utilisateur
- Ajouter des informations comme le score, le niveau et les spectres des adversaires. ❌
- Styler l'interface pour la rendre attrayante. ❌

## 13. Tester et déboguer le jeu
- Tester le jeu en solo et en multijoueur. ❌
- Corriger les bugs et optimiser les performances. ❌

## 14. Bonus (optionnel)
- Ajouter un système de score et de persistance des scores. ❌
- Implémenter des modes de jeu supplémentaires (pièces invisibles, gravité accélérée, etc.). ❌
- Explorer des librairies FRP comme **flyd** pour une approche alternative. ❌