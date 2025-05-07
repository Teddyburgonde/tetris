addCellulesInTheGrill();

let piece = 'L'
const cells = document.querySelectorAll('.cell')
const startX = 3; // Position départ, X c'est les colonnes
let startY = 1; // Position départ, Y c'est les lignes
let currentRotationIndex = 0;
// Affiche la pièce dès le début
displayPiece(matrix[piece][currentRotationIndex], startX, startY, 'red')
setInterval(dropPiece, 500);
