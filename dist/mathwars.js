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

  const MOVE_VECTORS = [
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: -1 }
  ];

  function isValidMove(move) {
    let res = false;
    MOVE_VECTORS.forEach(function(vector) {
      if (move.x === vector.x && move.y === vector.y) {
        res = true;
      }
    });
    return res;
  }

  function Matrix(rows, columns) {
    return new Array(rows).fill(null).map(function() {
      return new Array(columns);
    });
  }

  function my_random(lower = 0, upper = MAX_VALUE, signed = true) {
    var num = Math.floor(Math.random() * (upper - lower + 1)) + lower;
    return Math.random() > 0.5 && signed ? num * -1 : num;
  }
  function signof(num) {
    // return num == 0 ? num : num / Math.abs(num);
    return Math.sign(num); // Oh look there's a stdlib function
  }

  class Block {
    constructor(index, num) {
      this.index = index;
      this.pos = { x: index.x * BLOCK_SIZE, y: index.y * BLOCK_SIZE };
      this.num = num;
    }

    get sign() {
      return signof(this.num);
    }

    get rect() {
      return {
        x: this.pos.x,
        y: this.pos.y,
        w: BLOCK_SIZE,
        h: BLOCK_SIZE
      };
    }

    moveOn(other) {
      let move = {
        x: this.index.x - other.index.x,
        y: this.index.y - other.index.y
      };
      if (isValidMove(move)) {
        if (this.sign == other.sign) {
          return this.reenforce(other);
        } else {
          return this.attack(other);
        }
      }
      return false;
    }

    attack(other) {
      other.num += this.num;
      return true;
    }
    reenforce(other) {
      let absNum = Math.abs(this.num);
      if (!(absNum > 10)) {
        return false;
      }
      other.num += 10 * this.sign;
      this.num = (absNum - 10) * this.sign;
      return true;
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
    constructor(id, canMove = false, sign = 0) {
      this.id = id;
      this.canMove = canMove;
      this.sign = sign;
      this.phase = "WAIT";
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
        if (player.sign == 0 || player.sign == block.sign) {
          this.selection = new Selection(block);
        }
        return;
      } else if (block == this.selection.block) {
        delete this.selection;
        return;
      }
      if (this.selection.block.moveOn(block)) {
        this.endTurn(player);
      }
    }

    getOtherPlayer(player) {
      let otherPlayers = Object.keys(this.players).filter(
        id => id !== player.id
      );
      let otherPlayerKey = otherPlayers[0];
      return this.players[otherPlayerKey];
    }

    endTurn(player) {
      let otherPlayer = this.getOtherPlayer(player);
      player.canMove = false;
      otherPlayer.canMove = true;
      if (!player.sign) {
        player.sign = this.selection.block.sign;
        otherPlayer.sign = -player.sign;
      }
      delete this.selection;
    }
  }
  exports.Game = Game;
})(typeof exports === "undefined" ? (this["MathWars"] = {}) : exports);
