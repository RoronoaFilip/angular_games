import { Piece } from './piece';

export type I = Piece;


/**
 *  *
 *  *
 *  *
 *  *
 */
const UP_I: I = {
  coordinates: [
    { x: 6, y: 1 },
    { x: 6, y: 2 },
    { x: 6, y: 3 },
    { x: 6, y: 4 },
  ],
  color: 'cyan',
  name: 'I',
  nextRotation: 'RIGHT',
};

/**
 *   * * * *
 */
const RIGHT_I: I = {
  coordinates: [
    { x: 4, y: 1 },
    { x: 5, y: 1 },
    { x: 6, y: 1 },
    { x: 7, y: 1 },
  ],
  color: 'cyan',
  name: 'I',
  nextRotation: 'UP',
};

export const I_PIECES = {
  UP: UP_I,
  RIGHT: RIGHT_I,
}
