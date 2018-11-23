function gridCell(squareSize, iIndex, jIndex, numStr, font, fontSize) {
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

gridCell.prototype.selection = function(x, y) {
  // check bounds of mouse input
  if (
    x > this.posX &&
    x < this.posX + this.size &&
    y > this.posY &&
    y < this.posY + this.size
  ) {
    return true;
  } else {
    return false;
  }
};
// this cell is the last selected one
gridCell.prototype.arithmetic = function(previousGridCell) {
  // stacking: same sign numbers can combine
  if (this.num * previousGridCell.num < 0) {
    // will only be negative if they're opposite signs
    this.num += previousGridCell.num;
    this.numString = this.num.toString();
  } // stack numbers
  else {
    if (this.num == 0 && previousGridCell.num < 0) {
      this.num -= 1;
      this.numString = this.num.toString();
      previousGridCell.num += 1;
      previousGridCell.numString = previousGridCell.num.toString();
    } else if (this.num == 0 && previousGridCell.num > 0) {
      this.num += 1;
      this.numString = this.num.toString();
      previousGridCell.num -= 1;
      previousGridCell.numString = previousGridCell.num.toString();
    } else {
      this.num += previousGridCell.num;
      this.numString = this.num.toString();
      previousGridCell.num = 0;
      previousGridCell.numString = previousGridCell.num.toString();
    }
  }
};

gridCell.prototype.display = function() {
  var back_color = 120;
  var font_color = 51;
  if (this.num < 0) {
    back_color = 51;
  } else {
    back_color = 210;
    font_color = 51;
  }

  // cell grid draw for normal color
  if (this.isSelected == false) {
    stroke(2);
    strokeWeight(2);
    fill(color);
    rect(this.posX, this.posY, this.size, this.size);
  } else {
    stroke("#39ff14");
    strokeWeight(2);
    fill(color);
    rect(this.posX, this.posY, this.size, this.size);
  }

  // font draw
  stroke(51);
  textFont(this.font);
  textSize(this.fontSize);
  textAlign(CENTER, CENTER);

  if (this.num > 0) {
    // some black
    fill(51);
  } else {
    // some red
    fill();
  }

  text(this.numString, this.posX + this.size / 2, this.posY + this.size / 2);
};
