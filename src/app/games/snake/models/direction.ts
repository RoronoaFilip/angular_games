export type Direction = {
  x: number;
  y: number;
};

export const DIRECTIONS: { [key: string]: Direction } = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};
