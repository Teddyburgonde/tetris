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
 * canMoveTo - Vérifie si la pièce actuelle peut être déplacée aux coordonnées spécifiées.
 *
 * S'assure que la pièce ne sort pas de la grille et n'entre pas en collision avec des pièces fixées.
 *
 * @param newX Nouvelle position horizontale
 * @param newY Nouvelle position verticale
 * @return true si le mouvement est valide, false sinon
 */
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
 * canRotate - Vérifie si une rotation de la pièce est possible.
 *
 * Simule la rotation et vérifie qu'elle n'entraîne pas de collision ni de sortie de la grille.
 *
 * @param piece Nom de la pièce
 * @param currentRotationIndex Index de la rotation actuelle
 * @param startX Position horizontale
 * @param startY Position verticale
 * @param grid Grille de jeu
 * @return true si la rotation est possible, false sinon
 */
function canRotate(piece, currentRotationIndex, startX, startY, grid)
{
	const nextMatrixIndex = (currentRotationIndex + 1) % matrix[piece].length;
	const rotatedMatrix = matrix[piece][nextMatrixIndex];
	let newX;
	let newY;
	for (let j = 0; j < rotatedMatrix.length; ++j)
	{
		for (let i = 0; i < rotatedMatrix[0].length; ++i)
		{
			if (rotatedMatrix[j][i] === 1)
			{
				newX = startX + i;
				newY = startY + j
				if (newX < 0 || newX >= 10)
					return false;
				if (grid[newY][newX] === 1 || grid[newY][newX] === 'P')
					return false;
			}
		}
	}
	return true ;
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
