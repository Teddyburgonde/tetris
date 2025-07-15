/**
 * hasCollisionBelow - Vérifie si la pièce actuelle entrerait en collision en tombant d'une case.
 *
 * Teste les cases situées sous la pièce pour détecter un contact avec une autre pièce ou le bas du plateau.
 *
 * @param pieceMatrix Matrice représentant la forme actuelle de la pièce
 * @param startX Position horizontale actuelle de la pièce
 * @param startY Position verticale actuelle de la pièce
 * @param grid Grille de jeu contenant les pièces fixées
 * @return true si collision détectée, false sinon
 */
function hasCollisionBelow(pieceMatrix, startX, startY, grid)
{
	for (let j = 0; j < pieceMatrix.length; j++)
	{
		for (let i = 0; i < pieceMatrix[j].length; i++)
		{
			// Calcule la position (x, y) sur la grille si la pièce descend d'une case
			const newY = startY + j + 1;
			const newX = startX + i;

			if (pieceMatrix[j][i] === 1)
			{
				// Si on sort de la grille OU si la case est déjà occupée dans grid
				if (newY >= 20 || grid[newY][newX] === 1 || grid[newY][newX] === 'P')
			  		return true; // collision détectée
			}
		}
	}
	return false;
}

/**
 * updateGridDisplay - Met à jour l'affichage visuel de la grille de jeu.
 *
 * Applique une couleur à chaque cellule selon son contenu : violet pour une pièce mobile,
 * rouge pour une pièce fixée, vide sinon.
 */
function updateGridDisplay()
{
	for (let y = 0; y < 20; y++) 
	{
		for (let x = 0; x < 10; x++) 
		{
			const index = y * 10 + x;
			if (grid[y][x] === 'P')
				gameCells[index].style.backgroundColor = 'violet';
			else if (grid[y][x] === 1)
				gameCells[index].style.backgroundColor = 'red';
			else
				gameCells[index].style.backgroundColor = '';
		}
	}
}

/**
 * dropPiece - Gère la descente automatique de la pièce actuelle.
 *
 * Si une collision ou le bas de la grille est atteint, la pièce est fixée, les lignes pleines
 * sont supprimées, et une nouvelle pièce est demandée. Sinon, la pièce descend d'une case.
 */
function dropPiece()
{
	if (!piece) 
		return;

	const pieceMatrix = matrix[piece][currentRotationIndex];

	let lastActiveRow = 0;
	for (let j = 0; j < pieceMatrix.length; j++) 
	{
		for (let i = 0; i < pieceMatrix[j].length; i++) 
			if (pieceMatrix[j][i] === 1) 
				lastActiveRow = j;
	}
	const atBottom = startY + lastActiveRow + 1 >= 20;
	const collision = hasCollisionBelow(pieceMatrix, startX, startY, grid);

	if (atBottom || collision)
	{
		isFixed = true;
		for (let j = 0; j < pieceMatrix.length; j++) 
		{
			for (let i = 0; i < pieceMatrix[j].length; i++) 
			{
				if (pieceMatrix[j][i] === 1)
					grid[startY + j][startX + i] = 1;
			}
		}
		const cleared = clearFullLines();
		if (cleared > 0)
			socket.emit("sendPenalty");
		updateGridDisplay();

		socket.emit("playerAction", {
			key: "fix",
			id: socket.id,
			piece: piece,
			x: startX,
			y: startY,
			rotation: currentRotationIndex
		});

		socket.emit("needNewPiece");
		piece = null;
		return;
	}

	clearPiece(matrix[piece][currentRotationIndex], startX, startY, gameCells);
	startY++;
	socket.emit("playerAction", {
		key: "s",
		id: socket.id,
		piece: piece,
		x: startX,
		y: startY,
		rotation: currentRotationIndex
	});
	displayPiece(matrix[piece][currentRotationIndex], startX, startY, 'red', gameCells);
}
