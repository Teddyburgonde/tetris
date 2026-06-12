5. Pénalités: ❌

'P' = bloc de pénalités indestructible 
Il faut que je generer les blocs 'P' et je dois les transmettre.

Explication: 
- Un joueur pose une piece et complete N lignes d'un coup.
- S'il complete plus d'une ligne N > 1 , il punit adversaire en 
lui envoyant M-1 lignes grises indestructibles qui apparaissent en bas de sa grille.
- Cote adverse: sa grille se decale vers le haut pour faire 
de la place a ces N-1 nouvelles lignes en bas de sa grille.


✅ Émettre la pénalité (fait) — dans Game.jsx, socket.emit("sendPenalty", fullLines.length - 1) si fullLines.length > 1

❌ Créer addPenaltyLines — dans utils.js, fonction qui prend gridRef.current + nbLines reçus du serveur, enlève nbLines lignes en haut et ajoute nbLines lignes 'P' en bas

❌ Recevoir et afficher — dans Game.jsx, remplir socket.on("receivePenalty", ...) pour appliquer addPenaltyLines, et dans createGridCells (grid.jsx) ajouter la couleur grise pour 'P'




Creer la fonction addPenalite

function addPenaltyLines(newGrid) 
{
    const fullLines = findFullLines(newGrid)

    // remonter toute les pieces d'une ligne vers le haut et ensuite 
    // ajouter une ligne en plus pour adversaire tout en bas ('P')

    while ()
    nbLines - 1


}


Appliquer addPenaltyLines a gridCurrent dans Game.jsx



createGridCells
ajouter une couleur decider 


function createGridCells(grid, piece, col, row, rotation, matrix, playerColor = 'blue')
{
	const cells = Array.from({length: grid[0].length * grid.length});
	const cellDivs = cells.map((_, i) => {
		// Converti le i pour avoir la position en x et y
		const x = i % grid[0].length
		const y = Math.floor(i / grid[0].length)
		let color = ''

        // if (addPenaltyLines == true)
            color = gray
		if (grid[y][x] === 1)
			color = playerColor
		if (piece && matrix[piece] && matrix[piece][rotation])
		{
			const localY = y - row
			const localX = x - col
			const pieceShape = matrix[piece][rotation]
			if (localY >= 0 && localY < pieceShape.length && localX >= 0 && localX < pieceShape[0].length)
			{
				if (matrix[piece][rotation][y - row][x - col] === 1)
					color = playerColor
			}
		}

		return <div key={i} className="cell" style={{backgroundColor: color}}></div>
	})
	return cellDivs;
}













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
