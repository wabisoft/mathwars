function Matrix(rows, columns) {
  return new Array(rows).fill(null).map(function() {
    return new Array(columns);
  });
}

function my_random(lower = 0, upper = MAX_VALUE, signed = true) {
  var num = Math.floor(Math.random() * (upper - lower + 1)) + lower;
  return Math.random() > 0.5 && signed ? num * -1 : num;
}
