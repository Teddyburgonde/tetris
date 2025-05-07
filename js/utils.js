document.addEventListener('keydown', handleKeyPress);
const gameGrid = document.getElementById('game-grid');

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
	if (event.key === 'ArrowDown')
	{
		startY++;
	}
	if (event.key === 'ArrowLeft')
	{	
		startX--; 
	}
	if (event.key === 'ArrowRight')
	{
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
