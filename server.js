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

// La liste des rooms
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


/**
 * Gère la déconnexion d'un joueur en supprimant ses données.
 */
function handleDisconnect(socket, roomName)
{
	if (!rooms[roomName])
		return;
	delete rooms[roomName].players[socket.id];
	delete rooms[roomName].playerQueues[socket.id];
	if (Object.keys(rooms[roomName].players).length === 0)
		delete rooms[roomName];
}

/**
 * Quand un joueur envoie une pénalité (ex: après avoir fait des lignes)
 * Une ligne est envoyée à l'adversaire pour rendre le jeu plus difficile.
 */
function handleSendPenalty(socket, roomName, nbLignes, io)
{
	const adversaires = Object.keys(rooms[roomName].players).filter(id => id !== socket.id);
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
	
	if (rooms[room].players[socket.id])
    	return;
	socket.roomName = room;
	rooms[room].players[socket.id] = {id : socket.id, name: playerName};
	socket.join(room);
	io.to(room).emit("roomPlayers", Object.values(rooms[room].players).map(p => p.name));
}


/**
 * Gère le démarrage de la partie en générant une séquence de pièces partagée,
 * en la distribuant à tous les joueurs de la room,
 * et en informant tous les joueurs que la partie commence.
 */
function handleStartGame(roomName, socket, io)
{
	rooms[roomName].hostId = socket.id;
    rooms[roomName].sharedSequence = rooms[roomName].generatePieceSequence(100);
    Object.keys(rooms[roomName].players).forEach(playerId => {
        rooms[roomName].playerQueues[playerId] = [...rooms[roomName].sharedSequence]
    })
	io.to(roomName).emit("gameStarted", { hostId: socket.id }) 
}


/**
 * Gère la demande de restart du host. Vérifie que c'est bien le host,
 * régénère la séquence de pièces, et informe tous les joueurs.
 */
function handleHostRequestsRestart(socket, roomName, io, playerName)
{
	if (rooms[roomName].hostId !== socket.id)
		return;

	socket.join(roomName);

	rooms[roomName].sharedSequence = rooms[roomName].generatePieceSequence(100);
	Object.keys(rooms[roomName].players).forEach(playerId => {
		rooms[roomName].playerQueues[playerId] = [...rooms[roomName].sharedSequence]
	});

	if (!rooms[roomName].players[socket.id])
		rooms[roomName].players[socket.id] = { id: socket.id, name: "Host" };
	rooms[roomName].playerQueues[socket.id] = [...rooms[roomName].sharedSequence];

	Object.values(rooms[roomName].players).forEach(player => {
    	player.lost = false;
	})
	io.to(roomName).emit("gameRestarted");
}

/**
 * Gère la défaite d'un joueur. Vérifie si un seul joueur reste.
 * Si oui, la partie se termine et le gagnant est annoncé.
 */
function handlePlayerLost(socket, roomName, io)
{
    rooms[roomName].players[socket.id].lost = true;

    const remainingPlayers = Object.values(rooms[roomName].players).filter(p => !p.lost).length;

    if (remainingPlayers === 1)
    {
        const winner = Object.values(rooms[roomName].players).find(p => !p.lost);
        io.to(roomName).emit("gameEnded", { winner: winner.name });
    }
}


/* Connexion d'un joueur */
io.on("connection", (socket) => {
	socket.on("startGame", () => handleStartGame(socket.roomName, socket, io));
	socket.on("playerLost", () => handlePlayerLost(socket, socket.roomName, io));
	socket.on("joinRoom", ({ room, playerName }) => handleJoinRoom(socket, room, playerName, io));
	socket.on("needNewPiece", () => handleNeedNewPiece(socket, socket.roomName));
	socket.on("playerAction", (data) => handlePlayerAction(socket, data, socket.roomName));
	socket.on("hostRequestsRestart", (data) => handleHostRequestsRestart(socket, socket.roomName, io, data.playerName));
	socket.on("disconnect", () => handleDisconnect(socket, socket.roomName));
	socket.on("sendPenalty", (nbLignes = 1) => handleSendPenalty(socket, socket.roomName, nbLignes, io));
});


/* Démarre le serveur HTTP */
httpServer.listen(3000, () => 
{
	console.log("Server listening on http://localhost:3000");
});
