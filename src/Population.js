import Individu from './Individu';
import Gene from './Gene';
import { Utils } from './Utils';
import Grid from './Grid';
import { SIZE, TOURNAMENT_SIZE, NEW_MEMBERS } from './Constants';

export default class Population {

  constructor(blocks, rows, init = false) {
    if (init) {
      this.rows = rows;
      this.blocks = blocks;
      this.individus = [];
      for (let i = 0; i < SIZE; i++) {
        this.individus.push(new Individu(rows, blocks, true));
      }
    }
  }

  evolve() {
    const nextGeneration = [];
    nextGeneration.push(this.getFittest());
    // printErr(this.getFittest().toString(), this.getFittest().getFitness());
    for (let i = 1; i < SIZE - NEW_MEMBERS; i++) {
      const mate1 = this.tournamentSelection();
      const mate2 = this.tournamentSelection();
      nextGeneration.push(this.crossover(mate1, mate2));
    }
    for (let i = 0; i < NEW_MEMBERS; i++) {
      nextGeneration.push(new Individu(this.rows, this.blocks, true));
    }

    // nextGeneration.forEach((child) => child.mutate());
    this.individus = nextGeneration;
    // printErr(this.getFittest().toString(), this.getFittest().getFitness());
  }

  tournamentSelection() {
    const tournamentIndividus = [];
    for (let i = 0; i < TOURNAMENT_SIZE; i++) {
      tournamentIndividus.push(this.individus[Math.floor(Math.random() * SIZE)]);
    }
    const tournament = new Population();
    tournament.individus = tournamentIndividus;
    return tournament.getFittest();
  }

  crossover(mate1, mate2) {
    // printErr(this.rows);
    const child = new Individu(this.rows);
    const grid1 = new Grid(this.rows);
    const grid2 = new Grid(this.rows);
    mate1.genome.forEach((gene1, index) => {
      const gene2 = mate2.genome[index];
      const scoreParameters1 = grid1.putCellBlock(gene1.column, gene1.colorA, gene1.colorB, gene1.rotation);
      const scoreParameters2 = grid2.putCellBlock(gene2.column, gene2.colorA, gene2.colorB, gene2.rotation);
      if (scoreParameters1 === -1 && scoreParameters2 === -1) {
        child.addGene(new Gene(gene1.colorA, gene1.colorB));
      } else if (scoreParameters1 === -1) {
        child.addGene(new Gene(gene2.colorA, gene2.colorB, gene2.column, gene2.rotation));
      } else if (scoreParameters2 === -1) {
        child.addGene(new Gene(gene1.colorA, gene1.colorB, gene1.column, gene1.rotation));
      } else {
        const stepScore1 = Utils.computeScore(scoreParameters1);
        const stepScore2 = Utils.computeScore(scoreParameters2);
        if (stepScore1 > stepScore2) {
          child.addGene(new Gene(gene1.colorA, gene1.colorB, gene1.column, gene1.rotation));
        } else {
          child.addGene(new Gene(gene2.colorA, gene2.colorB, gene2.column, gene2.rotation));
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

  shiftBlocks(blocks, rows) {
    this.blocks = blocks;
    this.rows = rows;
    this.individus.forEach((individu) => {
      individu.shiftBlocks(blocks, rows);
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
