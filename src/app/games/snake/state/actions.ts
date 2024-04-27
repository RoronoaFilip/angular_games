import { createAction, props } from '@ngrx/store';
import { Direction } from '../models/direction';
import { BoardSize } from '../models/BoardSize';

export const pause = createAction(
  '[Snake Game] Pause'
);

export const gameOver = createAction(
  '[Snake Game] Game Over'
);

export const changeDirection = createAction(
  '[Snake Game] Change Direction',
  props<{ direction: Direction | null }>()
);

export const setBoardSize = createAction(
  '[Snake Game] Set Board Size',
  props<{ boardSize: BoardSize }>()
);

export const increaseSnakeSpeed = createAction(
  '[Snake Game] Increase Snake Speed'
);

export const setSnakeSpeed = createAction(
  '[Snake Game] Set Snake Speed',
  props<{ snakeSpeed: number }>()
);
