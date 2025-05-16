const http = require("http");
const {Server} = require("socket.io");


const players = {};
let sequence = [];
let gameStarted = false;

// Creation du server Http
const httpServer = http.createServer();

// Creation d'une websocket
const io = new Server(httpServer, {
	cors: {
		origin: "*",
    methods: ["GET", "POST"]
	},
});

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

  // Démarrage si 2 joueurs sont prêts
  if (!gameStarted && Object.keys(players).length >= 2) {
    gameStarted = true;
    sequence = generatePieceSequence(100);

    const firstPiece = sequence.shift();
    io.emit("startGame", { 
      sequence,
      firstPiece
    });
  }

  socket.on("playerAction", ( data ) => {
  socket.broadcast.emit("updateOtherPlayer",  data );
});

  socket.on("needNewPiece", () => {
    const next = sequence.shift();
    console.log(`🎁 Envoi de la pièce "${next}" à ${socket.id}`);


    socket.emit("newPiece", { piece: next });

    socket.broadcast.emit("updateOtherPlayer", {
      key: "newPiece",
      id: socket.id,
      piece: next
    });
  });

  socket.on("disconnect", () => {
    console.log("A player disconnected:", socket.id);
    delete players[socket.id];
  });
});

httpServer.listen(3000, () => {
  console.log("The server is listening on http://localhost:3000");
});