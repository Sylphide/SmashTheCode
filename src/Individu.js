import Gene from './Gene';
import { Utils } from './Utils';
import { DEPTH, MUTATION_RATE } from './Constants';

export default class Individu {

  constructor(blocks, grid, init = false) {
    this.genome = [];
    this.fitness = -1000;
    this.currentGrid = grid;
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
      finalGene = new Gene(gene.colorA, gene.colorB);
      // if (Math.random < 0.5) {
      //   finalGene = new Gene(gene.colorA, gene.colorB, gene.column);
      // } else {
      //   finalGene = new Gene(gene.colorA, gene.colorB, null, gene.rotation);
      // }
      this.fitness = -1000;
    }
    const previousGene = this.genome[this.genome.length - 1];
    let grid;
    if (!previousGene) {
      grid = this.currentGrid.copyGrid();
    } else {
      grid = previousGene.currentGrid.copyGrid();
    }
    if (!finalGene.previousGrid || !finalGene.previousGrid.isEqual(grid)) {
      finalGene.previousGrid = grid.copyGrid();
      finalGene.scoreParameters = grid.putCellBlock(finalGene.column, finalGene.colorA, finalGene.colorB, finalGene.rotation);
      finalGene.currentGrid = grid;
    }
    this.genome.push(finalGene);
  }

  getFitness() {
    if (this.fitness > -1000) {
      return this.fitness;
    }
    let fitness = 0;
    this.genome.forEach((gene, index) => {
      if (fitness === -1) {
        return;
      }
      if (gene.scoreParameters === -1) {
        fitness = -1;
        return;
      }
      const stepScore = Utils.computeScore(gene.scoreParameters);
      if (index === 0) {
        // if (stepScore > 0 && gene.scoreParameters.length > 1) {
        //   printErr(gene.column, gene.rotation, gene.scoreParameters.map((score) => JSON.stringify(score)));
        //   gene.previousGrid.printErr();
        //   gene.currentGrid.printErr();
        // }
        this.nextScore = stepScore;
      }
      let highestNewRow = gene.currentGrid.getTopCell(gene.column).y;
      let topCell2;
      if (gene.rotation === 0) {
        topCell2 = gene.currentGrid.getTopCell(gene.column + 1);
      } else if (gene.rotation === 2) {
        topCell2 = gene.currentGrid.getTopCell(gene.column - 1);
      }
      if (topCell2) {
        highestNewRow += topCell2.y;
      }
      let skullCleared = 0;
      let adjacentCells = 0;
      let nbCellsInDiagonals = 0;
      let nbCellsInDiagonals2 = 0;
      let nbCellsInColumn = 0;
      gene.scoreParameters.forEach((scoreParameter) => {
        skullCleared += scoreParameter.skullCleared;
        adjacentCells += scoreParameter.adjacentCells;
        nbCellsInDiagonals += scoreParameter.nbCellsInDiagonals;
        nbCellsInDiagonals2 += scoreParameter.nbCellsInDiagonals2;
        nbCellsInColumn += scoreParameter.nbCellsInColumn;
      });
      let compareTo = stepScore / Math.max(1, index - 2);
      if (index === 0) {
        compareTo +=
          + skullCleared
          + adjacentCells * 3
          + nbCellsInDiagonals * 1.2 + nbCellsInDiagonals2 * 1.5
          + nbCellsInColumn * 0.5
          + highestNewRow * 0.5;
      }
      fitness += compareTo;
    });
    this.fitness = fitness;
    return this.fitness;
  }

  shiftBlocks(blocks, grid, playedColumn, playedRotation) {
    this.currentGrid = grid;
    this.fitness = -1000;
    const firstGene = this.genome.shift();
    if (firstGene.column !== playedColumn || firstGene.rotation !== playedRotation) {
      const previousGrid = this.currentGrid.copyGrid();
      this.genome.forEach((gene) => {
        gene.previousGrid = previousGrid.copyGrid();
        gene.scoreParameters = previousGrid.putCellBlock(gene.column, gene.colorA, gene.colorB, gene.rotation);
        gene.currentGrid = previousGrid.copyGrid();
      });
    }
    this.addGene(new Gene(blocks[DEPTH - 1].colorA, blocks[DEPTH - 1].colorB), false);
  }

  toString() {
    return this.genome.map((gene) => gene.toString());
  }

  printStepByStep() {
    this.currentGrid.printErr();
    this.genome.forEach((gene) => {
      printErr('Score : ', gene.scoreParameters === -1 ? gene.scoreParameters : Utils.computeScore(gene.scoreParameters));
      gene.currentGrid.printErr();
    });
  }

  toPrint() {
    return `${this.genome[0].column} ${this.genome[0].rotation}`;
  }
}
