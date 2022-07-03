const pieceOrder = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];

function createUIBoard(){
	let boardEl = document.getElementById("board");

	for (let col = 0; col < 8; col++) {
		for (let row = 0; row < 8; row++) {
			boardEl.appendChild(createRect(row, col));
		}
	}

    boardEl.addEventListener("mousemove", mousemove);
    boardEl.addEventListener("mouseleave", mouseleave);
    boardEl.addEventListener("click", mouseclick);

	boardEl.style.width = BOARD_WIDTH + "px";
	boardEl.style.height = BOARD_WIDTH + "px";
}
function mousemove(event){
    let {x, y} = getCoordsFromEvent(event);
    let piece = UIboard[x][y];

    if(isClicked()){
        return;
    }

	if(isHighlighting){
		removeHighlight(false);
	}

    if(piece.name == null){
        return;
    }
    if(piece.color != PLAYER_COLOR){
        return;
    }
	if(piece.color != turnColor){
		return;
	}

    highlightPiece(piece);

    highlightMoves(piece)
}
function mouseclick(event){
    let {x, y} = getCoordsFromEvent(event);
    let piece = UIboard[x][y];

	// prevent clicking a piece before it is your turn
	if(clickedPiece == null && piece != null && piece.color != turnColor){
		return;
	}

    if(isClicked()){
        if(piece == clickedPiece){
            clickedPiece = null;
			removeHighlight();
            return;
        }

        // check if you can do stuff
        makeMove(clickedPiece, x, y);

        return;
    }else{
        if(piece.name != null){
            clickedPiece = piece;
        }
    }

    if(piece.color != null && piece.color != PLAYER_COLOR){
        highlightMoves(piece)
    }
}
function mouseleave(){
    if(!isClicked()){
        removeHighlight(false);
    }
}
function getCoordsFromEvent(event){
    let x = Math.floor((event.offsetY - 3) / SQUARE_WIDTH);
    let y = Math.floor((event.offsetX - 3) / SQUARE_WIDTH);

    x = (x < 0) ? 0 : x
    y = (y < 0) ? 0 : y

    return {x: x, y: y}
}

function createRect(row, col){
	let square = document.createElementNS("http://www.w3.org/2000/svg", 'rect');

	square.setAttribute("class", "square");
	square.setAttribute("x", (row * SQUARE_WIDTH) + 1);
	square.setAttribute("y", (col * SQUARE_WIDTH) + 1);
	square.setAttribute("width", SQUARE_WIDTH);
	square.setAttribute("height", SQUARE_WIDTH);
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

	// WHITE
	for (let i = 0; i < 8; i++) {
		createPiece("white", pieceOrder[i], 7 ,i);
	}
	for (let i = 0; i < 8; i++) {
		createPiece("white", "pawn",6 ,i);
	}

	board = minifyUIBoard();
}
function syncUI(){
	for (let i = 0; cycleCount < moveList.length; cycleCount++) {
		let move = moveList[cycleCount];
		let from = UIboard[move[0][0]][move[0][1]];
        let to = UIboard[move[1][0]][move[1][1]];

		logMove(move);

		if(!finishedPromotion){
			showOverlay()

            let interval = setInterval(function(){
                if(promoteTo != ""){
                    clearInterval(interval);

					board[move[0][0]][move[0][1]] = 6;
                    board[move[1][0]][move[1][1]] = pieceNameToInt(promoteTo) + ((from.color == "white") ? 0 : 10);

					// move image
					from.element.setAttribute("x", (move[1][1] * SQUARE_WIDTH) + 1);
					from.element.setAttribute("y", (move[1][0] * SQUARE_WIDTH) + 1);

					from.row = move[1][0];
					from.col = move[1][1];

					if(UIboard[move[1][0]][move[1][1]].name != null){
						UIboard[move[1][0]][move[1][1]].kill();
					}

					UIboard[move[1][0]][move[1][1]] = from;
					UIboard[move[0][0]][move[0][1]] = {};

                    from.name = promoteTo;
                    from.element.setAttribute('href', `img/${promoteTo}_${(from.color == "white") ? "w" : "b"}.svg`);

                    document.getElementById("promotionOverlay").style.display = "none";

                    finishedPromotion = true;

                    promoteTo = "";

					mateCheck(board, (turnColor == "white"));
                }
            }, 100)
		}else{
			// bot promotion check
			if(from.name != null){
				let pieceInt = board[move[1][0]][move[1][1]];
				pieceInt = (from.color == "black") ? pieceInt - 10 : pieceInt;

				if(pieceNameToInt(from.name) != pieceInt){
					from.name = pieceIntToName(pieceInt);
					from.element.setAttribute('href', `img/${from.name}_${(from.color == "white") ? "w" : "b"}.svg`);
				}
			}

			if(to.name != null && from.name != null){
				to.kill();
			}
			
			// move image
			from.element.setAttribute("x", (move[1][1] * SQUARE_WIDTH) + 1);
			from.element.setAttribute("y", (move[1][0] * SQUARE_WIDTH) + 1);

			from.row = move[1][0];
			from.col = move[1][1];

			UIboard[move[1][0]][move[1][1]] = from;
			UIboard[move[0][0]][move[0][1]] = {};
		}
	}
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

	piece.setAttribute("x", (col * SQUARE_WIDTH) + 1);
	piece.setAttribute("y", (row * SQUARE_WIDTH) + 1);
	piece.setAttribute("height", SQUARE_WIDTH);
	piece.setAttribute("width", SQUARE_WIDTH);

	piece.setAttribute("href", `img/${name}_${(color == "white") ? "w" : "b"}.svg`);

	if(color != PLAYER_COLOR){
		piece.setAttribute("style", "pointer-events: none");
	}

	boardEl.appendChild(piece);

	UIboard[row][col].element = piece;

	function k(){
		this.element.remove();
	}
}
function highlightPiece(piece){
	isHighlighting = true;

	let el = document.getElementById(`${piece.row}-${piece.col}`);
	el.style = `fill: ${COLOR_HOVER}`;
}
function removeHighlight(removeCheck){
    let squares = document.querySelectorAll(".square");
	let loc = getKingLocation(turnColor == "white");

    for (let i = 0; i < squares.length; i++) {
        if(squares[i].style.fill != ""){
			if(!removeCheck){
				let id = squares[i].id.split("-");
				let x = parseInt(id[0]);
				let y = parseInt(id[1]);

				if(!(x == loc[0] && y == loc[1])){
					squares[i].style.fill = "";
				}
				if(squares[i].style.fill == "rgb(209, 90, 209)" || squares[i].style.fill == "rgb(251, 210, 135)"){
					squares[i].style.fill = "";
				}
			}else{
				squares[i].style.fill = "";
			}
        }
    }

	isHighlighting = false;
}

