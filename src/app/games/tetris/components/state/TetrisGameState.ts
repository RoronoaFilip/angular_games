import { Piece } from '../../models/pieces/piece';

export type TetrisGameState = {
  currentPiece: Piece | null;
  nextPiece: Piece | null;
}
