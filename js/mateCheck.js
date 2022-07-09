let checkedSquare = null;

function mateCheck(board, white){
    let state = getState(board, white);
    let colorString = (white) ? "white" : "black"

    switch (state) {
        case 0:
            return
        case 1:
            check(white, false, true);
            break;
        case 2:
            mate(colorString);
            break;
        case 3:
            mate("sdraw");
            break;
    }
}

// 0 = nothing,  1 = check, 2 = mate, 3 statemate draw
function getState(board, white){
    let allChecks = getCheckedPieces(board, white);
    let r = 0;

    if(allChecks.length > 0){
        r = 1;
    }

    let colorString = (white) ? "white" : "black"
    let allMoves = getAllMoves(board, colorString);
    if(allMoves.length == 0){
        if(allChecks.length == 0){
            r = 3
        }else{
            r = 2
        }
    }

    return r;
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

        const moveSet = getMoveset(board, piece, x, y, false);

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
    if(color != "sdraw"){
        highlightKing((color == "white"), true);
    }
	
    winner(color)
}
function highlightKing(color, isMate){
    let loc = getKingLocation(color);
    let style = `fill: ${(isMate) ? COLOR_MATE : COLOR_CHECK}`

    document.getElementById(`${loc[0]}-${loc[1]}`).style = style;
}
function getKingLocation(color){
    let kingNumber = (color) ? 5 : 15;

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if(board[x][y] == kingNumber){
                return [x,y];
            }
        }
    }
}