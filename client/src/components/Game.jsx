import { createGridCells } from '../utils/grid'
import { matrix } from '../pieces'
import {canRotate, canPieceMoveTo, findFullLines, getNewGrid, handleKeyPress, dropPiece, hasCollisionBelow, getSpectrum, addPenaltyLines, getGhostRow} from '../utils'
import { useEffect, useState, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import socket from '../socket'
import { emitJoinRoom, emitNeedNewPiece, emitPlayerLost, emitSendPenalty, emitPlayerAction, emitHostRequestsRestart,
	onRoomPlayers, onNewPiece, onUpdateOtherPlayer, onReceivePenalty, onGameRestarted, onGameEnded,
	offRoomPlayers, offNewPiece, offUpdateOtherPlayer, offReceivePenalty, offGameRestarted, offGameEnded } from '../socketEvents'

function Game()
{
	const { room, playerName } = useParams();
	const [grid, setGrid] = useState(Array.from({ length: 20 }, () => Array(10).fill(0)))
	const [opponentGrid, setOpponentGrid] = useState(Array.from({ length: 20 }, () => Array(10).fill(0)))
	const [piece, setPiece] = useState(null)
	const [, forceUpdate] = useState(0)
	const [isFixed, setIsFixed] = useState(false)
	const [gameStarted, setGameStarted] = useState(false)
	const [players, setPlayers] = useState([])
	const [gameOver, setGameOver] = useState(false)
	const [opponentSpectrum, setOpponentSpectrum] = useState(null)
	const [myColor, setMyColor] = useState('blue')
	const [holdPiece, setHoldPiece] = useState(null)
	const holdPieceRef = useRef(null)
	const canHoldRef = useRef(true)
	const [opponentColor, setOpponentColor] = useState('red')
	const pieceRef = useRef(null)
	const rotationRef = useRef(0)
	const colRef = useRef(3)
	const rowRef = useRef(0)
	const gridRef = useRef(Array.from({ length: 20 }, () => Array(10).fill(0)))
	const opponentGridRef = useRef(Array.from({ length: 20 }, () => Array(10).fill(0)))
	const [gameWinner, setGameWinner] = useState(null)
	const loopRef = useRef(null)

	const [score, setScore] = useState(0);
	const scoreRef = useRef(0)
	const [enemyScore, setEnemyScore] = useState(0);
	const enemyScoreRef = useRef(0)

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
    	emitJoinRoom(room, playerName)
		emitNeedNewPiece()

		const handleKey = (e) => {
			if (e.key === 'c')
			{
				if (!canHoldRef.current)
					return

				if (holdPieceRef.current === null)
				{
					holdPieceRef.current = pieceRef.current
					setHoldPiece(pieceRef.current)
					pieceRef.current = null
					if (loopRef.current)
						clearInterval(loopRef.current)
					emitNeedNewPiece()
				}
				else
				{
					const temp = holdPieceRef.current
					holdPieceRef.current = pieceRef.current
					setHoldPiece(pieceRef.current)
					pieceRef.current = temp
					setPiece(temp)
					colRef.current = 3
					rowRef.current = 0
					rotationRef.current = 0
					forceUpdate(n => n + 1)
				}

				canHoldRef.current = false
				return
			}

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
		onRoomPlayers((data) => {
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
		onNewPiece((data) => {
			setPiece(data.piece)
			pieceRef.current = data.piece
			colRef.current = 3
			rowRef.current = 0
			rotationRef.current = 0
			canHoldRef.current = true
			if (canPieceMoveTo(data.piece, 0, 3, 0, gridRef.current, matrix, 10, 20) == false)
			{
				setGameOver(true)
				emitPlayerLost()
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
						emitSendPenalty(fullLines.length - 1)

					if (fullLines.length > 0)
					{
						// Increase score and send it to enemy to update
						scoreRef.current += fullLines.length; // score is the number of lines cleared
						setScore(scoreRef.current);
						emitPlayerAction({
							type: "score",
							score: scoreRef.current
						});

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
					emitPlayerAction({
						type: "spectrum",
						spectrum: mySpectrum
					});


					emitNeedNewPiece()
				}
			}, 500)
		})

		// Mettre a jour la grille de l'adversaire
		onUpdateOtherPlayer((data) => {
			if (data.type === "spectrum") {
				setOpponentSpectrum(data.spectrum);
				const visualGrid = spectrumToGrid(data.spectrum);
				setOpponentGrid(visualGrid);
				opponentGridRef.current = visualGrid;
			}
			else if (data.type === "score") { // mewen
				enemyScoreRef.current = data.score;
				setScore(enemyScoreRef.current);
			}
		})

		// je met a jour ma grille apres la penalité
		onReceivePenalty((nbLignes) => {
			const removedRows = gridRef.current.slice(0, nbLignes)
			const hasBlockInRemovedRows = removedRows.some(row => row.some(cell => cell !== 0))

			const newGrid = addPenaltyLines(gridRef.current, nbLignes, 10)

			const pieceFits = canPieceMoveTo(pieceRef.current, rotationRef.current, colRef.current, rowRef.current, newGrid, matrix, 10, 20)

			if (hasBlockInRemovedRows || !pieceFits)
			{
				setGameOver(true)
				emitPlayerLost()
				return
			}

			gridRef.current = newGrid
			setGrid(newGrid)
		})

		// Relancer la partie quand le host demande
		onGameRestarted(() => {
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
			holdPieceRef.current = null
			setHoldPiece(null)
			canHoldRef.current = true
			emitNeedNewPiece()
		})

		onGameEnded((data) => {
			if (loopRef.current)
				clearInterval(loopRef.current)
			setGameWinner(data.winner)
			if (data.winner !== playerName)
			{
				const sound = new Audio('/fahhh.mp3')
				sound.play()
			}
		})

		return () => {
			window.removeEventListener("keydown", handleKey)
			offRoomPlayers()
			offNewPiece()
			offUpdateOtherPlayer()
			offReceivePenalty()
			offGameRestarted()
			offGameEnded()
		}
	}, [])


	function handleRestart()
	{
		emitHostRequestsRestart(playerName)
	}

	let ghostRow = 0
	if (pieceRef.current)
		ghostRow = getGhostRow(pieceRef.current, rotationRef.current, colRef.current, rowRef.current, gridRef.current, matrix, 10, 20)

	let opponentName = 'Adversaire'
	const foundOpponent = players.find(p => p !== playerName)
	if (foundOpponent)
		opponentName = foundOpponent

	let restartContent = <p className="subtitle">En attente du host...</p>
	if (isHost)
		restartContent = <button className="btn btn-primary" onClick={handleRestart}>Rejouer</button>

	let resultContent = null
	if (gameOver && !gameWinner)
	{
		resultContent = (
			<>
				<p className="result-title">GAME OVER</p>
				{restartContent}
			</>
		)
	}
	else if (gameWinner && gameWinner === playerName)
	{
		resultContent = (
			<>
				<p className="result-title">Tu as gagné !</p>
				{restartContent}
			</>
		)
	}
	else if (gameWinner && gameWinner !== playerName)
	{
		resultContent = (
			<>
				<p className="result-title">Partie terminée !</p>
				<p className="result-subtitle">Gagnant : {gameWinner}</p>
				{restartContent}
			</>
		)
	}

	return (
		<div className="page">
			<div className="game-container">
				<div className="side-panel">
					<h2 className="section-title">Hold</h2>
					<div id="hold-grid">
						{createGridCells(Array.from({ length: 4 }, () => Array(4).fill(0)), holdPiece, 0, 0, 0, matrix, myColor)}
					</div>
					<p className="score-text">Score : {scoreRef.current}</p>
				</div>

				<div className="board-panel">
					<h2 className="section-title">{playerName}</h2>
					<div id="game-grid">
						{createGridCells(grid, piece, colRef.current, rowRef.current, rotationRef.current, matrix, myColor, ghostRow)}
					</div>
				</div>

				<div className="side-panel">
					<h2 className="section-title">{opponentName}</h2>
					<div id="game-grid2">
						{createGridCells(opponentGrid, null, 0, 0, 0, matrix, opponentColor)}
					</div>
					<p className="score-text">Score : {enemyScoreRef.current}</p>
				</div>
			</div>

			{resultContent &&
				<div className="overlay">
					<div className="card">
						{resultContent}
					</div>
				</div>
			}
		</div>
	)
}

export default Game
