// import Grid from './Grid';
import Population from './Population';
import { NB_GENERATION } from './Constants';

let population;
while (true) {
  const blocks = [];
  for (let i = 0; i < 8; i++) {
    const inputs = readline().split(' ');
    blocks.push({
      colorA: parseInt(inputs[0]), // color of the first block
      colorB: parseInt(inputs[1]) // color of the attached block
    });
  }
  const rows = [];
  for (let i = 0; i < 12; i++) {
    rows.push(readline());
  }
  // const ownGrid = new Grid(rows);
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
  const start = new Date();
  // ownGrid.printErr();

  if (!population) {
    population = new Population(blocks, rows, true);
  } else {
    population.shiftBlocks(blocks, rows);
  }
  for (let i = 0; i < NB_GENERATION; i++) {
    // population.printErr();
    // const fittest = population.getFittest();
    // printErr(fittest.toString(), fittest.getFitness());
    population.evolve();
  }

  const end = new Date();
  printErr(end.getTime() - start.getTime());
  const fittest = population.getFittest();
  printErr(fittest.toString(), fittest.getFitness());
  // fittest.finalGrid.printErr();
  print(fittest.toPrint()); // "x": the column in which to drop your blocks
}
