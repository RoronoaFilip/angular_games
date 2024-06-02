import { BoardSize } from '../models/BoardSize';

export type SharedAppState = {
  boardSize: BoardSize;
  isPaused: boolean;
  isWin: boolean;
  isGameOver: boolean;
  score: number;
}
