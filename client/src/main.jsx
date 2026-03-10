import { StrictMode } from 'react' // pour voir les erreurs
import { createRoot } from 'react-dom/client' // Met react dans le dom
import { BrowserRouter } from 'react-router-dom' // Permet la navigation entre les pages
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>
)