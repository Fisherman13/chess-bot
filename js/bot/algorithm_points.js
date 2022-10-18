// gives each possible move a value based on conditions
// the best moves of each side are substracted, the highest value left will be the best move

let treeDepth = 3;
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

    tree.push(allMoves, createBranch(board, allMoves, color));

    createTree(board, tree, i, color);

    minifyTree(tree, 0);

    for (let i = 0; i < treeDepth; i++) {
        traverseTree(tree, null, treeDepth - i, 0);
    }

    // show the weights for debugging
    // console.log(tree);

    let move = allMoves[getMoveIndexFromTree(tree)];
    let endTime = performance.now();
    let ms = endTime - startTime;

    displayStats(movesChecked, ms);

    return move;
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
function createTree(board, tree, i, color){
    if(i == treeDepth){
        return;
    }

    for (let i2 = 0; i2 < tree[1].length; i2++) {
        let newBoard = deepCopyBoard(board);

        executeBotMove(newBoard, tree[1][i2], false);

        let allMoves = splitAllMoveSet(getAllMoves(newBoard, invertColor(color)));

        tree[2][i2].push(allMoves, createBranch(newBoard, allMoves, invertColor(color)));

        // TODO: split up to not freeze UI
        createTree(newBoard, tree[2][i2], i + 1, invertColor(color))
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

function traverseTree(tree, node, target, it){
    if(target == 0){
        return;
    }

    if(it == target){
        node[1] = highest(node[1])
        node[0] = node[0] - node[1];
        node.splice(1,1);

        return;
    }

    if(node == null){
        node = tree;
    }
    for (let i = 0; i < node[1].length; i++) {
        if(node == null){
            traverseTree(tree, tree[1][i], target, it + 1)
        }else{
            traverseTree(tree, node[1][i], target, it + 1)
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
function sum(arr){
    let r = 0;

    for (let i = 0; i < arr.length; i++) {
        r += arr[i][0]
    }

    return r;
}
function getMoveIndexFromTree(tree){
    let highestIndex = 0;
    let highestValue = Number.MIN_SAFE_INTEGER;

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

    let newBoard = deepCopyBoard(board);
    newBoard[toX][toY] = newBoard[fromX][fromY]
    newBoard[fromX][fromY] = 6;
    
    let state = getState(newBoard, invertColor(color));

    p += getSTValue(toX, toY, getTypeFromPieceInt(board[fromX][fromY]), color, 100);

    // in early game prioritize knight, bishop & pawns
    if(cycleCount < 8){
        p = calcEarlygamePoints(getTypeFromPieceInt(board[fromX][fromY]), p);
    }
   
    switch (move.type) {
        case 0:
            p += calcOptions(newBoard, toX, toY)
            break;
        case 1:
            p += pieceValue(board, toX, toY) * 2;
            break;
        case 2: // promotion
            p += 15
            break;
        case 3: // castle
            p += 5;
            break;
    }

    switch (state) {
        case 1:
            p += 1
            break;
        case 2:
            p += 10000;
            break;
        case 3:
            p -= 10;
            break;
    }

    newBoard = null;

    return p;
}

function calcOptions(board, x, y){
    let r = 0;
    const allmoves = getMoveset(board, getTypeFromPieceInt(board[x][y]), x, y, false);

    for (let i = 0; i < allmoves.length; i++) {
        const moveSet = allmoves[i];
        for (let i2 = 0; i2 < moveSet.length; i2++) {
            const move = moveSet[i2];
            
            if(i == 1){ // capture
                r += (pieceValue(board, move.x, move.y) / 3);
                continue;
            }
            if(i == 2){ // promotion
                r += 2;
                continue;
            }
            if(i == 3){ // castle
                r += 2;
                continue;
            }
            // if(i == 4){ // check
            //     r += 10;
            //     continue;
            // }
        }
    }

    return r;
}
function calcEarlygamePoints(type, p){
    switch (type) {
        case 0: // pawn
            return (p *= 2);
        case 2: // knight
            return (p *= 1.5);
        case 3: // bishop
            return (p *= 2);
        default:
            return p;
    }
}

function botPointsSingle(color){
    let allMoves = splitAllMoveSet(getAllMoves(board, color));
    let pointOverview = [];

    if(allMoves.length == 0){
        return;
    }

    let highestPoints = 0;
    let highestPointIndex = 0;

    for (let i = 0; i < allMoves.length; i++) {
        let points = valueMove(board, allMoves[i], color);

        pointOverview.push(points, allMoves[i]);

        if(points > highestPoints){
            highestPoints = points;
            highestPointIndex = i;
        }
    }

    // no best move
    if(highestPoints == 0){
        return botRandom(color);
    }

    console.log(pointOverview);

    return allMoves[highestPointIndex];
}

// unused
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