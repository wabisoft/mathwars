var myTurn = true;
// for drawing and logic
var grid;
// for server communication
var numberGrid;

// mouse click handling stuff
var thisClickI = 0;
var thisClickJ = 0;
var lastClickI = 0;
var lastClickJ = 0;
var clickCount = 0;

function setup()
{
  // socket = io.connect('http://ian.local:3000/');
  // socket.on('board', gridInit);

  board = new board();
  console.log(board.numberGrid);
  createCanvas(board.squareSize*board.rows, board.squareSize*board.columns);
  grid = board.grid;
}

function gridInit()
{
  ;
}

// DISPLAY FOR CLIENT SIDE
function draw()
{
  background(51);
  let lastDrawIndexI = 0;
  let lastDrawIndexJ = 0;

  for (var i = 0; i< board.rows; i++)
  {
    for(var j = 0; j< board.columns; j++)
    {
      grid[i][j].display();
      if(grid[i][j].isSelected == true)
      {
        lastDrawIndexI = i;
        lastDrawIndexJ = j;
      }
    }
  }
  grid[lastDrawIndexI][lastDrawIndexJ].display();
}

// LOGIC FOR CLIENT SIDE
function mousePressed()
{
  if(myTurn == true)
  {
    // swap to turn off for draw call
    if(clickCount == 1)
    {
      lastClickI = thisClickI;
      lastClickJ = thisClickJ;
      grid[lastClickI][lastClickJ].isSelected = false;
    }

    for (var i = 0; i< board.rows; i++)
    {
      for(var j = 0; j< board.columns; j++)
      {
        if (grid[i][j].selection(mouseX, mouseY))
        {
          thisClickI = i;
          thisClickJ = j;
          if(clickCount == 0)
          {
            if(grid[i][j].num != 0)
            {
              clickCount += 1
              grid[thisClickI][thisClickJ].isSelected = true;
            }
          }
          // do arithmetic
          else if (clickCount == 1)
          {
            // I think the bounds of the array can be ignored if i just check each
            // of the four cases
            if((thisClickI + 1 == lastClickI && thisClickJ == lastClickJ) ||
               (thisClickI == lastClickI && thisClickJ + 1 == lastClickJ) ||
               (thisClickI == lastClickI && thisClickJ - 1 == lastClickJ) ||
               (thisClickI - 1 == lastClickI && thisClickJ == lastClickJ))
            {
              grid[thisClickI][thisClickJ].arithmetic(grid[lastClickI][lastClickJ]);
              // temp place for server emit
              board.setGrids(grid);
              console.log(board.numberGrid);
              // myTurn = true; // where to emit data I think
            }
            clickCount += 1
          }
        }
      }
    }
    // reset click count every two clicks
    if(clickCount == 2)
    {
      clickCount = 0;
    }
  }
}
