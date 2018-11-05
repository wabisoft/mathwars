

function gridCell (squareSize, iIndex, jIndex, numStr, font, fontSize) {
  this.posX = iIndex * squareSize;
  this.posY = jIndex * squareSize;
  this.color;
  this.size = squareSize;
  this.font = font;
  this.fontSize = fontSize;
  this.numString = numStr;
  this.num = parseInt(this.numString, 10);
  this.isSelected = false;
}

gridCell.prototype.selection = function(x,y)
{
  // check bounds of mouse input
  if (x > this.posX && x < this.posX + squareSize && y > this.posY && y < this.posY + squareSize)
  {
    return true;
  }
  else
  {
    return false;
  }
}

gridCell.prototype.arithmetic = function(previousGridCell)
{
  // this cell is the last selected one
  // check cases, only allow if they have opposite signs
  // operation should always be addition
  if(this.num>0 && previousGridCell.num < 0)
  {
    this.num += previousGridCell.num;
    this.numString = this.num.toString();

    // balance increment/decrement
    previousGridCell.num += 1;
    previousGridCell.numString = previousGridCell.num.toString();
  }

  else if (this.num < 0 && previousGridCell.num > 0)
  {
    this.num += previousGridCell.num;
    this.numString = this.num.toString();

    // balance increment/decrement
    previousGridCell.num -= 1;
    previousGridCell.numString = previousGridCell.num.toString();
  }

}

gridCell.prototype.display = function()
{
  if (this.num < 0)
  {
    this.color = 51;
  }

  else if (this.num == 0)
  {
    this.color = 120;
  }
  else
  {
    this.color = 210;
  }

  // cell grid draw for normal color
  if (this.isSelected == false)
  {
    stroke(2);
    strokeWeight(2);
    fill(this.color);
    rect(this.posX, this.posY, squareSize, squareSize);
  }
  else
  {
    stroke("#39ff14");
    strokeWeight(2);
    fill(this.color);
    rect(this.posX, this.posY, squareSize, squareSize);
  }


  // font draw
  stroke(51)
  textFont(this.font);
  textSize(this.fontSize);
  textAlign(CENTER, CENTER);

  if (this.num > 0)
  {
    // some blue
    fill('#4169e1');
  }
  else
  {
    // some red
    fill('#F67280');
  }

  text(this.numString, this.posX + this.size/2, this.posY + this.size/2 )
}
