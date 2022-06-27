function botRandom(){
    let allMoves = getAllMoves();

    // check for mate
    if(allMoves.length == 0){
        mate(BOT_COLOR)
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
function botgreedy(){
    // kill if able
    // higher values take priority
}
function botMinOpponent(){
    // minimize oponent moves
}

function getAllMoves(){
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

        if(BOT_COLOR == "black"){
            if(piece < 9){
                return;
            }
        }else{
            if(piece > 9){
                return;
            }
        }

        const moveSet = getMoveset(board, getTypeFromPieceInt(piece), x, y);

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
function mergeMoveSets(m1, m2){
    for (let i = 0; i < m2.length; i++) {
        for (let i2 = 0; i2 < m2[i].length; i2++) {
            m1[i].push(m2[i][i2])
        }
    }
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
function executeBotMove(m){
    switch (m.type) {
        case 0:
            move(m.x, m.y, m.toX, m.toY)
            break;
        case 1:
            kill(m.x, m.y, m.toX, m.toY)
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