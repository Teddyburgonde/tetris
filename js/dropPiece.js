function generateNewPiece() 
{
	// const pieces = ['I', 'O', 'T', 'J', 'L', 'S', 'Z'];
	const pieces = ['O', 'O', 'O', 'O', 'O', 'O', 'O'];
	const randomIndex = Math.floor(Math.random() * pieces.length);
	piece = pieces[randomIndex];
	startX = 3;
	startY = 0;
	currentRotationIndex = 0;
	isFixed = false;
	displayPiece(matrix[piece][currentRotationIndex], startX, startY, 'red');
}  

function dropPiece()
{
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
	if (atBottom)
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
		generateNewPiece();
		return;
	}
	clearPiece(matrix[piece][currentRotationIndex], startX, startY);
	startY++;
	displayPiece(matrix[piece][currentRotationIndex], startX, startY, 'red');
}