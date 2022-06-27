// TODO:
// stats

const PLAYER_COLOR = "white";
const BOT_COLOR = (PLAYER_COLOR == "white") ? "black" : "white";

const COLOR_HOVER = "#fbd287"
const COLOR_KILL = "#f36969";
const COLOR_CASTLE = "rgb(209 90 209)";
const COLOR_PROMOTION = "#952495";
const COLOR_CHECK = "#6e6eff"
const COLOR_MATE = "#2525ff"

const pieceWorth = [1, 5, 3, 3, 9, 0]
const BOT_CHECK_DELAY = 100;
const BOT_MOVE_DELAY = 500;

// keep track if the rooks & kings have moved for Castling
let hasMoved = [false, false, false, false]
let toggleMoves = false;
let clickedPiece = null;
let clickedLocation = null;

let UIboard = [];
let	board = [];

let turnColor = "white"	// white | black 	TODO change to white
let finishedPromotion = true;
let isBotWaiting = false;

document.addEventListener('DOMContentLoaded', init)

function init(){
	createUIBoard();

	createInternalBoard();

	createPromotionOverlay();

	colorLegend();

	setInterval(checkBot, BOT_CHECK_DELAY);
}

function logError(msg){
	document.getElementById("error").innerText = msg;
}

function checkBot(){
	if(turnColor != BOT_COLOR) return

	if(isBotWaiting) return

	isBotWaiting = true;

	setTimeout(function() {
		board = minifyBoard();
		mateCheck(board, (turnColor == "white"));

		let move = botRandom();

		if(move == null){
			// TODO finished
			return;
		}

		executeBotMove(move)

		isBotWaiting = false;
	}, BOT_MOVE_DELAY);
}
function endTurn(){
	console.log("ending turn " + turnColor);
	turnColor = (turnColor == "white") ? "black" : "white";
}

function colorLegend(){
	document.getElementById("colorMove").style = `background-color: ${COLOR_HOVER}`
	document.getElementById("colorKill").style = `background-color: ${COLOR_KILL}`
	document.getElementById("colorCastle").style = `background-color: ${COLOR_CASTLE}`
	document.getElementById("colorPromotion").style = `background-color: ${COLOR_PROMOTION}`
	document.getElementById("colorCheck").style = `background-color: ${COLOR_CHECK}`
	document.getElementById("colorMate").style = `background-color: ${COLOR_MATE}`
}