import { Piece, PieceByDirection } from './piece';

export type L = Piece;

/**
 *   *
 *   *
 *   * *
 */
const UP_L: L = {
  coordinates: [
    { x: 5, y: 1 },
    { x: 5, y: 2 },
    { x: 5, y: 3 },
    { x: 6, y: 3 },
  ],
  color: 'orange',
  name: 'L',
  nextRotation: 'RIGHT',
}

/**
 *   * * *
 *   *
 */
const RIGHT_L: L = {
  coordinates: [
    { x: 5, y: 2 },
    { x: 5, y: 1 },
    { x: 6, y: 1 },
    { x: 7, y: 1 },
  ],
  color: 'orange',
  name: 'L',
  nextRotation: 'DOWN',
}

/**
 *   * *
 *     *
 *     *
 */
const DOWN_L: L = {
  coordinates: [
    { x: 5, y: 1 },
    { x: 6, y: 1 },
    { x: 6, y: 2 },
    { x: 6, y: 3 },
  ],
  color: 'orange',
  name: 'L',
  nextRotation: 'LEFT',

}

/**
 *       *
 *   * * *
 */
const LEFT_L: L = {
  coordinates: [
    { x: 5, y: 2 },
    { x: 6, y: 2 },
    { x: 7, y: 2 },
    { x: 7, y: 1 },
  ],
  color: 'orange',
  name: 'L',
  nextRotation: 'UP',
}

export const L_PIECES: PieceByDirection = {
  UP: UP_L,
  RIGHT: RIGHT_L,
  DOWN: DOWN_L,
  LEFT: LEFT_L,
};
