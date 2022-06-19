let boardEl = null
let board = [];

let isChecked = "none" 	// white | black | none
let turnColor = "white"	// white | black

const playerColor = "white";
const botColor = (playerColor == "white") ? "black" : "white";

const primColor = "orange";
const primHover = "#fbd287"

const killColor = "#f36969";
const checkColor = "blue"
const secunColor = "purple";

// pawn = 0
// rook = 1;
// knight = 2
// bishop = 3
// queen = 4
// king = 5
// empty = 6

// starting from the piece itself, what directions&amount can the pieces move
// const moveSets = [
// 	[
// 		// {x: 0, y: 1}
// 	],	//pawn
// 	[
// 		/* top */ 		{x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}, {x: 0, y: 4}, {x: 0, y: 5}, {x: 0, y: 6}, {x: 0, y: 7}, {x: 0, y: 8},
// 		/* bottom */ 	{x: 0, y: -8}, {x: 0, y: -7}, {x: 0, y: -6}, {x: 0, y: -5}, {x: 0, y: -4}, {x: 0, y: -3}, {x: 0, y: -2}, {x: 0, y: -1},
// 		/* left */		{x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0}, {x: 8, y: 0},
// 		/* right */		{x: -1, y: 0}, {x: -2, y: 0}, {x: -3, y: 0}, {x: -4, y: 0}, {x: -5, y: 0}, {x: -6, y: 0}, {x: -7, y: 0}, {x: -8, y: 0}
// 	],	// rook
// 	[
// 		/* top */ 		{x: 1, y: 2}, {x: -1, y: 2},
// 		/* bottom */ 	{x: 1, y: -2}, {x: -1, y: -2},
// 		/* left */		{x: 2, y: 1}, {x: 2, y: -1},
// 		/* right */		{x: -2, y: 1}, {x: -2, y: -1}
// 	],	// knight
// 	[
// 		{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}, {x: 4, y: 4}, {x: 5, y: 5}, {x: 6, y: 6}, {x: 7, y: 7}, {x: 8, y: 8},
// 		{x: -1, y: -1}, {x: -2, y: -2}, {x: -3, y: -3}, {x: -4, y: -4}, {x: -5, y: -5}, {x: -6, y: 6}, {x: -7, y: -7}, {x: -8, y: -8},
// 		{x: -1, y: 1}, {x: -2, y: 2}, {x: -3, y: 3}, {x: -4, y: 4}, {x: -5, y: 5}, {x: -6, y: 6}, {x: -7, y: 7}, {x: -8, y: 8},
// 		{x: 1, y: -1}, {x: 2, y: -2}, {x: 3, y: -3}, {x: 4, y: -4}, {x: 5, y: -5}, {x: 6, y: 6}, {x: 7, y: -7}, {x: 8, y: -8},
// 	],	// bishop
// 	[
// 		{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}, {x: 4, y: 4}, {x: 5, y: 5}, {x: 6, y: 6}, {x: 7, y: 7}, {x: 8, y: 8},
// 		{x: -1, y: -1}, {x: -2, y: -2}, {x: -3, y: -3}, {x: -4, y: -4}, {x: -5, y: -5}, {x: -6, y: 6}, {x: -7, y: -7}, {x: -8, y: -8},
// 		{x: -1, y: 1}, {x: -2, y: 2}, {x: -3, y: 3}, {x: -4, y: 4}, {x: -5, y: 5}, {x: -6, y: 6}, {x: -7, y: 7}, {x: -8, y: 8},
// 		{x: 1, y: -1}, {x: 2, y: -2}, {x: 3, y: -3}, {x: 4, y: -4}, {x: 5, y: -5}, {x: 6, y: 6}, {x: 7, y: -7}, {x: 8, y: -8},
// 		{x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}, {x: 0, y: 4}, {x: 0, y: 5}, {x: 0, y: 6}, {x: 0, y: 7}, {x: 0, y: 8},
// 		{x: 0, y: -1}, {x: 0, y: -2}, {x: 0, y: -3}, {x: 0, y: -4}, {x: 0, y: -5}, {x: 0, y: -6}, {x: 0, y: -7}, {x: 0, y: -8},
// 		{x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0}, {x: 8, y: 0},
// 		{x: -1, y: 0}, {x: -2, y: 0}, {x: -3, y: 0}, {x: -4, y: 0}, {x: -5, y: 0}, {x: -6, y: 0}, {x: -7, y: 0}, {x: -8, y: 0}
// 	],	// queen
// 	[
// 		{x: 1, y: -1}, {x: 0, y: -1}, {x: 1, y: 1},
// 		{x: 1, y: 0}, {x: -1, y: 0},
// 		{x: -1, y: -1}, {x: 0, y: 1}, {x: -1, y: -1}
// 	]	// king
// ]
const pieceWorth = [1, 5, 3, 3, 9, 0]

