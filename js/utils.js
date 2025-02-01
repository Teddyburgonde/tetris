/* Il y a 4 fonctiopns dans ce fichier : 
- clearPiece permet d'effacer une piece 
- displayPiece permet d'afficher une piece 
- rotatePiece permet de faire une rotation de la piece
- addCellulesInTheGrill permet d'ajouter les 200 celulles a la grille.
*/

const gameGrid = document.getElementById('game-grid');
let currentOrientation = 'horizontal'; 

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

function rotatePiece()
{
	if (currentOrientation === 'horizontal')
		currentOrientation = 'vertical';
	else 
		currentOrientation = 'horizontal';
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