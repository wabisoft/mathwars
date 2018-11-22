// Setting up number grid
numberGrid = make2DArray(7, 7);

for (var i = 0; i < numberGrid.length; i++)
{
  for (var j = 0; j<numberGrid.length; j++ )
  {
    numberGrid[i][j] = getRandIntNumber();
  }
}

function make2DArray (rows, columns)
{
  // of size rows
  var arr = new Array(rows);

  for (var i = 0; i < arr.length; i++)
  {
    // of size columns
    arr[i] = new Array (columns);
  }
  return arr;
}

function getRandIntNumber ()
{
  var num = Math.floor((Math.random() + .1) * 10);
  var num2 = Math.random();
  if(num2 > 0.5)
  {
    num *= -1;
  }
  return num;
}

// SERVER STUFF
var express = require('express');
var app = express();
var server = app.listen(3000, "0.0.0.0");
app.use(express.static('public'));
//
console.log('running');
//
var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newConnection);

function newConnection(socket)
{
  console.log('new connection with id: ' + socket.id);
  var initData = {g : numberGrid};

  // broadcast to all connected sockets to reset grid
  // should also broadcast init turn
  io.sockets.emit('initMessage', initData)

  //
  socket.on('turn', turnMsg);
  function turnMsg (data)
  {
    // numberGrid = data.y;
    console.log("recieved turn data and sending array:  ");
    console.log(data.y);
    socket.broadcast.emit('turn', data);
  }
}
