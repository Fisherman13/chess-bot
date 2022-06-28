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
			if(turnColor == BOT_COLOR.color){
				promote(4);
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
						if(hasMoved[0] || hasMoved[1] || hasMoved[2]){
							break;
						}
					}else{
						if(hasMoved[3] || hasMoved[4] || hasMoved[5]){
							break;
						}
					}

					addToAr(castle, (isWhite) ? 7 : 0, 4);
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
						if(hasMoved[0] || hasMoved[1] || hasMoved[2]){
							break;
						}
					}else{
						if(hasMoved[3] || hasMoved[4] || hasMoved[5]){
							break;
						}
					}

					addToAr(castle, (isWhite) ? 7 : 0, 4);
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
function getMovesetFromObject(piece){
	return getMoveset(board, pieceNameToInt(piece.name), piece.row, piece.col);
}