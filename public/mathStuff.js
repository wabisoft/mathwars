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

function getNumber ()
{
  // Math.floor(random(min, max)) + min
  var num = Math.floor(random(1, 20)) + 1;
  var num2 = random();
  if(num2 > 0.5)
  {
    num *= -1;
  }
  num = num.toString();
  return num;
}
