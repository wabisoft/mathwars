class Board {
  constructor(rows = BOARD_ROWS, columns = BOARD_COLUMNS) {
    this.rows = rows;
    this.columns = columns;
    this._matrix = Matrix(this.rows, this.columns);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this._matrix[i][j] = new Block({ x: i, y: j }, my_random());
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
