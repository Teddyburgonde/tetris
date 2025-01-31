const gameGrid = document.getElementById('game-grid');

// Créer 200 cellules (10 colonnes × 20 lignes)
// On cree une cellule et on lui ajoute une class.
// On ajoute cette celulle a gameGrid.
// A la fin les 200 cellules seront ajoutées a gameGrid.
for (let i = 0; i < 200; i++) 
{
    const cell = document.createElement('div');
    cell.classList.add('cell');
    gameGrid.appendChild(cell);
}