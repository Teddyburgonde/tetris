// Les routes se défini ici dans App.jsx
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Lobby from './components/Lobby'

function App() {

	return (
		<Routes>
			<Route path='/' element={<Home/>}/>
			<Route path="/:room/:playerName" element={<Lobby/>}/>
		</Routes>
	)
}

export default App
