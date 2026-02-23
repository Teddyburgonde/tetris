/**
 * Synchronise l'état visuel du DOM avec les données de la grille.
 * Parcourt chaque coordonnée pour colorer ou vider les cellules correspondantes.
 */
function updateGridDisplay(grid, gameCells, gridWidth, gridHeight) 
{
	for (let y = 0; y < gridHeight; y++) 
	{
		for (let x = 0; x < gridWidth; x++) 
		{
			const cellId = 	y * gridWidth + x;

			if (grid[y][x] === 1)
				gameCells[cellId].style.backgroundColor = 'blue';
			else
				gameCells[cellId].style.backgroundColor = '';
		}
	}
}


/**
 * Vérifie si la rotation est possible sans collision ni sortie de grille.
 * Simule la pièce dans sa future position de rotation.
 */
function canRotate(piece, currentRotationIndex,  currentCol, currentRow, grid, matrix, gridWidth, gridHeight)
{
	// On calcule l'index de la rotation suivante
    const nextRotationIndex = (currentRotationIndex + 1) % matrix[piece].length;
    const rotatedMatrix = matrix[piece][nextRotationIndex];

	// On parcours la futur forme pour tester chaque bloc
	for (let j = 0; j < rotatedMatrix.length; j++)
    {
        for (let i = 0; i < rotatedMatrix[j].length; i++)
        {	
			if (rotatedMatrix[j][i] === 1)
			{
				const nextCol  = currentCol + i;
				const nextRow = currentRow + j;

				// Vérification des limites de la grille
				if (nextCol < 0 || nextCol >= gridWidth || nextRow >= gridHeight)
					return false;
				// Vérification des collisions
				if (nextRow >= 0 && (grid[nextRow][nextCol] === 1 || grid[nextRow][nextCol] === 'P'))
					return false;
			}
		
		}
	}
	return true;
}


/**
 * Efface visuellement la pièce de la grille en réinitialisant la couleur des cellules.
 * Utilise les coordonnées et la largeur de la grille pour cibler les bons éléments du DOM.
 */
function clearPiece(piece, currentCol, currentRow, gameCells, gridWidth)
{
	for (let j = 0; j < piece.length; ++j) 
	{
		for (let i = 0; i < piece[j].length; ++i) 
		{
			if (piece[j][i] === 1)
			{
				const cellId = (j + currentRow) * gridWidth + (i + currentCol);

				if (gameCells[cellId])
					gameCells[cellId].style.backgroundColor = '';
			}		
		}
	}
}


/**
 * Affiche visuellement la pièce sur la grille en appliquant la couleur aux cellules.
 * Calcule l'index des cellules cibles en fonction de la position (col, row) et de la largeur de la grille.
 */
function displayPiece(piece, currentCol, currentRow, gameCells, gridWidth, color)
{
	for (let j = 0; j < piece.length; ++j)
	{
		for (let i = 0; i < piece[j].length; ++i) 
		{
			if (piece[j][i] === 1) 
			{
				const cellId = (j + currentRow) * gridWidth + (i + currentCol);
				if (gameCells[cellId])
					gameCells[cellId].style.backgroundColor = color;
			}
		}
	}
}


/**
 * Vérifie si la pièce peut se déplacer vers une position cible (col, row).
 * Analyse les collisions avec les bords de la grille (10x20) et les blocs fixés ou pénalités.
 */
function canPieceMoveTo(pieceName, RotationIndex, targetCol, targetRow, grid, matrix, gridWidth, gridHeight)
{
	const pieceMatrix = matrix[pieceName][RotationIndex];
	for (let j = 0; j < pieceMatrix.length; j++) 
	{
		for (let i = 0; i < pieceMatrix[j].length; i++) 
		{
			if (pieceMatrix[j][i] === 1) 
			{
				const newRow = targetRow + j;
				const newCol = targetCol + i;
				if (newCol < 0 || newCol >= gridWidth || newRow >= gridHeight)
					return false;
				if (newRow >= 0 && (grid[newRow][newCol] === 1 || grid[newRow][newCol] === 'P'))
                    return false;
			}
		}
	}
	return true;
}


