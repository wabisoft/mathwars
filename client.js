class Client {
  constructor() {
    this.socket = io(SERVER_ADDR);
    this.game = new Game();
    this.socket.on("mousePressed", this.mousePressed.bind(this));
    // this.socket.on("playerJoined", this.playerJoined.bind(this));
  }

  playerJoined(clientId) {
    if (clientId == this.socket.id) {
      return;
    }
    this.game.registerPlayer(clientId);
  }

  mousePressed(clientId, mouse) {
    console.log("Received mousePressed from server");
    // if (clientId == this.socket.id) {
    this.game.mousePressed(mouse);
    // }
  }
}

var client = new Client();

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
