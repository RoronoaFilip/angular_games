import { Piece } from '../models/piece';

export type TetrisGameState = {
  currentPiece: Piece | null;
  nextPiece: Piece | null;
  passedPieces: Piece[];
}
