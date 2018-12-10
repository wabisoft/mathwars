var socket = io();
socket.on("connect", function() {
  socket.emit("hey", "test", "more");
  console.log("I'm connected");
});
