import Cell from './Cell';
import { Directions, getOppositeDirection } from './DirectionEnum';
import { Utils } from './Utils';

export default class Grid {

  constructor(rows) {
    this.rows = rows;
  }

  copyGrid() {
    return new Grid(this.rows.map((row) => Array.concat(row)));
  }

  getCell(x, y) {
    if (x >= 6 || x < 0 || y >= 12 || y < 0) {
      return new Cell(-1, -1, '.');
    }
    return new Cell(x, y, this.rows[y][x]);
  }

  getTopCell(column) {
    for (let i = 0; i < this.rows.length; i++) {
      const cell = this.getCell(column, i);
      if (!cell.isEmpty()) {
        return cell;
      }
    }
    return new Cell(column, 12, '.');
  }

  setCellValue(cellToSet, value) {
    if (cellToSet.x !== -1 && cellToSet.y !== -1) {
      this.rows[cellToSet.y][cellToSet.x] = value;
    }
  }

  clearCell(x, y) {
    let currentCell = this.getCell(x, y);
    let currentRow = y;
    let skullCleared = 0;
    // printErr('clearing ', x, y, currentCell.value);
    while (!currentCell.isEmpty()) {
      if (parseInt(currentCell.value) !== 0) {
        const skulls = this.getAdjacentSkulls(currentCell);
        skullCleared = skulls.length;
        skulls.forEach((skull) => this.clearCell(skull.x, skull.y));
      }
      const nextCell = this.getCell(x, --currentRow);
      // while (Utils.isSameColor(currentCell, nextCell) || Utils.isBothSkull(currentCell, nextCell)) {
      //   this.clearCell(nextCell.x, nextCell.y);
      //   nextCell = this.getCell(nextCell.x, nextCell.y);
      // }
      this.setCellValue(currentCell, nextCell.value);
      currentCell = this.getCell(x, currentRow);
    }
    return skullCleared;
  }

  clearCells(cellsList) {
    Utils.sortCells(cellsList);
    let skullCleared = 0;
    const colorToClear = cellsList[0].value;
    cellsList.forEach((cell) => {
      if (parseInt(colorToClear) === parseInt(cell.value)) {
        skullCleared += this.clearCell(cell.x, cell.y);
      }
    });
    return skullCleared;
  }

  resolve(cell1, cell2) {
    let nbCellsCleared = 0;
    let colorList = [];
    let groupBonus = 0;
    let skullCleared = 0;
    const nbCellsInDiagonals =
      this.getSameCellsInDiagonals(cell1) + this.getSameCellsInDiagonals(cell2);
    const nbCellsInDiagonals2 =
      this.getSameCellsInDiagonals(cell1) + this.getSameCellsInDiagonals(cell2);
    const nbCellsInColumn =
      this.getSameCellsInColumn(cell1) + this.getSameCellsInColumn(cell2);
    let cell1List = this.getSameAdjacentCells(cell1);
    let cell2List = [];
    let cell2Done = false;
    const scoreParameters = [];
    cell1List.forEach((cell) => {
      if (!cell2Done && Utils.isEqual(cell, cell2)) {
        cell2Done = true;
        return;
      }
    });
    if (!cell2Done) {
      cell2List = this.getSameAdjacentCells(cell2);
    }
    const orderedCellsList = [cell1List, cell2List];
    Utils.sortCellsList(orderedCellsList);
    [cell1List, cell2List] = orderedCellsList;
    if (cell1List.length >= 4) {
      nbCellsCleared += cell1List.length;
      groupBonus += Utils.computeGroupBonus(cell1List.length);
      Utils.addColor(colorList, parseInt(cell1List[0].value));
      skullCleared += this.clearCells(cell1List);
    }
    if (cell2List.length >= 4) {
      nbCellsCleared += cell2List.length;
      groupBonus += Utils.computeGroupBonus(cell2List.length);
      Utils.addColor(colorList, parseInt(cell2List[0].value));
      skullCleared += this.clearCells(cell2List);
    }
    scoreParameters.push({
      nbCellsCleared,
      skullCleared,
      groupBonus,
      nbCellsInDiagonals,
      nbCellsInDiagonals2,
      nbCellsInColumn,
      adjacentCells: nbCellsCleared === 0 ? cell1List.length + cell2List.length : 0,
      colorBonus: Utils.computeColorBonus(colorList.length),
    });

    if (nbCellsCleared > 0) {
      let stepResult = this.resolveFullBoard();
      while (stepResult.nbCellsCleared > 0) {
        ({
          nbCellsCleared,
          groupBonus,
          skullCleared,
          colorList
        } = stepResult);
        scoreParameters.push({
          nbCellsCleared,
          skullCleared,
          groupBonus,
          adjacentCells: stepResult.adjacentCells,
          nbCellsInDiagonals: stepResult.nbCellsInDiagonals,
          nbCellsInDiagonals2: stepResult.nbCellsInDiagonals2,
          nbCellsInColumn: stepResult.nbCellsInColumn,
          colorBonus: Utils.computeColorBonus(colorList.length)
        });
        stepResult = this.resolveFullBoard(colorList);
      }
    }
    return scoreParameters;
  }

