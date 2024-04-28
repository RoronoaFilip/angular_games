import { Piece, PieceByDirection } from './piece';


export type Square = Piece;

/**
 *    * *
 *    * *
 */
export const SQUARE: Square = {
  coordinates: [
    { x: 5, y: 1 },
    { x: 6, y: 1 },
    { x: 5, y: 2 },
    { x: 6, y: 2 },
  ],
  color: 'yellow',
  name: 'Square',
  nextRotation: 'UP',
}

export const SQUARE_PIECES: PieceByDirection = {
  UP: SQUARE,
  RIGHT: SQUARE,
  DOWN: SQUARE,
  LEFT: SQUARE,
}
