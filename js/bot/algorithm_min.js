function botMinOpponent(color){
    const startTime = performance.now();
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

    displayStats(`Minimizer took ${((performance.now() - startTime) / 1000).toFixed(2)}ms`);

    return allMoves[leastMovesIndex];
}