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
					move(board, clickedPiece.row, clickedPiece.col, x, y, true);
				}
				if(i == 1){
					kill(board, clickedPiece.row, clickedPiece.col, x, y, true)
				}
				if(i == 2){
					promote(board, clickedPiece.row, clickedPiece.col, x, y, 0, true);
				}
				if(i == 3){
					castle(board, clickedPiece.row, clickedPiece.col, true);
				}

				syncUI();

				clickedPiece = null;
				
				removeHighlight(false);

				endTurn();
			}
		}
	}
}

function move(board, fromX, fromY, toX, toY, save){
	updateCastleMoved(fromX, fromY);

	board[toX][toY] = board[fromX][fromY];
	board[fromX][fromY] = 6; 

	if(save){
		moveList.push([[fromX, fromY],[toX, toY]])
	}
}
function kill(board, fromX, fromY, toX, toY, save){
	updateCastleMoved(fromX, fromY);

	move(board, fromX, fromY, toX, toY, save);
}
function promote(board, fromX, fromY, toX, toY, to, save){
	if(to == 0){
		finishedPromotion = false;
		if(save){
			moveList.push([[fromX, fromY],[toX, toY]])
		}
		return;
	}

	board[fromX][fromY] = 6;
	board[toX][toY] = to;

	if(save){
		moveList.push([[fromX, fromY],[toX, toY]])
	}
}
function castle(board, rookX, rookY, save){
	let direction = (rookY == 7)	// true is left
	let isWhite = rookX == 7;
	let kingX = (isWhite) ? 7 : 0;
	let kingY = 4;

	if(direction){
		move(board, rookX, rookY, rookX, rookY - 2, save);
		move(board, kingX, kingY, kingX, kingY + 2, save);
	}else{
		move(board, rookX, rookY, rookX, rookY + 3, save);
		move(board, kingX, kingY, kingX, kingY - 2, save);
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
