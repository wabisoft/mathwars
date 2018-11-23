class Pos {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Block {
  constructor(pos, num) {
    this.pos = pos;
    this.num = num;
  }

  display() {
    back_color = GREY;
    font_color = BLACK;
    outline_color = BLACK;
    outline_weight = 2;
    if (this.num < 0) {
      back_color = BLACK;
    } else {
      back_color = WHITE;
      font_color = WHITE;
    }
    // outline
    stroke();
  }
}
