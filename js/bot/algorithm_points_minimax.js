function botMinimax(color){
    const options = getAllOptions(board, color);
    const startTime = performance.now();
    const turn = playerColor == "white";

    let best = -Infinity;
    let bestIndex = 0;

    movesChecked = 0;
    treeDepth = 3;
    
    for (let i = 0; i < options.length; i++) {
        let score = minimax(options[i], 1, turn, -Infinity, Infinity);
        if(score > best){
            best = score;
            bestIndex = i;
        }
    }

    displaySimStats(movesChecked, (performance.now() - startTime));

    const moves = splitAllMoveSet(getAllMoves(board, color));
    return moves[bestIndex];
}
function minimax(board, depth, isMaximizing, alpha, beta){
    const options = getAllOptions(board, !isMaximizing);
    let value = valueBoard(board);
    
    // return if a player has won or lost
    if(value == Infinity || value == -Infinity){
        return value;
    }

    // return if the maximum depth has been reached
    if(depth == treeDepth){
        return value;
    }

    if(isMaximizing){
        let bestScore = -Infinity;

        for (let i = 0; i < options.length; i++) {
            let score = minimax(options[i], depth + 1, !isMaximizing, alpha, beta);
            
            movesChecked++;
            bestScore = Math.max(bestScore, score);
            alpha = Math.max(alpha, bestScore);

            // Alpha Beta Pruning
            if (beta <= alpha){
                break;
            }
        }

        return bestScore;
    }else{
        let bestScore = Infinity;

        for (let i = 0; i < options.length; i++) {
            let score = minimax(options[i], depth + 1, !isMaximizing, alpha, beta);
            
            movesChecked++;
            bestScore = Math.min(bestScore, score);
            beta = Math.min(beta, bestScore);
   
            // Alpha Beta Pruning
            if (beta <= alpha){
                break;
            }
        }

        return bestScore;
    }
}
function getAllOptions(board, color){
    let o = [];
    const moves = splitAllMoveSet(getAllMoves(board, color));

    for (let i = 0; i < moves.length; i++) {
        let newBoard = deepCopyBoard(board);
        executeBotMove(newBoard, moves[i], false);
        o.push(newBoard)
    }

    return o;
}
function colorFromBool(b){
    return (b) ? "white" : "black";
}
function valueBoard(board){
    let p = 0;
    let state = getState(board, invertColor(playerColor));

    switch (state) {
        case 1:
            p += 0.5
            break;
        case 2:
            p += Infinity;
            break;
        case 3:
            p -= 100;
            break;
    }

    let pieceTotal = 0;
    for (let col = 0; col < 8; col++) {
        for (let row = 0; row < 8; row++) {
            const piece = board[col][row]

            if(piece == 6){
                continue;
            }

            if(playerColor == "white"){
                if(piece > 9){
                    continue;
                }
            }else{
                if(piece < 9){
                    continue;
                }
            }

            p += getSTValue(col, row, getTypeFromPieceInt(board[col][row]), playerColor, 100);
            pieceTotal += pieceValue(board, col, row);
        }
    }

    p += pieceTotal / 10;

    return p;
}