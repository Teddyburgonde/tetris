const gameGrid = document.getElementById('game-grid');

// Créer 200 cellules (10 colonnes × 20 lignes)
for (let i = 0; i < 200; i++) 
{
    const cell = document.createElement('div');
    cell.classList.add('cell');
    gameGrid.appendChild(cell);
}