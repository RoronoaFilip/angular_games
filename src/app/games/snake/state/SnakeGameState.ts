import { Direction } from '../models/direction';

export type SnakeGameState = {
  direction: Direction | null;
  snakeSpeed: number;
}
