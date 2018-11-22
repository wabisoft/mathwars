var myTurn = true;

var columns = 5;
var rows = 5;
var squareSize = 120;
var grid;
var fontSize = 40;
var font;

// mouse click handling stuff
var thisClickI = 0;
var thisClickJ = 0;
var lastClickI = 0;
var lastClickJ = 0;
var clickCount = 0;

function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = loadFont('AvenirNextLTPro-Demi.otf');
}

function setup()
{
  // init canvas
  createCanvas(squareSize*rows, squareSize*columns);

  // make an array to hold the cells, then make a cell at each j index
  grid = make2DArray (rows, columns);
  for (var i = 0; i< rows; i++)
  {
    for(var j = 0; j< rows; j++)
    {
      var number = getNumber();
      grid[i][j] = new gridCell(squareSize, i, j, number, font, fontSize);
    }
  }
}

// DISPLAY FOR CLIENT SIDE
function draw()
{
  background(51);
  let lastDrawIndexI = 0;
  let lastDrawIndexJ = 0;

  for (var i = 0; i< rows; i++)
  {
    for(var j = 0; j< rows; j++)
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

    for (var i = 0; i< rows; i++)
    {
      for(var j = 0; j< rows; j++)
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

// gloabl p5 function ... wass going to use this for swiping tiles I think
function mouseMoved()
{
  return false;
}

function make2DArray (rows, columns)
{
  // of size rows
  var arr = new Array(rows);

  for (var i = 0; i < arr.length; i++)
  {
    // of size columns
    arr[i] = new Array (columns);
  }
  return arr;
}

// makes a random number on our number range, randomly assigns it -tive, +tive
function getNumber ()
{
  // Math.floor(random(min, max)) + min
  var num = Math.floor(random(1, 20)) + 1;
  var num2 = random();
  if(num2 > 0.5)
  {
    num *= -1;
  }
  num = num.toString();
  return num;
}
