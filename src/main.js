import Grid from './Grid';

let count = 0;
while (true) {
  let nextColorA = 0;
  let nextColorB = 0;
  for (let i = 0; i < 8; i++) {
    const inputs = readline().split(' ');
    const colorA = parseInt(inputs[0]); // color of the first block
    const colorB = parseInt(inputs[1]); // color of the attached block
    if (i === 0) {
      nextColorA = colorA;
      nextColorB = colorB;
    }
  }
  const rows = [];
  for (let i = 0; i < 12; i++) {
    rows.push(readline());
  }
  const ownGrid = new Grid(rows);
  // ownGrid.printErr();
  // if (ownGrid.getTopCell(2) && ownGrid.getTopCell(2).y < 10) {
  //   ownGrid.clearCell(2, 11);
  //   ownGrid.putCell(3, 5);
  // }
  // ownGrid.printErr();
  const enemyRows = [];
  for (let i = 0; i < 12; i++) {
    enemyRows.push(readline()); // One line of the map ('.' = empty, '0' = skull block, '1' to '5' = colored block)
  }
  // const enemyGrid = new Grid(enemyRows);
  // enemyGrid.printErr();
  count = (count + 1) % 6;
  ownGrid.putCellBlock(count, nextColorA, nextColorB, 3);
  // ownGrid.printErr();
  print(`${count} 3`); // "x": the column in which to drop your blocks
}
