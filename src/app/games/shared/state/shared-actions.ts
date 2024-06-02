import { createAction, props } from '@ngrx/store';
import { BoardSize } from '../models/BoardSize';

export const pause = createAction(
  '[Shared] Pause'
);

export const gameOver = createAction(
  '[Shared] Game Over'
);

export const win = createAction(
  '[Shared] Win'
);

export const incrementScore = createAction(
  '[Shared] Set Score',
  props<{ incrementValue: number }>()
);

export const setBoardSize = createAction(
  '[Shared] Set Board Size',
  props<{ boardSize: BoardSize }>()
);


