var socket;
//
var myTurn = true;
//
var board;

var selection;
// right now, since I'm overwriting the grid from the board made server side
// there is no reason to make number grid at construction
function makeGrids() {
  this.grid = make2DArray(this.rows, this.columns);
  this.numberGrid = make2DArray(this.rows, this.columns);

  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.columns; j++) {
      let number = getNumber();
      this.grid[i][j] = new gridCell(
        this.squareSize,
        i,
        j,
        number,
        this.font,
        this.fontSize
      );
      this.numberGrid[i][j] = this.grid[i][j].num;
    }
  }
}

// mouse click handling stuff
var thisClickI = 0;
var thisClickJ = 0;
var lastClickI = 0;
var lastClickJ = 0;
var clickCount = 0;

function setup() {
  board = new Board();
  createCanvas(board.squareSize * board.rows, board.squareSize * board.columns);
  console.log(io);
  socket = io.connect("http://tomato.local:3000/");
  socket.on("initMessage", getGrid);
  socket.on("turn", newDraw);
  socket.on("makeSelection", makeSelection);
}

function makeSelection(selectionData, playerId) {}

function getGrid(initData) {
  // console.log("received");
  for (var i = 0; i < board.rows; i++) {
    for (var j = 0; j < board.columns; j++) {
      // set global board to
      board.grid[i][j].num = initData.g[i][j];
      board.grid[i][j].numString = board.grid[i][j].num.toString();
    }
  }
  // set the number array (the data structure we use with server) to be
  // the same as the change board grid of cells.
  board.setNumberGrid();
}

function newDraw(data) {
  myTurn = data.x;

  for (var i = 0; i < board.rows; i++) {
    for (var j = 0; j < board.columns; j++) {
      // set global board to
      board.grid[i][j].num = data.y[i][j];
      board.grid[i][j].numString = board.grid[i][j].num.toString();
    }
  }
  // set the number array (the data structure we use with server) to be
  // the same as the change board grid of cells.
  board.setNumberGrid();
}

function draw() {
  background(51);
  let lastDrawIndexI = 0;
  let lastDrawIndexJ = 0;

  for (var i = 0; i < board.rows; i++) {
    for (var j = 0; j < board.columns; j++) {
      board.grid[i][j].display();
      if (board.grid[i][j].isSelected == true) {
        lastDrawIndexI = i;
        lastDrawIndexJ = j;
      }
    }
  }
  board.grid[lastDrawIndexI][lastDrawIndexJ].display();
}

function mousePressed() {
  console.log("This is the grid array:   ");
  console.log(board.grid);
  console.log("This is the number array:   ");
  console.log(board.numberGrid);
  data = { x: mouseX, y: mouseY };
  socket.emit("mousePressed", data);
  // if (myTurn == true) {
  //   // swap to turn off for draw call
  //   if (clickCount == 1) {
  //     lastClickI = thisClickI;
  //     lastClickJ = thisClickJ;
  //     board.grid[lastClickI][lastClickJ].isSelected = false;
  //   }

  //   for (var i = 0; i < board.rows; i++) {
  //     for (var j = 0; j < board.columns; j++) {
  //       if (board.grid[i][j].selection(mouseX, mouseY)) {
  //         thisClickI = i;
  //         thisClickJ = j;
  //         if (clickCount == 0) {
  //           if (board.grid[i][j].num != 0) {
  //             clickCount += 1;
  //             board.grid[thisClickI][thisClickJ].isSelected = true;
  //           }
  //         }
  //         // do arithmetic
  //         else if (clickCount == 1) {
  //           // I think the bounds of the array can be ignored if i just check each
  //           // of the four cases
  //           if (
  //             (thisClickI + 1 == lastClickI && thisClickJ == lastClickJ) ||
  //             (thisClickI == lastClickI && thisClickJ + 1 == lastClickJ) ||
  //             (thisClickI == lastClickI && thisClickJ - 1 == lastClickJ) ||
  //             (thisClickI - 1 == lastClickI && thisClickJ == lastClickJ)
  //           ) {
  //             board.grid[thisClickI][thisClickJ].arithmetic(
  //               board.grid[lastClickI][lastClickJ]
  //             );
  //             // this can only be reached if a turn has been made
  //             myTurn = false;
  //           }
  //           clickCount += 1;
  //         }
  //       }
  //     }
  //   }
  //   // reset click count every two clicks
  //   if (clickCount == 2) {
  //     clickCount = 0;
  //   }
  // }

  // board.setNumberGrid();

  // if (myTurn == false) {
  //   var data = { x: true, y: board.numberGrid };
  //   socketemit("turn", data);
  // }
}
