function dropPiece()
{
	const pieceMatrix = matrix[piece][currentRotationIndex];
	const pieceHeight = pieceMatrix.length;
	const height = matrix[piece][currentRotationIndex].length;
	if (startY + pieceHeight >= 20)
		return ;
	clearPiece(matrix[piece][currentRotationIndex], startX, startY);
	startY++;
	displayPiece(matrix[piece][currentRotationIndex], startX, startY, 'red');
}