function highlightMoves(piece){
	let moves = getMovesetFromObject(piece);
    let style = "";

	isHighlighting = true;
    
	for(let i = 0; i < moves.length; i++){
		subArray = moves[i];
        style = getStyle(i);

		if(i == 0){	// locations
			for (let i = 0; i < subArray.length; i++) {
				let el = document.getElementById(`${subArray[i].x}-${subArray[i].y}`);
				el.style = style;
			}
		}
		if(i == 1){	// kill moves
			for (let i = 0; i < subArray.length; i++) {
				let el = document.getElementById(`${subArray[i].x}-${subArray[i].y}`);
				el.style = style;
			}
		}
		if(i == 2){	// promotion
			for (let i = 0; i < subArray.length; i++) {
				let el = document.getElementById(`${subArray[i].x}-${subArray[i].y}`);
				el.style = style;
			}
		}
		if(i == 3){	// castle
			for (let i2 = 0; i2 < subArray.length; i2++) {
                let el = document.getElementById(`${(piece.color == "white") ? 7 : 0}-${4}`);
                el.style = style;
			}
		}
	}
}
function getStyle(i){
    switch (i) {
        case 0:
            return `fill: ${COLOR_HOVER}`;
        case 1:
            return `fill: ${COLOR_KILL}`;
        case 2:
            return `fill: ${COLOR_PROMOTION}`;
        case 3:
            return `fill: ${COLOR_CASTLE}`;
    }
}
function logError(msg){
	console.log(`error: ${msg}`);
	document.getElementById("error").innerText = msg;
}
function isClicked(){
    return (clickedPiece != null && clickedPiece.name != null)
}
function createPromotionOverlay(){
	let el = document.getElementById("promotionContainer");
	let names = ["queen", "rook", "bishop", "knight"]

	for (let i = 0; i < 4; i++) {
		let container = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
		container.setAttribute("class", "promotion-item");
		container.addEventListener("click", function(){
			promoteTo = names[i];
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
function logMove(move){
	// TODO: proper chess notation https://www.ichess.net/blog/chess-notation/
	let from = BOARD_LAYOUT[move[0][0]][move[0][1]];
	let to = BOARD_LAYOUT[move[1][0]][move[1][1]];

	addElToMoves(turnColor, `${from}${to}`);
}
function winner(color){
	let el = document.getElementById("winner");

	if(color == "sdraw"){
		addElToMoves(color, `stalemate draw`);
		el.innerText = `Stalemate draw`;
	}else{
		addElToMoves(color, `Winner: ${color}`);
		el.innerText = `Winner: ${color}`;
	}
	
	el.style.display = "block";

	clearInterval(timeInterval);
}
function addElToMoves(color, text){
	let el = document.createElement("div");
	el.classList.add(color);
	el.classList.add("move-item");
	el.innerText = text;

	document.getElementById("moves").appendChild(el);
}