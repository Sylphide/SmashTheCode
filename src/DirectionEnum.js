export const Directions = {
  DOWN: 0,
  LEFT: 1,
  UP: 2,
  RIGHT: 3
};

export function getOppositeDirection(direction) {
  switch (direction) {
    case Directions.UP:
      return Directions.DOWN;
    case Directions.DOWN:
      return Directions.UP;
    case Directions.RIGHT:
      return Directions.LEFT;
    case Directions.LEFT:
    default:
      return Directions.RIGHT;
  }
}
