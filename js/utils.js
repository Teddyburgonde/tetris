document.addEventListener('keydown', handleKeyPress);
const gameGrid = document.getElementById('game-grid');

function canMoveTo(newX, newY)
{
	const pieceMatrix = matrix[piece][currentRotationIndex];

	for (let j = 0; j < pieceMatrix.length; ++j)
	{
		for (let i = 0; i < pieceMatrix[j].length; ++i)
		{
			if (pieceMatrix[j][i] === 1)
			{
				const x = newX + i;
				const y = newY + j;
				if (x < 0 || x >= 10)
					return false;
				if (y < 0 || y >= 20)
					return false;
				if (grid[y][x] === 1)
					return false; 
			}
		}
	}
	return true;
}


function clearPiece(piece, startX, startY)
{
    for (let j = 0; j < piece.length; ++j) 
	{
		for (let i = 0; i < piece[j].length; ++i) 
		{
			if (piece[j][i] === 1)
			{
				const cell = cells[(j + startY) * 10 + (i + startX)];
				cell.style.backgroundColor = '';
			}
		}
	}
}

function displayPiece(piece, startX, startY, color)
{
	for (let j = 0; j < piece.length; ++j)
	{
		for (let i = 0; i < piece[j].length; ++i) 
		{
			if (piece[j][i] === 1) 
			{
				const cell = cells[(j + startY) * 10 + (i + startX)];
				cell.style.backgroundColor = color;
			}
		}
	}
}

function handleKeyPress(event)
{
	if (isFixed)
		return; 
	clearPiece(matrix[piece][currentRotationIndex], startX, startY);
	if (event.key === 'ArrowUp')
	{
		// Passage à la prochaine rotation
		currentRotationIndex = (currentRotationIndex + 1) % matrix[piece].length;
		console.log('Flèche du haut détectée');
	}
	if (event.key === ' ')
	{
		while (canMoveTo(startX, startY + 1))
			startY++;
	}
	if (event.key === 'ArrowDown')
	{
		if (canMoveTo(startX, startY + 1))
			startY++;
	}
	if (event.key === 'ArrowLeft')
	{
		if (canMoveTo(startX - 1, startY))
			startX--; 
	}
	if (event.key === 'ArrowRight')
	{
		if (canMoveTo(startX + 1, startY))
		startX++;
	}
	displayPiece(matrix[piece][currentRotationIndex], startX, startY, 'red');
}
	
				
function addCellulesInTheGrill()
{
	for (let i = 0; i < 200; i++) 
	{
		const cell = document.createElement('div');
		cell.classList.add('cell');
		gameGrid.appendChild(cell);
	}
}
