import { useNavigate } from "react-router";
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import socket from '../socket'

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

export default Lobby