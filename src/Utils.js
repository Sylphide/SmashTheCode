function addColor(colorList, color) {
  if (colorList.indexOf(color) === -1) {
    colorList.push(color);
  }
}

function isSameColor(cell1, cell2) {
  return parseInt(cell1.value) !== 0 && parseInt(cell1.value) === parseInt(cell2.value);
}

function isBothSkull(cell1, cell2) {
  return parseInt(cell1.value) === 0 && parseInt(cell1.value) === parseInt(cell2.value);
}

function isEqual(cell1, cell2) {
  return cell1.x === cell2.x && cell1.y === cell2.y;
}

function isCellInList(cell, cellsList) {
  let cellFound = false;
  cellsList.forEach((currentCell) => {
    if (isEqual(cell, currentCell)) {
      cellFound = true;
    }
  });
  return cellFound;
}

function computeGroupBonus(nbCells) {
  if (nbCells < 11) {
    return nbCells - 4;
  }
  return 8;
}

function computeColorBonus(nbColors) {
  if (nbColors > 1) {
    return Math.pow(2, nbColors - 1);
  }
  return 0;
}

function computeScore(nbBlocks, chainPower, colorBonus, groupBonus, skullCleared) {
  let scoreMultiplier = colorBonus + (chainPower + 2) + groupBonus;
  scoreMultiplier = Math.max(scoreMultiplier, 1);
  scoreMultiplier = Math.min(scoreMultiplier, 999);
  return ((nbBlocks + skullCleared) * 10) * scoreMultiplier;
}

function sortCells(cellsList) {
  cellsList.sort((cell1, cell2) => {
    if (cell1.y < cell2.y) {
      return -1;
    }
    return 1;
  });
}

function sortCellsList(cellsList) {
  cellsList.sort((cellsList1, cellsList2) => {
    sortCells(cellsList1);
    sortCells(cellsList2);
    if (cellsList2.length === 0 || cellsList1[0].y < cellsList2[0].y) {
      return -1;
    }
    return 1;
  });
}

export const Utils = {
  addColor,
  isSameColor,
  isBothSkull,
  isEqual,
  sortCells,
  sortCellsList,
  isCellInList,
  computeGroupBonus,
  computeColorBonus,
  computeScore
};
