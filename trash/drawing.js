const PITCH_BLACK = "#000000";
const BLACK = "#333333";
const WHITE = "#d2d2d2";
const GREY = "#787878";
const GREEN = "#26ff00";
const DARK_GREEN = "#083300";
const RED = "#ff0000";
const PURPLE = "#cc00ff";
const DARK_PURPLE = "#290033";
const BLOCK_SIZE = MathWars.BLOCK_SIZE;
const BLOCK_CENTER = MathWars.BLOCK_CENTER;
const BOARD_ROWS = MathWars.BOARD_ROWS;
const BOARD_COLUMNS = MathWars.BOARD_COLUMNS;
const FONT_SIZE = 30;
const MIDDLE = {
  x: (BOARD_ROWS * BLOCK_SIZE) / 2,
  y: (BOARD_COLUMNS * BLOCK_SIZE) / 2
};
const Color = new Map([[1, WHITE], [-1, BLACK], [0, GREY]]);
Object.freeze(Color);
const ComplimentaryColor = new Map([
  [WHITE, BLACK],
  [BLACK, WHITE],
  [GREY, WHITE]
]);
Object.freeze(ComplimentaryColor);

const outline = { color: PITCH_BLACK, weight: 2 };
Object.freeze(outline);

var FONT;

class Drawing {
  constructor(sketch) {
    this.sketch = sketch;
    this.sketch.createCanvas(
      BLOCK_SIZE * BOARD_ROWS + 200,
      BLOCK_SIZE * BOARD_COLUMNS + 200
    );
    this.boardBuffer = this.sketch.createGraphics(
      BLOCK_SIZE * BOARD_ROWS,
      BLOCK_SIZE * BOARD_COLUMNS
    );
    this.my_turn = false;
  }

  draw_rect(rectangle, lineColor, lineWeight, fillColor = null) {
    this.boardBuffer.noFill();
    this.boardBuffer.stroke(lineColor);
    this.boardBuffer.strokeWeight(lineWeight);
    if (fillColor) {
      this.boardBuffer.fill(fillColor);
    }
    this.boardBuffer.rect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
    this.boardBuffer.noFill();
  }

  draw_string(
    string,
    pos,
    lineColor,
    lineWeight,
    fillColor = null,
    fontSize = FONT_SIZE
  ) {
    this.boardBuffer.noFill();
    this.boardBuffer.stroke(lineColor);
    this.boardBuffer.strokeWeight(lineWeight);
    this.boardBuffer.textFont(FONT);
    this.boardBuffer.textSize(fontSize);
    this.boardBuffer.textAlign(CENTER, CENTER);
    if (fillColor) {
      this.boardBuffer.fill(fillColor);
    } else {
      this.boardBuffer.noFill();
    }
    this.boardBuffer.text(string, pos.x + FONT_SIZE / 4, pos.y + FONT_SIZE / 4);
    this.boardBuffer.noFill();
  }

  blockColor(block) {
    return Color.get(block.sign);
  }

  complimentaryBlockColor(block) {
    return ComplimentaryColor.get(this.blockColor(block));
  }

  draw_block(block) {
    this.draw_rect(
      block.rect,
      outline.color,
      outline.weight,
      this.blockColor(block)
    );
    this.draw_string(
      block.num.toString(),
      { x: block.pos.x + BLOCK_CENTER, y: block.pos.y + BLOCK_CENTER },
      this.complimentaryBlockColor(block),
      2,
      this.complimentaryBlockColor(block)
    );
  }

  draw_board(board) {
    board._matrix.forEach(column => {
      column.forEach(block => {
        this.draw_block(block);
      });
    });
  }

  draw_selection(selection) {
    let selectionColor = this.my_turn ? GREEN : PURPLE;
    this.draw_rect(selection.block.rect, selectionColor, 2);
  }

  draw_players(game) {
    let me = game.players[client.socket.id];
    let other = game.getOtherPlayer(me);
    console.log(me);
    this.sketch.fill(this.my_turn ? GREEN : DARK_GREEN);
    this.sketch.ellipse(100, 40, 80, 80);
    let str = this.my_turn ? "It's your turn" : "It's " + other.id + " turn";
    this.sketch.fill(WHITE);
    this.sketch.textSize(FONT_SIZE);
    this.sketch.text(str, 200, 40);
    this.sketch.noFill();
  }

  draw_game(game) {
    this.sketch.clear();
    this.boardBuffer.clear();
    if (game.over) {
      this.draw_game_over(game.reason);
      return;
    }
    if (!game.started) {
      this.draw_string(
        "Waiting for other players...",
        MIDDLE,
        WHITE,
        2,
        BLACK,
        FONT_SIZE
      );
      return;
    }
    this.draw_board(game.board);
    if (game.selection) {
      this.draw_selection(game.selection);
    }
    this.draw_players(game);
    this.sketch.image(this.boardBuffer);
  }

  draw_game_over(reason) {
    let middle = JSON.parse(JSON.stringify(MIDDLE));
    BIG_FONT = FONT_SIZE + 20;
    this.draw_string("Game Over", middle, RED, 3, RED, BIG_FONT);
    middle.y += BIG_FONT;
    this.draw_string(reason, middle, RED, 3, RED, FONT_SIZE);
  }
}
