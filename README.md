# **Étapes pour réaliser le projet Tetris en JavaScript**

---

## **1. Définir la structure de base du projet** ✅  
- Créer les fichiers `index.html`, `style.css` et `script.js`.  
- Configurer le fichier HTML avec une structure de base.  
- Utiliser une mise en page avec **grid** ou **flexbox** pour le rendu visuel.

---

## **2. Créer la grille de jeu** ✅  
- Définir une grille de **10 colonnes** et **20 lignes** en utilisant des `<div>`.  
- Appliquer du style avec CSS pour rendre la grille visuellement similaire à celle du Tetris.

---
## **3. Définir les pièces (tétrominos)**

Les tétrominos sont des matrices où chaque **1** représente un bloc et chaque **0** un espace vide. Chaque pièce peut avoir plusieurs rotations.

### **Pièce `O` (carré)** ✅  
- Matrice :  
  ```
  [1, 1]
  [1, 1]
  ```
- Pas de rotation nécessaire.

### **Pièce `I` (barre)** ✅  
- Matrice de départ :  
  ```
  [1, 1, 1, 1]
  ```
- Rotation entre 4x1 (horizontale) et 1x4 (verticale). ✅  
- Écouter la touche pour la rotation avec la flèche du haut. ✅  

### **Pièce `T`** ❌  
- Matrice :  
  ```
  [0, 1, 0]
  [1, 1, 1]
  ```
- Implémenter les 4 rotations possibles.

### **Pièce `L`** ❌  
- Matrice :  
  ```
  [1, 0]
  [1, 0]
  [1, 1]
  ```
- Implémenter les 4 rotations possibles.

### **Pièce `J`** ❌  
- Matrice :  
  ```
  [0, 1]
  [0, 1]
  [1, 1]
  ```
- Implémenter les 4 rotations possibles.

### **Pièce `S`** ❌  
- Matrice :  
  ```
  [0, 1, 1]
  [1, 1, 0]
  ```
- Implémenter les 2 rotations possibles.

### **Pièce `Z`** ❌  
- Matrice :  
  ```
  [1, 1, 0]
  [0, 1, 1]
  ```
- Implémenter les 2 rotations possibles.

---

## **4. Implémenter les mouvements des pièces**

Les pièces doivent pouvoir se déplacer et tourner correctement dans la grille.

- Gérer les déplacements horizontaux (gauche/droite) avec les flèches du clavier. ❌
- Implémenter la rotation avec la flèche du haut. ✅
- Gérer la chute rapide avec la flèche du bas et la chute instantanée avec la barre d’espace. ❌

---

## **5. Générer aléatoirement les pièces** ❌

- Créer un système pour générer les pièces aléatoirement.
- Assurer une distribution équilibrée des pièces.

---

## **6. Gérer les collisions** ❌  

- Vérifier si une pièce entre en collision avec le bas de la grille ou avec d’autres pièces.
- Bloquer la pièce et en générer une nouvelle en cas de collision.

---

## **7. Supprimer les lignes complètes** ❌  
- Vérifier si une ligne est complètement remplie.
- Supprimer la ligne et décaler les lignes supérieures vers le bas.

---

## **8. Ajouter un mode multijoueur (optionnel)** ❌  
- Configurer un serveur **Node.js** avec **Socket.IO** pour synchroniser les joueurs.
- Gérer les lignes de pénalité entre joueurs.

---

## **9. Implémenter la logique de fin de jeu** ❌  
- Détecter la fin de partie lorsqu’aucune pièce ne peut plus être placée.
- Déclarer le dernier joueur en lice comme gagnant.

---

## **10. Ajouter des tests unitaires** ❌  
- Écrire des tests pour couvrir au moins 70 % des lignes de code.
- Utiliser des outils comme **Jest** ou **Mocha**.

---

## **11. Optimiser et peaufiner l’interface utilisateur** ❌  
- Ajouter des informations comme le score, le niveau et les lignes supprimées.
- Améliorer le style visuel.

---

## **12. Tester et déboguer** ❌  
- Tester le jeu en solo et en multijoueur.
- Corriger les bugs et optimiser les performances.

---

## **13. Bonus (optionnel)** ❌  
- Ajouter un système de score et de sauvegarde.
- Implémenter des modes de jeu spéciaux (pièces invisibles, vitesse accrue, etc.).
