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

// Instance game
const game = new Game();


/**
 * Gère la connexion d'un nouveau joueur, génère sa séquence de pièces
 * et démarre la partie si assez de joueurs sont connectés.
 */
function handleConnection(socket, game, io)
{
	game.players[socket.id] = { id: socket.id };

	game.playerQueues[socket.id] = game.generatePieceSequence(100);

	// changer la length pour le mode 2 joueurs
	if (!game.gameStarted && Object.keys(game.players).length >= 1) 
	{
		game.gameStarted = true;
		for (const playerId in game.players) 
		{
			const firstPiece = game.playerQueues[playerId].shift();
			io.to(playerId).emit("startGame", { firstPiece });
		}
	}
}

/**
 * Envoie la prochaine pièce au joueur et informe les autres joueurs.
 */
function handleNeedNewPiece(socket, game)
{
	const next = game.playerQueues[socket.id]?.shift();
		if (!next) 
			return;
	socket.emit("newPiece", { piece: next });
	socket.broadcast.emit("updateOtherPlayer", 
	{
		key: "newPiece",
		id: socket.id,
		piece: next
	});
}

/**
 * Relaie l'action d'un joueur à tous les autres joueurs connectés.
 */
function handlePlayerAction(socket, data)
{
	socket.broadcast.emit("updateOtherPlayer", data);
}

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

/* Connexion d'un joueur */
io.on("connection", (socket) => {
	
	handleConnection(socket, game, io)
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
