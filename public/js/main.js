const socket = io("http://10.11.6.6:3000");
//const socket = io(`http://${window.location.hostname}:3000`);


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
 * updateScore - Incrémente et affiche le score actuel.
 *
 * Le score est augmenté selon le nombre de lignes supprimées ou les actions du joueur.
 *
 * @param points Nombre de points à ajouter au score
 */
function updateScore(points) 
{
	score += points;
	document.getElementById("score").textContent = `Score : ${score}`;
}

/**
 * canMoveToForPlayer - Vérifie si un joueur peut déplacer sa pièce à une position donnée.
 *
 * Utilisé pour simuler les mouvements du joueur adverse sans collisions ou sortie de la grille.
 *
 * @param player Objet contenant les données de la pièce et de la grille du joueur
 * @param x Position horizontale souhaitée
 * @param y Position verticale souhaitée
 * @return true si le déplacement est possible, false sinon
 */
function canMoveToForPlayer(player, x, y) 
{
	const pieceMatrix = matrix[player.piece][player.rotation];
	for (let j = 0; j < pieceMatrix.length; j++) 
	{
		for (let i = 0; i < pieceMatrix[j].length; i++) 
		{
			if (pieceMatrix[j][i] === 1) 
			{
				const newY = y + j;
				const newX = x + i;
				if (newY >= 20 || newX < 0 || newX >= 10 || player.grid[newY][newX] === 1)
					return false;
			}
		}
	}
	return true;
}

// Réception de la séquence et démarrage
socket.on("startGame", (gameData) => {
	gameStarted = true;

	socket.emit("needNewPiece");
});


socket.on("newPiece", ({ piece: newPiece }) => {
	piece = newPiece;
	startX = 3;
	startY = 0;
	currentRotationIndex = 0;
	isFixed = false;
	clearInterval(gameLoop);
	gameLoop = setInterval(dropPiece, 500);
	if (hasCollisionBelow(matrix[piece][currentRotationIndex], startX, startY - 1, grid)) 
	{
		console.log("❌ GAME OVER détecté à l’apparition");
  		clearInterval(gameLoop);
  		document.getElementById("game-over").style.display = "block";
  		return;
	}
	if (!players[socket.id])
	{
		players[socket.id] = {
			grid: Array.from({ length: 20 }, () => Array(10).fill(0)),
		};
	}
	players[socket.id].piece = piece;
	players[socket.id].x = startX;
	players[socket.id].y = startY;
	players[socket.id].rotation = currentRotationIndex;
	displayPiece(matrix[piece][currentRotationIndex], startX, startY, 'red', gameCells);
	socket.emit("playerAction", {
		key: "newPiece",
		id: socket.id,
		piece: piece
	});
});

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