  resolveFullBoard() {
    const cellsToClear = [];
    let adjacentCells = 0;
    let groupBonus = 0;
    const colorList = [];
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
          } else {
            adjacentCells += currentCellsList.length;
          }
        }
        currentCell = this.getCell(column, currentCell.y + 1);
      }
    }
    let nbCellsCleared = 0;
    let skullCleared = 0;
    cellsToClear.forEach((cellsList) => {
      nbCellsCleared += cellsList.length;
      skullCleared += this.clearCells(cellsList);
    });
    return {
      nbCellsCleared,
      groupBonus,
      skullCleared,
      colorList,
      adjacentCells: 0,
      nbCellsInColumn: 0,
      nbCellsInDiagonals: 0,
      nbCellsInDiagonals2: 0
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

  getSameCellsInDiagonals(cell) {
    const cellsInDiagonals = [
      this.getCell(cell.x - 1, cell.y - 1),
      this.getCell(cell.x + 1, cell.y - 1),
      this.getCell(cell.x - 1, cell.y + 1),
      this.getCell(cell.x + 1, cell.y + 1),
      this.getCell(cell.x, cell.y + 2)
    ];
    let count = 0;
    for (let i = 0; i < cellsInDiagonals.length; i++) {
      if (Utils.isSameColor(cell, cellsInDiagonals[i])) {
        count++;
      }
    }
    return count;
  }

  getSameCellsInDiagonals2(cell) {
    const cellsInDiagonals = [
      this.getCell(cell.x - 1, cell.y - 2),
      this.getCell(cell.x + 1, cell.y - 2),
      this.getCell(cell.x - 1, cell.y + 2),
      this.getCell(cell.x + 1, cell.y + 2)
    ];
    let count = 0;
    for (let i = 0; i < cellsInDiagonals.length; i++) {
      if (Utils.isSameColor(cell, cellsInDiagonals[i])) {
        count++;
      }
    }
    return count;
  }

  getSameCellsInColumn(cell) {
    let count = 0;
    let currentCell = this.getCell(cell.x, cell.y + 1);
    while (!currentCell.isEmpty()) {
      if (Utils.isSameColor(cell, currentCell)) {
        count++;
      }
      currentCell = this.getCell(currentCell.x, currentCell.y + 1);
    }
    return count;
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
    this.setCellValue(this.getCell(column, topCell.y - 1), value);
    return new Cell(column, topCell.y - 1, value);
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

  isEqual(grid) {
    let result = true;
    this.rows.forEach((row, y) => row.forEach((value, x) => {
      result = result ? grid.rows[y][x] === value : false;
    }));
    return result;
  }

  printErr() {
    this.rows.forEach((row) => printErr(row.map((cell) => cell)));
  }
}
