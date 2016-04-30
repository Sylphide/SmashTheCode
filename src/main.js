let test1 = true;
let test2 = true;
let scdRow = [];
while (true) {
  let nextColor = 0;
  for (var i = 0; i < 8; i++) {
    var inputs = readline().split(' ');
    var colorA = parseInt(inputs[0]); // color of the first block
    var colorB = parseInt(inputs[1]); // color of the attached block
    if (i === 0) {
      nextColor = colorA;
    }
  }
  for (var i = 0; i < 12; i++) {
    var row = readline();
    if(i === 1) {
      scdRow = row.split('');
    }
  }
  for (var i = 0; i < 12; i++) {
    var row = readline(); // One line of the map ('.' = empty, '0' = skull block, '1' to '5' = colored block)
  }

  // Write an action using print()
  // To debug: printErr('Debug messages...');
  if (nextColor === 2) {
    if(test1 && scdRow[nextColor - 1] === '.') {
      nextColor--;
    }
    test1 = !test1;
  } else if (nextColor === 4 && scdRow[nextColor - 1] === '.') {
    if(test2) {
      nextColor--;
    }
    test2 = !test2;
  }
  while(scdRow[nextColor] !== '.') {
    nextColor = (nextColor + 1) % 6;
  }
  print(nextColor); // "x": the column in which to drop your blocks
}
