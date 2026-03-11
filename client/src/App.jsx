// Les routes se défini ici dans App.jsx
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Lobby from './components/Lobby'
import Game from './components/Game'

function App() {

	return (
		<Routes>
			<Route path='/' element={<Home/>}/>
			<Route path="/:room/:playerName" element={<Lobby/>}/>
			<Route path="/:room/:playerName/game" element={<Game/>}/>
		</Routes>
	)
}

export default App
