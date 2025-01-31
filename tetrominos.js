const cells = document.querySelectorAll('.cell')
const startX = 4; // X c'est les colonnes
const startY = 0; // Y c'est les lignes
const matrix = {
	
	'O': [
		[1,1],
		[1,1]
	]
};

for (let j = 0; j < 2; ++j)
{
	for(let i = 0; i < 2; ++i)
	{
		if (matrix['O'][j][i] === 1)
		{
			const cell = cells[(j + startY) * 10 + (i + startX)]
			cell.style.backgroundColor = 'red';
		}
	}
}









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