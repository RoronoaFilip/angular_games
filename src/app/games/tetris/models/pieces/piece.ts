import { SQUARE_PIECES } from './Square';
import { Z_PIECES } from './Z';
import { Position } from '../../../shared/models/position';
import { L_PIECES } from './L';

export interface Piece {
  coordinates: Position[];
  startCoordinates?: Position[];
  color: string;
  name: string;
  nextRotation: string;
}

export type PieceByDirection = {
  [key: string]: Piece;
};
type PiecesByName = {
  [key: string]: PieceByDirection;
};

export const PIECES: PiecesByName = {
  L: L_PIECES,
  SQUARE: SQUARE_PIECES,
  Z: Z_PIECES,
};
