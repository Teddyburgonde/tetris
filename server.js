const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

const players = {};
const playerQueues = {};
let gameStarted = false;

// Sert les fichiers statiques dans /public
app.use(express.static("public"));

function generatePieceSequence(count) 
{
	const pieces = ['I', 'O', 'T', 'J', 'L', 'S', 'Z'];
	const sequence = [];
	for (let i = 0; i < count; i++) 
	{
		const piece = pieces[Math.floor(Math.random() * pieces.length)];
		sequence.push(piece);
	}
	return sequence;
}

io.on("connection", (socket) => {
		console.log("A player is connected:", socket.id);
		players[socket.id] = { id: socket.id };

		// Création d'une séquence pour ce joueur
		playerQueues[socket.id] = generatePieceSequence(100);

		// Démarrage global si deux joueurs sont connectés
		if (!gameStarted && Object.keys(players).length >= 2) 
		{
			gameStarted = true;
			for (const playerId in players) 
			{
				const firstPiece = playerQueues[playerId].shift();
				io.to(playerId).emit("startGame", { firstPiece });
			}
		}

		// Quand un joueur demande une nouvelle pièce
		socket.on("needNewPiece", () => {
		const next = playerQueues[socket.id]?.shift();
		if (!next) 
			return;
		socket.emit("newPiece", { piece: next });
		socket.broadcast.emit("updateOtherPlayer", 
		{
			key: "newPiece",
			id: socket.id,
			piece: next
		});
  	});

	// Actions clavier envoyées aux autres joueurs
	socket.on("playerAction", (data) => 
	{
		socket.broadcast.emit("updateOtherPlayer", data);
  	});

	socket.on("disconnect", () => 
	{
		delete players[socket.id];
		delete playerQueues[socket.id];
  	});

	socket.on("sendPenalty", (nbLignes = 1) => 
	{
		const adversaires = Object.keys(players).filter(id => id !== socket.id);
		if (adversaires.length === 0) 
			return;
		const targetId = adversaires[0];
		io.to(targetId).emit("receivePenalty", nbLignes);
	});
});

httpServer.listen(3000, () => 
{
	console.log("The server is listening on http://localhost:3000");
});