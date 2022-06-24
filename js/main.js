// TODO:
// legend
// stats
// turns
// the bot part

const PLAYER_COLOR = "black";
const BOT_COLOR = (PLAYER_COLOR == "white") ? "black" : "white";

const COLOR_HOVER = "#fbd287"
const COLOR_KILL = "#f36969";
const COLOR_CASTLE = "rgb(163 255 251)";
const COLOR_PROMOTION = "purple";
const COLOR_CHECK = "#6e6eff"
const COLOR_MATE = "#2525ff"

const pieceWorth = [1, 5, 3, 3, 9, 0]

// keep track if the rooks & kings have moved for Castling
let hasMoved = [false, false, false, false]
let toggleMoves = false;
let clickedPiece = null;
let clickedLocation = null;

let boardEl = null
let board = [];

let isChecked = "none" 	// white | black | none
let turnColor = "none"	// white | black | none
let finished = false;

document.addEventListener('DOMContentLoaded', init)

function init(){
	boardEl = document.getElementById("board");

	createBoard();

	createInternalBoard();

	createPromotionOverlay();

	createLegend();

	startGameCycle();
}

function startGameCycle(){
	turnColor = "white";

	setInterval(cycle, 250)
}
function cycle(){
	
}

function logError(msg){
	document.getElementById("error").innerText = msg;
}

function createLegend(){

}

function endturn(){
	turnColor = (turnColor == "white") ? "black" : "white";

	mateCheck();
}