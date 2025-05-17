document.addEventListener('keydown', handleKeyPress);
const gameGrid = document.getElementById('game-grid');


function clearFullLines()
{
	const linesToClear = [];

	// identification des lignes pleines
	for (let i = 0; i < grid.length; ++i)
	{
		if (grid[i].every(cell => cell === 1))
		{
			linesToClear.push(i); // stocker l'indice 
			for (let x = 0; x < 10; x++) 
			{
				const index = i * 10 + x;
				gameCells[index].classList.add('flash');
			}
		}
	}
	// Supprime la ligne après une courte animation
	if (linesToClear.length > 0)
	{
		setTimeout(() =>
		{
			for (const i of linesToClear)
			{
				grid.splice(i, 1); // supprime la ligne
				grid.unshift(new Array(10).fill(0)); // ajoute une nouvelle ligne en haut
			}
			updateGridDisplay();

			// Retire la classe flash après animation
			for (const i of linesToClear)
			{
				for (let x = 0; x < 10; x++) 
				{
					const index = i * 10 + x;
					gameCells[index].classList.remove('flash');
				}
			}

			const gridRect = document.getElementById('game-grid').getBoundingClientRect();
			for (const i of linesToClear)
			{
				for (let n = 0; n < 5; n++) // 5 étoiles par ligne
				{
					const star = document.createElement('div');
					star.classList.add('star');

					// Position approximative dans la zone du #game-grid
					const x = gridRect.left + Math.random() * gridRect.width;
					const y = gridRect.top + i * (gridRect.height / 20) + Math.random() * 30;

					star.style.left = `${x}px`;
					star.style.top = `${y}px`;

					document.getElementById('container').appendChild(star);
					// Supprimer l'étoile après l'animation
					setTimeout(() => {
						star.remove();
					}, 500);
				}
			}
			updateScore(linesToClear.length * 100);
		}, 200);
	}
}


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

function clearPiece(piece, startX, startY, cells)
{
    for (let j = 0; j < piece.length; ++j) 
	{
		for (let i = 0; i < piece[j].length; ++i) 
		{
			if (piece[j][i] === 1)
			{
				const index = (j + startY) * 10 + (i + startX);
				if (cells[index]) {
					cells[index].style.backgroundColor = '';
				} else {
					console.warn(`❌ clearPiece ignoré : cellule introuvable à l'index ${index}`);
				}
			}
		}
	}
}


function displayPiece(piece, startX, startY, color, cells)
{
	for (let j = 0; j < piece.length; ++j)
	{
		for (let i = 0; i < piece[j].length; ++i) 
		{
			if (piece[j][i] === 1) 
			{
				const index = (j + startY) * 10 + (i + startX);
				if (cells[index]) {
					cells[index].style.backgroundColor = color;
				} else {
					console.warn(`❌ displayPiece ignoré : cellule introuvable à l'index ${index}`);
				}
			}
		}
	}
}


function handleKeyPress(event)
{
	if (!piece) 
		return;
	if (isFixed)
		return; 
	clearPiece(matrix[piece][currentRotationIndex], startX, startY, gameCells);
	if (event.key === 'ArrowUp')
	{
		// Passage à la prochaine rotation
		currentRotationIndex = (currentRotationIndex + 1) % matrix[piece].length;
	}
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
	if (event.key === 'w')
	{
		currentRotationIndex = (currentRotationIndex + 1) % matrix[piece].length;
	}
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
	
				
function addCellulesInTheGrill()
{
	for (let i = 0; i < 200; i++) 
	{
		const cell = document.createElement('div');
		cell.classList.add('cell');
		gameGrid.appendChild(cell);
	}
}

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
