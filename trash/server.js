import { express } from "express";
import io from "socket.io";
import * as http from "http";
import { Game } from "dist/mathwars.js";

const STATIC = express.static("dist");

var app = express();
var server = http.Server(app);
var io = server;
io.use(function(socket, next) {
  var handshakedata = socket.handshake;
  console.log(handshakedata);
  next();
});
app.use(STATIC);

server.listen(3000, "0.0.0.0");

class Server {
  constructor() {
    this.game = new Game();
  }
}
var game = new Game();
io.on("connection", registerSocket);

function registerSocket(socket) {
  if (!game.registerPlayer(socket.id)) {
    console.log("Cannot register player. Game full");
    socket.emit("no");
    return;
  }
  // console.log(game.players);
  update(game);
  socket.on("mousePressed", function mousePressed(mouse) {
    game.mousePressed(mouse, socket.id);
    console.log("Received mousePressed from " + socket.id);
    update(game);
  });
  socket.on("disconnect", function() {
    game.unregisterPlayer(socket.id);
    update(game);
  });
}

function update(game, socket) {
  if (socket) {
    socket.emit("update", JSON.stringify(game));
  } else {
    io.emit("update", JSON.stringify(game));
  }
}
