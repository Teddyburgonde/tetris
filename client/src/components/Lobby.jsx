import { useNavigate } from "react-router";
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import socket from '../socket'


// 1. Dans useEffect, émettre joinRoom au serveur avec room et playerName
// Quand le composant s'affiche, dire au serveur que le joueur rejoint la room


// 2. Écouter l'événement roomPlayers pour mettre à jour la liste des joueurs
// Quand le serveur envoie la liste des joueurs, mettre à jour l'affichage

// 3. Le bouton "Lancer la partie" doit être visible uniquement pour le host
// Seulement le premier joueur connecté peut voir le bouton "Lancer la partie"


function Lobby()
{
	const {room, playerName } = useParams();
	const [players, setPlayers] = useState([])
	const navigate = useNavigate()

	const handleStart = () => {
		socket.emit("startGame");
		navigate(`/${room}/${playerName}/game`);
	}

	useEffect(() => {
		socket.on('', (data) => {
			// joinRoom
			// roomPlayers
		})
		
		return () => {
			socket.off('')
		}
	}, [])


	return (
		<div>
			<h1>Room: {room}</h1>
			<h1>Joueur: {playerName}</h1>

			<h1>Joueurs connectés: </h1>
			<ul>
				{players.map((player) => (
					<li key={player}>{player}</li>
				))}
			</ul>

			<button onClick={handleStart}>Lancer la partie</button>
		</div>
	)
}

// handleStart

export default Lobby