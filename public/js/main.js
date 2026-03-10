
// Decommenter pour jouer a deux
// const socket = io("http://10.11.6.6:3000");
const socket = io(`http://${window.location.hostname}:3000`);

document.addEventListener('keydown', handleKeyPress);

let players = {};
let isFixed = false;
let gameStarted = false;
let score = 0;
let piece;
let gameLoop;
let col = 3;
let row = 0;
let currentRotation = 0;

const gameGrid = document.getElementById('game-grid');
const opponentGrid = document.getElementById('opponent-grid');
addCellulesInTheGrill(gameGrid, 10, 20);
addCellulesInTheGrill(opponentGrid, 10, 20);


const gameCells = document.querySelectorAll('#game-grid .cell');
const opponentCells = document.querySelectorAll('#opponent-grid .cell');

let grid = Array.from({ length: 20 }, () => Array(10).fill(0));

/**
 * Calcule et retourne le nouveau score après ajout des points.
 */
function updateScore(points, score) 
{	
	return score + points;
}

/**
 * Retourne true pour indiquer que la partie a démarré.
 */
function startGame(gameStarted)
{
    return true;
}


/**
 * Retourne l'état initial d'une nouvelle pièce.
 */
function initNewPiece(piece)
{
	return {
		piece: piece,
		x: 3,
		y: 0,
		rotation: 0,
		isFixed: false
	};
}

/**
 * Retourne true si la partie est terminée (collision détectée à l'apparition de la pièce).
 */
function isGameOver(piece, rotationIndex, col, row, grid, pieces)
{
	if (hasCollisionBelow(pieces[piece][rotationIndex], col , row - 1, grid)) 
  		return true;
	return false;
}


/**
 * Retourne un nouvel objet players avec l'état du joueur mis à jour.
 */
function updatePlayerState(players, socketId, piece, x, y, rotation)
{
	return {
		...players,
		[socketId]: {
			...players[socketId],
			piece: piece,
			x: x,
			y: y,
			rotation: rotation
		}
	};
}

/**
 * Initialise un objet joueur s'il n'existe pas encore dans le répertoire des joueurs.
 */
function initRemotePlayer(players, id, piece)
{
	if (!players[id]) 
	{
		players[id] = 
		{
			grid: Array.from({ length: 20 }, () => Array(10).fill(0)),
			x: 3,
			y: 0,
			rotation: 0,
			piece: piece
		};
	}
}

/**
 * Met à jour les coordonnées et la rotation du joueur distant.
 */
function updateRemotePlayerPosition(player, data)
{
	// Si c'est une nouvelle pièce, on réinitialise tout
	if (data.key === "newPiece") 
	{
		player.piece = data.piece;
		player.x = 3;
		player.y = 0;
		player.rotation = 0;
	}
	else // Sinon, on met à jour les coordonnées reçues
	{
		player.x = data.x;
        player.y = data.y;
		if (typeof data.rotation === 'number') 
            player.rotation = data.rotation;
		else
            player.rotation = 0;
	}
}


/**
 * Intègre les blocs de la pièce actuelle dans la grille de données du joueur adverse.
 */
function fixPieceToRemoteGrid(player, pieceMatrix)
{
	// On vérifie si la matrice existe
	if (!pieceMatrix) 
		return;
	// On parcourt la matrice de la pièce
	for (let j = 0; j < pieceMatrix.length; j++) 
	{
		for (let i = 0; i < pieceMatrix[j].length; i++) 
		{
			// Si la case de la pièce est pleine (1)
			if (pieceMatrix[j][i] === 1) 
			{
				const gridCoordX = player.x + i;
				const gridCoordY = player.y + j;

				const isInsideGrid = gridCoordY >= 0 && gridCoordY < 20 && gridCoordX >= 0 && gridCoordX < 10;
				// On vérifie qu'on ne sort pas de la grille (20x10)
				if (isInsideGrid) 
					player.grid[gridCoordY][gridCoordX] = 1;
			}
		}
	}
}


