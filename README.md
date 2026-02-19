# 🔴 Red Tetris – Networked Multiplayer

## 📖 Présentation du Projet**Red Tetris** est un jeu de puzzle multijoueur en ligne développé dans le cadre d'un projet Full Stack JavaScript[cite: 3].L'objectif est de construire une application performante permettant à plusieurs joueurs de s'affronter simultanément dans des sessions synchronisées[cite: 16, 57].
Le projet repose sur une architecture client/serveur utilisant **Node.js** pour le backend et un frontend moderne, communiquant via le protocole **Socket.io**[cite: 78, 79].

## 🛠️ Concepts & Contraintes Techniques
Ce projet suit des règles de développement strictes pour garantir la qualité et la maintenabilité du code :
***Programmation Fonctionnelle (Client)** : La logique du jeu (grille, pièces) est implémentée exclusivement via des **fonctions pures**[cite: 26, 37].
***Interdiction du mot-clé `this`** : Le code côté client est écrit sans utiliser `this`, privilégiant les constructions fonctionnelles aux classes[cite: 35].
***Architecture Orientée Objet (Serveur)** : Le serveur Node.js utilise des classes (Player, Piece, Game) pour gérer la logique globale[cite: 39, 40].
***Zéro Manipulation DOM Directe** : L'affichage est géré de manière réactive sans bibliothèques comme jQuery[cite: 44, 47].
***Layout Moderne** : Utilisation exclusive de **Flexbox** et **CSS Grid** pour le rendu visuel, sans aucun élément `<table />`[cite: 41, 42].

## 🚀 Fonctionnalités Implémentées

### 🎮 Système de Jeu (Mandatory)
- [x]**Mouvements & Rotations** : Déplacements (Gauche/Droite), rotation (Flèche Haut), chute rapide (Bas) et Hard Drop (Espace)[cite: 72, 73, 74, 75].
- [x]**Tétrominos** : Intégration des 7 formes originales (O, I, T, L, J, S, Z) avec leurs matrices de rotation[cite: 63].
- [x]**Grille Standard** : Terrain de jeu de 10 colonnes par 20 lignes[cite: 60].
- [x]**Mode Multijoueur** : Synchronisation de la même séquence de pièces pour tous les joueurs d'une même partie[cite: 58, 84].
- [x]**Lignes de Pénalité** : La suppression de lignes envoie des lignes de "béton" indestructibles aux adversaires ($n-1$ lignes)[cite: 59].
- [x]**Condition de Fin** : Détection du Game Over lorsqu'une nouvelle pièce ne peut plus entrer sur le terrain[cite: 55].

### 💻 Infrastructure & Refactorisation
- [x]**Single Page Application (SPA)** : Application fluide sans rechargement de page[cite: 87, 114].
- [x] **Modularisation** : Séparation de la logique de calcul (fonctions pures dans `utils.js` et `dropPiece.js`).
- [x] **Refactorisation (Pureté)** : Fonctions d'affichage (`updateGridDisplay`, `displayPiece`, `clearPiece`) et de calcul (`canRotate`) isolées des variables globales.

## 🚦 Installation et Lancement

### Prérequis
- Node.js (dernière version stable recommandée).

### Lancement en local
1.  **Démarrer le serveur** :
    ```bash
    node server.js
    ```
2.  **Lancer le client** :
    - Ouvrez `index.html` dans votre navigateur.
    -Pour rejoindre une partie spécifique : `http://<ip>:<port>/#<room>[<player_name>]`[cite: 93, 94].


---*Projet réalisé mbirou/tebandam[cite: 10].*