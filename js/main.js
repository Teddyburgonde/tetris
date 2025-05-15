// let score = 0;

// function updateScore(points) 
// {
// 	score += points;
// 	document.getElementById("score").textContent = `Score : ${score}`;
// }

// addCellulesInTheGrill();

// let piece = 'O'
// let isFixed = false;
// const cells = document.querySelectorAll('.cell')
// let startX = 3; // Position départ, X c'est les colonnes
// let startY = 1; // Position départ, Y c'est les lignes
// let currentRotationIndex = 0;
// let grid = Array.from({ length: 20 }, () => Array(10).fill(0));
// // Affiche la pièce dès le début
// displayPiece(matrix[piece][currentRotationIndex], startX, startY, 'red')
// setInterval(dropPiece, 500);


const socket = io("http://localhost:3000");

let score = 0;
let listOfPiece = [];
let isFixed = false;
let piece;
let gameStarted = false;
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

  displayPiece(matrix[piece][currentRotationIndex], startX, startY, 'red');
  gameLoop = setInterval(dropPiece, 500);
});