/**
 * Identifie les indices de toutes les lignes complètes dans la grille.
 * Une ligne est considérée comme complète si chaque cellule est occupée (1 ou 'P').
 */
function findFullLines(grid)
{
	const linesToClear = [];

	for (let i = 0; i < grid.length; ++i)
	{
		if (grid[i].every(cell => cell === 1 || cell === 'P'))
		{
			linesToClear.push(i);
		}
	}
	return linesToClear;
}


/**
 * Génère une nouvelle grille après avoir supprimé les lignes complètes.
 * Ajoute le nombre exact de lignes vides nécessaires au sommet.
 * On garde que les lignes qui ne sont pas pleines.
 * On calcule combien de lignes il manque pour revenir à 20
 * On prépare les nouvelles lignes vides pour le haut
 * On fusionne les deux tableaux 
*/
function getNewGrid(grid, fullLinesIndices, gridWidth)
{
	const remainingRows = grid.filter((row, index) => !fullLinesIndices.includes(index));

	const nbLinesToAdd = fullLinesIndices.length;

	const emptyLines = new Array(nbLinesToAdd).fill(null).map(() => new Array(gridWidth).fill(0));

	return [...emptyLines, ...remainingRows];
}


/**
 * Applique ou retire la classe CSS 'flash' sur les cellules concernées.
 */
function toggleLineFlash(fullLinesIndices, gameCells, gridWidth, isAdding)
{
	// Logique à implémenter...
	for (let i = 0; i < fullLinesIndices.length; i++)
	{
		// La premiere case de la ligne
		const cellIndexStart = fullLinesIndices[i] * gridWidth;

		for (let j = 0; j < gridWidth; j++)
		{
			const currentCell = gameCells[cellIndexStart + j];
			if (isAdding === true)
				currentCell.classList.add('flash');
			else
				currentCell.classList.remove('flash');
		}
	}
}


/**
 * Crée et anime les étoiles de victoire aux positions des lignes supprimées.
 */
function spawnVictoryStars(fullLinesIndices)
{
	const container = document.getElementById('game-grid');
	if (!container)
		return;

	for (let i = 0; i < fullLinesIndices.length; i++)
	{
		for (let n = 0; n <= 10; n++)
		{
			const star = document.createElement('div');
			star.classList.add('star');

			let topPosition =  fullLinesIndices[i] * 30;
			let leftPosition =  Math.random() * 300;

			star.style.left = `${leftPosition}px`;
 			star.style.top = `${topPosition }px`;

			container.appendChild(star);

			setTimeout(() => {
 				star.remove();
 			}, 500);
		}
	}
}



/**
 * Gère l'enchaînement : Flash & Stars simultanés -> Attente -> Mise à jour Grille & Score.
 */
async function handleLinesClear(grid, player, cells, gridWidth, gridHeight, socket)
{
	const fullLines = findFullLines(grid);
	const isAdding = false;

	const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
	if (fullLines.length > 0)
	{
		// Animation 
		toggleLineFlash(fullLines, cells, gridWidth, true);
		spawnVictoryStars(fullLines);
		
		await delay(1000);
		
		toggleLineFlash(fullLines, cells, gridWidth, false);

		const nextGrid = getNewGrid(grid, fullLines);
		const nbLignesMatch = fullLines.length;
		
		// Pénalité
		if (nbLignesMatch > 1)
		{
			socket.emit("sendPenalty", nbLignesMatch - 1);
		}
		updateGridDisplay(nextGrid, cells, gridWidth, gridHeight);
		return nextGrid;
	}
	return grid;
}

// JE SUIS ICI 

function handleKeyPress(key, piece, rotationIndex, currentCol, currentRow, isFixed, grid, pieces, gridWidth, gridHeight)
{
	if (!piece || isFixed === true)
		return null;
	let newCol = currentCol;
	let newRow = currentRow;
	let newRotationIndex = rotationIndex;

	const checkCanRotate = canRotate(piece, currentRotationIndex,  currentCol, currentRow, grid, matrix, gridWidth, gridHeight)
	switch (key) 
	{
		case 'ArrowUp':
		case 'w':
			if (canRotate(piece, rotationIndex, currentCol, currentCol, grid, pieces, gridWidth, gridHeight))
				newRotationIndex = (rotationIndex + 1) % pieces[piece].length;
			break;
		


		default
	}
}			



