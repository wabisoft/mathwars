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
var boardBuffer;
var uiBuffer;

const ComplimentaryColor = new Map([
  [WHITE, BLACK],
  [BLACK, WHITE],
  [GREY, WHITE]
]);
Object.freeze(ComplimentaryColor);

const outline = { color: PITCH_BLACK, weight: 2 };
Object.freeze(outline);

var FONT;

function setup() {
  createCanvas(BLOCK_SIZE * BOARD_ROWS + 200, BLOCK_SIZE * BOARD_COLUMNS + 200);
  boardBuffer = createGraphics(
    BLOCK_SIZE * BOARD_ROWS,
    BLOCK_SIZE * BOARD_COLUMNS
  );
  // createCanvas(BLOCK_SIZE * BOARD_ROWS, BLOCK_SIZE * BOARD_COLUMNS);
}

function draw_rect(rectangle, lineColor, lineWeight, fillColor = null) {
  boardBuffer.noFill();
  boardBuffer.stroke(lineColor);
  boardBuffer.strokeWeight(lineWeight);
  if (fillColor) {
    boardBuffer.fill(fillColor);
  }
  boardBuffer.rect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
  boardBuffer.noFill();
}

function draw_string(
  string,
  pos,
  lineColor,
  lineWeight,
  fillColor = null,
  fontSize = FONT_SIZE
) {
  boardBuffer.noFill();
  boardBuffer.stroke(lineColor);
  boardBuffer.strokeWeight(lineWeight);
  boardBuffer.textFont(FONT);
  boardBuffer.textSize(fontSize);
  boardBuffer.textAlign(CENTER, CENTER);
  if (fillColor) {
    boardBuffer.fill(fillColor);
  } else {
    boardBuffer.noFill();
  }
  boardBuffer.text(string, pos.x + FONT_SIZE / 4, pos.y + FONT_SIZE / 4);
  boardBuffer.noFill();
}

function blockColor(block) {
  return Color.get(block.sign);
}

function complimentaryBlockColor(block) {
  return ComplimentaryColor.get(blockColor(block));
}

function draw_block(block) {
  draw_rect(block.rect, outline.color, outline.weight, blockColor(block));
  draw_string(
    block.num.toString(),
    { x: block.pos.x + BLOCK_CENTER, y: block.pos.y + BLOCK_CENTER },
    complimentaryBlockColor(block),
    2,
    complimentaryBlockColor(block)
  );
}

function draw_board(board) {
  board._matrix.forEach(column => {
    column.forEach(block => {
      draw_block(block);
    });
  });
}

function draw_selection(selection) {
  let selectionColor = my_turn ? GREEN : PURPLE;
  draw_rect(selection.block.rect, selectionColor, 2);
}

function draw_players(game) {
  let me = game.players[client.socket.id];
  let other = game.getOtherPlayer(me);
  console.log(me);
  fill(my_turn ? GREEN : DARK_GREEN);
  elipse(100, 40, 80, 80);
  fill(my_turn ? DARK_PURPLE : PURPLE);
  rect(50, 580, 80, 80);
}

function draw_game(game) {
  boardBuffer.clear();
  if (game.over) {
    draw_game_over(game.reason);
    return;
  }
  if (!game.started) {
    draw_string(
      "Waiting for other players...",
      MIDDLE,
      WHITE,
      2,
      BLACK,
      FONT_SIZE
    );
    return;
  }
  draw_board(game.board);
  if (game.selection) {
    draw_selection(game.selection);
  }
  draw_players(game);
}

function draw_game_over(reason) {
  let middle = clone(MIDDLE);
  BIG_FONT = FONT_SIZE + 20;
  draw_string("Game Over", middle, RED, 3, RED, BIG_FONT);
  middle.y += BIG_FONT;
  draw_string(reason, middle, RED, 3, RED, FONT_SIZE);
}
