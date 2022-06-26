// TODO:
// legend
// stats
// turns
// the bot part

const PLAYER_COLOR = "white";
const BOT_COLOR = (PLAYER_COLOR == "white") ? "black" : "white";

const COLOR_HOVER = "#fbd287"
const COLOR_KILL = "#f36969";
const COLOR_CASTLE = "rgb(209 90 209)";
const COLOR_PROMOTION = "#952495";
const COLOR_CHECK = "#6e6eff"
const COLOR_MATE = "#2525ff"

const pieceWorth = [1, 5, 3, 3, 9, 0]

// keep track if the rooks & kings have moved for Castling
let hasMoved = [false, false, false, false]
let toggleMoves = false;
let clickedPiece = null;
let clickedLocation = null;

let UIboard = [];
let	board = [];

let isChecked = "none" 	// white | black | none
let turnColor = "white"	// white | black 	TODO change to white
let finished = false;

document.addEventListener('DOMContentLoaded', init)

function init(){
	createBoard();

	createInternalBoard();

	createPromotionOverlay();

	colorLegend();
}

function logError(msg){
	document.getElementById("error").innerText = msg;
}

function endturn(){
	turnColor = (turnColor == "white") ? "black" : "white";

	mateCheck();

	// let move = botRandom();
	// executeBotMove(board, move[0], move[1])

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