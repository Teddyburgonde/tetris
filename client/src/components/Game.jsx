import { createGridCells } from '../utils/grid'
import { matrix } from '../pieces'
import {canRotate, canPieceMoveTo, findFullLines, getNewGrid, handleKeyPress, dropPiece, hasCollisionBelow} from '../utils'
import { useEffect, useState, useRef } from 'react'
import socket from '../socket'

// startGame — mais on ne l'a pas encore ajouté au serveur

function Game()
{
	// useState permet de mettre ecran a jour des qu'on change la valeur de la variable.
	const [grid, setGrid] = useState(Array.from({ length: 20 }, () => Array(10).fill(0)))
	const [opponentGrid, setOpponentGrid] = useState(Array.from({ length: 20 }, () => Array(10).fill(0)))
	const [piece, setPiece] = useState(null)
	const [col, setCol] = useState(3)
	const [row, setRow] = useState(0)
	const [rotation, setRotation] = useState(0)
	const [isFixed, setIsFixed] = useState(false)
	const [score, setScore] = useState(0)
	const [gameStarted, setGameStarted] = useState(false)
	const pieceRef = useRef(null)
	const rotationRef = useRef(0)
	const colRef = useRef(3)
	const rowRef = useRef(0)
	const gridRef = useRef(Array.from({ length: 20 }, () => Array(10).fill(0)))

	useEffect(()=> {
		// Je demande une piece au server
		socket.emit("needNewPiece")

		const handleKey = (e) => {
			const result = handleKeyPress(e.key, pieceRef.current, rotationRef.current, 
				colRef.current, rowRef.current, false, gridRef.current, matrix, 10, 20)
			if (result)
			{
				colRef.current = result.col
				rowRef.current = result.row
				rotationRef.current = result.rotationIndex
				setCol(result.col)
				setRow(result.row)
				setRotation(result.rotationIndex)
			}
		}
		window.addEventListener("keydown", handleKey)

		// Je reçois une piece
		socket.on("newPiece", (data) => {
			setPiece(data.piece)
			pieceRef.current = data.piece
			colRef.current = 3
			rowRef.current = 0
			rotationRef.current = 0
			const loop = setInterval(() => {
		
				const result = dropPiece(pieceRef.current, rotationRef.current, colRef.current, rowRef.current, gridRef.current)
				if (result.action === 'DROP')
				{
					setRow(result.row)
					rowRef.current = result.row;
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
								newGrid[rowRef.current + j][colRef.current + i] = 1
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

		return () => {
			window.removeEventListener("keydown", handleKey)
			socket.off("newPiece")
			socket.off("updateOtherPlayer")
			socket.off("receivePenalty")
		}
	}, []) 

	return (
		<div id="container">
			<div id="game-grid">
				{createGridCells(grid, piece, col, row, rotation, matrix)}
			</div>

			<div id="game-grid2">
				{createGridCells(opponentGrid, null, 0, 0, 0, matrix)}
			</div>
		</div>
	)
}

export default Game