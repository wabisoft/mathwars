// learning is painful: you can only send JSON recognized data
// all objects must be parsed and ""reassembled" client side
// need a name for the data to be sent: a string
// the actual data: a js object

var socket;


function setup()
{
  createCanvas(600, 600);
  background(51);

  socket = io.connect('http://ian.local:3000/');
  socket.on('mouse', newDraw);
}

function newDraw(data)
{
  noStroke();
  fill(255, 0, 100);
  ellipse(data.x, data.y, 15, 15);
}

function mouseDragged()
{

  var data = {x: mouseX, y: mouseY};
  socket.emit('mouse', data);

  console.log(mouseX + ", " + mouseY);
  noStroke();
  fill(255);
  ellipse(mouseX, mouseY, 15, 15);
}
function draw()
{

}
