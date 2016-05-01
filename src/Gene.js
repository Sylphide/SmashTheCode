export default class Gene {

  constructor(colorA, colorB, column = null, rotation = null) {
    this.colorA = colorA;
    this.colorB = colorB;
    if (!column) {
      this.column = Math.floor(Math.random() * 6);
    } else {
      this.column = column;
    }
    if (!rotation) {
      this.rotation = Math.floor(Math.random() * 4);
    } else {
      this.rotation = rotation;
    }
    if (this.column === 0 && this.rotation === 2) {
      this.column++;
    } else if (this.column === 5 && this.rotation === 0) {
      this.column--;
    }
  }

  toString() {
    return `${this.colorA} ${this.colorB} ${this.column} ${this.rotation}`;
  }
}
