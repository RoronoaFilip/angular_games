import { Piece, PieceByDirection } from './piece';

export type Z = Piece;

/**
 *     *
 *   * *
 *   *
 */
export const UP_Z: Z = {
  coordinates: [
    { x: 6, y: 1 },
    { x: 6, y: 2 },
    { x: 5, y: 2 },
    { x: 5, y: 3 },
  ],
  color: 'red',
  name: 'Z',
  nextRotation: 'RIGHT',
};

/**
 *   * *
 *     * *
 */
export const RIGHT_Z: Z = {
  coordinates: [
    { x: 4, y: 1 },
    { x: 5, y: 1 },
    { x: 5, y: 2 },
    { x: 6, y: 2 },
  ],
  color: 'red',
  name: 'Z',
  nextRotation: 'UP',
};

export const Z_PIECES: PieceByDirection = {
  UP: UP_Z,
  RIGHT: RIGHT_Z,
};
