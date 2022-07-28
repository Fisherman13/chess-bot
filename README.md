# chess-bot

## description
A chess engine & UI written in JavaScript.

Note: this engine is not bugless, more bugs are still being found.

## How to use
Download the files and open index.html with any modern browser.

## How it works
The chess engine explores all possible moves 4 levels deep. 
every move is valued based on:
- captures
- a piece square table
- state of the board (check, mate, stalemate)
- pawns, knights and bishops get boosted points early game to encourage the use of them

the tree is then traversed, the highest value of each branch are subtracted, leaving one value for each possible move.
the highest value left will be the move that is played.

## TODO
- en passant
- promotions visually stay pawns by match replays
- proper chess notation
- prevent freezing the UI when making the tree

## future features
- improve end game
- opening book
