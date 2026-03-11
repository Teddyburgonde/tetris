/* import */
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const Game = require('./game');


/* Configuration du serveur HTTP et Socket.IO */
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Acces pour les fichiers dans le dossier public
app.use(express.static("public"));

const rooms = {};


/**
 * Envoie la prochaine pièce au joueur et informe les autres joueurs.
 */
function handleNeedNewPiece(socket, roomName)
{
	const next = rooms[roomName].playerQueues[socket.id]?.shift();
	if (!next)
		return;
	socket.emit("newPiece", { piece: next });
	socket.to(roomName).emit("updateOtherPlayer", 
	{
		key: "newPiece",
		id: socket.id,
		piece: next
	});
}



/**
 * Relaie l'action d'un joueur à tous les autres joueurs connectés.
 */
function handlePlayerAction(socket, data, roomName)
{
	socket.to(roomName).emit("updateOtherPlayer", data);
}

// JE SUIS ICI 
/**
 * Gère la déconnexion d'un joueur en supprimant ses données.
 */
function handleDisconnect(socket, game)
{
	delete game.players[socket.id];
	delete game.playerQueues[socket.id];
}

/**
 * Quand un joueur envoie une pénalité (ex: après avoir fait des lignes)
 * Une ligne est envoyée à l'adversaire pour rendre le jeu plus difficile.
 */
function handleSendPenalty(socket, game, nbLignes, io)
{
	const adversaires = Object.keys(game.players).filter(id => id !== socket.id);
	if (adversaires.length === 0)
		return;

	const targetId = adversaires[0];
	io.to(targetId).emit("receivePenalty", nbLignes);
}


/**
 * Gère l'arrivée d'un joueur dans une room et informe tous les joueurs connectés.
 */
function handleJoinRoom(socket, room, playerName, io)
{
	if (!rooms[room])
		rooms[room] = new Game();
	rooms[room].players[socket.id] = {id : socket.id, name: playerName};
	rooms[room].playerQueues[socket.id] = rooms[room].generatePieceSequence(100);
	socket.join(room);
	io.to(room).emit("roomPlayers", Object.values(rooms[room].players).map(p => p.name));
}


/* Connexion d'un joueur */
io.on("connection", (socket) => {

	socket.on("joinRoom", ({ room, playerName }) => handleJoinRoom(socket, room, playerName, io));
	socket.on("needNewPiece", () => handleNeedNewPiece(socket, game));
	socket.on("playerAction", (data) => handlePlayerAction(socket, data));
	socket.on("disconnect", () => handleDisconnect(socket, game));
	socket.on("sendPenalty", (nbLignes = 1) => handleSendPenalty(socket, game, nbLignes, io));
});





/* Démarre le serveur HTTP */
httpServer.listen(3000, () => 
{
	console.log("Server listening on http://localhost:3000");
});
