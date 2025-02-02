addCellulesInTheGrill();

const cells = document.querySelectorAll('.cell')
const startX = 3; // Position départ, X c'est les colonnes
const startY = 1; // Position départ, Y c'est les lignes
let currentRotationIndex = 0;
// Affiche la pièce dès le début
displayPiece(matrix['I'][currentRotationIndex], startX, startY, 'red')
