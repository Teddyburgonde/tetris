let score = 0;
function updateScore(points) 
{
	score += points;
	document.getElementById("score").textContent = `Score : ${score}`;
}

addCellulesInTheGrill();

let piece = 'O'
let isFixed = false;
const cells = document.querySelectorAll('.cell')
let startX = 3; // Position départ, X c'est les colonnes
let startY = 1; // Position départ, Y c'est les lignes
let currentRotationIndex = 0;
let grid = Array.from({ length: 20 }, () => Array(10).fill(0));
// Affiche la pièce dès le début
displayPiece(matrix[piece][currentRotationIndex], startX, startY, 'red')
setInterval(dropPiece, 500);
