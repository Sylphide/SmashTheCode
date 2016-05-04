// import Grid from './Grid';
import Population from './Population';
import { NB_GENERATION } from './Constants';
import Individu from './Individu';
import Grid from './Grid';

let population;
let previousTurnFittness = -1;
let score = 0;
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
    rows.push(readline().split(''));
  }
  const currentGrid = new Grid(rows);
  // currentGrid.printErr();

  // const start2 = new Date();
  const test = new Grid(rows);
  // let test2;
  // for (let i = 0; i < 5000; i++) {
  const test2 = test.copyGrid();
  // }
  test2.putCellBlock(5, 4, 5, 1);
  test2.putCellBlock(5, 0, 0, 1);
  test2.putCellBlock(5, 3, 3, 1);
  test2.putCellBlock(4, 2, 3, 1);
  test2.putCellBlock(4, 3, 1, 1);
  test2.putCellBlock(4, 3, 0, 1);
  test2.putCellBlock(4, 0, 2, 1);
  test2.putCellBlock(3, 2, 3, 1);
  test2.putCellBlock(3, 1, 2, 1);
  test2.putCellBlock(3, 5, 2, 1);
  test2.putCell(3, 0);
  test2.putCell(3, 0);
  test2.putCellBlock(3, 1, 2, 1);
  test2.putCellBlock(4, 4, 4, 2);
  test2.putCell(2, 1);
  test2.putCell(2, 1);
  test2.putCell(2, 5);
  test2.putCell(2, 1);
  test2.putCellBlock(2, 5, 0, 1);
  test2.putCellBlock(2, 2, 2, 1);
  test2.putCell(1, 3);
  test2.putCell(1, 1);
  test2.putCellBlock(1, 5, 5, 1);
  test2.putCellBlock(1, 0, 5, 1);
  test2.putCell(1, 4);
  test2.putCell(0, 5);
  test2.putCell(0, 5);
  test2.putCell(0, 0);
  // test.printErr();
  test2.printErr();
  test2.putCellBlock(0, 5, 1, 0);
  test2.printErr();
  // test2.printErr();
  // printErr((new Date).getTime() - start2.getTime());
  const enemyRows = [];
  for (let i = 0; i < 12; i++) {
    enemyRows.push(readline()); // One line of the map ('.' = empty, '0' = skull block, '1' to '5' = colored block)
  }

  const start = new Date();
  let fittest;
  if (!population) {
    population = new Population(blocks, currentGrid, true);
  } else {
    population.shiftBlocks(blocks, currentGrid);
  }
  fittest = population.getFittest();
  previousTurnFittness = fittest.getFitness();
  printErr(fittest.toString(), fittest.getFitness(), fittest.nextScore);
  // fittest.printStepByStep();
  let i = 0;
  let timer = 0;
  let maxStepTime = 0;
  let previousStepTime = start;
  while (timer < 100 - (maxStepTime + 15) && i < NB_GENERATION && !((fittest.nextScore / 70) + (score / 70) % 6 > 17)) {
    // population.printErr();
    // printErr(fittest.toString(), fittest.getFitness());
    population.evolve();
    fittest = population.getFittest();
    const stepTime = (new Date).getTime() - previousStepTime.getTime();
    if (maxStepTime < stepTime) {
      maxStepTime = stepTime;
    }
    timer = (new Date).getTime() - start.getTime();
    // printErr(fittest.toString(), fittest.getFitness(), (new Date).getTime() - start.getTime());
    i++;
    previousStepTime = (new Date);
    // if (fittest.getFitness() / 70 > 5) {
    //   break;
    // }
  }
  // currentGrid.printErr();

  const end = new Date();
  printErr('Duration : ', end.getTime() - start.getTime(), 'generations : ', i, 'Size : ', population.size);
  printErr(fittest.toString(), fittest.getFitness(), fittest.nextScore);
  // fittest.printStepByStep();
  score += fittest.nextScore;
  // if (previousTurnFittness !== -1 && fittest.getFitness() > previousTurnFittness) {
  //   population.size--;
  //   population.individus.pop();
  // } else {
  //   population.size += 5;
  //   population.individus.push(new Individu(blocks, currentGrid, true));
  //   population.individus.push(new Individu(blocks, currentGrid, true));
  //   population.individus.push(new Individu(blocks, currentGrid, true));
  //   population.individus.push(new Individu(blocks, currentGrid, true));
  //   population.individus.push(new Individu(blocks, currentGrid, true));
  // }
  print(fittest.toPrint()); // "x": the column in which to drop your blocks
}
