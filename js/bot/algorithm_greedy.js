function botgreedy(color){
    let allMoves = getAllMoves(board, color);
    let allKillMoves = getAllKillMoves(allMoves);

    if(allMoves.length == 0){
        return;
    }

    if(allKillMoves.length == 0){
        return botRandom(color);
    }

    // prioritize highest piece worth
    let highestValue = 0;
    let highestValueIndex = 0;
    for (let i = 0; i < allKillMoves.length; i++) {
        if(allKillMoves[i].value > highestValue){
            highestValue = allKillMoves[i].value;
            highestValueIndex = i;
        }
    }

    return allKillMoves[highestValueIndex];
}
function getAllKillMoves(allMoves){
    let r = [];

    for (let i = 0; i < allMoves.length; i++) {
        const moves =  allMoves[i];
        const killMoves = moves.moveSet[1]

        for (let i2 = 0; i2 < killMoves.length; i2++) {
            const killMove = killMoves[i2];

            r.push({
                x: moves.x, 
                y: moves.y, 
                toX: killMove.x, 
                toY: killMove.y, 
                type: 1, 
                value: pieceValue(board, killMove.x, killMove.y)
            });
        }
    }

    return r;
}