import { O_PIECES } from './O';
import { Z_PIECES } from './Z';
import { Position } from '../../shared/models/position';
import { J_PIECES } from './J';
import { I_PIECES } from './I';
import { L_PIECES } from './L';
import { S_PIECES } from './S';
import { T_PIECES } from './T';

export interface Piece {
  coordinates: Position[];
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
  J: J_PIECES,
  L: L_PIECES,
  O: O_PIECES,
  Z: Z_PIECES,
  S: S_PIECES,
  I: I_PIECES,
  T: T_PIECES,
};