// SELON key :
//   'ArrowUp' ou 'w'         → SI canRotate(...) : newRotationIndex = (rotationIndex + 1) % ...
//   'ArrowDown' ou 's'       → SI canPieceMoveTo(newCol, newRow + 1, ...) : newRow++
//   'ArrowLeft' ou 'a'       → SI canPieceMoveTo(newCol - 1, newRow, ...) : newCol--
//   'ArrowRight' ou 'd'      → SI canPieceMoveTo(newCol + 1, newRow, ...) : newCol++
//   ' ' ou '1'               → TANT QUE canPieceMoveTo(newCol, newRow + 1, ...) : newRow++

// retourner { rotationIndex: newRotationIndex, col: newCol, row: newRow }


/**
 * handleKeyPress - Gère les déplacements et rotations via le clavier.
 *
 * Interprète les touches directionnelles, espace, ou ZQSD pour bouger ou faire tourner la pièce,
 * et synchronise l’action avec le serveur.
 *
 * @param event Événement clavier capturé
 */
function handleKeyPress(event)
{
	if (!piece || isFixed) 
		return;


	clearPiece(matrix[piece][currentRotationIndex], startX, startY, gameCells);
	if (event.key === 'ArrowUp' && canRotate(piece, currentRotationIndex, startX, startY, grid))
		currentRotationIndex = (currentRotationIndex + 1) % matrix[piece].length;
	if (event.key === ' ')
	{
		while (canMoveTo(startX, startY + 1, grid))
			startY++;
	}
	if (event.key === 'ArrowDown')
	{
		if (canMoveTo(startX, startY + 1, grid))
			startY++;
	}
	if (event.key === 'ArrowLeft')
	{
		if (canMoveTo(startX - 1, startY, grid))
			startX--; 
	}
	if (event.key === 'ArrowRight')
	{
		if (canMoveTo(startX + 1, startY, grid))
			startX++;
	}
	if (event.key === 'w' && canRotate(piece, currentRotationIndex, startX, startY, grid))
    	currentRotationIndex = (currentRotationIndex + 1) % matrix[piece].length;
	if (event.key === '1')
	{
		while (canMoveTo(startX, startY + 1, grid))
			startY++;
	}
	if (event.key === 's')
	{
		if (canMoveTo(startX, startY + 1, grid))
			startY++;
	}
	if (event.key === 'a')
	{
		if (canMoveTo(startX - 1, startY, grid))
			startX--; 
	}
	if (event.key === 'd')
	{
		if (canMoveTo(startX + 1, startY, grid))
			startX++;
	}
	socket.emit("playerAction", {
		key: event.key,
		id: socket.id,
		piece: piece
	});
	displayPiece(matrix[piece][currentRotationIndex], startX, startY, 'red', gameCells);

}
	
/**
 * addCellulesInTheGrill - Génère les 200 cellules de la grille principale du joueur.
 *
 * Chaque cellule est un `div` avec la classe 'cell', ajoutée dans le DOM.
 */			
function addCellulesInTheGrill()
{
	for (let i = 0; i < 200; i++) 
	{
		const cell = document.createElement('div');
		cell.classList.add('cell');
		gameGrid.appendChild(cell);
	}
}

/**
 * addCellsToOpponentGrid - Génère les 200 cellules de la grille de l’adversaire.
 *
 * Chaque cellule est un `div` avec la classe 'cell', ajoutée au conteneur de la grille adverse.
 */
function addCellsToOpponentGrid()
{
	const opponentGrid = document.getElementById("opponent-grid");
	for (let i = 0; i < 200; i++) 
	{
		const cell = document.createElement('div');
		cell.classList.add('cell');
		opponentGrid.appendChild(cell);
	}
}


	// grid.splice(i, 1); // supprime la ligne
	// grid.unshift(new Array(10).fill(0)); // ajoute une nouvelle ligne en haut
