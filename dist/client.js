class Client {
  constructor() {
    this.socket = io(MathWars.SERVER_ADDR);
    this.socket.on("update", this.update.bind(this));
    // this.socket.on("mousePressed", this.mousePressed.bind(this));
    // this.socket.on("playerJoined", this.playerJoined.bind(this));
    // this.socket.on("updatePlayers", this.updatePlayers.bind(this));
    this.socket.on("no", this.disconnect.bind(this));
    this.game = null;
  }

  update(gameJSON) {
    this.game = new MathWars.Game(JSON.parse(gameJSON));
  }

  disconnect() {
    delete this.game;
  }

  // updatePlayers(players) {
  //   console.log(players);
  // }

  // playerJoined(clientId) {
  //   if (clientId == this.socket.id) {
  //     return;
  //   }
  //   this.game.registerPlayer(clientId);
  // }

  // mousePressed(clientId, mouse) {
  //   console.log("Received mousePressed from server");
  //   // if (clientId == this.socket.id) {
  //   this.game.mousePressed(mouse);
  //   // }
  // }
}

var client = new Client();
// console.log(client.game);
// console.log(client.game.board.getBlockAtIndex({ x: 0, y: 0 }).num);

function preload() {
  FONT = loadFont("AvenirNextLTPro-Demi.otf");
}

function setup() {
  createCanvas(BLOCK_SIZE * BOARD_ROWS, BLOCK_SIZE * BOARD_COLUMNS);
}

// Draw is the hook for p5's event loop
function draw() {
  draw_game(client.game);
}

// mousePressed is the hook for p5's mouse press event callback
function mousePressed() {
  let mouse = { x: mouseX, y: mouseY };
  console.log("Sending click to server");
  client.socket.emit("mousePressed", mouse);
}
