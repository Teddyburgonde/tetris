const http = require("http");
const {Server} = require("socket.io");

// Creation du server Http
const httpServer = http.createServer();

// Creation d'une websocket
const io = new Server(httpServer, {
	cors: {
		origin: "*",
	},
});

io.on("connection", (socket) => {
	console.log("A player is connected: ", socket.id);

	socket.on("disconnect", () => {
		console.log("A player disconnected: ", socket.id);
	});
});

httpServer.listen(3000, () => {
	console.log("The listening server on http://locahost:3000");
});
