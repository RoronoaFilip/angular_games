import { Square, SQUARE_PIECES } from './Square';
import { L, L_PIECES } from './L';
import { Z_PIECES } from './Z';

export type Piece = L | Square;

export type PieceWithDirection = {
  UP: Piece;
  RIGHT: Piece;
  DOWN: Piece;
  LEFT: Piece;
};

export const PIECES = {
  L: L_PIECES,
  SQUARE: SQUARE_PIECES,
  Z: Z_PIECES,
};
