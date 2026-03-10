// Les routes se défini ici dans App.jsx
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'

function App() {

	return (
		<Routes>
			<Route path='/' element={<Home/>} />
			<Route path="/:room/:playerName" element={<div>Jeu</div>} />
		</Routes>
	)
}

export default App
