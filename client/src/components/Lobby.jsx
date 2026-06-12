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
		<div className="page">
			<div className="card">
				<h1 className="title">Room: {room}</h1>
				<p className="subtitle">Joueur: {playerName}</p>

				<h2 className="section-title">Joueurs connectés</h2>
				<ul className="player-list">
					{players.map((player) => (
						<li className="player-item" key={player}>{player}</li>
					))}
				</ul>
				{/* Si le premier jouer est le host on affiche le bouton */}
				{players[0] === playerName &&
					<button className="btn btn-primary" onClick={handleStart}>Lancer la partie</button>
				}
			</div>
		</div>
	)
}

export default Lobby
