import { createGridCells } from '../utils/grid'
function Game()
{
	return (
		<div id="container">
			<div id="game-grid">
				{createGridCells(10, 20)}
			</div>

			<div id="game-grid2">
				{createGridCells(10, 20)}
			</div>
		</div>
	)
}

export default Game


// Game
// ┌─────────────────────────────────────────────┐
// │  MA GRILLE          ADVERSAIRE    SPECTRUM  │
// │  ┌──────────┐      ┌──────────┐  ┌──────┐  │
// │  │          │      │          │  │  ||  │  │
// │  │    []    │      │   [  ]   │  │  ||  │  │
// │  │   [][]   │      │          │  │ |||  │  │
// │  │__________│      │__________│  └──────┘  │
// └─────────────────────────────────────────────┘