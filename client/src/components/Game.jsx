import { createGridCells } from '../utils/grid'
function Game()
{
	return (
		<div id="game-grid">
			{createGridCells(10, 20)}
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