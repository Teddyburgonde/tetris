/**
 * Génère et retourne un tableau de cellules JSX pour la grille de jeu.
 */
function createGridCells(grid, piece, col, row, rotation, matrix, playerColor = 'blue', ghostRow = 0)
{
	const cells = Array.from({length: grid[0].length * grid.length});
	const cellDivs = cells.map((_, i) => {
		// Converti le i pour avoir la position en x et y
		const x = i % grid[0].length
		const y = Math.floor(i / grid[0].length)
		let color = ''
		const style = {}
		if (grid[y][x] === 1)
			color = playerColor
		if (grid[y][x] === 'P')
			color = 'gray'
		if (piece && matrix[piece] && matrix[piece][rotation])
		{
			const pieceShape = matrix[piece][rotation]

			// Ghost : contour de la pièce à sa position d'atterrissage
			const ghostY = y - ghostRow
			const ghostX = x - col
			if (ghostY >= 0 && ghostY < pieceShape.length && ghostX >= 0 && ghostX < pieceShape[0].length)
			{
				if (pieceShape[ghostY][ghostX] === 1 && color === '')
					style.border = `2px solid ${playerColor}`
			}

			// Pièce active
			const localY = y - row
			const localX = x - col
			if (localY >= 0 && localY < pieceShape.length && localX >= 0 && localX < pieceShape[0].length)
			{
				if (pieceShape[localY][localX] === 1)
					color = playerColor
			}
		}

		style.backgroundColor = color

		return <div key={i} className="cell" style={style}></div>
	})
	return cellDivs;
}

export { createGridCells }