import { Piece, PieceByDirection } from './piece';

export type S = Piece;

/**
 *   *
 *   * *
 *     *
 */
export const UP_S: S = {
  coordinates: [
    { x: 5, y: 1 },
    { x: 6, y: 2 },
    { x: 5, y: 2 },
    { x: 6, y: 3 },
  ],
  color: 'lime',
  name: 'S',
  nextRotation: 'RIGHT',
};

/**
 *     * *
 *   * *
 */
export const RIGHT_S: S = {
  coordinates: [
    { x: 6, y: 1 },
    { x: 5, y: 1 },
    { x: 5, y: 2 },
    { x: 4, y: 2 },
  ],
  color: 'lime',
  name: 'S',
  nextRotation: 'UP',
};

export const S_PIECES: PieceByDirection = {
  UP: UP_S,
  RIGHT: RIGHT_S,
};
