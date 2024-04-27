import { Direction } from '../models/direction';
import { BoardSize } from '../models/BoardSize';

export type SnakeGameState = {
  isPaused: boolean;
  isGameOver: boolean;
  direction: Direction | null;
  boardSize: BoardSize;
  snakeSpeed: number;
}
