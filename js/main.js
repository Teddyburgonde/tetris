addCellulesInTheGrill();

const cells = document.querySelectorAll('.cell')
const startX = 3; // X c'est les colonnes
const startY = 1; // Y c'est les lignes


clearPiece(matrix['O'], startX, startY);
displayPiece(matrix['O'], startX, startY, 'red')