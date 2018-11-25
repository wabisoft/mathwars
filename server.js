const Express = require("express");
const SocketIO = require("socket.io");
const Http = require("http");
const STATIC = Express.static("dist");
const Game = require("./dist/mathwars.js").Game;

var app = Express();
var server = Http.Server(app);
var io = SocketIO(server);
var game = new Game();
app.use(STATIC);

server.listen(3000, "0.0.0.0");

clients = new Map();
io.on("connection", registerSocket);

function registerSocket(socket) {
  clients.set(socket.id, socket);
  socket.on("mousePressed", function mousePressed(mouse) {
    console.log("Received mousePressed from " + socket.id);
    io.emit("mousePressed", socket.id, mouse);
  });
  console.log("Registered new client with id " + socket.id);
  io.emit("playerJoined", socket.id);
}
