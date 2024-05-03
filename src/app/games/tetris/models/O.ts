import { Piece, PieceByDirection } from './piece';


export type O = Piece;

/**
 *    * *
 *    * *
 */
export const O: O = {
  coordinates: [
    { x: 5, y: 1 },
    { x: 6, y: 1 },
    { x: 5, y: 2 },
    { x: 6, y: 2 },
  ],
  color: 'yellow',
  name: 'O',
  nextRotation: 'UP',
}

export const O_PIECES: PieceByDirection = {
  UP: O,
  RIGHT: O,
  DOWN: O,
  LEFT: O,
}
