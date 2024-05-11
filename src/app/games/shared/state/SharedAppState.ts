import { BoardSize } from '../models/BoardSize';

export type SharedAppState = {
  boardSize: BoardSize;
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
}
