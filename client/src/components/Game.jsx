import { createGridCells } from '../utils/grid'
import {canRotate, canPieceMoveTo, findFullLines, getNewGrid, handleKeyPress} from '../utils'
import { useEffect, useState } from 'react'
import socket from '../socket'


// roomPlayers
// newPiece
// updateOtherPlayer
// receivePenalty
// startGame — mais on ne l'a pas encore ajouté au serveur



// La page Game s'affiche → tu demandes une pièce au serveur (socket.emit("needNewPiece"))
// Le serveur répond avec une pièce → tu la reçois (socket.on("newPiece", ...)) et tu mets à jour piece
// La pièce tombe automatiquement avec setInterval
// Le joueur appuie sur une touche → tu calcules la nouvelle position avec handleKeyPress
// La pièce touche le bas → elle se fixe, tu demandes une nouvelle pièce (socket.emit("needNewPiece"))
// Retour à l'étape 2

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

	useEffect(()=> {
		// Je demande une piece au server
		socket.emit("needNewPiece")

		// Je reçois une piece
		socket.on("newPiece", (data) => {
			setPiece(data.piece)
		})
		
		// Mettre a jour la grille de l'adversaire
		socket.on("updateOtherPlayer", (data) => {
			
		})

		// je met a jour ma grille apres la penalité
		socket.on("receivePenalty", (data) => {

		})

		return () => {
			socket.off("")
		}
	}, []) 

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

useEffect(() => {
		
		// J'envoie un message au server "Un jouer a rejoint la room"
		socket.emit("joinRoom", ({room, playerName}));

		// J'ecoute ce que le server me dit "Voici la liste des joeurs"
		socket.on("roomPlayers", (data) => {
			setPlayers(data);
		});
		
		return () => {
			socket.off("roomPlayers")
		}
	}, [])