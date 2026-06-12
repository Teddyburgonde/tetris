/**
 * Génère et retourne un tableau de cellules JSX pour la grille de jeu.
 */
function createGridCells(grid, piece, col, row, rotation, matrix, playerColor = 'blue')
{
	const cells = Array.from({length: grid[0].length * grid.length});
	const cellDivs = cells.map((_, i) => {
		// Converti le i pour avoir la position en x et y
		const x = i % grid[0].length
		const y = Math.floor(i / grid[0].length)
		let color = ''
		if (grid[y][x] === 1)
			color = playerColor
		if (grid[y][x] === 'P')
			color = 'gray'
		if (piece && matrix[piece] && matrix[piece][rotation])
		{
			const localY = y - row
			const localX = x - col
			const pieceShape = matrix[piece][rotation]
			if (localY >= 0 && localY < pieceShape.length && localX >= 0 && localX < pieceShape[0].length)
			{
				if (matrix[piece][rotation][y - row][x - col] === 1)
					color = playerColor
			}
		}

		return <div key={i} className="cell" style={{backgroundColor: color}}></div>
	})
	return cellDivs;
}

export { createGridCells }