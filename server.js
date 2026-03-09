/**
 * === Serveur Multijoueur Tetris avec Socket.IO ===
 *
 * Ce serveur gère un jeu de Tetris multijoueur en temps réel via WebSockets.
 *
 * Fonctionnalités :
 * - Sert les fichiers frontend (HTML/CSS/JS) depuis /public
 * - Gère la connexion des joueurs
 * - Envoie une séquence de pièces à chaque joueur
 * - Démarre la partie dès que 2 joueurs sont connectés
 * - Transmet les actions des joueurs à leurs adversaires
 * - Gère les pénalités (envoi de lignes) entre adversaires
 */


/* import */
app.use(express.static("public"));
const Game = require('./game');


/* Configuration du serveur HTTP et Socket.IO */
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

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

	if (!game.gameStarted && Object.keys(game.players).length >= 2) 
	{
		game.gameStarted = true;
		for (const playerId in game.players) 
		{
			const firstPiece = game.playerQueues[playerId].shift();
			io.to(playerId).emit("startGame", { firstPiece });
		}
	}
}



// function handleConnection(socket, game, io) ✅
// function handleNeedNewPiece(socket, game) ❌
// function handlePlayerAction(socket, data) ❌
// function handleDisconnect(socket, game) ❌
// function handleSendPenalty(socket, game, nbLignes) ❌




// === Connexion d'un joueur ===
io.on("connection", (socket) => {
	
	handleConnection(socket, game, io)



	/**
	 * Quand un joueur demande une nouvelle pièce
	 */
	socket.on("needNewPiece", () => {
		const next = playerQueues[socket.id]?.shift();
		if (!next) return;

		// Envoie la pièce au joueur
		socket.emit("newPiece", { piece: next });

		// Informe les autres joueurs de cette nouvelle pièce (pour affichage synchro)
		socket.broadcast.emit("updateOtherPlayer", 
		{
			key: "newPiece",
			id: socket.id,
			piece: next
		});
  	});

	/**
	 * Quand un joueur effectue une action (rotation, déplacement, fixation)
	 * On la relaie aux autres pour qu'ils mettent à jour l'affichage adverse.
	 */
	socket.on("playerAction", (data) => 
	{
		socket.broadcast.emit("updateOtherPlayer", data);
  	});

	/**
	 * Quand un joueur se déconnecte
	 */
	socket.on("disconnect", () => 
	{
		console.log("❌ Joueur déconnecté :", socket.id);
		delete players[socket.id];
		delete playerQueues[socket.id];
  	});

	/**
	 * Quand un joueur envoie une pénalité (ex: après avoir fait des lignes)
	 * Une ligne est envoyée à l'adversaire pour rendre le jeu plus difficile.
	 */
	socket.on("sendPenalty", (nbLignes = 1) => 
	{
		// Trouve un autre joueur connecté
		const adversaires = Object.keys(players).filter(id => id !== socket.id);
		if (adversaires.length === 0) return;

		const targetId = adversaires[0];

		// Envoie le message à l'adversaire
		io.to(targetId).emit("receivePenalty", nbLignes);
	});
});








/* Démarre le serveur HTTP */
httpServer.listen(3000, () => 
{
	console.log("Server listening on http://localhost:3000");
});
