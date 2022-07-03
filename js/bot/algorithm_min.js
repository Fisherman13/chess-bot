function botMinOpponent(color){
    let allMoves = splitAllMoveSet(getAllMoves(board, color));

    if(allMoves.length == 0){
        return;
    }

    let leastMoves = Number.MAX_SAFE_INTEGER;
    let leastMovesIndex = 0;

    for (let i = 0; i < allMoves.length; i++) {
        const move = allMoves[i];

        let newBoard = deepCopyBoard(board);

        executeBotMove(newBoard, move, false);
        
        let moveCount = getAllMoves(newBoard, (color == "white") ? "black" : "white").length;

        if(moveCount < leastMoves){
            leastMoves = moveCount;
            leastMovesIndex = i;
        }
    }

    return allMoves[leastMovesIndex];
}