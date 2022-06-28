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
}
function mousemove(event){
    let {x, y} = getCoordsFromEvent(event);
    let piece = UIboard[x][y];

    if(isClicked()){
        return;
    }

    removeHighlight();

    if(piece.name == null){
        return;
    }
    if(piece.color != PLAYER_COLOR){
        return;
    }

    highlightPiece(piece);

    highlightMoves(piece)
}
function mouseclick(event){
    let {x, y} = getCoordsFromEvent(event);
    let piece = UIboard[x][y];

    if(isClicked()){
        if(piece == clickedPiece){
            clickedPiece = null;
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
        removeHighlight();
    }
}
function getCoordsFromEvent(event){
    let x = Math.floor((event.offsetY - 3) / 100);
    let y = Math.floor((event.offsetX - 3) / 100);

    x = (x < 0) ? 0 : x
    y = (y < 0) ? 0 : y

    return {x: x, y: y}
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

	// // BLACK
	// for (let i = 0; i < 8; i++) {
	// 	createPiece("black", pieceOrder[i], 0 ,i);
	// }
	// for (let i = 0; i < 8; i++) {
	// 	createPiece("black", "pawn",1 ,i);
	// }

	// // WHITE
	// for (let i = 0; i < 8; i++) {
	// 	createPiece("white", pieceOrder[i], 7 ,i);
	// }
	// for (let i = 0; i < 8; i++) {
	// 	createPiece("white", "pawn",6 ,i);
	// }

	createPiece("black", "king",0 ,4);
	createPiece("black", "bishop",1 ,4);
	createPiece("white", "pawn",2 ,2);
	createPiece("white", "rook",6 ,4);

	createPiece("white", "rook",7 ,7);
	createPiece("white", "king",7 ,4);

	board = minifyUIBoard();
}
function syncUI(){
	for (let i = 0; cycleCount < moveList.length; cycleCount++) {
		let move = moveList[cycleCount];
		let from = UIboard[move[0][0]][move[0][1]];
        let to = UIboard[move[1][0]][move[1][1]];

        if(to == from){
            if(finishedPromotion){
                continue;
            }

            showOverlay()

            let i = setInterval(function(){
                if(promoteTo != ""){
                    clearInterval(i);

                    board[to.row][to.col] = pieceNameToInt(promoteTo);

                    to.name = promoteTo;
                    to.element.setAttribute('href', `img/${promoteTo}_${(to.color == "white") ? "w" : "b"}.svg`);

                    document.getElementById("promotionOverlay").style.display = "none";

                    finishedPromotion = true;

                    promoteTo = "";

                    endTurn();
                }
            }, 100)

            return;
        }

        if(to.name != null){
            to.kill();
        }
		
		// move image
		from.element.setAttribute("x", (move[1][1] * 100) + 1);
		from.element.setAttribute("y", (move[1][0] * 100) + 1);

		from.row = move[1][0];
		from.col = move[1][1];

		UIboard[move[1][0]][move[1][1]] = from;
		UIboard[move[0][0]][move[0][1]] = {};
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

	piece.setAttribute("x", (col * 100) + 1);
	piece.setAttribute("y", (row * 100) + 1);

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
	let el = document.getElementById(`${piece.row}-${piece.col}`);
	el.style = `fill: ${COLOR_HOVER}`;
}
function removeHighlight(){
    let x = document.querySelectorAll(".square");

    for (let i = 0; i < x.length; i++) {
        console.log
        if(x[i].style != ""){
            x[i].style = "";
        }
    }
}

function highlightMoves(piece){
	let moves = getMovesetFromObject(piece);
    let style = "";
    
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