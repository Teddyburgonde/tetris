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

	let secondButton = <button className="btn btn-secondary" onClick={() => setMode('multi')}>Multi</button>
	if (mode === 'multi')
		secondButton = <button className="btn btn-secondary" onClick={handleMulti}>Jouer</button>

	return (
		<div className="page">
			<div className="card">
				<h1 className="title">Red Tetris</h1>
				<input
					className="input"
					type="text"
					placeholder="Nom du joueur"
					value={playerName}
					onChange={(e) => setPlayerName(e.target.value)}
				/>
				{mode === 'multi' &&
					<input
						className="input"
						type="text"
						placeholder="Room"
						value={roomName}
						onChange={(e) => setRoomName(e.target.value)}
					/>
				}
				<div className="button-row">
					<button className="btn btn-primary" onClick={handleSolo}>Jeu Solo</button>
					{secondButton}
				</div>
				{error && <p className="error">{error}</p>}
			</div>
		</div>
	)
}

export default Home
