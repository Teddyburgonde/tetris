import { createGridCells } from '../utils/grid'
import { matrix } from '../pieces'
import {canRotate, canPieceMoveTo, findFullLines, getNewGrid, handleKeyPress, dropPiece, hasCollisionBelow, getSpectrum} from '../utils'
import { useEffect, useState, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
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
	const [opponentSpectrum, setOpponentSpectrum] = useState(null)
	const [myColor, setMyColor] = useState('blue')
	const [opponentColor, setOpponentColor] = useState('red')
	const pieceRef = useRef(null)
	const rotationRef = useRef(0)
	const colRef = useRef(3)
	const rowRef = useRef(0)
	const gridRef = useRef(Array.from({ length: 20 }, () => Array(10).fill(0)))
	const opponentGridRef = useRef(Array.from({ length: 20 }, () => Array(10).fill(0)))
	const [gameWinner, setGameWinner] = useState(null)
	const loopRef = useRef(null)

	const location = useLocation()
	const hostId = location.state?.hostId
	const isHost = socket.id === hostId

	const spectrumToGrid = (spectrum) => {
		if (!spectrum)
			return Array.from({ length: 20 }, () => Array(10).fill(0));

		const newGrid = Array.from({ length: 20 }, () => Array(10).fill(0));

		for (let col = 0; col < 10; col++) {
			const height = spectrum[col];
			for (let row = 19; row >= 20 - height; row--) {
				if (row >= 0 && row < 20) {
					newGrid[row][col] = 1;
				}
			}
		}
		return newGrid;
	};

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
			setPlayers(data.map(p => p.name));
			const myIndex = data.findIndex(p => p.id === socket.id);
			if (myIndex === 0)
			{
				setMyColor('blue');
				setOpponentColor('red');
			}
			else if (myIndex === 1)
			{
				setMyColor('red');
				setOpponentColor('blue');
			}
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
				socket.emit("playerLost")
				return
			}
			if (loopRef.current) clearInterval(loopRef.current)
			loopRef.current = setInterval(() => {

				const result = dropPiece(pieceRef.current, rotationRef.current, colRef.current, rowRef.current, gridRef.current)
				if (result.action === 'DROP')
				{
					rowRef.current = result.row;
					forceUpdate(n => n + 1)
				}
				else if (result.action === 'LOCK')
				{
					clearInterval(loopRef.current)

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

					if (fullLines.length > 1)
						socket.emit("sendPenalty", fullLines.length - 1)

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

					const mySpectrum = getSpectrum(gridRef.current);
					socket.emit("playerAction", {
						type: "spectrum",
						spectrum: mySpectrum
					});
					
					socket.emit("needNewPiece")
				}
			}, 500)
		})

		// Mettre a jour la grille de l'adversaire
		socket.on("updateOtherPlayer", (data) => {
			if (data.type === "spectrum") {
				setOpponentSpectrum(data.spectrum);
				const visualGrid = spectrumToGrid(data.spectrum);
				setOpponentGrid(visualGrid);
				opponentGridRef.current = visualGrid;
			}
		})

		// je met a jour ma grille apres la penalité
		socket.on("receivePenalty", (data) => {

		})

		// Relancer la partie quand le host demande
		socket.on("gameRestarted", () => {
			if (loopRef.current) 
				clearInterval(loopRef.current)
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
			setGameWinner(null)
			socket.emit("needNewPiece")
		})

		socket.on("gameEnded", (data) => {
			if (loopRef.current)
				clearInterval(loopRef.current)
			setGameWinner(data.winner)
		})

		return () => {
			window.removeEventListener("keydown", handleKey)
			socket.off("roomPlayers")
			socket.off("newPiece")
			socket.off("updateOtherPlayer")
			socket.off("receivePenalty")
			socket.off("gameRestarted")
			socket.off("gameEnded")
		}
	}, [])


	function handleRestart()
	{
		socket.emit("hostRequestsRestart", {playerName})
	}

	return (
		<div id="container">
			{gameOver && !gameWinner && <div>
	<p>GAME OVER</p>
	{isHost ? <button onClick={handleRestart}>Rejouer</button> : <p>En attente du host...</p>}
</div>}
{gameWinner && gameWinner === playerName && <div>
	<p>Tu as gagné !</p>
	{isHost ? <button onClick={handleRestart}>Rejouer</button> : <p>En attente du host...</p>}
</div>}
{gameWinner && gameWinner !== playerName && <div>
	<p>Partie terminée!</p>
	<p>Gagnant: {gameWinner}</p>
	{isHost ? <button onClick={handleRestart}>Rejouer</button> : <p>En attente du host...</p>}
</div>}
		<div id="game-grid">
    		{createGridCells(grid, piece, colRef.current, rowRef.current, rotationRef.current, matrix, myColor)}
		</div>
		<div id="game-grid2">
    		{createGridCells(opponentGrid, null, 0, 0, 0, matrix, opponentColor)}
		</div>
	</div>
	)
}

export default Game