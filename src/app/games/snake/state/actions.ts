import { createAction, props } from '@ngrx/store';
import { Direction } from '../models/direction';

export const changeDirection = createAction(
  '[Snake Game] Change Direction',
  props<{ direction: Direction | null }>()
);

export const increaseSnakeSpeed = createAction(
  '[Snake Game] Increase Snake Speed'
);

export const setSnakeSpeed = createAction(
  '[Snake Game] Set Snake Speed',
  props<{ snakeSpeed: number }>()
);
