import Individu from './Individu';
import Gene from './Gene';
import { Utils } from './Utils';
import { SIZE, TOURNAMENT_SIZE, NEW_MEMBERS } from './Constants';

export default class Population {

  constructor(blocks, grid, init = false) {
    if (init) {
      this.currentGrid = grid;
      this.blocks = blocks;
      this.individus = [];
      this.size = SIZE;
      for (let i = 0; i < this.size; i++) {
        this.individus.push(new Individu(blocks, this.currentGrid, true));
      }
    }
  }

  evolve() {
    const nextGeneration = [];
    nextGeneration.push(this.getFittest());
    for (let i = 1; i < this.size - NEW_MEMBERS; i++) {
      const mate1 = this.tournamentSelection();
      const mate2 = this.tournamentSelection();
      nextGeneration.push(this.crossover(mate1, mate2));
    }
    for (let i = 0; i < NEW_MEMBERS; i++) {
      nextGeneration.push(new Individu(this.blocks, this.currentGrid, true));
    }
    this.individus = nextGeneration;
  }

  tournamentSelection() {
    const tournamentIndividus = [];
    for (let i = 0; i < TOURNAMENT_SIZE; i++) {
      tournamentIndividus.push(this.individus[Math.floor(Math.random() * this.size)]);
    }
    const tournament = new Population();
    tournament.individus = tournamentIndividus;
    return tournament.getFittest();
  }

  crossover(mate1, mate2) {
    const child = new Individu(this.blocks, this.currentGrid);
    mate1.genome.forEach((gene1, index) => {
      const gene2 = mate2.genome[index];
      if (gene1.scoreParameters === -1 && gene2.scoreParameters === -1) {
        child.addGene(new Gene(gene1.colorA, gene1.colorB));
      } else if (gene1.scoreParameters === -1) {
        child.addGene(gene2);
      } else if (gene2.scoreParameters === -1) {
        child.addGene(gene1);
      } else {
        const stepScore1 = Utils.computeScore(gene1.scoreParameters);
        const stepScore2 = Utils.computeScore(gene2.scoreParameters);
        if (stepScore1 > stepScore2) {
          child.addGene(gene1);
        } else {
          child.addGene(gene2);
        }
      }
      // const random = Math.random();
      // if (random > 0.25) {
      //   child.addGene(new Gene(gene1.colorA, gene1.colorB, gene1.column, gene1.rotation));
      // } else if (random < 0.5) {
      //   child.addGene(new Gene(gene2.colorA, gene2.colorB, gene2.column, gene2.rotation));
      // } else if (random < 0.75) {
      //   child.addGene(new Gene(gene2.colorA, gene2.colorB, gene1.column, gene2.rotation));
      // } else {
      //   child.addGene(new Gene(gene2.colorA, gene2.colorB, gene2.column, gene1.rotation));
      // }
    });
    return child;
  }

  shiftBlocks(blocks, grid) {
    this.blocks = blocks;
    this.currentGrid = grid;
    const {
      column: playedColumn,
      rotation: playedRotation
    } = this.getFittest().genome[0];
    this.individus.forEach((individu) => {
      individu.shiftBlocks(blocks, this.currentGrid, playedColumn, playedRotation);
    });
  }

  getFittest() {
    let fittest;
    let previousFitness = 0;
    // const start = new Date();
    this.individus.forEach((individu) => {
      if (!fittest || previousFitness < individu.getFitness()) {
        fittest = individu;
        previousFitness = fittest.getFitness();
      }
    });
    // const end = new Date();
    // printErr('GetFittest', end.getTime() - start.getTime());
    return fittest;
  }

  printErr() {
    this.individus.forEach((individu) => printErr(individu.toString()));
  }
}
