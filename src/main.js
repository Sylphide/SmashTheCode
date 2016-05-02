// import Grid from './Grid';
import Population from './Population';
import { NB_GENERATION } from './Constants';

let population;
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
  let fittest = population.getFittest();
  printErr(fittest.toString(), fittest.getFitness());
  // fittest.printStepByStep();
  let i = 0;
  let timer = 0;
  let maxStepTime = 0;
  let previousStepTime = start;
  while (timer < 100 - (maxStepTime + 20) && i < NB_GENERATION && !(((fittest.nextScore / 70) > 10 && (score / 70) % 6 > 4))) {
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

  const end = new Date();
  printErr('Duration : ', end.getTime() - start.getTime(), 'generations : ', i);
  // const fittest = population.getFittest();
  printErr(fittest.toString(), fittest.getFitness());
  score += fittest.nextScore;
  // fittest.printStepByStep();
  print(fittest.toPrint()); // "x": the column in which to drop your blocks
}
