import { useNavigate } from "react-router";
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import { emitJoinRoom, emitStartGame, onRoomPlayers, onGameStarted, offRoomPlayers, offGameStarted } from '../socketEvents'

function Lobby()
{
	const {room, playerName } = useParams();
	const [players, setPlayers] = useState([])
	const navigate = useNavigate()

	const handleStart = () => {
		emitStartGame();
	}

	useEffect(() => {

		// J'envoie un message au server "Un jouer a rejoint la room"
		emitJoinRoom(room, playerName);

		// J'ecoute ce que le server me dit "Voici la liste des joeurs"
		onRoomPlayers((data) => {
			setPlayers(data.map(p => p.name));
		});

		// Quand la partie démarre, on redirige tous les joueurs vers le jeu
		onGameStarted((data) => {
    		navigate(`/${room}/${playerName}/game`, { state: { hostId: data.hostId } })
		})

		return () => {
			offRoomPlayers()
			offGameStarted()
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
			{/* Si le premier jouer est le host on affiche le bouton */}
			{players[0] === playerName && <button onClick={handleStart}>Lancer la partie</button>}
		</div>
	)
}

export default Lobby