import { createGridCells } from '../utils/grid'
import { matrix } from '../pieces'
import {canRotate, canPieceMoveTo, findFullLines, getNewGrid, handleKeyPress, dropPiece, hasCollisionBelow} from '../utils'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import socket from '../socket'

function Game()
{
	const { room, playerName } = useParams();
	const [grid, setGrid] = useState(Array.from({ length: 20 }, () => Array(10).fill(0)))
	const [opponentGrid, setOpponentGrid] = useState(Array.from({ length: 20 }, () => Array(10).fill(0)))
	const [piece, setPiece] = useState(null)
	const [, forceUpdate] = useState(0)
	const [isFixed, setIsFixed] = useState(false)
	const [score, setScore] = useState(0)
	const [gameStarted, setGameStarted] = useState(false)
	const [players, setPlayers] = useState([])
	const [gameOver, setGameOver] = useState(false)
	const pieceRef = useRef(null)
	const rotationRef = useRef(0)
	const colRef = useRef(3)
	const rowRef = useRef(0)
	const gridRef = useRef(Array.from({ length: 20 }, () => Array(10).fill(0)))
	const opponentGridRef = useRef(Array.from({ length: 20 }, () => Array(10).fill(0)))

	const isHost = players[0] === playerName;

	useEffect(()=> {
    	socket.emit("joinRoom", { room, playerName })
		socket.emit("needNewPiece")

		const handleKey = (e) => {
			const result = handleKeyPress(e.key, pieceRef.current, rotationRef.current,
				colRef.current, rowRef.current, false, gridRef.current, matrix, 10, 20)
			if (result)
			{
				colRef.current = result.col
				rowRef.current = result.row
				rotationRef.current = result.rotationIndex
				forceUpdate(n => n + 1)
			}
		}
		window.addEventListener("keydown", handleKey)

		// Écouter les joueurs pour déterminer si on est host
		socket.on("roomPlayers", (data) => {
			setPlayers(data);
		});

		// Je reçois une piece
		socket.on("newPiece", (data) => {
			setPiece(data.piece)
			pieceRef.current = data.piece
			colRef.current = 3
			rowRef.current = 0
			rotationRef.current = 0
			if (canPieceMoveTo(data.piece, 0, 3, 0, gridRef.current, matrix, 10, 20) == false)
			{
				setGameOver(true)
				return
			}
			const loop = setInterval(() => {

				const result = dropPiece(pieceRef.current, rotationRef.current, colRef.current, rowRef.current, gridRef.current)
				if (result.action === 'DROP')
				{
					rowRef.current = result.row;
					forceUpdate(n => n + 1)
				}
				else if (result.action === 'LOCK')
				{
					clearInterval(loop)

					const newGrid = gridRef.current.map(r => [...r])
					// Récupère la forme de la pièce actuelle
					const pieceShape = matrix[pieceRef.current][rotationRef.current];

					for (let j = 0; j < pieceShape.length; j++)
					{
						for (let i = 0; i < pieceShape[j].length; i++)
						{
							if (pieceShape[j][i] === 1)
							{
								const row = rowRef.current + j
								const col = colRef.current + i
								if (row >= 0 && row < 20 && col >= 0 && col < 10)
									newGrid[row][col] = 1
							}
						}
					}

					// si la ligne est complete
					const fullLines = findFullLines(newGrid)
					if (fullLines.length > 0)
					{
						const clearedGrid = getNewGrid(newGrid, fullLines, 10)
						gridRef.current = clearedGrid;
						setGrid(clearedGrid)
					}
					else
					{
						gridRef.current = newGrid
						setGrid(newGrid)
					}
					socket.emit("needNewPiece")
				}
			}, 500)
		})

		// Mettre a jour la grille de l'adversaire
		socket.on("updateOtherPlayer", (data) => {

		})

		// je met a jour ma grille apres la penalité
		socket.on("receivePenalty", (data) => {

		})

		// Relancer la partie quand le host demande
		socket.on("gameRestarted", () => {
			gridRef.current = Array.from({ length: 20 }, () => Array(10).fill(0))
			setGrid(Array.from({ length: 20 }, () => Array(10).fill(0)))
			opponentGridRef.current = Array.from({ length: 20 }, () => Array(10).fill(0))
			setOpponentGrid(Array.from({ length: 20 }, () => Array(10).fill(0)))
			pieceRef.current = null
			setPiece(null)
			rotationRef.current = 0
			colRef.current = 3
			rowRef.current = 0
			setGameOver(false)
			socket.emit("needNewPiece")
		})

		return () => {
			window.removeEventListener("keydown", handleKey)
			socket.off("roomPlayers")
			socket.off("newPiece")
			socket.off("updateOtherPlayer")
			socket.off("receivePenalty")
			socket.off("gameRestarted")
		}
	}, [])


	function handleRestart() {
		if (!isHost)
			return;
		socket.emit("hostRequestsRestart")
	}

	return (
		<div id="container">
        	{gameOver && <div>
			<p>GAME OVER</p>
			    <button onClick={handleRestart}>Rejouer</button>
		</div>}
        	<div id="game-grid">
				{createGridCells(grid, piece, colRef.current, rowRef.current, rotationRef.current, matrix)}
			</div>
			<div id="game-grid2">
				{createGridCells(opponentGrid, null, 0, 0, 0, matrix)}
			</div>
		</div>
	)
}

export default Game