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
			if (newY >= 20 || grid[newY][newX] === 1)
			  return true; // collision détectée
			}
		}
  }
  return false;
}

function updateGridDisplay()
{
	for (let y = 0; y < 20; y++) 
	{
		for (let x = 0; x < 10; x++) 
		{
			const index = y * 10 + x;
			if (grid[y][x] === 1)
				gameCells[index].style.backgroundColor = 'red';
			else
				gameCells[index].style.backgroundColor = '';
		}
	}
}

function dropPiece()
{
	if (!piece) 
		return; 
	// Récupère la matrice correspondant à la rotation actuelle de la pièce
	const pieceMatrix = matrix[piece][currentRotationIndex];
	
	let lastActiveRow = 0;
	
	// Parcourt toute la pièce pour trouver la ligne la plus basse avec un bloc actif (1)
	for(let j = 0; j < pieceMatrix.length; j++)
	{
		for(let i = 0; i < pieceMatrix[j].length; i++)
		{
			if (pieceMatrix[j][i] === 1)
				lastActiveRow = j;
		}
	}
	// Vérifie si la pièce touche le bas de la grille
	const atBottom = startY + lastActiveRow + 1 >= 20;
	const collision = hasCollisionBelow(pieceMatrix, startX, startY, grid);

	if (atBottom || collision)
	{
		isFixed = true; // la pièce est désormais immobile
		// On inscrit les blocs actifs dans la grille virtuelle
		for(let j = 0; j < pieceMatrix.length; j++)
		{
	    	for(let i = 0; i < pieceMatrix[j].length; i++)
			{
				if (pieceMatrix[j][i] === 1)
					grid[startY + j][startX + i] = 1;
			}
	    }
		clearFullLines();
		//clearPiece(matrix[piece][currentRotationIndex], startX, startY, gameCells); // efface visuellement la piece
		updateGridDisplay(); 
		socket.emit("needNewPiece");

		return;
	}
	clearPiece(matrix[piece][currentRotationIndex], startX, startY, gameCells);
	startY++;
	socket.emit("playerAction", {
		key: "s",
		id: socket.id,
		piece: piece
	  });
	displayPiece(matrix[piece][currentRotationIndex], startX, startY, 'red', gameCells);
}