/**
 * Met à jour l'affichage visuel de la grille de l'adversaire.
 */
function updateOpponentGridDisplay(playerGrid, cells)
{
	for (let j = 0; j < 20; j++) 
	{
		for (let i = 0; i < 10; i++) 
		{
			const index = j * 10 + i;
			if (playerGrid[j][i] === 1)
				cells[index].style.backgroundColor = 'blue';
			else
				cells[index].style.backgroundColor = '';
		}
	}
}


/**
 * Crée une copie indépendante de la grille.
 */
function copyGrid(currentGrid)
{
	let newGrid = [];
	for (let i = 0; i < currentGrid.length; ++i)
		newGrid.push(currentGrid[i].slice());
	return newGrid;

}

/**
 * Crée une copie de la grille actuelle et y ajoute des lignes de pénalité 
 * en décalant le contenu vers le haut.
 */
function applyPenaltyToGrid(currentGrid, nbLines) 
{
	let newGrid = copyGrid(currentGrid);

	for (let i = 0; i < nbLines; i++) 
	{
		// 1. Supprime la ligne du haut (index 0)
		newGrid.shift();

		// 2. Ajoute une ligne de pénalité en bas (remplie de 'P')
		newGrid.push(new Array(10).fill('P'));
	}
	return newGrid;
}

// --------- callback ------------------


// Réception de la séquence et démarrage
socket.on("startGame", (gameData) => {
	gameStarted = startGame(gameStarted);
	socket.emit("needNewPiece");
});


socket.on("newPiece", ({ piece: newPiece }) => {
	clearInterval(gameLoop); // précaution -> arrête la loop.
	gameLoop = setInterval(() => dropPiece(piece, currentRotation, col, row, grid), 500);
	const newState = initNewPiece(newPiece);
	piece = newState.piece;
	let col = newState.x;
	let row = newState.y;
	let currentRotation = newState.rotation;

	const gameOver = isGameOver(piece, currentRotation, col, row, grid, matrix);
	if (gameOver === true)
	{
		clearInterval(gameLoop);
		document.getElementById("game-over").style.display = "block";
		return;
	}
	displayPiece(matrix[piece][currentRotation], col, row, gameCells, 10, 'red');
	players = updatePlayerState(players, socket.id, piece, col, row, currentRotation);
	socket.emit("playerAction", {
		key: "newPiece",
		id: socket.id,
		piece: piece
	});
});


/**
 * Gère la synchronisation en temps réel du joueur adverse :
 * Initialise le joueur, met à jour sa position et synchronise sa grille.
 */
socket.on("updateOtherPlayer", (data) => {
	// On initialise le joueur
	initRemotePlayer(players, data.id, data.piece);

	// On récupère la référence du joueur
	const player = players[data.id];
	
	// On met à jour ses coordonnées
	updateRemotePlayerPosition(player, data)
	
	// Si l'adversaire a fixé une pièce, on l'ajoute à sa grille logique
	if (data.key === "fix")
	{
		const mat = matrix[player.piece]?.[player.rotation];
		fixPieceToRemoteGrid(player, mat);
	}
	// On prépare la matrice actuelle pour l'affichage visuel
	const currentMat = matrix[player.piece][player.rotation];

	// Rendu visuel : on dessine la grille fixe puis la pièce mobile par-dessus
	updateOpponentGridDisplay(player.grid, opponentCells);
	displayPiece(currentMat, player.x, player.y, 'blue', opponentCells);
});


/**
 * Écoute l'événement de pénalité envoyé par le serveur, met à jour 
 * la grille logique et rafraîchit l'affichage visuel.
 */
socket.on("receivePenalty", (nbLignes) => {
	grid = applyPenaltyToGrid(grid, nbLignes);
	updateGridDisplay(grid, gameCells, 10, 20);
});

