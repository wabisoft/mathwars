import * as PIXI from "pixi.js";
// TODO: Rewrite as thin graphics/io layer with pixi.js
var my_turn = false; // this is hacky and bad but I'm in a hurry here

class Client {
  constructor(name) {
    this.name = name;
    this.socket = io(MathWars.SERVER_ADDR, { query: "iam=" + name });
    this.socket.on("update", this.update.bind(this));
    // this.socket.on("no", this.disconnect.bind(this));
    this.p5 = new p5(
      this.p5_initializer.bind(this),
      document.getElementById("sketch")
    );
  }

  p5_initializer(sketch) {
    sketch.preload = function() {
      FONT = sketch.loadFont("AvenirNextLTPro-Demi.otf");
    };
    sketch.setup = function() {
      this.drawing = new Drawing(sketch);
    };
    // Draw is the hook for p5's event loop
    sketch.draw = function() {
      if (this.game) {
        this.drawing.my_turn = this.game.players[this.socket.id].canMove;
        this.drawing.draw_game(this.game);
        // sketch.image(boardBuffer, 100, 100);
      }
      console.log(this.game);
    };

    // mousePressed is the hook for p5's mouse press event callback
    sketch.mousePressed = function() {
      let mouse = { x: mouseX - 100, y: mouseY - 100 };
      console.log("Sending click to server");
      this.socket.emit("mousePressed", mouse);
    };
  }

  update(gameJSON) {
    this.game = new MathWars.Game(JSON.parse(gameJSON));
    if (this.drawing) {
      this.drawing.my_turn = this.game.players[this.socket.id].canMove;
    }
  }
}

function validateForm(form) {
  if (form.nic.value) {
    window.client = new Client(form.nic.value);
    form.style.visibility = "hidden";
    document.getElementById("sketch").style.visibility = "visible";
  }
}

var client = new Client("Owen");
