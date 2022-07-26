function botRandom(color){
    let allMoves = getAllMoves(board, color);

    if(allMoves.length == 0){
        return;
    }

    // pick random piece
    let randomPiece = allMoves[Math.floor(Math.random() * allMoves.length)];

    while(true){
        let i = Math.floor(Math.random() * 4);
        let randomMove = randomPiece.moveSet[i][Math.floor(Math.random() *randomPiece.moveSet[i].length)]

        if(randomPiece.moveSet[i].length != 0){
            return {x: randomPiece.x, y: randomPiece.y, toX: randomMove.x, toY: randomMove.y, type: i}
        }
    }
}

function getAllMoves(board, color){
    let r = [];

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            c(x, y);
        }
    }
    function c(x, y){
        const piece = board[x][y];

        if(piece == 6){
            return;
        }

        if(color == "black"){
            if(piece < 9){
                return;
            }
        }else{
            if(piece > 9){
                return;
            }
        }

        const moveSet = getMoveset(board, getTypeFromPieceInt(piece), x, y, true);

        // pawn being promoted
        if(moveSet.length == 0){
            return;
        }

        let hasoptions = false;
        for (let i = 0; i < moveSet.length; i++) {
            if(moveSet[i].length != 0){
                hasoptions = true;
            }
        }

        if(!hasoptions){
            return;
        }

        r.push({
            x: x, 
            y: y,
            moveSet: moveSet
        })
    }

    return r;
}
function splitAllMoveSet(moveset){
    let r = [];

    for (let i = 0; i < moveset.length; i++) {
        const sub = moveset[i].moveSet;

        for (let i2 = 0; i2 < sub.length; i2++) {
            if(i2 == 4){
                continue;
            }

            const moves = sub[i2];

            for (let i3 = 0; i3 < moves.length; i3++) {
                const move = moves[i3];
                r.push({
                    x: moveset[i].x, 
                    y: moveset[i].y, 
                    toX: move.x, 
                    toY: move.y, 
                    type: i2
                })
            }
        }
    }

    return r;
}
function canDoMove(board, fromX, fromY, toX, toY){
    let newBoard = deepCopyBoard(board);
    let white = newBoard[fromX][fromY] < 9;

    newBoard[toX][toY] = newBoard[fromX][fromY]
    newBoard[fromX][fromY] = 6;

    let checks = getCheckedPieces(newBoard, white)

    return checks.length == 0;
}
function deepCopyBoard(board){
    let r = [];

    for (let x = 0; x < 8; x++) {
        r.push([]);
        for (let y = 0; y < 8; y++) {
            r[x][y] = board[x][y];
        }
    }

    return r;
}
function executeBotMove(board, m, save){
    switch (m.type) {
        case 0:
            move(board, m.x, m.y, m.toX, m.toY, save);
            break;
        case 1:
            capture(board, m.x, m.y, m.toX, m.toY, save);
            break;
        case 2:
            let promoteTo = (BOT_COLOR == "black") ? 14 : 4
            promote(board, m.x, m.y, m.toX, m.toY, promoteTo, save);
            break;
        case 3:
            castle(board, m.x, m.y, save);
            break;
    }
}
function getTypeFromPieceInt(piece){
    let i = piece;

    if(piece > 9){
        i = piece - 10;
    }

    return i;
}

function desyncCheck(board){
    let visualBoard = minifyUIBoard();

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y <8; y++) {
            if(visualBoard[x][y] != board[x][y]){
                logError(`UIboard desync on x:${x} y:${y}, attempting to resync`);
                board = minifyUIBoard();
            }
        }
    }
}

function pieceValue(board, x, y){
    let piece = board[x][y];
    piece = (piece > 9) ? piece -= 10 : piece;

    return PIECEWORTH[piece];
}

function invertColor(color){
    return (color == "white") ? "black" : "white";
}