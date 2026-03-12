/**
 * Génère et retourne un tableau de cellules JSX pour la grille de jeu.
 */
function createGridCells(gridWidth, gridHeight)
{
	const cells = Array.from({length: gridWidth * gridHeight});

	const cellDivs = cells.map((_, i) => <div key={i} className="cell"></div>);
	return cellDivs;
}

export { createGridCells }