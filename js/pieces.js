const matrix = 
{
	
	'O': [
		[1,1],
		[1,1]
	],
	'I': {
		horizontal: [
			[1,1,1,1]
		],
		vertical: [
		[1],
		[1],
		[1],
		[1]
		],
	}
};


// clearPiece(matrix['O'], startX, startY);
// displayPiece(matrix['O'], startX, startY, 'red')

// // '0'
// function display_O()
// {
// 	for (let j = 0; j < 4; ++j)
// 	{
// 		for(let i = 0; i < 4; ++i)
// 		{
// 			if (matrix['O'][j][i] === 1)
// 			{
// 				const cell = cells[(j + startY) * 10 + (i + startX)]
// 				cell.style.backgroundColor = 'red';
// 			}
// 		}
// 	}
// }


	// const pieceMatrix = matrix['I'][currentOrientation];
	// for (let j = 0; j < pieceMatrix.length; ++j)
	// {
	// 	for(let i = 0; i < pieceMatrix[j].length; ++i)
	// 	{
	// 		if (pieceMatrix[j][i] === 1)
	// 		{
	// 			const cell = cells[(j + startY) * 10 + (i + startX)]
	// 			cell.style.backgroundColor = 'red';
	// 		}
	// 	}
	// }









// const tetrominos = {
// 	'I': [
// 	  [0,0,0,0],
// 	  [1,1,1,1],
// 	  [0,0,0,0],
// 	  [0,0,0,0]
// 	],
// 	'J': [
// 	  [1,0,0],
// 	  [1,1,1],
// 	  [0,0,0],
// 	],
// 	'L': [
// 	  [0,0,1],
// 	  [1,1,1],
// 	  [0,0,0],
// 	],
// 	'O': [
// 	  [1,1],
// 	  [1,1],
// 	],
// 	'S': [
// 	  [0,1,1],
// 	  [1,1,0],
// 	  [0,0,0],
// 	],
// 	'Z': [
// 	  [1,1,0],
// 	  [0,1,1],
// 	  [0,0,0],
// 	],
// 	'T': [
// 	  [0,1,0],
// 	  [1,1,1],
// 	  [0,0,0],
// 	]
//   };