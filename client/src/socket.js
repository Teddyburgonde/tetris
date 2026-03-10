// Ce fichier permet au naviagateur de communiquer avec le server

import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

export default socket