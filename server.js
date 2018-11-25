const Express = require("express");
const SocketIO = require("socket.io");
const Http = require("http");
const STATIC = Express.static("dist");
const Game = require("./dist/mathwars.js").Game;

var app = Express();
var server = Http.Server(app);
var io = SocketIO(server);
app.use(STATIC);

server.listen(3000, "0.0.0.0");

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
    game.mousePressed(mouse);
    console.log("Received mousePressed from " + socket.id);
    update(game);
  });
  socket.on("disconnect", function() {
    game.unregisterPlayer(socket.id);
    update(game);
  });
}

function update(game, socket) {
  console.log(game.players);
  if (socket) {
    socket.emit("update", JSON.stringify(game));
  } else {
    io.emit("update", JSON.stringify(game));
  }
}
