function botgreedy(color){
    const startTime = performance.now();
    let allMoves = getAllMoves(board, color);
    let allCaptureMoves = getAllCaptureMoves(allMoves);

    if(allMoves.length == 0){
        return;
    }

    if(allCaptureMoves.length == 0){
        return botRandom(color);
    }

    // prioritize highest piece worth
    let highestValue = 0;
    let highestValueIndex = 0;
    for (let i = 0; i < allCaptureMoves.length; i++) {
        if(allCaptureMoves[i].value > highestValue){
            highestValue = allCaptureMoves[i].value;
            highestValueIndex = i;
        }
    }

    displayStats(`Greedy took ${((performance.now() - startTime) / 1000).toFixed(2)}ms`);

    return allCaptureMoves[highestValueIndex];
}
function getAllCaptureMoves(allMoves){
    let r = [];

    for (let i = 0; i < allMoves.length; i++) {
        const moves =  allMoves[i];
        const captureMoves = moves.moveSet[1]

        for (let i2 = 0; i2 < captureMoves.length; i2++) {
            const captureMove = captureMoves[i2];

            r.push({
                x: moves.x, 
                y: moves.y, 
                toX: captureMove.x, 
                toY: captureMove.y, 
                type: 1, 
                value: pieceValue(board, captureMove.x, captureMove.y)
            });
        }
    }

    return r;
}