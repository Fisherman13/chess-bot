function getMoveset(board, i, x, y, moveCheck){
	let moves = [];
	let openPositions = [];
	let killMoves = [];
	let promotion = [];
	let castle = [];
	let checks = [];
	let isWhite = board[x][y] < 9;

	i = (i > 9) ? i -= 10 : i;

	// pawn specific checks
	if(i == 0){
		let checkX = x + ((isWhite) ? -1 : 1);
		let checkX2 = (isWhite) ? x - 1 : x + 1;

		if(checkX2 > -1 && checkX2 < 8){
			if(board[checkX2][y] == 6){
				// Promotion is mandatory; the pawn cannot remain as a pawn.
				if(checkX == ((isWhite) ? 0 : 7)){
					addToAr(promotion, checkX, y);
				}else{
					addToAr(openPositions, checkX, y);
				}
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

		pawnCheck();
		
		checkY = y + ((isWhite) ? 1 : -1);

		pawnCheck();

		function pawnCheck(){
			if(checkX < 0 || checkX > 7 || checkY < 0 || checkY > 7){
				return;
			}
			if(board[checkX][checkY] != 6){
				if(isWhite){
					if(board[checkX][checkY] > 9){
						if(checkX == ((isWhite) ? 0 : 7)){
							if(isKing(checkX, checkY)){
								addToAr(checks, checkX, checkY);
							}else{
								addToAr(promotion, checkX, checkY);
							}
						}else{
							addToKillMoves(checkX, checkY);

							if(checkX == 0){
								addToAr(openPositions, checkX, checkY);
							}
						}
					}
				}else{
					if(board[checkX][checkY] < 9){
						if(checkX == ((isWhite) ? 0 : 7)){
							if(isKing(checkX, checkY)){
								addToAr(checks, checkX, checkY);
							}else{
								addToAr(promotion, checkX, checkY);
							}
						}else{
							addToKillMoves(checkX, checkY);

							if(checkX == 7){
								addToAr(openPositions, checkX, checkY);
							}
						}
					}
				}
			}
		}
		
		// https://sakkpalota.hu/index.php/en/chess/rules#pawn
		// TODO: check for EN PASSANT
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
						if(hasMoved[3] || hasMoved[4]){
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
						if(hasMoved[1] || hasMoved[2]){
							break;
						}
					}else{
						if(hasMoved[4] || hasMoved[5]){
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
		let otherKing = getKingLocation(!isWhite);

		for (let i2 = 0; i2 < movePatern.length; i2++) {
			if(!collidesWithKing(x + movePatern[i2].x, y + movePatern[i2].y, otherKing)){
				checkPath(x + movePatern[i2].x, y + movePatern[i2].y);
			}
		}

		function collidesWithKing(x, y, king){
			for (let i2 = 0; i2 < movePatern.length; i2++) {
				if(x == (king[0] + movePatern[i2].x) && y == (king[1] + movePatern[i2].y)){
					return true;
				}
			}

			return false;
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
		if(isKing(toX, toY)){
			addToAr(checks, toX, toY);
		}else{
			addToAr(killMoves, toX, toY);
		}
	}
	function addToAr(ar, toX, toY){
		if(moveCheck){
			if(canDoMove(board, x, y, toX, toY)){
				ar.push({x: toX, y: toY})
			}
		}else{
			ar.push({x: toX, y: toY})
		}
	}
	function isKing(x, y){
		return board[x][y] == 5 || board[x][y] == 15
	}

	moves.push(openPositions);
	moves.push(killMoves);
	moves.push(promotion);
	moves.push(castle);
	moves.push(checks);

	return moves;
}
function getMovesetFromObject(piece){
	return getMoveset(board, pieceNameToInt(piece.name), piece.row, piece.col, true);
}