import { Piece, PieceByDirection } from './piece';

export type T = Piece;

/**
 *    *
 *  * * *
 */
const UP_T: T = {
  coordinates: [
    { x: 5, y: 2 },
    { x: 6, y: 2 },
    { x: 7, y: 2 },
    { x: 6, y: 1 },
  ],
  color: 'purple',
  name: 'T',
  nextRotation: 'RIGHT',
};

/**
 *    *
 *    * *
 *    *
 */
const RIGHT_T: T = {
  coordinates: [
    { x: 5, y: 1 },
    { x: 5, y: 2 },
    { x: 5, y: 3 },
    { x: 6, y: 2 },
  ],
  color: 'purple',
  name: 'T',
  nextRotation: 'DOWN',
};

/**
 *  * * *
 *    *
 */
const DOWN_T: T = {
  coordinates: [
    { x: 5, y: 1 },
    { x: 6, y: 1 },
    { x: 7, y: 1 },
    { x: 6, y: 2 },
  ],
  color: 'purple',
  name: 'T',
  nextRotation: 'LEFT',
};

/**
 *    *
 *  * *
 *    *
 */
const LEFT_T: T = {
  coordinates: [
    { x: 6, y: 1 },
    { x: 6, y: 2 },
    { x: 6, y: 3 },
    { x: 5, y: 2 },
  ],
  color: 'purple',
  name: 'T',
  nextRotation: 'UP',
};

export const T_PIECES: PieceByDirection = {
  UP: UP_T,
  RIGHT: RIGHT_T,
  DOWN: DOWN_T,
  LEFT: LEFT_T,
}
