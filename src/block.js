class Block {
  constructor(index, num) {
    this.index = index;
    this.pos = { x: index.x * BLOCK_SIZE, y: index.y * BLOCK_SIZE };
    this.num = num;
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
