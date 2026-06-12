class Game 
{
	constructor()
	{
		this.players = {};
		this.playerQueues = {};
		this.gameStarted = false;
		this.hostId = null;
	}

	/* Génère une séquence de pièces aléatoires. */
	generatePieceSequence(count) 
	{
		const pieces = ['I', 'O', 'T', 'J', 'L', 'S', 'Z', 'X'];
		const sequence = [];
		for (let i = 0; i < count; i++) 
			sequence.push(pieces[Math.floor(Math.random() * pieces.length)]);
		return sequence;
	}
}

module.exports = Game;
