import socket from './socket'

// --- Emit (client -> serveur) ---

export function emitJoinRoom(room, playerName)
{
	socket.emit("joinRoom", { room, playerName })
}

export function emitStartGame()
{
	socket.emit("startGame")
}

export function emitNeedNewPiece()
{
	socket.emit("needNewPiece")
}

export function emitPlayerLost()
{
	socket.emit("playerLost")
}

export function emitSendPenalty(nbLines)
{
	socket.emit("sendPenalty", nbLines)
}

export function emitPlayerAction(data)
{
	socket.emit("playerAction", data)
}

export function emitHostRequestsRestart(playerName)
{
	socket.emit("hostRequestsRestart", { playerName })
}


// --- On (serveur -> client) ---

export function onRoomPlayers(callback)
{
	socket.on("roomPlayers", callback)
}

export function onGameStarted(callback)
{
	socket.on("gameStarted", callback)
}

export function onNewPiece(callback)
{
	socket.on("newPiece", callback)
}

export function onUpdateOtherPlayer(callback)
{
	socket.on("updateOtherPlayer", callback)
}

export function onReceivePenalty(callback)
{
	socket.on("receivePenalty", callback)
}

export function onGameRestarted(callback)
{
	socket.on("gameRestarted", callback)
}

export function onGameEnded(callback)
{
	socket.on("gameEnded", callback)
}


// --- Off (cleanup) ---

export function offRoomPlayers()
{
	socket.off("roomPlayers")
}

export function offGameStarted()
{
	socket.off("gameStarted")
}

export function offNewPiece()
{
	socket.off("newPiece")
}

export function offUpdateOtherPlayer()
{
	socket.off("updateOtherPlayer")
}

export function offReceivePenalty()
{
	socket.off("receivePenalty")
}

export function offGameRestarted()
{
	socket.off("gameRestarted")
}

export function offGameEnded()
{
	socket.off("gameEnded")
}
