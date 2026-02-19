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




// JE SUIS ICI 

/**
 * clearPiece - Efface l'affichage d'une pièce sur la grille.
 *
 * Supprime la couleur d'une pièce temporaire à une position donnée pour permettre son déplacement.
 *
 * @param piece Matrice de la pièce
 * @param startX Position horizontale de départ
 * @param startY Position verticale de départ
 * @param cells Liste des cellules DOM à modifier
 */
function clearPiece(piece, startX, startY, cells)
{
    for (let j = 0; j < piece.length; ++j) 
	{
		for (let i = 0; i < piece[j].length; ++i) 
		{
			if (piece[j][i] === 1)
			{
				const index = (j + startY) * 10 + (i + startX);
				if (cells[index])
					cells[index].style.backgroundColor = '';
				else 
					console.warn(`❌ clearPiece ignoré : cellule introuvable à l'index ${index}`);
			}
		}
	}
}











document.addEventListener('keydown', handleKeyPress);
const gameGrid = document.getElementById('game-grid');

/**
 * clearFullLines - Supprime toutes les lignes complètes de la grille.
 *
 * Les lignes entièrement remplies sont supprimées avec une animation visuelle,
 * des étoiles sont affichées, et le score est mis à jour.
 *
 * @return Le nombre de lignes supprimées
 */
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
	return linesToClear.length;
}




/**
 * displayPiece - Affiche une pièce sur la grille à une position donnée.
 *
 * Colore les cellules DOM en fonction de la matrice de la pièce et de la couleur donnée.
 *
 * @param piece Matrice de la pièce
 * @param startX Position horizontale
 * @param startY Position verticale
 * @param color Couleur à appliquer
 * @param cells Liste des cellules DOM à colorer
 */
function displayPiece(piece, startX, startY, color, cells)
{
	for (let j = 0; j < piece.length; ++j)
	{
		for (let i = 0; i < piece[j].length; ++i) 
		{
			if (piece[j][i] === 1) 
			{
				const index = (j + startY) * 10 + (i + startX);
				if (cells[index])
					cells[index].style.backgroundColor = color;
				else
					console.warn(`❌ displayPiece ignoré : cellule introuvable à l'index ${index}`);
			}
		}
	}
}



/**
 * handleKeyPress - Gère les déplacements et rotations via le clavier.
 *
 * Interprète les touches directionnelles, espace, ou ZQSD pour bouger ou faire tourner la pièce,
 * et synchronise l’action avec le serveur.
 *
 * @param event Événement clavier capturé
 */
function handleKeyPress(event)
{
	if (!piece) 
		return;
	if (isFixed)
		return; 
	clearPiece(matrix[piece][currentRotationIndex], startX, startY, gameCells);
	if (event.key === 'ArrowUp' && canRotate(piece, currentRotationIndex, startX, startY, grid))
		currentRotationIndex = (currentRotationIndex + 1) % matrix[piece].length;
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
	if (event.key === 'w' && canRotate(piece, currentRotationIndex, startX, startY, grid))
    	currentRotationIndex = (currentRotationIndex + 1) % matrix[piece].length;
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
	
/**
 * addCellulesInTheGrill - Génère les 200 cellules de la grille principale du joueur.
 *
 * Chaque cellule est un `div` avec la classe 'cell', ajoutée dans le DOM.
 */			
function addCellulesInTheGrill()
{
	for (let i = 0; i < 200; i++) 
	{
		const cell = document.createElement('div');
		cell.classList.add('cell');
		gameGrid.appendChild(cell);
	}
}

/**
 * addCellsToOpponentGrid - Génère les 200 cellules de la grille de l’adversaire.
 *
 * Chaque cellule est un `div` avec la classe 'cell', ajoutée au conteneur de la grille adverse.
 */
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
