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

	for (let i = 5; i < 8; i++) {
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

	if(color != PLAYER_COLOR){
		piece.setAttribute("style", "pointer-events: none");
	}

	// TODO there is probably a beter way than using bind
	// only add events if player is allowed to interact
	if(color == PLAYER_COLOR){
		piece.addEventListener("click", a.bind(null, board[row][col]));
		piece.addEventListener("mouseover", h.bind(null, board[row][col]));
		piece.addEventListener("mouseout", r.bind(null, board[row][col]));
	}

	boardEl.appendChild(piece);

	board[row][col].element = piece;

	function k(){
		this.element.remove();
	}
	function h(piece){
		if(!toggleMoves){
			highlightPiece(board[piece.row][piece.col], true);
			highlightMoves(board[piece.row][piece.col], true);
		}
	}
	function a(piece){
		if(clickedPiece == board[piece.row][piece.col] || clickedPiece == null){
			toggleMoves = !toggleMoves;

			if(toggleMoves){
				clickedPiece = board[piece.row][piece.col];
			}else{
				clickedPiece = null
			}
		}
	}
	function r(piece){
		if(!toggleMoves){
			highlightPiece(board[piece.row][piece.col], false);
			highlightMoves(board[piece.row][piece.col], false);
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

		}
	}
}

function movePiece(){
	let id = this.id.split("-");
	let from = board[clickedPiece.row][clickedPiece.col]
	let toRow = parseInt(id[0]);
	let toCol = parseInt(id[1]);

	highlightMoves(board[from.row][from.col], false);

	// move image
	from.element.setAttribute("x", (toCol * 100) + 1);
	from.element.setAttribute("y", (toRow * 100) + 1);

	board[clickedPiece.row][clickedPiece.col] = {};
	
	from.row = toRow;
	from.col = toCol;
	
	// update board
	board[toRow][toCol] = from;

	toggleMoves = false;
	clickedPiece = null
}
function killPiece(){
	let id = this.id.split("-");	// TODO dont know how this can be done better
	let from = board[clickedPiece.row][clickedPiece.col]
	let to = board[parseInt(id[0])][parseInt(id[1])]

	highlightMoves(board[from.row][from.col], false);

	// move images
	from.element.setAttribute("x", to.element.getAttribute("x"));
	from.element.setAttribute("y", to.element.getAttribute("y"));

	board[to.row][to.col] = board[from.row][from.col];
	board[from.row][from.col] = {};
	from.row = to.row;
	from.col = to.col;

	to.kill();

	toggleMoves = false;
	clickedPiece = null
}

function getMoveset(i, x, y){
	let moves = [];
	let openPositions = [];
	let killMoves = [];
	let promotion = [];
	let castle = [];
	let miniBoard = minifyBoard();
	let isWhite = miniBoard[x][y] < 9;

	// pawn specific checks
	if(i == 0){
		// check if pawn can be promoted
		let checkRow = (isWhite) ? 0 : 7;
		if(x == checkRow){
			showOverlay();
			clickedPiece = board[x][y];
			return [];
		}

		if(miniBoard[(isWhite) ? x - 1 : x + 1][y] == 6){
			openPositions.push({x: x + ((isWhite) ? -1 : 1), y: y})
		}		

		if(x == ((isWhite) ? 6 : 1)){
			if(miniBoard[(isWhite) ? x - 2 : x + 2][y] == 6 && miniBoard[(isWhite) ? x - 1 : x + 1][y] == 6){
				openPositions.push({x: x + ((isWhite) ? -2 : 2), y: y})
			}
		}

		// kills & promotion
		let checkY = y + ((isWhite) ? -1 : 1);
		let checkX = x + ((isWhite) ? -1 : 1);

		if(checkX > -1 && checkX < 8 && checkY > -1 && checkY < 8){
			if(miniBoard[checkX][checkY] != 6){
				if(isWhite){
					if(miniBoard[checkX][checkY] > 9){
						killMoves.push({x: checkX, y: checkY})
					}

					if(checkX == 0){
						promotion.push({x: checkX, y: checkY})
					}
				}else{
					if(miniBoard[checkX][checkY] < 9){
						killMoves.push({x: checkX, y: checkY})
					}

					if(checkX == 7){
						promotion.push({x: checkX, y: checkY})
					}
				}
			}
	
			checkY = y + ((isWhite) ? 1 : -1);

			if(checkY > -1 && checkY < 8){
				if(miniBoard[checkX][checkY] != 6){
					if(isWhite){
						if(miniBoard[checkX][checkY] > 9){
							killMoves.push({x: checkX, y: checkY})
						}

						if(checkX == 0){
							promotion.push({x: checkX, y: checkY})
						}
					}else{
						if(miniBoard[checkX][checkY] < 9){
							killMoves.push({x: checkX, y: checkY})
						}

						if(checkX == 7){
							promotion.push({x: checkX, y: checkY})
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
	moves.push(promotion);
	moves.push(castle);

	return moves;
}
function getMovesetFromName(piece){
	return getMoveset(pieceNameToInt(piece.name), piece.row, piece.col);
}
function check(color){
	highlightKing(color, false);
}
function mate(color){
	highlightKing(color, true);
}
function highlightKing(color, isMate){
	for (let i = 0; i < 8; i++) {
		for (let i2 = 0; i2 < 8; i2++) {
			let piece = board[i][i2];
			if(piece.color == color && piece.name == "king"){
				let color = (isMate) ? COLOR_MATE : COLOR_CHECK;
				document.getElementById(`${piece.row}-${piece.col}`).style = `fill: ${color}`;
				return;
			}
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

function createPromotionOverlay(){
	let el = document.getElementById("promotionContainer");
	let names = ["queen", "rook", "bishop", "knight"]

	for (let i = 0; i < 4; i++) {
		let container = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
		container.setAttribute("class", "promotion-item");
		container.addEventListener("click", function(){
			promotion(names[i]);
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
function promotion(name){
	clickedPiece.name = name;
	clickedPiece.element.setAttribute('href', `img/${name}_${(clickedPiece.color == "white") ? "w" : "b"}.svg`);

	document.getElementById("promotionOverlay").style.display = "none";

	clickedPiece = null;
}