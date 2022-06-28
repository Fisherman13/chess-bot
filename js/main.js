// TODO:
// rook & king have moved
// non player color ckeck/mate problem
// only calculate hovers 1 time
// stats
// log all moves > E4 to bla bla

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

const BOARD_LAYOUT = [
	["a8","b8","c8","d8","e8","f8","g8","h8"],
	["a7","b7","c7","d7","e7","f7","g7","h7"],
	["a6","b6","c6","d6","e6","f6","g6","h6"],
	["a7","b7","c7","d7","e7","f7","g7","h7"],
	["a4","b4","c4","d4","e4","f4","g4","h4"],
	["a3","b3","c3","d3","e3","f3","g3","h3"],
	["a2","b2","c2","d2","e2","f2","g2","h2"],
	["a1","b1","c1","d1","e1","f1","g1","h1"]
]

let hasMoved = [false, false, false, false, false, false]	// keep track if the rooks & kings have moved for Castling
let clickedPiece = null;					// what piece has been clicked last

let UIboard = [];							// grid with information for the UI
let	board = [];								// simplefied grid of only numbers
let moveList = [];							// list af all moves made in a game
let cycleCount = 0;							// used to iterate movelist

let turnColor = "white"	// white | black 	// keep track of turns
let finishedPromotion = true;				// keep track of the promotion popup
let promoteTo = "";							// what a piece will be promoted to, if empty the user can choose, bot automaticly selects the queen
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

	setInterval(botCheck, BOT_CHECK_DELAY);
}

function botCheck(){
	if(turnColor != BOT_COLOR) return;

	if(isBotWaiting) return;

	if(!finishedPromotion) return;

	isBotWaiting = true;

	let move = botRandom(BOT_COLOR);

	setTimeout(function() {
		if(move == null){
			// TODO finished
			return;
		}

		removeKingHighlight(BOT_COLOR);

		executeBotMove(move)

		isBotWaiting = false;

		endTurn();
	}, BOT_MOVE_DELAY);
}
function endTurn(){
	syncUI(board)

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