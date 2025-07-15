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

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// Création du serveur HTTP à partir d'Express
const httpServer = http.createServer(app);

// Configuration de Socket.IO avec CORS pour accepter toutes les origines
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// === Variables de jeu ===

// Contient les informations sur chaque joueur connecté
const players = {};

// File d'attente individuelle de pièces par joueur
const playerQueues = {};

// Indique si la partie a déjà démarré
let gameStarted = false;

// Sert les fichiers statiques dans le dossier /public (ex: index.html, script.js)
app.use(express.static("public"));

/**
 * generatePieceSequence - Génère une séquence de pièces aléatoires.
 *
 * Retourne un tableau contenant `count` pièces parmi 'I', 'O', 'T', 'J', 'L', 'S', 'Z'.
 *
 * @param count Nombre de pièces à générer
 * @return Tableau de lettres représentant les pièces
 */
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

// === Connexion d'un joueur ===
io.on("connection", (socket) => {
	console.log("✅ Un joueur s'est connecté :", socket.id);

	// Ajoute le joueur à la liste
	players[socket.id] = { id: socket.id };

	// Génère une séquence de pièces pour ce joueur
	playerQueues[socket.id] = generatePieceSequence(100);

	// Démarre la partie si au moins deux joueurs sont connectés
	if (!gameStarted && Object.keys(players).length >= 2) 
	{
		gameStarted = true;
		for (const playerId in players) 
		{
			const firstPiece = playerQueues[playerId].shift(); // Envoie la première pièce
			io.to(playerId).emit("startGame", { firstPiece }); // Message personnalisé par joueur
		}
	}

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

// Démarre le serveur HTTP
httpServer.listen(3000, () => 
{
	console.log("Serveur en écoute sur http://localhost:3000");
});
