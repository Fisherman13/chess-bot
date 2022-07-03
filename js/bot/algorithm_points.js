// gives each possible move a value based on conditions
// bonus for capturing = value of piece captured
// penalty for getting into ememy line of sight
// bonus for minimizing ememy move possibilities
// bonus for potential capture
// bonus for getting out of ememy line of sight

let enemyMoveCount = 0;
function botpoints(color){
    let allMoves = splitAllMoveSet(getAllMoves(board, color));
    enemyMoveCount = splitAllMoveSet(getAllMoves(board, invertColor(color))).length;

    if(allMoves.length == 0){
        return;
    }

    let highestPoints = 0;
    let highestPointIndex = 0;

    for (let i = 0; i < allMoves.length; i++) {
        let points = valueMove(allMoves[i], color);

        if(points > highestPoints){
            highestPoints = points;
            highestPointIndex = i;
        }
    }

    // no best move
    if(highestPoints == 0){
        return botRandom(color);
    }

    return allMoves[highestPointIndex];
}


function valueMove(move, color){
    let p = 0;
    let fromX = move.x;
    let fromY = move.y;
    let toX = move.toX;
    let toY = move.toY;

    let canBeCaptured = false;

    if(move.type == 1){
        p += pieceValue(board, toX, toY);
    }

    // incentivise getting out of the way if the piece can be captured
    if(isInLineOfSight(board, fromX, fromY, invertColor(color))){
        p += pieceValue(board, fromX, fromY);
    }

    // can this move be captured
    let newBoard = deepCopyBoard(board);
    newBoard[toX][toY] = newBoard[fromX][fromY]
    newBoard[fromX][fromY] = 6;

    canBeCaptured = isInLineOfSight(newBoard, toX, toY, invertColor(color));

    // potential capture
    if(potentialCapture(newBoard, toX, toY)){
        p += (pieceValue(board, fromX, fromY)) / 4;
    }

    // incentivise checking
    const checks =  getCheckedPieces(newBoard, (invertColor(color) == "white"))
    for (let i = 0; i < checks.length; i++) {
        if(checks[i].x == toX && checks[i].y == toY){
            if(!canBeCaptured){
                p += 5;
            }
        }
    }
    

    let newEnemyMoveCount = splitAllMoveSet(getAllMoves(newBoard, invertColor(color))).length;
    if(newEnemyMoveCount < enemyMoveCount){
        p += ((newEnemyMoveCount - enemyMoveCount) / 5)
    }

    if(canBeCaptured){
        p -= (pieceValue(board, fromX, fromY) / 2);
    }

    newBoard = null;

    return p;
}

function isInLineOfSight(board, x, y, color){
    let allMoves = getAllMoves(board, color);

    for (let i = 0; i < allMoves.length; i++) {
        const moveSet = allMoves[i].moveSet;

        for (let i2 = 0; i2 < moveSet.length; i2++) {
            if(i2 == 1 || i2 == 0){
                const moves = moveSet[i2];
                for (let i3 = 0; i3 < moves.length; i3++) {
                    const move = moves[i3];
                    
                    if(move.x == x && move.y == y){
                        return true;
                    }
                }
            }
        }
    }
    
    return false;
}

function potentialCapture(board, x, y){
    const moveSet = getMoveset(board, board[x][y], x, y, false);
    let v = 0;

    for (let i = 0; i < moveSet.length; i++) {
        if(i == 1){
            const moves = moveSet[i];
            for (let i2 = 0; i2 < moves.length; i2++) {
                const move = moves[i2];
                v += pieceValue(board, move.x, move.y);
            }
        }
    }
    
    return v;
}