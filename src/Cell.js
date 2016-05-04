

export default class Cell {

  constructor(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
  }

  isEmpty() {
    return this.value === '.';
  }

  copyCell() {
    return new Cell(this.x, this.y, this.value);
  }

  toString() {
    return `${this.x} ${this.y} ${this.value}`;
  }
}
