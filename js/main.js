// TODO:
// stats
// rook & king have moved
// fix bot promotion stuck issues

const PLAYER_COLOR = "white";
const BOT_COLOR = (PLAYER_COLOR == "white") ? "black" : "white";

const COLOR_HOVER = "#fbd287"
const COLOR_KILL = "#f36969";
const COLOR_CASTLE = "rgb(209 90 209)";
const COLOR_PROMOTION = "#952495";
const COLOR_CHECK = "#6e6eff"
const COLOR_MATE = "#2525ff"

const pieceWorth = [1, 5, 3, 3, 9, 0]		// capture worth of the pieces
const BOT_CHECK_DELAY = 100;				// delay at which the program checks if it can make a move
const BOT_MOVE_DELAY = 500;					// delay for the robot to animate it's move

let hasMoved = [false, false, false, false]	// keep track if the rooks & kings have moved for Castling
let toggleMoves = false;					// has a piece been clicked already
let clickedPiece = null;					// what piece has been clicked last

let UIboard = [];							// grid with information for the UI
let	board = [];								// simplefied grid of only numbers

let turnColor = "white"	// white | black 	// keep track of turns
let finishedPromotion = true;				// keep track of the promotion popup
let isBotWaiting = false;					// makes sure the robot waits the full move delay

document.addEventListener('DOMContentLoaded', init)

function init(){
	createUIBoard();

	createInternalBoard();

	if(PLAYER_COLOR == "black"){
		flipBoard();
	}

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

	board = minifyUIBoard();

	let move = botRandom(BOT_COLOR);

	setTimeout(function() {
		if(move == null){
			// TODO finished
			return;
		}

		removeKingHighlight(BOT_COLOR);

		executeBotMove(move)

		isBotWaiting = false;

		if(clickedPiece != null){
			console.log("test");
		}
	}, BOT_MOVE_DELAY);
}
function endTurn(){
	board = minifyUIBoard();

	mateCheck(board, (turnColor == "black"));

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
function flipBoard(){
	// TODO flip the pieces
	// document.getElementById("board").classList.add("flip");

	// let x = document.querySelectorAll(".piece");

	// for (let i = 0; i < x.length; i++) {

	// }
}