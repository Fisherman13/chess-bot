const pieceOrder = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];

function createUIBoard(){
	let boardEl = document.getElementById("board");

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
function createInternalBoard(){
	for (let row = 0; row < 8; row++) {
		UIboard.push([]);
		for (let col = 0; col < 8; col++) {
			UIboard[row].push({});
		}
	}

	// BLACK
	for (let i = 0; i < 8; i++) {
		createPiece("black", pieceOrder[i], 0 ,i);
	}
	for (let i = 0; i < 8; i++) {
		createPiece("black", "pawn",1 ,i);
	}

	// // WHITE
	// for (let i = 0; i < 8; i++) {
	// 	createPiece("white", pieceOrder[i], 7 ,i);
	// }
	// for (let i = 0; i < 8; i++) {
	// 	createPiece("white", "pawn",6 ,i);
	// }

	// createPiece("black", "king",0 ,4);
	// createPiece("black", "bishop",1 ,4);
	// createPiece("white", "pawn",2 ,2);
	// createPiece("white", "rook",6 ,4);

	createPiece("white", "rook",7 ,7);
	createPiece("white", "king",7 ,4);

	board = minifyUIBoard();
}
function syncUI(board){

}

function createPiece(color, name, row, col){
	let boardEl = document.getElementById("board")

	UIboard[row][col] = {
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

	if(color != PLAYER_COLOR){
		piece.setAttribute("style", "pointer-events: none");
	}

	// TODO there is probably a beter way than using bind
	// only add events if player is allowed to interact
	if(color == PLAYER_COLOR){
		piece.addEventListener("click", a.bind(null, UIboard[row][col]));
		piece.addEventListener("mouseover", h.bind(null, UIboard[row][col]));
		piece.addEventListener("mouseout", r.bind(null, UIboard[row][col]));
	}

	boardEl.appendChild(piece);

	UIboard[row][col].element = piece;

	function k(){
		this.element.remove();
	}
	function h(piece){
		if(piece.color != turnColor){
			return;
		}
		
		if(!toggleMoves){
			highlightPiece(UIboard[piece.row][piece.col], true);
			highlightMoves(UIboard[piece.row][piece.col], true);
		}
	}
	function a(piece){
		if(clickedPiece == UIboard[piece.row][piece.col] || clickedPiece == null){
			toggleMoves = !toggleMoves;

			if(toggleMoves){
				clickedPiece = UIboard[piece.row][piece.col];
			}else{
				if(turnColor == PLAYER_COLOR){
					clickedPiece = null
				}
			}
		}
	}
	function r(piece){
		if(!toggleMoves){
			highlightPiece(UIboard[piece.row][piece.col], false);
			highlightMoves(UIboard[piece.row][piece.col], false);
		}
	}
}
function highlightPiece(piece, state){
	let el = document.getElementById(`${piece.row}-${piece.col}`);
	let style = "";

	if(state){
		style = `fill: ${COLOR_HOVER}`;
	}

	el.style = style;
	
}
function highlightMoves(piece, state){
	let moves = getMovesetFromName(piece);
	let style = "";
	for(let i = 0; i < moves.length; i++){
		subArray = moves[i];

		// prevent the hover from sticking if a move is executed
		if(!state){
			document.getElementById(`${piece.row}-${piece.col}`).style = "";
		}

		if(i == 0){	// locations
			if(state){
				style = `fill: ${COLOR_HOVER}`;
			}

			for (let i = 0; i < subArray.length; i++) {
				let el = document.getElementById(`${subArray[i].x}-${subArray[i].y}`);
		
				el.style = style;

				if(state){
					// add move onclick listener
					el.addEventListener("click", movePiece);
					el.classList.add("pointer");
				}else{
					// remove move onclick listener
					el.removeEventListener("click", movePiece);
					el.classList.remove("pointer");
				}
			}
		}
		if(i == 1){	// kill moves
			if(state){
				style = `fill: ${COLOR_KILL}`;
			}

			for (let i = 0; i < subArray.length; i++) {
				let el = document.getElementById(`${subArray[i].x}-${subArray[i].y}`);
		
				el.style = style;

				if(state){
					el.addEventListener("click", killPiece);
					el.classList.add("pointer");
				}else{
					el.removeEventListener("click", killPiece);
					el.classList.remove("pointer");
				}
			}
		}
		if(i == 2){	// promotion
			if(state){
				style = `fill: ${COLOR_PROMOTION}`;
			}

			for (let i = 0; i < subArray.length; i++) {
				let el = document.getElementById(`${subArray[i].x}-${subArray[i].y}`);
		
				el.style = style;

				if(state){
					el.addEventListener("click", killPiece);
					el.classList.add("pointer");
				}else{
					el.removeEventListener("click", killPiece);
					el.classList.remove("pointer");
				}
			}
		}
		if(i == 3){	// castle
			if(state){
				style = `fill: ${COLOR_CASTLE}`;
			}

			for (let i2 = 0; i2 < subArray.length; i2++) {
				let castleMove = subArray[i2];

				if(castleMove.y == 7){	// left
					for (let i3 = 1; i3 < 3; i3++) {
						let el = document.getElementById(`${(piece.color == "white") ? 7 : 0}-${7 - i3}`)
						el.style = style;

						if(state){
							el.addEventListener("click", castle);
							el.removeEventListener("click", movePiece);
						}else{
							el.removeEventListener("click", castle);
						}
					}
					clickedPiece = piece;
					
				}else{	//right
					for (let i3 = 1; i3 < 3; i3++) {
						let el = document.getElementById(`${(piece.color == "white") ? 7 : 0}-${1 + i3}`)
						el.style = style;
						el.removeEventListener("click", movePiece);

						if(state){
							el.addEventListener("click", castle);
							el.removeEventListener("click", movePiece);
						}else{
							el.removeEventListener("click", castle);
						}
						
					}
					clickedPiece = piece;
				}
			}
		}
	}
}


function movePiece(){
	let id = this.id.split("-");
	let toRow = parseInt(id[0]);
	let toCol = parseInt(id[1]);

	highlightMoves(UIboard[clickedPiece.row][clickedPiece.col], false);

	move(clickedPiece.row, clickedPiece.col, toRow, toCol);

	toggleMoves = false;
	clickedPiece = null;

	endTurn();
}
function move(fromX, fromY, toX, toY){
	board[toX][toY] = board[fromX][fromY];
	board[fromX][fromY] = 6;

	if(checkPromotion(toX, toY)){	
		return;
	}
}
function killPiece(){
	let id = this.id.split("-");	// TODO dont know how this can be done better
	let from = UIboard[clickedPiece.row][clickedPiece.col]

	highlightMoves(UIboard[from.row][from.col], false);

	kill(from.row, from.col, parseInt(id[0]), parseInt(id[1]));
}
function kill(fromX, fromY, toX, toY){
	let from = UIboard[fromX][fromY]
	let to = UIboard[toX][toY]

	// move images
	from.element.setAttribute("x", to.element.getAttribute("x"));
	from.element.setAttribute("y", to.element.getAttribute("y"));

	UIboard[to.row][to.col] = UIboard[from.row][from.col];
	UIboard[from.row][from.col] = {};
	from.row = to.row;
	from.col = to.col;

	to.kill();

	toggleMoves = false;
	clickedPiece = null

	if(checkPromotion(toX, toY)){	
		return;
	}

	endTurn();
}

function castle(){
	let rook = clickedPiece;

	highlightMoves(UIboard[rook.row][rook.col], false);

	cstl(rook.row, rook.col);
}
function cstl(rookX, rookY){
	let rook = UIboard[rookX][rookY];
	let isWhite = rookX == 7;
	let king = UIboard[(isWhite) ? 7 : 0][4];
	let direction = rookY == 7	// true is left

	if(isWhite){
		hasMoved[0] = true;
		hasMoved[1] = true;
	}else{
		hasMoved[2] = true;
		hasMoved[3] = true;
	}

	if(direction){
		rook.col -= 2;
		king.col += 2;

		UIboard[rook.row][rook.col] = UIboard[rook.row][rook.col + 2];
		UIboard[rook.row][rook.col + 2] = {};

		UIboard[king.row][king.col] = UIboard[king.row][king.col - 2];
		UIboard[king.row][king.col - 2] = {};
	}else{
		rook.col += 3;
		king.col -= 2;

		UIboard[rook.row][rook.col] = UIboard[rook.row][rook.col - 3];
		UIboard[rook.row][rook.col - 3] = {};

		UIboard[king.row][king.col] = UIboard[king.row][king.col + 2];
		UIboard[king.row][king.col + 2] = {};
	}
	king.element.setAttribute("x", (king.col * 100) + 1);
	rook.element.setAttribute("x", (rook.col * 100) + 1);

	toggleMoves = false;
	clickedPiece = null

	endTurn();
}

function getMoveset(board, i, x, y){
	let moves = [];
	let openPositions = [];
	let killMoves = [];
	let promotion = [];
	let castle = [];
	let checks = [];
	let isWhite = board[x][y] < 9;

	// pawn specific checks
	if(i == 0){
		// check if pawn can be promoted
		let checkRow = (isWhite) ? 0 : 7;
		if(x == checkRow){
			clickedPiece = UIboard[x][y];
			finishedPromotion = false;

			if(PLAYER_COLOR == clickedPiece.color){
				showOverlay();
			}else{
				promote("queen");
			}
			
			return [];
		}

		let checkX = x + ((isWhite) ? -1 : 1);
		if(board[(isWhite) ? x - 1 : x + 1][y] == 6){
			addToAr(openPositions, checkX, y);
			
			if(checkX == 0){
				addToAr(promotion, checkX, y);
			}
		}		

		if(x == ((isWhite) ? 6 : 1)){
			if(board[(isWhite) ? x - 2 : x + 2][y] == 6 && board[(isWhite) ? x - 1 : x + 1][y] == 6){
				addToAr(openPositions, x + ((isWhite) ? -2 : 2), y);
			}
		}

		// kills & promotion
		let checkY = y + ((isWhite) ? -1 : 1);
		checkX = x + ((isWhite) ? -1 : 1);

		if(checkX > -1 && checkX < 8 && checkY > -1 && checkY < 8){
			if(board[checkX][checkY] != 6){
				if(isWhite){
					if(board[checkX][checkY] > 9){
						addToKillMoves(checkX, checkY);

						if(checkX == 0){
							addToAr(promotion, checkX, checkY);
						}
					}
				}else{
					if(board[checkX][checkY] < 9){
						addToKillMoves(checkX, checkY);

						if(checkX == 7){
							addToAr(promotion, checkX, checkY);
						}
					}
				}
			}
	
			checkY = y + ((isWhite) ? 1 : -1);

			if(checkY > -1 && checkY < 8){
				if(board[checkX][checkY] != 6){
					if(isWhite){
						if(board[checkX][checkY] > 9){
							addToKillMoves(checkX, checkY);

							if(checkX == 0){
								addToAr(promotion, checkX, checkY);
							}
						}
					}else{
						if(board[checkX][checkY] < 9){
							addToKillMoves(checkX, checkY);

							if(checkX == 7){
								addToAr(promotion, checkX, checkY);
							}
						}
					}
				}
			}
		}
		
		// https://sakkpalota.hu/index.php/en/chess/rules#pawn
		// todo: check for EN PASSANT
	}

	// rook specific checks
	if(i == 1){
		for (let i2 = 1; i2 < 8; i2++) {	// down
			if(checkPath(x + i2, y)){
				break;
			}
		}
		for (let i2 = 1; i2 < 8; i2++) {	// right
			if(checkPath(x, y + i2)){
				if(board[x][y + i2] == 5 || board[x][y + i2] == 15){
					if(isWhite){
						if(hasMoved[0] || hasMoved[1]){
							break;
						}
					}else{
						if(hasMoved[2] || hasMoved[3]){
							break;
						}
					}

					addToAr(castle, x, y);
				}

				break;
			}
		}
		for (let i2 = 1; i2 < 8; i2++) {	// up
			if(checkPath(x - i2, y)){
				break;
			}
		}
		for (let i2 = 1; i2 < 8; i2++) {	// left
			if(checkPath(x, y - i2)){
				if(board[x][y - i2] == 5 || board[x][y - i2] == 15){
					if(isWhite){
						if(hasMoved[0] || hasMoved[1]){
							break;
						}
					}else{
						if(hasMoved[2] || hasMoved[3]){
							break;
						}
					}

					addToAr(castle, x, y);
				}

				break;
			}
		}
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
		for (let i2 = 1; i2 < 8; i2++) {
			if(checkPath(x + i2, y + i2)){
				break;
			}
		}
		for (let i2 = 1; i2 < 8; i2++) {
			if(checkPath(x - i2, y - i2)){
				break;
			}
		}
		for (let i2 = 1; i2 < 8; i2++) {
			if(checkPath(x - i2, y + i2)){
				break;
			}
		}
		for (let i2 = 1; i2 < 8; i2++) {
			if(checkPath(x + i2, y - i2)){
				break;
			}
		}
	}

	// queen
	if(i == 4){
		for (let i2 = 1; i2 < 8; i2++) {
			if(checkPath(x + i2, y)){
				break;
			}
		}
		for (let i2 = 1; i2 < 8; i2++) {
			if(checkPath(x, y + i2)){
				break;
			}
		}
		for (let i2 = 1; i2 < 8; i2++) {
			if(checkPath(x - i2, y)){
				break;
			}
		}
		for (let i2 = 1; i2 < 8; i2++) {
			if(checkPath(x, y - i2)){
				break;
			}
		}
		for (let i2 = 1; i2 < 8; i2++) {
			if(checkPath(x + i2, y + i2)){
				break;
			}
		}
		for (let i2 = 1; i2 < 8; i2++) {
			if(checkPath(x - i2, y - i2)){
				break;
			}
		}
		for (let i2 = 1; i2 < 8; i2++) {
			if(checkPath(x - i2, y + i2)){
				break;
			}
		}
		for (let i2 = 1; i2 < 8; i2++) {
			if(checkPath(x + i2, y - i2)){
				break;
			}
		}
	}

	// king
	if(i == 5){
		// move pattern
		let movePatern = [{x: 1, y: 0}, {x: 0, y: 1},{x: 1, y: 1}, {x: -1, y: 0},{x: 0, y: -1}, {x: -1, y: -1},{x: -1, y: 1}, {x: 1, y: -1}];

		for (let i2 = 0; i2 < movePatern.length; i2++) {
			checkPath(x + movePatern[i2].x, y + movePatern[i2].y)
		}
	}

	function checkPath(checkX, checkY){
		if(checkX < 0 || checkX > 7 || checkY < 0 || checkY > 7){
			return false;
		}

		if(board[checkX][checkY] == 6){
			addToAr(openPositions, checkX, checkY);
		}else{
			if(isWhite){
				if(board[checkX][checkY] > 9){
					addToKillMoves(checkX, checkY);
				}
			}else{
				if(board[checkX][checkY] < 10){
					addToKillMoves(checkX, checkY);
				}
			}
			return true;
		}
	}

	function addToKillMoves(toX, toY){
		if(board[toX][toY] == 5 || board[toX][toY] == 15){
			addToAr(checks, toX, toY);
		}else{
			addToAr(killMoves, toX, toY);
		}
	}
	function addToAr(ar, toX, toY){
		if(canDoMove(board, x, y, toX, toY)){
			ar.push({x: toX, y: toY})
		}
	}

	moves.push(openPositions);
	moves.push(killMoves);
	moves.push(promotion);
	moves.push(castle);
	moves.push(checks);

	return moves;
}
function getMovesetFromName(piece){
	return getMoveset(minifyUIBoard(), pieceNameToInt(piece.name), piece.row, piece.col);
}

function minifyUIBoard(){
	let r = [];

	for (let row = 0; row < 8; row++) {
		r.push([]);
	}

	for (let col = 0; col < 8; col++) {
		for (let row = 0; row < 8; row++) {
			let name = UIboard[row][col].name
			let color = (UIboard[row][col].color == "white");
	
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

function createPromotionOverlay(){
	let el = document.getElementById("promotionContainer");
	let names = ["queen", "rook", "bishop", "knight"]

	for (let i = 0; i < 4; i++) {
		let container = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
		container.setAttribute("class", "promotion-item");
		container.addEventListener("click", function(){
			promote(names[i]);
		});

		let image = new Image();
		image.className = "promotion-image";
		image.src = `img/${names[i]}_${(PLAYER_COLOR == "white") ? "w" : "b"}.svg`;

		container.append(image);
		el.append(container);
	}
}
function showOverlay(){
	document.getElementById("promotionOverlay").style.display = "block";
}
function promote(name){
	clickedPiece.name = name;
	clickedPiece.element.setAttribute('href', `img/${name}_${(clickedPiece.color == "white") ? "w" : "b"}.svg`);

	document.getElementById("promotionOverlay").style.display = "none";

	finishedPromotion = true;

	clickedPiece = null;

	endTurn();
}
function checkPromotion(toX, toY){
	if(UIboard[toX][toY].name == "pawn"){
		if((UIboard[toX][toY].color == "white")){
			if(UIboard[toX][toY].row == 0){
				return true;
			}
		}else{
			if(UIboard[toX][toY].row == 7){
				return true;
			}
		}
	}

	return false;
}