const PITCH_BLACK = "#000000";
const BLACK = "#333333";
const WHITE = "#d2d2d2";
const GREY = "#787878";
const GREEN = "#26ff00";
const RED = "#ff0000";

const FONT_SIZE = 30;
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

function preload() {
  FONT = loadFont("AvenirNextLTPro-Demi.otf");
}

function setup() {
  createCanvas(BLOCK_SIZE * BOARD_ROWS, BLOCK_SIZE * BOARD_ROWS);
}

function draw_rect(rectangle, lineColor, lineWeight, fillColor = null) {
  noFill();
  stroke(lineColor);
  strokeWeight(lineWeight);
  if (fillColor) {
    fill(fillColor);
  }
  rect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
  noFill();
}

function draw_string(string, pos, lineColor, lineWeight, fillColor = null) {
  noFill();
  stroke(lineColor);
  strokeWeight(lineWeight);
  textFont(FONT);
  textSize(FONT_SIZE);
  textAlign(CENTER, CENTER);
  if (fillColor) {
    fill(fillColor);
  } else {
    noFill();
  }
  text(string, pos.x + FONT_SIZE / 2, pos.y + FONT_SIZE / 2);
  noFill();
}

function blockColor(block) {
  return Color.get(
    block.num == 0 ? block.num : block.num / Math.abs(block.num)
  );
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
  draw_rect(selection.block.rect, GREEN, 2);
}
function draw_game(game) {
  clear();
  draw_board(game.board);
  if (game.selection) {
    draw_selection(game.selection);
  }
}
