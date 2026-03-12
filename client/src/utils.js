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


/**
 * Calcule le nouvel état de la pièce selon la touche pressée.
 * Retourne null si la pièce est absente ou fixée, sinon retourne { col, row, rotationIndex }.
 */
function handleKeyPress(key, piece, rotationIndex, currentCol, currentRow, isFixed, grid, pieces, gridWidth, gridHeight)
{
	if (!piece || isFixed === true)
		return null;
	let newCol = currentCol;
	let newRow = currentRow;
	let newRotationIndex = rotationIndex;

	switch (key) 
	{
		// Chute automatique
		case ' ':
		case '1':
			while (canPieceMoveTo(piece, rotationIndex, newCol, newRow + 1, grid, pieces, gridWidth, gridHeight))
        		newRow++;
			break;
		case 'ArrowUp':
		case 'w':
			if (canRotate(piece, rotationIndex, currentCol, currentRow, grid, pieces, gridWidth, gridHeight))
				newRotationIndex = (rotationIndex + 1) % pieces[piece].length;
			break;
		case 'ArrowDown':
		case 's':
			if (canPieceMoveTo(piece, rotationIndex, currentCol, currentRow, grid, pieces, gridWidth, gridHeight))
				newRow = currentRow + 1;		
			break;
		case 'ArrowLeft':
		case 'a':
			if (canPieceMoveTo(piece, rotationIndex, currentCol - 1, currentRow, grid, pieces, gridWidth, gridHeight))
				newCol = currentCol -1;
			break;
		case 'ArrowRight':
		case 'd':
			if (canPieceMoveTo(piece, rotationIndex, currentCol + 1, currentRow, grid, pieces, gridWidth, gridHeight))
				newCol = currentCol +1;
			break;
	}
	const newState = { col: newCol, row: newRow, rotationIndex: newRotationIndex };
	return newState;
}			


/**
 * Génère les cellules HTML d'une grille et les ajoute dans le container donné.
 */
function addCellulesInTheGrill(container, gridWidth, gridHeight)
{
	const nbCells = gridWidth * gridHeight;
	for (let i = 0; i < nbCells; i++)
	{
		const cell = document.createElement('div');
		cell.classList.add('cell');
		container.appendChild(cell);
	}
}

