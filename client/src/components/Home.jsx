import { useState } from 'react'
import { useNavigate } from "react-router";

function Home() {

	const [playerName, setPlayerName] = useState('')
	const [roomName, setRoomName] = useState('')
	const [error, setError] = useState('')
	let navigate = useNavigate();
	

	const handlePlay = () => {
		if (playerName === '' || roomName === '')
		{
			setError('Veuillez remplir tous les champs');
			return;
		}
		navigate(`/${roomName}/${playerName}`);
	}
	return (
		<div>
			<h1>Red tetris</h1>
			<input
				type="text"
				placeholder="Nom du joueur"
				value={playerName}
				onChange={(e) => setPlayerName(e.target.value)}
			/>
			<input
				type="text"
				placeholder="Room"
				value={roomName}
				onChange={(e) => setRoomName(e.target.value)}
			/>
			<button onClick={handlePlay}>Jouer</button>
			{error && <p>{error}</p>}
		</div>
	)
}

export default Home