document.addEventListener('DOMContentLoaded', init)

function init(){
	boardEl = document.getElementById("board");

	createBoard();

	createInternalBoard();
}

function createInternalBoard(){
	for (let row = 0; row < 8; row++) {
		board.push([]);
		for (let col = 0; col < 8; col++) {
			board[row].push({});
		}
	}

	// WHITE
	createPiece("black", "rook", 0 ,0);
	createPiece("black", "knight", 0 ,1);
	createPiece("black", "bishop", 0 ,2);
	createPiece("black", "queen",0 ,3);
	createPiece("black", "king",0 ,4);
	createPiece("black", "bishop",0 ,5);
	createPiece("black", "knight",0 ,6);
	createPiece("black", "rook",0 ,7);

	for (let i = 2; i < 8; i++) {
		createPiece("black", "pawn",1 ,i);
	}

	// BLACK
	createPiece("white", "rook", 7 ,7);
	createPiece("white", "knight", 7 ,6);
	createPiece("white", "bishop", 7 ,5);
	createPiece("white", "queen",7 ,3);
	createPiece("white", "king",7 ,4);
	createPiece("white", "bishop",7 ,2);
	createPiece("white", "knight",7 ,1);
	createPiece("white", "rook",7 ,0);

	for (let i = 0; i < 7; i++) {
		createPiece("white", "pawn",6 ,i);
	}

	// TESTING REMOVE LATER
	createPiece("black", "pawn",5 ,6);
	createPiece("white", "pawn",2 ,4);
	createPiece("white", "pawn",4 ,3);
}
function createPiece(color, name, row, col){
	board[row][col] = {
		color: color,
		name: name,
		kill: k,
		row: row,
		col: col
	}

	let piece = document.createElementNS("http://www.w3.org/2000/svg", 'image');

	piece.setAttribute("class", "piece");

	piece.setAttribute("x", (col * 100) + 1);
	piece.setAttribute("y", (row * 100) + 1);

	piece.setAttribute("href", `img/${name}_${(color == "white") ? "w" : "b"}.svg`);

	// only add events if player is allowed to interact
	// if(color == playerColor){ TODO uncomment
		piece.addEventListener("click", a);
		piece.addEventListener("mouseover", h);
		piece.addEventListener("mouseout", r);
	// }

	boardEl.appendChild(piece);

	function k(){
		// TODO
		console.log("TODO");
	}
	function h(){
		highlightPiece(board[row][col], true);
		highlightMoves(board[row][col], true);
	}
	function a(){
		let moves = getMoveset(pieceNameToInt(name), row, col);
		console.log(moves);
	}
	function r(){
		highlightPiece(board[row][col], false);
		highlightMoves(board[row][col], false);
	}
}
function highlightPiece(piece, state){
	let el = document.getElementById(`${piece.row}-${piece.col}`);
	let style = "";

	if(state){
		style = `fill: ${primHover}`;
	}

	el.style = style;
}
function highlightMoves(piece, state){
	let pieceX = piece.col;
	let pieceY = piece.row;
	let moves = getMovesetFromName(piece);
	let style = "";
	for(let i = 0; i < moves.length; i++){
		subArray = moves[i];

		if(i == 0){	// locations
			if(state){
				style = `fill: ${primHover}`;
			}

			for (let i = 0; i < subArray.length; i++) {
				let el = document.getElementById(`${subArray[i].x}-${subArray[i].y}`);
		
				el.style = style;
			}
		}
		if(i == 1){	// kill moves
			if(state){
				style = `fill: ${killColor}`;
			}

			for (let i = 0; i < subArray.length; i++) {
				let el = document.getElementById(`${subArray[i].x}-${subArray[i].y}`);
		
				el.style = style;
			}
		}
		if(i == 2){	// special moves

		}
	}
}
function checkMoves(){

}
function getMoveset(i, x, y){
	let moves = [];
	let openPositions = [];
	let killMoves = [];
	let miniBoard = minifyBoard();
	let isWhite = miniBoard[x][y] < 9;

	// pawn specific checks
	if(i == 0){
		if(miniBoard[(isWhite) ? x - 1 : x + 1][y] == 6){
			openPositions.push({x: x + ((isWhite) ? -1 : 1), y: y})
		}		

		if(x == ((isWhite) ? 6 : 1)){
			if(miniBoard[(isWhite) ? x - 2 : x + 2][y] == 6 && miniBoard[(isWhite) ? x - 1 : x + 1][y] == 6){
				openPositions.push({x: x + ((isWhite) ? -2 : 2), y: y})
			}
		}

		// kills
		let checkY = y + ((isWhite) ? -1 : 1);
		let checkX = x + ((isWhite) ? -1 : 1);

		if(checkX > -1 && checkX < 8 && checkY > -1 && checkY < 8){
			if(miniBoard[checkX][checkY] != 6){
				killMoves.push({x: checkX, y: checkY})
			}
	
			checkY = y + ((isWhite) ? 1 : -1);

			if(checkY > -1 && checkY < 8){
				if(miniBoard[checkX][checkY] != 6){
					killMoves.push({x: checkX, y: checkY})
				}
			}
		}

		
		
		// https://sakkpalota.hu/index.php/en/chess/rules#pawn
		// todo: check for EN PASSANT

		// todo: check for promotion
	}

	// rook specific checks
	if(i == 1){
		// bottom
		for (let i2 = 1; i2 < 8; i2++) {
			if(checkPath(x + i2, y)){
				break;
			}
		}
		// left?
		for (let i2 = 1; i2 < 8; i2++) {
			if(checkPath(x, y + i2)){
				break;
			}
		}
		// right?
		for (let i2 = 1; i2 < 8; i2++) {
			if(checkPath(x - i2, y)){
				break;
			}
		}
		// top?
		for (let i2 = 1; i2 < 8; i2++) {
			if(checkPath(x, y - i2)){
				break;
			}
		}

		// TODO: check for castle
	}

	// knight
	if(i == 2){
		// move pattern
		let movePatern = [{x: 1, y: 2}, {x: -1, y: 2},{x: 1, y: -2}, {x: -1, y: -2},{x: 2, y: 1}, {x: 2, y: -1},{x: -2, y: 1}, {x: -2, y: -1}];

		for (let i2 = 0; i2 < movePatern.length; i2++) {
			checkPath(x + movePatern[i2].x, y + movePatern[i2].y)
		}
	}

	// bishop
	if(i == 3){
		// bottom
		for (let i2 = 1; i2 < 8; i2++) {
			if(checkPath(x + i2, y + i2)){
				break;
			}
		}
		// left?
		for (let i2 = 1; i2 < 8; i2++) {
			if(checkPath(x - i2, y - i2)){
				break;
			}
		}
		// right?
		for (let i2 = 1; i2 < 8; i2++) {
			if(checkPath(x - i2, y + i2)){
				break;
			}
		}
		// top?
		for (let i2 = 1; i2 < 8; i2++) {
			if(checkPath(x + i2, y - i2)){
				break;
			}
		}
	}

	// queen
	if(i == 4){

	}

	// king
	if(i == 4){

	}

	function checkPath(checkX, checkY){
		if(checkX < 0 || checkX > 7 || checkY < 0 || checkY > 7){
			return false;
		}

		if(miniBoard[checkX][checkY] == 6){
			openPositions.push({x: checkX, y: checkY})
		}else{
			if(isWhite){
				if(miniBoard[checkX][checkY] > 9){
					killMoves.push({x: checkX, y: checkY})
				}
			}else{
				if(miniBoard[checkX][checkY] < 10){
					killMoves.push({x: checkX, y: checkY})
				}
			}
			return true;
		}
	}

	moves.push(openPositions);
	moves.push(killMoves);

	return moves;
}
function getMovesetFromName(piece){
	return getMoveset(pieceNameToInt(piece.name), piece.row, piece.col);
}
function deepCopy(from, to){
	for (let i = 0; i < from.length; i++) {
		to.push(from[i]);
	}
}
function rotateMoveSet(moves){
	for (let i = 0; i < moves.length; i++) {
		if(moves[i].y > 0){
			moves[i].y = moves[i].y * -1;
		}
	}
}

