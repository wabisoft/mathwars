var my_turn = false; // this is hacky and bad but I'm in a hurry here

class Client {
  constructor() {
    this.socket = io(MathWars.SERVER_ADDR);
    this.socket.on("update", this.update.bind(this));
    this.socket.on("no", this.disconnect.bind(this));
    this.game = null;
  }

  update(gameJSON) {
    this.game = new MathWars.Game(JSON.parse(gameJSON));
    my_turn = this.game.players[this.socket.id].canMove;
  }

  disconnect() {
    delete this.game;
  }
}
var client = new Client();

function preload() {
  FONT = loadFont("AvenirNextLTPro-Demi.otf");
}

// Draw is the hook for p5's event loop
function draw() {
  draw_game(client.game);
  image(boardBuffer, 100, 100);
}

// mousePressed is the hook for p5's mouse press event callback
function mousePressed() {
  let mouse = { x: mouseX - 100, y: mouseY - 100 };
  console.log("Sending click to server");
  client.socket.emit("mousePressed", mouse);
}
