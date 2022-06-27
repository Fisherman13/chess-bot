let checkedSquare = null;

function mateCheck(board, white){
    let allChecks = getCheckedPieces(board, white);

    if(allChecks.length == 0){
        highlightKing("white", false, false);
        highlightKing("black", false, false);
        return;
    }

    check((white) ? "white" : "black", false, true);
}

function getCheckedPieces(board, white){
    let r = [];

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            checkMoves(x, y);
        }
    }

    function checkMoves(x, y){
        const piece = board[x][y];

        if(piece == 6){
            return;
        }

        if(white){
            if(piece < 9){
                return;
            }
        }else{
            if(piece > 9){
                return;
            }
        }

        const moveSet = getMoveset(board, piece, x, y);

        // pawn being promoted
        if(moveSet.length == 0){
            return;
        }

        if(moveSet[4].length == 0){
            return;
        }

        r.push({x: x, y: y})
    }

    return r;
}

function check(color){
	highlightKing(color, false, true);
}
function mate(color){
	highlightKing(color, true, true);
}
function removeKingHighlight(color){
	highlightKing(color, true, false);
}
function highlightKing(color, isMate, state){
	for (let i = 0; i < 8; i++) {
		for (let i2 = 0; i2 < 8; i2++) {
			let piece = UIboard[i][i2];
			if(piece.color == color && piece.name == "king"){
				let style = "";

				if(state){
					style = `fill: ${(isMate) ? COLOR_MATE : COLOR_CHECK}`
				}

				document.getElementById(`${piece.row}-${piece.col}`).style = style;
				return;
			}
		}
	}
}