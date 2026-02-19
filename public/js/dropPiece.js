/**
 * hasCollisionBelow - Vérifie si la pièce actuelle entrerait en collision en tombant d'une case.
 *
 * Cette fonction pure teste les cases situées sous la pièce pour détecter un contact 
 * avec un obstacle ou le dépassement des limites de la grille.
 *
 * @param {Array<Array<number>>} pieceShape - Matrice représentant la forme de la pièce.
 * @param {number} currentCol - Colonne actuelle de la pièce dans la grille.
 * @param {number} currentRow - Ligne actuelle de la pièce dans la grille.
 * @param {Array<Array<number|string>>} grid - Grille de jeu (état actuel des blocs fixés).
 * @param {number} gridWidth - Largeur totale de la grille (nombre de colonnes).
 * @param {number} gridHeight - Hauteur totale de la grille (nombre de lignes).
 * @return {boolean} - true si une collision est détectée, false sinon.
 */
function hasCollisionBelow(pieceShape, currentCol, currentRow, grid, gridWidth, gridHeight)
{
	for (let j = 0; j < pieceShape.length; j++)
	{
		for (let i = 0; i < pieceShape[j].length; i++)
		{
			// Calcule la position exacte de la case qu'on veut tester
			const rowToCheck = currentRow + j + 1;
			const colToCheck = currentCol + i;

			if (pieceShape[j][i] === 1)
			{
				// Vérification des limites de la grille (murs et sol)
				const isOutsideHeight = rowToCheck >= gridHeight;
				const isOutsideWidth = colToCheck < 0 || colToCheck >= gridWidth;

				if (isOutsideHeight || isOutsideWidth)
					return true;

				// Vérification des obstacles (blocs déjà posés ou pénalités)
				const cellOccupied = grid[rowToCheck][colToCheck] === 1;
				const isPenaltyBlock = grid[rowToCheck][colToCheck] === 'P';

				if (cellOccupied || isPenaltyBlock)
					return true;
			}
		}
	}
	return false;
}

/**
 * Parcourt chaque case de la grille de données pour mettre à jour la couleur 
 * des carrés HTML correspondants (blocs fixés, pénalités ou vide).
 */
function ColorCellsInGrid(grid, gridWidth, gridHeight, cells)
{
	for (let j = 0; j < gridHeight; j++)
	{
		for (let i = 0; i < gridWidth; i++)
		{
			const cellId = j * gridWidth + i;
			if (grid[j][i] === 1)
				cells[cellId].style.backgroundColor = 'red';
			else if (grid[j][i] === 'P')
				cells[cellId].style.backgroundColor = 'violet';
			else
				cells[cellId].style.backgroundColor = '';
		}
	}
}

/**
 * Calcule l'état suivant de la pièce : soit elle continue sa chute, 
 * soit elle doit être verrouillée sur la grille en cas de collision.
 */
function dropPiece(piece, currentRotationIndex, currentCol, currentRow, grid)
{
	if (!piece)
		return null;

	const pieceShape = matrix[piece][currentRotationIndex];
	
	// On vérifie s'il y a un obstacle en dessous
	const collision = hasCollisionBelow(pieceShape, currentCol, currentRow, grid);

	if (collision == true)
		return { action: 'LOCK', col: currentCol, row: currentRow, shape: shape };
	else
		return { action: 'DROP', col: currentCol, row: currentRow + 1 };
}


/**
 * Met à jour le jeu (grille, affichage, réseau) après un mouvement.
 * Retourne null si la pièce se bloque, ou sa nouvelle position si elle descend.
 */
function handlePieceAction(result, piece, currentRotationIndex, currentCol, currentRow, grid, gameCells, matrix)
{
	if (!result) 
		return null;

	if (result.action === 'LOCK') 
	{
		for (let j = 0; j < result.shape.length; j++) 
		{
    		for (let i = 0; i < result.shape[j].length; i++) 
			{
				if (result.shape[j][i] === 1)
					grid[result.row + j][result.col + i] = 1;
			}
		}
		updateGridDisplay();
		const cleared = clearFullLines();
		if (cleared > 0)
			socket.emit("sendPenalty");

        // 4. socket.emit("playerAction", { key: "fix", ... }) pour les autres
        socket.emit("playerAction", {
			key: "fix",
			id: socket.id,
			piece: piece,
			x: result.col,
			y: result.row,
			rotation: currentRotationIndex
		});

		socket.emit("needNewPiece");
		
		return null;
	} 
    else if (result.action === 'DROP') 
	{
		const pieceShape = matrix[piece][currentRotationIndex];
        clearPiece(pieceShape, currentCol, currentRow, gameCells);
		
		const newRow = result.row;

		socket.emit("playerAction", {
			key: "s",
			id: socket.id,
			piece: piece,
			x: result.col,
			y: newRow,
			rotation: currentRotationIndex
		});

		displayPiece(pieceShape, result.col, result.row, 'red', gameCells);
		
		// Nouvelles coordonneées
		return { x: result.col, y: newRow };
    }
	return piece;
}