function minifyBoard(){
	let r = [];

	for (let row = 0; row < 8; row++) {
		r.push([]);
	}

	for (let col = 0; col < 8; col++) {
		for (let row = 0; row < 8; row++) {
			let name = board[row][col].name
			let color = (board[row][col].color == "white");
	
			if(name != null){
				r[row].push(pieceNameToInt(name) + ((!color) ? 10 : 0));
			}else{
				r[row].push(6);
			}
		}
	}

	return r;
}
function pieceNameToInt(name){
	switch (name) {
		case "pawn":
			return 0;
		case "rook":
			return 1;
		case "knight":
			return 2;
		case "bishop":
			return 3;
		case "queen":
			return 4;
		case "king":
			return 5;
	}
}

function createBoard(){
	for (let col = 0; col < 8; col++) {
		for (let row = 0; row < 8; row++) {
			boardEl.appendChild(createRect(row, col));
		}
	}
}
function createRect(row, col){
	let square = document.createElementNS("http://www.w3.org/2000/svg", 'rect');

	square.setAttribute("class", "square");

	square.setAttribute("x", (row * 100) + 1);
	square.setAttribute("y", (col * 100) + 1);
	square.setAttribute("fill", ((col + row) % 2) ? "lightgrey" : "white");
	square.setAttribute("id", `${col}-${row}`);

	return square;
}
function movePiece(piece, to){

}