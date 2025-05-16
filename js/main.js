const socket = io("http://localhost:3000");

const players = {};
let listOfPiece = [];
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

function updateScore(points) {
	score += points;
	document.getElementById("score").textContent = `Score : ${score}`;
}

// Réception de la séquence et démarrage
socket.on("startGame", (gameData) => {
	gameStarted = true;
	listOfPiece = gameData.sequence;

	piece = gameData.firstPiece;
	startX = 3;
	startY = 0;
	currentRotationIndex = 0;
	isFixed = false;

	players[socket.id] = {
		grid: Array.from({ length: 20 }, () => Array(10).fill(0)),
		piece: piece,
		x: startX,
		y: startY,
		rotation: currentRotationIndex
	};

	displayPiece(matrix[piece][currentRotationIndex], startX, startY, 'red', gameCells);
	gameLoop = setInterval(dropPiece, 500);
});


socket.on("newPiece", ({ piece: newPiece }) => {
	piece = newPiece;
	startX = 3;
	startY = 0;
	currentRotationIndex = 0;
	isFixed = false;
	// initialisation et sauvegarde
	players[socket.id] = {

	grid: Array.from({ length: 20 }, () => Array(10).fill(0)),
	piece: piece,
	x: startX,
	y: startY,
	rotation: currentRotationIndex
	};
	displayPiece(matrix[piece][currentRotationIndex], startX, startY, 'red', gameCells);
	socket.emit("playerAction", {
		key: "newPiece",
		id: socket.id,
		piece: piece
	});
});

// initialisation et sauvegarde les datas de l'adversaires
socket.on("updateOtherPlayer", ({ key, id, piece }) => {
	console.log("🎯 Reçu :", key, piece, id);
	if (key === "newPiece") 
	{
		if (!players[id]) 
		{
			console.log("🎯 Reçu :", key, piece, id);
			players[id] = {
			grid: Array.from({ length: 20 }, () => Array(10).fill(0)),
	
			x: 3,

			y: 0,

			rotation: 0,
			piece: piece 
			};
		}
		else
		{
			clearPiece(
				matrix[players[id].piece][players[id].rotation],
				players[id].x,
				players[id].y,
				opponentCells
			);
			players[id].piece = piece;
			players[id].x = 3;
			players[id].y = 0;
			players[id].rotation = 0;
		}
		const newMatrix = matrix[players[id].piece][players[id].rotation];
		displayPiece(newMatrix, players[id].x, players[id].y, 'blue', opponentCells);
		return ;
	}

	if (!players[id] || !players[id].piece) 
		return;

	const player = players[id];
	const currentMatrix = matrix[player.piece][player.rotation];

	if (key !== "newPiece") 
	{
		const currentMatrix = matrix[player.piece][player.rotation];
		clearPiece(currentMatrix, player.x, player.y, opponentCells);
	}
	if (key === 'w' && players[id].piece)
		players[id].rotation = (players[id].rotation + 1) % matrix[players[id].piece].length;
	if (key === '1')
	{
		while (canMoveTo(players[id].x, players[id].y + 1))
			players[id].y++;
	}
	if (key === 's')
	{
		if (canMoveTo(players[id].x, players[id].y + 1))
			players[id].y++;
	}
	if (key === 'a')
	{
		if (canMoveTo(players[id].x - 1, players[id].y))
			players[id].x--; 
	}
	if (key === 'd')
	{
		if (canMoveTo(players[id].x + 1, players[id].y))
			players[id].x++;
	}
	const newMatrix = matrix[player.piece][player.rotation];
	displayPiece(newMatrix, player.x, player.y, 'blue', opponentCells);
});

