// gives each possible move a value based on conditions
// bonus for capturing = value of piece captured
// penalty for getting into ememy line of sight
// bonus for potential capture
// bonus for getting out of ememy line of sight

let treeDepth = 2;
let enemyMoveCount = 0;
let movesChecked;

function botpoints(color){
    let tree = [0];
    let allMoves = splitAllMoveSet(getAllMoves(board, color));
    let i = 0;
    let startTime = performance.now();

    movesChecked = 0;

    if(allMoves.length == 0){
        return;
    }

    if(allMoves.length < 12){
        treeDepth = 3;
    }else{
        treeDepth = 2;
    }

    tree.push(allMoves, createBranch(board, allMoves, color));

    createTree(board, tree, i, color);

    minifyTree(tree, 0);

    for (let i = 0; i < treeDepth; i++) {
        traverseTree(tree, null, treeDepth - i, 0, false);
        traverseTree(tree, null, treeDepth - i, 0, true);
    }

    let move = allMoves[getMoveIndexFromTree(tree)];
    let endTime = performance.now();
    let ms = endTime - startTime;

    displayStats(movesChecked, ms);

    return move;
}
function botPointsSingle(){
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
function createBranch(board, allMoves, color){
    let r = [];

    for (let i = 0; i < allMoves.length; i++) {
        let points = valueMove(board, allMoves[i], color);
        movesChecked++;
        r.push([points]);
    }

    return r;
}
function createTree(board, tree, i, callback, color){
    if(i == treeDepth){
        return;
    }

    for (let i2 = 0; i2 < tree[1].length; i2++) {
        let newBoard = deepCopyBoard(board);

        executeBotMove(newBoard, tree[1][i2], false);

        let allMoves = splitAllMoveSet(getAllMoves(newBoard, invertColor(color)));

        tree[2][i2].push(allMoves, createBranch(newBoard, allMoves, invertColor(color)));

        createTree(newBoard, tree[2][i2], i + 1, callback, invertColor(color))
    }
}
function minifyTree(tree, it){
    if(tree[2] == null){
        return;
    }

    for (let i = 0; i < tree[2].length; i++) {
        minifyTree(tree[2][i], it + 1)
    }

    tree.splice(1, 1);
}

function traverseTree(tree, node, target, it, mode){
    if(target == 0){
        return;
    }

    if(it == target){
        if(mode){
            node[0] = node[0] - node[1];
            node.splice(1,1);
        }else{
            node[1] = highest(node[1])
        }

        return;
    }

    if(node == null){
        node = tree;
    }
    for (let i = 0; i < node[1].length; i++) {
        if(node == null){
            traverseTree(tree, tree[1][i], target, it + 1, mode)
        }else{
            traverseTree(tree, node[1][i], target, it + 1, mode)
        }
    }
}
function highest(arr){
    let r = 0;

    for (let i = 0; i < arr.length; i++) {
        if(arr[i][0] > r){
            r = arr[i][0];
        }
    }

    return r;
}
function getMoveIndexFromTree(tree){
    let highestIndex = 0;
    let highestValue = 0;

    for (let i = 0; i < tree[1].length; i++) {
        if(tree[1][i][0] == highestValue){  // if moves have the same value's pick a random one to avoid repetition
            if(Math.random() < 0.5){
                highestIndex = i;
            }
        }
        if(tree[1][i][0] > highestValue){
            highestValue = tree[1][i][0];
            highestIndex = i;
        }
    }

    return highestIndex;
}

function valueMove(board, move, color){
    let p = 0;
    let fromX = move.x;
    let fromY = move.y;
    let toX = move.toX;
    let toY = move.toY;

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

    let canBeCaptured = isInLineOfSight(newBoard, toX, toY, invertColor(color));

    // potential capture
    if(potentialCapture(newBoard, toX, toY)){
        p += (pieceValue(board, fromX, fromY)) / 1.5;
    }

    // incentivise checking & mate
    let state = getState(newBoard, invertColor(color) == "white");
    if(!canBeCaptured){
        if(state == 1){
            p += 1;
        }

        if(move.type == 2){ // promotion
            p += 5;
        }
    }

    if(state == 2){
        p += 10000;
    }

    // preferebly no draw
    if(state == 3){
        p -= 10;
    }

    if(canBeCaptured){
        p -= (pieceValue(board, fromX, fromY) * 1.2);
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