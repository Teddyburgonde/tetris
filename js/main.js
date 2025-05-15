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
const cells = document.querySelectorAll('.cell');
let grid = Array.from({ length: 20 }, () => Array(10).fill(0));

function updateScore(points) {
	score += points;
	document.getElementById("score").textContent = `Score : ${score}`;
}

// Réception de la séquence et démarrage
socket.on("startGame", (gameData) => {

	gameStarted = true;
	listOfPiece = gameData.sequence;

	piece = listOfPiece.shift();
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

	displayPiece(matrix[piece][currentRotationIndex], startX, startY, 'red');
	gameLoop = setInterval(dropPiece, 500);
});

// initialisation et sauvegarde les datas de l'adversaires
socket.on("updateOtherPlayer", ({ key, id }) => {
	if (!players[id]) 
	{
		console.log(`Nouvel adversaire connecté : ${id}`);
		players[id] = {

		grid: Array.from({ length: 20 }, () => Array(10).fill(0)),

		piece: null,

		x: 3,

		y: 0,

		rotation: 0
		};
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
});

