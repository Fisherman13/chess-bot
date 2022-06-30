function makeMove(piece, x, y){
	let moveSet = getMovesetFromObject(piece);

	for (let i = 0; i < moveSet.length; i++) {
		let moveSubSet = moveSet[i]
		if(moveSubSet.length == 0){
			continue;
		}
		for (let i2 = 0; i2 < moveSubSet.length; i2++) {
			if(moveSubSet[i2].x == x && moveSubSet[i2].y == y){
				//do stuff

				if(i == 0){
					move(clickedPiece.row, clickedPiece.col, x, y);
				}
				if(i == 1){
					kill(clickedPiece.row, clickedPiece.col, x, y)
				}
				if(i == 2){
					promote(clickedPiece.row, clickedPiece.col, x, y, 0);
				}
				if(i == 3){
					castle(clickedPiece.row, clickedPiece.col);
				}

				syncUI();

				clickedPiece = null;
				
				removeHighlight(false);

				endTurn();
			}
		}
	}
}

function move(fromX, fromY, toX, toY){
	updateCastleMoved(fromX, fromY);

	board[toX][toY] = board[fromX][fromY];
	board[fromX][fromY] = 6; 

	moveList.push([[fromX, fromY],[toX, toY]])
}
function kill(fromX, fromY, toX, toY){
	updateCastleMoved(fromX, fromY);

	move(fromX, fromY, toX, toY);
}
function promote(fromX, fromY, toX, toY, to){
	if(to == 0){
		finishedPromotion = false;
		moveList.push([[fromX, fromY],[toX, toY]])
		return;
	}

	board[fromX][fromY] = 6;
	board[toX][toY] = to;

	moveList.push([[fromX, fromY],[toX, toY]])
}
function castle(rookX, rookY){
	let direction = (rookY == 7)	// true is left
	let isWhite = rookX == 7;
	let kingX = (isWhite) ? 7 : 0;
	let kingY = 4;

	if(direction){
		move(rookX, rookY, rookX, rookY - 2);
		move(kingX, kingY, kingX, kingY + 2);
	}else{
		move(rookX, rookY, rookX, rookY + 3);
		move(kingX, kingY, kingX, kingY - 2);
	}

	if(isWhite){
		hasMoved[0] = true;
		hasMoved[1] = true;
	}else{
		hasMoved[2] = true;
		hasMoved[3] = true;
	}
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
function pieceIntToName(i){
	switch (i) {
		case 0:
			return "pawn";
		case 1:
			return "rook";
		case 2:
			return "knight";
		case 3:
			return "bishop";
		case 4:
			return "queen";
		case 5:
			return "king";
	}
}
function updateCastleMoved(fromX, fromY){
	switch (board[fromX][fromY]) {
		case 5:
			hasMoved[1] = true;
			return;
		case 15:
			hasMoved[4] = true;
			return;
	}

	if(fromX == 7 && fromY == 7){
		hasMoved[2] = true;
		return;
	}

	if(fromX == 7 && fromY == 0){
		hasMoved[0] = true;
		return;
	}

	if(fromX == 0 && fromY == 0){
		hasMoved[3] = true;
		return;
	}
	if(fromX == 0 && fromY == 7){
		hasMoved[5] = true;
		return;
	}
}
