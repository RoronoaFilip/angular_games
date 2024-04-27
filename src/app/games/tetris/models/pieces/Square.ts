import { Position } from '../position';

export type Square = Position[];

/**
 *    * *
 *    * *
 */
export const SQUARE: Square = [
  { x: 5, y: 1 },
  { x: 6, y: 1 },
  { x: 5, y: 2 },
  { x: 6, y: 2 },
];

export const SQUARE_PIECES = {
  UP: SQUARE,
  RIGHT: SQUARE,
  DOWN: SQUARE,
  LEFT: SQUARE,
};
