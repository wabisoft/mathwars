(function(exports) {
  const SERVER_HOST = "tomato.local";
  const SERVER_PORT = "3000";
  const MAX_VALUE = 20;
  const BOARD_ROWS = 7;
  const BOARD_COLUMNS = 7;
  const SERVER_ADDR = SERVER_HOST + ":" + SERVER_PORT;
  const BLOCK_SIZE = 80;
  const BLOCK_CENTER = BLOCK_SIZE / 2;
  exports.SERVER_ADDR = SERVER_ADDR;
  exports.BLOCK_SIZE = BLOCK_SIZE;
  exports.BLOCK_CENTER = BLOCK_CENTER;
  exports.BOARD_ROWS = BOARD_ROWS;
  exports.BOARD_COLUMNS = BOARD_COLUMNS;

  function Matrix(rows, columns) {
    return new Array(rows).fill(null).map(function() {
      return new Array(columns);
    });
  }

  function my_random(lower = 0, upper = MAX_VALUE, signed = true) {
    var num = Math.floor(Math.random() * (upper - lower + 1)) + lower;
    return Math.random() > 0.5 && signed ? num * -1 : num;
  }

  class Block {
    constructor(index, num) {
      this.index = index;
      this.pos = { x: index.x * BLOCK_SIZE, y: index.y * BLOCK_SIZE };
      this.num = num;
    }

    get sign() {
      return this.num == 0 ? this.num : this.num / Math.abs(this.num);
    }

    get rect() {
      return {
        x: this.pos.x,
        y: this.pos.y,
        w: BLOCK_SIZE,
        h: BLOCK_SIZE
      };
    }
  }

  class Board {
    constructor(rows = BOARD_ROWS, columns = BOARD_COLUMNS, matrix = null) {
      this.rows = rows;
      this.columns = columns;
      this._matrix = Matrix(this.rows, this.columns);
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          let blockIndex = matrix ? matrix[i][j].index : { x: i, y: j };
          let blockNum = matrix ? matrix[i][j].num : my_random();
          this._matrix[i][j] = new Block(blockIndex, blockNum);
        }
      }
    }

    getBlockAtPos(pos) {
      let index = {
        x: Math.floor(pos.x / BLOCK_SIZE),
        y: Math.floor(pos.y / BLOCK_SIZE)
      };
      if (
        index.x < this.rows &&
        index.x >= 0 &&
        index.y < this.columns ** index.y >= 0
      ) {
        return this._matrix[index.x][index.y];
      }
      return null;
    }

    getBlockAtIndex(index) {
      if (index.x < this.rows && index.y < this.columns) {
        return this._matrix[index.x][index.y];
      }
      return null;
    }

    get numMatrix() {
      var retMatrix = Matrix(this.rows, this.columns);
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          retMatrix[i][j] = this._matrix[i][j];
        }
      }
      return retMatrix;
    }
  }

  class Player {
    constructor(id, canMove = false, sign = null) {
      this.id = id;
      this.canMove = canMove;
      this.sign = sign;
    }
  }

  class Selection {
    constructor(block) {
      this.block = block;
    }
  }

  class Game {
    constructor(gameData = null) {
      if (gameData) {
        let boardData = gameData.board;
        this.board = new Board(
          boardData.rows,
          boardData.columns,
          boardData._matrix
        );
        this.players = {};
        for (let playerId in gameData.players) {
          let playerData = gameData.players[playerId];
          this.players[playerId] = new Player(
            playerId,
            playerData.canMove,
            playerData.sign
          );
        }
        if (gameData.selection) {
          let blockData = gameData.selection.block;
          let block = this.board.getBlockAtIndex(blockData.index);
          this.selection = new Selection(block);
        }
      } else {
        this.board = new Board();
        this.players = {};
        this.selection = null;
      }
    }

    registerPlayer(playerId) {
      if (Object.keys(this.players).length >= 2) {
        return false;
      }
      this.players[playerId] = new Player(playerId);
      let playerKeys = Object.keys(this.players);
      if (playerKeys.length >= 2) {
        // Thanks SO
        // https://stackoverflow.com/a/15106541
        let player = this.players[
          playerKeys[(playerKeys.length * Math.random()) << 0]
        ];
        player.canMove = true;
        console.log("It's " + player.id + " 's turn");
      }
      console.log(playerId + " connected!");
      return true;
    }

    unregisterPlayer(playerId) {
      delete this.players[playerId];
      console.log(playerId + " disconnected!");
    }

    start() {
      startPlayer = this.players.values()[0];
      startPlayer.canMove = True;
      this.playersList[0].canMove = true;
    }

    preload() {}

    mousePressed(mouse, playerId) {
      let player = this.players[playerId];
      if (!player || !player.canMove) {
        return;
      }
      let block = this.board.getBlockAtPos(mouse);
      if (!block) {
        return;
      }
      if (!this.selection) {
        this.selection = new Selection(block);
      } else if (block.index == this.selection.block.index) {
        delete this.selection;
      } else {
        // TODO: check that block is within range of selection
        block.num += this.selection.block.num;
        delete this.selection;
        this.endTurn(player);
      }
    }

    endTurn(player) {
      let otherPlayers = Object.keys(this.players).filter(
        id => id !== player.id
      );
      let otherPlayerKey = otherPlayers[0];
      let otherPlayer = this.players[otherPlayerKey];
      player.canMove = false;
      otherPlayer.canMove = true;
    }
  }
  exports.Game = Game;
})(typeof exports === "undefined" ? (this["MathWars"] = {}) : exports);
