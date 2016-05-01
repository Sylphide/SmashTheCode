import Cell from './Cell';
import { Directions, getOppositeDirection } from './DirectionEnum';
import { Utils } from './Utils';

export default class Grid {

  constructor(rows) {
    this.rows = [];
    rows.forEach((row, y) => {
      const columns = row.split('');
      this.rows.push(columns.map((cellValue, x) => new Cell(x, y, cellValue)));
    });
  }

  getCell(x, y) {
    if (x >= 6 || x < 0 || y >= 12 || y < 0) {
      return new Cell(-1, -1, '.');
    }
    return this.rows[y][x];
  }

  getTopCell(column) {
    for (let i = 0; i < this.rows.length; i++) {
      const cell = this.rows[i][column];
      if (!cell.isEmpty()) {
        return cell;
      }
    }
    return new Cell(column, 12, '.');
  }

  clearCell(x, y) {
    let currentCell = this.getCell(x, y);
    let currentRow = y;
    // printErr('clearing ', x, y, currentCell.value);
    while (!currentCell.isEmpty()) {
      if (parseInt(currentCell.value) !== 0) {
        const skulls = this.getAdjacentSkulls(currentCell);
        skulls.forEach((skull) => this.clearCell(skull.x, skull.y));
      }
      const nextCell = this.getCell(x, --currentRow);
      // while (Utils.isSameColor(currentCell, nextCell) || Utils.isBothSkull(currentCell, nextCell)) {
      //   this.clearCell(nextCell.x, nextCell.y);
      //   nextCell = this.getCell(nextCell.x, nextCell.y);
      // }
      currentCell.value = nextCell.value;
      currentCell = this.getCell(x, currentRow);
    }
  }

  clearCells(cellsList) {
    Utils.sortCells(cellsList);
    const colorToClear = cellsList[0].value;
    cellsList.forEach((cell) => {
      if (parseInt(colorToClear) === parseInt(cell.value)) {
        this.clearCell(cell.x, cell.y);
      }
    });
  }

  resolve(cell1, cell2) {
    let nbCellCleared = 0;
    const colorList = [];
    let chainPower = 0;
    let groupBonus = 0;
    const cell1List = this.getSameAdjacentCells(cell1);
    let cell2List = [];
    let cell2Done = false;
    cell1List.forEach((cell) => {
      if (Utils.isEqual(cell, cell2)) {
        cell2Done = true;
      }
    });
    if (!cell2Done) {
      cell2List = this.getSameAdjacentCells(cell2);
    }
    if (cell1List.length >= 4) {
      nbCellCleared += cell1List.length;
      groupBonus += Utils.computeGroupBonus(cell1List.length);
      Utils.addColor(colorList, parseInt(cell1List[0].value));
      this.clearCells(cell1List);
    }
    if (cell2List.length >= 4) {
      nbCellCleared += cell2List.length;
      groupBonus += Utils.computeGroupBonus(cell2List.length);
      Utils.addColor(colorList, parseInt(cell2List[0].value));
      this.clearCells(cell2List);
    }

    if (nbCellCleared > 0) {
      let stepResult = this.resolveFullBoard(colorList);
      while (stepResult.nbCellsCleared > 0) {
        chainPower++;
        nbCellCleared += stepResult.nbCellsCleared;
        groupBonus += stepResult.groupBonus;
        stepResult = this.resolveFullBoard(colorList);
      }
    }
    const colorBonus = Utils.computeColorBonus(colorList.length);
    // printErr(Utils.computeScore(nbCellCleared, chainPower, colorBonus, groupBonus));
    return Utils.computeScore(nbCellCleared, chainPower, colorBonus, groupBonus);
  }

  resolveFullBoard(colorList) {
    const cellsToClear = [];
    let groupBonus = 0;
    for (let column = 0; column < 6; column++) {
      let currentCell = this.getTopCell(column);
      while (!currentCell.isEmpty()) {
        let cellAlreadyDone = false;
        for (let i = 0; i < cellsToClear.length; i++) {
          if (Utils.isCellInList(currentCell, cellsToClear[i])) {
            cellAlreadyDone = true;
            break;
          }
        }
        if (!cellAlreadyDone) {
          const currentCellsList = this.getSameAdjacentCells(currentCell);
          if (currentCellsList.length >= 4) {
            Utils.addColor(colorList, parseInt(currentCellsList[0].value));
            groupBonus += Utils.computeGroupBonus(currentCellsList.length);
            cellsToClear.push(currentCellsList);
          }
        }
        currentCell = this.getCell(column, currentCell.y + 1);
      }
    }
    let nbCellsCleared = 0;
    cellsToClear.forEach((cellsList) => {
      nbCellsCleared += cellsList.length;
      this.clearCells(cellsList);
    });
    return {
      nbCellsCleared,
      groupBonus
    };
  }

  getSameAdjacentCells(cell, initialDirection, previousCells = []) {
    const cellsList = [cell];
    previousCells.push(cell);
    Object.keys(Directions).forEach((directionName) => {
      const direction = Directions[directionName];
      if (typeof(initialDirection) === 'undefined' || initialDirection !== direction) {
        const adjacentCell = this.getAdjacentCell(cell, direction);
        if (Utils.isSameColor(cell, adjacentCell) && !Utils.isCellInList(adjacentCell, previousCells)) {
          cellsList.push(...this.getSameAdjacentCells(adjacentCell, getOppositeDirection(direction), previousCells));
        }
      }
    });
    return cellsList;
  }

  getAdjacentCell(cell, direction) {
    switch (direction) {
      case Directions.DOWN:
        return this.getCell(cell.x, cell.y + 1);
      case Directions.LEFT:
        return this.getCell(cell.x - 1, cell.y);
      case Directions.UP:
        return this.getCell(cell.x, cell.y - 1);
      case Directions.RIGHT:
      default:
        return this.getCell(cell.x + 1, cell.y);
    }
  }

  getAdjacentSkulls(cell) {
    const skulls = [];
    Object.keys(Directions).forEach((directionName) => {
      const direction = Directions[directionName];
      const adjacentCell = this.getAdjacentCell(cell, direction);
      if (parseInt(adjacentCell.value) === 0) {
        skulls.push(adjacentCell);
      }
    });
    return skulls;
  }

  putCell(column, value) {
    const topCell = this.getTopCell(column);
    const cell = this.getCell(column, topCell.y - 1);
    cell.value = value;
    return cell;
  }

  putCellBlock(column, color1, color2, rotation) {
    let cell1;
    let cell2;
    switch (rotation) {
      case 1:
        cell1 = this.putCell(column, color1);
        cell2 = this.putCell(column, color2);
        break;
      case 2:
        cell1 = this.putCell(column, color1);
        if (column > 0) {
          cell2 = this.putCell(column - 1, color2);
        } else {
          return -1;
        }
        break;
      case 3:
        cell1 = this.putCell(column, color2);
        cell2 = this.putCell(column, color1);
        break;
      case 0:
      default:
        cell1 = this.putCell(column, color1);
        if (column < 5) {
          cell2 = this.putCell(column + 1, color2);
        } else {
          return -1;
        }
        break;
    }
    if (cell1.y === -1 || cell2.y === -1) {
      return -1;
    }
    return this.resolve(cell1, cell2);
  }

  printErr() {
    this.rows.forEach((row) => printErr(row.map((cell) => cell.value)));
  }
}