const socket = io("http://10.11.6.6:3000");
//const socket = io(`http://${window.location.hostname}:3000`);

document.addEventListener('keydown', handleKeyPress);

const players = {};
let isFixed = false;
let gameStarted = false;
let score = 0;
let piece;
let startX = 3;
let startY = 1;
let currentRotationIndex = 0;
let gameLoop;


addCellulesInTheGrill();
addCellsToOpponentGrid();

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


// --------- callback ------------------


// Réception de la séquence et démarrage
socket.on("startGame", (gameData) => {
	gameStarted = startGame(gameStarted);
	socket.emit("needNewPiece");
});


socket.on("newPiece", ({ piece: newPiece }) => {
	clearInterval(gameLoop); // précaution -> arrête la loop.
	gameLoop = setInterval(dropPiece, 500);
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

// JE SUIS ICI 


// initialisation et sauvegarde les datas de l'adversaires
socket.on("updateOtherPlayer", ({ key, id, piece, x, y, rotation }) => {
	console.log("🎯 updateOtherPlayer reçu :", { key, id, piece, x, y, rotation });

	if (!players[id]) {
		console.log("ℹ️ Initialisation du joueur", id);
		players[id] = {
			grid: Array.from({ length: 20 }, () => Array(10).fill(0)),
			x: 3,
			y: 0,
			rotation: 0,
			piece: piece
		};
	}

	const player = players[id];

	// ⚙️ Mise à jour des données du joueur selon le type de message
	if (key === "newPiece") {
		player.piece = piece;
		player.x = 3;
		player.y = 0;
		player.rotation = 0;
	} else {
		player.x = x;
		player.y = y;
		player.rotation = typeof rotation === 'number' ? rotation : 0;

		if (key === "fix") {
			const mat = matrix[player.piece]?.[player.rotation];
			if (!mat) 
			{
				console.warn("❌ fix ignoré : matrix introuvable pour", player.piece, player.rotation);
				return;
			}
			for (let j = 0; j < mat.length; j++) {
				for (let i = 0; i < mat[j].length; i++) {
					if (mat[j][i] === 1) {
						const gx = player.x + i;
						const gy = player.y + j;
						if (gy >= 0 && gy < 20 && gx >= 0 && gx < 10) {
							player.grid[gy][gx] = 1;
						}
					}
				}
			}
		}
	}

	// 🧼 Efface la pièce précédente
	const oldMatrix = matrix[player.piece]?.[player.rotation];
	if (!oldMatrix) 
	{
		console.warn("❌ displayPiece ignoré : matrix introuvable pour", player.piece, player.rotation);
		return;
	}
	clearPiece(oldMatrix, player.x, player.y, opponentCells);

	// 🎨 Affiche la grille fixe
	for (let j = 0; j < 20; j++) {
		for (let i = 0; i < 10; i++) {
			const index = j * 10 + i;
			opponentCells[index].style.backgroundColor = player.grid[j][i] === 1 ? 'blue' : '';
		}
	}

	// 🎮 Affiche la nouvelle pièce
	displayPiece(oldMatrix, player.x, player.y, 'blue', opponentCells);
});

socket.on("receivePenalty", (nbLignes) => {
	const adversaireId = Object.keys(players).find(id => id !== socket.id);
	grid.shift();
	for (let i = 0; i < nbLignes; ++i)
		grid.push(Array(10).fill('P'));
	updateGridDisplay();
});