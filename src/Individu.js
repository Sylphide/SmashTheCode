import Gene from './Gene';
import Grid from './Grid';
import { DEPTH, MUTATION_RATE } from './Constants';

export default class Individu {

  constructor(rows, blocks, init = false) {
    this.genome = [];
    this.score = 0;
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
      this.score = 0;
    }
    this.genome.push(finalGene);
  }

  getFitness() {
    if (this.score > 0) {
      return this.score;
    }
    const grid = new Grid(this.rows);
    let score = 0;
    let loosingPlay = false;
    this.genome.forEach((gene, index) => {
      if (loosingPlay) {
        return;
      }
      const step = grid.putCellBlock(gene.column, gene.colorA, gene.colorB, gene.rotation);
      if (index === 0) {
        this.nextScore = step;
      }
      if (step === -1) {
        loosingPlay = true;
        return;
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
        highestNewRow = Math.min(highestNewRow, topCell2.y);
      }
      const compareTo = (step / Math.max(1, index - 2)) + 15 * highestNewRow;
      if (compareTo > score) {
        score = compareTo;
      }
    });
    this.score = score;
    this.finalGrid = grid;
    return this.score;
  }

  shiftBlocks(blocks, rows) {
    this.rows = rows;
    this.score = 0;
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
      printErr('Score : ', step);
      grid.printErr();
    });
  }

  toPrint() {
    return `${this.genome[0].column} ${this.genome[0].rotation}`;
  }
}
