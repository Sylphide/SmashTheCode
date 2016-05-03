import Gene from './Gene';
import Grid from './Grid';
import { Utils } from './Utils';
import { DEPTH, MUTATION_RATE } from './Constants';

export default class Individu {

  constructor(rows, blocks, init = false) {
    this.genome = [];
    this.fitness = 0;
    this.rows = rows;
    if (init) {
      for (let i = 0; i < DEPTH; i++) {
        const gene = new Gene(blocks[i].colorA, blocks[i].colorB);
        this.addGene(gene, false);
      }
    }
  }

  addGene(gene, allowMutation = true) {
    let finalGene = gene;
    if (allowMutation && Math.random < MUTATION_RATE) {
      // finalGene = new Gene(gene.colorA, gene.colorB);
      if (Math.random < 0.5) {
        finalGene = new Gene(gene.colorA, gene.colorB, gene.column);
      } else {
        finalGene = new Gene(gene.colorA, gene.colorB, null, gene.rotation);
      }
      this.fitness = 0;
    }
    this.genome.push(finalGene);
  }

  getFitness() {
    if (this.fitness > 0) {
      return this.fitness;
    }
    const grid = new Grid(this.rows);
    let fitness = 0;
    let loosingPlay = false;
    this.genome.forEach((gene, index) => {
      if (loosingPlay) {
        return;
      }
      const scoreParameters = grid.putCellBlock(gene.column, gene.colorA, gene.colorB, gene.rotation);
      if (scoreParameters === -1) {
        loosingPlay = true;
        return;
      }
      const stepScore = Utils.computeScore(scoreParameters);
      if (index === 0) {
        this.nextScore = stepScore;
      }
      // const compareTo = (step / (index + 1));
      // const compareTo = step;
      let highestNewRow = grid.getTopCell(gene.column).y;
      let topCell2;
      if (gene.rotation === 0) {
        topCell2 = grid.getTopCell(gene.column + 1);
      } else if (gene.rotation === 2) {
        topCell2 = grid.getTopCell(gene.column - 1);
      }
      if (topCell2) {
        highestNewRow += topCell2.y;
      }
      let skullCleared = 0;
      let adjacentCells = 0;
      scoreParameters.forEach((scoreParameter) => {
        skullCleared += scoreParameter.skullCleared;
        adjacentCells += scoreParameter.adjacentCells;
      });
      const compareTo = (stepScore / (2 * Math.max(1, index + 1))) + 10 * skullCleared + 20 * adjacentCells;
      // const compareTo = (highestNewRow * 3) + 10 * skullCleared + 1000 * scoreParameters.length;
      // const compareTo = (stepScore / (0.5 * Math.max(1, index + 1)));
      // const compareTo = stepScore + (highestNewRow * 0.5) + 10 * skullCleared;
      // const compareTo = stepScore;
      // if (compareTo > fitness) {
      fitness += compareTo;
      // }
    });
    this.fitness = fitness;
    this.finalGrid = grid;
    return this.fitness;
  }

  shiftBlocks(blocks, rows) {
    this.rows = rows;
    this.fitness = 0;
    // printErr(this.genome.map((gene) => gene.toString()), blocks[DEPTH - 1].colorA, blocks[DEPTH - 1].colorB);
    this.genome.shift();
    this.addGene(new Gene(blocks[DEPTH - 1].colorA, blocks[DEPTH - 1].colorB), false);
  }

  toString() {
    return this.genome.map((gene) => gene.toString());
  }

  printStepByStep() {
    const grid = new Grid(this.rows);
    grid.printErr();
    this.genome.forEach((gene) => {
      const step = grid.putCellBlock(gene.column, gene.colorA, gene.colorB, gene.rotation);
      printErr('Score : ', step === -1 ? step : Utils.computeScore(step));
      grid.printErr();
    });
  }

  toPrint() {
    return `${this.genome[0].column} ${this.genome[0].rotation}`;
  }
}
