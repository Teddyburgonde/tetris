import { matrix } from './pieces'

/**
 * Calcule le spectre de la grille : la hauteur de chaque colonne.
 * Pour chaque colonne, on cherche la première ligne occupée en partant du haut,
 * et on en déduit la hauteur (20 - index de cette ligne). Si la colonne est vide, hauteur = 0.
 * @param {Array<Array<number|string>>} grid - Grille de jeu (10 colonnes x 20 lignes).
 * @return {Array<number>} - Tableau de 10 hauteurs (une par colonne).
 */
function getSpectrum(grid)
{
	const spectrum = new Array(10);
	for (let col = 0; col < 10; col++)
	{
		const firstBlockRow = grid.findIndex(ligne => ligne[col] !== 0);
		spectrum[col] = firstBlockRow === -1 ? 0 : 20 - firstBlockRow;
	}
	return spectrum;
}

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
 * Calcule l'état suivant de la pièce : soit elle continue sa chute, 
 * soit elle doit être verrouillée sur la grille en cas de collision.
 */
function dropPiece(piece, currentRotationIndex, currentCol, currentRow, grid)
{
	if (!piece)
		return null;

	const pieceShape = matrix[piece][currentRotationIndex];
	
	// On vérifie s'il y a un obstacle en dessous
	const collision = hasCollisionBelow(pieceShape, currentCol, currentRow, grid, 10, 20);

	if (collision == true)
		return { action: 'LOCK', col: currentCol, row: currentRow, shape: pieceShape }
	else
		return { action: 'DROP', col: currentCol, row: currentRow + 1 };
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
 * Calcule la ligne d'atterrissage de la pièce (ghost) si elle tombait directement,
 * sans déplacer la pièce actuelle.
 */
function getGhostRow(piece, rotationIndex, col, row, grid, matrix, gridWidth, gridHeight)
{
	let ghostRow = row;

	while (canPieceMoveTo(piece, rotationIndex, col, ghostRow + 1, grid, matrix, gridWidth, gridHeight))
		ghostRow++;

	return ghostRow;
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
 * Ajoute nbLines lignes de pénalité ('P') en bas de la grille.
 * On retire nbLines lignes en haut pour garder une hauteur totale de 20.
 */
function addPenaltyLines(grid, nbLines, gridWidth)
{
	const remainingRows = grid.slice(nbLines);

	const penaltyRows = Array.from({ length: nbLines }, () => new Array(gridWidth).fill('P'));

	const newGrid = [...remainingRows, ...penaltyRows];

	return newGrid;
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
			if (canPieceMoveTo(piece, rotationIndex, currentCol, currentRow + 1, grid, pieces, gridWidth, gridHeight))
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






export {canRotate, canPieceMoveTo, findFullLines, getNewGrid, handleKeyPress, dropPiece, hasCollisionBelow, getSpectrum, addPenaltyLines, getGhostRow}