function dropPiece()
{
	const pieceMatrix = matrix[piece][currentRotationIndex];
	//const pieceHeight = pieceMatrix.length;
	let lastActiveRow = 0;
	
	// Loop through the piece to find the lowest block row (1)
	for(let j = 0; j < pieceMatrix.length; j++)
	{
		for(let i = 0; i < pieceMatrix[j].length; i++)
		{
			if (pieceMatrix[j][i] === 1)
				lastActiveRow = j;
		}
	}
	const atBottom = startY + lastActiveRow + 1 >= 20;
	if (atBottom)
	{
		isFixed = true;
		// Save the current blocks into the virtual grid
		for(let j = 0; j < pieceMatrix.length; j++)
		{
	    	for(let i = 0; i < pieceMatrix[j].length; i++)
			{
				if (pieceMatrix[j][i] === 1)
					grid[startY + j][startX + i] = 1;
			}
	    }
		return;
	}
	clearPiece(matrix[piece][currentRotationIndex], startX, startY);
	startY++;
	displayPiece(matrix[piece][currentRotationIndex], startX, startY, 'red');
}