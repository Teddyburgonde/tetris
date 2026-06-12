5. Pénalités: ❌

'P' = bloc de pénalités indestructible 
Il faut que je generer les blocs 'P' et je dois les transmettre.

Explication: 
- Un joueur pose une piece et complete N lignes d'un coup.
- S'il complete plus d'une ligne N > 1 , il punit adversaire en 
lui envoyant M-1 lignes grises indestructibles qui apparaissent en bas de sa grille.
- Cote adverse: sa grille se decale vers le haut pour faire 
de la place a ces N-1 nouvelles lignes en bas de sa grille.



# Roadmap - Pénalités (N-1 lignes indestructibles)

Quand un joueur fait N lignes (N > 1), l'adversaire reçoit N-1 lignes indestructibles ('P') en bas de sa grille.

## Étapes

1. Émettre la pénalité côté client: ❌
- Dans `Game.jsx`, après `findFullLines(newGrid)`, si `fullLines.length > 1`, faire `socket.emit("sendPenalty", fullLines.length - 1)` (≈30 min)

2. Créer `addPenaltyLines` dans utils.js: ❌
- Fonction pure qui retire `nbLines` lignes en haut de la grille et ajoute `nbLines` lignes remplies de `'P'` en bas (≈45 min)

3. Traiter `receivePenalty` côté client: ❌
- Implémenter le handler dans `Game.jsx` : appliquer `addPenaltyLines` à `gridRef.current`, mettre à jour `setGrid`, et gérer le game over si la pièce active entre en collision après le décalage (≈1h)

4. Afficher les blocs 'P': ❌
- Dans `grid.jsx`, `createGridCells` : ajouter une couleur dédiée (ex: gris) quand `grid[y][x] === 'P'` (≈30 min)

5. Tests: ❌
- Test unitaire pour `addPenaltyLines` (style `utils.test.js`)
- Test manuel avec 2 onglets : faire un Tetris (4 lignes) et vérifier que l'adversaire reçoit 3 lignes grises en bas (≈30 min)

---

**Total estimé : ~2h45**
