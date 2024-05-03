import { Piece, PieceByDirection } from './piece';

export type J = Piece;

/**
 *     *
 *     *
 *   * *
 */
const UP_J: J = {
  coordinates: [
    { x: 6, y: 1 },
    { x: 6, y: 2 },
    { x: 6, y: 3 },
    { x: 5, y: 3 },
  ],
  color: 'blue',
  name: 'J',
  nextRotation: 'RIGHT',
}

/**
 *   *
 *   * * *
 */
const RIGHT_J: J = {
  coordinates: [
    { x: 5, y: 2 },
    { x: 6, y: 2 },
    { x: 7, y: 2 },
    { x: 5, y: 1 },
  ],
  color: 'blue',
  name: 'J',
  nextRotation: 'DOWN',
}

/**
 *   * *
 *   *
 *   *
 */
const DOWN_J: J = {
  coordinates: [
    { x: 5, y: 1 },
    { x: 5, y: 2 },
    { x: 5, y: 3 },
    { x: 6, y: 1 },
  ],
  color: 'blue',
  name: 'J',
  nextRotation: 'LEFT',
}

/**
 *   * * *
 *       *
 */
const LEFT_J: J = {
  coordinates: [
    { x: 5, y: 1 },
    { x: 6, y: 1 },
    { x: 7, y: 1 },
    { x: 7, y: 2 },
  ],
  color: 'blue',
  name: 'J',
  nextRotation: 'UP',
};

export const J_PIECES: PieceByDirection = {
  UP: UP_J,
  RIGHT: RIGHT_J,
  DOWN: DOWN_J,
  LEFT: LEFT_J,
};
