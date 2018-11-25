class Game {
  constructor() {
    this.players = new Map();
    this.board = new Board();
    this.selection = null;
  }

  registerPlayer(playerId) {
    if (this.players.size == 2) {
      return false;
    }
    this.players.set(playerId, new Player(playerId));
    console.log("Registered new player with id " + playerId);
    return true;
  }

  start() {
    startPlayer = this.players.values()[0];
    startPlayer.canMove = True;
    this.playersList[0].canMove = true;
  }

  preload() {}

  mousePressed(mouse) {
    let block = this.board.getBlockAtPos(mouse);
    if (!block) {
      return;
    }
    if (!this.selection) {
      this.selection = new Selection(block);
    } else if (block.index == this.selection.block.index) {
      delete this.selection;
    } else if (block.color == this.selection.block.color) {
    }
  }
}
