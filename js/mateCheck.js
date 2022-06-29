let checkedSquare = null;

function mateCheck(board, white){
    let allChecks = getCheckedPieces(board, white);

    if(allChecks.length == 0){
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
	highlightKing(color, false);
}
function mate(color){
	highlightKing(color, true);
}
function highlightKing(color, isMate){
    let loc = getkingLocation(color);
    let style = `fill: ${(isMate) ? COLOR_MATE : COLOR_CHECK}`

    document.getElementById(`${loc[0]}-${loc[1]}`).style = style;
}
function getkingLocation(color){
    let kingNumber = (color) ? 15 : 5;

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if(board[x][y] == kingNumber){
                return [x,y];
            }
        }
    }
}