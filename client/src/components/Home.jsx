import { useState } from 'react'
import { useNavigate } from "react-router";

function Home() {

	const [playerName, setPlayerName] = useState('')
	const [roomName, setRoomName] = useState('')
	const [error, setError] = useState('')
	const [mode, setMode] = useState(null)
	let navigate = useNavigate();


	const generateRoomName = () => {
		return Math.random().toString(36).substring(2, 8)
	}

	const handleSolo = () => {
		if (playerName === '')
		{
			setError('Veuillez entrer un nom de joueur');
			return;
		}
		navigate(`/${generateRoomName()}/${playerName}`);
	}

	const handleMulti = () => {
		if (playerName === '' || roomName === '')
		{
			setError('Veuillez remplir tous les champs');
			return;
		}
		navigate(`/${roomName}/${playerName}`);
	}

	let secondButton = <button onClick={() => setMode('multi')}>Multi</button>
	if (mode === 'multi')
		secondButton = <button onClick={handleMulti}>Jouer</button>

	return (
		<div>
			<h1>Red tetris</h1>
			<input
				type="text"
				placeholder="Nom du joueur"
				value={playerName}
				onChange={(e) => setPlayerName(e.target.value)}
			/>
			{mode === 'multi' &&
				<input
					type="text"
					placeholder="Room"
					value={roomName}
					onChange={(e) => setRoomName(e.target.value)}
				/>
			}
			<div>
				<button onClick={handleSolo}>Jeu Solo</button>
				{secondButton}
			</div>
			{error && <p>{error}</p>}
		</div>
	)
}

export default Home
