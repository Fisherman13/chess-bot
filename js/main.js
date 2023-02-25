const VERSION = "1.2.0"

const COLOR_HOVER = "#fbd287"
const COLOR_CAPTURE = "#f36969";
const COLOR_CASTLE = "rgb(209 90 209)";
const COLOR_PROMOTION = "#952495";
const COLOR_CHECK = "rgb(110, 110, 255)"
const COLOR_MATE = "rgb(37, 37, 255)"
const COLOR_PREV_MOVE = "rgb(255 152 0)"

const SQUARE_WIDTH = 60;					// square size of the board in px
const BOARD_WIDTH = (SQUARE_WIDTH * 8) + 2;	// total with of the board

const PIECEWORTH = [1, 5, 3, 3, 9, 0]		// capture worth of the pieces
const BOT_CHECK_DELAY = 100;				// delay at which the program checks if it can make a move
const BOT_MOVE_DELAY = 500;					// delay for the robot to animate it's move
const TIME_UPDATE_DALAY = 250;				// interval in witch the timer will update
const REPLAY_SPEED = 1000;

const BOARD_LAYOUT = [
	["a8","b8","c8","d8","e8","f8","g8","h8"],
	["a7","b7","c7","d7","e7","f7","g7","h7"],
	["a6","b6","c6","d6","e6","f6","g6","h6"],
	["a5","b5","c5","d5","e5","f5","g5","h5"],
	["a4","b4","c4","d4","e4","f4","g4","h4"],
	["a3","b3","c3","d3","e3","f3","g3","h3"],
	["a2","b2","c2","d2","e2","f2","g2","h2"],
	["a1","b1","c1","d1","e1","f1","g1","h1"]
]

let playerColor = "white";
let botColor = "black";

let hasMoved = [false, false, false, false, false, false]	// keep track if the rooks & kings have moved for Castling
let clickedPiece = null;					// what piece has been clicked last

let UIboard = [];							// grid with information for the UI
let	board = [];								// simplified grid of only numbers
let moveList = [];							// list af all moves made in a game
let cycleCount = 0;							// used to iterate movelist
let captured = [[],[]];						// keep track of captured pieces

let turnColor = "white"					 	// keep track of turns white | black
let finishedPromotion = true;				// keep track of the promotion popup
let promoteTo = "";							// what a piece will be promoted to, if empty the user can choose, bot automaticly selects the queen
let isBotWaiting = false;					// makes sure the robot waits the full move delay
let isHighlighting = false;					// this prevents highlights being cleared multiple times
let startTime = new Date().getTime();
let time = [0, 0];							// time in ms elapsed for each color
let timeInterval = null;					// interval that updates the paytime
let botMode = "subtraction";

document.addEventListener('DOMContentLoaded', init)

function init(){
	createUIBoard();
	initOptions();
	createInternalBoard();

	if(playerColor == "black"){
		flipBoard();
	}

	createPromotionOverlay();
	colorLegend();
	setInterval(botCheck, BOT_CHECK_DELAY);
	startTimer();
	setVersion();
}

function botCheck(){
	if(turnColor != botColor) return;

	if(isBotWaiting) return;

	if(!finishedPromotion) return;

	isBotWaiting = true;

	setTimeout(function() {
		// check if endgame has begun
		if(cycleCount > 20){
			PST_B[5] = kie;
		}

		// change algorithm here
		//let move = botpoints2(botColor);

		let move;
		switch(botMode){
			case "minimax":
				move = botMinimax(botColor)
				break;
			case "subtraction":
				move = botpoints(botColor)
				break;
			case "minimizer":
				move = botMinOpponent(botColor)
				break;
			case "greedy":
				move = botgreedy(botColor)
				break;
			case "spoints":
				move = botPointsSingle(botColor)
				break;
			case "random":
				move = botRandom(botColor)
				break;
			default:
				move = botRandom(botColor)
				break;
		}

		if(move == null){
			// finished
			return;
		}

		removeHighlight(true);

		executeBotMove(board, move, true)

		syncUI();

		isBotWaiting = false;

		endTurn();
	}, BOT_MOVE_DELAY);
}
function endTurn(){
	syncUI(board);

	mateCheck(board, (turnColor == "black"));

	desyncCheck(board);

	updateTime();

	turnColor = (turnColor == "white") ? "black" : "white";
}
function startTimer(){
	timeInterval = setInterval(updateTime, TIME_UPDATE_DALAY);
}
function updateTime(){
	let curTime = new Date().getTime();

	time[(turnColor == "white") ? 0 : 1] += curTime - startTime;
	
	startTime = curTime;

	updateTimeEl();
}
function updateTimeEl(){
	let t = (turnColor == "white") ? "W" : "B";
	let timeInMs  = time[(turnColor == "white") ? 0 : 1];
	let ms = timeInMs % 1000;
	let sec = Math.floor((timeInMs / 1000) % 60);
	let min = Math.floor((timeInMs / (60 * 1000)) % 60);

	document.getElementById(`time${t}`).innerText = `${formatSeconds(min)}:${formatSeconds(sec)}:${ formatMiliseconds(ms)}`;
}
function formatSeconds(t){
	return (t < 10) ? "0" + t : t
}
function formatMiliseconds(t){
	if(t < 10){
		return "00" + t
	}else if(t < 100){
		return "0" + t
	}

	return t;
}

function colorLegend(){
	let classes = [
		["color-move", COLOR_HOVER],
		["color-capture", COLOR_CAPTURE],
		["color-castle", COLOR_CASTLE],
		["color-promotion", COLOR_PROMOTION],
		["color-check", COLOR_CHECK],
		["color-mate", COLOR_MATE],
	];

	for (let i = 0; i < classes.length; i++) {
		let els = document.getElementsByClassName(classes[i][0]);

		for (let i2 = 0; i2 < els.length; i2++) {
			els[i2].style.color = classes[i][1];
		}
	}
}
function flipBoard(){
	document.getElementById("board").classList.toggle("flip");

	let x = document.querySelectorAll(".piece");

	for (let i = 0; i < x.length; i++) {
		x[i].classList.toggle("flip-piece");
	}
}
function setVersion(){
	document.getElementById("footer").innerText += (` (js: ${VERSION})`)
}
function resign(){
	winner("resign");
	highlightKing((botColor == "black"), true);
	toggleResign(false);

	if(!moveList.includes("resign")){
		moveList.push("resign")
	}
}